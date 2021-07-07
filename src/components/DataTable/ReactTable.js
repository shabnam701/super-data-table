import React from 'react';
import PropTypes from 'prop-types';
import { useTable, useRowSelect, useBlockLayout, useSortBy, useGlobalFilter } from 'react-table';
import { FixedSizeList } from 'react-window';
import scrollbarWidth from './scrollbarWidth';
import GlobalFilter from './GlobalFilter';

// width of column if not specified in data
const colWidth = 150;

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  defaultColumnWidth: PropTypes.number,
  onSelectionChange: PropTypes.func,
  onRowClick: PropTypes.func,
  globalSearch: PropTypes.bool,
};

// Main table component to be rendered
export default function Table({
  columns,
  data,
  defaultColumnWidth,
  onSelectionChange = () => {},
  onRowClick = () => {},
  globalSearch,
}) {
  // Use the state and functions returned from useTable to build UI
  const defaultColumn = React.useMemo(
    () => ({
      width: defaultColumnWidth || colWidth, // Set width of column
    }),
    [defaultColumnWidth],
  );

  //If table overflows, get scrollbarsize to set height and width of table and rows
  const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  //root hook for React Table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
    state: { selectedRowIds, globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useGlobalFilter, // hook that implements global row filtering
    useSortBy, // hook that implements row sorting
    useRowSelect, // hook that implements basic row selection
    useBlockLayout, // plugin hook that adds support for headers and cells to be rendered as inline-block
  );

  // Effect hook to trigger onSelectionChange when selectedRowIds change in state
  React.useEffect(() => {
    const selectedIds = Object.keys(selectedRowIds);
    const selected = selectedIds.length === data.length ? 'All' : selectedIds;
    console.log('onSelectionChange', onSelectionChange);
    onSelectionChange(selected);
  }, [onSelectionChange, selectedRowIds]);

  // hook to render a row
  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          onClick={() => {
            // trigger row click callback function
            onRowClick(row.values, index);
          }}
          className={`${index % 2 === 0 ? 'tr tr-striped' : 'tr'}`}
        >
          {row.cells.map((cell) => {
            return (
              <div
                {...cell.getCellProps()}
                style={{
                  ...cell.getCellProps().style,
                  width: (cell && cell.column && cell.column.width) || colWidth,
                }}
                className="td"
              >
                {cell.render('Cell')}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows, selectedRowIds, onRowClick],
  );

  // Render the UI for your table
  // Use divs instead of table tags for better performance in rendering on DOM
  return (
    <div {...getTableProps()} className="table table-striped">
      <div className="thead">
        {/* Render global search only when globalSearch={true} in the API.
                First row in table */}
        {globalSearch && (
          <div style={{ marginRight: scrollBarSize }} className="tr">
            <div className="th" style={{ height: '50px', justifyContent: 'flex-end' }}>
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </div>
          </div>
        )}
        {/* Render column header for the table. */}
        {headerGroups.map((headerGroup) => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            style={{ ...headerGroup.getHeaderGroupProps().style, marginRight: scrollBarSize }}
            className="tr"
          >
            {/* Add sort functionality to columns where sortable={true} */}
            {headerGroup.headers.map((column) =>
              column.sortable ? (
                <div
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{ ...column.getHeaderProps.style, width: column.width }}
                  className="th"
                >
                  {column.render('Header')}
                  <span className="action-icon">
                    {column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : '⇅'}
                  </span>
                </div>
              ) : (
                <div
                  {...column.getHeaderProps()}
                  style={{ ...column.getHeaderProps.style, width: column.width }}
                  className="th"
                >
                  {column.render('Header')}
                </div>
              ),
            )}
          </div>
        ))}
      </div>

      {/* FixedSizeList from react-window to render rows only within viewable scroll area.
            This helps in handling large data and enhances performance*/}
      <div {...getTableBodyProps()} className="tbody">
        <FixedSizeList
          height={350}
          itemCount={rows.length}
          itemSize={35}
          width={totalColumnsWidth + scrollBarSize}
        >
          {RenderRow}
        </FixedSizeList>
      </div>
    </div>
  );
}
