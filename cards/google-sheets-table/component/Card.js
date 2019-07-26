import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

function Component ({ data, inputs }) {
  if (!data) return null
  const columns = data[0].map((title, i) => ({
    Header: title,
    accessor: `${i}`,
    id: title,
  }))
  const pageSize = inputs.pageSize || 100

  return <ReactTable
    data={data.slice(1)}
    minRows={1}
    showPageSizeOptions={false}
    showPagination={data.length > pageSize}
    pageSize={pageSize}
    columns={columns}
  />
}

export default Component