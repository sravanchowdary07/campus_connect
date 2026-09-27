# CampusConnect — All-in-One Digital Campus Platform

**CampusConnect** is a modern, production-grade digital campus web platform designed for students, faculty, and administrators to access all university services from a centralized portal.

---

## ⚡ Quick Start (Windows One-Click)

Double click `start.bat` in the project root directory, or run in PowerShell:

```powershell
.\start.bat
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)

---

## 🔑 Demo Accounts & Credentials

The platform is pre-seeded with realistic data and ready-to-test accounts. Quick-select buttons are also embedded directly on the Login screen!

| Role | Email | Password | Details |
|---|---|---|---|
| 🎓 **Student** | `student@campusconnect.edu` | `password123` | Alex Rivera (Computer Science, 3rd Year) |
| 🎓 **Student** | `maya@campusconnect.edu` | `password123` | Maya Lin (Electrical Engineering, 2nd Year) |
| 📚 **Faculty** | `faculty@campusconnect.edu` | `password123` | Prof. Sarah Jenkins (Computer Science Dept) |
| 🛡️ **Admin** | `admin@campusconnect.edu` | `admin123` | Dr. Arthur Pendelton (Administration) |

---

## 🏗️ Architecture & Tech Stack

- **Frontend:**
  - React 18, Vite
  - Tailwind CSS (Plus Jakarta Sans typography, clean responsive UI)
  - Lucide React icons
  - React Router DOM
  - Axios with JWT Interceptor
  - Socket.IO Client for real-time live events
- **Backend:**
  - Node.js & Express.js
  - RESTful APIs
  - JWT Authentication & bcrypt password hashing
  - Role-based authorization middleware (`student`, `faculty`, `admin`)
  - Multer for local file uploads (images, PDFs, documents)
  - Socket.IO WebSockets server
- **Database:**
  - MongoDB with Mongoose ODM
  - Automatic fallback to embedded `mongodb-memory-server` for zero-configuration local execution.

---

## 📦 Features Overview

1. **Authentication & RBAC:**
   - Student self-registration with Department, Year, and Roll ID.
   - Faculty accounts provisioned exclusively by Administrators.
   - Protected routes and profile password changes.

2. **Personalized Dashboard:**
   - Role-specific greeting and metric counters.
   - **"What's Happening Around Campus?"** Live ticker (Bus shuttle tracking, canteen queue estimate, exam schedules, facility maintenance).
   - Quick preview cards for recent notices, events, and active grievances.

3. **Announcements Module:**
   - Category filtering (`Academic`, `Exam`, `Events`, `Administrative`, `Placement`, `General`).
   - Priority tagging (`urgent`, `high`, `medium`, `low`) and pinned notices.
   - File attachment support.
   - Faculty/Admin publishing controls.

4. **Events & Workshops:**
   - Visual event cards with date, time, venue, and remaining seats.
   - Student 1-click registration/cancellation.
   - Faculty/Admin registered attendee list viewer.

5. **Interactive Campus Map:**
   - Interactive digital campus layout with pin markers for Central Library, CS Block, Canteen, Admin Block, Auditoriums, Sports Complex, and Bus Stops.
   - Detailed side panel with operational hours, helpdesk phones, and amenities.

6. **Complaints & Grievances:**
   - Student grievance filing across categories (Hostel, Academic, Canteen, IT Services, Infrastructure) with file attachments.
   - Status tracker (`Pending` → `In Progress` → `Resolved` / `Rejected`).
   - Official response thread and status management for Faculty & Admins.

7. **Lost & Found Directory:**
   - Post lost items or report found belongings with image upload, location tag, and contact details.
   - Status transitions (`Open` → `Claimed` → `Closed`).

8. **Study Resources & Digital Library:**
   - Searchable repository for lecture notes, PYQs, syllabi, and lab manuals filtered by Department and Semester.
   - Live download counter.

9. **Admin Control Center:**
   - User directory with status toggles (`Active` / `Disabled`), role modifications, and deletion.
   - Provision Faculty account interface.
   - Real-time system analytics counters.
