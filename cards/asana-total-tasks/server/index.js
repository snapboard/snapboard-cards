import asana from 'asana'

export default async ({ auths }) => {
	const client = asana.Client.create()
	client.useAccessToken(auths.asana.accessToken)
	const workspaces = await client.workspaces.findAll()
	return workspaces.data
}