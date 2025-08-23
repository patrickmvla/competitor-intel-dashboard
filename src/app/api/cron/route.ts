import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const caller = appRouter.createCaller({ db });

    const result = await caller.scraper.runForAllProducts();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Cron job failed:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ message: "Cron job failed", error: errorMessage }),
      { status: 500 }
    );
  }
}
