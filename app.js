const pageTitles = {
  dashboard: "Dashboard",
  master: "Master Data",
  curriculum: "Struktur Kurikulum",
  rules: "Scheduling Rules",
  scheduler: "Scheduler Engine",
  editor: "Manual Timetable Editor",
  workload: "Beban Kerja Guru",
  import: "Import Excel",
  export: "Export",
  reports: "Reporting"
};

const storageKey = "autojadwal-ui-state-v1";

const defaultMasterData = {
  teachers: [
    ["G-001", "Ari Prasetyo", "Matematika", "Aktif"],
    ["G-002", "Dewi Lestari", "Bahasa Indonesia", "Aktif"],
    ["G-003", "Rizal Hakim", "Fisika", "Aktif"],
    ["G-004", "Maya Sari", "Kimia", "Cek JP"]
  ],
  classes: [
    ["X-IPA-1", "X IPA 1", "Rombel", "Aktif"],
    ["X-IPA-2", "X IPA 2", "Rombel", "Aktif"],
    ["XI-IPA-1", "XI IPA 1", "Rombel", "Aktif"],
    ["XII-IPA-1", "XII IPA 1", "Rombel", "Aktif"]
  ],
  subjects: [
    ["MTK", "Matematika", "Wajib", "Aktif"],
    ["BIN", "Bahasa Indonesia", "Wajib", "Aktif"],
    ["FIS", "Fisika", "Peminatan", "Aktif"],
    ["KIM", "Kimia", "Peminatan", "Aktif"]
  ],
  rooms: [
    ["R-101", "Ruang 101", "Kelas", "Aktif"],
    ["LAB-FIS", "Lab Fisika", "Laboratorium", "Aktif"],
    ["LAB-KIM", "Lab Kimia", "Laboratorium", "Aktif"],
    ["AULA", "Aula", "Khusus", "Terbatas"]
  ]
};

let masterData = JSON.parse(JSON.stringify(defaultMasterData));
let activeMasterTab = "teachers";

const categoryLabels = {
  teachers: "Guru",
  classes: "Kelas",
  subjects: "Mapel",
  rooms: "Ruangan"
};

const timetableRows = [
  ["07.00", ["MTK", "Ari P."], ["BIN", "Dewi L."], ["FIS", "Rizal H."], ["", ""], ["KIM", "Maya S."]],
  ["07.45", ["MTK", "Ari P."], ["BIN", "Dewi L."], ["", ""], ["FIS", "Rizal H."], ["KIM", "Maya S."]],
  ["08.30", ["BIO", "Nadia R."], ["", ""], ["MTK", "Ari P."], ["BIN", "Dewi L."], ["", ""]],
  ["09.30", ["SEJ", "Taufik"], ["BIO", "Nadia R."], ["KIM", "Maya S."], ["MTK", "Ari P."], ["BIN", "Dewi L."]],
  ["10.15", ["", ""], ["FIS", "Rizal H."], ["SEJ", "Taufik"], ["BIO", "Nadia R."], ["MTK", "Ari P."]],
  ["11.00", ["PAI", "Hana"], ["MTK", "Ari P."], ["BIN", "Dewi L."], ["", ""], ["FIS", "Rizal H."]]
];

const workloadData = [
  ["Ari Prasetyo", "Matematika", 28, 24],
  ["Dewi Lestari", "Bahasa Indonesia", 24, 24],
  ["Rizal Hakim", "Fisika", 22, 24],
  ["Maya Sari", "Kimia", 30, 24],
  ["Nadia Rahma", "Biologi", 26, 24]
];

const conflicts = [
  ["Bentrok Guru", "Rizal Hakim mengajar X IPA 1 dan XI IPA 2 pada Rabu JP 2"],
  ["Beban Berlebih", "Maya Sari mencapai 30 JP, melewati batas preferensi 28 JP"],
  ["Slot Kosong", "XII IPA 1 belum memiliki mapel pada Kamis JP 6"]
];

const validationRows = [
  ["Guru.xlsx", "46 valid", "0 error"],
  ["Kurikulum.xlsx", "118 valid", "2 perlu review"],
  ["Availability.xlsx", "230 slot valid", "4 slot kosong"],
  ["Mapel.xlsx", "18 valid", "0 error"]
];

const reportRows = [
  ["critical", "Validasi Bentrok", "3 temuan aktif pada guru dan kelas", "Tinggi"],
  ["workload", "Guru Kurang JP", "5 guru perlu penyesuaian alokasi", "Sedang"],
  ["availability", "Availability Terlanggar", "0 pelanggaran hard constraint", "Rendah"],
  ["critical", "Slot Kosong Kelas", "12 slot belum terisi", "Tinggi"]
];

const readinessRows = [
  ["Master guru", "46 guru aktif tersedia", "Siap"],
  ["Struktur kurikulum", "4 alokasi perlu review", "Review"],
  ["Availability", "3 slot tidak tersedia terdaftar", "Siap"],
  ["Rules jadwal", "Hard constraint aktif", "Siap"],
  ["Beban kerja", "2 guru melewati preferensi", "Review"]
];

const preflightRows = [
  ["Hard constraints", "Guru, kelas, linearitas, dan availability siap dicek", "Siap"],
  ["Soft constraints", "Preferensi pagi dan max consecutive teaching aktif", "Siap"],
  ["Data warning", "Ada 2 catatan beban kerja sebelum generate", "Review"],
  ["Slot terkunci", "28 slot akan dipertahankan saat regenerate", "Siap"]
];

function loadState() {
  const rawState = localStorage.getItem(storageKey);
  if (!rawState) return;

  try {
    const state = JSON.parse(rawState);
    if (state.masterData) {
      masterData = { ...masterData, ...state.masterData };
    }
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify({ masterData }));
}

function activateView(viewId) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewId);
  });

  document.getElementById("pageTitle").textContent = pageTitles[viewId] || "AutoJadwal";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderMaster(type = activeMasterTab) {
  activeMasterTab = type;
  const keyword = document.getElementById("masterSearch")?.value.trim().toLowerCase() || "";
  const rows = (masterData[type] || masterData.teachers).filter((row) =>
    row.join(" ").toLowerCase().includes(keyword)
  );
  const table = document.getElementById("masterTable");
  table.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td><strong>${row[0]}</strong></td>
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td><span class="status-pill">${row[3]}</span></td>
          <td><button class="secondary-button" data-edit-code="${row[0]}">Edit</button></td>
        </tr>
      `
    )
    .join("") || `<tr><td colspan="5">Tidak ada data yang cocok.</td></tr>`;
}

function renderConflicts() {
  const list = document.getElementById("conflictList");
  list.innerHTML = conflicts
    .map(
      ([title, detail]) => `
        <div class="conflict-item">
          <div>
            <strong>${title}</strong>
            <span>${detail}</span>
          </div>
          <button class="secondary-button fix-conflict">Perbaiki</button>
        </div>
      `
    )
    .join("");
}

function renderReadiness() {
  const list = document.getElementById("readinessList");
  list.innerHTML = readinessRows
    .map(([title, detail, status]) => {
      const needsReview = status === "Review";
      return `
        <div class="readiness-item">
          <span class="check-dot ${needsReview ? "warn" : ""}">${needsReview ? "!" : "OK"}</span>
          <div>
            <strong>${title}</strong>
            <span>${detail}</span>
          </div>
          <span class="readiness-value">${status}</span>
        </div>
      `;
    })
    .join("");
}

function renderPreflight() {
  const list = document.getElementById("preflightList");
  list.innerHTML = preflightRows
    .map(([title, detail, status]) => {
      const needsReview = status === "Review";
      return `
        <div class="preflight-item">
          <span class="check-dot ${needsReview ? "warn" : ""}">${needsReview ? "!" : "OK"}</span>
          <div>
            <strong>${title}</strong>
            <span>${detail}</span>
          </div>
          <span class="readiness-value">${status}</span>
        </div>
      `;
    })
    .join("");
}

function renderAvailability() {
  const days = ["Jam", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const times = ["07.00", "07.45", "08.30", "09.30", "10.15"];
  const blocked = new Set(["0-3", "2-1", "3-4"]);
  const grid = document.getElementById("availabilityGrid");
  const header = days.map((day) => `<div class="availability-head">${day}</div>`).join("");
  const rows = times
    .map((time, rowIndex) => {
      const timeCell = `<div class="availability-time">${time}</div>`;
      const cells = days
        .slice(1)
        .map((_, colIndex) => {
          const isBlocked = blocked.has(`${rowIndex}-${colIndex}`);
          return `<div class="${isBlocked ? "availability-blocked" : "availability-ok"}">${isBlocked ? "Tidak" : "Bisa"}</div>`;
        })
        .join("");
      return timeCell + cells;
    })
    .join("");

  grid.innerHTML = header + rows;
}

function renderTimetable() {
  const days = ["Jam", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const timetable = document.getElementById("timetable");
  const header = days.map((day) => `<div class="day-cell">${day}</div>`).join("");

  const body = timetableRows
    .map((row, rowIndex) => {
      const time = `<div class="time-cell">${row[0]}</div>`;
      const cells = row
        .slice(1)
        .map((slot, colIndex) => {
          const hasSubject = slot[0] !== "";
          const locked = rowIndex === 0 && colIndex === 0 ? " locked" : "";
          const conflict = rowIndex === 1 && colIndex === 3 ? " conflict" : "";
          return `
            <div class="slot-cell${locked}${conflict}" data-row="${rowIndex}" data-col="${colIndex}">
              ${
                hasSubject
                  ? `<div class="slot-card" draggable="true"><span>${slot[0]}</span><small>${slot[1]}</small></div>`
                  : ""
              }
            </div>
          `;
        })
        .join("");
      return time + cells;
    })
    .join("");

  timetable.innerHTML = header + body;
  enableDragDrop();
}

function enableDragDrop() {
  let draggedCard = null;

  document.querySelectorAll(".slot-card").forEach((card) => {
    card.addEventListener("dragstart", () => {
      draggedCard = card;
      setTimeout(() => card.classList.add("dragging"), 0);
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      draggedCard = null;
    });
  });

  document.querySelectorAll(".slot-cell").forEach((cell) => {
    cell.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    cell.addEventListener("drop", () => {
      if (!draggedCard || cell.classList.contains("locked")) return;
      const existing = cell.querySelector(".slot-card");
      const origin = draggedCard.parentElement;

      if (existing) {
        origin.appendChild(existing);
      }

      cell.appendChild(draggedCard);
      cell.classList.remove("conflict");
    });
  });
}

function renderWorkload() {
  const list = document.getElementById("workloadList");
  list.innerHTML = workloadData
    .map(([name, subject, current, minimum]) => {
      const percent = Math.min(100, Math.round((current / 32) * 100));
      const over = current > 28 ? " over" : "";
      return `
        <div class="workload-item${over}">
          <div>
            <strong>${name}</strong>
            <span>${subject} - ${current} JP, minimum ${minimum} JP</span>
          </div>
          <div class="workload-meter" aria-label="Beban ${name}">
            <div style="width: ${percent}%"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderValidation() {
  const list = document.getElementById("validationList");
  const selectedType = document.getElementById("importType").value;
  const typeMap = {
    bundle: validationRows,
    teachers: validationRows.filter((row) => row[0] === "Guru.xlsx"),
    curriculum: validationRows.filter((row) => row[0] === "Kurikulum.xlsx"),
    availability: validationRows.filter((row) => row[0] === "Availability.xlsx"),
    subjects: validationRows.filter((row) => row[0] === "Mapel.xlsx")
  };
  list.innerHTML = (typeMap[selectedType] || validationRows)
    .map(
      ([file, valid, note]) => `
        <div class="validation-item">
          <strong>${file}</strong>
          <span>${valid}</span>
          <span>${note}</span>
        </div>
      `
    )
    .join("");
  list.classList.add("active");
}

function renderReports(filter = "all") {
  const list = document.getElementById("reportList");
  const rows = reportRows.filter((row) => filter === "all" || row[0] === filter);
  list.innerHTML = rows
    .map(([type, title, detail, severity]) => {
      const severityClass = severity === "Tinggi" ? "high" : severity === "Sedang" ? "medium" : "";
      return `
        <div class="report-item" data-report-type="${type}">
          <div>
            <strong>${title}</strong>
            <span>${detail}</span>
          </div>
          <span class="severity ${severityClass}">${severity}</span>
        </div>
      `;
    })
    .join("");
}

function setExportPreview(cardTitle, format) {
  const preview = document.getElementById("exportPreview");
  preview.innerHTML = `<strong>${cardTitle}</strong><span> siap diexport sebagai ${format}. Backend nanti membuat file asli.</span>`;
}

function runEngine(mode) {
  const status = document.getElementById("engineStatus");
  const percent = document.getElementById("enginePercent");
  const progress = document.getElementById("engineProgress");
  const log = document.getElementById("engineLog");
  const steps =
    mode === "repair"
      ? ["Membaca slot bermasalah", "Mencari kandidat pengganti", "Menjalankan repair phase", "Menghitung ulang score"]
      : ["Memuat master data", "Menerapkan hard constraints", "Menilai soft constraints", "Menjalankan optimasi", "Menyusun draft jadwal"];

  let index = 0;
  log.innerHTML = "";
  status.textContent = mode === "repair" ? "Repair berjalan" : "Generate berjalan";

  const timer = setInterval(() => {
    const currentPercent = Math.round(((index + 1) / steps.length) * 100);
    percent.textContent = `${currentPercent}%`;
    progress.style.width = `${currentPercent}%`;
    log.insertAdjacentHTML("beforeend", `<span>${steps[index]}</span>`);
    index += 1;

    if (index >= steps.length) {
      clearInterval(timer);
      status.textContent = mode === "repair" ? "Repair selesai" : "Draft jadwal selesai";
      log.insertAdjacentHTML("beforeend", "<span>Score akhir: 86, bentrok tersisa: 3.</span>");
    }
  }, 550);
}

document.getElementById("navList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  activateView(button.dataset.view);
});

document.querySelectorAll("[data-view-target]").forEach((button) => {
  button.addEventListener("click", () => activateView(button.dataset.viewTarget));
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    renderMaster(tab.dataset.tab);
  });
});

document.getElementById("masterSearch").addEventListener("input", () => renderMaster());

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  document.getElementById("loginScreen").classList.add("hidden");
  document.body.classList.remove("login-open");
  localStorage.setItem("autojadwal-login-mock", "true");
  showToast("Login mock berhasil. Backend autentikasi belum aktif.");
});

document.getElementById("addMasterBtn").addEventListener("click", () => {
  document.getElementById("masterDrawer").classList.add("open");
  document.getElementById("masterDrawer").setAttribute("aria-hidden", "false");
});

document.getElementById("closeDrawerBtn").addEventListener("click", () => {
  document.getElementById("masterDrawer").classList.remove("open");
  document.getElementById("masterDrawer").setAttribute("aria-hidden", "true");
});

document.getElementById("saveMasterBtn").addEventListener("click", () => {
  const code = document.getElementById("drawerCode").value.trim();
  const name = document.getElementById("drawerName").value.trim();
  const category = document.getElementById("drawerCategory").value;
  const status = document.getElementById("drawerStatus").value;

  if (!code || !name) {
    showToast("Kode dan nama wajib diisi.");
    return;
  }

  const categoryText = categoryLabels[category] || "Data";
  masterData[category].push([code, name, categoryText, status]);
  saveState();

  document.getElementById("masterDrawer").classList.remove("open");
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === category));
  renderMaster(category);
  showToast("Data mock tersimpan di browser.");
});

document.getElementById("validateImportBtn").addEventListener("click", () => {
  renderValidation();
  showToast("Validasi import mock selesai.");
});

document.querySelectorAll(".export-action").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".export-card");
    const title = card.querySelector("h2").textContent;
    const format = card.querySelector("select").value;
    setExportPreview(title, format);
    showToast(`Export mock ${title} ${format} dibuat.`);
  });
});

document.getElementById("reportFilter").addEventListener("change", (event) => {
  renderReports(event.target.value);
});

document.getElementById("resetMockBtn").addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  localStorage.removeItem("autojadwal-draft-saved-at");
  masterData = JSON.parse(JSON.stringify(defaultMasterData));
  renderMaster(activeMasterTab);
  document.getElementById("draftStatus").textContent = "Draft belum disimpan.";
  showToast("Data mock direset.");
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("autojadwal-login-mock");
  document.getElementById("loginScreen").classList.remove("hidden");
  document.body.classList.add("login-open");
  showToast("Logout mock berhasil.");
});

document.getElementById("conflictList").addEventListener("click", (event) => {
  if (!event.target.closest(".fix-conflict")) return;
  activateView("editor");
  showToast("Masuk ke editor untuk simulasi perbaikan bentrok.");
});

document.getElementById("generateBtn").addEventListener("click", () => runEngine("generate"));
document.getElementById("repairBtn").addEventListener("click", () => runEngine("repair"));
document.getElementById("lockBtn").addEventListener("click", () => {
  document.querySelector(".slot-cell:not(.locked)")?.classList.add("locked");
  showToast("Slot pertama yang tersedia ditandai terkunci.");
});

document.getElementById("saveDraftBtn").addEventListener("click", () => {
  const savedAt = new Date().toLocaleString("id-ID");
  localStorage.setItem("autojadwal-draft-saved-at", savedAt);
  document.getElementById("draftStatus").textContent = `Draft terakhir disimpan: ${savedAt}.`;
  showToast("Draft jadwal mock disimpan di browser.");
});

loadState();
if (localStorage.getItem("autojadwal-login-mock") === "true") {
  document.getElementById("loginScreen").classList.add("hidden");
} else {
  document.body.classList.add("login-open");
}
renderConflicts();
renderReadiness();
renderPreflight();
renderAvailability();
renderMaster();
renderTimetable();
renderWorkload();
renderReports();
