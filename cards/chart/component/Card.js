import React from 'react'
import dayjs from 'dayjs'
import find from 'lodash/find'
import isObject from 'lodash/isObject'
import isNumber from 'lodash/isNumber'
import isArray from 'lodash/isArray'
import map from 'lodash/map'
import range from 'lodash/range'
import keys from 'lodash/keys'
import values from 'lodash/values'
import forEach from 'lodash/forEach'
import Chart from '@snapboard/ui/Chart'

const periodFormat = {
  minute: 'HH:MM',
  hour: 'DD HH:MM',
  day: 'DD-MM-YY',
  week: 'YYYY-MM-DD',
  month: 'MMM-YY',
  quater: 'MMM-YY',
  year: 'YYYY',
}

function ChartCard ({ inputs }) {
  const { data, type, labels, invert, xaxis, period } = inputs || {}
  let normalized = xaxis === 'date'
    ? normalizeDateInput(data, period)
    : normalizeDataInput(data, labels)
  if (!normalized) return null
  if (invert) normalized = invertData(normalized)
  // if (xaxis === 'date') normalized.labels = getDateLabels(period)
  const hideLegend = normalized.datasets.length === 1 &&
    normalized.datasets[0].label === 'Series 1'
  return (
    <Chart
      data={normalized}
      type={type || 'bar'}
      options={{ legend: { display: !hideLegend } }}
    />
  )
}

export default ChartCard

function getDateLabels ({ count, unit }) {
  return map(getDates({ count, unit }), date => formatDate(date, unit))
}

function getDates ({ count, unit }) {
  const now = new Date()
  return map(range(count), (i) => {
    return dayjs(now).startOf(unit).subtract(i, unit)
  }).reverse()
}

function formatDate (date, periodUnit) {
  return dayjs(date).format(periodFormat[periodUnit || 'day'])
}

function normalizeDateInput (data, period) {
  if (isArray(data)) return normalizeDataInput(data, getDateLabels(period))
  const datesObj = {}
  forEach(getDates(period), (date) => {
    const match = find(Object.keys(data), key => dayjs(parseDate(key)).isSame(date, period.unit))
    datesObj[formatDate(date, period.unit)] = data[match] ? data[match] : (isObject(firstObjectItem(data)) ? {} : 0)
  })
  return normalizeDataInput(datesObj, getDateLabels(period))
}

function normalizeDataInput (data, labels) {
  if (isArray(data)) {
    return {
      labels: labels && labels.length
        ? labels
        : map(data, (_, i) => `Label ${i + 1}`),
      datasets: [{ label: 'Series 1', data }],
    }
  }
  // TODO: an array of objects should work!
  if (isObject(data) && data.labels && data.datasets) return data
  if (isObject(data) && isArray(firstObjectItem(data)) && labels) return objectArrayDataInput(data, labels)
  if (isObject(data) && isObject(firstObjectItem(data))) return objectObjectDataInput(data)
  if (isObject(data) && isNumber(firstObjectItem(data))) {
    return {
      labels: keys(data),
      datasets: [{ label: 'Series 1', data: values(data) }],
    }
  }
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

function parseDate (d) {
  const date = new Date(d)
  if (!isNaN(date.getTime())) return dayjs(d)
  else if (!isNaN(parseFloat(d))) return dayjs(parseFloat(d))
  return dayjs(d)
}
