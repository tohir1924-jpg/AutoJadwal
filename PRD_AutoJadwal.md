# PRD AutoJadwal

**Nama Produk:** AutoJadwal  
**Jenis Produk:** Web App penyusunan jadwal pelajaran dan pembagian beban kerja guru  
**Target Pengguna Utama:** Wakil Kepala Sekolah Bidang Kurikulum  
**Lingkup Awal:** Satu sekolah, satu user utama, online  
**Output Utama:** Jadwal pelajaran, rekap beban kerja guru, export Excel, export PDF  
**Versi Dokumen:** 1.0  

---

## 1. Ringkasan Produk

AutoJadwal adalah aplikasi web untuk membantu Wakil Kepala Sekolah Bidang Kurikulum menyusun jadwal pelajaran dan membagi beban kerja guru secara lebih cepat, rapi, dan minim bentrok.

Masalah utama yang ingin diselesaikan adalah proses penyusunan jadwal yang biasanya memakan waktu lama karena harus mempertimbangkan banyak hal sekaligus, seperti jumlah kelas, jumlah guru, kebutuhan jam pelajaran per mapel, ketersediaan guru, beban mengajar minimal guru tertentu, kebutuhan guru sertifikasi, serta menghindari bentrok jam mengajar.

Aplikasi ini dirancang untuk digunakan oleh satu user utama, yaitu Waka Kurikulum. Kepala sekolah dan guru tidak perlu login pada versi awal. Data guru, kelas, mapel, beban minimal, preferensi, dan aturan jadwal dimasukkan oleh Waka Kurikulum. Sistem kemudian membantu menghasilkan jadwal otomatis yang dapat diedit manual bila diperlukan.

---

## 2. Tujuan Produk

### 2.1 Tujuan Utama

1. Mempercepat proses penyusunan jadwal pelajaran.
2. Mengurangi risiko bentrok jadwal guru, kelas, dan ruang.
3. Membantu memastikan beban kerja guru terpenuhi, terutama guru dengan kewajiban minimal tertentu.
4. Memberikan fleksibilitas kepada Waka Kurikulum untuk mengatur constraint jadwal.
5. Menyediakan output jadwal dan beban kerja dalam format Excel dan PDF.

### 2.2 Tujuan MVP

Pada tahap MVP, AutoJadwal harus mampu:

1. Menyimpan master data sekolah.
2. Menyimpan data guru, mapel, kelas, rombel, dan ruang.
3. Mengatur mode jadwal 5 hari atau 6 hari.
4. Mengatur jumlah jam pelajaran per hari.
5. Mengatur alokasi JP per mapel per kelas.
6. Mengatur guru pengampu mapel.
7. Mendukung team teaching secara opsional.
8. Mendukung batas maksimal mengajar berturut-turut.
9. Menghasilkan jadwal otomatis tanpa bentrok dasar.
10. Menampilkan rekap beban kerja guru.
11. Mendukung edit manual jadwal.
12. Export jadwal ke Excel dan PDF.

---

## 3. Latar Belakang Masalah

Penyusunan jadwal pelajaran di sekolah sering dilakukan secara manual menggunakan Excel, kertas, atau kombinasi keduanya. Cara ini masih sangat bergantung pada ketelitian Waka Kurikulum dan sering menimbulkan beberapa masalah:

1. Guru terjadwal di dua kelas pada jam yang sama.
2. Kelas memiliki dua pelajaran pada waktu yang sama.
3. Jumlah JP mapel tidak sesuai struktur kurikulum.
4. Beban kerja guru belum memenuhi minimal tertentu.
5. Guru sertifikasi tidak mencapai beban minimal mengajar.
6. Jadwal terlalu padat pada hari tertentu.
7. Guru mengajar terlalu banyak jam berturut-turut.
8. Perubahan kecil dapat merusak jadwal yang sudah tersusun.
9. Rekap beban kerja harus dihitung ulang secara manual.

AutoJadwal berusaha menyederhanakan proses tersebut melalui sistem berbasis data dan algoritma penjadwalan otomatis.

---

## 4. Target Pengguna

### 4.1 Pengguna Utama

**Waka Kurikulum**

Tugas utama:

1. Menginput data sekolah.
2. Menginput guru, mapel, kelas, rombel, ruang, dan alokasi JP.
3. Mengatur aturan jadwal.
4. Menjalankan auto-generate jadwal.
5. Mengecek hasil jadwal dan beban kerja.
6. Melakukan koreksi manual jika diperlukan.
7. Export jadwal dan laporan.

### 4.2 Pengguna Tidak Langsung

Pada MVP, kepala sekolah dan guru tidak perlu login. Namun mereka menjadi penerima output berupa jadwal pelajaran dan rekap beban kerja.

---

## 5. Ruang Lingkup Produk

### 5.1 Termasuk dalam MVP

1. Login satu user untuk Waka Kurikulum.
2. Dashboard ringkas.
3. Master data:
   - Tahun ajaran
   - Semester
   - Guru
   - Mata pelajaran
   - Kelas/rombel
   - Ruang
   - Struktur kurikulum/alokasi JP
4. Pengaturan jadwal:
   - 5 hari atau 6 hari
   - Jam mulai dan jam selesai
   - Durasi JP
   - Istirahat
   - Maksimal jam mengajar berturut-turut
   - Ketersediaan guru
   - Team teaching opsional
5. Generate jadwal otomatis.
6. Deteksi bentrok.
7. Edit manual jadwal.
8. Rekap beban kerja guru.
9. Export Excel.
10. Export PDF.

### 5.2 Tidak Termasuk dalam MVP

1. Login guru.
2. Login kepala sekolah.
3. Notifikasi WhatsApp/email.
4. Integrasi Dapodik/EMIS.
5. Multi sekolah.
6. Marketplace template jadwal.
7. AI rekomendasi kompleks.
8. Mobile app native.

---

## 6. Definisi Istilah

| Istilah | Penjelasan |
|---|---|
| JP | Jam Pelajaran |
| Rombel | Rombongan belajar/kelas aktif |
| Constraint | Aturan atau batasan dalam penyusunan jadwal |
| Slot | Kombinasi hari dan jam pelajaran tertentu |
| Beban Kerja | Total JP mengajar guru dalam satu minggu |
| Team Teaching | Satu mapel pada satu kelas diajar oleh lebih dari satu guru |
| Generate Jadwal | Proses sistem menyusun jadwal otomatis |

---

## 7. Prinsip Desain Produk

1. **Sederhana dulu, lengkap kemudian.** MVP harus mudah digunakan meski fitur belum kompleks.
2. **Waka Kurikulum tetap memegang kontrol.** Sistem membantu menyusun, tetapi hasil tetap bisa diedit manual.
3. **Data terstruktur.** Jadwal yang baik bergantung pada master data yang rapi.
4. **Transparan.** Jika sistem gagal menempatkan jadwal, alasannya harus ditampilkan.
5. **Export-friendly.** Output harus mudah dibagikan ke guru dan arsip sekolah.

---

## 8. User Flow

### 8.1 Flow Utama Penggunaan

```text
Login
  ↓
Dashboard
  ↓
Setup Tahun Ajaran & Semester
  ↓
Input Master Data
  ├── Guru
  ├── Mapel
  ├── Kelas/Rombel
  ├── Ruang
  └── Struktur Kurikulum / Alokasi JP
  ↓
Atur Constraint Jadwal
  ├── Mode 5 hari / 6 hari
  ├── Jam belajar per hari
  ├── Jam istirahat
  ├── Ketersediaan guru
  ├── Maksimal mengajar berturut-turut
  └── Team teaching opsional
  ↓
Generate Jadwal
  ↓
Sistem Validasi Bentrok
  ↓
Tampilkan Hasil Jadwal
  ↓
Review & Edit Manual
  ↓
Rekap Beban Kerja Guru
  ↓
Export Excel / PDF
```

### 8.2 Flow Generate Jadwal

```text
User klik Generate Jadwal
  ↓
Sistem membaca data:
  ├── Kelas
  ├── Mapel
  ├── Guru
  ├── JP per mapel
  ├── Ketersediaan guru
  ├── Aturan hari dan jam
  └── Constraint lainnya
  ↓
Sistem membuat daftar kebutuhan jadwal
  ↓
Sistem mengurutkan kebutuhan berdasarkan tingkat kesulitan
  ↓
Sistem menempatkan jadwal ke slot kosong
  ↓
Sistem mengecek bentrok guru, kelas, ruang, dan constraint
  ↓
Jika valid:
    simpan jadwal sementara
Jika tidak valid:
    cari slot alternatif
  ↓
Jika semua berhasil:
    tampilkan jadwal final
Jika sebagian gagal:
    tampilkan jadwal parsial + daftar masalah
```

### 8.3 Flow Edit Manual

```text
User membuka halaman Jadwal
  ↓
Pilih tampilan:
  ├── Per kelas
  ├── Per guru
  └── Semua jadwal
  ↓
Klik slot jadwal
  ↓
Edit data:
  ├── Mapel
  ├── Guru
  ├── Ruang
  └── Jam/Hari
  ↓
Sistem validasi bentrok
  ↓
Jika aman:
    simpan perubahan
Jika bentrok:
    tampilkan peringatan dan opsi batal/paksa simpan
```

---

## 9. Struktur Menu

### 9.1 Sidebar Menu

1. Dashboard
2. Master Data
   - Guru
   - Mata Pelajaran
   - Kelas/Rombel
   - Ruang
   - Struktur Kurikulum
3. Pengaturan Jadwal
   - Tahun Ajaran & Semester
   - Hari & Jam Pelajaran
   - Ketersediaan Guru
   - Constraint Jadwal
4. Generate Jadwal
5. Jadwal Pelajaran
   - Jadwal Per Kelas
   - Jadwal Per Guru
   - Jadwal Semua
6. Beban Kerja Guru
7. Export
   - Export Excel
   - Export PDF
8. Pengaturan Akun

---

## 10. Wireframe UI

### 10.1 Dashboard

```text
+-------------------------------------------------------+
| AutoJadwal                         Tahun: 2026/2027   |
+----------------------+--------------------------------+
| Sidebar              | Dashboard                      |
|                      |                                |
| - Dashboard          | [Total Guru] [Total Kelas]     |
| - Master Data        | [Total Mapel] [Status Jadwal]  |
| - Pengaturan Jadwal  |                                |
| - Generate Jadwal    | Grafik Ringkas Beban Guru      |
| - Jadwal Pelajaran   |                                |
| - Beban Kerja Guru   | Alert:                         |
| - Export             | - 3 guru belum memenuhi JP     |
|                      | - 2 slot belum terisi          |
+----------------------+--------------------------------+
```

### 10.2 Halaman Master Data Guru

```text
+-------------------------------------------------------+
| Guru                                         [+Tambah] |
+-------------------------------------------------------+
| Search guru...                              Import XLS |
+-------------------------------------------------------+
| Nama Guru | Kode | Mapel | Minimal JP | Status | Aksi |
|-----------|------|-------|------------|--------|------|
| Ahmad     | G01  | MTK   | 24         | Aktif  | Edit |
| Siti      | G02  | IPA   | 24         | Aktif  | Edit |
+-------------------------------------------------------+
```

### 10.3 Form Guru

```text
+---------------------------------------------+
| Tambah/Edit Guru                            |
+---------------------------------------------+
| Nama Guru                                   |
| Kode Guru                                   |
| Mata Pelajaran Utama                        |
| Mata Pelajaran Tambahan                     |
| Minimal JP per Minggu                       |
| Maksimal JP per Minggu                      |
| Status Sertifikasi: Ya / Tidak              |
| Ketersediaan Khusus                         |
| [Simpan] [Batal]                            |
+---------------------------------------------+
```

### 10.4 Halaman Struktur Kurikulum

```text
+--------------------------------------------------------+
| Struktur Kurikulum                         [+Tambah]   |
+--------------------------------------------------------+
| Kelas | Mapel | JP/Minggu | Guru Utama | Team Teaching |
|-------|-------|-----------|------------|---------------|
| VII A | MTK   | 5         | Ahmad      | Tidak         |
| VII A | IPA   | 5         | Siti       | Ya            |
+--------------------------------------------------------+
```

### 10.5 Pengaturan Jadwal

```text
+--------------------------------------------------------+
| Pengaturan Jadwal                                      |
+--------------------------------------------------------+
| Mode Hari Sekolah: ( ) 5 Hari  (•) 6 Hari              |
| Hari Aktif: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu   |
| Jam Mulai: 07:30                                      |
| Durasi 1 JP: 40 menit                                  |
| Jumlah JP per Hari                                     |
|                                                        |
| Constraint:                                            |
| [x] Maksimal mengajar berturut-turut                   |
|     Maksimal: 3 JP                                     |
| [x] Cegah guru mengajar di dua kelas bersamaan         |
| [x] Cegah kelas memiliki dua mapel di jam yang sama    |
| [x] Team teaching                                      |
|                                                        |
| [Simpan Pengaturan]                                    |
+--------------------------------------------------------+
```

### 10.6 Generate Jadwal

```text
+--------------------------------------------------------+
| Generate Jadwal                                        |
+--------------------------------------------------------+
| Status Data:                                           |
| ✓ Guru lengkap                                         |
| ✓ Kelas lengkap                                        |
| ✓ Struktur kurikulum lengkap                           |
| ! 2 guru belum memiliki ketersediaan                   |
|                                                        |
| Mode Generate:                                         |
| (•) Aman: hindari semua bentrok                        |
| ( ) Cepat: generate dasar                              |
|                                                        |
| [Generate Jadwal]                                      |
+--------------------------------------------------------+
| Hasil Generate:                                        |
| - 96% slot berhasil terisi                             |
| - 4 slot belum terisi                                  |
| - 0 bentrok guru                                       |
| - 0 bentrok kelas                                      |
+--------------------------------------------------------+
```

### 10.7 Jadwal Per Kelas

```text
+--------------------------------------------------------+
| Jadwal Kelas: VII A                         [Export]   |
+--------------------------------------------------------+
| Jam | Senin | Selasa | Rabu | Kamis | Jumat | Sabtu    |
|-----|-------|--------|------|-------|-------|----------|
| 1   | MTK   | IPA    | BIN  | PAI   | PJOK  | IPS      |
| 2   | MTK   | IPA    | BIN  | PAI   | PJOK  | IPS      |
| 3   | BIG   | MTK    | IPA  | IPS   | Seni  | PKN      |
+--------------------------------------------------------+
```

### 10.8 Jadwal Per Guru

```text
+--------------------------------------------------------+
| Jadwal Guru: Ahmad                         [Export]    |
+--------------------------------------------------------+
| Hari   | Jam | Kelas | Mapel | Ruang                    |
|--------|-----|-------|-------|--------------------------|
| Senin  | 1   | VII A | MTK   | R-01                     |
| Senin  | 2   | VII A | MTK   | R-01                     |
| Selasa | 3   | VIII B| MTK   | R-04                     |
+--------------------------------------------------------+
```

### 10.9 Beban Kerja Guru

```text
+--------------------------------------------------------+
| Beban Kerja Guru                            [Export]   |
+--------------------------------------------------------+
| Guru  | Mapel | Total JP | Minimal JP | Status          |
|-------|-------|----------|------------|-----------------|
| Ahmad | MTK   | 26       | 24         | Terpenuhi       |
| Siti  | IPA   | 22       | 24         | Kurang 2 JP     |
+--------------------------------------------------------+
```

---

## 11. Fitur Detail

## 11.1 Login

### Deskripsi
User masuk ke sistem menggunakan email dan password.

### Requirement
1. Sistem hanya membutuhkan satu akun Waka Kurikulum pada MVP.
2. Setelah login, user diarahkan ke Dashboard.
3. User dapat logout.

### Field
| Field | Tipe | Wajib |
|---|---|---|
| Email | string | Ya |
| Password | string | Ya |

---

## 11.2 Dashboard

### Deskripsi
Dashboard menampilkan ringkasan kondisi data dan jadwal.

### Komponen
1. Total guru.
2. Total kelas.
3. Total mapel.
4. Status jadwal.
5. Jumlah guru kurang JP.
6. Jumlah slot belum terisi.
7. Shortcut ke Generate Jadwal.

---

## 11.3 Master Data Guru

### Deskripsi
Halaman untuk mengelola data guru.

### Field Guru
| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| id | uuid | Ya | Auto-generated |
| nama | string | Ya | Nama lengkap guru |
| kode_guru | string | Ya | Contoh: G01 |
| mapel_utama_id | uuid | Ya | Relasi ke mapel |
| mapel_tambahan | array | Tidak | Jika guru bisa mengajar mapel lain |
| minimal_jp | number | Tidak | Default 0 atau sesuai input |
| maksimal_jp | number | Tidak | Opsional |
| sertifikasi | boolean | Tidak | Ya/Tidak |
| aktif | boolean | Ya | Default true |

### Fitur
1. Tambah guru.
2. Edit guru.
3. Hapus/nonaktifkan guru.
4. Import Excel opsional pada fase berikutnya.
5. Search guru.

---

## 11.4 Master Data Mata Pelajaran

### Field Mapel
| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| id | uuid | Ya | Auto-generated |
| nama_mapel | string | Ya | Contoh: Matematika |
| kode_mapel | string | Ya | Contoh: MTK |
| kelompok | string | Tidak | Umum/Muatan Lokal/dll |
| aktif | boolean | Ya | Default true |

---

## 11.5 Master Data Kelas/Rombel

### Field Kelas
| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| id | uuid | Ya | Auto-generated |
| tingkat | string | Ya | VII/VIII/IX atau X/XI/XII |
| nama_kelas | string | Ya | Contoh: VII A |
| wali_kelas_id | uuid | Tidak | Relasi guru |
| ruang_default_id | uuid | Tidak | Relasi ruang |
| aktif | boolean | Ya | Default true |

---

## 11.6 Master Data Ruang

### Field Ruang
| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| id | uuid | Ya | Auto-generated |
| nama_ruang | string | Ya | Contoh: R-01 |
| tipe_ruang | string | Ya | Kelas/Lab/Perpustakaan/Lapangan |
| kapasitas | number | Tidak | Opsional |
| aktif | boolean | Ya | Default true |

---

## 11.7 Struktur Kurikulum / Alokasi JP

### Deskripsi
Menentukan mapel apa saja yang diajarkan pada setiap kelas dan berapa JP per minggu.

### Field
| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| id | uuid | Ya | Auto-generated |
| tahun_ajaran_id | uuid | Ya | Relasi tahun ajaran |
| semester | string | Ya | Ganjil/Genap |
| kelas_id | uuid | Ya | Relasi kelas |
| mapel_id | uuid | Ya | Relasi mapel |
| jp_per_minggu | number | Ya | Contoh: 5 |
| guru_utama_id | uuid | Ya | Relasi guru |
| team_teaching | boolean | Tidak | Default false |
| guru_tambahan_ids | array | Tidak | Jika team teaching aktif |
| ruang_khusus_id | uuid | Tidak | Jika butuh lab/ruang tertentu |

---

## 11.8 Pengaturan Hari dan Jam Pelajaran

### Deskripsi
Mengatur kerangka waktu jadwal sekolah.

### Field
| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| mode_hari | enum | Ya | 5_hari / 6_hari |
| hari_aktif | array | Ya | Senin-Sabtu atau Senin-Jumat |
| jam_mulai | time | Ya | Contoh: 07:30 |
| durasi_jp | number | Ya | Menit per JP |
| jumlah_jp_per_hari | object | Ya | Contoh: Senin 8 JP |
| istirahat | array | Tidak | Slot istirahat |

### Contoh jumlah_jp_per_hari

```json
{
  "senin": 8,
  "selasa": 8,
  "rabu": 8,
  "kamis": 8,
  "jumat": 5,
  "sabtu": 6
}
```

---

## 11.9 Ketersediaan Guru

### Deskripsi
Mengatur waktu ketika guru dapat atau tidak dapat mengajar.

### Field
| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| id | uuid | Ya | Auto-generated |
| guru_id | uuid | Ya | Relasi guru |
| hari | string | Ya | Senin-Sabtu |
| jp_ke | number | Ya | JP ke-n |
| tersedia | boolean | Ya | true/false |
| catatan | string | Tidak | Alasan opsional |

---

## 11.10 Constraint Jadwal

### Constraint Wajib MVP

1. Guru tidak boleh mengajar dua kelas pada slot yang sama.
2. Kelas tidak boleh memiliki dua mapel pada slot yang sama.
3. Ruang tidak boleh digunakan dua kelas pada slot yang sama.
4. Alokasi JP per mapel per kelas harus terpenuhi.
5. Jadwal hanya ditempatkan pada hari aktif.
6. Jadwal tidak ditempatkan pada slot istirahat.
7. Guru hanya ditempatkan pada slot tersedia.

### Constraint Opsional MVP

1. Maksimal mengajar berturut-turut.
2. Team teaching.
3. Minimal JP guru.
4. Maksimal JP guru.
5. Hindari mapel yang sama terlalu banyak dalam satu hari.

### Constraint Fase Lanjutan

1. Preferensi guru.
2. Blok mapel tertentu, misalnya PJOK tidak di jam terakhir.
3. Prioritas mapel tertentu di pagi hari.
4. Penempatan ruang khusus otomatis.
5. Optimasi distribusi beban harian.

---

## 11.11 Generate Jadwal Otomatis

### Deskripsi
Sistem menghasilkan jadwal berdasarkan master data dan constraint.

### Input
1. Data kelas.
2. Data guru.
3. Data mapel.
4. Struktur kurikulum.
5. Ketersediaan guru.
6. Pengaturan hari dan jam.
7. Constraint jadwal.

### Output
1. Jadwal per kelas.
2. Jadwal per guru.
3. Jadwal semua kelas.
4. Status bentrok.
5. Daftar slot gagal ditempatkan.
6. Rekap beban kerja guru.

### Status Generate
| Status | Arti |
|---|---|
| success | Jadwal berhasil dibuat penuh |
| partial | Sebagian jadwal berhasil, sebagian gagal |
| failed | Jadwal gagal dibuat karena data/constraint tidak memungkinkan |

---

## 11.12 Edit Manual Jadwal

### Deskripsi
User dapat mengubah hasil generate secara manual.

### Requirement
1. Klik slot jadwal untuk edit.
2. Sistem menampilkan modal edit.
3. User dapat mengganti guru, mapel, ruang, hari, atau JP.
4. Sistem mengecek bentrok sebelum simpan.
5. Jika bentrok, sistem menampilkan peringatan.

---

## 11.13 Beban Kerja Guru

### Deskripsi
Sistem menghitung total JP guru berdasarkan jadwal yang tersusun.

### Indikator Status
| Status | Kondisi |
|---|---|
| Terpenuhi | Total JP >= minimal JP |
| Kurang | Total JP < minimal JP |
| Melebihi Maksimal | Total JP > maksimal JP jika maksimal diisi |
| Belum Terjadwal | Guru belum memiliki jadwal |

---

## 11.14 Export Excel

### Output Excel
1. Jadwal per kelas.
2. Jadwal per guru.
3. Jadwal semua kelas.
4. Rekap beban kerja guru.
5. Daftar bentrok atau masalah.

### Format File
```text
AutoJadwal_2026-2027_Ganjil.xlsx
```

---

## 11.15 Export PDF

### Output PDF
1. Jadwal per kelas siap cetak.
2. Jadwal per guru siap cetak.
3. Rekap beban kerja guru.

### Format File
```text
AutoJadwal_2026-2027_Ganjil.pdf
```

---

# 12. Data Model

## 12.1 Tabel users

| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | Primary key |
| email | string | Unique |
| password_hash | string | Disimpan oleh auth provider/backend |
| name | string | Nama user |
| role | string | waka_kurikulum |
| created_at | timestamp | Auto |
| updated_at | timestamp | Auto |

## 12.2 Tabel academic_years

| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | Primary key |
| name | string | Contoh: 2026/2027 |
| semester | string | Ganjil/Genap |
| is_active | boolean | Tahun aktif |
| created_at | timestamp | Auto |

## 12.3 Tabel teachers

| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | Primary key |
| name | string | Nama guru |
| code | string | Kode guru |
| primary_subject_id | uuid | Relasi subjects |
| min_weekly_hours | number | Minimal JP |
| max_weekly_hours | number | Maksimal JP opsional |
| is_certified | boolean | Status sertifikasi |
| is_active | boolean | Status aktif |
| created_at | timestamp | Auto |
| updated_at | timestamp | Auto |

## 12.4 Tabel subjects

| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | Primary key |
| name | string | Nama mapel |
| code | string | Kode mapel |
| group_name | string | Kelompok mapel |
| is_active | boolean | Status aktif |

## 12.5 Tabel classes

| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | Primary key |
| grade | string | Tingkat |
| name | string | Nama kelas |
| homeroom_teacher_id | uuid | Opsional |
| default_room_id | uuid | Opsional |
| is_active | boolean | Status aktif |

## 12.6 Tabel rooms

| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | Primary key |
| name | string | Nama ruang |
| type | string | classroom/lab/field/etc |
| capacity | number | Opsional |
| is_active | boolean | Status aktif |

## 12.7 Tabel curriculum_allocations

| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | Primary key |
| academic_year_id | uuid | Relasi academic_years |
| class_id | uuid | Relasi classes |
| subject_id | uuid | Relasi subjects |
| weekly_hours | number | JP per minggu |
| main_teacher_id | uuid | Guru utama |
| team_teaching | boolean | Team teaching aktif/tidak |
| additional_teacher_ids | json | Daftar guru tambahan |
| special_room_id | uuid | Opsional |

## 12.8 Tabel schedule_settings

| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | Primary key |
| academic_year_id | uuid | Relasi academic_years |
| school_days_mode | string | 5_days/6_days |
| active_days | json | Daftar hari aktif |
| start_time | time | Jam mulai |
| lesson_duration_minutes | number | Durasi JP |
| daily_lesson_counts | json | Jumlah JP per hari |
| breaks | json | Daftar slot istirahat |
| max_consecutive_hours | number | Opsional |
| allow_team_teaching | boolean | Default false |

## 12.9 Tabel teacher_availability

| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | Primary key |
| teacher_id | uuid | Relasi teachers |
| day | string | Hari |
| lesson_number | number | JP ke-n |
| is_available | boolean | Tersedia/tidak |
| note | string | Opsional |

## 12.10 Tabel schedules

| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | Primary key |
| academic_year_id | uuid | Relasi academic_years |
| class_id | uuid | Relasi classes |
| subject_id | uuid | Relasi subjects |
| teacher_ids | json | Mendukung team teaching |
| room_id | uuid | Relasi rooms |
| day | string | Hari |
| lesson_number | number | JP ke-n |
| source | string | auto/manual |
| created_at | timestamp | Auto |
| updated_at | timestamp | Auto |

## 12.11 Tabel generation_logs

| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | Primary key |
| academic_year_id | uuid | Relasi academic_years |
| status | string | success/partial/failed |
| total_slots | number | Total kebutuhan slot |
| placed_slots | number | Slot berhasil |
| failed_slots | number | Slot gagal |
| issues | json | Daftar masalah |
| created_at | timestamp | Auto |

---

# 13. API Specification

Base URL:

```text
/api
```

## 13.1 Auth

### POST /auth/login

Request:
```json
{
  "email": "waka@example.com",
  "password": "password"
}
```

Response:
```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "Waka Kurikulum",
    "email": "waka@example.com",
    "role": "waka_kurikulum"
  }
}
```

### POST /auth/logout

Response:
```json
{
  "message": "Logged out"
}
```

---

## 13.2 Dashboard

### GET /dashboard/summary

Response:
```json
{
  "total_teachers": 32,
  "total_classes": 18,
  "total_subjects": 14,
  "schedule_status": "partial",
  "teachers_below_min_hours": 3,
  "unfilled_slots": 4
}
```

---

## 13.3 Teachers

### GET /teachers

Query:
```text
?page=1&limit=20&search=ahmad
```

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Ahmad",
      "code": "G01",
      "primary_subject_id": "uuid",
      "min_weekly_hours": 24,
      "max_weekly_hours": 32,
      "is_certified": true,
      "is_active": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

### POST /teachers

Request:
```json
{
  "name": "Ahmad",
  "code": "G01",
  "primary_subject_id": "uuid",
  "min_weekly_hours": 24,
  "max_weekly_hours": 32,
  "is_certified": true
}
```

### PUT /teachers/:id

Request:
```json
{
  "name": "Ahmad Fauzi",
  "min_weekly_hours": 24
}
```

### DELETE /teachers/:id

Response:
```json
{
  "message": "Teacher deactivated"
}
```

---

## 13.4 Subjects

### GET /subjects
### POST /subjects
### PUT /subjects/:id
### DELETE /subjects/:id

Request POST:
```json
{
  "name": "Matematika",
  "code": "MTK",
  "group_name": "Umum"
}
```

---

## 13.5 Classes

### GET /classes
### POST /classes
### PUT /classes/:id
### DELETE /classes/:id

Request POST:
```json
{
  "grade": "VII",
  "name": "VII A",
  "homeroom_teacher_id": "uuid",
  "default_room_id": "uuid"
}
```

---

## 13.6 Rooms

### GET /rooms
### POST /rooms
### PUT /rooms/:id
### DELETE /rooms/:id

Request POST:
```json
{
  "name": "R-01",
  "type": "classroom",
  "capacity": 32
}
```

---

## 13.7 Curriculum Allocations

### GET /curriculum-allocations

Query:
```text
?academic_year_id=uuid&class_id=uuid
```

### POST /curriculum-allocations

Request:
```json
{
  "academic_year_id": "uuid",
  "class_id": "uuid",
  "subject_id": "uuid",
  "weekly_hours": 5,
  "main_teacher_id": "uuid",
  "team_teaching": false,
  "additional_teacher_ids": [],
  "special_room_id": null
}
```

### PUT /curriculum-allocations/:id
### DELETE /curriculum-allocations/:id

---

## 13.8 Schedule Settings

### GET /schedule-settings

Query:
```text
?academic_year_id=uuid
```

### PUT /schedule-settings

Request:
```json
{
  "academic_year_id": "uuid",
  "school_days_mode": "6_days",
  "active_days": ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu"],
  "start_time": "07:30",
  "lesson_duration_minutes": 40,
  "daily_lesson_counts": {
    "senin": 8,
    "selasa": 8,
    "rabu": 8,
    "kamis": 8,
    "jumat": 5,
    "sabtu": 6
  },
  "breaks": [
    {
      "day": "senin",
      "after_lesson": 4,
      "duration_minutes": 20
    }
  ],
  "max_consecutive_hours": 3,
  "allow_team_teaching": true
}
```

---

## 13.9 Teacher Availability

### GET /teacher-availability

Query:
```text
?teacher_id=uuid
```

### PUT /teacher-availability/bulk

Request:
```json
{
  "teacher_id": "uuid",
  "availability": [
    {
      "day": "senin",
      "lesson_number": 1,
      "is_available": true
    },
    {
      "day": "senin",
      "lesson_number": 2,
      "is_available": false,
      "note": "Tugas luar"
    }
  ]
}
```

---

## 13.10 Generate Schedule

### POST /schedules/generate

Request:
```json
{
  "academic_year_id": "uuid",
  "mode": "safe",
  "overwrite_existing": false
}
```

Response success:
```json
{
  "status": "success",
  "message": "Schedule generated successfully",
  "summary": {
    "total_slots": 420,
    "placed_slots": 420,
    "failed_slots": 0,
    "teacher_conflicts": 0,
    "class_conflicts": 0,
    "room_conflicts": 0
  },
  "issues": []
}
```

Response partial:
```json
{
  "status": "partial",
  "message": "Schedule generated partially",
  "summary": {
    "total_slots": 420,
    "placed_slots": 408,
    "failed_slots": 12,
    "teacher_conflicts": 0,
    "class_conflicts": 0,
    "room_conflicts": 0
  },
  "issues": [
    {
      "type": "unplaced_subject",
      "class": "VII A",
      "subject": "Matematika",
      "teacher": "Ahmad",
      "remaining_hours": 2,
      "reason": "No available slot matching teacher availability"
    }
  ]
}
```

---

## 13.11 Schedules

### GET /schedules

Query:
```text
?academic_year_id=uuid&view=class&class_id=uuid
```

Query view:
| View | Fungsi |
|---|---|
| class | Jadwal per kelas |
| teacher | Jadwal per guru |
| all | Jadwal semua |

### POST /schedules

Manual create schedule.

Request:
```json
{
  "academic_year_id": "uuid",
  "class_id": "uuid",
  "subject_id": "uuid",
  "teacher_ids": ["uuid"],
  "room_id": "uuid",
  "day": "senin",
  "lesson_number": 1
}
```

### PUT /schedules/:id

Request:
```json
{
  "teacher_ids": ["uuid"],
  "room_id": "uuid",
  "day": "selasa",
  "lesson_number": 2
}
```

### DELETE /schedules/:id

Response:
```json
{
  "message": "Schedule deleted"
}
```

---

## 13.12 Validate Schedule

### POST /schedules/validate

Request:
```json
{
  "academic_year_id": "uuid",
  "class_id": "uuid",
  "subject_id": "uuid",
  "teacher_ids": ["uuid"],
  "room_id": "uuid",
  "day": "senin",
  "lesson_number": 1,
  "ignore_schedule_id": null
}
```

Response valid:
```json
{
  "valid": true,
  "conflicts": []
}
```

Response conflict:
```json
{
  "valid": false,
  "conflicts": [
    {
      "type": "teacher_conflict",
      "message": "Guru Ahmad sudah mengajar di VIII B pada Senin JP 1"
    }
  ]
}
```

---

## 13.13 Workload

### GET /workloads

Query:
```text
?academic_year_id=uuid
```

Response:
```json
{
  "data": [
    {
      "teacher_id": "uuid",
      "teacher_name": "Ahmad",
      "subjects": ["Matematika"],
      "total_hours": 26,
      "min_weekly_hours": 24,
      "max_weekly_hours": 32,
      "status": "fulfilled"
    },
    {
      "teacher_id": "uuid",
      "teacher_name": "Siti",
      "subjects": ["IPA"],
      "total_hours": 22,
      "min_weekly_hours": 24,
      "max_weekly_hours": 32,
      "status": "below_minimum"
    }
  ]
}
```

---

## 13.14 Export

### GET /exports/excel

Query:
```text
?academic_year_id=uuid&type=all
```

Type:
| Type | Output |
|---|---|
| class | Jadwal per kelas |
| teacher | Jadwal per guru |
| workload | Beban kerja |
| all | Semua data |

Response:
```json
{
  "file_url": "https://example.com/files/AutoJadwal_2026_2027.xlsx"
}
```

### GET /exports/pdf

Query:
```text
?academic_year_id=uuid&type=all
```

Response:
```json
{
  "file_url": "https://example.com/files/AutoJadwal_2026_2027.pdf"
}
```

---

# 14. Scheduler Algorithm Design

## 14.1 Tujuan Algoritma

Algoritma scheduler bertugas menempatkan kebutuhan pelajaran ke dalam slot hari dan JP dengan mematuhi constraint yang telah ditentukan.

Algoritma MVP tidak harus sempurna seperti solver profesional, tetapi harus cukup baik untuk menghasilkan jadwal awal yang rapi dan dapat diedit manual.

## 14.2 Pendekatan MVP

Gunakan pendekatan hybrid:

1. **Constraint Checking** untuk memastikan tidak ada bentrok.
2. **Greedy Placement** untuk menempatkan slot paling sulit lebih dahulu.
3. **Backtracking terbatas** jika terjadi dead-end.
4. **Scoring Function** untuk memilih slot terbaik.

Pendekatan ini lebih realistis untuk MVP dibanding langsung memakai algoritma optimasi kompleks.

---

## 14.3 Struktur Data Internal

### Slot
```ts
type Slot = {
  day: string;
  lessonNumber: number;
};
```

### TeachingRequirement
```ts
type TeachingRequirement = {
  classId: string;
  subjectId: string;
  teacherIds: string[];
  roomId?: string;
  weeklyHours: number;
  remainingHours: number;
  teamTeaching: boolean;
  priorityScore: number;
};
```

### ScheduleEntry
```ts
type ScheduleEntry = {
  classId: string;
  subjectId: string;
  teacherIds: string[];
  roomId: string;
  day: string;
  lessonNumber: number;
};
```

---

## 14.4 Hard Constraints

Hard constraints adalah aturan yang tidak boleh dilanggar.

1. Satu guru tidak boleh mengajar lebih dari satu kelas pada slot yang sama.
2. Satu kelas tidak boleh memiliki lebih dari satu mapel pada slot yang sama.
3. Satu ruang tidak boleh dipakai lebih dari satu kelas pada slot yang sama.
4. Slot harus berada pada hari aktif.
5. Slot tidak boleh berada pada waktu istirahat.
6. Guru harus tersedia pada slot tersebut.
7. Team teaching berarti semua guru yang terlibat harus tersedia pada slot yang sama.

---

## 14.5 Soft Constraints

Soft constraints adalah aturan yang sebaiknya dipenuhi, tetapi bisa dikompromikan jika sulit.

1. Hindari guru mengajar terlalu banyak JP berturut-turut.
2. Hindari mapel yang sama terlalu banyak dalam satu hari untuk kelas yang sama.
3. Sebarkan beban guru secara merata.
4. Prioritaskan guru bersertifikasi agar memenuhi minimal JP.
5. Hindari jam terakhir untuk mapel tertentu jika pengaturan tersedia.

---

## 14.6 Priority Sorting

Sebelum penempatan, sistem mengurutkan kebutuhan mengajar dari yang paling sulit.

Faktor prioritas:

1. Guru memiliki ketersediaan terbatas.
2. Mapel membutuhkan ruang khusus.
3. JP per minggu tinggi.
4. Team teaching aktif.
5. Guru harus memenuhi minimal JP.
6. Kelas memiliki slot terbatas.

Contoh rumus sederhana:

```text
priorityScore =
  (teacherAvailabilityDifficulty * 30) +
  (specialRoomRequired * 20) +
  (teamTeaching * 20) +
  (weeklyHours * 5) +
  (certificationNeed * 15)
```

Semakin tinggi skor, semakin awal ditempatkan.

---

## 14.7 Slot Scoring

Saat memilih slot, sistem memberi skor pada setiap slot kandidat.

Contoh penilaian:

```text
slotScore = 100
  - teacherConsecutivePenalty
  - sameSubjectSameDayPenalty
  - teacherDailyLoadPenalty
  - classDailyLoadPenalty
  + morningPreferenceBonus
```

Slot dengan skor tertinggi dipilih.

---

## 14.8 Pseudocode Generate Jadwal

```pseudo
function generateSchedule(data):
    slots = buildAvailableSlots(data.scheduleSettings)
    requirements = buildTeachingRequirements(data.curriculumAllocations)
    requirements = sortByPriority(requirements)
    schedule = []
    issues = []

    for requirement in requirements:
        remaining = requirement.weeklyHours

        while remaining > 0:
            candidateSlots = findCandidateSlots(requirement, slots, schedule, data.constraints)

            if candidateSlots is empty:
                issues.push({
                    type: "unplaced_subject",
                    requirement: requirement,
                    remainingHours: remaining,
                    reason: "No valid slot found"
                })
                break

            bestSlot = chooseBestSlot(candidateSlots, requirement, schedule, data.constraints)

            entry = createScheduleEntry(requirement, bestSlot)
            schedule.push(entry)
            remaining = remaining - 1

    validation = validateFullSchedule(schedule, data.constraints)

    return {
        schedule,
        validation,
        issues,
        status: determineStatus(schedule, requirements, issues)
    }
```

---

## 14.9 Fungsi Validasi

```pseudo
function isValidPlacement(requirement, slot, schedule, constraints):
    if slot is break time:
        return false

    if class already has schedule at slot:
        return false

    for teacher in requirement.teacherIds:
        if teacher already teaches at slot:
            return false

        if teacher is unavailable at slot:
            return false

        if exceedsMaxConsecutiveHours(teacher, slot, schedule):
            return false

    if room already used at slot:
        return false

    return true
```

---

## 14.10 Backtracking Terbatas

Jika requirement gagal ditempatkan, sistem dapat mencoba backtracking terbatas.

Strategi:

1. Ambil requirement yang gagal.
2. Cari slot yang hampir valid.
3. Identifikasi jadwal yang menghalangi.
4. Coba pindahkan jadwal penghalang ke slot lain.
5. Batasi percobaan, misalnya maksimal 50 langkah.
6. Jika tetap gagal, catat sebagai issue.

Pseudocode:

```pseudo
function limitedBacktrack(failedRequirement):
    blockers = findPotentialBlockers(failedRequirement)

    for blocker in blockers:
        alternativeSlots = findAlternativeSlots(blocker)

        for altSlot in alternativeSlots:
            if isValidPlacement(blocker, altSlot):
                move(blocker, altSlot)

                if canPlace(failedRequirement):
                    place(failedRequirement)
                    return true

                rollback()

    return false
```

---

## 14.11 Handling Team Teaching

Jika team teaching aktif:

1. Satu jadwal memiliki lebih dari satu guru.
2. Semua guru harus tersedia pada slot yang sama.
3. Semua guru dianggap memiliki beban JP yang sama untuk slot tersebut, kecuali nanti ada pengaturan pembagian beban khusus.
4. Validasi bentrok dilakukan untuk semua guru.

Contoh:

```json
{
  "class_id": "VII A",
  "subject_id": "IPA",
  "teacher_ids": ["guru_1", "guru_2"],
  "day": "senin",
  "lesson_number": 3
}
```

---

## 14.12 Handling Maksimal Mengajar Berturut-turut

Contoh aturan: maksimal 3 JP berturut-turut.

Saat menempatkan guru pada slot baru:

1. Cek slot sebelum dan sesudah.
2. Hitung rangkaian JP berturut-turut guru pada hari yang sama.
3. Jika melebihi batas, slot dianggap tidak valid.

Pseudocode:

```pseudo
function exceedsMaxConsecutiveHours(teacher, slot, schedule, maxConsecutive):
    consecutive = countConsecutiveLessons(teacher, slot, schedule)
    return consecutive > maxConsecutive
```

---

## 14.13 Output Issue dari Scheduler

Contoh issue:

```json
{
  "type": "unplaced_subject",
  "severity": "high",
  "class": "VIII B",
  "subject": "Matematika",
  "teacher": "Ahmad",
  "remaining_hours": 2,
  "reason": "Guru tidak tersedia pada slot yang tersisa",
  "suggestion": "Tambah ketersediaan guru atau naikkan batas maksimal mengajar berturut-turut"
}
```

Jenis issue:

| Type | Penjelasan |
|---|---|
| unplaced_subject | Mapel belum bisa ditempatkan penuh |
| teacher_conflict | Guru bentrok |
| class_conflict | Kelas bentrok |
| room_conflict | Ruang bentrok |
| workload_below_minimum | Beban guru belum memenuhi minimal |
| constraint_too_strict | Constraint terlalu ketat |

---

# 15. Validasi dan Error Handling

## 15.1 Validasi Sebelum Generate

Sistem harus mengecek:

1. Apakah tahun ajaran aktif sudah ada.
2. Apakah data guru ada.
3. Apakah data kelas ada.
4. Apakah data mapel ada.
5. Apakah struktur kurikulum sudah lengkap.
6. Apakah setiap alokasi JP memiliki guru.
7. Apakah pengaturan hari dan jam sudah diisi.
8. Apakah total kebutuhan JP tidak melebihi kapasitas slot kelas.

## 15.2 Contoh Error

| Kondisi | Pesan |
|---|---|
| Guru belum diisi | Data guru belum tersedia |
| Kelas belum diisi | Data kelas belum tersedia |
| JP melebihi kapasitas | Total JP kelas VII A melebihi slot tersedia |
| Guru tidak tersedia | Guru Ahmad tidak memiliki slot tersedia cukup |
| Constraint terlalu ketat | Jadwal gagal dibuat karena aturan terlalu ketat |

---

# 16. Non-Functional Requirements

## 16.1 Performance

1. Generate jadwal untuk satu sekolah idealnya selesai dalam beberapa detik hingga kurang dari satu menit, tergantung ukuran data.
2. Halaman jadwal harus tetap responsif untuk ratusan slot.
3. Export Excel/PDF harus berjalan stabil.

## 16.2 Security

1. Login wajib untuk mengakses sistem.
2. Password tidak disimpan dalam bentuk plaintext.
3. Endpoint API harus membutuhkan autentikasi.
4. Validasi input dilakukan di frontend dan backend.
5. Data sekolah tidak boleh bisa diakses publik tanpa izin.

## 16.3 Reliability

1. Sistem menyimpan hasil generate.
2. Edit manual tidak boleh hilang saat refresh.
3. Sebelum overwrite jadwal lama, tampilkan konfirmasi.
4. Simpan log setiap proses generate.

## 16.4 Usability

1. Tampilan harus sederhana dan mudah dipahami.
2. Gunakan bahasa Indonesia.
3. Gunakan istilah yang familiar untuk sekolah.
4. Tampilkan error dengan bahasa yang jelas.
5. Sediakan indikator progres saat generate jadwal.

---

# 17. Rekomendasi Tech Stack

## 17.1 Frontend

Rekomendasi:

1. React + Vite
2. TypeScript
3. Tailwind CSS
4. shadcn/ui atau komponen UI sejenis
5. TanStack Table untuk tabel data
6. React Hook Form untuk form
7. Zod untuk validasi

## 17.2 Backend

Pilihan sederhana dan cocok untuk online single-school:

1. Cloudflare Pages Functions
2. Cloudflare D1 untuk database SQL
3. Cloudflare R2 opsional untuk file export

Alternatif:

1. Supabase jika ingin auth dan database lebih cepat disiapkan.
2. Firebase jika ingin realtime dan setup cepat.
3. Node.js + PostgreSQL jika butuh fleksibilitas lebih tinggi.

## 17.3 Export

1. Excel: `xlsx` atau `exceljs`
2. PDF: `pdf-lib`, `puppeteer`, atau HTML-to-PDF service

## 17.4 Scheduler Engine

Untuk MVP:

1. Implementasi TypeScript custom algorithm.
2. Simpan logic scheduler di backend agar data konsisten.
3. Pisahkan fungsi constraint checker agar mudah diuji.

Untuk fase lanjutan:

1. Gunakan OR-Tools melalui service Python terpisah jika ingin optimasi tingkat lanjut.
2. Tambahkan scoring dan rekomendasi otomatis.

---

# 18. Struktur Folder Rekomendasi

```text
autojadwal/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── teachers/
│   │   ├── subjects/
│   │   ├── classes/
│   │   ├── rooms/
│   │   ├── curriculum/
│   │   ├── schedule-settings/
│   │   ├── scheduler/
│   │   ├── schedules/
│   │   ├── workloads/
│   │   └── exports/
│   ├── lib/
│   ├── types/
│   └── utils/
├── functions/
│   └── api/
├── db/
│   ├── schema.sql
│   └── seed.sql
├── docs/
│   └── PRD_AutoJadwal.md
└── package.json
```

---

# 19. Sprint Breakdown Development

## Sprint 0 — Persiapan Project

Durasi: 2-3 hari

### Tujuan
Menyiapkan fondasi project agar development terarah.

### Task
1. Setup repository.
2. Setup React + Vite + TypeScript.
3. Setup Tailwind CSS.
4. Setup komponen UI dasar.
5. Setup routing.
6. Setup layout utama dengan sidebar.
7. Setup database schema awal.
8. Setup environment variable.

### Output
1. Project bisa dijalankan lokal.
2. Layout dasar tersedia.
3. Struktur folder rapi.

---

## Sprint 1 — Auth dan Dashboard

Durasi: 1 minggu

### Tujuan
Membuat akses masuk dan halaman awal sistem.

### Task
1. Halaman login.
2. Auth session.
3. Protected route.
4. Dashboard summary.
5. Card statistik.
6. Alert data belum lengkap.

### Output
1. User bisa login.
2. User masuk ke dashboard.
3. Dashboard menampilkan ringkasan awal.

---

## Sprint 2 — Master Data Dasar

Durasi: 1-2 minggu

### Tujuan
Membuat CRUD data utama.

### Task
1. CRUD guru.
2. CRUD mapel.
3. CRUD kelas/rombel.
4. CRUD ruang.
5. Search dan filter sederhana.
6. Validasi form.
7. Empty state dan loading state.

### Output
1. User bisa mengelola guru, mapel, kelas, dan ruang.
2. Data tersimpan di database.

---

## Sprint 3 — Struktur Kurikulum dan Alokasi JP

Durasi: 1 minggu

### Tujuan
Membuat pengaturan kebutuhan mengajar per kelas.

### Task
1. CRUD struktur kurikulum.
2. Pilih kelas.
3. Tambah mapel per kelas.
4. Atur JP per minggu.
5. Pilih guru utama.
6. Aktifkan team teaching opsional.
7. Pilih guru tambahan.
8. Validasi total JP per kelas.

### Output
1. User bisa menentukan mapel dan JP per kelas.
2. User bisa menetapkan guru pengampu.

---

## Sprint 4 — Pengaturan Jadwal dan Ketersediaan Guru

Durasi: 1 minggu

### Tujuan
Membuat sistem constraint dasar.

### Task
1. Setting mode 5 hari / 6 hari.
2. Setting hari aktif.
3. Setting jam mulai.
4. Setting durasi JP.
5. Setting jumlah JP per hari.
6. Setting istirahat.
7. Setting maksimal mengajar berturut-turut.
8. UI ketersediaan guru berbentuk grid.

### Output
1. User bisa mengatur kerangka jadwal.
2. User bisa mengatur kapan guru tersedia/tidak tersedia.

---

## Sprint 5 — Scheduler Engine MVP

Durasi: 2 minggu

### Tujuan
Membuat algoritma generate jadwal otomatis versi awal.

### Task
1. Build slot generator.
2. Build teaching requirement generator.
3. Build hard constraint checker.
4. Build greedy placement.
5. Build slot scoring.
6. Build limited backtracking sederhana.
7. Generate jadwal dari data nyata.
8. Simpan hasil generate ke database.
9. Simpan generation log.
10. Tampilkan issue jika ada slot gagal.

### Output
1. Sistem bisa generate jadwal otomatis.
2. Sistem mencegah bentrok guru, kelas, dan ruang.
3. Sistem menampilkan hasil generate.

---

## Sprint 6 — Tampilan Jadwal dan Edit Manual

Durasi: 1-2 minggu

### Tujuan
Membuat jadwal mudah dibaca dan diedit.

### Task
1. Tampilan jadwal per kelas.
2. Tampilan jadwal per guru.
3. Tampilan jadwal semua.
4. Modal edit slot jadwal.
5. Validasi bentrok saat edit.
6. Delete slot jadwal.
7. Tandai jadwal auto/manual.

### Output
1. User bisa membaca jadwal dengan jelas.
2. User bisa mengedit jadwal manual.
3. Sistem memberi peringatan jika ada bentrok.

---

## Sprint 7 — Beban Kerja Guru

Durasi: 1 minggu

### Tujuan
Menghitung dan menampilkan beban kerja guru.

### Task
1. Hitung total JP per guru.
2. Bandingkan dengan minimal JP.
3. Bandingkan dengan maksimal JP jika tersedia.
4. Tampilkan status terpenuhi/kurang/lebih.
5. Filter guru kurang JP.
6. Highlight guru sertifikasi yang kurang JP.

### Output
1. User bisa melihat rekap beban kerja guru.
2. Guru yang belum memenuhi minimal JP mudah ditemukan.

---

## Sprint 8 — Export Excel dan PDF

Durasi: 1 minggu

### Tujuan
Menyediakan output siap dibagikan.

### Task
1. Export jadwal per kelas ke Excel.
2. Export jadwal per guru ke Excel.
3. Export rekap beban kerja ke Excel.
4. Export jadwal ke PDF.
5. Format tabel rapi dan siap cetak.
6. Nama file otomatis berdasarkan tahun ajaran.

### Output
1. File Excel dapat diunduh.
2. File PDF dapat diunduh.
3. Format output layak dibagikan ke guru/kepala sekolah.

---

## Sprint 9 — Testing, Polish, dan Deploy

Durasi: 1 minggu

### Tujuan
Menyiapkan aplikasi agar layak digunakan.

### Task
1. Testing CRUD.
2. Testing generate jadwal.
3. Testing constraint.
4. Testing edit manual.
5. Testing export.
6. Perbaikan UI/UX.
7. Deploy online.
8. Dokumentasi penggunaan singkat.

### Output
1. MVP siap digunakan.
2. User memiliki panduan dasar.
3. Aplikasi online.

---

# 20. Acceptance Criteria

## 20.1 Master Data

1. User dapat menambah, mengedit, dan menonaktifkan guru.
2. User dapat menambah, mengedit, dan menonaktifkan mapel.
3. User dapat menambah, mengedit, dan menonaktifkan kelas.
4. User dapat menambah, mengedit, dan menonaktifkan ruang.

## 20.2 Pengaturan Jadwal

1. User dapat memilih mode 5 hari atau 6 hari.
2. User dapat menentukan hari aktif.
3. User dapat menentukan jumlah JP per hari.
4. User dapat menentukan durasi JP.
5. User dapat menentukan maksimal mengajar berturut-turut.
6. User dapat mengaktifkan atau menonaktifkan team teaching.

## 20.3 Generate Jadwal

1. Sistem dapat membuat jadwal dari data struktur kurikulum.
2. Sistem tidak membuat guru bentrok pada slot yang sama.
3. Sistem tidak membuat kelas bentrok pada slot yang sama.
4. Sistem tidak membuat ruang bentrok pada slot yang sama.
5. Sistem menampilkan issue jika ada kebutuhan yang gagal ditempatkan.

## 20.4 Edit Manual

1. User dapat mengubah slot jadwal.
2. Sistem memvalidasi bentrok saat edit.
3. Sistem menampilkan peringatan jika perubahan menyebabkan konflik.

## 20.5 Beban Kerja

1. Sistem menghitung total JP setiap guru.
2. Sistem menampilkan status terpenuhi/kurang.
3. Sistem menandai guru yang belum memenuhi minimal JP.

## 20.6 Export

1. User dapat export Excel.
2. User dapat export PDF.
3. File export berisi jadwal dan rekap beban kerja.

---

# 21. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Constraint terlalu ketat | Jadwal gagal dibuat | Tampilkan issue dan saran pelonggaran aturan |
| Data master tidak lengkap | Generate gagal | Validasi sebelum generate |
| Algoritma belum optimal | Hasil perlu banyak edit manual | Gunakan scoring dan backtracking bertahap |
| User bingung menginput data | Adopsi rendah | Buat flow setup bertahap |
| Export tidak rapi | Sulit dibagikan | Siapkan template export khusus |
| Jadwal berubah setelah manual edit | Data tidak konsisten | Validasi setiap perubahan |

---

# 22. Roadmap Lanjutan

## Versi 1.1

1. Import data dari Excel.
2. Template struktur kurikulum.
3. Copy data dari semester sebelumnya.
4. Lock jadwal tertentu agar tidak berubah saat regenerate.
5. Drag and drop jadwal.

## Versi 1.2

1. Role kepala sekolah untuk melihat laporan.
2. Role guru untuk melihat jadwal pribadi.
3. Notifikasi jadwal ke guru.
4. Export per guru otomatis.

## Versi 2.0

1. Multi sekolah.
2. Sistem SaaS berlangganan.
3. Optimasi algoritma menggunakan solver.
4. AI assistant untuk memberi saran perbaikan jadwal.
5. Integrasi data eksternal.

---

# 23. Prompt Awal untuk Codex

Gunakan prompt berikut untuk memulai implementasi:

```text
Saya ingin membangun web app bernama AutoJadwal untuk membantu Waka Kurikulum menyusun jadwal pelajaran dan pembagian beban kerja guru.

Baca dan ikuti PRD_AutoJadwal.md secara menyeluruh.

Prioritas implementasi MVP:
1. React + Vite + TypeScript.
2. UI modern, rapi, responsif, bahasa Indonesia.
3. Sidebar utama: Dashboard, Master Data, Pengaturan Jadwal, Generate Jadwal, Jadwal Pelajaran, Beban Kerja Guru, Export.
4. Buat struktur data dan komponen yang siap dihubungkan ke backend.
5. Implementasikan halaman master data guru, mapel, kelas, ruang.
6. Implementasikan struktur kurikulum/alokasi JP.
7. Implementasikan pengaturan 5 hari/6 hari, jam pelajaran, dan constraint maksimal mengajar berturut-turut.
8. Implementasikan scheduler engine MVP berbasis greedy + constraint checking.
9. Pastikan tidak ada guru, kelas, dan ruang yang bentrok pada slot yang sama.
10. Tambahkan halaman rekap beban kerja guru.
11. Tambahkan export Excel dan PDF bila memungkinkan.

Jangan membuat sidebar di dalam sidebar. Gunakan satu sidebar utama saja. Buat kode rapi, modular, dan mudah dikembangkan.
```

---

# 24. Kesimpulan

AutoJadwal adalah produk yang realistis dan bermanfaat untuk membantu Waka Kurikulum mengurangi beban kerja dalam menyusun jadwal pelajaran. Fokus MVP sebaiknya bukan langsung menghasilkan jadwal sempurna, melainkan menghasilkan jadwal awal yang valid, minim bentrok, mudah diedit, dan dilengkapi rekap beban kerja guru.

Dengan pendekatan bertahap, AutoJadwal dapat dimulai sebagai aplikasi internal satu sekolah, lalu berkembang menjadi produk SaaS untuk banyak sekolah jika kebutuhan dan validasi pengguna sudah kuat.
