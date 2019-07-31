import { google } from 'googleapis'
import moment from 'moment'

const OAuth2 = google.auth.OAuth2

export default async ({ auths, inputs }) => {
	const { accessToken } = auths.googlecalendar
	const oauth2Client = new OAuth2()
	oauth2Client.setCredentials({
		access_token: accessToken,
	})

	const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

	const min = moment().startOf('day')
	const max = moment().endOf('day')

	console.log(min, max)

	const res = await calendar.events.list({
		calendarId: 'primary',
		timeMin: min.toISOString(),
		timeMax: max.toISOString(),
		maxResults: 100,
		// singleEvents: true,
		// orderBy: 'startTime',
	})

	return res.data.items
}