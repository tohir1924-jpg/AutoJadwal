export type DayName = "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu";
export type EntityStatus = "Aktif" | "Nonaktif";

export interface Teacher {
  id: string;
  nama: string;
  kodeGuru: string;
  mapelUtamaId: string;
  mapelTambahanIds: string[];
  minimalJp: number;
  maksimalJp?: number;
  sertifikasi: boolean;
  aktif: boolean;
  unavailableSlots: SlotKey[];
}

export interface Subject {
  id: string;
  namaMapel: string;
  kodeMapel: string;
  kelompok: string;
  aktif: boolean;
}

export interface ClassGroup {
  id: string;
  tingkat: string;
  namaKelas: string;
  waliKelasId?: string;
  ruangDefaultId?: string;
  aktif: boolean;
}

export interface Room {
  id: string;
  namaRuang: string;
  tipeRuang: "Kelas" | "Lab" | "Perpustakaan" | "Lapangan";
  kapasitas: number;
  aktif: boolean;
}

export interface CurriculumAllocation {
  id: string;
  tahunAjaranId: string;
  semester: "Ganjil" | "Genap";
  kelasId: string;
  mapelId: string;
  jpPerMinggu: number;
  guruUtamaId: string;
  teamTeaching: boolean;
  guruTambahanIds: string[];
  ruangKhususId?: string;
}

export interface SlotKey {
  day: DayName;
  lesson: number;
}

export interface BreakSlot extends SlotKey {
  label: string;
}

export interface ScheduleSettings {
  tahunAjaran: string;
  semester: "Ganjil" | "Genap";
  modeHari: "5_hari" | "6_hari";
  hariAktif: DayName[];
  jamMulai: string;
  durasiJp: number;
  jumlahJpPerHari: Record<DayName, number>;
  istirahat: BreakSlot[];
  istirahatSetelahJp: number;
  durasiIstirahat: number;
  istirahatKeduaSetelahJp: number;
  durasiIstirahatKedua: number;
  maxConsecutiveTeaching: number;
  enforceMaxConsecutive: boolean;
  allowTeamTeaching: boolean;
}

export interface ScheduleEntry {
  id: string;
  kelasId: string;
  mapelId: string;
  guruIds: string[];
  ruangId: string;
  day: DayName;
  lesson: number;
  source: "auto" | "manual";
}

export interface SpecialActivity {
  id: string;
  title: string;
  day: DayName;
  afterLesson: number;
  durationMinutes: number;
  classId?: string;
}

export interface SchedulerIssue {
  type:
    | "unplaced_subject"
    | "teacher_conflict"
    | "class_conflict"
    | "room_conflict"
    | "workload_below_minimum"
    | "constraint_too_strict";
  severity: "low" | "medium" | "high";
  message: string;
  suggestion?: string;
}

export interface WorkloadRow {
  teacherId: string;
  totalJp: number;
  minimalJp: number;
  maksimalJp?: number;
  status: "Terpenuhi" | "Kurang" | "Lebih";
  delta: number;
}

export interface AppData {
  teachers: Teacher[];
  subjects: Subject[];
  classes: ClassGroup[];
  rooms: Room[];
  curriculum: CurriculumAllocation[];
  settings: ScheduleSettings;
  schedule: ScheduleEntry[];
  specialActivities: SpecialActivity[];
  issues: SchedulerIssue[];
}
