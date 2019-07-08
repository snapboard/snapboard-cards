import fetch from 'node-fetch'
import { Dropbox } from 'dropbox'
import Excel from 'exceljs/modern.nodejs'

export default async ({ auths, inputs }) => {
    const dbx = new Dropbox({ accessToken: auths.dropbox.accessToken, fetch })
    const data = await dbx.sharingGetSharedLinkFile({ url: inputs.sharedLinkFile })

    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(data.fileBinary)

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
}