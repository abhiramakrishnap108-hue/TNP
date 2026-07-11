"use client";

import React, { useState } from "react";
import { Search, Briefcase, Linkedin, Download, UploadCloud, FileSpreadsheet, Plus } from "lucide-react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { EditLogEntry } from "../types";

interface PlacedDirectoryProps {
  showBulkTools: boolean;
}

/**
 * PlacedDirectory component renders a searchable grid of successfully placed students
 * and provides bulk export/import via CSV for administrative accounts.
 */
export default function PlacedDirectory({ showBulkTools }: PlacedDirectoryProps) {
  const {
    students,
    setStudents,
    companyDetails,
    setCompanyDetails,
    setEditLogs,
    addToast
  } = useData();

  const { theme, userName } = useAuth();

  // Local state for filters and bulk input
  const [placedSearchQuery, setPlacedSearchQuery] = useState("");
  const [placedSelectedCompany, setPlacedSelectedCompany] = useState("All");
  const [placedSelectedYear, setPlacedSelectedYear] = useState("All");
  const [placedSubTab, setPlacedSubTab] = useState<"directory" | "bulk">("directory");

  const [importCsvCompany, setImportCsvCompany] = useState("Global");
  const [importCsvText, setImportCsvText] = useState("");

  /**
   * Generates and downloads a CSV report of placed students, optionally filtered by company.
   */
  const handleExportPlacedCsv = (companyName?: string) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Company,Role,LinkedIn,Year\n";

    let exportList: { name: string; company: string; role: string; linkedin: string; year: string }[] = [];

    Object.keys(companyDetails).forEach(compKey => {
      if (companyName && compKey !== companyName) return;
      const list = companyDetails[compKey]?.placedStudents || [];
      list.forEach((student: any) => {
        const matched = students.find(s => s.name.toLowerCase() === student.name.toLowerCase());
        const studentYear = student.year || (matched ? (matched.year === "3rd Year" ? "2026" : "2025") : "2026");
        exportList.push({
          name: student.name,
          company: compKey,
          role: student.role || "Software Engineer",
          linkedin: student.linkedin || "",
          year: studentYear
        });
      });
    });

    if (exportList.length === 0) {
      addToast("No placed students found to export.", "info");
      return;
    }

    exportList.forEach(item => {
      const name = `"${item.name.replace(/"/g, '""')}"`;
      const company = `"${item.company.replace(/"/g, '""')}"`;
      const role = `"${item.role.replace(/"/g, '""')}"`;
      const linkedin = `"${item.linkedin.replace(/"/g, '""')}"`;
      const year = `"${item.year.replace(/"/g, '""')}"`;
      csvContent += `${name},${company},${role},${linkedin},${year}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename = companyName ? `placed_students_${companyName.toLowerCase().replace(/\s+/g, '_')}_report.csv` : "placed_students_all_report.csv";
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`Exported ${exportList.length} records successfully!`, "success");
  };

  /**
   * Reads a file uploaded by the user and sets the raw text value.
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportCsvText(text);
      addToast(`Loaded CSV file: ${file.name}`, "info");
    };
    reader.readAsText(file);
  };

  /**
   * Parses bulk CSV text and updates companyDetails and students states.
   */
  const handleImportPlacedCsv = (csvText: string) => {
    if (!csvText.trim()) {
      addToast("Please enter or select CSV content first", "error");
      return;
    }

    const lines = csvText.split(/\r?\n/);
    if (lines.length <= 1) {
      addToast("CSV content is empty or lacks data rows", "error");
      return;
    }

    const headerRow = lines[0].toLowerCase();
    const hasHeader = headerRow.includes("name") || headerRow.includes("role") || headerRow.includes("company") || headerRow.includes("linkedin");

    const startIndex = hasHeader ? 1 : 0;
    let importCount = 0;

    const updatedDetails = { ...companyDetails };
    let updatedStudents = [...students];
    const logDetailsList: string[] = [];

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");
      const columns = matches.map(col => col.replace(/^"|"$/g, '').trim());

      let name = "";
      let company = importCsvCompany;
      let role = "Software Engineer";
      let linkedin = "";
      let year = "2026";

      if (importCsvCompany === "Global") {
        if (columns.length < 2) continue;
        name = columns[0];
        company = columns[1];
        role = columns[2] || "Software Engineer";
        linkedin = columns[3] || "";
        year = columns[4] || "2026";
      } else {
        if (columns.length < 1) continue;
        name = columns[0];
        role = columns[1] || "Software Engineer";
        linkedin = columns[2] || "";
        year = columns[3] || "2026";
      }

      if (!name || !company) continue;

      const matchedCompanyKey = Object.keys(updatedDetails).find(key => key.toLowerCase() === company.toLowerCase()) || company;

      if (!updatedDetails[matchedCompanyKey]) {
        updatedDetails[matchedCompanyKey] = {
          overview: `Newly imported partner company ${matchedCompanyKey}.`,
          selectionProcess: { rounds: ["Technical round", "HR round"], criteria: "Technical skills & aptitude" },
          interviewInsights: { questionTypes: ["Coding challenges"], leetcodeFocus: "Medium", examples: ["Write a reverse string function"] },
          skills: { core: ["React", "SQL"], additional: "Industry certification" },
          placedStudents: []
        };
      }

      const currentPlacedList = updatedDetails[matchedCompanyKey].placedStudents || [];

      if (!currentPlacedList.some((s: any) => s.name.toLowerCase() === name.toLowerCase())) {
        currentPlacedList.push({ name, role, linkedin, year });
        updatedDetails[matchedCompanyKey].placedStudents = currentPlacedList;
        importCount++;
        logDetailsList.push(`${name} (${matchedCompanyKey})`);

        updatedStudents = updatedStudents.map(s => {
          if (s.name.toLowerCase() === name.toLowerCase()) {
            return {
              ...s,
              isPlaced: true,
              placementProgress: "Placed"
            };
          }
          return s;
        });
      }
    }

    if (importCount > 0) {
      setCompanyDetails(updatedDetails);
      setStudents(updatedStudents);
      setImportCsvText("");

      const timestamp = new Date().toLocaleString();
      const changedBy = userName || "PR Representative";
      const newLog: EditLogEntry = {
        id: Date.now(),
        companyName: importCsvCompany === "Global" ? "Multiple Companies" : importCsvCompany,
        actionType: "Add",
        changedBy,
        timestamp,
        details: `Bulk imported ${importCount} placed students: ${logDetailsList.join(", ")}`
      };
      setEditLogs(prev => [newLog, ...prev]);
      addToast(`Successfully imported ${importCount} placed students!`, "success");
    } else {
      addToast("No new records were imported (possible duplicates or invalid rows).", "info");
    }
  };

  // Compile placed students list across all companies
  const allPlaced: { name: string; role: string; linkedin: string; company: string; year: string }[] = [];
  Object.keys(companyDetails).forEach(compName => {
    const list = companyDetails[compName]?.placedStudents || [];
    list.forEach((item: any) => {
      const matched = students.find(s => s.name.toLowerCase() === item.name.toLowerCase());
      const year = item.year || (matched ? (matched.year === "3rd Year" ? "2026" : "2025") : "2026");
      allPlaced.push({
        name: item.name,
        role: item.role || "Software Engineer",
        linkedin: item.linkedin || "",
        company: compName,
        year: year
      });
    });
  });

  const filtered = allPlaced.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(placedSearchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(placedSearchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(placedSearchQuery.toLowerCase());
    const matchCompany = placedSelectedCompany === "All" || item.company.toLowerCase() === placedSelectedCompany.toLowerCase();
    const matchYear = placedSelectedYear === "All" || item.year === placedSelectedYear;
    return matchSearch && matchCompany && matchYear;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {showBulkTools && (
        <div className="flex gap-4 border-b border-white/5 mb-6 text-xs font-sans">
          <button
            onClick={() => setPlacedSubTab("directory")}
            className={`pb-2 font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${placedSubTab === "directory" ? "border-luna-300 text-white" : "border-transparent text-slate-400 hover:text-white"}`}
          >
            Directory Search
          </button>
          <button
            onClick={() => setPlacedSubTab("bulk")}
            className={`pb-2 font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${placedSubTab === "bulk" ? "border-luna-300 text-white" : "border-transparent text-slate-400 hover:text-white"}`}
          >
            Bulk Import / Export
          </button>
        </div>
      )}

      {(placedSubTab === "directory" || !showBulkTools) ? (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="glass-panel p-5 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-lg text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search by name, role, or company..."
                value={placedSearchQuery}
                onChange={(e) => setPlacedSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-luna-300"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-1.5 bg-black/10 border border-white/5 rounded-full px-3 py-1.5">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Company:</span>
                <select
                  value={placedSelectedCompany}
                  onChange={(e) => setPlacedSelectedCompany(e.target.value)}
                  className={`bg-transparent focus:outline-none text-[11px] font-semibold ${theme === "dark" ? "text-white bg-luna-950" : "text-slate-900 bg-white"}`}
                >
                  <option value="All" className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>All Companies</option>
                  {Object.keys(companyDetails).map(cName => (
                    <option key={cName} value={cName} className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>{cName}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-black/10 border border-white/5 rounded-full px-3 py-1.5">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Year:</span>
                <select
                  value={placedSelectedYear}
                  onChange={(e) => setPlacedSelectedYear(e.target.value)}
                  className={`bg-transparent focus:outline-none text-[11px] font-semibold ${theme === "dark" ? "text-white bg-luna-950" : "text-slate-900 bg-white"}`}
                >
                  <option value="All" className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>All Years</option>
                  <option value="2026" className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>2026</option>
                  <option value="2025" className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>2025</option>
                </select>
              </div>
            </div>
          </div>

          {/* Directory list grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 border border-dashed border-white/5 rounded-2xl">
              No placed students found matching the search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((student, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-3xl border border-white/5 bg-white/[0.01] flex flex-col justify-between gap-4 hover:border-luna-300/40 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-luna-300/10 border border-luna-300/30 text-luna-300 font-bold flex items-center justify-center font-sans">
                        {student.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm leading-tight font-sans">{student.name}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 font-sans">{student.role}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-wide bg-luna-300/10 border border-luna-300/30 text-luna-300 font-bold font-sans">
                      Class of {student.year}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                    <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-slate-350 flex items-center gap-1.5">
                      <Briefcase size={12} className="text-luna-300" /> {student.company}
                    </span>

                    {student.linkedin && (
                      <a
                        href={student.linkedin.startsWith("http") ? student.linkedin : `https://linkedin.com/in/${student.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/30 hover:border-blue-500 text-blue-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        title="LinkedIn Profile"
                      >
                        <Linkedin size={13} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in text-xs font-sans">
          {/* EXPORT PANEL */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 font-sans">
              <Download size={16} className="text-luna-300" />
              Export Placed Student Reports
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Download the current placement record database as a CSV file to share with stakeholders or generate institutional metrics.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => handleExportPlacedCsv()}
                className="px-5 py-2.5 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer text-xs"
              >
                <FileSpreadsheet size={14} />
                Export All Students (CSV)
              </button>

              <div className="flex items-center gap-2 border border-white/10 bg-black/20 rounded-xl px-3 py-1.5">
                <span className="text-slate-400 font-bold uppercase text-[9px]">By Company:</span>
                <select
                  value={placedSelectedCompany}
                  onChange={(e) => setPlacedSelectedCompany(e.target.value)}
                  className={`bg-transparent focus:outline-none text-[11px] font-bold ${theme === "dark" ? "text-white bg-luna-950" : "text-slate-900 bg-white"}`}
                >
                  <option value="All" className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>All Companies</option>
                  {Object.keys(companyDetails).map(comp => (
                    <option key={comp} value={comp} className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>{comp}</option>
                  ))}
                </select>
                {placedSelectedCompany !== "All" && (
                  <button
                    onClick={() => handleExportPlacedCsv(placedSelectedCompany)}
                    className="ml-2 px-3 py-1 bg-luna-600 hover:bg-luna-500 text-white rounded-lg text-[10px] font-bold"
                  >
                    Export
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* IMPORT PANEL */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 font-sans">
              <UploadCloud size={16} className="text-luna-300" />
              Bulk Import Placed Students via CSV
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Target Recruiter Company</label>
                  <select
                    value={importCsvCompany}
                    onChange={(e) => setImportCsvCompany(e.target.value)}
                    className={`w-full border rounded-xl p-3 text-xs focus:outline-none ${theme === "dark" ? "bg-luna-950 border-white/10 text-white focus:border-luna-300" : "bg-white border-slate-300 text-slate-900 focus:border-luna-600"}`}
                  >
                    <option value="Global" className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>Global Import (CSV has Company column)</option>
                    {Object.keys(companyDetails).map(comp => (
                      <option key={comp} value={comp} className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>{comp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Select CSV File</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="w-full text-slate-400 text-xs bg-black/20 border border-white/10 rounded-xl p-3 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-luna-300 file:text-luna-950 hover:file:bg-luna-50 cursor-pointer"
                  />
                </div>

                <div className="bg-luna-300/5 border border-luna-300/20 rounded-2xl p-4 text-[10px] space-y-2 text-slate-400 font-sans leading-relaxed">
                  <span className="font-bold text-white block uppercase tracking-wider">Required CSV Columns:</span>
                  {importCsvCompany === "Global" ? (
                    <div>
                      <code className="text-luna-300 bg-black/30 px-1 rounded">Name, Company, Role, LinkedIn, Year</code>
                      <p className="mt-1 text-[9px] text-slate-400 font-serif">Example:<br />
                        John Doe, Google, Software Engineer, linkedin.com/in/johndoe, 2026</p>
                    </div>
                  ) : (
                    <div>
                      <code className="text-luna-300 bg-black/30 px-1 rounded">Name, Role, LinkedIn, Year</code>
                      <p className="mt-1 text-[9px] text-slate-400 font-serif">Example:<br />
                        Jane Smith, Firmware Engineer, linkedin.com/in/janesmith, 2025</p>
                    </div>
                  )}
                  <span className="text-[9px] text-luna-300 block font-semibold italic mt-2 font-serif">
                    * Note: If the student exists in the student database, their profile status will automatically update to "Placed".
                  </span>
                </div>
              </div>

              <div className="space-y-4 col-span-1">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">CSV Data Input (Raw text or upload file)</label>
                  <textarea
                    value={importCsvText}
                    onChange={(e) => setImportCsvText(e.target.value)}
                    placeholder="Name, Role, LinkedIn, Year"
                    className="w-full h-[180px] bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-luna-300"
                  ></textarea>
                </div>

                <button
                  onClick={() => handleImportPlacedCsv(importCsvText)}
                  className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer text-xs"
                >
                  <Plus size={14} />
                  Execute CSV Bulk Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
