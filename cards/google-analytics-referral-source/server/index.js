import { google } from 'googleapis'
import moment from 'moment'

const OAuth2 = google.auth.OAuth2

export default async ({ auths, inputs }) => {
	if (!inputs || !inputs.viewId) return null
	const { accessToken, refreshToken } = auths.googleanalytics
	const oauth2Client = new OAuth2()
	oauth2Client.setCredentials({
		access_token: accessToken,
	})

	const analyticsreporting = google.analyticsreporting({
		version: 'v4',
		auth: oauth2Client,
	})

	const now = moment()

	const resp = await analyticsreporting.reports.batchGet({
		auth: oauth2Client,
		resource: {
			"reportRequests":[{
				"viewId": inputs.viewId,
				"dateRanges":[
				{
					"startDate": getStart(inputs.period),
					"endDate": now.format("YYYY-MM-DD")
				}],
				"metrics":[
				{
					"expression": getMetric(inputs.metric)
				}],
				"dimensions": [
				{
					"name":"ga:medium"
				}]
			}]
		}
	})

	return resp.data.reports[0].data.rows.map(({ dimensions, metrics }) => ({
		label: dimensions[0],
		value: parseInt(metrics[0].values[0], 10),
	})).sort((a, b) => b.value - a.value).slice(0, 5)
}

function getMetric (metric) {
	switch (metric) {
		case "Users": return "ga:users"
		case "Sessions": return "ga:sessions"
		case "New Users": return "ga:newUsers"
		default: return "ga:users"
	}
}

function getStart (period) {
	const now = moment()
	switch (period) {
		case "Today": return now.format("YYYY-MM-DD")
		case "Week": return now.startOf('week').format("YYYY-MM-DD")
		case "Month": return now.startOf('month').format("YYYY-MM-DD")
		case "Year": return now.startOf('year').format("YYYY-MM-DD")
		case "Last 7 Days": return now.subtract(7, 'days').format("YYYY-MM-DD")
		case "Last 28 Days": return now.subtract(28, 'days').format("YYYY-MM-DD")
		case "Last 90 Days": return now.subtract(90, 'days').format("YYYY-MM-DD")
		default: return now.startOf('year').format("YYYY-MM-DD")
	}
}