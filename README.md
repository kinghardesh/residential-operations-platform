# Residential Operations Platform (ROP)

A comprehensive **Database Management System (DBMS)** project designed to streamline residential society management. ROP provides a centralized platform for managing residents, owners, staff, complaints, payments, visitors, and resource tracking — all integrated into a unified database architecture.

## 🎯 Project Overview

ROP is built as a full-stack database management solution that demonstrates practical implementation of relational database concepts, role-based access control, and real-time data operations. The platform serves as a complete operational console for residential complexes, apartment buildings, and gated communities.

## ✨ Features

### **Role-Based Dashboards**
- **Admin Dashboard**: Society-wide analytics, management of all entities (residents, owners, staff, flats)
- **Owner Dashboard**: Track owned flats, occupancy status, and rental availability
- **Resident Dashboard**: Personal account overview, complaints, payments, and visitor logs

### **Core Functionalities**
- 👥 **User Management**: Multi-role authentication (Admin, Owner, Resident)
- 🏠 **Flat Management**: Track and manage residential units
- 📝 **Complaint Tracking**: Raise, assign, and resolve maintenance issues
- 💳 **Payment Management**: Maintenance collections with full transaction history
- 👀 **Visitor Management**: Pre-approved visitors with time logs and audit records
- 💧 **Resource Monitoring**: Water and electricity consumption analytics
- 👨‍🔧 **Staff Management**: Assign and track maintenance staff
- 📊 **Analytics & Reports**: Charts and visualizations for data-driven decisions

### **Technical Highlights**
- Database-driven architecture with normalized tables
- Role-based access control (RBAC)
- Real-time profile management
- Responsive design for all devices
- Modern UI with Tailwind CSS

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🚀 Getting Started

### **Installation**

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ROP
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### **Build for Production**

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### **Preview Production Build**

```bash
npm run preview
```

## 📁 Project Structure

```
ROP/
├── public/              # Static assets
│   └── Logo.png        # Application logo
├── src/
│   ├── components/     # Reusable React components
│   │   ├── charts/    # Analytics charts (Recharts)
│   │   ├── layout/    # Layout components (Navbar, Sidebar)
│   │   └── ui/        # UI components (Buttons, Cards, Forms)
│   ├── context/        # React Context (AuthContext)
│   ├── data/          # Mock data for demo
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Role-based layouts
│   ├── pages/         # Page components
│   │   ├── admin/     # Admin dashboard pages
│   │   ├── owner/     # Owner dashboard pages
│   │   └── resident/  # Resident dashboard pages
│   ├── lib/           # Utility functions
│   ├── App.jsx        # Main app component & routing
│   └── main.jsx       # Entry point
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🔐 User Roles & Access

| Role | Access Level | Key Features |
|------|--------------|--------------|
| **Admin** | Full Access | Manage all entities, view analytics, assign staff |
| **Owner** | Limited | View owned flats, track occupancy, monitor payments |
| **Resident** | Personal | Raise complaints, make payments, view visitors |

## 🗄️ Database Concepts Demonstrated

This project implements key DBMS principles:

- **Relational Database Design**: Normalized tables with foreign key relationships
- **ACID Compliance**: Data integrity through proper transaction management
- **Role-Based Access Control**: Secure data access based on user roles
- **Entity Relationships**: 
  - Residents ↔ Flats (Many-to-One)
  - Owners ↔ Flats (One-to-Many)
  - Flats ↔ Complaints (One-to-Many)
  - Residents ↔ Payments (One-to-Many)
  - Flats ↔ Visitors (One-to-Many)

## 📸 Screenshots

### Landing Page
Professional landing page with platform overview and features

### Dashboard Views
- **Admin**: Comprehensive analytics and society-wide metrics
- **Owner**: Property ownership and occupancy tracking
- **Resident**: Personal account management and activity

## 🎓 Academic Use

This project is designed as a **DBMS academic project** demonstrating:
- Practical database design and implementation
- Full-stack application development
- Real-world problem solving
- Modern web development practices

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📝 Demo Mode

The application runs in demo mode with mock data. To sign in:
1. Navigate to `/login`
2. Select a role (Resident, Owner, or Admin)
3. Enter any username/password
4. Complete your profile setup
5. Access the role-specific dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is created for educational and academic purposes.

## 👨‍💻 Developer

**ISHAAN SAXENA**

## 🙏 Acknowledgments

- Built with React and Vite
- Styled with Tailwind CSS
- Charts powered by Recharts
- Icons from Lucide React

---

**Note**: This is a frontend demonstration of a DBMS project. For production use, integrate with a backend API and database system (MySQL, PostgreSQL, MongoDB, etc.).
