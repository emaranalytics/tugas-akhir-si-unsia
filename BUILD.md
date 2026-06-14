# Build & Finalisasi Naskah Tugas Akhir

Naskah `.docx` **digenerate** dari sumber Markdown di `bab/` oleh
`tools/build_thesis_docx.py` — jangan mengedit `.docx` langsung. Setiap
perubahan isi dilakukan di `bab/*.md` lalu naskah di-build ulang.

---

## 1. Prasyarat

Butuh `python-docx` + `Pillow` (tersedia di conda env `gradio`):

```bash
conda activate gradio
```

## 2. Build naskah

```bash
python tools/build_thesis_docx.py
# → draft/Draft-Tugas-Akhir-Muhammadridwan.docx
```

Skrip merangkai: cover, lembar orisinalitas, pengesahan, abstrak dwibahasa
(`bab/abstrak.md`), kata pengantar, Daftar Isi/Tabel/Gambar (sebagai *field*),
Bab I–V (`bab/*.md`), Daftar Pustaka (24 referensi IEEE konsolidasi), dan
Lampiran A–E. Format mengikuti pedoman UNSIA (A4; margin L4/T3/B3/R3 cm; Times
New Roman 12; spasi 1,5; penomoran roman→arab).

## 3. Regenerasi aset (hanya bila datanya berubah)

```bash
python tools/render_diagrams.py        # assets/diagrams/*.mmd → *.png (mermaid.ink)
python tools/render_charts_thesis.py   # outputs/gemini-native-v2/summary.csv → assets/charts/*.png
```

Commit `.mmd` **dan** `.png` agar build tetap offline/deterministik.

---

## 4. Finalisasi di LibreOffice Writer

Daftar Isi, Daftar Tabel, Daftar Gambar, dan nomor caption (SEQ) berupa
*field* yang **kosong sampai diperbarui**. Naskah sudah ditandai
(`<w:updateFields val="true"/>`) agar pembaruan berjalan saat berkas dibuka.

### Cara termudah — buka berkasnya
Buka `draft/Draft-Tugas-Akhir-Muhammadridwan.docx`. LibreOffice menampilkan
dialog *"...update all indexes?"* → klik **Yes**. Ketiga daftar terisi otomatis.

### Bila tidak ada dialog / ingin refresh manual
LibreOffice **tidak** memakai `Ctrl+A` lalu `F9` (itu pintasan Microsoft Word).
Padanannya:

| Aksi | LibreOffice Writer |
|------|--------------------|
| Perbarui **semua** field + indeks/daftar | **Tools → Update → Update All** |
| Perbarui satu field terpilih | **F9** |
| Perbarui satu daftar saja | Klik kanan di dalam daftar → **Update Index** |
| Tampil/sembunyikan arsiran field | **Ctrl+F9** (tampilan saja) |

> Padanan `Ctrl+A → F9` (Word) = **Tools → Update → Update All** (LibreOffice).

### Sebelum cetak / export PDF
Jalankan **Tools → Update → Update All** sekali agar nomor halaman pada daftar
benar, lalu **File → Export as PDF**.

---

## 5. Langkah eksternal yang tersisa (di luar repositori)

1. Tanda tangan **Lembar Pengesahan** (pembimbing + ketua prodi).
2. **Turnitin**: unggah naskah final → simpan *similarity report* (≤30%) sebagai
   Lampiran E.
3. Perbarui field (langkah 4) lalu export PDF untuk diserahkan.
