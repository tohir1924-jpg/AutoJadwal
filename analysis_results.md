# Laporan Analisis Kode, Flow, Fitur, State, dan Resiko AutoJadwal

Dokumen ini berisi hasil analisis mendalam terhadap basis kode aplikasi **AutoJadwal** (React + TypeScript + Vite + XLSX). Analisis ini mencakup evaluasi logika penjadwalan, manajemen *state*, antarmuka pengguna (UI/UX), integrasi data, serta file-file redundant. 

Rekomendasi perbaikan disusun ke dalam tiga kategori prioritas: **Urgent - Mendesak**, **Urgent - Santai**, dan **Santai Saja**.

---

## 1. Analisis Arsitektur & Flow Sistem

Aplikasi AutoJadwal saat ini merupakan aplikasi React *Single Page Application* (SPA) berbasis Vite yang berjalan sepenuhnya di sisi klien (*client-side*). Seluruh data disimpan sementara di dalam *React State* lokal dan di-*seed* menggunakan data awal dari [src/data/seed.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/data/seed.ts).

### 1.1 Struktur Direktori Utama
*   **[src/App.tsx](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/App.tsx)**: Komponen utama sekolah/shell aplikasi yang menangani navigasi antar-halaman (*Dashboard, Master Data, Settings, Generate, Schedule, Workloads, Export*), serta menyimpan *state* utama (`data`) yang menampung seluruh informasi guru, mapel, kelas, ruang, alokasi kurikulum, aturan, dan jadwal yang dihasilkan.
*   **[src/components/Dashboard.tsx](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/components/Dashboard.tsx)**: Panel informasi ringkas yang menampilkan statistik data, kelengkapan jadwal, grafik beban mengajar, dan daftar peringatan penting.
*   **[src/lib/scheduler.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/lib/scheduler.ts)**: Otak utama sistem yang berisi algoritma pembuatan jadwal otomatis (*Greedy Scheduler*), perhitungan beban kerja (*workload*), pencarian slot kosong, dan penghitungan konflik.
*   **[src/lib/teacher-import.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/lib/teacher-import.ts)**: Logika untuk mengunduh template Excel dan membaca file Excel guru menggunakan pustaka `xlsx`.
*   **[src/lib/export.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/lib/export.ts)**: Penanganan ekspor jadwal kelas ke Excel, ekspor keseluruhan ke Excel/PDF, dan rekap beban kerja.
*   **[src/types.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/types.ts)**: Definisi tipe data TypeScript untuk entitas utama (*Teacher, Subject, ClassGroup, Room, ScheduleSettings, ScheduleEntry, dll.*).

---

## 2. Temuan Masalah & Resiko (Bug, Bentrok, Kekurangan)

### 2.1 Logika & Algoritma Penjadwalan
1.  **Pelanggaran Constraint Istirahat (Bug Fatal)**:
    Fungsi `isValidPlacement` di [src/lib/scheduler.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/lib/scheduler.ts) tidak pernah memanggil `isBreak` atau memeriksa apakah slot yang diuji merupakan slot istirahat sekolah (`settings.istirahat`). Algoritma akan menempatkan kegiatan belajar mengajar di slot istirahat jika slot tersebut kosong. Hal ini melanggar aturan PRD Bab 11.10 Poin 6: *"Jadwal tidak ditempatkan pada slot istirahat."*
2.  **Penyebaran Mapel Tidak Efisien (Shortcoming / Kekurangan Algoritma)**:
    Dalam penghitungan skor slot (`scoreSlot`), terdapat penalti keras sebesar `-18` jika pelajaran yang sama ditaruh di hari yang sama (`sameSubjectSameDay`). Hal ini menyebabkan sistem membagi pelajaran 5 JP per minggu menjadi 1 JP di 5 hari yang berbeda. Di sekolah asli Indonesia, mata pelajaran harus diajarkan dalam bentuk blok (misal Matematika 5 JP dibagi menjadi 2 JP Senin dan 3 JP Rabu). Model penyebaran 1 JP per hari tidak realistis.
3.  **Conflict Bottleneck pada Ruang Fallback (Bug Logika)**:
    Jika kelas tidak memiliki ruang kelas default (`ruangDefaultId`) dan mata pelajaran tidak memiliki ruang khusus (`ruangKhususId`), sistem akan menjatuhkan *fallback* ke `data.rooms[0]?.id` (ruang pertama di master data). Akibatnya, semua kelas tanpa ruang default akan dipaksa menggunakan satu ruangan yang sama. Karena sistem melarang bentrok ruang secara absolut, sistem hanya akan mampu menjadwalkan total maksimal 46 JP untuk seluruh kelas yang terpengaruh, menyebabkan kegagalan generate massal (banyak mapel yang tidak masuk jadwal).
4.  **Batas Mengajar Berturut-Turut Menghiraukan Istirahat (Logika Semu)**:
    Fungsi `exceedsMaxConsecutive` memeriksa jam mengajar berurutan berdasarkan nomor JP saja (misal JP 3 and JP 4). Jika sekolah menyisipkan jeda istirahat selama 30-40 menit di antara JP tersebut, guru sebenarnya sempat beristirahat, namun sistem tetap menganggapnya mengajar berturut-turut tanpa jeda, sehingga menolak penempatan secara tidak perlu.

### 2.2 Manajemen State & Input Data
1.  **State Dropdown Tersangkut String Kosong (Bug State)**:
    *State* React untuk pengisian alokasi kurikulum (`CurriculumMaster` di [src/App.tsx](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/App.tsx)) diinisialisasi hanya sekali menggunakan item indeks ke-0 saat aplikasi pertama dimuat:
    `kelasId: data.classes[0]?.id || ""`
    Jika aplikasi dibuka saat master data masih kosong, *state* ini bernilai `""`. Saat user menambahkan kelas atau mapel baru, dropdown `<select>` di halaman alokasi kurikulum akan terisi secara visual, tetapi *state* React tetap tersangkut pada string kosong `""`. Klik "Tambah Alokasi" akan menyimpan data korup dengan `kelasId: ""` dan `guruUtamaId: ""`. Bug serupa juga terjadi pada halaman pemilihan kelas di `SchedulePage`.
2.  **Destruksi Konsistensi Data pada Edit Manual (Bug Fungsional)**:
    Di [src/App.tsx](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/App.tsx) fungsi `updateEntry`, ketika user mengubah mata pelajaran secara manual di sel grid jadwal:
    ```typescript
    schedule: current.schedule.map((item) => item.id === entry.id ? { ...item, mapelId, source: "manual" } : item)
    ```
    *   Sistem hanya mengganti `mapelId`, sedangkan `guruIds` dan `ruangId` tetap mengacu pada guru dan ruangan dari mapel lama. Ini menyebabkan ketidakcocokan data parah (contoh: Mapel berubah menjadi PJOK, tetapi guru pengampu tetap guru Matematika).
    *   Sistem langsung menghapus semua isu (`issues: []`) tanpa menghitung ulang bentrok guru, kelas, atau ruang yang terjadi akibat pengeditan manual tersebut.

### 2.3 Antarmuka Pengguna (UI/UX)
1.  **Data Dashboard Penuh Manipulasi / Mock Data (Bug Visual)**:
    Komponen [src/components/Dashboard.tsx](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/components/Dashboard.tsx) menggunakan visualisasi manipulatif dengan menyandingkan data asli dengan data demo (`Math.max(data.*.length, demo.*)`):
    *   Total guru selalu ditampilkan minimal **42** meskipun data aslinya hanya 8.
    *   Total kelas ditampilkan **18** padahal aslinya hanya 3.
    *   Sebelum jadwal digenerate (slot masih kosong), dashboard sudah menyatakan **410 slot terisi** dan **4 bentrok terdeteksi**.
    *   Menu "Perlu Perhatian" menggunakan teks statis keras (*hardcoded*) yang selalu menuduh adanya bentrok di ruang Lab IPA dan kekurangan jam pada guru tertentu, tidak peduli apakah data itu nyata atau tidak.

---

## 3. Rekomendasi Perbaikan & Kategori Prioritas

### Kategori 1: URGENT - MENDESAK (Harus Segera Diperbaiki)
*Masalah yang menyebabkan kerusakan data, kesalahan perhitungan esensial, atau manipulasi visual yang fatal.*

| No | File Terkait | Masalah | Rekomendasi Solusi |
|---|---|---|---|
| 1 | [src/lib/scheduler.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/lib/scheduler.ts) | Penjadwalan otomatis menabrak waktu istirahat (`isBreak` diabaikan). | Tambahkan validasi break di dalam fungsi `isValidPlacement`:<br>`if (isBreak(data.settings, slot)) return false;` sehingga slot istirahat diabaikan saat pencarian otomatis. |
| 2 | [src/components/Dashboard.tsx](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/components/Dashboard.tsx) | Statistik dashboard dan notifikasi "Perlu Perhatian" bersifat palsu (mock/statis). | Hapus objek `demo` dan fungsi `Math.max` dengan batas tiruan. Gunakan data asli (`data.teachers.length`, `data.schedule.length`, dll.). Ubah panel peringatan agar membaca dari `data.issues` secara dinamis. |
| 3 | [src/App.tsx](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/App.tsx) | Edit manual merusak hubungan mapel, guru, dan ruangan. | Di fungsi `updateEntry`, cari objek alokasi kurikulum (`curriculum`) yang sesuai dengan `kelasId` dan `mapelId` terpilih. Ambil `guruUtamaId`, `guruTambahanIds`, dan `ruangKhususId` terbaru, lalu perbarui properti `guruIds` dan `ruangId` di `ScheduleEntry`. Setelah itu panggil `validateFullSchedule` untuk menghitung ulang bentrok terbaru. |
| 4 | [src/App.tsx](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/App.tsx) | Dropdown input master tersangkut `""` jika data awal kosong. | Gunakan efek samping (`useEffect`) untuk menyinkronkan *state* `draft` kurikulum atau `classId` jadwal segera setelah data master terisi, atau atur *fallback* seleksi dinamis saat fungsi `save` dieksekusi agar mengambil opsi pertama yang tersedia di DOM. |

### Kategori 2: URGENT - SANTAI (Diperbaiki di Iterasi Berikutnya)
*Masalah logika tingkat menengah, risiko integrasi sistem, dan batas aturan penjadwalan.*

| No | File Terkait | Masalah | Rekomendasi Solusi |
|---|---|---|---|
| 1 | [src/lib/scheduler.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/lib/scheduler.ts) | Pelajaran disebar acak 1 JP per hari karena penalti `sameSubjectSameDay` yang terlalu kaku. | Terapkan logika penyusunan paket pelajaran berurutan (*Block/Consecutive Scheduling*). Misalnya, pelajaran 5 JP dipecah menjadi paket `[2, 3]`. Algoritma harus mencoba menempatkan slot secara berdekatan pada hari yang sama terlebih dahulu sebelum memisahkannya. |
| 2 | [src/lib/scheduler.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/lib/scheduler.ts) | Konflik palsu ruangan jika ruangan default bernilai kosong. | Modifikasi alokasi ruang agar tidak menggunakan *fallback* `rooms[0]` secara global jika ruangan kelas bernilai kosong. Biarkan `roomId` tetap opsional atau tangani ruangan kelas sebagai entitas mandiri yang tidak saling berbenturan kecuali tipe ruangannya adalah *Laboratorium* atau *Lapangan*. |
| 3 | [src/lib/export.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/lib/export.ts) | Ekspor PDF diblokir oleh pemblokir iklan/pop-up browser (`window.open`). | Modifikasi penanganan `window.open`. Jika mengembalikan nilai `null`, tampilkan pesan/alert edukasi di UI: *"Ekspor PDF terhalang popup blocker. Harap izinkan pop-up untuk situs ini."* atau lakukan render cetak langsung menggunakan elemen iframe tersembunyi. |
| 4 | [src/lib/scheduler.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/lib/scheduler.ts) | Aturan jam berturut-turut guru mengabaikan istirahat. | Modifikasi fungsi `exceedsMaxConsecutive` agar memeriksa jika ada slot istirahat di tengah urutan pelajaran. Jika ada istirahat, set ulang penghitung *streak* kembali ke 0. |
| 5 | [vite.config.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/vite.config.ts) & [package.json](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/package.json) | Tidak menggunakan `@vitejs/plugin-react` di server Vite. | Pasang `@vitejs/plugin-react` via npm dan impor ke dalam `vite.config.ts` untuk memastikan kestabilan kompilasi TSX dan kelancaran proses Hot Module Replacement (HMR). |

### Kategori 3: SANTAI SAJA (Bisa Dikerjakan Kapan Saja / Pembersihan)
*File sampah, duplikasi konfigurasi, dan pemeliharaan kode agar tetap bersih.*

| No | File Terkait | Masalah | Rekomendasi Solusi |
|---|---|---|---|
| 1 | Root Directory | Terdapat file sisa purwarupa (prototype) [app.js](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/app.js) dan [styles.css](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/styles.css). | Hapus file `app.js` dan `styles.css` yang berada langsung di bawah folder root. File ini tidak digunakan karena aplikasi sesungguhnya sudah dimigrasi ke folder `src/`. |
| 2 | Root Directory | Duplikasi berkas konfigurasi `vite.config.js` and `vite.config.ts`. | Hapus `vite.config.js` dan pertahankan `vite.config.ts` yang sudah menggunakan TypeScript penuh agar selaras dengan arsitektur modern proyek. |
| 3 | [src/lib/scheduler.ts](file:///c:/Users/tohir/Documents/WEBSITE/Auto%20Jadwal/src/lib/scheduler.ts) | Fungsi mati `isBreak` dan beberapa impor yang tidak terpakai. | Lakukan pembersihan (*code cleanup*) terhadap fungsi yang tidak terpakai atau pastikan fungsi tersebut diintegrasikan ke tempat yang seharusnya. |

---

## 4. Kesimpulan & Langkah Rekomendasi

Aplikasi **AutoJadwal** secara visual telah memiliki antarmuka yang sangat representatif untuk kebutuhan seorang Wakil Kepala Sekolah Bidang Kurikulum. Namun, logika di balik layar (mesin penjadwalan) masih sangat rapuh dan dipenuhi manipulasi data tiruan pada dashboard.

Untuk berlanjut ke integrasi backend sesuai dengan rancangan kontraktual di `backend_contract.md`, disarankan untuk **menyelesaikan perbaikan pada Kategori 1 (Urgent - Mendesak)** terlebih dahulu agar transisi integrasi API tidak membawa bug logika lokal yang membingungkan.
