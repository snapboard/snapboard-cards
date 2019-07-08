#!/usr/bin/env node
const path = require('path')
const admin = require('firebase-admin')
const fs = require('fs-extra')
const yaml = require('js-yaml')
const simpleGit = require('simple-git/promise')
// const isEqual = require('lodash/isEqual')
// const map = require('lodash/map')
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
  console.log(status)
}

if (require.main === module) {
  // const [versionBump = 'patch'] = process.argv.slice(2)
  pull()
}
