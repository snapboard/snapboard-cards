import React from 'react'
import isObject from 'lodash/isObject'
import isNumber from 'lodash/isNumber'
import isArray from 'lodash/isArray'
import map from 'lodash/map'
import forEach from 'lodash/forEach'
import Chart from '@snapboard/ui/Chart'

function ChartCard ({ inputs }) {
  const { data, type, labels, invert } = inputs
  let normalized = normalizeDataInput(data, labels)
  if (invert) normalized = invertData(normalized)
  return (
    <Chart data={normalized} type={type || 'bar'} />
  )
}

export default ChartCard

function normalizeDataInput (data, labels) {
  if (isArray(data) && labels) return { labels, datasets: [{ label: 'Series 1', data }] }
  if (isObject(data) && data.labels && data.datasets) return data
  if (isObject(data) && isArray(firstObjectItem(data)) && labels) return objectArrayDataInput(data, labels)
  if (isObject(data) && isObject(firstObjectItem(data))) return objectObjectDataInput(data)
  // No understood format, so return an empty dataset
  return { labels: [], datasets: [] }
}

function objectObjectDataInput (data) {
  const labels = Object.keys(data)
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
  const labels = Object.keys(data)
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
  return obj[Object.keys(obj)[0]]
}

function invertData (data) {
  const { labels, datasets } = data
  return {
    labels: map(datasets, ({ label }) => label),
    datasets: labels.map((label, i) => ({
      label,
      data: map(datasets, ({ data }) => data[i]),
    })),
  }
}

// export const data = {
//   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//   datasets: [{
//     label: 'My First dataset',
//     data: [65, 59, 80, 81, 56, 55, 40],
//   }, {
//     label: 'My Second dataset',
//     data: [62, 81, 73, 64, 57, 60, 70],
//   }],
// }
