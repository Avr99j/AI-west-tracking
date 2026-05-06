'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClientForm } from './client-form';
import type { Engagement } from '@/lib/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  engagement?: Engagement | null;
}

export function ClientModal({ open, onOpenChange, engagement }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900">
            {engagement ? `Edit — ${engagement.clientName}` : 'Add New Engagement'}
          </DialogTitle>
        </DialogHeader>
        <ClientForm
          engagement={engagement}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
