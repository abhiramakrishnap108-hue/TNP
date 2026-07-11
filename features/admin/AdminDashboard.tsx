"use client";

import React, { useState } from "react";
import {
  Users,
  Activity,
  Award,
  Shield,
  Trash2,
  Mail,
  UserCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import PlacedDirectory from "../../components/PlacedDirectory";
import { User, UserRole, EditLogEntry, EventLogEntry } from "../../types";

export default function AdminDashboard() {
  const { userName } = useAuth() as any;
  const {
    users,
    setUsers,
    editLogs,
    eventLogs,
    addToast
  } = useData() as any;

  // Local state for active subtab in Admin Dashboard
  const [adminDashTab, setAdminDashTab] = useState<string>("accounts");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 flex flex-col gap-2">
        <div className="glass-panel p-6 rounded-3xl mb-4 border border-luna-300/20 text-center">
          <div className="w-20 h-20 rounded-full bg-luna-300/20 border-2 border-luna-300 flex items-center justify-center text-luna-300 text-3xl font-bold mx-auto mb-4 shadow-lg shadow-luna-300/20 uppercase">
            {userName ? userName.charAt(0) : "A"}
          </div>
          <h3 className="text-base font-bold text-white mb-1 leading-tight">{userName || "Administrator"}</h3>
          <p className="text-[10px] text-luna-300 font-bold uppercase tracking-widest">Global Admin</p>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-white/5 flex flex-col gap-1.5 h-full">
          {[
            { id: "accounts", label: "User Accounts", icon: <Users size={16} /> },
            { id: "logs", label: "Audit Logs", icon: <Activity size={16} /> },
            { id: "placed-directory", label: "Placed Directory", icon: <Award size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminDashTab(tab.id)}
              className={`w-full py-3 px-4 rounded-2xl text-left text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-3 cursor-pointer
                ${adminDashTab === tab.id
                  ? "bg-luna-300 text-luna-950 shadow-md shadow-luna-300/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="lg:col-span-3">

        {/* ACCOUNTS TAB */}
        {adminDashTab === "accounts" && (
          <div className="space-y-6 animate-fade-in font-sans text-xs">
            <div>
              <h3 className="text-xl font-black text-white">System Accounts Management</h3>
              <p className="text-xs text-slate-400 font-serif">View, update roles, or toggle active/inactive status for all user credentials.</p>
            </div>

            <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-[10px] text-slate-400 uppercase tracking-wider">
                      <th className="p-4 pl-6 font-bold">User ID / Email</th>
                      <th className="p-4 font-bold">System Role</th>
                      <th className="p-4 font-bold">Account Status</th>
                      <th className="p-4 pr-6 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {users.map((u: User) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 pl-6 font-semibold text-white">
                          <div className="flex flex-col">
                            <span>{u.email}</span>
                            <span className="text-[9px] text-slate-500 font-mono">ID: {u.id}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={u.role}
                            onChange={(e) => {
                              const nextRole = e.target.value as UserRole;
                              setUsers((prev: User[]) => prev.map(usr => usr.id === u.id ? { ...usr, role: nextRole } : usr));
                              addToast(`Updated role for ${u.email} to ${nextRole}`, "success");
                            }}
                            className="bg-black/45 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-luna-300 font-sans cursor-pointer"
                          >
                            <option value="STUDENT">STUDENT</option>
                            <option value="PR_COORDINATOR">PR_COORDINATOR</option>
                            <option value="DEPT_COORDINATOR">DEPT_COORDINATOR</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border
                            ${u.isActive
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : "bg-red-500/10 border-red-500/20 text-red-400"}`}
                          >
                            {u.isActive ? "Active" : "Deactivated"}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => {
                              setUsers((prev: User[]) => prev.map(usr => usr.id === u.id ? { ...usr, isActive: !usr.isActive } : usr));
                              addToast(`Account for ${u.email} ${u.isActive ? "deactivated" : "activated"}`, "info");
                            }}
                            className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[9px] border transition-all cursor-pointer
                              ${u.isActive
                                ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}`}
                          >
                            {u.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* AUDIT LOGS TAB */}
        {adminDashTab === "logs" && (
          <div className="space-y-6 animate-fade-in font-sans text-xs">
            <div>
              <h3 className="text-xl font-black text-white">System Audit & Change Logs</h3>
              <p className="text-xs text-slate-400 font-serif">Audit events generated from placement drive postings and scheduler updates.</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-sans flex items-center gap-2">
                <Shield size={16} className="text-luna-300" />
                Recruitment Drives Log
              </h4>
              <div className="space-y-3 font-mono text-[10px] max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {editLogs.length === 0 ? (
                  <p className="text-slate-500 italic font-serif">No edits logged yet. Updates to recruiters will appear here.</p>
                ) : (
                  editLogs.map((log: EditLogEntry) => (
                    <div key={log.id} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <div className="flex justify-between text-slate-400 mb-1 font-sans">
                        <span><strong>{log.changedBy}</strong> performed <strong>{log.actionType}</strong> on {log.companyName}</span>
                        <span className="text-[9px] font-mono">{log.timestamp}</span>
                      </div>
                      <p className="text-white font-serif">{log.details}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-sans flex items-center gap-2">
                <Activity size={16} className="text-luna-300" />
                Placement Events Log
              </h4>
              <div className="space-y-3 font-mono text-[10px] max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {eventLogs.length === 0 ? (
                  <p className="text-slate-500 italic font-serif">No event logs recorded.</p>
                ) : (
                  eventLogs.map((log: EventLogEntry) => (
                    <div key={log.id} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <div className="flex justify-between text-slate-400 mb-1 font-sans">
                        <span><strong>{log.changedBy}</strong> performed <strong>{log.actionType}</strong> on {log.eventTitle}</span>
                        <span className="text-[9px] font-mono">{log.timestamp}</span>
                      </div>
                      <p className="text-white font-serif">{log.details}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* PLACED DIRECTORY */}
        {adminDashTab === "placed-directory" && (
          <div className="space-y-6 font-sans">
            <div>
              <h3 className="text-xl font-black text-white">Placed Students Registry</h3>
              <p className="text-xs text-slate-400 font-serif">Global directory of students who successfully secured offers.</p>
            </div>
            <PlacedDirectory showBulkTools={true} />
          </div>
        )}

      </div>
    </div>
  );
}
