import axios from 'axios'

export default async ({ auths, inputs }) => {
    const { profile, accessToken } = auths.mailchimp
    const baseURL = `${profile.api_endpoint}/3.0`

    const res = await axios.get(`lists/${inputs.listId}`, {
        baseURL: `${profile.api_endpoint}/3.0`,
        headers: {
            Authorization: `OAuth ${accessToken}`
        },
    })

    const { name, stats } = res.data
    return { name, stats }
}