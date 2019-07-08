import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

export default async ({ auths, inputs }) => {
	// Get auth object
	const { accessToken, refreshToken } = auths.googleanalytics
	const oauth2Client = new OAuth2(
		// process.env.GOOGLE_ID,
		// process.env.GOOGLE_SECRET,
	)
	oauth2Client.setCredentials({
		access_token: accessToken,
		// refresh_token: refreshToken,
	})

	const analyticsreporting = google.analyticsreporting({
		version: 'v4',
		auth: oauth2Client,
	})

	const resp = await analyticsreporting.reports.batchGet({
		auth: oauth2Client,
		resource: {
			"reportRequests":[{
				"viewId": inputs.viewId,
				"dateRanges":[
				{
					"startDate":"2015-06-15",
					"endDate":"2019-06-30"
				}],
				"metrics":[
				{
					"expression":"ga:sessions"
				}],
				"dimensions": [
				{
					"name":"ga:browser"
				}]
			}]
		}
	})

	return resp.data.reports[0].data.rows.map(({ dimensions, metrics }) => ({
		label: dimensions[0],
		value: parseInt(metrics[0].values[0], 10),
	})).sort((a, b) => b.value - a.value).slice(0, 5)
}