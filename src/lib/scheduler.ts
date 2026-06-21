import type {
  AppData,
  CurriculumAllocation,
  DayName,
  ScheduleEntry,
  ScheduleSettings,
  SchedulerIssue,
  SlotKey,
  Teacher,
  WorkloadRow,
} from "../types";

interface Requirement {
  allocation: CurriculumAllocation;
  teacherIds: string[];
  roomId: string;
  priority: number;
}

const slotId = (slot: SlotKey) => `${slot.day}-${slot.lesson}`;

export function buildSlots(settings: ScheduleSettings): SlotKey[] {
  return settings.hariAktif.flatMap((day) =>
    Array.from({ length: settings.jumlahJpPerHari[day] }, (_, index) => ({
      day,
      lesson: index + 1,
    })),
  );
}

export function isBreak(settings: ScheduleSettings, slot: SlotKey): boolean {
  return settings.istirahat.some((item) => item.day === slot.day && item.lesson === slot.lesson);
}

export function buildLessonLabel(settings: ScheduleSettings, lesson: number, day?: DayName): string {
  const [hour, minute] = settings.jamMulai.split(":").map(Number);
  
  let breakOffset = 0;
  if (day) {
    // Cari semua break di hari ini yang terjadi SEBELUM atau SAMA DENGAN JP ini
    // Break ke-n terjadi pada b.lesson. Jadi jika KBM saat ini lesson >= b.lesson, tambahkan durasi istirahat.
    const dayBreaks = settings.istirahat.filter((b) => b.day === day && b.lesson <= lesson);
    for (const b of dayBreaks) {
      if (b.label === "Istirahat 2") {
        breakOffset += settings.durasiIstirahatKedua;
      } else {
        breakOffset += settings.durasiIstirahat;
      }
    }
  } else {
    const firstBreakOffset = settings.istirahatSetelahJp > 0 && lesson > settings.istirahatSetelahJp ? settings.durasiIstirahat : 0;
    const secondBreakOffset = settings.istirahatKeduaSetelahJp > 0 && lesson > settings.istirahatKeduaSetelahJp ? settings.durasiIstirahatKedua : 0;
    breakOffset = firstBreakOffset + secondBreakOffset;
  }

  const startMinutes = hour * 60 + minute + (lesson - 1) * settings.durasiJp + breakOffset;
  const endMinutes = startMinutes + settings.durasiJp;
  return `${formatMinutes(startMinutes)}-${formatMinutes(endMinutes)}`;
}

export function splitIntoBlocks(jp: number, mapelCode: string): number[] {
  if (jp <= 0) return [];
  
  if (mapelCode === "PJOK") {
    if (jp >= 3) return [3, ...splitIntoBlocks(jp - 3, mapelCode)];
    if (jp === 2) return [2];
    if (jp === 1) return [1];
  }

  if (jp === 6) return [3, 3];
  if (jp === 5) return [3, 2];
  if (jp === 4) return [2, 2];
  if (jp === 3) return [2, 1];
  if (jp === 2) return [2];
  if (jp === 1) return [1];

  if (jp >= 3) {
    return [3, ...splitIntoBlocks(jp - 3, mapelCode)];
  }
  return [jp];
}

function formatMinutes(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

export function generateSchedule(data: AppData): { schedule: ScheduleEntry[]; issues: SchedulerIssue[] } {
  const slots = buildSlots(data.settings);
  const requirements = buildRequirements(data).sort((a, b) => b.priority - a.priority);
  const schedule: ScheduleEntry[] = [];
  const issues: SchedulerIssue[] = validateBeforeGenerate(data, slots);

  for (const requirement of requirements) {
    const blockSizes = splitIntoBlocks(requirement.allocation.jpPerMinggu, getSubjectCode(data, requirement.allocation.mapelId));

    for (const blockSize of blockSizes) {
      // Cari slot kandidat yang bisa memuat blok sebanyak blockSize
      const candidates = slots.filter((slot) => {
        for (let i = 0; i < blockSize; i++) {
          const nextSlot = { day: slot.day, lesson: slot.lesson + i };
          if (nextSlot.lesson > data.settings.jumlahJpPerHari[slot.day]) return false;
          if (!isValidPlacement(requirement, nextSlot, schedule, data)) return false;
        }
        return true;
      });

      // Urutkan kandidat berdasarkan rata-rata skor slot
      candidates.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        for (let i = 0; i < blockSize; i++) {
          scoreA += scoreSlot({ day: a.day, lesson: a.lesson + i }, requirement, schedule, data);
          scoreB += scoreSlot({ day: b.day, lesson: b.lesson + i }, requirement, schedule, data);
        }
        return scoreB - scoreA;
      });

      if (!candidates[0]) {
        // Fallback: Jika tidak bisa dijadwalkan secara utuh dalam blok, taruh satu per satu (1 JP)
        let blockRemaining = blockSize;
        while (blockRemaining > 0) {
          const singleCandidates = slots
            .filter((slot) => isValidPlacement(requirement, slot, schedule, data))
            .sort((a, b) => scoreSlot(b, requirement, schedule, data) - scoreSlot(a, requirement, schedule, data));

          if (!singleCandidates[0]) {
            issues.push({
              type: "unplaced_subject",
              severity: "high",
              message: `${getClassName(data, requirement.allocation.kelasId)} - ${getSubjectCode(data, requirement.allocation.mapelId)} belum terjadwal ${blockRemaining} JP.`,
              suggestion: "Tambah slot aktif, ubah ketersediaan guru, atau longgarkan maksimal mengajar berturut-turut.",
            });
            break;
          }

          const slot = singleCandidates[0];
          schedule.push({
            id: `jadwal-${requirement.allocation.id}-${slot.day}-${slot.lesson}`,
            kelasId: requirement.allocation.kelasId,
            mapelId: requirement.allocation.mapelId,
            guruIds: requirement.teacherIds,
            ruangId: requirement.roomId,
            day: slot.day,
            lesson: slot.lesson,
            source: "auto",
          });
          blockRemaining -= 1;
        }
        continue;
      }

      // Jadwalkan blok secara berurutan
      const startSlot = candidates[0];
      for (let i = 0; i < blockSize; i++) {
        const slot = { day: startSlot.day, lesson: startSlot.lesson + i };
        schedule.push({
          id: `jadwal-${requirement.allocation.id}-${slot.day}-${slot.lesson}`,
          kelasId: requirement.allocation.kelasId,
          mapelId: requirement.allocation.mapelId,
          guruIds: requirement.teacherIds,
          ruangId: requirement.roomId,
          day: slot.day,
          lesson: slot.lesson,
          source: "auto",
        });
      }
    }
  }

  issues.push(...validateFullSchedule(schedule, data));
  issues.push(...workloadIssues(data, schedule));

  return { schedule, issues };
}

function buildRequirements(data: AppData): Requirement[] {
  return data.curriculum.map((allocation) => {
    const teacherIds = data.settings.allowTeamTeaching && allocation.teamTeaching
      ? [allocation.guruUtamaId, ...allocation.guruTambahanIds]
      : [allocation.guruUtamaId];
    const kelas = data.classes.find((item) => item.id === allocation.kelasId);
    const roomId = allocation.ruangKhususId || kelas?.ruangDefaultId || data.rooms[0]?.id || "";
    const availabilityDifficulty = teacherIds.reduce((sum, teacherId) => {
      const teacher = data.teachers.find((item) => item.id === teacherId);
      return sum + (teacher?.unavailableSlots.length || 0);
    }, 0);
    const priority =
      availabilityDifficulty * 30 +
      (allocation.ruangKhususId ? 20 : 0) +
      (allocation.teamTeaching ? 20 : 0) +
      allocation.jpPerMinggu * 5 +
      teacherIds.reduce((sum, teacherId) => sum + (data.teachers.find((item) => item.id === teacherId)?.sertifikasi ? 15 : 0), 0);

    return { allocation, teacherIds, roomId, priority };
  });
}

function isValidPlacement(requirement: Requirement, slot: SlotKey, schedule: ScheduleEntry[], data: AppData): boolean {
  if (!data.settings.hariAktif.includes(slot.day)) return false;
  if (isBreak(data.settings, slot)) return false;
  if (schedule.some((entry) => sameSlot(entry, slot) && entry.kelasId === requirement.allocation.kelasId)) return false;
  if (schedule.some((entry) => sameSlot(entry, slot) && entry.ruangId === requirement.roomId)) return false;

  for (const teacherId of requirement.teacherIds) {
    const teacher = data.teachers.find((item) => item.id === teacherId);
    if (!teacher || !teacher.aktif) return false;
    if (teacher.unavailableSlots.some((blocked) => blocked.day === slot.day && blocked.lesson === slot.lesson)) return false;
    if (schedule.some((entry) => sameSlot(entry, slot) && entry.guruIds.includes(teacherId))) return false;
    if (data.settings.enforceMaxConsecutive && exceedsMaxConsecutive(teacherId, slot, schedule, data.settings.maxConsecutiveTeaching)) return false;
  }

  return true;
}

function scoreSlot(slot: SlotKey, requirement: Requirement, schedule: ScheduleEntry[], data: AppData): number {
  const sameSubjectSameDay = schedule.some(
    (entry) => entry.kelasId === requirement.allocation.kelasId && entry.mapelId === requirement.allocation.mapelId && entry.day === slot.day,
  );
  const teacherDailyLoad = requirement.teacherIds.reduce(
    (sum, teacherId) => sum + schedule.filter((entry) => entry.day === slot.day && entry.guruIds.includes(teacherId)).length,
    0,
  );
  const classDailyLoad = schedule.filter((entry) => entry.day === slot.day && entry.kelasId === requirement.allocation.kelasId).length;

  return 100 - (sameSubjectSameDay ? 18 : 0) - teacherDailyLoad * 4 - classDailyLoad * 2 + (slot.lesson <= 3 ? 8 : 0);
}

function exceedsMaxConsecutive(teacherId: string, slot: SlotKey, schedule: ScheduleEntry[], maxConsecutive: number): boolean {
  const occupied = new Set(
    schedule
      .filter((entry) => entry.day === slot.day && entry.guruIds.includes(teacherId))
      .map((entry) => entry.lesson),
  );
  occupied.add(slot.lesson);

  let streak = 0;
  const lessons = Array.from(occupied).sort((a, b) => a - b);
  for (let index = 0; index < lessons.length; index += 1) {
    streak = index > 0 && lessons[index] === lessons[index - 1] + 1 ? streak + 1 : 1;
    if (streak > maxConsecutive) return true;
  }
  return false;
}

function validateBeforeGenerate(data: AppData, slots: SlotKey[]): SchedulerIssue[] {
  const issues: SchedulerIssue[] = [];
  if (data.teachers.length === 0) issues.push({ type: "constraint_too_strict", severity: "high", message: "Data guru belum tersedia." });
  if (data.classes.length === 0) issues.push({ type: "constraint_too_strict", severity: "high", message: "Data kelas belum tersedia." });
  if (data.subjects.length === 0) issues.push({ type: "constraint_too_strict", severity: "high", message: "Data mata pelajaran belum tersedia." });

  for (const kelas of data.classes) {
    const needed = data.curriculum.filter((item) => item.kelasId === kelas.id).reduce((sum, item) => sum + item.jpPerMinggu, 0);
    if (needed > slots.length) {
      issues.push({
        type: "constraint_too_strict",
        severity: "high",
        message: `Total kebutuhan ${kelas.namaKelas} (${needed} JP) melebihi kapasitas slot aktif (${slots.length} JP).`,
        suggestion: "Tambah jumlah JP per hari atau kurangi alokasi JP kelas tersebut.",
      });
    }
  }

  return issues;
}

export function validateFullSchedule(schedule: ScheduleEntry[], data: AppData): SchedulerIssue[] {
  const issues: SchedulerIssue[] = [];
  const teacherSlot = new Map<string, ScheduleEntry>();
  const classSlot = new Map<string, ScheduleEntry>();
  const roomSlot = new Map<string, ScheduleEntry>();

  for (const entry of schedule) {
    const classKey = `${entry.kelasId}-${entry.day}-${entry.lesson}`;
    const roomKey = `${entry.ruangId}-${entry.day}-${entry.lesson}`;
    if (classSlot.has(classKey)) issues.push({ type: "class_conflict", severity: "high", message: `Bentrok kelas pada ${getClassName(data, entry.kelasId)} ${entry.day} JP ${entry.lesson}.` });
    if (roomSlot.has(roomKey)) issues.push({ type: "room_conflict", severity: "high", message: `Bentrok ruang pada ${getRoomName(data, entry.ruangId)} ${entry.day} JP ${entry.lesson}.` });
    classSlot.set(classKey, entry);
    roomSlot.set(roomKey, entry);

    for (const teacherId of entry.guruIds) {
      const teacherKey = `${teacherId}-${entry.day}-${entry.lesson}`;
      if (teacherSlot.has(teacherKey)) issues.push({ type: "teacher_conflict", severity: "high", message: `Bentrok guru ${getTeacherName(data, teacherId)} pada ${entry.day} JP ${entry.lesson}.` });
      teacherSlot.set(teacherKey, entry);
    }
  }

  return issues;
}

export function calculateWorkloads(data: Pick<AppData, "teachers">, schedule: ScheduleEntry[]): WorkloadRow[] {
  return data.teachers.map((teacher) => {
    const totalJp = schedule.filter((entry) => entry.guruIds.includes(teacher.id)).length;
    const status = totalJp < teacher.minimalJp ? "Kurang" : teacher.maksimalJp && totalJp > teacher.maksimalJp ? "Lebih" : "Terpenuhi";
    const delta = status === "Kurang" ? teacher.minimalJp - totalJp : teacher.maksimalJp && totalJp > teacher.maksimalJp ? totalJp - teacher.maksimalJp : 0;
    return { teacherId: teacher.id, totalJp, minimalJp: teacher.minimalJp, maksimalJp: teacher.maksimalJp, status, delta };
  });
}

function workloadIssues(data: AppData, schedule: ScheduleEntry[]): SchedulerIssue[] {
  return calculateWorkloads(data, schedule)
    .filter((row) => row.status === "Kurang")
    .map((row) => ({
      type: "workload_below_minimum",
      severity: "medium",
      message: `${getTeacherName(data, row.teacherId)} masih kurang ${row.delta} JP dari minimal ${row.minimalJp} JP.`,
      suggestion: "Tambahkan alokasi mengajar atau sesuaikan target minimal JP.",
    }));
}

function sameSlot(entry: ScheduleEntry, slot: SlotKey): boolean {
  return entry.day === slot.day && entry.lesson === slot.lesson;
}

export function getTeacherName(data: Pick<AppData, "teachers">, id: string): string {
  return data.teachers.find((item) => item.id === id)?.nama || "-";
}

export function getSubjectCode(data: Pick<AppData, "subjects">, id: string): string {
  return data.subjects.find((item) => item.id === id)?.kodeMapel || "-";
}

export function getClassName(data: Pick<AppData, "classes">, id: string): string {
  return data.classes.find((item) => item.id === id)?.namaKelas || "-";
}

export function getRoomName(data: Pick<AppData, "rooms">, id: string): string {
  return data.rooms.find((item) => item.id === id)?.namaRuang || "-";
}

export function teacherAvailabilityText(teacher: Teacher): string {
  return teacher.unavailableSlots.length === 0
    ? "Semua slot"
    : teacher.unavailableSlots.map((slot) => `${slot.day} JP ${slot.lesson}`).join(", ");
}

export function maxLessonForActiveDays(settings: ScheduleSettings): number {
  return Math.max(...settings.hariAktif.map((day: DayName) => settings.jumlahJpPerHari[day]));
}
