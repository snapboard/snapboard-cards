import { google } from 'googleapis'
import moment from 'moment'

const OAuth2 = google.auth.OAuth2

export default async ({ auths, inputs }) => {
	// Get auth object
	const { accessToken } = auths.googlemail
	const oauth2Client = new OAuth2()
	oauth2Client.setCredentials({
		access_token: accessToken,
	})

	const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

	async function getMessages (minDate = Date.now(), token) {
		const res = await gmail.users.messages.list({
			userId: 'me',
			pageToken: token
		})
		const messageList = res.data.messages
		const messagesDetail = await Promise.all(messageList.map(async ({ id }) => {
			const res = await gmail.users.messages.get({
				userId: 'me',
				id,
				format: "metadata",
			})
			return res.data
		}))

		const messages = messagesDetail
			.map(({ internalDate }) => parseInt(internalDate, 10))

		const lastMessage = messages[messages.length - 1]
		if (lastMessage && lastMessage > minDate) {
			const next = await getMessages(minDate, res.data.nextPageToken)
			return messages.concat(next)
		}
		return messages
	}

	const minDate = moment().subtract(80, "days")
	const events = await getMessages(minDate.valueOf())
	
	const dates = {}
	events.forEach(( timestamp ) => {
		const date = moment(timestamp).format('YYYY-MM-DD')
		if (!dates[date]) dates[date] = 1
		else dates[date] += 1
	})

	const formatted = Object.keys(dates).map((date) => ({
		date,
		count: dates[date]
	}))

	return {
		dates: formatted,
		startDate: minDate.toISOString(),
		endDate: moment().toISOString()
	}
}