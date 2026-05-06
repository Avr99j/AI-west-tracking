import { ClientsTable } from "@/components/clients/clients-table";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Engagements</h1>
        <p className="text-sm text-slate-500 mt-1">All client engagements — West Region AI Practice</p>
      </div>
      <ClientsTable />
    </div>
  );
}
