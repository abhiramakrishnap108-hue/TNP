"use client";

import React, { useState } from "react";
import {
  X,
  Building2,
  CheckCircle2,
  Sparkles,
  Award,
  Briefcase,
  Linkedin,
  History as HistoryIcon,
  AlertCircle
} from "lucide-react";
import { useData } from "../context/DataContext";

interface CompanyDetailsModalProps {
  companyName: string;
  onClose: () => void;
  theme: "dark" | "light";
}

/**
 * CompanyDetailsModal - Displays rich details, selection criteria, placed students,
 * and edit history logs for a specific corporate drive.
 */
export default function CompanyDetailsModal({
  companyName,
  onClose,
  theme
}: CompanyDetailsModalProps) {
  const { companies, companyDetails, editLogs } = useData();
  const [detailsTab, setDetailsTab] = useState<"info" | "history" | "placed">("info");

  const details = companyDetails[companyName];
  const matchedComp = companies.find((c) => c.name === companyName);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="glass-panel max-w-3xl w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col my-8">
        {/* Background gradient decor */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-luna-300/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="border-b border-white/10 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border shadow-inner bg-luna-300/10 border-luna-300/35 text-luna-300">
              {matchedComp?.logo || companyName.slice(0, 3).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                {companyName}
              </h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-sans mt-0.5">
                Recruitment Insights & Selection Guidelines
              </p>
            </div>
          </div>

          {matchedComp && (
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-3 text-[11px] font-sans">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Max Offer</span>
                <strong className="text-white text-xs">{matchedComp.maxPackage}</strong>
              </div>
              <div className="w-[1px] h-6 bg-white/10"></div>
              <div>
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Avg Offer</span>
                <strong className="text-white text-xs">{matchedComp.avgPackage}</strong>
              </div>
              <div className="w-[1px] h-6 bg-white/10"></div>
              <div>
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Min CGPA</span>
                <strong className="text-white text-xs">{matchedComp.minCgpa?.toFixed(1) || "6.0"}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Modal Tabs */}
        <div className="flex gap-4 border-b border-white/5 mb-6 text-xs font-sans">
          <button
            onClick={() => setDetailsTab("info")}
            className={`pb-2 font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              detailsTab === "info"
                ? "border-luna-300 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Insights & Guidelines
          </button>
          <button
            onClick={() => setDetailsTab("placed")}
            className={`pb-2 font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              detailsTab === "placed"
                ? "border-luna-300 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Placed Students
          </button>
          <button
            onClick={() => setDetailsTab("history")}
            className={`pb-2 font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              detailsTab === "history"
                ? "border-luna-300 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Edit History
          </button>
        </div>

        {/* Modal Content */}
        {detailsTab === "info" &&
          (details ? (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-xs">
              {/* Overview Paragraph */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <h4 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wider flex items-center gap-2 font-sans">
                  <Building2 size={14} className="text-luna-300" />
                  Company Overview
                </h4>
                <p className="text-slate-350 leading-relaxed font-serif text-[12px]">
                  {details.overview}
                </p>
              </div>

              {/* Two Column details: Selection process and Interview Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Selection Process */}
                <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-white mb-3 uppercase tracking-wider flex items-center gap-2 font-sans">
                      <CheckCircle2 size={14} className="text-luna-300" />
                      Selection Process
                    </h4>
                    <ul className="space-y-3 pl-1">
                      {details.selectionProcess?.rounds?.map((round: any, idx: number) => (
                        <li key={idx} className="flex gap-2 items-start text-slate-300">
                          <span className="w-4 h-4 rounded-full bg-luna-300/10 border border-luna-300/40 text-[9px] font-black text-luna-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">
                            {typeof round === "object" ? `${round.round}: ${round.criteria}` : round}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px]">
                    <span className="text-slate-400 font-bold block uppercase tracking-wider mb-1">Evaluation Focus</span>
                    <p className="text-slate-355 italic">{details.selectionProcess?.criteria}</p>
                  </div>
                </div>

                {/* Interview Insights & Questions */}
                <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-white mb-3 uppercase tracking-wider flex items-center gap-2 font-sans">
                      <Sparkles size={14} className="text-luna-300" />
                      Interview Insights
                    </h4>

                    <div className="mb-4">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">LeetCode / Coding Focus</span>
                      <span className="px-2.5 py-1 rounded-full bg-luna-300/15 border border-luna-300/35 text-[10px] font-bold text-luna-300">
                        {details.interviewInsights?.leetcodeFocus}
                      </span>
                    </div>

                    <div className="mb-4">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">Key DSA Topics</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {details.interviewInsights?.questionTypes?.map((type: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[9px] text-slate-300 font-semibold">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1.5">Sample Interview Questions</span>
                      <div className="space-y-2.5">
                        {details.interviewInsights?.examples?.map((example: string, idx: number) => (
                          <div key={idx} className="bg-black/20 border border-white/5 rounded-xl p-2.5 text-slate-300 italic font-mono text-[10px] leading-relaxed relative">
                            "{example}"
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">Core Valued Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {details.skills?.core?.map((skill: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold text-[10px]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">Additional Edge-Giving Certs</h4>
                  <p className="text-slate-355 leading-relaxed italic">{details.skills?.additional}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              <AlertCircle size={24} className="mx-auto mb-2 text-slate-500" />
              <p>Detailed insights for {companyName} are not available yet.</p>
            </div>
          ))}

        {detailsTab === "history" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-xs font-sans">
            <h4 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
              <HistoryIcon size={14} className="text-luna-300" />
              Audit Trail & Edit History Logs
            </h4>
            {editLogs.filter((log) => log.companyName.toLowerCase() === companyName.toLowerCase()).length === 0 ? (
              <div className="text-center py-12 text-slate-400 border border-dashed border-white/5 rounded-2xl">
                No edits or modifications have been logged for this company yet.
              </div>
            ) : (
              <div className="space-y-3">
                {editLogs
                  .filter((log) => log.companyName.toLowerCase() === companyName.toLowerCase())
                  .map((log) => (
                    <div key={log.id} className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase
                            ${
                              log.actionType === "Add"
                                ? "bg-green-500/10 text-green-300 border border-green-500/20"
                                : log.actionType === "Edit"
                                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                : log.actionType === "Soft Delete"
                                ? "bg-orange-500/10 text-orange-300 border border-orange-500/20"
                                : "bg-red-500/10 text-red-300 border border-red-500/20"
                            }`}
                          >
                            {log.actionType}
                          </span>
                          <span className="text-slate-300 font-semibold">{log.details}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-serif">
                          Changed by: <span className="text-slate-300 font-bold">{log.changedBy}</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-450 font-serif whitespace-nowrap">
                        {log.timestamp}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {detailsTab === "placed" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-xs font-sans">
            <h4 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
              <Award size={14} className="text-luna-300" />
              Placed Students List
            </h4>

            {!details || !details.placedStudents || details.placedStudents.length === 0 ? (
              <div className="text-center py-12 text-slate-400 border border-dashed border-white/5 rounded-2xl">
                No placed students are currently listed for this company.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.placedStudents.map((student: any, idx: number) => (
                  <div key={idx} className="glass-panel p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-4 hover:border-luna-300/30 transition-all duration-300">
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold block mb-1">Role Offered</span>
                      <strong className="text-white text-sm block mb-1 truncate">{student.name}</strong>
                      <span className="text-[11px] text-luna-300 font-sans font-semibold flex items-center gap-1.5">
                        <Briefcase size={12} className="text-slate-450" /> {student.role || "Software Engineer"}
                      </span>
                    </div>
                    {student.linkedin && (
                      <a
                        href={student.linkedin.startsWith("http") ? student.linkedin : `https://linkedin.com/in/${student.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-blue-500/10 border border-blue-550/30 text-blue-300 hover:bg-blue-500/25 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="LinkedIn Profile"
                      >
                        <Linkedin size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="border-t border-white/10 pt-4 mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Close Insights
          </button>
        </div>
      </div>
    </div>
  );
}
