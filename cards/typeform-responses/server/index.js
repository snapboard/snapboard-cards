import { createClient } from '@typeform/api-client'

export default async ({ auths, inputs }) => {
    const typeformAPI = createClient({
        token: auths.typeform.accessToken,
    })
    return getTotalCount(typeformAPI, inputs.formId, !!inputs.submitOnly)
}

async function getTotalCount (typeformAPI, formId, submitOnly, counter = 0, after = null) {
    const res = await typeformAPI.responses.list({ uid: formId, after, page_size: 1000 })
    res.items.forEach((item) => {
      if (!submitOnly || item.submitted_at !== '0001-01-01T00:00:00Z') counter += 1
    })
    if (res.total_items === 1000) {
        return getTotalCount(typeformAPI, formId, counter, res.items[1000].token)
    }
    return counter
}