import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpRight,
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your mobile shop inventory.
        </p>
      </div>

      {/* Inventory cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Phones in Stock"
          value={summary.totalUnits.toLocaleString("en-BD")}
          subtitle={`${summary.totalPhones} phone models`}
          icon={<Package className="size-5" />}
        />

        <DashboardCard
          title="Buying Value"
          value={formatCurrency(summary.totalBuyingValue)}
          subtitle="Current stock cost"
          icon={<ArrowDownToLine className="size-5" />}
        />

        <DashboardCard
          title="Selling Value"
          value={formatCurrency(summary.totalSellingValue)}
          subtitle="Potential revenue"
          icon={<Wallet className="size-5" />}
        />

        <DashboardCard
          title="Potential Profit"
          value={formatCurrency(summary.potentialProfit)}
          subtitle="If all stock is sold"
          icon={<ArrowUpRight className="size-5" />}
        />
      </div>

      {/* Sales cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardCard
          title="Total Sales"
          value={summary.totalSales.toLocaleString("en-BD")}
          subtitle="Completed sales"
          icon={<ShoppingCart className="size-5" />}
        />

        <DashboardCard
          title="Sales Revenue"
          value={formatCurrency(summary.totalRevenue)}
          subtitle="All completed sales"
          icon={<Wallet className="size-5" />}
        />

        <DashboardCard
          title="Sales Profit"
          value={formatCurrency(summary.totalProfit)}
          subtitle="Realized profit"
          icon={<TrendingUp className="size-5" />}
        />
      </div>

      {/* Lower sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low stock */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Low Stock</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Phones with 3 or fewer units remaining.
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {summary.lowStock.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm font-medium">Stock levels look good</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  No phones are currently low in stock.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {summary.lowStock.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.phone.brand.name} {item.phone.name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.phone.ram}GB RAM · {item.phone.rom}GB ROM
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-sm font-semibold ${
                          item.remainingQuantity === 1
                            ? "text-destructive"
                            : "text-amber-600"
                        }`}
                      >
                        {item.remainingQuantity} left
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatCurrency(item.sellingPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Your latest completed sales.
            </p>
          </CardHeader>

          <CardContent>
            {summary.recentSales.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm font-medium">No sales yet</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Completed sales will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {summary.recentSales.map((sale) => {
                  const quantity = sale.items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  );

                  const firstItem = sale.items[0];

                  return (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {firstItem?.brandName} {firstItem?.phoneName}
                        </p>

                        {sale.items.length > 1 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            +{sale.items.length - 1} more item
                            {sale.items.length - 1 > 1 ? "s" : ""}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-muted-foreground">
                          {quantity} phone
                          {quantity !== 1 ? "s" : ""} ·{" "}
                          {new Date(sale.saleDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold">
                          {formatCurrency(sale.totalAmount)}
                        </p>

                        <p className="mt-1 text-xs text-green-600">
                          +{formatCurrency(sale.totalProfit)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="mt-2 truncate text-2xl font-semibold">{value}</p>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
