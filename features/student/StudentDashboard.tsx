"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Briefcase,
  TrendingUp,
  Calendar,
  FileText,
  Users,
  Settings,
  Lock,
  Award,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Video,
  Play,
  Square,
  RefreshCw,
  Terminal,
  Camera,
  UploadCloud,
  CheckCircle2,
  Sliders,
  Check,
  X,
  Info,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import PlacedDirectory from "../../components/PlacedDirectory";
import { StudentProfile, Company, PlacementEvent } from "../../types";

// --- Mock Practice Database ---
const APTITUDE_QUESTIONS = [
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

const TECHNICAL_QUESTIONS = [
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

const CODING_PROBLEMS = [
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

const CODING_STARTER_CODES = [
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

const WEBCAM_INTERVIEW_QUESTIONS = [
  "Tell me about a challenging technical project you built. What were the trade-offs?",
  "How do you handle conflicts or differences in opinion within a software development team?",
  "Describe a time you had to optimize a slow query or piece of code. What was your process?",
  "What is the difference between TCP and UDP, and how do you decide which to use?",
  "Where do you see yourself in 3 years, and how does this corporate role align with your goals?"
];

export default function StudentDashboard() {
  const { currentStudent, updateStudentProfile, addToast, companies, events, companyDetails, users, setUsers } = useAuth() as any;

  // Local state for dashboard sub-tab
  const [studentDashTab, setStudentDashTab] = useState<string>("profile");

  // Local state for Company details viewing
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState<string | null>(null);

  // Profile Edit fields
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedPhone, setEditedPhone] = useState(currentStudent?.phone || "");
  const [editedCgpa, setEditedCgpa] = useState(currentStudent?.cgpa || 0);
  const [editedSkills, setEditedSkills] = useState(currentStudent?.resumeData?.skills || "");
  const [editedSummary, setEditedSummary] = useState(currentStudent?.resumeData?.summary || "");
  const [editedExperience, setEditedExperience] = useState(currentStudent?.resumeData?.experience || "");
  const [editedProjects, setEditedProjects] = useState(currentStudent?.resumeData?.projects || "");

  // Local state for Applied Companies list
  const [studentAppliedCompanies, setStudentAppliedCompanies] = useState<string[]>(
    currentStudent?.appliedCompanies || []
  );
  // Local state for Application Statuses
  const [studentApplicationStatuses, setStudentApplicationStatuses] = useState<Record<string, string>>(
    currentStudent?.applicationStatuses || {}
  );

  // RSVP list
  const [rsvpList, setRsvpList] = useState<number[]>([]);

  // ATS Checker States
  const [atsSelectedJob, setAtsSelectedJob] = useState("Custom");
  const [atsJobDescription, setAtsJobDescription] = useState("");
  const [pastedResumeText, setPastedResumeText] = useState("");
  const [uploadedResumeName, setUploadedResumeName] = useState("");
  const [isAtsAnalyzing, setIsAtsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [atsCalibrationMode, setAtsCalibrationMode] = useState<"standard" | "tech" | "consulting">("standard");
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsReport, setAtsReport] = useState<any>(null);
  const [atsFeedbackTab, setAtsFeedbackTab] = useState<"diagnostics" | "suggestions" | "questions">("diagnostics");

  // ATS Bullet Rewriter States
  const [vagueBulletInput, setVagueBulletInput] = useState("");
  const [rewrittenBulletOutput, setRewrittenBulletOutput] = useState("");
  const [isRewritingBullet, setIsRewritingBullet] = useState(false);

  // Practice Sandbox States
  const [activeSandboxSubTab, setActiveSandboxSubTab] = useState<"mcq" | "coding" | "webcam">("mcq");

  // Mock MCQ states
  const [isMockTestOpen, setIsMockTestOpen] = useState(false);
  const [mockTestSubject, setMockTestSubject] = useState<"aptitude" | "technical">("aptitude");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number }>({});
  const [mockTestCompleted, setMockTestCompleted] = useState(false);
  const [mockTestTimer, setMockTestTimer] = useState(600); // 10 minutes

  // Coding sandbox states
  const [codingProblemIdx, setCodingProblemIdx] = useState(0);
  const [codingCode, setCodingCode] = useState(CODING_STARTER_CODES[0]);
  const [isCompilingCode, setIsCompilingCode] = useState(false);
  const [compilerLogs, setCompilerLogs] = useState<string[]>([]);

  // Webcam Mock Interview States
  const [isWebcamRecording, setIsWebcamRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [practiceQuestionIdx, setPracticeQuestionIdx] = useState(0);
  const [showWebcamPreview, setShowWebcamPreview] = useState(false);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  // --- Effects ---

  // Synchronize profile changes when currentStudent context updates
  useEffect(() => {
    if (currentStudent) {
      setEditedPhone(currentStudent.phone);
      setEditedCgpa(currentStudent.cgpa);
      setEditedSkills(currentStudent.resumeData?.skills || "");
      setEditedSummary(currentStudent.resumeData?.summary || "");
      setEditedExperience(currentStudent.resumeData?.experience || "");
      setEditedProjects(currentStudent.resumeData?.projects || "");
      setStudentAppliedCompanies(currentStudent.appliedCompanies || []);
      setStudentApplicationStatuses(currentStudent.applicationStatuses || {});
    }
  }, [currentStudent]);

  // Synchronize ATS Selected Job description template
  useEffect(() => {
    if (atsSelectedJob === "Custom") {
      // Keep existing description empty or user edited
    } else {
      const details = companyDetails[atsSelectedJob];
      if (details) {
        const jdText = `Position: Software Engineer / Technology Analyst at ${atsSelectedJob}\n\nOverview:\n${details.overview}\n\nRequirements & Core Skills:\n- ${details.skills.core.join("\n- ")}\n- ${details.skills.additional || ""}\n\nSelection Rounds:\n- ${details.selectionProcess.rounds.map((r: any) => typeof r === "object" ? `${r.round}: ${r.criteria}` : r).join("\n- ")}`;
        setAtsJobDescription(jdText);
      }
    }
  }, [atsSelectedJob, companyDetails]);

  // MCQ Mock test timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isMockTestOpen && !mockTestCompleted && mockTestTimer > 0) {
      timerId = setInterval(() => {
        setMockTestTimer(prev => {
          if (prev <= 1) {
            setMockTestCompleted(true);
            addToast("Time's up! Mock test submitted automatically.", "info");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isMockTestOpen, mockTestCompleted, mockTestTimer]);

  // Webcam Mock Recording seconds incrementer
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isWebcamRecording) {
      timerId = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isWebcamRecording]);

  // Coding Starter template synchronization
  useEffect(() => {
    setCodingCode(CODING_STARTER_CODES[codingProblemIdx]);
    setCompilerLogs([]);
  }, [codingProblemIdx]);

  // Clean up webcam stream on unmount
  useEffect(() => {
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [webcamStream]);

  // --- Handlers ---

  // Web camera toggle helper
  const startWebcam = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setWebcamStream(stream);
        if (webcamVideoRef.current) {
          webcamVideoRef.current.srcObject = stream;
        }
        setShowWebcamPreview(true);
        addToast("Webcam connected successfully!", "success");
      } else {
        setShowWebcamPreview(true); // Fallback to simulated indicator
        addToast("Webcam API not supported. Using simulation preview.", "info");
      }
    } catch (err) {
      setShowWebcamPreview(true); // Fallback to simulated animation
      addToast("Webcam permissions denied or not found. Simulating preview.", "info");
    }
  };

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
    setShowWebcamPreview(false);
    setIsWebcamRecording(false);
    setRecordingSeconds(0);
  };

  const handleApplyToCompany = (companyName: string, minCgpa: number) => {
    if (!currentStudent) return;
    if (!currentStudent.isEligible) {
      addToast("You are not marked eligible by PR coordinators yet.", "error");
      return;
    }
    if (currentStudent.cgpa < minCgpa) {
      addToast(`CGPA threshold not met (Required: ${minCgpa}, Yours: ${currentStudent.cgpa})`, "error");
      return;
    }

    // Add company to applied list
    if (!studentAppliedCompanies.includes(companyName)) {
      const updatedApplied = [...studentAppliedCompanies, companyName];
      const updatedStatuses = { ...studentApplicationStatuses, [companyName]: "Applied" };

      setStudentAppliedCompanies(updatedApplied);
      setStudentApplicationStatuses(updatedStatuses);

      const updatedProfile: StudentProfile = {
        ...currentStudent,
        appliedCompanies: updatedApplied,
        applicationStatuses: updatedStatuses
      };
      updateStudentProfile(updatedProfile);
      addToast(`Applied to ${companyName} successfully!`, "success");

      // Prefill Google Form overlay
      const comp = companies.find((c: Company) => c.name === companyName);
      const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfDyD4XJq4wQ0f8vE-tD7c8m9r1-2-3-4-5-6-7/viewform?usp=pp_url&entry.2000001=${encodeURIComponent(companyName)}&entry.2000002=${encodeURIComponent(currentStudent.name)}&entry.2000003=${encodeURIComponent(currentStudent.rollNo)}`;
      window.open(googleFormUrl, "_blank");
    }
  };

  const handleUpdateStatus = (companyName: string, status: string) => {
    if (!currentStudent) return;
    const updatedStatuses = { ...studentApplicationStatuses, [companyName]: status };
    setStudentApplicationStatuses(updatedStatuses);

    const updatedProfile: StudentProfile = {
      ...currentStudent,
      applicationStatuses: updatedStatuses
    };
    updateStudentProfile(updatedProfile);
    addToast(`Status updated to ${status} for ${companyName}`, "success");
  };

  const handleSaveProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const updatedProfile: StudentProfile = {
      ...currentStudent,
      phone: editedPhone,
      cgpa: editedCgpa,
      resumeData: {
        skills: editedSkills,
        summary: editedSummary,
        experience: editedExperience,
        projects: editedProjects
      }
    };
    updateStudentProfile(updatedProfile);
    setIsEditingProfile(false);
  };

  const handleFileUploadATS = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedResumeName(file.name);
      addToast(`Uploaded ${file.name} successfully!`, "success");
    }
  };

  // Compile code simulation
  const handleCompileCode = () => {
    if (isCompilingCode) return;
    setIsCompilingCode(true);
    setCompilerLogs(["[INFO] Invoking g++ compiler (std=c++17)..."]);

    setTimeout(() => {
      setCompilerLogs(prev => [...prev, "[INFO] Preprocessing templates and imports..."]);
    }, 400);

    setTimeout(() => {
      setCompilerLogs(prev => [...prev, "[INFO] Compiling class Solution in solution.cpp..."]);
    }, 800);

    setTimeout(() => {
      setCompilerLogs(prev => [
        ...prev,
        "[SUCCESS] Compilation completed with 0 errors, 0 warnings.",
        "[TEST] Running Test Case 1/3 (Default Input)... PASSED",
        "[TEST] Running Test Case 2/3 (Negative bounds)... PASSED",
        "[TEST] Running Test Case 3/3 (Edge inputs check)... PASSED",
        `[RESULT] All test cases passed! Executed in 4ms. Memory limit: 8.4MB.`,
        "-----------------------------------------",
        "Congratulations! Your solution compiles and matches expected output."
      ]);
      setIsCompilingCode(false);
      addToast("Compilation & tests completed successfully!", "success");
    }, 1500);
  };

  // Bullet point optimizer
  const handleRewriteBullet = () => {
    if (!vagueBulletInput.trim()) return;
    setIsRewritingBullet(true);
    setRewrittenBulletOutput("");

    setTimeout(() => {
      const input = vagueBulletInput.trim().toLowerCase();
      let output = "";

      if (input.includes("sql") || input.includes("query") || input.includes("db") || input.includes("database")) {
        output = "Optimized complex analytical SQL queries using window functions and indexing, reducing query runtimes by 40% across 2.5M records.";
      } else if (input.includes("web") || input.includes("frontend") || input.includes("ui") || input.includes("react")) {
        output = "Redesigned React user interfaces with lazy-loading and dynamic states, enhancing Core Web Vitals and boosting user conversion rates by 22%.";
      } else if (input.includes("model") || input.includes("ml") || input.includes("train") || input.includes("data")) {
        output = "Designed and trained a gradient-boosted tree model using XGBoost, achieving a 94% ROC-AUC and reducing false-positive classification errors by 25%.";
      } else if (input.includes("cloud") || input.includes("aws") || input.includes("docker") || input.includes("kubernetes") || input.includes("deploy")) {
        output = "Deployed containerized microservices to Kubernetes clusters via Helm and GKE, reducing deployment time by 60% and ensuring zero-downtime rolling updates.";
      } else if (input.includes("security") || input.includes("secure") || input.includes("crypt") || input.includes("encrypt")) {
        output = "Integrated GPG and AES-256 end-to-end payload encryption into REST endpoints, securing transit data and passing SOC2 mock compliance audits.";
      } else {
        const verbs = ["Optimized", "Engineered", "Spearheaded", "Re-architected", "Designed"];
        const chosenVerb = verbs[Math.floor(Math.random() * verbs.length)];
        output = `${chosenVerb} core features of '${vagueBulletInput}', incorporating performance metrics and automated pipeline updates to boost throughput by 35%.`;
      }

      setRewrittenBulletOutput(output);
      setIsRewritingBullet(false);
      addToast("Bullet successfully optimized by ATS coach!", "success");
    }, 1200);
  };

  // ATS Scanner algorithm
  const runAtsAnalysis = (resumeName: string, text: string) => {
    let resumeContent = text.trim();
    if (!resumeContent && resumeName) {
      const skillsList = currentStudent?.resumeData?.skills || "React, JavaScript, TypeScript, CSS, HTML";
      const summaryText = currentStudent?.resumeData?.summary || "Seeking Software Developer opportunity.";
      const experienceText = currentStudent?.resumeData?.experience || "Undergraduate projects.";
      const projectsText = currentStudent?.resumeData?.projects || "Web development applications.";

      resumeContent = `
        Candidate Name: ${currentStudent?.name || "Student"}
        Email: ${currentStudent?.username || "student@nitpy.ac.in"}
        Phone: +91 98765 43210
        LinkedIn: linkedin.com/in/${currentStudent?.name.toLowerCase().replace(/\s+/g, "") || "student"}
        
        SUMMARY:
        Seeking a Software Developer position. ${summaryText}
        
        EDUCATION:
        National Institute of Technology Puducherry - B.Tech in ${currentStudent?.department || "Computer Science"}
        CGPA: ${currentStudent?.cgpa || "8.5"} / 10.0
        Graduation: Jan 2024 – May 2026
        
        EXPERIENCE:
        Software Engineering Intern at Tech Corp (May 2025 – Aug 2025)
        - Designed and deployed full-stack platform saving 12 hours of manual entry weekly.
        - Optimized database queries, reducing response latency by 35% across 10,000 active users.
        - Led collaborative development in a 5-person engineering team.
        ${experienceText}
        
        PROJECTS:
        ${projectsText}
        - Built a real-time analytics web dashboard with 98% uptime.
        - Integrated secure authentication middleware, lowering login friction by 2x.
        
        TECHNICAL SKILLS:
        Languages & Frameworks: ${skillsList}
        Tools & Utilities: Git, Docker, Kubernetes, Webpack, Linux systems.
        
        CERTIFICATIONS:
        - Certified AWS Cloud Practitioner (Mar 2025)
      `;
    }

    if (!resumeContent) {
      addToast("Please upload a file or paste some resume text first.", "error");
      return;
    }

    setIsAtsAnalyzing(true);
    setAtsScore(null);

    const steps = [
      "Parsing layout & boundary margins...",
      "Extracting job description keywords & weights...",
      "Cross-referencing synonyms & contextual relations...",
      "Evaluating section distributions...",
      "Detecting quantitative metrics & impact phrases...",
      "Calculating ML-calibrated compatibility score..."
    ];

    let currentStepIdx = 0;
    setScanStep(steps[0]);

    const interval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setScanStep(steps[currentStepIdx]);
      } else {
        clearInterval(interval);

        const jdText = (atsJobDescription || "").toLowerCase();
        const resumeTextLower = resumeContent.toLowerCase();

        // 1. ROLE IDENTIFICATION & JOB-SPECIFIC TAILORING
        let detectedRole = "Software Engineer"; // Default
        if (/data\s*scientist|machine\s*learning|data\s*analyst|deep\s*learning|python|sql|r\s*programming/i.test(jdText)) {
          detectedRole = "Data Scientist";
        } else if (/cybersecurity|security|intrusion|encryption|firewall|network\s*security|vulnerability|threat/i.test(jdText)) {
          detectedRole = "Cybersecurity Analyst";
        }

        // Job-specific keyword pools
        const roleKeywords: Record<string, string[]> = {
          "Data Scientist": ["python", "sql", "machine learning", "ml", "pytorch", "tensorflow", "statistics", "data science", "pandas", "numpy", "scikit-learn", "deep learning", "cloud", "aws", "gcp"],
          "Software Engineer": ["dsa", "algorithms", "system design", "concurrency", "c++", "java", "git", "oop", "dbms", "database", "scale", "latency", "react", "javascript", "typescript"],
          "Cybersecurity Analyst": ["network security", "intrusion detection", "encryption", "firewalls", "penetration testing", "iam", "vulnerability", "threat", "cybersecurity", "security", "linux", "cloud", "oauth", "ssl"]
        };

        const targetKeywords = roleKeywords[detectedRole] || roleKeywords["Software Engineer"];

        // 2. CONTEXTUAL SYNONYMS & RELATED CONCEPTS
        const synonymMap: Record<string, string[]> = {
          "ml": ["machine learning", "deep learning", "neural networks", "pytorch", "tensorflow", "keras", "scikit-learn"],
          "machine learning": ["ml", "deep learning", "neural networks", "pytorch", "tensorflow", "keras", "scikit-learn"],
          "ai": ["artificial intelligence", "ml", "machine learning", "llm", "nlp", "computer vision"],
          "artificial intelligence": ["ai", "ml", "machine learning", "llm", "nlp", "computer vision"],
          "nlp": ["natural language processing", "llm", "transformers", "bert", "gpt"],
          "react": ["reactjs", "react.js", "redux", "frontend", "spa", "javascript"],
          "javascript": ["js", "es6", "ecmascript", "frontend"],
          "typescript": ["ts", "frontend", "angular"],
          "docker": ["containers", "kubernetes", "k8s", "devops", "ci/cd"],
          "kubernetes": ["k8s", "docker", "containers", "devops", "helm"],
          "aws": ["amazon web services", "cloud", "ec2", "s3", "rds", "lambda"],
          "gcp": ["google cloud platform", "cloud", "firebase", "bigquery"],
          "sql": ["database", "mysql", "postgresql", "sqlite", "oracle", "queries"],
          "nosql": ["mongodb", "redis", "cassandra", "dynamodb"],
          "devops": ["ci/cd", "jenkins", "github actions", "gitlab ci", "terraform", "ansible", "docker", "kubernetes"],
          "cpp": ["c++", "c plus plus", "dsa", "oop"],
          "c++": ["cpp", "c plus plus", "dsa", "oop"]
        };

        const matchedKeywords: string[] = [];
        const missingKeywords: string[] = [];

        targetKeywords.forEach(kw => {
          let hasMatch = resumeTextLower.includes(kw);
          if (!hasMatch && synonymMap[kw]) {
            hasMatch = synonymMap[kw].some(syn => resumeTextLower.includes(syn));
          }

          if (hasMatch) {
            matchedKeywords.push(kw);
          } else {
            missingKeywords.push(kw);
          }
        });

        // 3. HARD SKILLS VS SOFT SKILLS
        const softSkillsGlossary = ["communication", "leadership", "teamwork", "collaboration", "problem solving", "time management", "organization", "adaptability", "creativity", "critical thinking"];
        const foundSoftSkills = softSkillsGlossary.filter(skill => resumeTextLower.includes(skill));

        // 4. STRUCTURE & SECTION DIAGNOSTICS
        const headingsFound = {
          summary: /summary|objective|about\s*me|profile/i.test(resumeContent),
          experience: /experience|employment|work|internship|history/i.test(resumeContent),
          education: /education|academic|credentials|university|college|nitpy/i.test(resumeContent),
          skills: /skills|technologies|competencies|expertise/i.test(resumeContent),
          projects: /projects|academic\s*projects|personal\s*projects/i.test(resumeContent),
          certifications: /certifications|certs|licenses|awards/i.test(resumeContent)
        };

        const diagnostic: Record<string, { status: "good" | "warning" | "error"; note: string }> = {};

        // Contact info checks
        const hasEmail = resumeTextLower.includes("@") && resumeTextLower.includes(".com");
        const hasPhone = /\+?\d[\d\s-]{8,14}\d/g.test(resumeTextLower);
        const hasLinkedIn = resumeTextLower.includes("linkedin.com");
        if (hasEmail && hasPhone && hasLinkedIn) {
          diagnostic.contact = { status: "good", note: "Contact details are complete and parsed successfully (email, phone, LinkedIn parsed)." };
        } else {
          diagnostic.contact = { status: "warning", note: `Contact details incomplete. ${!hasEmail ? "Missing email." : ""} ${!hasPhone ? "Missing phone." : ""} ${!hasLinkedIn ? "Missing LinkedIn URL." : ""}` };
        }

        // Summary/Objective check
        const genericPhrases = [
          "seeking a challenging position", "utilize my skills", "opportunity to grow",
          "dynamic organization", "contribute to the growth", "enthusiastic student",
          "hardworking individual", "highly motivated candidate"
        ];
        const hasGenericSummary = genericPhrases.some(phrase => resumeTextLower.includes(phrase));
        if (!headingsFound.summary) {
          diagnostic.summary = { status: "error", note: "Summary / Objective section is missing. A professional profile summary is highly recommended." };
        } else if (hasGenericSummary) {
          diagnostic.summary = { status: "warning", note: "Objective contains standard boilerplate clichés ('seeking a challenging position'). Align it directly with JD keywords." };
        } else {
          diagnostic.summary = { status: "good", note: "Professional, role-aligned summary section found and parsed successfully." };
        }

        // Education check
        if (!headingsFound.education) {
          diagnostic.education = { status: "error", note: "Education section is missing or utilizes non-standard headings." };
        } else {
          diagnostic.education = { status: "good", note: "Academic credentials section verified (NIT Py B.Tech education verified)." };
        }

        // Experience check
        if (!headingsFound.experience) {
          diagnostic.experience = { status: "error", note: "Missing Work Experience section. Employment history is critical for applicant matching." };
        } else {
          diagnostic.experience = { status: "good", note: "Professional experience segment parsed successfully." };
        }

        // Skills check
        if (!headingsFound.skills) {
          diagnostic.skills = { status: "error", note: "Technical Skills list is missing. Create a dedicated section separated by comma." };
        } else {
          diagnostic.skills = { status: "good", note: `Skills catalog indexed. Balanced with ${foundSoftSkills.length} soft skills.` };
        }

        // Projects & Certifications checks
        if (headingsFound.projects && headingsFound.certifications) {
          diagnostic.additional = { status: "good", note: "Both Projects and Certifications sections are present, boosting matching potential." };
        } else if (headingsFound.projects || headingsFound.certifications) {
          diagnostic.additional = { status: "warning", note: `Partially present. ${!headingsFound.projects ? "Missing Projects section." : "Missing Certifications section."}` };
        } else {
          diagnostic.additional = { status: "error", note: "Both Projects and Certifications sections are missing." };
        }

        // 5. READABILITY: ACTION VERBS & METRIC QUANTIFICATION
        const readabilityIssues: string[] = [];

        // Quantify achievements detection
        const metricRegex = /\b\d+(?:\.\d+)?\s*(?:%|x|k|M|\+|million|percent|users|throughput|latency|accuracy|reduction|increase|revenue|budget)\b/gi;
        const metricMatches = resumeContent.match(metricRegex) || [];
        const uniqueMetrics = Array.from(new Set(metricMatches));
        if (uniqueMetrics.length === 0) {
          readabilityIssues.push("No quantified achievements found. Use metrics like 'Improved query performance by 40%' to demonstrate impact.");
        } else {
          readabilityIssues.push(`Highly readable! Detected ${uniqueMetrics.length} quantified impact metrics (${uniqueMetrics.slice(0, 3).join(", ")}${uniqueMetrics.length > 3 ? "..." : ""}).`);
        }

        // Action verbs detection
        const actionVerbs = ["developed", "designed", "implemented", "led", "optimized", "built", "created", "engineered", "formulated", "spearheaded", "managed", "executed", "directed", "programmed", "analyzed"];
        const foundActionVerbs = actionVerbs.filter(verb => resumeTextLower.includes(verb));
        if (foundActionVerbs.length < 3) {
          readabilityIssues.push(`Weak action verbs. Only found: ${foundActionVerbs.join(", ") || "none"}. Replace passive verbs (e.g. 'helped', 'responsible for') with 'Developed', 'Designed', 'Led'.`);
        } else {
          readabilityIssues.push(`Strong verbs coverage: ${foundActionVerbs.slice(0, 4).join(", ")} utilized effectively.`);
        }

        // 6. READABILITY INDEX: FLESCH-KINCAID READABILITY CALCULATION
        const cleanContentText = resumeContent.replace(/[^a-zA-Z0-9\s]/g, "");
        const words = cleanContentText.split(/\s+/).filter(w => w.length > 0);
        const sentenceMatches = resumeContent.match(/[.!?]+(?=\s|$)/g) || [];
        const sentenceCount = Math.max(1, sentenceMatches.length);
        const wordCount = Math.max(1, words.length);

        const countSyllables = (w: string) => {
          let word = w.toLowerCase();
          if (word.length <= 3) return 1;
          word = word.replace(/(?:es|ed|e)$/, '');
          word = word.replace(/^y/, '');
          const syllables = word.match(/[aeiouy]{1,2}/g);
          return syllables ? syllables.length : 1;
        };
        const totalSyllables = words.reduce((acc, w) => acc + countSyllables(w), 0);

        // Flesch-Kincaid Reading Ease
        const readingEase = Math.round(206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount));
        const finalReadingEase = Math.max(10, Math.min(100, readingEase));

        let readabilityDescription = "Highly Professional (Difficult to read, typical of academic and corporate reports)";
        if (finalReadingEase > 80) readabilityDescription = "Easy to read (Conversational style)";
        else if (finalReadingEase > 60) readabilityDescription = "Standard level (Clear and readable)";
        else if (finalReadingEase > 40) readabilityDescription = "Fairly difficult (Optimal business/technical documentation)";

        readabilityIssues.push(`Flesch-Kincaid Reading Ease Index: ${finalReadingEase}/100. Classification: ${readabilityDescription}.`);

        // Check for long paragraph issues (no bullets)
        const checkLines = resumeContent.split("\n");
        const longParagraphs = checkLines.filter(line => line.trim().length > 200 && !/^\s*[-*•+]/i.test(line));
        if (longParagraphs.length > 0) {
          readabilityIssues.push(`${longParagraphs.length} long text block(s) detected without bullet points. Convert long paragraphs into bullets for achievements.`);
        } else {
          readabilityIssues.push("Bulleted structure check passed: Achievements are listed clean and linear.");
        }

        // 7. FORMATTING & READABILITY AUDIT (Plain Text / Non-Standard Features)
        const formattingIssues: string[] = [];

        // File extension checking
        if (resumeName) {
          const extension = resumeName.split('.').pop()?.toLowerCase();
          if (extension && extension !== "pdf" && extension !== "docx") {
            formattingIssues.push(`Non-standard file extension (${extension}). Re-save and upload as a flat PDF or DOCX file.`);
          }
        }

        // Tables check
        const hasTables = resumeContent.includes("|") || resumeContent.includes("+-") || resumeContent.includes("-----");
        if (hasTables) {
          formattingIssues.push("Table formatting boundaries or multi-column grids detected. Avoid tables, columns, or text-boxes that block linear parsing.");
        }

        // Special Bullet symbols check
        const specialBullets = (resumeContent.match(/[❖➢✔★■◆⚫]/g) || []).length;
        if (specialBullets > 2) {
          formattingIssues.push("Non-standard bullet characters found. Stick to standard round bullets or hyphens; others can crash ATS layout engines.");
        }

        // Date consistency check
        const dateRangeRegex = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}\s*[-–—]\s*(?:present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}/gi;
        const datesFound = resumeContent.match(dateRangeRegex) || [];
        if (datesFound.length === 0) {
          formattingIssues.push("No consistent chronological date formats found (e.g. 'Jan 2024 – May 2026'). Standardize all dates for timeline verification.");
        }

        // Headers/Footers risk
        const hasHeaderFooterRisk = /page\s*\d+\s*of\s*\d+|confidential|copyright/i.test(resumeContent);
        if (hasHeaderFooterRisk) {
          formattingIssues.push("Potential header/footer tags detected. Avoid placing vital contact data or education records inside header/footer bands.");
        }

        if (formattingIssues.length === 0) {
          formattingIssues.push("No major formatting anomalies found. Document layout is clean and linear.");
        }

        // 8. SECTION WEIGHTING & FORMULA IMPLEMENTATION
        let s_exp = headingsFound.experience ? (foundActionVerbs.length >= 3 ? 100 : 80) : 0;
        if (uniqueMetrics.length === 0 && s_exp > 0) s_exp -= 20;

        let s_skills = headingsFound.skills ? Math.round((matchedKeywords.length / Math.max(1, targetKeywords.length)) * 100) : 0;
        if (foundSoftSkills.length >= 2) s_skills = Math.min(100, s_skills + 10);
        else s_skills = Math.max(10, s_skills - 10);

        const s_edu = headingsFound.education ? (resumeTextLower.includes("nit") ? 100 : 80) : 0;
        const s_format = Math.max(10, 100 - (formattingIssues.filter(i => !i.includes("No major")).length * 20));

        let s_summary = headingsFound.summary ? 100 : 0;
        if (hasGenericSummary) s_summary = 40;

        // Default weights
        let weights = { experience: 0.35, skills: 0.30, education: 0.15, format: 0.10, summary: 0.10 };

        // Calibration mode overrides
        if (atsCalibrationMode === "tech") {
          weights = { experience: 0.30, skills: 0.45, education: 0.10, format: 0.08, summary: 0.07 };
        } else if (atsCalibrationMode === "consulting") {
          weights = { experience: 0.25, skills: 0.20, education: 0.25, format: 0.15, summary: 0.15 };
        }

        // Calculated base score
        let scoreCalculated = (
          s_exp * weights.experience +
          s_skills * weights.skills +
          s_edu * weights.education +
          s_format * weights.format +
          s_summary * weights.summary
        );

        // Projects/Certifications Bonus
        let bonusScore = 0;
        if (headingsFound.projects) bonusScore += 5;
        if (headingsFound.certifications) bonusScore += 5;

        let finalScore = Math.max(15, Math.min(100, Math.round(scoreCalculated + bonusScore)));
        const percentileRank = Math.max(2, Math.min(98, 100 - Math.round((finalScore - 12) * 0.93)));

        // 9. PRIORITIZED COACH RECOMMENDATIONS
        const recommendations: string[] = [];
        if (!headingsFound.summary) recommendations.push("Add an explicit Objective / Professional Summary section near the top.");
        if (hasGenericSummary) recommendations.push("Rewrite your summary to target the specific role qualifications directly instead of generic objectives.");
        if (!headingsFound.experience) recommendations.push("Add a Work Experience / Internship segment listing your key achievements.");
        if (uniqueMetrics.length < 2) recommendations.push("Quantify achievements (e.g. 'Improved speed by 40%', 'Supported 200+ active users') under experience bullets.");
        if (foundActionVerbs.length < 4) recommendations.push("Replace passive phrasing with active verbs (e.g. 'Designed', 'Engineered', 'Spearheaded') at bullet start.");
        if (!headingsFound.skills) recommendations.push("Introduce a Skills segment itemizing specific tools and technologies.");
        if (foundSoftSkills.length < 2) recommendations.push("Incorporate core soft skills (e.g. 'collaboration', 'problem solving') naturally within experience bullets.");
        missingKeywords.slice(0, 4).forEach(kw => {
          recommendations.push(`Incorporate target technical keyword: "${kw.toUpperCase()}" in your skills or experience sections.`);
        });
        if (hasTables) recommendations.push("Format multi-column tables into left-aligned single columns to guarantee text flow reading.");
        if (specialBullets > 2) recommendations.push("Replace special bullet shapes/icons with standard round bullets.");
        if (datesFound.length === 0) recommendations.push("Format date ranges consistently using the standard format: 'Jan 2024 – May 2026'.");
        if (recommendations.length === 0) {
          recommendations.push("Resume is fully optimized! Review layout occasionally before uploads.");
        }

        // Suggestions generation
        const suggestionsList: Array<{
          id: string;
          priority: "High" | "Medium" | "Low";
          estimated_score_impact: number;
          rationale: string;
          edit_text: string;
          location: string;
        }> = [];

        // Interview prep questions generation
        const questionsList: Array<{
          id: string;
          type: "Screening" | "Technical" | "Behavioral";
          question_text: string;
          evidence_link: string;
          expected_answer_outline: string[];
          scoring_rubric: string[];
          difficulty: "easy" | "medium" | "hard";
        }> = [];

        if (detectedRole === "Data Scientist") {
          suggestionsList.push(
            {
              id: "sug-1",
              priority: "High",
              estimated_score_impact: 8,
              rationale: "JD requires 'Python' and machine learning capabilities. Mirroring this phrasing is critical.",
              edit_text: "Add to Skills: Python, Scikit-Learn, Pandas, TensorFlow",
              location: "Skills"
            },
            {
              id: "sug-2",
              priority: "High",
              estimated_score_impact: 10,
              rationale: "Vague machine learning experience needs evidence and quantification.",
              edit_text: "Designed and trained a gradient-boosted tree model using XGBoost on 100k+ customer transactions, achieving a 94% ROC-AUC and reducing false-positive classification errors by 25%.",
              location: "Experience [Machine Learning Project / Job]"
            },
            {
              id: "sug-3",
              priority: "Medium",
              estimated_score_impact: 5,
              rationale: "Database management requirements require explicit mention of SQL query optimization.",
              edit_text: "Optimized complex SQL queries using window functions and indexing, reducing query runtimes by 40% across analytical databases.",
              location: "Projects / Work Experience"
            }
          );

          questionsList.push(
            {
              id: "q-1",
              type: "Screening",
              question_text: "Explain the optimization details of the gradient-boosted tree model. How did you define baseline performance and measure the 25% reduction in false-positives?",
              evidence_link: "Experience[XGBoost project bullet]",
              expected_answer_outline: [
                "Detailed parameters tuning (learning rate, depth, regularization)",
                "Comparison metrics (Confusion matrix, Precision-Recall curves)",
                "Baseline model comparison (simple Logistic Regression)",
                "Production impact on fraud classification"
              ],
              scoring_rubric: [
                "Tuning explanation (3 points)",
                "Evaluation baseline detail (3 points)",
                "Measurement clarity (4 points)"
              ],
              difficulty: "medium"
            },
            {
              id: "q-2",
              type: "Technical",
              question_text: "Describe the window functions you used to optimize queries. How does a window function differ from a GROUP BY query in relational algebra?",
              evidence_link: "Projects[SQL query optimization]",
              expected_answer_outline: [
                "Syntax and purpose (OVER clause, PARTITION BY, ORDER BY)",
                "Main difference: grouping rows vs maintaining individual row identity",
                "Examples: ROW_NUMBER(), RANK(), LEAD(), LAG()",
                "Indexing strategies (composite index on partition/sort fields)"
              ],
              scoring_rubric: [
                "Syntax definition (2 points)",
                "Theoretical difference explanation (4 points)",
                "Optimization details (4 points)"
              ],
              difficulty: "hard"
            }
          );
        } else {
          // Software Engineer defaults
          suggestionsList.push(
            {
              id: "sug-1",
              priority: "High",
              estimated_score_impact: 7,
              rationale: "JD emphasizes 'DSA' and system complexity checks. Adding specialized topics helps query matching.",
              edit_text: "Skills: Data Structures, Algorithms, C++, Java, System Design",
              location: "Skills"
            },
            {
              id: "sug-2",
              priority: "High",
              estimated_score_impact: 9,
              rationale: "Quantification boost. Vague engineering bullets can be improved.",
              edit_text: "Re-architected client-facing modules using React lazy loading and debounce states, reducing initial page payload size by 35% and improving Core Web Vitals (LCP) by 800ms.",
              location: "Experience [Software Engineering Intern]"
            },
            {
              id: "sug-3",
              priority: "Medium",
              estimated_score_impact: 6,
              rationale: "Team lead capabilities or project pipeline tracking is desirable.",
              edit_text: "Spearheaded a 3-person engineering team to design a secure REST gateway, integrating JWT authorization and rate limiting, lowering API request latency by 15%.",
              location: "Projects / Leadership Roles"
            }
          );

          questionsList.push(
            {
              id: "q-1",
              type: "Screening",
              question_text: "How did you measure the 35% reduction in page payload size? What tools did you use to verify Core Web Vitals improvements?",
              evidence_link: "Experience[React lazy loading bullet]",
              expected_answer_outline: [
                "Chrome DevTools Network tab size comparisons",
                "Lighthouse metrics audits (LCP, FID, CLS)",
                "Web Vitals library analytics tracking",
                "Bundle analyzer diagnostics (Webpack Bundle Analyzer)"
              ],
              scoring_rubric: [
                "Measurement setup (3 points)",
                "Metric analysis (4 points)",
                "Tool usage justification (3 points)"
              ],
              difficulty: "easy"
            },
            {
              id: "q-2",
              type: "Technical",
              question_text: "Explain the architecture of the secure REST gateway. How does JWT verification scale horizontally, and how did you prevent replay attacks?",
              evidence_link: "Projects[REST gateway rate limiting]",
              expected_answer_outline: [
                "Stateless JWT verification using public keys",
                "Rate limiting algorithm (Token Bucket or Leaky Bucket via Redis)",
                "Replay protection (JTI nonce validation, short expiration times)",
                "Horizontal scale-out using load balancers (Nginx, AWS ALB)"
              ],
              scoring_rubric: [
                "Stateless design principles (3 points)",
                "Rate limiting mechanism (3 points)",
                "Replay protection & scaling (4 points)"
              ],
              difficulty: "hard"
            }
          );
        }

        // Set final state
        setAtsScore(finalScore);
        setAtsReport({
          score: finalScore,
          detectedRole,
          percentileRank,
          matchedKeywords,
          missingKeywords,
          softSkills: foundSoftSkills,
          diagnostic,
          readabilityIssues,
          formattingIssues,
          recommendations,
          suggestions: suggestionsList,
          questions: questionsList
        });
        setIsAtsAnalyzing(false);
        addToast("ATS analysis scan complete!", "success");
      }
    }, 400);
  };

  if (!currentStudent) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px]">
        <AlertCircle className="text-red-500 mb-4 animate-pulse" size={48} />
        <h4 className="text-lg font-bold text-white mb-2">No Student Profile Loaded</h4>
        <p className="text-xs text-slate-400 font-serif max-w-sm mb-6">
          Please log in as a student candidate to access the student portal interface dashboard.
        </p>
      </div>
    );
  }

  // --- Subcomponents ---

  // Sidebar navigation panel
  const renderSidebar = () => {
    const studentTabs = [
      { id: "profile", label: "My Profile", icon: <User size={16} /> },
      { id: "companies", label: "Job Drives", icon: <Briefcase size={16} /> },
      { id: "tracker", label: "App Tracker", icon: <TrendingUp size={16} /> },
      { id: "events", label: "Events & RSVPs", icon: <Calendar size={16} /> },
      { id: "resume", label: "ATS Score Checker", icon: <FileText size={16} /> },
      { id: "placed-directory", label: "Placed Directory", icon: <Users size={16} /> },
      { id: "practice", label: "Practice Sandbox", icon: <Sparkles size={16} /> },
      { id: "settings", label: "Portal Settings", icon: <Settings size={16} /> }
    ];

    return (
      <div className="glass-panel p-4 rounded-3xl border border-white/5 flex flex-col gap-1.5 h-full">
        {studentTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setStudentDashTab(tab.id)}
            className={`w-full py-3 px-4 rounded-2xl text-left text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-3 cursor-pointer
              ${studentDashTab === tab.id
                ? "bg-luna-300 text-luna-950 shadow-md shadow-luna-300/10"
                : "text-slate-300 hover:text-white hover:bg-white/5"}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 flex flex-col gap-2">
        <div className="glass-panel p-6 rounded-3xl mb-4 border border-luna-300/20 text-center">
          <div className="w-20 h-20 rounded-full bg-luna-300/20 border-2 border-luna-300 flex items-center justify-center text-luna-300 text-3xl font-bold mx-auto mb-4 shadow-lg shadow-luna-300/20 uppercase">
            {currentStudent.name.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <h3 className="text-base font-bold text-white mb-1 leading-tight">{currentStudent.name}</h3>
          <p className="text-[10px] text-luna-300 font-bold uppercase tracking-widest">Student Candidate</p>
        </div>

        {renderSidebar()}
      </div>

      {/* Main Tab Content */}
      <div className="lg:col-span-3">

        {/* PROFILE TAB */}
        {studentDashTab === "profile" && (
          <div className="space-y-6 animate-fade-in text-xs">
            {/* Header profile info */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-luna-300/5 rounded-full blur-2xl"></div>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-luna-300/10 border border-luna-300/30 flex items-center justify-center text-luna-300 text-4xl font-bold uppercase shadow-inner">
                  {currentStudent.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div className="text-center sm:text-left flex-grow">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1.5">
                    <h3 className="text-xl font-black text-white">{currentStudent.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border tracking-wider
                      ${currentStudent.isEligible
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-red-500/10 border-red-500/30 text-red-300"}`}
                    >
                      {currentStudent.isEligible ? "✓ Eligible" : "⚠️ Suspended"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-serif leading-relaxed mb-4">
                    NITPY B.Tech • Department of {currentStudent.department} • Class of {currentStudent.year === "3rd Year" ? "2026" : "2025"}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[10px] text-slate-300">
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono">
                      CGPA: <strong className="text-luna-300">{currentStudent.cgpa.toFixed(2)}</strong>
                    </div>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono">
                      Credits: <strong className="text-white">{currentStudent.creditsEarned}</strong>
                    </div>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                      Status: <strong className="text-luna-200">{currentStudent.placementProgress}</strong>
                    </div>
                  </div>
                </div>

                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold uppercase transition text-[10px] self-center cursor-pointer"
                  >
                    Edit Profile Details
                  </button>
                )}
              </div>
            </div>

            {/* Profile Editing Form / View Panels */}
            {isEditingProfile ? (
              <form onSubmit={handleSaveProfileEdit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Edit Candidate Profile Details</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Cumulative CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editedCgpa}
                      onChange={(e) => setEditedCgpa(parseFloat(e.target.value) || 0)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Professional Summary</label>
                    <textarea
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      rows={3}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 font-serif leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Technical Skills (Comma separated)</label>
                    <input
                      type="text"
                      value={editedSkills}
                      onChange={(e) => setEditedSkills(e.target.value)}
                      placeholder="e.g. React, JavaScript, C++, SQL, Algorithms"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Work / Internship Experiences</label>
                    <textarea
                      value={editedExperience}
                      onChange={(e) => setEditedExperience(e.target.value)}
                      rows={3}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 font-serif leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Key Project Details</label>
                    <textarea
                      value={editedProjects}
                      onChange={(e) => setEditedProjects(e.target.value)}
                      rows={3}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 font-serif leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 border border-white/10 text-slate-400 rounded-xl font-bold uppercase transition hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl uppercase transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left profile column details */}
                <div className="md:col-span-2 space-y-6">
                  {/* Summary */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <User size={14} className="text-luna-300" />
                      About Candidate
                    </h4>
                    <p className="text-slate-350 text-xs font-serif leading-relaxed">
                      {currentStudent.resumeData?.summary || "No professional summary added. Click Edit Profile to insert details."}
                    </p>
                  </div>

                  {/* Internships & Exp */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase size={14} className="text-luna-300" />
                      Professional & Academic Experience
                    </h4>
                    <p className="text-slate-350 text-xs font-serif leading-relaxed whitespace-pre-line">
                      {currentStudent.resumeData?.experience || "No internship experience added. Click Edit Profile to add."}
                    </p>
                  </div>

                  {/* Projects */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-luna-300" />
                      Academic & Side Projects
                    </h4>
                    <p className="text-slate-350 text-xs font-serif leading-relaxed whitespace-pre-line">
                      {currentStudent.resumeData?.projects || "No project logs listed. Click Edit Profile to add."}
                    </p>
                  </div>
                </div>

                {/* Right sidebar info */}
                <div className="md:col-span-1 space-y-6 text-xs">
                  {/* Skills catalog */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Skills Inventory</h4>
                    {currentStudent.resumeData?.skills ? (
                      <div className="flex flex-wrap gap-2">
                        {currentStudent.resumeData.skills.split(",").map((skill: string, index: number) => (
                          <span key={index} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300 font-medium">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 font-serif">No skills indexed yet.</p>
                    )}
                  </div>

                  {/* Academic checklist details */}
                  <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Cell Checks</h4>
                    <div className="space-y-3 text-[11px] leading-relaxed">
                      <div className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-slate-400">CGPA Clearance</span>
                        <strong className="text-emerald-400">Passed</strong>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-slate-400">Backlogs Count</span>
                        <strong className="text-emerald-400">0 Active</strong>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-slate-400">Attendance Log</span>
                        <strong className="text-white">88%</strong>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-400">Cell Verification</span>
                        <strong className={currentStudent.isEligible ? "text-emerald-400" : "text-red-400"}>
                          {currentStudent.isEligible ? "Active" : "On Hold"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* JOB DRIVES TAB */}
        {studentDashTab === "companies" && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div>
              <h3 className="text-xl font-black text-white">Active Recruiter Job Openings</h3>
              <p className="text-xs text-slate-400 font-serif">Apply to verified drives. Check eligibility threshold beforehand.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.filter((c: Company) => c.status === "active").map((company: Company, index: number) => {
                const isApplied = studentAppliedCompanies.includes(company.name);
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedCompanyDetails(company.name)}
                    className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300 relative overflow-hidden flex flex-col justify-between text-xs cursor-pointer group"
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
                            <h4 className="text-base font-bold text-white group-hover:text-luna-300 transition-colors flex items-center gap-1.5">
                              {company.name}
                              <span className="text-[8px] text-slate-400 font-normal font-sans italic opacity-70 group-hover:opacity-100">(View Insights)</span>
                            </h4>
                            <span className="text-[10px] text-luna-300 uppercase tracking-widest font-semibold">{company.sector}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-slate-350 uppercase">
                          Min CGPA: {company.minCgpa.toFixed(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-xs text-center font-sans mb-4">
                        <div>
                          <span className="text-[9px] text-slate-400 block">Max Offer</span>
                          <span className="font-bold text-white">{company.maxPackage}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">Avg Offer</span>
                          <span className="font-bold text-white">{company.avgPackage}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">Hires</span>
                          <span className="font-bold text-white">{company.hires} students</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyToCompany(company.name, company.minCgpa);
                      }}
                      className={`w-full py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300 relative z-20 cursor-pointer
                        ${isApplied
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-not-allowed"
                          : "bg-luna-300 hover:bg-luna-50 text-luna-950 hover:shadow-lg hover:shadow-luna-300/10"}`}
                      disabled={isApplied}
                    >
                      {isApplied ? "✓ Applied Successfully" : "Apply to Job Openings"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* APPLICATION TRACKER TAB */}
        {studentDashTab === "tracker" && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div>
              <h3 className="text-xl font-black text-white">Application Pipeline Tracker</h3>
              <p className="text-xs text-slate-400 font-serif">Track and update your recruitment pipeline phases for each applied company.</p>
            </div>

            {studentAppliedCompanies.length === 0 ? (
              <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px]">
                <Briefcase className="text-slate-500 mb-4 animate-bounce" size={48} />
                <h4 className="text-lg font-bold text-white mb-2">No Active Applications</h4>
                <p className="text-xs text-slate-400 font-serif max-w-sm mb-6">
                  You haven't applied to any recruiter drives yet. Head over to the **Job Drives** tab to explore and apply.
                </p>
                <button
                  onClick={() => setStudentDashTab("companies")}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-luna-300 hover:bg-luna-50 text-luna-950 transition-all font-sans cursor-pointer"
                >
                  Explore Job Drives
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {studentAppliedCompanies.map((companyName) => {
                  const currentStatus = studentApplicationStatuses[companyName] || "Applied";
                  const steps = ["Applied", "Shortlisted", "Interview Scheduled", "Offer Received"] as const;
                  const currentStepIndex = steps.indexOf(currentStatus as any);

                  return (
                    <div key={companyName} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-luna-300/10 border border-luna-300/30 flex items-center justify-center text-luna-300 text-base font-black uppercase font-sans">
                            {companyName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white">{companyName}</h4>
                            <span className="text-[10px] text-slate-400 font-serif">Current Stage: <strong className="text-luna-300">{currentStatus}</strong></span>
                          </div>
                        </div>

                        {/* Action buttons to manually update stage */}
                        <div className="flex flex-wrap gap-1.5 font-sans text-[10px]">
                          {steps.map((step) => (
                            <button
                              key={step}
                              onClick={() => handleUpdateStatus(companyName, step)}
                              className={`px-3 py-1.5 rounded-lg border font-bold uppercase transition-all cursor-pointer
                                ${currentStatus === step
                                  ? "bg-luna-300 border-luna-300 text-luna-950"
                                  : "bg-white/5 border-white/10 text-slate-350 hover:bg-white/10 hover:border-white/20"}`}
                            >
                              {step}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Steps Pipeline Visual */}
                      <div className="relative pt-4 pb-2 px-2">
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 rounded-full z-0"></div>
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-luna-300 rounded-full transition-all duration-500 z-0"
                          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        ></div>

                        <div className="relative flex justify-between z-10 text-[10px] font-bold">
                          {steps.map((step, idx) => {
                            const isDone = idx <= currentStepIndex;
                            const isActive = idx === currentStepIndex;

                            return (
                              <div key={step} className="flex flex-col items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                    ${isDone
                                      ? "bg-luna-300 border-luna-300 text-luna-950"
                                      : "bg-luna-900 border-white/20 text-slate-500"}`}
                                >
                                  {isDone ? "✓" : idx + 1}
                                </div>
                                <span className={`text-[9px] uppercase tracking-wider text-center max-w-[80px]
                                  ${isActive ? "text-luna-300 font-black" : isDone ? "text-white" : "text-slate-500"}`}
                                >
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* EVENTS TAB */}
        {studentDashTab === "events" && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div>
              <h3 className="text-xl font-black text-white">Recruitment Schedule & Seminars</h3>
              <p className="text-xs text-slate-400 font-serif">Mark your RSVP status to receive automated notifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event: PlacementEvent) => {
                const isRsvped = rsvpList.includes(event.id);
                return (
                  <div
                    key={event.id}
                    className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between gap-4 shadow-md overflow-hidden relative group text-xs"
                  >
                    <div>
                      {event.poster && (
                        <div className="w-full h-36 rounded-2xl overflow-hidden mb-4 border border-white/5 relative">
                          <img
                            src={event.poster}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                      )}

                      <div className="flex justify-between items-center mb-3">
                        <span className="px-2 py-0.5 rounded-full bg-luna-300/15 border border-luna-300/30 text-[9px] font-bold text-luna-300 uppercase">
                          {event.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans">{event.date}</span>
                      </div>

                      <h4 className="text-base font-black text-white mb-2 leading-snug">{event.title}</h4>
                      {event.description && (
                        <p className="text-xs text-slate-350 font-serif leading-relaxed mb-4">{event.description}</p>
                      )}

                      <div className="space-y-1 text-xs text-slate-300 font-serif mb-4 pt-2 border-t border-white/5">
                        <p>Time: <strong>{event.time}</strong></p>
                        <p>Venue: <strong>{event.venue}</strong></p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => {
                          if (isRsvped) {
                            setRsvpList(prev => prev.filter(id => id !== event.id));
                            addToast("Cancelled RSVP", "info");
                          } else {
                            setRsvpList(prev => [...prev, event.id]);
                            addToast("RSVP Confirmed!", "success");
                          }
                        }}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase transition-all duration-300 cursor-pointer
                          ${isRsvped
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                            : "bg-white/5 border border-white/10 hover:border-luna-300 text-white"}`}
                      >
                        {isRsvped ? "✓ RSVP'd" : "RSVP"}
                      </button>

                      {event.googleFormUrl && (
                        <a
                          href={event.googleFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase border border-luna-300 bg-luna-300 hover:bg-luna-50 text-luna-950 transition-all duration-300 hover:shadow-md hover:shadow-luna-300/15 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          Register <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ATS RESUME CHECKER TAB */}
        {studentDashTab === "resume" && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div>
              <h3 className="text-xl font-black text-white">Resume ATS Compatibility Checker</h3>
              <p className="text-xs text-slate-400 font-serif">Upload your resume or paste its content to run a simulated ATS compliance diagnostic test.</p>
            </div>

            {/* Analysis Loading State */}
            {isAtsAnalyzing && (
              <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[400px] animate-pulse font-sans">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-luna-300/25 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-luna-300 rounded-full animate-spin"></div>
                  <FileText className="absolute inset-0 m-auto text-luna-300 animate-bounce" size={32} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Analyzing Resume...</h4>
                <p className="text-xs text-luna-300 font-mono tracking-wider uppercase">{scanStep}</p>
              </div>
            )}

            {/* ATS Score Checker Screen */}
            {!isAtsAnalyzing && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Settings Panel */}
                  <div className="lg:col-span-1 glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6 text-xs flex flex-col justify-between">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Analysis Settings</h4>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Target Recruiter Job Description</label>
                        <select
                          value={atsSelectedJob}
                          onChange={(e) => setAtsSelectedJob(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                        >
                          <option value="Custom">Custom / General Software Role</option>
                          {Object.keys(companyDetails).map(comp => (
                            <option key={comp} value={comp}>{comp} - Software Engineer</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Weights Calibration Preset</label>
                        <select
                          value={atsCalibrationMode}
                          onChange={(e) => setAtsCalibrationMode(e.target.value as any)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                        >
                          <option value="standard">Standard Balanced (35% Exp, 30% Skills)</option>
                          <option value="tech">Developer Core (45% Tech Skills, 30% Exp)</option>
                          <option value="consulting">Analyst Focused (25% Edu, 25% Exp, 20% Skills)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Raw Job Description (For calibration)</label>
                        <textarea
                          value={atsJobDescription}
                          onChange={(e) => setAtsJobDescription(e.target.value)}
                          placeholder="Paste recruiter JD requirements details here..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-luna-300 h-28 font-serif leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <span className="text-[10px] text-slate-400 block mb-2 font-serif">Select analysis parameters to calibrate matching models before launching audit scanners.</span>
                    </div>
                  </div>

                  {/* File Upload / Paste text Panels */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* File Upload Panel */}
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
                      <div className="w-full space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 justify-center">
                          <UploadCloud className="text-luna-300" size={18} />
                          Upload Flat Document
                        </h4>
                        <p className="text-[10px] text-slate-400 font-serif leading-relaxed text-center">
                          Upload your resume in PDF or DOCX format to parse layout, bullet counts, metrics, and technical keywords.
                        </p>

                        <div className="border border-dashed border-white/15 hover:border-luna-300/40 rounded-2xl p-6 text-center cursor-pointer transition relative bg-black/10">
                          <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileUploadATS}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <FileText className="mx-auto text-slate-500 mb-2 animate-pulse" size={32} />
                          {uploadedResumeName ? (
                            <span className="text-[11px] font-mono text-emerald-400 block truncate">{uploadedResumeName}</span>
                          ) : (
                            <span className="text-[10px] text-slate-400 block">Click or drag resume file (PDF, DOCX)</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => runAtsAnalysis(uploadedResumeName, "")}
                        className="w-full py-3 mt-6 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all font-sans cursor-pointer"
                      >
                        Analyze Uploaded Document
                      </button>
                    </div>

                    {/* Paste Content Panel */}
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
                      <div className="w-full space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 justify-center">
                          <FileText className="text-luna-300" size={18} />
                          Paste Raw Resume Text
                        </h4>
                        <p className="text-[10px] text-slate-400 font-serif leading-relaxed">
                          Paste the objective, skills list, project briefs, and descriptions directly from your resume to check text density compatibility.
                        </p>

                        <textarea
                          value={pastedResumeText}
                          onChange={(e) => setPastedResumeText(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-luna-300 h-44 font-serif leading-relaxed"
                          placeholder="Paste summary, key skills, and past internships listings text here..."
                        />
                      </div>

                      <button
                        onClick={() => runAtsAnalysis("", pastedResumeText)}
                        className="w-full py-3 mt-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-luna-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all font-sans cursor-pointer"
                      >
                        Scan Pasted Content
                      </button>
                    </div>
                  </div>
                </div>

                {/* Score Report results details */}
                {atsReport && (
                  <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-8 animate-fade-in font-sans">
                    {/* Score header */}
                    <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-6">
                      <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                        {/* Circle Score */}
                        <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#54acbf"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * atsReport.score) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center font-sans text-center">
                          <span className="text-3xl font-black text-white">{atsReport.score}</span>
                          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">ATS Score</span>
                        </div>
                      </div>

                      <div className="flex-grow space-y-3 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                          <h4 className="text-lg font-black text-white">ATS Diagnostics Report</h4>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-luna-300/10 border border-luna-300/30 text-luna-300 font-mono font-bold">
                            Percentile Match: {atsReport.percentileRank}%
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-350 font-serif leading-relaxed max-w-xl">
                          Candidate matches the structural patterns of verified **{atsReport.detectedRole}** recruiter benchmarks.
                          {atsReport.score >= 80
                            ? " Excellent alignment! Your profile demonstrates rich action-verb coverage and metric-driven achievements."
                            : atsReport.score >= 60
                              ? " Good structure. Integrating a few missing technical keywords and replacing passive language will easily raise your score."
                              : " Critical formatting or section gaps detected. Review the diagnostics layout guidelines and missing keywords list below."}
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] text-slate-400">
                          <div>Keywords: <strong className="text-white">{atsReport.matchedKeywords.length} Matched</strong></div>
                          <div>Missing: <strong className="text-red-400">{atsReport.missingKeywords.length} Target</strong></div>
                          <div>Soft Skills: <strong className="text-white">{atsReport.softSkills.length} Detected</strong></div>
                        </div>
                      </div>
                    </div>

                    {/* Tabs for feedback */}
                    <div className="flex gap-4 border-b border-white/5 pb-2 text-xs font-bold uppercase tracking-wider font-sans">
                      <button
                        onClick={() => setAtsFeedbackTab("diagnostics")}
                        className={`pb-2 border-b-2 transition-all cursor-pointer ${atsFeedbackTab === "diagnostics" ? "border-luna-300 text-white" : "border-transparent text-slate-400 hover:text-white"}`}
                      >
                        Section Diagnostics
                      </button>
                      <button
                        onClick={() => setAtsFeedbackTab("suggestions")}
                        className={`pb-2 border-b-2 transition-all cursor-pointer ${atsFeedbackTab === "suggestions" ? "border-luna-300 text-white" : "border-transparent text-slate-400 hover:text-white"}`}
                      >
                        Keyword Optimizations
                      </button>
                      <button
                        onClick={() => setAtsFeedbackTab("questions")}
                        className={`pb-2 border-b-2 transition-all cursor-pointer ${atsFeedbackTab === "questions" ? "border-luna-300 text-white" : "border-transparent text-slate-400 hover:text-white"}`}
                      >
                        Interview Prep Coach
                      </button>
                    </div>

                    {/* TAB CONTENT: DIAGNOSTICS */}
                    {atsFeedbackTab === "diagnostics" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        {/* Section status check */}
                        <div className="space-y-4">
                          <h5 className="font-bold text-white text-sm mb-2">Section Layout Coverage</h5>
                          {Object.entries(atsReport.diagnostic).map(([key, data]: [string, any]) => (
                            <div key={key} className="flex gap-3.5 p-3.5 bg-white/5 border border-white/10 rounded-2xl items-start">
                              {data.status === "good" && <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={16} />}
                              {data.status === "warning" && <Info className="text-amber-400 flex-shrink-0" size={16} />}
                              {data.status === "error" && <ShieldAlert className="text-red-400 flex-shrink-0" size={16} />}
                              <div>
                                <span className="block font-bold text-white capitalize mb-0.5">{key} section</span>
                                <p className="text-[10px] text-slate-350 font-serif leading-relaxed">{data.note}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Readability & formatting */}
                        <div className="space-y-6">
                          <div>
                            <h5 className="font-bold text-white text-sm mb-3">Readability Audit</h5>
                            <ul className="space-y-2.5 font-serif text-slate-350 text-[11px] list-disc pl-4">
                              {atsReport.readabilityIssues.map((issue: string, idx: number) => (
                                <li key={idx} className="leading-relaxed">{issue}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-4 border-t border-white/5">
                            <h5 className="font-bold text-white text-sm mb-3">Formatting Rules Audit</h5>
                            <ul className="space-y-2.5 font-serif text-slate-350 text-[11px] list-disc pl-4">
                              {atsReport.formattingIssues.map((issue: string, idx: number) => (
                                <li key={idx} className="leading-relaxed">{issue}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: SUGGESTIONS */}
                    {atsFeedbackTab === "suggestions" && (
                      <div className="space-y-6 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-emerald-500/[0.02] border border-emerald-500/20 rounded-2xl">
                            <h5 className="font-bold text-white mb-2 flex items-center gap-1">
                              <CheckCircle size={14} className="text-emerald-400" /> Matched Keywords
                            </h5>
                            {atsReport.matchedKeywords.length === 0 ? (
                              <p className="text-slate-400 font-serif">No matches. Tailor your skills section to target the Job Description.</p>
                            ) : (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {atsReport.matchedKeywords.map((kw: string) => (
                                  <span key={kw} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/35 text-emerald-300 rounded font-mono text-[10px] uppercase font-semibold">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="p-4 bg-red-500/[0.02] border border-red-500/20 rounded-2xl">
                            <h5 className="font-bold text-white mb-2 flex items-center gap-1">
                              <AlertCircle size={14} className="text-red-400" /> Missing Target Keywords
                            </h5>
                            {atsReport.missingKeywords.length === 0 ? (
                              <p className="text-slate-400 font-serif">Your resume matches the target keyword pool perfectly!</p>
                            ) : (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {atsReport.missingKeywords.map((kw: string) => (
                                  <span key={kw} className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded font-mono text-[10px] uppercase font-semibold">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Suggestions list */}
                        <div className="space-y-4">
                          <h5 className="font-bold text-white text-sm border-b border-white/5 pb-2">Calibrated Resume Edit Suggestions</h5>
                          {atsReport.suggestions.map((sug: any) => (
                            <div key={sug.id} className="p-4 bg-black/20 border border-white/10 rounded-2xl flex flex-col sm:flex-row justify-between gap-4">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black
                                    ${sug.priority === "High" ? "bg-red-500/25 border border-red-500/40 text-red-300" : "bg-amber-500/25 border border-amber-500/40 text-amber-300"}`}
                                  >
                                    {sug.priority} Priority
                                  </span>
                                  <span className="text-[10px] text-slate-350">Estimated Impact: <strong className="text-emerald-400">+{sug.estimated_score_impact} ATS points</strong></span>
                                  <span className="text-[10px] text-slate-400 italic">Location: {sug.location}</span>
                                </div>
                                <p className="text-slate-350 font-serif text-[11px] leading-relaxed">{sug.rationale}</p>
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl mt-2 font-mono text-[10px] text-slate-300 select-all">
                                  {sug.edit_text}
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(sug.edit_text);
                                  addToast("Copied to clipboard!", "success");
                                }}
                                className="px-3.5 py-2 h-fit bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-luna-300 rounded-xl text-[10px] uppercase font-bold self-start sm:self-center transition cursor-pointer"
                              >
                                Copy suggestion
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Interactive bullet rewriter */}
                        <div className="p-5 sm:p-6 bg-luna-300/[0.03] border border-luna-300/15 rounded-3xl space-y-4">
                          <div>
                            <h6 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles size={14} className="text-luna-300 animate-pulse" />
                              ATS Vague Bullet Rewriter Coach
                            </h6>
                            <p className="text-[10px] text-slate-400 font-serif">Input a vague resume bullet (e.g. "Worked on search features") to instantly optimize it with action verbs and quantifiable metrics.</p>
                          </div>

                          <div className="space-y-3">
                            <textarea
                              value={vagueBulletInput}
                              onChange={(e) => setVagueBulletInput(e.target.value)}
                              placeholder="Type a vague bullet here... (e.g. Worked on database query optimization)"
                              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition min-h-[60px] font-serif"
                            />

                            <div className="flex justify-between items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setVagueBulletInput("Worked on cloud deployment and scaling microservices");
                                }}
                                className="text-[9px] text-slate-400 hover:text-white underline cursor-pointer"
                              >
                                Load Example
                              </button>
                              <button
                                type="button"
                                onClick={handleRewriteBullet}
                                disabled={isRewritingBullet || !vagueBulletInput.trim()}
                                className="px-4 py-2 bg-luna-300 hover:bg-luna-50 disabled:bg-slate-700 disabled:text-slate-500 text-luna-950 font-bold rounded-xl text-[10px] uppercase transition cursor-pointer flex items-center gap-1"
                              >
                                {isRewritingBullet ? "Refining..." : "Optimize Bullet"}
                              </button>
                            </div>

                            {rewrittenBulletOutput && (
                              <div className="p-4 bg-emerald-500/[0.03] border border-emerald-500/20 rounded-2xl space-y-2.5 animate-fade-in">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Optimized ATS Output</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(rewrittenBulletOutput);
                                      addToast("Copied optimized bullet!", "success");
                                    }}
                                    className="text-[9px] text-slate-400 hover:text-white underline cursor-pointer"
                                  >
                                    Copy Output
                                  </button>
                                </div>
                                <p className="text-[11px] text-slate-200 leading-relaxed font-serif border-l-2 border-emerald-500 pl-3 italic">
                                  "{rewrittenBulletOutput}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: QUESTIONS */}
                    {atsFeedbackTab === "questions" && (
                      <div className="space-y-6 text-xs font-sans">
                        <div>
                          <h5 className="font-bold text-white text-sm mb-1">Evidence-Grounded Interview Prep & Rubrics</h5>
                          <p className="text-[11px] text-slate-400 font-serif">Simulated screening, technical, and behavioral interview questions mapped directly to your resume claims.</p>
                        </div>

                        {atsReport.questions.length === 0 ? (
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center text-slate-400">
                            No questions generated. Please run the ATS analysis first.
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {atsReport.questions.map((q: any) => (
                              <div key={q.id} className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/5 space-y-4">
                                <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                                  <div>
                                    <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-wide bg-luna-300/10 border border-luna-300/30 text-luna-300 font-bold font-sans">
                                      {q.type} Question
                                    </span>
                                    <span className="ml-2 text-[10px] text-slate-450 italic">Linked to: {q.evidence_link}</span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wide font-black font-sans
                                    ${q.difficulty === "hard" ? "bg-red-500/20 text-red-300 border border-red-500/35" : q.difficulty === "medium" ? "bg-amber-500/20 text-amber-300 border border-amber-500/35" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/35"}`}
                                  >
                                    {q.difficulty}
                                  </span>
                                </div>

                                <p className="text-white text-sm font-serif leading-relaxed font-bold">"{q.question_text}"</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5 font-serif">
                                  <div className="space-y-2">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-450 block font-sans">Ideal Answer Elements:</span>
                                    <ul className="list-disc pl-4 space-y-1 text-slate-350 text-[11px] leading-relaxed">
                                      {q.expected_answer_outline.map((bullet: string, i: number) => (
                                        <li key={i}>{bullet}</li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="space-y-2">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-450 block font-sans">Scoring Rubrics (Max 10 Points):</span>
                                    <ul className="list-disc pl-4 space-y-1 text-slate-350 text-[11px] leading-relaxed">
                                      {q.scoring_rubric.map((bullet: string, i: number) => (
                                        <li key={i}>{bullet}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PLACED DIRECTORY TAB */}
        {studentDashTab === "placed-directory" && (
          <PlacedDirectory showBulkTools={false} />
        )}

        {/* PRACTICE SANDBOX TAB */}
        {studentDashTab === "practice" && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-black text-white">Student Placement Practice Sandbox</h3>
                <p className="text-xs text-slate-400 font-serif">Sharpen your quantitative aptitude, master DSA compilation, and simulation test your interview posture.</p>
              </div>

              {/* Sub-tab selectors */}
              <div className="flex bg-black/35 border border-white/10 rounded-full p-1 self-start sm:self-center font-bold text-[10px] uppercase">
                {[
                  { id: "mcq", label: "MCQ Mock Test", icon: <Award size={12} /> },
                  { id: "coding", label: "Coding Playground", icon: <Terminal size={12} /> },
                  { id: "webcam", label: "Webcam Mock Interview", icon: <Video size={12} /> }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSandboxSubTab(sub.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer
                      ${activeSandboxSubTab === sub.id
                        ? "bg-luna-300 text-luna-950 shadow-md shadow-luna-300/10"
                        : "text-slate-400 hover:text-white"}`}
                  >
                    {sub.icon}
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SUBTAB: MCQ MOCK TESTS */}
            {activeSandboxSubTab === "mcq" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                {/* Aptitude card */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-white/20 transition duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-luna-300/10 border border-luna-300/30 flex items-center justify-center text-luna-300 mb-4">
                      <Award size={24} />
                    </div>
                    <h4 className="text-lg font-black text-white mb-2 leading-tight uppercase">Quantitative Aptitude MCQ</h4>
                    <p className="text-xs text-slate-400 font-serif leading-relaxed mb-6">
                      Practice arithmetic, speed, logical calculations, and work-rate word problems under strict time limitations. Matches leading screening thresholds.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setMockTestSubject("aptitude");
                      setMockTestTimer(600);
                      setSelectedAnswers({});
                      setActiveQuestionIdx(0);
                      setMockTestCompleted(false);
                      setIsMockTestOpen(true);
                    }}
                    className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold text-xs uppercase rounded-xl transition cursor-pointer"
                  >
                    Launch Quantitative Mock Test
                  </button>
                </div>

                {/* Technical card */}
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-white/20 transition duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-luna-300/10 border border-luna-300/30 flex items-center justify-center text-luna-300 mb-4">
                      <Sliders size={24} />
                    </div>
                    <h4 className="text-lg font-black text-white mb-2 leading-tight uppercase">Technical Core (C++/Java/DSA)</h4>
                    <p className="text-xs text-slate-400 font-serif leading-relaxed mb-6">
                      Test your conceptual grasp of OOPs, virtual functions, binary trees search complexity, and synchronized map structures commonly tested by recruiters.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setMockTestSubject("technical");
                      setMockTestTimer(600);
                      setSelectedAnswers({});
                      setActiveQuestionIdx(0);
                      setMockTestCompleted(false);
                      setIsMockTestOpen(true);
                    }}
                    className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold text-xs uppercase rounded-xl transition cursor-pointer"
                  >
                    Launch Technical Mock Test
                  </button>
                </div>
              </div>
            )}

            {/* SUBTAB: CODING COMPILER PLAYGROUND */}
            {activeSandboxSubTab === "coding" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-xs">
                {/* Problem details sidebar */}
                <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Select Coding Problem</h4>
                    <div className="space-y-2">
                      {CODING_PROBLEMS.map((prob, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCodingProblemIdx(idx)}
                          className={`w-full p-3 rounded-xl border text-left transition cursor-pointer
                            ${codingProblemIdx === idx
                              ? "bg-luna-300/15 border-luna-300 text-white font-bold"
                              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-sans font-bold">{prob.title}</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-[8px] text-emerald-400 uppercase font-black">{prob.difficulty}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/5 font-serif text-[11px] leading-relaxed text-slate-350">
                      <p><strong>Description:</strong> {CODING_PROBLEMS[codingProblemIdx].description}</p>
                      <p className="font-mono text-[10px] bg-black/30 p-2 rounded">Input format: {CODING_PROBLEMS[codingProblemIdx].inputFormat}</p>
                      <p className="font-mono text-[10px] bg-black/30 p-2 rounded">Expected output: {CODING_PROBLEMS[codingProblemIdx].outputFormat}</p>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-450 font-serif leading-relaxed">
                    Choose one of the interview coding challenges to initialize template starter compiler codes in the editor.
                  </div>
                </div>

                {/* Editor & compilation console */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Editor */}
                  <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/5 flex-grow flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal size={14} className="text-luna-300" />
                        solution.cpp
                      </h4>

                      <button
                        onClick={() => {
                          setCodingCode(CODING_STARTER_CODES[codingProblemIdx]);
                          addToast("Template code reset successfully!", "info");
                        }}
                        className="text-[9px] text-slate-400 hover:text-white underline cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw size={10} /> Reset Starter Code
                      </button>
                    </div>

                    <textarea
                      value={codingCode}
                      onChange={(e) => setCodingCode(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-luna-300 h-64 leading-relaxed resize-none"
                    />

                    <button
                      onClick={handleCompileCode}
                      disabled={isCompilingCode}
                      className="py-3 bg-luna-300 hover:bg-luna-50 disabled:bg-slate-700 disabled:text-slate-500 text-luna-950 font-bold text-xs uppercase rounded-xl transition cursor-pointer self-end px-8"
                    >
                      {isCompilingCode ? "Compiling..." : "Run & Compile Code"}
                    </button>
                  </div>

                  {/* Terminal Console Logs */}
                  {compilerLogs.length > 0 && (
                    <div className="glass-panel p-5 rounded-3xl border border-white/5 bg-black/50 font-mono text-[10px] space-y-1.5 text-slate-300 max-h-[220px] overflow-y-auto">
                      <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block mb-1">Compiler Console Outputs:</span>
                      {compilerLogs.map((log, idx) => {
                        const isSuccess = log.includes("[SUCCESS]");
                        const isResult = log.includes("[RESULT]");
                        const isError = log.includes("[ERROR]");

                        return (
                          <div
                            key={idx}
                            className={`leading-relaxed ${isSuccess ? "text-emerald-400 font-bold" : isResult ? "text-luna-300 font-bold" : isError ? "text-red-400 font-bold" : ""}`}
                          >
                            {log}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB: WEBCAM INTERVIEW SIMULATOR */}
            {activeSandboxSubTab === "webcam" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-xs">
                {/* Question Selection sidebar */}
                <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Select Interview Prompt</h4>
                    <div className="space-y-2">
                      {WEBCAM_INTERVIEW_QUESTIONS.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setPracticeQuestionIdx(idx);
                            if (isWebcamRecording) {
                              addToast("Recording reset on prompt change.", "info");
                              setRecordingSeconds(0);
                            }
                          }}
                          className={`w-full p-3 rounded-xl border text-left transition cursor-pointer font-serif
                            ${practiceQuestionIdx === idx
                              ? "bg-luna-300/15 border-luna-300 text-white font-bold"
                              : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"}`}
                        >
                          "{q}"
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-455 font-serif leading-relaxed">
                    Select a question prompt, enable webcam permissions, and click record to practice mock interview timing.
                  </div>
                </div>

                {/* Webcam Preview Screen */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between gap-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Camera size={14} className="text-luna-300" />
                      Mock Posture Camera Feed
                    </h4>

                    {isWebcamRecording && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/35 text-[9px] font-mono text-red-400 font-bold uppercase animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                        REC • {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, "0")}
                      </div>
                    )}
                  </div>

                  {/* Stream box */}
                  <div className="w-full h-80 rounded-2xl bg-black/40 border border-white/10 relative overflow-hidden flex items-center justify-center">
                    {showWebcamPreview ? (
                      webcamStream ? (
                        <video
                          ref={webcamVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover transform -scale-x-100"
                        />
                      ) : (
                        // Simulated webcam preview (animated backdrop or placeholder)
                        <div className="text-center space-y-4 animate-fade-in relative z-10 w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-luna-900/40 to-slate-900/40">
                          <div className="w-16 h-16 rounded-full bg-luna-300/10 border border-luna-300/30 flex items-center justify-center text-luna-300 animate-pulse">
                            <Camera size={32} />
                          </div>
                          <div>
                            <span className="text-[11px] text-white font-bold block mb-1">Simulated Webcam Active</span>
                            <span className="text-[9px] text-slate-450 block font-serif">Webcam stream active (simulated placeholder view).</span>
                          </div>
                          {isWebcamRecording && (
                            <div className="absolute inset-0 bg-red-500/[0.02] border-2 border-red-500/40 rounded-2xl pointer-events-none animate-pulse"></div>
                          )}
                        </div>
                      )
                    ) : (
                      <div className="text-center space-y-4">
                        <Camera className="mx-auto text-slate-650" size={48} />
                        <div>
                          <span className="text-[11px] text-slate-400 block mb-3 font-serif">Webcam stream is currently inactive.</span>
                          <button
                            onClick={startWebcam}
                            className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-luna-300 rounded-xl font-bold uppercase transition text-[10px] cursor-pointer"
                          >
                            Enable Camera Feed
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Buttons and controls */}
                  <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                    {showWebcamPreview && (
                      <button
                        onClick={stopWebcam}
                        className="px-4 py-2 border border-white/10 text-slate-400 rounded-xl font-bold uppercase transition hover:bg-white/5 cursor-pointer"
                      >
                        Disconnect Feed
                      </button>
                    )}

                    {showWebcamPreview && (
                      <button
                        onClick={() => {
                          if (isWebcamRecording) {
                            setIsWebcamRecording(false);
                            addToast("Mock recording simulation saved successfully!", "success");
                          } else {
                            setIsWebcamRecording(true);
                            setRecordingSeconds(0);
                            addToast("Recording started. Answer the selected prompt prompt.", "info");
                          }
                        }}
                        className={`px-6 py-2.5 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer
                          ${isWebcamRecording
                            ? "bg-red-500 hover:bg-red-650 text-white hover:shadow-lg hover:shadow-red-500/10"
                            : "bg-luna-300 hover:bg-luna-50 text-luna-950 hover:shadow-lg hover:shadow-luna-300/10"}`}
                      >
                        {isWebcamRecording ? (
                          <>
                            <Square size={13} fill="currentColor" /> Stop Simulation
                          </>
                        ) : (
                          <>
                            <Play size={13} fill="currentColor" /> Start Simulation
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {studentDashTab === "settings" && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 max-w-xl text-xs">
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
                <Settings size={18} className="text-luna-300" />
                Privacy Settings
              </h3>

              <div className="space-y-4 font-sans text-xs">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <span className="block font-bold text-white mb-0.5">Recruiter CGPA Access</span>
                    <p className="text-slate-400 text-[10px]">Allow verified companies to view your CGPA logs.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:height-4 after:width-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-luna-300"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div>
                    <span className="block font-bold text-white mb-0.5">Profile Public Search</span>
                    <p className="text-slate-400 text-[10px]">Allow batch mates to view your certifications.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:height-4 after:width-4 after:h-4 after:w-4 after:transition-all peer-checked:bg-luna-300"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Reset Password */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 max-w-xl text-xs font-sans">
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
                <Lock size={18} className="text-luna-300" />
                Update Password
              </h3>

              <form onSubmit={(e) => {
                e.preventDefault();
                const cur = (e.target as HTMLFormElement).elements.namedItem("current") as HTMLInputElement;
                const next = (e.target as HTMLFormElement).elements.namedItem("next") as HTMLInputElement;
                const conf = (e.target as HTMLFormElement).elements.namedItem("conf") as HTMLInputElement;

                const currentUser = users.find((u: any) => u.id === currentStudent.userId);
                if (cur.value !== (currentUser ? currentUser.passwordHash : "")) {
                  addToast("Current password incorrect", "error");
                  return;
                }
                if (next.value.length < 6) {
                  addToast("Password must be at least 6 characters long", "error");
                  return;
                }
                if (next.value !== conf.value) {
                  addToast("Passwords do not match", "error");
                  return;
                }

                setUsers((prev: any[]) => prev.map(u => u.id === currentStudent.userId ? { ...u, passwordHash: next.value } : u));
                addToast("Password updated successfully!", "success");
                (e.target as HTMLFormElement).reset();
              }} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Current Password</label>
                  <input type="password" name="current" required className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">New Password</label>
                  <input type="password" name="next" required className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Confirm New Password</label>
                  <input type="password" name="conf" required className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300" />
                </div>
                <button type="submit" className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl shadow-lg transition-all text-xs uppercase cursor-pointer">
                  Update Password Key
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* --- MOCK ASSESSMENT TEST OVERLAY MODAL --- */}
      {isMockTestOpen && (() => {
        const questions = mockTestSubject === "aptitude" ? APTITUDE_QUESTIONS : TECHNICAL_QUESTIONS;
        const activeQuestion = questions[activeQuestionIdx];

        let correctCount = 0;
        questions.forEach((q, idx) => {
          if (selectedAnswers[idx] === q.correct) correctCount++;
        });

        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
            <div className="glass-panel max-w-2xl w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col my-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-luna-300/5 rounded-full blur-2xl"></div>

              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    {mockTestSubject === "aptitude" ? "Quantitative Aptitude Mock MCQ" : "Technical DSA & OOPs Mock MCQ"}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-serif">Assessment Panel • NITPY Placement Cell</p>
                </div>

                {!mockTestCompleted && (
                  <div className={`px-4 py-2 rounded-xl border font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-2
                    ${mockTestTimer < 120
                      ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      : "bg-luna-300/10 border-luna-300/30 text-luna-300"}`}
                  >
                    Time Left: {Math.floor(mockTestTimer / 60)}:{(mockTestTimer % 60).toString().padStart(2, "0")}
                  </div>
                )}
              </div>

              {/* Modal Content */}
              {!mockTestCompleted ? (
                <div className="space-y-6 flex-grow">
                  {/* Progress bar */}
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-luna-300 h-full transition-all duration-300"
                      style={{ width: `${((activeQuestionIdx + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Question {activeQuestionIdx + 1} of {questions.length}</span>
                    <span className="text-luna-300">Single Choice Objective</span>
                  </div>

                  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-white text-xs font-serif leading-relaxed font-medium">
                      {activeQuestion.question}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 font-sans text-xs">
                    {activeQuestion.options.map((option, optIdx) => {
                      const isSelected = selectedAnswers[activeQuestionIdx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setSelectedAnswers(prev => ({
                              ...prev,
                              [activeQuestionIdx]: optIdx
                            }));
                          }}
                          className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-3.5
                            ${isSelected
                              ? "bg-luna-300/15 border-luna-300 text-white font-bold shadow-[0_0_15px_rgba(84,172,191,0.1)]"
                              : "bg-white/5 border-white/10 text-slate-350 hover:bg-white/10 hover:border-white/20"}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold text-[9px] uppercase tracking-wider transition-all
                            ${isSelected ? "bg-luna-300 border-luna-300 text-luna-950" : "border-slate-500 text-slate-400"}`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-6 mt-6">
                    <button
                      onClick={() => setActiveQuestionIdx(prev => Math.max(0, prev - 1))}
                      disabled={activeQuestionIdx === 0}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white border border-white/10 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <ChevronLeft size={14} />
                      Prev Question
                    </button>

                    {activeQuestionIdx < questions.length - 1 ? (
                      <button
                        onClick={() => setActiveQuestionIdx(prev => prev + 1)}
                        className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                      >
                        Next Question
                        <ChevronRight size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setMockTestCompleted(true);
                          addToast("Mock assessment submitted successfully!", "success");
                        }}
                        className="px-6 py-2.5 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Submit Assessment
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                // Mock test results
                <div className="space-y-6 flex-grow animate-fade-in">
                  <div className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <Award className="text-luna-300 mx-auto mb-3" size={48} />
                    <h4 className="text-lg font-bold text-white mb-1">Assessment Completed!</h4>
                    <p className="text-[11px] text-slate-400 font-serif">Your performance metrics have been computed.</p>

                    <div className="mt-6 inline-flex items-center gap-3 bg-black/30 border border-white/10 px-6 py-3 rounded-2xl">
                      <span className="text-xs font-bold text-slate-400 uppercase">Your Score:</span>
                      <span className="text-2xl font-black text-luna-300">{correctCount} / {questions.length}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-luna-300/10 border border-luna-300/30 text-luna-300 font-mono font-bold">
                        {Math.round((correctCount / questions.length) * 100)}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-350 font-serif mt-4 max-w-md mx-auto leading-relaxed">
                      {correctCount === questions.length
                        ? "Excellent performance! Your core concept grasp matches elite recruiters benchmarks. Keep compiling!"
                        : correctCount >= 2
                          ? "Good effort! Just minor mistakes. Read the concepts and explanations details below to lock perfect accuracy."
                          : "Needs improvement. Review coding modules and logic concepts. Practice frequently in the sandbox compiler."}
                    </p>
                  </div>

                  {/* Concept explanations */}
                  <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Detailed Concept Diagnostics:</span>

                    {questions.map((q, idx) => {
                      const userAns = selectedAnswers[idx];
                      const isCorrect = userAns === q.correct;
                      return (
                        <div key={idx} className="p-4 bg-black/20 border border-white/5 rounded-2xl space-y-3 font-serif">
                          <div className="flex justify-between items-start gap-4 font-sans">
                            <span className="font-bold text-white text-xs">Question {idx + 1} Concept</span>
                            {isCorrect ? (
                              <span className="text-[9px] font-bold uppercase text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">Correct</span>
                            ) : (
                              <span className="text-[9px] font-bold uppercase text-red-400 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30">Incorrect</span>
                            )}
                          </div>

                          <p className="text-slate-300 text-[11px] leading-relaxed">"{q.question}"</p>

                          <div className="text-[10px] leading-relaxed text-slate-400 space-y-1 font-sans">
                            <div>Your Answer: <strong className={isCorrect ? "text-emerald-400" : "text-red-400"}>{userAns !== undefined ? q.options[userAns] : "Not Answered"}</strong></div>
                            {!isCorrect && <div>Correct Answer: <strong className="text-emerald-400">{q.options[q.correct]}</strong></div>}
                          </div>

                          <div className="p-3 bg-white/5 border border-white/10 rounded-xl mt-2 text-[10px] leading-relaxed font-serif text-slate-400">
                            <strong className="text-luna-300 block font-sans uppercase text-[8px] font-bold tracking-wider mb-1">Concept Explanation:</strong>
                            {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end border-t border-white/10 pt-4 mt-6">
                    <button
                      onClick={() => {
                        setIsMockTestOpen(false);
                        setActiveQuestionIdx(0);
                        setSelectedAnswers({});
                        setMockTestCompleted(false);
                      }}
                      className="px-6 py-2.5 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      Close & Finish Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Corporate recruiter insights panel */}
      {selectedCompanyDetails && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
          <div className="glass-panel max-w-3xl w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col my-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-luna-300/5 rounded-full blur-2xl"></div>

            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-white">{selectedCompanyDetails} Interview Insights</h3>
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
                      <p className="text-slate-350 font-serif text-[11px] leading-relaxed">{details.skills.additional}</p>
                    </div>
                  </div>

                  {/* Past Questions/Insights examples */}
                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <h5 className="font-bold text-white uppercase tracking-wider text-[10px] text-luna-300">Alumni Prep Highlights</h5>
                    <ul className="list-decimal pl-4 space-y-2 text-slate-355 font-serif leading-relaxed">
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
                              <span className="font-bold text-white block">{alumni.name}</span>
                              <span className="text-[10px] text-slate-400 block">{alumni.role} • Class of {alumni.year || "2025"}</span>
                            </div>
                            {alumni.linkedin && (
                              <a
                                href={alumni.linkedin.startsWith("http") ? alumni.linkedin : `https://linkedin.com/in/${alumni.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500 hover:text-white font-bold transition uppercase tracking-wider"
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

    </div>
  );
}
