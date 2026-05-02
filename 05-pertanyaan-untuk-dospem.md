# Daftar Pertanyaan untuk Dosen Pembimbing

**Dokumen**: 05 — Pertanyaan untuk Dospem
**Versi**: 1.0
**Status**: Draft untuk Bimbingan

---

## 1. Pengantar

Dokumen ini berisi daftar pertanyaan terstruktur yang akan diajukan kepada
dosen pembimbing pada sesi bimbingan Zoom pertama. Tujuan dokumen ini
adalah memastikan bahwa keputusan kunci terkait pemilihan arah judul,
ruang lingkup, metodologi, dan jadwal bimbingan dapat diambil dalam satu
sesi sehingga proses penyusunan proposal Tugas Akhir dapat segera
dimulai.

Pertanyaan disusun berdasarkan urutan kepentingan: dimulai dari
pertanyaan strategis (penentuan arah), kemudian pertanyaan teknis
(scope dan metodologi), diakhiri dengan pertanyaan administratif
(format, timeline, dan risiko). Mahasiswa diharapkan telah membaca
seluruh dokumen 00 hingga 04 sebelum sesi bimbingan dimulai, dan
sebaiknya mengirimkan dokumen tersebut kepada dosen pembimbing
sehari sebelumnya (H-1) agar diskusi dapat berjalan efisien.

Catatan: tidak semua pertanyaan harus ditanyakan dalam satu sesi.
Mahasiswa dipersilakan memprioritaskan pertanyaan yang paling kritis
terlebih dahulu, dan menunda pertanyaan administratif untuk sesi
berikutnya jika waktu tidak mencukupi.

---

## 2. Pertanyaan Strategis (Pemilihan Arah)

Bagian ini berisi pertanyaan paling kritis. Jawaban dari pertanyaan
di bagian ini akan menentukan arah keseluruhan Tugas Akhir.

1. **Preferensi arah judul**: Apakah Bapak/Ibu lebih condong ke topik
   rancang bangun sistem secara umum (Arah A — aman, klasik), topik
   dengan kontribusi kuantitatif terukur pada arsitektur multi-agen
   (Arah B — rekomendasi utama mahasiswa), atau topik keamanan dengan
   fokus pertahanan terhadap prompt injection (Arah C — kontemporer
   namun lebih riskan)?

2. **Familiaritas terhadap topik AI/LLM**: Apakah Bapak/Ibu terbuka
   untuk membimbing topik yang melibatkan Large Language Model dan
   arsitektur multi-agen yang relatif baru, atau lebih nyaman dengan
   topik klasik Rekayasa Perangkat Lunak (RPL) seperti rancang bangun
   sistem informasi konvensional?

3. **Preferensi metodologi penelitian**: Apakah Bapak/Ibu memiliki
   preferensi antara metodologi kualitatif (rancang bangun deskriptif,
   studi kasus) dengan metodologi kuantitatif (eksperimen terkontrol
   dengan pengukuran metrik), atau kombinasi keduanya?

4. **Tingkat kontribusi yang diharapkan**: Apakah Tugas Akhir tingkat
   sarjana cukup dengan demonstrasi penerapan konsep yang sudah ada,
   atau perlu menunjukkan kontribusi orisinal terhadap pengembangan
   suatu pola arsitektur?

5. **Kesesuaian dengan bidang minat dospem**: Apakah salah satu dari
   tiga arah ini sejalan dengan bidang penelitian atau pengajaran
   yang sedang Bapak/Ibu tekuni? Hal ini akan memudahkan proses
   bimbingan dari sisi kedalaman pembahasan.

6. **Rekomendasi Arah B**: Mahasiswa secara pribadi merekomendasikan
   Arah B (Tool Registry & Multi-Agent). Apakah Bapak/Ibu setuju
   dengan rekomendasi ini, atau ada pertimbangan lain yang membuat
   Arah A atau C lebih cocok untuk kondisi mahasiswa saat ini?

7. **Topik alternatif**: Jika ketiga arah yang diajukan kurang cocok,
   apakah Bapak/Ibu memiliki saran arah lain yang masih dalam konteks
   project zerlo.id namun lebih sesuai dengan ekspektasi Bapak/Ibu?

---

## 3. Pertanyaan Scope dan Batasan

Bagian ini bertujuan menetapkan ruang lingkup Tugas Akhir agar tidak
terlalu sempit (kurang substansi) maupun terlalu luas (tidak selesai
tepat waktu).

1. **Jumlah agen yang dimasukkan**: Project zerlo.id memiliki sebelas
   agen. Berapa jumlah agen yang ideal untuk dimasukkan ke ruang
   lingkup Tugas Akhir? Apakah cukup tiga sampai empat agen yang
   paling representatif, atau seluruh sebelas agen perlu dibahas?

2. **Jumlah modul yang dimasukkan**: Project zerlo.id memiliki tiga
   puluh delapan modul fungsional. Modul mana saja yang perlu
   dijadikan sampel dalam pembahasan? Apakah ada saran kriteria
   pemilihan modul (misalnya berdasarkan kompleksitas, atau
   berdasarkan keterkaitan dengan agen tertentu)?

3. **Studi kasus pengguna riil**: Apakah Tugas Akhir harus mencakup
   pengujian dengan pengguna nyata (UAT pada UMKM Indonesia yang
   sebenarnya), atau cukup pengujian teknis fungsional dan
   eksperimental tanpa melibatkan pengguna eksternal?

4. **Surat pernyataan dari pemilik project**: Mengingat zerlo.id
   adalah project yang memiliki potensi komersial dan mungkin akan
   memiliki co-founder di masa depan, apakah perlu dilampirkan
   surat keterangan kepemilikan atau surat pernyataan tidak
   keberatan dari pihak terkait?

5. **Bahasa skripsi**: Apakah skripsi harus ditulis dalam Bahasa
   Indonesia secara penuh, atau diperbolehkan menggunakan istilah
   teknis dalam Bahasa Inggris (misalnya tool registry, agent
   orchestration, LLM, prompt injection) dengan padanan istilah
   Indonesia di footnote atau glosarium?

6. **Cakupan stack teknologi**: Apakah seluruh stack teknologi
   (FastAPI, Pydantic AI 1.83.0, MongoDB, Atlas Vector Search, GCP,
   Cloud Tasks, Pub/Sub, Redis, dan lain-lain) perlu dibahas
   mendalam, atau cukup dibahas yang relevan dengan kontribusi
   utama Tugas Akhir?

7. **Batasan waktu pengembangan**: Project zerlo.id sudah berjalan
   selama beberapa bulan dan masih dalam tahap beta. Apakah seluruh
   fitur yang sudah ada boleh dijadikan bagian Tugas Akhir, atau
   harus ada batasan tegas terkait fitur mana yang dikerjakan
   sebelum dan sesudah pengajuan judul?

---

## 4. Pertanyaan Metodologi dan Pengujian

Bagian ini bertujuan menentukan pendekatan ilmiah yang digunakan
dalam Tugas Akhir.

1. **Metode pengujian yang diharapkan**: Metode pengujian apa yang
   diharapkan oleh Bapak/Ibu? Apakah black-box testing, white-box
   testing, User Acceptance Testing (UAT), eksperimen kuantitatif
   terkontrol, atau kombinasi dari beberapa metode tersebut?

2. **Pengujian Arah B (Multi-Agent)**: Untuk Arah B, apakah
   eksperimen kuantitatif yang mengukur jumlah token, latency, dan
   accuracy sudah cukup sebagai bukti kontribusi, atau masih perlu
   ditambah dengan UAT untuk validasi dari sisi pengguna?

3. **Pembanding (baseline vs treatment)**: Apakah Tugas Akhir harus
   memiliki pembanding eksperimen (baseline tanpa optimasi
   dibandingkan dengan treatment yang sudah dioptimasi), atau cukup
   pendekatan deskriptif yang menjelaskan implementasi tanpa
   pembanding?

4. **Etika red-team simulation (Arah C)**: Untuk Arah C yang
   melibatkan simulasi serangan prompt injection, apakah pengujian
   adversarial diperbolehkan secara etika akademik? Apakah perlu
   persetujuan etik (ethical clearance) khusus, mengingat sistem
   yang diuji adalah sistem yang sedang dikembangkan sendiri?

5. **Jumlah sampel data**: Berapa minimum jumlah data atau jumlah
   eksperimen yang harus dijalankan agar hasil dianggap valid
   secara statistik? Apakah perlu uji statistik formal (misalnya
   t-test, ANOVA), atau cukup statistik deskriptif?

6. **Reproducibility**: Apakah seluruh eksperimen harus dapat
   direproduksi oleh penguji? Jika ya, apakah perlu disediakan
   script eksperimen dan dataset yang terversioning?

7. **Validitas internal dan eksternal**: Bagaimana cara menjamin
   validitas internal (eksperimen mengukur apa yang seharusnya
   diukur) dan validitas eksternal (hasil dapat digeneralisasi)
   dalam konteks Tugas Akhir ini?

---

## 5. Pertanyaan Format dan Output

Bagian ini bertujuan menentukan format akhir laporan dan output
Tugas Akhir.

1. **Template laporan kampus**: Apakah ada template resmi laporan
   Tugas Akhir yang harus diikuti? Berapa minimum halaman per bab,
   dan berapa total minimum halaman laporan secara keseluruhan?

2. **Diagram yang wajib**: Diagram apa saja yang wajib disertakan
   dalam laporan? Apakah harus menggunakan UML klasik (use case
   diagram, activity diagram, sequence diagram, class diagram),
   atau diperbolehkan menggunakan notasi modern seperti Mermaid
   atau C4 Model untuk arsitektur sistem?

3. **User Manual dan Dokumentasi API**: Apakah perlu menyertakan
   User Manual yang formal dan/atau Dokumentasi API (misalnya
   OpenAPI/Swagger) sebagai lampiran laporan?

4. **Video demo dan live demo**: Apakah saat sidang akhir mahasiswa
   harus menyiapkan video demo, melakukan live demo, atau cukup
   menjelaskan dengan slide dan screenshot?

5. **Pengunggahan source code**: Apakah source code project wajib
   diunggah ke repositori institusi (misalnya GitLab kampus), atau
   cukup tetap di repositori pribadi mahasiswa? Bagaimana
   pengaturan akses (privat/publik) dan lisensinya?

---

## 6. Pertanyaan Timeline dan Bimbingan

Bagian ini bertujuan menyepakati ritme bimbingan agar Tugas Akhir
selesai tepat waktu.

1. **Frekuensi bimbingan**: Apakah Bapak/Ibu mengharapkan bimbingan
   mingguan, dua mingguan, atau sesuai kebutuhan? Berapa lama
   durasi bimbingan yang ideal per sesi?

2. **Format bimbingan**: Apakah bimbingan dilaksanakan secara Zoom
   (online), tatap muka di kampus, atau kombinasi keduanya? Apakah
   ada hari/jam khusus yang Bapak/Ibu sediakan untuk bimbingan?

3. **Deadline kunci**: Kapan deadline untuk pengajuan proposal,
   seminar proposal, dan sidang akhir? Apakah ada deadline
   internal dospem yang lebih awal dari deadline kampus?

4. **Format draft yang diterima**: Apakah Bapak/Ibu lebih nyaman
   menerima draft per-bab secara bertahap, atau menunggu draft
   lengkap sekaligus? Apakah diperbolehkan mengirim draft dalam
   format Markdown atau harus dalam format Microsoft Word/PDF?

5. **Lead time review**: Berapa minggu lead time yang dibutuhkan
   Bapak/Ibu untuk memberikan review terhadap draft yang
   dikirimkan? Hal ini penting untuk perencanaan timeline
   mahasiswa.

---

## 7. Pertanyaan Risiko dan Rencana Cadangan

Bagian ini bertujuan mengantisipasi kemungkinan kendala yang dapat
muncul di tengah proses Tugas Akhir.

1. **Kemungkinan pivot judul**: Jika di tengah jalan ditemukan
   blocker teknis (misalnya pustaka pydantic-ai mengalami breaking
   change yang signifikan, atau Atlas Vector Search bermasalah),
   apakah pivot atau penyesuaian judul masih dimungkinkan? Sampai
   tahap apa pivot masih dapat diterima?

2. **Pengalaman bimbingan sebelumnya**: Apakah Bapak/Ibu pernah
   memiliki mahasiswa bimbingan yang gagal sidang? Jika ya, apa
   penyebab umumnya, dan bagaimana mahasiswa dapat menghindari
   kesalahan serupa?

3. **Red flag yang harus dihindari**: Apa saja red flag atau
   tanda-tanda peringatan yang menurut Bapak/Ibu harus dihindari
   selama proses Tugas Akhir? Misalnya scope creep, terlalu
   bergantung pada pustaka eksternal, atau hal lainnya.

4. **Rencana darurat**: Jika project zerlo.id mengalami masalah
   bisnis (misalnya beta testing dihentikan), apakah skenario
   tersebut akan mempengaruhi keberlanjutan Tugas Akhir? Bagaimana
   rencana cadangannya?

---

## 8. Tips Membawa Bimbingan

Berikut adalah catatan praktis yang dapat membantu mahasiswa
memaksimalkan sesi bimbingan.

1. **Kirim dokumen H-1**: Kirim seluruh file dokumen 00 hingga 05
   ke dosen pembimbing minimal satu hari sebelum sesi bimbingan
   dalam format PDF atau zip. Hal ini memberi waktu dospem untuk
   membaca dan menyiapkan masukan.

2. **Siapkan demo singkat lima menit**: Siapkan live demo project
   zerlo.id yang dapat dijalankan dalam waktu lima menit. Demo
   sebaiknya menunjukkan fitur paling representatif, misalnya satu
   skenario interaksi dengan agen Conversational beserta hasil
   tool yang dieksekusi.

3. **Catat keputusan secara tertulis**: Selama sesi bimbingan,
   catat setiap keputusan yang diambil di section 10 dokumen ini.
   Setelah sesi selesai, kirim notulen ke dospem untuk
   konfirmasi.

4. **Minta tanda tangan persetujuan**: Jika memungkinkan, minta
   tanda tangan digital atau persetujuan tertulis (via email)
   dari dospem terkait judul yang disepakati. Hal ini menjadi
   bukti formal sebelum pengajuan ke akademik.

5. **Konfirmasi jadwal berikutnya**: Sebelum sesi berakhir,
   konfirmasi tanggal, jam, dan agenda bimbingan berikutnya agar
   jelas bagi kedua belah pihak.

6. **Bersikap profesional dan terbuka**: Dengarkan masukan dospem
   dengan terbuka, bahkan jika berbeda dengan rekomendasi
   mahasiswa. Sampaikan argumen secara terstruktur, tetapi tetap
   hormati keputusan akhir dospem.

7. **Siapkan alternatif jawaban**: Untuk setiap pertanyaan yang
   diajukan, siapkan minimal dua alternatif jawaban dari sisi
   mahasiswa. Hal ini menunjukkan kesiapan dan memudahkan dospem
   mengambil keputusan.

---

## 9. Checklist Sebelum Zoom

- [ ] Seluruh file dokumen 00 hingga 05 sudah dibaca ulang oleh
      mahasiswa
- [ ] Seluruh file sudah dikonversi ke PDF dan dikirim ke dospem
      via email minimal H-1
- [ ] Demo project zerlo.id sudah disiapkan dan diuji jalan
- [ ] Lingkungan Zoom sudah diuji (mikrofon, kamera, screen share)
- [ ] Notebook fisik atau dokumen digital untuk mencatat sudah
      disiapkan
- [ ] Section 10 dokumen ini sudah disiapkan dalam keadaan
      kosong dan siap diisi
- [ ] Pertanyaan kritis (Section 2, 3) sudah diberi tanda
      prioritas
- [ ] Mahasiswa hadir di Zoom minimal lima menit sebelum waktu
      yang disepakati
- [ ] Backup koneksi internet (tethering) sudah disiapkan
- [ ] Pakaian formal sudah disiapkan (kemeja, sepatu)

---

## 10. Catatan untuk Diisi Saat Bimbingan

Bagian ini sengaja dikosongkan untuk diisi oleh mahasiswa selama
atau setelah sesi bimbingan. Setelah sesi selesai, salin isian ini
dan kirim ke dospem sebagai notulen untuk konfirmasi.

---

**Tanggal Bimbingan**: ____________________________________

**Waktu Bimbingan**: _____________________________________

**Nama Dosen Pembimbing**: _______________________________

**Format Bimbingan (Zoom/Tatap Muka)**: ___________________

---

### 10.1. Keputusan Judul Tugas Akhir

**Arah yang Disepakati**: (A / B / C / Lainnya)

**Judul Final yang Disepakati**:

> ____________________________________________________
>
> ____________________________________________________

**Alasan Pemilihan**:

> ____________________________________________________
>
> ____________________________________________________

---

### 10.2. Scope yang Disepakati

- Jumlah agen yang akan dibahas: __________________
- Jumlah modul yang akan dijadikan sampel: __________________
- Pengujian dengan pengguna riil: (Ya / Tidak)
- Surat pernyataan dari pemilik project: (Diperlukan / Tidak)
- Bahasa skripsi: (Indonesia penuh / Hybrid)

**Catatan tambahan terkait scope**:

> ____________________________________________________
>
> ____________________________________________________

---

### 10.3. Metodologi yang Disepakati

- Metode pengujian: __________________
- Pendekatan eksperimen: (Baseline vs Treatment / Deskriptif)
- Jumlah minimum sampel data: __________________
- Uji statistik formal: (Ya / Tidak, jenis: _____________ )

**Catatan tambahan terkait metodologi**:

> ____________________________________________________
>
> ____________________________________________________

---

### 10.4. Format dan Output yang Disepakati

- Template laporan: __________________
- Diagram wajib: __________________
- User Manual: (Diperlukan / Tidak)
- Dokumentasi API: (Diperlukan / Tidak)
- Video demo: (Diperlukan / Tidak)
- Pengunggahan source code: (Diperlukan / Tidak, lokasi: _________)

---

### 10.5. To-Do Berikutnya untuk Mahasiswa

1. ____________________________________________________
2. ____________________________________________________
3. ____________________________________________________
4. ____________________________________________________
5. ____________________________________________________

**Deadline penyelesaian to-do**: __________________

---

### 10.6. Jadwal Bimbingan Berikutnya

**Tanggal**: __________________

**Jam**: __________________

**Format**: (Zoom / Tatap Muka)

**Agenda**:

> ____________________________________________________
>
> ____________________________________________________

**Materi yang harus disiapkan mahasiswa sebelum sesi berikutnya**:

> ____________________________________________________
>
> ____________________________________________________

---

### 10.7. Catatan Tambahan dari Dospem

> ____________________________________________________
>
> ____________________________________________________
>
> ____________________________________________________
>
> ____________________________________________________

---

### 10.8. Konfirmasi dan Tanda Tangan

**Mahasiswa**: ______________________ Tanggal: __________

**Dosen Pembimbing**: ______________________ Tanggal: __________

---

**Akhir Dokumen**

Setelah sesi bimbingan selesai, mahasiswa wajib:

1. Melengkapi seluruh isian Section 10 dalam waktu maksimal 24 jam
2. Mengirim notulen yang sudah diisi ke dosen pembimbing untuk
   konfirmasi via email
3. Menyimpan salinan notulen yang sudah dikonfirmasi sebagai bukti
   kesepakatan formal
4. Memulai pengerjaan to-do yang disepakati segera setelah notulen
   dikonfirmasi
