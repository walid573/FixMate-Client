"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const router = useRouter()
  const pushToast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };
    const { data: resData, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      pushToast(
        error.message || "Invalid email or password. Please try again.",
        "error"
      );
      return;
    }

    pushToast(
      `Welcome back${resData?.user?.name ? `, ${resData.user.name}` : ""}!`,
      "success"
    );
    
    const dashboardPath = `/`;
    router.push(dashboardPath);
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-10 size-96 rounded-full bg-brand-peach/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-10 size-96 rounded-full bg-slate-200/50 blur-3xl"
      />

      <div className="relative w-full max-w-[500px] rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/80 sm:p-10">
        {/* Header */}
        <h1 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
          Log in to track your repairs and manage your bookings.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-brand-navy">
              Email
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Mail className="size-4" aria-hidden="true" />
              </span>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-brand-navy"
              >
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-brand-orange-ink hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Lock className="size-4" aria-hidden="true" />
              </span>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-9 pr-9"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2.5 pt-1">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(!!checked)}
            />
            <Label
              htmlFor="remember"
              className="text-xs font-normal text-slate-600"
            >
              Keep me signed in
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="mt-1 h-11 w-full bg-brand-orange text-sm font-semibold text-brand-navy shadow-sm hover:bg-brand-orange/90"
          >
            Login
            <ArrowRight className="ml-1 size-4" aria-hidden="true" />
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400">or</span>
          </div>
        </div>

        {/* Google Login */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="h-11 w-full border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50"
        >
          <svg className="mr-2 size-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.21 21.34 7.32 24 12 24 z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52s.13-1.52.38-2.24V6.61H1.19C.43 8.15 0 9.88 0 12s.43 3.85 1.19 5.39l4.08-3.15c.95-2.85 3.6-4.96 6.73-4.96z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Footer register prompt */}
        <p className="mt-6 text-center text-sm text-slate-500">
          New to FixMate?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-brand-orange-ink hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Security footnote */}
        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
          <Lock className="size-3" aria-hidden="true" />
          Secure sign in - Verified technicians only
        </p>
      </div>
    </main>
  );
}