"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Brand = {
  id: string;
  name: string;
};

type SearchSuggestion = {
  id: string;
  name: string;
  ram: number;
  rom: number;
  brand: {
    id: string;
    name: string;
  };
};

type InventoryFiltersProps = {
  brands: Brand[];
};

export function InventoryFilters({ brands }: InventoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const [brandId, setBrandId] = useState(searchParams.get("brand") ?? "");

  const [ram, setRam] = useState(searchParams.get("ram") ?? "");

  const [rom, setRom] = useState(searchParams.get("rom") ?? "");

  const [sort, setSort] = useState(searchParams.get("sort") ?? "");

  const [batchFrom, setBatchFrom] = useState(
    searchParams.get("batchFrom") ?? "",
  );

  const [batchTo, setBatchTo] = useState(searchParams.get("batchTo") ?? "");

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");

  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const [dateError, setDateError] = useState("");

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const skipNextSuggestionFetch = useRef(false);

  /*
   * Fetch search suggestions with debounce.
   */
  useEffect(() => {
    const query = search.trim();

    let cancelled = false;
    if (skipNextSuggestionFetch.current) {
      skipNextSuggestionFetch.current = false;
      return;
    }

    if (query.length < 2) {
      const timer = window.setTimeout(() => {
        if (cancelled) return;

        setSuggestions([]);
        setIsLoadingSuggestions(false);
      }, 0);

      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    const timer = window.setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);

        const response = await fetch(
          `/api/inventory/search?q=${encodeURIComponent(query)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search suggestions.");
        }

        const data = (await response.json()) as SearchSuggestion[];

        if (!cancelled) {
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Search suggestion error:", error);

        if (!cancelled) {
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSuggestions(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [search]);

  /*
   * Close suggestions when clicking outside.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSearchChange(value: string) {
    setSearch(value);

    if (value.trim().length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }

  function handleSuggestionSelect(suggestion: SearchSuggestion) {
    skipNextSuggestionFetch.current = true;

    setSearch(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsLoadingSuggestions(false);

    const params = new URLSearchParams(searchParams.toString());

    params.set("search", suggestion.name);

    router.push(`/inventory?${params.toString()}`);
  }

  function handleApplyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (batchFrom && batchTo && batchFrom > batchTo) {
      setDateError("Purchase date 'From' cannot be later than 'To'.");
      return;
    }

    setDateError("");

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (brandId) {
      params.set("brand", brandId);
    }

    if (ram) {
      params.set("ram", ram);
    }

    if (rom) {
      params.set("rom", rom);
    }

    if (sort) {
      params.set("sort", sort);
    }

    if (batchFrom) {
      params.set("batchFrom", batchFrom);
    }

    if (batchTo) {
      params.set("batchTo", batchTo);
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    }

    const query = params.toString();

    router.push(query ? `/inventory?${query}` : "/inventory");

    setShowSuggestions(false);
  }

  function handleClear() {
    setSearch("");
    setBrandId("");
    setRam("");
    setRom("");
    setSort("");
    setBatchFrom("");
    setBatchTo("");
    setMinPrice("");
    setMaxPrice("");
    setDateError("");
    setSuggestions([]);
    setShowSuggestions(false);

    router.push("/inventory");
  }

  return (
    <form onSubmit={handleApplyFilters} className="space-y-5">
      {/* Search */}
      <div ref={searchContainerRef} className="relative">
        <Label htmlFor="inventory-search">Search phones</Label>

        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id="inventory-search"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            onFocus={() => {
              if (search.trim().length >= 2 && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Search phone or brand..."
            className="pl-9 pr-9"
            autoComplete="off"
          />

          {isLoadingSuggestions && (
            <div className="absolute right-3 top-1/2 size-4 -translate-y-1/2">
              <div className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
            </div>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && search.trim().length >= 2 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border bg-popover shadow-lg">
            {suggestions.length > 0 ? (
              <div className="max-h-72 overflow-y-auto p-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted active:bg-muted"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Search className="size-4 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {suggestion.brand.name} {suggestion.name}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {suggestion.ram}GB RAM · {suggestion.rom}GB ROM
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : !isLoadingSuggestions ? (
              <div className="px-4 py-5 text-center">
                <p className="text-sm font-medium">No phones found</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Try another phone name or brand.
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Brand / RAM / ROM */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="inventory-brand">Brand</Label>

          <select
            id="inventory-brand"
            value={brandId}
            onChange={(event) => setBrandId(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All brands</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inventory-ram">RAM</Label>

          <select
            id="inventory-ram"
            value={ram}
            onChange={(event) => setRam(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All RAM</option>
            <option value="2">2GB</option>
            <option value="3">3GB</option>
            <option value="4">4GB</option>
            <option value="6">6GB</option>
            <option value="8">8GB</option>
            <option value="12">12GB</option>
            <option value="16">16GB</option>
            <option value="24">24GB</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inventory-rom">ROM</Label>

          <select
            id="inventory-rom"
            value={rom}
            onChange={(event) => setRom(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All ROM</option>
            <option value="32">32GB</option>
            <option value="64">64GB</option>
            <option value="128">128GB</option>
            <option value="256">256GB</option>
            <option value="512">512GB</option>
            <option value="1024">1TB</option>
          </select>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label htmlFor="inventory-sort">Sort by price</Label>

        <select
          id="inventory-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Default</option>
          <option value="buying-asc">Buying price: Low to High</option>
          <option value="buying-desc">Buying price: High to Low</option>
          <option value="selling-asc">Selling price: Low to High</option>
          <option value="selling-desc">Selling price: High to Low</option>
        </select>
      </div>

      {/* Purchase date */}
      <div className="space-y-2">
        <Label>Purchase date range</Label>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label
              htmlFor="inventory-batch-from"
              className="text-xs text-muted-foreground"
            >
              From
            </Label>

            <Input
              id="inventory-batch-from"
              type="date"
              value={batchFrom}
              onChange={(event) => {
                setBatchFrom(event.target.value);
                setDateError("");
              }}
              className="mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="inventory-batch-to"
              className="text-xs text-muted-foreground"
            >
              To
            </Label>

            <Input
              id="inventory-batch-to"
              type="date"
              value={batchTo}
              onChange={(event) => {
                setBatchTo(event.target.value);
                setDateError("");
              }}
              className="mt-1"
            />
          </div>
        </div>

        {dateError && <p className="text-sm text-destructive">{dateError}</p>}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label>Selling price range</Label>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label
              htmlFor="inventory-min-price"
              className="text-xs text-muted-foreground"
            >
              Minimum
            </Label>

            <Input
              id="inventory-min-price"
              type="number"
              min="0"
              placeholder="৳ Minimum"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label
              htmlFor="inventory-max-price"
              className="text-xs text-muted-foreground"
            >
              Maximum
            </Label>

            <Input
              id="inventory-max-price"
              type="number"
              min="0"
              placeholder="৳ Maximum"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleClear}
        >
          Clear
        </Button>

        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={Boolean(batchFrom && batchTo && batchFrom > batchTo)}
        >
          Apply Filters
        </Button>
      </div>
    </form>
  );
}
