#!/usr/bin/env node
const path = require('path')
const admin = require('firebase-admin')
const fs = require('fs-extra')
const yaml = require('js-yaml')
const simpleGit = require('simple-git/promise')
// const isEqual = require('lodash/isEqual')
const map = require('lodash/map')
// const reduce = require('lodash/reduce')
// const axios = require('axios')
// const jwt = require('jsonwebtoken')
// const envfile = require('envfile')

require('dotenv').config()

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://snapreport.firebaseio.com',
})

const db = admin.firestore()
const git = simpleGit(path.resolve(__dirname, '../'))
const dirPath = path.resolve(__dirname, '../cards')

async function pull () {
  // const status = await git.status()
  // if (status.files.length) {
  //   console.error('Working branch must be clean before pull')
  //   process.exit(1)
  // }
  // await fs.emptyDir(dirPath)

  const cardsCollection = await db.collection('cards')
    .where('workspaceId', '==', 'admin')
    .where('active', '==', true)
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

  const dir = `${cardDetail.name.toLowerCase().replace(/[()]/g, '').replace(/(\s+-\s+|\s+)/g, '-')}`
  const cardDir = path.resolve(dirPath, dir)
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
      auths: server.auths || {}, 
      ...cardDetail
    })
  )

  await generateServer(server, cardId, cardDetail.version, cardDir)
  await generateComponent(component, cardId, cardDetail.version, cardDir)

  return true
}

async function generateServer (server, cardId, version = '0.0.0', cardDir) {
  // Generate server code
  const { dependencies, code, testParams } = server
  fs.outputJSONSync(
    path.resolve(cardDir, 'server/package.json'),
    { 
      name: `server-${cardId}`, 
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

async function generateComponent (server, cardId, version = '0.0.0', cardDir) {
  const { dependencies, code, css, demoParams } = server
  fs.outputJSONSync(
    path.resolve(cardDir, 'component/package.json'),
    { 
      name: `component-${cardId}`, 
      version,  
      dependencies,
    },
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
