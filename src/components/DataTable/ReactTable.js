import React from 'react'
import { useTable, useRowSelect, useBlockLayout } from 'react-table'
import { FixedSizeList } from 'react-window'
import scrollbarWidth from './scrollbarWidth'

const colWidth = 150

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef
        console.log("rest", rest)

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
        )
    }
)

export default function Table({ columns, data, defaultColumnWidth }) {
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
                            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
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
        [prepareRow, rows, selectedRowIds]
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