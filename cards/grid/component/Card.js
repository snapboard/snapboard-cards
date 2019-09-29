import React from 'react'
import Grid from '@snapboard/grid'
import merge from 'lodash/merge'

const defaultColumns = [
  { key: 'month', name: 'Month', editable: true, width: 140 },
  { key: 'spend', name: 'Spend', editable: true, width: 140 },
]

const defaultData = {
  columns: defaultColumns,
  rows: [{}, {}],
}

class GridController extends React.Component {
  state = {
    data: defaultData,
  }

  update = (fn) => {
    this.setState((prevState) => {
      const currentData = this.props.loading ? prevState.state.data : (this.props.data || defaultData)
      const newData = { ...currentData, ...fn(currentData) }
      if (this.props.set) this.props.set(newData)
      return { data: newData }
    })
  }

  onAddColumn = () => {
    this.update((data) => ({
      columns: [...data.columns, { key: 'col1', name: 'Col 1' }],
    }))
  }

  onRowsChange = ({ fromRow, toRow, updated }) => {
    this.update((data) => {
      const rows = data.rows
      const updatedRows = []
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index]
        updatedRows[index] = index >= fromRow && index <= toRow ? merge({}, row, updated) : row
      }
      return { rows: updatedRows }
    })
  }

  onDeleteColumn = ({ columnIndex }) => {
    this.update((data) => {
      const columns = data.columns.slice(0)
      columns.splice(columnIndex, 1)
      return { columns }
    })
  }

  onDeleteRow = ({ rowIndex }) => {
    this.update((data) => {
      const rows = data.rows.slice(0)
      rows.splice(rowIndex, 1)
      return { rows }
    })
  }

  onColumnResize = (columnIndex, offset) => {
    this.update((data) => {
      const columns = data.columns.slice(0)
      const column = columns[columnIndex]
      columns[columnIndex] = merge({}, column, { width: Math.max(30, (column.width || 75) + offset) })
      return { columns }
    })
  }

  onAddRow = () => {
    this.update((data) => ({
      rows: data.rows.concat([{}]),
    }))
  }

  render () {
    const data = this.props.loading ? this.state.data : (this.props.data || defaultData)
    const { columns, rows } = data

    const columnMenu = [{
      text: 'Delete',
      onClick: this.onDeleteColumn,
    }]
    const rowMenu = [{
      text: 'Delete',
      onClick: this.onDeleteRow,
    }]

    return (
      <Grid
        columns={columns}
        rowCount={rows.length}
        rowGetter={i => rows[i]}
        gutterOffset={0}
        columnMenu={columnMenu}
        rowMenu={rowMenu}
        onRowsChange={this.onRowsChange}
        onAddColumn={this.onAddColumn}
        onAddRow={this.onAddRow}
        onColumnResize={this.onColumnResize}
      />
    )
  }
}

export default GridController
