"use client";

import React, { useState } from "react";
import { Plus, Users, Mail, Phone, Linkedin, Edit2, Trash2, X } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { PRRecord } from "../types";

/**
 * PrsManagement component renders the registry of Placement Representatives (PRs)
 * and displays the registration/editing form overlay.
 */
export default function PrsManagement() {
  const { prs, savePR, deletePr, addToast } = useData();
  const { theme } = useAuth();

  // Local state for modal visibility and form editing
  const [prFormOpen, setPrFormOpen] = useState(false);
  const [editingPr, setEditingPr] = useState<PRRecord | null>(null);

  // Form Fields
  const [prNameInput, setPrNameInput] = useState("");
  const [prDeptInput, setPrDeptInput] = useState("CSE");
  const [prRoleInput, setPrRoleInput] = useState("Assistant PR");
  const [prEmailInput, setPrEmailInput] = useState("");
  const [prPhoneInput, setPrPhoneInput] = useState("");
  const [prLinkedinInput, setPrLinkedinInput] = useState("");

  /**
   * Opens the registration form modal. If a representative is provided,
   * fills the fields for editing.
   */
  const handleOpenPrForm = (pr?: PRRecord) => {
    if (pr) {
      setEditingPr(pr);
      setPrNameInput(pr.name);
      setPrDeptInput(pr.department);
      setPrEmailInput(pr.email);
      setPrPhoneInput(pr.phone);
      setPrRoleInput(pr.role);
      setPrLinkedinInput(pr.linkedin || "");
    } else {
      setEditingPr(null);
      setPrNameInput("");
      setPrDeptInput("CSE");
      setPrEmailInput("");
      setPrPhoneInput("");
      setPrRoleInput("Assistant PR");
      setPrLinkedinInput("");
    }
    setPrFormOpen(true);
  };

  /**
   * Dispatches the local form values to the global savePR state transaction.
   */
  const handleSubmitPr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prNameInput || !prEmailInput || !prPhoneInput) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    savePR(
      editingPr ? editingPr.id : null,
      prNameInput,
      prDeptInput,
      prEmailInput,
      prPhoneInput,
      prRoleInput,
      prLinkedinInput || undefined
    );
    setPrFormOpen(false);
  };

  /**
   * Prompts for confirmation and deletes a PR representative.
   */
  const handleDeletePrClick = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from Placement Representatives?`)) {
      deletePr(id, name);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white">Student Placement Force Management</h3>
          <p className="text-xs text-slate-400 font-serif font-semibold">View, update details, or register new Placement Representatives.</p>
        </div>
        <button
          onClick={() => handleOpenPrForm()}
          className="px-4 py-2 bg-luna-300 hover:bg-luna-50 text-luna-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-luna-300/10 cursor-pointer"
        >
          <Plus size={14} />
          Register PR
        </button>
      </div>

      {/* PR representatives list */}
      <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                <th className="p-4 sm:p-5">Representative Name</th>
                <th className="p-4 sm:p-5">Department</th>
                <th className="p-4 sm:p-5">Role</th>
                <th className="p-4 sm:p-5">Contact Details</th>
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {prs.map((pr) => (
                <tr key={pr.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white font-sans text-xs">
                    {pr.name}
                  </td>
                  <td className="p-4 sm:p-5">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-350 font-semibold font-sans uppercase">
                      {pr.department}
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 font-sans font-semibold text-[11px] text-luna-300">
                    {pr.role}
                  </td>
                  <td className="p-4 sm:p-5 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Mail size={10} className="text-slate-500" />
                      <span className="text-[10px] font-sans">{pr.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Phone size={10} className="text-slate-500" />
                      <span className="text-[10px] font-sans">{pr.phone}</span>
                    </div>
                    {pr.linkedin && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Linkedin size={10} className="text-slate-500" />
                        <span className="text-[9px] font-sans truncate max-w-[150px]">{pr.linkedin}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 sm:p-5 text-right space-x-2">
                    <button
                      onClick={() => handleOpenPrForm(pr)}
                      className="p-1.5 bg-white/5 hover:bg-luna-300 hover:text-luna-950 text-slate-300 border border-white/10 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                      title="Edit PR Details"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDeletePrClick(pr.id, pr.name)}
                      className="p-1.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-300 border border-white/10 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                      title="Delete PR"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
              {prs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                    No Placement Representatives registered in the system. Click 'Register PR' to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PR Modal Form */}
      {prFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
          <div className="glass-panel max-w-md w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col my-8">
            <button
              onClick={() => setPrFormOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <Users size={18} className="text-luna-300" />
              {editingPr ? "Edit Representative" : "Register Representative"}
            </h3>

            <form onSubmit={handleSubmitPr} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={prNameInput}
                  onChange={(e) => setPrNameInput(e.target.value)}
                  placeholder="e.g. Anish Kumar"
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Department</label>
                  <select
                    value={prDeptInput}
                    onChange={(e) => setPrDeptInput(e.target.value)}
                    className="w-full bg-luna-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Role</label>
                  <select
                    value={prRoleInput}
                    onChange={(e) => setPrRoleInput(e.target.value)}
                    className="w-full bg-luna-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                  >
                    <option value="Lead PR">Lead PR</option>
                    <option value="Assistant PR">Assistant PR</option>
                    <option value="Co-Lead PR">Co-Lead PR</option>
                    <option value="PR Coordinator">PR Coordinator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={prEmailInput}
                  onChange={(e) => setPrEmailInput(e.target.value)}
                  placeholder="e.g. anish.cse@nitpy.ac.in"
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={prPhoneInput}
                  onChange={(e) => setPrPhoneInput(e.target.value)}
                  placeholder="e.g. +91 94891 69301"
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">LinkedIn Profile (Optional)</label>
                <input
                  type="url"
                  value={prLinkedinInput}
                  onChange={(e) => setPrLinkedinInput(e.target.value)}
                  placeholder="e.g. https://linkedin.com/in/anish-cse"
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPrFormOpen(false)}
                  className="px-4 py-2 border border-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl text-xs uppercase"
                >
                  {editingPr ? "Save Changes" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
