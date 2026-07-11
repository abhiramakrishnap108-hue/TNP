"use client";

import React from "react";
import { X, LogIn, User, Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/**
 * Modal dialogue managing regular session authentication and step-based password reset flows.
 */
export default function LoginModal() {
  const {
    isLoginOpen,
    setIsLoginOpen,
    loginRole,
    setLoginRole,
    loginUser,
    setLoginUser,
    loginPass,
    setLoginPass,
    handleLoginSubmit,
    showForgotPassword,
    setShowForgotPassword,
    forgotStep,
    setForgotStep,
    forgotEmail,
    setForgotEmail,
    enteredOtp,
    setEnteredOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    forgotRole,
    setForgotRole,
    handleForgotPasswordSubmit
  } = useAuth();

  if (!isLoginOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-luna-950/80 backdrop-blur-xl animate-fade-in font-sans">
      <div className="glass-modal rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-8 relative">
        {/* Close Modal Button */}
        <button
          onClick={() => {
            setIsLoginOpen(false);
            setShowForgotPassword(false);
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X size={16} />
        </button>

        {!showForgotPassword ? (
          <>
            {/* Login Mode Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white mb-2 flex items-center justify-center gap-2">
                <LogIn size={22} className="text-luna-300 animate-pulse" />
                T&P Portal Login
              </h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-sans">
                Access your dashboard and statistics
              </p>
            </div>

            {/* Role Selectors */}
            <div className="flex bg-white/5 border border-white/10 rounded-full p-1 mb-6">
              {(["student", "pr", "departmental", "admin"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setLoginRole(role)}
                  className={`flex-1 py-2 text-center rounded-full text-xs font-bold uppercase transition-all duration-305 cursor-pointer
                    ${loginRole === role
                      ? "bg-luna-300 text-luna-950 shadow-md animate-fade-in"
                      : "text-slate-400 hover:text-white"}`}
                >
                  {role === "student" ? "student" : role === "pr" ? "pr" : role === "departmental" ? "dept" : "admin"}
                </button>
              ))}
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 font-serif text-sm">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Username / Email"
                  required
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all font-sans"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-luna-300 to-luna-400 hover:from-luna-400 hover:to-luna-300 text-luna-950 font-bold rounded-xl shadow-lg hover:shadow-luna-300/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border border-luna-300 cursor-pointer"
              >
                Authenticate
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 text-center font-sans">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-luna-300 hover:text-white underline transition-colors cursor-pointer bg-transparent border-0"
              >
                Forgot Password?
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Password recovery flow */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-slate-400 text-xs font-serif leading-relaxed">
                {forgotStep === 0 && "Enter your registered email / username and select your role."}
                {forgotStep === 1 && "Enter the simulated 4-digit code shown as toast."}
                {forgotStep === 2 && "Enter your new portal login password."}
              </p>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 font-sans text-sm">
              {forgotStep === 0 && (
                <>
                  <div className="flex bg-white/5 border border-white/10 rounded-full p-1 mb-4">
                    {(["student", "pr", "departmental"] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setForgotRole(role)}
                        className={`flex-1 py-1.5 text-center rounded-full text-[10px] font-bold uppercase transition-all duration-300 cursor-pointer
                          ${forgotRole === role
                            ? "bg-luna-300 text-luna-950 shadow-md"
                            : "text-slate-400 hover:text-white"}`}
                      >
                        {role === "student" ? "student" : role === "pr" ? "pr" : "departmental"}
                      </button>
                    ))}
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                    <input
                      type="text"
                      placeholder="Registered Email / Username"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl shadow-lg transition-all font-sans uppercase text-xs cursor-pointer"
                  >
                    Request Verification Code
                  </button>
                </>
              )}

              {forgotStep === 1 && (
                <>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                    <input
                      type="text"
                      placeholder="Enter 4-digit OTP"
                      required
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all font-sans text-center tracking-widest font-black text-lg"
                      maxLength={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(0);
                        setForgotEmail("");
                      }}
                      className="flex-1 py-3 bg-white/5 border border-white/10 hover:border-luna-300 text-white font-bold rounded-xl transition-all font-sans uppercase text-xs text-center cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl shadow-lg transition-all font-sans uppercase text-xs cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                </>
              )}

              {forgotStep === 2 && (
                <>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                    <input
                      type="password"
                      placeholder="New Password (min 6 chars)"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all font-sans"
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl shadow-lg transition-all font-sans uppercase text-xs cursor-pointer"
                  >
                    Reset & Lock Credentials
                  </button>
                </>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
