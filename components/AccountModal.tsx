"use client";

import React from "react";
import { X, User, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { StudentProfile, User as UserType } from "../types";

export default function AccountModal() {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    userName,
    userRoleState,
    handleLogout,
    currentStudent,
    setCurrentStudent
  } = useAuth() as any;

  const {
    students,
    setStudents,
    users,
    setUsers,
    addToast
  } = useData() as any;

  if (!isAccountModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-luna-950/80 backdrop-blur-xl animate-fade-in font-sans">
      <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl w-full max-w-md overflow-hidden p-8 relative">
        <button
          onClick={() => setIsAccountModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-luna-300/20 border-2 border-luna-300 flex items-center justify-center text-luna-300 text-2xl font-bold mx-auto mb-3 uppercase">
            {userName ? userName.charAt(0) : "U"}
          </div>
          <h2 className="text-xl font-bold text-white mb-0.5">{userName}</h2>
          <span className="text-[10px] bg-luna-300/10 border border-luna-300/35 text-luna-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-sans">
            {userRoleState === "student" ? "student" : userRoleState === "pr" ? "placement representative" : userRoleState === "departmental" ? "departmental coordinator" : "administrator"}
          </span>
        </div>

        {/* Account Credentials Edit Form */}
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.target as HTMLFormElement);
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

          const usernameLower = newUsername.toLowerCase();

          // Find current logged in user from DataContext users array
          // and update details
          const currentUserId = users.find((u: UserType) => u.email.toLowerCase() === userName.toLowerCase() || u.role.toLowerCase() === userRoleState.toLowerCase())?.id;

          if (userRoleState === "student" && currentStudent) {
            // Check if username already exists in another student profile
            const isUsernameTaken = students.some((s: StudentProfile) => s.username?.toLowerCase() === usernameLower && s.rollNo !== currentStudent.rollNo);
            if (isUsernameTaken) {
              addToast("Username already exists in another account.", "error");
              return;
            }

            setStudents((prev: StudentProfile[]) => prev.map(s => s.rollNo === currentStudent.rollNo ? { ...s, username: newUsername, passwordKey: newPass || s.passwordKey } : s));
            setCurrentStudent((prev: StudentProfile | null) => prev ? { ...prev, username: newUsername, passwordKey: newPass || prev.passwordKey } : null);
          }

          if (currentUserId) {
            setUsers((prev: UserType[]) => prev.map(u => u.id === currentUserId ? {
              ...u,
              email: newUsername,
              passwordHash: newPass || u.passwordHash
            } : u));
          }

          addToast("Account credentials updated successfully!", "success");
          setIsAccountModalOpen(false);
        }} className="space-y-4 font-sans text-xs">
          <div>
            <label className="text-[10px] text-slate-450 uppercase tracking-wider block mb-1 font-sans">Username / Email</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 group-focus-within:text-luna-300 transition-colors" size={14} />
              <input
                type="text"
                name="username"
                required
                defaultValue={
                  userRoleState === "student" && currentStudent ? (currentStudent.username || currentStudent.rollNo) : userName
                }
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-luna-300 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-450 uppercase tracking-wider block mb-1 font-sans">New Password (leave blank to keep current)</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-455 group-focus-within:text-luna-300 transition-colors" size={14} />
              <input
                type="password"
                name="password"
                placeholder="New Password"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-luna-300 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-455 uppercase tracking-wider block mb-1 font-sans">Confirm New Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-455 group-focus-within:text-luna-300 transition-colors" size={14} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-luna-300 font-sans"
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

        {/* Logout Option in Settings Dialog */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center font-sans">
          <button
            onClick={() => {
              setIsAccountModalOpen(false);
              handleLogout();
            }}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/25 text-red-455 border border-red-500/25 transition-all uppercase tracking-wider cursor-pointer"
          >
            Log Out Session
          </button>
        </div>

      </div>
    </div>
  );
}
