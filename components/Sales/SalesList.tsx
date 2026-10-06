"use client";

import { CalendarDays, ChevronDown, ChevronUp, User } from "lucide-react";

import { useState } from "react";

type SalesListProps = {
  sales: Awaited<ReturnType<typeof import("@/lib/sales").getSales>>;
};

export function SalesList({ sales }: SalesListProps) {
  if (sales.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="font-medium">No sales found</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Completed sales will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sales.map((sale) => (
        <SaleCard key={sale.id} sale={sale} />
      ))}
    </div>
  );
}

function SaleCard({ sale }: { sale: SalesListProps["sales"][number] }) {
  const [expanded, setExpanded] = useState(false);

  const quantity = sale.items.reduce((total, item) => total + item.quantity, 0);

  const firstItem = sale.items[0];

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <button
        type="button"
        className="w-full text-left"
        onClick={() => setExpanded((value) => !value)}
      >
        <div className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate font-semibold">
                  {firstItem?.stockBatch.phone.brand.name}{" "}
                  {firstItem?.stockBatch.phone.name}
                </h2>

                {sale.items.length > 1 && (
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs">
                    +{sale.items.length - 1}
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3.5" />

                  {new Date(sale.saleDate).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>

                <span className="flex items-center gap-1">
                  <User className="size-3.5" />

                  {sale.user.name}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t pt-3 sm:border-t-0 sm:pt-0">
              <Stat label="Qty" value={quantity.toLocaleString("en-BD")} />

              <Stat
                label="Revenue"
                value={`৳${Number(sale.totalAmount).toLocaleString("en-BD")}`}
              />

              <Stat
                label="Profit"
                value={`৳${Number(sale.totalProfit).toLocaleString("en-BD")}`}
                positive
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end text-muted-foreground">
            {expanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t bg-muted/20 p-4">
          <div className="space-y-3">
            {sale.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {item.stockBatch.phone.brand.name}{" "}
                    {item.stockBatch.phone.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.stockBatch.phone.ram}GB RAM ·{" "}
                    {item.stockBatch.phone.rom}GB ROM
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.quantity} × ৳
                    {Number(item.sellingPrice).toLocaleString("en-BD")}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-semibold">
                    ৳
                    {(Number(item.sellingPrice) * item.quantity).toLocaleString(
                      "en-BD",
                    )}
                  </p>

                  <p className="mt-1 text-xs text-green-600">
                    Profit ৳{Number(item.profit).toLocaleString("en-BD")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2 border-t pt-4 text-sm sm:grid-cols-3">
            <div>
              <span className="text-muted-foreground">Sale ID</span>

              <p className="mt-1 break-all font-mono text-xs">{sale.id}</p>
            </div>

            <div>
              <span className="text-muted-foreground">Sold by</span>

              <p className="mt-1 font-medium">{sale.user.name}</p>
            </div>

            <div>
              <span className="text-muted-foreground">Username</span>

              <p className="mt-1 font-medium">{sale.user.username}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>

      <p
        className={`mt-0.5 text-sm font-semibold ${
          positive ? "text-green-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
