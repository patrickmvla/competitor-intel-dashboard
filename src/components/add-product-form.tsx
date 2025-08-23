"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  productUrl: z.string().url("Please enter a valid product URL."),
});

interface AddProductFormProps {
  competitorId: number;
}

export function AddProductForm({ competitorId }: AddProductFormProps) {
  const utils = trpc.useUtils();
  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => {
      // Invalidate the query for this specific competitor's product list
      utils.product.getByCompetitorId.invalidate({ competitorId });
      form.reset();
    },
    onError: (error) => {
      console.error("Failed to create product:", error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      productUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createProduct.mutate({ ...values, competitorId });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Nike Air Max" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="productUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createProduct.isPending}>
          {createProduct.isPending ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
