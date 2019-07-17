import { google } from 'googleapis'
import excelToJson from 'convert-excel-to-json'

const OAuth2 = google.auth.OAuth2

export default async ({ auths, inputs }) => {
	// Get auth object
	const { accessToken, refreshToken } = auths.googledrive
	const oauth2Client = new OAuth2()
	oauth2Client.setCredentials({
		access_token: accessToken,
	})

	const drive = google.drive({
		version: 'v3',
		auth: oauth2Client,
	})

	const fileId = inputs.fileId
	const res = await drive.files.get(
    {fileId, alt: 'media'},
    {responseType: 'arraybuffer'}
  )
    
	return convertData(inputs.range, toBuffer(res.data), inputs.invert)
}

function toBuffer(ab) {
  var buf = Buffer.alloc(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
  }
  return buf;
}

function convertData (range = '', source, shouldInvert) {
	const split = range.split('!')
	const sheets = split.length > 1 ? [split[0]] : undefined
	const cellRange = split.pop()

	const result = excelToJson({
    source,
    range: cellRange,
    sheets,
	})

	const sheetData = result[Object.keys(result)[0]]

	const titleRow = Object.keys(sheetData[0]).map((key) => {
		return sheetData[0][key]
	})

	const titleCol = []
	const data = []
	sheetData.slice(1).forEach((row) => {
		const rowKeys = Object.keys(row)
		titleCol.push(row[rowKeys[0]])
		data.push(rowKeys.slice(1).map((key) => row[key]))
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
