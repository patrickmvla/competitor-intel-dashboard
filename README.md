# Real-Time Competitor Intelligence Dashboard

This project is a powerful, full-stack dashboard designed to track competitor product pricing and stock levels in real-time. It leverages a modern, type-safe tech stack to provide a robust and scalable solution for e-commerce businesses and market analysts.

The application allows users to dynamically add competitors and specific product URLs to monitor. It then uses a sophisticated scraping service to fetch data, identifies changes, stores historical snapshots, and visualizes price history, all while providing a clean, modern user interface.

## 🔥 Key Features

- **Dynamic Competitor Management:** Easily add, view, and manage a list of competitor websites to track.
- **Product Tracking:** Associate specific product URLs with each competitor for targeted monitoring.
- **Automated Batch Scraping:** Trigger a global scraping job that efficiently fetches data for all tracked products in a single, resilient batch operation.
- **Intelligent Change Detection:** Uses Firecrawl's advanced capabilities to only process and store data when a price or stock status has actually changed.
- **Historical Price Visualization:** View interactive charts of price history for any tracked product to identify trends and competitor strategies.
- **Dynamic Email Alerts:** Manage a list of recipients who will receive beautifully formatted email alerts when a price drop is detected.
- **Modern Dashboard UI:** A clean, responsive interface built with Shadcn UI, featuring stat cards and a card-based layout for a professional user experience.
- **Automated Cron Jobs:** Scrapes can be scheduled to run automatically, ensuring data is always up-to-date without manual intervention.

## 🛠️ Tech Stack

This project is built with a cutting-edge, fully type-safe stack:

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/) for components
- **API Layer:** [tRPC](https://trpc.io/) for end-to-end type-safe APIs
- **Database:** [PostgreSQL](https://www.postgresql.org/) (hosted on [Supabase](https://supabase.com/))
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) for type-safe database queries
- **Scraping Service:** [Firecrawl](https://firecrawl.dev/) for resilient, AI-powered web scraping
- **Client State Management:** [TanStack Query](https://tanstack.com/query/latest) (via tRPC)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
- **Email:** [Resend](https://resend.com/) for sending transactional emails
- **Deployment:** [Vercel](https://vercel.com/) (with Vercel Cron Jobs)
- **Runtime:** [Bun](https://bun.sh/)

## 🚀 Getting Started

Follow these steps to get the project running locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd competitor-intel-dashboard
```

### 2. Install Dependencies

This project uses [Bun](https://bun.sh/) as the package manager.

```bash
bun install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add the following variables.

```
# Supabase Database Connection String (use the Connection Pooler URI)
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[YOUR_POOLER_HOSTNAME]:6543/postgres"

# Firecrawl API Key
FIRECRAWL_API_KEY="fc-..."

# Resend API Key
RESEND_API_KEY="re_..."
```

### 4. Run Database Migrations

Push the Drizzle schema to your Supabase database to create all the necessary tables.

```bash
bun run db:push
```

### 5. Run the Development Server

Start the Next.js development server.

```bash
bun dev
```

The application should now be running at `http://localhost:3000`.

## 📈 Future Enhancements

- **Real-time Alerts:** Integrate Slack/Discord webhooks for instant notifications.
- **Advanced Analytics:** Build more complex dashboard queries to track pricing velocity and competitor trends.
- **Screenshot Storage:** Implement Cloudflare R2 or S3 to store screenshot evidence from scrapes.
- **User Authentication:** Add user accounts to create a multi-tenant application.
