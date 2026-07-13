# Features List
## NIT Puducherry Placement Portal

This document lists all active and interactive features implemented in the NIT Puducherry Placement Portal, organized by module and user role access.

---

### 1. General & Visitor Interface Features (Unauthenticated vs. Authenticated Restrictions)
- **Key Statistics Counter**: Dynamic cards showcasing placement performance (e.g., *16.0 LPA Highest Package*, *10.8 LPA Average Package*, *85% Students Placed*, *50+ Active Recruiters*). Available to all.
- **Testimonial Carousel**:
  - Interactive slider showcasing student success stories.
  - Video play overlays linking to simulated video testimonials. Available to all.
- **Interactive Graphs (Statistics Tab)**:
  - Sector-wise hiring distribution.
  - Average package comparison by department (CSE, ECE, EEE, Mech, Civil). Available to all.
- **Recruiter Grid**:
  - **Unauthenticated / Guests**: See blurred package metrics (Max CTC, Min CGPA), locked cards, and a backdrop lock overlay. Hovering triggers a bouncing lock message. Clicking any card displays an "Auth Required" toast and launches the login modal.
  - **Authenticated Users**: View CTC packages, eligibility CGPA requirements, sector filters, website links, and click cards to open recruiter insights modals.
- **Pre-Placement, Internships & Alumni Guides**:
  - **Unauthenticated / Guests**: Access to syllabus guidelines, internship guidelines, and alumni connection links are locked. Attempts to download or click them trigger an authentication notice and open the login dialog.
  - **Authenticated Users**: Instantly trigger simulated downloads or redirect links.
- **Events Calendar (Events Tab)**:
  - **Unauthenticated / Guests**: Detailed recruitment schedules, pre-placement talks, and test venues are hidden behind a locked screen lock placeholder.
  - **Authenticated Users**: Access a complete calendar, check event dates, and register/RSVP for specific recruitment drives.
- **Team Logistics & Contacts (Team Tab)**:
  - **Unauthenticated / Guests**: Faculty department coordinators' and Professor-in-charge's mobile and office telephone numbers are locked.
  - **Authenticated Users**: View and click to call all contact phone numbers.

---

### 2. Authentication & Account Recovery Features
- **Role Selection Login Overlay**: Dropdown select with customized dashboards for Student, PR Coordinator, Departmental Coordinator, and Admin.
- **Simulated OTP Password Recovery**:
  - Verification of account email existence.
  - Generation and screen-broadcast of a simulated 4-digit OTP.
  - Password updating upon correct OTP entry.
- **Account Settings Overlay**:
  - Real-time password changing validation.
  - Viewing active sessions.

---

### 3. Student Dashboard Features (Restricted to logged-in Students)
- **Profile Manager**:
  - Real-time profile card containing CGPA, roll number, department, achievements, and certifications.
  - Form to update personal data (phone, profile photo, and external resume links).
- **Active Placement Drives Directory**:
  - Eligibility indicator checking minimum CGPA and block/allow rules.
  - Multi-tier company rules (blocks placed students from applying to lower-package drives).
  - Apply handler linking to pre-filled simulated Google Forms.
- **ATS Resume Analyzer**:
  - Section fields for Summary, Skills, Experience, and Projects.
  - ATS Scoring engine providing score out of 100 with optimization tips.
- **Preparation & Practice Portal**:
  - DSA prep guides, LeetCode target lists.
  - Timed Mock Technical Test with programming/aptitude questions and automatic score calculation.
- **Recruiter Detail Modal**: Shows company overview, interview stages criteria, and insights from previously placed students.

---

### 4. Placement Representative (PR) Dashboard Features (Restricted to logged-in PRs)
- **Recruitment Drive Creator**: Add or update recruiter cards, packages, description, and CGPA requirements.
- **Drive Coordinator Schedule Tool**: Create upcoming events, mock drives, pre-placement talks, and test venues.
- **Student Verification Panel**: Access student files, view stats, and toggle eligibility (Enable/Disable placement eligibility).
- **Audit Logs Feed**: View live logs of scheduling changes.

---

### 5. Departmental Coordinator Dashboard Features (Restricted to logged-in Departmental reps)
- **Departmental Student Profiles**: View-only records of students within their assigned department.
- **Academic Performance Tracker**: Graphs of department-wide averages and placement statistics.

---

### 6. Admin Dashboard Features (Restricted to logged-in Admins)
- **User Directory**: List of all user credentials, emails, and roles.
- **Account Status Toggles**: Instantly activate/deactivate accounts.
- **System Audit Trail**:
  - **Edit Logs**: Track package modifications and coordinator permissions.
  - **Event Logs**: Track mock test changes and calendar events.
