import Link from "next/link";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAvailableBrands, getInventory } from "@/lib/inventory";
import { InventoryFilters } from "@/components/InventoryFilters/InventoryFilters";
import { PhoneCardActions } from "@/components/InventoryActions/PhoneCardActions";

type InventoryPageProps = {
  searchParams: Promise<{
    search?: string;
    brand?: string;
    ram?: string;
    rom?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    batchFrom?: string;
    batchTo?: string;
  }>;
};

export default async function InventoryPage({
  searchParams,
}: InventoryPageProps) {
  const params = await searchParams;

  const search = params.search ?? "";
  const brandId = params.brand ?? "";

  const ram = params.ram ? Number(params.ram) : undefined;
  const rom = params.rom ? Number(params.rom) : undefined;

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;

  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const batchFrom = params.batchFrom ?? "";
  const batchTo = params.batchTo ?? "";

  const sort =
    params.sort === "buying-asc" ||
    params.sort === "buying-desc" ||
    params.sort === "selling-asc" ||
    params.sort === "selling-desc"
      ? params.sort
      : undefined;

  const [phones, brands] = await Promise.all([
    getInventory({
      search,
      brandId,
      ram,
      rom,
      minPrice,
      maxPrice,
      batchFrom,
      batchTo,
      sort,
    }),
    getAvailableBrands(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Inventory
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage your mobile phone stock.
          </p>
        </div>

        <Link
          href="/inventory/add"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Add Phone
        </Link>
      </div>

      <InventoryFilters brands={brands} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Inventory</h2>

          <p className="text-sm text-muted-foreground">
            {phones.length} {phones.length === 1 ? "phone" : "phones"} found
          </p>
        </div>
      </div>

      {/* Inventory Card */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/20 px-4 py-5 sm:px-6">
          <CardTitle className="text-lg">Phone Inventory</CardTitle>

          <CardDescription>
            {phones.length} phone model
            {phones.length === 1 ? "" : "s"} in your inventory.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 py-5 sm:px-6 sm:py-6">
          {phones.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                No inventory records yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {phones.map((phone) => {
                const totalQuantity = phone.stockBatches.reduce(
                  (total, batch) => total + batch.quantity,
                  0,
                );

                const remainingQuantity = phone.stockBatches.reduce(
                  (total, batch) => total + batch.remainingQuantity,
                  0,
                );

                const latestBatch = phone.stockBatches[0];

                const buyingPrice = latestBatch
                  ? Number(latestBatch.buyingPrice)
                  : 0;

                const sellingPrice = latestBatch
                  ? Number(latestBatch.sellingPrice)
                  : 0;

                const profitPerUnit = sellingPrice - buyingPrice;

                const latestPurchaseDate = latestBatch
                  ? latestBatch.purchaseDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : null;

                const isOutOfStock = remainingQuantity === 0;

                return (
                  <article
                    key={phone.id}
                    className="rounded-2xl border bg-card p-4 shadow-sm"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            {phone.brand.name}
                          </span>

                          {isOutOfStock ? (
                            <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                              Out of stock
                            </span>
                          ) : (
                            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              In stock
                            </span>
                          )}
                        </div>

                        <h2 className="truncate text-base font-semibold">
                          {phone.name}
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {phone.ram} GB RAM ·{" "}
                          {phone.rom >= 1024 ? "1 TB" : `${phone.rom} GB`} ROM
                        </p>
                      </div>
                    </div>

                    {/* Stock summary */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">
                          Remaining
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                          {remainingQuantity}
                        </p>
                      </div>

                      <div className="rounded-xl bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">
                          Total stock
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                          {totalQuantity}
                        </p>
                      </div>
                    </div>

                    {/* Pricing */}
                    {/* Latest batch */}
                    <div className="mt-3 rounded-xl border bg-muted/20 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Latest stock batch
                          </p>

                          {latestPurchaseDate && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Purchased {latestPurchaseDate}
                            </p>
                          )}
                        </div>

                        {latestBatch && (
                          <span className="shrink-0 rounded-md bg-background px-2 py-1 text-xs font-medium">
                            Qty {latestBatch.quantity}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-background p-3">
                          <p className="text-xs text-muted-foreground">
                            Buying price
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            ৳{buyingPrice.toLocaleString("en-BD")}
                          </p>
                        </div>

                        <div className="rounded-lg bg-background p-3">
                          <p className="text-xs text-muted-foreground">
                            Selling price
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            ৳{sellingPrice.toLocaleString("en-BD")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profit */}
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-primary/5 px-3 py-2.5">
                      <span className="text-sm text-muted-foreground">
                        Profit / unit
                      </span>

                      <span
                        className={`text-sm font-semibold ${
                          profitPerUnit >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-destructive"
                        }`}
                      >
                        {profitPerUnit >= 0 ? "+" : ""}৳
                        {profitPerUnit.toLocaleString("en-BD")}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-4">
                      <PhoneCardActions
                        phone={{
                          id: phone.id,
                          name: phone.name,
                          ram: phone.ram,
                          rom: phone.rom,
                          brand: {
                            id: phone.brand.id,
                            name: phone.brand.name,
                          },
                          stockBatches: phone.stockBatches.map((batch) => ({
                            id: batch.id,
                            buyingPrice: Number(batch.buyingPrice),
                            sellingPrice: Number(batch.sellingPrice),
                            purchaseDate: batch.purchaseDate
                              .toISOString()
                              .slice(0, 10),
                            quantity: batch.quantity,
                            remainingQuantity: batch.remainingQuantity,
                          })),
                        }}
                        brands={brands}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
