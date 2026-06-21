import type { AppData, ScheduleEntry, WorkloadRow } from "../types";
import { buildLessonLabel, getClassName, getRoomName, getSubjectCode, getTeacherName, maxLessonForActiveDays } from "./scheduler";

export async function exportScheduleExcel(data: AppData): Promise<void> {
  const XLSX = await import("xlsx");
  const rows = data.schedule.map((entry) => scheduleRow(data, entry));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "Jadwal");
  XLSX.writeFile(workbook, `AutoJadwal-${data.settings.tahunAjaran}-jadwal.xlsx`);
}

export async function exportClassWeeklyScheduleExcel(data: AppData, classId: string): Promise<void> {
  const XLSX = await import("xlsx");
  const className = getClassName(data, classId);
  const maxLesson = maxLessonForActiveDays(data.settings);
  const rows: Array<Array<string | number>> = [
    [`Jadwal Pelajaran ${className}`],
    [`Tahun Ajaran ${data.settings.tahunAjaran} Semester ${data.settings.semester}`],
    [],
    ["Jam", ...data.settings.hariAktif],
  ];

  appendInsertedRows(data, classId, rows, 0);
  for (let lesson = 1; lesson <= maxLesson; lesson += 1) {
    rows.push([
      `JP ${lesson}\n${buildLessonLabel(data.settings, lesson)}`,
      ...data.settings.hariAktif.map((day) => {
        if (lesson > data.settings.jumlahJpPerHari[day]) {
          return "Tidak Aktif";
        }
        const entry = data.schedule.find((item) => item.kelasId === classId && item.day === day && item.lesson === lesson);
        if (!entry) return "";
        const teacherCodes = entry.guruIds.map((id) => getTeacherNumericCode(data, id)).join("/");
        return `${getSubjectCode(data, entry.mapelId)}-${teacherCodes}`;
      }),
    ]);
    appendInsertedRows(data, classId, rows, lesson);
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet["!cols"] = [{ wch: 18 }, ...data.settings.hariAktif.map(() => ({ wch: 28 }))];
  XLSX.utils.book_append_sheet(workbook, worksheet, className.slice(0, 31));
  XLSX.writeFile(workbook, `AutoJadwal-${data.settings.tahunAjaran}-${className.replace(/\s+/g, "-")}.xlsx`);
}

function appendInsertedRows(data: AppData, classId: string, rows: Array<Array<string | number>>, afterLesson: number): void {
  const breakSlots = data.settings.istirahat.filter((breakSlot) => breakSlot.lesson === afterLesson + 1);
  if (breakSlots.length > 0) {
    rows.push([
      "Jeda",
      ...data.settings.hariAktif.map((day) => breakSlots.find((breakSlot) => breakSlot.day === day)?.label || ""),
    ]);
  }

  const activities = data.specialActivities.filter((activity) =>
    activity.afterLesson === afterLesson &&
    (!activity.classId || activity.classId === classId),
  );
  for (const activity of activities) {
    rows.push([
      `${activity.durationMinutes} menit`,
      ...data.settings.hariAktif.map((day) => activity.day === day ? activity.title : ""),
    ]);
  }
}

export async function exportWorkloadExcel(data: AppData, workloads: WorkloadRow[]): Promise<void> {
  const XLSX = await import("xlsx");
  const rows = workloads.map((row) => ({
    Guru: getTeacherName(data, row.teacherId),
    "Total JP": row.totalJp,
    "Minimal JP": row.minimalJp,
    "Maksimal JP": row.maksimalJp || "-",
    Status: row.status,
    Selisih: row.delta,
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "Beban Kerja");
  XLSX.writeFile(workbook, `AutoJadwal-${data.settings.tahunAjaran}-beban-guru.xlsx`);
}

export function exportPdf(data: AppData, workloads: WorkloadRow[]): void {
  const rows = data.schedule.map((entry) => scheduleRow(data, entry));
  const html = `
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <title>AutoJadwal ${data.settings.tahunAjaran}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #17212b; margin: 24px; }
          h1 { font-size: 22px; margin: 0 0 4px; }
          h2 { font-size: 16px; margin: 24px 0 8px; }
          p { margin: 0 0 16px; color: #475569; }
          table { border-collapse: collapse; width: 100%; font-size: 11px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; }
          th { background: #102033; color: #fff; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <button onclick="window.print()">Cetak / Simpan PDF</button>
        <h1>AutoJadwal - Ringkasan Jadwal</h1>
        <p>Tahun Ajaran ${data.settings.tahunAjaran}, Semester ${data.settings.semester}</p>
        <h2>Jadwal Pelajaran</h2>
        ${tableHtml(["Hari", "JP", "Kelas", "Mapel", "Guru", "Ruang"], rows.map((row) => [row.Hari, row.JP, row.Kelas, row.Mapel, row.Guru, row.Ruang]))}
        <h2>Rekap Beban Kerja Guru</h2>
        ${tableHtml(
          ["Guru", "Total JP", "Minimal JP", "Maksimal JP", "Status"],
          workloads.map((row) => [getTeacherName(data, row.teacherId), row.totalJp, row.minimalJp, row.maksimalJp || "-", row.status]),
        )}
      </body>
    </html>
  `;
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
}

function scheduleRow(data: AppData, entry: ScheduleEntry) {
  return {
    Hari: entry.day,
    JP: entry.lesson,
    Kelas: getClassName(data, entry.kelasId),
    Mapel: getSubjectCode(data, entry.mapelId),
    Guru: entry.guruIds.map((id) => getTeacherName(data, id)).join(", "),
    Ruang: getRoomName(data, entry.ruangId),
    Sumber: entry.source,
  };
}

function getTeacherNumericCode(data: AppData, teacherId: string): string {
  const teacherIndex = data.teachers.findIndex((teacher) => teacher.id === teacherId);
  const rawCode = data.teachers[teacherIndex]?.kodeGuru || "";
  const numericCode = rawCode.replace(/\D/g, "");
  return (numericCode || String(teacherIndex + 1)).padStart(2, "0");
}

function tableHtml(headers: string[], rows: Array<Array<string | number>>): string {
  return `
    <table>
      <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(String(cell))}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
