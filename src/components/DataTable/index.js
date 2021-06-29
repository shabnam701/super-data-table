import React from 'react'
import styled from 'styled-components'
import { useTable, useBlockLayout } from 'react-table'
import { FixedSizeList } from 'react-window'
import scrollbarWidth from './scrollbarWidth'

import formatData from './formatData'

const colWidth = 150
const Styles = styled.div`
  padding: 1rem;

  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;
    word-break: break-word;
    width: 100%;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th{
        display: inline-block;
        box-sizing: border-box;
    }

    .td{
        .cell-rt-align{
            padding: 5px;
            text-align: right;
        }
    }

    .th,
    .td {
      margin: 0;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      .cell-padding{
          padding: 5px;
      }

      :last-child {
        border-right: 1px solid black;
      }
    }
  }
`

function Table({ columns, data, defaultColumnWidth }) {
    // Use the state and functions returned from useTable to build your UI

    const defaultColumn = React.useMemo(
        () => ({
            width: defaultColumnWidth || colWidth,
        }),
        [defaultColumnWidth]
    )

    const scrollBarSize = React.useMemo(() => scrollbarWidth(), [])
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        totalColumnsWidth,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
        },
        useBlockLayout
    )

    const RenderRow = React.useCallback(
        ({ index, style }) => {
            const row = rows[index]
            prepareRow(row)

            return (
                <div
                    {...row.getRowProps({
                        style,
                    })}
                    className="tr"
                >
                    {row.cells.map((cell) => {

                        return (
                            <div {...cell.getCellProps()} style={{ ...cell.getCellProps().style, width: (cell && cell.column && cell.column.width) || colWidth }} className="td">
                                {cell.render('Cell')}
                            </div>
                        )
                    })}
                </div>
            )
        },
        [prepareRow, rows]
    )

    // Render the UI for your table
    return (
        <div {...getTableProps()} className="table">
            <div>
                {headerGroups.map(headerGroup => (
                    <div {...headerGroup.getHeaderGroupProps()} style={{ ...headerGroup.getHeaderGroupProps().style, marginRight: scrollBarSize }} className="tr">
                        {headerGroup.headers.map(column => (
                            <div {...column.getHeaderProps()} style={{ ...column.getHeaderProps.style, width: column.width }} className="th">
                                {column.render('Header')}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div {...getTableBodyProps()}>
                <FixedSizeList
                    height={400}
                    itemCount={rows.length}
                    itemSize={35}
                    width={totalColumnsWidth + scrollBarSize}
                >
                    {RenderRow}
                </FixedSizeList>
            </div>
        </div>
    )
}

function DataTable({ columns, rows, defaultColumnWidth }) {
    const columnData = React.useMemo(
        () => columns && columns.length > 0 ? columns.filter(item => !item.isHidden).map((item, index) => {
            return {
                ...item,
                Header: () => { return <div className="cell-padding">{item.label}</div> },
                Cell: ({ value }) => {
                    return item.numeric
                        ? <div className="cell-rt-align" >{value}</div>
                        : <div className="cell-padding">
                            {item.isImage && typeof value === "string"
                                ? <img width={25} src={value} />
                                : item.isLink && typeof value === "string"
                                    ? <a href={`${value}`} target="_blank">Open Link &#xbb;</a>
                                    : value
                            }</div>
                },
                width: item.width || defaultColumnWidth || colWidth,
                accessor: item.id
            }
        }) : [],
        [columns, defaultColumnWidth]
    )

    const rowData = React.useMemo(() => formatData(rows), [rows])
    console.log("columnData", columnData)
    return (
        <Styles>
            <Table columns={columnData} data={rowData} defaultColumnWidth={defaultColumnWidth} />
        </Styles>
    )
}

export default DataTable
