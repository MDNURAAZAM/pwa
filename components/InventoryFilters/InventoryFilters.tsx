"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type Brand = {
  id: string;
  name: string;
};

type InventoryFiltersProps = {
  brands: Brand[];
};

export function InventoryFilters({ brands }: InventoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const [minPriceInput, setMinPriceInput] = useState(
    searchParams.get("minPrice") ?? "",
  );

  const [maxPriceInput, setMaxPriceInput] = useState(
    searchParams.get("maxPrice") ?? "",
  );

  const brand = searchParams.get("brand") ?? "";
  const ram = searchParams.get("ram") ?? "";
  const rom = searchParams.get("rom") ?? "";
  const sort = searchParams.get("sort") ?? "";

  const selectedBrandName =
    brands.find((item) => item.id === brand)?.name ?? "";

  function updateFilters(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (brand) {
      params.set("brand", brand);
    }

    if (ram) {
      params.set("ram", ram);
    }

    if (rom) {
      params.set("rom", rom);
    }

    if (minPriceInput) {
      params.set("minPrice", minPriceInput);
    }

    if (maxPriceInput) {
      params.set("maxPrice", maxPriceInput);
    }

    if (sort) {
      params.set("sort", sort);
    }

    const query = params.toString();

    router.push(query ? `/inventory?${query}` : "/inventory");
  }

  function clearFilters() {
    setSearch("");
    setMinPriceInput("");
    setMaxPriceInput("");

    router.push("/inventory");
  }

  function handleSelectChange(key: string, value: string | null) {
    if (!value) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();

    router.push(query ? `/inventory?${query}` : "/inventory");
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <SlidersHorizontal className="size-4 text-primary" />
          </div>

          <div>
            <h2 className="text-sm font-semibold">Search & Filters</h2>

            <p className="text-xs text-muted-foreground">Find phones quickly</p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-1.5 text-muted-foreground"
        >
          <X className="size-4" />
          Clear
        </Button>
      </div>

      <form onSubmit={updateFilters} className="space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search phone or brand..."
              className="h-11 pl-9"
            />
          </div>

          <Button type="submit" className="h-11 px-5">
            Search
          </Button>
        </div>

        <Separator />

        {/* Select filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <Select
            value={brand || "all"}
            onValueChange={(value) => handleSelectChange("brand", value)}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue>
                {brand ? selectedBrandName || "Select brand" : "All brands"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>

              {brands.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* RAM */}
          <Select
            value={ram || "all"}
            onValueChange={(value) => handleSelectChange("ram", value)}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue>{ram ? `${ram} GB` : "All RAM"}</SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All RAM</SelectItem>

              {[2, 3, 4, 6, 8, 12, 16, 24].map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value} GB
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ROM */}
          <Select
            value={rom || "all"}
            onValueChange={(value) => handleSelectChange("rom", value)}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue>
                {rom ? (rom === "1024" ? "1 TB" : `${rom} GB`) : "All ROM"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All ROM</SelectItem>

              {[32, 64, 128, 256, 512, 1024].map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value === 1024 ? "1 TB" : `${value} GB`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={sort || "newest"}
            onValueChange={(value) =>
              handleSelectChange("sort", value === "newest" ? "all" : value)
            }
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue>
                {sort === "selling-asc"
                  ? "Selling price: Low → High"
                  : sort === "selling-desc"
                    ? "Selling price: High → Low"
                    : sort === "buying-asc"
                      ? "Buying price: Low → High"
                      : sort === "buying-desc"
                        ? "Buying price: High → Low"
                        : "Newest first"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>

              <SelectItem value="selling-asc">
                Selling price: Low → High
              </SelectItem>

              <SelectItem value="selling-desc">
                Selling price: High → Low
              </SelectItem>

              <SelectItem value="buying-asc">
                Buying price: Low → High
              </SelectItem>

              <SelectItem value="buying-desc">
                Buying price: High → Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price range */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            min="0"
            placeholder="Min selling price"
            value={minPriceInput}
            onChange={(event) => setMinPriceInput(event.target.value)}
            name="minPrice"
            className="h-11"
          />

          <Input
            type="number"
            min="0"
            placeholder="Max selling price"
            value={maxPriceInput}
            onChange={(event) => setMaxPriceInput(event.target.value)}
            name="maxPrice"
            className="h-11"
          />
        </div>

        <Button type="submit" variant="secondary" className="w-full">
          Apply price range
        </Button>
      </form>
    </div>
  );
}
