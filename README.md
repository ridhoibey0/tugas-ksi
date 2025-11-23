# Warung POS - Sistem Point of Sale

Sistem POS lengkap untuk warung/toko dengan fitur manajemen produk, penjualan, stok, dan laporan.

## 🚀 Fitur

- ✅ **Authentication** - Login system untuk keamanan
- ✅ **Dashboard** - Statistik penjualan dan grafik trend 7 hari
- ✅ **CRUD Produk** - Kelola data produk dengan kategori
- ✅ **Input Penjualan** - Catat transaksi penjualan dengan multiple items
- ✅ **Manajemen Stok** - Tracking pergerakan stok (in/out/adjustment)
- ✅ **Laporan Penjualan** - Filter dan export laporan ke CSV
- ✅ **Laporan Produk** - Analisa performa produk
- ✅ **Stok Kritis** - Notifikasi produk yang perlu restock
- ✅ **Print Invoice** - Cetak struk penjualan
- ✅ **Mobile Friendly** - Responsive design dengan hamburger menu

## 🛠️ Teknologi

- **Backend**: Express.js (Node.js)
- **View Engine**: EJS
- **Database**: PostgreSQL
- **Query Builder**: Knex.js
- **Styling**: Tailwind CSS
- **Charts**: Chart.js

## 📋 Prasyarat

- Node.js (v14 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)
- npm atau yarn

## 🔧 Instalasi

1. **Clone atau download project ini**

2. **Install dependencies**
```bash
npm install
```

3. **Setup Database PostgreSQL**

Buat database baru di PostgreSQL:
```sql
CREATE DATABASE warung_pos_db;
```

4. **Konfigurasi Database**

Edit file `knexfile.js` sesuai dengan konfigurasi PostgreSQL Anda:
```javascript
connection: {
  host: 'localhost',
  port: 5432,
  database: 'warung_pos_db',
  user: 'postgres',        // Ganti dengan username PostgreSQL Anda
  password: 'postgres'      // Ganti dengan password PostgreSQL Anda
}
```

5. **Jalankan Migrations**

Buat struktur tabel database:
```bash
npm run migrate
```

6. **Jalankan Seeder (Opsional)**

Isi database dengan data contoh:
```bash
npm run seed
```

## 🚀 Menjalankan Aplikasi

### Development Mode (dengan auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Aplikasi akan berjalan di: **http://localhost:3000**

## 🔐 Login

Setelah aplikasi berjalan, buka browser dan akses:
- URL: **http://localhost:3000**
- Username: **admin**
- Password: **admin123**

Anda akan otomatis diarahkan ke halaman login jika belum login.

## 📱 Cara Penggunaan

### 1. Dashboard
- Lihat statistik total produk, omset hari ini, stok kritis
- Grafik trend penjualan 7 hari terakhir
- Produk terlaris
- Quick access untuk fitur utama

### 2. Kelola Produk
- **Tambah Produk**: Klik "Tambah Produk", isi form (nama, kategori, harga, stok, dll)
- **Edit Produk**: Klik icon edit di list produk
- **Hapus Produk**: Klik icon hapus (konfirmasi diperlukan)
- **Cari Produk**: Gunakan search bar dan filter kategori

### 3. Input Penjualan
- Klik "Input Penjualan" atau "Catat Penjualan"
- Pilih produk dan jumlah, klik "Tambah"
- Isi jumlah bayar (sistem akan hitung kembalian otomatis)
- Klik "Proses Penjualan"
- Invoice otomatis tergenerate dan dapat di-print

### 4. Manajemen Stok
- **Tambah Stok**: Untuk restock barang dari supplier
- **Penyesuaian Stok**: Untuk stock opname/penyesuaian
- **Riwayat**: Filter berdasarkan tipe atau produk
- Stok otomatis berkurang saat ada penjualan

### 5. Laporan
- **Laporan Penjualan**: 
  - Filter berdasarkan tanggal
  - Export ke CSV
  - Lihat summary total transaksi dan pendapatan
- **Laporan Produk**:
  - Lihat performa setiap produk
  - Total terjual dan pendapatan per produk
  - Status stok dan popularitas

## 📊 Struktur Database

### Tabel Products
- Data produk (nama, kategori, harga, stok, min_stock, dll)

### Tabel Sales
- Header transaksi penjualan (invoice, total, payment method, dll)

### Tabel Sale_Items
- Detail item per transaksi penjualan

### Tabel Stock_Movements
- Riwayat pergerakan stok (in/out/adjustment)

### Tabel Users
- Data user untuk authentication (username, password, name, role)

## 🎨 Fitur UI/UX

- ✨ Design modern dengan Tailwind CSS
- 📱 Fully responsive untuk mobile dan desktop
- 🍔 Hamburger menu untuk navigasi mobile
- 🎯 Navigasi intuitif dengan sidebar
- 📊 Visualisasi data dengan chart
- 🖨️ Print-friendly invoice
- ⚡ Fast loading dan smooth transitions
- 🔒 Protected routes dengan authentication

## 🔒 Keamanan

Untuk production, tambahkan:
- Environment variables untuk kredensial database
- Authentication & authorization
- Input validation & sanitization
- HTTPS/SSL

## 📝 Scripts

```bash
npm start          # Jalankan aplikasi
npm run dev        # Development mode dengan nodemon
npm run migrate    # Jalankan database migrations
npm run seed       # Isi database dengan sample data
npm run rollback   # Rollback migration terakhir
```

## 🤝 Kontribusi

Silakan buat issue atau pull request untuk perbaikan dan penambahan fitur.

## 📄 Lisensi

ISC

## 👨‍💻 Developer

Dibuat untuk Warung Pak Irik - Sistem Manajemen POS

---

**Catatan**: Pastikan PostgreSQL sudah running sebelum menjalankan aplikasi!
