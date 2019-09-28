import React from 'react'
import Grid from '@snapboard/grid'
// import uuid from 'uuid/v4'

const defaultColumns = [
  { key: 'month', name: 'Month', editable: true, width: 140 },
  { key: 'spend', name: 'Spend', editable: true, width: 140 },
]

const defaultData = {
  columns: defaultColumns,
  rows: [{}, {}]
}

class GridController extends React.Component {
  update = (changes) => {
    this.props.update(changes)
    this.setState(changes)
  }

  onAddColumn = () => {
  }

  render () {
    const { data } = this.state
    const { columns, rows } = data

    const columnMenu = [{
      text: 'Rename',
      onClick: this.onRename,
    }, {
      text: 'Insert Left',
      onClick: ({ columnIndex }) => this.onAddColumn(columnIndex),
    }, {
      text: 'Insert Right',
      onClick: ({ columnIndex }) => this.onAddColumn(columnIndex + 1),
    }, {
      text: 'Delete',
      onClick: this.deleteColumn,
    }]

    const rowMenu = []

    return (
      <Grid
        columns={columns}
        rowCount={rows.length}
        rowGetter={i => rows[i]}
        gutterOffset={0}
        columnMenu={columnMenu}
        rowMenu={rowMenu}
        onAddColumn={this.onAddColumn}
        onAddRow={this.onAddRow}
      />
    )
  }
}

export default GridController
