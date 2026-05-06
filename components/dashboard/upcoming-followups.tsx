'use client';

import { Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatDate } from '@/lib/utils';
import { useStats } from '@/hooks/use-engagements';
import type { Engagement } from '@/lib/types';

const priorityColor: Record<string, string> = {
  High:   'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Low:    'bg-slate-50 text-slate-600 border-slate-200',
};

export function UpcomingFollowups() {
  const { data, isLoading } = useStats();

  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  const followups: Engagement[] = data?.followupsDue ?? [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <Calendar className="h-4 w-4 text-slate-500" />
        <CardTitle className="text-base font-semibold text-slate-800">Follow-ups Due</CardTitle>
        {followups.length > 0 && (
          <Badge variant="destructive" className="ml-auto text-xs">{followups.length}</Badge>
        )}
      </CardHeader>
      <CardContent>
        {followups.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No follow-ups overdue.</p>
        ) : (
          <div className="space-y-3">
            {followups.map((eng) => {
              const dueDate = eng.nextFollowupDate ? new Date(eng.nextFollowupDate) : null;
              const isOverdue = dueDate && dueDate < today;
              return (
                <div key={eng.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{eng.clientName}</p>
                    <p className="text-xs text-slate-500 truncate">{eng.accountExecutive ?? '—'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={cn('text-xs', priorityColor[eng.priority])}>
                      {eng.priority}
                    </Badge>
                    <span className={cn('text-xs', isOverdue ? 'text-red-600 font-medium flex items-center gap-1' : 'text-slate-500')}>
                      {isOverdue && <AlertCircle className="h-3 w-3" />}
                      {formatDate(eng.nextFollowupDate)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
