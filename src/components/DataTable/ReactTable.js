import React from 'react'
import { useTable, useRowSelect, useBlockLayout } from 'react-table'
import { FixedSizeList } from 'react-window'
import scrollbarWidth from './scrollbarWidth'

const colWidth = 150

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef
        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <>
                <input className="mr-t-10" type="checkbox"
                    ref={resolvedRef}
                    {...rest} />
            </>
        )
    }
)

export default function Table({ columns, data, defaultColumnWidth, onSelectionChange, onRowClick }) {
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
        state: { selectedRowIds },
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            stateReducer: (newState, action, prevState) => {
                if (newState.selectedRowIds !== prevState.selectedRowIds) {
                    //If all columns are selected return 'All' to onSelectionChange else return array of ids
                    let selectedIds = Object.keys(newState.selectedRowIds)
                    let selected = selectedIds.length === data.length ? "All" : selectedIds
                    onSelectionChange(selected)
                }
                return newState
            }
        },
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => [
                // Let's make a column for selection
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox onSelectionChange={onSelectionChange}
                                {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    width: 100,
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox onSelectionChange={onSelectionChange} {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ])
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
                    onClick={() => {
                        onRowClick(row.values, index)
                    }}
                    className={`${index % 2 === 0 ? "tr tr-striped" : "tr"}`}
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
        [prepareRow, rows, selectedRowIds]
    )

    // Render the UI for your table
    return (
        <div {...getTableProps()} className="table table-striped">
            <div className="thead">
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

            <div {...getTableBodyProps()} className="tbody">
                <FixedSizeList
                    height={500}
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