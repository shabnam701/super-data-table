import React from 'react';
import {
    useTable,
    useRowSelect,
    useBlockLayout,
    useSortBy,
    useGlobalFilter,
    useAsyncDebounce,
} from 'react-table';
import { FixedSizeList } from 'react-window';
import scrollbarWidth from './scrollbarWidth';

// width of column if not specified in data
const colWidth = 150;

// Component to render row selection checkboxes
const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;
    React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
        <>
            <input className="mr-t-10" type="checkbox" ref={resolvedRef} {...rest} />
        </>
    );
});


// component to search within table data globally
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (
        <span>
            Search:{' '}
            <input
                value={value || ''}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`${count} records...`}
                style={{
                    fontSize: '1.1rem',
                    border: '0',
                }}
            />
        </span>
    );
}

// Main table component to be rendered
export default function Table({
    columns,
    data,
    defaultColumnWidth,
    onSelectionChange,
    onRowClick,
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
            stateReducer: (newState, action, prevState) => {
                if (newState.selectedRowIds !== prevState.selectedRowIds) {
                    //If all columns are selected return 'All' to onSelectionChange else return array of ids
                    const selectedIds = Object.keys(newState.selectedRowIds);
                    const selected = selectedIds.length === data.length ? 'All' : selectedIds;
                    onSelectionChange(selected);
                }
                return newState;
            }, // to trigger onSelectionChange when selectedRowIds change in state
        },
        useGlobalFilter, // hook that implements global row filtering
        useSortBy, // hook that implements row sorting
        useRowSelect, // hook that implements basic row selection
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                // Column for enabling user to select rows using checkboxes
                {
                    id: 'selection',
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox
                                {...getToggleAllRowsSelectedProps()}
                            />
                        </div>
                    ),
                    width: 100,
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox
                                {...row.getToggleRowSelectedProps()}
                            />
                        </div>
                    ),
                },
                ...columns,
            ]);
        },
        useBlockLayout, // plugin hook that adds support for headers and cells to be rendered as inline-block 
        );

    // hook to render rows
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
                {/* Render column header for the table.
                Use divs instead of table tags for better performance in rendering on DOM */}
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
                                    <span style={{ color: '#22a7d0' }}>
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
