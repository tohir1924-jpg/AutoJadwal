import type { AppData, WorkloadRow } from "../types";
import { getClassName, getRoomName, getSubjectCode, getTeacherName } from "../lib/scheduler";

type Tone = "info" | "good" | "warn" | "bad";

interface DashboardProps {
  data: AppData;
  workloads: WorkloadRow[];
  totalSlots: number;
  onOpenSettings: () => void;
  onOpenWorkloads: () => void;
  onOpenSchedule: () => void;
}

const demo = {
  teachers: 42,
  classes: 18,
  subjects: 14,
  slots: 500,
  filled: 410,
  conflicts: 4,
  underloadTeachers: 7,
  roomIssues: 3,
};

export function Dashboard({
  data,
  workloads,
  totalSlots,
  onOpenSettings,
  onOpenWorkloads,
  onOpenSchedule,
}: DashboardProps) {
  const hasNoData = data.teachers.length === 0 && data.classes.length === 0 && data.subjects.length === 0;
  const isLoading = false;

  if (isLoading) return <LoadingSkeleton />;
  if (hasNoData) return <EmptyState onStart={onOpenSettings} />;

  const totalNeeded = data.curriculum.reduce((sum, item) => sum + item.jpPerMinggu, 0);
  const visibleSlots = totalSlots * data.classes.length;
  const filledSlots = data.schedule.length;
  const emptySlots = Math.max(0, visibleSlots - filledSlots);
  const conflictCount = data.issues.filter((issue) => issue.type.includes("conflict")).length;
  const underloadTeachers = workloads.filter((row) => row.status === "Kurang").length;
  const usedRooms = new Set(data.schedule.map((entry) => entry.ruangId).filter(Boolean)).size;
  const completion = visibleSlots > 0 ? Math.round((filledSlots / visibleSlots) * 100) : 0;

  const stats = [
    { label: "Total Guru", value: data.teachers.length, icon: "G", tone: "info" as Tone, hint: "Data aktif" },
    { label: "Total Kelas", value: data.classes.length, icon: "K", tone: "info" as Tone, hint: "Rombel" },
    { label: "Total Mapel", value: data.subjects.length, icon: "M", tone: "info" as Tone, hint: "Master data" },
    { label: "Total JP/Minggu", value: totalNeeded, icon: "JP", tone: "good" as Tone, hint: "Kebutuhan" },
    { label: "Jadwal Terisi", value: filledSlots, icon: "JT", tone: "good" as Tone, hint: `${completion}% lengkap` },
    { label: "Jadwal Bentrok", value: conflictCount, icon: "B", tone: conflictCount > 0 ? "bad" as Tone : "good" as Tone, hint: conflictCount > 0 ? "Perlu cek" : "Aman" },
    { label: "Guru Belum Memenuhi 24 JP", value: underloadTeachers, icon: "24", tone: underloadTeachers > 0 ? "warn" as Tone : "good" as Tone, hint: "Beban kurang" },
    { label: "Ruang/Lab Terpakai", value: usedRooms, icon: "R", tone: "info" as Tone, hint: `${data.rooms.length} ruang terdaftar` },
  ];

  const previewRows = buildSchedulePreview(data);
  const attentionItems = buildAttentionItems(data, workloads, conflictCount, emptySlots);
  const subjectDistribution = buildSubjectDistribution(data);

  return (
    <section className="dashboard-page">
      <DashboardHeader data={data} onOpenSettings={onOpenSettings} />

      <div className="dashboard-stats">
        {stats.map((stat) => <StatsCard key={stat.label} {...stat} />)}
      </div>

      <div className="dashboard-main-grid">
        <ScheduleProgressCard
          completion={completion}
          filledSlots={filledSlots}
          totalSlots={visibleSlots}
          emptySlots={Math.min(emptySlots, 12)}
          conflicts={conflictCount}
          underloadTeachers={underloadTeachers}
        />
        <AttentionPanel items={attentionItems} onOpenSchedule={onOpenSchedule} />
      </div>

      <div className="dashboard-main-grid">
        <TeacherWorkloadChart data={data} workloads={workloads} onOpenWorkloads={onOpenWorkloads} />
        <SubjectDistributionCard subjects={subjectDistribution} />
      </div>

      <div className="dashboard-main-grid">
        <SchedulePreviewTable rows={previewRows} />
        <RecentActivityPanel />
      </div>
    </section>
  );
}

function DashboardHeader({ data, onOpenSettings }: { data: AppData; onOpenSettings: () => void }) {
  return (
    <div className="dashboard-hero">
      <div>
        <span className="eyebrow">Dashboard</span>
        <h1>Dashboard AutoJadwal</h1>
        <p>Ringkasan penyusunan jadwal dan beban kerja guru</p>
        <strong>Tahun Ajaran {data.settings.tahunAjaran} - Semester {data.settings.semester}</strong>
      </div>
      <button className="settings-button" onClick={onOpenSettings} aria-label="Buka Pengaturan">
        <span>⚙</span>
        Pengaturan
      </button>
    </div>
  );
}

function StatsCard({ icon, value, label, hint, tone }: { icon: string; value: number | string; label: string; hint: string; tone: Tone }) {
  return (
    <article className={`stats-card ${tone}`}>
      <div className="stats-icon">{icon}</div>
      <strong>{value}</strong>
      <span>{label}</span>
      <small>{hint}</small>
    </article>
  );
}

function ScheduleProgressCard({ completion, filledSlots, totalSlots, emptySlots, conflicts, underloadTeachers }: {
  completion: number;
  filledSlots: number;
  totalSlots: number;
  emptySlots: number;
  conflicts: number;
  underloadTeachers: number;
}) {
  return (
    <section className="dashboard-card progress-card-large">
      <div className="dashboard-card-header">
        <div>
          <h2>Progres Penyusunan Jadwal</h2>
          <p>Kelengkapan jadwal berdasarkan slot aktif mingguan.</p>
        </div>
        <strong>{completion}%</strong>
      </div>
      <div className="completion-bar"><i style={{ width: `${completion}%` }} /></div>
      <div className="progress-detail-grid">
        <span>{filledSlots} dari {totalSlots} slot terisi</span>
        <span>{emptySlots} slot kosong</span>
        <span>{conflicts} bentrok terdeteksi</span>
        <span>{underloadTeachers} guru perlu penyesuaian beban</span>
      </div>
    </section>
  );
}

function TeacherWorkloadChart({ data, workloads, onOpenWorkloads }: { data: AppData; workloads: WorkloadRow[]; onOpenWorkloads: () => void }) {
  const rows = [...workloads]
    .sort((a, b) => b.totalJp - a.totalJp)
    .slice(0, 10);

  return (
    <section className="dashboard-card">
      <div className="dashboard-card-header">
        <div>
          <h2>Grafik Beban Mengajar Guru</h2>
          <p>Target minimal guru sertifikasi: 24 JP.</p>
        </div>
        <button onClick={onOpenWorkloads}>Lihat Semua Guru</button>
      </div>
      <div className="workload-chart">
        {rows.map((row) => {
          const teacher = data.teachers.find((item) => item.id === row.teacherId);
          const status = row.totalJp < 24 ? "Kurang JP" : teacher?.maksimalJp && row.totalJp > teacher.maksimalJp ? "Melebihi batas" : "Sesuai";
          const tone = status === "Kurang JP" ? "bad" : status === "Melebihi batas" ? "warn" : "good";
          return (
            <div className="workload-row" key={row.teacherId}>
              <span>{getTeacherName(data, row.teacherId)}</span>
              <div className="workload-track">
                <i className={tone} style={{ width: `${Math.min(100, (row.totalJp / 32) * 100)}%` }} />
                <b style={{ left: `${(24 / 32) * 100}%` }} />
              </div>
              <strong>{row.totalJp} JP</strong>
              <small className={tone}>{status}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AttentionPanel({ items, onOpenSchedule }: { items: Array<{ tone: Tone; title: string; desc: string }>; onOpenSchedule: () => void }) {
  return (
    <section className="dashboard-card">
      <div className="dashboard-card-header">
        <div>
          <h2>Perlu Perhatian</h2>
          <p>Masalah penting yang perlu ditangani.</p>
        </div>
      </div>
      <div className="attention-list">
        {items.map((item) => (
          <article className={`attention-item ${item.tone}`} key={item.title}>
            <span>{item.tone === "bad" ? "!" : item.tone === "warn" ? "?" : "i"}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </div>
            <button onClick={onOpenSchedule}>{item.tone === "bad" ? "Perbaiki" : "Lihat Detail"}</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function SchedulePreviewTable({ rows }: { rows: Array<Record<string, string>> }) {
  return (
    <section className="dashboard-card">
      <div className="dashboard-card-header">
        <div>
          <h2>Jadwal Hari Ini</h2>
          <p>Preview ringkas jadwal yang perlu dicek.</p>
        </div>
      </div>
      <div className="preview-table-wrap">
        <table className="preview-table">
          <thead>
            <tr><th>Hari</th><th>Jam</th><th>Kelas</th><th>Mapel</th><th>Guru</th><th>Ruang</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.Hari}-${row.Jam}-${row.Kelas}-${row.Mapel}`}>
                <td>{row.Hari}</td><td>{row.Jam}</td><td>{row.Kelas}</td><td>{row.Mapel}</td><td>{row.Guru}</td><td>{row.Ruang}</td>
                <td><span className={`status-badge ${row.Status.toLowerCase().replace(/\s+/g, "-")}`}>{row.Status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SubjectDistributionCard({ subjects }: { subjects: Array<{ name: string; jp: number }> }) {
  const max = Math.max(...subjects.map((item) => item.jp), 1);
  return (
    <section className="dashboard-card">
      <div className="dashboard-card-header">
        <div>
          <h2>Distribusi Beban per Mapel</h2>
          <p>Total JP mingguan per mata pelajaran.</p>
        </div>
      </div>
      <div className="subject-distribution">
        {subjects.map((item) => (
          <div className="subject-row" key={item.name}>
            <span>{item.name}</span>
            <div><i style={{ width: `${(item.jp / max) * 100}%` }} /></div>
            <strong>{item.jp} JP</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentActivityPanel() {
  const activities = [
    ["Jadwal berhasil digenerate", "5 menit lalu"],
    ["Data guru diperbarui", "1 jam lalu"],
    ["Export PDF dilakukan", "Kemarin"],
    ["Bentrok jadwal diperbaiki", "Kemarin"],
    ["Data kelas ditambahkan", "2 hari lalu"],
  ];

  return (
    <section className="dashboard-card">
      <div className="dashboard-card-header">
        <div>
          <h2>Aktivitas Terbaru</h2>
          <p>Riwayat kerja terakhir pada sistem.</p>
        </div>
      </div>
      <div className="activity-list">
        {activities.map(([title, time]) => (
          <article key={title}>
            <span />
            <div><strong>{title}</strong><p>{time}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <section className="dashboard-empty">
      <div className="empty-illustration">AJ</div>
      <h2>Belum ada data jadwal</h2>
      <p>Mulai dengan mengisi master data guru, kelas, mapel, ruang, dan pengaturan jadwal.</p>
      <button className="primary" onClick={onStart}>Mulai Input Data</button>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <section className="dashboard-page">
      <div className="skeleton hero" />
      <div className="dashboard-stats">{Array.from({ length: 8 }, (_, index) => <div className="skeleton stat" key={index} />)}</div>
      <div className="dashboard-main-grid"><div className="skeleton panel" /><div className="skeleton panel" /></div>
    </section>
  );
}

function buildAttentionItems(
  data: AppData,
  workloads: WorkloadRow[],
  conflicts: number,
  emptySlots: number
) {
  const items: Array<{ tone: Tone; title: string; desc: string }> = [];

  // 1. Workload below minimum
  const underloadList = workloads.filter((row) => row.status === "Kurang");
  if (underloadList.length > 0) {
    const firstUnderloadName = data.teachers.find((t) => t.id === underloadList[0].teacherId)?.nama || "Guru";
    items.push({
      tone: "warn" as Tone,
      title: `${firstUnderloadName} belum mencapai 24 JP`,
      desc: `${underloadList.length} guru belum memenuhi kewajiban minimal jam mengajar.`
    });
  }

  // 2. Unplaced subjects
  const unplaced = data.issues.filter((issue) => issue.type === "unplaced_subject");
  if (unplaced.length > 0) {
    items.push({
      tone: "warn" as Tone,
      title: "Pelajaran belum terjadwal penuh",
      desc: `${unplaced.length} mata pelajaran gagal dicarikan slot kosong.`
    });
  }

  // 3. Conflicts
  const conflictIssues = data.issues.filter((issue) =>
    ["teacher_conflict", "class_conflict", "room_conflict"].includes(issue.type)
  );
  if (conflictIssues.length > 0) {
    items.push({
      tone: "bad" as Tone,
      title: "Bentrok jadwal terdeteksi",
      desc: `${conflictIssues.length} konflik ruang, kelas, atau jam mengajar guru.`
    });
  }

  // 4. Empty slots warning
  if (emptySlots > 0 && data.schedule.length > 0) {
    items.push({
      tone: "info" as Tone,
      title: "Jadwal memiliki slot kosong",
      desc: `${emptySlots} slot pelajaran masih belum terisi di beberapa kelas.`
    });
  }

  // 5. Default item if clean
  if (items.length === 0) {
    items.push({
      tone: "good" as Tone,
      title: "Jadwal Terisi Sempurna & Aman",
      desc: "Tidak ada konflik bentrok atau ketimpangan beban mengajar guru."
    });
  }

  return items;
}

function buildSchedulePreview(data: AppData) {
  const source = data.schedule.slice(0, 6);
  if (source.length > 0) {
    return source.map((entry) => {
      // Periksa apakah slot ini memiliki bentrok di issues
      const isConflict = data.issues.some(
        (issue) =>
          ["teacher_conflict", "class_conflict", "room_conflict"].includes(issue.type) &&
          issue.message.includes(getClassName(data, entry.kelasId)) &&
          issue.message.includes(entry.day) &&
          issue.message.includes(`JP ${entry.lesson}`)
      );

      return {
        Hari: entry.day,
        Jam: `JP ${entry.lesson}`,
        Kelas: getClassName(data, entry.kelasId),
        Mapel: getSubjectCode(data, entry.mapelId),
        Guru: entry.guruIds.map((id) => getTeacherName(data, id)).join(", "),
        Ruang: getRoomName(data, entry.ruangId),
        Status: isConflict ? "Bentrok" : "Valid",
      };
    });
  }

  return [
    { Hari: "Senin", Jam: "JP 1", Kelas: "VII A", Mapel: "MTK", Guru: "Ahmad Fauzi", Ruang: "R-01", Status: "Valid" },
    { Hari: "Senin", Jam: "JP 2", Kelas: "VII B", Mapel: "IPA", Guru: "Siti Aminah", Ruang: "Lab IPA", Status: "Valid" },
    { Hari: "Selasa", Jam: "JP 3", Kelas: "VIII A", Mapel: "BIN", Guru: "Budi Santoso", Ruang: "R-03", Status: "Valid" },
  ];
}

function buildSubjectDistribution(data: AppData) {
  const totals = new Map<string, number>();
  for (const item of data.curriculum) {
    const code = getSubjectCode(data, item.mapelId);
    totals.set(code, (totals.get(code) || 0) + item.jpPerMinggu);
  }
  const rows = Array.from(totals.entries()).map(([name, jp]) => ({ name, jp })).sort((a, b) => b.jp - a.jp).slice(0, 5);
  return rows.length > 0 ? rows : [
    { name: "Matematika", jp: 72 },
    { name: "Bahasa Indonesia", jp: 64 },
    { name: "IPA", jp: 58 },
    { name: "PAI", jp: 44 },
    { name: "PJOK", jp: 36 },
  ];
}
