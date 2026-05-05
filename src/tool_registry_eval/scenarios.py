from __future__ import annotations


SCENARIOS = {
    "S1": {"modules": 3, "tools_per_module": 10},
    "S2": {"modules": 5, "tools_per_module": 20},
    "S3": {"modules": 10, "tools_per_module": 30},
    "S4": {"modules": 20, "tools_per_module": 50},
}

MODULES = [
    "inventory",
    "sales",
    "supplier",
    "accounting",
    "menu",
    "hr",
    "compliance",
    "customer",
    "loyalty",
    "delivery",
    "subscription",
    "payment",
    "notification",
    "scheduler",
    "ocr",
    "shift",
    "tax",
    "audit",
    "forecasting",
    "tenant",
]

PRIMARY_TOOLS = {
    "inventory": ("inventory_check_stock", ["stok", "bahan", "gudang", "outlet"]),
    "sales": ("sales_daily_revenue", ["penjualan", "omzet", "harian", "kasir"]),
    "supplier": ("supplier_create_purchase_order", ["supplier", "purchase", "order", "po"]),
    "accounting": ("accounting_generate_journal", ["jurnal", "akuntansi", "transaksi", "posting"]),
    "menu": ("menu_analyze_food_cost", ["food", "cost", "resep", "margin"]),
    "hr": ("hr_check_shift_schedule", ["shift", "karyawan", "jadwal", "absensi"]),
    "compliance": ("compliance_check_halal_certificate", ["halal", "bpjph", "sertifikat", "batch"]),
    "customer": ("customer_analyze_retention", ["pelanggan", "retensi", "kunjungan", "loyal"]),
    "loyalty": ("loyalty_apply_voucher", ["voucher", "promo", "loyalty", "diskon"]),
    "delivery": ("delivery_sync_order_status", ["delivery", "gofood", "grabfood", "status"]),
    "subscription": ("subscription_check_tier", ["subscription", "tier", "paket", "billing"]),
    "payment": ("payment_reconcile_qris", ["qris", "pembayaran", "rekonsiliasi", "settlement"]),
    "notification": ("notification_send_digest", ["notifikasi", "digest", "whatsapp", "email"]),
    "scheduler": ("scheduler_create_task", ["scheduler", "jadwal", "task", "cron"]),
    "ocr": ("ocr_extract_supplier_invoice", ["ocr", "invoice", "faktur", "supplier"]),
    "shift": ("shift_optimize_staffing", ["optimasi", "shift", "staff", "ramai"]),
    "tax": ("tax_calculate_ppn", ["ppn", "pajak", "faktur", "tarif"]),
    "audit": ("audit_trace_tool_call", ["audit", "log", "trace", "riwayat"]),
    "forecasting": ("forecasting_predict_demand", ["forecast", "prediksi", "demand", "stok"]),
    "tenant": ("tenant_check_isolation", ["tenant", "isolasi", "akses", "rbac"]),
}

ROLE_BY_MODULE = {
    "accounting": "manager",
    "supplier": "manager",
    "tax": "manager",
    "tenant": "admin",
}

# Docstring-style intents for primary (named) tools — mirrors zerlo.id service docstrings.
PRIMARY_TOOL_INTENTS: dict[str, str] = {
    "inventory_check_stock": (
        "Memeriksa ketersediaan dan jumlah stok bahan baku atau barang di gudang outlet. "
        "Gunakan ketika pengguna bertanya tentang sisa stok, kehabisan bahan, atau kondisi gudang."
    ),
    "sales_daily_revenue": (
        "Menghitung dan menampilkan total omzet serta pendapatan penjualan harian per outlet atau kasir. "
        "Gunakan untuk pertanyaan tentang pemasukan, penjualan hari ini, atau rekap transaksi."
    ),
    "supplier_create_purchase_order": (
        "Membuat purchase order baru ke supplier terdaftar untuk pengadaan bahan baku atau barang dagangan. "
        "Gunakan saat pengguna ingin memesan, membuat PO, atau melakukan pembelian dari vendor."
    ),
    "accounting_generate_journal": (
        "Membuat dan memposting jurnal akuntansi untuk mencatat transaksi keuangan ke buku besar. "
        "Gunakan untuk pencatatan jurnal, posting transaksi, atau entri akuntansi."
    ),
    "menu_analyze_food_cost": (
        "Menganalisis food cost dan margin keuntungan per menu atau resep berdasarkan harga bahan baku. "
        "Gunakan untuk evaluasi profitabilitas menu, perhitungan HPP, atau analisis resep."
    ),
    "hr_check_shift_schedule": (
        "Menampilkan jadwal shift dan kehadiran karyawan untuk outlet atau periode tertentu. "
        "Gunakan untuk melihat jadwal kerja, absensi, atau rencana penugasan staff."
    ),
    "compliance_check_halal_certificate": (
        "Memeriksa status sertifikasi halal BPJPH untuk produk atau bahan baku yang digunakan. "
        "Gunakan untuk validasi kehalalan produk, masa berlaku sertifikat, atau audit batch."
    ),
    "customer_analyze_retention": (
        "Menganalisis tingkat retensi pelanggan, frekuensi kunjungan, dan pola loyalitas. "
        "Gunakan untuk evaluasi program pelanggan, churn analysis, atau segmentasi tamu."
    ),
    "loyalty_apply_voucher": (
        "Menerapkan voucher, promo, atau diskon loyalty pada transaksi pelanggan terdaftar. "
        "Gunakan saat pelanggan ingin memakai voucher, poin reward, atau klaim promosi."
    ),
    "delivery_sync_order_status": (
        "Menyinkronkan dan memperbarui status pesanan dari platform delivery (GoFood, GrabFood). "
        "Gunakan untuk memantau status order delivery, konfirmasi, atau pengecekan sinkronisasi."
    ),
    "subscription_check_tier": (
        "Memeriksa paket langganan aktif, tier, dan fitur yang tersedia untuk tenant. "
        "Gunakan untuk verifikasi akses fitur, batas paket, atau informasi billing."
    ),
    "payment_reconcile_qris": (
        "Merekonsiliasi transaksi pembayaran QRIS dengan catatan kasir dan settlement bank. "
        "Gunakan untuk pencocokan pembayaran digital, settlement QRIS, atau rekonsiliasi harian."
    ),
    "notification_send_digest": (
        "Mengirimkan ringkasan harian (digest) operasional restoran via WhatsApp atau email. "
        "Gunakan untuk pengiriman laporan otomatis, notifikasi ringkasan, atau digest manajemen."
    ),
    "scheduler_create_task": (
        "Membuat tugas terjadwal (scheduled task) untuk eksekusi otomatis pada waktu tertentu. "
        "Gunakan untuk menjadwalkan laporan, cron job, atau otomasi tugas berulang."
    ),
    "ocr_extract_supplier_invoice": (
        "Mengekstrak data dari foto atau scan faktur supplier menggunakan OCR. "
        "Gunakan untuk digitalisasi invoice, pembacaan nota pembelian, atau input faktur otomatis."
    ),
    "shift_optimize_staffing": (
        "Mengoptimalkan penugasan dan jumlah staff shift berdasarkan prediksi tingkat keramaian. "
        "Gunakan untuk perencanaan staff, optimasi jadwal, atau rekomendasi jumlah karyawan per shift."
    ),
    "tax_calculate_ppn": (
        "Menghitung PPN (Pajak Pertambahan Nilai) dan menyiapkan faktur pajak untuk transaksi. "
        "Gunakan untuk perhitungan pajak penjualan, pembuatan faktur pajak, atau laporan PPn."
    ),
    "audit_trace_tool_call": (
        "Menelusuri riwayat dan log pemanggilan tool oleh AI agent untuk keperluan audit. "
        "Gunakan untuk investigasi aktivitas agent, audit trail, atau forensik sistem."
    ),
    "forecasting_predict_demand": (
        "Memprediksi permintaan produk atau kebutuhan stok berdasarkan data historis penjualan. "
        "Gunakan untuk perencanaan pengadaan, prediksi penjualan, atau optimasi stok."
    ),
    "tenant_check_isolation": (
        "Memverifikasi isolasi data antar-tenant dan memvalidasi konfigurasi akses RBAC. "
        "Gunakan untuk audit keamanan multi-tenant, validasi isolasi, atau pemeriksaan hak akses."
    ),
}

# Intent templates for generic secondary tools (generated by op_type × module).
OP_INTENT_TEMPLATES: dict[str, str] = {
    "read": (
        "Membaca dan menampilkan data {module} yang tersimpan dalam sistem. "
        "Gunakan untuk query data, pengecekan informasi, atau tampilan status {module}."
    ),
    "analytical": (
        "Menganalisis data {module} dan menghasilkan laporan atau metrik performa. "
        "Gunakan untuk analisis tren, laporan statistik, atau evaluasi kinerja {module}."
    ),
    "write": (
        "Membuat, mengubah, atau menghapus data {module} dalam sistem. "
        "Gunakan untuk operasi input data, pembaruan record, atau penghapusan entri {module}."
    ),
    "admin": (
        "Mengelola konfigurasi dan pengaturan administrasi sistem modul {module}. "
        "Gunakan untuk manajemen akses, pengaturan parameter sistem, atau konfigurasi {module}."
    ),
}

