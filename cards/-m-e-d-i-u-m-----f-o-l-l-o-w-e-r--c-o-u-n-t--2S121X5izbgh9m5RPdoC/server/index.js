import { google } from 'googleapis'

const OAuth2 = google.auth.OAuth2

export default async ({ auths, inputs }) => {
	const { accessToken } = auths.youtube
	const oauth2Client = new OAuth2()
	oauth2Client.setCredentials({
		access_token: accessToken,
	})

	const youtube = google.youtube({
		version: 'v3',
		auth: oauth2Client,
	})

	const res = await youtube.channels.list({
    part: 'snippet,statistics',
		id: inputs.channelId,
  })
	return res.data.items[0]
}