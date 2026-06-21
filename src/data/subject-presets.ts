import type { Subject } from "../types";

export type EducationAuthority = "dinas" | "kemenag";
export type EducationLevel = "sd" | "smp" | "sma" | "smk";

export interface SubjectPresetOption {
  authority: EducationAuthority;
  level: EducationLevel;
}

type PresetSubject = Omit<Subject, "id" | "aktif">;

const dinasSubjects: Record<EducationLevel, PresetSubject[]> = {
  sd: [
    { namaMapel: "Pendidikan Agama dan Budi Pekerti", kodeMapel: "PABP", kelompok: "Umum" },
    { namaMapel: "Pendidikan Pancasila", kodeMapel: "PP", kelompok: "Umum" },
    { namaMapel: "Bahasa Indonesia", kodeMapel: "BIN", kelompok: "Umum" },
    { namaMapel: "Matematika", kodeMapel: "MTK", kelompok: "Umum" },
    { namaMapel: "IPAS", kodeMapel: "IPAS", kelompok: "Umum" },
    { namaMapel: "PJOK", kodeMapel: "PJOK", kelompok: "Umum" },
    { namaMapel: "Seni dan Budaya", kodeMapel: "SENI", kelompok: "Umum" },
    { namaMapel: "Seni Musik", kodeMapel: "SENI_MUSIK", kelompok: "Seni" },
    { namaMapel: "Seni Rupa", kodeMapel: "SENI_RUPA", kelompok: "Seni" },
    { namaMapel: "Seni Teater", kodeMapel: "SENI_TEATER", kelompok: "Seni" },
    { namaMapel: "Seni Tari", kodeMapel: "SENI_TARI", kelompok: "Seni" },
    { namaMapel: "Bahasa Inggris", kodeMapel: "BIG", kelompok: "Umum" },
    { namaMapel: "Muatan Lokal", kodeMapel: "MULOK", kelompok: "Muatan Lokal" },
    { namaMapel: "Koding dan Kecerdasan Artifisial", kodeMapel: "KKA", kelompok: "Pilihan" },
  ],
  smp: [
    { namaMapel: "Pendidikan Agama dan Budi Pekerti", kodeMapel: "PABP", kelompok: "Umum" },
    { namaMapel: "Pendidikan Pancasila", kodeMapel: "PP", kelompok: "Umum" },
    { namaMapel: "Bahasa Indonesia", kodeMapel: "BIN", kelompok: "Umum" },
    { namaMapel: "Matematika", kodeMapel: "MTK", kelompok: "Umum" },
    { namaMapel: "IPA", kodeMapel: "IPA", kelompok: "Umum" },
    { namaMapel: "IPS", kodeMapel: "IPS", kelompok: "Umum" },
    { namaMapel: "Bahasa Inggris", kodeMapel: "BIG", kelompok: "Umum" },
    { namaMapel: "PJOK", kodeMapel: "PJOK", kelompok: "Umum" },
    { namaMapel: "Informatika", kodeMapel: "INF", kelompok: "Umum" },
    { namaMapel: "Seni Musik", kodeMapel: "SENI_MUSIK", kelompok: "Seni, Budaya, dan Prakarya" },
    { namaMapel: "Seni Rupa", kodeMapel: "SENI_RUPA", kelompok: "Seni, Budaya, dan Prakarya" },
    { namaMapel: "Seni Teater", kodeMapel: "SENI_TEATER", kelompok: "Seni, Budaya, dan Prakarya" },
    { namaMapel: "Seni Tari", kodeMapel: "SENI_TARI", kelompok: "Seni, Budaya, dan Prakarya" },
    { namaMapel: "Prakarya Budi Daya", kodeMapel: "PKRY_BD", kelompok: "Seni, Budaya, dan Prakarya" },
    { namaMapel: "Prakarya Kerajinan", kodeMapel: "PKRY_KJ", kelompok: "Seni, Budaya, dan Prakarya" },
    { namaMapel: "Prakarya Rekayasa", kodeMapel: "PKRY_RK", kelompok: "Seni, Budaya, dan Prakarya" },
    { namaMapel: "Prakarya Pengolahan", kodeMapel: "PKRY_PH", kelompok: "Seni, Budaya, dan Prakarya" },
    { namaMapel: "Muatan Lokal", kodeMapel: "MULOK", kelompok: "Muatan Lokal" },
    { namaMapel: "Koding dan Kecerdasan Artifisial", kodeMapel: "KKA", kelompok: "Pilihan" },
  ],
  sma: [
    { namaMapel: "Pendidikan Agama dan Budi Pekerti", kodeMapel: "PABP", kelompok: "Wajib" },
    { namaMapel: "Pendidikan Pancasila", kodeMapel: "PP", kelompok: "Wajib" },
    { namaMapel: "Bahasa Indonesia", kodeMapel: "BIN", kelompok: "Wajib" },
    { namaMapel: "Matematika", kodeMapel: "MTK", kelompok: "Wajib" },
    { namaMapel: "Bahasa Inggris", kodeMapel: "BIG", kelompok: "Wajib" },
    { namaMapel: "PJOK", kodeMapel: "PJOK", kelompok: "Wajib" },
    { namaMapel: "Sejarah", kodeMapel: "SEJ", kelompok: "Wajib" },
    { namaMapel: "Seni dan Budaya", kodeMapel: "SENI", kelompok: "Wajib" },
    { namaMapel: "Informatika", kodeMapel: "INF", kelompok: "Umum Kelas X" },
    { namaMapel: "Muatan Lokal", kodeMapel: "MULOK", kelompok: "Muatan Lokal" },
    { namaMapel: "Matematika Tingkat Lanjut", kodeMapel: "MTK_LJT", kelompok: "Pilihan" },
    { namaMapel: "Fisika", kodeMapel: "FIS", kelompok: "Pilihan" },
    { namaMapel: "Kimia", kodeMapel: "KIM", kelompok: "Pilihan" },
    { namaMapel: "Biologi", kodeMapel: "BIO", kelompok: "Pilihan" },
    { namaMapel: "Geografi", kodeMapel: "GEO", kelompok: "Pilihan" },
    { namaMapel: "Sejarah Tingkat Lanjut", kodeMapel: "SEJ_LJT", kelompok: "Pilihan" },
    { namaMapel: "Sosiologi", kodeMapel: "SOS", kelompok: "Pilihan" },
    { namaMapel: "Ekonomi", kodeMapel: "EKO", kelompok: "Pilihan" },
    { namaMapel: "Bahasa Indonesia Tingkat Lanjut", kodeMapel: "BIN_LJT", kelompok: "Pilihan" },
    { namaMapel: "Bahasa Inggris Tingkat Lanjut", kodeMapel: "BIG_LJT", kelompok: "Pilihan" },
    { namaMapel: "Bahasa Arab", kodeMapel: "BAR", kelompok: "Pilihan" },
    { namaMapel: "Bahasa Jepang", kodeMapel: "BJP", kelompok: "Pilihan" },
    { namaMapel: "Bahasa Jerman", kodeMapel: "BJM", kelompok: "Pilihan" },
    { namaMapel: "Bahasa Korea", kodeMapel: "BKR", kelompok: "Pilihan" },
    { namaMapel: "Bahasa Mandarin", kodeMapel: "BMD", kelompok: "Pilihan" },
    { namaMapel: "Bahasa Prancis", kodeMapel: "BPR", kelompok: "Pilihan" },
    { namaMapel: "Antropologi", kodeMapel: "ANT", kelompok: "Pilihan" },
    { namaMapel: "Koding dan Kecerdasan Artifisial", kodeMapel: "KKA", kelompok: "Pilihan" },
    { namaMapel: "Prakarya dan Kewirausahaan", kodeMapel: "PKWU", kelompok: "Pilihan" },
  ],
  smk: [
    { namaMapel: "Pendidikan Agama dan Budi Pekerti", kodeMapel: "PABP", kelompok: "Umum" },
    { namaMapel: "Pendidikan Pancasila", kodeMapel: "PP", kelompok: "Umum" },
    { namaMapel: "Bahasa Indonesia", kodeMapel: "BIN", kelompok: "Umum" },
    { namaMapel: "PJOK", kodeMapel: "PJOK", kelompok: "Umum" },
    { namaMapel: "Sejarah", kodeMapel: "SEJ", kelompok: "Umum" },
    { namaMapel: "Seni dan Budaya", kodeMapel: "SENI", kelompok: "Umum" },
    { namaMapel: "Matematika", kodeMapel: "MTK", kelompok: "Kejuruan" },
    { namaMapel: "Bahasa Inggris", kodeMapel: "BIG", kelompok: "Kejuruan" },
    { namaMapel: "Informatika", kodeMapel: "INF", kelompok: "Kejuruan" },
    { namaMapel: "Projek IPAS", kodeMapel: "PIPAS", kelompok: "Kejuruan" },
    { namaMapel: "Dasar-Dasar Program Keahlian", kodeMapel: "DDPK", kelompok: "Kejuruan" },
    { namaMapel: "Konsentrasi Keahlian", kodeMapel: "KK", kelompok: "Kejuruan" },
    { namaMapel: "Kreativitas, Inovasi, dan Kewirausahaan", kodeMapel: "KIK", kelompok: "Kejuruan" },
    { namaMapel: "Mata Pelajaran Pilihan", kodeMapel: "MPP", kelompok: "Pilihan" },
    { namaMapel: "Praktik Kerja Lapangan / PKL", kodeMapel: "PKL", kelompok: "Kejuruan" },
    { namaMapel: "Muatan Lokal", kodeMapel: "MULOK", kelompok: "Muatan Lokal" },
  ],
};

const kemenagReligion: PresetSubject[] = [
  { namaMapel: "Al-Quran Hadis", kodeMapel: "QH", kelompok: "Khas Kemenag" },
  { namaMapel: "Akidah Akhlak", kodeMapel: "AA", kelompok: "Khas Kemenag" },
  { namaMapel: "Fikih", kodeMapel: "FIK", kelompok: "Khas Kemenag" },
  { namaMapel: "Sejarah Kebudayaan Islam", kodeMapel: "SKI", kelompok: "Khas Kemenag" },
  { namaMapel: "Bahasa Arab", kodeMapel: "BAR", kelompok: "Khas Kemenag" },
];

const kemenagSubjects: Record<EducationLevel, PresetSubject[]> = {
  sd: [
    ...kemenagReligion,
    { namaMapel: "Pendidikan Pancasila", kodeMapel: "PP", kelompok: "Umum" },
    { namaMapel: "Bahasa Indonesia", kodeMapel: "BIN", kelompok: "Umum" },
    { namaMapel: "Matematika", kodeMapel: "MTK", kelompok: "Umum" },
    { namaMapel: "IPAS", kodeMapel: "IPAS", kelompok: "Umum" },
    { namaMapel: "PJOK", kodeMapel: "PJOK", kelompok: "Umum" },
    { namaMapel: "Seni dan Budaya", kodeMapel: "SENI", kelompok: "Umum" },
    { namaMapel: "Bahasa Inggris", kodeMapel: "BIG", kelompok: "Umum" },
    { namaMapel: "Muatan Lokal", kodeMapel: "MULOK", kelompok: "Muatan Lokal" },
    { namaMapel: "Koding dan Kecerdasan Artifisial", kodeMapel: "KKA", kelompok: "Pilihan" },
  ],
  smp: [
    ...kemenagReligion,
    { namaMapel: "Pendidikan Pancasila", kodeMapel: "PP", kelompok: "Umum" },
    { namaMapel: "Bahasa Indonesia", kodeMapel: "BIN", kelompok: "Umum" },
    { namaMapel: "Matematika", kodeMapel: "MTK", kelompok: "Umum" },
    { namaMapel: "IPA", kodeMapel: "IPA", kelompok: "Umum" },
    { namaMapel: "IPS", kodeMapel: "IPS", kelompok: "Umum" },
    { namaMapel: "Bahasa Inggris", kodeMapel: "BIG", kelompok: "Umum" },
    { namaMapel: "PJOK", kodeMapel: "PJOK", kelompok: "Umum" },
    { namaMapel: "Informatika", kodeMapel: "INF", kelompok: "Umum" },
    { namaMapel: "Seni, Budaya, dan Prakarya", kodeMapel: "SBP", kelompok: "Umum" },
    { namaMapel: "Muatan Lokal", kodeMapel: "MULOK", kelompok: "Muatan Lokal" },
    { namaMapel: "Koding dan Kecerdasan Artifisial", kodeMapel: "KKA", kelompok: "Pilihan" },
  ],
  sma: [
    ...kemenagReligion,
    { namaMapel: "Pendidikan Pancasila", kodeMapel: "PP", kelompok: "Wajib" },
    { namaMapel: "Bahasa Indonesia", kodeMapel: "BIN", kelompok: "Wajib" },
    { namaMapel: "Matematika", kodeMapel: "MTK", kelompok: "Wajib" },
    { namaMapel: "Bahasa Inggris", kodeMapel: "BIG", kelompok: "Wajib" },
    { namaMapel: "PJOK", kodeMapel: "PJOK", kelompok: "Wajib" },
    { namaMapel: "Sejarah", kodeMapel: "SEJ", kelompok: "Wajib" },
    { namaMapel: "Seni dan Budaya", kodeMapel: "SENI", kelompok: "Wajib" },
    { namaMapel: "Muatan Lokal", kodeMapel: "MULOK", kelompok: "Muatan Lokal" },
    { namaMapel: "Matematika Tingkat Lanjut", kodeMapel: "MTK_LJT", kelompok: "Pilihan" },
    { namaMapel: "Fisika", kodeMapel: "FIS", kelompok: "Pilihan" },
    { namaMapel: "Kimia", kodeMapel: "KIM", kelompok: "Pilihan" },
    { namaMapel: "Biologi", kodeMapel: "BIO", kelompok: "Pilihan" },
    { namaMapel: "Geografi", kodeMapel: "GEO", kelompok: "Pilihan" },
    { namaMapel: "Sejarah Tingkat Lanjut", kodeMapel: "SEJ_LJT", kelompok: "Pilihan" },
    { namaMapel: "Sosiologi", kodeMapel: "SOS", kelompok: "Pilihan" },
    { namaMapel: "Ekonomi", kodeMapel: "EKO", kelompok: "Pilihan" },
    { namaMapel: "Bahasa Arab Tingkat Lanjut / Pendalaman", kodeMapel: "BAR_LJT", kelompok: "Pilihan" },
    { namaMapel: "Bahasa Asing Lain", kodeMapel: "BASING", kelompok: "Pilihan" },
    { namaMapel: "Antropologi", kodeMapel: "ANT", kelompok: "Pilihan" },
    { namaMapel: "Informatika", kodeMapel: "INF", kelompok: "Pilihan" },
    { namaMapel: "Koding dan Kecerdasan Artifisial", kodeMapel: "KKA", kelompok: "Pilihan" },
    { namaMapel: "Prakarya dan Kewirausahaan", kodeMapel: "PKWU", kelompok: "Pilihan" },
  ],
  smk: [
    ...kemenagReligion,
    ...dinasSubjects.smk.filter((subject) => subject.kodeMapel !== "PABP"),
  ],
};

export function getSubjectPreset(option: SubjectPresetOption): Subject[] {
  const subjects = option.authority === "dinas" ? dinasSubjects[option.level] : kemenagSubjects[option.level];
  return subjects.map((subject) => ({
    id: `mapel-${subject.kodeMapel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    ...subject,
    aktif: true,
  }));
}

export function presetLabel(option: SubjectPresetOption): string {
  const authority = option.authority === "dinas" ? "Kementerian Pendidikan" : "Kemenag";
  const levelLabel: Record<EducationLevel, string> = {
    sd: option.authority === "kemenag" ? "MI" : "SD",
    smp: option.authority === "kemenag" ? "MTs" : "SMP",
    sma: option.authority === "kemenag" ? "MA" : "SMA",
    smk: option.authority === "kemenag" ? "MAK" : "SMK",
  };
  return `${authority} - ${levelLabel[option.level]}`;
}
