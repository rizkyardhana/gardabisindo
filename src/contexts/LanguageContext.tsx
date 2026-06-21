import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  lang: Language;
  t: (key: string) => string;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  id: {
    // Sidebar & Navigation
    'Ikhtisar': 'Ikhtisar',
    'Kelola Isyarat': 'Kelola Isyarat',
    'Informan': 'Informan',
    'Kategori': 'Kategori',
    'Wilayah': 'Wilayah',
    'Pengaturan': 'Pengaturan',
    'Penyimpanan Arsip': 'Penyimpanan Arsip',
    'Tambah Kapasitas': 'Tambah Kapasitas',
    'Explore Dictionary': 'Jelajahi Kamus',
    'Arsip & Dokumentasi': 'Arsip & Dokumentasi',
    'Beranda': 'Beranda',
    'Kamus': 'Kamus',
    'Profil': 'Profil',
    'Keluar': 'Keluar',
    
    // Overview / Ikhtisar
    'Dashboard Pengelolaan': 'Dashboard Pengelolaan',
    'Selamat datang kembali, Tim Dokumentasi & Kontributor GARDA.': 'Selamat datang kembali, Tim Dokumentasi & Kontributor GARDA.',
    'Cari data...': 'Cari data...',
    'Upload Kosa': 'Upload Kosa',
    'Total Video': 'Total Video',
    'Menunggu Persetujuan': 'Menunggu Persetujuan',
    'Total Kontributor': 'Total Kontributor',
    'Interaksi Kamus': 'Interaksi Kamus',
    'Aktivitas Terkini': 'Aktivitas Terkini',
    'Lihat Semua Aktivitas': 'Lihat Semua Aktivitas',
    
    // Table Headers & Labels
    'Kosa Isyarat': 'Kosa Isyarat',
    'Status': 'Status',
    'Waktu': 'Waktu',
    'Aksi': 'Aksi',
    'Nama': 'Nama',
    'Kontributor': 'Kontributor',
    'Tanggal': 'Tanggal',
    'Kontribusi': 'Kontribusi',
    'Bergabung': 'Bergabung',
    'Terpakai': 'Terpakai',

    // Status Values
    'Approved': 'Disetujui',
    'Pending': 'Menunggu',
    'Rejected': 'Ditolak',
    'Disetujui': 'Disetujui',
    'Menunggu': 'Menunggu',
    'Ditolak': 'Ditolak',
    'Semua': 'Semua',

    // Manage Signs Tab
    'Daftar Kosa Isyarat': 'Daftar Kosa Isyarat',
    'Cari kosa kata, kontributor, wilayah...': 'Cari kosa kata, kontributor, wilayah...',
    'Tidak ada kosa isyarat ditemukan.': 'Tidak ada kosa isyarat ditemukan.',

    // Informants Tab
    'Tambah Informan': 'Tambah Informan',
    'Daftar Informan & Kontributor': 'Daftar Informan & Kontributor',
    'Nama Lengkap': 'Nama Lengkap',
    'Alamat Email': 'Alamat Email',
    'Lokasi Wilayah': 'Lokasi Wilayah',
    'Verifikasi': 'Verifikasi',
    'Batal Verifikasi': 'Batal Verifikasi',
    'Hapus': 'Hapus',
    'Semua Kontributor': 'Semua Kontributor',

    // Categories Tab
    'Tambah Kategori': 'Tambah Kategori',
    'Nama Kategori': 'Nama Kategori',
    'Deskripsi Kategori': 'Deskripsi Kategori',
    'Daftar Kategori': 'Daftar Kategori',
    'Daftar Kosa Isyarat:': 'Daftar Kosa Isyarat:',
    'Belum ada kosa isyarat': 'Belum ada kosa isyarat',

    // Regions Tab
    'Tambah Wilayah': 'Tambah Wilayah',
    'Nama Wilayah': 'Nama Wilayah',
    'Daftar Wilayah': 'Daftar Wilayah',

    // Settings Tab
    'Pengaturan Sistem': 'Pengaturan Sistem',
    'Konfigurasi setelan global untuk platform Garda Bisindo.': 'Konfigurasi setelan global untuk platform Garda Bisindo.',
    'Umum': 'Umum',
    'Nama Platform': 'Nama Platform',
    'Bahasa Sistem Utama': 'Bahasa Sistem Utama',
    'Keamanan & Akses': 'Keamanan & Akses',
    'Izinkan Upload Anonim / Tamu': 'Izinkan Upload Anonim / Tamu',
    'Masyarakat dapat mengupload video kosa isyarat tanpa login.': 'Masyarakat dapat mengupload video kosa isyarat tanpa login.',
    'Wajibkan Persetujuan Editor/Admin': 'Wajibkan Persetujuan Editor/Admin',
    'Kosa isyarat yang baru diupload harus direview sebelum dipublish.': 'Kosa isyarat yang baru diupload harus direview sebelum dipublish.',
    'Notifikasi': 'Notifikasi',
    'Notifikasi Email': 'Notifikasi Email',
    'Kirim notifikasi email ke admin jika ada upload isyarat baru.': 'Kirim notifikasi email ke admin jika ada upload isyarat baru.',
    'Notifikasi Push': 'Notifikasi Push',
    'Kirim notifikasi push ke perangkat editor/admin secara realtime.': 'Kirim notifikasi push ke perangkat editor/admin secara realtime.',
    'Simpan Pengaturan': 'Simpan Pengaturan',

    // Landing Page
    'Preserving Culture through Tech': 'Melestarikan Budaya Melalui Teknologi',
    'Gerakan Arsip & Dokumentasi Digital Bahasa Isyarat Indonesia (BISINDO). Melindungi warisan komunikasi komunitas Tuli Indonesia untuk generasi mendatang.': 'Gerakan Arsip & Dokumentasi Digital Bahasa Isyarat Indonesia (BISINDO). Melindungi warisan komunikasi komunitas Tuli Indonesia untuk generasi mendatang.',
    'Jelajahi Kamus': 'Jelajahi Kamus',
    'Tonton Dokumenter': 'Tonton Dokumenter',
    'Bergabung bersama': 'Bergabung bersama',
    'relawan komunitas': 'relawan komunitas',
    'Arsip Terverifikasi oleh Gerkatin': 'Arsip Terverifikasi oleh Gerkatin',
    '12 Kosa Isyarat Baru': '12 Kosa Isyarat Baru',
    'Provinsi Terarsip': 'Provinsi Terarsip',
    'Video Dokumentasi': 'Video Dokumentasi',
    'Mulai Belajar': 'Mulai Belajar',
    'Arsip Kosa Isyarat Pilihan': 'Arsip Kosa Isyarat Pilihan',
    'Semua Kosa Isyarat': 'Semua Kosa Isyarat',
    'Mengapa GARDA BISINDO hadir?': 'Mengapa GARDA BISINDO hadir?',
    'Bahasa Isyarat Indonesia (BISINDO) merupakan bagian penting dari identitas dan budaya komunitas Tuli Indonesia. Namun saat ini, banyak kosa isyarat daerah mulai hilang karena minimnya dokumentasi dan arsip digital yang tersedia.': 'Bahasa Isyarat Indonesia (BISINDO) merupakan bagian penting dari identitas dan budaya komunitas Tuli Indonesia. Namun saat ini, banyak kosa isyarat daerah mulai hilang karena minimnya dokumentasi dan arsip digital yang tersedia.',
    'Perlindungan Budaya': 'Perlindungan Budaya',
    'Menjaga identitas komunitas Tuli Indonesia agar tetap hidup.': 'Menjaga identitas komunitas Tuli Indonesia agar tetap hidup.',
    'Edukasi Publik': 'Edukasi Publik',
    'Memberikan akses belajar inklusif bagi masyarakat luas.': 'Memberikan akses belajar inklusif bagi masyarakat luas.',
    'Pahami Lebih Lanjut': 'Pahami Lebih Lanjut',
    'Eksplorasi Dialek Nusantara': 'Eksplorasi Dialek Nusantara',
    'Jelajahi Daerah': 'Jelajahi Daerah',
    'Bahasa Isyarat memiliki dialek khas di tiap daerah. Klik daerah di peta grafis atau tombol list untuk melihat detailnya.': 'Bahasa Isyarat memiliki dialek khas di tiap daerah. Klik daerah di peta grafis atau tombol list untuk melihat detailnya.',
    'Pilih Wilayah': 'Pilih Wilayah',
    'Wilayah Terpilih': 'Wilayah Terpilih',
    'Pusat Penelitian:': 'Pusat Penelitian:',
    'Buka Kamus': 'Buka Kamus',
    'Arsip Video': 'Arsip Video',
    'Kosa Kata Unggulan': 'Kosa Kata Unggulan',
    'Tebak BISINDO': 'Tebak BISINDO',
    'Kuis Isyarat Interaktif': 'Kuis Isyarat Interaktif',
    'Uji kemampuan visual bahasa isyarat Anda sekarang juga. Menangkan skor tertinggi!': 'Uji kemampuan visual bahasa isyarat Anda sekarang juga. Menangkan skor tertinggi!',
    'Soal': 'Soal',
    'dari': 'dari',
    'Skor:': 'Skor:',
    'Tebak arti gerakan isyarat di samping:': 'Tebak arti gerakan isyarat di samping:',
    'Penjelasan Gerakan': 'Penjelasan Gerakan',
    'Soal Selanjutnya': 'Soal Selanjutnya',
    'Lihat Hasil Akhir': 'Lihat Hasil Akhir',
    'Kuis Selesai!': 'Kuis Selesai!',
    'Skor akhir Anda adalah:': 'Skor akhir Anda adalah:',
    'Luar biasa! Anda memahami bahasa isyarat BISINDO dengan sangat baik.': 'Luar biasa! Anda memahami bahasa isyarat BISINDO dengan sangat baik.',
    'Pekerjaan yang bagus! Ayo coba lagi untuk menyempurnakan pemahaman Anda.': 'Pekerjaan yang bagus! Ayo coba lagi untuk menyempurnakan pemahaman Anda.',
    'Ulangi Kuis': 'Ulangi Kuis',
    'Belajar Lagi': 'Belajar Lagi',
    'Bekerja Sama Dengan': 'Bekerja Sama Dengan',
    'Mulai Dokumentasi Sekarang': 'Mulai Dokumentasi Sekarang',
    'Jadilah bagian dari gerakan pelestarian budaya. Bantu kami mendokumentasikan kosa isyarat di daerahmu.': 'Jadilah bagian dari gerakan pelestarian budaya. Bantu kami mendokumentasikan kosa isyarat di daerahmu.',
    'Daftar Jadi Informan': 'Daftar Jadi Informan',
    'Donasi Campaign': 'Donasi Campaign',

    // Dictionary Page
    'Kamus Digital': 'Kamus Digital',
    'Jelajahi ribuan arsip kosa isyarat dari berbagai daerah di Indonesia.': 'Jelajahi ribuan arsip kosa isyarat dari berbagai daerah di Indonesia.',
    'Mendengarkan...': 'Mendengarkan...',
    'Cari kata (contoh: Terima Kasih, Rumah, Makan...)': 'Cari kata (contoh: Terima Kasih, Rumah, Makan...)',
    'Cari dengan Suara (Speech-to-Sign)': 'Cari dengan Suara (Speech-to-Sign)',
    'Filter Visual': 'Filter Visual',
    'Semua Kategori': 'Semua Kategori',
    'Semua Wilayah': 'Semua Wilayah',
    'Pencarian Parameter Visual (Leksikografis)': 'Pencarian Parameter Visual (Leksikografis)',
    'Reset Filter Visual': 'Reset Filter Visual',
    'Bentuk Tangan (Handshape)': 'Bentuk Tangan (Handshape)',
    'Lokasi Gerakan (Location)': 'Lokasi Gerakan (Location)',
    '* Pencarian visual mencocokkan isyarat berdasarkan cara mempraktikkannya. Sangat berguna untuk Tuli dan penerjemah.': '* Pencarian visual mencocokkan isyarat berdasarkan cara mempraktikkannya. Sangat berguna untuk Tuli dan penerjemah.',
    'Memuat kamus isyarat...': 'Memuat kamus isyarat...',
    'Tidak ditemukan kosa isyarat': 'Tidak ditemukan kosa isyarat',
    'Coba gunakan kata kunci lain atau ubah filter pencarian.': 'Coba gunakan kata kunci lain atau ubah filter pencarian.',
    'Browser Anda tidak mendukung fitur Pencarian Suara.': 'Browser Anda tidak mendukung fitur Pencarian Suara.',

    // Detail Sign Page
    'Memuat detail kosa isyarat...': 'Memuat detail kosa isyarat...',
    'Kembali ke Kamus': 'Kembali ke Kamus',
    'Menyukai kosa isyarat ini!': 'Menyukai kosa isyarat ini!',
    'Batal menyukai kosa isyarat.': 'Batal menyukai kosa isyarat.',
    'Tautan berhasil disalin ke clipboard!': 'Tautan berhasil disalin ke clipboard!',
    'Gagal menyalin tautan.': 'Gagal menyalin tautan.',
    'Asal-usul (Etimologi)': 'Asal-usul (Etimologi)',
    'Konteks Penggunaan': 'Konteks Penggunaan',
    'Wawasan Budaya Digital': 'Wawasan Budaya Digital',
    'Dapatkan Wawasan AI': 'Dapatkan Wawasan AI',
    'Menganalisis Budaya...': 'Menganalisis Budaya...',
    'Gagal mendapatkan wawasan AI.': 'Gagal mendapatkan wawasan AI.',
    'Powered by Gemini AI - Menganalisis konteks regional dan linguistik.': 'Powered by Gemini AI - Menganalisis konteks regional dan linguistik.',
    'Diskusi Komunitas': 'Diskusi Komunitas',
    'Tambahkan catatan atau variasi daerah lain...': 'Tambahkan catatan atau variasi daerah lain...',
    'Kirim Masukan': 'Kirim Masukan',
    'Belum ada diskusi. Jadilah yang pertama memberikan masukan!': 'Belum ada diskusi. Jadilah yang pertama memberikan masukan!',
    'Batal': 'Batal',
    'Simpan': 'Simpan',
    'Edit': 'Edit',
    'Informan Tuli': 'Informan Tuli',
    'adalah bagian dari kontributor aktif relawan komunitas Tuli yang berkomitmen tinggi mendokumentasikan bahasa isyarat daerah': 'adalah bagian dari kontributor aktif relawan komunitas Tuli yang berkomitmen tinggi mendokumentasikan bahasa isyarat daerah',
    'agar lestari.': 'agar lestari.',
    'Lihat Profil & Kontribusi': 'Lihat Profil & Kontribusi',
    'Verifikasi Akurasi': 'Verifikasi Akurasi',
    'Video ini telah divalidasi oleh tim ahli PUSBISINDO untuk memastikan akurasi penggunaan isyarat secara linguistik.': 'Video ini telah divalidasi oleh tim ahli PUSBISINDO untuk memastikan akurasi penggunaan isyarat secara linguistik.',
    'Isyarat Terkait': 'Isyarat Terkait',
    'Apakah Anda yakin ingin menghapus masukan ini?': 'Apakah Anda yakin ingin menghapus masukan ini?',

    // Login Page
    'Login': 'Login',
    'Masuk': 'Masuk',
    'Daftar': 'Daftar',
    'Registrasi Akun': 'Registrasi Akun',
    'Lupa Password': 'Lupa Password',
    'Masuk untuk mengakses dashboard & profil Anda.': 'Masuk untuk mengakses dashboard & profil Anda.',
    'Daftar sebagai anggota atau admin baru platform Garda BISINDO.': 'Daftar sebagai anggota atau admin baru platform Garda BISINDO.',
    'Masukkan email Anda untuk pemulihan atau melihat kata sandi Anda.': 'Masukkan email Anda untuk pemulihan atau melihat kata sandi Anda.',
    'Email dan password (min. 6 karakter) wajib diisi.': 'Email dan password (min. 6 karakter) wajib diisi.',
    'Semua data registrasi wajib diisi. Password minimal 6 karakter.': 'Semua data registrasi wajib diisi. Password minimal 6 karakter.',
    'Masukkan email Anda untuk pemulihan sandi.': 'Masukkan email Anda untuk pemulihan sandi.',
    'Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.': 'Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.',
    'Email Terdaftar': 'Email Terdaftar',
    'Simulasi Demo Pemulihan:': 'Simulasi Demo Pemulihan:',
    'Kata sandi akun Anda saat ini:': 'Kata sandi akun Anda saat ini:',
    'Kirim Permintaan Pemulihan': 'Kirim Permintaan Pemulihan',
    'Halaman Login': 'Halaman Login',
    'Belum punya akun?': 'Belum punya akun?',
    'Daftar Kontributor': 'Daftar Kontributor',
    'Sudah punya akun?': 'Sudah punya akun?',
    'Wilayah / Kota Asal': 'Wilayah / Kota Asal',

    // Profile Page
    'Ubah Sampul': 'Ubah Sampul',
    'Ubah Foto': 'Ubah Foto',
    'Pengaturan Akun': 'Pengaturan Akun',
    'Edit Profil': 'Edit Profil',
    'Tentang Saya': 'Tentang Saya',
    'Peringkat Komunitas': 'Peringkat Komunitas',
    'Badges & Pencapaian': 'Badges & Pencapaian',
    'Pencapaian': 'Pencapaian',
    'Lencana': 'Lencana',
    'Kontribusi Terakhir': 'Kontribusi Terakhir',
    'Terpopuler': 'Terpopuler',
    'Terbaru': 'Terbaru',
    'Memuat kosa isyarat kontribusi Anda...': 'Memuat kosa isyarat kontribusi Anda...',
    'Belum ada video isyarat yang Anda kontribusikan.': 'Belum ada video isyarat yang Anda kontribusikan.',
    'Statistik Kontribusi': 'Statistik Kontribusi',
    'Penayangan': 'Penayangan',
    'Suka': 'Suka',
    'Dibagikan': 'Dibagikan',
    'Grafik Kontribusi Bulanan (6 Bulan Terakhir)': 'Grafik Kontribusi Bulanan (6 Bulan Terakhir)',
    'Arahkan kursor untuk info audio': 'Arahkan kursor untuk info audio',
    'Detail Bulan': 'Detail Bulan',
    'Arahkan kursor ke titik grafik untuk melihat rincian kontribusi.': 'Arahkan kursor ke titik grafik untuk melihat rincian kontribusi.',
    'Memuat diskusi Anda...': 'Memuat diskusi Anda...',
    'Belum ada diskusi.': 'Belum ada diskusi.',
    'Ubah Sandi & Keamanan': 'Ubah Sandi & Keamanan',
    'Password Lama': 'Password Lama',
    'Password Baru': 'Password Baru',
    'Konfirmasi Password': 'Konfirmasi Password',
    'Preferensi Notifikasi': 'Preferensi Notifikasi',
    'Aksesibilitas & Tampilan': 'Aksesibilitas & Tampilan',
    'Bahasa Tampilan': 'Bahasa Tampilan',
    'Simpan Preferensi': 'Simpan Preferensi',
    
    // Landing Page extra
    'Kontributor Tuli': 'Kontributor Tuli',
    'Visi Kami': 'Visi Kami',
    'Memastikan tidak ada variasi kosa isyarat daerah yang hilang dari sejarah budaya Indonesia melalui dokumentasi berbasis data dan AI.': 'Memastikan tidak ada variasi kosa isyarat daerah yang hilang dari sejarah budaya Indonesia melalui dokumentasi berbasis data dan AI.',
    'Peta Kepulauan Indonesia': 'Peta Kepulauan Indonesia',
    'Sumatera': 'Sumatera',
    'Jawa': 'Jawa',
    'Kalimantan': 'Kalimantan',
    'Sulawesi': 'Sulawesi',
    'Bali & Nusa Tenggara': 'Bali & Nusa Tenggara',
    'Maluku & Papua': 'Maluku & Papua',
    'Dialek Sumatera kaya akan ekspresi wajah yang tegas dengan isyarat tangan yang lugas.': 'Dialek Sumatera kaya akan ekspresi wajah yang tegas dengan isyarat tangan yang lugas.',
    'Variasi isyarat di Jawa memiliki gerakan tangan yang sangat halus dengan kontras dialek pesisir yang dinamis.': 'Variasi isyarat di Jawa memiliki gerakan tangan yang sangat halus dengan kontras dialek pesisir yang dinamis.',
    'Isyarat lokal di Kalimantan banyak dipengaruhi oleh penamaan alam sekitar seperti sungai dan hutan.': 'Isyarat lokal di Kalimantan banyak dipengaruhi oleh penamaan alam sekitar seperti sungai dan hutan.',
    'Bahasa isyarat di Sulawesi memiliki pergerakan tangan berputar yang khas dan ekspresif.': 'Bahasa isyarat di Sulawesi memiliki pergerakan tangan berputar yang khas dan ekspresif.',
    'Terkenal dengan Desa Bengkala di Bali yang memiliki bahasa isyarat alami sendiri (Kata Kolok) selama berabad-abad.': 'Terkenal dengan Desa Bengkala di Bali yang memiliki bahasa isyarat alami sendiri (Kata Kolok) selama berabad-abad.',
    'Memiliki struktur dialek lokal yang unik dengan kombinasi isyarat visual yang luas.': 'Memiliki struktur dialek lokal yang unik dengan kombinasi isyarat visual yang luas.',
    'Bungo (Bunga)': 'Bungo (Bunga)',
    'Maturnuwun (Terima Kasih)': 'Maturnuwun (Terima Kasih)',
    'Sungai': 'Sungai',
    'Torang (Kita)': 'Torang (Kita)',
    'Mepatut (Setuju)': 'Mepatut (Setuju)',
    'Sa (Saya)': 'Sa (Saya)',
    'Isyarat': 'Isyarat',
    'MEMUTAR ISYARAT': 'MEMUTAR ISYARAT',
    'Gerakan menempelkan telapak tangan di dagu lalu diarahkan ke depan melambangkan rasa syukur atau terima kasih.': 'Gerakan menempelkan telapak tangan di dagu lalu diarahkan ke depan melambangkan rasa syukur atau terima kasih.',
    'Kedua tangan membentuk sudut segitiga seperti atap di atas kepala untuk mensimbolkan tempat tinggal.': 'Kedua tangan membentuk sudut segitiga seperti atap di atas kepala untuk mensimbolkan tempat tinggal.',
    'Jari-jari tangan dirapatkan menghadap ke bawah dan didekatkan ke mulut berulang kali menunjukkan aktivitas makan.': 'Jari-jari tangan dirapatkan menghadap ke bawah dan didekatkan ke mulut berulang kali menunjukkan aktivitas makan.',
    'Rumah': 'Rumah',
    'Terima Kasih': 'Terima Kasih',
    'Makan': 'Makan',
    'Sama-sama': 'Sama-sama',
    'Sekolah': 'Sekolah',
    'Kantor': 'Kantor',
    'Buku': 'Buku',
    'Minum': 'Minum',
    'Tidur': 'Tidur',
    'Bicara': 'Bicara'
  },
  en: {
    // Sidebar & Navigation
    'Ikhtisar': 'Overview',
    'Kelola Isyarat': 'Manage Signs',
    'Informan': 'Informants',
    'Kategori': 'Category',
    'Wilayah': 'Region',
    'Pengaturan': 'Settings',
    'Penyimpanan Arsip': 'Archive Storage',
    'Tambah Kapasitas': 'Upgrade Capacity',
    'Explore Dictionary': 'Explore Dictionary',
    'Arsip & Dokumentasi': 'Archive & Documentation',

    // Overview / Ikhtisar
    'Dashboard Pengelolaan': 'Management Dashboard',
    'Selamat datang kembali, Tim Dokumentasi & Kontributor GARDA.': 'Welcome back, GARDA Documentation Team & Contributors.',
    'Cari data...': 'Search data...',
    'Upload Kosa': 'Upload Sign',
    'Total Video': 'Total Videos',
    'Menunggu Persetujuan': 'Pending Approval',
    'Total Kontributor': 'Total Contributors',
    'Interaksi Kamus': 'Dictionary Interactions',
    'Aktivitas Terkini': 'Recent Activity',
    'Lihat Semua Aktivitas': 'View All Activities',

    // Table Headers & Labels
    'Kosa Isyarat': 'Sign Word',
    'Status': 'Status',
    'Waktu': 'Time',
    'Aksi': 'Action',
    'Nama': 'Name',
    'Kontributor': 'Contributor',
    'Tanggal': 'Date',
    'Kontribusi': 'Contributions',
    'Bergabung': 'Joined',
    'Terpakai': 'Used',

    // Status Values
    'Approved': 'Approved',
    'Pending': 'Pending',
    'Rejected': 'Rejected',
    'Disetujui': 'Approved',
    'Menunggu': 'Pending',
    'Ditolak': 'Rejected',
    'Semua': 'All',

    // Manage Signs Tab
    'Daftar Kosa Isyarat': 'Signs List',
    'Cari kosa kata, kontributor, wilayah...': 'Search sign words, contributors, regions...',
    'Tidak ada kosa isyarat ditemukan.': 'No sign words found.',

    // Informants Tab
    'Tambah Informan': 'Add Informant',
    'Daftar Informan & Kontributor': 'Informants & Contributors List',
    'Nama Lengkap': 'Full Name',
    'Alamat Email': 'Email Address',
    'Lokasi Wilayah': 'Region Location',
    'Verifikasi': 'Verify',
    'Batal Verifikasi': 'Unverify',
    'Hapus': 'Delete',
    'Semua Kontributor': 'All Contributors',

    // Categories Tab
    'Tambah Kategori': 'Add Category',
    'Nama Kategori': 'Category Name',
    'Deskripsi Kategori': 'Category Description',
    'Daftar Kategori': 'Categories List',
    'Daftar Kosa Isyarat:': 'Signs List:',
    'Belum ada kosa isyarat': 'No signs yet',

    // Regions Tab
    'Tambah Wilayah': 'Add Region',
    'Nama Wilayah': 'Region Name',
    'Daftar Wilayah': 'Regions List',

    // Settings Tab
    'Pengaturan Sistem': 'System Settings',
    'Konfigurasi setelan global untuk platform Garda Bisindo.': 'Global configuration settings for the Garda Bisindo platform.',
    'Umum': 'General',
    'Nama Platform': 'Platform Name',
    'Bahasa Sistem Utama': 'Primary System Language',
    'Keamanan & Akses': 'Security & Access',
    'Izinkan Upload Anonim / Tamu': 'Allow Anonymous / Guest Uploads',
    'Masyarakat dapat mengupload video kosa isyarat tanpa login.': 'Allow the public to upload sign videos without logging in.',
    'Wajibkan Persetujuan Editor/Admin': 'Require Editor/Admin Approval',
    'Kosa isyarat yang baru diupload harus direview sebelum dipublish.': 'Newly uploaded sign words must be reviewed before publication.',
    'Notifikasi': 'Notifications',
    'Notifikasi Email': 'Email Notifications',
    'Kirim notifikasi email ke admin jika ada upload isyarat baru.': 'Send email notifications to admins when a new sign is uploaded.',
    'Notifikasi Push': 'Push Notifications',
    'Kirim notifikasi push ke perangkat editor/admin secara realtime.': 'Send push notifications to editor/admin devices in real time.',
    'Simpan Pengaturan': 'Save Settings',

    // Landing Page
    'Preserving Culture through Tech': 'Preserving Culture through Tech',
    'Gerakan Arsip & Dokumentasi Digital Bahasa Isyarat Indonesia (BISINDO). Melindungi warisan komunikasi komunitas Tuli Indonesia untuk generasi mendatang.': 'Indonesian Sign Language (BISINDO) Digital Archiving & Documentation Movement. Protecting the communication heritage of the Indonesian Deaf community for future generations.',
    'Jelajahi Kamus': 'Explore Dictionary',
    'Tonton Dokumenter': 'Watch Documentary',
    'Bergabung bersama': 'Join with',
    'relawan komunitas': 'community volunteers',
    'Arsip Terverifikasi oleh Gerkatin': 'Archive Verified by Gerkatin',
    '12 Kosa Isyarat Baru': '12 New Sign Words',
    'Provinsi Terarsip': 'Archived Provinces',
    'Video Dokumentasi': 'Documentary Videos',
    'Mulai Belajar': 'Start Learning',
    'Arsip Kosa Isyarat Pilihan': 'Featured Sign Language Archive',
    'Semua Kosa Isyarat': 'All Sign Words',
    'Mengapa GARDA BISINDO hadir?': 'Why is GARDA BISINDO here?',
    'Bahasa Isyarat Indonesia (BISINDO) merupakan bagian penting dari identitas dan budaya komunitas Tuli Indonesia. Namun saat ini, banyak kosa isyarat daerah mulai hilang karena minimnya dokumentasi dan arsip digital yang tersedia.': 'Indonesian Sign Language (BISINDO) is an important part of the identity and culture of the Indonesian Deaf community. However, currently, many regional sign words are beginning to disappear due to the lack of available documentation and digital archiving.',
    'Perlindungan Budaya': 'Cultural Protection',
    'Menjaga identitas komunitas Tuli Indonesia agar tetap hidup.': 'Keeping the identity of the Indonesian Deaf community alive.',
    'Edukasi Publik': 'Public Education',
    'Memberikan akses belajar inklusif bagi masyarakat luas.': 'Providing inclusive learning access for the general public.',
    'Pahami Lebih Lanjut': 'Understand More',
    'Eksplorasi Dialek Nusantara': 'Explore Archipelago Dialects',
    'Jelajahi Daerah': 'Explore Regions',
    'Bahasa Isyarat memiliki dialek khas di tiap daerah. Klik daerah di peta grafis atau tombol list untuk melihat detailnya.': 'Sign language has distinct dialects in each region. Click on the region in the graphic map or the list button to view details.',
    'Pilih Wilayah': 'Select Region',
    'Wilayah Terpilih': 'Selected Region',
    'Pusat Penelitian:': 'Research Center:',
    'Buka Kamus': 'Open Dictionary',
    'Arsip Video': 'Video Archive',
    'Kosa Kata Unggulan': 'Featured Word',
    'Tebak BISINDO': 'Guess BISINDO',
    'Kuis Isyarat Interaktif': 'Interactive Sign Quiz',
    'Uji kemampuan visual bahasa isyarat Anda sekarang juga. Menangkan skor tertinggi!': 'Test your visual sign language skills right now. Score the highest!',
    'Soal': 'Question',
    'dari': 'of',
    'Skor:': 'Score:',
    'Tebak arti gerakan isyarat di samping:': 'Guess the meaning of the sign gesture on the side:',
    'Penjelasan Gerakan': 'Gesture Explanation',
    'Soal Selanjutnya': 'Next Question',
    'Lihat Hasil Akhir': 'See Final Results',
    'Kuis Selesai!': 'Quiz Completed!',
    'Skor akhir Anda adalah:': 'Your final score is:',
    'Luar biasa! Anda memahami bahasa isyarat BISINDO dengan sangat baik.': 'Amazing! You understand BISINDO sign language very well.',
    'Pekerjaan yang bagus! Ayo coba lagi untuk menyempurnakan pemahaman Anda.': 'Great job! Let\'s try again to perfect your understanding.',
    'Ulangi Kuis': 'Repeat Quiz',
    'Belajar Lagi': 'Learn More',
    'Bekerja Sama Dengan': 'In Collaboration With',
    'Mulai Dokumentasi Sekarang': 'Start Documenting Now',
    'Jadilah bagian dari gerakan pelestarian budaya. Bantu kami mendokumentasikan kosa isyarat di daerahmu.': 'Be part of the cultural preservation movement. Help us document sign language in your area.',
    'Daftar Jadi Informan': 'Register as an Informant',
    'Donasi Campaign': 'Donate Campaign',

    // Dictionary Page
    'Kamus Digital': 'Digital Dictionary',
    'Jelajahi ribuan arsip kosa isyarat dari berbagai daerah di Indonesia.': 'Explore thousands of sign language archives from various regions in Indonesia.',
    'Mendengarkan...': 'Listening...',
    'Cari kata (contoh: Terima Kasih, Rumah, Makan...)': 'Search words (e.g. Thank You, House, Eat...)',
    'Cari dengan Suara (Speech-to-Sign)': 'Voice Search (Speech-to-Sign)',
    'Filter Visual': 'Visual Filter',
    'Semua Kategori': 'All Categories',
    'Semua Wilayah': 'All Regions',
    'Pencarian Parameter Visual (Leksikografis)': 'Visual Parameter Search (Lexicographical)',
    'Reset Filter Visual': 'Reset Visual Filter',
    'Bentuk Tangan (Handshape)': 'Handshape',
    'Lokasi Gerakan (Location)': 'Location',
    '* Pencarian visual mencocokkan isyarat berdasarkan cara mempraktikkannya. Sangat berguna untuk Tuli dan penerjemah.': '* Visual search matches signs based on how they are practiced. Highly useful for Deaf individuals and interpreters.',
    'Memuat kamus isyarat...': 'Loading sign dictionary...',
    'Tidak ditemukan kosa isyarat': 'No sign words found',
    'Coba gunakan kata kunci lain atau ubah filter pencarian.': 'Try using other keywords or change the search filter.',
    'Browser Anda tidak mendukung fitur Pencarian Suara.': 'Your browser does not support the Voice Search feature.',

    // Detail Sign Page
    'Memuat detail kosa isyarat...': 'Loading sign details...',
    'Kembali ke Kamus': 'Back to Dictionary',
    'Menyukai kosa isyarat ini!': 'Liked this sign!',
    'Batal menyukai kosa isyarat.': 'Unliked this sign.',
    'Tautan berhasil disalin ke clipboard!': 'Link copied to clipboard successfully!',
    'Gagal menyalin tautan.': 'Failed to copy link.',
    'Asal-usul (Etimologi)': 'Origin (Etymology)',
    'Konteks Penggunaan': 'Usage Context',
    'Wawasan Budaya Digital': 'Digital Cultural Insights',
    'Dapatkan Wawasan AI': 'Get AI Insights',
    'Menganalisis Budaya...': 'Analyzing Culture...',
    'Gagal mendapatkan wawasan AI.': 'Failed to get AI insights.',
    'Powered by Gemini AI - Menganalisis konteks regional dan linguistik.': 'Powered by Gemini AI - Analyzing regional and linguistic context.',
    'Diskusi Komunitas': 'Community Discussion',
    'Tambahkan catatan atau variasi daerah lain...': 'Add notes or other regional variations...',
    'Kirim Masukan': 'Send Feedback',
    'Belum ada diskusi. Jadilah yang pertama memberikan masukan!': 'No discussion yet. Be the first to give feedback!',
    'Batal': 'Cancel',
    'Simpan': 'Save',
    'Edit': 'Edit',
    'Informan Tuli': 'Deaf Informant',
    'adalah bagian dari kontributor aktif relawan komunitas Tuli yang berkomitmen tinggi mendokumentasikan bahasa isyarat daerah': 'is part of the active Deaf community volunteer contributors highly committed to documenting regional sign language',
    'agar lestari.': 'to preserve it.',
    'Lihat Profil & Kontribusi': 'View Profile & Contributions',
    'Verifikasi Akurasi': 'Accuracy Verification',
    'Video ini telah divalidasi oleh tim ahli PUSBISINDO untuk memastikan akurasi penggunaan isyarat secara linguistik.': 'This video has been validated by the PUSBISINDO expert team to ensure linguistic sign usage accuracy.',
    'Isyarat Terkait': 'Related Signs',
    'Apakah Anda yakin ingin menghapus masukan ini?': 'Are you sure you want to delete this feedback?',

    // Login Page
    'Login': 'Login',
    'Masuk': 'Login',
    'Daftar': 'Register',
    'Registrasi Akun': 'Account Registration',
    'Lupa Password': 'Forgot Password',
    'Masuk untuk mengakses dashboard & profil Anda.': 'Login to access your dashboard & profile.',
    'Daftar sebagai anggota atau admin baru platform Garda BISINDO.': 'Register as a new member or admin of the Garda BISINDO platform.',
    'Masukkan email Anda untuk pemulihan atau melihat kata sandi Anda.': 'Enter your email for recovery or to view your password.',
    'Email dan password (min. 6 karakter) wajib diisi.': 'Email and password (min. 6 characters) are required.',
    'Semua data registrasi wajib diisi. Password minimal 6 karakter.': 'All registration fields are required. Password min. 6 characters.',
    'Masukkan email Anda untuk pemulihan sandi.': 'Enter your email for password recovery.',
    'Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.': 'Registration successful! Please log in using your new account.',
    'Email Terdaftar': 'Registered Email',
    'Simulasi Demo Pemulihan:': 'Simulation Demo Recovery:',
    'Kata sandi akun Anda saat ini:': 'Your current account password is:',
    'Kirim Permintaan Pemulihan': 'Send Recovery Request',
    'Halaman Login': 'Login Page',
    'Belum punya akun?': 'Don\'t have an account?',
    'Daftar Kontributor': 'Register Contributor',
    'Sudah punya akun?': 'Already have an account?',
    'Wilayah / Kota Asal': 'Region / City of Origin',

    // Profile Page
    'Ubah Sampul': 'Change Cover',
    'Ubah Foto': 'Change Photo',
    'Pengaturan Akun': 'Account Settings',
    'Edit Profil': 'Edit Profile',
    'Tentang Saya': 'About Me',
    'Peringkat Komunitas': 'Community Rank',
    'Badges & Pencapaian': 'Badges & Achievements',
    'Pencapaian': 'Achievements',
    'Lencana': 'Badge',
    'Kontribusi Terakhir': 'Last Contributions',
    'Terpopuler': 'Most Popular',
    'Terbaru': 'Latest',
    'Memuat kosa isyarat kontribusi Anda...': 'Loading your contributed sign words...',
    'Belum ada video isyarat yang Anda kontribusikan.': 'No sign videos contributed by you yet.',
    'Statistik Kontribusi': 'Contribution Statistics',
    'Penayangan': 'Views',
    'Suka': 'Likes',
    'Dibagikan': 'Shared',
    'Grafik Kontribusi Bulanan (6 Bulan Terakhir)': 'Monthly Contribution Chart (Last 6 Months)',
    'Arahkan kursor untuk info audio': 'Hover for audio info',
    'Detail Bulan': 'Month Details',
    'Arahkan kursor ke titik grafik untuk melihat rincian kontribusi.': 'Hover over the graph point to view contribution details.',
    'Memuat diskusi Anda...': 'Loading your discussions...',
    'Belum ada diskusi.': 'No discussions yet.',
    'Ubah Sandi & Keamanan': 'Change Password & Security',
    'Password Lama': 'Old Password',
    'Password Baru': 'New Password',
    'Konfirmasi Password': 'Confirm Password',
    'Preferensi Notifikasi': 'Notification Preferences',
    'Aksesibilitas & Tampilan': 'Accessibility & Settings',
    'Bahasa Tampilan': 'Display Language',
    'Simpan Preferensi': 'Save Preferences',

    // Landing Page extra
    'Kontributor Tuli': 'Deaf Contributors',
    'Visi Kami': 'Our Vision',
    'Memastikan tidak ada variasi kosa isyarat daerah yang hilang dari sejarah budaya Indonesia melalui dokumentasi berbasis data dan AI.': 'Ensuring no regional sign language variations are lost from Indonesian cultural history through data-driven and AI documentation.',
    'Peta Kepulauan Indonesia': 'Indonesian Archipelago Map',
    'Sumatera': 'Sumatra',
    'Jawa': 'Java',
    'Kalimantan': 'Kalimantan',
    'Sulawesi': 'Sulawesi',
    'Bali & Nusa Tenggara': 'Bali & Nusa Tenggara',
    'Maluku & Papua': 'Maluku & Papua',
    'Dialek Sumatera kaya akan ekspresi wajah yang tegas dengan isyarat tangan yang lugas.': 'Sumatra dialect is rich in firm facial expressions with straightforward hand gestures.',
    'Variasi isyarat di Jawa memiliki gerakan tangan yang sangat halus dengan kontras dialek pesisir yang dinamis.': 'Sign variations in Java feature very smooth hand movements with contrastingly dynamic coastal dialects.',
    'Isyarat lokal di Kalimantan banyak dipengaruhi oleh penamaan alam sekitar seperti sungai dan hutan.': 'Local signs in Kalimantan are heavily influenced by natural names such as rivers and forests.',
    'Bahasa isyarat di Sulawesi memiliki pergerakan tangan berputar yang khas dan ekspresif.': 'Sign language in Sulawesi features distinct and expressive rotating hand movements.',
    'Terkenal dengan Desa Bengkala di Bali yang memiliki bahasa isyarat alami sendiri (Kata Kolok) selama berabad-abad.': 'Famous for Bengkala Village in Bali, which has had its own natural sign language (Kata Kolok) for centuries.',
    'Memiliki struktur dialek lokal yang unik dengan kombinasi isyarat visual yang luas.': 'Has a unique local dialect structure with a broad combination of visual signs.',
    'Bungo (Bunga)': 'Bungo (Flower)',
    'Maturnuwun (Terima Kasih)': 'Maturnuwun (Thank You)',
    'Sungai': 'River',
    'Torang (Kita)': 'Torang (Us/We)',
    'Mepatut (Setuju)': 'Mepatut (Agree)',
    'Sa (Saya)': 'Sa (Me/I)',
    'Isyarat': 'Signs',
    'MEMUTAR ISYARAT': 'PLAYING SIGN GESTURE',
    'Gerakan menempelkan telapak tangan di dagu lalu diarahkan ke depan melambangkan rasa syukur atau terima kasih.': 'The gesture of touching the palm to the chin and moving it forward symbolizes gratitude or thank you.',
    'Kedua tangan membentuk sudut segitiga seperti atap di atas kepala untuk mensimbolkan tempat tinggal.': 'Both hands form a triangular roof shape over the head to symbolize a place of residence.',
    'Jari-jari tangan dirapatkan menghadap ke bawah dan didekatkan ke mulut berulang kali menunjukkan aktivitas makan.': 'The fingers are brought together facing down and moved near the mouth repeatedly to show the activity of eating.',
    'Rumah': 'House',
    'Terima Kasih': 'Thank You',
    'Makan': 'Eat',
    'Sama-sama': 'You are welcome',
    'Sekolah': 'School',
    'Kantor': 'Office',
    'Buku': 'Book',
    'Minum': 'Drink',
    'Tidur': 'Sleep',
    'Bicara': 'Speak'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('system_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.systemLanguage) {
            return parsed.systemLanguage === 'en' ? 'en' : 'id';
          }
        }
        const browserLang = navigator.language || (navigator as any).userLanguage;
        if (browserLang && browserLang.toLowerCase().startsWith('en')) {
          return 'en';
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 'id';
  });

  useEffect(() => {
    const checkLang = () => {
      try {
        const saved = localStorage.getItem('system_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.systemLanguage) {
            setLangState(parsed.systemLanguage === 'en' ? 'en' : 'id');
            return;
          }
        }
        const browserLang = navigator.language || (navigator as any).userLanguage;
        if (browserLang && browserLang.toLowerCase().startsWith('en')) {
          setLangState('en');
        } else {
          setLangState('id');
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkLang();
    window.addEventListener('systemSettingsUpdate', checkLang);
    window.addEventListener('storage', checkLang);
    return () => {
      window.removeEventListener('systemSettingsUpdate', checkLang);
      window.removeEventListener('storage', checkLang);
    };
  }, []);

  const t = (key: string): string => {
    return TRANSLATIONS[lang][key] || TRANSLATIONS['id'][key] || key;
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      const saved = localStorage.getItem('system_settings');
      const parsed = saved ? JSON.parse(saved) : {};
      parsed.systemLanguage = newLang;
      localStorage.setItem('system_settings', JSON.stringify(parsed));
      window.dispatchEvent(new Event('systemSettingsUpdate'));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
