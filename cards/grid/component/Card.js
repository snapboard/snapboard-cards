import React from 'react'
import Grid from '@snapboard/grid'
import Button from '@snapboard/ui/Button'
import Modal from 'react-modal'
import merge from 'lodash/merge'
import keyBy from 'lodash/keyBy'

const defaultData = {
  timestamp: null,
  columns: [
    { key: 'Month', name: 'Month', editable: true, width: 140 },
    { key: 'Spend', name: 'Spend', editable: true, width: 140 },
  ],
  rows: [{}, {}],
}

const modalStyles = {
  overlay: {
    zIndex: 10,
    background: 'rgba(0, 0, 0, 0.8)',
  },
  content : {
    padding: 0,
    zIndex: 11,
    maxWidth: 400,
    margin: '0 auto',
    width: '80%',
    border: 0,
    bottom: 'auto',
  },
}

class GridController extends React.Component {
  state = {
    data: defaultData,
    showModal: false,
    modalInput: '',
  }

  update = (fn) => {
    this.setState((prevState) => {
      const now = Date.now()
      const currentData = this.getData(this.props, prevState)
      const newData = { ...currentData, ...fn(currentData), timestamp: now }
      if (this.props.set) this.props.set(newData.rows, { timestamp: now, columns: newData.columns })
      return { data: newData }
    })
  }

  onAddColumn = () => {
    this.update((data) => {
      const columnKeys = keyBy(data.columns, 'key')
      let counter = data.columns.length
      let name = `Col ${counter}`
      while (columnKeys[name]) {
        name = `Col ${counter += 1}`
      }
      return {
        columns: [...data.columns, { key: name, name }],
      }
    })
  }

  onRenameColumn = () => {
    this.setState({ showModal: false })
    this.update((data) => {
      const { modalInput: newColumnName, modalContext } = this.state
      const columnKeys = keyBy(data.columns, 'key')
      // Don't update if it's the same name as existing column
      if (columnKeys[newColumnName]) return {}
      const { columnIndex } = modalContext

      const column = data.columns[columnIndex]
      const existingColumnKey = column.key

      const rows = data.rows
      const updatedRows = []

      // Update all rows swapping the key to the new
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index]
        updatedRows[index] = { ...row, [existingColumnKey]: undefined, [newColumnName]: row[existingColumnKey] }
      }

      const updatedColumns = data.columns.slice(0)
      updatedColumns.splice(columnIndex, 1, { ...column, key: newColumnName, name: newColumnName })

      return { rows: updatedRows, columns: updatedColumns }
    })
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

  getData = (props, state) => {
    const stateData = state.data || {}
    const propsData = {
      rows: props.data || [],
      ...(props.metadata || {}),
    }
    return stateData.timestamp && propsData.timestamp &&
      stateData.timestamp > propsData.timestamp
      ? stateData
      : (props.data || props.metadata ? propsData : defaultData)
  }

  render () {
    const data = this.getData(this.props, this.state)
    const { columns, rows } = data

    const columnMenu = [{
      text: 'Delete',
      onClick: this.onDeleteColumn,
    }, {
      text: 'Rename',
      onClick: (context) => this.setState({
        showModal: true,
        modalInput: columns[context.columnIndex].name || '',
        modalContext: context,
      }),
    }]
    const rowMenu = [{
      text: 'Delete',
      onClick: this.onDeleteRow,
    }]

    return (
      <div style={{ height: '100%' }}>
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
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
          contentLabel='Grid Form'
          style={modalStyles}
        >
          <div className='modal'>
            <h2>Rename Column</h2>
            <div style={{ marginBottom: '0.5em' }}>
              <input value={this.state.modalInput} onChange={e => this.setState({ modalInput: e.target.value })} />
            </div>
            <Button onClick={this.onRenameColumn}>Done</Button>
          </div>
        </Modal>
      </div>
    )
  }
}

export default GridController
