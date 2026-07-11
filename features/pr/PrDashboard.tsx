"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  ListTodo,
  Activity,
  Mail,
  Phone,
  Linkedin,
  X,
  Users,
  Globe,
  ExternalLink,
  Settings,
  ShieldAlert,
  Award,
  Sliders,
  Briefcase,
  Eye
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import PlacedDirectory from "../../components/PlacedDirectory";
import { Company, PlacementEvent, PRRecord, EditLogEntry, EventLogEntry } from "../../types";

export default function PRDashboard() {
  const { userName, theme } = useAuth() as any;
  const {
    companies,
    setCompanies,
    companyDetails,
    setCompanyDetails,
    events,
    setEvents,
    eventLogs,
    setEventLogs,
    editLogs,
    setEditLogs,
    prs,
    setPrs,
    addToast
  } = useData() as any;

  // Local state for active subtab in PR Dashboard
  const [prDashTab, setPrDashTab] = useState<string>("companies");

  // Selected company insights popup details
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState<string | null>(null);

  // --- Company Form Modal states ---
  const [companyFormOpen, setCompanyFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // Form Fields for Company
  const [compFormName, setCompFormName] = useState("");
  const [compFormSector, setCompFormSector] = useState("IT / Software");
  const [compFormMaxPackage, setCompFormMaxPackage] = useState("");
  const [compFormAvgPackage, setCompFormAvgPackage] = useState("");
  const [compFormMinCgpa, setCompFormMinCgpa] = useState(6.0);
  const [compFormHires, setCompFormHires] = useState(0);
  const [compFormLogo, setCompFormLogo] = useState("");
  const [compFormLogoTransparent, setCompFormLogoTransparent] = useState(false);

  const [compFormOverview, setCompFormOverview] = useState("");
  const [compFormRounds, setCompFormRounds] = useState<string[]>([]);
  const [compFormNewRound, setCompFormNewRound] = useState("");
  const [compFormEvaluationFocus, setCompFormEvaluationFocus] = useState("");

  const [compFormLeetcodeFocus, setCompFormLeetcodeFocus] = useState("Medium");
  const [compFormDsaTopics, setCompFormDsaTopics] = useState("");
  const [compFormExamples, setCompFormExamples] = useState<string[]>([]);
  const [compFormNewExample, setCompFormNewExample] = useState("");

  const [compFormCoreSkills, setCompFormCoreSkills] = useState("");
  const [compFormCertifications, setCompFormCertifications] = useState("");
  const [compFormPlacedStudents, setCompFormPlacedStudents] = useState<any[]>([]);

  // --- Event Form states ---
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventFormTitle, setEventFormTitle] = useState("");
  const [eventFormDescription, setEventFormDescription] = useState("");
  const [eventFormDate, setEventFormDate] = useState("");
  const [eventFormTime, setEventFormTime] = useState("");
  const [eventFormVenue, setEventFormVenue] = useState("");
  const [eventFormGoogleFormUrl, setEventFormGoogleFormUrl] = useState("");
  const [eventFormType, setEventFormType] = useState("Drive");
  const [eventFormPoster, setEventFormPoster] = useState("");

  // --- PR Form Modal states ---
  const [prFormOpen, setPrFormOpen] = useState(false);
  const [editingPr, setEditingPr] = useState<PRRecord | null>(null);

  // Form Fields for PR
  const [prNameInput, setPrNameInput] = useState("");
  const [prDeptInput, setPrDeptInput] = useState("CSE");
  const [prRoleInput, setPrRoleInput] = useState("Lead PR");
  const [prEmailInput, setPrEmailInput] = useState("");
  const [prPhoneInput, setPrPhoneInput] = useState("");
  const [prLinkedinInput, setPrLinkedinInput] = useState("");

  // --- Handlers for Company Drives ---
  const handleOpenCompanyForm = (comp?: Company) => {
    if (comp) {
      setEditingCompany(comp);
      setCompFormName(comp.name);
      setCompFormSector(comp.sector);
      setCompFormMaxPackage(comp.maxPackage);
      setCompFormAvgPackage(comp.avgPackage);
      setCompFormMinCgpa(comp.minCgpa);
      setCompFormHires(comp.hires);
      setCompFormLogo(comp.logo);
      setCompFormLogoTransparent(comp.logo.startsWith("data:image"));

      const details = companyDetails[comp.name];
      if (details) {
        setCompFormOverview(details.overview);
        setCompFormRounds(details.selectionProcess.rounds || []);
        setCompFormEvaluationFocus(details.selectionProcess.criteria || "");
        setCompFormLeetcodeFocus(details.interviewInsights.leetcodeFocus || "Medium");
        setCompFormDsaTopics((details.interviewInsights.questionTypes || []).join(", "));
        setCompFormExamples(details.interviewInsights.examples || []);
        setCompFormCoreSkills((details.skills.core || []).join(", "));
        setCompFormCertifications(details.skills.additional || "");
        setCompFormPlacedStudents(details.placedStudents || []);
      } else {
        setCompFormOverview("");
        setCompFormRounds([]);
        setCompFormEvaluationFocus("");
        setCompFormLeetcodeFocus("Medium");
        setCompFormDsaTopics("");
        setCompFormExamples([]);
        setCompFormCoreSkills("");
        setCompFormCertifications("");
        setCompFormPlacedStudents([]);
      }
    } else {
      setEditingCompany(null);
      setCompFormName("");
      setCompFormSector("IT / Software");
      setCompFormMaxPackage("");
      setCompFormAvgPackage("");
      setCompFormMinCgpa(6.0);
      setCompFormHires(0);
      setCompFormLogo("");
      setCompFormLogoTransparent(false);
      setCompFormOverview("");
      setCompFormRounds([]);
      setCompFormEvaluationFocus("");
      setCompFormLeetcodeFocus("Medium");
      setCompFormDsaTopics("");
      setCompFormExamples([]);
      setCompFormCoreSkills("");
      setCompFormCertifications("");
      setCompFormPlacedStudents([]);
    }
    setCompFormNewRound("");
    setCompFormNewExample("");
    setCompanyFormOpen(true);
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compFormName || !compFormSector || !compFormMaxPackage || !compFormAvgPackage) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    if (!editingCompany && companies.some((c: Company) => c.name.toLowerCase() === compFormName.toLowerCase())) {
      addToast("A company with this name already exists", "error");
      return;
    }

    const finalLogo = compFormLogo || compFormName.slice(0, 3).toUpperCase();
    const companyName = compFormName.trim();

    const updatedDetails = {
      overview: compFormOverview,
      selectionProcess: {
        rounds: compFormRounds,
        criteria: compFormEvaluationFocus
      },
      interviewInsights: {
        questionTypes: compFormDsaTopics.split(",").map(t => t.trim()).filter(Boolean),
        leetcodeFocus: compFormLeetcodeFocus,
        examples: compFormExamples
      },
      skills: {
        core: compFormCoreSkills.split(",").map(s => s.trim()).filter(Boolean),
        additional: compFormCertifications
      },
      placedStudents: compFormPlacedStudents
    };

    const timestamp = new Date().toLocaleString();
    const changedBy = userName || "PR Representative";

    if (editingCompany) {
      const oldComp = editingCompany;
      const changes: string[] = [];

      if (oldComp.sector !== compFormSector) changes.push(`Sector: ${oldComp.sector} -> ${compFormSector}`);
      if (oldComp.maxPackage !== compFormMaxPackage) changes.push(`Max Package: ${oldComp.maxPackage} -> ${compFormMaxPackage}`);
      if (oldComp.avgPackage !== compFormAvgPackage) changes.push(`Avg Package: ${oldComp.avgPackage} -> ${compFormAvgPackage}`);
      if (oldComp.minCgpa !== compFormMinCgpa) changes.push(`Min CGPA: ${oldComp.minCgpa} -> ${compFormMinCgpa}`);
      if (oldComp.hires !== compFormHires) changes.push(`Hires: ${oldComp.hires} -> ${compFormHires}`);

      const detailsStr = changes.length > 0 ? `Updated properties: ${changes.join("; ")}` : "Updated details & insights template";

      setCompanies((prev: Company[]) => prev.map(c => c.name === oldComp.name ? {
        ...c,
        name: companyName,
        sector: compFormSector,
        logo: finalLogo,
        maxPackage: compFormMaxPackage,
        avgPackage: compFormAvgPackage,
        minCgpa: compFormMinCgpa,
        hires: compFormHires
      } : c));

      setCompanyDetails((prev: Record<string, any>) => {
        const next = { ...prev };
        if (oldComp.name !== companyName) {
          delete next[oldComp.name];
        }
        next[companyName] = updatedDetails;
        return next;
      });

      const newLog: EditLogEntry = {
        id: Date.now(),
        companyName,
        actionType: "Edit",
        changedBy,
        timestamp,
        details: detailsStr
      };
      setEditLogs((prev: EditLogEntry[]) => [newLog, ...prev]);
      addToast(`Updated company: ${companyName}`, "success");
    } else {
      const colorOptions = [
        "bg-blue-500/10 border-blue-500/30 text-blue-400",
        "bg-red-500/10 border-red-500/30 text-red-400",
        "bg-orange-500/10 border-orange-500/30 text-orange-400",
        "bg-green-500/10 border-green-500/30 text-green-400",
        "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
      ];
      const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

      const newComp: Company = {
        id: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name: companyName,
        sector: compFormSector,
        logo: finalLogo,
        maxPackage: compFormMaxPackage,
        avgPackage: compFormAvgPackage,
        minCgpa: compFormMinCgpa,
        hires: compFormHires,
        color: randomColor,
        description: `${companyName} is a global leader in ${compFormSector}, providing state-of-the-art products and services worldwide.`,
        website: `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
        isActive: true,
        status: "active"
      };

      setCompanies((prev: Company[]) => [newComp, ...prev]);
      setCompanyDetails((prev: Record<string, any>) => ({
        ...prev,
        [companyName]: updatedDetails
      }));

      const newLog: EditLogEntry = {
        id: Date.now(),
        companyName,
        actionType: "Add",
        changedBy,
        timestamp,
        details: `Registered brand new company profile for recruitment drives.`
      };
      setEditLogs((prev: EditLogEntry[]) => [newLog, ...prev]);
      addToast(`Successfully added: ${companyName}`, "success");
    }

    setCompanyFormOpen(false);
  };

  const handleSoftDeleteCompany = (companyName: string, currentStatus: "active" | "inactive") => {
    const nextStatus = currentStatus === "inactive" ? "active" : "inactive";
    const actionType = currentStatus === "inactive" ? "Restore" : "Soft Delete";

    setCompanies((prev: Company[]) =>
      prev.map(c => (c.name === companyName ? { ...c, status: nextStatus } : c))
    );

    const timestamp = new Date().toLocaleString();
    const changedBy = userName || "PR Representative";
    const newLog: EditLogEntry = {
      id: Date.now(),
      companyName,
      actionType,
      changedBy,
      timestamp,
      details: `${actionType === "Restore" ? "Restored" : "Deactivated"} company recruitment statuses.`
    };
    setEditLogs((prev: EditLogEntry[]) => [newLog, ...prev]);
    addToast(`${companyName} status updated to ${nextStatus}`, "info");
  };

  const handleHardDeleteCompany = (companyName: string) => {
    if (confirm(`Are you sure you want to permanently delete "${companyName}"? This will remove all interview insights.`)) {
      setCompanies((prev: Company[]) => prev.filter(c => c.name !== companyName));
      setCompanyDetails((prev: Record<string, any>) => {
        const next = { ...prev };
        delete next[companyName];
        return next;
      });

      const timestamp = new Date().toLocaleString();
      const changedBy = userName || "PR Representative";
      const newLog: EditLogEntry = {
        id: Date.now(),
        companyName,
        actionType: "Delete",
        changedBy,
        timestamp,
        details: `Permanently removed company credentials database record.`
      };
      setEditLogs((prev: EditLogEntry[]) => [newLog, ...prev]);
      addToast(`Deleted company: ${companyName}`, "error");

      if (selectedCompanyDetails === companyName) {
        setSelectedCompanyDetails(null);
      }
    }
  };

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
            {userName ? userName.charAt(0) : "PR"}
          </div>
          <h3 className="text-base font-bold text-white mb-1 leading-tight">{userName || "PR Representative"}</h3>
          <p className="text-[10px] text-luna-300 font-bold uppercase tracking-widest">Cell Coordinator</p>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-white/5 flex flex-col gap-1.5 h-full">
          {[
            { id: "companies", label: "Active Drives", icon: <Briefcase size={16} /> },
            { id: "schedule", label: "Event Scheduler", icon: <Calendar size={16} /> },
            { id: "prs", label: "PR Force Management", icon: <Users size={16} /> },
            { id: "placed-directory", label: "Placed Directory", icon: <Award size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setPrDashTab(tab.id)}
              className={`w-full py-3 px-4 rounded-2xl text-left text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-3 cursor-pointer
                ${prDashTab === tab.id
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

        {/* TABS CONTAINER */}

        {/* DRIVES MANAGER TAB */}
        {prDashTab === "companies" && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Active Recruitment Drives</h3>
                <p className="text-xs text-slate-400 font-serif">Add, edit details, or remove company profiles.</p>
              </div>

              <button
                onClick={() => handleOpenCompanyForm()}
                className="px-5 py-2.5 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start cursor-pointer font-sans"
              >
                <Plus size={15} />
                Add Recruitment Drive
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.map((company: Company, index: number) => (
                <div
                  key={index}
                  onClick={() => setSelectedCompanyDetails(company.name)}
                  className={`glass-panel p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between text-xs cursor-pointer group
                    ${company.status === "inactive" ? "opacity-60 border-red-500/20 hover:border-red-500/40" : "border-white/5 hover:border-white/20"}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {company.logo.startsWith("data:image") ? (
                          <img src={company.logo} alt={company.name} className="w-10 h-10 rounded-xl object-contain bg-white/5 p-1" />
                        ) : (
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white ${company.color || 'bg-luna-300/20'}`}>
                            {company.logo}
                          </div>
                        )}
                        <div>
                          <h4 className="text-base font-bold text-white group-hover:text-luna-300 transition-colors flex items-center gap-1.5 font-sans">
                            {company.name}
                            {company.status === "inactive" && (
                              <span className="px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/30 text-[8px] text-red-300 uppercase font-black font-sans">
                                Inactive
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-slate-400 block">{company.sector}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-slate-350">
                        Min CGPA: {company.minCgpa.toFixed(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-xs text-center mb-4 font-sans">
                      <div>
                        <span className="text-[9px] text-slate-400 block">Max Package</span>
                        <span className="font-bold text-white">{company.maxPackage}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block">Avg Package</span>
                        <span className="font-bold text-white">{company.avgPackage}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block">Hired Count</span>
                        <span className="font-bold text-white">{company.hires}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 font-sans text-xs relative z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCompanyForm(company);
                      }}
                      className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 hover:border-luna-300 text-center font-semibold transition-all cursor-pointer"
                    >
                      Edit Drive
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSoftDeleteCompany(company.name, company.status || "active");
                      }}
                      className={`px-3 py-2 rounded-lg border transition-all text-[10px] font-bold uppercase cursor-pointer
                        ${company.status === "inactive"
                          ? "bg-green-500/10 hover:bg-green-500/30 border-green-500/30 text-green-300"
                          : "bg-orange-500/15 hover:bg-orange-500/35 border-orange-500/30 text-orange-200"}`}
                      title={company.status === "inactive" ? "Restore Company" : "Deactivate (Soft Delete)"}
                    >
                      {company.status === "inactive" ? "Restore" : "Deactivate"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHardDeleteCompany(company.name);
                      }}
                      className="px-3 py-2 bg-red-500/15 hover:bg-red-500/35 border border-red-500/30 rounded-lg text-red-200 transition-all flex-shrink-0 cursor-pointer"
                      title="Delete Permanently"
                    >
                      <Trash2 size={14} className="mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULE PLACEMENTS TAB */}
        {prDashTab === "schedule" && (
          <div className="space-y-8 animate-fade-in font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Left: Event Form Panel */}
              <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 text-xs">
                <h3 className="text-base font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3 font-sans">
                  <Calendar size={18} className="text-luna-300" />
                  {editingEventId !== null ? "Edit Placement Event" : "Schedule Placement Event"}
                </h3>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const timestamp = new Date().toLocaleString();
                  const changedBy = userName || "PR Representative";

                  if (editingEventId !== null) {
                    const oldEvent = events.find((ev: PlacementEvent) => ev.id === editingEventId);
                    setEvents((prev: PlacementEvent[]) => prev.map(ev => ev.id === editingEventId ? {
                      id: editingEventId,
                      title: eventFormTitle,
                      description: eventFormDescription,
                      date: eventFormDate,
                      time: eventFormTime,
                      venue: eventFormVenue,
                      type: eventFormType,
                      googleFormUrl: eventFormGoogleFormUrl || "https://forms.gle/fallback-rsvp",
                      poster: eventFormPoster
                    } : ev));

                    const newLog: EventLogEntry = {
                      id: Date.now(),
                      eventTitle: eventFormTitle,
                      actionType: "Edit",
                      changedBy,
                      timestamp,
                      details: `Updated event: ${oldEvent?.title !== eventFormTitle ? `${oldEvent?.title} -> ${eventFormTitle}` : eventFormTitle}`
                    };
                    setEventLogs((prev: EventLogEntry[]) => [newLog, ...prev]);
                    addToast(`Updated event: ${eventFormTitle}`, "success");
                    setEditingEventId(null);
                  } else {
                    const newEvent: PlacementEvent = {
                      id: Date.now(),
                      title: eventFormTitle,
                      description: eventFormDescription,
                      date: eventFormDate,
                      time: eventFormTime,
                      venue: eventFormVenue,
                      type: eventFormType,
                      googleFormUrl: eventFormGoogleFormUrl || "https://forms.gle/fallback-rsvp",
                      poster: eventFormPoster
                    };
                    setEvents((prev: PlacementEvent[]) => [...prev, newEvent]);

                    const newLog: EventLogEntry = {
                      id: Date.now(),
                      eventTitle: eventFormTitle,
                      actionType: "Add",
                      changedBy,
                      timestamp,
                      details: `Created new ${eventFormType} event.`
                    };
                    setEventLogs((prev: EventLogEntry[]) => [newLog, ...prev]);
                    addToast(`Scheduled: ${eventFormTitle}`, "success");
                  }

                  setEventFormTitle("");
                  setEventFormDescription("");
                  setEventFormDate("");
                  setEventFormTime("");
                  setEventFormVenue("");
                  setEventFormGoogleFormUrl("");
                  setEventFormType("Drive");
                  setEventFormPoster("");
                }} className="space-y-4 font-sans text-xs">

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Event / Drive Title *</label>
                    <input
                      type="text"
                      required
                      value={eventFormTitle}
                      onChange={(e) => setEventFormTitle(e.target.value)}
                      placeholder="e.g. Capgemini Recruitment Drive"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Description / Subtitle</label>
                    <textarea
                      value={eventFormDescription}
                      onChange={(e) => setEventFormDescription(e.target.value)}
                      placeholder="Provide short details about eligibility, round details, and focus areas..."
                      rows={3}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 font-serif leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Drive Date *</label>
                      <input
                        type="text"
                        required
                        value={eventFormDate}
                        onChange={(e) => setEventFormDate(e.target.value)}
                        placeholder="e.g. July 14, 2026"
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Drive Time *</label>
                      <input
                        type="text"
                        required
                        value={eventFormTime}
                        onChange={(e) => setEventFormTime(e.target.value)}
                        placeholder="e.g. 10:00 AM"
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Event Venue *</label>
                    <input
                      type="text"
                      required
                      value={eventFormVenue}
                      onChange={(e) => setEventFormVenue(e.target.value)}
                      placeholder="e.g. Science Block Interview Cabins"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Google Form Registration Link *</label>
                    <input
                      type="url"
                      required
                      value={eventFormGoogleFormUrl}
                      onChange={(e) => setEventFormGoogleFormUrl(e.target.value)}
                      placeholder="e.g. https://forms.gle/event-rsvp"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Event Type *</label>
                    <select
                      value={eventFormType}
                      onChange={(e) => setEventFormType(e.target.value)}
                      className="w-full bg-luna-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 font-sans"
                    >
                      <option value="Drive">Recruitment Drive</option>
                      <option value="PPT">Pre-Placement Talk (PPT)</option>
                      <option value="Mock Test">Mock Assessment Test</option>
                      <option value="Seminar">Skill Development Seminar</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Poster Image URL (Optional)</label>
                    <input
                      type="url"
                      value={eventFormPoster}
                      onChange={(e) => setEventFormPoster(e.target.value)}
                      placeholder="Enter custom image URL..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 mb-2"
                    />

                    <span className="text-[9px] text-slate-500 block mb-1">Or select a stock poster template:</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Presentation", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80" },
                        { label: "Mock Coding", url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80" },
                        { label: "Hardware", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80" },
                        { label: "Seminar", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80" }
                      ].map((st, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEventFormPoster(st.url)}
                          className={`p-1 bg-black/40 border rounded-lg text-[9px] hover:border-luna-300 transition-all text-center cursor-pointer ${eventFormPoster === st.url ? "border-luna-300 text-luna-300" : "border-white/5 text-slate-400"}`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl shadow-lg transition-all text-xs uppercase cursor-pointer"
                    >
                      {editingEventId !== null ? "Save Changes" : "Publish Scheduled Event"}
                    </button>
                    {editingEventId !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEventId(null);
                          setEventFormTitle("");
                          setEventFormDescription("");
                          setEventFormDate("");
                          setEventFormTime("");
                          setEventFormVenue("");
                          setEventFormGoogleFormUrl("");
                          setEventFormType("Drive");
                          setEventFormPoster("");
                        }}
                        className="px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl shadow-lg transition-all text-xs uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right: Scheduled Events List & Audit Trail Logs */}
              <div className="lg:col-span-7 space-y-6">

                {/* Scheduled Events management */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 text-xs">
                  <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2 font-sans">
                    <ListTodo size={16} className="text-luna-300" />
                    Active Scheduled Events ({events.length})
                  </h3>

                  <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                    {events.length === 0 ? (
                      <p className="text-slate-400 py-4 text-center font-serif">No active scheduled events.</p>
                    ) : (
                      events.map((ev: PlacementEvent) => (
                        <div key={ev.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex justify-between items-center gap-4 hover:border-white/10 transition-all text-xs">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded bg-luna-300/10 border border-luna-300/20 text-[9px] font-bold text-luna-300 uppercase font-sans">
                                {ev.type}
                              </span>
                              <span className="text-[10px] text-slate-400 font-sans">{ev.date}</span>
                            </div>
                            <h4 className="text-xs font-bold text-white truncate max-w-[280px]">{ev.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 font-serif truncate max-w-[280px]">{ev.description || "No description provided."}</p>
                            <span className="text-[10px] text-slate-500 block mt-1">Venue: {ev.venue}</span>
                          </div>

                          <div className="flex gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => {
                                setEditingEventId(ev.id);
                                setEventFormTitle(ev.title);
                                setEventFormDescription(ev.description || "");
                                setEventFormDate(ev.date);
                                setEventFormTime(ev.time);
                                setEventFormVenue(ev.venue);
                                setEventFormGoogleFormUrl(ev.googleFormUrl);
                                setEventFormType(ev.type);
                                setEventFormPoster(ev.poster || "");
                                addToast(`Loaded for editing: ${ev.title}`, "info");
                              }}
                              className="p-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 rounded-xl transition-all cursor-pointer"
                              title="Edit Event"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete the event: "${ev.title}"?`)) {
                                  const timestamp = new Date().toLocaleString();
                                  const changedBy = userName || "PR Representative";
                                  setEvents((prev: PlacementEvent[]) => prev.filter(e => e.id !== ev.id));

                                  const newLog: EventLogEntry = {
                                    id: Date.now(),
                                    eventTitle: ev.title,
                                    actionType: "Delete",
                                    changedBy,
                                    timestamp,
                                    details: `Deleted event: ${ev.title}`
                                  };
                                  setEventLogs((prev: EventLogEntry[]) => [newLog, ...prev]);
                                  addToast(`Deleted event: ${ev.title}`, "info");

                                  if (editingEventId === ev.id) {
                                    setEditingEventId(null);
                                    setEventFormTitle("");
                                    setEventFormDescription("");
                                    setEventFormDate("");
                                    setEventFormTime("");
                                    setEventFormVenue("");
                                    setEventFormGoogleFormUrl("");
                                    setEventFormType("Drive");
                                    setEventFormPoster("");
                                  }
                                }
                              }}
                              className="p-2 bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 rounded-xl transition-all cursor-pointer"
                              title="Delete Event"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Audit Logs Trail */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 text-xs">
                  <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2 font-sans">
                    <Activity size={16} className="text-luna-300" />
                    Event Management Audit Logs
                  </h3>

                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {eventLogs.length === 0 ? (
                      <p className="text-slate-500 py-3 text-center font-serif">No logs generated yet.</p>
                    ) : (
                      eventLogs.map((log: EventLogEntry) => (
                        <div key={log.id} className="bg-black/20 border border-white/5 rounded-xl p-3 text-[10px] space-y-1.5">
                          <div className="flex justify-between items-center font-sans">
                            <span className={`px-1.5 py-0.5 rounded font-black text-[8px] uppercase tracking-wide
                              ${log.actionType === "Add" ? "bg-green-500/10 border border-green-500/30 text-green-300" :
                                log.actionType === "Edit" ? "bg-blue-500/10 border border-blue-500/30 text-blue-300" :
                                  "bg-red-500/10 border border-red-500/30 text-red-300"}`}
                            >
                              {log.actionType}
                            </span>
                            <span className="text-slate-500 font-mono text-[9px]">{log.timestamp}</span>
                          </div>
                          <p className="text-slate-300 leading-normal font-serif">
                            <strong>{log.eventTitle}</strong>: {log.details}
                          </p>
                          <span className="text-slate-400 block text-[9px] font-sans font-bold">Author: {log.changedBy}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* PR FORCE MANAGEMENT TAB */}
        {prDashTab === "prs" && (
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
                  <tbody className="divide-y divide-white/5 text-slate-300 font-sans">
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
                        <td className="p-4 sm:p-5 space-y-0.5 text-xs">
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
                        className="px-4 py-2 border border-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase hover:bg-white/5 cursor-pointer"
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
        {prDashTab === "placed-directory" && (
          <PlacedDirectory showBulkTools={true} />
        )}
      </div>

      {/* --- RECRUITER INSIGHTS MODAL (IF SELECTED) --- */}
      {selectedCompanyDetails && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
          <div className="glass-panel max-w-3xl w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col my-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-luna-300/5 rounded-full blur-2xl"></div>

            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-white">{selectedCompanyDetails} Insights</h3>
                <p className="text-[10px] text-slate-400 font-serif">Alumni Prep Handbook • NITPY Placement Cell</p>
              </div>
              <button
                onClick={() => setSelectedCompanyDetails(null)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-luna-300 text-slate-450 hover:text-white transition cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {(() => {
              const details = companyDetails[selectedCompanyDetails];
              if (!details) {
                return (
                  <div className="p-8 text-center text-slate-400 font-serif">
                    No insights listed yet for {selectedCompanyDetails}. Contact placement coordinator for interview feedback catalogs.
                  </div>
                );
              }

              return (
                <div className="space-y-6 text-xs max-h-[500px] overflow-y-auto pr-1">
                  {/* Overview */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-white uppercase tracking-wider text-[10px] text-luna-300">Company Overview</h5>
                    <p className="text-slate-350 leading-relaxed font-serif">{details.overview}</p>
                  </div>

                  {/* Selection Process */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-white uppercase tracking-wider text-[10px] text-luna-300">Selection Process</h5>
                    <p className="text-slate-400 font-bold mb-1 font-serif">Eligibility: {details.selectionProcess.criteria}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {details.selectionProcess.rounds.map((round: any, i: number) => {
                        const roundTitle = typeof round === "object" ? round.round : `Round ${i + 1}`;
                        const roundCriteria = typeof round === "object" ? round.criteria : round;
                        return (
                          <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1">
                            <span className="font-bold text-white block">{roundTitle}</span>
                            <p className="text-slate-350 font-serif text-[11px] leading-relaxed">{roundCriteria}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interview Focus & LeetCode difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <h5 className="font-bold text-white uppercase tracking-wider text-[10px] text-luna-300">LeetCode Practice Focus</h5>
                      <span className="inline-block px-3 py-1 rounded bg-luna-300/10 border border-luna-300/30 text-luna-300 font-bold uppercase tracking-wider mb-2 font-mono">
                        {details.interviewInsights.leetcodeFocus} Complexity
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-350 font-serif leading-relaxed">
                        {details.interviewInsights.questionTypes.map((type: string, i: number) => (
                          <li key={i}>Common topics: <strong>{type}</strong></li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-bold text-white uppercase tracking-wider text-[10px] text-luna-300">Skills Requirements</h5>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {details.skills.core.map((skill: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 text-slate-300 rounded font-semibold font-sans">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-slate-355 font-serif text-[11px] leading-relaxed">{details.skills.additional}</p>
                    </div>
                  </div>

                  {/* Past Questions examples */}
                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <h5 className="font-bold text-white uppercase tracking-wider text-[10px] text-luna-300">Alumni Prep Highlights</h5>
                    <ul className="list-decimal pl-4 space-y-2 text-slate-350 font-serif leading-relaxed">
                      {details.interviewInsights.examples.map((ex: string, i: number) => (
                        <li key={i}>"{ex}"</li>
                      ))}
                    </ul>
                  </div>

                  {/* Placed alumni roster */}
                  {details.placedStudents && details.placedStudents.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <h5 className="font-bold text-white uppercase tracking-wider text-[10px] text-luna-300">Placed Alumni Contacts</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {details.placedStudents.map((alumni: any, i: number) => (
                          <div key={i} className="p-3 bg-black/20 border border-white/5 rounded-2xl flex justify-between items-center">
                            <div>
                              <span className="font-bold text-white block font-sans">{alumni.name}</span>
                              <span className="text-[10px] text-slate-400 block font-sans">{alumni.role} • Class of {alumni.year || "2025"}</span>
                            </div>
                            {alumni.linkedin && (
                              <a
                                href={alumni.linkedin.startsWith("http") ? alumni.linkedin : `https://linkedin.com/in/${alumni.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500 hover:text-white font-bold transition uppercase tracking-wider font-sans"
                              >
                                Connect
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex justify-end border-t border-white/10 pt-4 mt-6">
              <button
                onClick={() => setSelectedCompanyDetails(null)}
                className="px-5 py-2.5 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Close Insights
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT COMPANY MODAL DIALOG --- */}
      {companyFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
          <div className="glass-panel max-w-2xl w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col my-8">
            <button
              onClick={() => setCompanyFormOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <Briefcase size={18} className="text-luna-300" />
              {editingCompany ? `Edit Recruitment Details: ${compFormName}` : "Create Recruitment Drive"}
            </h3>

            <form onSubmit={handleSaveCompany} className="space-y-5 text-xs max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingCompany}
                    value={compFormName}
                    onChange={(e) => setCompFormName(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Sector *</label>
                  <select
                    value={compFormSector}
                    onChange={(e) => setCompFormSector(e.target.value)}
                    className="w-full bg-luna-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                  >
                    <option value="IT / Software">IT / Software</option>
                    <option value="Hardware / VLSI">Hardware / VLSI</option>
                    <option value="Management Consulting">Management Consulting</option>
                    <option value="Core Engineering">Core Engineering</option>
                    <option value="Analytics / Finance">Analytics / Finance</option>
                  </select>
                </div>
              </div>

              {/* Package and Eligibility */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Max package *</label>
                  <input
                    type="text"
                    required
                    value={compFormMaxPackage}
                    onChange={(e) => setCompFormMaxPackage(e.target.value)}
                    placeholder="e.g. 45.5 LPA"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Avg package *</label>
                  <input
                    type="text"
                    required
                    value={compFormAvgPackage}
                    onChange={(e) => setCompFormAvgPackage(e.target.value)}
                    placeholder="e.g. 18.2 LPA"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Min CGPA Threshold *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="4.0"
                    max="10.0"
                    required
                    value={compFormMinCgpa}
                    onChange={(e) => setCompFormMinCgpa(parseFloat(e.target.value) || 6.0)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                  />
                </div>
              </div>

              {/* Hires and Logo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Total Hires Count</label>
                  <input
                    type="number"
                    value={compFormHires}
                    onChange={(e) => setCompFormHires(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Logo Character or Data URL</label>
                  <input
                    type="text"
                    value={compFormLogo}
                    onChange={(e) => setCompFormLogo(e.target.value)}
                    placeholder="e.g. G (or base64/link)"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                  />
                </div>
              </div>

              {/* Overview Details */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Company Overview</label>
                <textarea
                  value={compFormOverview}
                  onChange={(e) => setCompFormOverview(e.target.value)}
                  rows={2}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 font-serif leading-relaxed"
                  placeholder="Provide overview of company operations..."
                />
              </div>

              {/* Round configuration */}
              <div className="space-y-2 bg-white/5 border border-white/5 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-white uppercase block mb-1">Selection Rounds Configuration</span>
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto mb-2 pr-1">
                  {compFormRounds.map((rnd, i) => (
                    <div key={i} className="flex justify-between items-center bg-black/20 border border-white/5 px-3 py-1.5 rounded-xl font-serif">
                      <span>{rnd}</span>
                      <button
                        type="button"
                        onClick={() => setCompFormRounds(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-300 underline font-sans text-[10px] font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {compFormRounds.length === 0 && <span className="text-slate-450 italic font-serif">No selection rounds declared yet.</span>}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={compFormNewRound}
                    onChange={(e) => setCompFormNewRound(e.target.value)}
                    placeholder="e.g. Technical Coding Test (Hackerrank)"
                    className="flex-grow bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (compFormNewRound.trim()) {
                        setCompFormRounds(prev => [...prev, compFormNewRound.trim()]);
                        setCompFormNewRound("");
                      }
                    }}
                    className="px-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Evaluation criteria focus */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Evaluation Focus / Eligibility Averages</label>
                <input
                  type="text"
                  value={compFormEvaluationFocus}
                  onChange={(e) => setCompFormEvaluationFocus(e.target.value)}
                  placeholder="e.g. Strong foundation in DSA, DBMS and Operating Systems"
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                />
              </div>

              {/* LeetCode practice and DSA topics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">LeetCode practice level focus</label>
                  <select
                    value={compFormLeetcodeFocus}
                    onChange={(e) => setCompFormLeetcodeFocus(e.target.value)}
                    className="w-full bg-luna-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                  >
                    <option value="Easy">Easy Level</option>
                    <option value="Medium">Medium Level Focus</option>
                    <option value="Hard">Hard Level Focus</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">DSA Topics (Comma separated)</label>
                  <input
                    type="text"
                    value={compFormDsaTopics}
                    onChange={(e) => setCompFormDsaTopics(e.target.value)}
                    placeholder="e.g. Trees, Graphs, DP, HashMaps"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                  />
                </div>
              </div>

              {/* Core skills and Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Core Tech Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={compFormCoreSkills}
                    onChange={(e) => setCompFormCoreSkills(e.target.value)}
                    placeholder="e.g. C++, Java, DBMS, React"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Additional Certifications / Averages</label>
                  <input
                    type="text"
                    value={compFormCertifications}
                    onChange={(e) => setCompFormCertifications(e.target.value)}
                    placeholder="e.g. AWS Certification, Node.js projects"
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                  />
                </div>
              </div>

              {/* Alumni prep highlights list */}
              <div className="space-y-2 bg-white/5 border border-white/5 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-white uppercase block mb-1">Alumni Interview Questions / Highlights</span>
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto mb-2 pr-1">
                  {compFormExamples.map((ex, i) => (
                    <div key={i} className="flex justify-between items-center bg-black/20 border border-white/5 px-3 py-1.5 rounded-xl font-serif">
                      <span className="truncate max-w-[400px]">{ex}</span>
                      <button
                        type="button"
                        onClick={() => setCompFormExamples(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-red-400 hover:text-red-300 underline font-sans text-[10px] font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {compFormExamples.length === 0 && <span className="text-slate-450 italic font-serif">No highlights logged yet. Add one below.</span>}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={compFormNewExample}
                    onChange={(e) => setCompFormNewExample(e.target.value)}
                    placeholder="e.g. Implement a thread-safe LRU Cache in C++"
                    className="flex-grow bg-black/30 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (compFormNewExample.trim()) {
                        setCompFormExamples(prev => [...prev, compFormNewExample.trim()]);
                        setCompFormNewExample("");
                      }
                    }}
                    className="px-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-2 font-sans">
                <button
                  type="button"
                  onClick={() => setCompanyFormOpen(false)}
                  className="px-4 py-2 border border-white/10 text-slate-350 rounded-xl font-bold uppercase transition hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl uppercase transition cursor-pointer"
                >
                  {editingCompany ? "Save Company Changes" : "Create Recruitment Drive"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
