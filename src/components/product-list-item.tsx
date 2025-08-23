"use client";

import { trpc } from "@/lib/trpc/client";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PriceHistoryChart } from "./price-history-chart";
import { ExternalLink, LineChart } from "lucide-react";

interface ProductListItemProps {
  product: {
    id: number;
    name: string;
    productUrl: string;
  };
}

export function ProductListItem({ product }: ProductListItemProps) {
  const { data: snapshot, isLoading } = trpc.priceSnapshot.getLatestByProductId.useQuery({
    productId: product.id,
  });

  const getStockVariant = (status?: string) => {
    if (status === 'IN_STOCK') return 'default';
    if (status === 'LOW_STOCK') return 'secondary';
    return 'destructive';
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <li className="py-4 cursor-pointer hover:bg-muted/50 -mx-4 px-4 rounded-lg transition-colors">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <a 
                href={product.productUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium hover:underline inline-flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {product.name}
                <ExternalLink className="h-3 w-3 ml-1.5 text-muted-foreground" />
              </a>
              <p className="text-sm text-muted-foreground truncate max-w-xs">
                {product.productUrl}
              </p>
            </div>
            {isLoading && <p className="text-sm text-muted-foreground">Loading data...</p>}
            {snapshot && (
              <div className="text-right flex items-center gap-4">
                 <LineChart className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-lg">${snapshot.price}</p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <Badge variant={getStockVariant(snapshot.stockStatus)}>
                      {snapshot.stockStatus.replace('_', ' ')}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(snapshot.extractedAt))} ago
                    </p>
                  </div>
                </div>
              </div>
            )}
             {!snapshot && !isLoading && (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </div>
        </li>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Price History for: {product.name}</DialogTitle>
        </DialogHeader>
        <PriceHistoryChart productId={product.id} />
      </DialogContent>
    </Dialog>
  );
}
