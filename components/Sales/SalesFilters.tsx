"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SalesFiltersProps = {
  search: string;
  from: string;
  to: string;
};

export function SalesFilters({ search, from, to }: SalesFiltersProps) {
  const router = useRouter();

  const [localSearch, setLocalSearch] = useState(search);
  const [localFrom, setLocalFrom] = useState(from);
  const [localTo, setLocalTo] = useState(to);

  function applyFilters() {
    const params = new URLSearchParams();

    if (localSearch.trim()) {
      params.set("search", localSearch.trim());
    }

    if (localFrom) {
      params.set("from", localFrom);
    }

    if (localTo) {
      params.set("to", localTo);
    }

    router.push(`/sales${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function clearFilters() {
    setLocalSearch("");
    setLocalFrom("");
    setLocalTo("");

    router.push("/sales");
  }

  const invalidDateRange = localFrom && localTo && localFrom > localTo;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="sales-search">Search</Label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="sales-search"
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Search phone or brand..."
              className="pl-9"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  applyFilters();
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sales-from">From</Label>

          <Input
            id="sales-from"
            type="date"
            value={localFrom}
            onChange={(event) => setLocalFrom(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sales-to">To</Label>

          <Input
            id="sales-to"
            type="date"
            value={localTo}
            onChange={(event) => setLocalTo(event.target.value)}
          />
        </div>
      </div>

      {invalidDateRange && (
        <p className="mt-2 text-sm text-destructive">
          The start date cannot be after the end date.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          onClick={applyFilters}
          disabled={!!invalidDateRange}
          className="gap-2"
        >
          <Search className="size-4" />
          Apply Filters
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
          className="gap-2"
        >
          <X className="size-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}
