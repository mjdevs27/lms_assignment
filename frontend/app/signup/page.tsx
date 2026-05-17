"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { ROUTES } from "@/constants/routes.constants";
import { signup } from "@/lib/auth";
import { getDefaultRouteForRole } from "@/lib/role-redirect";
import { FrontendApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const { refreshUser, isAuthenticated, user, isLoading: authLoading } = useAuth();

  // Redirect already-authenticated users
  React.useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      router.replace(getDefaultRouteForRole(user.role));
    }
  }, [authLoading, isAuthenticated, user, router]);
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Email format regex validation
  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate all fields
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await signup({ fullName, email, password });
      
      if (response.token) {
        setSuccessMessage("Account created successfully. Redirecting...");
        // Sync AuthContext with the newly stored token before navigating
        await refreshUser();
        const route = getDefaultRouteForRole(response.user.role);
        router.push(route);
      } else {
        setSuccessMessage("Registration successful. Please log in.");
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
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
    <AuthShell title="Create your borrower account">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && <Alert type="error" message={errorMessage} />}
        {successMessage && <Alert type="success" message={successMessage} />}

        <Input
          label="Full Name"
          id="fullName"
          name="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
        />

        <Input
          label="Email address"
          id="email"
          name="email"
          type="email"
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
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <Input
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />

        <div>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Sign up
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-slate-900 hover:text-slate-800 underline transition duration-150 ease-in-out"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
