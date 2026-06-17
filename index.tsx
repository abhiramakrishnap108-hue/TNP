import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, Moon, Sun, Video, Play, X, ChevronLeft, ChevronRight,
  MapPin, Calendar, Award, TrendingUp, Briefcase, Users,
  CheckCircle, ArrowRight, Lock, Mail, Globe, Building2,
  GraduationCap, Info, Phone, Linkedin, Twitter, Sparkles,
  ExternalLink, LogIn, ChevronDown, Check, User, ShieldAlert,
  ArrowUpRight, BarChart3, PieChart, FileText, Settings, Sliders,
  Plus, Trash2, Edit2, UploadCloud, CheckCircle2, AlertCircle, RefreshCw, History as HistoryIcon,
  ListTodo, Activity, Download, FileSpreadsheet
} from "lucide-react";

// --- Custom Toast Component ---
interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

// --- Canvas Particle Background Component ---
interface Particle {
  x: number;
  y: number;
  homeX?: number;
  homeY?: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  speedMultiplier: number;
  isRing?: boolean;
  isSpark?: boolean;
  maxSize?: number;
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particleCount = 180;
    const colors = ["#54ACBF", "#A7EBF2", "#26658C"];

    const createParticle = (x: number, y: number, isRipple = false): Particle => {
      const size = Math.random() * 2 + 1; // 1px to 3px
      const color = colors[Math.floor(Math.random() * colors.length)];
      const baseAlpha = Math.random() * 0.3 + 0.15; // 0.15 to 0.45 opacity
      const angle = Math.random() * Math.PI * 2;
      const speed = isRipple ? Math.random() * 2.0 + 0.8 : (Math.random() * 0.9 + 0.5); // Faster drift speed for background dots

      return {
        x,
        y,
        homeX: isRipple ? undefined : x,
        homeY: isRipple ? undefined : y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color,
        alpha: baseAlpha,
        baseAlpha,
        speedMultiplier: Math.random() * 0.6 + 0.4,
        isSpark: isRipple,
      };
    };

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(
          createParticle(Math.random() * width, Math.random() * height)
        );
      }
    };

    initParticles();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    let lastMouseX = -1000;
    let lastMouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (lastMouseX === -1000) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }

      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Emit a cursor-movement ripple if cursor moved more than 15px
      if (dist > 15) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: 0,
          vy: 0,
          size: 2,
          maxSize: Math.random() * 20 + 15,
          isRing: true,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.8,
          baseAlpha: 0.8,
          speedMultiplier: 0
        });

        // Add 1-2 trailing spark particles floating away
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push(createParticle(e.clientX, e.clientY, true));
        }

        if (particlesRef.current.length > 350) {
          particlesRef.current = particlesRef.current.slice(particlesRef.current.length - 350);
        }

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      // Emit ripple particles on click
      for (let i = 0; i < 20; i++) {
        particlesRef.current.push(createParticle(clickX, clickY, true));
      }
      if (particlesRef.current.length > 350) {
        particlesRef.current = particlesRef.current.slice(particlesRef.current.length - 350);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    let lastScrollY = window.scrollY;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      const mouse = mouseRef.current;

      // Draw in reverse order so we can splice elements safely
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        if (p.isRing) {
          p.size += 0.9; // expand ring size
          p.alpha -= 0.018; // fade out ring

          if (p.alpha <= 0 || p.size >= (p.maxSize || 35)) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = p.size * 0.25;
          ctx.shadowColor = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.stroke();
          continue;
        }

        if (p.isSpark) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.97; // friction
          p.vy *= 0.97;
          p.alpha -= 0.012; // fade spark

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          continue;
        }

        // Drifting calm water background dot logic:
        if (p.homeY !== undefined && p.homeX !== undefined) {
          // Slow continuous drift
          p.homeX += p.vx;
          p.homeY += p.vy;

          // Scroll Parallax on original home position coordinates
          p.homeY += scrollDiff * 0.15 * p.speedMultiplier;

          // Vertical wrapping
          if (p.homeY < -10) {
            p.homeY = height + 10;
            p.homeX = Math.random() * width;
            p.x = p.homeX;
            p.y = p.homeY;
          } else if (p.homeY > height + 10) {
            p.homeY = -10;
            p.homeX = Math.random() * width;
            p.x = p.homeX;
            p.y = p.homeY;
          }

          // Horizontal wrapping
          if (p.homeX < -10) {
            p.homeX = width + 10;
            p.x = p.homeX;
          } else if (p.homeX > width + 10) {
            p.homeX = -10;
            p.x = p.homeX;
          }
        }

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pushRadius = 150;

        if (dist < pushRadius) {
          const force = (pushRadius - dist) / pushRadius;
          // Fluid push away from cursor to behave like ripples pushing objects
          const pushX = (dx / dist) * force * -4.5;
          const pushY = (dy / dist) * force * -4.5;
          p.x += pushX;
          p.y += pushY;
          p.alpha = Math.min(0.9, p.baseAlpha + force * 0.55); // hover glow
        } else {
          // Spring back to calm home coordinates
          if (p.homeX !== undefined && p.homeY !== undefined) {
            p.x += (p.homeX - p.x) * 0.08;
            p.y += (p.homeY - p.y) * 0.08;
          }
          p.alpha = p.alpha * 0.95 + p.baseAlpha * 0.05; // Decay to base opacity
        }

        // Render dot with glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] bg-transparent"
    />
  );
}

// --- Mock Database Interfaces ---
interface StudentRecord {
  name: string;
  rollNo: string;
  username: string;
  passwordKey: string;
  department: string;
  year: string;
  cgpa: number;
  creditsEarned: number;
  isEligible: boolean;
  phone: string;
  photo: string;
  achievements: string[];
  certifications: string[];
  internships: string[];
  appliedCompanies?: string[];
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
  isPlaced?: boolean;
  academicStatus?: "Active" | "On Hold" | "Graduated";
  placementReadiness?: "Fully Ready" | "Needs Preparation" | "Not Started";
  placementProgress?: "Seeking Internship" | "Internship Secured" | "Seeking Placement" | "Placed" | "Unplaced";
  applicationStatuses?: { [companyName: string]: "Applied" | "Shortlisted" | "Interview Scheduled" | "Offer Received" };
}

const initialStudents: StudentRecord[] = [
  // CSE
  { name: "Arjun Reddy", rollNo: "cs24b1001", username: "cs24b1001@nitpy.ac.in", passwordKey: "NITpy@cs24b1001", department: "CSE", year: "3rd Year", cgpa: 9.2, creditsEarned: 78, isEligible: true, phone: "+91 9481234567", photo: "", achievements: ["Winner, Smart India Hackathon 2025", "1st Place, Gyanith Coding Contest"], certifications: ["AWS Certified Developer", "Google Cloud Associate"], internships: ["Software Engineer Intern at Google"] },
  { name: "Sneha Sharma", rollNo: "cs24b1002", username: "cs24b1002@nitpy.ac.in", passwordKey: "NITpy@cs24b1002", department: "CSE", year: "3rd Year", cgpa: 8.9, creditsEarned: 78, isEligible: true, phone: "+91 9481234568", photo: "", achievements: ["Selected for GSoC 2025", "Runner Up, Inter-NIT Web Dev Hackathon"], certifications: ["Microsoft Azure Fundamentals"], internships: ["Summer Intern at Amazon"] },
  { name: "Kiran Kumar", rollNo: "cs24b1003", username: "cs24b1003@nitpy.ac.in", passwordKey: "NITpy@cs24b1003", department: "CSE", year: "3rd Year", cgpa: 7.8, creditsEarned: 74, isEligible: true, phone: "+91 9481234569", photo: "", achievements: ["Core Member, Coding Club", "Open Source Contributor to React"], certifications: ["Oracle Java SE Certified Associate"], internships: ["Frontend Intern at NexTurn"] },
  { name: "Priya Nair", rollNo: "cs24b1004", username: "cs24b1004@nitpy.ac.in", passwordKey: "NITpy@cs24b1004", department: "CSE", year: "3rd Year", cgpa: 9.5, creditsEarned: 82, isEligible: true, phone: "+91 9481234570", photo: "", achievements: ["Institute Rank 1 (CSE)", "Published Paper in IEEE GenAI Conference"], certifications: ["TensorFlow Developer Certificate"], internships: ["R&D Intern at Samsung Research"] },
  { name: "Vivek Menon", rollNo: "cs24b1005", username: "cs24b1005@nitpy.ac.in", passwordKey: "NITpy@cs24b1005", department: "CSE", year: "3rd Year", cgpa: 6.2, creditsEarned: 70, isEligible: false, phone: "+91 9481234571", photo: "", achievements: ["Co-founder, Esports Club NITPY"], certifications: ["Meta Front-End Developer Certificate"], internships: ["Web Developer at local startup"] },

  // Civil
  { name: "Ananya Gupta", rollNo: "ce24b2001", username: "ce24b2001@nitpy.ac.in", passwordKey: "NITpy@ce24b2001", department: "Civil", year: "3rd Year", cgpa: 8.5, creditsEarned: 76, isEligible: true, phone: "+91 9481234572", photo: "", achievements: ["Best Paper Award, Disaster Resilient Infra Workshop", "L&T Build India Scholar"], certifications: ["AutoCAD Professional Certification"], internships: ["Project Intern at L&T Construction"] },
  { name: "Rohit Verma", rollNo: "ce24b2002", username: "ce24b2002@nitpy.ac.in", passwordKey: "NITpy@ce24b2002", department: "Civil", year: "3rd Year", cgpa: 7.9, creditsEarned: 76, isEligible: true, phone: "+91 9481234573", photo: "", achievements: ["Design lead, Gyanith Civil Model Event"], certifications: ["Bentley STAAD.Pro V8i Certified"], internships: ["Site Engineer Intern at NHAI"] },
  { name: "Meera Iyer", rollNo: "ce24b2003", username: "ce24b2003@nitpy.ac.in", passwordKey: "NITpy@ce24b2003", department: "Civil", year: "3rd Year", cgpa: 9.1, creditsEarned: 78, isEligible: true, phone: "+91 9481234574", photo: "", achievements: ["Recipient of OP Jindal Scholarship", "First Rank in Geotechnical Survey"], certifications: ["ArcGIS Associate Developer"], internships: ["Research Intern at IIT Madras"] },
  { name: "Aditya Singh", rollNo: "ce24b2004", username: "ce24b2004@nitpy.ac.in", passwordKey: "NITpy@ce24b2004", department: "Civil", year: "3rd Year", cgpa: 6.8, creditsEarned: 72, isEligible: true, phone: "+91 9481234575", photo: "", achievements: ["Sports Secretary, NITPY Student Council"], certifications: ["REVIT Structure Certification"], internships: ["Surveying Intern at Karaikal Port"] },
  { name: "Kavya Ramesh", rollNo: "ce24b2005", username: "ce24b2005@nitpy.ac.in", passwordKey: "NITpy@ce24b2005", department: "Civil", year: "3rd Year", cgpa: 8.0, creditsEarned: 76, isEligible: true, phone: "+91 9481234576", photo: "", achievements: ["Winner, National Concrete Mix Design Competition"], certifications: ["Project Management Professional (PMP) Basics"], internships: ["Quality Assurance Intern at Adani Infra"] },

  // Mechanical
  { name: "Sandeep Patil", rollNo: "me24b3001", username: "me24b3001@nitpy.ac.in", passwordKey: "NITpy@me24b3001", department: "Mechanical", year: "3rd Year", cgpa: 8.7, creditsEarned: 78, isEligible: true, phone: "+91 9481234577", photo: "", achievements: ["Designed EV Battery Enclosure for OGOENERGY Project", "Winner, Gyanith CAD Modeler Event"], certifications: ["SolidWorks Professional CSWP"], internships: ["EV Battery Thermal Intern at OGOENERGY"] },
  { name: "Divya Joshi", rollNo: "me24b3002", username: "me24b3002@nitpy.ac.in", passwordKey: "NITpy@me24b3002", department: "Mechanical", year: "3rd Year", cgpa: 9.2, creditsEarned: 80, isEligible: true, phone: "+91 9481234578", photo: "", achievements: ["Best Student Innovator Award", "Published CFD Thermal Simulation Study"], certifications: ["ANSYS Fluent Professional"], internships: ["CFD Analyst Intern at GE Power"] },
  { name: "Harish Rao", rollNo: "me24b3003", username: "me24b3003@nitpy.ac.in", passwordKey: "NITpy@me24b3003", department: "Mechanical", year: "3rd Year", cgpa: 7.5, creditsEarned: 74, isEligible: true, phone: "+91 9481234579", photo: "", achievements: ["Team Captain, NITPY SAE Aero Design Team"], certifications: ["Fusion 360 Certified User"], internships: ["Production Trainee at Maruti Suzuki"] },
  { name: "Pooja Deshmukh", rollNo: "me24b3004", username: "me24b3004@nitpy.ac.in", passwordKey: "NITpy@me24b3004", department: "Mechanical", year: "3rd Year", cgpa: 8.1, creditsEarned: 76, isEligible: true, phone: "+91 9481234580", photo: "", achievements: ["Winner, Inter-College Robotics Championship"], certifications: ["Lean Six Sigma Green Belt"], internships: ["Maintenance Intern at Tata Steel"] },
  { name: "Ajay Kulkarni", rollNo: "me24b3005", username: "me24b3005@nitpy.ac.in", passwordKey: "NITpy@me24b3005", department: "Mechanical", year: "3rd Year", cgpa: 6.4, creditsEarned: 70, isEligible: false, phone: "+91 9481234581", photo: "", achievements: ["Lead Guitarist, NITPY Music Club"], certifications: ["CNC Programming Certificate"], internships: ["Manufacturing Intern at Bosch"] },

  // ECE
  { name: "Neha Pillai", rollNo: "ec24b4001", username: "ec24b4001@nitpy.ac.in", passwordKey: "NITpy@ec24b4001", department: "ECE", year: "3rd Year", cgpa: 8.8, creditsEarned: 78, isEligible: true, phone: "+91 9481234582", photo: "", achievements: ["Designed FPGA SoC Decoders for MathWorks Workshop", "Winner, Gyanith Embedded Systems Hackathon"], certifications: ["MATLAB & Simulink Professional"], internships: ["VLSI Design Intern at Intel"] },
  { name: "Ramesh Gowda", rollNo: "ec24b4002", username: "ec24b4002@nitpy.ac.in", passwordKey: "NITpy@ec24b4002", department: "ECE", year: "3rd Year", cgpa: 7.9, creditsEarned: 76, isEligible: true, phone: "+91 9481234583", photo: "", achievements: ["Developed Cognitive Radio Testbed Prototype", "Core Member, Space Club ANTRIX"], certifications: ["CCNA Routing & Switching"], internships: ["Networking Trainee at Cisco"] },
  { name: "Shreya Mohan", rollNo: "ec24b4003", username: "ec24b4003@nitpy.ac.in", passwordKey: "NITpy@ec24b4003", department: "ECE", year: "3rd Year", cgpa: 9.3, creditsEarned: 80, isEligible: true, phone: "+91 9481234584", photo: "", achievements: ["Best Paper in VLSI Architecture", "Winner, Samsung Smart IoT Contest"], certifications: ["Verilog HDL Developer Certificate"], internships: ["Silicon Validation Intern at Qualcomm"] },
  { name: "Varun Krishna", rollNo: "ec24b4004", username: "ec24b4004@nitpy.ac.in", passwordKey: "NITpy@ec24b4004", department: "ECE", year: "3rd Year", cgpa: 8.2, creditsEarned: 78, isEligible: true, phone: "+91 9481234585", photo: "", achievements: ["Developed 6G Wireless Signal Emulator"], certifications: ["RTOS Application Developer Certificate"], internships: ["Embedded Firmware Intern at PHYTEC"] },
  { name: "Aditi Rao", rollNo: "ec24b4005", username: "ec24b4005@nitpy.ac.in", passwordKey: "NITpy@ec24b4005", department: "ECE", year: "3rd Year", cgpa: 6.9, creditsEarned: 72, isEligible: true, phone: "+91 9481234586", photo: "", achievements: ["Cultural Secretary, Le Ciel Fest Coordinator"], certifications: ["Digital Signal Processing Basics"], internships: ["Telecom Intern at BSNL"] },

  // EEE
  { name: "Manish Yadav", rollNo: "ee24b5001", username: "ee24b5001@nitpy.ac.in", passwordKey: "NITpy@ee24b5001", department: "EEE", year: "3rd Year", cgpa: 8.6, creditsEarned: 78, isEligible: true, phone: "+91 9481234587", photo: "", achievements: ["Designed EV Motor Controller Board", "Winner, Gyanith Power Electronics Contest"], certifications: ["Smart Grid Architecture Fundamentals"], internships: ["Electrical Intern at ABB Global"] },
  { name: "Shruti Malhotra", rollNo: "ee24b5002", username: "ee24b5002@nitpy.ac.in", passwordKey: "NITpy@ee24b5002", department: "EEE", year: "3rd Year", cgpa: 9.1, creditsEarned: 80, isEligible: true, phone: "+91 9481234588", photo: "", achievements: ["Winner, National Solar Energy Design Challenge"], certifications: ["PLC Programming Certified Professional"], internships: ["R&D Trainee at OGOENERGY"] },
  { name: "Akash Jain", rollNo: "ee24b5003", username: "ee24b5003@nitpy.ac.in", passwordKey: "NITpy@ee24b5003", department: "EEE", year: "3rd Year", cgpa: 7.6, creditsEarned: 74, isEligible: true, phone: "+91 9481234589", photo: "", achievements: ["Designed Substation Monitoring SCADA Dashboard"], certifications: ["LabVIEW Certified Associate Developer"], internships: ["Substation Trainee at NTPC"] },
  { name: "Bhavana Shetty", rollNo: "ee24b5004", username: "ee24b5004@nitpy.ac.in", passwordKey: "NITpy@ee24b5004", department: "EEE", year: "3rd Year", cgpa: 8.3, creditsEarned: 78, isEligible: true, phone: "+91 9481234590", photo: "", achievements: ["Designed Hybrid Wind-Solar Power Grid for Campus"], certifications: ["ETAP Electrical Power Systems Analysis"], internships: ["Grid Planning Intern at PowerGrid"] },
  { name: "Rajesh Nair", rollNo: "ee24b5005", username: "ee24b5005@nitpy.ac.in", passwordKey: "NITpy@ee24b5005", department: "EEE", year: "3rd Year", cgpa: 6.5, creditsEarned: 72, isEligible: true, phone: "+91 9481234591", photo: "", achievements: ["President, Chess Club NITPY"], certifications: ["High Voltage Safety Certificate"], internships: ["Industrial Automation Trainee at Siemens"] }
];

const initialCompanies = [
  { name: "Google", sector: "IT / Software", logo: "G", hires: 4, maxPackage: "16.0 LPA", avgPackage: "13.0 LPA", color: "bg-red-500/10 border-red-500/30 text-red-400" },
  { name: "Amazon", sector: "IT / Software", logo: "A", hires: 8, maxPackage: "15.0 LPA", avgPackage: "12.0 LPA", color: "bg-orange-500/10 border-orange-500/30 text-orange-400" },
  { name: "Oracle", sector: "IT / Software", logo: "O", hires: 12, maxPackage: "14.0 LPA", avgPackage: "11.5 LPA", color: "bg-red-600/10 border-red-600/30 text-red-500" },
  { name: "L&T Construction", sector: "Core Engineering", logo: "L&T", hires: 15, maxPackage: "10.0 LPA", avgPackage: "8.0 LPA", color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" },
  { name: "Deloitte", sector: "Consulting", logo: "D", hires: 18, maxPackage: "12.0 LPA", avgPackage: "9.6 LPA", color: "bg-green-500/10 border-green-500/30 text-green-400" },
  { name: "TCS", sector: "IT / Software", logo: "TCS", hires: 25, maxPackage: "8.5 LPA", avgPackage: "6.2 LPA", color: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
  { name: "Intel", sector: "Core Engineering", logo: "I", hires: 5, maxPackage: "23.0 LPA", avgPackage: "9.63 LPA", color: "bg-blue-600/10 border-blue-600/30 text-blue-400" },
  { name: "ABB", sector: "Core Engineering", logo: "ABB", hires: 6, maxPackage: "14.5 LPA", avgPackage: "9.8 LPA", color: "bg-red-500/10 border-red-500/30 text-red-400" },
  { name: "Samsung", sector: "Core Engineering", logo: "S", hires: 7, maxPackage: "16.0 LPA", avgPackage: "13.0 LPA", color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" },
  { name: "Infosys", sector: "IT / Software", logo: "INF", hires: 22, maxPackage: "9.0 LPA", avgPackage: "6.0 LPA", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" }
];

interface PlacedStudent {
  name: string;
  linkedin: string;
  role: string;
  year?: string;
}

interface CompanyDetailInfo {
  overview: string;
  selectionProcess: {
    rounds: string[];
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

const COMPANY_DETAILS: Record<string, CompanyDetailInfo> = {
  Google: {
    overview: "Google is a global technology pioneer specializing in search engine technology, online advertising, cloud computing, computer software, quantum computing, and artificial intelligence. Google's engineering department is legendary for its focus on scalability, performance, and clean algorithmic code.",
    selectionProcess: {
      rounds: [
        "Online Assessment: 2 Coding questions (90 mins) on HackerEarth",
        "Technical Interview Round 1: Coding (DSA, Optimization, Time Complexity)",
        "Technical Interview Round 2: Advanced coding & structural design",
        "System Design Interview (for senior/experienced roles or specific domains)",
        "Googleyness & Leadership: Situational judgment, behavior, and cultural fit"
      ],
      criteria: "Strong analytical skills, knowledge of computer science fundamentals, ability to communicate thought processes clearly, and collaborative spirit."
    },
    interviewInsights: {
      questionTypes: ["Graph theory", "Dynamic programming", "Recursion & Backtracking", "Tries & Segment Trees", "System Design (Scalability)"],
      leetcodeFocus: "Extremely High (LeetCode Medium to Hard, heavy focus on optimized time/space complexity)",
      examples: [
        "Find the shortest path in a weighted grid with obstacles that can be removed K times.",
        "Implement a custom thread-safe LRU cache with O(1) operations.",
        "Given a stream of words, find the top K most frequent elements using a trie and min-heap."
      ]
    },
    skills: {
      core: ["Data Structures & Algorithms", "C++ / Java / Go / Python", "System Design", "Operating Systems & Concurrency"],
      additional: "Contributions to Open Source projects, knowledge of Google Cloud Platform (GCP) or distributed databases."
    }
  },
  Amazon: {
    overview: "Amazon is a multinational technology giant focused on e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence. Amazon's culture is driven by its 16 Leadership Principles, which form the bedrock of their interview evaluation process.",
    selectionProcess: {
      rounds: [
        "Online Assessment: 2 Coding questions (70 mins) + 1 Work Style Assessment (20 mins)",
        "Technical Interview Round 1: DSA Coding + 2 Leadership Principle questions",
        "Technical Interview Round 2: Object-Oriented Design (OOD) + Leadership Principles",
        "Bar Raiser Round: High-intensity technical + behavioral evaluation by an independent interviewer"
      ],
      criteria: "Demonstrated alignment with Leadership Principles (especially Customer Obsession and Bias for Action), solid understanding of OOD, and efficient DSA coding."
    },
    interviewInsights: {
      questionTypes: ["Trees & Graphs", "Dynamic Programming", "System & Object-Oriented Design (OOD)", "STAR-method behavioral questions"],
      leetcodeFocus: "High (LeetCode Medium, emphasis on clean, readable code and object-oriented design patterns)",
      examples: [
        "Design a parking lot system showing all classes, methods, and relation patterns (OOD).",
        "Find the lowest common ancestor in a binary tree.",
        "Behavioral: Tell me about a time you had a conflict with a peer. How did you resolve it and what was the outcome?"
      ]
    },
    skills: {
      core: ["Data Structures & Algorithms", "Object-Oriented Programming (OOP)", "System Design", "Java / Python / C++"],
      additional: "AWS Practitioner/Developer Certification, experience with microservices architectures, and Agile project delivery."
    }
  },
  Oracle: {
    overview: "Oracle Corporation is a premier American multinational computer technology corporation, best known for its database software and technology, cloud engineered systems, and enterprise software products.",
    selectionProcess: {
      rounds: [
        "Aptitude & Technical MCQ: Quant, Verbal, DBMS, OS, and Output prediction (120 mins)",
        "Technical Interview Round 1: Core CS subjects (DBMS, SQL Joins, OS, Networks) + 1 Coding question",
        "Technical Interview Round 2: System design, database internals, and resume review",
        "HR / General Managerial Round: Discussion on goals, relocation, and career roadmap"
      ],
      criteria: "Deep expertise in database systems (DBMS), relational schemas, normal forms, transaction management (ACID properties), and basic coding competence."
    },
    interviewInsights: {
      questionTypes: ["Database Internals (B-trees, Indexing)", "SQL Query Optimization (Joins, Subqueries)", "Object-Oriented Design", "Operating Systems (Virtual memory, semaphores)"],
      leetcodeFocus: "Moderate (LeetCode Easy to Medium, high focus on correctness and core CS knowledge over exotic algorithms)",
      examples: [
        "Write a SQL query to find the Nth highest salary of an employee using a correlated subquery.",
        "Explain transaction isolation levels and how dirty reads are prevented.",
        "Implement a function to detect and remove a loop in a singly linked list."
      ]
    },
    skills: {
      core: ["Database Management Systems (DBMS)", "SQL & PL/SQL", "Object-Oriented Programming", "Operating Systems", "Java / C++"],
      additional: "Experience with cloud platforms, RESTful APIs, or Oracle DB certifications."
    }
  },
  "L&T Construction": {
    overview: "L&T Construction is the construction division of Larsen & Toubro, India's largest technology, engineering, construction, and manufacturing conglomerate. They execute mega infrastructure, power, defense, and smart city projects across the globe.",
    selectionProcess: {
      rounds: [
        "Cognitive & Technical Assessment: Quantitative aptitude, logical reasoning, and core civil/mechanical/electrical engineering MCQs",
        "Technical Interview: Detailed viva on core engineering subjects, laboratory tests, and final-year projects",
        "HR & Fitment Interview: Discussion on site job readiness, location flexibility, and communication skills"
      ],
      criteria: "Solid grasp of fundamental engineering principles (concrete design, fluid mechanics, power grids), physical lab testing knowledge, and willingness to work on-site."
    },
    interviewInsights: {
      questionTypes: ["Structural Design (RC & Steel)", "Project Management / Estimation", "Fluid Mechanics & Soil Mechanics", "Behavioral: Relocation & Site management"],
      leetcodeFocus: "None (Zero LeetCode. Evaluation is 100% core civil/mechanical/electrical engineering concepts and aptitude)",
      examples: [
        "Draw the shear force and bending moment diagrams for a cantilever beam under uniformly distributed load.",
        "What is the difference between compaction and consolidation of soil?",
        "Explain the active and passive earth pressure coefficients and their significance."
      ]
    },
    skills: {
      core: ["Civil/Mechanical/Electrical Core Fundamentals", "Engineering Drawing (AutoCAD / STAAD.Pro / Revit)", "Project Planning & Estimation", "Structural Analysis"],
      additional: "L&T Build India Scholarship qualification, project management basics (PMP/CAPM), or site internship experience."
    }
  },
  Deloitte: {
    overview: "Deloitte is one of the 'Big Four' global accounting and professional services firms. They provide consulting, risk advisory, tax, and audit services to most of the Fortune 500 companies, helping them navigate business and technological transitions.",
    selectionProcess: {
      rounds: [
        "Deloitte Online Assessment: Aptitude, English proficiency, logical reasoning, and basic coding/CS MCQs",
        "Group Discussion / Case Study Round: Solving a real-world business case in a group to assess collaboration and analytical skills",
        "Technical & Managerial Interview: Discussion on projects, technology awareness, and problem-solving scenarios",
        "Partner Interview / HR Round: Cultural alignment, interest in consulting, and long-term career planning"
      ],
      criteria: "Strong verbal and written communication, structured thinking (using frameworks like SWOT/MECE), basic technology awareness, and leadership potential."
    },
    interviewInsights: {
      questionTypes: ["Business Case Studies", "SQL & Database design", "Software Development Life Cycle (SDLC)", "Behavioral: Client interaction and conflict resolution"],
      leetcodeFocus: "Low (LeetCode Easy level code. Greater emphasis on logical thinking, database design, and structured problem-solving)",
      examples: [
        "Case Study: A retail client wants to transition their offline store to an e-commerce platform. How would you structure their technical roadmap?",
        "Write a SQL query to extract customers who made more than three transactions in the last month.",
        "How do you handle a situation where a client requests a feature that is out of the project scope?"
      ]
    },
    skills: {
      core: ["Data Analysis & SQL", "Software Engineering Concepts (Agile/Scrum)", "System Analysis", "Structured Communication"],
      additional: "AWS / Azure Cloud Practitioner Certification, Business Analysis tools (Tableau, PowerBI), or MBA-level business concept basics."
    }
  },
  TCS: {
    overview: "Tata Consultancy Services (TCS) is an Indian multinational information technology services and consulting company. It is one of the largest IT service brands globally, executing digital transformation drives for enterprises worldwide.",
    selectionProcess: {
      rounds: [
        "TCS National Qualifier Test (NQT): Numerical Ability, Verbal Ability, Reasoning Ability, and Hands-on Coding (2 questions)",
        "Technical Interview: Discussion on C/Java/Python, DBMS, HTML/CSS/JS, and academic project architecture",
        "Managerial Interview: Discussion on project management, team leading experiences, and situational questions",
        "HR Interview: Standard document verification, shifts discussion, and onboarding guidelines"
      ],
      criteria: "Good programming fundamentals in at least one object-oriented language, clear understanding of database concepts, and professional communication."
    },
    interviewInsights: {
      questionTypes: ["Basic Programming (Strings, Arrays)", "Object-Oriented Programming (OOP) concepts", "Database Joins & Normalization", "Web Development basics"],
      leetcodeFocus: "Low to Moderate (LeetCode Easy to early Medium. Standard textbook algorithms like binary search and sorting)",
      examples: [
        "Write a program to check if two strings are anagrams of each other.",
        "Explain polymorphism and method overloading vs method overriding with code snippets.",
        "What is normalization in databases? Explain 1NF, 2NF, and 3NF with examples."
      ]
    },
    skills: {
      core: ["Programming in C / Java / Python", "Database Management Systems (SQL)", "HTML, CSS & JavaScript", "Data Structures"],
      additional: "TCS CodeVita rank, certifications in Java/Python, or web developer portfolios."
    }
  },
  Intel: {
    overview: "Intel Corporation is a global semiconductor chip design and manufacturing leader. Intel develops microprocessors, chipsets, GPUs, and network hardware, merging hardware engineering with software systems (compilers, firmware, driver code).",
    selectionProcess: {
      rounds: [
        "Online Technical Test: MCQs on Digital Electronics, Computer Architecture, C programming, and basic DSA (90 mins)",
        "Technical Interview Round 1: Core hardware concepts (Digital Design, Verilog, Microprocessor architectures)",
        "Technical Interview Round 2: Systems programming in C/C++, assembly, operating systems, and memory hierarchy",
        "HR Round: Discussion on goals, research interest, and team alignment"
      ],
      criteria: "In-depth understanding of computer architecture, digital circuit design, low-level programming (pointers, memory management), and hardware-software interfaces."
    },
    interviewInsights: {
      questionTypes: ["Digital logic (K-maps, Flip-flops, FSM)", "Computer Architecture (Pipeline, Cache mapping, Virtual Memory)", "Embedded C / Pointers / Bit manipulation", "Verilog coding"],
      leetcodeFocus: "Moderate (Focus is on bitwise programming, memory-constrained environments, and systems code over abstract LeetCode graphs)",
      examples: [
        "Write a C function to count the number of set bits in an integer without using library functions.",
        "Explain cache coherence and the MESI protocol in multi-core systems.",
        "Design a finite state machine (FSM) to detect a sequence '1011' in a bitstream."
      ]
    },
    skills: {
      core: ["Computer Architecture", "Digital Electronics & RTL design", "Verilog / VHDL", "C / C++ Programming", "Operating Systems & RTOS"],
      additional: "Experience with FPGA boards, hardware hacking projects, or Embedded Systems certifications."
    }
  },
  "Goldman Sachs": {
    overview: "Goldman Sachs is a leading global investment banking, securities, and investment management firm. Their engineering division builds high-frequency trading platforms, risk analysis engines, and large-scale financial software.",
    selectionProcess: {
      rounds: [
        "Online Cognitive & Technical Test: Advanced Math, Probability, DSA, and CS Core MCQs + 2 Coding questions (135 mins)",
        "Technical Interview Round 1: Heavy algorithmic coding + Big-O optimizations",
        "Technical Interview Round 2: Probability, statistics, puzzle-solving, and system scale",
        "Technical Interview Round 3: Multithreading, concurrency patterns (especially in Java/C++), and system design",
        "HR / Culture Fitment Round: Assessment of integrity, high-pressure handling, and collaboration"
      ],
      criteria: "High mathematical aptitude, expert level problem solving in algorithms, deep understanding of multithreading, concurrent data structures, and memory safety."
    },
    interviewInsights: {
      questionTypes: ["Probability & Combinatorics", "Graph algorithms & Dynamic Programming", "Multithreading & Concurrency", "Mathematical Puzzles"],
      leetcodeFocus: "Extremely High (LeetCode Medium to Hard, heavy focus on combinatorial mathematics and edge-case testing)",
      examples: [
        "Three points are selected randomly on a circle. What is the probability that they lie in the same semicircle?",
        "Implement a highly concurrent thread-safe queue where multiple producers and consumers operate without deadlocks.",
        "Given an array of integers, find the length of the longest subarray with a sum equal to K."
      ]
    },
    skills: {
      core: ["Data Structures & Algorithms", "Mathematics & Probability", "Concurrency & Multithreading", "Java / C++"],
      additional: "Participation in competitive programming (Codeforces, Codechef), knowledge of financial markets, or high-performance computing experience."
    }
  },
  ABB: {
    overview: "ABB is a pioneering technology leader in electrification products, robotics and motion, industrial automation, and power grids, serving customers in utilities, industry, transport, and infrastructure globally.",
    selectionProcess: {
      rounds: [
        "Technical & General Aptitude Test: MCQs on Electrical Engineering, Control Systems, basic C programming, and logical reasoning",
        "Technical Interview Round 1: In-depth questions on Power Electronics, Motor Drives, Control Systems, and Microcontrollers",
        "Technical Interview Round 2: Discussion on PLC programming, SCADA, industrial communication protocols, and final projects",
        "HR / Fitment Interview: Discussion on career aspirations, willingness to travel, and communication skills"
      ],
      criteria: "Strong foundation in electrical machines, control theory, basic embedded systems, and industrial automation protocols."
    },
    interviewInsights: {
      questionTypes: ["Control Systems (Transfer functions, stability)", "Electrical Machines & Drives", "PLC programming & SCADA basics", "Embedded C & microcontrollers"],
      leetcodeFocus: "None (Evaluation is tailored to core electrical, electronics, and industrial automation concepts, with basic C programming)",
      examples: [
        "Explain the working principle of a variable frequency drive (VFD) for AC motor speed control.",
        "How do you determine the stability of a closed-loop system using Routh-Hurwitz criteria?",
        "Write a basic ladder logic diagram for a starting and stopping sequence of a conveyor motor."
      ]
    },
    skills: {
      core: ["Electrical Machines & Power Electronics", "Control Systems", "Embedded C & Microcontrollers", "PLC & SCADA"],
      additional: "Certifications in Industrial Automation, MATLAB/Simulink proficiency, or experience with Arduino/Raspberry Pi hardware."
    }
  },
  Capgemini: {
    overview: "Capgemini is a global leader in partnering with companies to transform and manage their business by harnessing the power of technology. The company is guided by the conviction that the value of technology comes from and through people.",
    selectionProcess: {
      rounds: [
        "Capgemini Online Assessment: Pseudocode debugging, English communication, game-based cognitive aptitude test",
        "Technical Interview: Walkthrough of resume, database fundamentals (SQL), programming basics, and OOP concepts",
        "HR Interview: Document review, shifts flexibility, and standard HR questions"
      ],
      criteria: "Logical mindset tested through game assessments and pseudocode, core coding literacy, and strong verbal communication."
    },
    interviewInsights: {
      questionTypes: ["Pseudocode analysis & debugging", "Object-Oriented Programming (OOP) definitions", "SQL queries (Group By, Joins)", "Core Java/Python basics"],
      leetcodeFocus: "Low (Focus on code readability, syntax correctness, and ability to debug pseudocode within tight timelines)",
      examples: [
        "Given a pseudocode block with nested loops and bitwise operations, predict the output.",
        "What is abstract class vs interface in Java? When would you use which?",
        "Write a SQL query to find the department name and count of employees in each department."
      ]
    },
    skills: {
      core: ["Core Java / Python / C#", "Web Development basics (HTML/CSS/JS)", "SQL Databases", "Logical & Game Aptitude"],
      additional: "Cloud foundations (AWS/Azure/GCP), agile framework awareness, or certifications in programming languages."
    }
  },
  Samsung: {
    overview: "Samsung Electronics is a global technology leader in consumer electronics, mobile communications, IT solutions, and semiconductor memory products. Samsung's R&D centers build operating system layers, custom firmware, camera algorithms, and AI solutions.",
    selectionProcess: {
      rounds: [
        "Samsung Global Software Competency Test (GSAT): A single 3-hour coding challenge where all standard libraries (STL) are allowed, but optimization and edge cases are highly scrutinized",
        "Technical Interview Round 1: DSA code review, OS internals, virtual memory, concurrency, and thread safety",
        "Technical Interview Round 2: System design, networking, and deep dive into academic projects",
        "HR Interview: Standard behavioral questions, career alignment, and feedback"
      ],
      criteria: "Outstanding problem-solving skills, passing the strict GSAT coding test (which requires passing all test cases), and strong knowledge of systems programming."
    },
    interviewInsights: {
      questionTypes: ["Advanced Algorithms (Graph traversal, shortest path, dynamic programming, backtracking)", "Operating System Internals (Paging, Threading)", "C/C++ Memory Management (Pointers, malloc internals)"],
      leetcodeFocus: "High (GSAT requires solving a LeetCode Hard level backtracking/graph problem with custom optimization)",
      examples: [
        "GSAT Mock: Find the maximum gold collection pathway in a 3D cavern with teleportation gates under a time constraint.",
        "Explain memory leakage in C++ and how smart pointers help prevent it.",
        "How does the OS manage pages? Explain the page fault handler routine."
      ]
    },
    skills: {
      core: ["Advanced DSA (Graphs, Backtracking)", "C / C++ Programming", "Operating Systems", "Computer Networks & Concurrency"],
      additional: "Samsung Prism project participation, competitive programming profile, or experience with low-level systems programming."
    }
  },
  Infosys: {
    overview: "Infosys is a global leader in next-generation digital services and consulting. They enable clients in more than 50 countries to navigate their digital transformation, driving innovation through cloud, AI, and agile engineering.",
    selectionProcess: {
      rounds: [
        "Online Recruitment Test (via InfyTQ or Standard Drive): Logical reasoning, mathematical aptitude, and 2 hands-on coding questions",
        "Technical Interview: Questions on OOPs, data structures, SQL queries, web development, and final year projects",
        "HR Interview: General discussions on communication skills, flexible shifts, and orientation"
      ],
      criteria: "Clear conceptual understanding of OOPs, database relational design, standard data structures, and fluent communication."
    },
    interviewInsights: {
      questionTypes: ["Object-Oriented Programming (OOP) principles", "SQL queries (Joins, Indexing)", "Basic DSA (Arrays, Strings, Linked list)", "Web basics & Project walk-through"],
      leetcodeFocus: "Low to Moderate (LeetCode Easy to early Medium. Coding focuses on string manipulations, array search, and standard sorting)",
      examples: [
        "Write a program to reverse a string word by word (e.g., 'hello world' -> 'world hello').",
        "What is inheritance? Explain multiple inheritance and how it is handled in Java (via interfaces) vs C++.",
        "Write a SQL query to join two tables and filter results based on a date condition."
      ]
    },
    skills: {
      core: ["Java / Python / .NET", "SQL Databases & DBMS", "Data Structures & Algorithms", "HTML, CSS, JS / React"],
      additional: "HackWithInfy participation, certifications in cloud/data science, or active github projects."
    }
  }
};

const MOCK_PLACED_STUDENTS: Record<string, PlacedStudent[]> = {
  Google: [
    { name: "Arjun Reddy", linkedin: "https://linkedin.com/in/arjun-reddy-nitpy", role: "Software Engineer", year: "2026" },
    { name: "Priya Patel", linkedin: "https://linkedin.com/in/priya-patel-nitpy", role: "Site Reliability Engineer", year: "2025" }
  ],
  Amazon: [
    { name: "Sneha Sharma", linkedin: "https://linkedin.com/in/sneha-sharma-nitpy", role: "Software Development Engineer", year: "2026" },
    { name: "Vikranth Rao", linkedin: "https://linkedin.com/in/vikranth-rao-nitpy", role: "Support Engineer", year: "2025" }
  ],
  Oracle: [
    { name: "Kiran Kumar", linkedin: "https://linkedin.com/in/kiran-kumar-nitpy", role: "Member Technical Staff", year: "2026" },
    { name: "Ananya Sen", linkedin: "https://linkedin.com/in/ananya-sen-nitpy", role: "Cloud Engineer", year: "2025" }
  ],
  "L&T Construction": [
    { name: "Kavya Ramesh", linkedin: "https://linkedin.com/in/kavya-ramesh-nitpy", role: "Graduate Engineer Trainee (Civil)", year: "2026" },
    { name: "Harish Rao", linkedin: "https://linkedin.com/in/harish-rao-nitpy", role: "Planning Engineer (Mech)", year: "2025" }
  ],
  Deloitte: [
    { name: "Pooja Deshmukh", linkedin: "https://linkedin.com/in/pooja-deshmukh-nitpy", role: "Business Technology Analyst", year: "2026" },
    { name: "Manish Yadav", linkedin: "https://linkedin.com/in/manish-yadav-nitpy", role: "Technology Consultant", year: "2025" }
  ],
  TCS: [
    { name: "Bhavana Shetty", linkedin: "https://linkedin.com/in/bhavana-shetty-nitpy", role: "Systems Engineer", year: "2026" },
    { name: "Rajesh Nair", linkedin: "https://linkedin.com/in/rajesh-nair-nitpy", role: "Assistant System Engineer", year: "2025" }
  ],
  Intel: [
    { name: "Neha Pillai", linkedin: "https://linkedin.com/in/neha-pillai-nitpy", role: "Silicon Validation Engineer", year: "2026" },
    { name: "Varun Krishna", linkedin: "https://linkedin.com/in/varun-krishna-nitpy", role: "Firmware Engineer", year: "2025" }
  ],
  ABB: [
    { name: "Akash Jain", linkedin: "https://linkedin.com/in/akash-jain-nitpy", role: "Graduate Engineer Trainee (Electrical)", year: "2026" }
  ],
  Samsung: [
    { name: "Divya Joshi", linkedin: "https://linkedin.com/in/divya-joshi-nitpy", role: "R&D Engineer", year: "2026" }
  ],
  Infosys: [
    { name: "Sandeep Patil", linkedin: "https://linkedin.com/in/sandeep-patil-nitpy", role: "Systems Engineer Specialist", year: "2025" }
  ]
};

interface PlacementEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  googleFormUrl: string;
  poster: string;
}

const initialEvents: PlacementEvent[] = [
  {
    id: 1,
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

interface EventLogEntry {
  id: number;
  eventTitle: string;
  actionType: "Add" | "Edit" | "Delete";
  changedBy: string;
  timestamp: string;
  details: string;
}

const initialEventLogs: EventLogEntry[] = [
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

interface PRRecord {
  id: number;
  name: string;
  department: string;
  email: string;
  phone: string;
  role: string;
  linkedin?: string;
}

const initialPrs: PRRecord[] = [
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

interface EditLogEntry {
  id: number;
  companyName: string;
  actionType: "Add" | "Edit" | "Delete" | "Soft Delete" | "Restore";
  changedBy: string;
  timestamp: string;
  details: string;
}


// --- Mentorship & Tools Database ---
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

const INTERVIEW_QUESTIONS = [
  "Tell me about yourself, your academic interests, and why you chose your engineering field.",
  "Describe a complex technical problem you encountered during a project. How did you diagnose and solve it?",
  "How do you handle working in a multidisciplinary team when conflicting opinions arise on system design?",
  "What are your long-term career goals, and how does joining our organization fit into those plans?"
];

// --- Main App Component ---
function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<"student" | "pr" | "departmental">("student");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRoleState, setUserRoleState] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Forgot password OTP flow states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<number>(0); // 0: Email, 1: OTP, 2: Reset
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [enteredOtp, setEnteredOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [forgotRole, setForgotRole] = useState<"student" | "pr" | "departmental">("student");
  const [forgotUserEmail, setForgotUserEmail] = useState<string>("");

  // Lifted databases to React state
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    return initialStudents.map(s => {
      const placed = s.rollNo === "cs24b1001" || s.rollNo === "cs24b1002" || s.rollNo === "ce24b2001";
      return {
        ...s,
        appliedCompanies: [],
        resumeData: {
          summary: "Motivated student from NIT Puducherry seeking internship opportunities.",
          skills: "React, JavaScript, TypeScript, CSS, Git",
          experience: "Academic Projects & Labs",
          projects: "Placement Portal Development"
        },
        uploadedFiles: {
          resumeName: "",
          transcriptName: "",
          certName: ""
        },
        isPlaced: placed,
        academicStatus: "Active",
        placementReadiness: s.cgpa >= 8.0 ? "Fully Ready" : "Needs Preparation",
        placementProgress: placed ? "Placed" : "Seeking Placement",
        applicationStatuses: {}
      };
    });
  });
  const [companies, setCompanies] = useState(() => {
    return initialCompanies.map(c => ({
      ...c,
      minCgpa: c.name === "Google" || c.name === "Intel" ? 8.0 : c.name === "Amazon" || c.name === "Oracle" ? 7.5 : 6.0,
      status: "active" as "active" | "inactive"
    }));
  });
  const [prs, setPrs] = useState<PRRecord[]>(() => initialPrs);
  const [companyDetails, setCompanyDetails] = useState<Record<string, CompanyDetailInfo>>(() => {
    const initial = { ...COMPANY_DETAILS };
    Object.keys(initial).forEach(key => {
      initial[key] = {
        ...initial[key],
        placedStudents: MOCK_PLACED_STUDENTS[key] || []
      };
    });
    return initial;
  });
  const [editLogs, setEditLogs] = useState<EditLogEntry[]>([]);
  const [events, setEvents] = useState<PlacementEvent[]>(initialEvents);
  const [eventLogs, setEventLogs] = useState<EventLogEntry[]>(initialEventLogs);

  // Dashboard active sub-tabs
  const [currentStudent, setCurrentStudent] = useState<StudentRecord | null>(null);

  const [localAcademicStatus, setLocalAcademicStatus] = useState<string>("");
  const [localPlacementReadiness, setLocalPlacementReadiness] = useState<string>("");
  const [localPlacementProgress, setLocalPlacementProgress] = useState<string>("");
  const [localSkills, setLocalSkills] = useState<string>("");
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState<string | null>(null);
  const [teamDeptFilter, setTeamDeptFilter] = useState<string>("default");

  // PR Management Sub-panel states
  const [prFormOpen, setPrFormOpen] = useState(false);
  const [editingPr, setEditingPr] = useState<PRRecord | null>(null);
  const [prNameInput, setPrNameInput] = useState("");
  const [prDeptInput, setPrDeptInput] = useState("CSE");
  const [prEmailInput, setPrEmailInput] = useState("");
  const [prPhoneInput, setPrPhoneInput] = useState("");
  const [prRoleInput, setPrRoleInput] = useState("Assistant PR");
  const [prLinkedinInput, setPrLinkedinInput] = useState("");

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

  const handleSavePr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prNameInput || !prEmailInput || !prPhoneInput) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    if (editingPr) {
      setPrs(prev => prev.map(p => p.id === editingPr.id ? {
        ...p,
        name: prNameInput,
        department: prDeptInput,
        email: prEmailInput,
        phone: prPhoneInput,
        role: prRoleInput,
        linkedin: prLinkedinInput || undefined
      } : p));
      addToast(`Updated PR: ${prNameInput}`, "success");
    } else {
      const newPr: PRRecord = {
        id: Date.now(),
        name: prNameInput,
        department: prDeptInput,
        email: prEmailInput,
        phone: prPhoneInput,
        role: prRoleInput,
        linkedin: prLinkedinInput || undefined
      };
      setPrs(prev => [...prev, newPr]);
      addToast(`Added PR: ${prNameInput}`, "success");
    }
    setPrFormOpen(false);
  };

  const handleDeletePr = (id: number, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from Placement Representatives?`)) {
      setPrs(prev => prev.filter(p => p.id !== id));
      addToast(`Removed PR: ${name}`, "success");
    }
  };

  useEffect(() => {
    if (currentStudent) {
      setLocalAcademicStatus(currentStudent.academicStatus || "Active");
      setLocalPlacementReadiness(currentStudent.placementReadiness || "Not Started");
      setLocalPlacementProgress(currentStudent.placementProgress || "Seeking Placement");
      setLocalSkills(currentStudent.resumeData?.skills || "");
    } else {
      setLocalAcademicStatus("");
      setLocalPlacementReadiness("");
      setLocalPlacementProgress("");
      setLocalSkills("");
    }
  }, [currentStudent?.rollNo]);

  const hasUnsavedSettingsChanges = currentStudent ? (
    localAcademicStatus !== (currentStudent.academicStatus || "Active") ||
    localPlacementReadiness !== (currentStudent.placementReadiness || "Not Started") ||
    localPlacementProgress !== (currentStudent.placementProgress || "Seeking Placement") ||
    localSkills !== (currentStudent.resumeData?.skills || "")
  ) : false;
  const [prUsername, setPrUsername] = useState("pr@nitpy.ac.in");
  const [prPassword, setPrPassword] = useState("NITpy@pr");
  const [departmentalUsername, setDepartmentalUsername] = useState("departmental@nitpy.ac.in");
  const [departmentalPassword, setDepartmentalPassword] = useState("NITpy@departmental");
  const [studentDashTab, setStudentDashTab] = useState<string>("profile");
  const [prDashTab, setPrDashTab] = useState<string>("companies");
  const [departmentalDashTab, setDepartmentalDashTab] = useState<string>("students");
  const [rsvpList, setRsvpList] = useState<number[]>([]);

  // Placed Students Search & Import/Export States
  const [placedSearchQuery, setPlacedSearchQuery] = useState("");
  const [placedSelectedCompany, setPlacedSelectedCompany] = useState("All");
  const [placedSelectedYear, setPlacedSelectedYear] = useState("All");
  const [importCsvText, setImportCsvText] = useState("");
  const [importCsvCompany, setImportCsvCompany] = useState("Google");
  const [placedSubTab, setPlacedSubTab] = useState<"directory" | "bulk">("directory");

  // Resume ATS Score Checker States
  const [isAtsAnalyzing, setIsAtsAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsFeedbackTab, setAtsFeedbackTab] = useState<"diagnostic" | "keywords" | "formatting" | "readability" | "recommendations" | "suggestions" | "questions">("diagnostic");
  const [atsReport, setAtsReport] = useState<any | null>(null);
  const [pastedResumeText, setPastedResumeText] = useState("");
  const [uploadedResumeName, setUploadedResumeName] = useState("");
  const [scanStep, setScanStep] = useState("");
  const [atsSelectedJob, setAtsSelectedJob] = useState<string>("Google");
  const [atsJobDescription, setAtsJobDescription] = useState<string>("");
  const [atsCalibrationMode, setAtsCalibrationMode] = useState<"standard" | "tech" | "consulting">("standard");
  const [vagueBulletInput, setVagueBulletInput] = useState("");
  const [rewrittenBulletOutput, setRewrittenBulletOutput] = useState("");
  const [isRewritingBullet, setIsRewritingBullet] = useState(false);

  const handleRewriteBullet = () => {
    if (!vagueBulletInput.trim()) return;
    setIsRewritingBullet(true);
    setTimeout(() => {
      const input = vagueBulletInput.trim().toLowerCase();
      let output = "";

      if (input.includes("search") || input.includes("find")) {
        output = "Implemented inverted index and Redis caching, improving p95 search latency by 45% and supporting 5,000+ concurrent requests.";
      } else if (input.includes("database") || input.includes("sql") || input.includes("query")) {
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

  useEffect(() => {
    if (atsSelectedJob === "Custom") {
      // Keep existing text
    } else {
      const details = companyDetails[atsSelectedJob];
      if (details) {
        const jdText = `Position: Software Engineer / Technology Analyst at ${atsSelectedJob}\n\nOverview:\n${details.overview}\n\nRequirements & Core Skills:\n- ${details.skills.core.join("\n- ")}\n- ${details.skills.additional || ""}\n\nSelection Rounds:\n- ${details.selectionProcess.rounds.join("\n- ")}`;
        setAtsJobDescription(jdText);
      }
    }
  }, [atsSelectedJob, companyDetails]);

  // Mentorship & Tools States
  const [isMockTestOpen, setIsMockTestOpen] = useState(false);
  const [mockTestSubject, setMockTestSubject] = useState<"aptitude" | "technical">("aptitude");
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number }>({});
  const [mockTestCompleted, setMockTestCompleted] = useState(false);
  const [mockTestTimer, setMockTestTimer] = useState(600); // 10 minutes (600 seconds)

  const [codingProblemIdx, setCodingProblemIdx] = useState(0);
  const [codingCode, setCodingCode] = useState(CODING_STARTER_CODES[0]);
  const [isCompilingCode, setIsCompilingCode] = useState(false);
  const [compilerLogs, setCompilerLogs] = useState<string[]>([]);

  const [isWebcamRecording, setIsWebcamRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [practiceQuestionIdx, setPracticeQuestionIdx] = useState(0);
  const [showWebcamPreview, setShowWebcamPreview] = useState(false);


  // Statistics Chart State
  const [statMode, setStatMode] = useState<"packages" | "sectors" | "trends" | "brochure-stats">("packages");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Recruiters Grid State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("All");

  // Mouse positioning for interactive 3D Blob Motion
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [blobPos, setBlobPos] = useState({ x: 0, y: 0 });

  // Hero Image Slider State
  const [heroIndex, setHeroIndex] = useState(0);
  const heroImages = [
    "/assests/1.jpeg",
    "/assests/2.jpeg",
    "/assests/3.jpeg"
  ];

  const heroTaglines = [
    { main: "Bridging Potential & Opportunity", sub: "Empowering NITPY graduates to scale global heights with premium professional placements." },
    { main: "Fostering Innovation & Leadership", sub: "Connecting world-class recruiters with technical excellence and resilient problem solvers." },
    { main: "Shaping Tomorrow's Technocrats", sub: "NIT Puducherry Training & Placement Cell provides consistent guidance and rich opportunities." }
  ];

  // Testimonials Carousel State
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Scroll Parallax offset
  const [scrollY, setScrollY] = useState(0);

  // Add Toast helper
  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleExportPlacedCsv = (companyName?: string) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Company,Role,LinkedIn,Year\n";

    let exportList: { name: string; company: string; role: string; linkedin: string; year: string }[] = [];

    Object.keys(companyDetails).forEach(compKey => {
      if (companyName && compKey !== companyName) return;
      const list = companyDetails[compKey]?.placedStudents || [];
      list.forEach(student => {
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

      if (!currentPlacedList.some(s => s.name.toLowerCase() === name.toLowerCase())) {
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

  const renderPlacedDirectoryWithBulk = (showBulkTools: boolean) => {
    const allPlaced: { name: string; role: string; linkedin: string; company: string; year: string }[] = [];
    Object.keys(companyDetails).forEach(compName => {
      const list = companyDetails[compName]?.placedStudents || [];
      list.forEach(item => {
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-white">Placed Students Registry</h3>
            <p className="text-xs text-slate-400 font-serif font-semibold">View records, search profiles, and check career offers.</p>
          </div>
        </div>

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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-405" size={14} />
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
                    className={`bg-transparent focus:outline-none text-[11px] font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
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
                    className={`bg-transparent focus:outline-none text-[11px] font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
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
                          className="p-2 bg-blue-500/10 hover:bg-blue-500/25 border border-blue-550/30 hover:border-blue-500 text-blue-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
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
                    className={`bg-transparent focus:outline-none text-[11px] font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
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
                      className={`w-full border rounded-xl p-3 text-xs focus:outline-none ${theme === "dark" ? "bg-luna-950 border-white/10 text-white focus:border-luna-300" : "bg-white border-slate-350 text-slate-900 focus:border-luna-600"}`}
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
                        <p className="mt-1 text-[9px] text-slate-400">Example:<br />
                          John Doe, Google, Software Engineer, linkedin.com/in/johndoe, 2026</p>
                      </div>
                    ) : (
                      <div>
                        <code className="text-luna-300 bg-black/30 px-1 rounded">Name, Role, LinkedIn, Year</code>
                        <p className="mt-1 text-[9px] text-slate-400">Example:<br />
                          Jane Smith, Firmware Engineer, linkedin.com/in/janesmith, 2025</p>
                      </div>
                    )}
                    <span className="text-[9px] text-luna-300 block font-semibold italic mt-2">
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
  };

  const renderPrsManagementTabContent = () => {
    return (
      <div className="space-y-6 animate-fade-in font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-white">Student Placement Force Management</h3>
            <p className="text-xs text-slate-400 font-serif">View, update details, or register new Placement Representatives.</p>
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
  };

  // Company Form Modal states
  const [companyFormOpen, setCompanyFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<{
    name: string;
    sector: string;
    logo: string;
    hires: number;
    maxPackage: string;
    avgPackage: string;
    minCgpa: number;
    color: string;
    status: "active" | "inactive";
  } | null>(null);

  // Form Fields
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

  // Placed students editing state
  const [compFormPlacedStudents, setCompFormPlacedStudents] = useState<PlacedStudent[]>([]);
  const [newPlacedName, setNewPlacedName] = useState("");
  const [newPlacedLinkedin, setNewPlacedLinkedin] = useState("");
  const [newPlacedRole, setNewPlacedRole] = useState("");

  // Event Form state
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventFormTitle, setEventFormTitle] = useState("");
  const [eventFormDescription, setEventFormDescription] = useState("");
  const [eventFormDate, setEventFormDate] = useState("");
  const [eventFormTime, setEventFormTime] = useState("");
  const [eventFormVenue, setEventFormVenue] = useState("");
  const [eventFormGoogleFormUrl, setEventFormGoogleFormUrl] = useState("");
  const [eventFormType, setEventFormType] = useState("Drive");
  const [eventFormPoster, setEventFormPoster] = useState("");

  const [detailsTab, setDetailsTab] = useState<"info" | "history" | "placed">("info");

  const handleOpenCompanyForm = (comp?: typeof companies[0]) => {
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

    if (!editingCompany && companies.some(c => c.name.toLowerCase() === compFormName.toLowerCase())) {
      addToast("A company with this name already exists", "error");
      return;
    }

    const finalLogo = compFormLogo || compFormName.slice(0, 3).toUpperCase();
    const companyName = compFormName.trim();

    const updatedDetails: CompanyDetailInfo = {
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

      setCompanies(prev => prev.map(c => c.name === oldComp.name ? {
        ...c,
        name: companyName,
        sector: compFormSector,
        logo: finalLogo,
        maxPackage: compFormMaxPackage,
        avgPackage: compFormAvgPackage,
        minCgpa: compFormMinCgpa,
        hires: compFormHires
      } : c));

      setCompanyDetails(prev => {
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
      setEditLogs(prev => [newLog, ...prev]);
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

      const newComp = {
        name: companyName,
        sector: compFormSector,
        logo: finalLogo,
        maxPackage: compFormMaxPackage,
        avgPackage: compFormAvgPackage,
        minCgpa: compFormMinCgpa,
        hires: compFormHires,
        color: randomColor,
        status: "active" as const
      };

      setCompanies(prev => [...prev, newComp]);
      setCompanyDetails(prev => ({
        ...prev,
        [companyName]: updatedDetails
      }));

      const newLog: EditLogEntry = {
        id: Date.now(),
        companyName,
        actionType: "Add",
        changedBy,
        timestamp,
        details: "Created new company recruitment profile"
      };
      setEditLogs(prev => [newLog, ...prev]);
      addToast(`Added recruitment drive for ${companyName}!`, "success");
    }
    setCompanyFormOpen(false);
  };

  const handleSoftDeleteCompany = (name: string, currentStatus: "active" | "inactive") => {
    const isSoftDelete = currentStatus === "active";
    const actionType = isSoftDelete ? "Soft Delete" : "Restore";
    const nextStatus = isSoftDelete ? "inactive" : "active";

    if (confirm(`Are you sure you want to ${isSoftDelete ? "deactivate (soft-delete)" : "restore"} ${name}?`)) {
      setCompanies(prev => prev.map(c => c.name === name ? { ...c, status: nextStatus } : c));

      const newLog: EditLogEntry = {
        id: Date.now(),
        companyName: name,
        actionType,
        changedBy: userName || "PR Representative",
        timestamp: new Date().toLocaleString(),
        details: isSoftDelete ? "Marked as inactive. Hidden from student listings." : "Restored to active status."
      };
      setEditLogs(prev => [newLog, ...prev]);
      addToast(`${isSoftDelete ? "Deactivated" : "Restored"} company: ${name}`, "success");
    }
  };

  const handleHardDeleteCompany = (name: string) => {
    if (confirm(`WARNING: This will PERMANENTLY delete all record database logs, statistics, and detail insights for ${name}. This action cannot be undone. Are you sure?`)) {
      setCompanies(prev => prev.filter(c => c.name !== name));
      setCompanyDetails(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });

      const newLog: EditLogEntry = {
        id: Date.now(),
        companyName: name,
        actionType: "Delete",
        changedBy: userName || "PR Representative",
        timestamp: new Date().toLocaleString(),
        details: "Permanently deleted company profile and selection insights."
      };
      setEditLogs(prev => [newLog, ...prev]);
      addToast(`Permanently deleted: ${name}`, "success");
    }
  };

  // Listen to window scroll for parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hash Router for Multi-Page SPA Sections
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#/", "") || "home";
      const validSections = ["home", "vision", "about", "team", "events", "contact", "dashboard"];
      if (validSections.includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab("home");
      }
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Smooth blob motion interpolation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const updateBlob = () => {
      setBlobPos((prev) => {
        // Linear interpolation for springy damping feel
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.08,
          y: prev.y + dy * 0.08,
        };
      });
      animationFrameId = requestAnimationFrame(updateBlob);
    };
    animationFrameId = requestAnimationFrame(updateBlob);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  // Hero auto slide randomly
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => {
        let nextIndex = prev;
        while (nextIndex === prev) {
          nextIndex = Math.floor(Math.random() * heroImages.length);
        }
        return nextIndex;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Theme configuration Sync
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  // Scroll Trigger reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    const hiddenElements = document.querySelectorAll(".fade-in-on-scroll");
    hiddenElements.forEach((el) => observer.observe(el));
    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, [activeTab]);

  // MCQ Timer Effect
  useEffect(() => {
    let timerId: any;
    if (isMockTestOpen && !mockTestCompleted && mockTestTimer > 0) {
      timerId = setInterval(() => {
        setMockTestTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            setMockTestCompleted(true);
            addToast("Mock assessment time expired. Submitting answers.", "info");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isMockTestOpen, mockTestCompleted, mockTestTimer]);

  // Webcam Simulator Recording Timer Effect
  useEffect(() => {
    let recTimer: any;
    if (isWebcamRecording) {
      recTimer = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(recTimer);
  }, [isWebcamRecording]);

  // Coding Sandbox Sync Effect
  useEffect(() => {
    setCodingCode(CODING_STARTER_CODES[codingProblemIdx]);
    setCompilerLogs([]);
  }, [codingProblemIdx]);

  // Mock Recruiter Database
  const recruiters = [
    { name: "Google", sector: "IT / Software", logo: "G", hires: 4, maxPackage: "42.5 LPA", avgPackage: "28.0 LPA", color: "bg-red-500/10 border-red-500/30 text-red-400" },
    { name: "Amazon", sector: "IT / Software", logo: "A", hires: 8, maxPackage: "36.0 LPA", avgPackage: "22.5 LPA", color: "bg-orange-500/10 border-orange-500/30 text-orange-400" },
    { name: "Oracle", sector: "IT / Software", logo: "O", hires: 12, maxPackage: "24.0 LPA", avgPackage: "18.2 LPA", color: "bg-red-600/10 border-red-600/30 text-red-500" },
    { name: "L&T Construction", sector: "Core Engineering", logo: "L&T", hires: 15, maxPackage: "12.5 LPA", avgPackage: "8.5 LPA", color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" },
    { name: "Deloitte", sector: "Consulting", logo: "D", hires: 18, maxPackage: "14.0 LPA", avgPackage: "9.6 LPA", color: "bg-green-500/10 border-green-500/30 text-green-400" },
    { name: "TCS", sector: "IT / Software", logo: "TCS", hires: 25, maxPackage: "9.0 LPA", avgPackage: "6.2 LPA", color: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
    { name: "Intel", sector: "Core Engineering", logo: "I", hires: 5, maxPackage: "28.0 LPA", avgPackage: "19.5 LPA", color: "bg-blue-600/10 border-blue-600/30 text-blue-400" },
    { name: "Goldman Sachs", sector: "Finance", logo: "GS", hires: 3, maxPackage: "32.0 LPA", avgPackage: "24.0 LPA", color: "bg-yellow-600/10 border-yellow-600/30 text-yellow-500" },
    { name: "ABB", sector: "Core Engineering", logo: "ABB", hires: 6, maxPackage: "14.5 LPA", avgPackage: "9.8 LPA", color: "bg-red-500/10 border-red-500/30 text-red-400" },
    { name: "Capgemini", sector: "IT / Software", logo: "C", hires: 14, maxPackage: "8.5 LPA", avgPackage: "5.5 LPA", color: "bg-blue-400/10 border-blue-400/30 text-blue-300" },
    { name: "Samsung", sector: "Core Engineering", logo: "S", hires: 7, maxPackage: "22.0 LPA", avgPackage: "14.8 LPA", color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" },
    { name: "Infosys", sector: "IT / Software", logo: "INF", hires: 22, maxPackage: "9.5 LPA", avgPackage: "6.0 LPA", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
  ];

  // Filtered Recruiters
  const filteredRecruiters = recruiters.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === "All" || company.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  // Testimonials Mock Data
  const testimonials = [
    {
      name: "Siddharth Verma",
      batch: "Class of 2023 • B.Tech CSE",
      company: "Google",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
      quote: "The pre-placement training modules at NITPY were instrumental in building my technical and problem-solving skills. The placement cell guided me through every interview step.",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-in-a-coffee-shop-43093-large.mp4"
    },
    {
      name: "Meera Nair",
      batch: "Class of 2024 • B.Tech ECE",
      company: "Intel",
      role: "Silicon Design Engineer",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
      quote: "Despite being in a core electrical sector, the placement cell brought incredible opportunities. I received direct mentoring from senior industry leaders.",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-remotely-from-home-sitting-on-a-sofa-43003-large.mp4"
    },
    {
      name: "Rohan Das",
      batch: "Class of 2023 • B.Tech Mechanical",
      company: "L&T Construction",
      role: "Graduate Engineer Trainee",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      quote: "NIT Puducherry's campus culture encourages leadership. The TNP activities helped me refine my group discussion and interview presentation skills tremendously.",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-office-worker-looking-at-computer-monitor-with-concentration-43187-large.mp4"
    }
  ];

  // Pre-Placement Events Mock Data
  const placementEvents = [
    { id: 1, title: "Google Pre-Placement Presentation", date: "June 12, 2026", time: "10:00 AM", venue: "Science Block Seminar Hall", type: "PPT", googleFormUrl: "https://forms.gle/google-presentation-rsvp" },
    { id: 2, title: "Pre-Placement Mock Coding Hackathon", date: "June 25, 2026", time: "09:00 AM", venue: "Online Platform (HackerEarth)", type: "Mock Test", googleFormUrl: "https://forms.gle/mock-hackathon-reg" },
    { id: 3, title: "Intel Recruitment Drive (ECE/CSE)", date: "July 05, 2026", time: "08:30 AM", venue: "T&P Cell Interview Cabins", type: "Drive", googleFormUrl: "https://forms.gle/intel-drive-register" },
    { id: 4, title: "L&T Core Engineering Pre-Talks", date: "July 12, 2026", time: "02:00 PM", venue: "CSE Seminar Hall", type: "PPT", googleFormUrl: "https://forms.gle/lt-talks-feedback" },
  ];

  // Form Handlers
  // Form Handlers
  const updateLoggedInStudent = (updatedFields: Partial<StudentRecord>) => {
    if (!currentStudent) return;
    const updated = { ...currentStudent, ...updatedFields };
    setCurrentStudent(updated);
    setStudents(prev => prev.map(s => s.rollNo === updated.rollNo ? updated : s));
  };

  const handleSaveStatusSettings = () => {
    if (!currentStudent) return;
    const isPlaced = localPlacementProgress === "Placed" || localPlacementProgress === "Internship Secured";
    updateLoggedInStudent({
      academicStatus: localAcademicStatus as any,
      placementReadiness: localPlacementReadiness as any,
      placementProgress: localPlacementProgress as any,
      isPlaced,
      resumeData: {
        ...(currentStudent.resumeData || { summary: "", skills: "", experience: "", projects: "" }),
        skills: localSkills
      }
    });
    addToast("Academic & Placement status settings updated successfully!", "success");
  };

  const handleApplyToCompany = (companyName: string, minCgpa: number) => {
    if (!currentStudent) return;

    if (currentStudent.isPlaced) {
      addToast("You are already placed and cannot apply for more drives (One Student, One Job policy).", "error");
      return;
    }

    const applied = currentStudent.appliedCompanies || [];
    if (applied.includes(companyName)) {
      addToast(`Already applied to ${companyName}`, "info");
      return;
    }

    if (!currentStudent.isEligible) {
      addToast("You are not eligible for placement drives.", "error");
      return;
    }

    if (currentStudent.cgpa < minCgpa) {
      addToast(`CGPA requirement not met for ${companyName} (Required: ${minCgpa}, Yours: ${currentStudent.cgpa})`, "error");
      return;
    }

    const updatedApplied = [...applied, companyName];
    const updatedStatuses = { ...(currentStudent.applicationStatuses || {}), [companyName]: "Applied" as const };
    updateLoggedInStudent({
      appliedCompanies: updatedApplied,
      applicationStatuses: updatedStatuses
    });

    addToast(`Successfully applied to ${companyName}! Opening application form...`, "success");

    // Open mock Google Form pre-filled with candidate and company data
    const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfDyD4XJq4wQ0f8vE-tD7c8m9r1-2-3-4-5-6-7/viewform?usp=pp_url&entry.2000001=${encodeURIComponent(companyName)}&entry.2000002=${encodeURIComponent(currentStudent.name)}&entry.2000003=${encodeURIComponent(currentStudent.rollNo)}`;
    window.open(googleFormUrl, "_blank");
  };

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
        const lines = resumeContent.split("\n");
        const longParagraphs = lines.filter(line => line.trim().length > 200 && !/^\s*[-*•+]/i.test(line));
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
        // Work Experience: 35%
        // Technical Skills: 30%
        // Education: 15%
        // Formatting & Readability: 10%
        // Summary/Objective: 10%

        let s_exp = headingsFound.experience ? (foundActionVerbs.length >= 3 ? 100 : 80) : 0;
        if (uniqueMetrics.length === 0 && s_exp > 0) s_exp -= 20; // penalize no metrics in experience

        let s_skills = headingsFound.skills ? Math.round((matchedKeywords.length / Math.max(1, targetKeywords.length)) * 100) : 0;
        // Hard vs Soft skills balance factor
        if (foundSoftSkills.length >= 2) s_skills = Math.min(100, s_skills + 10);
        else s_skills = Math.max(10, s_skills - 10);

        const s_edu = headingsFound.education ? (resumeTextLower.includes("nit") ? 100 : 80) : 0;

        const s_format = Math.max(10, 100 - (formattingIssues.filter(i => !i.includes("No major")).length * 20));

        let s_summary = headingsFound.summary ? 100 : 0;
        if (hasGenericSummary) s_summary = 40;

        // Default weights
        let weights = { experience: 0.35, skills: 0.30, education: 0.15, format: 0.10, summary: 0.10 };

        // Apply calibration override if selected
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

        // Projects/Certifications Bonus (Bonus sections that can push you higher, e.g. +5 for projects, +5 for certs)
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

        // Dynamic suggestions generation
        const suggestionsList: Array<{
          id: string;
          priority: "High" | "Medium" | "Low";
          estimated_score_impact: number;
          rationale: string;
          edit_text: string;
          location: string;
        }> = [];

        // Dynamic questions generation
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
              question_text: "Given your SQL analytical optimization, how do window functions differ from standard GROUP BY aggregations, and what are the concurrency implications on massive tables?",
              evidence_link: "Projects[SQL Query optimization]",
              expected_answer_outline: [
                "Window functions calculate on partitions without collapsing rows",
                "GROUP BY aggregates and changes shape of results",
                "Execution plan changes: sorting, hashing, partition scans",
                "Index optimization (covering indexes, composite indexes)"
              ],
              scoring_rubric: [
                "Window vs group description (3 points)",
                "Concurrency and indexing considerations (4 points)",
                "Analytical query performance tuning (3 points)"
              ],
              difficulty: "hard"
            },
            {
              id: "q-3",
              type: "Behavioral",
              question_text: "Describe a situation where a machine learning model yielded bias or poor feature representation during testing. How did you explain this to non-technical stakeholders and resolve it?",
              evidence_link: "General competence standard",
              expected_answer_outline: [
                "Situation context: bias or features skew",
                "Action: SHAP values, feature pruning, stakeholder reporting",
                "Result: 15% improvement in fairness metrics, business alignment"
              ],
              scoring_rubric: [
                "Context clarity (3 points)",
                "Communication with stakeholders (4 points)",
                "STAR result quantification (3 points)"
              ],
              difficulty: "easy"
            }
          );
        } else if (detectedRole === "Cybersecurity Analyst") {
          suggestionsList.push(
            {
              id: "sug-1",
              priority: "High",
              estimated_score_impact: 9,
              rationale: "JD requires network security controls. Incorporate intrusion detection systems explicitly.",
              edit_text: "Add to Skills: Snort, Wireshark, Firewalls, Penetration Testing, IAM",
              location: "Skills"
            },
            {
              id: "sug-2",
              priority: "High",
              estimated_score_impact: 10,
              rationale: "Need evidence of brute force mitigation and threat prevention.",
              edit_text: "Configured intrusion detection policies using Snort and implemented rate-limiting firewalls, mitigating brute force API vectors by 99.8%.",
              location: "Experience [Security Specialist / Project]"
            },
            {
              id: "sug-3",
              priority: "Medium",
              estimated_score_impact: 6,
              rationale: "Explain application-level encryption standards.",
              edit_text: "Integrated GPG and AES-256 end-to-end payload encryption into REST endpoints, securing transit data and passing strict SOC2 mock audits.",
              location: "Projects / Work Experience"
            }
          );

          questionsList.push(
            {
              id: "q-1",
              type: "Screening",
              question_text: "Explain the specific Snort rules you deployed to detect brute force traffic and how you measured the 99.8% threat mitigation rate.",
              evidence_link: "Experience[Snort intrusion detection bullet]",
              expected_answer_outline: [
                "Thresholding configuration in snort.conf",
                "Detection of repeated TCP handshakes or POST requests",
                "Integration with firewall triggers (iptables/fail2ban)",
                "Traffic simulations to measure mitigation rates"
              ],
              scoring_rubric: [
                "Snort thresholding details (3 points)",
                "Integration with firewalls (4 points)",
                "Simulation verification methods (3 points)"
              ],
              difficulty: "medium"
            },
            {
              id: "q-2",
              type: "Technical",
              question_text: "What are the core latency and cryptographic key management trade-offs of symmetric AES-256 vs asymmetric GPG encryption in high-volume microservices?",
              evidence_link: "Projects[GPG/AES payload encryption]",
              expected_answer_outline: [
                "AES-256 symmetric performance advantages (hardware acceleration)",
                "Asymmetric GPG key exchange and computational complexity",
                "Key rotation strategies (KMS, Vault)",
                "Replay attacks and salt/IV vectors"
              ],
              scoring_rubric: [
                "Symmetric vs asymmetric performance (3 points)",
                "Key management vault details (4 points)",
                "Security vectors coverage (3 points)"
              ],
              difficulty: "hard"
            },
            {
              id: "q-3",
              type: "Behavioral",
              question_text: "Tell me about a time you identified an active security vulnerability in an ongoing release or production system. How did you coordinate the patch while keeping business downtime minimal?",
              evidence_link: "General competence standard",
              expected_answer_outline: [
                "Situation context: patch management under urgency",
                "Action: hotfix deployment, coordination with dev teams, mitigation",
                "Result: Zero data leak, vulnerability patched within 4 hours"
              ],
              scoring_rubric: [
                "Urgency management (3 points)",
                "Dev-ops coordination (4 points)",
                "Vulnerability classification (3 points)"
              ],
              difficulty: "medium"
            }
          );
        } else {
          suggestionsList.push(
            {
              id: "sug-1",
              priority: "High",
              estimated_score_impact: 8,
              rationale: "JD requires Kubernetes and containerization experience. Include relevant tooling.",
              edit_text: "Add to Skills: Docker, Kubernetes, Helm, CI/CD, AWS GKE",
              location: "Skills"
            },
            {
              id: "sug-2",
              priority: "High",
              estimated_score_impact: 10,
              rationale: "Cloud microservice claims require quantified deployment details and scaling evidence.",
              edit_text: "Deployed containerized microservices to Kubernetes cluster using GKE and GCF, reducing deployment time by 60% and enabling zero-downtime rolling updates.",
              location: "Experience [Software Engineering Intern]"
            },
            {
              id: "sug-3",
              priority: "Medium",
              estimated_score_impact: 6,
              rationale: "Experience lacks clear caching/system optimization description.",
              edit_text: "Designed Redis-backed cache layer for high-throughput search queries, lowering query latency from 320ms to 45ms (85% reduction) under 5,000 concurrent req/sec.",
              location: "Projects [Web Analytics Dashboard]"
            }
          );

          questionsList.push(
            {
              id: "q-1",
              type: "Screening",
              question_text: "You claim a 60% deployment time reduction. Describe the profiling steps, GKE configurations, and measurement methods used to verify this improvement.",
              evidence_link: "Experience[Software Engineering Intern - GKE deployment]",
              expected_answer_outline: [
                "Baseline deploy time measurements using legacy shell scripts",
                "CI/CD automation configurations (GitHub Actions, Helm charts)",
                "Kubernetes rolling update strategies and readiness probes",
                "Post-deployment telemetry logging"
              ],
              scoring_rubric: [
                "Baseline profiling details (3 points)",
                "CI/CD and Helm integration (4 points)",
                "Measurement accuracy (3 points)"
              ],
              difficulty: "medium"
            },
            {
              id: "q-2",
              type: "Technical",
              question_text: "Given your Redis-backed cache implementation, how did you handle cache invalidation, cache stampede, and eviction policies under 5,000 req/sec?",
              evidence_link: "Projects[Web Analytics - Redis cache]",
              expected_answer_outline: [
                "Eviction configurations (allkeys-lru vs volatile-lru)",
                "Cache stampede prevention using mutual exclusion locks or probabilistic early expiration",
                "Invalidation patterns (Write-through vs Cache-aside)",
                "Telemetry profiling details"
              ],
              scoring_rubric: [
                "Eviction details (3 points)",
                "Stampede prevention methods (4 points)",
                "Cache invalidation tradeoffs (3 points)"
              ],
              difficulty: "hard"
            },
            {
              id: "q-3",
              type: "Behavioral",
              question_text: "Tell me about a time you had to convince stakeholders to prioritize a technical refactor (like Redis caching/Kubernetes integration). What was the outcome?",
              evidence_link: "General competence standard",
              expected_answer_outline: [
                "Refactor context: high database load / manual deploy delays",
                "Action: prototyping, presenting performance comparison charts, stakeholder alignment",
                "Result: Refactor approved, 85% speedup, zero downtime deployments"
              ],
              scoring_rubric: [
                "Refactor justification (3 points)",
                "Influence & communication (4 points)",
                "Quantified STAR outcome (3 points)"
              ],
              difficulty: "medium"
            }
          );
        }

        setAtsScore(finalScore);
        setAtsReport({
          percentile: percentileRank,
          justification: finalScore >= 85
            ? `Excellent matching rating (Top ${percentileRank}% match)! Your profile shows high keyword density, strong action verbs, and quantified metrics tailored for this role.`
            : finalScore >= 70
              ? `Good overall alignment (Top ${percentileRank}% match). Incorporating the recommended missing technical skills and removing generic objectives will help you rank higher.`
              : `Critical adjustments required (Top ${percentileRank}% match). Address missing core segments, poor metric representation, and formatting warnings to pass initial scanner screens.`,
          diagnostic,
          keywordsFound: matchedKeywords.length > 0 ? matchedKeywords.map(k => k.toUpperCase()) : [],
          keywordsAdd: missingKeywords.length > 0 ? missingKeywords.map(k => k.toUpperCase()) : ["DOCKER", "KUBERNETES", "SYSTEM DESIGN"],
          overusedTerms: hasGenericSummary ? ["seeking a challenging position", "utilize my skills"] : [],
          formattingIssues,
          readabilityIssues,
          recommendations,
          suggestions: suggestionsList,
          questions: questionsList
        });

        setIsAtsAnalyzing(false);
        addToast(`ATS Analysis complete! Match Rating: ${finalScore}%`, "success");
      }
    }, 2500 / steps.length);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser || !loginPass) {
      addToast("Please fill in all fields", "error");
      return;
    }

    const usernameLower = loginUser.toLowerCase();

    if (loginRole === "student") {
      const student = students.find(
        (s) => s.username.toLowerCase() === usernameLower && s.passwordKey === loginPass
      );
      if (student) {
        setIsLoggedIn(true);
        setUserName(student.name);
        setUserRoleState("student");
        setCurrentStudent(student);
        setIsLoginOpen(false);
        addToast(`Welcome back, ${student.name}!`, "success");
        setLoginUser("");
        setLoginPass("");
        window.location.hash = "#/dashboard";
      } else {
        addToast("Invalid Student credentials. Try rollno@nitpy.ac.in & NITpy@rollno.", "error");
      }
    } else if (loginRole === "pr") {
      if ((usernameLower === prUsername.toLowerCase() || usernameLower === "recruiter@nitpy.ac.in") && loginPass === prPassword) {
        setIsLoggedIn(true);
        setUserName("PR Cell Representative");
        setUserRoleState("pr");
        setCurrentStudent(null);
        setIsLoginOpen(false);
        addToast("Welcome back, Placement Representative!", "success");
        setLoginUser("");
        setLoginPass("");
        window.location.hash = "#/dashboard";
      } else {
        addToast("Invalid Placement Representative credentials.", "error");
      }
    } else if (loginRole === "departmental") {
      if ((usernameLower === departmentalUsername.toLowerCase() || usernameLower === "admin@nitpy.ac.in") && loginPass === departmentalPassword) {
        setIsLoggedIn(true);
        setUserName("Departmental Coordinator");
        setUserRoleState("departmental");
        setCurrentStudent(null);
        setIsLoginOpen(false);
        addToast("Welcome back, Departmental Coordinator!", "success");
        setLoginUser("");
        setLoginPass("");
        window.location.hash = "#/dashboard";
      } else {
        addToast("Invalid Departmental Coordinator credentials.", "error");
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserRoleState("");
    setCurrentStudent(null);
    window.location.hash = "#/home";
    addToast("Logged out successfully", "info");
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = forgotEmail.toLowerCase();

    if (forgotStep === 0) {
      // Check if email exists
      let emailExists = false;
      if (forgotRole === "student") {
        emailExists = students.some(s => s.username.toLowerCase() === emailLower);
      } else if (forgotRole === "pr") {
        emailExists = emailLower === prUsername.toLowerCase() || emailLower === "recruiter@nitpy.ac.in";
      } else if (forgotRole === "departmental") {
        emailExists = emailLower === departmentalUsername.toLowerCase() || emailLower === "admin@nitpy.ac.in";
      }

      if (emailExists) {
        const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setOtpCode(generatedOtp);
        setForgotUserEmail(emailLower);
        setForgotStep(1);
        addToast(`Simulated OTP sent! Your 4-digit code is: ${generatedOtp}`, "info");
      } else {
        addToast("No account found with this email.", "error");
      }
    } else if (forgotStep === 1) {
      if (enteredOtp === otpCode) {
        setForgotStep(2);
        addToast("OTP Verified! Please enter a new password.", "success");
      } else {
        addToast("Invalid OTP code. Please check and try again.", "error");
      }
    } else if (forgotStep === 2) {
      if (newPassword.length < 6) {
        addToast("Password must be at least 6 characters long.", "error");
        return;
      }
      if (newPassword !== confirmPassword) {
        addToast("Passwords do not match.", "error");
        return;
      }

      if (forgotRole === "student") {
        setStudents(prev => prev.map(s => s.username.toLowerCase() === forgotUserEmail ? { ...s, passwordKey: newPassword } : s));
        if (currentStudent && currentStudent.username.toLowerCase() === forgotUserEmail) {
          setCurrentStudent(prev => prev ? { ...prev, passwordKey: newPassword } : null);
        }
      } else if (forgotRole === "pr") {
        setPrPassword(newPassword);
      } else if (forgotRole === "departmental") {
        setDepartmentalPassword(newPassword);
      }

      addToast("Password reset successfully! You can now log in.", "success");
      setShowForgotPassword(false);
      setForgotStep(0);
      setForgotEmail("");
      setOtpCode("");
      setEnteredOtp("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // Package Stats Data for SVG Chart
  const departmentStats = [
    { dept: "CSE", highest: 16.0, average: 13.0, yearsData: { 2023: "Highest: 12 LPA, Avg: 9.2 LPA", 2024: "Highest: 14 LPA, Avg: 11.0 LPA", 2025: "Highest: 15 LPA, Avg: 12.0 LPA", 2026: "Highest: 16.0 LPA, Avg: 13.0 LPA" } },
    { dept: "ECE", highest: 23.0, average: 9.63, yearsData: { 2023: "Highest: 15 LPA, Avg: 8.0 LPA", 2024: "Highest: 18 LPA, Avg: 8.5 LPA", 2025: "Highest: 20 LPA, Avg: 9.0 LPA", 2026: "Highest: 23.0 LPA, Avg: 9.63 LPA" } },
    { dept: "EEE", highest: 12.0, average: 6.00, yearsData: { 2023: "Highest: 9 LPA, Avg: 5.5 LPA", 2024: "Highest: 10 LPA, Avg: 5.8 LPA", 2025: "Highest: 11 LPA, Avg: 6.0 LPA", 2026: "Highest: 12.0 LPA, Avg: 6.00 LPA" } },
    { dept: "Mech", highest: 10.0, average: 8.00, yearsData: { 2023: "Highest: 8 LPA, Avg: 6.5 LPA", 2024: "Highest: 9 LPA, Avg: 7.0 LPA", 2025: "Highest: 9.5 LPA, Avg: 7.5 LPA", 2026: "Highest: 10.0 LPA, Avg: 8.00 LPA" } },
    { dept: "Civil", highest: 9.0, average: 7.00, yearsData: { 2023: "Highest: 7 LPA, Avg: 5.5 LPA", 2024: "Highest: 8 LPA, Avg: 6.0 LPA", 2025: "Highest: 8.5 LPA, Avg: 6.5 LPA", 2026: "Highest: 9.0 LPA, Avg: 7.00 LPA" } },
  ];

  const sectorDistribution = [
    { sector: "IT / Software", percent: 55, color: "from-blue-500 to-cyan-400", trend: "+5% vs last year" },
    { sector: "Core Engineering", percent: 25, color: "from-teal-500 to-emerald-400", trend: "+3% vs last year" },
    { sector: "Analytics / Consulting", percent: 12, color: "from-violet-500 to-purple-400", trend: "Steady" },
    { sector: "Finance", percent: 5, color: "from-amber-500 to-orange-400", trend: "New recruiters added" },
    { sector: "PSUs / R&D", percent: 3, color: "from-red-500 to-rose-400", trend: "High demand" },
  ];

  const placementTrends = [
    { year: "2023", rate: 84, highest: 24.0, avg: 8.5 },
    { year: "2024", rate: 88, highest: 28.0, avg: 9.2 },
    { year: "2025", rate: 91, highest: 38.0, avg: 10.5 },
    { year: "2026 (Ongoing)", rate: 94, highest: 42.5, avg: 12.0 },
  ];

  return (
    <div className={`transition-colors duration-500 ${theme === "light" ? "text-luna-950" : "text-slate-100"}`}>

      {/* Interactive HTML5 Canvas Particle Background */}
      <ParticleBackground />




      {/* Aurora Particle System - Global float assets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[60vw] h-[60vw] rounded-full bg-luna-300/10 blur-[130px] -top-[20vw] -left-[20vw] animate-aurora-glow-1"></div>
        <div className="absolute w-[50vw] h-[50vw] rounded-full bg-luna-600/10 blur-[120px] top-[40vh] -right-[15vw] animate-aurora-glow-2"></div>
        <div className="absolute w-[30vw] h-[30vw] rounded-full bg-luna-50/5 blur-[100px] bottom-[10vh] left-[5vw] animate-float-slow"></div>
      </div>

      {/* Pre-pinned Glassmorphic Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a
            href="https://www.nitpy.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 cursor-pointer group z-10"
          >
            <img
              src="/assests/college_logo.png"
              alt="NITPY Logo"
              className="h-14 w-auto object-contain drop-shadow-md rounded-full bg-white/20 p-1 transition-transform group-hover:scale-105"
              onError={(e) => {
                // Fallback in case of image load failure
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=200";
              }}
            />
            <div>
              <h1 className={`text-lg md:text-xl font-bold tracking-tight font-sans transition-colors
                ${theme === "dark"
                  ? "bg-gradient-to-r from-luna-300 via-luna-50 to-luna-400 bg-clip-text text-transparent group-hover:text-luna-300"
                  : "text-luna-900 group-hover:text-luna-700"}`}>
                NIT PUDUCHERRY
              </h1>
              <p className={`text-[10px] uppercase font-semibold tracking-[0.18em]
                ${theme === "dark" ? "text-luna-300/80" : "text-luna-700"}`}>
                Training & Placement Cell
              </p>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 font-sans">
            {["home", "vision", "about", "team", "events", "contact"].map((item) => (
              <a
                key={item}
                href={`#/${item}`}
                className={`text-xs lg:text-sm font-semibold tracking-wide uppercase transition-all duration-300 relative py-2 px-1
                  ${activeTab === item
                    ? (theme === "dark" ? "text-luna-300 font-bold" : "text-luna-700 font-bold")
                    : (theme === "dark" ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900")}`}
              >
                {item === "home" ? "Home"
                  : item === "vision" ? "Vision"
                    : item === "about" ? "About"
                      : item === "team" ? "Our Team"
                        : item === "events" ? "Events"
                          : "Contact Us"}
                {activeTab === item && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-luna-300 rounded-full shadow-[0_0_10px_rgba(84,172,191,0.8)] animate-pulse" />
                )}
              </a>
            ))}

            {isLoggedIn && (
              <a
                href="#/dashboard"
                className={`text-xs lg:text-sm font-semibold tracking-wide uppercase transition-all duration-300 relative py-2 px-1
                  ${activeTab === "dashboard"
                    ? (theme === "dark" ? "text-luna-300 font-bold" : "text-luna-700 font-bold")
                    : (theme === "dark" ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900")}`}
              >
                Dashboard
                {activeTab === "dashboard" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-luna-300 rounded-full shadow-[0_0_10px_rgba(84,172,191,0.8)] animate-pulse" />
                )}
              </a>
            )}

            <a
              href="/assests/NITPY Placement Brochure 2025-26 (6).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-4 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2
                ${theme === "dark"
                  ? "border-luna-300/30 hover:border-luna-300 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md"
                  : "border-luna-600/30 hover:border-luna-600 bg-luna-50/50 hover:bg-luna-100/70 text-luna-900 backdrop-blur-md"}`}
            >
              <FileText size={15} className={theme === "dark" ? "text-luna-300" : "text-luna-600"} />
              Brochure
            </a>

            {isLoggedIn ? (
              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <button
                  onClick={() => setIsAccountModalOpen(true)}
                  className="w-10 h-10 rounded-full bg-luna-300/10 border-2 border-luna-300/50 hover:border-luna-300 flex items-center justify-center text-luna-300 text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105"
                  title="My Account Settings"
                >
                  {userName.charAt(0).toUpperCase()}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="ml-4 px-6 py-2.5 rounded-full text-sm font-bold bg-luna-300 hover:bg-luna-50 text-luna-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(84,172,191,0.5)] flex items-center gap-2 border border-luna-300"
              >
                <LogIn size={15} />
                Login
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2.5 rounded-full border transition-all duration-300
                ${theme === "dark"
                  ? "bg-luna-800/50 border-luna-300/20 text-luna-300 hover:bg-luna-300 hover:text-luna-950"
                  : "bg-white/60 border-luna-500/20 text-luna-800 hover:bg-luna-800 hover:text-white"}`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </nav>

          {/* Mobile Navigation controls */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full border border-luna-300/20 bg-luna-800/20 text-luna-300"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {isLoggedIn && (
              <a
                href="#/dashboard"
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-luna-300/20 border border-luna-300/40 text-luna-300 transition-all font-sans"
              >
                Dashboard
              </a>
            )}

            {isLoggedIn ? (
              <button
                onClick={() => setIsAccountModalOpen(true)}
                className="w-8 h-8 rounded-full bg-luna-300/10 border-2 border-luna-300/50 hover:border-luna-300 flex items-center justify-center text-luna-300 text-xs font-bold shadow-lg transition-all duration-300"
                title="My Account Settings"
              >
                {userName.charAt(0).toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-4 py-2 rounded-full text-xs font-bold bg-luna-300 text-luna-950 hover:bg-luna-50 transition-all"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {activeTab !== "home" && (
        <div className="relative h-[35vh] min-h-[220px] flex items-center justify-center overflow-hidden border-b border-luna-300/10 z-10 pt-20 bg-gradient-to-b from-luna-950 via-luna-900/50 to-luna-950">
          {/* Subtle moving background blobs */}
          <div className="absolute inset-0 bg-luna-950">
            <div className="absolute w-[40vw] h-[40vw] rounded-full bg-luna-300/5 blur-[100px] -top-[10vw] -left-[10vw]"></div>
            <div className="absolute w-[40vw] h-[40vw] rounded-full bg-luna-600/5 blur-[100px] -bottom-[10vw] -right-[10vw]"></div>
            {/* Grid overlay for high-tech premium feel */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl pt-6">
            <h1 className="text-3xl sm:text-5xl font-black font-sans tracking-tight text-white mb-3 bg-gradient-to-r from-luna-300 via-luna-50 to-luna-400 bg-clip-text text-transparent drop-shadow-md">
              {activeTab === "team"
                ? "Our Placement Team"
                : activeTab === "contact"
                  ? "Contact & FAQ Support"
                  : activeTab === "about"
                    ? "About T&P Cell"
                    : activeTab === "vision"
                      ? "Placement Cell Vision"
                      : activeTab === "events"
                        ? "Upcoming Events & Calendar"
                        : activeTab === "dashboard"
                          ? "Placement Portal Dashboard"
                          : activeTab}
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-350 font-bold tracking-[0.25em] uppercase max-w-2xl mx-auto">
              {activeTab === "vision" && "Fostering strategic leadership and bridging the industrial-academic gap"}
              {activeTab === "about" && "Aims, facilities, MoUs, and recruitment guidelines of the institute"}
              {activeTab === "team" && "Dedicated faculty representatives and operations nurturing divisions"}
              {activeTab === "events" && "Chronological calendar, mock drives, and corporate presentation schedules"}
              {activeTab === "contact" && "Reach out to the placement desk, find driving routes, or view support questions"}
              {activeTab === "dashboard" && `Logged in session: ${userName} (${userRoleState.toUpperCase()})`}
            </p>
          </div>
        </div>
      )}

      {activeTab === "home" && (
        /* --- HERO SECTION with Image Slider & Parallax --- */
        <section id="home" className="relative h-screen min-h-[600px] overflow-hidden flex items-center">
          {/* Slider Background images */}
          <div className="absolute inset-0 z-0">
            {heroImages.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out
                  ${idx === heroIndex
                    ? "opacity-80 translate-x-0 scale-105 z-10"
                    : idx < heroIndex
                      ? "opacity-0 -translate-x-full scale-100 z-0"
                      : "opacity-0 translate-x-full scale-100 z-0"}`}
              >
                <img
                  src={img}
                  alt={`Campus Scene ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallbacks for campus visuals
                    const placeImages = [
                      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
                      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
                      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200"
                    ];
                    (e.target as HTMLImageElement).src = placeImages[idx];
                  }}
                />
              </div>
            ))}
            {/* Overlay Dark Glass Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-luna-950/95 via-luna-950/15 to-transparent dark:from-luna-950/95 dark:via-luna-950/20 z-20 pointer-events-none"></div>
          </div>

          {/* Hero Content Area */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-luna-300/30 bg-luna-300/10 text-luna-300 text-xs font-bold uppercase tracking-[0.25em] backdrop-blur-md mb-6 animate-pulse">
                <Sparkles size={12} />
                Nurturing Career Journeys
              </span>

              {/* Tagline slider */}
              <div className="h-[220px] md:h-[200px] flex items-center">
                <div key={heroIndex} className="animate-slide-up">
                  <h1 className="text-4xl sm:text-6xl font-black font-sans text-white tracking-tight leading-[1.1] drop-shadow-lg mb-6">
                    {heroTaglines[heroIndex].main.split(" & ").map((word, i) => (
                      <span key={i}>
                        {i > 0 && " & "}
                        <span className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-luna-300 via-luna-50 to-luna-400 font-extrabold" : ""}>
                          {word}
                        </span>
                      </span>
                    ))}
                  </h1>
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-serif max-w-2xl drop-shadow-md">
                    {heroTaglines[heroIndex].sub}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-8 py-4 rounded-full text-sm font-bold bg-luna-300 hover:bg-luna-50 text-luna-950 hover:shadow-[0_0_25px_rgba(84,172,191,0.6)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  Explore Statistics
                  <TrendingUp size={16} />
                </button>
                <button
                  onClick={() => document.getElementById("recruiters")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-8 py-4 rounded-full text-sm font-bold border border-luna-300/30 hover:border-luna-300 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  Our Recruiters
                  <ArrowRight size={16} className="text-luna-300" />
                </button>
                <a
                  href="/assests/NITPY Placement Brochure 2025-26 (6).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full text-sm font-bold border border-luna-300/30 hover:border-luna-300 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  Placement Brochure
                  <FileText size={16} className="text-luna-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Dynamic Down Chevron Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <a
              href="#/vision"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "#/vision";
              }}
              className="p-3 rounded-full border border-luna-300/20 bg-luna-950/45 text-luna-300 hover:text-white backdrop-blur-md inline-block"
            >
              <ChevronDown size={20} />
            </a>
          </div>
        </section>
      )}

      {activeTab === "home" && (
        /* --- METRICS & HEAD QUOTE STRIP --- */
        <section id="metrics-summary" className="py-16 relative z-10 border-t border-white/5 bg-gradient-to-b from-luna-950 to-luna-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

              {/* Left Column: Metric Cards Grid */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-6 fade-in-on-scroll">
                <div className="glass-panel p-6 rounded-2xl text-center hover:border-luna-300/40 transition-all duration-300 hover:scale-[1.03]">
                  <Award className="mx-auto text-luna-300 mb-3" size={28} />
                  <h5 className="text-3xl sm:text-4xl font-extrabold font-sans text-white mb-1">82.89%</h5>
                  <p className="text-xs text-slate-400 font-serif">Placement Success Rate</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center hover:border-luna-300/40 transition-all duration-300 hover:scale-[1.03]">
                  <Briefcase className="mx-auto text-luna-300 mb-3" size={28} />
                  <h5 className="text-3xl sm:text-4xl font-extrabold font-sans text-white mb-1">50+</h5>
                  <p className="text-xs text-slate-400 font-serif">Companies Visited</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center hover:border-luna-300/40 transition-all duration-300 hover:scale-[1.03]">
                  <TrendingUp className="mx-auto text-luna-300 mb-3" size={28} />
                  <h5 className="text-3xl sm:text-4xl font-extrabold font-sans text-white mb-1">23.0 LPA</h5>
                  <p className="text-xs text-slate-400 font-serif">Highest Package Offered</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center hover:border-luna-300/40 transition-all duration-300 hover:scale-[1.03]">
                  <Users className="mx-auto text-luna-300 mb-3" size={28} />
                  <h5 className="text-3xl sm:text-4xl font-extrabold font-sans text-white mb-1">160+</h5>
                  <p className="text-xs text-slate-400 font-serif">Students Placed</p>
                </div>
              </div>

              {/* Right Column: Head's Quote Box */}
              <div className="fade-in-on-scroll">
                <div className="p-8 rounded-3xl bg-luna-300/5 border border-luna-300/25 relative overflow-hidden shadow-xl">
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-luna-300/10 rounded-full blur-xl"></div>
                  <p className="text-base font-serif italic text-luna-300 leading-relaxed mb-6">
                    "Our mission is to establish NIT Puducherry as a premier node for human resource sourcing, fostering innovation-driven engineering values."
                  </p>
                  <div>
                    <span className="block text-right text-xs font-bold font-sans text-white">
                      Dr. Madappa V R Sivasubramanian
                    </span>
                    <span className="block text-right text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
                      Professor-in-Charge, Training & Placement
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {activeTab === "vision" && (
        /* --- VISION SECTION --- */
        <section id="vision" className="pt-6 pb-12 relative z-10 border-t border-white/5 vision-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Main content starts immediately below banner */}

            <div className="max-w-3xl mx-auto">
              {/* Vision Left Panel - Glass card */}
              <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden fade-in-on-scroll">
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-luna-300/10 rounded-full blur-xl"></div>

                <h4 className="text-2xl font-bold font-sans text-luna-300 mb-4 flex items-center gap-2 justify-center">
                  <GraduationCap size={24} />
                  Strategic Objectives
                </h4>
                <p className="text-slate-300 font-serif leading-relaxed mb-6 text-center">
                  The Training and Placement Cell of National Institute of Technology Puducherry is dedicated to bridging the academic-industry gap by grooming engineering graduates into leaders of tomorrow.
                </p>

                <ul className="space-y-4 font-serif text-slate-300 max-w-xl mx-auto">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-luna-300 mt-1 flex-shrink-0" />
                    <span>Nurturing students via technical masterclasses, coding bootcamps, and soft-skill workshops.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-luna-300 mt-1 flex-shrink-0" />
                    <span>Partnering with global conglomerates to establish rich placement and internship streams.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-luna-300 mt-1 flex-shrink-0" />
                    <span>Enforcing professional ethics, research competence, and leadership capability.</span>
                  </li>
                </ul>
              </div>

              {/* Content Flow Cue */}
              <div className="text-center mt-8 fade-in-on-scroll">
                <a
                  href="#core-mandates-heading"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("core-mandates-heading");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-[11px] text-slate-400 hover:text-luna-300 transition-colors font-serif inline-flex items-center gap-1.5 justify-center group"
                >
                  <span>To achieve this vision, we focus on the following mandates</span>
                  <ArrowRight size={12} className="text-luna-300 group-hover:translate-y-0.5 transition-transform rotate-90" />
                </a>
              </div>
            </div>

            {/* Focus Areas Section */}
            <div className="relative mandates-section">
              {/* Glowing Gradient Divider */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-luna-300/30 to-transparent"></div>
              {/* Background radial glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-luna-300/5 rounded-full blur-[80px] pointer-events-none -z-10"></div>

              <div id="core-mandates-heading" className="text-center mb-0">
                <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-luna-300 mb-2">Core Mandates</h2>
                <h3 className="text-3xl sm:text-4xl font-extrabold font-sans text-white">Focus Areas & Strategic Initiatives</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-serif mt-2 max-w-2xl mx-auto">What we are mainly focusing on to drive student success</p>
                <div className="w-16 h-1 bg-luna-300 mx-auto mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Core Industry Alignment",
                    desc: "Tailoring technical preparation to current trends in Artificial Intelligence, Machine Learning, VLSI design, sustainable infrastructure, and advanced smart systems.",
                    icon: <TrendingUp size={22} className="text-luna-300" />
                  },
                  {
                    title: "Holistic Development",
                    desc: "Going beyond core engineering skills to nurture communication excellence, professional ethics, corporate etiquette, and emotional resilience under competitive pressure.",
                    icon: <Award size={22} className="text-luna-300" />
                  },
                  {
                    title: "Global Linkages",
                    desc: "Opening global career avenues by facilitating international internships, joint academic publications, and smooth admission pathways for higher research studies.",
                    icon: <Globe size={22} className="text-luna-300" />
                  },
                  {
                    title: "Inclusive Opportunities",
                    desc: "Ensuring structured training and fair opportunities reach students across all disciplines, catering to both software developer and core technical engineering aspirants.",
                    icon: <Users size={22} className="text-luna-300" />
                  }
                ].map((item, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-luna-300/35 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-luna-300/10 flex items-center justify-center mb-4">
                        {item.icon}
                      </div>
                      <h6 className="text-sm font-bold font-sans text-white mb-2">{item.title}</h6>
                      <p className="text-xs text-slate-300 font-serif leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {activeTab === "about" && (
        /* --- ABOUT SECTION --- */
        <section id="about" className="pt-6 pb-12 relative z-10 bg-luna-800/10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Main content starts immediately below banner */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Feature 1 */}
              <div className="glass-panel p-8 rounded-3xl hover:border-luna-300/50 transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between group fade-in-on-scroll">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-luna-300/10 flex items-center justify-center text-luna-300 mb-6 group-hover:scale-110 transition-transform">
                    <Building2 size={24} />
                  </div>
                  <h4 className="text-xl font-bold font-sans text-white mb-3">Pre-Placement Grooming</h4>
                  <p className="text-slate-300 font-serif text-sm leading-relaxed">
                    We host comprehensive workshops focusing on technical mock tests, system design webinars, professional resume building, group discussions, and behavioral mock interviews.
                  </p>
                </div>
                <div className="mt-6 border-t border-white/5 pt-4">
                  <span
                    onClick={() => {
                      if (isLoggedIn) {
                        addToast("Downloading Pre-Placement Grooming syllabus guidelines...", "success");
                      } else {
                        setIsLoginOpen(true);
                        addToast("Please login to access syllabus guidelines", "info");
                      }
                    }}
                    className="text-xs font-semibold text-luna-300 flex items-center gap-1 cursor-pointer hover:text-luna-200 transition-colors"
                  >
                    Read syllabus guidelines
                    {isLoggedIn ? <ArrowUpRight size={14} /> : <Lock size={12} className="opacity-80" />}
                  </span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="glass-panel p-8 rounded-3xl hover:border-luna-300/50 transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between group fade-in-on-scroll">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-luna-300/10 flex items-center justify-center text-luna-300 mb-6 group-hover:scale-110 transition-transform">
                    <Briefcase size={24} />
                  </div>
                  <h4 className="text-xl font-bold font-sans text-white mb-3">Summer Internships</h4>
                  <p className="text-slate-300 font-serif text-sm leading-relaxed">
                    Facilitating mandatory industrial internships at MNCs, R&D labs, and top-tier public sectors during pre-final semesters to ensure early real-world exposure.
                  </p>
                </div>
                <div className="mt-6 border-t border-white/5 pt-4">
                  <span
                    onClick={() => {
                      if (isLoggedIn) {
                        addToast("Downloading Summer Internship guidelines document...", "success");
                      } else {
                        setIsLoginOpen(true);
                        addToast("Please login to access internship guidelines", "info");
                      }
                    }}
                    className="text-xs font-semibold text-luna-300 flex items-center gap-1 cursor-pointer hover:text-luna-200 transition-colors"
                  >
                    Internship guidelines
                    {isLoggedIn ? <ArrowUpRight size={14} /> : <Lock size={12} className="opacity-80" />}
                  </span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="glass-panel p-8 rounded-3xl hover:border-luna-300/50 transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between group fade-in-on-scroll">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-luna-300/10 flex items-center justify-center text-luna-300 mb-6 group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <h4 className="text-xl font-bold font-sans text-white mb-3">Alumni Linkages</h4>
                  <p className="text-slate-300 font-serif text-sm leading-relaxed">
                    Bridging connections with distinguished alumni globally through virtual fireside chats, mentor circles, and expert lectures to guide active job candidates.
                  </p>
                </div>
                <div className="mt-6 border-t border-white/5 pt-4">
                  <span
                    onClick={() => {
                      if (isLoggedIn) {
                        addToast("Redirecting to NITPY Alumni portal...", "success");
                      } else {
                        setIsLoginOpen(true);
                        addToast("Please login to connect with alumni", "info");
                      }
                    }}
                    className="text-xs font-semibold text-luna-300 flex items-center gap-1 cursor-pointer hover:text-luna-200 transition-colors"
                  >
                    Connect with alumni
                    {isLoggedIn ? <ArrowUpRight size={14} /> : <Lock size={12} className="opacity-80" />}
                  </span>
                </div>
              </div>

            </div>

            {/* --- NEW SECTION: T&P Activities, Aims, Infrastructure & Prep --- */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Card 1: Overview & Mission */}
              <div className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-luna-300/30 transition-all duration-350 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold font-sans text-white mb-4 flex items-center gap-2">
                    <GraduationCap size={18} className="text-luna-300" />
                    Overview & Mission
                  </h4>
                  <p className="text-xs text-slate-300 font-serif leading-relaxed mb-4">
                    Established in **2009 under the 11th Five Year Plan**, Govt. of India. Delivering excellence in value-based engineering education.
                  </p>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <span className="text-[9px] text-luna-300 font-bold uppercase tracking-wider block font-sans mb-1">Mission Statement</span>
                  <p className="text-[11px] text-slate-350 font-serif italic">"To deliver excellent, relevant, and value-based technical education and research."</p>
                </div>
              </div>

              {/* Card 2: Facilities & Infrastructure */}
              <div className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-luna-300/30 transition-all duration-350 flex flex-col">
                <h4 className="text-base font-bold font-sans text-white mb-4 flex items-center gap-2">
                  <Building2 size={18} className="text-luna-300" />
                  Facilities & Support
                </h4>
                <ul className="space-y-2.5 font-serif text-xs text-slate-300 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-luna-300 font-bold">•</span>
                    <span>Dedicated climate-controlled T&P Office.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-luna-300 font-bold">•</span>
                    <span>Fully equipped online exam assessment labs.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-luna-300 font-bold">•</span>
                    <span>Soundproof Group Discussion & HR rooms.</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: Placement Preparation training */}
              <div className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-luna-300/30 transition-all duration-350 flex flex-col">
                <h4 className="text-base font-bold font-sans text-white mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-luna-300" />
                  Placement Prep
                </h4>
                <ul className="space-y-2.5 font-serif text-xs text-slate-300 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-luna-300 font-bold">•</span>
                    <span>Quantitative aptitude, logic & verbal mock tests.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-luna-300 font-bold">•</span>
                    <span>Coding bootcamps covering DSA, SQL & System Design.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-luna-300 font-bold">•</span>
                    <span>Mock interviews and GD reviews with industry experts.</span>
                  </li>
                </ul>
              </div>

              {/* Card 4: Rankings & Research */}
              <div className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-luna-300/30 transition-all duration-350 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold font-sans text-white mb-4 flex items-center gap-2">
                    <Award size={18} className="text-luna-300" />
                    Rankings & Research
                  </h4>
                  <ul className="space-y-1.5 font-serif text-[11px] text-slate-300 leading-relaxed">
                    <li>• **NIRF 2024:** 97th in Engineering</li>
                    <li>• **India Today 2025:** 26th (Govt. Colleges)</li>
                    <li>• **QS 2025:** 240th Southern Asia, 751st Asia</li>
                  </ul>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3">
                  <span className="text-[9px] text-luna-300 font-bold uppercase tracking-wider block font-sans mb-1">Publications & Patents</span>
                  <p className="text-[11px] text-slate-350 font-serif font-semibold">1,970+ Publications | 33 Patents</p>
                </div>
              </div>

            </div>

            {/* Team Nurturing Verticals / Our Operations */}
            <div className="mt-10 border-t border-white/5 pt-8">
              <div className="text-center mb-0">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-luna-300 mb-2">Our Operations</h4>
                <h5 className="text-2xl font-extrabold font-sans text-white">Nurturing Verticals & Training Objectives</h5>
                <p className="text-xs text-slate-400 font-serif mt-2">How our placement team actively prepares and guides the student batch</p>
                <div className="w-12 h-0.5 bg-luna-300 mx-auto mt-3 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    title: "Technical Competency Nurturing",
                    desc: "Faculty-led coding challenges, system design mock runs, and daily technical review sessions. We help students master core data structures, algorithms, and DBMS fundamentals required by top-tier recruiters.",
                    badge: "Coding & Core Eng"
                  },
                  {
                    title: "Behavioral & Soft Skills Development",
                    desc: "Weekly mock group discussions, interactive communication drills, and custom resume writing sessions. Our mentors provide continuous constructive feedback to refine confidence and presentation style.",
                    badge: "Interviews & GD"
                  },
                  {
                    title: "Industry Relations & Slot Booking",
                    desc: "The cell actively bridges and initiates collaborations with HR teams worldwide, arranging online/offline pre-placement talks (PPTs) and scheduling selection slots according to academic convenience.",
                    badge: "Corporate Outreach"
                  },
                  {
                    title: "Student Mentorship & Welfare Care",
                    desc: "Providing 1-on-1 career counseling, guidance on choosing appropriate job tracks, and robust stress management support during the placement process to ensure student well-being.",
                    badge: "Holistic Guidance"
                  }
                ].map((vertical, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-luna-300/30 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-luna-300/10 border border-luna-300/30 text-[9px] font-bold text-luna-300 uppercase tracking-widest font-sans mb-3 inline-block">
                        {vertical.badge}
                      </span>
                      <h6 className="text-base font-bold font-sans text-white mb-2">{vertical.title}</h6>
                      <p className="text-xs text-slate-355 font-serif leading-relaxed">{vertical.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement Calendar & Lifecycle */}
            <div className="mt-10 border-t border-white/5 pt-8">
              <div className="text-center mb-0">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-luna-300 mb-2">Process flow</h4>
                <h5 className="text-2xl font-extrabold font-sans text-white">Placement Calendar & Lifecycle</h5>
                <p className="text-xs text-slate-400 font-serif mt-2">The structured chronological schedule of events during the recruitment session</p>
                <div className="w-12 h-0.5 bg-luna-300 mx-auto mt-3 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    step: "01",
                    title: "Registration & Resume Build",
                    time: "August - September",
                    desc: "Students register on the T&P portal, verifying their marks sheets. Portfolios and resumes are built and frozen after strict reviews."
                  },
                  {
                    step: "02",
                    title: "Pre-Placement Talks",
                    time: "September - October",
                    desc: "Recruiters present their organizations' work cultures, CTC breakdown structure, and growth opportunities during online and offline seminars."
                  },
                  {
                    step: "03",
                    title: "Online Assessments",
                    time: "October - November",
                    desc: "Aptitude, coding, and core engineering assessments are hosted in our laboratories or via online proctored exam portals."
                  },
                  {
                    step: "04",
                    title: "Interviews & Selection",
                    time: "November onwards",
                    desc: "Panel interviews (Technical, Managerial, and HR) are conducted on pre-selected slot dates with same-day final list declarations."
                  }
                ].map((phase, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-luna-300/30 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <span className="text-3xl font-black font-sans text-luna-300/40 block mb-4">{phase.step}</span>
                      <h6 className="text-sm font-bold font-sans text-white mb-1">{phase.title}</h6>
                      <span className="text-[10px] text-luna-300 font-semibold uppercase tracking-wider block mb-3">{phase.time}</span>
                      <p className="text-xs text-slate-300 font-serif leading-relaxed">{phase.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- NEW SECTION: Recruitment Process Flow Timeline --- */}
            <div className="mt-10">
              <div className="text-center mb-0">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-luna-300 mb-2">Operational Guidelines</h4>
                <h5 className="text-2xl font-extrabold font-sans text-white">Placement Process Flow</h5>
                <div className="w-12 h-0.5 bg-luna-300 mx-auto mt-3 rounded-full"></div>
              </div>

              <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
                {/* Step 1: Invitation */}
                <div className="relative pl-8 md:pl-12 group">
                  <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-luna-950 border border-luna-300 flex items-center justify-center text-luna-300 font-bold text-xs group-hover:bg-luna-300 group-hover:text-luna-950 transition-colors">
                    1
                  </div>
                  <h6 className="text-base font-bold font-sans text-white group-hover:text-luna-300 transition-colors">1. Invitation</h6>
                  <p className="text-xs font-serif text-slate-400 mt-2 leading-relaxed max-w-4xl">
                    The Placement Office formally invites organizations along with the placement brochure and the Job Announcement Form (JAF).
                  </p>
                </div>

                {/* Step 2: Registration */}
                <div className="relative pl-8 md:pl-12 group">
                  <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-luna-950 border border-luna-300 flex items-center justify-center text-luna-300 font-bold text-xs group-hover:bg-luna-300 group-hover:text-luna-950 transition-colors">
                    2
                  </div>
                  <h6 className="text-base font-bold font-sans text-white group-hover:text-luna-300 transition-colors">2. Registration</h6>
                  <p className="text-xs font-serif text-slate-400 mt-2 leading-relaxed max-w-4xl">
                    Eligible students register themselves for the drive based on company requirements, and corporate selections slotting is finalized.
                  </p>
                </div>

                {/* Step 3: Evaluation */}
                <div className="relative pl-8 md:pl-12 group">
                  <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-luna-950 border border-luna-300 flex items-center justify-center text-luna-300 font-bold text-xs group-hover:bg-luna-300 group-hover:text-luna-950 transition-colors">
                    3
                  </div>
                  <h6 className="text-base font-bold font-sans text-white group-hover:text-luna-300 transition-colors">3. Evaluation</h6>
                  <p className="text-xs font-serif text-slate-400 mt-2 leading-relaxed max-w-4xl">
                    The selection process starts with Pre-Placement Talks (PPTs), followed by examinations, tests, group discussions, and technical/HR interviews.
                  </p>
                </div>

                {/* Step 4: Selection */}
                <div className="relative pl-8 md:pl-12 group">
                  <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-luna-950 border border-luna-300 flex items-center justify-center text-luna-300 font-bold text-xs group-hover:bg-luna-300 group-hover:text-luna-950 transition-colors">
                    4
                  </div>
                  <h6 className="text-base font-bold font-sans text-white group-hover:text-luna-300 transition-colors">4. Selection ("One Student, One Job" Policy)</h6>
                  <p className="text-xs font-serif text-slate-400 mt-2 leading-relaxed max-w-4xl">
                    Recruiters finalize their offers. To give all candidates a fair opportunity, a strict **“One Student, One Job”** policy is maintained.
                  </p>
                </div>
              </div>
            </div>

            {/* --- NEW SECTION: Collaborations & MoUs --- */}
            <div className="mt-12">
              <div className="text-center mb-0">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-luna-300 mb-2">Strong Alliances</h4>
                <h5 className="text-2xl font-extrabold font-sans text-white">Collaborations, MoUs & Workshops</h5>
                <div className="w-12 h-0.5 bg-luna-300 mx-auto mt-3 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-7xl mx-auto">

                {/* Academic & Research MoUs */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h5 className="text-base font-bold font-sans text-luna-300 mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                      <GraduationCap size={18} />
                      Academic & Research MoUs
                    </h5>
                    <div className="space-y-4">
                      {[
                        { partner: "Indian Institute of Technology Madras (IITM)", detail: "Joint academic research ventures and higher study streams." },
                        { partner: "Association Leonard De Vinci (ADLV), France", detail: "Global student/faculty exchanges." },
                        { partner: "NITK Surathkal", detail: "Space research and regional technological collaborative schemes." },
                        { partner: "Federal University of Rio De Janeiro", detail: "International collaboration and joint research ventures." },
                        { partner: "PHYTEC Embedded", detail: "Industrial research in embedded electronics." },
                        { partner: "National Chung Cheng University (Taiwan)", detail: "International academic exchange and joint seminars." }
                      ].map((mou, index) => (
                        <div key={index} className="flex gap-2 items-start group text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-luna-300 mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                          <div>
                            <h6 className="font-bold font-sans text-white group-hover:text-luna-300 transition-colors">{mou.partner}</h6>
                            <p className="font-serif text-slate-350 mt-0.5 leading-relaxed">{mou.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Placement & Training MoUs */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h5 className="text-base font-bold font-sans text-luna-300 mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                      <Briefcase size={18} />
                      Placement & Training MoUs
                    </h5>
                    <div className="space-y-4">
                      {[
                        { partner: "ABB Global", detail: "Internship streams and recruitment opportunities." },
                        { partner: "NexTurn India", detail: "Recruitment-oriented skill training and hiring." },
                        { partner: "Anavadya Softech", detail: "Industry-academia collaborative software programs." },
                        { partner: "Karaikal Port", detail: "Industrial training, internships, and R&D support." },
                        { partner: "OGOENERGY", detail: "Joint R&D in electric vehicle battery technology." },
                        { partner: "NHAI", detail: "Student exposure to national highway and transport structures." }
                      ].map((mou, index) => (
                        <div key={index} className="flex gap-2 items-start group text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-luna-300 mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                          <div>
                            <h6 className="font-bold font-sans text-white group-hover:text-luna-300 transition-colors">{mou.partner}</h6>
                            <p className="font-serif text-slate-355 mt-0.5 leading-relaxed">{mou.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Workshops & Specialized Training */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h5 className="text-base font-bold font-sans text-luna-300 mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                      <Sparkles size={18} />
                      Workshops & Training
                    </h5>
                    <div className="space-y-4">
                      {[
                        { topic: "Blockchain Technology", host: "Samsung", detail: "In-depth labs on decentralized tech and smart contract systems." },
                        { topic: "HDL Coder & SoC Designs", host: "MathWorks", detail: "Practical code generation and FPGA hardware prototyping." },
                        { topic: "Generative AI (GenAI)", host: "Industry Experts", detail: "Seminars on large language models and prompt engineering." },
                        { topic: "6G Networks & Communication", host: "Research Labs", detail: "Exploration of next-generation wireless technologies." },
                        { topic: "Disaster Resilient Infrastructure", host: "Civil Department", detail: "Specialized training on durable materials for infrastructure." }
                      ].map((ws, index) => (
                        <div key={index} className="flex gap-2 items-start group text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-luna-300 mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                          <div>
                            <h6 className="font-bold font-sans text-white group-hover:text-luna-300 transition-colors">
                              {ws.topic} <span className="text-slate-400 font-normal">({ws.host})</span>
                            </h6>
                            <p className="font-serif text-slate-350 mt-0.5 leading-relaxed">{ws.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "dashboard" && isLoggedIn && (
        <section id="portal-dashboard" className="pt-6 pb-20 relative z-10 bg-luna-800/10 border-t border-white/5 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Dashboard Container */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

              {/* Left Side-Nav Sidebar */}
              <div className="lg:col-span-1 flex flex-col gap-2">
                <div className="glass-panel p-6 rounded-3xl mb-4 border border-luna-300/20 text-center">
                  <div className="w-20 h-20 rounded-full bg-luna-300/20 border-2 border-luna-300 flex items-center justify-center text-luna-300 text-3xl font-bold mx-auto mb-4 shadow-lg shadow-luna-300/20 uppercase">
                    {userName.charAt(0)}
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 leading-tight">{userName}</h3>
                  <p className="text-[10px] text-luna-300 font-bold uppercase tracking-widest">{userRoleState}</p>
                </div>

                {/* Role Specific Tabs */}
                {userRoleState === "student" && currentStudent && (
                  <div className="glass-panel p-4 rounded-3xl border border-white/5 flex flex-col gap-1.5">
                    {[
                      { id: "profile", label: "My Profile", icon: <User size={16} /> },
                      { id: "companies", label: "Job Drives", icon: <Briefcase size={16} /> },
                      { id: "tracker", label: "App Tracker", icon: <TrendingUp size={16} /> },
                      { id: "events", label: "Events & RSVPs", icon: <Calendar size={16} /> },
                      { id: "resume", label: "ATS Score Checker", icon: <FileText size={16} /> },
                      { id: "placed-directory", label: "Placed Directory", icon: <Users size={16} /> },
                      { id: "settings", label: "Portal Settings", icon: <Settings size={16} /> }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setStudentDashTab(tab.id)}
                        className={`w-full py-3 px-4 rounded-2xl text-left text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-3
                          ${studentDashTab === tab.id
                            ? "bg-luna-300 text-luna-950 shadow-md shadow-luna-300/10"
                            : "text-slate-300 hover:text-white hover:bg-white/5"}`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}

                {userRoleState === "pr" && (
                  <div className="glass-panel p-4 rounded-3xl border border-white/5 flex flex-col gap-1.5">
                    {[
                      { id: "companies", label: "Manage Drives", icon: <Briefcase size={16} /> },
                      { id: "schedule", label: "Add Event Drive", icon: <Plus size={16} /> },
                      { id: "placed-directory", label: "Placed Registry & CSV", icon: <Users size={16} /> },
                      { id: "prs", label: "Manage PRs", icon: <Users size={16} /> }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setPrDashTab(tab.id)}
                        className={`w-full py-3 px-4 rounded-2xl text-left text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-3
                          ${prDashTab === tab.id
                            ? "bg-luna-300 text-luna-950 shadow-md shadow-luna-300/10"
                            : "text-slate-300 hover:text-white hover:bg-white/5"}`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}

                {userRoleState === "departmental" && (
                  <div className="glass-panel p-4 rounded-3xl border border-white/5 flex flex-col gap-1.5">
                    {[
                      { id: "students", label: "Student Records", icon: <Users size={16} /> },
                      { id: "metrics", label: "System Metrics", icon: <BarChart3 size={16} /> },
                      { id: "placed-directory", label: "Placed Registry & CSV", icon: <Users size={16} /> },
                      { id: "prs", label: "Manage PRs", icon: <Users size={16} /> }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setDepartmentalDashTab(tab.id)}
                        className={`w-full py-3 px-4 rounded-2xl text-left text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-3
                          ${departmentalDashTab === tab.id
                            ? "bg-luna-300 text-luna-950 shadow-md shadow-luna-300/10"
                            : "text-slate-300 hover:text-white hover:bg-white/5"}`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Content Area */}
              <div className="lg:col-span-3">
                {/* --- STUDENT DASHBOARD CONTENTS --- */}
                {userRoleState === "student" && currentStudent && (
                  <div>
                    {/* PROFILE TAB */}
                    {studentDashTab === "profile" && (
                      <div className="space-y-6 animate-fade-in text-xs">
                        {/* Summary Header */}
                        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-luna-300/5 rounded-full blur-2xl"></div>
                          <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-luna-300/10 border border-luna-300/30 flex items-center justify-center text-luna-300 text-4xl font-bold uppercase shadow-inner">
                              {currentStudent.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="text-center sm:text-left flex-grow">
                              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1.5">
                                <h2 className="text-2xl font-black text-white leading-tight">{currentStudent.name}</h2>
                                {currentStudent.isPlaced ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/35 text-[9px] font-bold text-yellow-400 uppercase tracking-wider animate-pulse font-sans">
                                    Placed 🎉
                                  </span>
                                ) : currentStudent.isEligible ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-[9px] font-bold text-emerald-400 uppercase tracking-wider font-sans">
                                    Placement Eligible
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/35 text-[9px] font-bold text-red-400 uppercase tracking-wider font-sans">
                                    Ineligible - Contact T&P
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-300 text-xs font-semibold font-serif mb-3">
                                {currentStudent.department} • {currentStudent.year} • Roll No: {currentStudent.rollNo.toUpperCase()}
                              </p>

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md pt-3 border-t border-white/5 font-sans">
                                <div>
                                  <span className="text-[10px] text-slate-400 uppercase block tracking-wider">CGPA</span>
                                  <span className="text-lg font-black text-white">{currentStudent.cgpa} / 10.0</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 uppercase block tracking-wider">Credits</span>
                                  <span className="text-lg font-black text-white">{currentStudent.creditsEarned} / 85</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 uppercase block tracking-wider">Contact</span>
                                  <span className="text-xs font-semibold text-white block truncate">{currentStudent.phone}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Achievements / Certifications Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Achievements */}
                          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                            <div>
                              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
                                <Award size={16} className="text-luna-300" />
                                Achievements
                              </h4>
                              <ul className="space-y-2.5 text-xs text-slate-300 font-serif">
                                {currentStudent.achievements.map((item, i) => (
                                  <li key={i} className="flex gap-2 items-start">
                                    <span className="text-luna-300 mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <button
                              onClick={() => {
                                const val = prompt("Enter new achievement:");
                                if (val) {
                                  updateLoggedInStudent({ achievements: [...currentStudent.achievements, val] });
                                  addToast("Added achievement!", "success");
                                }
                              }}
                              className="mt-6 w-full py-2 bg-white/5 border border-white/10 hover:border-luna-300 text-[10px] uppercase font-bold text-white rounded-xl transition-all font-sans"
                            >
                              + Add Achievement
                            </button>
                          </div>

                          {/* Certifications */}
                          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                            <div>
                              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
                                <CheckCircle size={16} className="text-luna-300" />
                                Certifications
                              </h4>
                              <ul className="space-y-2.5 text-xs text-slate-300 font-serif">
                                {currentStudent.certifications.map((item, i) => (
                                  <li key={i} className="flex gap-2 items-start">
                                    <span className="text-luna-300 mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <button
                              onClick={() => {
                                const val = prompt("Enter new certification:");
                                if (val) {
                                  updateLoggedInStudent({ certifications: [...currentStudent.certifications, val] });
                                  addToast("Added certification!", "success");
                                }
                              }}
                              className="mt-6 w-full py-2 bg-white/5 border border-white/10 hover:border-luna-300 text-[10px] uppercase font-bold text-white rounded-xl transition-all font-sans"
                            >
                              + Add Certification
                            </button>
                          </div>

                          {/* Internships */}
                          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                            <div>
                              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
                                <Briefcase size={16} className="text-luna-300" />
                                Internships
                              </h4>
                              <ul className="space-y-2.5 text-xs text-slate-300 font-serif">
                                {currentStudent.internships.map((item, i) => (
                                  <li key={i} className="flex gap-2 items-start">
                                    <span className="text-luna-300 mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <button
                              onClick={() => {
                                const val = prompt("Enter new internship:");
                                if (val) {
                                  updateLoggedInStudent({ internships: [...currentStudent.internships, val] });
                                  addToast("Added internship!", "success");
                                }
                              }}
                              className="mt-6 w-full py-2 bg-white/5 border border-white/10 hover:border-luna-300 text-[10px] uppercase font-bold text-white rounded-xl transition-all font-sans"
                            >
                              + Add Internship
                            </button>
                          </div>
                        </div>

                        {/* Current Academic & Placement Status Form */}
                        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden font-sans">
                          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <TrendingUp size={16} className="text-luna-300" />
                            Academic & Placement Status Settings
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Academic Status Selection */}
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">Academic Status</label>
                              <select
                                value={localAcademicStatus}
                                onChange={(e) => setLocalAcademicStatus(e.target.value)}
                                className="w-full bg-luna-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 font-sans cursor-pointer"
                              >
                                <option value="Active">Active</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Graduated">Graduated</option>
                              </select>
                            </div>

                            {/* Placement Readiness */}
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">Placement Readiness</label>
                              <select
                                value={localPlacementReadiness}
                                onChange={(e) => setLocalPlacementReadiness(e.target.value)}
                                className="w-full bg-luna-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 font-sans cursor-pointer"
                              >
                                <option value="Fully Ready">Fully Ready</option>
                                <option value="Needs Preparation">Needs Preparation</option>
                                <option value="Not Started">Not Started</option>
                              </select>
                            </div>

                            {/* Internship/Placement Progress */}
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">Internship & Placement Progress</label>
                              <select
                                value={localPlacementProgress}
                                onChange={(e) => setLocalPlacementProgress(e.target.value)}
                                className="w-full bg-luna-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 font-sans cursor-pointer"
                              >
                                <option value="Seeking Internship">Seeking Internship</option>
                                <option value="Internship Secured">Internship Secured</option>
                                <option value="Seeking Placement">Seeking Placement</option>
                                <option value="Placed">Placed</option>
                                <option value="Unplaced">Unplaced</option>
                              </select>
                            </div>

                            {/* Skills Tag Edit Input */}
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">Core Skills List</label>
                              <input
                                type="text"
                                value={localSkills}
                                onChange={(e) => setLocalSkills(e.target.value)}
                                placeholder="React, Python, SQL, C++"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-luna-300 font-sans font-semibold"
                              />
                            </div>
                          </div>

                          {/* Save Settings and Unsaved Changes Warning Panel */}
                          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              {hasUnsavedSettingsChanges ? (
                                <>
                                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-ping"></span>
                                  <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Unsaved Changes (Click Save to Apply)</span>
                                </>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">All Settings Saved</span>
                              )}
                            </div>
                            <button
                              onClick={handleSaveStatusSettings}
                              className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer
                                ${hasUnsavedSettingsChanges
                                  ? "bg-luna-300 hover:bg-luna-50 text-luna-950 shadow-[0_0_15px_rgba(202,242,16,0.3)] animate-pulse"
                                  : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"}`}
                            >
                              Save Settings
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* COMPANIES TAB */}
                    {studentDashTab === "companies" && (
                      <div className="space-y-6 animate-fade-in font-sans">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-black text-white">Active Recruiter Job Openings</h3>
                            <p className="text-xs text-slate-400 font-serif">Apply to verified drives. Check eligibility threshold beforehand.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {companies.filter(c => c.status === "active").map((company, index) => {
                            const isApplied = currentStudent.appliedCompanies?.includes(company.name);
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
                                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase transition-all duration-300 relative z-20
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

                    {/* EVENTS TAB */}
                    {studentDashTab === "events" && (
                      <div className="space-y-6 animate-fade-in font-sans">
                        <div>
                          <h3 className="text-xl font-black text-white">Recruitment Schedule & Seminars</h3>
                          <p className="text-xs text-slate-400 font-serif">Mark your RSVP status to receive automated notifications.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {events.map((event) => {
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

                    {/* APPLICATION TRACKER TAB */}
                    {studentDashTab === "tracker" && (
                      <div className="space-y-6 animate-fade-in font-sans">
                        <div>
                          <h3 className="text-xl font-black text-white">Application Pipeline Tracker</h3>
                          <p className="text-xs text-slate-400 font-serif">Track and update your recruitment pipeline phases for each applied company.</p>
                        </div>

                        {(!currentStudent.appliedCompanies || currentStudent.appliedCompanies.length === 0) ? (
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
                            {currentStudent.appliedCompanies.map((companyName) => {
                              const currentStatus = currentStudent.applicationStatuses?.[companyName] || "Applied";
                              const steps = ["Applied", "Shortlisted", "Interview Scheduled", "Offer Received"] as const;
                              const currentStepIndex = steps.indexOf(currentStatus as any);

                              return (
                                <div key={companyName} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
                                  {/* Header info */}
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

                                    {/* Action Buttons to update status */}
                                    <div className="flex flex-wrap gap-1.5 font-sans text-[10px]">
                                      {steps.map((step) => (
                                        <button
                                          key={step}
                                          onClick={() => {
                                            const updatedStatuses = {
                                              ...(currentStudent.applicationStatuses || {}),
                                              [companyName]: step
                                            };
                                            updateLoggedInStudent({ applicationStatuses: updatedStatuses });
                                            addToast(`Updated application status for ${companyName} to ${step}!`, "success");
                                          }}
                                          className={`px-3 py-1.5 rounded-lg border font-bold uppercase transition-all cursor-pointer
                                            ${currentStatus === step
                                              ? "bg-luna-300 border-luna-300 text-luna-950 shadow-md shadow-luna-300/15"
                                              : "bg-white/5 border-white/10 hover:border-white/25 text-slate-300"}`}
                                        >
                                          {step}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Horizontal Stepper timeline */}
                                  <div className="relative pt-2 pb-6">
                                    {/* Connector Line */}
                                    <div className="absolute top-[21px] left-[10%] right-[10%] h-[2px] bg-white/5 -z-10"></div>
                                    <div
                                      className="absolute top-[21px] left-[10%] h-[2px] bg-luna-300 transition-all duration-500 -z-10"
                                      style={{ width: `${currentStepIndex * 26.6}%` }}
                                    ></div>

                                    {/* Stepper nodes */}
                                    <div className="flex justify-between items-center text-center">
                                      {steps.map((step, idx) => {
                                        const isCompleted = idx <= currentStepIndex;
                                        const isActive = idx === currentStepIndex;

                                        return (
                                          <div key={step} className="flex-1 flex flex-col items-center">
                                            {/* Circular node */}
                                            <div
                                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 mb-2
                                                ${isActive
                                                  ? "bg-luna-950 border-luna-300 text-luna-300 shadow-[0_0_15px_rgba(84,172,191,0.5)] scale-110"
                                                  : isCompleted
                                                    ? "bg-luna-300 border-luna-300 text-luna-950"
                                                    : "bg-luna-950 border-white/10 text-slate-600"}`}
                                            >
                                              {isCompleted ? <Check size={14} className="stroke-[3px]" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                                            </div>

                                            {/* Step text */}
                                            <span
                                              className={`text-[9px] font-black uppercase tracking-wider block font-sans transition-colors
                                                ${isActive
                                                  ? "text-luna-300"
                                                  : isCompleted ? "text-white" : "text-slate-550"}`}
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

                    {/* RESUME ATS SCORE CHECKER TAB */}
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
                              <div className="absolute inset-0 border-4 border-luna-300/20 rounded-full"></div>
                              <div className="absolute inset-0 border-4 border-luna-300 border-t-transparent rounded-full animate-spin"></div>
                              <FileText className="absolute inset-0 m-auto text-luna-300 animate-bounce" size={32} />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Analyzing ATS Compatibility...</h4>
                            <p className="text-xs text-luna-300 font-bold uppercase tracking-widest mb-4 font-sans">{scanStep}</p>

                            {/* Scanning laser line animation */}
                            <div className="w-64 bg-white/5 h-2 rounded-full overflow-hidden relative mt-2 border border-white/10">
                              <div className="bg-luna-300 h-full w-1/2 rounded-full absolute animate-[pulse_1.5s_infinite]"></div>
                            </div>
                          </div>
                        )}

                        {/* Analysis Complete Results View */}
                        {!isAtsAnalyzing && atsScore !== null && (
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Score Ring Summary Column */}
                            <div className="lg:col-span-1 glass-panel p-6 sm:p-8 rounded-3xl border border-luna-300/30 text-center flex flex-col items-center">
                              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">ATS Match Rating</h4>

                              {/* Large Circular Gauge */}
                              <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="72" cy="72" r="62" className="stroke-white/5 fill-none" strokeWidth="10" />
                                  <circle
                                    cx="72"
                                    cy="72"
                                    r="62"
                                    className={`fill-none transition-all duration-1000 ${atsScore >= 85 ? "stroke-emerald-400" : atsScore >= 70 ? "stroke-yellow-400" : "stroke-red-400"
                                      }`}
                                    strokeWidth="10"
                                    strokeDasharray={2 * Math.PI * 62}
                                    strokeDashoffset={2 * Math.PI * 62 * (1 - atsScore / 100)}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute text-center">
                                  <span className="text-4xl font-black text-white">{atsScore}</span>
                                  <span className="text-xs text-slate-400 block font-bold">/ 100</span>
                                </div>
                              </div>

                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border ${atsScore >= 85 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                                atsScore >= 70 ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
                                  "bg-red-500/10 border-red-500/30 text-red-400"
                                }`}>
                                {atsScore >= 85 ? "Strong Candidate" : atsScore >= 70 ? "Needs Fine-Tuning" : "Critical Improvements"}
                              </span>

                              {/* Percentile Ranking Display */}
                              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 w-full flex items-center justify-between mb-4">
                                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                                  <TrendingUp size={12} className="text-luna-300" />
                                  Pool Percentile
                                </div>
                                <span className="text-xs font-black text-white">Top {atsReport?.percentile || 12}% match</span>
                              </div>

                              {/* Calibration Parameters Box */}
                              <div className="bg-luna-300/5 border border-luna-300/25 rounded-2xl p-4 text-[10px] w-full text-left font-sans space-y-1.5 mb-6">
                                <div className="font-bold text-luna-300 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                  <Sliders size={12} />
                                  Calibrated Weights
                                </div>
                                <div className="flex justify-between text-slate-350">
                                  <span>Mode:</span>
                                  <span className="capitalize font-bold text-white">{atsCalibrationMode}</span>
                                </div>
                                <div className="flex justify-between text-slate-350">
                                  <span>Work Experience:</span>
                                  <span className="font-bold text-white">
                                    {atsCalibrationMode === "tech" ? "30%" : atsCalibrationMode === "consulting" ? "25%" : "35%"}
                                  </span>
                                </div>
                                <div className="flex justify-between text-slate-350">
                                  <span>Technical Skills:</span>
                                  <span className="font-bold text-white">
                                    {atsCalibrationMode === "tech" ? "45%" : atsCalibrationMode === "consulting" ? "20%" : "30%"}
                                  </span>
                                </div>
                                <div className="flex justify-between text-slate-350">
                                  <span>Education Background:</span>
                                  <span className="font-bold text-white">
                                    {atsCalibrationMode === "tech" ? "10%" : atsCalibrationMode === "consulting" ? "25%" : "15%"}
                                  </span>
                                </div>
                                <div className="flex justify-between text-slate-350">
                                  <span>Formatting & Style:</span>
                                  <span className="font-bold text-white">
                                    {atsCalibrationMode === "tech" ? "8%" : atsCalibrationMode === "consulting" ? "15%" : "10%"}
                                  </span>
                                </div>
                                <div className="flex justify-between text-slate-350">
                                  <span>Profile Summary:</span>
                                  <span className="font-bold text-white">
                                    {atsCalibrationMode === "tech" ? "7%" : atsCalibrationMode === "consulting" ? "15%" : "10%"}
                                  </span>
                                </div>
                              </div>

                              <p className="text-xs text-slate-350 font-serif leading-relaxed mb-6 font-semibold">
                                {atsReport?.justification || (atsScore >= 85 ? "Excellent compatibility! Your resume contains a rich distribution of skills and clean structure matched to recruiter rules." :
                                  atsScore >= 70 ? "Good overall alignment. Optimizing missing keywords and fixing small structural details will help you rank higher." :
                                    "Warning: The parser flagged structural complexity and low keyword density. Revise sections and formatting to bypass filters.")}
                              </p>

                              <button
                                onClick={() => {
                                  setAtsScore(null);
                                  setAtsReport(null);
                                  setUploadedResumeName("");
                                  setPastedResumeText("");
                                }}
                                className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all font-sans"
                              >
                                Check Another Resume
                              </button>
                            </div>

                            {/* Detailed Feedback & Improvements Tab Section */}
                            <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
                              {/* Sub-tab Selector */}
                              <div className="flex flex-wrap bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
                                {([
                                  { id: "diagnostic", label: "Diagnostic" },
                                  { id: "keywords", label: "Keywords" },
                                  { id: "formatting", label: "Formatting" },
                                  { id: "readability", label: "Readability" },
                                  { id: "recommendations", label: "Coach Tips" },
                                  { id: "suggestions", label: "Suggestions" },
                                  { id: "questions", label: "Interview Prep" }
                                ] as const).map(tab => (
                                  <button
                                    key={tab.id}
                                    onClick={() => setAtsFeedbackTab(tab.id)}
                                    className={`flex-1 min-w-[80px] py-2 text-center rounded-lg text-[10px] font-bold uppercase transition-all duration-300 cursor-pointer
                                      ${atsFeedbackTab === tab.id
                                        ? "bg-luna-300/15 border border-luna-300/30 text-luna-300"
                                        : "text-slate-400 hover:text-white"}`}
                                  >
                                    {tab.label}
                                  </button>
                                ))}
                              </div>

                              {/* TAB CONTENT: DIAGNOSTIC (Section by Section) */}
                              {atsFeedbackTab === "diagnostic" && (() => {
                                const report = atsReport || {
                                  diagnostic: {
                                    contact: { status: "good", note: "Primary contact fields parsed successfully." },
                                    summary: { status: "warning", note: "Professional objective found but could be refined." },
                                    education: { status: "good", note: "B.Tech education criteria matched." },
                                    experience: { status: "good", note: "Practical work listings recognized." },
                                    skills: { status: "good", note: "Core technology skills indexed." },
                                    additional: { status: "warning", note: "Ensure projects and certifications are explicitly itemized." }
                                  }
                                };
                                return (
                                  <div className="space-y-4 text-xs font-sans">
                                    <div>
                                      <h5 className="font-bold text-white text-sm mb-1">Section-by-Section Recruiter Review</h5>
                                      <p className="text-[11px] text-slate-400 font-serif">Simulated compliance parsing across standard corporate resume layout segments.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                      {/* Contact Info */}
                                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-bold text-white uppercase tracking-wider text-[10px]">Contact Information</span>
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${report.diagnostic.contact.status === "good" ? "bg-emerald-500/10 text-emerald-400" :
                                              report.diagnostic.contact.status === "warning" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
                                            }`}>
                                            {report.diagnostic.contact.status}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-350 leading-relaxed font-serif">{report.diagnostic.contact.note}</p>
                                      </div>

                                      {/* Summary/Objective */}
                                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-bold text-white uppercase tracking-wider text-[10px]">Summary & Objective</span>
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${report.diagnostic.summary.status === "good" ? "bg-emerald-500/10 text-emerald-400" :
                                              report.diagnostic.summary.status === "warning" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
                                            }`}>
                                            {report.diagnostic.summary.status}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-350 leading-relaxed font-serif">{report.diagnostic.summary.note}</p>
                                      </div>

                                      {/* Education */}
                                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-bold text-white uppercase tracking-wider text-[10px]">Education Section</span>
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${report.diagnostic.education.status === "good" ? "bg-emerald-500/10 text-emerald-400" :
                                              report.diagnostic.education.status === "warning" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
                                            }`}>
                                            {report.diagnostic.education.status}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-350 leading-relaxed font-serif">{report.diagnostic.education.note}</p>
                                      </div>

                                      {/* Experience */}
                                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-bold text-white uppercase tracking-wider text-[10px]">Work & Experience</span>
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${report.diagnostic.experience.status === "good" ? "bg-emerald-500/10 text-emerald-400" :
                                              report.diagnostic.experience.status === "warning" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
                                            }`}>
                                            {report.diagnostic.experience.status}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-350 leading-relaxed font-serif">{report.diagnostic.experience.note}</p>
                                      </div>

                                      {/* Skills */}
                                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-bold text-white uppercase tracking-wider text-[10px]">Core Skills Area</span>
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${report.diagnostic.skills.status === "good" ? "bg-emerald-500/10 text-emerald-400" :
                                              report.diagnostic.skills.status === "warning" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
                                            }`}>
                                            {report.diagnostic.skills.status}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-350 leading-relaxed font-serif">{report.diagnostic.skills.note}</p>
                                      </div>

                                      {/* Additional sections */}
                                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-bold text-white uppercase tracking-wider text-[10px]">Projects & Certifications</span>
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${report.diagnostic.additional.status === "good" ? "bg-emerald-500/10 text-emerald-400" :
                                              report.diagnostic.additional.status === "warning" ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
                                            }`}>
                                            {report.diagnostic.additional.status}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-350 leading-relaxed font-serif">{report.diagnostic.additional.note}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* TAB CONTENT: KEYWORDS */}
                              {atsFeedbackTab === "keywords" && (() => {
                                const report = atsReport || {
                                  keywordsFound: currentStudent?.resumeData?.skills.split(",").map((s: string) => s.trim()).filter(Boolean) || ["React", "JavaScript", "HTML", "CSS", "Git"],
                                  keywordsAdd: ["Docker", "Kubernetes", "System Design", "AWS Platform"],
                                  overusedTerms: ["motivated", "passionate"]
                                };
                                return (
                                  <div className="space-y-4 text-xs font-sans">
                                    <div>
                                      <h5 className="font-bold text-white text-sm mb-1">Keyword Gap Analysis</h5>
                                      <p className="text-[11px] text-slate-400 font-serif">Comparing keywords against typical job description indices for target departmental positions.</p>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                      <div>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-bold">Identified Keywords ({currentStudent?.department || "CSE"} track)</span>
                                        <div className="flex flex-wrap gap-2">
                                          {report.keywordsFound.length > 0 ? (
                                            report.keywordsFound.map((skill: string, i: number) => (
                                              <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1.5 animate-fade-in">
                                                <Check size={12} /> {skill}
                                              </span>
                                            ))
                                          ) : (
                                            <span className="text-slate-400 italic">No matches found. Check your spelling or formatting.</span>
                                          )}
                                        </div>
                                      </div>

                                      <div className="border-t border-white/5 pt-4">
                                        <span className="text-[10px] text-red-400 uppercase tracking-wider block mb-2 font-bold">Recommended Missing Keywords</span>
                                        <div className="flex flex-wrap gap-2">
                                          {report.keywordsAdd.map((skill: string, i: number) => (
                                            <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-semibold flex items-center gap-1.5">
                                              <Plus size={12} className="text-luna-300" /> {skill}
                                            </span>
                                          ))}
                                        </div>
                                      </div>

                                      {report.overusedTerms.length > 0 && (
                                        <div className="border-t border-white/5 pt-4">
                                          <span className="text-[10px] text-yellow-450 uppercase tracking-wider block mb-2 font-bold">Overused / Generic Buzzwords (Remove or replace)</span>
                                          <div className="flex flex-wrap gap-2">
                                            {report.overusedTerms.map((word: string, i: number) => (
                                              <span key={i} className="px-2.5 py-1 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-yellow-400 font-semibold flex items-center gap-1.5 line-through">
                                                ⚠ {word}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* TAB CONTENT: FORMATTING */}
                              {atsFeedbackTab === "formatting" && (() => {
                                const report = atsReport || {
                                  formattingIssues: ["Margins & layout format look clean and parser-friendly."]
                                };
                                return (
                                  <div className="space-y-4 text-xs font-sans">
                                    <div>
                                      <h5 className="font-bold text-white text-sm mb-1">Layout & Parser Risk Audit</h5>
                                      <p className="text-[11px] text-slate-400 font-serif">Scans document structure for elements known to trigger errors or text-merges in standard parser platforms.</p>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                      {report.formattingIssues.map((issue: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
                                          {issue.includes("look clean") ? (
                                            <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                          ) : (
                                            <AlertCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                                          )}
                                          <div>
                                            <h6 className="font-bold text-white">{issue.includes("look clean") ? "Layout Standard Match" : "Formatting Risk Detected"}</h6>
                                            <p className="text-[11px] text-slate-400 font-serif mt-0.5">{issue}</p>
                                          </div>
                                        </div>
                                      ))}

                                      <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
                                        <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <h6 className="font-bold text-white">File Type Support (PDF / DOCX)</h6>
                                          <p className="text-[11px] text-slate-400 font-serif mt-0.5">Compatible format. PDF/DOCX layouts preserve character streams correctly compared to visual images.</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* TAB CONTENT: READABILITY */}
                              {atsFeedbackTab === "readability" && (() => {
                                const report = atsReport || {
                                  readabilityIssues: ["Use strong active verbs to start project bullets.", "Lack of metrics: Quantify accomplishments (e.g. 'Improved speed by 30%')."]
                                };
                                return (
                                  <div className="space-y-4 text-xs font-sans">
                                    <div>
                                      <h5 className="font-bold text-white text-sm mb-1">Readability & Recruiter Appeal</h5>
                                      <p className="text-[11px] text-slate-400 font-serif">Simulates visual review of bullet points, action verbs density, and quantification of output metrics.</p>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                      {report.readabilityIssues.map((issue: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
                                          {issue.includes("Highly readable") ? (
                                            <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                          ) : (
                                            <AlertCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                                          )}
                                          <div>
                                            <h6 className="font-bold text-white">{issue.includes("Highly readable") ? "Recruiter Review Passed" : "Action Item"}</h6>
                                            <p className="text-[11px] text-slate-400 font-serif mt-0.5">{issue}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* TAB CONTENT: RECOMMENDATIONS */}
                              {atsFeedbackTab === "recommendations" && (() => {
                                const report = atsReport || {
                                  recommendations: [
                                    "Add LinkedIn profile URL.",
                                    "Incorporate 3 new technical keywords.",
                                    "Quantify achievements with percentages.",
                                    "Clean up multi-column tables.",
                                    "Keep formatting structure flat and linear."
                                  ]
                                };
                                return (
                                  <div className="space-y-4 text-xs font-sans">
                                    <div>
                                      <h5 className="font-bold text-white text-sm mb-1">Prioritized Improvement Action Checklist</h5>
                                      <p className="text-[11px] text-slate-400 font-serif">Execute these concrete changes in sequence to maximize placement pipeline ranking.</p>
                                    </div>

                                    <div className="space-y-2.5 pt-2">
                                      {report.recommendations.map((rec: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-luna-300/5 border border-luna-300/20 rounded-2xl">
                                          <span className="w-5 h-5 rounded-full bg-luna-300/10 border border-luna-300/35 text-[9px] font-black text-luna-300 flex items-center justify-center flex-shrink-0">
                                            {idx + 1}
                                          </span>
                                          <p className="text-[11px] text-slate-200 font-semibold">{rec}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* TAB CONTENT: SUGGESTIONS */}
                              {atsFeedbackTab === "suggestions" && (() => {
                                const report = atsReport || { suggestions: [] };
                                const suggestions = report.suggestions || [];
                                return (
                                  <div className="space-y-6 text-xs font-sans">
                                    <div>
                                      <h5 className="font-bold text-white text-sm mb-1">Evidence-Backed Resume Coaching & Rewrites</h5>
                                      <p className="text-[11px] text-slate-400 font-serif">Actionable suggestions with estimated score impact and location guidelines.</p>
                                    </div>

                                    {suggestions.length === 0 ? (
                                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center text-slate-400">
                                        No suggestions available. Please run the ATS analysis first.
                                      </div>
                                    ) : (
                                      <div className="space-y-4">
                                        {suggestions.map((sug: any) => (
                                          <div key={sug.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                              <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider
                                                  ${sug.priority === "High" ? "bg-red-500/15 border border-red-500/35 text-red-300" :
                                                    sug.priority === "Medium" ? "bg-amber-500/15 border border-amber-500/35 text-amber-300" :
                                                    "bg-blue-500/15 border border-blue-500/35 text-blue-300"}`}>
                                                  {sug.priority} Priority
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-bold">Location: <strong className="text-white">{sug.location}</strong></span>
                                              </div>
                                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-[10px] font-black font-sans">
                                                +{sug.estimated_score_impact} pts
                                              </span>
                                            </div>

                                            <p className="text-[11px] text-slate-300 leading-relaxed font-serif"><strong className="text-white font-sans">Rationale:</strong> {sug.rationale}</p>
                                            
                                            <div className="p-3 bg-black/45 border border-white/5 rounded-xl flex items-center justify-between gap-3 font-mono text-[10px] text-slate-200">
                                              <span className="break-all">{sug.edit_text}</span>
                                              <button 
                                                onClick={() => {
                                                  navigator.clipboard.writeText(sug.edit_text);
                                                  addToast("Copied to clipboard!", "success");
                                                }}
                                                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:border-luna-300 hover:text-luna-300 transition text-[9px] font-bold uppercase cursor-pointer"
                                              >
                                                Copy
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* INTERACTIVE BULLET REWRITER COACH PLAYGROUND */}
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
                                            onClick={() => {
                                              setVagueBulletInput("Worked on cloud deployment and scaling microservices");
                                            }}
                                            className="text-[9px] text-slate-400 hover:text-white underline cursor-pointer"
                                          >
                                            Load Example
                                          </button>
                                          <button
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
                                );
                              })()}

                              {/* TAB CONTENT: QUESTIONS */}
                              {atsFeedbackTab === "questions" && (() => {
                                const report = atsReport || { questions: [] };
                                const questions = report.questions || [];
                                return (
                                  <div className="space-y-6 text-xs font-sans">
                                    <div>
                                      <h5 className="font-bold text-white text-sm mb-1">Evidence-Grounded Interview Prep & Rubrics</h5>
                                      <p className="text-[11px] text-slate-400 font-serif">Simulated screening, technical, and behavioral interview questions mapped directly to your resume claims.</p>
                                    </div>

                                    {questions.length === 0 ? (
                                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center text-slate-400">
                                        No questions generated. Please run the ATS analysis first.
                                      </div>
                                    ) : (
                                      <div className="space-y-4">
                                        {questions.map((q: any) => (
                                          <div key={q.id} className="p-4 sm:p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                                              <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded bg-luna-300/15 border border-luna-300/30 text-luna-300 text-[9px] font-bold uppercase tracking-wider">
                                                  {q.type} Question
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
                                                  ${q.difficulty === "easy" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300" :
                                                    q.difficulty === "medium" ? "bg-amber-500/10 border border-amber-500/30 text-amber-300" :
                                                    "bg-red-500/10 border border-red-500/30 text-red-300"}`}>
                                                  {q.difficulty}
                                                </span>
                                              </div>
                                              <span className="text-[9px] text-slate-400 font-mono italic">Source: {q.evidence_link}</span>
                                            </div>

                                            <h6 className="text-xs font-bold text-white leading-relaxed font-serif">{q.question_text}</h6>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                              <div className="space-y-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expected Answer Outline</span>
                                                <ul className="space-y-1 pl-4 list-disc text-[10px] text-slate-300 leading-normal font-serif">
                                                  {q.expected_answer_outline.map((o: string, idx: number) => (
                                                    <li key={idx}>{o}</li>
                                                  ))}
                                                </ul>
                                              </div>

                                              <div className="space-y-2 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scoring Rubric</span>
                                                <ul className="space-y-1 text-[10px] text-slate-300 font-serif">
                                                  {q.scoring_rubric.map((r: string, idx: number) => (
                                                    <li key={idx} className="flex justify-between gap-2">
                                                      <span>• {r.substring(0, r.lastIndexOf("("))}</span>
                                                      <span className="font-bold text-emerald-400 flex-shrink-0">{r.substring(r.lastIndexOf("("))}</span>
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Drag and Drop Input Panel */}
                        {!isAtsAnalyzing && atsScore === null && (
                          <div className="space-y-6">
                            {/* Job Description & Calibration Configuration Card */}
                            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4 font-sans text-xs">
                              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                <Settings className="text-luna-300 animate-spin-slow" size={16} />
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dynamic ATS Job-Description Matching & Calibration</h4>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Target Corporate Drive / Job Title</label>
                                    <select
                                      value={atsSelectedJob}
                                      onChange={(e) => setAtsSelectedJob(e.target.value)}
                                      className={`w-full bg-black/25 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-luna-300 ${theme === "dark" ? "text-white bg-luna-950" : "text-slate-900 bg-white"
                                        }`}
                                    >
                                      {Object.keys(companyDetails).map(cName => (
                                        <option key={cName} value={cName} className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>
                                          {cName} - SDE / Analyst
                                        </option>
                                      ))}
                                      <option value="Custom" className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>Custom Job Description</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Target Job Description (JD)</label>
                                    <textarea
                                      value={atsJobDescription}
                                      onChange={(e) => {
                                        setAtsSelectedJob("Custom");
                                        setAtsJobDescription(e.target.value);
                                      }}
                                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-luna-300 h-28 font-serif leading-relaxed"
                                      placeholder="Paste the target job description requirements, skill list, and qualifications here to weight keywords dynamically..."
                                    />
                                  </div>
                                </div>

                                <div className="space-y-3 flex flex-col justify-between">
                                  <div>
                                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Recruiter ML Calibration Profile</label>
                                    <select
                                      value={atsCalibrationMode}
                                      onChange={(e) => setAtsCalibrationMode(e.target.value as any)}
                                      className={`w-full bg-black/25 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-luna-300 ${theme === "dark" ? "text-white bg-luna-950" : "text-slate-900 bg-white"
                                        }`}
                                    >
                                      <option value="standard" className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>Standard Recruiter Rules (General Focus)</option>
                                      <option value="tech" className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>High-Tech Technical Focus (Heavy Skills Weight)</option>
                                      <option value="consulting" className={theme === "dark" ? "bg-luna-950 text-white" : "bg-white text-slate-900"}>Consulting & Soft Skills Focus (Academic / Leadership)</option>
                                    </select>
                                  </div>

                                  <div className="bg-luna-300/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                                    <span className="text-[10px] text-luna-300 font-bold block uppercase tracking-wider">Calibration Weights Profile:</span>
                                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-350">
                                      <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span>Work Experience:</span>
                                        <span className="font-bold text-white">{atsCalibrationMode === "tech" ? "30%" : atsCalibrationMode === "consulting" ? "25%" : "35%"}</span>
                                      </div>
                                      <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span>Technical Skills:</span>
                                        <span className="font-bold text-white">{atsCalibrationMode === "tech" ? "45%" : atsCalibrationMode === "consulting" ? "20%" : "30%"}</span>
                                      </div>
                                      <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span>Education Background:</span>
                                        <span className="font-bold text-white">{atsCalibrationMode === "tech" ? "10%" : atsCalibrationMode === "consulting" ? "25%" : "15%"}</span>
                                      </div>
                                      <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span>Projects & Achievements:</span>
                                        <span className="font-bold text-white">{atsCalibrationMode === "tech" ? "12%" : atsCalibrationMode === "consulting" ? "20%" : "15%"}</span>
                                      </div>
                                    </div>
                                    <p className="text-[9px] text-slate-500 font-serif leading-relaxed mt-1">
                                      *Calibration parameters simulate real recruiter feedback profiles. High-Tech weights skills more heavily, whereas Consulting prioritizes academic credentials and leadership/soft achievements.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch font-sans text-xs">
                              {/* File Upload Panel */}
                              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between items-center text-center">
                                <div className="w-full">
                                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 justify-center">
                                    <UploadCloud className="text-luna-300" size={18} />
                                    Scan Resume Document File
                                  </h4>
                                  <p className="text-[10px] text-slate-400 font-serif mb-6 leading-relaxed">
                                    Upload a PDF or DOCX file copy of your resume to perform margins parsing, keyword diagnostics, and layouts scoring.
                                  </p>

                                  {/* Real File Dropzone */}
                                  <div className="border-2 border-dashed border-white/15 hover:border-luna-300/60 bg-black/10 rounded-2xl p-8 transition-colors flex flex-col items-center justify-center cursor-pointer mb-6 relative"
                                    onClick={() => document.getElementById("ats-resume-file-input")?.click()}
                                  >
                                    <input
                                      id="ats-resume-file-input"
                                      type="file"
                                      accept=".pdf,.docx,.txt"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setUploadedResumeName(file.name);
                                          addToast(`Resume file loaded: ${file.name}`, "success");
                                        }
                                      }}
                                    />
                                    <UploadCloud className="text-slate-400 mb-3" size={36} />
                                    <span className="text-[11px] font-bold text-white block">
                                      {uploadedResumeName || "Click to browse / drop resume document"}
                                    </span>
                                    <span className="text-[9px] text-slate-500 mt-1 block uppercase tracking-wider">PDF, DOCX up to 4MB</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => runAtsAnalysis(uploadedResumeName, "")}
                                  className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all font-sans"
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
                                  className="w-full py-3 mt-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-luna-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all font-sans"
                                >
                                  Scan Pasted Content
                                </button>
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

                            if (cur.value !== currentStudent.passwordKey) {
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

                            updateLoggedInStudent({ passwordKey: next.value });
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
                            <button type="submit" className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl shadow-lg transition-all text-xs uppercase">
                              Update Password Key
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                    {studentDashTab === "placed-directory" && renderPlacedDirectoryWithBulk(false)}
                  </div>
                )}

                {/* --- PR DASHBOARD CONTENTS --- */}
                {userRoleState === "pr" && (
                  <div>
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
                            className="px-5 py-2.5 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold text-xs uppercase rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start cursor-pointer"
                          >
                            <Plus size={15} />
                            Add Recruitment Drive
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {companies.map((company, index) => (
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
                                      <div className="w-10 h-10 rounded-xl bg-luna-300/20 flex items-center justify-center text-sm font-black text-luna-300">
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
                                    handleSoftDeleteCompany(company.name, company.status);
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

                        {/* Split layout: Form on Left/Top, Event list + Logs on Right/Bottom */}
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
                                const oldEvent = events.find(ev => ev.id === editingEventId);
                                setEvents(prev => prev.map(ev => ev.id === editingEventId ? {
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
                                setEventLogs(prev => [newLog, ...prev]);
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
                                setEvents(prev => [...prev, newEvent]);

                                const newLog: EventLogEntry = {
                                  id: Date.now(),
                                  eventTitle: eventFormTitle,
                                  actionType: "Add",
                                  changedBy,
                                  timestamp,
                                  details: `Created new ${eventFormType} event.`
                                };
                                setEventLogs(prev => [newLog, ...prev]);
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
                                      className={`p-1 bg-black/40 border rounded-lg text-[9px] hover:border-luna-300 transition-all text-center ${eventFormPoster === st.url ? "border-luna-300 text-luna-300" : "border-white/5 text-slate-400"}`}
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
                                  <p className="text-slate-400 py-4 text-center">No active scheduled events.</p>
                                ) : (
                                  events.map((ev) => (
                                    <div key={ev.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex justify-between items-center gap-4 hover:border-white/10 transition-all">
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                          <span className="px-1.5 py-0.5 rounded bg-luna-300/10 border border-luna-300/20 text-[9px] font-bold text-luna-300 uppercase">
                                            {ev.type}
                                          </span>
                                          <span className="text-[10px] text-slate-400">{ev.date}</span>
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
                                              setEvents(prev => prev.filter(e => e.id !== ev.id));

                                              const newLog: EventLogEntry = {
                                                id: Date.now(),
                                                eventTitle: ev.title,
                                                actionType: "Delete",
                                                changedBy,
                                                timestamp,
                                                details: `Deleted event: ${ev.title}`
                                              };
                                              setEventLogs(prev => [newLog, ...prev]);
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

                            {/* Transparent Audit Logs Trail */}
                            <div className="glass-panel p-6 rounded-3xl border border-white/5 text-xs">
                              <h3 className="text-sm font-black text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2 font-sans">
                                <Activity size={16} className="text-luna-300" />
                                Event Management Audit Logs
                              </h3>

                              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {eventLogs.length === 0 ? (
                                  <p className="text-slate-500 py-3 text-center">No logs generated yet.</p>
                                ) : (
                                  eventLogs.map((log) => (
                                    <div key={log.id} className="bg-black/20 border border-white/5 rounded-xl p-3 text-[10px] space-y-1.5">
                                      <div className="flex justify-between items-center">
                                        <span className={`px-1.5 py-0.5 rounded font-black text-[8px] uppercase tracking-wide
                                          ${log.actionType === "Add" ? "bg-green-500/10 border border-green-500/30 text-green-300" :
                                            log.actionType === "Edit" ? "bg-blue-500/10 border border-blue-500/30 text-blue-300" :
                                              "bg-red-500/10 border border-red-500/30 text-red-300"}`}
                                        >
                                          {log.actionType}
                                        </span>
                                        <span className="text-slate-500 font-mono text-[9px]">{log.timestamp}</span>
                                      </div>
                                      <p className="text-slate-300 leading-normal font-sans">
                                        <strong>{log.eventTitle}</strong>: {log.details}
                                      </p>
                                      <span className="text-slate-400 block text-[9px] font-bold">Author: {log.changedBy}</span>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>
                    )}
                    {prDashTab === "prs" && renderPrsManagementTabContent()}
                    {prDashTab === "placed-directory" && renderPlacedDirectoryWithBulk(true)}
                  </div>
                )}

                {/* --- DEPARTMENTAL COORDINATOR DASHBOARD CONTENTS --- */}
                {userRoleState === "departmental" && (
                  <div>
                    {/* STUDENT RECORDS TAB */}
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
                              value={selectedSector} // recycle this hook for department filtering in admin view
                              onChange={(e) => setSelectedSector(e.target.value)}
                              className="bg-luna-950 border border-white/10 rounded-full py-2 px-3 text-xs text-white focus:outline-none focus:border-luna-300"
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
                                  .filter(s => {
                                    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
                                    const matchDept = selectedSector === "All" || s.department === selectedSector;
                                    return matchSearch && matchDept;
                                  })
                                  .map((student) => (
                                    <tr key={student.rollNo} className="hover:bg-white/[0.01] transition-colors">
                                      <td className="p-4 sm:p-5 uppercase font-bold text-slate-400">{student.rollNo}</td>
                                      <td className="p-4 sm:p-5 font-semibold text-white">{student.name}</td>
                                      <td className="p-4 sm:p-5">{student.department}</td>
                                      <td className="p-4 sm:p-5 font-bold">{student.cgpa.toFixed(1)}</td>
                                      <td className="p-4 sm:p-5 text-center">
                                        <button
                                          onClick={() => {
                                            setStudents(prev => prev.map(s => s.rollNo === student.rollNo ? { ...s, isEligible: !s.isEligible } : s));
                                            addToast(`Toggled eligibility for ${student.name}`, "info");
                                          }}
                                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border transition-colors
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
                                            setStudents(prev => prev.map(s => s.rollNo === student.rollNo ? { ...s, isPlaced: !s.isPlaced } : s));
                                            addToast(`Toggled placement status for ${student.name}`, "info");
                                          }}
                                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase transition-colors
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

                                            setStudents(prev => prev.map(s => s.rollNo === student.rollNo ? { ...s, cgpa: newCgpa, phone } : s));
                                            addToast(`Updated record for ${student.name}!`, "success");
                                          }}
                                          className="p-1 text-luna-300 hover:text-white transition-colors"
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
                            <span className="text-[10px] uppercase text-slate-450 tracking-wider">Total Enrolled</span>
                            <h4 className="text-3xl font-black text-white mt-1">{students.length}</h4>
                            <p className="text-[9px] text-slate-500 mt-1">3rd Year B.Tech</p>
                          </div>

                          <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center">
                            <span className="text-[10px] uppercase text-slate-450 tracking-wider">Placed Students</span>
                            <h4 className="text-3xl font-black text-white mt-1">
                              {students.filter(s => s.isPlaced).length}
                            </h4>
                            <p className="text-[9px] text-slate-550 mt-1 font-bold">Across all depts</p>
                          </div>

                          <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center">
                            <span className="text-[10px] uppercase text-slate-450 tracking-wider">Placement Rate</span>
                            <h4 className="text-3xl font-black text-white mt-1">
                              {((students.filter(s => s.isPlaced).length / students.length) * 100).toFixed(0)}%
                            </h4>
                            <p className="text-[9px] text-slate-550 mt-1 font-bold">Target Rate: 90%</p>
                          </div>

                          <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center">
                            <span className="text-[10px] uppercase text-slate-450 tracking-wider">Active Recruiters</span>
                            <h4 className="text-3xl font-black text-white mt-1">{companies.length}</h4>
                            <p className="text-[9px] text-slate-550 mt-1 font-bold">Vetted partner companies</p>
                          </div>
                        </div>

                        {/* CGPA Distribution / Department Statistics list */}
                        <div className="glass-panel p-6 rounded-3xl border border-white/5 font-sans">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-sans">Departmental Breakdown</h4>
                          <div className="space-y-4">
                            {["CSE", "ECE", "EEE", "Mechanical", "Civil"].map((dept) => {
                              const deptStudents = students.filter(s => s.department === dept);
                              const placedCount = deptStudents.filter(s => s.isPlaced).length;
                              const rate = deptStudents.length > 0 ? (placedCount / deptStudents.length) * 100 : 0;
                              return (
                                <div key={dept} className="space-y-1.5">
                                  <div className="flex justify-between font-semibold text-white">
                                    <span>{dept} Department</span>
                                    <span>{placedCount} / {deptStudents.length} Placed ({rate.toFixed(0)}%)</span>
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
                    {departmentalDashTab === "prs" && renderPrsManagementTabContent()}
                    {departmentalDashTab === "placed-directory" && renderPlacedDirectoryWithBulk(true)}
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>
      )}



      {activeTab === "home" && (
        /* --- STATISTICS SECTION with Interactive Chart area --- */
        <section id="stats" className="py-24 relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-0 fade-in-on-scroll">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-luna-300 mb-2">Metrics of Excellence</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-sans text-white">Interactive Statistics</h3>
              <p className="text-sm text-slate-400 font-serif mt-2">Compare departments, sectors, and historical placement records</p>
              <div className="w-16 h-1 bg-luna-300 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Stat Toggles */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10 fade-in-on-scroll font-sans">
              <button
                onClick={() => setStatMode("packages")}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border transition-all duration-300 flex items-center gap-2
                  ${statMode === "packages"
                    ? "bg-luna-300 border-luna-300 text-luna-950 shadow-[0_0_15px_rgba(84,172,191,0.4)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white"}`}
              >
                <BarChart3 size={15} />
                Salary CTC Packages
              </button>
              <button
                onClick={() => setStatMode("sectors")}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border transition-all duration-300 flex items-center gap-2
                  ${statMode === "sectors"
                    ? "bg-luna-300 border-luna-300 text-luna-950 shadow-[0_0_15px_rgba(84,172,191,0.4)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white"}`}
              >
                <PieChart size={15} />
                Sector Distribution
              </button>
              <button
                onClick={() => setStatMode("trends")}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border transition-all duration-300 flex items-center gap-2
                  ${statMode === "trends"
                    ? "bg-luna-300 border-luna-300 text-luna-950 shadow-[0_0_15px_rgba(84,172,191,0.4)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white"}`}
              >
                <TrendingUp size={15} />
                Year-on-Year Progress
              </button>
              <button
                onClick={() => setStatMode("brochure-stats")}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border transition-all duration-300 flex items-center gap-2
                  ${statMode === "brochure-stats"
                    ? "bg-luna-300 border-luna-300 text-luna-950 shadow-[0_0_15px_rgba(84,172,191,0.4)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white"}`}
              >
                <FileText size={15} />
                Placement Records (2025–26)
              </button>
            </div>

            {/* Interactive Chart Container */}
            <div className="glass-panel p-6 sm:p-10 rounded-3xl max-w-4xl mx-auto shadow-2xl relative z-20 overflow-visible fade-in-on-scroll">

              {statMode === "packages" && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h4 className="text-xl font-bold font-sans text-white">Department Package Packages (LPA)</h4>
                      <p className="text-xs text-slate-400 font-serif">Hover over the bars to see historical growth curves (2023 - 2026)</p>
                    </div>
                    <div className="flex gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-white">
                        <span className="w-3 h-3 bg-luna-300 rounded"></span> Highest CTC
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-3 h-3 bg-luna-600 rounded"></span> Average CTC
                      </span>
                    </div>
                  </div>

                  {/* SVG/HTML Bar Chart */}
                  <div className="space-y-6">
                    {departmentStats.map((item, idx) => (
                      <div key={idx} className="relative group/bar">
                        <div className="flex items-center justify-between text-sm mb-1.5 font-sans">
                          <span className="font-semibold text-slate-300">{item.dept} Engineering</span>
                          <span className="text-xs font-bold text-luna-300">Max: {item.highest} LPA | Avg: {item.average} LPA</span>
                        </div>

                        <div
                          className="h-7 w-full bg-white/[0.03] rounded-lg overflow-visible flex items-center relative cursor-pointer"
                          onMouseEnter={() => setHoveredBar(idx)}
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          {/* Average Bar */}
                          <div
                            className="h-full bg-luna-600 rounded-lg absolute left-0 top-0 transition-all duration-1000 group-hover/bar:bg-luna-500"
                            style={{ width: `${(item.average / 45) * 100}%` }}
                          ></div>
                          {/* Highest Bar */}
                          <div
                            className="h-full bg-gradient-to-r from-luna-300 to-luna-50 rounded-lg absolute left-0 top-0 opacity-80 transition-all duration-1000 group-hover/bar:opacity-100"
                            style={{ width: `${(item.highest / 45) * 100}%` }}
                          ></div>

                          {/* Interactive Year-wise Hover Tooltip */}
                          {hoveredBar === idx && (
                            <div className="absolute z-20 top-full left-[20%] translate-y-2 w-72 glass-modal p-4 rounded-xl shadow-xl border border-luna-300/40 pointer-events-none animate-slide-up text-left">
                              <h5 className="text-xs font-bold text-luna-300 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <TrendingUp size={12} />
                                {item.dept} Placement Trend
                              </h5>
                              <div className="space-y-1 text-xs font-serif text-slate-200">
                                <div><strong>2023:</strong> {item.yearsData[2023]}</div>
                                <div><strong>2024:</strong> {item.yearsData[2024]}</div>
                                <div><strong>2025:</strong> {item.yearsData[2025]}</div>
                                <div className="text-luna-300"><strong>2026:</strong> {item.yearsData[2026]}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {statMode === "sectors" && (
                <div>
                  <h4 className="text-xl font-bold font-sans text-white mb-6">Placements by Sector (2026)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                    {/* Left list */}
                    <div className="space-y-5">
                      {sectorDistribution.map((item, idx) => (
                        <div key={idx} className="flex flex-col">
                          <div className="flex justify-between text-sm mb-1.5 font-sans">
                            <span className="font-semibold text-slate-300">{item.sector}</span>
                            <span className="font-bold text-luna-300">{item.percent}%</span>
                          </div>
                          <div className="h-3 w-full bg-white/[0.03] rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                              style={{ width: `${item.percent}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-serif mt-1 italic">{item.trend}</span>
                        </div>
                      ))}
                    </div>

                    {/* Visual Layout Representation */}
                    <div className="flex justify-center">
                      <div className="w-56 h-56 rounded-full border border-luna-300/30 flex items-center justify-center relative bg-luna-950/20 backdrop-blur-md">
                        <div className="absolute inset-4 rounded-full border border-dashed border-luna-300/10"></div>
                        <div className="text-center p-4">
                          <span className="text-4xl font-extrabold font-sans text-luna-300">150+</span>
                          <span className="block text-[10px] text-slate-400 uppercase tracking-widest mt-1">Offers Placed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {statMode === "trends" && (
                <div>
                  <h4 className="text-xl font-bold font-sans text-white mb-6">Year-on-Year Placement Progress</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-serif text-slate-300">
                      <thead>
                        <tr className="border-b border-white/10 font-sans text-xs uppercase tracking-wider text-luna-300">
                          <th className="py-4">Year</th>
                          <th className="py-4">Placement Rate</th>
                          <th className="py-4">Highest CTC</th>
                          <th className="py-4">Average CTC</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {placementTrends.map((trend, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 font-bold text-white">{trend.year}</td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{trend.rate}%</span>
                                <div className="w-24 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                                  <div className="h-full bg-luna-300" style={{ width: `${trend.rate}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 font-semibold">{trend.highest} LPA</td>
                            <td className="py-4">{trend.avg} LPA</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {statMode === "brochure-stats" && (
                <div>
                  <div className="mb-6">
                    <h4 className="text-xl font-bold font-sans text-white">B.Tech Placement Statistics (2025–26)</h4>
                    <p className="text-xs text-slate-400 font-serif mt-1">Detailed branch-wise students placed and percentage highlights</p>
                  </div>
                  <div className="overflow-x-auto mb-8">
                    <table className="w-full text-left font-serif text-slate-300">
                      <thead>
                        <tr className="border-b border-white/10 font-sans text-xs uppercase tracking-wider text-luna-300">
                          <th className="py-4">Department</th>
                          <th className="py-4">Students Placed</th>
                          <th className="py-4">Placement %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {[
                          { dept: "Computer Science & Engineering (CSE)", placed: 47, pct: "92.16%" },
                          { dept: "Electrical & Electronics Engineering (EEE)", placed: 38, pct: "77.55%" },
                          { dept: "Electronics & Communication Engineering (ECE)", placed: 40, pct: "80.00%" },
                          { dept: "Mechanical Engineering", placed: 17, pct: "80.95%" },
                          { dept: "Civil Engineering", placed: 13, pct: "81.25%" },
                          { dept: "Overall B.Tech", placed: 155, pct: "82.89%", isHighlight: true }
                        ].map((row, idx) => (
                          <tr key={idx} className={`hover:bg-white/[0.02] transition-colors ${row.isHighlight ? "font-bold text-white bg-luna-300/5" : ""}`}>
                            <td className="py-4">{row.dept}</td>
                            <td className="py-4">{row.placed}</td>
                            <td className="py-4 text-luna-300">{row.pct}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xl font-bold font-sans text-white">M.Tech & M.Sc Placements</h4>
                    <p className="text-xs text-slate-400 font-serif mt-1">PG academic programme average and maximum packages</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { program: "CSE M.Tech", avg: "₹13.00 LPA", max: "₹16.00 LPA" },
                      { program: "ECE M.Tech", avg: "₹9.63 LPA", max: "₹23.00 LPA" },
                      { program: "EEE M.Tech", avg: "₹6.00 LPA", max: "—" },
                      { program: "M.Sc (Phy/Chem/Math)", avg: "₹6.00 LPA", max: "—" }
                    ].map((pg, idx) => (
                      <div key={idx} className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                        <h5 className="font-bold text-white font-sans text-xs sm:text-sm mb-2 break-words">{pg.program}</h5>
                        <div className="text-xs text-slate-350 space-y-1">
                          <div>Average CTC: <strong className="text-luna-300 font-bold">{pg.avg}</strong></div>
                          {pg.max !== "—" && <div>Maximum CTC: <strong className="text-white font-bold">{pg.max}</strong></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* --- Scrolling Recruiter Logos Banner --- */}
            <div className="mt-16 overflow-hidden max-w-5xl mx-auto py-8 border-y border-white/5 relative bg-white/[0.01] backdrop-blur-md rounded-2xl fade-in-on-scroll">
              <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-luna-950 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-luna-950 to-transparent z-10 pointer-events-none"></div>

              <div className="marquee-container">
                <div className="marquee-content animate-marquee font-sans font-black text-2xl tracking-[0.2em] text-slate-500/30 uppercase flex items-center">
                  <span>Google</span>
                  <span>Microsoft</span>
                  <span>Amazon</span>
                  <span>Oracle</span>
                  <span>Intel</span>
                  <span>L&T Construction</span>
                  <span>Deloitte</span>
                  <span>TCS</span>
                  <span>Infosys</span>
                  <span>ABB Group</span>
                </div>
                <div className="marquee-content animate-marquee font-sans font-black text-2xl tracking-[0.2em] text-slate-500/30 uppercase flex items-center" aria-hidden="true">
                  <span>Google</span>
                  <span>Microsoft</span>
                  <span>Amazon</span>
                  <span>Oracle</span>
                  <span>Intel</span>
                  <span>L&T Construction</span>
                  <span>Deloitte</span>
                  <span>TCS</span>
                  <span>Infosys</span>
                  <span>ABB Group</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {activeTab === "home" && (
        /* --- ALUMNI TESTIMONIALS with Carousel & Video player --- */
        <section id="testimonials" className="py-24 relative z-10 bg-luna-800/10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-0 fade-in-on-scroll">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-luna-300 mb-2">Voices of Success</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-sans text-white">Alumni Testimonials</h3>
              <div className="w-16 h-1 bg-luna-300 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto relative px-4 sm:px-12 fade-in-on-scroll">

              {/* Carousel card */}
              <div className="glass-panel p-8 sm:p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center min-h-[380px] shadow-xl">

                {/* Alumni Photo - Styled with partial visibility/grayscale glass-blend */}
                <div className="relative w-44 h-44 rounded-2xl overflow-hidden flex-shrink-0 border border-luna-300/20 shadow-lg group">
                  <img
                    src={testimonials[testimonialIndex].image}
                    alt={testimonials[testimonialIndex].name}
                    className="w-full h-full object-cover opacity-65 group-hover:opacity-90 transition-all duration-500 grayscale group-hover:grayscale-0"
                  />
                  {/* Frosted partial overlay so it feels blended/not completely seen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-luna-950/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-luna-300/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                </div>

                {/* Alumni Testimonial text */}
                <div className="flex-grow text-center md:text-left">
                  <div className="mb-4">
                    <h4 className="text-xl font-bold font-sans text-white">{testimonials[testimonialIndex].name}</h4>
                    <p className="text-xs text-luna-300 font-semibold">{testimonials[testimonialIndex].batch}</p>
                    <p className="text-xs text-slate-400 font-serif italic mt-0.5">{testimonials[testimonialIndex].role} at {testimonials[testimonialIndex].company}</p>
                  </div>
                  <p className="text-slate-300 font-serif leading-relaxed text-sm md:text-base">
                    "{testimonials[testimonialIndex].quote}"
                  </p>
                </div>

              </div>

              {/* Carousel Navigation dots */}
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTestimonialIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300
                      ${idx === testimonialIndex
                        ? "bg-luna-300 w-8 shadow-[0_0_10px_rgba(84,172,191,0.6)]"
                        : "bg-slate-600 hover:bg-slate-400"}`}
                    aria-label={`Slide ${idx + 1}`}
                  ></button>
                ))}
              </div>

              {/* Prev/Next arrows */}
              <button
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 p-3 rounded-full border border-luna-300/20 bg-luna-950/45 hover:bg-luna-300 hover:text-luna-950 text-luna-300 transition-all duration-300 shadow-lg"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 p-3 rounded-full border border-luna-300/20 bg-luna-950/45 hover:bg-luna-300 hover:text-luna-950 text-luna-300 transition-all duration-300 shadow-lg"
                aria-label="Next Testimonial"
              >
                <ChevronRight size={18} />
              </button>

            </div>
          </div>
        </section>
      )}

      {activeTab === "home" && (
        /* --- RECRUITERS SHOWCASE SECTION --- */
        <section id="recruiters" className="py-24 relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-0 fade-in-on-scroll">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-luna-300 mb-2">Our Network</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-sans text-white">Recruiters Showcase</h3>
              <div className="w-16 h-1 bg-luna-300 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Search and Filters Bar */}
            <div className="glass-panel p-6 rounded-2xl max-w-4xl mx-auto mb-12 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg fade-in-on-scroll">

              {/* Search input */}
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Search recruiters by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-luna-300 transition-all font-serif"
                />
              </div>

              {/* Sector filters */}
              <div className="flex flex-wrap gap-2 justify-center font-sans">
                {["All", "IT / Software", "Core Engineering", "Consulting", "Finance"].map((sector) => (
                  <button
                    key={sector}
                    onClick={() => setSelectedSector(sector)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300
                      ${selectedSector === sector
                        ? "bg-luna-300 border-luna-300 text-luna-950 font-bold"
                        : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300"}`}
                  >
                    {sector}
                  </button>
                ))}
              </div>

            </div>

            {/* Recruiters Logo Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto fade-in-on-scroll">
              {filteredRecruiters.map((company, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (isLoggedIn) {
                      setSelectedCompanyDetails(company.name);
                    }
                  }}
                  className="glass-panel p-6 rounded-3xl hover:border-luna-300/60 transition-all duration-500 hover:scale-[1.03] text-center flex flex-col justify-between items-center group relative overflow-hidden min-h-[180px] cursor-pointer shadow-md"
                >
                  {/* Glowing border highlight on hover */}
                  <div className="absolute inset-0 border border-luna-300/0 group-hover:border-luna-300/40 rounded-3xl transition-all duration-500 pointer-events-none"></div>

                  {/* Company Logo Badge */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl border ${company.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {company.logo}
                  </div>

                  <div className="mb-2">
                    <h4 className="text-base font-bold font-sans text-white group-hover:text-luna-300 transition-colors">{company.name}</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-sans mt-0.5">{company.sector}</p>
                  </div>

                  <div className="w-full mt-2 pt-2 border-t border-white/5 flex justify-between text-[11px] font-sans text-slate-300">
                    {isLoggedIn ? (
                      <>
                        <span>Hired: <strong>{company.hires}</strong></span>
                        <span>Avg Package: <strong>{company.avgPackage}</strong></span>
                      </>
                    ) : (
                      <span className="flex items-center gap-1.5 text-luna-300 mx-auto">
                        <Lock size={12} />
                        Locked (Auth Required)
                      </span>
                    )}
                  </div>

                  {/* Grid Hover tooltip detail info */}
                  {isLoggedIn ? (
                    <div className="absolute inset-0 bg-luna-950/95 flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-center font-serif text-xs">
                      <h5 className="font-bold text-sm text-luna-300 font-sans mb-2">{company.name} Highlights</h5>
                      <p className="text-slate-200 mb-1">Max CTC: <strong>{company.maxPackage}</strong></p>
                      <p className="text-slate-200 mb-1">Eligible: <strong>CSE, ECE, EEE</strong></p>
                      <p className="text-slate-300 italic mt-2 text-[10px]">Click for interview insights & prep</p>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setIsLoginOpen(true);
                        addToast("Authentication required to view recruiter details", "info");
                      }}
                      className="absolute inset-0 bg-luna-950/90 backdrop-blur-md flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-center cursor-pointer"
                    >
                      <Lock size={20} className="text-luna-300 mb-2 animate-bounce" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white">Auth Required</span>
                      <span className="text-[9px] text-slate-400 font-serif mt-1">Click to login & view CTC and package details</span>
                    </div>
                  )}

                </div>
              ))}

              {filteredRecruiters.length === 0 && (
                <div className="col-span-full text-center py-12 glass-panel rounded-3xl">
                  <ShieldAlert className="mx-auto text-luna-300 mb-2" size={32} />
                  <p className="text-slate-400 font-serif">No recruiters found matching the filters.</p>
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {activeTab === "events" && (
        /* --- EVENTS & PLACEMENT CALENDAR SECTION --- */
        <section id="events" className="pt-6 pb-12 relative z-10 bg-luna-800/10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Main content starts immediately below banner */}

            {isLoggedIn ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto fade-in-on-scroll">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="glass-panel p-6 rounded-3xl hover:border-luna-300/40 transition-all duration-300 flex flex-col justify-between gap-4 shadow-md overflow-hidden relative group"
                  >
                    <div>
                      {event.poster && (
                        <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 border border-white/5 relative">
                          <img
                            src={event.poster}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-luna-300/10 border border-luna-300/30 text-[9px] font-bold text-luna-300 uppercase tracking-widest font-sans">
                          {event.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-luna-300" /> Active Event
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-black font-sans text-white mb-2 leading-snug">{event.title}</h4>
                      {event.description && (
                        <p className="text-xs text-slate-350 font-serif leading-relaxed mb-3">{event.description}</p>
                      )}
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serif text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span><strong>{event.date}</strong> at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-slate-400" />
                          <span>Venue: <strong>{event.venue}</strong></span>
                        </div>
                      </div>

                      {event.googleFormUrl && (
                        <a
                          href={event.googleFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-xl text-xs font-bold uppercase border border-luna-300 bg-luna-300 hover:bg-luna-50 text-luna-950 transition-all duration-300 hover:shadow-md hover:shadow-luna-300/15 flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                        >
                          Register for Event <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-md mx-auto text-center py-16 px-6 glass-panel rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden fade-in-on-scroll">
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-luna-300/10 rounded-full blur-xl"></div>
                <div className="w-16 h-16 rounded-full bg-luna-300/10 border border-luna-300/35 flex items-center justify-center text-luna-300 mx-auto mb-6">
                  <Lock size={28} className="animate-pulse" />
                </div>
                <h3 className="text-xl font-bold font-sans text-white mb-3">Recruitment Calendar Locked</h3>
                <p className="text-xs text-slate-350 font-serif leading-relaxed mb-8">
                  Upcoming selection dates, online assessments, and recruiter schedule calendars contain sensitive schedule structures and are restricted to authorized NIT Puducherry student and partner recruiter account holders.
                </p>
                <button
                  onClick={() => {
                    setIsLoginOpen(true);
                    addToast("Please login to view active placement drives & calendars", "info");
                  }}
                  className="px-8 py-3 rounded-full text-xs font-bold bg-luna-300 hover:bg-luna-50 text-luna-950 hover:shadow-[0_0_20px_rgba(84,172,191,0.5)] transition-all font-sans"
                >
                  Login to Access Calendar
                </button>
              </div>
            )}

            {/* Calendar & Lifecycle moved to About Page */}

          </div>
        </section>
      )}

      {activeTab === "team" && (
        /* --- TEAM & LOGISTICS SECTION --- */
        <section id="team" className="pt-6 pb-12 relative z-10 bg-luna-800/10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Main content starts immediately below banner */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

              {/* Column 1: Professor-in-Charge */}
              <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-lg hover:border-luna-300/40 transition-all duration-350 flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1.5 rounded-full border border-luna-300/30 bg-luna-300/10 text-luna-300 text-[10px] font-bold uppercase tracking-wider mb-6 inline-block">
                    Professor-in-Charge
                  </span>
                  <h4 className="text-lg font-bold font-sans text-white mb-2">Dr. Madappa V R Sivasubramanian</h4>
                  <p className="text-xs text-slate-400 font-serif leading-relaxed mb-6">
                    Professor-in-charge, Training and Placement,<br />
                    National Institute of Technology Puducherry
                  </p>

                  <div className="space-y-4 font-serif text-xs text-slate-300 border-t border-white/5 pt-6">
                    <div className="flex items-center gap-3">
                      <Phone size={14} className="text-luna-300" />
                      {isLoggedIn ? (
                        <div>
                          <p>+91 (0)4368-265233</p>
                          <p>+91 (0)4368-265235</p>
                          <p>+91 94891 69388 (Mobile)</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setIsLoginOpen(true);
                            addToast("Please login to access placement office contact numbers", "info");
                          }}
                          className="px-2.5 py-1 bg-white/5 hover:bg-luna-300 hover:text-luna-950 text-slate-400 border border-white/10 rounded-lg font-sans text-[10px] transition-all font-bold flex items-center gap-1"
                        >
                          <Lock size={10} />
                          Locked (Login to View)
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={14} className="text-luna-300" />
                      <div>
                        <p>placement@nitpy.ac.in</p>
                        <p>placementcellnitpy@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Department Faculty In-Charges */}
              <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-lg hover:border-luna-300/40 transition-all duration-350 flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1.5 rounded-full border border-luna-300/30 bg-luna-300/10 text-luna-300 text-[10px] font-bold uppercase tracking-wider mb-6 inline-block">
                    Department Faculty In-Charges
                  </span>

                  <div className="space-y-3 font-serif text-xs text-slate-350">
                    {[
                      { dept: "Computer Science (CSE)", name: "Dr. Karthik N", phone: "+91 79048 20693" },
                      { dept: "Electronics & Comm (ECE)", name: "Dr. Yedukondala Rao", phone: "+91 86608 63028" },
                      { dept: "Electrical & Electronics (EEE)", name: "Dr. Hema Chander", phone: "+91 94903 89892" },
                      { dept: "Mechanical Eng (Mech)", name: "Dr. Satishkumar", phone: "+91 95667 83072" },
                      { dept: "Civil Engineering (Civil)", name: "Dr. Mallikarjun", phone: "+91 90045 41596" },
                      { dept: "T&P Secretary Desk", name: "Mrs. Umamageswari T", phone: "+91 94891 69388" }
                    ].map((member, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-none">
                        <div>
                          <strong className="text-white block font-sans text-xs">{member.name}</strong>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{member.dept}</span>
                        </div>
                        {isLoggedIn ? (
                          <a
                            href={`tel:${member.phone.replace(/\s+/g, '')}`}
                            className="px-2.5 py-1 bg-white/5 hover:bg-luna-300 hover:text-luna-950 text-slate-300 border border-white/10 rounded-lg font-sans text-[10px] transition-all font-bold"
                          >
                            {member.phone}
                          </a>
                        ) : (
                          <button
                            onClick={() => {
                              setIsLoginOpen(true);
                              addToast("Please login to access faculty contact numbers", "info");
                            }}
                            className="px-2.5 py-1 bg-white/5 hover:bg-luna-300 hover:text-luna-950 text-slate-400 border border-white/10 rounded-lg font-sans text-[10px] transition-all font-bold flex items-center gap-1"
                          >
                            <Lock size={10} />
                            Locked
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 3: Travel Logistics */}
              <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-lg hover:border-luna-300/40 transition-all duration-350 flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1.5 rounded-full border border-luna-300/30 bg-luna-300/10 text-luna-300 text-[10px] font-bold uppercase tracking-wider mb-6 inline-block">
                    Travel & Connectivity
                  </span>
                  <p className="text-xs text-slate-400 font-serif leading-relaxed mb-6">
                    NIT Puducherry campus is well connected with major South Indian cities. Approximate transit durations:
                  </p>

                  <div className="overflow-hidden border border-white/15 rounded-xl">
                    <table className="w-full text-left font-serif text-[11px] text-slate-350">
                      <thead>
                        <tr className="bg-white/5 font-sans text-[10px] uppercase tracking-wider text-luna-300 border-b border-white/15">
                          <th className="p-3">From</th>
                          <th className="p-3">By Road</th>
                          <th className="p-3">By Rail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {[
                          { from: "Chennai", road: "7 Hours", rail: "9 Hours" },
                          { from: "Trichy", road: "4 Hours", rail: "4 Hours" },
                          { from: "Pondicherry", road: "3.5 Hours", rail: "—" }
                        ].map((route, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="p-3 font-sans font-bold text-white">{route.from}</td>
                            <td className="p-3">{route.road}</td>
                            <td className="p-3">{route.rail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Location Helper */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-luna-300/10 flex items-center justify-center text-luna-300 flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="text-[11px] font-serif leading-relaxed text-slate-400">
                    Located in <strong>Thiruvettakudy, Karaikal</strong>. Check driving directions on the map footer below.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Placement Coordinators */}
          <div className="mt-12 border-t border-white/5 py-12 px-4 md:px-8 lg:px-16 w-full max-w-none">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-luna-300 to-luna-50 inline-block mb-2">
                Student Force
              </span>
              <h5 className="text-3xl font-black font-sans text-white">Student Placement Representatives</h5>
              <div className="w-24 h-1 bg-gradient-to-r from-luna-300 via-luna-100 to-luna-600 mx-auto mt-4 rounded-full shadow-[0_0_12px_rgba(84,172,191,0.8)]"></div>
            </div>

            {/* Department Filter Selector */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-sans">Filter Department:</span>
              <div className="flex gap-2">
                {["default", "All", "CSE", "ECE", "EEE", "Mechanical", "Civil"].map((deptOption) => {
                  if (deptOption === "default" && !(isLoggedIn && userRoleState === "student")) {
                    return null;
                  }
                  const isSelected = teamDeptFilter === deptOption;
                  const label = deptOption === "default" ? "My Department" : deptOption;
                  return (
                    <button
                      key={deptOption}
                      onClick={() => setTeamDeptFilter(deptOption)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-sans transition-all border
                        ${isSelected
                          ? "bg-luna-300 border-luna-300 text-luna-950 shadow-lg shadow-luna-300/15"
                          : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {(() => {
              const depts = [
                { key: "CSE", name: "Computer Science (CSE)" },
                { key: "ECE", name: "Electronics & Comm (ECE)" },
                { key: "EEE", name: "Electrical & Electronics (EEE)" },
                { key: "Mechanical", name: "Mechanical Eng (Mech)" },
                { key: "Civil", name: "Civil Engineering (Civil)" }
              ];

              const effectiveDept = teamDeptFilter === "default"
                ? (isLoggedIn && userRoleState === "student" && currentStudent ? currentStudent.department : "All")
                : teamDeptFilter;

              const displayedDepts = effectiveDept === "All"
                ? depts
                : depts.filter(d => d.key.toLowerCase() === effectiveDept.toLowerCase());

              return (
                <div className={`grid grid-cols-1 ${effectiveDept === "All" ? "sm:grid-cols-2 lg:grid-cols-5" : "max-w-md mx-auto"} gap-4 w-full max-w-none`}>
                  {displayedDepts.map((deptGroup, idx) => {
                    const deptReps = prs.filter(p => p.department.toLowerCase() === deptGroup.key.toLowerCase());
                    return (
                      <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/10 hover:border-luna-300/40 hover:shadow-[0_0_20px_rgba(84,172,191,0.25)] hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-luna-300 to-luna-600"></div>
                        <div>
                          <h3 className="text-base font-bold text-white mb-4 border-b border-white/15 pb-3 font-sans text-center">
                            {deptGroup.name}
                          </h3>
                          <div className="space-y-3 font-serif text-xs text-slate-350">
                            {deptReps.map((rep) => (
                              <div key={rep.id} className="border-b border-white/5 last:border-none pb-2 last:pb-0">
                                <div className="flex justify-between items-start mb-1">
                                  <div>
                                    <strong className="text-white block font-sans text-xs">{rep.name}</strong>
                                    <span className="text-[9px] text-luna-300 font-bold block">{rep.role}</span>
                                  </div>
                                  {rep.linkedin && isLoggedIn && (
                                    <a href={rep.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-luna-300 transition-colors">
                                      <Linkedin size={12} />
                                    </a>
                                  )}
                                </div>

                                <div className="space-y-1 mt-1 text-[10px] font-sans">
                                  {isLoggedIn ? (
                                    <>
                                      <div className="flex items-center gap-1.5 text-slate-300">
                                        <Mail size={10} className="text-slate-500" />
                                        <a href={`mailto:${rep.email}`} className="hover:text-luna-300 transition-colors truncate block max-w-[150px]" title={rep.email}>
                                          {rep.email}
                                        </a>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-slate-300">
                                        <Phone size={10} className="text-slate-500" />
                                        <a href={`tel:${rep.phone.replace(/\s+/g, '')}`} className="hover:text-luna-300 transition-colors">
                                          {rep.phone}
                                        </a>
                                      </div>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setIsLoginOpen(true);
                                        addToast("Please login to access representative contact details", "info");
                                      }}
                                      className="py-0.5 px-2 bg-white/5 hover:bg-luna-300 hover:text-luna-950 text-slate-400 border border-white/10 rounded font-sans text-[8px] transition-all font-bold flex items-center gap-1"
                                    >
                                      <Lock size={8} />
                                      Locked
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                            {deptReps.length === 0 && (
                              <p className="text-slate-500 text-center py-4 font-sans text-[11px] italic">No representatives</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {activeTab === "contact" && (
        /* --- CONTACT & GENERAL GUIDELINES SECTION --- */
        <section id="contact" className="pt-6 pb-12 relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Main content starts immediately below banner */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch max-w-6xl mx-auto">

              {/* Contact Details Left Panel */}
              <div className="glass-panel p-8 sm:p-10 rounded-3xl flex flex-col justify-between shadow-lg fade-in-on-scroll">
                <div>
                  <h4 className="text-2xl font-bold font-sans text-luna-300 mb-4 flex items-center gap-2">
                    <Info size={24} />
                    Office of Training & Placement
                  </h4>
                  <p className="text-slate-300 font-serif leading-relaxed mb-8">
                    For recruiter inquiries, partnership proposals, and pre-placement logistics, please contact the Placement Coordinator office or reach out to our Faculty Advisor directly.
                  </p>

                  <div className="space-y-5 font-serif text-slate-300 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-luna-300/10 flex items-center justify-center text-luna-300">
                        <Building2 size={16} />
                      </div>
                      <span>Administration Block, NIT Puducherry, Thiruvettakudy, Karaikal - 609609.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-luna-300/10 flex items-center justify-center text-luna-300">
                        <Mail size={16} />
                      </div>
                      <span>placement@nitpy.ac.in | tnp.nitpy@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-luna-300/10 flex items-center justify-center text-luna-300">
                        <Phone size={16} />
                      </div>
                      <span>Office: +91-4368-262243 | Faculty Advisor: +91-88950-83495</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                  <a href="#" className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-luna-300 hover:text-luna-300 transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href="#" className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-luna-300 hover:text-luna-300 transition-colors">
                    <Twitter size={18} />
                  </a>
                  <a href="#" className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-luna-300 hover:text-luna-300 transition-colors">
                    <Globe size={18} />
                  </a>
                </div>
              </div>

              <div className="glass-panel p-8 sm:p-10 rounded-3xl flex flex-col justify-between shadow-lg fade-in-on-scroll">
                <div>
                  <h4 className="text-xl font-bold font-sans text-white mb-4">Placement Guidance Note</h4>
                  <p className="text-slate-300 font-serif text-sm leading-relaxed mb-6">
                    Students and recruiters are advised to abide by the standard placement norms of NIT Puducherry. You can download the official T&P brochure below or submit a query to our support desk.
                  </p>
                  <div className="mb-6">
                    <a
                      href="/assests/NITPY Placement Brochure 2025-26 (6).pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-luna-300/10 hover:bg-luna-300/20 text-luna-300 font-bold font-sans text-xs border border-luna-300/30 transition-all duration-300"
                    >
                      <FileText size={14} />
                      Download Placement Brochure (PDF)
                    </a>
                  </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); addToast("Message sent to T&P Desk", "success"); }} className="space-y-4 font-serif">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all"
                    />
                  </div>
                  <textarea
                    placeholder="Enter details of placement query or recruitment invitation..."
                    rows={4}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all"
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold font-sans text-xs rounded-xl shadow-lg hover:shadow-luna-300/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    Submit Query
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>

            </div>

            {/* FAQ Section */}
            <div className="mt-10 border-t border-white/5 pt-8 max-w-5xl mx-auto">
              <div className="text-center mb-0">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-luna-300 mb-2">Help Center</h4>
                <h5 className="text-2xl font-extrabold font-sans text-white">Frequently Asked Questions</h5>
                <div className="w-12 h-0.5 bg-luna-300 mx-auto mt-3 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    q: "How can a company register for a placement drive at NIT Puducherry?",
                    a: "Companies can initiate contact by emailing placement@nitpy.ac.in. Our team will share the Job Announcement Form (JAF). Once the completed JAF is submitted, we schedule dates for pre-placement talks and final evaluation slots."
                  },
                  {
                    q: "What is the policy regarding multiple placement offers for students?",
                    a: "NIT Puducherry strictly adheres to the 'ONE STUDENT. ONE JOB' policy to ensure all eligible candidates get fair opportunities. Once a student receives an offer, they are generally not allowed to sit for subsequent drives."
                  },
                  {
                    q: "Does the T&P Cell support students seeking summer internships?",
                    a: "Yes! Dedicated internship drives are organized for pre-final year B.Tech students. Many of these internships lead to Pre-Placement Offers (PPOs) based on student performance."
                  },
                  {
                    q: "Is there any guest house accommodation available for recruiters?",
                    a: "Yes. Recruiters visiting Karaikal for physical placement drives are provided premium lodging and boarding at the institute guest house, along with transportation facilities from nearby transport hubs."
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-luna-300/30 transition-all duration-300">
                    <h6 className="text-sm font-bold font-sans text-white mb-2 flex items-start gap-2">
                      <span className="text-luna-300 font-extrabold">Q.</span>
                      <span>{faq.q}</span>
                    </h6>
                    <p className="text-xs text-slate-300 font-serif leading-relaxed pl-4 border-l border-luna-300/20">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* --- FOOTER SECTION with Mini Map & Quick Links --- */}
      <footer className="relative z-10 border-t border-white/10 bg-luna-950 text-slate-300 pt-16 pb-8 font-serif">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

            {/* Branding Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assests/college_logo.png"
                  alt="NITPY Logo"
                  className="h-12 w-auto object-contain rounded-full bg-white/20 p-1"
                />
                <div>
                  <h4 className="text-base font-bold font-sans text-white tracking-wider">NIT PUDUCHERRY</h4>
                  <p className="text-[10px] text-luna-300 font-bold uppercase tracking-wider">Training & Placement Cell</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 font-serif">
                National Institute of Technology Puducherry is an autonomous premier public technical institution established in 2009 under the 11th Five Year Plan by the Ministry of Education, Govt. of India in Karaikal.
              </p>
              <div className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} NIT Puducherry. All rights reserved.
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="font-sans">
              <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-luna-300 pl-3">
                Quick Navigation
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <a href="#/home" className="hover:text-luna-300 transition-colors">Home Cell</a>
                <a href="#/vision" className="hover:text-luna-300 transition-colors">Placement Vision</a>
                <a href="#/about" className="hover:text-luna-300 transition-colors">Pre-Placement Gym</a>
                <a href="#/home" className="hover:text-luna-300 transition-colors">Salary CTC Stats</a>
                <a href="#/home" className="hover:text-luna-300 transition-colors">Alumni Stories</a>
                <a href="#/team" className="hover:text-luna-300 transition-colors">Our Team</a>
                <a href="#/home" className="hover:text-luna-300 transition-colors">Recruiters Grid</a>
                <a href="https://nitpy.ac.in/" target="_blank" rel="noopener noreferrer" className="hover:text-luna-300 transition-colors flex items-center gap-1">
                  NITPY Official <ExternalLink size={10} />
                </a>
                <a href="/assests/NITPY Placement Brochure 2025-26 (6).pdf" target="_blank" rel="noopener noreferrer" className="hover:text-luna-300 transition-colors flex items-center gap-1">
                  Brochure <FileText size={10} />
                </a>
              </div>
            </div>

            {/* Mini Map of NITPY Campus */}
            <div>
              <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-luna-300 pl-3 font-sans">
                Campus Location
              </h5>
              <div className="h-44 w-full rounded-2xl overflow-hidden border border-white/10 relative shadow-md">
                <iframe
                  title="NITPY Location Map"
                  src="https://maps.google.com/maps?q=10.9854749,79.8452527+(National%20Institute%20of%20Technology%20Puducherry)&z=16&output=embed"
                  className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>

          <div className="border-t border-white/5 pt-6 text-center text-[10px] text-slate-500 flex flex-wrap justify-between items-center">
            <div>
              Designed & Developed for NITPY Placement Cell.
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Placement Policy</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Norms</a>
            </div>
          </div>

        </div>
      </footer>

      {/* --- LOGIN POPUP MODAL SECTION (Frosted Glassmorphic) --- */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-luna-950/80 backdrop-blur-xl animate-fade-in font-sans">

          <div className="glass-modal rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-8 relative">
            <button
              onClick={() => { setIsLoginOpen(false); setShowForgotPassword(false); }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={16} />
            </button>

            {!showForgotPassword ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-white mb-2 flex items-center justify-center gap-2">
                    <LogIn size={22} className="text-luna-300 animate-pulse" />
                    T&P Portal Login
                  </h2>
                  <p className="text-slate-400 text-xs font-serif">
                    Access students dashboard, recruiter forms or admin logs
                  </p>
                </div>

                {/* Role Selector Form Segment */}
                <div className="flex bg-white/5 border border-white/10 rounded-full p-1 mb-6">
                  {(["student", "pr", "departmental"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setLoginRole(role)}
                      className={`flex-1 py-2 text-center rounded-full text-xs font-bold uppercase transition-all duration-300
                        ${loginRole === role
                          ? "bg-luna-300 text-luna-950 shadow-md"
                          : "text-slate-400 hover:text-white"}`}
                    >
                      {role === "student" ? "student" : role === "pr" ? "pr" : "departmental"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 font-serif text-sm">
                  {/* Username */}
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                    <input
                      type="text"
                      placeholder="Username / Email"
                      required
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 bg-gradient-to-r from-luna-300 to-luna-400 hover:from-luna-400 hover:to-luna-300 text-luna-950 font-bold rounded-xl shadow-lg hover:shadow-luna-300/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border border-luna-300"
                  >
                    Authenticate
                    <ArrowRight size={16} />
                  </button>
                </form>

                <div className="mt-6 text-center font-sans">
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-luna-300 hover:text-white underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">Reset Password</h2>
                  <p className="text-slate-400 text-xs font-serif">
                    {forgotStep === 0 && "Enter your registered email / username and select your role."}
                    {forgotStep === 1 && "Enter the simulated 4-digit code shown as toast."}
                    {forgotStep === 2 && "Enter your new portal login password."}
                  </p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 font-sans text-sm">
                  {forgotStep === 0 && (
                    <>
                      {/* Role Selector */}
                      <div className="flex bg-white/5 border border-white/10 rounded-full p-1 mb-4">
                        {(["student", "pr", "departmental"] as const).map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setForgotRole(role)}
                            className={`flex-1 py-1.5 text-center rounded-full text-[10px] font-bold uppercase transition-all duration-300
                              ${forgotRole === role
                                ? "bg-luna-300 text-luna-950 shadow-md"
                                : "text-slate-400 hover:text-white"}`}
                          >
                            {role === "student" ? "student" : role === "pr" ? "pr" : "departmental"}
                          </button>
                        ))}
                      </div>

                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                        <input
                          type="text"
                          placeholder="Registered Email / Username"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all font-sans"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl shadow-lg transition-all font-sans uppercase text-xs"
                      >
                        Request Verification Code
                      </button>
                    </>
                  )}

                  {forgotStep === 1 && (
                    <>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                        <input
                          type="text"
                          placeholder="Enter 4-digit OTP"
                          required
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all font-sans text-center tracking-widest font-black text-lg"
                          maxLength={4}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setForgotStep(0);
                            setForgotEmail("");
                          }}
                          className="flex-1 py-3 bg-white/5 border border-white/10 hover:border-luna-300 text-white font-bold rounded-xl transition-all font-sans uppercase text-xs text-center"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl shadow-lg transition-all font-sans uppercase text-xs"
                        >
                          Verify Code
                        </button>
                      </div>
                    </>
                  )}

                  {forgotStep === 2 && (
                    <>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                        <input
                          type="password"
                          placeholder="New Password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all font-sans"
                        />
                      </div>

                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={16} />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-luna-300 transition-all font-sans"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl shadow-lg transition-all font-sans uppercase text-xs"
                      >
                        Reset Password Key
                      </button>
                    </>
                  )}
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotStep(0);
                      setForgotEmail("");
                      setOtpCode("");
                      setEnteredOtp("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="text-xs text-slate-400 hover:text-white underline font-sans"
                  >
                    Back to Login
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {isAccountModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-luna-950/80 backdrop-blur-xl animate-fade-in font-sans">
          <div className="glass-modal rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-8 relative">
            <button
              onClick={() => setIsAccountModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-luna-300/20 border-2 border-luna-300 flex items-center justify-center text-luna-300 text-2xl font-bold mx-auto mb-3 uppercase">
                {userName.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-white mb-0.5">{userName}</h2>
              <span className="text-[10px] bg-luna-300/10 border border-luna-300/35 text-luna-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-sans">
                {userRoleState === "student" ? "student" : userRoleState === "pr" ? "placement representative" : "departmental login"}
              </span>
            </div>

            {/* Account Credentials Edit Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target as HTMLFormElement);
              const newUsername = fd.get("username") as string;
              const newPass = fd.get("password") as string;
              const confirmPass = fd.get("confirmPassword") as string;

              if (!newUsername) {
                addToast("Username cannot be empty", "error");
                return;
              }

              if (newPass) {
                if (newPass.length < 6) {
                  addToast("Password must be at least 6 characters long", "error");
                  return;
                }
                if (newPass !== confirmPass) {
                  addToast("Passwords do not match", "error");
                  return;
                }
              }

              // Update in state
              if (userRoleState === "student" && currentStudent) {
                // Check if username already exists in another student profile
                const isUsernameTaken = students.some(s => s.username.toLowerCase() === newUsername.toLowerCase() && s.rollNo !== currentStudent.rollNo);
                if (isUsernameTaken) {
                  addToast("Username already exists in another account.", "error");
                  return;
                }

                setStudents(prev => prev.map(s => s.rollNo === currentStudent.rollNo ? { ...s, username: newUsername, passwordKey: newPass || s.passwordKey } : s));
                setCurrentStudent(prev => prev ? { ...prev, username: newUsername, passwordKey: newPass || prev.passwordKey } : null);
              } else if (userRoleState === "pr") {
                setPrUsername(newUsername);
                if (newPass) setPrPassword(newPass);
              } else if (userRoleState === "departmental") {
                setDepartmentalUsername(newUsername);
                if (newPass) setDepartmentalPassword(newPass);
              }

              addToast("Account credentials updated successfully!", "success");
              setIsAccountModalOpen(false);
            }} className="space-y-4 font-sans text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Username / Email</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={14} />
                  <input
                    type="text"
                    name="username"
                    required
                    defaultValue={
                      userRoleState === "student" && currentStudent ? currentStudent.username :
                        userRoleState === "pr" ? prUsername :
                          departmentalUsername
                    }
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-luna-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">New Password (leave blank to keep current)</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={14} />
                  <input
                    type="password"
                    name="password"
                    placeholder="New Password"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-650 focus:outline-none focus:border-luna-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Confirm New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors" size={14} />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-650 focus:outline-none focus:border-luna-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl shadow-lg transition-all text-xs uppercase"
              >
                Save Account Updates
              </button>
            </form>

            {/* Logout Option in Settings Dialog */}
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <button
                onClick={() => {
                  setIsAccountModalOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/25 text-red-350 border border-red-500/25 transition-all uppercase tracking-wider"
              >
                Log Out Session
              </button>
            </div>

          </div>
        </div>
      )}


      {/* --- COMPANY DETAILS INSIGHTS MODAL --- */}
      {selectedCompanyDetails && (() => {
        const details = companyDetails[selectedCompanyDetails];
        const matchedComp = companies.find(c => c.name === selectedCompanyDetails);

        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
            <div className="glass-panel max-w-3xl w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col my-8">
              {/* Background gradient decor */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-luna-300/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedCompanyDetails(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Modal Header */}
              <div className="border-b border-white/10 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border shadow-inner bg-luna-300/10 border-luna-300/35 text-luna-300`}>
                    {matchedComp?.logo || selectedCompanyDetails.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                      {selectedCompanyDetails}
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
                  className={`pb-2 font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${detailsTab === "info" ? "border-luna-300 text-white" : "border-transparent text-slate-400 hover:text-white"}`}
                >
                  Insights & Guidelines
                </button>
                <button
                  onClick={() => setDetailsTab("placed")}
                  className={`pb-2 font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${detailsTab === "placed" ? "border-luna-300 text-white" : "border-transparent text-slate-400 hover:text-white"}`}
                >
                  Placed Students
                </button>
                <button
                  onClick={() => setDetailsTab("history")}
                  className={`pb-2 font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${detailsTab === "history" ? "border-luna-300 text-white" : "border-transparent text-slate-400 hover:text-white"}`}
                >
                  Edit History
                </button>
              </div>

              {/* Modal Content */}
              {detailsTab === "info" && (
                details ? (
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
                            {details.selectionProcess.rounds.map((round, idx) => (
                              <li key={idx} className="flex gap-2 items-start text-slate-300">
                                <span className="w-4 h-4 rounded-full bg-luna-300/10 border border-luna-300/40 text-[9px] font-black text-luna-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="leading-snug">{round}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 text-[11px]">
                          <span className="text-slate-400 font-bold block uppercase tracking-wider mb-1">Evaluation Focus</span>
                          <p className="text-slate-350 italic">{details.selectionProcess.criteria}</p>
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
                              {details.interviewInsights.leetcodeFocus}
                            </span>
                          </div>

                          <div className="mb-4">
                            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">Key DSA Topics</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {details.interviewInsights.questionTypes.map((type, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[9px] text-slate-300 font-semibold">
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1.5">Sample Interview Questions</span>
                            <div className="space-y-2.5">
                              {details.interviewInsights.examples.map((example, idx) => (
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
                          {details.skills.core.map((skill, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold text-[10px]">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">Additional Edge-Giving Certs</h4>
                        <p className="text-slate-350 leading-relaxed italic">{details.skills.additional}</p>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    <AlertCircle size={24} className="mx-auto mb-2 text-slate-500" />
                    <p>Detailed insights for {selectedCompanyDetails} are not available yet.</p>
                  </div>
                )
              )}

              {detailsTab === "history" && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-xs font-sans">
                  <h4 className="text-sm font-extrabold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                    <HistoryIcon size={14} className="text-luna-300" />
                    Audit Trail & Edit History Logs
                  </h4>
                  {editLogs.filter(log => log.companyName.toLowerCase() === selectedCompanyDetails.toLowerCase()).length === 0 ? (
                    <div className="text-center py-12 text-slate-400 border border-dashed border-white/5 rounded-2xl">
                      No edits or modifications have been logged for this company yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editLogs
                        .filter(log => log.companyName.toLowerCase() === selectedCompanyDetails.toLowerCase())
                        .map(log => (
                          <div key={log.id} className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase
                                  ${log.actionType === "Add" ? "bg-green-500/10 text-green-300 border border-green-500/20" :
                                    log.actionType === "Edit" ? "bg-blue-500/10 text-blue-300 border border-blue-500/20" :
                                      log.actionType === "Soft Delete" ? "bg-orange-500/10 text-orange-300 border border-orange-500/20" :
                                        "bg-red-500/10 text-red-300 border border-red-500/20"}`}
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

                  {(!details || !details.placedStudents || details.placedStudents.length === 0) ? (
                    <div className="text-center py-12 text-slate-400 border border-dashed border-white/5 rounded-2xl">
                      No placed students are currently listed for this company.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {details.placedStudents.map((student, idx) => (
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
                  onClick={() => setSelectedCompanyDetails(null)}
                  className="px-6 py-2 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Close & Back
                </button>
              </div>

            </div>
          </div>
        );
      })()}


      {/* --- ADD / EDIT COMPANY MODAL --- */}
      {companyFormOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[130] flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
          <div className="glass-panel max-w-2xl w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col my-8">
            {/* Background gradient decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-luna-300/5 rounded-full blur-2xl"></div>

            {/* Close Button */}
            <button
              onClick={() => setCompanyFormOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="border-b border-white/10 pb-4 mb-5">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                {editingCompany ? "Edit Company Profile" : "Register Recruitment Drive"}
              </h3>
              <p className="text-[10px] text-slate-400 font-serif mt-0.5">
                Set recruitment statistics, eligibility parameters, and interview insights.
              </p>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSaveCompany} className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-xs">

              {/* Section: Basic Information */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-luna-300 uppercase tracking-widest border-b border-white/5 pb-1">
                  1. Company & Sector
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={compFormName}
                      onChange={(e) => setCompFormName(e.target.value)}
                      disabled={!!editingCompany}
                      placeholder="e.g. Google"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Sector *</label>
                    <input
                      type="text"
                      required
                      value={compFormSector}
                      onChange={(e) => setCompFormSector(e.target.value)}
                      placeholder="e.g. IT / Software"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Packages, Eligibility & Hires */}
              <div className="space-y-4 pt-1">
                <h4 className="text-[10px] font-bold text-luna-300 uppercase tracking-widest border-b border-white/5 pb-1">
                  2. Eligibility & Placement Stats
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Max Offer *</label>
                    <input
                      type="text"
                      required
                      value={compFormMaxPackage}
                      onChange={(e) => setCompFormMaxPackage(e.target.value)}
                      placeholder="e.g. 16.0 LPA"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Avg Offer *</label>
                    <input
                      type="text"
                      required
                      value={compFormAvgPackage}
                      onChange={(e) => setCompFormAvgPackage(e.target.value)}
                      placeholder="e.g. 13.0 LPA"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Min CGPA *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={compFormMinCgpa}
                      onChange={(e) => setCompFormMinCgpa(parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 6.0"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Hires Count</label>
                    <input
                      type="number"
                      value={compFormHires}
                      onChange={(e) => setCompFormHires(parseInt(e.target.value) || 0)}
                      placeholder="e.g. 5"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Custom Logo Editor */}
              <div className="space-y-4 pt-1">
                <h4 className="text-[10px] font-bold text-luna-300 uppercase tracking-widest border-b border-white/5 pb-1">
                  3. Branding & Logo Editor
                </h4>

                <div className="flex flex-col sm:flex-row gap-4 items-center bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <div className="flex-shrink-0">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider mb-2 text-center">Preview</span>
                    {compFormLogo ? (
                      compFormLogo.startsWith("data:image") ? (
                        <img
                          src={compFormLogo}
                          alt="Branding Logo"
                          className={`w-14 h-14 rounded-2xl object-contain p-1 border border-white/10 ${compFormLogoTransparent ? "bg-white/5" : "bg-white"}`}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-luna-300/25 border border-luna-300/40 text-luna-300 text-lg font-black flex items-center justify-center">
                          {compFormLogo}
                        </div>
                      )
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-[10px] flex items-center justify-center text-center">
                        Fallback initials
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Upload Logo File (PNG/JPEG)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              setCompFormLogo(base64);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-luna-300 file:text-luna-950 hover:file:bg-luna-50 cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                      <label className="flex items-center gap-2 text-[10px] text-slate-300 cursor-pointer font-sans">
                        <input
                          type="checkbox"
                          checked={compFormLogoTransparent}
                          onChange={(e) => setCompFormLogoTransparent(e.target.checked)}
                          className="rounded border-white/10 text-luna-300 focus:ring-0 focus:ring-offset-0 bg-black/20"
                        />
                        Transparent logo background preview
                      </label>

                      <button
                        type="button"
                        onClick={() => setCompFormLogo("")}
                        className="text-[9px] text-red-300 hover:text-red-200 font-bold uppercase transition-all bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded border border-red-500/20 cursor-pointer"
                      >
                        Reset to initials
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Overview */}
              <div className="space-y-4 pt-1">
                <h4 className="text-[10px] font-bold text-luna-300 uppercase tracking-widest border-b border-white/5 pb-1">
                  4. Company Overview & Insight Details
                </h4>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Overview *</label>
                  <textarea
                    required
                    rows={3}
                    value={compFormOverview}
                    onChange={(e) => setCompFormOverview(e.target.value)}
                    placeholder="Provide a general summary overview of the company, product focus, and market domain..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300 font-serif"
                  />
                </div>
              </div>

              {/* Section: Selection Process & Rounds */}
              <div className="space-y-4 pt-1">
                <h4 className="text-[10px] font-bold text-luna-300 uppercase tracking-widest border-b border-white/5 pb-1">
                  5. Selection Process rounds & Criteria
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Rounds List</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={compFormNewRound}
                        onChange={(e) => setCompFormNewRound(e.target.value)}
                        placeholder="e.g. Round 1: Online Coding assessment"
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (compFormNewRound.trim()) {
                            setCompFormRounds(prev => [...prev, compFormNewRound.trim()]);
                            setCompFormNewRound("");
                          }
                        }}
                        className="px-4 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold uppercase rounded-xl transition-all cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {compFormRounds.length > 0 && (
                    <div className="space-y-1.5 bg-black/20 border border-white/5 rounded-xl p-3">
                      {compFormRounds.map((round, idx) => (
                        <div key={idx} className="flex justify-between items-center gap-2 text-[11px] text-slate-300 py-1 border-b border-white/5 last:border-b-0">
                          <span className="flex gap-2 items-center">
                            <span className="w-4 h-4 rounded-full bg-luna-300/10 border border-luna-300/30 text-[9px] font-black text-luna-300 flex items-center justify-center">
                              {idx + 1}
                            </span>
                            {round}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCompFormRounds(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-400 hover:text-red-300 font-bold px-1 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Evaluation Focus (Criteria)</label>
                    <textarea
                      rows={2}
                      value={compFormEvaluationFocus}
                      onChange={(e) => setCompFormEvaluationFocus(e.target.value)}
                      placeholder="e.g. Strong analytical skills, core CS fundamentals, and collaborative spirit..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Interview Insights */}
              <div className="space-y-4 pt-1">
                <h4 className="text-[10px] font-bold text-luna-300 uppercase tracking-widest border-b border-white/5 pb-1">
                  6. Interview Insights
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">LeetCode Coding Focus</label>
                    <select
                      value={compFormLeetcodeFocus}
                      onChange={(e) => setCompFormLeetcodeFocus(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    >
                      <option value="Low">Low Focus (Direct questions)</option>
                      <option value="Medium">Medium Focus (LeetCode Medium topics)</option>
                      <option value="High">High Focus (LeetCode Medium-Hard optimized complexity)</option>
                      <option value="Extremely High">Extremely High Focus (LeetCode Hard and systems design)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Key DSA Topics (Comma-separated)</label>
                    <input
                      type="text"
                      value={compFormDsaTopics}
                      onChange={(e) => setCompFormDsaTopics(e.target.value)}
                      placeholder="e.g. Graph theory, Dynamic programming, Trees"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Sample Interview Questions</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={compFormNewExample}
                        onChange={(e) => setCompFormNewExample(e.target.value)}
                        placeholder="e.g. Implement a thread-safe LRU cache with O(1) operations."
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (compFormNewExample.trim()) {
                            setCompFormExamples(prev => [...prev, compFormNewExample.trim()]);
                            setCompFormNewExample("");
                          }
                        }}
                        className="px-4 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold uppercase rounded-xl transition-all cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {compFormExamples.length > 0 && (
                    <div className="space-y-1.5 bg-black/20 border border-white/5 rounded-xl p-3">
                      {compFormExamples.map((example, idx) => (
                        <div key={idx} className="flex justify-between items-center gap-2 text-[11px] text-slate-355 italic py-1 border-b border-white/5 last:border-b-0 font-serif">
                          <span>"{example}"</span>
                          <button
                            type="button"
                            onClick={() => setCompFormExamples(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-400 hover:text-red-300 font-bold px-1 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section: Skills & Certifications */}
              <div className="space-y-4 pt-1">
                <h4 className="text-[10px] font-bold text-luna-300 uppercase tracking-widest border-b border-white/5 pb-1">
                  7. Skills & Certifications
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Core Valued Skills (Comma-separated)</label>
                    <input
                      type="text"
                      value={compFormCoreSkills}
                      onChange={(e) => setCompFormCoreSkills(e.target.value)}
                      placeholder="e.g. Data Structures, C++, System Design"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Additional Edge-Giving Certs</label>
                    <input
                      type="text"
                      value={compFormCertifications}
                      onChange={(e) => setCompFormCertifications(e.target.value)}
                      placeholder="e.g. Google Cloud certifications or Open Source contributions"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luna-300"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Placed Students */}
              <div className="space-y-4 pt-1">
                <h4 className="text-[10px] font-bold text-luna-300 uppercase tracking-widest border-b border-white/5 pb-1">
                  8. Placed Students List
                </h4>

                <div className="space-y-3">
                  <div className="bg-black/20 border border-white/5 rounded-xl p-3 space-y-3">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Add Placed Student to List</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Student Name</label>
                        <input
                          type="text"
                          value={newPlacedName}
                          onChange={(e) => setNewPlacedName(e.target.value)}
                          placeholder="e.g. Srikrishna M"
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-luna-300"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Designation / Role</label>
                        <input
                          type="text"
                          value={newPlacedRole}
                          onChange={(e) => setNewPlacedRole(e.target.value)}
                          placeholder="e.g. Systems Engineer"
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-luna-300"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">LinkedIn Profile/ID</label>
                        <input
                          type="text"
                          value={newPlacedLinkedin}
                          onChange={(e) => setNewPlacedLinkedin(e.target.value)}
                          placeholder="e.g. srikrishna-m"
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-luna-300"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!newPlacedName.trim() || !newPlacedRole.trim() || !newPlacedLinkedin.trim()) {
                          addToast("Please fill Name, Role, and LinkedIn before adding", "error");
                          return;
                        }
                        const newStudent: PlacedStudent = {
                          name: newPlacedName.trim(),
                          role: newPlacedRole.trim(),
                          linkedin: newPlacedLinkedin.trim()
                        };
                        setCompFormPlacedStudents(prev => [...prev, newStudent]);
                        setNewPlacedName("");
                        setNewPlacedRole("");
                        setNewPlacedLinkedin("");
                        addToast(`Added ${newStudent.name} to the placed list`, "success");
                      }}
                      className="w-full py-2 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold uppercase rounded-lg transition-all text-[10px] cursor-pointer"
                    >
                      + Add Placed Student
                    </button>
                  </div>

                  {compFormPlacedStudents.length > 0 && (
                    <div className="space-y-1.5 bg-black/20 border border-white/5 rounded-xl p-3 font-sans">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Currently Added Placed Students</span>
                      {compFormPlacedStudents.map((student, idx) => (
                        <div key={idx} className="flex justify-between items-center gap-2 text-[11px] text-slate-300 py-1.5 border-b border-white/5 last:border-b-0">
                          <span className="flex gap-2 items-center min-w-0">
                            <span className="w-4 h-4 rounded-full bg-luna-300/10 border border-luna-300/30 text-[9px] font-black text-luna-300 flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="truncate"><strong>{student.name}</strong> - {student.role} ({student.linkedin})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCompFormPlacedStudents(prev => prev.filter((_, i) => i !== idx));
                              addToast(`Removed ${student.name}`, "info");
                            }}
                            className="text-red-400 hover:text-red-300 font-bold px-1.5 cursor-pointer flex-shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCompanyFormOpen(false)}
                  className="px-4 py-2 border border-white/10 text-slate-350 rounded-xl text-xs font-bold uppercase hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold rounded-xl text-xs uppercase transition-all cursor-pointer"
                >
                  {editingCompany ? "Save Changes" : "Register"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- MOCK ASSESSMENT TEST OVERLAY MODAL --- */}
      {isMockTestOpen && (() => {
        const questions = mockTestSubject === "aptitude" ? APTITUDE_QUESTIONS : TECHNICAL_QUESTIONS;
        const activeQuestion = questions[activeQuestionIdx];

        let correctCount = 0;
        questions.forEach((q, idx) => {
          if (selectedAnswers[idx] === q.correct) correctCount++;
        });

        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <div className="glass-panel max-w-2xl w-full rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col my-8 font-sans">
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
                <div className="space-y-6 flex-1">
                  {/* Progress bar */}
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-luna-300 h-full transition-all duration-300"
                      style={{ width: `${((activeQuestionIdx + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>

                  {/* Question header info */}
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Question {activeQuestionIdx + 1} of {questions.length}</span>
                    <span className="text-luna-300">Single Choice Objective</span>
                  </div>

                  {/* Question Prompt */}
                  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-white text-xs font-serif leading-relaxed font-medium">
                      {activeQuestion.question}
                    </p>
                  </div>

                  {/* Options List */}
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
                              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold text-[9px] uppercase tracking-wider transition-all
                            ${isSelected ? "bg-luna-300 border-luna-300 text-luna-950" : "border-slate-500 text-slate-450"}`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer Controls */}
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
                <div className="space-y-6 flex-1">
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

                    <p className="text-[11px] text-slate-355 font-serif mt-4 max-w-md mx-auto leading-relaxed">
                      {correctCount === 3
                        ? "Excellent performance! Your core concept grasp matches elite recruiters benchmarks. Keep compiling!"
                        : correctCount === 2
                          ? "Good effort! Just minor mistakes. Read the concepts and explanations details below to lock perfect accuracy."
                          : "Needs improvement. Review coding modules and logic concepts. Practice frequently in the sandbox compiler."}
                    </p>
                  </div>

                  {/* Concept explanation sheet */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
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
                      Close & Finish review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}


      {/* --- TOASTS DRAWER --- */}
      <div className="fixed bottom-6 right-6 z-[150] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-6 py-4 rounded-2xl shadow-xl text-white font-medium flex items-center gap-3 animate-slide-up backdrop-blur-xl border border-white/10
              ${toast.type === "success" ? "bg-luna-400/80 text-luna-950" : toast.type === "error" ? "bg-red-500/80" : "bg-luna-800/80"}`}
          >
            {toast.type === "success" && <Check size={18} />}
            {toast.type === "error" && <ShieldAlert size={18} />}
            {toast.type === "info" && <Info size={18} />}
            <span className="text-xs font-semibold">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-3 opacity-60 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

// --- DOM RENDER ---
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}