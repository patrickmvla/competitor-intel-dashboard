CREATE TABLE "alert_recipients" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "alert_recipients_email_unique" UNIQUE("email")
);
