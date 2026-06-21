import type { AppData, ClassGroup, CurriculumAllocation, Room, ScheduleSettings, Subject, Teacher } from "../types";

export const dayNames = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

export const subjects: Subject[] = [
  { id: "mapel-mtk", namaMapel: "Matematika", kodeMapel: "MTK", kelompok: "Umum", aktif: true },
  { id: "mapel-ipa", namaMapel: "Ilmu Pengetahuan Alam", kodeMapel: "IPA", kelompok: "Umum", aktif: true },
  { id: "mapel-bin", namaMapel: "Bahasa Indonesia", kodeMapel: "BIN", kelompok: "Umum", aktif: true },
  { id: "mapel-big", namaMapel: "Bahasa Inggris", kodeMapel: "BIG", kelompok: "Umum", aktif: true },
  { id: "mapel-pai", namaMapel: "Pendidikan Agama", kodeMapel: "PAI", kelompok: "Umum", aktif: true },
  { id: "mapel-pjok", namaMapel: "PJOK", kodeMapel: "PJOK", kelompok: "Umum", aktif: true },
  { id: "mapel-ips", namaMapel: "Ilmu Pengetahuan Sosial", kodeMapel: "IPS", kelompok: "Umum", aktif: true },
  { id: "mapel-seni", namaMapel: "Seni Budaya", kodeMapel: "SENI", kelompok: "Umum", aktif: true },
];

export const teachers: Teacher[] = [
  { id: "guru-ahmad", nama: "Ahmad Fauzi", kodeGuru: "G01", mapelUtamaId: "mapel-mtk", mapelTambahanIds: [], minimalJp: 24, maksimalJp: 30, sertifikasi: true, aktif: true, unavailableSlots: [{ day: "Jumat", lesson: 5 }] },
  { id: "guru-siti", nama: "Siti Aminah", kodeGuru: "G02", mapelUtamaId: "mapel-ipa", mapelTambahanIds: ["mapel-pjok"], minimalJp: 24, maksimalJp: 30, sertifikasi: true, aktif: true, unavailableSlots: [{ day: "Senin", lesson: 1 }] },
  { id: "guru-budi", nama: "Budi Santoso", kodeGuru: "G03", mapelUtamaId: "mapel-bin", mapelTambahanIds: [], minimalJp: 22, maksimalJp: 28, sertifikasi: false, aktif: true, unavailableSlots: [] },
  { id: "guru-rina", nama: "Rina Lestari", kodeGuru: "G04", mapelUtamaId: "mapel-big", mapelTambahanIds: [], minimalJp: 20, maksimalJp: 26, sertifikasi: false, aktif: true, unavailableSlots: [] },
  { id: "guru-hasan", nama: "Hasan Basri", kodeGuru: "G05", mapelUtamaId: "mapel-pai", mapelTambahanIds: [], minimalJp: 18, maksimalJp: 24, sertifikasi: true, aktif: true, unavailableSlots: [{ day: "Kamis", lesson: 6 }] },
  { id: "guru-dian", nama: "Dian Prakoso", kodeGuru: "G06", mapelUtamaId: "mapel-pjok", mapelTambahanIds: ["mapel-seni"], minimalJp: 18, maksimalJp: 24, sertifikasi: false, aktif: true, unavailableSlots: [] },
  { id: "guru-novi", nama: "Novi Rahma", kodeGuru: "G07", mapelUtamaId: "mapel-ips", mapelTambahanIds: [], minimalJp: 20, maksimalJp: 26, sertifikasi: true, aktif: true, unavailableSlots: [] },
  { id: "guru-eka", nama: "Eka Wulandari", kodeGuru: "G08", mapelUtamaId: "mapel-seni", mapelTambahanIds: [], minimalJp: 16, maksimalJp: 24, sertifikasi: false, aktif: true, unavailableSlots: [] },
];

export const rooms: Room[] = [
  { id: "ruang-01", namaRuang: "R-01", tipeRuang: "Kelas", kapasitas: 32, aktif: true },
  { id: "ruang-02", namaRuang: "R-02", tipeRuang: "Kelas", kapasitas: 32, aktif: true },
  { id: "ruang-03", namaRuang: "R-03", tipeRuang: "Kelas", kapasitas: 32, aktif: true },
  { id: "ruang-lab-ipa", namaRuang: "Lab IPA", tipeRuang: "Lab", kapasitas: 28, aktif: true },
  { id: "ruang-lapangan", namaRuang: "Lapangan", tipeRuang: "Lapangan", kapasitas: 100, aktif: true },
];

export const classes: ClassGroup[] = [
  { id: "kelas-7a", tingkat: "VII", namaKelas: "VII A", waliKelasId: "guru-budi", ruangDefaultId: "ruang-01", aktif: true },
  { id: "kelas-7b", tingkat: "VII", namaKelas: "VII B", waliKelasId: "guru-rina", ruangDefaultId: "ruang-02", aktif: true },
  { id: "kelas-8a", tingkat: "VIII", namaKelas: "VIII A", waliKelasId: "guru-novi", ruangDefaultId: "ruang-03", aktif: true },
];

const baseAllocation = (kelasId: string): Omit<CurriculumAllocation, "id" | "kelasId">[] => [
  { tahunAjaranId: "ta-2026", semester: "Ganjil", mapelId: "mapel-mtk", jpPerMinggu: 5, guruUtamaId: "guru-ahmad", teamTeaching: false, guruTambahanIds: [] },
  { tahunAjaranId: "ta-2026", semester: "Ganjil", mapelId: "mapel-ipa", jpPerMinggu: 5, guruUtamaId: "guru-siti", teamTeaching: true, guruTambahanIds: ["guru-dian"], ruangKhususId: "ruang-lab-ipa" },
  { tahunAjaranId: "ta-2026", semester: "Ganjil", mapelId: "mapel-bin", jpPerMinggu: 5, guruUtamaId: "guru-budi", teamTeaching: false, guruTambahanIds: [] },
  { tahunAjaranId: "ta-2026", semester: "Ganjil", mapelId: "mapel-big", jpPerMinggu: 4, guruUtamaId: "guru-rina", teamTeaching: false, guruTambahanIds: [] },
  { tahunAjaranId: "ta-2026", semester: "Ganjil", mapelId: "mapel-pai", jpPerMinggu: 3, guruUtamaId: "guru-hasan", teamTeaching: false, guruTambahanIds: [] },
  { tahunAjaranId: "ta-2026", semester: "Ganjil", mapelId: "mapel-pjok", jpPerMinggu: 3, guruUtamaId: "guru-dian", teamTeaching: false, guruTambahanIds: [], ruangKhususId: "ruang-lapangan" },
  { tahunAjaranId: "ta-2026", semester: "Ganjil", mapelId: "mapel-ips", jpPerMinggu: 4, guruUtamaId: "guru-novi", teamTeaching: false, guruTambahanIds: [] },
  { tahunAjaranId: "ta-2026", semester: "Ganjil", mapelId: "mapel-seni", jpPerMinggu: 2, guruUtamaId: "guru-eka", teamTeaching: false, guruTambahanIds: [] },
];

export const curriculum: CurriculumAllocation[] = classes.flatMap((kelas) =>
  baseAllocation(kelas.id).map((allocation, index) => ({
    id: `kur-${kelas.id}-${index}`,
    kelasId: kelas.id,
    ...allocation,
  })),
);

export const settings: ScheduleSettings = {
  tahunAjaran: "2026/2027",
  semester: "Ganjil",
  modeHari: "6_hari",
  hariAktif: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  jamMulai: "07:15",
  durasiJp: 40,
  jumlahJpPerHari: {
    Senin: 8,
    Selasa: 8,
    Rabu: 8,
    Kamis: 8,
    Jumat: 5,
    Sabtu: 6,
  },
  istirahat: [
    { day: "Senin", lesson: 5, label: "Istirahat" },
    { day: "Selasa", lesson: 5, label: "Istirahat" },
    { day: "Rabu", lesson: 5, label: "Istirahat" },
    { day: "Kamis", lesson: 5, label: "Istirahat" },
  ],
  istirahatSetelahJp: 4,
  durasiIstirahat: 20,
  istirahatKeduaSetelahJp: 0,
  durasiIstirahatKedua: 0,
  maxConsecutiveTeaching: 3,
  enforceMaxConsecutive: true,
  allowTeamTeaching: true,
};

export const initialData: AppData = {
  teachers,
  subjects,
  classes,
  rooms,
  curriculum,
  settings,
  schedule: [],
  specialActivities: [],
  issues: [],
};
