# Panduan Deployment — Film Gigi ke Dokploy

Panduan lengkap dari lokal sampai live di Dokploy.

Aplikasi terdiri dari **2 service**:
- **app** — Next.js (storefront + admin panel)
- **db** — PostgreSQL 16

Keduanya dijalankan via `docker-compose.dokploy.yml`. Dokploy (lewat Traefik) yang menangani domain + SSL otomatis.

---

## Ringkasan Cepat

| Tahap | Aksi |
|---|---|
| 1 | Test build di lokal |
| 2 | Push project ke Git (GitHub/GitLab) |
| 3 | Buat **Compose** service di Dokploy dari repo |
| 4 | Set **Compose Path** ke `docker-compose.dokploy.yml` |
| 5 | Isi **Environment Variables** (lihat tabel di bawah) |
| 6 | Set **Domain** di tab Domains |
| 7 | Deploy → verifikasi |

---

## TAHAP 1 — Persiapan & Test di Lokal

Pastikan project bisa di-build sebelum deploy.

### 1.1 Test build Next.js
```bash
cd film-gigi
npm install
npm run build
```
Harus selesai tanpa error (muncul daftar route).

### 1.2 (Opsional) Test full stack via Docker lokal
Butuh Docker Desktop. Buat file `.env` di root project (untuk lokal saja):
```env
POSTGRES_PASSWORD=localpassword
NEXTAUTH_SECRET=secret-lokal-min-32-karakter-aaaaaaaa
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@filmgigi.com
ADMIN_PASSWORD=admin123
```
Lalu jalankan compose lokal (yang sudah expose port 3000):
```bash
docker compose up --build
```
Buka `http://localhost:3000` (storefront) dan `http://localhost:3000/login` (admin).

> Catatan: `docker-compose.yml` = untuk lokal (port 3000 di-expose).
> `docker-compose.dokploy.yml` = untuk produksi (pakai Traefik, tanpa expose port).

---

## TAHAP 2 — Push ke Git

Dokploy deploy dari Git repository.

```bash
cd film-gigi
git init
git add .
git commit -m "Initial commit - Film Gigi crowdfunding"
git branch -M main
git remote add origin https://github.com/USERNAME/film-gigi.git
git push -u origin main
```

> **PENTING:** Pastikan file `.env` (berisi password) TIDAK ikut ter-push. Sudah masuk `.gitignore`. Yang boleh ikut hanya `.env.example`.

---

## TAHAP 3 — Setup di Dokploy

### 3.1 Buat Project
1. Login ke dashboard Dokploy.
2. **Create Project** → beri nama, misal `film-gigi`.

### 3.2 Buat Service "Compose"
1. Di dalam project → **Create Service** → pilih **Compose**.
2. **Provider:** Git → hubungkan ke repository `film-gigi`.
   - Pilih branch `main`.
   - Jika repo privat, hubungkan GitHub App / tambahkan Deploy Key dulu.
3. **Compose Path:** isi dengan:
   ```
   docker-compose.dokploy.yml
   ```
   (Ini kunci — biar Dokploy pakai compose produksi, bukan yang lokal.)

### 3.3 Isi Environment Variables
Buka tab **Environment** pada service Compose, isi variabel berikut:

| Variabel | Wajib | Contoh / Keterangan |
|---|---|---|
| `POSTGRES_PASSWORD` | ✅ | Password database. Buat acak & kuat, mis. `Xk9$mPq2vL8nR4` |
| `NEXTAUTH_SECRET` | ✅ | Secret untuk enkripsi sesi login. Min 32 karakter acak (cara generate di bawah) |
| `NEXTAUTH_URL` | ✅ | URL publik **dengan https**, mis. `https://filmgigi.com` |
| `APP_DOMAIN` | ✅ | Domain **tanpa** https, mis. `filmgigi.com` — dipakai Traefik untuk routing |
| `ADMIN_EMAIL` | ✅ | Email login admin, mis. `admin@filmgigi.com` |
| `ADMIN_PASSWORD` | ✅ | Password login admin. Buat kuat — ini kredensial masuk `/login` |

**Generate `NEXTAUTH_SECRET`** (jalankan di terminal mana saja):
```bash
openssl rand -base64 32
```
Atau di PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Max 256 }))
```

Contoh isi tab Environment:
```env
POSTGRES_PASSWORD=Xk9mPq2vL8nR4tW7
NEXTAUTH_SECRET=hQ3mZ8vKpL2nR9xT4wY6bN1cD5fG7jH0aS2dF4gH6jK=
NEXTAUTH_URL=https://filmgigi.com
APP_DOMAIN=filmgigi.com
ADMIN_EMAIL=admin@filmgigi.com
ADMIN_PASSWORD=GantiDenganPasswordKuat123
```

### 3.4 Set Domain
1. Arahkan **DNS** domain Anda ke IP VPS (A record `filmgigi.com` → IP server) sebelum deploy.
2. Di service Compose → tab **Domains** → **Add Domain**:
   - **Host:** `filmgigi.com` (sama dengan `APP_DOMAIN`)
   - **Service:** `app`
   - **Port:** `3000`
   - **HTTPS:** aktifkan → pilih **Let's Encrypt** (SSL gratis otomatis)

> Traefik label di compose sudah disiapkan, tapi mengisi tab Domains memastikan Dokploy mendaftarkan sertifikat SSL.

### 3.5 Deploy
Klik **Deploy**. Dokploy akan:
1. Clone repo → build Docker image (Dockerfile multi-stage).
2. Start PostgreSQL → tunggu healthy.
3. App start → otomatis **migrate database** → **seed admin user** → jalan.

Pantau di tab **Logs**. Tunggu sampai muncul `✓ Ready` dari Next.js dan `✓ Seed selesai`.

---

## TAHAP 4 — Verifikasi

1. Buka `https://filmgigi.com` → storefront tampil.
2. Buka `https://filmgigi.com/login` → login pakai `ADMIN_EMAIL` + `ADMIN_PASSWORD`.
3. Masuk admin → coba edit konten / upload gambar / tambah donasi → cek perubahan muncul di storefront.
4. Set QRIS: menu **QRIS** → paste string QRIS statis → aktifkan → simpan. Cek di storefront input nominal → QR muncul.

---

## Yang Harus Ada di Project Dokploy (Checklist)

- [x] **1 Service tipe Compose** terhubung ke repo Git
- [x] **Compose Path** = `docker-compose.dokploy.yml`
- [x] **6 Environment Variables** terisi (tabel di atas)
- [x] **1 Domain** terdaftar → service `app`, port `3000`, SSL Let's Encrypt
- [x] **DNS** domain sudah mengarah ke IP VPS

Service `db` (PostgreSQL) dan volume (`pgdata`, `uploads`) dibuat otomatis oleh compose — tidak perlu setup manual.

---

## Catatan Penting

**Persistensi data**
- Database tersimpan di volume `pgdata` — aman saat redeploy.
- Gambar upload tersimpan di volume `uploads` (`/app/public/uploads`) — aman saat redeploy.
- Jangan hapus volume ini, atau data hilang.

**Ganti password admin**
- Tidak ada UI ganti password. Untuk mengubah: ubah `ADMIN_PASSWORD` di Environment → Redeploy. Seed akan meng-update password (idempotent, pakai `upsert`).

**Update aplikasi**
- Push perubahan ke Git → klik **Deploy** ulang di Dokploy. Migrasi DB baru (jika ada) otomatis dijalankan via `migrate deploy`.

**Backup database** (jalankan di VPS)
```bash
docker exec -t <nama-container-db> pg_dump -U postgres filmgigi > backup_$(date +%F).sql
```

---

## Alternatif: Application + Managed Postgres

Jika lebih suka memisah database (punya fitur backup bawaan Dokploy):
1. Dokploy → **Create Database** → PostgreSQL → catat connection string internal.
2. **Create Application** → Source Git → Build = Dockerfile.
3. Set `DATABASE_URL` ke connection string Postgres tadi + env lain dari tabel.
4. Override start command agar migrate jalan, atau jalankan `migrate deploy` manual via terminal Dokploy.

Untuk kasus ini, pendekatan **Compose** (di atas) lebih simpel karena migrate + seed sudah otomatis.

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| Build gagal saat `npm run build` | Cek log — biasanya error TypeScript. Jalankan `npx tsc --noEmit` di lokal dulu |
| App restart terus | Cek `DATABASE_URL` & `POSTGRES_PASSWORD` cocok. Lihat tab Logs |
| Login gagal/redirect loop | Pastikan `NEXTAUTH_URL` = `https://` + domain yang benar, dan `NEXTAUTH_SECRET` terisi |
| SSL tidak terbit | Pastikan DNS sudah mengarah ke IP VPS, lalu redeploy. Cek `APP_DOMAIN` = domain di tab Domains |
| Gambar hilang setelah redeploy | Pastikan volume `uploads` ada di compose (sudah disiapkan) |
| QR tidak muncul | Pastikan string QRIS valid (diawali `000201`) dan QRIS di-toggle aktif di admin |
