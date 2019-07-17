import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

function Component ({ data, inputs }) {
  const titles = inputs.titles ? inputs.titles.split(/\s*,\s/) : []
  const columns = titles.map((title, i) => ({
    Header: title,
    accessor: `${i}`,
    id: title,
  }))
  const pageSize = inputs.pageSize || 100

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