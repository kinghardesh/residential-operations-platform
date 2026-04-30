import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CreditCard,
  Shield,
  Users,
  Wrench,
  Droplets,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import Logo from '/Logo.png';

const features = [
  {
    icon: Users,
    title: 'Residents & owners',
    desc: 'Role-based portals for tenants, flat owners, and society administrators.',
  },
  {
    icon: Wrench,
    title: 'Complaints & maintenance',
    desc: 'Track issues from raise to resolution with categories and staff assignment.',
  },
  {
    icon: CreditCard,
    title: 'Payments & dues',
    desc: 'Maintenance collections with UPI, card, net banking, and cash with full history.',
  },
  {
    icon: Shield,
    title: 'Visitors & security',
    desc: 'Pre-approved visitors, time logs, and audit-ready entry records.',
  },
  {
    icon: Droplets,
    title: 'Resource usage',
    desc: 'Water, electricity, and utility consumption analytics per flat.',
  },
  {
    icon: Building2,
    title: 'Enterprise-ready',
    desc: 'Clean corporate UI, responsive layouts, and scalable modular architecture.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="ROP Logo" className="h-14 w-auto" />
            <div>
              <p className="text-base font-bold text-slate-900">Residential Operations Platform</p>
              <p className="text-xs text-slate-500">Society & apartment management</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-brand-600">
              Features
            </a>
            <a href="#about" className="hover:text-brand-600">
              About
            </a>
            <a href="#contact" className="hover:text-brand-600">
              Contact
            </a>
          </nav>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Sign in <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-brand-50 via-white to-slate-50">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 lg:flex lg:items-center lg:gap-16 lg:px-6 lg:py-28">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Official platform</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Operate your society with clarity and control
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              A single dashboard for complaints, collections, visitors, staff, and utilities — built for gated
              communities, apartments, and hostels.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card hover:bg-brand-700"
              >
                Access portal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-card hover:bg-slate-50"
              >
                Learn more
              </a>
            </div>
          </div>
          <div className="mt-14 flex-1 lg:mt-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-brand-50 p-4">
                  <p className="text-xs font-medium text-brand-800">Collections</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">₹4.4L</p>
                  <p className="text-xs text-slate-500">This month (demo)</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs font-medium text-emerald-800">Open complaints</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">9</p>
                  <p className="text-xs text-slate-500">Across society</p>
                </div>
                <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">Live operations snapshot</p>
                  <div className="mt-3 h-24 rounded-lg bg-gradient-to-r from-brand-200/60 to-brand-400/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-slate-100 py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900">Platform capabilities</h2>
            <p className="mt-3 text-slate-600">
              Modular dashboards for residents, owners, and administrators — aligned with real society workflows.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-lg"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900">About the platform</h2>
            <p className="mt-4 text-slate-600">
              Residential Operations Platform (ROP) is a comprehensive DBMS project designed to streamline 
              residential society management. It provides a centralized system for managing residents, owners, 
              staff, complaints, payments, visitors, and resource tracking — all integrated into a unified database architecture.
            </p>
            <p className="mt-4 text-slate-600">
              Built as a full-stack database management solution, ROP demonstrates practical implementation of 
              relational database concepts, role-based access control, and real-time data operations. The platform 
              serves as a complete operational console for residential complexes, apartment buildings, and gated communities.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="font-semibold text-slate-900">Database-Driven</h3>
              <p className="mt-2 text-sm text-slate-600">
                Built on solid relational database principles with normalized tables, foreign keys, and ACID compliance.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="font-semibold text-slate-900">Role-Based Access</h3>
              <p className="mt-2 text-sm text-slate-600">
                Three distinct user roles (Admin, Owner, Resident) with tailored dashboards and permissions.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="font-semibold text-slate-900">Real-World Application</h3>
              <p className="mt-2 text-sm text-slate-600">
                Production-ready architecture demonstrating practical DBMS implementation for society management.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-slate-900 py-16 text-slate-300">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-3 text-white">
                <img src={Logo} alt="ROP Logo" className="h-10 w-auto" />
                <span className="font-semibold">Residential Operations Platform</span>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                A comprehensive DBMS solution for residential society management. Streamlining operations, 
                enhancing communication, and providing data-driven insights for modern communities.
              </p>
              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Get in touch</p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-400" /> Your City, Your State, India
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-brand-400" /> +91 XXXXX-XXXXX
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-brand-400" /> your.email@example.com
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Project Information</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  <strong className="text-slate-300">Type:</strong> Database Management System (DBMS) Project
                </li>
                <li>
                  <strong className="text-slate-300">Technology:</strong> React, Tailwind CSS, Database Integration
                </li>
                <li>
                  <strong className="text-slate-300">Purpose:</strong> Residential society operations management
                </li>
                <li>
                  <strong className="text-slate-300">Features:</strong> Role-based dashboards, complaint tracking, 
                  payment management, visitor logs, resource monitoring
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Residential Operations Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
