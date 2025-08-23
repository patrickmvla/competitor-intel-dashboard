"use client";

import { trpc } from "@/lib/trpc/client";
import { ProductList } from "./product-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronsUpDown, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function CompetitorList() {
  const { data: competitors, isLoading, error } = trpc.competitor.getAll.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracked Competitors</CardTitle>
        <CardDescription>
          Click on a competitor to view and add products.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">Loading competitors...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Fetching Data</AlertTitle>
            <AlertDescription>
              There was a problem fetching the list of competitors. Please try refreshing the page.
              <pre className="mt-2 text-xs bg-background p-2 rounded">
                <code>{error.message}</code>
              </pre>
            </AlertDescription>
          </Alert>
        )}

        {competitors && competitors.length > 0 && (
          <div className="space-y-2">
            {competitors.map((competitor) => (
              <Collapsible key={competitor.id} className="border rounded-lg px-4">
                <CollapsibleTrigger className="w-full text-left">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{competitor.name}</p>
                      <p className="text-sm text-muted-foreground">{competitor.baseUrl}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {competitor.isHighRisk && (
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                          High Risk
                        </span>
                      )}
                      {/* FIX: Removed the nested Button component */}
                      <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ProductList competitorId={competitor.id} />
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}

        {!isLoading && !error && competitors?.length === 0 && (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No competitors added yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
