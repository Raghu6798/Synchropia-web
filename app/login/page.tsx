"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { signIn } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Workflow,
  Mail,
  Lock,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Fingerprint,
  Building,
  KeyRound,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import InteractiveGradient from "@/components/lightswind/interactive-gradient-card";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/lightswind/input-otp";
import { PasswordStrengthIndicator } from "@/components/lightswind/password-strength-indicator";
import { ConfettiButton } from "@/components/lightswind/confetti-button";
import { CoolThemeToggle } from "@/components/lightswind/cool-theme-toggle";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // Auth Configuration State
  const [authMethod, setAuthMethod] = useState<"credentials" | "magic" | "sso">("credentials");
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [step, setStep] = useState<"auth" | "twoFactor" | "verifyMagic" | "ssoRedirect">("auth");

  // Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [magicCode, setMagicCode] = useState("");
  const [enterpriseEmail, setEnterpriseEmail] = useState("");

  // Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger simulated toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const { user, status } = useSelector((state: RootState) => state.auth);

  // Check if user is already logged in, redirect home
  useEffect(() => {
    if (status === "authenticated" && user) {
      window.location.href = "/";
    }
  }, [status, user]);

  // Submit Credentials (Email/Password)
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (activeTab === "signin") {
        // Shift to TOTP step
        setStep("twoFactor");
        triggerToast("Credentials verified. Please input your TOTP code.");
      } else {
        // Sign up success flow
        setSuccess(true);
        triggerToast("Account registered in database plane!");
        setTimeout(() => {
          setSuccess(false);
          setActiveTab("signin");
          setPassword("");
        }, 1500);
      }
    }, 1200);
  };

  // Submit Magic Link / Email OTP Code request
  const handleMagicLinkRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await signIn.magicLink({
        email,
        callbackURL: "/",
      });
      setIsLoading(false);
      triggerToast(`Magic link securely transmitted to ${email}`);
      // The user will click the link in their email to log in
    } catch (error) {
      setIsLoading(false);
      triggerToast("Failed to generate Magic Link.");
    }
  };

  // Verify Magic Passcode (Email OTP)
  const handleMagicVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (magicCode.length < 6) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      handleLoginSuccess(email);
    }, 1500);
  };

  // Submit Enterprise SSO Domain lookup via Better Auth
  const handleSsoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enterpriseEmail) return;

    setIsLoading(true);
    setStep("ssoRedirect");

    try {
      // Trigger Better Auth Okta flow. It handles redirecting smoothly.
      await signIn.oauth2({
        providerId: "okta",
        callbackURL: "/",
      });
    } catch (error) {
      setIsLoading(false);
      setStep("auth");
      triggerToast("SSO Authentication failed.");
    }
  };

  // TOTP Code Submit
  const handleTotpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      handleLoginSuccess(email);
    }, 1500);
  };

  // Social OAuth trigger
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    triggerToast(`Establishing handshake with ${provider} OAuth...`);

    try {
      if (provider === "Bitbucket") {
        await signIn.oauth2({ providerId: "bitbucket", callbackURL: "/" });
      } else {
        await signIn.social({
          provider: provider.toLowerCase() as "google" | "github" | "gitlab",
          callbackURL: "/"
        });
      }
    } catch (error) {
      setIsLoading(false);
      triggerToast(`${provider} handshake failed.`);
    }
  };

  // Complete Simulated Auth Session
  const handleLoginSuccess = (loginEmail: string) => {
    setSuccess(true);
    const mockUser = {
      email: loginEmail,
      name: loginEmail.split("@")[0].toUpperCase()
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    // Dispatch local state change event for header
    window.dispatchEvent(new Event("user-auth-change"));

    triggerToast("Security context established. Loading dashboard node...");
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center relative overflow-hidden px-4 select-none transition-colors duration-300">

      {/* Background visual glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#8AFF00]/5 dark:bg-[#8AFF00]/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#3f7300]/5 dark:bg-[#3f7300]/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />

      {/* Absolute floating toast notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 z-50 bg-zinc-900 border border-[#8AFF00]/30 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-[0_0_25px_rgba(138,255,0,0.15)] flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#8AFF00]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header utility bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Link href="/" className="flex items-center gap-2 group text-muted-foreground hover:text-[#8AFF00] transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-semibold">Back to Landing Page</span>
        </Link>
        <CoolThemeToggle size="sm" />
      </div>

      <div className="w-full max-w-md relative z-10 py-12">
        <InteractiveGradient
          color="#8AFF00"
          glowColor="rgba(138,255,0,0.06)"
          width="100%"
          borderRadius="24px"
          className="bg-card/45 dark:bg-zinc-950/60 border border-border/80 dark:border-zinc-800/80 hover:border-[#8AFF00]/30 transition-all duration-300 shadow-[0_0_30px_rgba(138,255,0,0.02)] hover:shadow-[0_0_40px_rgba(138,255,0,0.08)] overflow-hidden p-8 flex flex-col items-stretch text-left backdrop-blur-xl"
        >
          {/* Logo header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8AFF00] to-[#3d7a00] flex items-center justify-center shadow-[0_0_15px_rgba(138,255,0,0.25)] mb-3">
              <Workflow className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              {step === "auth" ? "Welcome to Synchropia" :
                step === "twoFactor" ? "Security Verification" :
                  step === "verifyMagic" ? "Confirm One-Time Passcode" :
                    "SSO Tunnel Routing"}
            </h2>
            <p className="text-muted-foreground text-xs mt-1">
              {step === "auth" ? "The Agentic Software Delivery Factory" :
                step === "twoFactor" ? "VPC access requests require authenticating TOTP keys" :
                  step === "verifyMagic" ? "Confirm secure temporary token sent to email" :
                    "Routing access request through enterprise identity provider"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              /* Success Screen */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Access Container Staged
                </h3>
                <p className="text-muted-foreground text-xs max-w-[240px]">
                  Secure TLS tunnel established. Redirecting back to workspace stream...
                </p>
              </motion.div>
            ) : step === "ssoRedirect" ? (
              /* Enterprise SSO redirection screen */
              <motion.div
                key="ssoRedirect"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center space-y-4"
              >
                <div className="p-4 bg-[#8AFF00]/5 border border-[#8AFF00]/15 text-[#8AFF00] dark:text-[#8AFF00]/90 rounded-2xl flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 animate-spin text-[#8AFF00]" />
                  <span className="text-xs font-semibold">Contacting SSO Gateway...</span>
                </div>
                <p className="text-muted-foreground text-xs max-w-[280px] leading-relaxed">
                  Delegating federated authentication request to domain directory. Handshaking TLS keys...
                </p>
              </motion.div>
            ) : step === "auth" ? (
              /* Auth Form Mode */
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Method Switcher tabs */}
                <div className="grid grid-cols-3 gap-1 bg-muted/60 dark:bg-zinc-900/60 p-1 rounded-xl border border-border/50 dark:border-zinc-800/40">
                  <button
                    onClick={() => { setAuthMethod("credentials"); setStep("auth"); }}
                    className={`py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${authMethod === "credentials"
                        ? "bg-card text-[#8AFF00] border border-border/40 dark:border-zinc-800 shadow-sm"
                        : "text-muted-foreground hover:text-[#8AFF00]"
                      }`}
                  >
                    <KeyRound className="w-3 h-3" />
                    Credentials
                  </button>
                  <button
                    onClick={() => { setAuthMethod("magic"); setStep("auth"); }}
                    className={`py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${authMethod === "magic"
                        ? "bg-card text-[#8AFF00] border border-border/40 dark:border-zinc-800 shadow-sm"
                        : "text-muted-foreground hover:text-[#8AFF00]"
                      }`}
                  >
                    <Fingerprint className="w-3 h-3" />
                    Magic Link
                  </button>
                  <button
                    onClick={() => { setAuthMethod("sso"); setStep("auth"); }}
                    className={`py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${authMethod === "sso"
                        ? "bg-card text-[#8AFF00] border border-border/40 dark:border-zinc-800 shadow-sm"
                        : "text-muted-foreground hover:text-[#8AFF00]"
                      }`}
                  >
                    <Building className="w-3 h-3" />
                    SSO Enterprise
                  </button>
                </div>

                {/* 1. CREDENTIALS FLOW */}
                {authMethod === "credentials" && (
                  <div className="space-y-4">
                    {/* Tab Selection */}
                    <div className="flex border-b border-border pb-1">
                      <button
                        onClick={() => setActiveTab("signin")}
                        className={`flex-1 text-center py-2 text-xs font-bold border-b-2 transition-all ${activeTab === "signin"
                            ? "border-[#8AFF00] text-[#8AFF00]"
                            : "border-transparent text-muted-foreground hover:text-[#8AFF00]"
                          }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setActiveTab("signup")}
                        className={`flex-1 text-center py-2 text-xs font-bold border-b-2 transition-all ${activeTab === "signup"
                            ? "border-[#8AFF00] text-[#8AFF00]"
                            : "border-transparent text-muted-foreground hover:text-[#8AFF00]"
                          }`}
                      >
                        Create Account
                      </button>
                    </div>

                    <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                      {/* Email field */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. engineering@company.com"
                          className="w-full h-11 px-4 rounded-xl bg-muted/40 dark:bg-zinc-900/60 border border-border dark:border-zinc-800 text-sm placeholder-zinc-500 focus:border-[#8AFF00] focus:ring-1 focus:ring-[#8AFF00] text-foreground outline-none transition-colors"
                        />
                      </div>

                      {/* Password field */}
                      {activeTab === "signin" ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5" />
                              Password
                            </label>
                            <Link href="#" className="text-[10px] text-[#8AFF00] hover:underline">
                              Forgot?
                            </Link>
                          </div>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full h-11 px-4 rounded-xl bg-muted/40 dark:bg-zinc-900/60 border border-border dark:border-zinc-800 text-sm placeholder-zinc-500 focus:border-[#8AFF00] focus:ring-1 focus:ring-[#8AFF00] text-foreground outline-none transition-colors"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <PasswordStrengthIndicator
                            value={password}
                            onChange={(val) => setPassword(val)}
                            onStrengthChange={(lvl) => setPasswordStrength(lvl)}
                            label="Choose Password"
                            placeholder="Min. 8 characters"
                            showScoreNumber={true}
                            inputProps={{
                              className: "w-full h-11 px-4 rounded-xl bg-muted/40 dark:bg-zinc-900/60 border border-border dark:border-zinc-800 text-sm placeholder-zinc-550 text-foreground outline-none focus:border-[#8AFF00] focus:ring-1 focus:ring-[#8AFF00] transition-colors",
                              type: "password"
                            }}
                          />
                        </div>
                      )}

                      <ConfettiButton
                        type="submit"
                        loading={isLoading}
                        className="w-full rounded-xl text-xs font-extrabold h-11 mt-4 bg-[#8AFF00] hover:bg-[#8AFF00]/95 text-black border border-[#8AFF00] shadow-[0_0_15px_rgba(138,255,0,0.25)] hover:shadow-[0_0_20px_rgba(138,255,0,0.4)] transition-all duration-300 active:scale-95 cursor-pointer"
                      >
                        {activeTab === "signin" ? "Verify Security Credentials" : "Provision Factory Node"}
                      </ConfettiButton>
                    </form>
                  </div>
                )}

                {/* 2. MAGIC LINK FLOW */}
                {authMethod === "magic" && (
                  <form onSubmit={handleMagicLinkRequest} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#8AFF00]/5 border border-[#8AFF00]/10 text-foreground dark:text-zinc-300 text-xs leading-relaxed">
                      Enter your address to receive a secure, 6-digit one-time passcode. No password required.
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. workspace@company.com"
                        className="w-full h-11 px-4 rounded-xl bg-muted/40 dark:bg-zinc-900/60 border border-border dark:border-zinc-800 text-sm placeholder-zinc-500 focus:border-[#8AFF00] focus:ring-1 focus:ring-[#8AFF00] text-foreground outline-none transition-colors"
                      />
                    </div>
                    <ConfettiButton
                      type="submit"
                      loading={isLoading}
                      className="w-full rounded-xl text-xs font-extrabold h-11 mt-4 bg-[#8AFF00] hover:bg-[#8AFF00]/95 text-black border border-[#8AFF00] shadow-[0_0_15px_rgba(138,255,0,0.25)] hover:shadow-[0_0_20px_rgba(138,255,0,0.4)] transition-all duration-300 active:scale-95 cursor-pointer"
                    >
                      Transmit OTP Code
                    </ConfettiButton>
                  </form>
                )}

                {/* 3. ENTERPRISE SSO FLOW */}
                {authMethod === "sso" && (
                  <form onSubmit={handleSsoSubmit} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-[#8AFF00]/5 border border-[#8AFF00]/10 text-foreground dark:text-zinc-300 text-xs leading-relaxed">
                      Authenticate utilizing corporate SAML 2.0 or OIDC gateways. Enter your enterprise workspace email below.
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5" />
                        Enterprise Email
                      </label>
                      <input
                        type="email"
                        required
                        value={enterpriseEmail}
                        onChange={(e) => setEnterpriseEmail(e.target.value)}
                        placeholder="e.g. engineer@microsoft.com"
                        className="w-full h-11 px-4 rounded-xl bg-muted/40 dark:bg-zinc-900/60 border border-border dark:border-zinc-800 text-sm placeholder-zinc-500 focus:border-[#8AFF00] focus:ring-1 focus:ring-[#8AFF00] text-foreground outline-none transition-colors"
                      />
                    </div>
                    <ConfettiButton
                      type="submit"
                      loading={isLoading}
                      className="w-full rounded-xl text-xs font-extrabold h-11 mt-4 bg-[#8AFF00] hover:bg-[#8AFF00]/95 text-black border border-[#8AFF00] shadow-[0_0_15px_rgba(138,255,0,0.25)] hover:shadow-[0_0_20px_rgba(138,255,0,0.4)] transition-all duration-300 active:scale-95 cursor-pointer"
                    >
                      Authenticate via SSO
                    </ConfettiButton>
                  </form>
                )}

                {/* Social Login Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-border/80 dark:border-zinc-900"></div>
                  <span className="flex-shrink mx-4 text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
                    Or secure sign in with
                  </span>
                  <div className="flex-grow border-t border-border/80 dark:border-zinc-900"></div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSocialLogin("Google")}
                    className="flex items-center justify-center gap-2 h-10 rounded-xl bg-muted/40 hover:bg-muted dark:bg-zinc-900/40 border border-border dark:border-zinc-800 text-xs font-semibold text-foreground hover:text-foreground dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                  <button
                    onClick={() => handleSocialLogin("GitHub")}
                    className="flex items-center justify-center gap-2 h-10 rounded-xl bg-muted/40 hover:bg-muted dark:bg-zinc-900/40 border border-border dark:border-zinc-800 text-xs font-semibold text-foreground hover:text-foreground dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-1 fill-current text-foreground" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    GitHub
                  </button>
                  <button
                    onClick={() => handleSocialLogin("GitLab")}
                    className="flex items-center justify-center gap-2 h-10 rounded-xl bg-muted/40 hover:bg-muted dark:bg-zinc-900/40 border border-border dark:border-zinc-800 text-xs font-semibold text-foreground hover:text-foreground dark:hover:text-white transition-colors col-span-2 md:col-span-1 cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="m23.906 13.069-.738-2.274a.428.428 0 0 0-.156-.205.42.42 0 0 0-.256-.057.42.42 0 0 0-.246.095.428.428 0 0 0-.12.235l-1.922 5.918H3.472L1.55 10.863a.434.434 0 0 0-.12-.236.42.42 0 0 0-.246-.095.42.42 0 0 0-.256.057.428.428 0 0 0-.156.205L.034 13.07a1.002 1.002 0 0 0 .363 1.116l11.106 8.07c.15.11.332.169.518.169.186 0 .368-.059.518-.17l11.106-8.07a1.002 1.002 0 0 0 .363-1.116Z" fill="#E24329" />
                      <path d="M12.02 24.325 23.926 13.07a1 1 0 0 0-.363-1.116l-3.328-2.422-8.215 14.793Z" fill="#FC6D26" />
                      <path d="M12.02 24.325 8.254 9.532H3.766l8.254 14.793Z" fill="#FCA326" />
                      <path d="M3.766 9.532h16.508L12.02 24.325l-8.254-14.793Z" fill="#E24329" />
                    </svg>
                    GitLab
                  </button>
                  <button
                    onClick={() => handleSocialLogin("Bitbucket")}
                    className="flex items-center justify-center gap-2 h-10 rounded-xl bg-muted/40 hover:bg-muted dark:bg-zinc-900/40 border border-border dark:border-zinc-800 text-xs font-semibold text-foreground hover:text-foreground dark:hover:text-white transition-colors col-span-2 md:col-span-1 cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current text-foreground" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.28 2.56c-.16-.36-.53-.6-.92-.6H2.63c-.39 0-.75.24-.91.6L.07 7.78c-.14.33-.1.7.11 1l5.48 7.3c.18.23.46.37.75.37h11.19c.29 0 .57-.14.75-.37l5.48-7.3c.21-.3.25-.67.11-1l-1.66-5.22zM15.42 14.5H8.58L6.85 7.64h10.3l-1.73 6.86z" />
                    </svg>
                    Bitbucket
                  </button>
                </div>
              </motion.div>
            ) : step === "twoFactor" ? (
              /* Two-Factor Authentication (OTP verification step) */
              <motion.div
                key="twoFactor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="p-4 rounded-2xl bg-[#8AFF00]/5 border border-[#8AFF00]/10 text-foreground dark:text-zinc-350 text-xs flex gap-3 shadow-sm">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-[#8AFF00] animate-pulse" />
                  <div>
                    <span className="font-bold text-[#8AFF00]">2FA Verification:</span> Secure TOTP authentication keys are active for this database plane. Input Google Authenticator code.
                  </div>
                </div>

                <form onSubmit={handleTotpSubmit} className="space-y-6 flex flex-col items-center">
                  <div className="space-y-2 w-full text-center">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Enter Authentication Code
                    </label>
                    <div className="flex justify-center pt-2">
                      <InputOTP
                        maxLength={6}
                        value={otpCode}
                        onChange={(val) => setOtpCode(val)}
                      >
                        <InputOTPGroup className="gap-1.5">
                          <InputOTPSlot index={0} className="w-12 h-14 text-xl font-bold rounded-xl border border-border dark:border-zinc-700 bg-muted/40 dark:bg-zinc-900/80 text-foreground animate-pulse" />
                          <InputOTPSlot index={1} className="w-12 h-14 text-xl font-bold rounded-xl border border-border dark:border-zinc-700 bg-muted/40 dark:bg-zinc-900/80 text-foreground" />
                          <InputOTPSlot index={2} className="w-12 h-14 text-xl font-bold rounded-xl border border-border dark:border-zinc-700 bg-muted/40 dark:bg-zinc-900/80 text-foreground" />
                        </InputOTPGroup>
                        <InputOTPSeparator className="mx-3 text-muted-foreground text-xl font-black" />
                        <InputOTPGroup className="gap-1.5">
                          <InputOTPSlot index={3} className="w-12 h-14 text-xl font-bold rounded-xl border border-border dark:border-zinc-700 bg-muted/40 dark:bg-zinc-900/80 text-foreground" />
                          <InputOTPSlot index={4} className="w-12 h-14 text-xl font-bold rounded-xl border border-border dark:border-zinc-700 bg-muted/40 dark:bg-zinc-900/80 text-foreground" />
                          <InputOTPSlot index={5} className="w-12 h-14 text-xl font-bold rounded-xl border border-border dark:border-zinc-700 bg-muted/40 dark:bg-zinc-900/80 text-foreground" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <ConfettiButton
                    type="submit"
                    loading={isLoading}
                    disabled={otpCode.length < 6}
                    className="w-full rounded-xl text-xs font-extrabold h-11 bg-[#8AFF00] hover:bg-[#8AFF00]/95 text-black border border-[#8AFF00] shadow-[0_0_15px_rgba(138,255,0,0.25)] hover:shadow-[0_0_20px_rgba(138,255,0,0.4)] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    Establish Secure Session
                  </ConfettiButton>

                  <button
                    type="button"
                    onClick={() => { setStep("auth"); setOtpCode(""); }}
                    className="text-xs text-muted-foreground hover:text-[#8AFF00] flex items-center gap-1.5 transition-colors pt-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Credentials
                  </button>
                </form>
              </motion.div>
            ) : (
              /* Magic Link OTP Verification Step */
              <motion.div
                key="verifyMagic"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="p-4 rounded-2xl bg-[#8AFF00]/5 border border-[#8AFF00]/10 text-foreground dark:text-zinc-350 text-xs flex gap-3 shadow-sm">
                  <Fingerprint className="w-5 h-5 shrink-0 text-[#8AFF00] animate-pulse" />
                  <div>
                    <span className="font-bold text-[#8AFF00]">Verify Magic Link:</span> Input the 6-digit verification code transmitted to your email to authenticate this browser container.
                  </div>
                </div>

                <form onSubmit={handleMagicVerification} className="space-y-6 flex flex-col items-center">
                  <div className="space-y-2 w-full text-center">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Enter 6-Digit Email Code
                    </label>
                    <div className="flex justify-center pt-2">
                      <InputOTP
                        maxLength={6}
                        value={magicCode}
                        onChange={(val) => setMagicCode(val)}
                      >
                        <InputOTPGroup className="gap-1.5">
                          <InputOTPSlot index={0} className="w-12 h-14 text-xl font-bold rounded-xl border border-border dark:border-zinc-700 bg-muted/40 dark:bg-zinc-900/80 text-foreground" />
                          <InputOTPSlot index={1} className="w-12 h-14 text-xl font-bold rounded-xl border border-border dark:border-zinc-700 bg-muted/40 dark:bg-zinc-900/80 text-foreground" />
                          <InputOTPSlot index={2} className="w-12 h-14 text-xl font-bold rounded-xl border border-border dark:border-zinc-700 bg-muted/40 dark:bg-zinc-900/80 text-foreground" />
                        </InputOTPGroup>
                        <InputOTPSeparator className="mx-3 text-muted-foreground text-xl font-black" />
                        <InputOTPGroup className="gap-1.5">
                          <InputOTPSlot index={3} className="w-12 h-14 text-xl font-bold rounded-xl border border-border dark:border-zinc-700 bg-muted/40 dark:bg-zinc-900/80 text-foreground" />
                          <InputOTPSlot index={4} className="w-12 h-14 text-xl font-bold rounded-xl border border-border dark:border-zinc-700 bg-muted/40 dark:bg-zinc-900/80 text-foreground" />
                          <InputOTPSlot index={5} className="w-12 h-14 text-xl font-bold rounded-xl border border-border dark:border-zinc-700 bg-muted/40 dark:bg-zinc-900/80 text-foreground" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <ConfettiButton
                    type="submit"
                    loading={isLoading}
                    disabled={magicCode.length < 6}
                    className="w-full rounded-xl text-xs font-extrabold h-11 bg-[#8AFF00] hover:bg-[#8AFF00]/95 text-black border border-[#8AFF00] shadow-[0_0_15px_rgba(138,255,0,0.25)] hover:shadow-[0_0_20px_rgba(138,255,0,0.4)] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    Verify Passcode
                  </ConfettiButton>

                  <button
                    type="button"
                    onClick={() => { setStep("auth"); setMagicCode(""); }}
                    className="text-xs text-muted-foreground hover:text-[#8AFF00] flex items-center gap-1.5 transition-colors pt-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Email Lookup
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </InteractiveGradient>

        {/* Footer info text */}
        <p className="text-center text-[10px] text-zinc-550 dark:text-zinc-650 mt-6 max-w-xs mx-auto leading-relaxed">
          Synchropia is VPC-isolated. Security assertions, token sessions, and keys are encrypted under strict Drizzle schema guidelines in multi-tenant containers.
        </p>
      </div>
    </div>
  );
}
