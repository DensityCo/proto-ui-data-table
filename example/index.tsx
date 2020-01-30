import React from 'react';
import ReactDOM from 'react-dom';

import { ascending, descending } from 'd3-array';

import DataTable from '../src';

enum SortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
  NONE = 'none',
}

function nextSortDirection(previousSortDirection: SortDirection) {
  switch (previousSortDirection) {
    case SortDirection.NONE:
      return SortDirection.DESCENDING;
    case SortDirection.DESCENDING:
      return SortDirection.ASCENDING;
    case SortDirection.ASCENDING:
      return SortDirection.NONE;
  }
}

function nextSortRule<C extends string>(previousSortRule: SortRule<C>, columnClicked: C) {
  if (previousSortRule.column && previousSortRule.column === columnClicked) {
    return {
      column: columnClicked,
      direction: nextSortDirection(previousSortRule.direction)
    }
  }
  return {
    column: columnClicked,
    direction: nextSortDirection(SortDirection.NONE)
  }
}

type SortRule<C extends string> = {
  column: C | null,
  direction: SortDirection
}

enum Column {
  FIRST_NAME = 'First Name',
  LAST_NAME = 'Last Name',
  EMAIL = 'Email',
}

const mockData = [
  {"id":1,"first_name":"Tatiania","last_name":"Ayto","email":"tayto0@reuters.com"},
  {"id":2,"first_name":"Ermengarde","last_name":"Murdy","email":"emurdy1@slate.com"},
  {"id":3,"first_name":"Luis","last_name":"Edgecombe","email":"ledgecombe2@cpanel.net"},
  {"id":4,"first_name":"Artus","last_name":"Mesant","email":"amesant3@nydailynews.com"},
  {"id":5,"first_name":"Hans","last_name":"Costley","email":"hcostley4@nytimes.com"},
]

type Row = typeof mockData[number];

const columnsToDisplay = [
  Column.FIRST_NAME,
  Column.LAST_NAME,
  Column.EMAIL,
]

const getCellValue = (column: Column, row: Row) => {
  switch(column) {
    case Column.FIRST_NAME:
      return row.first_name;
    case Column.LAST_NAME:
      return row.last_name;
    case Column.EMAIL:
      return row.email;
  }
};

const sortData = (column: Column, direction: SortDirection, data: Row[]) => {
  return data.slice().sort((a, b) => {
    const aValue = getCellValue(column, a);
    const bValue = getCellValue(column, b);
    switch (direction) {
      case SortDirection.DESCENDING:
        return descending(aValue, bValue);
      case SortDirection.ASCENDING:
        return ascending(aValue, bValue);
      default:
        return 0;
    }
  })
}

function App() {

  const [sort, setSort] = React.useState<SortRule<Column>>({
    column: null,
    direction: SortDirection.NONE,
  })

  const data = sort.column ? sortData(sort.column, sort.direction, mockData) : mockData;

  return (
    <DataTable
      rows={data}
      columns={columnsToDisplay}
  
      getRowId={row => row.id}
      getCellValue={getCellValue}
      getCellContent={value => value}
      getHeaderContent={column => column.toUpperCase()}

      onHeaderClick={column => setSort(nextSortRule(sort, column))}
    />
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
