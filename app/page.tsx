import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-dvh bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Smartphone className="size-5" />
            </div>

            <div>
              <p className="text-sm font-bold leading-none tracking-tight">
                BD TELECOM
              </p>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Mobile Shop Management
              </p>
            </div>
          </Link>

          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            Login
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_40%),radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.08),transparent_35%)]" />

        <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          {/* Hero content */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Simple. Fast. Reliable.
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Manage your mobile shop
              <span className="block text-primary">smarter.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Keep track of your phones, stock, sales, prices and profits from
              one simple management system built for modern mobile shops.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Login to Dashboard
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-xl border bg-background px-6 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Explore Features
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Inventory tracking
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Sales management
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Profit tracking
              </div>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/5 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border bg-card p-3 shadow-2xl sm:p-5">
              {/* Preview header */}
              <div className="mb-4 flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Smartphone className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold">BD Telecom</p>

                    <p className="text-[10px] text-muted-foreground">
                      Dashboard
                    </p>
                  </div>
                </div>

                <div className="size-8 rounded-full bg-muted" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <PreviewCard
                  icon={<Boxes className="size-4" />}
                  label="Stock Value"
                  value="৳8.45L"
                />

                <PreviewCard
                  icon={<Smartphone className="size-4" />}
                  label="Phones"
                  value="126"
                />

                <PreviewCard
                  icon={<BarChart3 className="size-4" />}
                  label="Profit"
                  value="৳42.8K"
                  className="col-span-2 sm:col-span-1"
                />
              </div>

              {/* Inventory preview */}
              <div className="mt-4 rounded-xl border bg-background p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Recent Inventory</p>

                    <p className="text-xs text-muted-foreground">
                      Latest stock updates
                    </p>
                  </div>

                  <div className="rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
                    Live
                  </div>
                </div>

                <div className="space-y-3">
                  <PreviewPhone
                    name="Samsung Galaxy A55"
                    spec="8GB · 256GB"
                    price="৳42,999"
                  />

                  <PreviewPhone
                    name="Redmi Note 14"
                    spec="8GB · 256GB"
                    price="৳28,999"
                  />

                  <PreviewPhone
                    name="iPhone 15"
                    spec="6GB · 128GB"
                    price="৳82,000"
                  />
                </div>
              </div>

              {/* Security status */}
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3">
                <ShieldCheck className="size-4 text-primary" />

                <p className="text-xs text-muted-foreground">
                  Your inventory and sales are securely managed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-primary">
              Everything you need
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Your shop, organized.
            </h2>

            <p className="mt-3 text-muted-foreground">
              Manage the important parts of your mobile business from one place.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Boxes className="size-5" />}
              title="Inventory"
              description="Track phones, stock batches, purchase prices and available quantities."
            />

            <FeatureCard
              icon={<BarChart3 className="size-5" />}
              title="Sales"
              description="Record sales and keep accurate selling prices and profit information."
            />

            <FeatureCard
              icon={<Smartphone className="size-5" />}
              title="Phone Management"
              description="Organize phones by brand, RAM, ROM and pricing."
            />

            <FeatureCard
              icon={<ShieldCheck className="size-5" />}
              title="Secure Access"
              description="Role-based access keeps your shop management system protected."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8 lg:text-left">
          <p>© {new Date().getFullYear()} BD TELECOM. All rights reserved.</p>

          <p>Mobile Shop Management System</p>
        </div>
      </footer>
    </main>
  );
}

function PreviewCard({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border bg-background p-3 ${className}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}

        <span className="text-[10px] font-medium sm:text-xs">{label}</span>
      </div>

      <p className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
        {value}
      </p>
    </div>
  );
}

function PreviewPhone({
  name,
  spec,
  price,
}: {
  name: string;
  spec: string;
  price: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Smartphone className="size-4 text-muted-foreground" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold">{name}</p>

          <p className="mt-0.5 text-[10px] text-muted-foreground">{spec}</p>
        </div>
      </div>

      <p className="shrink-0 text-xs font-semibold">{price}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-background p-5 transition-shadow hover:shadow-md">
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
