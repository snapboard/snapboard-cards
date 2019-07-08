import { google } from 'googleapis'
import Excel from 'exceljs/modern.nodejs'

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

	const workbook = new Excel.Workbook();
    await workbook.xlsx.load(res.data)

    const worksheet = workbook.getWorksheet(1)
    const labels = worksheet.getRow(1).values.slice(2)
    const datasets = []

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return
        const cells = row.values
        datasets.push({
            label: cells[1],
            data: cells.slice(2),
        })
    })

    return {
        labels,
        datasets
    }

	return res.data
}