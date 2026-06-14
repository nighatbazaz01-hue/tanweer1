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
  { bus: "Bus 01", routeCode: "RT-01", route: "North Riyadh — Al-Nakheel",  stops: ["Al-Nakheel Roundabout", "Malaz Square", "King Fahd Road", "Al-Muruj Gate"], pickupTimes: ["6:45 AM", "7:00 AM", "7:10 AM", "7:20 AM"], dropTimes: ["2:30 PM", "2:45 PM", "2:55 PM", "3:05 PM"] },
  { bus: "Bus 02", routeCode: "RT-02", route: "East Riyadh — Al-Ruwais",    stops: ["Al-Ruwais Park", "Al-Rabwa Crossing", "Prince Turki Road", "Al-Salam Gate"], pickupTimes: ["6:40 AM", "6:55 AM", "7:05 AM", "7:15 AM"], dropTimes: ["2:25 PM", "2:40 PM", "2:50 PM", "3:00 PM"] },
  { bus: "Bus 03", routeCode: "RT-03", route: "West Riyadh — Al-Aqiq",      stops: ["Al-Aqiq Mosque", "King Abdullah Road", "Diplomatic Quarter", "Al-Hamra Exit"], pickupTimes: ["6:50 AM", "7:02 AM", "7:12 AM", "7:22 AM"], dropTimes: ["2:35 PM", "2:47 PM", "2:57 PM", "3:07 PM"] },
  { bus: "Bus 04", routeCode: "RT-04", route: "South Riyadh — Al-Shifa",    stops: ["Al-Shifa Center", "Al-Badr Road", "Airport Road Junction", "Al-Naseem Gate"], pickupTimes: ["6:30 AM", "6:45 AM", "6:58 AM", "7:10 AM"], dropTimes: ["2:20 PM", "2:35 PM", "2:48 PM", "3:00 PM"] },
  { bus: "Bus 05", routeCode: "RT-05", route: "Central Riyadh — Olaya",     stops: ["Olaya Towers", "Al-Wuroud", "King Salman Park", "Main Gate"], pickupTimes: ["6:55 AM", "7:05 AM", "7:15 AM", "7:25 AM"], dropTimes: ["2:40 PM", "2:50 PM", "3:00 PM", "3:10 PM"] },
  { bus: "Bus 06", routeCode: "RT-06", route: "North-West — Al-Rawdah",     stops: ["Al-Rawdah Villa", "Al-Worood District", "Prince Fawwaz Road", "Side Gate B"], pickupTimes: ["6:35 AM", "6:48 AM", "7:00 AM", "7:12 AM"], dropTimes: ["2:28 PM", "2:41 PM", "2:53 PM", "3:05 PM"] },
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
  { vehicleType: "Coach",    capacity: 50, fuelType: "Diesel", registrationNumber: "RYD-1045-A", insuranceExpiry: "Dec 2025", fitnessExpiry: "Nov 2025", pollutionExpiry: "Oct 2025", status: "active",      driverName: "Mohammed Al-Rashidi",  conductorName: "Ahmed Al-Zahrani"  },
  { vehicleType: "Coach",    capacity: 48, fuelType: "Diesel", registrationNumber: "RYD-2187-B", insuranceExpiry: "Mar 2026", fitnessExpiry: "Feb 2026", pollutionExpiry: "Jan 2026", status: "active",      driverName: "Ibrahim Al-Ghamdi",    conductorName: "Khalid Al-Dosari"  },
  { vehicleType: "Mini-Bus", capacity: 35, fuelType: "CNG",    registrationNumber: "RYD-3321-C", insuranceExpiry: "Jun 2026", fitnessExpiry: "May 2026", pollutionExpiry: "Apr 2026", status: "maintenance", driverName: "Faisal Al-Mutairi",    conductorName: "Omar Al-Harbi"     },
  { vehicleType: "Coach",    capacity: 52, fuelType: "Diesel", registrationNumber: "RYD-4563-D", insuranceExpiry: "Sep 2025", fitnessExpiry: "Aug 2025", pollutionExpiry: "Jul 2025", status: "active",      driverName: "Saad Al-Anazi",        conductorName: "Bilal Al-Shehri"   },
  { vehicleType: "Coach",    capacity: 50, fuelType: "Diesel", registrationNumber: "RYD-5892-E", insuranceExpiry: "Jan 2026", fitnessExpiry: "Dec 2025", pollutionExpiry: "Nov 2025", status: "active",      driverName: "Turki Al-Barrak",      conductorName: "Nawaf Al-Sayed"    },
  { vehicleType: "Mini-Bus", capacity: 35, fuelType: "Petrol", registrationNumber: "RYD-6124-F", insuranceExpiry: "Apr 2026", fitnessExpiry: "Mar 2026", pollutionExpiry: "Feb 2026", status: "inactive",    driverName: "Adel Al-Qahtani",      conductorName: "Ziad Al-Farouk"    },
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
    id: "TR-001", studentId: "STU-001", studentName: "Ahmed Al-Rashidi", parentName: "Mohammed Al-Rashidi",
    requestType: "change_stop",
    proposedStop: "Malaz Square",
    details: "Please change pickup stop from Al-Nakheel Roundabout to Malaz Square starting Monday.",
    status: "pending", submittedAt: "Jun 12, 2026", routeId: "RT-01",
  },
  {
    id: "TR-002", studentId: "STU-051", studentName: "Mazen Al-Harbi", parentName: "Hassan Al-Harbi",
    requestType: "change_address",
    proposedAddress: "Villa 45, Al-Ruwais District, Riyadh",
    details: "We have moved to Villa 45, Al-Ruwais District. Please update our home address.",
    status: "pending", submittedAt: "Jun 13, 2026", routeId: "RT-02",
  },
  {
    id: "TR-003", studentId: "STU-101", studentName: "Fahad Al-Mutairi", parentName: "Saeed Al-Mutairi",
    requestType: "temporary",
    proposedStop: "Prince Fawwaz Road (Grandmother's house)",
    details: "My son will need temporary pickup from his grandmother's house at Prince Fawwaz Road for two weeks (Jun 17–Jun 28).",
    status: "approved", submittedAt: "Jun 10, 2026", reviewedBy: "VP — Mrs. Hessa", reviewedAt: "Jun 11, 2026", routeId: "RT-06",
  },
  {
    id: "TR-004", studentId: "STU-151", studentName: "Abdullah Al-Zahrani", parentName: "Khalid Al-Zahrani",
    requestType: "change_stop",
    proposedStop: "Al-Naseem Gate",
    details: "Please move pickup to Al-Naseem Gate instead of Al-Shifa Center.",
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
      address: `Villa ${num}, ${stop}, Riyadh`,
      avatar: s.avatar,
    };
  });
  return _records;
}
