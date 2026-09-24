# ⚡ MITRA CLUB - Digital Batch Attendance & Analytics Portal
> **Vishnu Institute of Technology** — Official Digital Batch Attendance & Student Analytics Platform.

A high-performance, responsive React & Vite web application designed for **Mitra Club** at Vishnu Institute of Technology. Features multi-batch attendance tracking (*Vibe Coding, AI, Marketing, Industry Connect*), real-time roster registers, master analytics charts, audit logging, dual-role access control, and seamless dynamic Light/Dark theme switching.

---

## 🔑 Demo Login Credentials

### 🛡️ Administrator Console
| Role | Email / Username | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Master Admin** | `admin@mitra.club` | `mitra@1234` | Full system control, student roster management, batch analytics, audit trails |

### 🎓 Real Student Portal Accounts (Vishnu Institute Roster)
> Default Password for all student accounts: **`mitra123`** (Students can log in using their **Gmail ID**, **USN / Roll Number**, or **Name**).

| Student Name | Roll No / USN | Gmail ID / Login Identifier | Branch | Batch Team | Default Password |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A Lokesh** | `24PA1A4507` | `24pa1a4507@gmail.com` | AI&DS | Vibe Coding | `mitra123` |
| **A Sai Kiran** | `24PA1A4511` | `24pa1a4511@gmail.com` | AI&DS | AI | `mitra123` |
| **B Mythili** | `24PA1A4520` | `24pa1a4520@gmail.com` | AI&DS | Marketing | `mitra123` |
| **D Abhishek** | `24PA1A4528` | `24pa1a4528@gmail.com` | AI&DS | Marketing | `mitra123` |
| **G Jaswanth Vamsi** | `24PA1A4542` | `24pa1a4542@gmail.com` | AI&DS | Vibe Coding | `mitra123` |
| **G Kavyakshita** | `24PA1A4543` | `24pa1a4543@gmail.com` | AI&DS | AI | `mitra123` |
| **M Sahithi** | `24PA1A4581` | `24pa1a4581@gmail.com` | AI&DS | AI | `mitra123` |
| **M Purna Teja** | `24PA1A4586` | `24pa1a4586@gmail.com` | AI&DS | Vibe Coding | `mitra123` |

*(Contains 68 active student profiles total across AI&DS, CSE, ECE, and IT branches).*

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React 18](https://reactjs.org/) + [Vite 5](https://vitejs.dev/) *(Fast HMR & Optimized Production Build)*
- **Styling & Design System**: [Tailwind CSS 3](https://tailwindcss.com/) with Class-Based Dark Mode & Cyber Aesthetics
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Cloud Layer**: [Firebase SDK v10](https://firebase.google.com/) *(Authentication & Firestore DB Integration)*
- **Local Fallback Engine**: Embedded Mock Engine pre-seeded with the 68 real Mitra Club student roster
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
