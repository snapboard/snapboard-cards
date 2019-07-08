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
  const status = await git.status()
  if (status.files.length) {
    console.error('Working branch must be clean before pull')
    process.exit(1)
  }

  const cardsCollection = await db.collection('cards').where('workspaceId', '==', 'admin').get()
  const cards = toArray(cardsCollection)

  const promises = map(cards, pullCard)

  await Promise.all(promises)

  console.log('Pull complete')
}

async function pullCard (card) {
  const cardId = card.id
  const cardDraft = await db.collection('cards').doc(cardId).collection('versions').doc('draft').get()
  const { component = {}, server = {}, ...cardDetail } = cardDraft.data()

  const cardDir = path.resolve(dirPath, `${cardDetail.name} - ${cardId}`)
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

async function generateServer (server, cardId, version, cardDir) {
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

  fs.outputJSONSync(
    path.resolve(cardDir, 'server/testParams.json'),
    testParams || {},
  )
}

async function generateComponent (server, cardId, version, cardDir) {
  const { dependencies, code, css, demoParams } = server
  fs.outputJSONSync(
    path.resolve(cardDir, 'server/package.json'),
    { 
      name: `server-${cardId}`, 
      version,  
      dependencies,
    },
  )

  fs.outputFileSync(
    path.resolve(cardDir, 'component/index.js'),
    code || '',
  )

  fs.outputFileSync(
    path.resolve(cardDir, 'component/index.js'),
    css || '',
  )

  fs.outputJSONSync(
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
