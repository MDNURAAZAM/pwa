"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const params = new URLSearchParams(window.location.search);
    const callbackUrl = params.get("callbackUrl") || "/dashboard";

    const result = await signIn("credentials", {
      username: username.trim(),
      password,
      callbackUrl,
      redirect: false,
    });

    if (!result || result.error) {
      setError("Invalid username or password.");
      setLoading(false);
      return;
    }

    // NextAuth has successfully created the session.
    // Navigate using the URL returned by NextAuth.
    window.location.href = result.url ?? callbackUrl;
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="shadow-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
              BD
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl">BD Telecom</CardTitle>

              <CardDescription>Mobile Shop Management System</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>

                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Authorized users only
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          BD Telecom Management
        </p>
      </div>
    </main>
  );
}
