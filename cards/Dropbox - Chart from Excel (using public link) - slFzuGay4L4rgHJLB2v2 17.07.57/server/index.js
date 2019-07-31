import fetch from 'node-fetch'
import { Dropbox } from 'dropbox'
import excelToJson from 'convert-excel-to-json'

export default async ({ auths, inputs }) => {
	const dbx = new Dropbox({ accessToken: auths.dropbox.accessToken, fetch })
	const data = await dbx.sharingGetSharedLinkFile({ url: inputs.sharedLinkFile })

	return convertData(inputs.range, data.fileBinary, inputs.invert)
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
