import React from 'react';


export type CellValue = string | number | boolean | null | undefined;

export type DataTableProps<R, C extends string> = {
  rows: R[]
  columns: C[]

  getRowId?: (row: R, index: number) => string | number
  getHeaderContent?: (column: C) => React.ReactNode
  getCellValue?: (column: C, row: R) => CellValue
  getCellContent?: (value: CellValue, column: C, row: R) => React.ReactNode
  getColumnWidth?: (column: C) => number

  onHeaderClick?: (column: C) => void
  onRowClick?: (row: R) => void
  onCellClick?: (value: CellValue, column: C, row: R) => void

  tableClassName?: string,
}

export default function DataTable<R, C extends string>(props: DataTableProps<R, C>) {

  const {
    rows,
    columns,

    getRowId = (_: R, index: number) => index,
    getHeaderContent = () => '',
    getCellValue = () => 0,
    getCellContent = () => '',
    getColumnWidth,

    onHeaderClick = () => {},
    onRowClick = () => {},
    onCellClick = () => {},

    tableClassName = 'density-proto-ui-data-table'
  } = props;

  const tableLayout: React.CSSProperties['tableLayout'] = Boolean(getColumnWidth) ? 'fixed' : 'auto';

  return (
    <table className={tableClassName} style={{tableLayout}}>
      <thead>
        <colgroup>
        {columns.map(column => {
          return (
            <col key={column} width={getColumnWidth ? getColumnWidth(column) : 'auto'} />
          )
        })}
        </colgroup>
        <tr>
          {columns.map(column => {
            return (
              <th key={column} onClick={onHeaderClick.bind(null, column)}>{getHeaderContent(column)}</th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          return (
            <tr key={getRowId(row, index)} onClick={onRowClick.bind(null, row)}>
              {columns.map(column => {
                const cellValue = getCellValue(column, row);
                return (
                  <td key={column} onClick={onCellClick.bind(null, cellValue, column, row)}>
                    {getCellContent(cellValue, column, row)}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}