"use client";

import { trpc } from "@/lib/trpc/client";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Zap } from "lucide-react";

export function ScrapeAllButton() {
  const scrapeAll = trpc.scraper.runForAllProducts.useMutation({
    onSuccess: (data) => {
      toast.success("Scraping Job Complete", {
        description: data.message,
      });
    },
    onError: (error) => {
      toast.error("Scraping Job Failed", {
        description: error.message,
      });
    },
  });

  const handleScrape = () => {
    toast.info("Starting scraping job...", {
      description: "This may take a few moments."
    });
    scrapeAll.mutate();
  };

  return (
    <Button onClick={handleScrape} disabled={scrapeAll.isPending}>
      <Zap className="mr-2 h-4 w-4" />
      {scrapeAll.isPending ? "Scraping in Progress..." : "Scrape All Products"}
    </Button>
  );
}
