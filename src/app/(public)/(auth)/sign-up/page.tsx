"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  ArrowRight,
  Check,
  MapPin,
  Camera,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/upload-image";

export default function RegisterPage() {
  const router = useRouter()
  const pushToast = useToast();
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    terms: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [area, setArea] = useState("");
  const [bio, setBio] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const markTouched = (field: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [field]: true }));


  const validate = (
    name: string,
    email: string,
    phone: string,
    password: string,
    agreed: boolean
  ) => {
    const next: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      terms?: string;
    } = {};
    if (!name.trim()) next.name = "Full name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address";
    if (!phone.trim()) next.phone = "Phone number is required";
    if (!password) next.password = "Password is required";
    else if (password.length < 6)
      next.password = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(password))
      next.password = "Password needs at least one uppercase letter";
    else if (!/[a-z]/.test(password))
      next.password = "Password needs at least one lowercase letter";
    if (!agreed) next.terms = "You must agree to the Terms of Service";
    return next;
  };

  const errors = validate(fullName, email, phone, password, agree);
  const showError = (field: keyof typeof errors) =>
    submitAttempted || touched[field] ? errors[field] : undefined;

  
  const confirmMatches =
    !confirmPassword || confirmPassword === password;
  const passwordValid =
    !errors.password &&
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password);



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);

     let imageUrl = "";

    if (profileImage) {
      imageUrl = await uploadImage(profileImage);
    }

    if (Object.keys(errors).length > 0) return;
    if (!confirmMatches) return;

    const { data: resData, error } =
      await authClient.signUp.email({
        name: fullName,
        email,
        phone,
        password,
        role,
        image: imageUrl || undefined,
        area: role === "technician" ? area : undefined,
        bio: role === "technician" ? bio : undefined,
      });

    if (error) {
      console.error(error.message);
      pushToast(error.message || "Failed to create account.", "error");
      return;
    }

    pushToast("Account created successfully!", "success");   
    const dashboardPath = `/`;
    router.push(dashboardPath);
    router.refresh();
    console.log(resData);
  };

  const handleGoogleSignup = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/", // will be overridden by middleware after login
    });
  };

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-15 sm:px-6 lg:px-8">

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-10 size-96 rounded-full bg-brand-peach/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-10 size-96 rounded-full bg-slate-200/50 blur-3xl"
      />

      <div className="relative w-full max-w-[500px] rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/80 sm:p-10">

        <h1 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Book trusted repairs or start offering your services.
        </p>

        {/* Role toggle tabs */}
        <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`rounded-lg py-2.5 text-xs font-semibold transition-all ${role === "customer"
              ? "bg-brand-navy text-white shadow-sm"
              : "text-slate-600 hover:text-brand-navy"
              }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("technician")}
            className={`rounded-lg py-2.5 text-xs font-semibold transition-all ${role === "technician"
              ? "bg-brand-navy text-white shadow-sm"
              : "text-slate-600 hover:text-brand-navy"
              }`}
          >
            Technician
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-semibold text-brand-navy">
              Full name
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <User className="size-4" aria-hidden="true" />
              </span>
              <Input
                id="FullName"
                name="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => markTouched("name")}
                placeholder="Your full name"
                aria-invalid={!!showError("name") || undefined}
                className="pl-9 h-10"
                required
              />
            </div>
            {showError("name") && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

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
                onBlur={() => markTouched("email")}
                placeholder="you@example.com"
                aria-invalid={!!showError("email") || undefined}
                className="pl-9 h-10"
                required
              />
            </div>
            {showError("email") && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Phone number */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold text-brand-navy">
              Phone number
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => markTouched("phone")}
                placeholder="01XXX-XXXXXX"
                aria-invalid={!!showError("phone") || undefined}
                className="pl-9 h-10"
                required
              />
            </div>
            {showError("phone") && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Technician-only fields */}
          {role === "technician" && (
            <>
              {/* Area / Service region */}
              <div className="space-y-1.5">
                <Label htmlFor="area" className="text-xs font-semibold text-brand-navy">
                  Service area
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <MapPin className="size-4" aria-hidden="true" />
                  </span>
                  <Input
                    id="area"
                    name="area"
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Dhaka, Gulshan"
                    className="pl-9 h-10"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs font-semibold text-brand-navy">
                  Short bio
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <FileText className="size-4" aria-hidden="true" />
                  </span>
                  <Input
                    id="bio"
                    name="bio"
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell customers what you specialize in"
                    className="pl-9 h-10"
                  />
                </div>
              </div>

              {/* Profile photo */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-brand-navy">
                  Profile photo
                </Label>
                <div className="flex items-center gap-3">
                  <label className="flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-brand-orange hover:text-brand-orange">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="size-full object-cover"
                      />
                    ) : (
                      <Camera className="size-5" aria-hidden="true" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setProfileImage(file);
                        if (file) {
                          setImagePreview(URL.createObjectURL(file));
                        } else {
                          setImagePreview("");
                        }
                      }}
                    />
                  </label>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">
                      JPG, PNG or WebP
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Max 5 MB
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-brand-navy">
              Password
            </Label>
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
                onBlur={() => markTouched("password")}
                placeholder="Create a password"
                aria-invalid={!!showError("password") || undefined}
                className="pl-9 pr-9 h-10"
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
            {showError("password") && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
            {/* Live password rule checks */}
            <div className="space-y-1.5 pt-1">
              {[
                {
                  label: "At least 6 characters",
                  ok: password.length >= 6,
                },
                {
                  label: "At least one uppercase letter",
                  ok: /[A-Z]/.test(password),
                },
                {
                  label: "At least one lowercase letter",
                  ok: /[a-z]/.test(password),
                },
              ].map((rule) => (
                <div
                  key={rule.label}
                  className="flex items-center gap-1.5 text-[11px] text-slate-400"
                >
                  <Check
                    className={`size-3 shrink-0 ${rule.ok ? "text-brand-orange" : "text-slate-300"
                      }`}
                    aria-hidden="true"
                  />
                  {rule.label}
                </div>
              ))}
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold text-brand-navy">
              Confirm password
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Lock className="size-4" aria-hidden="true" />
              </span>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmError) setConfirmError("");
                }}
                onBlur={() => {
                  if (confirmPassword && confirmPassword !== password)
                    setConfirmError("Passwords do not match");
                }}
                placeholder="Repeat your password"
                aria-invalid={!!confirmError || undefined}
                className="pl-9 pr-9 h-10"
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
            {confirmError && (
              <p className="text-xs text-destructive">{confirmError}</p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2.5 pt-1">
            <Checkbox
              id="terms"
              checked={agree}
              onCheckedChange={(checked) => setAgree(!!checked)}
              required
              aria-invalid={!!showError("terms") || undefined}
            />
            <Label
              htmlFor="terms"
              className="text-xs font-normal leading-relaxed text-slate-500"
            >
              I agree to the{" "}
              <Link href="/terms" className="font-semibold text-brand-orange-ink hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-brand-orange-ink hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {showError("terms") && (
            <p className="-mt-2.5 text-xs text-destructive">{errors.terms}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-brand-orange text-brand-navy hover:bg-brand-orange/90 font-semibold h-11 text-sm shadow-sm"
          >
            Create Account
            <ArrowRight className="size-4 ml-1" aria-hidden="true" />
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

        {/* Google Signup */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignup}
          className="w-full h-11 border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50"
        >
          <svg className="size-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.21 21.34 7.32 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.19C.43 8.15 0 9.88 0 12s.43 3.85 1.19 5.39l4.08-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.21 2.66 1.19 6.61l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
            />
          </svg>
          Sign up with Google
        </Button>

        {/* Footer login prompt */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-orange-ink hover:underline">
            Login
          </Link>
        </p>

        {/* Security footnote */}
        <p className="mt-6 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Lock className="size-3" aria-hidden="true" />
          Your role is saved as {role === "technician" ? "Technician" : "Customer"} on this device
        </p>
      </div>
    </main>
  );
}
