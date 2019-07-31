import { google } from 'googleapis'
import moment from 'moment'

const OAuth2 = google.auth.OAuth2

export default async ({ auths, inputs }) => {
	// Get auth object
	const { accessToken } = auths.googlecalendar
	const oauth2Client = new OAuth2()
	oauth2Client.setCredentials({
		access_token: accessToken,
	})

	const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

	const min = inputs.startDate ? moment(inputs.startDate) : moment()
	const max = inputs.endDate ? moment(inputs.endDate) : min.add(100, 'days')

	const res = await calendar.events.list({
		calendarId: 'primary',
		timeMin: min.toISOString(),
		timeMax: max.toISOString(),
		maxResults: 100,
		singleEvents: true,
		orderBy: 'startTime',
	})
	const events = res.data.items || []

	const dates = {}
	events.forEach(({ start, end }) => {
		let startDate = moment(start.date || start.dateTime)
		const endDate = moment(end.date || end.dateTime)
		const days = Math.ceil(startDate.diff(endDate, 'days'))
		const range = (new Array(days.length)).fill(0)
		range.forEach(() => {
			const date = startDate.format('YYYY-MM-DD')
			if (!dates[date]) dates[date] = 1
			else dates[date] += 1
			startDate = startDate.add(1, 'days')
		})
	})

	const formatted = Object.keys(dates).map((date) => ({
		date,
		count: dates[date]
	}))

	return {
		dates: formatted,
		startDate: min.toISOString(),
		endDate: max.toISOString()
	}
}

// start: moment(start.date || start.dateTime).toISOString(),
// end: moment(end.date || start.dateTime).toISOString(),

// "startDate": "2016-01-01",
// "endDate": "2016-04-15",
//     "dates": [
//       { "date": "2016-01-02", "count": 1 },
//       { "date": "2016-01-03", "count": 1 },
//       { "date": "2016-01-04", "count": 1 },