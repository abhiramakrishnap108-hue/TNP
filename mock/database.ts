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
  PlacedStudent
} from "../types";

/**
 * Raw student records used to seed the initial database.
 */
export const initialStudentsRaw = [
  // CSE Branch Students
  {
    name: "Arjun Reddy",
    rollNo: "cs24b1001",
    department: "CSE",
    year: "3rd Year",
    cgpa: 9.2,
    creditsEarned: 78,
    isEligible: true,
    phone: "+91 9481234567",
    photo: "",
    achievements: ["Winner, Smart India Hackathon 2025", "1st Place, Gyanith Coding Contest"],
    certifications: ["AWS Certified Developer", "Google Cloud Associate"],
    internships: ["Software Engineer Intern at Google"]
  },
  {
    name: "Sneha Sharma",
    rollNo: "cs24b1002",
    department: "CSE",
    year: "3rd Year",
    cgpa: 8.9,
    creditsEarned: 78,
    isEligible: true,
    phone: "+91 9481234568",
    photo: "",
    achievements: ["Selected for GSoC 2025", "Runner Up, Inter-NIT Web Dev Hackathon"],
    certifications: ["Microsoft Azure Fundamentals"],
    internships: ["Summer Intern at Amazon"]
  },
  {
    name: "Kiran Kumar",
    rollNo: "cs24b1003",
    department: "CSE",
    year: "3rd Year",
    cgpa: 7.8,
    creditsEarned: 74,
    isEligible: true,
    phone: "+91 9481234569",
    photo: "",
    achievements: ["Core Member, Coding Club", "Open Source Contributor to React"],
    certifications: ["Oracle Java SE Certified Associate"],
    internships: ["Frontend Intern at NexTurn"]
  },
  {
    name: "Priya Nair",
    rollNo: "cs24b1004",
    department: "CSE",
    year: "3rd Year",
    cgpa: 9.5,
    creditsEarned: 82,
    isEligible: true,
    phone: "+91 9481234570",
    photo: "",
    achievements: ["Institute Rank 1 (CSE)", "Published Paper in IEEE GenAI Conference"],
    certifications: ["TensorFlow Developer Certificate"],
    internships: ["R&D Intern at Samsung Research"]
  },
  {
    name: "Vivek Menon",
    rollNo: "cs24b1005",
    department: "CSE",
    year: "3rd Year",
    cgpa: 6.2,
    creditsEarned: 70,
    isEligible: false,
    phone: "+91 9481234571",
    photo: "",
    achievements: ["Co-founder, Esports Club NITPY"],
    certifications: ["Meta Front-End Developer Certificate"],
    internships: ["Web Developer at local startup"]
  },
  // Civil Branch Students
  {
    name: "Ananya Gupta",
    rollNo: "ce24b2001",
    department: "Civil",
    year: "3rd Year",
    cgpa: 8.5,
    creditsEarned: 76,
    isEligible: true,
    phone: "+91 9481234572",
    photo: "",
    achievements: ["Best Paper Award, Disaster Resilient Infra Workshop", "L&T Build India Scholar"],
    certifications: ["AutoCAD Professional Certification"],
    internships: ["Project Intern at L&T Construction"]
  },
  {
    name: "Rohit Verma",
    rollNo: "ce24b2002",
    department: "Civil",
    year: "3rd Year",
    cgpa: 7.9,
    creditsEarned: 76,
    isEligible: true,
    phone: "+91 9481234573",
    photo: "",
    achievements: ["Design lead, Gyanith Civil Model Event"],
    certifications: ["Bentley STAAD.Pro V8i Certified"],
    internships: ["Site Engineer Intern at NHAI"]
  },
  {
    name: "Meera Iyer",
    rollNo: "ce24b2003",
    department: "Civil",
    year: "3rd Year",
    cgpa: 9.1,
    creditsEarned: 78,
    isEligible: true,
    phone: "+91 9481234574",
    photo: "",
    achievements: ["Recipient of OP Jindal Scholarship", "First Rank in Geotechnical Survey"],
    certifications: ["ArcGIS Associate Developer"],
    internships: ["Research Intern at IIT Madras"]
  },
  {
    name: "Aditya Singh",
    rollNo: "ce24b2004",
    department: "Civil",
    year: "3rd Year",
    cgpa: 6.8,
    creditsEarned: 72,
    isEligible: true,
    phone: "+91 9481234575",
    photo: "",
    achievements: ["Sports Secretary, NITPY Student Council"],
    certifications: ["REVIT Structure Certification"],
    internships: ["Surveying Intern at Karaikal Port"]
  },
  {
    name: "Kavya Ramesh",
    rollNo: "ce24b2005",
    department: "Civil",
    year: "3rd Year",
    cgpa: 8.0,
    creditsEarned: 76,
    isEligible: true,
    phone: "+91 9481234576",
    photo: "",
    achievements: ["Winner, National Concrete Mix Design Competition"],
    certifications: ["Project Management Professional (PMP) Basics"],
    internships: ["Quality Assurance Intern at Adani Infra"]
  },
  // Mechanical Branch Students
  {
    name: "Sandeep Patil",
    rollNo: "me24b3001",
    department: "Mechanical",
    year: "3rd Year",
    cgpa: 8.7,
    creditsEarned: 78,
    isEligible: true,
    phone: "+91 9481234577",
    photo: "",
    achievements: ["Designed EV Battery Enclosure for OGOENERGY Project", "Winner, Gyanith CAD Modeler Event"],
    certifications: ["SolidWorks Professional CSWP"],
    internships: ["EV Battery Thermal Intern at OGOENERGY"]
  },
  {
    name: "Divya Joshi",
    rollNo: "me24b3002",
    department: "Mechanical",
    year: "3rd Year",
    cgpa: 9.2,
    creditsEarned: 80,
    isEligible: true,
    phone: "+91 9481234578",
    photo: "",
    achievements: ["Best Student Innovator Award", "Published CFD Thermal Simulation Study"],
    certifications: ["ANSYS Fluent Professional"],
    internships: ["CFD Analyst Intern at GE Power"]
  },
  {
    name: "Harish Rao",
    rollNo: "me24b3003",
    department: "Mechanical",
    year: "3rd Year",
    cgpa: 7.5,
    creditsEarned: 74,
    isEligible: true,
    phone: "+91 9481234579",
    photo: "",
    achievements: ["Team Captain, NITPY SAE Aero Design Team"],
    certifications: ["Fusion 360 Certified User"],
    internships: ["Production Trainee at Maruti Suzuki"]
  },
  {
    name: "Pooja Deshmukh",
    rollNo: "me24b3004",
    department: "Mechanical",
    year: "3rd Year",
    cgpa: 8.1,
    creditsEarned: 76,
    isEligible: true,
    phone: "+91 9481234580",
    photo: "",
    achievements: ["Winner, Inter-College Robotics Championship"],
    certifications: ["Lean Six Sigma Green Belt"],
    internships: ["Maintenance Intern at Tata Steel"]
  },
  {
    name: "Ajay Kulkarni",
    rollNo: "me24b3005",
    department: "Mechanical",
    year: "3rd Year",
    cgpa: 6.4,
    creditsEarned: 70,
    isEligible: false,
    phone: "+91 9481234581",
    photo: "",
    achievements: ["Lead Guitarist, NITPY Music Club"],
    certifications: ["CNC Programming Certificate"],
    internships: ["Manufacturing Intern at Bosch"]
  },
  // ECE Branch Students
  {
    name: "Neha Pillai",
    rollNo: "ec24b4001",
    department: "ECE",
    year: "3rd Year",
    cgpa: 8.8,
    creditsEarned: 78,
    isEligible: true,
    phone: "+91 9481234582",
    photo: "",
    achievements: ["Designed FPGA SoC Decoders for MathWorks Workshop", "Winner, Gyanith Embedded Systems Hackathon"],
    certifications: ["MATLAB & Simulink Professional"],
    internships: ["VLSI Design Intern at Intel"]
  },
  {
    name: "Ramesh Gowda",
    rollNo: "ec24b4002",
    department: "ECE",
    year: "3rd Year",
    cgpa: 7.9,
    creditsEarned: 76,
    isEligible: true,
    phone: "+91 9481234583",
    photo: "",
    achievements: ["Developed Cognitive Radio Testbed Prototype", "Core Member, Space Club ANTRIX"],
    certifications: ["CCNA Routing & Switching"],
    internships: ["Networking Trainee at Cisco"]
  },
  {
    name: "Shreya Mohan",
    rollNo: "ec24b4003",
    department: "ECE",
    year: "3rd Year",
    cgpa: 9.3,
    creditsEarned: 80,
    isEligible: true,
    phone: "+91 9481234584",
    photo: "",
    achievements: ["Best Paper in VLSI Architecture", "Winner, Samsung Smart IoT Contest"],
    certifications: ["Verilog HDL Developer Certificate"],
    internships: ["Silicon Validation Intern at Qualcomm"]
  },
  {
    name: "Varun Krishna",
    rollNo: "ec24b4004",
    department: "ECE",
    year: "3rd Year",
    cgpa: 8.2,
    creditsEarned: 78,
    isEligible: true,
    phone: "+91 9481234585",
    photo: "",
    achievements: ["Developed 6G Wireless Signal Emulator"],
    certifications: ["RTOS Application Developer Certificate"],
    internships: ["Embedded Firmware Intern at PHYTEC"]
  },
  {
    name: "Aditi Rao",
    rollNo: "ec24b4005",
    department: "ECE",
    year: "3rd Year",
    cgpa: 6.9,
    creditsEarned: 72,
    isEligible: true,
    phone: "+91 9481234586",
    photo: "",
    achievements: ["Cultural Secretary, Le Ciel Fest Coordinator"],
    certifications: ["Digital Signal Processing Basics"],
    internships: ["Telecom Intern at BSNL"]
  },
  // EEE Branch Students
  {
    name: "Manish Yadav",
    rollNo: "ee24b5001",
    department: "EEE",
    year: "3rd Year",
    cgpa: 8.6,
    creditsEarned: 78,
    isEligible: true,
    phone: "+91 9481234587",
    photo: "",
    achievements: ["Designed EV Motor Controller Board", "Winner, Gyanith Power Electronics Contest"],
    certifications: ["Smart Grid Architecture Fundamentals"],
    internships: ["Electrical Intern at ABB Global"]
  },
  {
    name: "Shruti Malhotra",
    rollNo: "ee24b5002",
    department: "EEE",
    year: "3rd Year",
    cgpa: 9.1,
    creditsEarned: 80,
    isEligible: true,
    phone: "+91 9481234588",
    photo: "",
    achievements: ["Winner, National Solar Energy Design Challenge"],
    certifications: ["PLC Programming Certified Professional"],
    internships: ["R&D Trainee at OGOENERGY"]
  },
  {
    name: "Akash Jain",
    rollNo: "ee24b5003",
    department: "EEE",
    year: "3rd Year",
    cgpa: 7.6,
    creditsEarned: 74,
    isEligible: true,
    phone: "+91 9481234589",
    photo: "",
    achievements: ["Designed Substation Monitoring SCADA Dashboard"],
    certifications: ["LabVIEW Certified Associate Developer"],
    internships: ["Substation Trainee at NTPC"]
  },
  {
    name: "Bhavana Shetty",
    rollNo: "ee24b5004",
    department: "EEE",
    year: "3rd Year",
    cgpa: 8.3,
    creditsEarned: 78,
    isEligible: true,
    phone: "+91 9481234590",
    photo: "",
    achievements: ["Designed Hybrid Wind-Solar Power Grid for Campus"],
    certifications: ["ETAP Electrical Power Systems Analysis"],
    internships: ["Grid Planning Intern at PowerGrid"]
  },
  {
    name: "Rajesh Nair",
    rollNo: "ee24b5005",
    department: "EEE",
    year: "3rd Year",
    cgpa: 6.5,
    creditsEarned: 72,
    isEligible: true,
    phone: "+91 9481234591",
    photo: "",
    achievements: ["President, Chess Club NITPY"],
    certifications: ["High Voltage Safety Certificate"],
    internships: ["Industrial Automation Trainee at Siemens"]
  }
];

/**
 * Seed data for system accounts matching the student profiles and administrative entities.
 */
export const initialUsers: User[] = [
  ...initialStudentsRaw.map(s => ({
    id: s.rollNo,
    email: `${s.rollNo}@nitpy.ac.in`,
    passwordHash: `NITpy@${s.rollNo}`,
    role: "STUDENT" as const,
    isActive: true,
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01"
  })),
  {
    id: "pr-coordinator-user",
    email: "pr@nitpy.ac.in",
    passwordHash: "NITpy@pr",
    role: "PR_COORDINATOR",
    isActive: true,
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01"
  },
  {
    id: "dept-coordinator-user",
    email: "departmental@nitpy.ac.in",
    passwordHash: "NITpy@departmental",
    role: "DEPT_COORDINATOR",
    isActive: true,
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01"
  },
  {
    id: "admin-user",
    email: "admin@nitpy.ac.in",
    passwordHash: "NITpy@admin",
    role: "ADMIN",
    isActive: true,
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01"
  }
];

/**
 * Formatted student profile list mapping initial configurations to interface requirements.
 */
export const initialStudents: StudentProfile[] = initialStudentsRaw.map(s => {
  const placed = s.rollNo === "cs24b1001" || s.rollNo === "cs24b1002" || s.rollNo === "ce24b2001";
  return {
    ...s,
    userId: s.rollNo,
    isPlaced: placed,
    photo: "",
    resumeUrl: `https://nitpy.ac.in/resumes/${s.rollNo}.pdf`,
    skills: s.department === "CSE" ? ["React", "JavaScript", "TypeScript", "Node.js", "Python"] : ["AutoCAD", "MATLAB", "Embedded C"],
    placementProgress: placed ? "Placed" : "Seeking Placement",
    academicStatus: "Active",
    placementReadiness: s.cgpa >= 8.0 ? "Fully Ready" : "Needs Preparation",
    resumeData: {
      summary: "Motivated student from NIT Puducherry seeking internship opportunities.",
      skills: s.department === "CSE" ? "React, JavaScript, TypeScript, CSS, Git" : "AutoCAD, MATLAB, Embedded C",
      experience: "Academic Projects & Labs",
      projects: "Placement Portal Development"
    },
    uploadedFiles: {
      resumeName: "",
      transcriptName: "",
      certName: ""
    },
    username: `${s.rollNo}@nitpy.ac.in`,
    passwordKey: `NITpy@${s.rollNo}`
  };
});

/**
 * Seed data for corporate recruiters participating in drives.
 */
export const initialCompaniesRaw = [
  { id: "google", name: "Google", sector: "IT / Software", logo: "G", hires: 4, maxPackage: "16.0 LPA", avgPackage: "13.0 LPA", color: "bg-red-500/10 border-red-500/30 text-red-400" },
  { id: "amazon", name: "Amazon", sector: "IT / Software", logo: "A", hires: 8, maxPackage: "15.0 LPA", avgPackage: "12.0 LPA", color: "bg-orange-500/10 border-orange-500/30 text-orange-400" },
  { id: "oracle", name: "Oracle", sector: "IT / Software", logo: "O", hires: 12, maxPackage: "14.0 LPA", avgPackage: "11.5 LPA", color: "bg-red-600/10 border-red-600/30 text-red-500" },
  { id: "lt-construction", name: "L&T Construction", sector: "Core / Infrastructure", logo: "L&T", hires: 15, maxPackage: "8.5 LPA", avgPackage: "6.5 LPA", color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" },
  { id: "deloitte", name: "Deloitte", sector: "Consulting / Analytics", logo: "D", hires: 20, maxPackage: "9.0 LPA", avgPackage: "7.0 LPA", color: "bg-green-500/10 border-green-500/30 text-green-400" },
  { id: "tcs", name: "TCS", sector: "IT / Software", logo: "TCS", hires: 32, maxPackage: "7.0 LPA", avgPackage: "4.5 LPA", color: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
  { id: "intel", name: "Intel", sector: "Core / Hardware", logo: "I", hires: 5, maxPackage: "14.5 LPA", avgPackage: "11.0 LPA", color: "bg-sky-500/10 border-sky-500/30 text-sky-400" },
  { id: "abb-global", name: "ABB Global", sector: "Core / Electrical", logo: "ABB", hires: 6, maxPackage: "9.5 LPA", avgPackage: "7.2 LPA", color: "bg-slate-500/10 border-slate-500/30 text-slate-400" },
  { id: "samsung", name: "Samsung", sector: "R&D / Systems", logo: "S", hires: 9, maxPackage: "14.0 LPA", avgPackage: "10.8 LPA", color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" },
  { id: "infosys", name: "Infosys", sector: "IT / Software", logo: "INF", hires: 25, maxPackage: "6.8 LPA", avgPackage: "4.2 LPA", color: "bg-green-600/10 border-green-600/30 text-green-500" }
];

/**
 * Populated companies list with web details and minimum CGPA criteria.
 */
export const initialCompanies: Company[] = initialCompaniesRaw.map(c => ({
  ...c,
  description: `${c.name} is a global leader in ${c.sector}, providing state-of-the-art products and services worldwide.`,
  website: `https://${c.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
  isActive: true,
  minCgpa: c.name === "Google" || c.name === "Intel" ? 8.0 : c.name === "Amazon" || c.name === "Oracle" ? 7.5 : 6.0,
  status: "active" as const
}));

/**
 * Open job descriptions associated with companies.
 */
export const initialJobRoles: JobRole[] = [
  { id: "google-sde", companyId: "google", title: "Software Development Engineer", description: "Design, build and maintain complex cloud services and applications.", requirements: "Proficiency in Java/C++ or Python. Strong in DS & Algorithms.", ctc: 16.0, deadline: "2026-07-01", isActive: true },
  { id: "google-sre", companyId: "google", title: "Site Reliability Engineer", description: "Ensure high availability and scaling of production infrastructure.", requirements: "Linux systems design, networking protocols, programming in Go.", ctc: 13.0, deadline: "2026-07-01", isActive: true },
  { id: "amazon-sde", companyId: "amazon", title: "Software Development Engineer", description: "Contribute directly to core retail, AWS platform, and devices.", requirements: "Java, Javascript, OOP, SQL databases, distributed computing concepts.", ctc: 15.0, deadline: "2026-07-03", isActive: true },
  { id: "intel-silicon", companyId: "intel", title: "Silicon Validation Engineer", description: "Validate next-generation processors and hardware architectures.", requirements: "Verilog, SystemVerilog, FPGA testing, computer organization.", ctc: 14.5, deadline: "2026-07-05", isActive: true },
  { id: "lt-get", companyId: "lt-construction", title: "Graduate Engineer Trainee", description: "On-site planning, structural analysis and coordination.", requirements: "AutoCAD, civil project planning, site safety guidelines.", ctc: 8.5, deadline: "2026-07-10", isActive: true }
];

/**
 * Candidate applications logs seeding the database.
 */
export const initialApplications: Application[] = [
  { id: "app-1", studentRoll: "cs24b1001", companyId: "google", jobId: "google-sde", status: "Hired", atsScore: 92, createdAt: "2026-06-10", updatedAt: "2026-06-12" },
  { id: "app-2", studentRoll: "cs24b1002", companyId: "amazon", jobId: "amazon-sde", status: "Hired", atsScore: 89, createdAt: "2026-06-11", updatedAt: "2026-06-13" },
  { id: "app-3", studentRoll: "ce24b2001", companyId: "lt-construction", jobId: "lt-get", status: "Hired", atsScore: 84, createdAt: "2026-06-12", updatedAt: "2026-06-14" }
];

/**
 * Scheduled interviews logged.
 */
export const initialInterviews: Interview[] = [
  { id: "int-1", applicationId: "app-1", roundNumber: 1, scheduledAt: "2026-06-11 10:00 AM", meetLink: "https://meet.google.com/abc-defg-hij", feedback: "Strong coding skills. Proceed to next round." },
  { id: "int-2", applicationId: "app-1", roundNumber: 2, scheduledAt: "2026-06-12 02:00 PM", meetLink: "https://meet.google.com/abc-defg-hij", feedback: "Solid system design. Clear communication. Recommended for hire." }
];

/**
 * Initial notification triggers pushed to student profiles.
 */
export const initialNotifications: Notification[] = [
  { id: "not-1", userId: "cs24b1001", title: "Application Shortlisted", message: "Congratulations! Your application to Google for SDE has been shortlisted. Check your Interview schedule.", isRead: false, createdAt: "2026-06-11" },
  { id: "not-2", userId: "cs24b1001", title: "Placement Offer Received", message: "Congratulations! You have been offered a Software Development Engineer role at Google. Compensation: 16.0 LPA.", isRead: false, createdAt: "2026-06-12" }
];

/**
 * Corporate placement drives calendar notifications.
 */
export const initialEvents: PlacementEvent[] = [
  {
    id: 1,
    companyId: "google",
    title: "Google Pre-Placement Presentation",
    description: "An interactive session by Google Engineers outlining the software engineering roles, team culture, and the recruitment process for 2026 graduates.",
    date: "June 12, 2026",
    time: "10:00 AM",
    venue: "Science Block Seminar Hall",
    type: "PPT",
    googleFormUrl: "https://forms.gle/google-presentation-rsvp",
    poster: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Pre-Placement Mock Coding Hackathon",
    description: "A timed 3-hour competitive programming contest to help students prepare for upcoming online coding assessments. Featuring problems on Graphs, DP, and Arrays.",
    date: "June 25, 2026",
    time: "09:00 AM",
    venue: "Online Platform (HackerEarth)",
    type: "Mock Test",
    googleFormUrl: "https://forms.gle/mock-hackathon-reg",
    poster: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    companyId: "intel",
    title: "Intel Recruitment Drive (ECE/CSE)",
    description: "On-campus recruitment drive for Intel's hardware and systems software groups. Core profiles include Silicon Design, RTL Validation, and Embedded Systems.",
    date: "July 05, 2026",
    time: "08:30 AM",
    venue: "T&P Cell Interview Cabins",
    type: "Drive",
    googleFormUrl: "https://forms.gle/intel-drive-register",
    poster: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    companyId: "lt-construction",
    title: "L&T Core Engineering Pre-Talks",
    description: "Learn about the engineering marvels and mega infrastructure projects executed by Larsen & Toubro. Details regarding Graduate Engineer Trainee (GET) offers will be shared.",
    date: "July 12, 2026",
    time: "02:00 PM",
    venue: "CSE Seminar Hall",
    type: "PPT",
    googleFormUrl: "https://forms.gle/lt-talks-feedback",
    poster: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80"
  }
];

/**
 * Log feeds documenting changes made to events.
 */
export const initialEventLogs: EventLogEntry[] = [
  {
    id: 1,
    eventTitle: "Google Pre-Placement Presentation",
    actionType: "Add",
    changedBy: "PR Cell Representative",
    timestamp: "2026-06-10, 10:30:15 AM",
    details: "Created new PPT event for Google recruitment drive."
  },
  {
    id: 2,
    eventTitle: "Pre-Placement Mock Coding Hackathon",
    actionType: "Add",
    changedBy: "Admin Coordinator",
    timestamp: "2026-06-11, 02:15:00 PM",
    details: "Scheduled mock hackathon on HackerEarth."
  }
];

/**
 * List of Placement Representatives representing departments.
 */
export const initialPrs: PRRecord[] = [
  // CSE
  { id: 1, name: "Anish Kumar", department: "CSE", email: "anish.cse@nitpy.ac.in", phone: "+91 94891 69301", role: "Lead PR", linkedin: "https://linkedin.com/in/anish-cse" },
  { id: 2, name: "Pooja Hegde", department: "CSE", email: "pooja.cse@nitpy.ac.in", phone: "+91 94891 69302", role: "Assistant PR", linkedin: "https://linkedin.com/in/pooja-cse" },
  { id: 3, name: "Rahul Varma", department: "CSE", email: "rahul.cse@nitpy.ac.in", phone: "+91 94891 69303", role: "Assistant PR", linkedin: "https://linkedin.com/in/rahul-varma" },
  { id: 4, name: "Snehal Sen", department: "CSE", email: "snehal.cse@nitpy.ac.in", phone: "+91 94891 69304", role: "Assistant PR" },
  // ECE
  { id: 5, name: "Riya Sharma", department: "ECE", email: "riya.ece@nitpy.ac.in", phone: "+91 94891 69305", role: "Lead PR", linkedin: "https://linkedin.com/in/riya-ece" },
  { id: 6, name: "Amit Mishra", department: "ECE", email: "amit.ece@nitpy.ac.in", phone: "+91 94891 69306", role: "Assistant PR" },
  { id: 7, name: "Kavya Nair", department: "ECE", email: "kavya.ece@nitpy.ac.in", phone: "+91 94891 69307", role: "Assistant PR" },
  { id: 8, name: "Suresh Babu", department: "ECE", email: "suresh.ece@nitpy.ac.in", phone: "+91 94891 69308", role: "Assistant PR" },
  // EEE
  { id: 9, name: "Kiran Dev", department: "EEE", email: "kiran.eee@nitpy.ac.in", phone: "+91 94891 69309", role: "Lead PR", linkedin: "https://linkedin.com/in/kiran-eee" },
  { id: 10, name: "Divya K", department: "EEE", email: "divya.eee@nitpy.ac.in", phone: "+91 94891 69310", role: "Assistant PR" },
  { id: 11, name: "Naveen Kumar", department: "EEE", email: "naveen.eee@nitpy.ac.in", phone: "+91 94891 69311", role: "Assistant PR" },
  { id: 12, name: "Harshita S", department: "EEE", email: "harshita.eee@nitpy.ac.in", phone: "+91 94891 69312", role: "Assistant PR" },
  // Mechanical
  { id: 13, name: "Vikram Singh", department: "Mechanical", email: "vikram.mech@nitpy.ac.in", phone: "+91 94891 69313", role: "Lead PR", linkedin: "https://linkedin.com/in/vikram-mech" },
  { id: 14, name: "Rohan Das", department: "Mechanical", email: "rohan.mech@nitpy.ac.in", phone: "+91 94891 69314", role: "Assistant PR" },
  { id: 15, name: "Preeti Joshi", department: "Mechanical", email: "preeti.mech@nitpy.ac.in", phone: "+91 94891 69315", role: "Assistant PR" },
  { id: 16, name: "Arjun Ram", department: "Mechanical", email: "arjun.mech@nitpy.ac.in", phone: "+91 94891 69316", role: "Assistant PR" },
  // Civil
  { id: 17, name: "Sneha Patil", department: "Civil", email: "sneha.civil@nitpy.ac.in", phone: "+91 94891 69317", role: "Lead PR", linkedin: "https://linkedin.com/in/sneha-civil" },
  { id: 18, name: "Abhinav Raj", department: "Civil", email: "abhinav.civil@nitpy.ac.in", phone: "+91 94891 69318", role: "Assistant PR" },
  { id: 19, name: "Meera Nair", department: "Civil", email: "meera.civil@nitpy.ac.in", phone: "+91 94891 69319", role: "Assistant PR" },
  { id: 20, name: "Vivek Sharma", department: "Civil", email: "vivek.civil@nitpy.ac.in", phone: "+91 94891 69320", role: "Assistant PR" }
];

/**
 * Testimonial highlights showcasing student placement achievements.
 */
export const initialTestimonialsRaw = [
  {
    name: "Siddharth Verma",
    batch: "Class of 2023 • B.Tech CSE",
    company: "Google",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300",
    quote: "The pre-placement training modules at NITPY were instrumental in building my technical and problem-solving skills. The placement cell guided me through every interview step.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-in-a-coffee-shop-43093-large.mp4"
  },
  {
    name: "Meera Nair",
    batch: "Class of 2024 • B.Tech ECE",
    company: "Intel",
    role: "Silicon Design Engineer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300",
    quote: "Despite being in a core electrical sector, the placement cell brought incredible opportunities. I received direct mentoring from senior industry leaders.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-remotely-from-home-sitting-on-a-sofa-43003-large.mp4"
  },
  {
    name: "Rohan Das",
    batch: "Class of 2023 • B.Tech Mechanical",
    company: "L&T Construction",
    role: "Graduate Engineer Trainee",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&quote",
    quote: "NIT Puducherry's campus culture encourages leadership. The TNP activities helped me refine my group discussion and interview presentation skills tremendously.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-office-worker-looking-at-computer-monitor-with-concentration-43187-large.mp4"
  }
];

/**
 * Detailed corporate recruiting preparation guidelines.
 */
export const COMPANY_DETAILS: Record<string, any> = {
  Google: {
    overview: "Google's mission is to organize the world's information and make it universally accessible and useful. We seek candidates with strong algorithmic intuition, scaling design capability and passion for building high performance systems.",
    selectionProcess: {
      rounds: [
        { round: "Round 1: Online Coding Round", criteria: "2 Coding Questions (Medium-Hard) based on Dynamic Programming & Advanced Graphs. Time limit: 90 mins." },
        { round: "Round 2: Technical Interview 1", criteria: "In-depth testing on Data Structures, Algorithms Complexity, recursion, and core computer science fundamentals." },
        { round: "Round 3: Technical Interview 2", criteria: "System design basics, scalability principles, concurrency patterns and scenario-based code optimization." },
        { round: "Round 4: Googleyness & Leadership", criteria: "Behavioral round testing collaboration, problem-solving under pressure, ethics, and cultural alignment." }
      ],
      criteria: "CGPA >= 8.0, B.Tech (CSE, ECE, EEE), no active backlogs."
    },
    interviewInsights: {
      questionTypes: ["Graphs", "Dynamic Programming", "Recursion", "System Design"],
      leetcodeFocus: "Medium-Hard",
      examples: [
        "Practice dry-running your code with edge cases before presenting. Focus on time and space complexity explanations.",
        "Google interviewers evaluate not just the solution but how you systematically approach, dissect and scale complex technical challenges."
      ]
    },
    skills: {
      core: ["Data Structures", "Algorithms", "Systems Architecture", "Go/C++/Java", "Problem Solving"],
      additional: "Google UX Design or Cloud Architect certification is a plus."
    }
  },
  Amazon: {
    overview: "Amazon is guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking. Software developers build core systems that drive our logistics, cloud computing (AWS), and customer platforms.",
    selectionProcess: {
      rounds: [
        { round: "Round 1: Online Assessment", criteria: "2 Coding problems, Work Simulation (Scenario questions), and Amazon Leadership Principles questionnaire." },
        { round: "Round 2: Technical Interview 1", criteria: "Coding problems on trees, linked lists, hash maps and detailed discussions on OOP concepts." },
        { round: "Round 3: Technical Interview 2", criteria: "Coding problems on Graph traversals and System Design components." },
        { round: "Round 4: Bar Raiser", criteria: "Tough behavioral and algorithmic interview checking alignment with Leadership Principles." }
      ],
      criteria: "CGPA >= 7.5, open to all circuit branches (CSE, ECE, EEE)."
    },
    interviewInsights: {
      questionTypes: ["Trees", "Hash Maps", "Graph Traversals", "System Design"],
      leetcodeFocus: "Medium",
      examples: [
        "Every answer in the behavioral rounds must be framed around the Amazon Leadership Principles (e.g. Bias for Action, Dive Deep). Use the STAR method.",
        "Expect questions about memory management, garbage collection details and low-level code structure."
      ]
    },
    skills: {
      core: ["Java/C++", "Object-Oriented Design", "Databases", "Distributed Systems", "Amazon Leadership Principles"],
      additional: "AWS Certified Developer Associate is highly valued."
    }
  },
  Intel: {
    overview: "Intel is a world leader in silicon innovation, hardware manufacturing, and systems software. We recruit talented minds for design verification, firmware development, system simulation and software tools.",
    selectionProcess: {
      rounds: [
        { round: "Round 1: Written Technical Test", criteria: "MCQs on Digital Electronics, Computer Architecture, C/C++ programming, and OS concepts." },
        { round: "Round 2: VLSI Technical Round", criteria: "Design validation patterns, FPGA architectures, RTL synthesis, and Verilog simulations." },
        { round: "Round 3: Systems Software Round", criteria: "Embedded systems programming, RTOS primitives, device driver workflows, and memory-mapped IO operations." },
        { round: "Round 4: HR & Fitment", criteria: "Communication, projects discussion, location preferences, and fitment." }
      ],
      criteria: "CGPA >= 8.0, B.Tech ECE & CSE branches."
    },
    interviewInsights: {
      questionTypes: ["Digital Electronics", "Computer Architecture", "Embedded C", "VLSI Design"],
      leetcodeFocus: "Easy-Medium",
      examples: [
        "Be thoroughly prepared with Digital Electronics fundamentals (K-maps, flip-flops, setup-hold times, state machines).",
        "Explain your final year hardware project details clearly, focusing on design decisions and performance enhancements."
      ]
    },
    skills: {
      core: ["Verilog/VHDL", "Digital Logic", "Computer Architecture", "Embedded C/C++", "FPGA"],
      additional: "Verification Academy courses or VLSI certifications."
    }
  },
  "L&T Construction": {
    overview: "Larsen & Tourbo is a multi-billion dollar technology, engineering, construction, manufacturing and financial services conglomerate. The Construction division recruits engineers to execute complex infrastructure projects globally.",
    selectionProcess: {
      rounds: [
        { round: "Round 1: Aptitude & Domain Test", criteria: "Quantitative Aptitude, verbal ability, and Core Civil/Mechanical/Electrical engineering MCQs." },
        { round: "Round 2: Technical Interview", criteria: "Concrete technology, structural mechanics, survey methodology, project planning, and drawing reading." },
        { round: "Round 3: HR & General Round", criteria: "Mobility consent, relocation preferences, communication, and interest in site work." }
      ],
      criteria: "CGPA >= 6.0, B.Tech Civil, Mechanical, EEE branches. 100% mobility required."
    },
    interviewInsights: {
      questionTypes: ["Structural Mechanics", "Surveying", "Concrete Technology", "Aptitude"],
      leetcodeFocus: "None",
      examples: [
        "Revise basic concrete properties, soil mechanics, surveying procedures, and project lifecycle milestones.",
        "Demonstrate willingness to work on field sites. L&T values grit, site safety consciousness, and leadership traits."
      ]
    },
    skills: {
      core: ["Civil Engineering Core", "AutoCAD", "Project Management", "Structural Analysis", "Surveying"],
      additional: "Primavera or MS Project knowledge is an advantage."
    }
  },
  Deloitte: {
    overview: "Deloitte is a leading global provider of audit and assurance, consulting, financial advisory, risk advisory, tax, and related services. Tech consulting teams help clients integrate advanced tech architectures and analytics.",
    selectionProcess: {
      rounds: [
        { round: "Round 1: Deloitte Aptitude & Case Study Assessment", criteria: "Logical reasoning, English proficiency, and small business case analysis questions." },
        { round: "Round 2: Group Discussion / Case Interview", criteria: "Group analysis of a real-world tech consulting problem. Evaluation of team participation and presentation." },
        { round: "Round 3: Technical Round", criteria: "Software development methodologies (Agile/Scrum), cloud computing, SQL query writing, and basic programming." },
        { round: "Round 4: Partner Interview", criteria: "Conversational round evaluating consulting mindset, client handling ability, and domain interest." }
      ],
      criteria: "CGPA >= 6.0, open to all branches."
    },
    interviewInsights: {
      questionTypes: ["Case Study", "Agile Methodologies", "SQL", "Cloud Basics"],
      leetcodeFocus: "Easy",
      examples: [
        "Focus on structuring your answers. Clear articulation of ideas is highly valued in consulting profiles.",
        "Revise SQL commands (Joins, aggregations) and basic database optimization strategies."
      ]
    },
    skills: {
      core: ["Consulting Mindset", "SQL", "Cloud Concepts", "Software Development Lifecycle", "Communication"],
      additional: "Scrum Master or Salesforce certification is helpful."
    }
  }
};

/**
 * Historical stats mapping placed student registry profiles.
 */
export const MOCK_PLACED_STUDENTS: Record<string, PlacedStudent[]> = {
  Google: [
    { name: "Arjun Reddy", linkedin: "https://linkedin.com/in/arjun-reddy-nitpy", role: "Software Development Engineer", year: "2026" }
  ],
  Amazon: [
    { name: "Sneha Sharma", linkedin: "https://linkedin.com/in/sneha-sharma-nitpy", role: "Software Development Engineer", year: "2026" }
  ],
  "L&T Construction": [
    { name: "Ananya Gupta", linkedin: "https://linkedin.com/in/ananya-gupta-nitpy", role: "Graduate Engineer Trainee", year: "2026" }
  ],
  Deloitte: [
    { name: "Pooja Deshmukh", linkedin: "https://linkedin.com/in/pooja-deshmukh-nitpy", role: "Business Technology Analyst", year: "2026" }
  ],
  TCS: [
    { name: "Bhavana Shetty", linkedin: "https://linkedin.com/in/bhavana-shetty-nitpy", role: "Systems Engineer", year: "2026" }
  ],
  Intel: [
    { name: "Neha Pillai", linkedin: "https://linkedin.com/in/neha-pillai-nitpy", role: "Silicon Validation Engineer", year: "2026" }
  ],
  "ABB Global": [
    { name: "Akash Jain", linkedin: "https://linkedin.com/in/akash-jain-nitpy", role: "Electrical Graduate Trainee", year: "2026" }
  ],
  Samsung: [
    { name: "Divya Joshi", linkedin: "https://linkedin.com/in/divya-joshi-nitpy", role: "R&D Engineer", year: "2026" }
  ],
  Infosys: [
    { name: "Sandeep Patil", linkedin: "https://linkedin.com/in/sandeep-patil-nitpy", role: "Systems Engineer Specialist", year: "2025" }
  ]
};

/**
 * Aptitude question bank used by the preparation/mock test engine.
 */
export const APTITUDE_QUESTIONS = [
  {
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 metres", "180 metres", "324 metres", "150 metres"],
    correct: 3,
    explanation: "Speed in m/s = 60 * (5/18) = 50/3 m/s. Length of train = speed * time = (50/3) * 9 = 150 metres."
  },
  {
    question: "A shopkeeper sells an article at a loss of 12.5%. If he had sold it for Rs. 92.40 more, he would have gained 22.5%. What is the cost price of the article?",
    options: ["Rs. 264", "Rs. 258", "Rs. 300", "Rs. 240"],
    correct: 0,
    explanation: "Loss of 12.5% to gain of 22.5% represents a total percentage difference of 35%. Hence, 35% of Cost Price = Rs. 92.40, which yields Cost Price = 92.40 / 0.35 = Rs. 264."
  },
  {
    question: "If 12 men or 18 women can do a work in 14 days, then in how many days will 8 men and 16 women do the same work?",
    options: ["9 days", "10 days", "8 days", "12 days"],
    correct: 0,
    explanation: "Since 12 men = 18 women, 1 man = 1.5 women. Therefore, 8 men + 16 women = 8(1.5) + 16 = 28 women. If 18 women complete the work in 14 days, 28 women will complete it in (18 * 14) / 28 = 9 days."
  }
];

/**
 * Technical concept diagnostics question bank.
 */
export const TECHNICAL_QUESTIONS = [
  {
    question: "Which of the following is true about a virtual destructor in C++?",
    options: [
      "It is used to ensure memory leaks do not happen when deleting derived class instances via base pointers.",
      "It is required for every class with any member function.",
      "It cannot be declared as virtual.",
      "It prevents derived classes from overriding it."
    ],
    correct: 0,
    explanation: "Declaring a virtual destructor in a base class ensures that when a derived class object is deleted using a base class pointer, the derived class destructor is called first, preventing memory leaks."
  },
  {
    question: "What is the worst-case time complexity of searching an element in a Balanced Binary Search Tree (like AVL tree)?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correct: 2,
    explanation: "Balanced BSTs maintain a height of O(log n), so searching, insertion, and deletion operations have a worst-case time complexity of O(log n)."
  },
  {
    question: "In Java, what is the key difference between HashMap and Hashtable?",
    options: [
      "HashMap is synchronized while Hashtable is not.",
      "HashMap allows one null key and multiple null values, whereas Hashtable does not allow null keys or values.",
      "Hashtable is faster than HashMap.",
      "HashMap inherits from Dictionary class."
    ],
    correct: 1,
    explanation: "HashMap is unsynchronized and permits null key and values, making it faster. Hashtable is synchronized (thread-safe) and throws NullPointerException for null keys or values."
  }
];

/**
 * Coding assessment coding problems list.
 */
export const CODING_PROBLEMS = [
  {
    title: "Two Sum (C++)",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    inputFormat: "nums = [2,7,11,15], target = 9",
    outputFormat: "[0,1]"
  },
  {
    title: "Reverse String (C++)",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    inputFormat: 's = ["h","e","l","l","o"]',
    outputFormat: '["o","l","l","e","h"]'
  },
  {
    title: "Palindrome Number (C++)",
    difficulty: "Easy",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward.",
    inputFormat: "x = 121",
    outputFormat: "true"
  }
];

/**
 * Starter code solutions preloaded in programming assessments.
 */
export const CODING_STARTER_CODES = [
  `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> m;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (m.count(complement)) {
                return {m[complement], i};
            }
            m[nums[i]] = i;
        }
        return {};
    }
};`,
  `#include <vector>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        int left = 0, right = s.size() - 1;
        while (left < right) {
            swap(s[left++], s[right--]);
        }
    }
};`,
  `class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int revertedNumber = 0;
        while (x > revertedNumber) {
            revertedNumber = revertedNumber * 10 + x % 10;
            x /= 10;
        }
        return x == revertedNumber || x == revertedNumber / 10;
    }
};`
];

/**
 * Simulated HR/Technical interview question repository.
 */
export const INTERVIEW_QUESTIONS = [
  "Tell me about yourself, your academic interests, and why you chose your engineering field.",
  "Describe a complex technical problem you encountered during a project. How did you diagnose and solve it?",
  "How do you handle working in a multidisciplinary team when conflicting opinions arise on system design?",
  "What are your long-term career goals, and how does joining our organization fit into those plans?"
];
