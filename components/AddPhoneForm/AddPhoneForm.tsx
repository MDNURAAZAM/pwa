"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { addPhone } from "@/app/inventory/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AddPhoneFormProps = {
  brands: string[];
};

export function AddPhoneForm({ brands }: AddPhoneFormProps) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = await addPhone(formData);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    router.push("/inventory");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      {/* Phone Information */}
      <section className="space-y-1">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 pt-2">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>

            <select
              id="brand"
              name="brand"
              required
              disabled={loading}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select brand</option>

              {brands?.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Phone Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Galaxy A15"
              autoComplete="off"
              required
              disabled={loading}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ram">RAM</Label>
            <div className="relative">
              <Input
                id="ram"
                name="ram"
                type="number"
                min="1"
                step="1"
                placeholder="8"
                required
                disabled={loading}
                className="h-11 pr-14"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                GB
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rom">ROM</Label>
            <div className="relative">
              <Input
                id="rom"
                name="rom"
                type="number"
                min="1"
                step="1"
                placeholder="128"
                required
                disabled={loading}
                className="h-11 pr-14"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                GB
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="border-t" /> */}

      {/* Stock Information */}
      <section className="space-y-5">
        {/* <div>
          <h3 className="text-sm font-semibold">Stock Information</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Enter pricing, purchase date, and available quantity.
          </p>
        </div> */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 pt-4">
          <div className="space-y-2">
            <Label htmlFor="buyingPrice">Buying Price</Label>
            <div className="relative">
              <Input
                id="buyingPrice"
                name="buyingPrice"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="18000"
                required
                disabled={loading}
                className="h-11 pr-14"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                BDT
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellingPrice">Selling Price</Label>
            <div className="relative">
              <Input
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="20000"
                required
                disabled={loading}
                className="h-11 pr-14"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                BDT
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
              disabled={loading}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              placeholder="5"
              required
              disabled={loading}
              className="h-11"
            />
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => router.push("/inventory")}
          className="h-11 w-full sm:w-auto"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full sm:min-w-32 sm:w-auto"
        >
          {loading ? "Adding..." : "Add Phone"}
        </Button>
      </div>
    </form>
  );
}
