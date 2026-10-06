"use client";

import { FormEvent, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addPhone } from "@/app/(protected)/inventory/actions";

type Brand = {
  id: string;
  name: string;
};

type AddPhoneFormProps = {
  brands: Brand[];
};

export function AddPhoneForm({ brands }: AddPhoneFormProps) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [brandOpen, setBrandOpen] = useState(false);
  const [brandId, setBrandId] = useState("");

  const selectedBrand = brands.find((brand) => brand.id === brandId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!brandId) {
      setError("Please select a brand.");
      return;
    }

    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.set("brandId", brandId);

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
      <section>
        <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2">
          {/* Brand */}
          <div className="space-y-2">
            <Label htmlFor="brandId">Brand</Label>

            <input type="hidden" name="brandId" value={brandId} />

            <Popover open={brandOpen} onOpenChange={setBrandOpen}>
              <PopoverTrigger
                className={cn(
                  "flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
                  "font-normal transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:pointer-events-none disabled:opacity-50",
                  !selectedBrand && "text-muted-foreground",
                )}
                disabled={loading}
                aria-expanded={brandOpen}
              >
                {selectedBrand ? selectedBrand.name : "Select brand"}

                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-[var(--radix-popover-trigger-width)] min-w-64 p-0"
              >
                <Command>
                  <CommandInput placeholder="Search brand..." />

                  <CommandList>
                    <CommandEmpty>No brand found.</CommandEmpty>

                    <CommandGroup>
                      {brands.map((brand) => (
                        <CommandItem
                          key={brand.id}
                          value={brand.name}
                          onSelect={() => {
                            setBrandId(brand.id);
                            setBrandOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              brandId === brand.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />

                          {brand.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Phone Name */}
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

          {/* RAM */}
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

          {/* ROM */}
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

      {/* Stock Information */}
      <section>
        <div className="grid grid-cols-1 gap-5 pt-5 sm:grid-cols-2">
          {/* Buying Price */}
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

          {/* Selling Price */}
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

          {/* Purchase Date */}
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

          {/* Quantity */}
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
          className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:justify-end">
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
