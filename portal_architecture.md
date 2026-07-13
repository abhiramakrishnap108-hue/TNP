# NIT Puducherry Placement Portal Architecture

The placement portal is structured as a modular **Next.js** application. State management, authentication, routing, and user interface layers are separated into clean, modular components, contexts, and features.

---

## 1. Project Directory Structure

The codebase is organized as follows:

```
├── app/
│   ├── globals.css          # Main stylesheet containing glassmorphism design tokens
│   ├── layout.tsx           # Next.js root layout initializing fonts, scripts, and body wrappers
│   └── page.tsx             # Unified root router orchestrating navbar, particle background, and dashboards
├── components/
│   ├── AccountModal.tsx     # Modal to configure passwords and session logouts
│   ├── CompanyDetailsModal.tsx # Recruiter detail insights and past student reviews
│   ├── Footer.tsx           # Persistent portal footer component
│   ├── Navbar.tsx           # Global responsive navigation header
│   ├── ParticleBackground.tsx # Dynamic HTML5 Canvas particle background effect
│   ├── PlacedDirectory.tsx  # Searchable directory showing placements with bulk CSV upload
│   ├── PrsManagement.tsx   # Panel to manage PR representatives roster
│   └── Toast.tsx            # Floating custom toast notification alerts stack
├── context/
│   ├── AuthContext.tsx      # Global auth context managing session roles, forms, and hash-routing
│   └── DataContext.tsx      # Global data context managing database lists and mutations (CRUD)
├── features/
│   ├── admin/
│   │   └── AdminDashboard.tsx         # Account activation settings and audit trail logging
│   ├── departmental/
│   │   └── DepartmentalDashboard.tsx  # Departmental student registry and academic metrics
│   ├── pr/
│   │   └── PrDashboard.tsx            # Drives manager, placement calendar scheduler, and student verification
│   ├── student/
│   │   └── StudentDashboard.tsx       # Student profile, resume ATS scoring, and technical prep sandbox
│   └── visitor/
│   │   └── VisitorLanding.tsx         # Landing page hero slider, metrics counters, and recruiter logomarks
├── mock/
│   └── database.ts          # Central mock database seeding users, students, companies, and logs
└── types/
    └── index.ts             # Strongly typed TypeScript interfaces mapping all database entity shapes
```

---

## 2. Core State Management & Context Architecture

The application state is split into two specialized Context Providers:

### A. AuthContext (`context/AuthContext.tsx`)
- Manages user login sessions, active role selection states, and navigation routes.
- Integrates a custom React `useEffect` listener to synchronize browser URL hashes (`#/home`, `#/dashboard`, etc.) with the `activeTab` navigation state.
- Exposes login submission, logout, and simulated OTP recovery step handlers.

### B. DataContext (`context/DataContext.tsx`)
- Hydrates the application databases (`users`, `students`, `companies`, `jobRoles`, `applications`, `interviews`, `events`, `prs`, `editLogs`, `eventLogs`) from seed records in `mock/database.ts`.
- Manages global mutations (applying to drives, updating application status, editing/deleting companies, scheduling events, importing student records, and adding PRs).
- Controls the floating UI toast notifications stack (`toasts`, `addToast`, `removeToast`).

---

## 3. Component Orchestration & Routing Workflow

The root component at `app/page.tsx` serves as the application shell and handles view dispatching under the Data and Auth providers:

```mermaid
graph TD
    Root[app/page.tsx Router Shell] --> AuthCtx[AuthContext Provider]
    Root --> DataCtx[DataContext Provider]
    AuthCtx --> Nav[Navbar Component]
    AuthCtx --> Bg[ParticleBackground Component]
    AuthCtx --> RouteCheck{isLoggedIn & activeTab}
    
    RouteCheck -->|activeTab === "home/stats/contact"| Visitor[VisitorLanding Feature]
    RouteCheck -->|activeTab === "dashboard" & STUDENT| StudentDash[StudentDashboard Feature]
    RouteCheck -->|activeTab === "dashboard" & PR_COORDINATOR| PRDash[PrDashboard Feature]
    RouteCheck -->|activeTab === "dashboard" & DEPT_COORDINATOR| DeptDash[DepartmentalDashboard Feature]
    RouteCheck -->|activeTab === "dashboard" & ADMIN| AdminDash[AdminDashboard Feature]
```

---

## 4. Sub-Dashboard Features & Layout

Once routed to the dashboard, components isolate views using role-specific tabs:

1. **Student Dashboard (`StudentDashboard.tsx`):**
   - **Profile Tab:** Real-time stats card and phone/resume update forms.
   - **Job Drives Tab:** Active recruitments filterable by CGPA thresholds.
   - **Applications Tab:** Tracking individual pipeline stages (Applied -> Shortlisted -> Hired).
   - **Event Schedule Tab:** Lists calendar drive postings and RSVP actions.
   - **Sandbox Tab:** A preparation area containing the compiler emulator, technical mock exams, and webcam mock interview diagnostic recorder.
   - **ATS Resume Tab:** Diagnostic parser providing match scoring and optimization advice.
2. **Placement Representative Dashboard (`PrDashboard.tsx`):**
   - **Active Drives Tab:** Form to add/edit recruiter packages and criteria.
   - **Event Scheduler Tab:** Admin calendar to publish venue details.
   - **PR Force Management Tab:** Roster manager for departmental representatives.
   - **Placed Directory Tab:** Searchable placement registry.
3. **Departmental Coordinator Dashboard (`DepartmentalDashboard.tsx`):**
   - **Student Registry Tab:** Department-wise student directory.
   - **System Metrics Tab:** Charts tracking median packages and placement rates.
4. **Admin Dashboard (`AdminDashboard.tsx`):**
   - **User Accounts Tab:** Activates/deactivates user credentials.
   - **Change Logs Tab:** Edit/Event audit trails logging administrative activity.
5. **Visitor Landing Shell (`VisitorLanding.tsx`):**
   - **Access Restriction Manager:** Enforces conditional rendering of data columns. Users who are not logged in have contact telephone links, syllabus files, and recruitment calendar timelines hidden or lock-protected.
   - **Login Triggers:** Intercepts click events on protected components to launch the global authorization modal and broadcast alert notices.
