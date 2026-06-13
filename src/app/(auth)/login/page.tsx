"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, ShieldCheck, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { useRoleStore } from "@/store/useRoleStore";
import { findCredential, MOCK_CREDENTIALS } from "@/lib/mockData/credentials";

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

type Step = "credentials" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setFirstLoginComplete, firstLoginComplete } = useAuthStore();
  const { setRole } = useRoleStore();

  const [step, setStep] = useState<Step>("credentials");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [pendingCredential, setPendingCredential] = useState<ReturnType<typeof findCredential>>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "otp") {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const cred = findCredential(email, password);
    if (!cred) {
      setError("Invalid email or password. Please check your credentials.");
      setLoading(false);
      return;
    }

    setPendingCredential(cred);

    if (firstLoginComplete) {
      finalizeLogin(cred);
    } else {
      const code = generateOtp();
      setGeneratedOtp(code);
      setStep("otp");
      setLoading(false);
    }
  };

  const finalizeLogin = (cred: NonNullable<ReturnType<typeof findCredential>>) => {
    setUser(
      {
        id: cred.id,
        name: cred.name,
        email: cred.email,
        role: cred.role,
        appRole: cred.appRole,
        schoolId: cred.schoolId,
        schoolName: cred.schoolName,
      },
      "mock-jwt-token"
    );
    setRole(cred.appRole);
    router.push(cred.targetRoute);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    const entered = otp.join("");
    if (entered.length < 6) {
      setOtpError("Please enter the complete 6-digit code.");
      return;
    }
    if (entered !== generatedOtp) {
      setOtpError("Incorrect code. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setFirstLoginComplete(true);
    if (pendingCredential) {
      finalizeLogin(pendingCredential);
    }
  };

  const handleBack = () => {
    setStep("credentials");
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setGeneratedOtp("");
    setPendingCredential(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Tanweer</h1>
          <p className="text-slate-400 mt-1 text-sm">School Management Platform</p>
        </div>

        {step === "credentials" ? (
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCredentialSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="email@school.edu"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="••••••••"
                      required
                      className="pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-5 pt-4 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-2">Demo accounts:</p>
                <div className="grid grid-cols-2 gap-1">
                  {MOCK_CREDENTIALS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setEmail(c.email); setPassword(c.password); setError(""); }}
                      className="text-left text-xs px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                    >
                      <span className="font-medium text-foreground capitalize">{c.appRole}</span>
                      <span className="text-muted-foreground block truncate">{c.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <CardTitle>Verify Your Identity</CardTitle>
                  <CardDescription>Enter the 6-digit code shown below</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-5 rounded-xl bg-violet-50 border border-violet-200 p-4 text-center">
                <p className="text-xs text-violet-600 font-medium mb-1">Your one-time code</p>
                <p className="text-3xl font-bold tracking-[0.3em] text-violet-700 font-mono">
                  {generatedOtp}
                </p>
                <p className="text-xs text-violet-500 mt-1">Use this code to verify your device</p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-2">
                    Enter code
                  </label>
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-11 h-12 text-center text-lg font-bold border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                      />
                    ))}
                  </div>
                </div>

                {otpError && (
                  <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2 text-center">
                    {otpError}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to login
                </button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
