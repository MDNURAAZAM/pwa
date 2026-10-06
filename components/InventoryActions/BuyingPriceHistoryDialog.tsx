"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type StockBatch = {
  id: string;
  buyingPrice: number;
  sellingPrice: number;
  purchaseDate: string;
  quantity: number;
  remainingQuantity: number;
};

type BuyingPriceHistoryDialogProps = {
  phoneName: string;
  stockBatches: StockBatch[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BuyingPriceHistoryDialog({
  phoneName,
  stockBatches,
  open,
  onOpenChange,
}: BuyingPriceHistoryDialogProps) {
  const chartData = [...stockBatches]
    .sort(
      (a, b) =>
        new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime(),
    )
    .map((batch) => ({
      date: new Date(batch.purchaseDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      buyingPrice: batch.buyingPrice,
    }));

  const prices = chartData.map((item) => item.buyingPrice);

  const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LineChartIcon className="size-5" />
            Buying Price History
          </DialogTitle>

          <DialogDescription>
            {phoneName} — buying price across stock batches.
          </DialogDescription>
        </DialogHeader>

        {chartData.length === 0 ? (
          <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed">
            <p className="text-sm text-muted-foreground">
              No stock batch history available.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-72 w-full rounded-xl border bg-muted/10 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickMargin={8}
                  />

                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) =>
                      `৳${Number(value).toLocaleString("en-BD")}`
                    }
                    width={75}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `৳${Number(value).toLocaleString("en-BD")}`,
                      "Buying price",
                    ]}
                    labelFormatter={(label) => `Purchased: ${label}`}
                  />

                  <Line
                    type="monotone"
                    dataKey="buyingPrice"
                    name="Buying price"
                    stroke="currentColor"
                    strokeWidth={3}
                    dot={{
                      r: 5,
                    }}
                    activeDot={{
                      r: 7,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Stock batches</p>

                <p className="mt-1 text-lg font-semibold">{chartData.length}</p>
              </div>

              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  Highest buying price
                </p>

                <p className="mt-1 text-lg font-semibold">
                  ৳{highestPrice.toLocaleString("en-BD")}
                </p>
              </div>

              <div className="col-span-2 rounded-xl bg-muted/50 p-3 sm:col-span-1">
                <p className="text-xs text-muted-foreground">
                  Lowest buying price
                </p>

                <p className="mt-1 text-lg font-semibold">
                  ৳{lowestPrice.toLocaleString("en-BD")}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
