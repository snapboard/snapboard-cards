import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

export default async ({ auths, inputs }) => {
	// Get auth object
	const { accessToken } = auths.googlesheets
	const oauth2Client = new OAuth2()
	oauth2Client.setCredentials({
		access_token: accessToken,
	})

	const { spreadsheetId, range } = inputs || {}
	const sheets = google.sheets({version: 'v4', auth: oauth2Client });
	const res = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range,
	})

	return res.data.values
}