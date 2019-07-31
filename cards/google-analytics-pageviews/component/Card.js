import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const columnTitles = ['Page', 'Hits']

function Component ({ data, inputs={} }) {
  if (!data) return null
  const columns = [{
    Header: 'Page',
    accessor: 'label',
  }, {
    Header: inputs.metric || 'Users',
    accessor: 'value'
  }]
  const pageSize = (inputs && inputs.pageSize) || 100

  return <ReactTable
    data={data}
    minRows={1}
    showPageSizeOptions={false}
    showPagination={data.length > pageSize}
    pageSize={pageSize}
    columns={columns}
  />
}

export default Component