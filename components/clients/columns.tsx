'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Column } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import type { Engagement } from '@/lib/types';

const statusColor: Record<string, string> = {
  'Active':      'bg-green-100 text-green-800 border-green-200',
  'Proposal':    'bg-blue-100 text-blue-800 border-blue-200',
  'Closed Won':  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Closed Lost': 'bg-red-100 text-red-800 border-red-200',
  'On Hold':     'bg-amber-100 text-amber-800 border-amber-200',
  'Inactive':    'bg-slate-100 text-slate-600 border-slate-200',
};

const priorityColor: Record<string, string> = {
  High:   'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Low:    'bg-slate-50 text-slate-500 border-slate-200',
};

const stageColor: Record<string, string> = {
  'Prospecting':    'bg-slate-100 text-slate-600',
  'Discovery':      'bg-sky-100 text-sky-700',
  'Proposal':       'bg-blue-100 text-blue-700',
  'Negotiation':    'bg-violet-100 text-violet-700',
  'Active Delivery':'bg-green-100 text-green-700',
  'Completed':      'bg-teal-100 text-teal-700',
};

function SortableHeader({ column, label }: { column: Column<Engagement, unknown>; label: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 font-medium text-slate-600"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      <ArrowUpDown className="ml-1 h-3 w-3" />
    </Button>
  );
}

export function buildColumns(
  onEdit: (eng: Engagement) => void,
  onDelete: (id: number) => void
): ColumnDef<Engagement>[] {
  return [
    {
      accessorKey: 'clientName',
      header: ({ column }) => <SortableHeader column={column} label="Client" />,
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">{row.getValue('clientName')}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const v = row.getValue<string>('status');
        return <Badge variant="outline" className={cn('text-xs', statusColor[v] ?? '')}>{v}</Badge>;
      },
      filterFn: 'equals',
    },
    {
      accessorKey: 'stage',
      header: 'Stage',
      cell: ({ row }) => {
        const v = row.getValue<string>('stage');
        return <Badge variant="secondary" className={cn('text-xs', stageColor[v] ?? '')}>{v}</Badge>;
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const v = row.getValue<string>('priority');
        return <Badge variant="outline" className={cn('text-xs', priorityColor[v] ?? '')}>{v}</Badge>;
      },
    },
    {
      accessorKey: 'contractValue',
      header: ({ column }) => <SortableHeader column={column} label="Value" />,
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">{formatCurrency(row.getValue('contractValue'))}</span>
      ),
    },
    {
      accessorKey: 'practiceArea',
      header: 'Practice',
      cell: ({ row }) => <span className="text-sm text-slate-600">{row.getValue('practiceArea') ?? '—'}</span>,
    },
    {
      accessorKey: 'engagementModel',
      header: 'Model',
      cell: ({ row }) => <span className="text-sm text-slate-600">{row.getValue('engagementModel') ?? '—'}</span>,
    },
    {
      accessorKey: 'accountExecutive',
      header: 'Account Exec',
      cell: ({ row }) => <span className="text-sm text-slate-700">{row.getValue('accountExecutive') ?? '—'}</span>,
    },
    {
      accessorKey: 'pocName',
      header: 'Client POC',
      cell: ({ row }) => {
        const name  = row.original.pocName;
        const title = row.original.pocTitle;
        return (
          <div>
            <p className="text-sm text-slate-800">{name ?? '—'}</p>
            {title && <p className="text-xs text-slate-500">{title}</p>}
          </div>
        );
      },
    },
    {
      accessorKey: 'region',
      header: 'Region',
      cell: ({ row }) => <span className="text-sm text-slate-600">{row.getValue('region')}</span>,
    },
    {
      accessorKey: 'dateLastContact',
      header: ({ column }) => <SortableHeader column={column} label="Last Contact" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-slate-600">{formatDate(row.getValue('dateLastContact'))}</span>
      ),
    },
    {
      accessorKey: 'nextFollowupDate',
      header: ({ column }) => <SortableHeader column={column} label="Follow-up" />,
      cell: ({ row }) => {
        const date = row.getValue<string | null>('nextFollowupDate');
        const isOverdue = date && new Date(date) < new Date();
        return (
          <span className={cn('text-sm tabular-nums', isOverdue ? 'text-red-600 font-medium' : 'text-slate-600')}>
            {formatDate(date)}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
              <MoreHorizontal className="h-4 w-4 text-slate-600" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
