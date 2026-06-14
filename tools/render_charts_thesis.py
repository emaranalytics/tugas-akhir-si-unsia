#!/usr/bin/env python
"""Render grafik Bab IV berlabel Bahasa Indonesia dari hasil resmi.

Membaca `outputs/gemini-native-v2/summary.csv` (hasil resmi, n=558) lalu
menghasilkan PNG @180 dpi ke `assets/charts/` untuk disisipkan ke naskah.
Pipeline inti `charts.py` sengaja tidak diubah; script ini khusus naskah
(judul/label Indonesia, anotasi nilai) agar gambar konsisten dengan pedoman.

Cara pakai:
    python tools/render_charts_thesis.py
"""
from __future__ import annotations

import csv
import os
from pathlib import Path

os.environ.setdefault("MPLCONFIGDIR", str(Path("/tmp") / "matplotlib-cache"))
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parent.parent
SUMMARY = ROOT / "outputs" / "gemini-native-v2" / "summary.csv"
OUT = ROOT / "assets" / "charts"
SCEN = ["S1", "S2", "S3"]
GREY, BLUE, GREEN, SLATE = "#7f8c8d", "#2e86de", "#16a085", "#34495e"


def load() -> dict[tuple[str, str], dict[str, float]]:
    data: dict[tuple[str, str], dict[str, float]] = {}
    with SUMMARY.open(encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            data[(row["scenario"], row["mode"])] = row
    return data


def _grouped(data, metric, title, ylabel, fname, pct=False, fmt="{:.0f}"):
    base = [float(data[(s, "baseline")][metric]) for s in SCEN]
    reg = [float(data[(s, "registry")][metric]) for s in SCEN]
    if pct:
        base = [v * 100 for v in base]
        reg = [v * 100 for v in reg]
    x = range(len(SCEN))
    w = 0.36
    fig, ax = plt.subplots(figsize=(9, 5))
    b1 = ax.bar([i - w / 2 for i in x], base, w, label="Baseline", color=GREY)
    b2 = ax.bar([i + w / 2 for i in x], reg, w, label="Registry", color=BLUE)
    ax.set_title(title, fontsize=13, fontweight="bold")
    ax.set_ylabel(ylabel)
    ax.set_xlabel("Skenario (ukuran katalog tool)")
    ax.set_xticks(list(x))
    ax.set_xticklabels([f"{s}\n({t} tool)" for s, t in zip(SCEN, [30, 100, 300])])
    ax.grid(axis="y", alpha=0.25)
    ax.legend()
    for bars in (b1, b2):
        for r in bars:
            h = r.get_height()
            # epsilon kecil agar pembulatan .1f bersifat half-up (mis. 77,55 → 77,6)
            ax.annotate(fmt.format(h + 1e-6), (r.get_x() + r.get_width() / 2, h),
                        ha="center", va="bottom", fontsize=9,
                        xytext=(0, 2), textcoords="offset points")
    fig.tight_layout()
    fig.savefig(OUT / fname, dpi=180)
    plt.close(fig)
    print(f"  ✓ {fname}")


def _memory(data):
    mem = [float(data[(s, "registry")]["registry_memory_bytes"]) / 1024 for s in SCEN]
    tot = [int(data[(s, "registry")]["total_tools"]) for s in SCEN]
    fig, ax1 = plt.subplots(figsize=(9, 5))
    ax1.plot(SCEN, mem, marker="o", color=GREEN, label="Memori registry (KB)", linewidth=2)
    ax1.set_ylabel("Memori registry (KB)", color=GREEN)
    ax1.set_xlabel("Skenario")
    ax1.set_title("Jejak Memori Registry terhadap Ukuran Katalog", fontsize=13, fontweight="bold")
    ax1.grid(axis="y", alpha=0.25)
    for s, m in zip(SCEN, mem):
        ax1.annotate(f"{m:.0f} KB", (s, m), ha="center", va="bottom",
                     fontsize=9, xytext=(0, 4), textcoords="offset points")
    ax2 = ax1.twinx()
    ax2.plot(SCEN, tot, marker="s", color=SLATE, label="Total tool katalog", linewidth=2, linestyle="--")
    ax2.set_ylabel("Total tool katalog", color=SLATE)
    lines = ax1.get_lines() + ax2.get_lines()
    ax1.legend(lines, [ln.get_label() for ln in lines], loc="upper left")
    fig.tight_layout()
    fig.savefig(OUT / "memory_footprint.png", dpi=180)
    plt.close(fig)
    print("  ✓ memory_footprint.png")


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    data = load()
    print(f"Render grafik Bab IV → {OUT.relative_to(ROOT)}:")
    _grouped(data, "avg_total_tokens", "Rata-rata Token per Kueri: Baseline vs Registry",
             "Rata-rata total token", "token_per_turn.png", fmt="{:,.0f}")
    _grouped(data, "avg_visible_tools", "Jumlah Tool Terlihat oleh LLM: Baseline vs Registry",
             "Rata-rata tool terlihat", "visible_tools_scaling.png", fmt="{:.1f}")
    _grouped(data, "accuracy", "Akurasi Pemilihan Tool: Baseline vs Registry",
             "Akurasi (%)", "tool_selection_accuracy.png", pct=True, fmt="{:.1f}")
    _grouped(data, "latency_p50_ms", "Latensi p50: Baseline vs Registry",
             "Latensi p50 (ms)", "latency_p50.png", fmt="{:.0f}")
    _memory(data)
    print("Selesai.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
