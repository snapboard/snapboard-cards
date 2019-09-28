#!/usr/bin/env node
const path = require('path')
const admin = require('firebase-admin')
const firebase = require('firebase')
const fs = require('fs-extra')
const yaml = require('js-yaml')
const simpleGit = require('simple-git/promise')
const semver = require('semver')
const isEqual = require('lodash/isEqual')
const map = require('lodash/map')
const axios = require('axios')
const envfile = require('envfile')

if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env.production') })
} else {
  require('dotenv').config()
}

const { FIREBASE_API_KEY, PROJECT_ID, PUBLISH_URL, DEPLOY_USER_ID } = process.env

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: `https://${PROJECT_ID}.firebaseio.com`,
})

firebase.initializeApp({
  databaseURL: `https://${PROJECT_ID}.firebaseio.com`,
  apiKey: FIREBASE_API_KEY,
})

const git = simpleGit(path.resolve(__dirname, '../'))
const db = admin.firestore()
const dirPath = path.resolve(__dirname, '../cards')

async function deploy (versionBump) {
  const status = await git.status()
  if (status.files.length) {
    console.error('Working branch must be clean before deploy')
    process.exit(1)
  }

  const dirList = await fs.readdir(dirPath)
  const promises = map(dirList, async (dir) => {
    if (dir.startsWith('.')) return null
    await deployCard(dir, versionBump)
  })

  await Promise.all(promises)

  await git.add('.')
  await git.commit('Bump versions')

  console.log('All changes deployed')
  // Only deploy changes - unless deploy all flag
}

async function deployCard (dir, versionBump) {
  const { id, version, ...currData } = await getCardData(dir)
  const card = await db.collection('cards').doc(id).get()
  const cardData = card.data()
  if (card && cardData) {
    const latestVersion = cardData.latest && cardData.latest.version
    const latestVersionData = (latestVersion && await db.collection('cards').doc(id).collection('versions').doc('draft').get())
    const { changes, versionBump, ...latestVersionMatch } = (latestVersionData && latestVersionData.data()) || {}

    if (latestVersionMatch.lastSave > currData.lastSave) {
      console.log(`Conflict... ${id}`)
      return null
    }

    // Normalize JSON files
    if (latestVersionMatch.component) noramlizeJSON(latestVersionMatch.component, 'demoParams')
    if (currData.hasData) {
      if (latestVersionMatch.server) noramlizeJSON(latestVersionMatch.server, 'testParams')
      if (!latestVersionMatch.server.dependencies) latestVersionMatch.server.dependencies = {}
    }

    // Don't deploy if no changes!
    if (isEqual(latestVersionMatch, currData)) {
      console.log(`Skipping... ${id}`)
      return null
    }
  }

  console.log(`Deploying... ${id}`)

  // Get env vars
  const envVars = await fs.readFile(path.resolve(dirPath, id, './server/.env'), 'utf8').catch(() => null)
  const envObj = envVars && envfile.parseSync(envVars)

  // Update draft
  await db.collection('cards').doc(id).set({ admin: true, public: true, workspaceId: 'admin' }, { merge: true })
  await db.collection('cards').doc(id).collection('versions').doc('draft').set(currData)
  if (envObj) await db.collection('cards').doc(id).collection('private').doc('env').set(envObj)

  await publish({
    cardId: id,
    versionBump,
    changes: 'Auto deployment',
  })

  const newVersion = semver.inc(cardData.latest && cardData.latest.version || '0.0.1', versionBump)
  console.log(`Updating version... ${newVersion}`)

  const cardPath = path.resolve(dirPath, dir)
  await updateVersion(path.resolve(cardPath, './snapboard.yml'), newVersion, true)
  await updateVersion(path.resolve(cardPath, './component/package.json'), newVersion)
  await updateVersion(path.resolve(cardPath, './server/package.json'), newVersion)

  console.log(`Done... ${id}`)
}

async function getCardData (dir) {
  const cardPath = path.resolve(dirPath, dir)
  const yamlData = await fs.readFile(path.resolve(cardPath, 'snapboard.yml'), 'utf8')
  const { auths, version, ...config } = yaml.load(yamlData)

  // Get component data
  const componentCode = await fs.readFile(path.resolve(cardPath, './component/Card.js'), 'utf8')
  const componentCss = await fs.readFile(path.resolve(cardPath, './component/styles.css'), 'utf8')
  const componentPkg = await fs.readJson(path.resolve(cardPath, './component/package.json'))
  const componentDemoParams = require(path.resolve(cardPath, './component/demoParams.json'))

  const cardData = {
    ...config,
    component: {
      code: componentCode,
      css: componentCss,
      dependencies: (componentPkg && componentPkg.dependencies) || {},
      demoParams: JSON.stringify(componentDemoParams || {}, null, 2),
    },
  }

  if (config.hasData) {
    // Get server data
    const serverCode = await fs.readFile(path.resolve(cardPath, './server/index.js'), 'utf8')
    const serverPkg = await fs.readJson(path.resolve(cardPath, './server/package.json'))
    const serverTestParams = require(path.resolve(cardPath, './server/testParams.json'))

    cardData.server = {
      code: serverCode,
      dependencies: (serverPkg && serverPkg.dependencies) || {},
      testParams: JSON.stringify(serverTestParams || {}, null, 2),
      auths,
    }
  }

  // Get the required data
  return cardData
}

async function publish (data) {
  const customToken = await admin.auth().createCustomToken(DEPLOY_USER_ID)
  const cred = await firebase.auth().signInWithCustomToken(customToken)
  const idToken = await cred.user.getIdToken()
  return axios.post(PUBLISH_URL, data, { 
    headers: { 
      Authorization: `Bearer ${idToken}`
    }
  })
}

async function updateVersion (path, version, useYaml) {
  const str = await fs.readFile(path, 'utf8').catch(() => null)
  if (!str) return
  const obj = yaml.load(str)
  obj.version = version
  const out = useYaml ? yaml.safeDump(obj) : JSON.stringify(obj, null, 2)
  return fs.outputFileSync(path, out)
}

function noramlizeJSON (obj, prop) {
  return obj[prop] = JSON.stringify(JSON.parse(obj[prop]), null, 2)
}

if (require.main === module) {
  const [versionBump = 'patch'] = process.argv.slice(2)
  deploy(versionBump).catch(console.error)
}
