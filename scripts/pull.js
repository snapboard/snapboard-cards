#!/usr/bin/env node
const path = require('path')
const admin = require('firebase-admin')
const fs = require('fs-extra')
const yaml = require('js-yaml')
const simpleGit = require('simple-git/promise')
const map = require('lodash/map')


require('dotenv').config()

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://snapreport.firebaseio.com',
})

const db = admin.firestore()
const git = simpleGit(path.resolve(__dirname, '../'))
const dirPath = path.resolve(__dirname, '../cards')

async function pull () {
  const status = await git.status()
  if (status.files.length) {
    console.error('Working branch must be clean before pull')
    process.exit(1)
  }
  // await fs.emptyDir(dirPath)

  const cardsCollection = await db.collection('cards')
    .where('workspaceId', '==', 'admin')
    .where('active', '==', true)
    .where('providerId', '==', 'snapboard')
    .get()
  const cards = toArray(cardsCollection)

  const promises = map(cards, pullCard)

  await Promise.all(promises)

  console.log('Pull complete')
}

async function pullCard (card) {
  const cardId = card.id
  const cardDraft = await db.collection('cards').doc(cardId).collection('versions').doc('draft').get()
  const { component = {}, server = {}, ...cardDetail } = cardDraft.data()

  const name = `${cardDetail.name.toLowerCase().replace(/[()]/g, '').replace(/(\s+-\s+|\s+|\/)/g, '-')}`
  const cardDir = path.resolve(dirPath, name)
  const yamlData = await fs.readFile(path.resolve(cardDir, 'snapboard.yml'), 'utf8').catch(() => null)
  const currData = yamlData && yaml.load(yamlData)

  if (currData && cardDetail.lastSave === currData.lastSave) {
    console.log('Skipping... ', `${cardDetail.name} - ${cardId}`)
    return null
  }

  console.log('Pulling... ', `${cardDetail.name} - ${cardId}`)

  // Generate YAML
  fs.outputFileSync(
    path.resolve(cardDir, 'snapboard.yml'),
    yaml.safeDump({
      id: cardId,
      version: card.data().version || '0.0.0',
      auths: server.auths || {}, 
      ...cardDetail
    })
  )

  if (cardDetail.hasData) await generateServer(name, server, card.data().version, cardDir)
  await generateComponent(name, component, card.data().version, cardDir)

  return true
}

async function generateServer (name, server, version = '0.0.0', cardDir) {
  // Generate server code
  const { dependencies, code, testParams } = server
  fs.outputJSONSync(
    path.resolve(cardDir, 'server/package.json'),
    { 
      name: `@snapboard/server-${name}`, 
      version,  
      dependencies,
    },
  )
  fs.outputFileSync(
    path.resolve(cardDir, 'server/index.js'),
    code || '',
  )

  fs.outputFileSync(
    path.resolve(cardDir, 'server/testParams.json'),
    testParams || {},
  )
}

async function generateComponent (name, comp, version = '0.0.0', cardDir) {
  const { dependencies, code, css, demoParams } = comp
  fs.outputJSONSync(
    path.resolve(cardDir, 'component/package.json'),
    { 
      name: `@snapboard/component-${name}`, 
      version,  
      dependencies,
    },
    { spaces: 2 },
  )

  fs.outputFileSync(
    path.resolve(cardDir, 'component/Card.js'),
    code || '',
  )

  fs.outputFileSync(
    path.resolve(cardDir, 'component/styles.css'),
    css || '',
  )

  fs.outputFileSync(
    path.resolve(cardDir, 'component/demoParams.json'),
    demoParams || {},
  )
}

if (require.main === module) {
  // const [versionBump = 'patch'] = process.argv.slice(2)
  pull()
}

function toArray (col) {
  if (!col) return []
  const arr = []
  col.forEach(record => {
    arr.push(record)
  })
  return arr
}
