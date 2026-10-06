"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type StockBatch = {
  id: string;
  buyingPrice: number;
  sellingPrice: number;
  purchaseDate: string;
  quantity: number;
  remainingQuantity: number;
};

type SellPhoneDialogProps = {
  phoneName: string;
  stockBatches: StockBatch[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SellPhoneDialog({
  phoneName,
  stockBatches,
  open,
  onOpenChange,
}: SellPhoneDialogProps) {
  const availableBatches = stockBatches.filter(
    (batch) => batch.remainingQuantity > 0,
  );

  const [selectedBatchId, setSelectedBatchId] = useState(
    availableBatches[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState("1");

  const selectedBatch = availableBatches.find(
    (batch) => batch.id === selectedBatchId,
  );

  const saleQuantity = Math.max(Number(quantity) || 0, 0);

  const totalAmount = selectedBatch
    ? saleQuantity * selectedBatch.sellingPrice
    : 0;

  const totalProfit = selectedBatch
    ? saleQuantity * (selectedBatch.sellingPrice - selectedBatch.buyingPrice)
    : 0;

  function handleOpenChange(value: boolean) {
    if (value) {
      const firstBatch = stockBatches.find(
        (batch) => batch.remainingQuantity > 0,
      );

      setSelectedBatchId(firstBatch?.id ?? "");
      setQuantity("1");
    }

    onOpenChange(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            Sell Phone
          </DialogTitle>

          <DialogDescription>Record a sale for {phoneName}.</DialogDescription>
        </DialogHeader>

        {availableBatches.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <p className="text-sm font-medium">No stock available</p>

            <p className="mt-1 text-sm text-muted-foreground">
              This phone currently has no remaining stock.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="sell-stock-batch">Stock Batch</Label>

              <select
                id="sell-stock-batch"
                value={selectedBatchId}
                onChange={(event) => setSelectedBatchId(event.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {availableBatches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {new Date(batch.purchaseDate).toLocaleDateString("en-GB")} —
                    ৳{batch.sellingPrice.toLocaleString("en-BD")} —{" "}
                    {batch.remainingQuantity} available
                  </option>
                ))}
              </select>
            </div>

            {selectedBatch && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">
                      Buying price
                    </p>

                    <p className="mt-1 font-semibold">
                      ৳{selectedBatch.buyingPrice.toLocaleString("en-BD")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">
                      Selling price
                    </p>

                    <p className="mt-1 font-semibold">
                      ৳{selectedBatch.sellingPrice.toLocaleString("en-BD")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sell-quantity">Quantity</Label>

                  <Input
                    id="sell-quantity"
                    type="number"
                    min="1"
                    max={selectedBatch.remainingQuantity}
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />

                  <p className="text-xs text-muted-foreground">
                    Available: {selectedBatch.remainingQuantity}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total amount
                    </span>

                    <span className="text-lg font-semibold">
                      ৳{totalAmount.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Estimated profit
                    </span>

                    <span className="font-semibold text-green-600">
                      ৳{totalProfit.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full gap-2"
                  disabled={
                    saleQuantity < 1 ||
                    saleQuantity > selectedBatch.remainingQuantity
                  }
                  onClick={() => {
                    // Database sale action will be added next.
                  }}
                >
                  <ShoppingCart className="size-4" />
                  Complete Sale
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
