import { z } from "zod";
import { alertRecipients } from "@/server/db/schema";
import { router, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";

export const alertRecipientRouter = router({
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Using 'onConflictDoNothing' to gracefully handle duplicate email entries
      const newRecipient = await ctx.db
        .insert(alertRecipients)
        .values(input)
        .onConflictDoNothing()
        .returning();
      return newRecipient[0];
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.alertRecipients.findMany();
  }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // FIX: Use the 'eq' operator for the where clause
      await ctx.db.delete(alertRecipients).where(eq(alertRecipients.id, input.id));
      return { success: true };
    }),
});
