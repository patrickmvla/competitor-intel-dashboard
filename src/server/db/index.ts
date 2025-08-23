import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var client: postgres.Sql | undefined;
}

let client: postgres.Sql;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in your .env.local file");
}

const connectionOptions = {
  prepare: false,
};

if (process.env.NODE_ENV === "production") {
  client = postgres(process.env.DATABASE_URL, connectionOptions);
} else {
  if (!global.client) {
    global.client = postgres(process.env.DATABASE_URL, connectionOptions);
  }
  client = global.client;
}

export const db = drizzle(client, { schema });
