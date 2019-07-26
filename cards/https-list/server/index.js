import axios from 'axios'
import get from 'lodash/get'
import isArray from 'lodash/isArray'

export default async ({ inputs = {} }) => {
  const { 
    url, method = 'GET', path,  
    titleProp, descProp, linkProp
  } = inputs

  const res = await axios.request({
    url,
    method,
  })
  const array = path ? get(res.data, path) : res.data

  if (array && !isArray(array)) {
    throw new Error(`Response is not an array - received ${getType(array)}`)
  }

  return array.map((item) => ({
    title: titleProp ? get(item, titleProp) : get(item, 'title') || get(item, 'name'),
    desc: descProp ? get(item, descProp) : '',
    link: linkProp && get(item, linkProp),
  }))
}

function getType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}