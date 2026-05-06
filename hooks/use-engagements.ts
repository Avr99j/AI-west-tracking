import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Engagement } from '@/lib/types';
import type { EngagementFormValues } from '@/lib/validations';

export const ENGAGEMENTS_KEY = ['engagements'] as const;
export const STATS_KEY = ['stats'] as const;

interface FilterParams {
  status?: string;
  stage?: string;
  search?: string;
  priority?: string;
}

function buildQuery(filters?: FilterParams): string {
  const params = new URLSearchParams();
  if (filters?.status)   params.set('status',   filters.status);
  if (filters?.stage)    params.set('stage',    filters.stage);
  if (filters?.search)   params.set('search',   filters.search);
  if (filters?.priority) params.set('priority', filters.priority);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function useEngagements(filters?: FilterParams) {
  return useQuery<Engagement[]>({
    queryKey: [...ENGAGEMENTS_KEY, filters],
    queryFn: () => fetch(`/api/clients${buildQuery(filters)}`).then(r => r.json()),
  });
}

export function useStats() {
  return useQuery({
    queryKey: STATS_KEY,
    queryFn: () => fetch('/api/stats').then(r => r.json()),
  });
}

export function useCreateEngagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: EngagementFormValues) =>
      fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ENGAGEMENTS_KEY });
      qc.invalidateQueries({ queryKey: STATS_KEY });
    },
  });
}

export function useUpdateEngagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EngagementFormValues> }) =>
      fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ENGAGEMENTS_KEY });
      qc.invalidateQueries({ queryKey: STATS_KEY });
    },
  });
}

export function useDeleteEngagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/clients/${id}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ENGAGEMENTS_KEY });
      qc.invalidateQueries({ queryKey: STATS_KEY });
    },
  });
}
