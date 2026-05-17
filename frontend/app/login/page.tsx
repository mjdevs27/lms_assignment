"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { ROUTES } from "@/constants/routes.constants";
import { login } from "@/lib/auth";
import { getDefaultRouteForRole } from "@/lib/role-redirect";
import { FrontendApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Redirect already-authenticated users
  React.useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      router.replace(getDefaultRouteForRole(user.role));
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await login({ email, password });
      // Sync AuthContext with the newly stored token before navigating
      await refreshUser();
      const route = getDefaultRouteForRole(response.user.role);
      router.push(route);
    } catch (err) {
      if (err instanceof FrontendApiError) {
        setErrorMessage(err.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && <Alert type="error" message={errorMessage} />}

        <Input
          label="Email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <div>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Sign in
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          New here?{" "}
          <Link
            href={ROUTES.SIGNUP}
            className="font-medium text-slate-900 hover:text-slate-800 underline transition duration-150 ease-in-out"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
