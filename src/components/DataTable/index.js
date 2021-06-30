import React from 'react';
import styled from 'styled-components';
import Table from './ReactTable';
import formatData from './formatData';

const Styles = styled.div`
  padding: 1rem;

  .table-striped {
    .tbody .tr-striped {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }

  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid #ddd;
    word-break: break-word;
    width: 100%;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th {
      display: flex;
      box-sizing: border-box;
      font-weight: bold;
      justify-content: center;
      align-items: center;
    }

    .td {
      .cell-rt-align {
        padding: 5px;
        text-align: right;
      }
      .mr-t-10 {
        margin-top: 10px;
      }
    }

    .th,
    .td {
      margin: 0;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;

      .cell-padding {
        padding: 5px;
      }

      :last-child {
        border-right: 1px solid #ddd;
      }
    }
  }
`;

function DataTable({
  columns,
  rows,
  defaultColumnWidth,
  onSelectionChange,
  onRowClick,
  globalSearch,
}) {
  const columnData = React.useMemo(
    () =>
      columns && columns.length > 0
        ? columns
          .filter((item) => !item.isHidden)
          .map((item) => {
            return {
              ...item,
              Header: () => {
                return <div className="cell-padding">{item.label}</div>;
              },
              Cell: ({ value }) => {
                return item.numeric ? (
                  <div className="cell-rt-align">{value}</div>
                ) : (
                    <div className="cell-padding">
                      {item.isImage && typeof value === 'string' ? (
                        <img width={25} src={value} alt="thumbnail" />
                      ) : item.isLink && typeof value === 'string' ? (
                        <a href={`${value}`} target="_blank" rel="noreferrer">
                          Open Link &#xbb;
                        </a>
                      ) : (
                            value
                          )}
                    </div>
                  );
              },
              width: item.width || defaultColumnWidth,
              accessor: item.id,
            };
          })
        : [],
    [columns, defaultColumnWidth],
  );

  const rowData = React.useMemo(() => formatData(rows), [rows]);
  return (
    <Styles>
      <Table
        columns={columnData}
        data={rowData}
        defaultColumnWidth={defaultColumnWidth}
        onSelectionChange={onSelectionChange}
        onRowClick={onRowClick}
        globalSearch={globalSearch}
      />
    </Styles>
  );
}

export default DataTable;
