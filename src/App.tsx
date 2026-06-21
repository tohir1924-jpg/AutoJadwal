import { Fragment, useMemo, useState } from "react";
import type React from "react";
import { Dashboard } from "./components/Dashboard";
import { dayNames, initialData } from "./data/seed";
import { getSubjectPreset, presetLabel } from "./data/subject-presets";
import type { EducationAuthority, EducationLevel, SubjectPresetOption } from "./data/subject-presets";
import { exportClassWeeklyScheduleExcel, exportPdf, exportScheduleExcel, exportWorkloadExcel } from "./lib/export";
import { downloadTeacherTemplate, parseTeacherImport } from "./lib/teacher-import";
import type { TeacherImportResult } from "./lib/teacher-import";
import {
  buildLessonLabel,
  buildSlots,
  calculateWorkloads,
  generateSchedule,
  getClassName,
  getRoomName,
  getSubjectCode,
  getTeacherName,
  maxLessonForActiveDays,
  teacherAvailabilityText,
  validateFullSchedule,
} from "./lib/scheduler";
import type { AppData, BreakSlot, ClassGroup, CurriculumAllocation, DayName, Room, ScheduleEntry, SpecialActivity, Subject, Teacher } from "./types";

type PageKey = "dashboard" | "master" | "settings" | "generate" | "schedule" | "workloads" | "export";
type MasterTab = "guru" | "mapel" | "kelas" | "ruang" | "kurikulum";

const menu: { key: PageKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "master", label: "Master Data" },
  { key: "settings", label: "Pengaturan Jadwal" },
  { key: "generate", label: "Generate Jadwal" },
  { key: "schedule", label: "Jadwal Pelajaran" },
  { key: "workloads", label: "Beban Kerja Guru" },
  { key: "export", label: "Export" },
];

const emptyTeacher: Teacher = {
  id: "",
  nama: "",
  kodeGuru: "",
  mapelUtamaId: "mapel-mtk",
  mapelTambahanIds: [],
  minimalJp: 0,
  maksimalJp: 24,
  sertifikasi: false,
  aktif: true,
  unavailableSlots: [],
};

const emptySubject: Subject = { id: "", namaMapel: "", kodeMapel: "", kelompok: "Umum", aktif: true };
const emptyClass: ClassGroup = { id: "", tingkat: "VII", namaKelas: "", waliKelasId: "", ruangDefaultId: "", aktif: true };
const emptyRoom: Room = { id: "", namaRuang: "", tipeRuang: "Kelas", kapasitas: 32, aktif: true };

function App() {
  const [activePage, setActivePage] = useState<PageKey>("dashboard");
  const [masterTab, setMasterTab] = useState<MasterTab>("guru");
  const [data, setData] = useState<AppData>(initialData);
  const [isGenerating, setIsGenerating] = useState(false);

  const workloads = useMemo(() => calculateWorkloads(data, data.schedule), [data]);
  const totalSlots = useMemo(() => buildSlots(data.settings).length, [data.settings]);
  const pageTitle = menu.find((item) => item.key === activePage)?.label || "Dashboard";

  function runGenerate() {
    if (isGenerating) return;
    setIsGenerating(true);
    setActivePage("generate");
    window.setTimeout(() => {
      const result = generateSchedule(data);
      setData((current) => ({ ...current, schedule: result.schedule, issues: result.issues }));
      setIsGenerating(false);
      setActivePage("schedule");
    }, 1200);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">AJ</div>
          <div>
            <strong>AutoJadwal</strong>
            <span>Waka Kurikulum</span>
          </div>
        </div>
        <nav className="main-nav">
          {menu.map((item) => (
            <button key={item.key} className={activePage === item.key ? "active" : ""} onClick={() => setActivePage(item.key)}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Tahun Ajaran {data.settings.tahunAjaran}</span>
            <h1>{pageTitle}</h1>
          </div>
          <div className="topbar-actions">
            <span className="pill">{data.settings.modeHari === "6_hari" ? "6 Hari" : "5 Hari"}</span>
            <button className="primary" disabled={isGenerating} onClick={runGenerate}>{isGenerating ? "Memproses..." : "Generate"}</button>
          </div>
        </header>

        {activePage === "dashboard" && <Dashboard data={data} workloads={workloads} totalSlots={totalSlots} onOpenSettings={() => setActivePage("settings")} onOpenWorkloads={() => setActivePage("workloads")} onOpenSchedule={() => setActivePage("schedule")} />}
        {activePage === "master" && (
          <MasterData data={data} setData={setData} masterTab={masterTab} setMasterTab={setMasterTab} />
        )}
        {activePage === "settings" && <SettingsPage data={data} setData={setData} />}
        {activePage === "generate" && <GeneratePage data={data} totalSlots={totalSlots} onGenerate={runGenerate} isGenerating={isGenerating} />}
        {activePage === "schedule" && <SchedulePage data={data} setData={setData} />}
        {activePage === "workloads" && <WorkloadPage data={data} workloads={workloads} />}
        {activePage === "export" && <ExportPage data={data} workloads={workloads} />}
      </main>
    </div>
  );
}

function MasterData({ data, setData, masterTab, setMasterTab }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>>; masterTab: MasterTab; setMasterTab: (tab: MasterTab) => void }) {
  return (
    <section className="panel">
      <div className="tabbar">
        {(["guru", "mapel", "kelas", "ruang", "kurikulum"] as MasterTab[]).map((tab) => (
          <button key={tab} className={masterTab === tab ? "active" : ""} onClick={() => setMasterTab(tab)}>
            {tab === "mapel" ? "Mapel" : tab === "kurikulum" ? "Struktur Kurikulum" : title(tab)}
          </button>
        ))}
      </div>
      {masterTab === "guru" && <TeacherMaster data={data} setData={setData} />}
      {masterTab === "mapel" && <SubjectMaster data={data} setData={setData} />}
      {masterTab === "kelas" && <ClassMaster data={data} setData={setData} />}
      {masterTab === "ruang" && <RoomMaster data={data} setData={setData} />}
      {masterTab === "kurikulum" && <CurriculumMaster data={data} setData={setData} />}
    </section>
  );
}

function TeacherMaster({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const [draft, setDraft] = useState<Teacher>(emptyTeacher);
  const [query, setQuery] = useState("");
  const [importResult, setImportResult] = useState<TeacherImportResult | null>(null);
  const [importMessage, setImportMessage] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const rows = data.teachers.filter((teacher) => teacher.nama.toLowerCase().includes(query.toLowerCase()) || teacher.kodeGuru.toLowerCase().includes(query.toLowerCase()));

  function save() {
    if (!draft.nama || !draft.kodeGuru) return;
    const teacher = { ...draft, id: draft.id || crypto.randomUUID() };
    setData((current) => ({ ...current, teachers: upsert(current.teachers, teacher) }));
    setDraft(emptyTeacher);
  }

  async function handleImportFile(file?: File) {
    if (!file) return;
    setIsImporting(true);
    setImportMessage("");
    try {
      const result = await parseTeacherImport(file, data.subjects);
      setImportResult(result);
      setImportMessage(result.errors.length > 0 ? "Periksa error sebelum menerapkan data." : "File valid dan siap diterapkan.");
    } catch {
      setImportResult(null);
      setImportMessage("File tidak dapat dibaca. Gunakan template Excel dari AutoJadwal.");
    } finally {
      setIsImporting(false);
    }
  }

  function applyImport() {
    if (!importResult || importResult.validTeachers.length === 0 || importResult.errors.length > 0) return;
    setData((current) => {
      const teachers = [...current.teachers];
      for (const imported of importResult.validTeachers) {
        const existingIndex = teachers.findIndex((teacher) => teacher.kodeGuru.toUpperCase() === imported.kodeGuru.toUpperCase());
        if (existingIndex >= 0) {
          teachers[existingIndex] = { ...imported, id: teachers[existingIndex].id };
        } else {
          teachers.push(imported);
        }
      }
      return { ...current, teachers };
    });
    setImportMessage(`${importResult.validTeachers.length} data guru berhasil diterapkan.`);
    setImportResult(null);
  }

  return (
    <>
      <Toolbar title="Master Data Guru" query={query} setQuery={setQuery} />
      <section className="import-panel">
        <div>
          <h2>Import Guru Massal</h2>
          <p>Gunakan template Excel agar kolom dan kode mapel sesuai master data.</p>
        </div>
        <div className="import-actions">
          <button type="button" onClick={() => void downloadTeacherTemplate(data.subjects)}>Download Template</button>
          <label className="file-button">
            {isImporting ? "Membaca file..." : "Upload Template"}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(event) => {
                void handleImportFile(event.target.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </label>
        </div>
        {importMessage && <p className="import-message">{importMessage}</p>}
        {importResult && (
          <div className="import-summary">
            <div><strong>{importResult.totalRows}</strong><span>Baris dibaca</span></div>
            <div><strong>{importResult.validTeachers.length}</strong><span>Guru valid</span></div>
            <div><strong>{importResult.errors.length}</strong><span>Error</span></div>
            <button className="primary" disabled={importResult.errors.length > 0 || importResult.validTeachers.length === 0} onClick={applyImport}>
              Terapkan Import
            </button>
          </div>
        )}
        {importResult && importResult.errors.length > 0 && (
          <ul className="issue-list import-errors">
            {importResult.errors.slice(0, 8).map((error) => (
              <li key={`${error.row}-${error.message}`}>Baris {error.row}: {error.message}</li>
            ))}
            {importResult.errors.length > 8 && <li>{importResult.errors.length - 8} error lain tidak ditampilkan.</li>}
          </ul>
        )}
      </section>
      <div className="form-grid">
        <input placeholder="Nama guru" value={draft.nama} onChange={(event) => setDraft({ ...draft, nama: event.target.value })} />
        <input placeholder="Kode" value={draft.kodeGuru} onChange={(event) => setDraft({ ...draft, kodeGuru: event.target.value })} />
        <select value={draft.mapelUtamaId} onChange={(event) => setDraft({ ...draft, mapelUtamaId: event.target.value })}>
          {data.subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.kodeMapel}</option>)}
        </select>
        <input type="number" placeholder="Minimal JP" value={draft.minimalJp} onChange={(event) => setDraft({ ...draft, minimalJp: Number(event.target.value) })} />
        <input type="number" placeholder="Maksimal JP" value={draft.maksimalJp || 0} onChange={(event) => setDraft({ ...draft, maksimalJp: Number(event.target.value) })} />
        <label className="check"><input type="checkbox" checked={draft.sertifikasi} onChange={(event) => setDraft({ ...draft, sertifikasi: event.target.checked })} /> Sertifikasi</label>
        <button className="primary" onClick={save}>{draft.id ? "Simpan Edit" : "Tambah Guru"}</button>
      </div>
      <Table headers={["Nama Guru", "Kode", "Mapel", "Minimal JP", "Status", "Ketersediaan", "Aksi"]}>
        {rows.map((teacher) => (
          <tr key={teacher.id}>
            <td>{teacher.nama}</td><td>{teacher.kodeGuru}</td><td>{getSubjectCode(data, teacher.mapelUtamaId)}</td><td>{teacher.minimalJp}</td>
            <td><Badge tone={teacher.aktif ? "good" : "muted"}>{teacher.aktif ? "Aktif" : "Nonaktif"}</Badge></td>
            <td>{teacherAvailabilityText(teacher)}</td>
            <td><button onClick={() => setDraft(teacher)}>Edit</button></td>
          </tr>
        ))}
      </Table>
    </>
  );
}

function SubjectMaster({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const [draft, setDraft] = useState<Subject>(emptySubject);
  const [preset, setPreset] = useState<SubjectPresetOption>({ authority: "dinas", level: "smp" });
  const [message, setMessage] = useState("");

  function save() {
    if (!draft.namaMapel || !draft.kodeMapel) return;
    setData((current) => ({ ...current, subjects: upsert(current.subjects, { ...draft, kodeMapel: draft.kodeMapel.toUpperCase(), id: draft.id || crypto.randomUUID() }) }));
    setDraft(emptySubject);
    setMessage("Mapel berhasil disimpan.");
  }

  function applyPreset() {
    const presetSubjects = getSubjectPreset(preset);
    setData((current) => {
      const existingCodes = new Set(current.subjects.map((subject) => subject.kodeMapel.toUpperCase()));
      const newSubjects = presetSubjects
        .filter((subject) => !existingCodes.has(subject.kodeMapel.toUpperCase()))
        .map((subject) => ({ ...subject, id: current.subjects.some((item) => item.id === subject.id) ? crypto.randomUUID() : subject.id }));
      setMessage(`${newSubjects.length} mapel dari preset ${presetLabel(preset)} ditambahkan. Mapel custom tetap dipertahankan.`);
      return { ...current, subjects: [...current.subjects, ...newSubjects] };
    });
  }

  function removeSubject(subjectId: string) {
    setData((current) => {
      const fallbackSubjectId = current.subjects.find((subject) => subject.id !== subjectId)?.id || "";
      return {
        ...current,
        subjects: current.subjects.filter((subject) => subject.id !== subjectId),
        curriculum: current.curriculum.filter((item) => item.mapelId !== subjectId),
        teachers: current.teachers.map((teacher) => ({
          ...teacher,
          mapelUtamaId: teacher.mapelUtamaId === subjectId ? fallbackSubjectId : teacher.mapelUtamaId,
          mapelTambahanIds: teacher.mapelTambahanIds.filter((id) => id !== subjectId),
        })),
        schedule: current.schedule.filter((entry) => entry.mapelId !== subjectId),
      };
    });
    setMessage("Mapel dihapus. Alokasi kurikulum dan jadwal yang memakai mapel tersebut ikut dibersihkan.");
  }

  return (
    <>
      <SimpleHeader title="Master Data Mata Pelajaran" />
      <section className="preset-panel">
        <div>
          <h2>Preset Mapel</h2>
          <p>Pilih acuan Dinas Pendidikan atau Kemenag, lalu sesuaikan berdasarkan jenjang. Mapel tetap bisa ditambah atau dihapus manual.</p>
        </div>
        <div className="preset-controls">
          <select value={preset.authority} onChange={(event) => setPreset({ ...preset, authority: event.target.value as EducationAuthority })}>
            <option value="dinas">Dinas Pendidikan</option>
            <option value="kemenag">Kemenag</option>
          </select>
          <select value={preset.level} onChange={(event) => setPreset({ ...preset, level: event.target.value as EducationLevel })}>
            <option value="sd">SD/MI</option>
            <option value="smp">SMP/MTs</option>
            <option value="sma">SMA/MA</option>
            <option value="smk">SMK/MAK</option>
          </select>
          <button className="primary" onClick={applyPreset}>Terapkan Preset</button>
        </div>
        {message && <p className="import-message">{message}</p>}
      </section>
      <div className="form-grid">
        <input placeholder="Nama mapel" value={draft.namaMapel} onChange={(event) => setDraft({ ...draft, namaMapel: event.target.value })} />
        <input placeholder="Kode mapel" value={draft.kodeMapel} onChange={(event) => setDraft({ ...draft, kodeMapel: event.target.value })} />
        <input placeholder="Kelompok" value={draft.kelompok} onChange={(event) => setDraft({ ...draft, kelompok: event.target.value })} />
        <button className="primary" onClick={save}>{draft.id ? "Simpan Edit" : "Tambah Mapel"}</button>
      </div>
      <Table headers={["Nama Mapel", "Kode", "Kelompok", "Status", "Aksi"]}>
        {data.subjects.map((subject) => (
          <tr key={subject.id}>
            <td>{subject.namaMapel}</td><td>{subject.kodeMapel}</td><td>{subject.kelompok}</td><td>Aktif</td>
            <td><div className="row-actions"><button onClick={() => setDraft(subject)}>Edit</button><button className="danger" onClick={() => removeSubject(subject.id)}>Hapus</button></div></td>
          </tr>
        ))}
      </Table>
    </>
  );
}

function ClassMaster({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const [draft, setDraft] = useState<ClassGroup>(emptyClass);
  function save() {
    if (!draft.namaKelas) return;
    setData((current) => ({ ...current, classes: upsert(current.classes, { ...draft, id: draft.id || crypto.randomUUID() }) }));
    setDraft(emptyClass);
  }
  return (
    <>
      <SimpleHeader title="Master Data Kelas/Rombel" />
      <div className="form-grid">
        <input placeholder="Tingkat" value={draft.tingkat} onChange={(event) => setDraft({ ...draft, tingkat: event.target.value })} />
        <input placeholder="Nama kelas" value={draft.namaKelas} onChange={(event) => setDraft({ ...draft, namaKelas: event.target.value })} />
        <select value={draft.waliKelasId} onChange={(event) => setDraft({ ...draft, waliKelasId: event.target.value })}><option value="">Wali kelas</option>{data.teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.nama}</option>)}</select>
        <select value={draft.ruangDefaultId} onChange={(event) => setDraft({ ...draft, ruangDefaultId: event.target.value })}><option value="">Ruang default</option>{data.rooms.map((room) => <option key={room.id} value={room.id}>{room.namaRuang}</option>)}</select>
        <button className="primary" onClick={save}>{draft.id ? "Simpan Edit" : "Tambah Kelas"}</button>
      </div>
      <Table headers={["Tingkat", "Nama Kelas", "Wali Kelas", "Ruang", "Status", "Aksi"]}>
        {data.classes.map((kelas) => (
          <tr key={kelas.id}><td>{kelas.tingkat}</td><td>{kelas.namaKelas}</td><td>{getTeacherName(data, kelas.waliKelasId || "")}</td><td>{getRoomName(data, kelas.ruangDefaultId || "")}</td><td>Aktif</td><td><button onClick={() => setDraft(kelas)}>Edit</button></td></tr>
        ))}
      </Table>
    </>
  );
}

function RoomMaster({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const [draft, setDraft] = useState<Room>(emptyRoom);
  function save() {
    if (!draft.namaRuang) return;
    setData((current) => ({ ...current, rooms: upsert(current.rooms, { ...draft, id: draft.id || crypto.randomUUID() }) }));
    setDraft(emptyRoom);
  }
  return (
    <>
      <SimpleHeader title="Master Data Ruang" />
      <div className="form-grid">
        <input placeholder="Nama ruang" value={draft.namaRuang} onChange={(event) => setDraft({ ...draft, namaRuang: event.target.value })} />
        <select value={draft.tipeRuang} onChange={(event) => setDraft({ ...draft, tipeRuang: event.target.value as Room["tipeRuang"] })}><option>Kelas</option><option>Lab</option><option>Perpustakaan</option><option>Lapangan</option></select>
        <input type="number" placeholder="Kapasitas" value={draft.kapasitas} onChange={(event) => setDraft({ ...draft, kapasitas: Number(event.target.value) })} />
        <button className="primary" onClick={save}>{draft.id ? "Simpan Edit" : "Tambah Ruang"}</button>
      </div>
      <Table headers={["Nama Ruang", "Tipe", "Kapasitas", "Status", "Aksi"]}>
        {data.rooms.map((room) => (
          <tr key={room.id}><td>{room.namaRuang}</td><td>{room.tipeRuang}</td><td>{room.kapasitas}</td><td>Aktif</td><td><button onClick={() => setDraft(room)}>Edit</button></td></tr>
        ))}
      </Table>
    </>
  );
}

function CurriculumMaster({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const emptyAllocation: CurriculumAllocation = {
    id: "",
    tahunAjaranId: "ta-2026",
    semester: data.settings.semester,
    kelasId: data.classes[0]?.id || "",
    mapelId: data.subjects[0]?.id || "",
    jpPerMinggu: 2,
    guruUtamaId: data.teachers[0]?.id || "",
    teamTeaching: false,
    guruTambahanIds: [],
    ruangKhususId: "",
  };
  const [draft, setDraft] = useState<CurriculumAllocation>(emptyAllocation);
  function save() {
    const kelasId = draft.kelasId || data.classes[0]?.id || "";
    const mapelId = draft.mapelId || data.subjects[0]?.id || "";
    const guruUtamaId = draft.guruUtamaId || data.teachers[0]?.id || "";

    if (!kelasId || !mapelId || !guruUtamaId) return;

    setData((current) => ({
      ...current,
      curriculum: upsert(current.curriculum, {
        ...draft,
        kelasId,
        mapelId,
        guruUtamaId,
        id: draft.id || crypto.randomUUID()
      })
    }));

    setDraft({
      ...emptyAllocation,
      kelasId: data.classes[0]?.id || "",
      mapelId: data.subjects[0]?.id || "",
      guruUtamaId: data.teachers[0]?.id || "",
    });
  }
  return (
    <>
      <SimpleHeader title="Struktur Kurikulum / Alokasi JP" />
      <div className="form-grid">
        <select value={draft.kelasId || data.classes[0]?.id || ""} onChange={(event) => setDraft({ ...draft, kelasId: event.target.value })}>{data.classes.map((kelas) => <option key={kelas.id} value={kelas.id}>{kelas.namaKelas}</option>)}</select>
        <select value={draft.mapelId || data.subjects[0]?.id || ""} onChange={(event) => setDraft({ ...draft, mapelId: event.target.value })}>{data.subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.kodeMapel}</option>)}</select>
        <input type="number" min="1" placeholder="JP per minggu" value={draft.jpPerMinggu} onChange={(event) => setDraft({ ...draft, jpPerMinggu: Number(event.target.value) })} />
        <select value={draft.guruUtamaId || data.teachers[0]?.id || ""} onChange={(event) => setDraft({ ...draft, guruUtamaId: event.target.value })}>{data.teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.nama}</option>)}</select>
        <select value={draft.ruangKhususId} onChange={(event) => setDraft({ ...draft, ruangKhususId: event.target.value })}><option value="">Ruang default</option>{data.rooms.map((room) => <option key={room.id} value={room.id}>{room.namaRuang}</option>)}</select>
        <label className="check"><input type="checkbox" checked={draft.teamTeaching} onChange={(event) => setDraft({ ...draft, teamTeaching: event.target.checked })} /> Team teaching</label>
        <button className="primary" onClick={save}>{draft.id ? "Simpan Edit" : "Tambah Alokasi"}</button>
      </div>
      <Table headers={["Kelas", "Mapel", "JP/Minggu", "Guru Utama", "Team Teaching", "Ruang", "Aksi"]}>
        {data.curriculum.map((item) => (
          <tr key={item.id}><td>{getClassName(data, item.kelasId)}</td><td>{getSubjectCode(data, item.mapelId)}</td><td>{item.jpPerMinggu}</td><td>{getTeacherName(data, item.guruUtamaId)}</td><td>{item.teamTeaching ? "Ya" : "Tidak"}</td><td>{item.ruangKhususId ? getRoomName(data, item.ruangKhususId) : "Default"}</td><td><button onClick={() => setDraft(item)}>Edit</button></td></tr>
        ))}
      </Table>
    </>
  );
}

function SettingsPage({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const settings = data.settings;
  function updateSettings(next: Partial<AppData["settings"]>) {
    setData((current) => ({ ...current, settings: { ...current.settings, ...next } }));
  }
  function buildBreakSlots(activeDays: DayName[], firstBreakAfter: number, secondBreakAfter: number): BreakSlot[] {
    const breaks = [
      { after: firstBreakAfter, label: "Istirahat 1" },
      { after: secondBreakAfter, label: "Istirahat 2" },
    ].filter((item) => item.after > 0);

    return activeDays.flatMap((day) =>
      breaks.map((item) => ({ day, lesson: item.after + 1, label: item.label })),
    );
  }
  function updateDaily(day: DayName, value: number) {
    updateSettings({ jumlahJpPerHari: { ...settings.jumlahJpPerHari, [day]: value } });
  }
  function updateBreakAfter(value: number) {
    const breakAfterLesson = Math.max(0, value);
    updateSettings({
      istirahatSetelahJp: breakAfterLesson,
      istirahat: buildBreakSlots(settings.hariAktif, breakAfterLesson, settings.istirahatKeduaSetelahJp),
    });
  }
  function updateSecondBreakAfter(value: number) {
    const breakAfterLesson = Math.max(0, value);
    updateSettings({
      istirahatKeduaSetelahJp: breakAfterLesson,
      istirahat: buildBreakSlots(settings.hariAktif, settings.istirahatSetelahJp, breakAfterLesson),
    });
  }
  function updateDayBreak1(day: DayName, value: number) {
    setData((current) => {
      const rest = current.settings.istirahat.filter((b) => !(b.day === day && b.label === "Istirahat 1"));
      const updated = value > 0 ? [...rest, { day, lesson: value + 1, label: "Istirahat 1" }] : rest;
      return {
        ...current,
        settings: {
          ...current.settings,
          istirahat: updated.sort((a, b) => a.lesson - b.lesson),
        },
      };
    });
  }
  function updateDayBreak2(day: DayName, value: number) {
    setData((current) => {
      const rest = current.settings.istirahat.filter((b) => !(b.day === day && b.label === "Istirahat 2"));
      const updated = value > 0 ? [...rest, { day, lesson: value + 1, label: "Istirahat 2" }] : rest;
      return {
        ...current,
        settings: {
          ...current.settings,
          istirahat: updated.sort((a, b) => a.lesson - b.lesson),
        },
      };
    });
  }
  function setMode(modeHari: "5_hari" | "6_hari") {
    const hariAktif: DayName[] = modeHari === "5_hari" ? ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] : [...dayNames];
    updateSettings({
      modeHari,
      hariAktif,
      istirahat: buildBreakSlots(hariAktif, settings.istirahatSetelahJp, settings.istirahatKeduaSetelahJp),
    });
  }
  return (
    <section className="panel">
      <SimpleHeader title="Hari, Jam Pelajaran, dan Constraint" />
      <div className="settings-grid">
        <div className="field-block"><label>Mode Hari Sekolah</label><div className="segmented"><button className={settings.modeHari === "5_hari" ? "active" : ""} onClick={() => setMode("5_hari")}>5 Hari</button><button className={settings.modeHari === "6_hari" ? "active" : ""} onClick={() => setMode("6_hari")}>6 Hari</button></div></div>
        <div className="field-block"><label>Jam Mulai</label><input type="time" value={settings.jamMulai} onChange={(event) => updateSettings({ jamMulai: event.target.value })} /></div>
        <div className="field-block"><label>Durasi 1 JP</label><input type="number" value={settings.durasiJp} onChange={(event) => updateSettings({ durasiJp: Number(event.target.value) })} /></div>
        <div className="field-block"><label>Maksimal Mengajar Berturut-turut</label><input type="number" value={settings.maxConsecutiveTeaching} onChange={(event) => updateSettings({ maxConsecutiveTeaching: Number(event.target.value) })} /></div>
        <div className="field-block"><label>Default Istirahat 1 Setelah JP</label><input type="number" min="0" value={settings.istirahatSetelahJp} onChange={(event) => updateBreakAfter(Number(event.target.value))} /></div>
        <div className="field-block"><label>Lama Istirahat 1 (Menit)</label><input type="number" min="0" value={settings.durasiIstirahat} onChange={(event) => updateSettings({ durasiIstirahat: Math.max(0, Number(event.target.value)) })} /></div>
        <div className="field-block"><label>Default Istirahat 2 Setelah JP</label><input type="number" min="0" value={settings.istirahatKeduaSetelahJp} onChange={(event) => updateSecondBreakAfter(Number(event.target.value))} /></div>
        <div className="field-block"><label>Lama Istirahat 2 (Menit)</label><input type="number" min="0" value={settings.durasiIstirahatKedua} onChange={(event) => updateSettings({ durasiIstirahatKedua: Math.max(0, Number(event.target.value)) })} /></div>
      </div>
      <div className="settings-grid days-config">
        <div className="days-config-header">
          <span>Hari</span>
          <span>Jumlah JP</span>
          <span>Istirahat 1 (Setelah JP)</span>
          <span>Istirahat 2 (Setelah JP)</span>
        </div>
        {settings.hariAktif.map((day) => {
          const break1Node = settings.istirahat.find((b) => b.day === day && b.label === "Istirahat 1");
          const dayBreak1 = break1Node ? break1Node.lesson - 1 : 0;

          const break2Node = settings.istirahat.find((b) => b.day === day && b.label === "Istirahat 2");
          const dayBreak2 = break2Node ? break2Node.lesson - 1 : 0;

          return (
            <div className="day-config-row" key={day}>
              <span className="day-label">{day}</span>
              <input type="number" min="1" value={settings.jumlahJpPerHari[day]} onChange={(event) => updateDaily(day, Number(event.target.value))} />
              <input type="number" min="0" value={dayBreak1} onChange={(event) => updateDayBreak1(day, Number(event.target.value))} />
              <input type="number" min="0" value={dayBreak2} onChange={(event) => updateDayBreak2(day, Number(event.target.value))} />
            </div>
          );
        })}
      </div>
      <div className="check-grid">
        <label className="check"><input type="checkbox" checked={settings.enforceMaxConsecutive} onChange={(event) => updateSettings({ enforceMaxConsecutive: event.target.checked })} /> Batasi JP berturut-turut</label>
        <label className="check"><input type="checkbox" checked={settings.allowTeamTeaching} onChange={(event) => updateSettings({ allowTeamTeaching: event.target.checked })} /> Aktifkan team teaching</label>
        <label className="check"><input type="checkbox" checked readOnly /> Cegah guru bentrok</label>
        <label className="check"><input type="checkbox" checked readOnly /> Cegah kelas dan ruang bentrok</label>
      </div>
    </section>
  );
}

function GeneratePage({ data, totalSlots, onGenerate, isGenerating }: { data: AppData; totalSlots: number; onGenerate: () => void; isGenerating: boolean }) {
  const needs = data.curriculum.reduce((sum, item) => sum + item.jpPerMinggu, 0);
  return (
    <section className="panel">
      <SimpleHeader title="Generate Jadwal Otomatis" />
      <div className="status-grid">
        <Status label="Guru lengkap" ok={data.teachers.length > 0} />
        <Status label="Kelas lengkap" ok={data.classes.length > 0} />
        <Status label="Struktur kurikulum lengkap" ok={data.curriculum.length > 0} />
        <Status label={`${totalSlots} slot aktif per kelas`} ok={totalSlots > 0} />
      </div>
      <div className="generate-card">
        <div><h2>Mode Aman</h2><p>Greedy scheduler akan mengecek guru, kelas, ruang, ketersediaan, dan batas mengajar berturut-turut. Istirahat tampil sebagai jeda waktu, bukan pengurang JP.</p></div>
        <button className="primary large" disabled={isGenerating} onClick={onGenerate}>{isGenerating ? "Memproses..." : "Generate Jadwal"}</button>
      </div>
      {isGenerating && (
        <div className="generate-progress">
          <div className="spinner-ring" />
          <div>
            <h2>Menyusun jadwal...</h2>
            <p>Membaca struktur kurikulum, mengecek constraint guru/kelas/ruang, lalu menempatkan slot terbaik.</p>
          </div>
          <div className="progress-track"><i /></div>
        </div>
      )}
      <div className="summary-line"><span>Kebutuhan: {needs} JP</span><span>Terjadwal: {data.schedule.length} JP</span><span>Issue: {data.issues.length}</span></div>
      <IssueList issues={data.issues} />
    </section>
  );
}

function SchedulePage({ data, setData }: { data: AppData; setData: React.Dispatch<React.SetStateAction<AppData>> }) {
  const [classId, setClassId] = useState(data.classes[0]?.id || "");
  const [view, setView] = useState<"kelas" | "guru" | "semua">("kelas");
  const [activityDraft, setActivityDraft] = useState<SpecialActivity>({
    id: "",
    title: "",
    day: data.settings.hariAktif[0] || "Senin",
    afterLesson: 0,
    durationMinutes: 30,
    classId: "",
  });
  const maxLesson = maxLessonForActiveDays(data.settings);
  const schedule = data.schedule;
  const activeClassId = classId || data.classes[0]?.id || "";

  function updateEntry(entry: ScheduleEntry, mapelId: string) {
    setData((current) => {
      const allocation = current.curriculum.find(
        (item) => item.kelasId === entry.kelasId && item.mapelId === mapelId
      );

      const nextTeacherIds = allocation
        ? (current.settings.allowTeamTeaching && allocation.teamTeaching
          ? [allocation.guruUtamaId, ...allocation.guruTambahanIds]
          : [allocation.guruUtamaId])
        : [];

      const nextRuangId = allocation
        ? (allocation.ruangKhususId || current.classes.find((c) => c.id === entry.kelasId)?.ruangDefaultId || current.rooms[0]?.id || "")
        : entry.ruangId;

      const updatedSchedule = current.schedule.map((item) =>
        item.id === entry.id
          ? {
              ...item,
              mapelId,
              guruIds: nextTeacherIds.length > 0 ? nextTeacherIds : item.guruIds,
              ruangId: nextRuangId,
              source: "manual" as const,
            }
          : item
      );

      const newIssues = validateFullSchedule(updatedSchedule, current);
      const nextWorkloads = calculateWorkloads(current, updatedSchedule);
      const workloadIssues = nextWorkloads
        .filter((row) => row.status === "Kurang")
        .map((row) => ({
          type: "workload_below_minimum" as const,
          severity: "medium" as const,
          message: `${getTeacherName(current, row.teacherId)} masih kurang ${row.delta} JP dari minimal ${row.minimalJp} JP.`,
          suggestion: "Tambahkan alokasi mengajar atau sesuaikan target minimal JP.",
        }));

      newIssues.push(...workloadIssues);

      return {
        ...current,
        schedule: updatedSchedule,
        issues: newIssues,
      };
    });
  }

  function saveActivity() {
    if (!activityDraft.title.trim()) return;
    const activity = {
      ...activityDraft,
      id: activityDraft.id || crypto.randomUUID(),
      title: activityDraft.title.trim(),
      classId: activityDraft.classId || undefined,
    };
    setData((current) => ({ ...current, specialActivities: upsert(current.specialActivities, activity) }));
    setActivityDraft({ id: "", title: "", day: data.settings.hariAktif[0] || "Senin", afterLesson: 0, durationMinutes: 30, classId: "" });
  }

  function removeActivity(activityId: string) {
    setData((current) => ({ ...current, specialActivities: current.specialActivities.filter((activity) => activity.id !== activityId) }));
  }

  function activitiesAfter(lesson: number): SpecialActivity[] {
    return data.specialActivities.filter((activity) =>
      activity.afterLesson === lesson &&
      (!activity.classId || activity.classId === activeClassId),
    );
  }

  function breaksAfter(lesson: number): BreakSlot[] {
    return data.settings.istirahat.filter((breakSlot) => breakSlot.lesson === lesson + 1);
  }

  function renderInsertedRows(lesson: number) {
    const breaks = breaksAfter(lesson);
    const activities = activitiesAfter(lesson);
    if (breaks.length === 0 && activities.length === 0) return null;

    return (
      <>
        {breaks.length > 0 && (
          <Fragment key={`break-row-${lesson}`}>
            <div className="time-cell special-time">Jeda</div>
            {data.settings.hariAktif.map((day) => {
              const breakSlot = breaks.find((item) => item.day === day);
              return <div className="slot-card break-card" key={`break-${day}-${lesson}`}>{breakSlot ? breakSlot.label : ""}</div>;
            })}
          </Fragment>
        )}
        {activities.map((activity) => (
          <Fragment key={activity.id}>
            <div className="time-cell special-time">{activity.durationMinutes} menit</div>
            {data.settings.hariAktif.map((day) => (
              <div className="slot-card activity-card" key={`${activity.id}-${day}`}>
                {activity.day === day ? (
                  <>
                    <b>{activity.title}</b>
                    <small>{activity.classId ? getClassName(data, activity.classId) : "Semua kelas"}</small>
                    <button className="danger mini" onClick={() => removeActivity(activity.id)}>Hapus</button>
                  </>
                ) : ""}
              </div>
            ))}
          </Fragment>
        ))}
      </>
    );
  }

  return (
    <section className="panel">
      <div className="panel-header compact">
        <div><h2>Jadwal Pelajaran</h2><p>Edit manual mapel pada slot akan ditandai sebagai manual.</p></div>
        <div className="inline-controls">
          <select value={view} onChange={(event) => setView(event.target.value as typeof view)}><option value="kelas">Per Kelas</option><option value="guru">Per Guru</option><option value="semua">Semua Jadwal</option></select>
          <select value={activeClassId} onChange={(event) => setClassId(event.target.value)}>{data.classes.map((kelas) => <option key={kelas.id} value={kelas.id}>{kelas.namaKelas}</option>)}</select>
          {view === "kelas" && <button className="primary" onClick={() => void exportClassWeeklyScheduleExcel(data, activeClassId)}>Download</button>}
        </div>
      </div>
      <div className="activity-form">
        <input placeholder="Kegiatan khusus, mis. Upacara" value={activityDraft.title} onChange={(event) => setActivityDraft({ ...activityDraft, title: event.target.value })} />
        <select value={activityDraft.day} onChange={(event) => setActivityDraft({ ...activityDraft, day: event.target.value as DayName })}>{data.settings.hariAktif.map((day) => <option key={day} value={day}>{day}</option>)}</select>
        <input type="number" min="0" placeholder="Setelah JP ke" value={activityDraft.afterLesson} onChange={(event) => setActivityDraft({ ...activityDraft, afterLesson: Math.max(0, Number(event.target.value)) })} />
        <input type="number" min="1" placeholder="Durasi menit" value={activityDraft.durationMinutes} onChange={(event) => setActivityDraft({ ...activityDraft, durationMinutes: Math.max(1, Number(event.target.value)) })} />
        <select value={activityDraft.classId || ""} onChange={(event) => setActivityDraft({ ...activityDraft, classId: event.target.value })}><option value="">Semua kelas</option>{data.classes.map((kelas) => <option key={kelas.id} value={kelas.id}>{kelas.namaKelas}</option>)}</select>
        <button className="primary" onClick={saveActivity}>Tambah Kegiatan</button>
      </div>
      {view === "kelas" && (
        <div className="schedule-grid" style={{ gridTemplateColumns: `120px repeat(${data.settings.hariAktif.length}, minmax(120px, 1fr))` }}>
          <strong>Jam</strong>{data.settings.hariAktif.map((day) => <strong key={day}>{day}</strong>)}
          {renderInsertedRows(0)}
          {Array.from({ length: maxLesson }, (_, index) => index + 1).map((lesson) => (
            <Fragment key={`lesson-row-${lesson}`}>
              <div className="time-cell" key={`time-${lesson}`}>JP {lesson}<span>{buildLessonLabel(data.settings, lesson)}</span></div>
              {data.settings.hariAktif.map((day) => {
                const entry = schedule.find((item) => item.kelasId === activeClassId && item.day === day && item.lesson === lesson);
                const inactive = lesson > data.settings.jumlahJpPerHari[day];
                return (
                  <div className={`slot-card ${inactive ? "inactive" : ""}`} key={`${day}-${lesson}`}>
                    {inactive ? "Tidak aktif" : entry ? (
                      <>
                        <small className="slot-time">{buildLessonLabel(data.settings, lesson, day)}</small>
                        <b>{getSubjectCode(data, entry.mapelId)}</b>
                        <span>{entry.guruIds.map((id) => getTeacherName(data, id)).join(", ")}</span>
                        <small>{getRoomName(data, entry.ruangId)} - {entry.source}</small>
                        <select value={entry.mapelId} onChange={(event) => updateEntry(entry, event.target.value)}>{data.subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.kodeMapel}</option>)}</select>
                      </>
                    ) : (
                      <>
                        <small className="slot-time">{buildLessonLabel(data.settings, lesson, day)}</small>
                        <span>Kosong</span>
                      </>
                    )}
                  </div>
                );
              })}
              {renderInsertedRows(lesson)}
            </Fragment>
          ))}
        </div>
      )}
      {view !== "kelas" && (
        <Table headers={["Hari", "JP", "Kelas", "Mapel", "Guru", "Ruang", "Sumber"]}>
          {schedule.map((entry) => (
            <tr key={entry.id}><td>{entry.day}</td><td>{entry.lesson}</td><td>{getClassName(data, entry.kelasId)}</td><td>{getSubjectCode(data, entry.mapelId)}</td><td>{entry.guruIds.map((id) => getTeacherName(data, id)).join(", ")}</td><td>{getRoomName(data, entry.ruangId)}</td><td>{entry.source}</td></tr>
          ))}
        </Table>
      )}
    </section>
  );
}

function WorkloadPage({ data, workloads }: { data: AppData; workloads: ReturnType<typeof calculateWorkloads> }) {
  return (
    <section className="panel">
      <SimpleHeader title="Rekap Beban Kerja Guru" />
      <Table headers={["Guru", "Mapel", "Total JP", "Minimal JP", "Maksimal JP", "Status"]}>
        {workloads.map((row) => {
          const teacher = data.teachers.find((item) => item.id === row.teacherId);
          return <tr key={row.teacherId}><td>{teacher?.nama}</td><td>{getSubjectCode(data, teacher?.mapelUtamaId || "")}</td><td>{row.totalJp}</td><td>{row.minimalJp}</td><td>{row.maksimalJp || "-"}</td><td><Badge tone={row.status === "Terpenuhi" ? "good" : row.status === "Kurang" ? "bad" : "warn"}>{row.status}{row.delta ? ` ${row.delta} JP` : ""}</Badge></td></tr>;
        })}
      </Table>
    </section>
  );
}

function ExportPage({ data, workloads }: { data: AppData; workloads: ReturnType<typeof calculateWorkloads> }) {
  const [classId, setClassId] = useState(data.classes[0]?.id || "");
  const activeClassId = classId || data.classes[0]?.id || "";
  return (
    <section className="panel">
      <SimpleHeader title="Export Jadwal dan Laporan" />
      <div className="export-class-row">
        <select value={activeClassId} onChange={(event) => setClassId(event.target.value)}>{data.classes.map((kelas) => <option key={kelas.id} value={kelas.id}>{kelas.namaKelas}</option>)}</select>
        <button className="primary" onClick={() => void exportClassWeeklyScheduleExcel(data, activeClassId)}>Download</button>
      </div>
      <div className="export-grid">
        <ExportCard title="Export Jadwal Excel" body="Unduh seluruh jadwal dalam workbook Excel." action="Download XLSX" onClick={() => void exportScheduleExcel(data)} />
        <ExportCard title="Export Beban Guru Excel" body="Unduh rekap JP guru, minimal, maksimal, dan status." action="Download XLSX" onClick={() => void exportWorkloadExcel(data, workloads)} />
        <ExportCard title="Export PDF" body="Unduh ringkasan jadwal dan beban kerja siap cetak." action="Download PDF" onClick={() => exportPdf(data, workloads)} />
      </div>
    </section>
  );
}

function Toolbar({ title: text, query, setQuery }: { title: string; query: string; setQuery: (value: string) => void }) {
  return <div className="panel-header compact"><SimpleHeader title={text} /><input className="search" placeholder="Cari..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>;
}

function SimpleHeader({ title: text }: { title: string }) {
  return <div><h2>{text}</h2><p>Data tersimpan di state lokal dan siap diganti API backend.</p></div>;
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "good" | "bad" | "warn" | "muted" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function IssueList({ issues }: { issues: AppData["issues"] }) {
  if (issues.length === 0) return <p className="empty">Belum ada issue. Jalankan generate untuk melihat hasil validasi.</p>;
  return <ul className="issue-list">{issues.map((issue, index) => <li key={`${issue.type}-${index}`}><b>{issue.severity}</b> {issue.message} {issue.suggestion && <span>{issue.suggestion}</span>}</li>)}</ul>;
}

function Status({ label, ok }: { label: string; ok: boolean }) {
  return <div className={`status ${ok ? "ok" : "bad"}`}><b>{ok ? "OK" : "!"}</b><span>{label}</span></div>;
}

function ExportCard({ title: text, body, action, onClick }: { title: string; body: string; action: string; onClick: () => void }) {
  return <div className="export-card"><h2>{text}</h2><p>{body}</p><button className="primary" onClick={onClick}>{action}</button></div>;
}

function upsert<T extends { id: string }>(rows: T[], row: T): T[] {
  return rows.some((item) => item.id === row.id) ? rows.map((item) => item.id === row.id ? row : item) : [...rows, row];
}

function title(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default App;
