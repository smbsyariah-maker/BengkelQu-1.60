# Panduan Build APK Android di GitHub Actions (Bengkel Qu 1.60)

Workflow GitHub Actions untuk membuat berkas **APK Android (`.apk`)** telah disiapkan di file:  
📁 `.github/workflows/build-apk.yml`

---

## 🚀 Cara Menjalankan Build APK di GitHub

### Opsi 1: Otomatis Setiap Kali Push Code
Setiap kali Anda melakukan `git push` ke cabang `main` atau `master` di GitHub, workflow akan otomatis berjalan dan meng-compile berkas APK Android.

---

### Opsi 2: Jalankan Manual (1-Klik via GitHub Web)
1. Buka repositori proyek Anda di **GitHub**.
2. Klik tab **Actions** di menu atas repositori.
3. Di panel sebelah kiri, pilih workflow:  
   👉 **`Build Android APK (Bengkel Qu 1.60)`**
4. Di sebelah kanan, klik tombol **Run workflow**.
5. Pilih cabang (misal: `main`) dan klik **Run workflow**.

---

## 📥 Cara Mengunduh File APK Hasil Build

1. Tunggu proses build selesai (biasanya memakan waktu 3–5 menit untuk pertama kali).
2. Klik riwayat proses workflow yang baru saja selesai (bertanda centang hijau ✅).
3. Gulir ke bawah ke bagian **Artifacts**.
4. Klik **`BengkelQu-1.60-APK`** untuk mengunduh file `.zip` yang berisi:
   - 📱 **`BengkelQu-1.60-debug.apk`**
5. Ekstrak dan kirim file `.apk` ke ponsel Android Anda via WhatsApp/Google Drive/Kabel USB, lalu buka dan klik **Pasang / Install**!

---

## 🏷️ Rilis Resmi dengan Tag Versi (Opsional)
Jika Anda ingin membuat rilis resmi di halaman **Releases** GitHub:
```bash
git tag v1.60
git push origin v1.60
```
GitHub Actions akan otomatis membuat rilis publik dan melampirkan berkas APK yang siap diunduh siapa saja secara langsung.

---

## ⚙️ Spesifikasi Teknis Workflow
- **Framework**: Vite + React 19 + Tailwind CSS
- **Mobile Runtime**: Capacitor Android (Google WebView Native Wrapper)
- **Target OS**: Android 8.0 (API 26) hingga Android 14+ (API 34)
- **JDK**: Temurin OpenJDK 17
- **Gradle**: Gradle 8.x
