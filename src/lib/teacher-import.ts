import type { Subject, Teacher } from "../types";

export interface TeacherImportError {
  row: number;
  message: string;
}

export interface TeacherImportResult {
  totalRows: number;
  validTeachers: Teacher[];
  errors: TeacherImportError[];
}

type TeacherTemplateRow = {
  nama_guru?: string;
  kode_guru?: string;
  kode_mapel_utama?: string;
  kode_mapel_tambahan?: string;
  minimal_jp?: string | number;
  maksimal_jp?: string | number;
  sertifikasi?: string;
  aktif?: string;
};

const templateRows: Required<TeacherTemplateRow>[] = [
  {
    nama_guru: "Contoh Guru Baru",
    kode_guru: "G99",
    kode_mapel_utama: "MTK",
    kode_mapel_tambahan: "IPA,BIN",
    minimal_jp: 24,
    maksimal_jp: 30,
    sertifikasi: "Ya",
    aktif: "Ya",
  },
];

export async function downloadTeacherTemplate(subjects: Subject[]): Promise<void> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(templateRows), "Template Guru");
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(subjects.map((subject) => ({
      kode_mapel: subject.kodeMapel,
      nama_mapel: subject.namaMapel,
    }))),
    "Referensi Mapel",
  );
  XLSX.writeFile(workbook, "template-import-guru-autojadwal.xlsx");
}

export async function parseTeacherImport(file: File, subjects: Subject[]): Promise<TeacherImportResult> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<TeacherTemplateRow>(firstSheet, {
    defval: "",
    raw: false,
  });

  const subjectByCode = new Map(subjects.map((subject) => [normalizeCode(subject.kodeMapel), subject]));
  const seenCodes = new Set<string>();
  const validTeachers: Teacher[] = [];
  const errors: TeacherImportError[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const name = String(row.nama_guru || "").trim();
    const teacherCode = normalizeCode(row.kode_guru);
    const mainSubjectCode = normalizeCode(row.kode_mapel_utama);

    if (!name && !teacherCode && !mainSubjectCode) return;
    if (!name) errors.push({ row: rowNumber, message: "nama_guru wajib diisi." });
    if (!teacherCode) errors.push({ row: rowNumber, message: "kode_guru wajib diisi." });
    if (!mainSubjectCode) errors.push({ row: rowNumber, message: "kode_mapel_utama wajib diisi." });
    if (teacherCode && seenCodes.has(teacherCode)) errors.push({ row: rowNumber, message: `kode_guru ${teacherCode} duplikat di file.` });

    const mainSubject = subjectByCode.get(mainSubjectCode);
    if (mainSubjectCode && !mainSubject) {
      errors.push({ row: rowNumber, message: `kode_mapel_utama ${mainSubjectCode} tidak ditemukan di master mapel.` });
    }

    const additionalSubjectIds = splitCodes(row.kode_mapel_tambahan).flatMap((code) => {
      const subject = subjectByCode.get(code);
      if (!subject) {
        errors.push({ row: rowNumber, message: `kode_mapel_tambahan ${code} tidak ditemukan di master mapel.` });
        return [];
      }
      return [subject.id];
    });

    seenCodes.add(teacherCode);
    if (!name || !teacherCode || !mainSubject) return;

    validTeachers.push({
      id: crypto.randomUUID(),
      nama: name,
      kodeGuru: teacherCode,
      mapelUtamaId: mainSubject.id,
      mapelTambahanIds: additionalSubjectIds,
      minimalJp: toNumber(row.minimal_jp, 0),
      maksimalJp: toNumber(row.maksimal_jp, 0) || undefined,
      sertifikasi: toBoolean(row.sertifikasi),
      aktif: row.aktif === "" ? true : toBoolean(row.aktif),
      unavailableSlots: [],
    });
  });

  return {
    totalRows: rows.filter((row) => String(row.nama_guru || row.kode_guru || row.kode_mapel_utama || "").trim()).length,
    validTeachers,
    errors,
  };
}

function normalizeCode(value: unknown): string {
  return String(value || "").trim().toUpperCase();
}

function splitCodes(value: unknown): string[] {
  return String(value || "")
    .split(/[;,]/)
    .map((item) => normalizeCode(item))
    .filter(Boolean);
}

function toNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value: unknown): boolean {
  const normalized = String(value || "").trim().toLowerCase();
  return ["ya", "y", "true", "1", "aktif"].includes(normalized);
}
