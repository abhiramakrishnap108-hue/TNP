"use client";

import React from "react";
import {
  Sun,
  Moon,
  LogIn,
  FileText,
  Check,
  ShieldAlert,
  Info,
  X
} from "lucide-react";

// Providers
import { DataProvider, useData } from "../context/DataContext";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Modular Components
import ParticleBackground from "../components/ParticleBackground";
import AccountModal from "../components/AccountModal";
import Footer from "../components/Footer";

// Modular Feature Dashboards
import VisitorLanding from "../features/visitor/VisitorLanding";
import StudentDashboard from "../features/student/StudentDashboard";
import PrDashboard from "../features/pr/PrDashboard";
import DepartmentalDashboard from "../features/departmental/DepartmentalDashboard";
import AdminDashboard from "../features/admin/AdminDashboard";

function TNPPortalContent() {
  const {
    isLoggedIn,
    userRoleState,
    userName,
    activeTab,
    setActiveTab,
    theme,
    setTheme,
    setIsLoginOpen,
    setIsAccountModalOpen
  } = useAuth() as any;

  const { toasts, setToasts } = useData() as any;

  return (
    <div className={`transition-colors duration-500 min-h-screen relative overflow-x-hidden ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
      {/* Global Background Layer */}
      <div className={`fixed inset-0 z-[-2] transition-colors duration-500 ${theme === "light" ? "bg-white" : "bg-luna-950"}`} />

      {/* Interactive HTML5 Canvas Particle Background */}
      <ParticleBackground />

      {/* Aurora Particle System - Global float assets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[60vw] h-[60vw] rounded-full bg-luna-300/10 blur-[130px] -top-[20vw] -left-[20vw] animate-aurora-glow-1"></div>
        <div className="absolute w-[50vw] h-[50vw] rounded-full bg-luna-600/10 blur-[120px] top-[40vh] -right-[15vw] animate-aurora-glow-2"></div>
        <div className="absolute w-[30vw] h-[30vw] rounded-full bg-luna-50/5 blur-[100px] bottom-[10vh] left-[5vw] animate-float-slow"></div>
      </div>

      {/* Pre-pinned Glassmorphic Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a
            href="https://www.nitpy.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 cursor-pointer group z-10"
          >
            <img
              src="/assests/college_logo.png"
              alt="NITPY Logo"
              className="h-14 w-auto object-contain drop-shadow-md rounded-full bg-white/20 p-1 transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=200";
              }}
            />
            <div>
              <h1 className={`text-lg md:text-xl font-bold tracking-tight font-sans transition-colors
                ${theme === "dark"
                  ? "bg-gradient-to-r from-luna-300 via-luna-50 to-luna-400 bg-clip-text text-transparent group-hover:text-luna-300"
                  : "text-luna-900 group-hover:text-luna-700"}`}>
                NIT PUDUCHERRY
              </h1>
              <p className={`text-[10px] uppercase font-semibold tracking-[0.18em]
                ${theme === "dark" ? "text-luna-300/80" : "text-luna-700"}`}>
                Training & Placement Cell
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 font-sans">
            {["home", "vision", "about", "team", "events", "contact"].map((item) => (
              <a
                key={item}
                href={`#/${item}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item);
                }}
                className={`text-xs lg:text-sm font-semibold tracking-wide uppercase transition-all duration-300 relative py-2 px-1
                  ${activeTab === item
                    ? (theme === "dark" ? "text-luna-300 font-bold" : "text-luna-750 font-bold")
                    : (theme === "dark" ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900")}`}
              >
                {item === "home" ? "Home"
                  : item === "vision" ? "Vision"
                    : item === "about" ? "About"
                      : item === "team" ? "Our Team"
                        : item === "events" ? "Events"
                          : "Contact Us"}
                {activeTab === item && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-luna-300 rounded-full shadow-[0_0_10px_rgba(84,172,191,0.8)] animate-pulse" />
                )}
              </a>
            ))}

            {isLoggedIn && (
              <a
                href="#/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("dashboard");
                }}
                className={`text-xs lg:text-sm font-semibold tracking-wide uppercase transition-all duration-300 relative py-2 px-1
                  ${activeTab === "dashboard"
                    ? (theme === "dark" ? "text-luna-300 font-bold" : "text-luna-750 font-bold")
                    : (theme === "dark" ? "text-slate-300 hover:text-white" : "text-slate-755 hover:text-slate-900")}`}
              >
                Dashboard
                {activeTab === "dashboard" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-luna-300 rounded-full shadow-[0_0_10px_rgba(84,172,191,0.8)] animate-pulse" />
                )}
              </a>
            )}

            <a
              href="/assests/NITPY Placement Brochure 2026-27.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-4 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2
                ${theme === "dark"
                  ? "border-luna-300/30 hover:border-luna-300 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md"
                  : "border-luna-600/30 hover:border-luna-600 bg-luna-50/50 hover:bg-luna-100/70 text-luna-900 backdrop-blur-md"}`}
            >
              <FileText size={15} className={theme === "dark" ? "text-luna-300" : "text-luna-600"} />
              Brochure
            </a>

            {isLoggedIn ? (
              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <button
                  onClick={() => setIsAccountModalOpen(true)}
                  className="w-10 h-10 rounded-full bg-luna-300/10 border-2 border-luna-300/50 hover:border-luna-300 flex items-center justify-center text-luna-300 text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer uppercase"
                  title="My Account Settings"
                >
                  {userName ? userName.charAt(0) : "U"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="ml-4 px-6 py-2.5 rounded-full text-sm font-bold bg-luna-300 hover:bg-luna-50 text-luna-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(84,172,191,0.5)] flex items-center gap-2 border border-luna-300 cursor-pointer"
              >
                <LogIn size={15} />
                Login
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer
                ${theme === "dark"
                  ? "bg-luna-800/50 border-luna-300/20 text-luna-300 hover:bg-luna-300 hover:text-luna-950"
                  : "bg-slate-100 border-luna-500/20 text-luna-800 hover:bg-luna-800 hover:text-white"}`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </nav>

          {/* Mobile Navigation controls */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full border border-luna-300/20 bg-luna-800/20 text-luna-300 cursor-pointer"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {isLoggedIn && (
              <a
                href="#/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("dashboard");
                }}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-luna-300/20 border border-luna-300/40 text-luna-300 transition-all font-sans"
              >
                Dashboard
              </a>
            )}

            {isLoggedIn ? (
              <button
                onClick={() => setIsAccountModalOpen(true)}
                className="w-8 h-8 rounded-full bg-luna-300/10 border-2 border-luna-300/50 hover:border-luna-300 flex items-center justify-center text-luna-300 text-xs font-bold shadow-lg transition-all duration-300 cursor-pointer uppercase"
                title="My Account Settings"
              >
                {userName ? userName.charAt(0) : "U"}
              </button>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-4 py-2 rounded-full text-xs font-bold bg-luna-300 text-luna-950 hover:bg-luna-50 transition-all cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Content Area */}
      <main className="relative z-10 pt-20">
        {activeTab !== "home" && (
          <div className="relative h-[35vh] min-h-[220px] flex items-center justify-center overflow-hidden border-b border-luna-300/10 z-10 bg-gradient-to-b from-luna-950 via-luna-900/50 to-luna-950">
            {/* Subtle moving background blobs */}
            <div className="absolute inset-0 bg-luna-950">
              <div className="absolute w-[40vw] h-[40vw] rounded-full bg-luna-300/5 blur-[100px] -top-[10vw] -left-[10vw]"></div>
              <div className="absolute w-[40vw] h-[40vw] rounded-full bg-luna-600/5 blur-[100px] -bottom-[10vw] -right-[10vw]"></div>
              {/* Grid overlay for high-tech premium feel */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl pt-6">
              <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight text-white mb-3 bg-gradient-to-r from-luna-300 via-luna-50 to-luna-400 bg-clip-text text-transparent drop-shadow-md capitalize">
                {activeTab === "team"
                  ? "Our Placement Team"
                  : activeTab === "contact"
                    ? "Contact & FAQ Support"
                    : activeTab === "about"
                      ? "About T&P Cell"
                      : activeTab === "vision"
                        ? "Placement Cell Vision"
                        : activeTab === "events"
                          ? "Upcoming Events & Calendar"
                          : activeTab === "dashboard"
                            ? "Placement Portal Dashboard"
                            : activeTab}
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-300 font-bold tracking-[0.25em] uppercase max-w-2xl mx-auto">
                {activeTab === "vision" && "Fostering strategic leadership and bridging the industrial-academic gap"}
                {activeTab === "about" && "Aims, facilities, MoUs, and recruitment guidelines of the institute"}
                {activeTab === "team" && "Dedicated faculty representatives and operations nurturing divisions"}
                {activeTab === "events" && "Chronological calendar, mock drives, and corporate presentation schedules"}
                {activeTab === "contact" && "Reach out to the placement desk, find driving routes, or view support questions"}
                {activeTab === "dashboard" && `Logged in session: ${userName || "User"} (${(userRoleState || "Guest").toUpperCase()})`}
              </p>
            </div>
          </div>
        )}

        {activeTab === "dashboard" && isLoggedIn ? (
          <section id="portal-dashboard" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {userRoleState === "student" && <StudentDashboard />}
            {userRoleState === "pr" && <PrDashboard />}
            {userRoleState === "departmental" && <DepartmentalDashboard />}
            {userRoleState === "admin" && <AdminDashboard />}
          </section>
        ) : (
          <>
            <VisitorLanding activeTab={activeTab} theme={theme} />
            <Footer />
          </>
        )}
      </main>

      {/* Modal Dialogues */}
      <AccountModal />

      {/* --- TOASTS DRAWER --- */}
      <div className="fixed bottom-6 right-6 z-[150] flex flex-col gap-3 pointer-events-none font-sans">
        {toasts.map((toast: any) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-6 py-4 rounded-2xl shadow-xl text-white font-medium flex items-center gap-3 animate-slide-up backdrop-blur-xl border border-white/10
              ${toast.type === "success"
                ? "bg-emerald-500/90 text-white"
                : toast.type === "error"
                  ? "bg-red-500/90"
                  : "bg-luna-800/90"}`}
          >
            {toast.type === "success" && <Check size={18} />}
            {toast.type === "error" && <ShieldAlert size={18} />}
            {toast.type === "info" && <Info size={18} />}
            <span className="text-xs font-bold uppercase tracking-wider">{toast.message}</span>
            <button
              onClick={() => setToasts((prev: any) => prev.filter((t: any) => t.id !== toast.id))}
              className="ml-3 opacity-60 hover:opacity-100 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DataProvider>
      <AuthProvider>
        <TNPPortalContent />
      </AuthProvider>
    </DataProvider>
  );
}
