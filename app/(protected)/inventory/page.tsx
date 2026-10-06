import Link from "next/link";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInventory } from "@/lib/inventory";

export default async function InventoryPage() {
  const phones = await getInventory();

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
                const totalStock = phone.stockBatches.reduce(
                  (total, batch) => total + batch.remainingQuantity,
                  0,
                );

                const latestBatch = phone.stockBatches[0];

                return (
                  <div
                    key={phone.id}
                    className="rounded-xl border p-4 transition-colors hover:bg-muted/30 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Phone information */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold">
                            {phone.name}
                          </h3>

                          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                            {phone.brand.name}
                          </span>
                        </div>

                        <p className="mt-1.5 text-sm text-muted-foreground">
                          {phone.ram} GB RAM · {phone.rom} GB ROM
                        </p>
                      </div>

                      {/* Stock information */}
                      <div className="grid grid-cols-3 gap-5 sm:flex sm:items-center sm:gap-8">
                        <div>
                          <p className="text-xs text-muted-foreground">Stock</p>

                          <p className="mt-0.5 font-semibold">{totalStock}</p>
                        </div>

                        {latestBatch && (
                          <>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Buy
                              </p>

                              <p className="mt-0.5 font-medium">
                                ৳
                                {Number(
                                  latestBatch.buyingPrice,
                                ).toLocaleString()}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground">
                                Sell
                              </p>

                              <p className="mt-0.5 font-medium">
                                ৳
                                {Number(
                                  latestBatch.sellingPrice,
                                ).toLocaleString()}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
