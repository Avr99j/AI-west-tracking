'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { engagementSchema } from '@/lib/validations';
import {
  ENGAGEMENT_STATUSES, ENGAGEMENT_MODELS, PRACTICE_AREAS,
  PRIORITIES, STAGES, REGIONS,
} from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCreateEngagement, useUpdateEngagement } from '@/hooks/use-engagements';
import type { Engagement } from '@/lib/types';

interface Props {
  engagement?: Engagement | null;
  onSuccess: () => void;
}

function toDateInputValue(d: Date | string | null | undefined): string {
  if (!d) return '';
  return new Date(d).toISOString().split('T')[0];
}

export function ClientForm({ engagement, onSuccess }: Props) {
  const createMut = useCreateEngagement();
  const updateMut = useUpdateEngagement();
  const isEditing = !!engagement;

  // Let TypeScript infer form types from resolver to avoid Zod v4 input/output mismatch
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(engagementSchema),
    defaultValues: engagement
      ? {
          clientName:       engagement.clientName,
          region:           engagement.region,
          hqCity:           engagement.hqCity ?? '',
          accountExecutive: engagement.accountExecutive ?? '',
          pocName:          engagement.pocName ?? '',
          pocTitle:         engagement.pocTitle ?? '',
          pocEmail:         engagement.pocEmail ?? '',
          status:           engagement.status,
          engagementModel:  (engagement.engagementModel ?? undefined),
          dateLastContact:  toDateInputValue(engagement.dateLastContact),
          nextSteps:        engagement.nextSteps ?? '',
          nextFollowupDate: toDateInputValue(engagement.nextFollowupDate),
          contractValue:    engagement.contractValue,
          startDate:        toDateInputValue(engagement.startDate),
          endDate:          toDateInputValue(engagement.endDate),
          practiceArea:     engagement.practiceArea ?? undefined,
          teamSize:         engagement.teamSize,
          industryVertical: engagement.industryVertical ?? '',
          priority:         engagement.priority,
          stage:            engagement.stage,
          notes:            engagement.notes ?? '',
        }
      : {
          status: 'Proposal',
          priority: 'Medium',
          stage: 'Prospecting',
          region: 'West USA',
          contractValue: 0,
          teamSize: 0,
        },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(values: any) {
    if (isEditing) {
      await updateMut.mutateAsync({ id: engagement!.id, data: values });
    } else {
      await createMut.mutateAsync(values);
    }
    onSuccess();
  }

  function SelectField({ name, label, options, placeholder }: {
    name: string;
    label: string;
    options: readonly string[];
    placeholder?: string;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (watch as any)(name) as string | undefined;
    return (
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-700">{label}</Label>
        <Select value={value ?? ''} onValueChange={v => setValue(name as Parameters<typeof setValue>[0], v ?? '')}>
          <SelectTrigger className="border-slate-200 text-sm">
            <SelectValue placeholder={placeholder ?? `Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(errors as any)[name] && <p className="text-xs text-red-500">{(errors as any)[name]?.message}</p>}
      </div>
    );
  }

  function TextField({ name, label, type = 'text', placeholder }: {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
  }) {
    return (
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-slate-700">{label}</Label>
        <Input type={type} placeholder={placeholder} {...register(name as Parameters<typeof register>[0])} className="border-slate-200 text-sm" />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(errors as any)[name] && <p className="text-xs text-red-500">{(errors as any)[name]?.message}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 overflow-y-auto max-h-[70vh] pr-1">
      <section>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Client Info</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField name="clientName" label="Client Name *" placeholder="Adobe Systems" />
          <TextField name="hqCity" label="HQ City" placeholder="San Jose, CA" />
          <SelectField name="region" label="Region *" options={REGIONS} />
          <TextField name="industryVertical" label="Industry Vertical" placeholder="Technology" />
          <SelectField name="practiceArea" label="Practice Area" options={PRACTICE_AREAS} />
          <TextField name="teamSize" label="Team Size" type="number" placeholder="0" />
        </div>
      </section>

      <Separator />

      <section>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Account & Contact</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField name="accountExecutive" label="Account Executive (Sogeti)" placeholder="Marcus Chen" />
          <TextField name="pocName" label="Client POC Name" placeholder="Jennifer Walsh" />
          <TextField name="pocTitle" label="Client POC Title" placeholder="VP of Engineering" />
          <TextField name="pocEmail" label="Client POC Email" type="email" placeholder="j.walsh@client.com" />
        </div>
      </section>

      <Separator />

      <section>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Engagement Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField name="status" label="Status *" options={ENGAGEMENT_STATUSES} />
          <SelectField name="stage" label="Stage *" options={STAGES} />
          <SelectField name="priority" label="Priority *" options={PRIORITIES} />
          <SelectField name="engagementModel" label="Engagement Model" options={ENGAGEMENT_MODELS} />
        </div>
      </section>

      <Separator />

      <section>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Financials & Dates</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextField name="contractValue" label="Contract Value ($)" type="number" placeholder="0" />
          <TextField name="startDate" label="Start Date" type="date" />
          <TextField name="endDate" label="End Date" type="date" />
          <TextField name="dateLastContact" label="Date Last Contact" type="date" />
          <TextField name="nextFollowupDate" label="Next Follow-up Date" type="date" />
        </div>
      </section>

      <Separator />

      <section>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Notes & Actions</p>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">Next Steps</Label>
            <Textarea placeholder="What needs to happen next…" rows={2} {...register('nextSteps')} className="border-slate-200 text-sm resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">Notes</Label>
            <Textarea placeholder="Background, context, competitive intel…" rows={3} {...register('notes')} className="border-slate-200 text-sm resize-none" />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
          {isSubmitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Engagement'}
        </Button>
      </div>
    </form>
  );
}
