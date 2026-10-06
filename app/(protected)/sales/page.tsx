import { Banknote, Package, ShoppingCart, TrendingUp } from "lucide-react";

import { SalesFilters } from "@/components/Sales/SalesFilters";
import { SalesList } from "@/components/Sales/SalesList";
import { getSales, getSalesSummary } from "@/lib/sales";

type SalesPageProps = {
  searchParams: Promise<{
    search?: string;
    from?: string;
    to?: string;
  }>;
};

export default async function SalesPage({ searchParams }: SalesPageProps) {
  const params = await searchParams;

  const filters = {
    search: params.search,
    from: params.from,
    to: params.to,
  };

  const [sales, summary] = await Promise.all([
    getSales(filters),
    getSalesSummary(filters),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales History</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View completed sales, revenue, and profit.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          title="Total Sales"
          value={summary.totalSales.toLocaleString("en-BD")}
          icon={<ShoppingCart className="size-5" />}
        />

        <SummaryCard
          title="Phones Sold"
          value={summary.totalQuantity.toLocaleString("en-BD")}
          icon={<Package className="size-5" />}
        />

        <SummaryCard
          title="Revenue"
          value={`৳${summary.totalAmount.toLocaleString("en-BD")}`}
          icon={<Banknote className="size-5" />}
        />

        <SummaryCard
          title="Profit"
          value={`৳${summary.totalProfit.toLocaleString("en-BD")}`}
          icon={<TrendingUp className="size-5" />}
        />
      </div>

      <SalesFilters
        search={params.search ?? ""}
        from={params.from ?? ""}
        to={params.to ?? ""}
      />

      <SalesList sales={sales} />
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}

        <span className="text-xs sm:text-sm">{title}</span>
      </div>

      <p className="mt-2 truncate text-lg font-bold sm:text-xl">{value}</p>
    </div>
  );
}
