'use client';

import { Users, DollarSign, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatCurrency } from '@/lib/utils';
import { useStats } from '@/hooks/use-engagements';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
  sub?: string;
}

function StatCard({ title, value, icon, accent, sub }: StatCardProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className={cn('p-2 rounded-lg', accent ?? 'bg-blue-50 text-blue-600')}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { data, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-slate-200">
            <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-16" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Active Engagements"
        value={data?.activeCount ?? 0}
        icon={<Users className="h-4 w-4" />}
        accent="bg-green-50 text-green-600"
        sub="Currently in delivery"
      />
      <StatCard
        title="Pipeline Value"
        value={formatCurrency(data?.totalPipelineValue ?? 0)}
        icon={<DollarSign className="h-4 w-4" />}
        accent="bg-blue-50 text-blue-600"
        sub="Excl. closed lost"
      />
      <StatCard
        title="Proposals Out"
        value={data?.proposalCount ?? 0}
        icon={<FileText className="h-4 w-4" />}
        accent="bg-purple-50 text-purple-600"
        sub="Awaiting decision"
      />
      <StatCard
        title="Follow-ups Due"
        value={data?.followupsDueCount ?? 0}
        icon={<Calendar className="h-4 w-4" />}
        accent={data?.followupsDueCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'}
        sub={data?.followupsDueCount > 0 ? 'Action needed' : 'All caught up'}
      />
    </div>
  );
}
