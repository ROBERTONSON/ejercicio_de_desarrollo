# 🛡️ SOC Incident Management Dashboard

A modern, highly interactive, and secure Security Operations Center (SOC) dashboard built with React and Vite. Designed under the **B.L.A.S.T. Framework** and **A.N.T. 3-Layer Architecture**, this tool centralizes incident control and provides robust access control and auditing capabilities out-of-the-box.

## ✨ Core Features

- **📊 Real-Time Metrics & Charts:** Deep visualizations utilizing Recharts (MTTR, Volume by Severity, Trend Analysis).
- **🔒 RBAC (Role-Based Access Control):** 
  - `Viewer`: Read-only access.
  - `Analyst`: Write access limited to assigned incidents and personal notes.
  - `Admin`: Full access including override controls.
- **🛡️ Immutable Audit Log:** Automatic, append-only ISO-8601 logging of every state change, note addition, and user assignment.
- **⚡ Next-Gen UI Design:** Sleek Dark Mode interface customized with Tailwind CSS v4, augmented with interactive micro-animations (Borderbeam, Meteors, NumberTicker) from 21st.dev.
- **🔐 Record Locking:** Exclusive access locking simulating real-time concurrency control. XSS sanitization enforced over all entries.

## 💻 Tech Stack

- **Framework:** React 19 + Vite v8 
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Icons:** Lucide React
- **Data Visualization:** Recharts
- **Security:** DOMPurify (XSS prevention)
- **Architecture:** B.L.A.S.T Framework

## 📁 Architecture Structure

Following the **A.N.T. 3-Layer** modular design methodology:
- `architecture/` (Layer 1) - Structural SOPs, rules sets globally defining logic (Audit Logs, RBAC, Data Mgmt).
- `tools/soc-dashboard/` (Layer 3) - Atomic, deterministic functional frontend application.
- `.agent/skills/` - Custom context and automations.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm 

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rlope/ejercicio_de_desarrollo-main.git
   ```

2. Navigate to the core tool environment:
   ```bash
   cd "ejercicio_de_desarrollo-main/tools/soc-dashboard"
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   
Navigate to `http://localhost:5173` to see the application running.

## 📄 License & Credits

Built as part of a development demonstration environment.
- Components UI powered by [21st.dev](https://21st.dev/) libraries.
- Framework: Vite + React.
