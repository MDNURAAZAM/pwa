"use client";

import { signOut } from "next-auth/react";
import { LogOut, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  name: string;
  role: "SUPERUSER" | "STAFF";
};

export function DashboardHeader({ name, role }: DashboardHeaderProps) {
  async function handleLogout() {
    await signOut({
      callbackUrl: "/login",
    });
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Smartphone className="size-5" />
          </div>

          <div>
            <p className="text-sm font-semibold leading-none">BD Telecom</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{name}</p>

            <p className="text-xs text-muted-foreground">
              {role === "SUPERUSER" ? "Superuser" : "Staff"}
            </p>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
