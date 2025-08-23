import { AddCompetitorCard } from "@/components/add-competitor-card";
import { AlertRecipientManager } from "@/components/alert-recipient-manager";
import { CompetitorList } from "@/components/competitor-list";
import { DashboardStats } from "@/components/dashboard-stats";
import { ScrapeAllButton } from "@/components/scrape-all-button";

export default function Home() {
  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <ScrapeAllButton />
        </div>
      </div>

      {/* Dynamic Stat Cards */}
      <DashboardStats />

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 pt-4">
        <div className="lg:col-span-4">
          <CompetitorList />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <AddCompetitorCard />
          <AlertRecipientManager />
        </div>
      </div>
    </main>
  );
}
