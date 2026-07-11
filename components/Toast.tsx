"use client";

import React from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useData } from "../context/DataContext";

/**
 * Toast notification component.
 * Renders floating alerts in the bottom-right corner of the screen.
 */
export default function Toast() {
  const { toasts, removeToast } = useData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-6 py-4 rounded-2xl shadow-xl text-white font-medium flex items-center gap-3 animate-slide-up backdrop-blur-xl border border-white/10
            ${
              toast.type === "success"
                ? "bg-luna-400/80 text-luna-950"
                : toast.type === "error"
                ? "bg-red-500/80"
                : "bg-luna-800/80"
            }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={16} />
          ) : toast.type === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <Info size={16} />
          )}
          <span className="text-sm font-sans tracking-wide">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-3 opacity-60 hover:opacity-100 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
