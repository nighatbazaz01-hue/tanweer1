import { getAllStudents } from "./population";

// ─── TransportRecord ───────────────────────────────────────────────────────────
export interface TransportRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: number;
  section: string;
  busNumber: string;
  route: string;
  stopLocation: string;
  parentName: string;
  parentContact: string;
  address: string;
  avatar: string;
}

// ─── VehicleRecord ─────────────────────────────────────────────────────────────
export type VehicleStatus = "active" | "inactive" | "maintenance";
export type VehicleType = "Coach" | "Mini-Bus" | "Van";
export type FuelType = "Diesel" | "Petrol" | "CNG";

export interface VehicleRecord {
  id: string;
  busNumber: string;
  vehicleType: VehicleType;
  capacity: number;
  fuelType: FuelType;
  registrationNumber: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  pollutionExpiry: string;
  status: VehicleStatus;
  driverName: string;
  conductorName: string;
  routeCode: string;
}

// ─── TransportRequest ──────────────────────────────────────────────────────────
export type TransportRequestType = "change_stop" | "change_address" | "temporary";
export type TransportRequestStatus = "pending" | "approved" | "rejected";

export interface TransportRequest {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  requestType: TransportRequestType;
  details: string;
  proposedStop?: string;
  proposedAddress?: string;
  status: TransportRequestStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  routeId: string;
}

// ─── BUS_ROUTES (single source of truth) ──────────────────────────────────────
export const BUS_ROUTES = [
  { bus: "Bus 01", routeCode: "RT-01", route: "Hyderpora — Nowgam",        stops: ["Hyderpora Crossing", "Nowgam Chowk", "Parimpora Bypass", "School Main Gate"],    pickupTimes: ["6:45 AM", "7:00 AM", "7:10 AM", "7:20 AM"], dropTimes: ["2:30 PM", "2:45 PM", "2:55 PM", "3:05 PM"] },
  { bus: "Bus 02", routeCode: "RT-02", route: "Pampore — Lasjan",           stops: ["Pampore Chowk", "Lasjan Market", "Zainakote Turn", "School Side Gate"],         pickupTimes: ["6:40 AM", "6:55 AM", "7:05 AM", "7:15 AM"], dropTimes: ["2:25 PM", "2:40 PM", "2:50 PM", "3:00 PM"] },
  { bus: "Bus 03", routeCode: "RT-03", route: "Batmaloo — Rajbagh",         stops: ["Batmaloo Roundabout", "Rajbagh Signal", "Residency Road", "School Gate 2"],     pickupTimes: ["6:50 AM", "7:02 AM", "7:12 AM", "7:22 AM"], dropTimes: ["2:35 PM", "2:47 PM", "2:57 PM", "3:07 PM"] },
  { bus: "Bus 04", routeCode: "RT-04", route: "Bemina — Chanapora",         stops: ["Bemina Crossing", "Chanapora Chowk", "Narbal Bridge", "School Gate 3"],        pickupTimes: ["6:30 AM", "6:45 AM", "6:58 AM", "7:10 AM"], dropTimes: ["2:20 PM", "2:35 PM", "2:48 PM", "3:00 PM"] },
  { bus: "Bus 05", routeCode: "RT-05", route: "Dalgate — Lal Chowk",        stops: ["Dalgate Stop", "Lal Chowk", "Exhibition Crossing", "Main Gate"],               pickupTimes: ["6:55 AM", "7:05 AM", "7:15 AM", "7:25 AM"], dropTimes: ["2:40 PM", "2:50 PM", "3:00 PM", "3:10 PM"] },
  { bus: "Bus 06", routeCode: "RT-06", route: "Sopore — Baramulla Road",    stops: ["Sopore Bypass", "Baramulla Road", "Tengpora Stop", "Side Gate B"],             pickupTimes: ["6:35 AM", "6:48 AM", "7:00 AM", "7:12 AM"], dropTimes: ["2:28 PM", "2:41 PM", "2:53 PM", "3:05 PM"] },
];

// ─── Vehicle details derived from BUS_ROUTES (one record per route) ───────────
// Route-specific driver/mechanical data is kept here; identifiers (busNumber,
// routeCode) are taken directly from BUS_ROUTES so there is a single source of
// truth for route identity.
const VEHICLE_EXTRAS: {
  vehicleType: VehicleType;
  capacity: number;
  fuelType: FuelType;
  registrationNumber: string;
  insuranceExpiry: string;
  fitnessExpiry: string;
  pollutionExpiry: string;
  status: VehicleStatus;
  driverName: string;
  conductorName: string;
}[] = [
  { vehicleType: "Coach",    capacity: 50, fuelType: "Diesel", registrationNumber: "JK02A-1045", insuranceExpiry: "Dec 2025", fitnessExpiry: "Nov 2025", pollutionExpiry: "Oct 2025", status: "active",      driverName: "Bashir Ahmed",   conductorName: "Shabir Bhat"   },
  { vehicleType: "Coach",    capacity: 48, fuelType: "Diesel", registrationNumber: "JK02A-2187", insuranceExpiry: "Mar 2026", fitnessExpiry: "Feb 2026", pollutionExpiry: "Jan 2026", status: "active",      driverName: "Ghulam Nabi",    conductorName: "Nisar Ahmed"   },
  { vehicleType: "Mini-Bus", capacity: 35, fuelType: "CNG",    registrationNumber: "JK02B-3321", insuranceExpiry: "Jun 2026", fitnessExpiry: "May 2026", pollutionExpiry: "Apr 2026", status: "maintenance", driverName: "Rameez Raja",    conductorName: "Rakesh Kumar"  },
  { vehicleType: "Coach",    capacity: 52, fuelType: "Diesel", registrationNumber: "JK02A-4563", insuranceExpiry: "Sep 2025", fitnessExpiry: "Aug 2025", pollutionExpiry: "Jul 2025", status: "active",      driverName: "Javid Akhtar",   conductorName: "Sanjay Singh"  },
  { vehicleType: "Coach",    capacity: 50, fuelType: "Diesel", registrationNumber: "JK02A-5892", insuranceExpiry: "Jan 2026", fitnessExpiry: "Dec 2025", pollutionExpiry: "Nov 2025", status: "active",      driverName: "Mushtaq Lone",   conductorName: "Deepak Sharma" },
  { vehicleType: "Mini-Bus", capacity: 35, fuelType: "Petrol", registrationNumber: "JK02B-6124", insuranceExpiry: "Apr 2026", fitnessExpiry: "Mar 2026", pollutionExpiry: "Feb 2026", status: "inactive",    driverName: "Farooq Ahmad",   conductorName: "Anil Kumar"    },
];

export const initialVehicles: VehicleRecord[] = BUS_ROUTES.map((route, i) => ({
  id: `VH-0${i + 1}`,
  busNumber: route.bus,
  routeCode: route.routeCode,
  ...VEHICLE_EXTRAS[i],
}));

// ─── Initial Transport Requests ────────────────────────────────────────────────
export const initialTransportRequests: TransportRequest[] = [
  {
    id: "TR-001", studentId: "STU-001", studentName: "Aarav Sharma", parentName: "Arjun Sharma",
    requestType: "change_stop",
    proposedStop: "Nowgam Chowk",
    details: "Please change pickup stop from Hyderpora Crossing to Nowgam Chowk starting Monday.",
    status: "pending", submittedAt: "Jun 12, 2026", routeId: "RT-01",
  },
  {
    id: "TR-002", studentId: "STU-051", studentName: "Mohsin Bhat", parentName: "Hamid Bhat",
    requestType: "change_address",
    proposedAddress: "House 45, Nowgam Colony, Srinagar",
    details: "We have moved to House 45, Nowgam Colony. Please update our home address.",
    status: "pending", submittedAt: "Jun 13, 2026", routeId: "RT-02",
  },
  {
    id: "TR-003", studentId: "STU-101", studentName: "Faizan Khan", parentName: "Saleem Khan",
    requestType: "temporary",
    proposedStop: "Sopore Bypass Stop (Grandmother's house)",
    details: "My son will need temporary pickup from his grandmother's house at Sopore Bypass for two weeks (Jun 17–Jun 28).",
    status: "approved", submittedAt: "Jun 10, 2026", reviewedBy: "VP — Mrs. Rubina", reviewedAt: "Jun 11, 2026", routeId: "RT-06",
  },
  {
    id: "TR-004", studentId: "STU-151", studentName: "Abdullah Bhat", parentName: "Khalid Bhat",
    requestType: "change_stop",
    proposedStop: "Chanapora Chowk",
    details: "Please move pickup to Chanapora Chowk instead of Bemina Crossing.",
    status: "rejected", submittedAt: "Jun 9, 2026", reviewedBy: "Admin", reviewedAt: "Jun 10, 2026", routeId: "RT-04",
  },
];

// ─── Generation helpers ────────────────────────────────────────────────────────
function seeded(seed: number): number { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); }
function pick<T>(arr: T[], seed: number): T { return arr[Math.floor(seeded(seed) * arr.length)]; }

let _records: TransportRecord[] | null = null;

export function generateTransportRecords(): TransportRecord[] {
  if (_records) return _records;
  const students = getAllStudents();
  _records = students.map((s, i) => {
    const seed = i * 19 + 5;
    const rd = pick(BUS_ROUTES, seed);
    const stop = pick(rd.stops, seed + 1);
    const num = 10 + Math.floor(seeded(seed + 3) * 90);
    return {
      id: `TRN-${s.id}`,
      studentId: s.id,
      studentName: s.name,
      grade: s.grade,
      section: s.section,
      busNumber: rd.bus,
      route: rd.route,
      stopLocation: stop,
      parentName: s.parentName,
      parentContact: s.parentPhone,
      address: `House ${num}, ${stop}, Srinagar`,
      avatar: s.avatar,
    };
  });
  return _records;
}
