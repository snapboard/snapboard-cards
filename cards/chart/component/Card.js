import React from 'react'
import isObject from 'lodash/isObject'
import isNumber from 'lodash/isNumber'
import isArray from 'lodash/isArray'
import map from 'lodash/map'
import keys from 'lodash/keys'
import forEach from 'lodash/forEach'
import Chart from '@snapboard/ui/Chart'

function ChartCard ({ inputs }) {
  const { data, type, labels, invert } = inputs || {}
  let normalized = normalizeDataInput(data, labels)
  if (!normalized) return null
  if (invert) normalized = invertData(normalized)
  return (
    <Chart data={normalized} type={type || 'bar'} />
  )
}

export default ChartCard

function normalizeDataInput (data, labels) {
  if (isArray(data)) {
    return {
      labels: labels && labels.length
        ? labels
        : map(data, (_, i) => `Label ${i + 1}`),
      datasets: [{ label: 'Series 1', data }],
    }
  }
  if (isObject(data) && data.labels && data.datasets) return data
  if (isObject(data) && isArray(firstObjectItem(data)) && labels) return objectArrayDataInput(data, labels)
  if (isObject(data) && isObject(firstObjectItem(data))) return objectObjectDataInput(data)
  // No understood format, so return an empty dataset
  return { labels: [], datasets: [] }
}

function objectObjectDataInput (data) {
  const labels = keys(data)
  const datasets = getAllDataSets(data)
  return {
    labels,
    datasets: map(datasets, key => ({
      label: key,
      data: map(data, obj => obj[key] || 0),
    })),
  }
}

function objectArrayDataInput (data, datasetLabels) {
  const labels = keys(data)
  return {
    labels,
    datasets: map(datasetLabels, (label, i) => ({
      label,
      data:  map(data, arr => arr[i] || 0),
    })),
  }
}

function getAllDataSets (data) {
  const cache = {}
  const datasets = []
  forEach(data, (val) => {
    forEach(val, (_, key) => {
      if (!cache[key] && isNumber(val[key])) {
        cache[key] = 1
        datasets.push(key)
      }
    })
  })
  return datasets
}

function firstObjectItem (obj) {
  if (!obj) return null
  return obj[keys(obj)[0]]
}

function invertData (data) {
  const { labels, datasets } = data || {}
  return {
    labels: map(datasets, ({ label }) => label),
    datasets: labels.map((label, i) => ({
      label,
      data: map(datasets, ({ data }) => data[i]),
    })),
  }
}
