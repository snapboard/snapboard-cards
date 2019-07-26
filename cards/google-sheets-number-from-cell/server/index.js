import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

export default async ({ auths, inputs }) => {
	const { accessToken } = auths.googlesheets
	const oauth2Client = new OAuth2()
	oauth2Client.setCredentials({
		access_token: accessToken,
	})

	const { spreadsheetId, range, labelRange } = inputs || {}
	const sheets = google.sheets({version: 'v4', auth: oauth2Client });
	const resVal = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range,
	})
	const labelVal = labelRange && await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: labelRange,
	})

	return {
		value: resVal.data.values[0][0],
		label: labelVal && labelVal.data.values[0][0]
	}
}