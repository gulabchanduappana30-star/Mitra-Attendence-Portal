# ⚡ MITRA CLUB - Digital Batch Attendance & Analytics Portal
> **Vishnu Institute of Technology** — Official Digital Batch Attendance & Student Analytics Platform.

A high-performance, responsive React & Vite web application designed for **Mitra Club** at Vishnu Institute of Technology. Features multi-batch attendance tracking (*Vibe Coding, AI, Marketing, Industry Connect*), real-time roster registers, master analytics charts, audit logging, dual-role access control, and seamless dynamic Light/Dark theme switching.

---

## 🔑 Demo Login Credentials

### 🛡️ Administrator Console
| Role | Email / Username | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Master Admin** | `admin@mitra.club` | `mitra@1234` (or `admin`) | Full system control, student roster management, batch analytics, audit trails |

### 🎓 Student Portal Accounts
> Default Student Password for all pre-seeded accounts: **`mitra123`**

| Student Name | Batch | Email / Login ID | USN / Student ID | Default Password |
| :--- | :--- | :--- | :--- | :--- |
| **Ananya Roy** | Vibe Coding (VC) | `vibe.student@mitra.club` | `MITRA-VC-101` | `mitra123` |
| **Rohan Mehta** | Vibe Coding (VC) | `rohan.vc@mitra.club` | `MITRA-VC-102` | `mitra123` |
| **Vikramaditya Rao** | Artificial Intelligence (AI) | `ai.student@mitra.club` | `MITRA-AI-201` | `mitra123` |
| **Diya Sengupta** | Artificial Intelligence (AI) | `diya.ai@mitra.club` | `MITRA-AI-202` | `mitra123` |
| **Kavya Malhotra** | Marketing (MKT) | `marketing.student@mitra.club` | `MITRA-MKT-301` | `mitra123` |
| **Aditya Gupta** | Marketing (MKT) | `aditya.mkt@mitra.club` | `MITRA-MKT-302` | `mitra123` |
| **Siddharth Iyer** | Industry Connect (IC) | `industry.student@mitra.club` | `MITRA-IC-401` | `mitra123` |
| **Tanya Joshi** | Industry Connect (IC) | `tanya.ic@mitra.club` | `MITRA-IC-402` | `mitra123` |

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React 18](https://reactjs.org/) + [Vite 5](https://vitejs.dev/) *(Fast HMR & Optimized Production Build)*
- **Styling & Design System**: [Tailwind CSS 3](https://tailwindcss.com/) with Class-Based Dark Mode & Cyber Aesthetics
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Cloud Layer**: [Firebase SDK v10](https://firebase.google.com/) *(Authentication & Firestore DB Integration)*
- **Local Fallback Engine**: Embedded Mock Engine for zero-config local development without requiring external cloud connection
- **Graphics**: Inline Adaptive SVG Vector Engine (Official Vishnu Institute MITRA Brand Logo)

---

## 🚀 Key System Features

1. **⚡ Official Brand Architecture**: Pixel-perfect vector logo for **MITRA - Vishnu Institute of Technology**.
2. **📱 Dual Portal Access Modes**: Dedicated views for Students (personal record tracking) and Admins (multi-batch management).
3. **📊 Real-time Roster Registers**: Single-click Present/Absent toggles, date pickers, search filtering, and bulk status controls.
4. **🌓 Dynamic Light & Dark Mode**: Seamless theme switcher with `localStorage` persistence and system OS preference detection.
5. **🛡️ Audit Trail Logging**: Mandatory change justification records when modifying past attendance records.
6. **☁️ Hybrid Database Architecture**: Real-time Firebase Cloud Firestore integration with automatic local fallback mode.

---

## 📁 Repository Directory Structure

```
MITRA ATTENDENCE/
├── src/                               # Primary Source Code
│   ├── components/                    # Reusable React UI Components
│   │   ├── common/                    # Shared UI (MitraLogo, ThemeToggle, StatsCard, Modals)
│   │   └── layout/                    # Layout Containers (Navbar, Sidebar)
│   ├── context/                       # Application State (AuthContext, ThemeContext, ToastContext)
│   ├── pages/                         # Core Pages (AdminDashboard, StudentDashboard, BatchManagement, Login)
│   ├── services/                      # Business Logic & Local Mock Engine (dataService, mockData)
│   ├── constants/                     # System Constants & Batch Metadata (batches)
│   ├── styles/                        # Tailwind Base & Global CSS
│   ├── App.jsx                        # App Wrapper & Routing
│   └── main.jsx                       # React DOM Entry
│
├── backend/                           # Cloud & Firebase Backend Layer
│   ├── config/                        # Firebase Client SDK Config (firebase.js)
│   ├── services/                      # Firestore Data Services
│   └── rules/                         # Firestore Database Security Rules (firestore.rules)
│
├── public/                            # Public Static Assets & Logos (mitra-logo.svg)
├── package.json                       # Scripts & Dependencies Manifest
├── vite.config.js                     # Vite Config & Path Aliases (@, @backend)
└── README.md                          # Comprehensive Documentation
```

---

## 💻 Local Setup & Development Commands

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/gulabchanduappana30-star/Mitra-Attendence-Portal.git
cd Mitra-Attendence-Portal
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open **[http://localhost:3000/](http://localhost:3000/)** in your web browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🌐 GitHub Repository & Deployment

- **Repository Link**: [https://github.com/gulabchanduappana30-star/Mitra-Attendence-Portal.git](https://github.com/gulabchanduappana30-star/Mitra-Attendence-Portal.git)
- **Maintainer**: Mitra Club — Vishnu Institute of Technology
