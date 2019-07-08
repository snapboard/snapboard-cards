import { createClient } from '@typeform/api-client'

export default async ({ auths, inputs }) => {
    const typeformAPI = createClient({
        token: auths.typeform.accessToken,
    })
    return getTotalCount(typeformAPI, inputs.formId)
}

async function getTotalCount (typeformAPI, formId, counter = 0, after = null) {
    const res = await typeformAPI.responses.list({ uid: formId, after, page_size: 1000 })
    if (res.total_items === 1000) {
        return getTotalCount(typeformAPI, formId, counter + 1000, res.items[1000].token)
    }
    return counter + res.total_items
}