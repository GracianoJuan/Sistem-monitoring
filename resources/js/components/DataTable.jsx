// resources/js/Components/Table/DataTable.jsx
import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';

const DataTable = ({ data, columns, loading }) => {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
    });

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="animate-pulse space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Search */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <input
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search all columns..."
                />
            </div>

            {/* Table with Fixed Header */}
            <div className="relative">
                <div className="overflow-auto max-h-[70vh] border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* Sticky Header */}
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header, index) => (
                                        <th
                                            key={header.id}
                                            className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50 ${index < 2 ? 'sticky left-0 z-20 shadow-r' : 'min-w-[150px]'
                                                } ${index === 0 ? 'left-0' : index === 1 ? 'left-[200px]' : ''
                                                }`}
                                            style={{
                                                minWidth: index < 2 ? '200px' : '150px',
                                                maxWidth: index < 2 ? '300px' : '250px',
                                            }}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={`flex items-center space-x-1 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:bg-gray-100 p-1 rounded' : ''
                                                        }`}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    title={
                                                        typeof header.column.columnDef.header === 'string'
                                                            ? header.column.columnDef.header
                                                            : ''
                                                    }
                                                >
                                                    <span className="text-wrap">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </span>
                                                    <span className="flex-shrink-0">
                                                        {{
                                                            asc: '🔼',
                                                            desc: '🔽',
                                                        }[header.column.getIsSorted()] ?? (header.column.getCanSort() ? '↕️' : null)}
                                                    </span>
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        {/* Body */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    {row.getVisibleCells().map((cell, index) => (
                                        <td
                                            key={cell.id}
                                            className={`px-4 py-3 text-sm text-gray-900 border-r border-gray-100 ${index < 2 ? 'sticky left-0 bg-white z-10 shadow-r' : ''
                                                } ${index === 0 ? 'left-0' : index === 1 ? 'left-[200px]' : ''
                                                }`}
                                            style={{
                                                minWidth: index < 2 ? '200px' : '150px',
                                                maxWidth: index < 2 ? '300px' : '250px',
                                            }}
                                        >
                                            <div className="min-h-[20px] flex items-center">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">
                        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}{' '}
                        of {table.getFilteredRowModel().rows.length} entries
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <div className="flex space-x-1">
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            {'<<'}
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            {'<'}
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            {'>'}
                        </button>
                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            {'>>'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataTable;