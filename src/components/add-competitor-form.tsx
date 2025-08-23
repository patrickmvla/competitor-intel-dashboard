"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  baseUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  
  isHighRisk: z.boolean(),
});

export function AddCompetitorForm() {
  const utils = trpc.useUtils();
  const createCompetitor = trpc.competitor.create.useMutation({
    onSuccess: () => {
      utils.competitor.getAll.invalidate();
      form.reset();
    },
    onError: (error) => {
      // You can handle errors here, e.g., show a toast notification
      console.error("Failed to create competitor:", error);
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      baseUrl: "",
      // The default value is now handled exclusively by react-hook-form
      isHighRisk: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createCompetitor.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Competitor Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Amazon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baseUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.amazon.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="isHighRisk"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  High-Risk Target
                </FormLabel>
                <FormDescription>
                  Select this for sites with strong anti-bot measures (e.g., Amazon). This will use more robust scraping strategies.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createCompetitor.isPending}>
          {createCompetitor.isPending ? "Adding..." : "Add Competitor"}
        </Button>
      </form>
    </Form>
  );
}
