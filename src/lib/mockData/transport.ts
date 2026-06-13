import { getAllStudents } from "./population";

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

const BUS_ROUTES = [
  { bus: "Bus 01", route: "North Riyadh — Al-Nakheel", stops: ["Al-Nakheel Roundabout", "Malaz Square", "King Fahd Road", "Al-Muruj Gate"] },
  { bus: "Bus 02", route: "East Riyadh — Al-Ruwais",   stops: ["Al-Ruwais Park", "Al-Rabwa Crossing", "Prince Turki Road", "Al-Salam Gate"] },
  { bus: "Bus 03", route: "West Riyadh — Al-Aqiq",     stops: ["Al-Aqiq Mosque", "King Abdullah Road", "Diplomatic Quarter", "Al-Hamra Exit"] },
  { bus: "Bus 04", route: "South Riyadh — Al-Shifa",   stops: ["Al-Shifa Center", "Al-Badr Road", "Airport Road Junction", "Al-Naseem Gate"] },
  { bus: "Bus 05", route: "Central Riyadh — Olaya",    stops: ["Olaya Towers", "Al-Wuroud", "King Salman Park", "Main Gate"] },
  { bus: "Bus 06", route: "North-West — Al-Rawdah",    stops: ["Al-Rawdah Villa", "Al-Worood District", "Prince Fawwaz Road", "Side Gate B"] },
];

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
