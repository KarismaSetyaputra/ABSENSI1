# Sistem Absensi Siswa — Versi HTML / CSS / JS

Konversi penuh dari aplikasi PHP + MySQL (absen.php, daftar.php, dashboard_admin.php,
dashboard_murid.php, edit.php, hapus.php, login.php, logout.php, proses_login.php,
koneksi.php, style.css) menjadi aplikasi **HTML + CSS + JavaScript murni** yang
berjalan sepenuhnya di browser (tanpa server, tanpa database MySQL).

---

## 1. Cara Menjalankan

1. Letakkan seluruh file dalam satu folder.
2. Buka `index.html` di browser (cukup dobel-klik).
3. Login dengan akun admin bawaan:

   | Role  | Username | Password |
   |-------|----------|----------|
   | Admin | `admin`  | `admin`  |

4. Belum punya akun murid? Buka `daftar.html` (atau klik "Daftar di sini"
   saat memilih role **Murid**) untuk membuat akun murid baru.

> Catatan: untuk hasil terbaik jalankan lewat web server sederhana, misalnya
> `python -m http.server 8080`, lalu buka `http://localhost:8080/index.html`.

---

## 2. Pemetaan File PHP → HTML/JS

| File asli              | Pengganti                          | Keterangan |
|------------------------|------------------------------------|------------|
| `koneksi.php`          | `koneksi.js`                       | Koneksi MySQL diganti penyimpanan `localStorage` |
| `proses_login.php`     | `app.js` → `Auth.login()`          | Dipanggil dari `index.html` |
| `login.php`            | `index.html`                       | Form login + pemilihan role |
| `daftar.php`           | `daftar.html` + `Auth.daftar()`    | Registrasi akun murid |
| `absen.php`            | `app.js` → `Absensi.submit()`      | Simpan absensi baru |
| `dashboard_murid.php`  | `dashboard_murid.html`             | Dashboard murid |
| `dashboard_admin.php`  | `dashboard_admin.html`             | Dashboard admin |
| `edit.php`             | `edit.html` + `Absensi.perbarui()` | Ubah data absensi |
| `hapus.php`            | `hapus.html` + `Absensi.hapus()`   | Hapus data absensi + file foto |
| `logout.php`           | `logout.html` + `Auth.logout()`    | Konfirmasi logout |
| `style.css`            | `style.css`                        | CSS asli dipertahankan, ditambah beberapa aturan responsif |

---

## 3. Struktur "Database" (localStorage)

| Tabel     | Kolom                                                                      |
|-----------|----------------------------------------------------------------------------|
| `siswa`   | `id_siswa` (PK), `nis`, `password`, `nama`, `jurusan`, `alamat`             |
| `admin`   | `id_admin` (PK), `username`, `password`                                     |
| `absensi` | `id_absensi` (PK), `id_siswa`, `status`, `tanggal_absensi`, `waktu_absensi`, `foto`, `keterangan` |
| `berkas`  | nama file → data URL gambar (pengganti folder `uploads/absensi/`)           |

Password tetap disimpan dalam bentuk hash **MD5** (implementasi MD5 lengkap ada di
`app.js`), sama seperti `md5()` pada PHP.

---

## 4. Aturan yang Dipertahankan Persis

* Role-based access: halaman murid hanya untuk `role = murid`, dashboard admin hanya
  untuk `role = admin`; selain itu dialihkan ke halaman login.
* Absensi hanya boleh diisi **sekali per hari** untuk setiap murid.
* Status hanya boleh `Hadir`, `Izin`, `Sakit`.
* `Hadir` → wajib upload foto; ekstensi harus JPG/JPEG/PNG; ukuran maksimal 3MB;
  file harus benar-benar gambar (dulu `getimagesize()`, sekarang didekode di canvas).
* `Izin` / `Sakit` → wajib mengisi keterangan.
* Murid hanya dapat meng-edit / menghapus absensi **miliknya sendiri**.
* Saat menghapus absensi, file fotonya juga dihapus (dulu `unlink()`).
* Pesan sukses/gagal dikirim melalui query string `?msg=` seperti pada versi PHP.
* Semua teks yang ditampilkan dari data pengguna melewati escaping
  (pengganti `htmlspecialchars()`).

## 5. Perbedaan yang Tidak Bisa Dihindari

* `header("Location: ...")` diganti `window.location.replace()`.
* File foto tidak lagi disimpan di `uploads/absensi/`, melainkan sebagai data URL
  di dalam tabel `berkas` (localStorage). Foto yang besar otomatis diperkecil
  ke sisi maksimal 900px supaya muat di penyimpanan browser.
* Tautan "Lihat Foto" membuka modal pratinjau (bukan tab baru) karena browser
  memblokir navigasi langsung ke data URL.
* Tabel dibungkus `.table-wrap` agar halaman tidak melebar di layar ponsel.

## 6. Mereset Data

Buka konsol browser dan jalankan:

```js
Koneksi.reset();     // menghapus semua siswa, absensi, berkas; akun admin dibuat ulang
```
