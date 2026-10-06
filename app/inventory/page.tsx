import Link from "next/link";
import { Plus } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InventoryPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your mobile phone stock.
          </p>
        </div>

        <Link
          href="/inventory/add"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Add Phone
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phone Inventory</CardTitle>
          <CardDescription>
            Your phones and available stock will appear here.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">
              No inventory records yet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
