"use client";

import { trpc } from "@/lib/trpc/client";
import { AddProductForm } from "./add-product-form";
import { ProductListItem } from "./product-list-item";

interface ProductListProps {
  competitorId: number;
}

export function ProductList({ competitorId }: ProductListProps) {
  const { data: products, isLoading, error } = trpc.product.getByCompetitorId.useQuery({ competitorId });

  return (
    <div className="pl-4 pt-4 border-t">
      <div className="p-4 border rounded-lg bg-muted/50">
         <h4 className="text-lg font-semibold mb-4">Add a New Product to Track</h4>
        <AddProductForm competitorId={competitorId} />
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">Tracked Products</h4>
        {isLoading && <p>Loading products...</p>}
        {error && <p className="text-destructive">Error: {error.message}</p>}
        {products && products.length > 0 ? (
          <ul className="divide-y">
            {products.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </ul>
        ) : (
          !isLoading && <p className="text-sm text-muted-foreground text-center py-4">No products are being tracked for this competitor yet.</p>
        )}
      </div>
    </div>
  );
}
