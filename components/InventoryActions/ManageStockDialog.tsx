"use client";

import { Plus, Pencil, Package } from "lucide-react";
import { useState, useTransition } from "react";

import {
  addStock,
  updateStockBatch,
} from "@/app/(protected)/inventory/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type StockBatch = {
  id: string;
  buyingPrice: number;
  sellingPrice: number;
  purchaseDate: string;
  quantity: number;
  remainingQuantity: number;
};

type ManageStockDialogProps = {
  phoneId: string;
  phoneName: string;
  stockBatches: StockBatch[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ManageStockDialog({
  phoneId,
  phoneName,
  stockBatches,
  open,
  onOpenChange,
}: ManageStockDialogProps) {
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const [message, setMessage] = useState("");

  function handleEdit(batchId: string) {
    setMessage("");
    setEditingBatchId(batchId);
  }

  function handleCancelEdit() {
    if (isPending) {
      return;
    }

    setEditingBatchId(null);
    setMessage("");
  }

  function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setMessage("");

    startTransition(async () => {
      const result = await updateStockBatch(formData);

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setEditingBatchId(null);
      setMessage("Stock updated successfully.");
    });
  }

  function handleAddStock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setMessage("");

    startTransition(async () => {
      const result = await addStock(formData);

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      form.reset();

      setMessage("New stock added successfully.");
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) {
          setMessage("");
          setEditingBatchId(null);
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="max-h-[90dvh] w-[calc(100%-1rem)] max-w-2xl overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Manage Stock</DialogTitle>

          <DialogDescription>
            Manage stock batches for {phoneName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Add stock */}
          <section className="border-t pt-5">
            <div className="mb-3 flex items-center gap-2">
              <Plus className="size-4 text-primary" />

              <h3 className="text-sm font-semibold">Add new stock</h3>
            </div>

            <form
              onSubmit={handleAddStock}
              className="space-y-4 rounded-xl border bg-muted/30 p-4"
            >
              <input type="hidden" name="phoneId" value={phoneId} />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buying price</label>

                  <Input
                    name="buyingPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="18000"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Selling price</label>

                  <Input
                    name="sellingPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="20000"
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Purchase date</label>

                  <Input
                    name="purchaseDate"
                    type="date"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>

                  <Input
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="5"
                    className="h-11"
                    required
                  />
                </div>
              </div>

              {message && !editingBatchId && (
                <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
                  {message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full gap-1.5"
                disabled={isPending}
              >
                <Plus className="size-4" />

                {isPending ? "Adding..." : "Add stock"}
              </Button>
            </form>
          </section>

          {/* Existing stock */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-primary" />

              <h3 className="text-sm font-semibold">Existing stock</h3>
            </div>

            {stockBatches.length === 0 ? (
              <div className="rounded-xl border border-dashed p-5 text-center">
                <p className="text-sm text-muted-foreground">
                  No stock batches found.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stockBatches.map((batch) => {
                  const isEditing = editingBatchId === batch.id;

                  if (isEditing) {
                    return (
                      <form
                        key={batch.id}
                        onSubmit={handleUpdate}
                        className="space-y-4 rounded-xl border bg-muted/30 p-4"
                      >
                        <input
                          type="hidden"
                          name="stockBatchId"
                          value={batch.id}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Buying price
                            </label>

                            <Input
                              name="buyingPrice"
                              type="number"
                              min="0"
                              step="0.01"
                              defaultValue={batch.buyingPrice}
                              className="h-11"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Selling price
                            </label>

                            <Input
                              name="sellingPrice"
                              type="number"
                              min="0"
                              step="0.01"
                              defaultValue={batch.sellingPrice}
                              className="h-11"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Purchase date
                            </label>

                            <Input
                              name="purchaseDate"
                              type="date"
                              defaultValue={batch.purchaseDate}
                              className="h-11"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Total quantity
                            </label>

                            <Input
                              name="quantity"
                              type="number"
                              min="1"
                              step="1"
                              defaultValue={batch.quantity}
                              className="h-11"
                              required
                            />
                          </div>
                        </div>

                        <div className="rounded-lg bg-background px-3 py-2 text-xs text-muted-foreground">
                          Sold: {batch.quantity - batch.remainingQuantity} ·
                          Remaining: {batch.remainingQuantity}
                        </div>

                        {message && (
                          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {message}
                          </p>
                        )}

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={isPending}
                          >
                            Cancel
                          </Button>

                          <Button type="submit" size="sm" disabled={isPending}>
                            {isPending ? "Saving..." : "Save stock"}
                          </Button>
                        </div>
                      </form>
                    );
                  }

                  return (
                    <div key={batch.id} className="rounded-xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">
                            ৳{formatCurrency(batch.buyingPrice)} → ৳
                            {formatCurrency(batch.sellingPrice)}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Purchased {formatDate(batch.purchaseDate)}
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0 gap-1.5"
                          onClick={() => handleEdit(batch.id)}
                        >
                          <Pencil className="size-4" />
                          Edit
                        </Button>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-muted/50 p-2.5">
                          <p className="text-xs text-muted-foreground">Total</p>

                          <p className="mt-0.5 text-sm font-semibold">
                            {batch.quantity}
                          </p>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-2.5">
                          <p className="text-xs text-muted-foreground">
                            Remaining
                          </p>

                          <p className="mt-0.5 text-sm font-semibold">
                            {batch.remainingQuantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
