'use client';

import { Search, Download, Plus, X } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exportToCSV } from '@/lib/utils';
import { ENGAGEMENT_STATUSES } from '@/lib/types';
import type { Engagement } from '@/lib/types';

interface TableToolbarProps {
  table: Table<Engagement>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onAddNew: () => void;
  data: Engagement[];
}

export function TableToolbar({
  globalFilter,
  onGlobalFilterChange,
  statusFilter,
  onStatusFilterChange,
  onAddNew,
  data,
}: TableToolbarProps) {
  const hasFilters = globalFilter || statusFilter;

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="flex gap-2 flex-1 max-w-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search clients, contacts, notes…"
            value={globalFilter}
            onChange={e => onGlobalFilterChange(e.target.value)}
            className="pl-9 border-slate-200"
          />
        </div>
        <Select value={statusFilter || 'all'} onValueChange={v => onStatusFilterChange((v ?? '') === 'all' ? '' : (v ?? ''))}>
          <SelectTrigger className="w-[160px] border-slate-200">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ENGAGEMENT_STATUSES.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters ? (
          <Button variant="ghost" size="icon" onClick={() => { onGlobalFilterChange(''); onStatusFilterChange(''); }}>
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => exportToCSV(data)} className="border-slate-200 text-slate-700">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
        <Button size="sm" onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Engagement
        </Button>
      </div>
    </div>
  );
}
