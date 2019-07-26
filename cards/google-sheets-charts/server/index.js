import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

export default async ({ auths, inputs }) => {
	const { accessToken } = auths.googlesheets
	const oauth2Client = new OAuth2()
	oauth2Client.setCredentials({
		access_token: accessToken,
	})

	const { spreadsheetId, range, invert: shouldInvert } = inputs || {}
	const sheets = google.sheets({version: 'v4', auth: oauth2Client });
	const resVal = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range,
	})

	const rows = resVal.data.values
	const titleRow = rows[0].slice(1)

	const titleCol = []
	const data = []
	rows.slice(1).forEach((row) => {
		titleCol.push(row[0])
		data.push(row.slice(1))
	})

	if (shouldInvert) {
		const inverted = invert(data)
		return {
			labels: titleCol,
			datasets: titleRow.map((label, i) => ({
				label,
				data: inverted[i] 
			}))
		}
	}

	return {
		labels: titleRow,
		datasets: titleCol.map((label, i) => ({
			label,
			data: data[i] 
		}))
	}
}

function invert (data) {
	return data[0].map((_, i) => {
		return data.map((_, y) => {
			return data[y][i]
		})
	})
}