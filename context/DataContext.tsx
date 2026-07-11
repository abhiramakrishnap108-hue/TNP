"use client";

import React, { createContext, useContext, useState } from "react";
import {
  User,
  StudentProfile,
  Company,
  JobRole,
  Application,
  Interview,
  PlacementEvent,
  Notification,
  PRRecord,
  EventLogEntry,
  EditLogEntry,
  Toast,
  ApplicationStatus
} from "../types";
import {
  initialUsers,
  initialStudents,
  initialCompanies,
  initialJobRoles,
  initialApplications,
  initialInterviews,
  initialNotifications,
  initialEvents,
  initialEventLogs,
  initialPrs,
  COMPANY_DETAILS,
  MOCK_PLACED_STUDENTS
} from "../mock/database";

/**
 * Context type representing all global mock database states and updating transactions.
 */
interface DataContextProps {
  // Toasts notifications states
  toasts: Toast[];
  addToast: (message: string, type: "success" | "error" | "info") => void;
  removeToast: (id: number) => void;

  // Database lists
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  students: StudentProfile[];
  setStudents: React.Dispatch<React.SetStateAction<StudentProfile[]>>;
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  jobRoles: JobRole[];
  setJobRoles: React.Dispatch<React.SetStateAction<JobRole[]>>;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  interviews: Interview[];
  setInterviews: React.Dispatch<React.SetStateAction<Interview[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  events: PlacementEvent[];
  setEvents: React.Dispatch<React.SetStateAction<PlacementEvent[]>>;
  prs: PRRecord[];
  setPrs: React.Dispatch<React.SetStateAction<PRRecord[]>>;
  editLogs: EditLogEntry[];
  setEditLogs: React.Dispatch<React.SetStateAction<EditLogEntry[]>>;
  eventLogs: EventLogEntry[];
  setEventLogs: React.Dispatch<React.SetStateAction<EventLogEntry[]>>;
  companyDetails: Record<string, any>;
  setCompanyDetails: React.Dispatch<React.SetStateAction<Record<string, any>>>;

  // Transactions / Actions
  toggleStudentEligibility: (rollNo: string) => void;
  toggleStudentPlaced: (rollNo: string) => void;
  saveStudentInfo: (rollNo: string, cgpa: number, phone: string) => void;
  updateStudentProfile: (updated: StudentProfile) => void;
  importCSVStudents: (updatedStudents: StudentProfile[], logMessage: string) => void;

  applyToCompany: (companyName: string, minCgpa: number, currentStudent: StudentProfile) => void;
  updateApplicationStatus: (companyName: string, rollNo: string, newStatus: ApplicationStatus) => void;

  saveCompany: (
    oldCompName: string | null,
    companyName: string,
    sector: string,
    logo: string,
    maxPackage: string,
    avgPackage: string,
    minCgpa: number,
    description: string,
    website: string,
    color: string
  ) => void;
  deleteCompany: (name: string) => void;
  toggleCompanyStatus: (name: string, nextStatus: "active" | "inactive", actionType: "Soft Delete" | "Restore") => void;

  saveEvent: (
    editingEventId: number | null,
    title: string,
    description: string,
    date: string,
    time: string,
    venue: string,
    type: string,
    poster: string,
    googleFormUrl: string,
    companyId?: string
  ) => void;
  deleteEvent: (eventId: number, eventTitle: string) => void;

  savePR: (
    editingPrId: number | null,
    name: string,
    department: string,
    email: string,
    phone: string,
    role: string,
    linkedin?: string
  ) => void;
  deletePr: (id: number, name: string) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

/**
 * Data provider component wrapping children and initializing local state database structures.
 */
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Base state databases initialized from mock seed data
  const [users, setUsers] = useState<User[]>(() => initialUsers);
  const [students, setStudents] = useState<StudentProfile[]>(() => initialStudents);
  const [companies, setCompanies] = useState<Company[]>(() => initialCompanies);
  const [jobRoles, setJobRoles] = useState<JobRole[]>(() => initialJobRoles);
  const [applications, setApplications] = useState<Application[]>(() => initialApplications);
  const [interviews, setInterviews] = useState<Interview[]>(() => initialInterviews);
  const [notifications, setNotifications] = useState<Notification[]>(() => initialNotifications);
  const [events, setEvents] = useState<PlacementEvent[]>(() => initialEvents);
  const [prs, setPrs] = useState<PRRecord[]>(() => initialPrs);
  const [editLogs, setEditLogs] = useState<EditLogEntry[]>([]);
  const [eventLogs, setEventLogs] = useState<EventLogEntry[]>(() => initialEventLogs);

  // Initialize company details populated with mock placed students
  const [companyDetails, setCompanyDetails] = useState<Record<string, any>>(() => {
    const initial = { ...COMPANY_DETAILS };
    Object.keys(initial).forEach((key) => {
      initial[key] = {
        ...initial[key],
        placedStudents: MOCK_PLACED_STUDENTS[key] || [],
      };
    });
    return initial;
  });

  /**
   * Pushes a toast notification onto the screen stack.
   */
  const addToast = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  /**
   * Removes a toast notification by id.
   */
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Student Transactions ---

  /**
   * Toggles student eligibility for placement drives.
   */
  const toggleStudentEligibility = (rollNo: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNo === rollNo ? { ...s, isEligible: !s.isEligible } : s))
    );
    const target = students.find((s) => s.rollNo === rollNo);
    if (target) {
      addToast(`Toggled eligibility for ${target.name}`, "info");
    }
  };

  /**
   * Toggles student placed flag.
   */
  const toggleStudentPlaced = (rollNo: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNo === rollNo ? { ...s, isPlaced: !s.isPlaced } : s))
    );
    const target = students.find((s) => s.rollNo === rollNo);
    if (target) {
      addToast(`Toggled placement status for ${target.name}`, "info");
    }
  };

  /**
   * Saves brief student information edits (CGPA and phone).
   */
  const saveStudentInfo = (rollNo: string, cgpa: number, phone: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNo === rollNo ? { ...s, cgpa, phone } : s))
    );
    const target = students.find((s) => s.rollNo === rollNo);
    if (target) {
      addToast(`Updated record for ${target.name}!`, "success");
    }
  };

  /**
   * Saves complete student profile updates.
   */
  const updateStudentProfile = (updated: StudentProfile) => {
    setStudents((prev) => prev.map((s) => (s.rollNo === updated.rollNo ? updated : s)));
    addToast("Profile updated successfully!", "success");
  };

  /**
   * Bulk-imports student records from a simulated CSV block.
   */
  const importCSVStudents = (updatedStudents: StudentProfile[], logMessage: string) => {
    setStudents(updatedStudents);
    const newLog: EditLogEntry = {
      id: Date.now(),
      companyName: "CSV Bulk Importer",
      actionType: "Add",
      changedBy: "PR Representative",
      timestamp: new Date().toLocaleString(),
      details: logMessage,
    };
    setEditLogs((prev) => [newLog, ...prev]);
    addToast("Successfully imported student records via CSV!", "success");
  };

  // --- Company & Application Transactions ---

  /**
   * Initiates a student's placement drive job application.
   */
  const applyToCompany = (companyName: string, minCgpa: number, currentStudent: StudentProfile) => {
    const comp = companies.find((c) => c.name === companyName);
    if (!comp) return;

    // Fetch the primary job description for the company, or provision a default entry
    const job = jobRoles.find((j) => j.companyId === comp.id && j.isActive) || {
      id: `${comp.id}-default`,
      title: "Graduate Trainee",
      ctc: parseFloat(comp.maxPackage) || 6.0,
    };

    const alreadyApplied = applications.some(
      (app) => app.studentRoll === currentStudent.rollNo && app.companyId === comp.id
    );

    if (alreadyApplied) {
      addToast(`Already applied to ${companyName}`, "info");
      return;
    }

    if (!currentStudent.isEligible) {
      addToast("You are not eligible for placement drives.", "error");
      return;
    }

    if (currentStudent.cgpa < minCgpa) {
      addToast(
        `CGPA requirement not met for ${companyName} (Required: ${minCgpa}, Yours: ${currentStudent.cgpa})`,
        "error"
      );
      return;
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      studentRoll: currentStudent.rollNo,
      companyId: comp.id,
      jobId: job.id,
      status: "Applied",
      atsScore: Math.floor(Math.random() * 25) + 75,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setApplications((prev) => [...prev, newApp]);
    addToast(`Successfully applied to ${companyName}! Opening application form...`, "success");

    // Open simulated prefilled Google Form in separate tab
    const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfDyD4XJq4wQ0f8vE-tD7c8m9r1-2-3-4-5-6-7/viewform?usp=pp_url&entry.2000001=${encodeURIComponent(
      companyName
    )}&entry.2000002=${encodeURIComponent(currentStudent.name)}&entry.2000003=${encodeURIComponent(
      currentStudent.rollNo
    )}`;
    window.open(googleFormUrl, "_blank");
  };

  /**
   * Updates a student's active application status.
   */
  const updateApplicationStatus = (
    companyName: string,
    rollNo: string,
    newStatus: ApplicationStatus
  ) => {
    const comp = companies.find((c) => c.name === companyName);
    if (!comp) return;

    setApplications((prev) =>
      prev.map((a) =>
        a.studentRoll === rollNo && a.companyId === comp.id
          ? { ...a, status: newStatus, updatedAt: new Date().toISOString().split("T")[0] }
          : a
      )
    );
    addToast(`Updated application status for ${companyName} to ${newStatus}!`, "success");
  };

  /**
   * Creates or edits a corporate recruiter record.
   */
  const saveCompany = (
    oldCompName: string | null,
    companyName: string,
    sector: string,
    logo: string,
    maxPackage: string,
    avgPackage: string,
    minCgpa: number,
    description: string,
    website: string,
    color: string
  ) => {
    const isEdit = !!oldCompName;
    const companyId = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");

    const companyData: Company = {
      id: companyId,
      name: companyName,
      sector,
      logo: logo || companyName.charAt(0).toUpperCase(),
      hires: isEdit ? companies.find((c) => c.name === oldCompName)?.hires || 0 : 0,
      maxPackage,
      avgPackage,
      color: color || "bg-blue-500/10 border-blue-500/30 text-blue-400",
      description,
      website,
      isActive: true,
      minCgpa,
      status: "active",
    };

    const detailsData = {
      overview: description,
      selectionProcess: {
        rounds: [
          { round: "Round 1: Online Screening", criteria: "Aptitude and coding diagnostics." },
          { round: "Round 2: Technical Interview", criteria: "Algorithms and systems core." },
        ],
        criteria: `CGPA >= ${minCgpa}, no active backlogs.`,
      },
      interviewInsights: {
        questionTypes: ["Coding", "System Design"],
        leetcodeFocus: "Easy-Medium",
        examples: ["Prepare projects detail review.", "Discuss performance optimizations."],
      },
      skills: {
        core: ["Problem Solving", "Core engineering fundamentals"],
        additional: "Certifications in specific framework fields.",
      },
      placedStudents: isEdit ? companyDetails[oldCompName!]?.placedStudents || [] : [],
    };

    if (isEdit) {
      // Modify company
      setCompanies((prev) => prev.map((c) => (c.name === oldCompName ? companyData : c)));
      setCompanyDetails((prev) => {
        const next = { ...prev };
        delete next[oldCompName!];
        next[companyName] = detailsData;
        return next;
      });

      // Update associated applications' companyId link
      const oldCompId = oldCompName!.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (oldCompId !== companyId) {
        setApplications((prev) =>
          prev.map((app) => (app.companyId === oldCompId ? { ...app, companyId } : app))
        );
      }

      // Add audit log
      const newLog: EditLogEntry = {
        id: Date.now(),
        companyName,
        actionType: "Edit",
        changedBy: "PR Representative",
        timestamp: new Date().toLocaleString(),
        details: `Updated info details for recruiter drive: ${companyName}.`,
      };
      setEditLogs((prev) => [newLog, ...prev]);
      addToast(`Updated recruiter details: ${companyName}`, "success");
    } else {
      // Add brand new company
      setCompanies((prev) => [...prev, companyData]);
      setCompanyDetails((prev) => ({
        ...prev,
        [companyName]: detailsData,
      }));

      // Add audit log
      const newLog: EditLogEntry = {
        id: Date.now(),
        companyName,
        actionType: "Add",
        changedBy: "PR Representative",
        timestamp: new Date().toLocaleString(),
        details: `Created new recruiter drive record: ${companyName}.`,
      };
      setEditLogs((prev) => [newLog, ...prev]);
      addToast(`Added new recruiter drive: ${companyName}`, "success");
    }
  };

  /**
   * Permanently hard-deletes a company recruiter record from lists.
   */
  const deleteCompany = (name: string) => {
    setCompanies((prev) => prev.filter((c) => c.name !== name));
    setCompanyDetails((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });

    const newLog: EditLogEntry = {
      id: Date.now(),
      companyName: name,
      actionType: "Delete",
      changedBy: "PR Representative",
      timestamp: new Date().toLocaleString(),
      details: `Permanently deleted recruiter drive profile for: ${name}.`,
    };
    setEditLogs((prev) => [newLog, ...prev]);
    addToast(`Hard-deleted company: ${name}`, "success");
  };

  /**
   * Performs soft deletion deactivation or restoration on recruiter records.
   */
  const toggleCompanyStatus = (
    name: string,
    nextStatus: "active" | "inactive",
    actionType: "Soft Delete" | "Restore"
  ) => {
    setCompanies((prev) =>
      prev.map((c) => (c.name === name ? { ...c, status: nextStatus, isActive: nextStatus === "active" } : c))
    );

    const newLog: EditLogEntry = {
      id: Date.now(),
      companyName: name,
      actionType,
      changedBy: "PR Representative",
      timestamp: new Date().toLocaleString(),
      details: `Toggled drive state to ${nextStatus} for: ${name}.`,
    };
    setEditLogs((prev) => [newLog, ...prev]);
    addToast(`${actionType === "Restore" ? "Restored" : "Suspended"} drive: ${name}`, "info");
  };

  // --- Placement Calendar Event Transactions ---

  /**
   * Adds or edits scheduled calendar placement events.
   */
  const saveEvent = (
    editingEventId: number | null,
    title: string,
    description: string,
    date: string,
    time: string,
    venue: string,
    type: string,
    poster: string,
    googleFormUrl: string,
    companyId?: string
  ) => {
    const isEdit = editingEventId !== null;

    if (isEdit) {
      // Edit event
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingEventId
            ? {
                id: editingEventId,
                title,
                description,
                date,
                time,
                venue,
                type,
                poster: poster || ev.poster,
                googleFormUrl,
                companyId,
              }
            : ev
        )
      );

      const newLog: EventLogEntry = {
        id: Date.now(),
        eventTitle: title,
        actionType: "Edit",
        changedBy: "PR Representative",
        timestamp: new Date().toLocaleString(),
        details: `Edited details for calendar schedule: ${title}`,
      };
      setEventLogs((prev) => [newLog, ...prev]);
      addToast(`Updated event: ${title}`, "success");
    } else {
      // Add event
      const newEvent: PlacementEvent = {
        id: Date.now(),
        title,
        description,
        date,
        time,
        venue,
        type,
        poster: poster || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
        googleFormUrl,
        companyId,
      };

      setEvents((prev) => [...prev, newEvent]);

      const newLog: EventLogEntry = {
        id: Date.now(),
        eventTitle: title,
        actionType: "Add",
        changedBy: "PR Representative",
        timestamp: new Date().toLocaleString(),
        details: `Scheduled new calendar update: ${title}`,
      };
      setEventLogs((prev) => [newLog, ...prev]);
      addToast(`Scheduled event: ${title}`, "success");
    }
  };

  /**
   * Deletes a calendar placement event.
   */
  const deleteEvent = (eventId: number, eventTitle: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));

    const newLog: EventLogEntry = {
      id: Date.now(),
      eventTitle,
      actionType: "Delete",
      changedBy: "PR Representative",
      timestamp: new Date().toLocaleString(),
      details: `Removed scheduled calendar entry: ${eventTitle}`,
    };
    setEventLogs((prev) => [newLog, ...prev]);
    addToast(`Removed event: ${eventTitle}`, "success");
  };

  // --- PR Roster Management Transactions ---

  /**
   * Saves a PR Representative's info (creates or edits).
   */
  const savePR = (
    editingPrId: number | null,
    name: string,
    department: string,
    email: string,
    phone: string,
    role: string,
    linkedin?: string
  ) => {
    const isEdit = editingPrId !== null;

    if (isEdit) {
      setPrs((prev) =>
        prev.map((p) =>
          p.id === editingPrId
            ? { id: editingPrId, name, department, email, phone, role, linkedin }
            : p
        )
      );
      addToast(`Updated PR: ${name}`, "success");
    } else {
      const newPr: PRRecord = {
        id: Date.now(),
        name,
        department,
        email,
        phone,
        role,
        linkedin,
      };
      setPrs((prev) => [...prev, newPr]);
      addToast(`Added PR: ${name}`, "success");
    }
  };

  /**
   * Deletes a PR Representative.
   */
  const deletePr = (id: number, name: string) => {
    setPrs((prev) => prev.filter((p) => p.id !== id));
    addToast(`Removed PR: ${name}`, "success");
  };

  return (
    <DataContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        users,
        setUsers,
        students,
        setStudents,
        companies,
        setCompanies,
        jobRoles,
        setJobRoles,
        applications,
        setApplications,
        interviews,
        setInterviews,
        notifications,
        setNotifications,
        events,
        setEvents,
        prs,
        setPrs,
        editLogs,
        setEditLogs,
        eventLogs,
        setEventLogs,
        companyDetails,
        setCompanyDetails,
        toggleStudentEligibility,
        toggleStudentPlaced,
        saveStudentInfo,
        updateStudentProfile,
        importCSVStudents,
        applyToCompany,
        updateApplicationStatus,
        saveCompany,
        deleteCompany,
        toggleCompanyStatus,
        saveEvent,
        deleteEvent,
        savePR,
        deletePr,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

/**
 * Custom hook to consume the DataContext.
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
