const axios = require('axios')
const moment = require('moment')
const { google } = require('googleapis')

async function backup () {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/datastore']
  })

  const projectId = await google.auth.getProjectId()
  const accessTokenResponse = await auth.getAccessToken()
  const accessToken = accessTokenResponse.token
  const url = `https://firestore.googleapis.com/v1beta1/projects/${projectId}/databases/(default):exportDocuments`

  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + accessToken
  }

  const timestamp = moment().format('YYYY-MM-DD-HH-MM-ss')
  const body = {
    outputUriPrefix: `gs://snapreport.appspot.com/backups/${timestamp}`
  }
  const response = await axios.post(url, body, { headers })
  return response
}

backup()
  .then(console.log)