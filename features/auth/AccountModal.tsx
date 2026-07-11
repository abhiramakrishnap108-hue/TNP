"use client";

import React from "react";
import { X, User, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";

/**
 * Modal dialogue to view profile settings, modify portal credentials, or log out of the active session.
 */
export default function AccountModal() {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    userName,
    userRoleState,
    loggedInUserId,
    currentStudent,
    setCurrentStudent,
    handleLogout
  } = useAuth();

  const {
    users,
    setUsers,
    students,
    setStudents,
    addToast
  } = useData();

  if (!isAccountModalOpen) return null;

  // Retrieve current user credentials from useData users list
  const currentUserRecord = users.find(u => u.id === loggedInUserId);
  const currentUsername = currentUserRecord ? currentUserRecord.email : "";

  const handleAccountSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newUsername = fd.get("username") as string;
    const newPass = fd.get("password") as string;
    const confirmPass = fd.get("confirmPassword") as string;

    if (!newUsername) {
      addToast("Username cannot be empty", "error");
      return;
    }

    if (newPass) {
      if (newPass.length < 6) {
        addToast("Password must be at least 6 characters long", "error");
        return;
      }
      if (newPass !== confirmPass) {
        addToast("Passwords do not match", "error");
        return;
      }
    }

    // 1. Check username collisions (skip checking if it's the current user's email)
    const isUsernameTaken = users.some(
      u => u.email.toLowerCase() === newUsername.toLowerCase() && u.id !== loggedInUserId
    );
    if (isUsernameTaken) {
      addToast("Username / Email is already taken by another account", "error");
      return;
    }

    // 2. Update global users credentials registry
    setUsers(prev =>
      prev.map(u =>
        u.id === loggedInUserId
          ? {
              ...u,
              email: newUsername,
              passwordHash: newPass || u.passwordHash
            }
          : u
      )
    );

    // 3. Update specific student tables if applicable
    if (userRoleState === "student" && currentStudent) {
      setStudents(prev =>
        prev.map(s =>
          s.rollNo === currentStudent.rollNo
            ? {
                ...s,
                username: newUsername,
                passwordKey: newPass || s.passwordKey
              }
            : s
        )
      );

      // Sync active student state in session context
      setCurrentStudent(prev =>
        prev
          ? {
              ...prev,
              username: newUsername,
              passwordKey: newPass || prev.passwordKey
            }
          : null
      );
    }

    addToast("Account credentials updated successfully!", "success");
    setIsAccountModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-luna-950/80 backdrop-blur-xl animate-fade-in font-sans">
      <div className="glass-modal rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-8 relative">
        {/* Close Button */}
        <button
          onClick={() => setIsAccountModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* User Badge Profile */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-luna-300/20 border-2 border-luna-300 flex items-center justify-center text-luna-300 text-2xl font-bold mx-auto mb-3 uppercase">
            {userName.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-white mb-0.5">{userName}</h2>
          <span className="text-[10px] bg-luna-300/10 border border-luna-300/35 text-luna-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-sans">
            {userRoleState === "student"
              ? "student"
              : userRoleState === "pr"
              ? "placement representative"
              : userRoleState === "admin"
              ? "administrator"
              : "departmental coordinator"}
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleAccountSubmit} className="space-y-4 font-sans text-xs">
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Username / Email
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={14} />
              <input
                type="text"
                name="username"
                required
                defaultValue={currentUsername}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-luna-300"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              New Password (leave blank to keep current)
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={14} />
              <input
                type="password"
                name="password"
                placeholder="New Password"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-650 focus:outline-none focus:border-luna-300"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Confirm New Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={14} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-650 focus:outline-none focus:border-luna-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl shadow-lg transition-all text-xs uppercase cursor-pointer"
          >
            Save Account Updates
          </button>
        </form>

        {/* Logout Session */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <button
            onClick={() => {
              setIsAccountModalOpen(false);
              handleLogout();
            }}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/25 text-red-350 border border-red-500/25 transition-all uppercase tracking-wider cursor-pointer"
          >
            Log Out Session
          </button>
        </div>
      </div>
    </div>
  );
}
