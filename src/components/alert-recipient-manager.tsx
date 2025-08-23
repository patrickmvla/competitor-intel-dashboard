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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export function AlertRecipientManager() {
  const utils = trpc.useUtils();
  const { data: recipients, isLoading } = trpc.alertRecipient.getAll.useQuery();

  const addRecipient = trpc.alertRecipient.create.useMutation({
    onSuccess: () => {
      utils.alertRecipient.getAll.invalidate();
      form.reset();
      toast.success("Recipient added successfully.");
    },
    onError: (error) => {
      toast.error("Failed to add recipient", { description: error.message });
    },
  });

  const deleteRecipient = trpc.alertRecipient.delete.useMutation({
    onSuccess: () => {
      utils.alertRecipient.getAll.invalidate();
      toast.success("Recipient removed successfully.");
    },
    onError: (error) => {
      toast.error("Failed to remove recipient", { description: error.message });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addRecipient.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Alert Recipients</CardTitle>
        <CardDescription>
          Manage the list of emails that receive price drop notifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={addRecipient.isPending}>
              {addRecipient.isPending ? "Adding..." : "Add"}
            </Button>
          </form>
        </Form>

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Current Recipients</h4>
          {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
          <ul className="divide-y">
            {recipients?.map((recipient) => (
              <li key={recipient.id} className="flex items-center justify-between py-2">
                <span className="text-sm">{recipient.email}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteRecipient.mutate({ id: recipient.id })}
                  disabled={deleteRecipient.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          {!isLoading && recipients?.length === 0 && (
            <p className="text-sm text-center text-muted-foreground py-4">No recipients have been added.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
