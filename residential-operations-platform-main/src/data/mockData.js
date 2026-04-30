/**
 * Mock data aligned with DB schema (frontend-only demo).
 * owner_id, flat_id, resident_id, staff_id, complaint_id, payment_id, visitor_id, resource_id
 */

export const owners = [
  { owner_id: 'OWN-001', name: 'Rajesh Kumar', phone: '+91 98765 43210' },
  { owner_id: 'OWN-002', name: 'Priya Sharma', phone: '+91 98765 43211' },
  { owner_id: 'OWN-003', name: 'Amit Verma', phone: '+91 98765 43212' },
  { owner_id: 'OWN-004', name: 'Sunita Iyer', phone: '+91 98765 43213' },
];

export const flats = [
  { flat_id: 'FLT-A-101', flat_no: 'A-101', owner_id: 'OWN-001', floor_no: 1 },
  { flat_id: 'FLT-A-102', flat_no: 'A-102', owner_id: 'OWN-001', floor_no: 1 },
  { flat_id: 'FLT-B-201', flat_no: 'B-201', owner_id: 'OWN-002', floor_no: 2 },
  { flat_id: 'FLT-B-202', flat_no: 'B-202', owner_id: 'OWN-003', floor_no: 2 },
  { flat_id: 'FLT-C-301', flat_no: 'C-301', owner_id: 'OWN-004', floor_no: 3 },
  { flat_id: 'FLT-C-302', flat_no: 'C-302', owner_id: 'OWN-002', floor_no: 3 },
];

export const residents = [
  {
    resident_id: 'RES-001',
    name: 'Arjun Mehta',
    phone: '+91 91234 56780',
    email: 'arjun.mehta@email.com',
    flat_id: 'FLT-A-101',
  },
  {
    resident_id: 'RES-002',
    name: 'Neha Gupta',
    phone: '+91 91234 56781',
    email: 'neha.gupta@email.com',
    flat_id: 'FLT-B-201',
  },
  {
    resident_id: 'RES-003',
    name: 'Vikram Singh',
    phone: '+91 91234 56782',
    email: 'vikram.singh@email.com',
    flat_id: 'FLT-B-202',
  },
  {
    resident_id: 'RES-004',
    name: 'Ananya Reddy',
    phone: '+91 91234 56783',
    email: 'ananya.reddy@email.com',
    flat_id: 'FLT-C-301',
  },
];

export const staff = [
  { staff_id: 'STF-001', role: 'Security Supervisor', flat_id: null },
  { staff_id: 'STF-002', role: 'Maintenance Lead', flat_id: null },
  { staff_id: 'STF-003', role: 'Electrician', flat_id: 'FLT-A-101' },
  { staff_id: 'STF-004', role: 'Plumber', flat_id: null },
  { staff_id: 'STF-005', role: 'Housekeeping', flat_id: null },
];

/** complaint_id, name, category, date, resident_id — extended with status & staff for UI */
export const complaints = [
  {
    complaint_id: 'CMP-001',
    name: 'Water leakage in bathroom',
    category: 'Plumbing',
    date: '2026-03-12',
    resident_id: 'RES-001',
    status: 'In Progress',
    staff_id: 'STF-004',
  },
  {
    complaint_id: 'CMP-002',
    name: 'Lift noise on odd floors',
    category: 'Common Area',
    date: '2026-03-28',
    resident_id: 'RES-002',
    status: 'Pending',
    staff_id: null,
  },
  {
    complaint_id: 'CMP-003',
    name: 'Power fluctuation',
    category: 'Electrical',
    date: '2026-04-02',
    resident_id: 'RES-003',
    status: 'Resolved',
    staff_id: 'STF-003',
  },
  {
    complaint_id: 'CMP-004',
    name: 'Parking slot dispute',
    category: 'Parking',
    date: '2026-04-05',
    resident_id: 'RES-004',
    status: 'Pending',
    staff_id: null,
  },
  {
    complaint_id: 'CMP-005',
    name: 'Garbage not cleared',
    category: 'Housekeeping',
    date: '2026-04-08',
    resident_id: 'RES-001',
    status: 'Resolved',
    staff_id: 'STF-005',
  },
];

export const payments = [
  { payment_id: 'PAY-001', amount: 8500, date: '2026-03-01', mode: 'UPI', resident_id: 'RES-001' },
  { payment_id: 'PAY-002', amount: 8500, date: '2026-03-05', mode: 'Net Banking', resident_id: 'RES-002' },
  { payment_id: 'PAY-003', amount: 4200, date: '2026-03-10', mode: 'Card', resident_id: 'RES-003' },
  { payment_id: 'PAY-004', amount: 8500, date: '2026-04-01', mode: 'UPI', resident_id: 'RES-004' },
  { payment_id: 'PAY-005', amount: 8500, date: '2026-04-02', mode: 'Cash', resident_id: 'RES-001' },
];

export const visitors = [
  {
    visitor_id: 'VIS-001',
    name: 'Rahul Delivery',
    visit_date: '2026-04-08',
    visit_time: '14:30',
    exit_time: '14:45',
    flat_id: 'FLT-A-101',
  },
  {
    visitor_id: 'VIS-002',
    name: 'Meera Khanna',
    visit_date: '2026-04-07',
    visit_time: '18:00',
    exit_time: '21:30',
    flat_id: 'FLT-B-201',
  },
  {
    visitor_id: 'VIS-003',
    name: 'Service — AC',
    visit_date: '2026-04-06',
    visit_time: '10:15',
    exit_time: '12:00',
    flat_id: 'FLT-B-202',
  },
  {
    visitor_id: 'VIS-004',
    name: 'Guest — Family',
    visit_date: '2026-04-09',
    visit_time: '16:00',
    exit_time: '20:00',
    flat_id: 'FLT-C-301',
  },
];

export const resources = [
  { resource_id: 'RESRC-001', resource_type: 'Water', flat_id: 'FLT-A-101' },
  { resource_id: 'RESRC-002', resource_type: 'Electricity', flat_id: 'FLT-A-101' },
  { resource_id: 'RESRC-003', resource_type: 'Internet', flat_id: 'FLT-A-101' },
  { resource_id: 'RESRC-004', resource_type: 'Water', flat_id: 'FLT-B-201' },
  { resource_id: 'RESRC-005', resource_type: 'Electricity', flat_id: 'FLT-B-201' },
];

/** flat_id, staff_id, month, units */
export const consumptions = [
  { flat_id: 'FLT-A-101', staff_id: null, month: '2026-01', units: 42, type: 'Water' },
  { flat_id: 'FLT-A-101', staff_id: null, month: '2026-02', units: 45, type: 'Water' },
  { flat_id: 'FLT-A-101', staff_id: null, month: '2026-03', units: 48, type: 'Water' },
  { flat_id: 'FLT-A-101', staff_id: null, month: '2026-01', units: 320, type: 'Electricity' },
  { flat_id: 'FLT-A-101', staff_id: null, month: '2026-02', units: 305, type: 'Electricity' },
  { flat_id: 'FLT-A-101', staff_id: null, month: '2026-03', units: 298, type: 'Electricity' },
];

export const monthlyComplaintTrend = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 18 },
  { month: 'Mar', count: 15 },
  { month: 'Apr', count: 9 },
];

export const monthlyPaymentCollection = [
  { month: 'Jan', amount: 425000 },
  { month: 'Feb', amount: 438000 },
  { month: 'Mar', amount: 441200 },
  { month: 'Apr', amount: 398500 },
];

export const adminResourceUsage = [
  { month: 'Jan', water: 1200, electricity: 18500 },
  { month: 'Feb', water: 1180, electricity: 18200 },
  { month: 'Mar', water: 1225, electricity: 18850 },
  { month: 'Apr', water: 1190, electricity: 18620 },
];

/** Demo login: map role to default user id for filtering views */
export const demoUsers = {
  resident: { id: 'RES-001', label: 'Arjun Mehta (A-101)' },
  owner: { id: 'OWN-001', label: 'Rajesh Kumar' },
  admin: { id: 'ADM-001', label: 'Society Administrator' },
};

export function getFlatById(flatId) {
  return flats.find((f) => f.flat_id === flatId);
}

export function getOwnerById(ownerId) {
  return owners.find((o) => o.owner_id === ownerId);
}

export function getResidentById(residentId) {
  return residents.find((r) => r.resident_id === residentId);
}
