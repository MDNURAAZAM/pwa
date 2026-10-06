import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAvailableBrands } from "@/lib/inventory";
import { AddPhoneForm } from "@/components/AddPhoneForm/AddPhoneForm";

export default async function AddPhonePage() {
  const brands = await getAvailableBrands();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 sm:space-y-6">
      <div>
        <Link
          href="/inventory"
          className="-ml-2 inline-flex h-9 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Inventory
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Add Phone
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Add a new phone model and stock information.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/20 px-4 py-1 sm:px-6">
          <CardTitle className="text-lg">Phone Information</CardTitle>

          <CardDescription>
            Fill in the details below to add this phone to your inventory.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 py-5 sm:px-2 sm:py-1">
          <AddPhoneForm brands={brands} />
        </CardContent>
      </Card>
    </div>
  );
}
