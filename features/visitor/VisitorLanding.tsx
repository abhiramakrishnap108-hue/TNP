"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Video,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Briefcase,
  Users,
  CheckCircle2,
  ArrowRight,
  Lock,
  Mail,
  Globe,
  Building2,
  GraduationCap,
  Info,
  Phone,
  Linkedin,
  Twitter,
  Sparkles,
  ExternalLink,
  ChevronDown,
  FileText,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import CompanyDetailsModal from "../../components/CompanyDetailsModal";

interface VisitorLandingProps {
  activeTab: string;
  theme: "dark" | "light";
}

// Hero Image Sliders
const heroImages = [
  "/assests/1.jpeg",
  "/assests/2.jpeg",
  "/assests/3.jpeg"
];

const heroTaglines = [
  {
    main: "Bridging Potential & Opportunity",
    sub: "Empowering NITPY graduates to scale global heights with premium professional placements."
  },
  {
    main: "Fostering Innovation & Leadership",
    sub: "Connecting world-class recruiters with technical excellence and resilient problem solvers."
  },
  {
    main: "Shaping Tomorrow's Technocrats",
    sub: "NIT Puducherry Training & Placement Cell provides consistent guidance and rich opportunities."
  }
];

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

export default function VisitorLanding({ activeTab, theme }: VisitorLandingProps) {
  const { isLoggedIn, setIsLoginOpen, currentStudent } = useAuth();
  const { events, prs, companies, addToast } = useData();

  // Local UI States
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [statMode, setStatMode] = useState<"packages" | "sectors" | "trends" | "brochure-stats">("packages");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [teamDeptFilter, setTeamDeptFilter] = useState("default");
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState<string | null>(null);

  // Auto Slider for Hero
  useEffect(() => {
    if (activeTab !== "home") return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Recruiter filtration
  const filteredRecruiters = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === "All" || company.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  // Package Stats Data for SVG Chart
  const departmentStats = [
    {
      dept: "CSE",
      highest: 23.0,
      average: 15.47,
      yearsData: {
        2023: "Highest: 16 LPA, Avg: 11.2 LPA",
        2024: "Highest: 18 LPA, Avg: 12.5 LPA",
        2025: "Highest: 20 LPA, Avg: 13.8 LPA",
        2026: "Highest: 23.0 LPA, Avg: 15.47 LPA"
      }
    },
    {
      dept: "ECE",
      highest: 23.0,
      average: 12.96,
      yearsData: {
        2023: "Highest: 15 LPA, Avg: 9.5 LPA",
        2024: "Highest: 18 LPA, Avg: 10.8 LPA",
        2025: "Highest: 20 LPA, Avg: 11.5 LPA",
        2026: "Highest: 23.0 LPA, Avg: 12.96 LPA"
      }
    },
    {
      dept: "Civil",
      highest: 21.0,
      average: 13.25,
      yearsData: {
        2023: "Highest: 12 LPA, Avg: 8.5 LPA",
        2024: "Highest: 15 LPA, Avg: 9.8 LPA",
        2025: "Highest: 18 LPA, Avg: 11.2 LPA",
        2026: "Highest: 21.0 LPA, Avg: 13.25 LPA"
      }
    },
    {
      dept: "EEE",
      highest: 18.0,
      average: 11.2,
      yearsData: {
        2023: "Highest: 11 LPA, Avg: 7.2 LPA",
        2024: "Highest: 13 LPA, Avg: 8.5 LPA",
        2025: "Highest: 15 LPA, Avg: 9.8 LPA",
        2026: "Highest: 18.0 LPA, Avg: 11.20 LPA"
      }
    },
    {
      dept: "Mech",
      highest: 16.0,
      average: 10.5,
      yearsData: {
        2023: "Highest: 10 LPA, Avg: 7.0 LPA",
        2024: "Highest: 12 LPA, Avg: 8.2 LPA",
        2025: "Highest: 14 LPA, Avg: 9.3 LPA",
        2026: "Highest: 16.0 LPA, Avg: 10.50 LPA"
      }
    }
  ];

  const sectorDistribution = [
    { sector: "IT / Software", percent: 55, color: "from-blue-500 to-cyan-400", trend: "+5% vs last year" },
    { sector: "Core Engineering", percent: 25, color: "from-teal-500 to-emerald-400", trend: "+3% vs last year" },
    { sector: "Analytics / Consulting", percent: 12, color: "from-violet-500 to-purple-400", trend: "Steady" },
    { sector: "Finance", percent: 5, color: "from-amber-500 to-orange-400", trend: "New recruiters added" },
    { sector: "PSUs / R&D", percent: 3, color: "from-red-500 to-rose-400", trend: "High demand" }
  ];

  const placementTrends = [
    { year: "2023", rate: 84, highest: 24.0, avg: 8.5 },
    { year: "2024", rate: 88, highest: 28.0, avg: 9.2 },
    { year: "2025", rate: 91, highest: 38.0, avg: 10.5 },
    { year: "2026", rate: 82, highest: 23.0, avg: 12.6 } // 81.82% overall B.Tech
  ];

  return (
    <>
      {activeTab === "home" && (
        /* --- HERO SECTION with Image Slider & Parallax --- */
        <section id="home" className="relative h-screen min-h-[600px] overflow-hidden flex items-center">
          {/* Slider Background images */}
          <div className="absolute inset-0 z-0">
            {heroImages.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out
                  ${
                    idx === heroIndex
                      ? "opacity-80 translate-x-0 scale-105 z-10"
                      : idx < heroIndex
                      ? "opacity-0 -translate-x-full scale-100 z-0"
                      : "opacity-0 translate-x-full scale-100 z-0"
                  }`}
              >
                <img
                  src={img}
                  alt={`Campus Scene ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
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
                        <span
                          className={
                            i === 1
                              ? "text-transparent bg-clip-text bg-gradient-to-r from-luna-300 via-luna-50 to-luna-400 font-extrabold"
                              : ""
                          }
                        >
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
                  href="/assests/NITPY Placement Brochure 2026-27.pdf"
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
        <section
          id="metrics-summary"
          className="py-16 relative z-10 border-t border-white/5 bg-gradient-to-b from-luna-950 to-luna-900/40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              {/* Left Column: Metric Cards Grid */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-6 fade-in-on-scroll">
                <div className="glass-panel p-6 rounded-2xl text-center hover:border-luna-300/40 transition-all duration-300 hover:scale-[1.03]">
                  <Award className="mx-auto text-luna-300 mb-3" size={28} />
                  <h5 className="text-3xl sm:text-4xl font-extrabold font-sans text-white mb-1">81.82%</h5>
                  <p className="text-xs text-slate-400 font-serif">B.Tech Placement Rate</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center hover:border-luna-300/40 transition-all duration-300 hover:scale-[1.03]">
                  <Briefcase className="mx-auto text-luna-300 mb-3" size={28} />
                  <h5 className="text-3xl sm:text-4xl font-extrabold font-sans text-white mb-1">60+</h5>
                  <p className="text-xs text-slate-400 font-serif">Recruiting Partners</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center hover:border-luna-300/40 transition-all duration-300 hover:scale-[1.03]">
                  <TrendingUp className="mx-auto text-luna-300 mb-3" size={28} />
                  <h5 className="text-3xl sm:text-4xl font-extrabold font-sans text-white mb-1">23.00 LPA</h5>
                  <p className="text-xs text-slate-400 font-serif">Highest Package Offered</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl text-center hover:border-luna-300/40 transition-all duration-300 hover:scale-[1.03]">
                  <Users className="mx-auto text-luna-300 mb-3" size={28} />
                  <h5 className="text-3xl sm:text-4xl font-extrabold font-sans text-white mb-1">171+</h5>
                  <p className="text-xs text-slate-400 font-serif">Total Placed Students</p>
                </div>
              </div>

              {/* Right Column: Director's Quote Box */}
              <div className="fade-in-on-scroll">
                <div className="p-8 rounded-3xl bg-luna-300/5 border border-luna-300/25 relative overflow-hidden shadow-xl">
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-luna-300/10 rounded-full blur-xl"></div>
                  <p className="text-base font-serif italic text-luna-300 leading-relaxed mb-6">
                    "I am delighted to extend a warm welcome to each and every one of you as the Director of the
                    National Institute of Technology Puducherry."
                  </p>
                  <div>
                    <span className="block text-right text-xs font-bold font-sans text-white">
                      Dr. Makarand Madhao Ghangrekar
                    </span>
                    <span className="block text-right text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
                      Director, NIT Puducherry
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "home" && (
        /* --- DETAILED PLACEMENT METRICS WITH SVG CHART --- */
        <section id="stats" className="py-24 relative z-10 border-t border-white/5 stats-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-0 fade-in-on-scroll">
              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-luna-300 mb-2">Track Record</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-sans text-white">Placement Statistics</h3>
              <div className="w-16 h-1 bg-luna-300 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Chart Sub navigation menu */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 max-w-xl mx-auto font-sans text-xs font-bold uppercase tracking-wider fade-in-on-scroll">
              {[
                { id: "packages", label: "Salary Packages (Branch)" },
                { id: "sectors", label: "Sector Distribution" },
                { id: "trends", label: "Placement Trends (Annual)" },
                { id: "brochure-stats", label: "M.Tech / branch lists" }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setStatMode(m.id as any)}
                  className={`px-4 py-2.5 rounded-full border transition-all cursor-pointer ${
                    statMode === m.id
                      ? "bg-luna-300 border-luna-300 text-luna-950 shadow-lg shadow-luna-300/15"
                      : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/5 shadow-xl max-w-5xl mx-auto fade-in-on-scroll">
              {statMode === "packages" && (
                <div>
                  <div className="mb-8">
                    <h4 className="text-xl font-bold font-sans text-white">Branch-wise Salary Packages</h4>
                    <p className="text-xs text-slate-400 font-serif mt-1">
                      Highest and Average packages offered across engineering branches in LPA (Lakhs Per Annum).
                    </p>
                  </div>
                  {/* Interactive SVG Bar Chart */}
                  <div className="relative w-full overflow-x-auto min-h-[300px]">
                    <svg className="w-[600px] sm:w-full min-w-[550px] h-[280px]" viewBox="0 0 600 280">
                      {/* Grid lines */}
                      {[0, 5, 10, 15, 20, 25].map((yVal, i) => (
                        <g key={i}>
                          <line
                            x1="50"
                            y1={240 - yVal * 8}
                            x2="580"
                            y2={240 - yVal * 8}
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="1"
                          />
                          <text
                            x="20"
                            y={244 - yVal * 8}
                            fill="#94a3b8"
                            fontSize="9"
                            fontFamily="sans-serif"
                            className="font-semibold text-right"
                          >
                            {yVal}L
                          </text>
                        </g>
                      ))}

                      {/* Render Bars */}
                      {departmentStats.map((branch, idx) => {
                        const xOffset = 80 + idx * 100;
                        const barWidth = 24;
                        const highestH = branch.highest * 8;
                        const averageH = branch.average * 8;

                        return (
                          <g key={idx} className="group/bar cursor-pointer">
                            {/* Highest bar */}
                            <rect
                              x={xOffset}
                              y={240 - highestH}
                              width={barWidth}
                              height={highestH}
                              fill="url(#highestGrad)"
                              rx="4"
                              className="transition-all duration-300 group-hover/bar:brightness-125"
                            />
                            {/* Average bar */}
                            <rect
                              x={xOffset + 28}
                              y={240 - averageH}
                              width={barWidth}
                              height={averageH}
                              fill="url(#avgGrad)"
                              rx="4"
                              className="transition-all duration-300 group-hover/bar:brightness-125"
                            />

                            {/* Tooltip detail triggers */}
                            <text
                              x={xOffset + 26}
                              y="262"
                              fill="#ffffff"
                              fontSize="10"
                              fontFamily="sans-serif"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {branch.dept}
                            </text>

                            {/* Hover info text */}
                            <text
                              x={xOffset + 26}
                              y={230 - highestH}
                              fill="#A7EBF2"
                              fontSize="8"
                              fontFamily="sans-serif"
                              fontWeight="bold"
                              textAnchor="middle"
                              className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300"
                            >
                              Max: {branch.highest}
                            </text>
                            <text
                              x={xOffset + 26}
                              y={238 - highestH}
                              fill="#94a3b8"
                              fontSize="8"
                              fontFamily="sans-serif"
                              textAnchor="middle"
                              className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300"
                            >
                              Avg: {branch.average}
                            </text>
                          </g>
                        );
                      })}

                      {/* Definitions for Gradients */}
                      <defs>
                        <linearGradient id="highestGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#54ACBF" />
                          <stop offset="100%" stopColor="#26658C" stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A7EBF2" />
                          <stop offset="100%" stopColor="#54ACBF" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  {/* Legend key */}
                  <div className="flex justify-center gap-6 mt-4 text-[11px] font-sans font-semibold text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-gradient-to-b from-luna-300 to-luna-600 block"></span>
                      <span>Highest Package (LPA)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-gradient-to-b from-luna-100 to-luna-300/40 block"></span>
                      <span>Average Package (LPA)</span>
                    </div>
                  </div>
                </div>
              )}

              {statMode === "sectors" && (
                <div>
                  <div className="mb-6">
                    <h4 className="text-xl font-bold font-sans text-white">Recruitment Sector Distribution</h4>
                    <p className="text-xs text-slate-400 font-serif mt-1">
                      Percentage of students hired across distinct core and IT placement divisions.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center font-sans">
                    {/* List representation with trend badge */}
                    <div className="space-y-4">
                      {sectorDistribution.map((sec, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-white">{sec.sector}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-luna-300">{sec.percent}%</span>
                              <span className="text-[9px] text-slate-450 font-semibold">{sec.trend}</span>
                            </div>
                          </div>
                          <div className="w-full h-2.5 bg-white/[0.05] rounded-full overflow-hidden border border-white/5">
                            <div className={`h-full bg-gradient-to-r ${sec.color}`} style={{ width: `${sec.percent}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Circular Chart Preview */}
                    <div className="flex items-center justify-center">
                      <div className="relative w-44 h-44 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.01]">
                        <div className="text-center">
                          <span className="text-3xl font-black text-white">60+</span>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Recruiters</p>
                        </div>
                        {/* Styled absolute concentric rings */}
                        <div className="absolute inset-2 border border-dashed border-luna-300/20 rounded-full animate-spin-slow"></div>
                        <div className="absolute inset-5 border border-white/5 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {statMode === "trends" && (
                <div>
                  <div className="mb-6">
                    <h4 className="text-xl font-bold font-sans text-white">Annual Placement Trends</h4>
                    <p className="text-xs text-slate-400 font-serif mt-1">
                      Overview of placement percentages and average package trajectories over the years.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-serif text-slate-350">
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
                    <p className="text-xs text-slate-400 font-serif mt-1">
                      Detailed branch-wise students placed and percentage highlights
                    </p>
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
                          { dept: "Computer Science & Engineering (CSE)", placed: 47, pct: "85.45%" },
                          { dept: "Electrical & Electronics Engineering (EEE)", placed: 39, pct: "86.67%" },
                          { dept: "Electronics & Communication Engineering (ECE)", placed: 32, pct: "74.42%" },
                          { dept: "Mechanical Engineering", placed: 25, pct: "75.76%" },
                          { dept: "Civil Engineering", placed: 19, pct: "86.36%" },
                          { dept: "Overall B.Tech", placed: 162, pct: "81.82%", isHighlight: true }
                        ].map((row, idx) => (
                          <tr
                            key={idx}
                            className={`hover:bg-white/[0.02] transition-colors ${
                              row.isHighlight ? "font-bold text-white bg-luna-300/5" : ""
                            }`}
                          >
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
                    <p className="text-xs text-slate-400 font-serif mt-1">
                      Detailed postgraduate and science department placement records
                    </p>
                  </div>
                  <div className="overflow-x-auto mb-8">
                    <table className="w-full text-left font-serif text-slate-300">
                      <thead>
                        <tr className="border-b border-white/10 font-sans text-xs uppercase tracking-wider text-luna-300">
                          <th className="py-4">Programme</th>
                          <th className="py-4">Students Placed</th>
                          <th className="py-4">Placement %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {[
                          { program: "M.Tech Civil Engineering (CE)", placed: 2, pct: "66.67%" },
                          { program: "M.Tech Computer Science & Eng. (CSE)", placed: 4, pct: "66.67%" },
                          { program: "M.Tech Electronics & Comm. Eng. (ECE)", placed: 3, pct: "60.00%" },
                          { program: "M.Sc Chemistry", placed: 3, pct: "60.00%" },
                          { program: "M.Sc Mathematics", placed: 2, pct: "50.00%" }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4">{row.program}</td>
                            <td className="py-4">{row.placed}</td>
                            <td className="py-4 text-luna-300">{row.pct}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xl font-bold font-sans text-white">Salary Packages & Distributions</h4>
                    <p className="text-xs text-slate-400 font-serif mt-1">Department average and highest package statistics</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                      { dept: "Civil Engineering (CE)", avg: "₹13.25 LPA", max: "₹21.00 LPA" },
                      { dept: "Computer Science & Eng. (CSE)", avg: "₹15.47 LPA", max: "₹23.00 LPA" },
                      { dept: "Electronics & Comm. Eng. (ECE)", avg: "₹12.96 LPA", max: "₹23.00 LPA" }
                    ].map((item, idx) => (
                      <div key={idx} className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                        <h5 className="font-bold text-white font-sans text-xs sm:text-sm mb-2 break-words">{item.dept}</h5>
                        <div className="text-xs text-slate-350 space-y-1">
                          <div>
                            Average CTC: <strong className="text-luna-300 font-bold">{item.avg}</strong>
                          </div>
                          <div>
                            Highest CTC: <strong className="text-white font-bold">{item.max}</strong>
                          </div>
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
        /* --- ALUMNI TESTIMONIALS with Carousel --- */
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
                    <p className="text-xs text-slate-400 font-serif italic mt-0.5">
                      {testimonials[testimonialIndex].role} at {testimonials[testimonialIndex].company}
                    </p>
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
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === testimonialIndex
                        ? "bg-luna-300 w-8 shadow-[0_0_10px_rgba(84,172,191,0.6)]"
                        : "bg-slate-600 hover:bg-slate-400"
                    }`}
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
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luna-300 transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search recruiters by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-luna-300/60 focus:ring-1 focus:ring-luna-300/20 transition-all font-serif"
                />
              </div>

              {/* Sector filters */}
              <div className="flex flex-wrap gap-2 justify-center font-sans">
                {["All", "IT / Software", "Core Engineering", "Analytics / Consulting", "Finance"].map((sector) => (
                  <button
                    key={sector}
                    onClick={() => setSelectedSector(sector)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      selectedSector === sector
                        ? "bg-luna-300/20 border-luna-300 text-luna-300 shadow-md shadow-luna-300/10"
                        : "bg-white/5 border-white/10 text-slate-350 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {sector === "All" ? "All Sectors" : sector}
                  </button>
                ))}
              </div>
            </div>

            {/* Recruiters Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto fade-in-on-scroll">
              {filteredRecruiters
                .filter((c) => c.status === "active")
                .map((company) => (
                  <div
                    key={company.id}
                    className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-luna-300/40 hover:shadow-[0_0_20px_rgba(84,172,191,0.25)] hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div>
                      {/* Top banner accent based on company design branding */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-luna-300 to-luna-600"></div>

                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black border shadow-inner ${
                            company.color || "bg-luna-300/10 border-luna-300/35 text-luna-300"
                          }`}
                        >
                          {company.logo}
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                          {company.sector}
                        </span>
                      </div>

                      <h4 className="text-base font-black font-sans text-white mb-2 leading-tight">{company.name}</h4>
                      <p className="text-xs text-slate-350 font-serif leading-relaxed mb-4 line-clamp-3">
                        {company.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-3 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-sans">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                          <span className="text-[8px] text-slate-450 block uppercase font-bold">Max Offer</span>
                          <strong className="text-white font-black text-xs block mt-0.5">{company.maxPackage}</strong>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                          <span className="text-[8px] text-slate-450 block uppercase font-bold">Min CGPA</span>
                          <strong className="text-white font-black text-xs block mt-0.5">
                            {company.minCgpa?.toFixed(1) || "6.0"}
                          </strong>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-luna-300 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                            title="Visit Website"
                          >
                            <Globe size={13} />
                          </a>
                        )}

                        <button
                          onClick={() => setSelectedCompanyDetails(company.name)}
                          className="flex-grow py-2.5 bg-white/5 hover:bg-luna-300 hover:text-luna-950 border border-white/10 hover:border-luna-300 text-slate-300 rounded-xl font-bold font-sans text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          View Insights <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              {filteredRecruiters.filter((c) => c.status === "active").length === 0 && (
                <div className="col-span-full text-center py-16 text-slate-400 font-serif">
                  No recruiters match your active filters. Try adjustments.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === "vision" && (
        /* --- VISION SECTION --- */
        <section id="vision" className="pt-6 pb-12 relative z-10 border-t border-white/5 vision-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              {/* Vision Left Panel - Glass card */}
              <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden fade-in-on-scroll">
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-luna-300/10 rounded-full blur-xl"></div>

                <h4 className="text-2xl font-bold font-sans text-luna-300 mb-4 flex items-center gap-2 justify-center">
                  <GraduationCap size={24} />
                  Strategic Objectives
                </h4>
                <p className="text-slate-300 font-serif leading-relaxed mb-6 text-center">
                  The Training and Placement Cell of National Institute of Technology Puducherry is dedicated to
                  bridging the academic-industry gap by grooming engineering graduates into leaders of tomorrow.
                </p>

                <ul className="space-y-4 font-serif text-slate-300 max-w-xl mx-auto">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-luna-300 mt-1 flex-shrink-0" />
                    <span>Nurturing students via technical masterclasses, coding bootcamps, and soft-skill workshops.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-luna-300 mt-1 flex-shrink-0" />
                    <span>Partnering with global conglomerates to establish rich placement and internship streams.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-luna-300 mt-1 flex-shrink-0" />
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
                    document.getElementById("core-mandates-heading")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-[11px] text-slate-400 hover:text-luna-300 transition-colors font-serif inline-flex items-center gap-1.5 justify-center group"
                >
                  <span>To achieve this vision, we focus on the following mandates</span>
                  <ArrowRight size={12} className="text-luna-300 group-hover:translate-y-0.5 transition-transform rotate-90" />
                </a>
              </div>
            </div>

            {/* Focus Areas Section */}
            <div className="relative mandates-section mt-16">
              {/* Glowing Gradient Divider */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-luna-300/30 to-transparent"></div>
              {/* Background radial glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-luna-300/5 rounded-full blur-[80px] pointer-events-none -z-10"></div>

              <div id="core-mandates-heading" className="text-center mb-12">
                <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-luna-300 mb-2">Core Mandates</h2>
                <h3 className="text-3xl sm:text-4xl font-extrabold font-sans text-white">Focus Areas & Strategic Initiatives</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-serif mt-2 max-w-2xl mx-auto">
                  What we are mainly focusing on to drive student success
                </p>
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
                  <div
                    key={idx}
                    className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-luna-300/35 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
                  >
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="glass-panel p-8 rounded-3xl hover:border-luna-300/50 transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between group fade-in-on-scroll">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-luna-300/10 flex items-center justify-center text-luna-300 mb-6 group-hover:scale-110 transition-transform">
                    <Building2 size={24} />
                  </div>
                  <h4 className="text-xl font-bold font-sans text-white mb-3">Pre-Placement Grooming</h4>
                  <p className="text-slate-300 font-serif text-sm leading-relaxed">
                    We host comprehensive workshops focusing on technical mock tests, system design webinars, professional
                    resume building, group discussions, and behavioral mock interviews.
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
                    {isLoggedIn ? <ArrowRight size={14} /> : <Lock size={12} className="opacity-80" />}
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
                    Facilitating mandatory industrial internships at MNCs, R&D labs, and top-tier public sectors during
                    pre-final semesters to ensure early real-world exposure.
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
                    {isLoggedIn ? <ArrowRight size={14} /> : <Lock size={12} className="opacity-80" />}
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
                    Bridging connections with distinguished alumni globally through virtual fireside chats, mentor circles,
                    and expert lectures to guide active job candidates.
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
                    {isLoggedIn ? <ArrowRight size={14} /> : <Lock size={12} className="opacity-80" />}
                  </span>
                </div>
              </div>
            </div>

            {/* --- T&P Activities, Aims, Infrastructure & Prep --- */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Overview & Mission */}
              <div className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-luna-300/30 transition-all duration-350 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold font-sans text-white mb-4 flex items-center gap-2">
                    <GraduationCap size={18} className="text-luna-300" />
                    Overview & Mission
                  </h4>
                  <p className="text-[11px] text-slate-300 font-serif leading-relaxed mb-4">
                    NIT Puducherry is committed to creating an infrastructure and academic environment that stands on par
                    with the best global benchmarks.
                  </p>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <span className="text-[9px] text-luna-300 font-bold uppercase tracking-wider block font-sans mb-1">
                    Mission Focus
                  </span>
                  <p className="text-[10px] text-slate-350 font-serif leading-relaxed">
                    "Building infrastructure & global academic environment, offering UG/PG/Ph.D., and fostering
                    international R&D collaborations."
                  </p>
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
                    <span>T&P Office Room, T&P Lab, and Tech Panels.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-luna-300 font-bold">•</span>
                    <span>Fully equipped online exam assessment labs.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-luna-300 font-bold">•</span>
                    <span>Soundproof Group Discussion & HR Interview rooms.</span>
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
                    <span>Mock group discussions & HR interviews.</span>
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
                    <li>• **NIRF 2025 (NITPY):** Engineering Recognition</li>
                    <li>• **India Today 2025:** Top Govt. Technical Survey</li>
                    <li>• **IIRF 2026:** Premier Institute Rankings</li>
                  </ul>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3">
                  <span className="text-[9px] text-luna-300 font-bold uppercase tracking-wider block font-sans mb-1">
                    Publications & Patents
                  </span>
                  <p className="text-[11px] text-slate-350 font-serif font-semibold">1,970+ Publications | 33 Patents</p>
                </div>
              </div>
            </div>

            {/* Team Nurturing Verticals / Our Operations */}
            <div className="mt-16 border-t border-white/5 pt-8">
              <div className="text-center mb-8">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-luna-300 mb-2">Our Operations</h4>
                <h5 className="text-2xl font-extrabold font-sans text-white">Nurturing Verticals & Training Objectives</h5>
                <p className="text-xs text-slate-400 font-serif mt-2">
                  How our placement team actively prepares and guides the student batch
                </p>
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
                  <div
                    key={idx}
                    className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-luna-300/30 transition-all duration-300 flex flex-col justify-between"
                  >
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
            <div className="mt-16 border-t border-white/5 pt-8">
              <div className="text-center mb-8">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-luna-300 mb-2">Process flow</h4>
                <h5 className="text-2xl font-extrabold font-sans text-white">Placement Calendar & Lifecycle</h5>
                <p className="text-xs text-slate-400 font-serif mt-2">
                  The structured chronological schedule of events during the recruitment session
                </p>
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
                  <div
                    key={idx}
                    className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-luna-300/30 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-3xl font-black font-sans text-luna-300/40 block mb-4">{phase.step}</span>
                      <h6 className="text-sm font-bold font-sans text-white mb-1">{phase.title}</h6>
                      <span className="text-[10px] text-luna-300 font-semibold uppercase tracking-wider block mb-3">
                        {phase.time}
                      </span>
                      <p className="text-xs text-slate-300 font-serif leading-relaxed">{phase.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruitment Process Flow Timeline */}
            <div className="mt-16">
              <div className="text-center mb-8">
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
                  <h6 className="text-base font-bold font-sans text-white group-hover:text-luna-300 transition-colors">
                    1. Invitation
                  </h6>
                  <p className="text-xs font-serif text-slate-400 mt-2 leading-relaxed max-w-4xl">
                    The Placement Office formally invites organizations along with the placement brochure and the Job
                    Announcement Form (JAF).
                  </p>
                </div>

                {/* Step 2: Registration */}
                <div className="relative pl-8 md:pl-12 group">
                  <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-luna-950 border border-luna-300 flex items-center justify-center text-luna-300 font-bold text-xs group-hover:bg-luna-300 group-hover:text-luna-950 transition-colors">
                    2
                  </div>
                  <h6 className="text-base font-bold font-sans text-white group-hover:text-luna-300 transition-colors">
                    2. Registration
                  </h6>
                  <p className="text-xs font-serif text-slate-400 mt-2 leading-relaxed max-w-4xl">
                    Eligible students register themselves for the drive based on company requirements, and corporate
                    selections slotting is finalized.
                  </p>
                </div>

                {/* Step 3: Evaluation */}
                <div className="relative pl-8 md:pl-12 group">
                  <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-luna-950 border border-luna-300 flex items-center justify-center text-luna-300 font-bold text-xs group-hover:bg-luna-300 group-hover:text-luna-950 transition-colors">
                    3
                  </div>
                  <h6 className="text-base font-bold font-sans text-white group-hover:text-luna-300 transition-colors">
                    3. Evaluation
                  </h6>
                  <p className="text-xs font-serif text-slate-400 mt-2 leading-relaxed max-w-4xl">
                    The selection process starts with Pre-Placement Talks (PPTs), followed by examinations, tests, group
                    discussions, and technical/HR interviews.
                  </p>
                </div>

                {/* Step 4: Selection */}
                <div className="relative pl-8 md:pl-12 group">
                  <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-luna-950 border border-luna-300 flex items-center justify-center text-luna-300 font-bold text-xs group-hover:bg-luna-300 group-hover:text-luna-950 transition-colors">
                    4
                  </div>
                  <h6 className="text-base font-bold font-sans text-white group-hover:text-luna-300 transition-colors">
                    4. Selection ("One Student, One Job" Policy)
                  </h6>
                  <p className="text-xs font-serif text-slate-400 mt-2 leading-relaxed max-w-4xl">
                    Recruiters finalize their offers. To give all candidates a fair opportunity, a strict{" "}
                    **“One Student, One Job”** policy is maintained.
                  </p>
                </div>
              </div>
            </div>

            {/* Collaborations & MoUs */}
            <div className="mt-16">
              <div className="text-center mb-8">
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
                        {
                          partner: "Indian Institute of Technology Madras (IITM)",
                          detail: "Joint academic research ventures and higher study streams."
                        },
                        {
                          partner: "Association Leonard De Vinci (ADLV), France",
                          detail: "Global student/faculty exchanges."
                        },
                        { partner: "ALE International", detail: "Collaboration on advanced communication architectures." },
                        { partner: "NIELIT Calicut", detail: "Joint training programs in embedded systems & VLSI." },
                        {
                          partner: "Regional Academic Centre for Space (NITK / ISRO)",
                          detail: "Space technology research & project ventures."
                        },
                        {
                          partner: "Federal University of Rio De Janeiro",
                          detail: "International collaboration and joint research ventures."
                        },
                        { partner: "Taiwan-India Joint Research Center", detail: "Global research and seminar programs." },
                        { partner: "Ministry of Education, Ethiopia", detail: "Academic capacity building and support." }
                      ].map((mou, index) => (
                        <div key={index} className="flex gap-2 items-start group text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-luna-300 mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                          <div>
                            <h6 className="font-bold font-sans text-white group-hover:text-luna-300 transition-colors">
                              {mou.partner}
                            </h6>
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
                        { partner: "MSME New Delhi", detail: "Entrepreneurship development & skill training." },
                        { partner: "NHAI", detail: "Student exposure to transportation and highway projects." },
                        { partner: "PHYTEC Embedded Systems", detail: "Industrial training & hardware prototyping labs." },
                        { partner: "ABB Global Industries", detail: "Core industrial training & internship streams." },
                        {
                          partner: "Atal Incubation Centre",
                          detail: "Startup ecosystem integration & incubation support."
                        },
                        {
                          partner: "PHN / PH Technology",
                          detail: "Software development workshops & internship recruitment."
                        },
                        {
                          partner: "Karaikal Port",
                          detail: "Logistics training, port infrastructure visits, and internships."
                        },
                        { partner: "NexTurn India", detail: "Corporate competency development & recruitment." }
                      ].map((mou, index) => (
                        <div key={index} className="flex gap-2 items-start group text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-luna-300 mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                          <div>
                            <h6 className="font-bold font-sans text-white group-hover:text-luna-300 transition-colors">
                              {mou.partner}
                            </h6>
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
                        {
                          topic: "Blockchain Technology",
                          host: "Samsung",
                          detail: "In-depth labs on decentralized tech and smart contract systems."
                        },
                        {
                          topic: "HDL Coder & SoC Designs",
                          host: "MathWorks",
                          detail: "Practical code generation and FPGA hardware prototyping."
                        },
                        {
                          topic: "Generative AI (GenAI)",
                          host: "Industry Experts",
                          detail: "Seminars on large language models and prompt engineering."
                        },
                        {
                          topic: "6G Networks & Communication",
                          host: "Research Labs",
                          detail: "Exploration of next-generation wireless technologies."
                        },
                        {
                          topic: "Disaster Resilient Infrastructure",
                          host: "Civil Department",
                          detail: "Specialized training on durable materials for infrastructure."
                        }
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

      {activeTab === "events" && (
        /* --- EVENTS & PLACEMENT CALENDAR SECTION --- */
        <section id="events" className="pt-6 pb-12 relative z-10 bg-luna-800/10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

                      <h4 className="text-base sm:text-lg font-black font-sans text-white mb-2 leading-snug">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-xs text-slate-350 font-serif leading-relaxed mb-3">{event.description}</p>
                      )}
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serif text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>
                            <strong>{event.date}</strong> at {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-slate-400" />
                          <span>
                            Venue: <strong>{event.venue}</strong>
                          </span>
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
                  Upcoming selection dates, online assessments, and recruiter schedule calendars contain sensitive
                  schedule structures and are restricted to authorized NIT Puducherry student and partner recruiter
                  account holders.
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
          </div>
        </section>
      )}

      {activeTab === "team" && (
        /* --- TEAM & LOGISTICS SECTION --- */
        <section id="team" className="pt-6 pb-12 relative z-10 bg-luna-800/10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Column 1: Professor-in-Charge */}
              <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-lg hover:border-luna-300/40 transition-all duration-350 flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1.5 rounded-full border border-luna-300/30 bg-luna-300/10 text-luna-300 text-[10px] font-bold uppercase tracking-wider mb-6 inline-block">
                    Professor-in-Charge
                  </span>
                  <h4 className="text-lg font-bold font-sans text-white mb-2">Dr. Surendiran B</h4>
                  <p className="text-xs text-slate-400 font-serif leading-relaxed mb-6">
                    Professor-in-charge, Training and Placement,
                    <br />
                    National Institute of Technology Puducherry
                  </p>

                  <div className="space-y-4 font-serif text-xs text-slate-300 border-t border-white/5 pt-6">
                    <div className="flex items-center gap-3">
                      <Phone size={14} className="text-luna-300" />
                      {isLoggedIn ? (
                        <div>
                          <p>+91 (0)4368-265233 (Office)</p>
                          <p>+91 99427 61363 (Mobile)</p>
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
                        <p>placementofficer@nitpy.ac.in</p>
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

                  <div className="space-y-3 font-serif text-xs text-slate-355">
                    {[
                      { dept: "Computer Science (CSE)", name: "Dr. Karthik N", phone: "+91 79048 20693" },
                      { dept: "Electronics & Comm (ECE)", name: "Dr. Yedukondala Rao", phone: "+91 86608 63028" },
                      { dept: "Electrical & Electronics (EEE)", name: "Dr. Hema Chander", phone: "+91 94903 89892" },
                      { dept: "Mechanical Eng (Mech)", name: "Dr. Naveen Raj", phone: "+91 90434 23462" },
                      { dept: "Civil Engineering (Civil)", name: "Dr. Mallikarjun", phone: "+91 90045 41596" },
                      { dept: "Placement Co-ordinator", name: "Ms. Umamageswari T", phone: "+91 94891 69388" }
                    ].map((member, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-2 border-b border-white/5 last:border-none"
                      >
                        <div>
                          <strong className="text-white block font-sans text-xs">{member.name}</strong>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{member.dept}</span>
                        </div>
                        {isLoggedIn ? (
                          <a
                            href={`tel:${member.phone.replace(/\s+/g, "")}`}
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

          {/* Student Placement Representatives */}
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
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-sans">
                Filter Department:
              </span>
              <div className="flex gap-2">
                {["default", "All", "CSE", "ECE", "EEE", "Mechanical", "Civil"].map((deptOption) => {
                  if (deptOption === "default" && !(isLoggedIn && currentStudent)) {
                    return null;
                  }
                  const isSelected = teamDeptFilter === deptOption;
                  const label = deptOption === "default" ? "My Department" : deptOption;
                  return (
                    <button
                      key={deptOption}
                      onClick={() => setTeamDeptFilter(deptOption)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-sans transition-all border ${
                        isSelected
                          ? "bg-luna-300 border-luna-300 text-luna-950 shadow-lg shadow-luna-300/15"
                          : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                      }`}
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

              const effectiveDept =
                teamDeptFilter === "default"
                  ? isLoggedIn && currentStudent
                    ? currentStudent.department
                    : "All"
                  : teamDeptFilter;

              const displayedDepts =
                effectiveDept === "All"
                  ? depts
                  : depts.filter((d) => d.key.toLowerCase() === effectiveDept.toLowerCase());

              return (
                <div
                  className={`grid grid-cols-1 ${
                    effectiveDept === "All" ? "sm:grid-cols-2 lg:grid-cols-5" : "max-w-md mx-auto"
                  } gap-4 w-full max-w-none`}
                >
                  {displayedDepts.map((deptGroup, idx) => {
                    const deptReps = prs.filter((p) => p.department.toLowerCase() === deptGroup.key.toLowerCase());
                    return (
                      <div
                        key={idx}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/10 hover:border-luna-300/40 hover:shadow-[0_0_20px_rgba(84,172,191,0.25)] hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                      >
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
                                    <a
                                      href={rep.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-slate-400 hover:text-luna-300 transition-colors"
                                    >
                                      <Linkedin size={12} />
                                    </a>
                                  )}
                                </div>

                                <div className="space-y-1 mt-1 text-[10px] font-sans">
                                  {isLoggedIn ? (
                                    <>
                                      <div className="flex items-center gap-1.5 text-slate-300">
                                        <Mail size={10} className="text-slate-500" />
                                        <a
                                          href={`mailto:${rep.email}`}
                                          className="hover:text-luna-300 transition-colors truncate block max-w-[150px]"
                                          title={rep.email}
                                        >
                                          {rep.email}
                                        </a>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-slate-300">
                                        <Phone size={10} className="text-slate-500" />
                                        <a href={`tel:${rep.phone.replace(/\s+/g, "")}`} className="hover:text-luna-300 transition-colors">
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
                                      className="py-0.5 px-2 bg-white/5 hover:bg-luna-300 hover:text-luna-950 text-slate-400 border border-white/10 rounded font-sans text-[8px] transition-all font-bold flex items-center gap-1 cursor-pointer"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch max-w-6xl mx-auto">
              {/* Contact Details Left Panel */}
              <div className="glass-panel p-8 sm:p-10 rounded-3xl flex flex-col justify-between shadow-lg fade-in-on-scroll">
                <div>
                  <h4 className="text-2xl font-bold font-sans text-luna-300 mb-4 flex items-center gap-2">
                    <Info size={24} />
                    Office of Training & Placement
                  </h4>
                  <p className="text-slate-300 font-serif leading-relaxed mb-8">
                    For recruiter inquiries, partnership proposals, and pre-placement logistics, please contact the Placement
                    Coordinator office or reach out to our Faculty Advisor directly.
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
                  <a
                    href="#"
                    className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-luna-300 hover:text-luna-300 transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-luna-300 hover:text-luna-300 transition-colors"
                  >
                    <Twitter size={18} />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-luna-300 hover:text-luna-300 transition-colors"
                  >
                    <Globe size={18} />
                  </a>
                </div>
              </div>

              <div className="glass-panel p-8 sm:p-10 rounded-3xl flex flex-col justify-between shadow-lg fade-in-on-scroll">
                <div>
                  <h4 className="text-xl font-bold font-sans text-white mb-4">Placement Guidance Note</h4>
                  <p className="text-slate-300 font-serif text-sm leading-relaxed mb-6">
                    Students and recruiters are advised to abide by the standard placement norms of NIT Puducherry. You can
                    download the official T&P brochure below or submit a query to our support desk.
                  </p>
                  <div className="flex flex-col gap-3 mb-6">
                    <a
                      href="/assests/NITPY Placement Brochure 2026-27.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-luna-300/20 hover:bg-luna-300/30 text-luna-300 font-bold font-sans text-xs border border-luna-300 transition-all duration-300"
                    >
                      <FileText size={14} />
                      Download Brochure 2026-27 (Latest PDF)
                    </a>
                    <a
                      href="/assests/NITPY Placement Brochure 2025-26 (6).pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-350 font-bold font-sans text-xs border border-white/10 transition-all duration-300"
                    >
                      <FileText size={14} className="opacity-75" />
                      Download Brochure 2025-26 (PDF)
                    </a>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addToast("Message sent to T&P Desk", "success");
                  }}
                  className="space-y-4 font-serif"
                >
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
                    className="w-full py-3 bg-luna-300 hover:bg-luna-50 text-luna-950 font-bold font-sans text-xs rounded-xl shadow-lg hover:shadow-luna-300/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Submit Query
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-10 border-t border-white/5 pt-8 max-w-5xl mx-auto">
              <div className="text-center mb-8">
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
                  <div
                    key={idx}
                    className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-luna-300/30 transition-all duration-300"
                  >
                    <h6 className="text-sm font-bold font-sans text-white mb-2 flex items-start gap-2">
                      <span className="text-luna-300 font-extrabold">Q.</span>
                      <span>{faq.q}</span>
                    </h6>
                    <p className="text-xs text-slate-300 font-serif leading-relaxed pl-4 border-l border-luna-300/20">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {selectedCompanyDetails && (
        <CompanyDetailsModal
          companyName={selectedCompanyDetails}
          onClose={() => setSelectedCompanyDetails(null)}
          theme={theme}
        />
      )}
    </>
  );
}
