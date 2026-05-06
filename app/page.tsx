import { StatsCards } from "@/components/dashboard/stats-cards";
import { UpcomingFollowups } from "@/components/dashboard/upcoming-followups";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">West Region AI Practice — engagement overview</p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UpcomingFollowups />
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6 flex flex-col items-center justify-center gap-4 min-h-[220px]">
          <div className="text-center">
            <p className="text-slate-700 font-medium">Manage your engagements</p>
            <p className="text-sm text-slate-500 mt-1">
              View, add, edit, and filter all client engagements. Export to CSV anytime.
            </p>
          </div>
          <Link
            href="/clients"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            View all engagements <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-slate-400">
            Use the <span className="font-medium text-blue-600">AI chat button</span> (bottom right) to ask questions about your pipeline.
          </p>
        </div>
      </div>
    </div>
  );
}
