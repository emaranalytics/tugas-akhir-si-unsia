# Rule: Format Teknis Penulisan Tugas Akhir — Universitas Siber Asia

Sumber: Pedoman Teknis Penulisan TA UNSIA (Copyright © 2024)

## Ketentuan Wajib

### Panjang Naskah
- Minimal **10 halaman**, maksimal **30 halaman** (isi utama Bab I–V)
- Similarity check Turnitin: **maksimal 30%**

### Kertas & Margin
- Kertas A4, satu muka
- Margin: Atas 3cm · Bawah 3cm · **Kiri 4cm** · Kanan 3cm

### Tipografi
- Font: **Times New Roman 12** untuk seluruh naskah
- Spasi: **1.5** (kecuali abstrak: spasi 1)
- Isi tabel: font 10, spasi single
- Istilah asing/teknis dicetak *miring* (italic)

### Abstrak
- Bahasa Indonesia **dan** Bahasa Inggris (satu halaman, dua bahasa)
- Maksimal **200 kata** per bahasa, satu paragraf
- Wajib memuat: latar belakang · tujuan · metode · hasil (temuan baru) · implikasi
- Kata kunci: maksimal **5 kata/frasa**, urut abjad
- Tidak boleh mengacu pustaka, gambar, atau tabel

### Judul & Sub-judul
- Judul bab: HURUF KAPITAL SEMUA, center, bold
- Sub-judul: Center, bold, Title Case, tanpa titik di akhir
- Anak sub-judul: Rata kiri, bold, Title Case, tanpa titik
- Sub anak sub-judul: indensi 1 tab, diakhiri titik

### Penomoran Halaman
- Bagian awal (cover–daftar gambar): angka Romawi kecil (ii, iii, ...), tengah bawah
- Bab I–akhir: angka Arab (1, 2, 3, ...), awal bab di tengah bawah, halaman lain di kanan bawah

### Tabel & Gambar
- Caption **Tabel**: di **atas tabel**, center, Title Case, tanpa titik, font 12
- Caption **Gambar**: di **bawah gambar**, center, Title Case, diakhiri titik
- Contoh: `Tabel 4.1 Hasil Perbandingan Token Usage` dan `Gambar 4.1 Grafik Token per Turn.`
- Tabel: garis batas horizontal atas dan bawah saja; kolom diberi nama tegas

### Alinea & Kalimat
- Alinea baru: indentasi Tab (1,5 cm dari kiri)
- Disarankan 5–7 baris per alinea
- Bilangan/simbol yang mengawali kalimat → ditulis dengan huruf

### Perincian
- Gunakan nomor urut angka atau huruf, **bukan** bullet/pointer/garis penghubung

## Bahasa

### Wajib
- Bahasa Indonesia baku, struktur SPOK
- **Bentuk pasif** — tidak boleh menggunakan orang pertama/kedua (saya, aku, kami, engkau) di dalam isi bab
- Kata "penulis" digunakan hanya di Kata Pengantar

### Terlarang
- `"di mana"` dan `"dari"` sebagai terjemahan *where* / *of*
- Kata depan `"pada"` di depan subjek kalimat
- Awalan ke-/di- ditulis salah sebagai kata depan

### Istilah Asing
- Tulis istilah bahasa Inggris dalam tanda kurung setelah padanan Indonesia, atau tulis miring jika belum ada padanan baku
- Contoh: *tool registry*, *function calling*, *token budget*

## Pengutipan — IEEE Style

Format in-text: angka dalam kurung kotak di akhir kalimat rujukan → `[1]`, `[2]`, dst.

Format daftar pustaka (urut kemunculan di naskah):
```
[n] Inisial. NamaBelakang, "Judul artikel," Nama Jurnal/Konferensi, vol. X, no. Y, pp. Z, Bulan Tahun.
```

Contoh:
```
[1] N.F. Liu et al., "Lost in the middle: How language models use long contexts," Trans. Assoc. Comput. Linguistics, vol. 12, pp. 157–173, 2024.
[2] T. Schick et al., "Toolformer: Language models can teach themselves to use tools," in Proc. NeurIPS, 2023.
```

Aturan:
- Judul **artikel/bab**: dalam tanda kutip `"..."`
- Judul **buku/jurnal/website**: dicetak *miring*
- Kelola dengan Mendeley atau Zotero
- Nomor sitasi berurutan sesuai kemunculan di naskah

## Lampiran yang Wajib Disertakan
- Daftar Pustaka (IEEE style, Mendeley/Zotero)
- Source code (cuplikan kunci)
- Dataset eval 100 query (JSON)
- Script analisis statistik (Python)
- Bukti Turnitin (similarity ≤ 30%)
