# Software Requirements Specification (SRS)
## NIT Puducherry Placement Portal

### 1. Introduction
#### 1.1 Purpose
This document specifies the software requirements for the NIT Puducherry Placement Portal. It provides a detailed description of the system's architecture, user roles, functional capabilities, and technical constraints.

#### 1.2 Scope
The NIT Puducherry Placement Portal is a modular **Next.js** application designed to streamline the placement process for students, placement representatives (PRs), departmental representatives, and administrators. It manages student profiles, job postings, application submissions, drive schedules, mock preparation, and placement analytics.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **PR**: Placement Representative / Coordinator
- **T&P**: Training and Placement Cell
- **ATS**: Applicant Tracking System
- **LPA**: Lakhs Per Annum (CTC unit)
- **CGPA**: Cumulative Grade Point Average
- **Context**: React global state provider (AuthContext, DataContext)

---

### 2. Overall Description
#### 2.1 Product Perspective
The system functions as a client-side and server-side ready Next.js dashboard application. It utilizes global React Context Providers (`AuthContext` and `DataContext`) to handle user authentication, routing state, page navigation via URL hash synchronization (`#/home`, `#/dashboard`, etc.), and mock database mutations. Views are dynamically rendered based on the active role and tab.

#### 2.2 Product Functions
- **Visitor Site**: Home page, Statistics graphs, Corporate Collaborations, and Contact information.
- **Authentication**: Role-based login and simulated OTP-based password recovery.
- **Student Dashboard**: Profile management, job drive applications, mock technical assessment sandbox, and ATS resume scoring.
- **Placement Representative (PR) Dashboard**: Drive schedule builder, job posting management, student eligibility validation, and PR force management.
- **Departmental Representative Dashboard**: Department-wise student directory access and aggregated departmental performance graphs.
- **Administrator Dashboard**: Account activation/deactivation, comprehensive audit logs (edit logs and event logs), and overall platform administration.

#### 2.3 User Classes and Characteristics
1. **Public Visitor**: General public, prospective recruiters, or alumni.
2. **Student**: Regular students participating in placement drives.
3. **PR Coordinator**: Student coordinators representing the T&P Cell.
4. **Departmental Representative**: Faculty members tracking their department's performance.
5. **Admin**: T&P admin overseeing users, logs, and system states.

---

### 3. Specific Requirements
#### 3.1 Functional Requirements

##### 3.1.1 Visitor Module & Access Control Restrictions
- **Home Landing**: Display placement summary statistics, core recruiter logos, and carousel testimonials (with video/text reviews).
- **Statistics**: Interactive placement rate charts, sector distributions, and department salary comparisons.
- **Collaborations / Recruiter Grid**: Displays active recruiting partners. Details (Max CTC package, minimum eligible CGPA) are blurred for guests. Hovering displays a Lock screen, and clicking triggers a warning toast prompting the user to login.
- **Pre-Placement Resources**: Read syllabus links, internship download guides, and alumni network portals are locked for guest users.
- **Calendar & Events**: The detailed schedule calendar is locked behind an authorization overlay. Guests must log in to view dates and venues.
- **Contact & Team**: Professor-in-Charge and Departmental Coordinator contact telephone numbers are locked behind login blocks to protect faculty privacy.
- **Logistics**: General travel connectivity and driving maps remain public.

##### 3.1.2 Authentication & Account Management
- **Role-based Authentication**: Separate login states for Student, PR, Departmental, and Admin.
- **Forgot Password**: Password reset sequence with simulated 4-digit OTP dispatch and verification.
- **Account Settings**: Password modification, session logs, and logout functionality.

##### 3.1.3 Student Dashboard
- **Profile Summary**: Displays personal, academic (CGPA, roll number), and placement status data.
- **Drives / Companies Directory**:
  - Displays list of active recruitment drives.
  - Enforces minimum CGPA constraints.
  - Automatically flags eligibility based on placement status (blocks already-placed students from applying to lower-tier companies).
  - Integrates application links (e.g., auto-filling candidate details to simulated Google Forms).
- **ATS Resume Evaluator**:
  - Accepts text inputs for resume sections (skills, experience, projects) or matches parsed data.
  - Grades resumes against job descriptions, calculating an ATS score.
- **Mock Test Prep**:
  - Interactive timed coding assessments.
  - Launchpads for DSA practice.
- **Timeline Progress**:
  - Tracks individual interview pipelines (Applied -> Shortlisted -> Interview -> Offer -> Hired/Rejected).

##### 3.1.4 PR Coordinator Dashboard
- **Drives Manager**: Publish/modify company recruiters, package offers (CTC in LPA), and eligibility thresholds.
- **Schedule Manager**: Create and publish calendar events, pre-placement talks, and test schedules.
- **Student Eligibility Panel**: Read student records and toggle eligibility status flags.
- **Drive Analytics**: Visual representation of active hiring pipelines.

##### 3.1.5 Departmental Representative Dashboard
- **Departmental Student Registry**: Review and view profile details of all students within their specific department.
- **Analytics Dashboard**: Department-wise comparison, median packages, and placement percentages.

##### 3.1.6 Admin Dashboard
- **User Accounts Manager**: Toggle user active/inactive status.
- **Audit Logs**:
  - **Edit Logs**: Record modifications made to companies, packages, and eligibility metrics (Action, Changed By, Timestamp, Details).
  - **Event Logs**: Audit changes to drives, schedules, and test parameters.

#### 3.2 Non-Functional Requirements
- **Usability**: Responsive UI designed with modern glassmorphism aesthetic, tailored color palette, and micro-animations.
- **Performance**: High performance through client-side state handling and reactive updates.
- **Security**: Basic simulated encryption/hash checks for passwords, and view restrictions based on user roles.
