import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

export default async ({ auths, inputs }) => {
	const { accessToken } = auths.firebase

	const oauth2Client = new OAuth2()
	oauth2Client.setCredentials({
		access_token: accessToken,
	})
	const firestore = google.firestore({ version: 'v1', auth: oauth2Client })
	return getNextRecords(firestore, inputs)
}

async function getNextRecords (firestore, inputs, counter = 0, token) {
	const res = await firestore.projects.databases.documents.get({
		name: `projects/${inputs.projectId}/databases/(default)/documents/${inputs.collection}`,
		pageSize: 1000,
		pageToken: token,
	})
	if (res.data.documents.length === 1000) {
		return getNextRecords(firestore, inputs, counter + 1000, res.data.nextPageToken)
	}
	return counter + res.data.documents ?  res.data.documents.length : 0 
}