"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, Lock, CheckCircle2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "create">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await signIn.magicLink({ email, callbackURL: "/dashboard" });
      setIsLoading(false);
      alert("Magic link sent!");
    } catch {
      setIsLoading(false);
      alert("Failed to send link.");
    }
  };

  const handleSocialLogin = async (provider: "google" | "github" | "gitlab") => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error("Social login failed:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* ====== CSS Animations ====== */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float-cube {
          0%, 100% { transform: rotateX(25deg) rotateY(25deg) rotateZ(0deg) translateY(0px); }
          50% { transform: rotateX(35deg) rotateY(45deg) rotateZ(10deg) translateY(-18px); }
        }
        @keyframes float-cube-reverse {
          0%, 100% { transform: rotateX(-20deg) rotateY(-30deg) rotateZ(0deg) translateY(0px); }
          50% { transform: rotateX(-30deg) rotateY(-15deg) rotateZ(-8deg) translateY(-14px); }
        }
        @keyframes float-diamond {
          0%, 100% { transform: rotate(45deg) translateY(0px); opacity: 0.7; }
          50% { transform: rotate(45deg) translateY(-12px); opacity: 1; }
        }
        @keyframes pulse-line {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.4; }
        }
        @keyframes glow-floor {
          0%, 100% { opacity: 0.7; filter: blur(20px); }
          50% { opacity: 1; filter: blur(30px); }
        }
        @keyframes nebula-drift {
          0%, 100% { transform: translateX(0%) translateY(0%); }
          50% { transform: translateX(3%) translateY(-2%); }
        }
        @keyframes label-blink {
          0%, 70%, 100% { opacity: 0.5; }
          80% { opacity: 0.9; }
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .cube-3d {
          transform-style: preserve-3d;
          perspective: 600px;
        }
        .cube-face {
          position: absolute;
          border: 1px solid rgba(138,255,0,0.25);
          background: rgba(138,255,0,0.03);
          backdrop-filter: blur(1px);
        }
      `,
        }}
      />

      {/* ====== Return Button ====== */}
      <Link
        href="/"
        className="absolute top-7 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors z-50"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium tracking-wide">Return</span>
      </Link>

      {/* ====== BACKGROUND LAYER: Subtle green nebula & Stars ====== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Nebula Image */}
        <div
          className="absolute top-0 left-0 w-full h-[900px] opacity-50 mix-blend-screen"
          style={{
            backgroundImage: "url('/nebula-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
            maskImage:
              "linear-gradient(to bottom, black 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 50%, transparent 100%)",
          }}
        />

        {/* Tiny stars scattered */}
        {[
          { top: "12%", left: "8%", delay: "0s" },
          { top: "25%", left: "75%", delay: "1.5s" },
          { top: "55%", left: "92%", delay: "0.8s" },
          { top: "80%", left: "15%", delay: "2s" },
          { top: "40%", left: "5%", delay: "0.3s" },
          { top: "68%", left: "88%", delay: "1s" },
          { top: "15%", left: "55%", delay: "2.5s" },
          { top: "90%", left: "60%", delay: "0.5s" },
          { top: "35%", left: "20%", delay: "1.8s" },
          { top: "72%", left: "45%", delay: "3s" },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-[#8AFF00]"
            style={{
              top: star.top,
              left: star.left,
              boxShadow: "0 0 4px rgba(138,255,0,0.6)",
              animation: `star-twinkle ${2 + i * 0.3}s ease-in-out infinite ${star.delay}`,
            }}
          />
        ))}
      </div>

      {/* ====== FLOATING 3D CUBES ====== */}
      {/* Cube: Top-Left (AGENT_01) */}
      <div className="absolute top-[12%] left-[10%] sm:left-[14%] z-20 pointer-events-none">
        <div className="relative">
          <span
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] text-[#8AFF00]/50 font-mono whitespace-nowrap"
            style={{ animation: "label-blink 4s ease-in-out infinite" }}
          >
            AGENT_01
          </span>
          <div
            className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px]"
            style={{
              transformStyle: "preserve-3d",
              animation: "float-cube 8s ease-in-out infinite",
            }}
          >
            <div
              className="cube-face w-full h-full"
              style={{ transform: "translateZ(25px)" }}
            />
            <div
              className="cube-face w-full h-full"
              style={{ transform: "translateZ(-25px)" }}
            />
            <div
              className="cube-face w-full"
              style={{
                height: "50px",
                transform: "rotateX(90deg) translateZ(25px)",
              }}
            />
            <div
              className="cube-face w-full"
              style={{
                height: "50px",
                transform: "rotateX(-90deg) translateZ(25px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Cube: Top-Right (CORE_X12) */}
      <div className="absolute top-[8%] right-[8%] sm:right-[12%] z-20 pointer-events-none">
        <div className="relative">
          <span
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] text-[#8AFF00]/50 font-mono whitespace-nowrap flex items-center gap-1"
            style={{ animation: "label-blink 5s ease-in-out infinite 1s" }}
          >
            <span className="w-[5px] h-[5px] border border-[#8AFF00]/40 rotate-45 inline-block" />
            CORE_X12
          </span>
          <div
            className="w-[55px] h-[55px] sm:w-[75px] sm:h-[75px]"
            style={{
              transformStyle: "preserve-3d",
              animation: "float-cube-reverse 9s ease-in-out infinite 1s",
            }}
          >
            <div
              className="cube-face w-full h-full"
              style={{ transform: "translateZ(28px)" }}
            />
            <div
              className="cube-face w-full h-full"
              style={{ transform: "translateZ(-28px)" }}
            />
            <div
              className="cube-face w-full"
              style={{
                height: "55px",
                transform: "rotateX(90deg) translateZ(28px)",
              }}
            />
            <div
              className="cube-face w-full"
              style={{
                height: "55px",
                transform: "rotateX(-90deg) translateZ(28px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Cube: Mid-Left (NODE_7A) */}
      <div className="absolute top-[55%] left-[4%] sm:left-[8%] z-20 pointer-events-none">
        <div className="relative">
          <span
            className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] text-[#8AFF00]/40 font-mono whitespace-nowrap"
            style={{ animation: "label-blink 6s ease-in-out infinite 2s" }}
          >
            NODE_7A
          </span>
          <div
            className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px]"
            style={{
              transformStyle: "preserve-3d",
              animation: "float-cube 10s ease-in-out infinite 2s",
            }}
          >
            <div
              className="cube-face w-full h-full"
              style={{ transform: "translateZ(20px)" }}
            />
            <div
              className="cube-face w-full h-full"
              style={{ transform: "translateZ(-20px)" }}
            />
            <div
              className="cube-face w-full"
              style={{
                height: "40px",
                transform: "rotateX(90deg) translateZ(20px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Cube: Bottom-Right (SWARM_09) */}
      <div className="absolute bottom-[15%] right-[5%] sm:right-[10%] z-20 pointer-events-none">
        <div className="relative">
          <span
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] text-[#8AFF00]/40 font-mono whitespace-nowrap"
            style={{ animation: "label-blink 5s ease-in-out infinite 3s" }}
          >
            SWARM_09
          </span>
          <div
            className="w-[50px] h-[50px] sm:w-[65px] sm:h-[65px]"
            style={{
              transformStyle: "preserve-3d",
              animation: "float-cube-reverse 7s ease-in-out infinite 0.5s",
            }}
          >
            <div
              className="cube-face w-full h-full"
              style={{ transform: "translateZ(22px)" }}
            />
            <div
              className="cube-face w-full h-full"
              style={{ transform: "translateZ(-22px)" }}
            />
            <div
              className="cube-face w-full"
              style={{
                height: "50px",
                transform: "rotateX(90deg) translateZ(22px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ====== FLOATING DIAMONDS ====== */}
      {[
        { top: "18%", left: "16%", size: 14, delay: "0s", dur: "6s" },
        { top: "42%", left: "7%", size: 10, delay: "1s", dur: "7s" },
        { top: "30%", right: "18%", size: 12, delay: "2s", dur: "5s" },
        { top: "75%", left: "20%", size: 8, delay: "0.5s", dur: "8s" },
        { top: "60%", right: "15%", size: 10, delay: "1.5s", dur: "6.5s" },
      ].map((d, i) => (
        <div
          key={`diamond-${i}`}
          className="absolute border border-[#8AFF00]/40 pointer-events-none z-20"
          style={{
            top: d.top,
            left: d.left,
            right: (d as any).right,
            width: d.size,
            height: d.size,
            animation: `float-diamond ${d.dur} ease-in-out infinite ${d.delay}`,
          }}
        />
      ))}

      {/* ====== CONNECTING LINES ====== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="15%"
          y1="18%"
          x2="35%"
          y2="12%"
          stroke="#8AFF00"
          strokeWidth="0.5"
          strokeDasharray="4 6"
          style={{ animation: "pulse-line 4s ease-in-out infinite" }}
        />
        <line
          x1="85%"
          y1="14%"
          x2="65%"
          y2="10%"
          stroke="#8AFF00"
          strokeWidth="0.5"
          strokeDasharray="4 6"
          style={{ animation: "pulse-line 5s ease-in-out infinite 1s" }}
        />
        <line
          x1="8%"
          y1="58%"
          x2="30%"
          y2="52%"
          stroke="#8AFF00"
          strokeWidth="0.5"
          strokeDasharray="4 6"
          style={{ animation: "pulse-line 6s ease-in-out infinite 2s" }}
        />
        <line
          x1="90%"
          y1="80%"
          x2="70%"
          y2="75%"
          stroke="#8AFF00"
          strokeWidth="0.5"
          strokeDasharray="4 6"
          style={{ animation: "pulse-line 4.5s ease-in-out infinite 0.5s" }}
        />
      </svg>

      {/* ====== 3D FLOOR GRID ====== */}
      <div
        className="absolute bottom-0 left-0 w-full h-[50vh] overflow-hidden pointer-events-none z-10"
        style={{ perspective: "800px" }}
      >
        <div
          className="absolute bottom-0 left-[-50%] w-[200%] h-[150%]"
          style={{
            transform: "rotateX(75deg)",
            transformOrigin: "bottom center",
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(138,255,0,0.8) 2px, transparent 2.5px),
              linear-gradient(to right, rgba(138,255,0,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(138,255,0,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "120px 120px, 120px 120px, 120px 120px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 60%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 60%, black 100%)",
          }}
        />
      </div>

      {/* ====== KEYHOLE + LOGIN FORM ====== */}
      <div className="relative z-30 flex justify-center items-center w-[700px] h-[900px] max-w-full shrink-0 mt-10">
        {/* Keyhole SVG Shape */}
        <svg
          width="700"
          height="900"
          viewBox="0 0 700 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <linearGradient id="keyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D8FF7B" />
              <stop offset="12%" stopColor="#C3FF42" />
              <stop offset="28%" stopColor="#A6FF00" />
              <stop offset="50%" stopColor="#8FFF00" />
              <stop offset="72%" stopColor="#A6FF00" />
              <stop offset="88%" stopColor="#C3FF42" />
              <stop offset="100%" stopColor="#D8FF7B" />
            </linearGradient>
          </defs>
          {/* Base Dark Fill */}
          <path
            d="
            M 202 363
            A 210 210 0 1 1 498 363
            L 580 850
            H 120
            Z
            "
            fill="rgba(4,4,4,0.7)"
            stroke="none"
          />
          {/* Dark Green Outer Border */}
          <path
            d="
            M 202 363
            A 210 210 0 1 1 498 363
            L 580 850
            H 120
            Z
            "
            stroke="#114400"
            strokeWidth="6"
            fill="transparent"
            vectorEffect="non-scaling-stroke"
          />
          {/* Main Gradient Border with Inner/Outer Glow */}
          <path
            d="
            M 202 363
            A 210 210 0 1 1 498 363
            L 580 850
            H 120
            Z
            "
            stroke="url(#keyGradient)"
            strokeWidth="2"
            fill="transparent"
            vectorEffect="non-scaling-stroke"
            style={{
              filter: `
                drop-shadow(0 0 2px rgba(166,255,0,.7))
                drop-shadow(0 0 8px rgba(166,255,0,.5))
                drop-shadow(0 0 20px rgba(166,255,0,.3))
                drop-shadow(0 20px 40px rgba(166,255,0,.25))
              `,
            }}
          />
        </svg>

        {/* ====== LOGIN UI ====== */}
        <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-[320px] max-w-[90vw] flex flex-col items-center z-40 px-5 sm:px-6">
          {/* 1. Header */}
          <div className="w-full flex flex-col items-center justify-center mb-[46px]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#8AFF00]/10 border border-[#8AFF00]/30 flex items-center justify-center mb-4">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#8AFF00]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white text-center leading-tight">
              Welcome to
            </h1>
            <h2
              className="text-4xl sm:text-5xl font-bold text-[#8AFF00] text-center mb-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Synchropia
            </h2>
            <p className="text-zinc-400 text-xs text-center tracking-wide">
              The Agentic Software Delivery Factory
            </p>
          </div>

          {/* 2. Tab Switcher */}
          <div className="w-full flex items-center justify-center gap-6 sm:gap-8 border-b border-zinc-800 mb-6">
            <button
              onClick={() => setActiveTab("signin")}
              className={`text-xs sm:text-sm font-semibold pb-2 transition-all ${activeTab === "signin" ? "text-[#8AFF00] border-b-2 border-[#8AFF00] translate-y-[1px]" : "text-zinc-500 hover:text-zinc-300 translate-y-[1px]"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`text-xs sm:text-sm font-semibold pb-2 transition-all ${activeTab === "create" ? "text-[#8AFF00] border-b-2 border-[#8AFF00] translate-y-[1px]" : "text-zinc-500 hover:text-zinc-300 translate-y-[1px]"}`}
            >
              Create Account
            </button>
          </div>

          {/* 3. Form Inputs */}
          <div className="w-full">
            <form onSubmit={handleSignIn} className="w-full space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@company.com"
                  className="w-full h-10 sm:h-11 pl-9 sm:pl-10 pr-4 rounded-lg bg-black/50 backdrop-blur-sm border border-zinc-700/50 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-[#8AFF00]/50 transition-colors"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 sm:h-11 pl-9 sm:pl-10 pr-16 rounded-lg bg-black/50 backdrop-blur-sm border border-zinc-700/50 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-[#8AFF00]/50 transition-colors"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AFF00] text-[10px] sm:text-xs font-semibold hover:underline"
                >
                  Forgot?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 sm:h-12 bg-gradient-to-r from-[#8AFF00] to-[#5abf00] hover:brightness-110 text-black font-bold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 sm:gap-3 transition-all disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>

            {/* Or Divider */}
            <div className="flex items-center gap-3 sm:gap-4 w-full my-4 sm:my-5">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[10px] sm:text-xs text-zinc-500">or</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Social Buttons */}
            <div className="w-full space-y-4 sm:space-y-5">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="w-full h-10 sm:h-11 flex items-center justify-center gap-2.5 sm:gap-3 rounded-lg border border-zinc-700/50 bg-black/50 backdrop-blur-sm hover:bg-zinc-900 text-xs sm:text-sm font-medium text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                className="w-full h-10 sm:h-11 flex items-center justify-center gap-2.5 sm:gap-3 rounded-lg border border-zinc-700/50 bg-black/50 backdrop-blur-sm hover:bg-zinc-900 text-xs sm:text-sm font-medium text-white transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-white"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Continue with GitHub
              </button>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-2 mt-8 sm:mt-12">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8AFF00] flex-shrink-0 mt-0.5" />
              <p className="text-[9px] sm:text-[10px] text-zinc-500 leading-relaxed text-left">
                Synchropia is VPC-isolated. Security assertions, token sessions,
                and keys are encrypted under strict Drizzle schema guidelines in
                multi-tenant containers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
