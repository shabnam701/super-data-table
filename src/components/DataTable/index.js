import React from 'react'
import styled from 'styled-components'
import Table from './ReactTable'
import formatData from './formatData'

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
                width: item.width || defaultColumnWidth,
                accessor: item.id
            }
        }) : [],
        [columns, defaultColumnWidth]
    )

    const rowData = React.useMemo(() => formatData(rows), [rows])
    console.log("columnData", columnData, JSON.stringify(rowData))
    return (
        <Styles>
            <Table columns={columnData} data={rowData} defaultColumnWidth={defaultColumnWidth} />
        </Styles>
    )
}

export default DataTable
