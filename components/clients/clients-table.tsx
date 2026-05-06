'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TableToolbar } from './table-toolbar';
import { ClientModal } from './client-modal';
import { buildColumns } from './columns';
import { useEngagements, useDeleteEngagement } from '@/hooks/use-engagements';
import type { Engagement } from '@/lib/types';

export function ClientsTable() {
  const [sorting, setSorting]             = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter]   = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [editTarget, setEditTarget]       = useState<Engagement | null>(null);
  const [modalOpen, setModalOpen]         = useState(false);

  const { data = [], isLoading } = useEngagements({
    search: globalFilter || undefined,
    status: statusFilter || undefined,
  });

  const deleteMut = useDeleteEngagement();

  const columns = useMemo(
    () => buildColumns(
      (eng) => { setEditTarget(eng); setModalOpen(true); },
      (id)  => { if (confirm('Delete this engagement?')) deleteMut.mutate(id); }
    ),
    [deleteMut]
  );

  const table = useReactTable({
    data,
    columns,
    state:         { sorting },
    onSortingChange: setSorting,
    getCoreRowModel:       getCoreRowModel(),
    getSortedRowModel:     getSortedRowModel(),
    getFilteredRowModel:   getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <div className="space-y-4">
      <TableToolbar
        table={table}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddNew={() => { setEditTarget(null); setModalOpen(true); }}
        data={data}
      />

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(hg => (
                <TableRow key={hg.id} className="bg-slate-50 hover:bg-slate-50">
                  {hg.headers.map(header => (
                    <TableHead key={header.id} className="text-slate-600 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-slate-500">
                    No engagements found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} className="hover:bg-slate-50 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{table.getFilteredRowModel().rows.length} total records</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <span>Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}</span>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>

      <ClientModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        engagement={editTarget}
      />
    </div>
  );
}
