# Backend Contract Draft AutoJadwal

Dokumen ini adalah rancangan awal kontrak backend untuk UI prototype AutoJadwal. Target backend sesuai PRD: Laravel, PostgreSQL, Laravel Excel, dan DomPDF.

## Prinsip API

- Base path: `/api/v1`
- Auth: session atau token berbasis Laravel Sanctum
- Response JSON standar:

```json
{
  "data": {},
  "meta": {},
  "errors": []
}
```

- Format tanggal: `YYYY-MM-DD`
- Format waktu: `HH:mm`
- Satuan durasi jadwal: JP

## Modul Endpoint

### Authentication

| Method | Path | Keterangan |
| --- | --- | --- |
| POST | `/auth/login` | Login Waka Kurikulum |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Profil user aktif |

### Master Data

| Method | Path | Keterangan |
| --- | --- | --- |
| GET | `/teachers` | List guru |
| POST | `/teachers` | Tambah guru |
| PUT | `/teachers/{id}` | Update guru |
| GET | `/classes` | List kelas/rombel |
| POST | `/classes` | Tambah kelas |
| GET | `/subjects` | List mapel |
| POST | `/subjects` | Tambah mapel |
| GET | `/rooms` | List ruangan |
| POST | `/rooms` | Tambah ruangan |

### Kurikulum

| Method | Path | Keterangan |
| --- | --- | --- |
| GET | `/curriculum-structures` | List struktur kurikulum |
| POST | `/curriculum-structures` | Simpan alokasi JP |
| PUT | `/curriculum-structures/{id}` | Update alokasi |
| POST | `/curriculum-structures/duplicate` | Duplikasi struktur semester/tahun |

### Rules dan Availability

| Method | Path | Keterangan |
| --- | --- | --- |
| GET | `/schedule-rules` | Ambil rule aktif |
| PUT | `/schedule-rules` | Update rule |
| GET | `/teacher-availability` | Availability guru |
| POST | `/teacher-availability` | Simpan availability |

### Scheduler

| Method | Path | Keterangan |
| --- | --- | --- |
| GET | `/scheduler/preflight` | Cek kesiapan data |
| POST | `/scheduler/generate` | Generate jadwal penuh |
| POST | `/scheduler/repair` | Repair jadwal bermasalah |
| POST | `/scheduler/partial-regenerate` | Generate sebagian slot |
| GET | `/scheduler/jobs/{id}` | Status job generate |

### Timetable

| Method | Path | Keterangan |
| --- | --- | --- |
| GET | `/timetables` | Jadwal aktif |
| PUT | `/timetables/slots/{id}` | Update slot manual |
| POST | `/timetables/slots/{id}/lock` | Lock slot |
| DELETE | `/timetables/slots/{id}/lock` | Unlock slot |
| POST | `/timetables/drafts` | Simpan draft |
| POST | `/timetables/publish` | Publish jadwal final |

### Workload

| Method | Path | Keterangan |
| --- | --- | --- |
| GET | `/workloads/teachers` | Rekap JP guru |
| GET | `/workloads/violations` | Guru kurang/lebih JP |

### Import dan Export

| Method | Path | Keterangan |
| --- | --- | --- |
| GET | `/imports/templates/{type}` | Download template Excel |
| POST | `/imports/validate` | Validasi file Excel |
| POST | `/imports/commit` | Commit hasil import |
| POST | `/exports` | Buat export PDF/Excel |
| GET | `/exports/{id}` | Download file export |

### Reporting

| Method | Path | Keterangan |
| --- | --- | --- |
| GET | `/reports/conflicts` | Laporan bentrok |
| GET | `/reports/workload` | Laporan beban kerja |
| GET | `/reports/availability` | Pelanggaran availability |
| GET | `/reports/empty-slots` | Slot kosong |

## Entity Minimum

### Teacher

```json
{
  "id": 1,
  "code": "G-001",
  "name": "Ari Prasetyo",
  "subject_ids": [1],
  "minimum_weekly_periods": 24,
  "maximum_preferred_periods": 28,
  "additional_task_periods": 0,
  "status": "active"
}
```

### Timetable Slot

```json
{
  "id": 1001,
  "classroom_group_id": 1,
  "teacher_id": 1,
  "subject_id": 1,
  "room_id": null,
  "day": "monday",
  "period": 1,
  "start_time": "07:00",
  "end_time": "07:45",
  "is_locked": true,
  "conflict_flags": []
}
```

### Scheduler Request

```json
{
  "academic_year": "2026/2027",
  "semester": "ganjil",
  "mode": "full",
  "preserve_locked_slots": true,
  "target_class_ids": [],
  "ignore_soft_constraints": false
}
```

## Scheduler Result

```json
{
  "job_id": "sch_20260527_001",
  "status": "completed",
  "score": 86,
  "hard_constraint_score": 97,
  "soft_constraint_score": 74,
  "conflict_count": 3,
  "locked_slot_count": 28,
  "repair_iterations": 2
}
```

## Prioritas Implementasi Backend

1. Auth dan master data.
2. Struktur kurikulum dan availability.
3. Import Excel validate/commit.
4. Scheduler preflight.
5. Generate draft jadwal.
6. Manual timetable editor dan lock slot.
7. Workload dan reporting.
8. Export PDF/Excel.
