"use client";

import { trpc } from "@/lib/trpc/client";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PriceHistoryChartProps {
  productId: number;
}

export function PriceHistoryChart({ productId }: PriceHistoryChartProps) {
  const { data, isLoading, error } = trpc.priceSnapshot.getHistoryByProductId.useQuery({ productId });

  if (isLoading) return <div className="text-center py-12">Loading chart data...</div>;
  if (error) return <div className="text-center py-12 text-destructive">Failed to load chart data.</div>;
  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No historical data available.</div>;
  }

  const chartData = data
    .map((snapshot) => ({
      date: format(new Date(snapshot.extractedAt), "MMM d, HH:mm"),
      price: parseFloat(snapshot.price),
    }))
    .reverse(); // Reverse to show oldest to newest

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(value) => `$${value}`} />
          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]} />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
