/**
 * Represents the role of a user in the Training & Placement Cell system.
 */
export type UserRole = "STUDENT" | "PR_COORDINATOR" | "DEPT_COORDINATOR" | "ADMIN";

/**
 * Represents a user credentials and role configuration.
 */
export interface User {
  id: string; // Typically the roll number for students, or unique username for coordinators
  email: string;
  passwordHash: string; // Plain password in this mock simulation
  role: UserRole;
  isActive: boolean; // Enables/disables account login access
  createdAt: string;
  updatedAt: string;
}

/**
 * Detailed profile for a student candidate.
 */
export interface StudentProfile {
  name: string;
  rollNo: string;
  userId: string;
  department: string;
  year: string;
  cgpa: number;
  creditsEarned: number;
  isEligible: boolean; // Managed by PR coordinators to allow/disallow placement access
  phone: string;
  photo: string;
  achievements: string[];
  certifications: string[];
  internships: string[];
  isPlaced: boolean; // True if the student has accepted a job offer
  placementProgress: string; // e.g. "Seeking Placement", "Placed", "On Hold"
  resumeUrl?: string; // Link to the student's external resume
  resumeData?: {
    summary: string;
    skills: string;
    experience: string;
    projects: string;
  };
  uploadedFiles?: {
    resumeName?: string;
    transcriptName?: string;
    certName?: string;
  };
  academicStatus?: "Active" | "On Hold" | "Graduated";
  placementReadiness?: "Fully Ready" | "Needs Preparation" | "Not Started";
  username?: string;
  passwordKey?: string;
  appliedCompanies?: string[];
  applicationStatuses?: Record<string, string>; // Maps company names to application status strings
}

// Alias for backwards compatibility with legacy parts of the code
export type StudentRecord = StudentProfile;

/**
 * Represents a partner corporate company participating in recruitment drives.
 */
export interface Company {
  id: string; // Unique slug identifier (e.g. 'google', 'amazon')
  name: string;
  sector: string; // e.g. "IT / Software", "Core / Infrastructure"
  logo: string; // Single letter or short abbreviation for initials rendering
  hires: number; // Simulated total placement count
  maxPackage: string; // Max CTC package offered (e.g. "16.0 LPA")
  avgPackage: string; // Average package offered
  color: string; // Tailwind style class names for colors (e.g. border, background color)
  description: string;
  website: string;
  isActive: boolean;
  minCgpa: number; // Minimum CGPA required to apply
  status: "active" | "inactive";
}

/**
 * Job profile role offered by a company.
 */
export interface JobRole {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string;
  ctc: number; // Package amount in LPA
  deadline: string;
  isActive: boolean;
}

/**
 * Application status states.
 */
export type ApplicationStatus = "Applied" | "Shortlisted" | "Interview" | "Offer" | "Hired" | "Rejected";

/**
 * Represents a student's job application to a company role.
 */
export interface Application {
  id: string;
  studentRoll: string;
  companyId: string;
  jobId: string;
  status: ApplicationStatus;
  atsScore?: number; // Score calculated by ATS resume scanner
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents an interview schedule slot.
 */
export interface Interview {
  id: string;
  applicationId: string;
  roundNumber: number;
  scheduledAt: string;
  meetLink?: string;
  feedback?: string;
}

/**
 * Placement event scheduled in the recruitment calendar.
 */
export interface PlacementEvent {
  id: number;
  companyId?: string; // Linked company ID, if applicable
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  type: string; // e.g. "PPT", "Mock Test", "Drive"
  googleFormUrl: string; // RSVP link
  poster: string; // Unsplash image link
}

/**
 * Notification messages pushed to student accounts.
 */
export interface Notification {
  id: string;
  userId: string; // Target student ID
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * Interview preparation details and selection process guidelines for companies.
 */
export interface CompanyDetailInfo {
  overview: string;
  selectionProcess: {
    rounds: { round: string; criteria: string }[] | string[];
    criteria: string;
  };
  interviewInsights: {
    questionTypes: string[];
    leetcodeFocus: string;
    examples: string[];
  };
  skills: {
    core: string[];
    additional: string;
  };
  placedStudents?: PlacedStudent[];
}

/**
 * Details of a student who was placed at a company in previous batches.
 */
export interface PlacedStudent {
  name: string;
  linkedin: string;
  role: string;
  year?: string;
}

/**
 * Placement Representative Coordinator details.
 */
export interface PRRecord {
  id: number;
  name: string;
  department: string;
  email: string;
  phone: string;
  role: string; // e.g. "Lead PR", "Assistant PR"
  linkedin?: string;
}

/**
 * Audit log entry tracking administrative actions in the scheduler.
 */
export interface EventLogEntry {
  id: number;
  eventTitle: string;
  actionType: "Add" | "Edit" | "Delete";
  changedBy: string;
  timestamp: string;
  details: string;
}

/**
 * Audit log entry tracking recruitment drive modifications.
 */
export interface EditLogEntry {
  id: number;
  companyName: string;
  actionType: "Add" | "Edit" | "Delete" | "Soft Delete" | "Restore";
  changedBy: string;
  timestamp: string;
  details: string;
}

/**
 * Represents a Toast notification.
 */
export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}
