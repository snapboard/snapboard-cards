#!/usr/bin/env node
const path = require('path')
const admin = require('firebase-admin')
const fs = require('fs-extra')
const yaml = require('js-yaml')
const isEqual = require('lodash/isEqual')
const map = require('lodash/map')
const reduce = require('lodash/reduce')
const axios = require('axios')
const jwt = require('jsonwebtoken')

require('dotenv').config()

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://snapreport.firebaseio.com',
})

const db = admin.firestore()
const dirPath = path.resolve(__dirname, '../cards')

async function deploy (versionBump) {
  const dirList = await fs.readdir(dirPath)
  const promises = map(dirList, async (dir) => {
    if (dir.startsWith('.')) return null
    await deployCard(dir, versionBump)
  })

  await Promise.all(promises)

  console.log('All changes deployed')
  // Only deploy changes - unless deploy all flag
}

async function deployCard (id, versionBump) {
  const currData = await getCardData(id)
  const card = await db.collection('cards').doc(id).get()
  const cardData = card.data()
  if (card && cardData) {
    const latestVersion = cardData.latest && cardData.latest.version
    const latestVersionData = (latestVersion && await db.collection('cards').doc(id).collection('versions').doc(latestVersion).get()) || {}
    const { changes, versionBump, ...latestVersionMatch } = (latestVersionData && latestVersionData.data()) || {}

    // Don't deploy if no changes!
    if (isEqual(latestVersionMatch, currData)) {
      console.log(`Skipping... ${id}`)
      return null
    }
  }

  console.log(`Deploying... ${id}`)

  // Update draft
  await db.collection('cards').doc(id).set({ admin: true, public: true }, { merge: true })
  await db.collection('cards').doc(id).collection('versions').doc('draft').set(currData)

  await  axios.post(`https://us-central1-snapreport.cloudfunctions.net/publishAdmin?token=${getToken()}`, {
    cardId: id,
    versionBump,
    changes: 'Auto deployment',
  })

  console.log(`Done... ${id}`)
}

async function getCardData (id) {
  const cardPath = path.resolve(dirPath, id)
  const yamlData = await fs.readFile(path.resolve(cardPath, 'snapboard.yml'), 'utf8')
  const { title, desc = '', categories = [], inputs, providers = [] } = yaml.load(yamlData)

  // Get server data
  const serverCode = await fs.readFile(path.resolve(cardPath, './server/index.js'), 'utf8')
  const serverPkg = await fs.readJson(path.resolve(cardPath, './server/package.json'))
  const serverTestParams = require(path.resolve(cardPath, './server/testParams.js'))

  // Get component data
  const componentCode = await fs.readFile(path.resolve(cardPath, './component/Card.js'), 'utf8')
  const componentCss = await fs.readFile(path.resolve(cardPath, './component/styles.css'), 'utf8')
  const componentPkg = await fs.readJson(path.resolve(cardPath, './component/package.json'))
  const componentDemoParams = require(path.resolve(cardPath, './component/demoParams.js'))

  // Get the required data
  return {
    name: title,
    desc,
    inputs: {
      fields: map(inputs, ({ title, type }, key) => ({ key, prop: key, title, type }))
    },
    categories,
    server: {
      code: serverCode,
      dependencies: (serverPkg && serverPkg.dependencies) || {},
      testParams: JSON.stringify(serverTestParams || {}, null, 2),
      auths: reduce(providers, (obj, val) => {
        obj[val] = {}
        return obj
      }, {})
    },
    component: {
      code: componentCode,
      css: componentCss,
      dependencies: (componentPkg && componentPkg.dependencies) || {},
      demoParams: JSON.stringify(componentDemoParams || {}, null, 2),
    },
    safety: true,
    approved: false,
  }
}

function getToken () {
  return jwt.sign({ admin: true }, process.env.JWT_SECRET)
}

if (require.main === module) {
  const [versionBump = 'patch'] = process.argv.slice(2)
  deploy(versionBump)
}
