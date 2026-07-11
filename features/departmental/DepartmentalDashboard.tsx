"use client";

import React, { useState } from "react";
import {
  Search,
  Edit2,
  Plus,
  Mail,
  Phone,
  Linkedin,
  X,
  Users,
  Trash2,
  Award,
  BarChart3,
  GraduationCap
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import PlacedDirectory from "../../components/PlacedDirectory";
import { StudentProfile, PRRecord } from "../../types";

export default function DepartmentalDashboard() {
  const { userName } = useAuth() as any;
  const {
    students,
    setStudents,
    companies,
    prs,
    setPrs,
    addToast
  } = useData() as any;

  // Local state for active subtab in Departmental Dashboard
  const [departmentalDashTab, setDepartmentalDashTab] = useState<string>("students");

  // Filtering states for students tab
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("All"); // Used as department selector

  // PR Form modal states (Departmental coordinators can also manage PRs)
  const [prFormOpen, setPrFormOpen] = useState(false);
  const [editingPr, setEditingPr] = useState<PRRecord | null>(null);

  // Form Fields for PR
  const [prNameInput, setPrNameInput] = useState("");
  const [prDeptInput, setPrDeptInput] = useState("CSE");
  const [prRoleInput, setPrRoleInput] = useState("Lead PR");
  const [prEmailInput, setPrEmailInput] = useState("");
  const [prPhoneInput, setPrPhoneInput] = useState("");
  const [prLinkedinInput, setPrLinkedinInput] = useState("");

  // --- Handlers for PR Representatives ---
  const handleOpenPrForm = (pr?: PRRecord) => {
    if (pr) {
      setEditingPr(pr);
      setPrNameInput(pr.name);
      setPrDeptInput(pr.department);
      setPrRoleInput(pr.role);
      setPrEmailInput(pr.email);
      setPrPhoneInput(pr.phone);
      setPrLinkedinInput(pr.linkedin || "");
    } else {
      setEditingPr(null);
      setPrNameInput("");
      setPrDeptInput("CSE");
      setPrRoleInput("Lead PR");
      setPrEmailInput("");
      setPrPhoneInput("");
      setPrLinkedinInput("");
    }
    setPrFormOpen(true);
  };

  const handleSavePr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prNameInput || !prEmailInput || !prPhoneInput) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    if (editingPr) {
      setPrs((prev: PRRecord[]) => prev.map(pr => pr.id === editingPr.id ? {
        ...pr,
        name: prNameInput,
        department: prDeptInput,
        role: prRoleInput,
        email: prEmailInput,
        phone: prPhoneInput,
        linkedin: prLinkedinInput || undefined
      } : pr));
      addToast(`Updated PR Representative: ${prNameInput}`, "success");
    } else {
      const newPr: PRRecord = {
        id: Date.now(),
        name: prNameInput,
        department: prDeptInput,
        role: prRoleInput,
        email: prEmailInput,
        phone: prPhoneInput,
        linkedin: prLinkedinInput || undefined
      };
      setPrs((prev: PRRecord[]) => [...prev, newPr]);
      addToast(`Registered PR Representative: ${prNameInput}`, "success");
    }

    setPrFormOpen(false);
  };

  const handleDeletePr = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove PR Representative: "${name}"?`)) {
      setPrs((prev: PRRecord[]) => prev.filter(pr => pr.id !== id));
      addToast(`Removed PR: ${name}`, "info");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 flex flex-col gap-2">
        <div className="glass-panel p-6 rounded-3xl mb-4 border border-luna-300/20 text-center">
          <div className="w-20 h-20 rounded-full bg-luna-300/20 border-2 border-luna-300 flex items-center justify-center text-luna-300 text-3xl font-bold mx-auto mb-4 shadow-lg shadow-luna-300/20 uppercase">
            {userName ? userName.charAt(0) : "DC"}
          </div>
          <h3 className="text-base font-bold text-white mb-1 leading-tight">{userName || "Dept Coordinator"}</h3>
          <p className="text-[10px] text-luna-300 font-bold uppercase tracking-widest">Department Liaison</p>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-white/5 flex flex-col gap-1.5 h-full">
          {[
            { id: "students", label: "Student Registry", icon: <GraduationCap size={16} /> },
            { id: "metrics", label: "System Metrics", icon: <BarChart3 size={16} /> },
            { id: "prs", label: "PR Force Management", icon: <Users size={16} /> },
            { id: "placed-directory", label: "Placed Directory", icon: <Award size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setDepartmentalDashTab(tab.id)}
              className={`w-full py-3 px-4 rounded-2xl text-left text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-3 cursor-pointer
                ${departmentalDashTab === tab.id
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

        {/* STUDENT RECORDS REGISTRY TAB */}
        {departmentalDashTab === "students" && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Student Placement Registry</h3>
                <p className="text-xs text-slate-400 font-serif">View records, adjust CGPA, and edit eligibility flags.</p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-wrap gap-2.5 items-center">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search student name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 w-44"
                  />
                </div>

                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="bg-luna-950 border border-white/10 rounded-full py-2 px-3 text-xs text-white focus:outline-none focus:border-luna-300 font-sans"
                >
                  <option value="All">All Departments</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>
            </div>

            {/* Student Records Table Card */}
            <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden shadow-xl">
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider font-bold">
                      <th className="p-4 sm:p-5">Roll No</th>
                      <th className="p-4 sm:p-5">Student Name</th>
                      <th className="p-4 sm:p-5">Dept</th>
                      <th className="p-4 sm:p-5">CGPA</th>
                      <th className="p-4 sm:p-5 text-center">Eligibility</th>
                      <th className="p-4 sm:p-5 text-center">Status</th>
                      <th className="p-4 sm:p-5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {students
                      .filter((s: StudentProfile) => {
                        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchDept = selectedSector === "All" || s.department === selectedSector;
                        return matchSearch && matchDept;
                      })
                      .map((student: StudentProfile) => (
                        <tr key={student.rollNo} className="hover:bg-white/[0.01] transition-colors">
                          <td className="p-4 sm:p-5 uppercase font-bold text-slate-450">{student.rollNo}</td>
                          <td className="p-4 sm:p-5 font-semibold text-white">{student.name}</td>
                          <td className="p-4 sm:p-5">{student.department}</td>
                          <td className="p-4 sm:p-5 font-bold">{student.cgpa.toFixed(1)}</td>
                          <td className="p-4 sm:p-5 text-center">
                            <button
                              onClick={() => {
                                setStudents((prev: StudentProfile[]) => prev.map(s => s.rollNo === student.rollNo ? { ...s, isEligible: !s.isEligible } : s));
                                addToast(`Toggled eligibility for ${student.name}`, "info");
                              }}
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border transition-colors cursor-pointer
                                ${student.isEligible
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                  : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"}`}
                            >
                              {student.isEligible ? "Eligible" : "Ineligible"}
                            </button>
                          </td>
                          <td className="p-4 sm:p-5 text-center">
                            <button
                              onClick={() => {
                                setStudents((prev: StudentProfile[]) => prev.map(s => s.rollNo === student.rollNo ? { ...s, isPlaced: !s.isPlaced } : s));
                                addToast(`Toggled placement status for ${student.name}`, "info");
                              }}
                              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase transition-colors cursor-pointer
                                ${student.isPlaced
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-slate-700/30 text-slate-400"}`}
                            >
                              {student.isPlaced ? "Placed" : "Unplaced"}
                            </button>
                          </td>
                          <td className="p-4 sm:p-5 text-center">
                            <button
                              onClick={() => {
                                const newCgpaStr = prompt(`Edit CGPA for ${student.name}:`, student.cgpa.toString());
                                if (newCgpaStr === null) return;
                                const newCgpa = parseFloat(newCgpaStr);
                                if (isNaN(newCgpa) || newCgpa < 0 || newCgpa > 10) {
                                  addToast("Please enter a valid CGPA between 0 and 10", "error");
                                  return;
                                }
                                const phone = prompt(`Edit Phone number for ${student.name}:`, student.phone) || student.phone;

                                setStudents((prev: StudentProfile[]) => prev.map(s => s.rollNo === student.rollNo ? { ...s, cgpa: newCgpa, phone } : s));
                                addToast(`Updated record for ${student.name}!`, "success");
                              }}
                              className="p-1 text-luna-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit details"
                            >
                              <Edit2 size={14} className="mx-auto" />
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

        {/* METRICS TAB */}
        {departmentalDashTab === "metrics" && (
          <div className="space-y-6 animate-fade-in font-sans text-xs">
            <div>
              <h3 className="text-xl font-black text-white">System Metrics Dashboard</h3>
              <p className="text-xs text-slate-400 font-serif">High-level statistics derived from current registry state.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-sans">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] uppercase text-slate-400 tracking-wider">Total Enrolled</span>
                <h4 className="text-3xl font-black text-white mt-1">{students.length}</h4>
                <p className="text-[9px] text-slate-500 mt-1">3rd Year B.Tech</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] uppercase text-slate-400 tracking-wider">Placed Students</span>
                <h4 className="text-3xl font-black text-white mt-1 text-luna-300">
                  {students.filter((s: StudentProfile) => s.isPlaced).length}
                </h4>
                <p className="text-[9px] text-slate-500 mt-1 font-bold">Across all depts</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] uppercase text-slate-400 tracking-wider">Placement Rate</span>
                <h4 className="text-3xl font-black text-white mt-1">
                  {((students.filter((s: StudentProfile) => s.isPlaced).length / students.length) * 100).toFixed(0)}%
                </h4>
                <p className="text-[9px] text-slate-500 mt-1 font-bold">Target Rate: 90%</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] uppercase text-slate-400 tracking-wider">Active Recruiters</span>
                <h4 className="text-3xl font-black text-white mt-1">{companies.length}</h4>
                <p className="text-[9px] text-slate-500 mt-1 font-bold">Vetted partner companies</p>
              </div>
            </div>

            {/* CGPA Distribution / Department Statistics list */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 font-sans">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Departmental Breakdown</h4>
              <div className="space-y-4">
                {["CSE", "ECE", "EEE", "Mechanical", "Civil"].map((dept) => {
                  const deptStudents = students.filter((s: StudentProfile) => s.department === dept);
                  const placedCount = deptStudents.filter((s: StudentProfile) => s.isPlaced).length;
                  const rate = deptStudents.length > 0 ? (placedCount / deptStudents.length) * 100 : 0;
                  return (
                    <div key={dept} className="space-y-1.5">
                      <div className="flex justify-between font-semibold text-white">
                        <span>{dept} Department</span>
                        <span className="text-slate-350">{placedCount} / {deptStudents.length} Placed ({rate.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-luna-300 h-full rounded-full transition-all duration-500" style={{ width: `${rate}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PR FORCE MANAGEMENT TAB */}
        {departmentalDashTab === "prs" && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Student Placement Force Management</h3>
                <p className="text-xs text-slate-400 font-serif">View, update details, or register new Placement Representatives.</p>
              </div>
              <button
                onClick={() => handleOpenPrForm()}
                className="px-4 py-2 bg-luna-300 hover:bg-luna-50 text-luna-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-luna-300/10 cursor-pointer font-sans"
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
                    {prs.map((pr: PRRecord) => (
                      <tr key={pr.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-white text-xs">
                          {pr.name}
                        </td>
                        <td className="p-4 sm:p-5">
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-350 font-semibold uppercase">
                            {pr.department}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 font-semibold text-[11px] text-luna-300">
                          {pr.role}
                        </td>
                        <td className="p-4 sm:p-5 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Mail size={10} className="text-slate-500" />
                            <span>{pr.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Phone size={10} className="text-slate-500" />
                            <span>{pr.phone}</span>
                          </div>
                          {pr.linkedin && (
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Linkedin size={10} className="text-slate-500" />
                              <span className="text-[9px] truncate max-w-[150px]">{pr.linkedin}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 sm:p-5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenPrForm(pr)}
                            className="p-1.5 bg-white/5 hover:bg-luna-300 hover:text-luna-950 text-slate-300 border border-white/10 rounded-lg transition-all cursor-pointer"
                            title="Edit PR Details"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeletePr(pr.id, pr.name)}
                            className="p-1.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-300 border border-white/10 rounded-lg transition-all cursor-pointer"
                            title="Delete PR"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {prs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 italic font-serif">
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

                  <form onSubmit={handleSavePr} className="space-y-4 text-xs">
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

                    <div className="flex justify-end gap-3 pt-2 font-sans">
                      <button
                        type="button"
                        onClick={() => setPrFormOpen(false)}
                        className="px-4 py-2 border border-white/10 text-slate-305 rounded-xl text-xs font-bold uppercase hover:bg-white/5 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl text-xs uppercase cursor-pointer"
                      >
                        {editingPr ? "Save Changes" : "Register"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PLACED DIRECTORY TAB */}
        {departmentalDashTab === "placed-directory" && (
          <PlacedDirectory showBulkTools={true} />
        )}

      </div>
    </div>
  );
}
