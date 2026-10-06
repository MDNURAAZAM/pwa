import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import { DashboardHeader } from "@/components/DashboardHeader/DashboardHeader";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-dvh bg-muted/30">
      <DashboardHeader
        name={session.user.name ?? session.user.username}
        role={session.user.role}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
