"use client";

import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DollarSign, List, Radar } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function DashboardStats() {
  const { data, isLoading, error } = trpc.dashboard.getStats.useQuery();

  if (isLoading) {
    return <StatCardsSkeleton />;
  }

  if (error) {
    return <p className="text-destructive">Failed to load stats.</p>;
  }

  // Add a check to ensure data is not undefined before rendering
  if (!data) {
    return <p className="text-muted-foreground">No stats available.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Competitors
          </CardTitle>
          <Radar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalCompetitors}</div>
          <p className="text-xs text-muted-foreground">
            Actively being monitored
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Products Tracked
          </CardTitle>
          <List className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            Across all competitors
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Price Changes (24h)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.priceDropsToday}</div>
          <p className="text-xs text-muted-foreground">
            In the last 24 hours
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCardsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Competitors</CardTitle>
                    <Radar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Products Tracked</CardTitle>
                    <List className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Price Changes (24h)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                </CardContent>
            </Card>
        </div>
    )
}
