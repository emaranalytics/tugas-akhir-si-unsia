#!/usr/bin/env python
"""Generator per-bagian (.docx) — Universitas Siber Asia.

Berbeda dengan `build_thesis_docx.py` yang merangkai SELURUH naskah menjadi satu
berkas, skrip ini memecah naskah yang sama menjadi SATU berkas .docx untuk
SETIAP bagian (cover, front matter, Bab I–V, daftar pustaka, lampiran).

Tujuan: tiap bagian dapat ditinjau / dikirim terpisah, namun secara kolektif
memuat *seluruh* konten dan gaya yang identik dengan
`draft/Draft-Tugas-Akhir-Muhammadridwan.docx`. Semua logika pemformatan
(styles, page setup, parser markdown, caption SEQ, tabel 3-garis, blok kode,
gambar, daftar pustaka IEEE, lampiran) dipakai ulang langsung dari
`build_thesis_docx.py` agar konsisten dengan naskah gabungan.

Cara pakai:
    conda activate gradio   # butuh python-docx + Pillow
    python tools/build_bab_docx.py

Hasil: draft/bab/<NN-NamaBagian>.docx (satu per bagian, terurut sesuai naskah).
Tiap berkas membawa flag updateFields → buka di Word (Ctrl+A, F9) atau
LibreOffice (Tools → Update → Update All) untuk mengisi Daftar Isi/Tabel/Gambar.
"""
from __future__ import annotations

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH

import build_thesis_docx as T

OUT_DIR = T.ROOT / "draft" / "bab"


# --------------------------------------------------------------------------- #
# Helper konstruksi dokumen standalone
# --------------------------------------------------------------------------- #
def _new_doc(page_fmt):
    """Dokumen baru ber-style UNSIA + penomoran halaman per-berkas.

    page_fmt: "none" (cover, tanpa footer), "roman" (front matter),
    atau "decimal" (bab/back matter).
    """
    doc = Document()
    T.setup_styles(doc)
    section = doc.sections[0]
    T.setup_page(section)
    if page_fmt == "roman":
        T.set_page_number_format(section, "lowerRoman", start=1)
        T.footer_page_number(section, WD_ALIGN_PARAGRAPH.CENTER)
    elif page_fmt == "decimal":
        T.set_page_number_format(section, "decimal", start=1)
        T.footer_page_number(section, WD_ALIGN_PARAGRAPH.CENTER)
    # "none": cover tanpa nomor halaman
    return doc


def _chapter_builder(md_file, label, title, chap_no):
    """Kembalikan fungsi pembangun isi satu bab dari file markdown."""

    def build(doc):
        T._SEQ_RESET_SEEN.clear()
        T.heading(doc, f"{label} {title}", level=1)
        md_text = (T.BAB_DIR / md_file).read_text(encoding="utf-8")
        captions: list[str] = []
        T.render_markdown(doc, md_text, captions, chap_no)

    return build


def _daftar_builder(title, switches):
    def build(doc):
        T.build_daftar(doc, title, switches, "")

    return build


# --------------------------------------------------------------------------- #
# Daftar bagian — urutan & isi mencerminkan Draft-Tugas-Akhir gabungan
# (out_name, page_fmt, builder)
# --------------------------------------------------------------------------- #
PARTS = [
    ("00-Sampul", "none", T.build_cover),
    ("01-Halaman-Pernyataan-Orisinalitas", "roman", T.build_orisinalitas),
    ("02-Halaman-Pengesahan", "roman", T.build_pengesahan),
    ("03-Abstrak", "roman", T.build_abstrak),
    ("04-Kata-Pengantar", "roman", T.build_kata_pengantar),
    ("05-Daftar-Isi", "roman", _daftar_builder("DAFTAR ISI", 'TOC \\o "1-3" \\h \\z \\u')),
    ("06-Daftar-Tabel", "roman", _daftar_builder("DAFTAR TABEL", 'TOC \\h \\z \\c "Tabel"')),
    ("07-Daftar-Gambar", "roman", _daftar_builder("DAFTAR GAMBAR", 'TOC \\h \\z \\c "Gambar"')),
    (
        "08-Bab-1-Pendahuluan",
        "decimal",
        _chapter_builder("bab-1-pendahuluan.md", "BAB I", "PENDAHULUAN", 1),
    ),
    (
        "09-Bab-2-Landasan-Teori",
        "decimal",
        _chapter_builder("bab-2-landasan-teori.md", "BAB II", "LANDASAN TEORI", 2),
    ),
    (
        "10-Bab-3-Implementasi-Metode",
        "decimal",
        _chapter_builder(
            "bab-3-implementasi-metode.md", "BAB III", "IMPLEMENTASI METODE USULAN", 3
        ),
    ),
    (
        "11-Bab-4-Hasil-Analisa",
        "decimal",
        _chapter_builder("bab-4-hasil-analisa.md", "BAB IV", "HASIL DAN ANALISA", 4),
    ),
    (
        "12-Bab-5-Kesimpulan",
        "decimal",
        _chapter_builder("bab-5-kesimpulan.md", "BAB V", "KESIMPULAN", 5),
    ),
    ("13-Daftar-Pustaka", "decimal", T.build_daftar_pustaka),
    ("14-Lampiran", "decimal", T.build_lampiran),
]


def build_one(out_name, page_fmt, builder):
    doc = _new_doc(page_fmt)
    builder(doc)
    T.set_update_fields_on_open(doc)
    out_path = OUT_DIR / f"{out_name}.docx"
    doc.save(out_path)
    return out_path


def main():
    T._SEQ_RESET_SEEN.clear()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for out_name, page_fmt, builder in PARTS:
        out_path = build_one(out_name, page_fmt, builder)
        print(f"✓ {out_path.relative_to(T.ROOT)}")
    print(
        f"\nSelesai — {len(PARTS)} berkas di {OUT_DIR.relative_to(T.ROOT)}/ "
        "(gaya & isi identik dengan naskah gabungan).\n"
        "Buka di Word (Ctrl+A, F9) atau LibreOffice (Tools → Update → Update All) "
        "untuk mengisi Daftar Isi/Tabel/Gambar."
    )


if __name__ == "__main__":
    main()
