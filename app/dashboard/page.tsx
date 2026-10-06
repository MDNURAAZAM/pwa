import {
  ArrowDownToLine,
  ArrowUpRight,
  Package,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getDashboardSummary } from "@/lib/dashboard";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your mobile shop inventory.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Phones in Stock</p>

              <p className="mt-2 text-2xl font-semibold">
                {summary.totalPhones}
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Package className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Buying Value</p>

              <p className="mt-2 text-2xl font-semibold">
                {formatCurrency(summary.totalBuyingValue)}
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <ArrowDownToLine className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Selling Value</p>

              <p className="mt-2 text-2xl font-semibold">
                {formatCurrency(summary.totalSellingValue)}
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Wallet className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Potential Profit</p>

              <p className="mt-2 text-2xl font-semibold">
                {formatCurrency(summary.potentialProfit)}
              </p>
            </div>

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <ArrowUpRight className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingCart className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">Inventory Overview</h2>

              <p className="text-sm text-muted-foreground">
                Your inventory statistics will appear here.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
