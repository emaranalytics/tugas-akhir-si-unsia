#!/usr/bin/env python
"""Render diagram Mermaid (.mmd) → PNG via mermaid.ink, lalu commit hasilnya.

Sumber diagram disimpan sebagai `assets/diagrams/*.mmd` (versi-terkontrol, mudah
diedit). Script ini merendernya ke PNG beresolusi tinggi memakai layanan
mermaid.ink (tidak butuh Node/Chromium lokal). PNG hasil ikut di-commit sehingga
build naskah (`build_thesis_docx.py`) tetap deterministik dan offline.

Cara pakai:
    python tools/render_diagrams.py            # render yang berubah saja
    python tools/render_diagrams.py --force     # render ulang semua

Catatan privasi: teks diagram dikirim ke mermaid.ink (layanan eksternal). Untuk
diagram tesis hal ini umumnya aman; bila perlu sepenuhnya lokal, self-host Kroki.
"""
from __future__ import annotations

import argparse
import base64
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIAGRAM_DIR = ROOT / "assets" / "diagrams"
MERMAID_INK = "https://mermaid.ink/img/{enc}?type=png&bgColor=FFFFFF&width=1400&scale=2"
RETRIES = 4


def _fetch(url: str) -> bytes:
    last = None
    for attempt in range(RETRIES):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "thesis-builder"})
            with urllib.request.urlopen(req, timeout=40) as resp:
                return resp.read()
        except urllib.error.HTTPError as exc:
            last = exc
            if exc.code in (429, 500, 502, 503, 504) and attempt < RETRIES - 1:
                wait = 2 * (attempt + 1)
                print(f"    (HTTP {exc.code}, retry dalam {wait}s)")
                time.sleep(wait)
                continue
            raise
    raise last  # type: ignore[misc]


def render_one(mmd: Path, force: bool) -> bool:
    png = mmd.with_suffix(".png")
    if png.exists() and not force and png.stat().st_mtime >= mmd.stat().st_mtime:
        print(f"  · lewati (up-to-date): {png.relative_to(ROOT)}")
        return False
    code = mmd.read_text(encoding="utf-8")
    enc = base64.b64encode(code.encode()).decode()
    data = _fetch(MERMAID_INK.format(enc=enc))
    if not data.startswith(b"\x89PNG"):
        raise RuntimeError(f"mermaid.ink tidak mengembalikan PNG untuk {mmd.name}")
    png.write_bytes(data)
    print(f"  ✓ render: {png.relative_to(ROOT)} ({len(data) // 1024} KB)")
    return True


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--force", action="store_true", help="render ulang semua")
    args = ap.parse_args()

    DIAGRAM_DIR.mkdir(parents=True, exist_ok=True)
    sources = sorted(DIAGRAM_DIR.glob("*.mmd"))
    if not sources:
        print(f"Tidak ada .mmd di {DIAGRAM_DIR.relative_to(ROOT)}")
        return 0
    print(f"Render {len(sources)} diagram dari {DIAGRAM_DIR.relative_to(ROOT)}:")
    rendered = 0
    for mmd in sources:
        try:
            rendered += render_one(mmd, args.force)
        except Exception as exc:  # noqa: BLE001
            print(f"  ✗ gagal {mmd.name}: {exc}", file=sys.stderr)
            return 1
    print(f"Selesai. {rendered} dirender, {len(sources) - rendered} dilewati.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
