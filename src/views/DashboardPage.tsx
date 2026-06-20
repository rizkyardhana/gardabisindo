import { LayoutDashboard, Video, Users, MessageSquare, Plus, Bell, Search, Settings, ArrowUpRight, CheckCircle2, Clock, Trash2, Check, X, FolderPlus, Globe, UserCheck, AlertCircle, ToggleLeft, ToggleRight, Play, Camera, PlusCircle, Pencil, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useState, useEffect, useRef, useCallback } from 'react';

const TRANSLATIONS = {
  id: {
    // Sidebar
    'Ikhtisar': 'Ikhtisar',
    'Kelola Isyarat': 'Kelola Isyarat',
    'Informan': 'Informan',
    'Kategori': 'Kategori',
    'Wilayah': 'Wilayah',
    'Pengaturan': 'Pengaturan',
    'Penyimpanan Arsip': 'Penyimpanan Arsip',
    'Tambah Kapasitas': 'Tambah Kapasitas',
    
    // Overview/Ikhtisar
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
    
    // Table Headers
    'Kosa Isyarat': 'Kosa Isyarat',
    'Kategori': 'Kategori',
    'Wilayah': 'Wilayah',
    'Status': 'Status',
    'Waktu': 'Waktu',
    'Aksi': 'Aksi',
    'Nama': 'Nama',
    'Kontribusi': 'Kontribusi',
    'Bergabung': 'Bergabung',

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
  },
  en: {
    // Sidebar
    'Ikhtisar': 'Overview',
    'Kelola Isyarat': 'Manage Signs',
    'Informan': 'Informants',
    'Kategori': 'Categories',
    'Wilayah': 'Regions',
    'Pengaturan': 'Settings',
    'Penyimpanan Arsip': 'Archive Storage',
    'Tambah Kapasitas': 'Upgrade Capacity',
    
    // Overview/Ikhtisar
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
    
    // Table Headers
    'Kosa Isyarat': 'Sign Word',
    'Kategori': 'Category',
    'Wilayah': 'Region',
    'Status': 'Status',
    'Waktu': 'Time',
    'Aksi': 'Action',
    'Nama': 'Name',
    'Kontribusi': 'Contributions',
    'Bergabung': 'Joined',

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
  }
};

export function DashboardPage() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('system_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      siteName: 'GARDA BISINDO',
      systemLanguage: 'id',
      allowGuestUploads: false,
      requireApproval: true,
      emailNotifications: true,
      pushNotifications: false,
    };
  });

  const t = (key: keyof typeof TRANSLATIONS['id']) => {
    const lang = settings.systemLanguage === 'en' ? 'en' : 'id';
    return TRANSLATIONS[lang][key] || key;
  };

  const [userName, setUserName] = useState('Rizki Ardhana');
  const userRole = localStorage.getItem('auth_role') || 'informant';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) {
          setUserName(parsed.name);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Navigation tabs in Indonesian
  const [activeTab, setActiveTab] = useState<'Ikhtisar' | 'Kelola Isyarat' | 'Informan' | 'Kategori' | 'Wilayah' | 'Pengaturan'>('Ikhtisar');
  
  // Dialog upload state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingSign, setEditingSign] = useState<any | null>(null);
  const [word, setWord] = useState('');
  const [region, setRegion] = useState('Nasional');
  const [category, setCategory] = useState('Teknologi');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Camera/Webcam recording states
  const [uploadMode, setUploadMode] = useState<'file' | 'camera'>('file');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const videoRef = useCallback((el: HTMLVideoElement | null) => {
    if (el) {
      el.srcObject = stream;
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      setRecordedVideoUrl(null);
      setRecordedChunks([]);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        triggerToast("Kamera tidak didukung atau memerlukan koneksi aman (HTTPS/localhost) jika diakses dari perangkat lain.");
        return;
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
      setStream(mediaStream);
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
      triggerToast("Gagal mengakses kamera. Pastikan izin kamera telah diberikan.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startRecording = () => {
    if (!stream) return;
    setRecordedChunks([]);
    
    let options: any = {};
    if (MediaRecorder.isTypeSupported('video/webm')) {
      options = { 
        mimeType: 'video/webm',
        videoBitsPerSecond: 400000
      };
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      options = { 
        mimeType: 'video/mp4',
        videoBitsPerSecond: 400000
      };
    }

    try {
      const recorder = new MediaRecorder(stream, options);
      
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };

      recorder.start(500);
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (e) {
      console.error("Gagal memulai rekaman:", e);
      triggerToast("Gagal merekam video pada perangkat ini.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setIsRecording(false);
  };

  // Convert chunks to preview url
  useEffect(() => {
    if (recordedChunks.length > 0 && !isRecording) {
      const mime = mediaRecorder?.mimeType || 'video/webm';
      const blob = new Blob(recordedChunks, { type: mime });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setFileName(mime.includes('mp4') ? "Rekaman_Kamera.mp4" : "Rekaman_Kamera.webm");
    }
  }, [recordedChunks, isRecording]);

  const closeUploadModal = () => {
    stopCamera();
    setIsUploadOpen(false);
    setWord('');
    setRegion('Nasional');
    setCategory('Teknologi');
    setDescription('');
    setFileName(null);
    setSelectedFile(null);
    setRecordedVideoUrl(null);
    setUploadMode('file');
    setEditingSign(null);
  };

  const openUploadModal = () => {
    let userRegion = 'Nasional';
    try {
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.location) {
          userRegion = parsed.location.split(',')[0].trim();
        }
      }
    } catch (e) {
      console.error(e);
    }
    setRegion(userRegion);
    setWord('');
    setCategory('Teknologi');
    setDescription('');
    setFileName(null);
    setSelectedFile(null);
    setRecordedVideoUrl(null);
    setUploadMode('file');
    setEditingSign(null);
    setIsUploadOpen(true);
  };

  const handleStartEdit = (sign: any) => {
    setEditingSign(sign);
    setWord(sign.word);
    setRegion(sign.region);
    setCategory(sign.category);
    setDescription(sign.description || '');
    setRecordedVideoUrl(sign.videoUrl);
    setFileName(sign.videoUrl.split('/').pop() || 'Video');
    setIsUploadOpen(true);
  };

  // Video preview modal state
  const [previewSign, setPreviewSign] = useState<any | null>(null);

  // Success message toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. Dynamic Recent Uploads and Signs State from Server Backend
  const [signs, setSigns] = useState<any[]>([]);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSigns = async () => {
    try {
      const res = await fetch('/api/signs');
      if (res.ok) {
        const data = await res.json();
        setSigns(data);
        setRecentUploads(data.slice(0, 6));
      }
    } catch (e) {
      console.error("Gagal mengambil data isyarat:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error("Gagal mengambil data kategori:", e);
    }
  };

  const fetchInformants = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setInformants(data);
      }
    } catch (e) {
      console.error("Gagal mengambil data informan:", e);
    }
  };

  const fetchRegions = async () => {
    try {
      const res = await fetch('/api/regions');
      if (res.ok) {
        const data = await res.json();
        setRegions(data);
      }
    } catch (e) {
      console.error("Gagal mengambil data wilayah:", e);
    }
  };

  useEffect(() => {
    fetchSigns();
    fetchCategories();
    fetchInformants();
    fetchRegions();
  }, []);

  const [signsFilter, setSignsFilter] = useState<'All' | 'Approved' | 'Pending' | 'Rejected'>('All');
  const [signsSearch, setSignsSearch] = useState('');

  // 3. Dynamic Informants (Informan) State
  const [informants, setInformants] = useState<any[]>([]);

  // 4. Dynamic Categories (Kategori) State
  const [categories, setCategories] = useState([
    { id: 1, name: 'Harian', count: 850, description: 'Isyarat percakapan sehari-hari seperti sapaan, makan, tidur.' },
    { id: 2, name: 'Teknologi', count: 120, description: 'Isyarat terkait komputer, internet, gawai, dan teknologi digital.' },
    { id: 3, name: 'Pendidikan', count: 240, description: 'Isyarat istilah sekolah, pelajaran, dan dunia akademik.' },
    { id: 4, name: 'Medis', count: 95, description: 'Isyarat istilah kesehatan, penyakit, obat, dan rumah sakit.' },
  ]);

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Dynamic Regions (Wilayah) State
  const [regions, setRegions] = useState<any[]>([]);
  const [newRegName, setNewRegName] = useState('');

  // 5. Settings (Pengaturan) State

  // Action helper for toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Sign Actions
  const handleApproveSign = async (id: number) => {
    try {
      const res = await fetch(`/api/signs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
      if (res.ok) {
        await fetchSigns();
        triggerToast('Kosa isyarat berhasil disetujui!');
      } else {
        triggerToast('Gagal menyetujui kosa isyarat.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Gagal menyetujui kosa isyarat.');
    }
  };

  const handleRejectSign = async (id: number) => {
    try {
      const res = await fetch(`/api/signs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
      if (res.ok) {
        await fetchSigns();
        triggerToast('Kosa isyarat telah ditolak.');
      } else {
        triggerToast('Gagal menolak kosa isyarat.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Gagal menolak kosa isyarat.');
    }
  };

  const handleDeleteSign = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kosa isyarat ini?')) {
      try {
        const res = await fetch(`/api/signs/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          await fetchSigns();
          triggerToast('Kosa isyarat berhasil dihapus.');
        } else {
          triggerToast('Gagal menghapus kosa isyarat.');
        }
      } catch (err) {
        console.error(err);
        triggerToast('Gagal menghapus kosa isyarat.');
      }
    }
  };

  // Informant Actions
  const handleToggleVerifyInformant = async (email: string) => {
    const informant = informants.find(i => i.email === email);
    if (!informant) return;
    const nextStatus = !informant.verified;
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: nextStatus })
      });
      if (res.ok) {
        await fetchInformants();
        triggerToast(nextStatus ? `${informant.name} telah diverifikasi!` : `Verifikasi ${informant.name} dibatalkan.`);
      } else {
        triggerToast('Gagal memperbarui status verifikasi.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Gagal memperbarui status verifikasi.');
    }
  };

  const handleDeleteInformant = async (email: string) => {
    const informant = informants.find(i => i.email === email);
    if (!informant) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus informan ${informant.name}?`)) {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(email)}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          await fetchInformants();
          triggerToast(`Informan ${informant.name} berhasil dihapus.`);
        } else {
          triggerToast('Gagal menghapus informan.');
        }
      } catch (err) {
        console.error(err);
        triggerToast('Gagal menghapus informan.');
      }
    }
  };

  // Category Actions
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const exists = categories.some(c => c.name.toLowerCase() === newCatName.trim().toLowerCase());
    if (exists) {
      triggerToast('Kategori sudah terdaftar!');
      return;
    }
    
    const newCat = {
      name: newCatName.trim(),
      description: newCatDesc.trim() || 'Tidak ada deskripsi.'
    };

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
      if (res.ok) {
        await fetchCategories();
        setNewCatName('');
        setNewCatDesc('');
        triggerToast('Kategori baru berhasil ditambahkan!');
      } else {
        const errorData = await res.json().catch(() => ({}));
        triggerToast(errorData.error || 'Gagal menambahkan kategori.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Gagal menambahkan kategori.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          await fetchCategories();
          triggerToast('Kategori berhasil dihapus.');
        } else {
          triggerToast('Gagal menghapus kategori.');
        }
      } catch (err) {
        console.error(err);
        triggerToast('Gagal menghapus kategori.');
      }
    }
  };

  // Region Actions
  const handleAddRegion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegName.trim()) return;
    const exists = regions.some(r => r.name.toLowerCase() === newRegName.trim().toLowerCase());
    if (exists) {
      triggerToast('Wilayah sudah terdaftar!');
      return;
    }
    
    const newReg = {
      name: newRegName.trim()
    };

    try {
      const res = await fetch('/api/regions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReg)
      });
      if (res.ok) {
        await fetchRegions();
        setNewRegName('');
        triggerToast('Wilayah baru berhasil ditambahkan!');
      } else {
        const errorData = await res.json().catch(() => ({}));
        triggerToast(errorData.error || 'Gagal menambahkan wilayah.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Gagal menambahkan wilayah.');
    }
  };

  const handleDeleteRegion = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus wilayah ini?')) {
      try {
        const res = await fetch(`/api/regions/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          await fetchRegions();
          triggerToast('Wilayah berhasil dihapus.');
        } else {
          triggerToast('Gagal menghapus wilayah.');
        }
      } catch (err) {
        console.error(err);
        triggerToast('Gagal menghapus wilayah.');
      }
    }
  };

  // Settings Actions
  const handleToggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('system_settings', JSON.stringify(settings));
      window.dispatchEvent(new Event('systemSettingsUpdate'));
      triggerToast(settings.systemLanguage === 'en' ? 'All settings saved successfully!' : 'Semua pengaturan berhasil disimpan!');
    } catch (err) {
      console.error(err);
      triggerToast(settings.systemLanguage === 'en' ? 'Failed to save settings.' : 'Gagal menyimpan pengaturan.');
    }
  };

  // Upload Sign handler
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;

    let finalVideoUrl = editingSign ? editingSign.videoUrl : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    
    // Check if we need to upload a video
    if (uploadMode === 'file' && selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        triggerToast('Ukuran file video terlalu besar. Maksimal 10MB.');
        return;
      }
      setIsUploading(true);
      try {
        const ext = selectedFile.name.split('.').pop() || 'webm';
        const response = await fetch('/api/upload-video', {
          method: 'POST',
          headers: {
            'Content-Type': selectedFile.type || 'video/webm',
            'x-file-extension': ext
          },
          body: selectedFile
        });
        
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || "Gagal mengunggah video ke server");
        }
        if (data.success && data.videoUrl) {
          finalVideoUrl = data.videoUrl;
        }
      } catch (err: any) {
        console.error(err);
        triggerToast(`Gagal: ${err.message || 'Silakan coba lagi.'}`);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    } else if (uploadMode === 'camera' && recordedChunks.length > 0) {
      setIsUploading(true);
      try {
        const mime = mediaRecorder?.mimeType || 'video/webm';
        const ext = mime.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(recordedChunks, { type: mime });
        
        const response = await fetch('/api/upload-video', {
          method: 'POST',
          headers: {
            'Content-Type': mime,
            'x-file-extension': ext
          },
          body: blob
        });
        
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || "Gagal mengunggah video rekaman");
        }
        if (data.success && data.videoUrl) {
          finalVideoUrl = data.videoUrl;
        }
      } catch (err: any) {
        console.error(err);
        triggerToast(`Gagal: ${err.message || 'Silakan coba lagi.'}`);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    if (editingSign) {
      const updatedFields = {
        word: word.trim(),
        category: category,
        region: region.trim(),
        videoUrl: finalVideoUrl,
        description: description.trim() || 'Deskripsi gerakan isyarat baru.'
      };

      try {
        const res = await fetch(`/api/signs/${editingSign.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields)
        });
        if (res.ok) {
          await fetchSigns();
          setSelectedFile(null);
          setEditingSign(null);
          closeUploadModal();
          triggerToast('Perubahan kosa isyarat berhasil disimpan!');
        } else {
          triggerToast('Gagal menyimpan perubahan.');
        }
      } catch (err) {
        console.error(err);
        triggerToast('Gagal menyimpan perubahan.');
      }
      return;
    }

    let currentInformantName = 'Rizki Ardhana';
    try {
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) currentInformantName = parsed.name;
      }
    } catch (e) {
      console.error(e);
    }

    const newSign = {
      word: word.trim(),
      category: category,
      region: region.trim(),
      status: 'Approved' as const,
      informant: currentInformantName,
      date: new Date().toISOString().split('T')[0],
      videoUrl: finalVideoUrl,
      description: description.trim() || 'Deskripsi gerakan isyarat baru.'
    };

    try {
      const res = await fetch('/api/signs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSign)
      });
      if (res.ok) {
        await fetchSigns();
        setSelectedFile(null);
        closeUploadModal();
        triggerToast('Kosa isyarat berhasil di-publish!');
      } else {
        triggerToast('Gagal mengupload kosa isyarat.');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Gagal mengupload kosa isyarat.');
    }
  };

  // Calculate dynamic stats
  const totalVideoCount = 1248 + signs.filter(s => s.status === 'Approved').length;
  const pendingCount = signs.filter(s => s.status === 'Pending').length;
  const totalContributorsCount = informants.length;

  const stats = [
    { label: 'Total Video', value: totalVideoCount.toLocaleString(), change: '+12%', icon: Video, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Menunggu Persetujuan', value: pendingCount.toString(), change: pendingCount > 0 ? `+${pendingCount}` : '0', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Total Kontributor', value: totalContributorsCount.toString(), change: '+24', icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { label: 'Interaksi Kamus', value: '12.5k', change: '+15%', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const filteredSigns = signs.filter(sign => {
    const matchesStatus = signsFilter === 'All' || sign.status === signsFilter;
    const matchesSearch = sign.word.toLowerCase().includes(signsSearch.toLowerCase()) ||
                          sign.informant.toLowerCase().includes(signsSearch.toLowerCase()) ||
                          sign.region.toLowerCase().includes(signsSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="pt-24 pb-12 bg-slate-50 min-h-screen relative">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-28 right-6 z-[110] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Dashboard Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
               <nav className="space-y-1">
                  {[
                    { id: 'Ikhtisar', label: 'Ikhtisar', icon: LayoutDashboard },
                    { id: 'Kelola Isyarat', label: 'Kelola Isyarat', icon: Video, badge: pendingCount },
                    { id: 'Informan', label: 'Informan', icon: Users },
                    { id: 'Kategori', label: 'Kategori', icon: MessageSquare },
                    { id: 'Wilayah', label: 'Wilayah', icon: MapPin },
                    { id: 'Pengaturan', label: 'Pengaturan', icon: Settings },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all",
                        activeTab === tab.id ? "bg-garda-red text-white shadow-lg shadow-red-100" : "text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                         <tab.icon className="w-4 h-4" />
                         {t(tab.label as any)}
                      </div>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold",
                          activeTab === tab.id ? "bg-white text-garda-red" : "bg-red-500 text-white"
                        )}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  ))}
               </nav>
            </div>
            
            <div className="bg-garda-navy rounded-3xl p-6 text-white overflow-hidden relative">
               <div className="relative z-10">
                  <h4 className="font-bold text-sm mb-2">{t('Penyimpanan Arsip')}</h4>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                     <span>{t('Terpakai')}: 24%</span>
                     <span>1.2 TB / 5.0 TB</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mb-6">
                     <div className="h-full w-[24%] bg-garda-red rounded-full" />
                  </div>
                  <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all">
                     {t('Tambah Kapasitas')}
                  </button>
               </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div>
                   <h1 className="text-3xl mb-1">{t('Dashboard Pengelolaan')}</h1>
                   <p className="text-slate-500 text-sm">
                     {t('Selamat datang kembali, Tim Dokumentasi & Kontributor GARDA.')}
                   </p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                   <div className="relative flex-1 md:flex-none">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <input 
                       type="text" 
                       placeholder={t('Cari data...')} 
                       className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-garda-red/10 transition-all w-full md:w-64" 
                     />
                   </div>
                   <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                      <Bell className="w-5 h-5" />
                   </button>
                   <button
                     type="button"
                     onClick={openUploadModal}
                     className="flex items-center gap-2 px-4 py-2.5 bg-garda-red text-white rounded-xl font-bold text-sm shadow-lg shadow-red-100 hover:scale-105 transition-all whitespace-nowrap"
                   >
                      <Plus className="w-4 h-4" />
                      {t('Upload Kosa')}
                   </button>
                </div>
            </div>

            {/* Stats Grid (Only on Ikhtisar Tab) */}
            {activeTab === 'Ikhtisar' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {stats.map((stat) => (
                   <motion.div 
                     key={stat.label}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
                   >
                      <div className="flex justify-between items-start mb-4">
                         <div className={cn("p-3 rounded-2xl", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                         </div>
                         <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", stat.change.startsWith('+') ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
                            {stat.change}
                         </span>
                      </div>
                      <p className="text-sm text-slate-400 font-medium mb-1">{t(stat.label as any)}</p>
                      <h3 className="text-3xl font-display font-bold">{stat.value}</h3>
                   </motion.div>
                 ))}
              </div>
            )}
 
            {/* Content by activeTab */}
            {activeTab === 'Ikhtisar' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold">{t('Aktivitas Terkini')}</h3>
                  <button className="text-xs font-bold text-garda-red hover:underline">{t('Lihat Semua Aktivitas')}</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead>
                        <tr className="text-left text-[10px] uppercase tracking-widest text-slate-400">
                           <th className="px-6 py-4 font-bold">{t('Kosa Isyarat')}</th>
                           <th className="px-6 py-4 font-bold">{t('Kategori')}</th>
                           <th className="px-6 py-4 font-bold">{t('Wilayah')}</th>
                           <th className="px-6 py-4 font-bold">{t('Status')}</th>
                           <th className="px-6 py-4 font-bold">{t('Waktu')}</th>
                           <th className="px-6 py-4 font-bold text-right">{t('Aksi')}</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {recentUploads.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <button
                                      type="button"
                                      onClick={() => setPreviewSign(item)}
                                      className="w-10 h-10 rounded-lg bg-garda-red/5 hover:bg-garda-red text-garda-red hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
                                      title="Tonton Video Isyarat"
                                    >
                                       <Play className="w-4 h-4 fill-current" />
                                    </button>
                                   <span className="font-bold text-sm">{item.word}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-xs font-medium text-slate-500">{item.category}</td>
                             <td className="px-6 py-4 text-xs font-medium text-slate-500">{item.region}</td>
                             <td className="px-6 py-4">
                                  <select
                                    value={item.status}
                                    onChange={async (e) => {
                                      const newStatus = e.target.value as 'Approved' | 'Pending' | 'Rejected';
                                      try {
                                        const res = await fetch(`/api/signs/${item.id}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ status: newStatus })
                                        });
                                        if (res.ok) {
                                          await fetchSigns();
                                          triggerToast(`Status berhasil diubah menjadi: ${newStatus === 'Approved' ? 'Disetujui' : newStatus === 'Pending' ? 'Menunggu' : 'Ditolak'}`);
                                        } else {
                                          triggerToast('Gagal memperbarui status.');
                                        }
                                      } catch (err) {
                                        console.error(err);
                                        triggerToast('Gagal memperbarui status.');
                                      }
                                    }}
                                    className={cn(
                                       "text-[10px] font-bold px-2 py-0.5 rounded-full border outline-none cursor-pointer bg-transparent transition-colors",
                                       item.status === 'Approved' ? "bg-green-50 text-green-600 border-green-200" :
                                       item.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-200" :
                                       "bg-red-50 text-red-650 border-red-200"
                                    )}
                                  >
                                    <option value="Approved" className="text-slate-800 bg-white font-medium">Disetujui</option>
                                    <option value="Pending" className="text-slate-800 bg-white font-medium">Menunggu</option>
                                    <option value="Rejected" className="text-slate-800 bg-white font-medium">Ditolak</option>
                                  </select>
                               </td>
                             <td className="px-6 py-4 text-xs text-slate-400">{item.date}</td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end items-center gap-1.5">
                                   <button 
                                     onClick={() => handleStartEdit(item)}
                                     className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                     title="Edit Kosa Isyarat"
                                   >
                                     <Pencil className="w-4 h-4" />
                                   </button>
                                   {item.status === 'Pending' ? (
                                       <>
                                         <button 
                                           onClick={() => handleApproveSign(item.id)}
                                           className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                                           title="Setujui"
                                         >
                                           <Check className="w-4 h-4" />
                                         </button>
                                         <button 
                                           onClick={() => handleRejectSign(item.id)}
                                           className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                           title="Tolak"
                                         >
                                           <X className="w-4 h-4" />
                                         </button>
                                       </>
                                    ) : (
                                       <button 
                                         onClick={() => setPreviewSign(item)}
                                         className="p-1 text-slate-400 hover:text-slate-900 transition-all cursor-pointer"
                                         title="Detail"
                                       >
                                          <ArrowUpRight className="w-4 h-4" />
                                       </button>
                                    )}
                                 </div>
                              </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Kelola Isyarat */}
            {activeTab === 'Kelola Isyarat' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6"
              >
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="font-bold text-xl text-slate-950">{t('Daftar Kosa Isyarat')}</h3>
                  
                  {/* Status Filters */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'All', label: 'Semua' },
                      { id: 'Approved', label: 'Disetujui' },
                      { id: 'Pending', label: 'Menunggu' },
                      { id: 'Rejected', label: 'Ditolak' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setSignsFilter(f.id as any)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                          signsFilter === f.id ? "bg-slate-900 text-white border-slate-950" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        {t(f.label as any)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={t('Cari kosa kata, kontributor, wilayah...')} 
                    value={signsSearch}
                    onChange={e => setSignsSearch(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-garda-red/10 transition-all w-full"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100">
                        <th className="px-4 py-3 font-bold">{t('Kosa Isyarat')}</th>
                        <th className="px-4 py-3 font-bold">{t('Kategori')}</th>
                        <th className="px-4 py-3 font-bold">{t('Wilayah')}</th>
                        <th className="px-4 py-3 font-bold">{t('Kontributor')}</th>
                        <th className="px-4 py-3 font-bold">{t('Tanggal')}</th>
                        <th className="px-4 py-3 font-bold">{t('Status')}</th>
                        <th className="px-4 py-3 font-bold text-right">{t('Aksi')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredSigns.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                            {t('Tidak ada kosa isyarat ditemukan.')}
                          </td>
                        </tr>
                      ) : (
                        filteredSigns.map((sign) => (
                           <tr key={sign.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-4 py-4 font-bold text-slate-900 text-sm">
                               <div className="flex items-center gap-2">
                                 <button
                                   type="button"
                                   onClick={() => setPreviewSign(sign)}
                                   className="w-8 h-8 rounded-full bg-garda-red/5 hover:bg-garda-red text-garda-red hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
                                   title="Tonton Video Isyarat"
                                 >
                                   <Play className="w-3.5 h-3.5 fill-current" />
                                 </button>
                                 <span>{sign.word}</span>
                               </div>
                             </td>
                            <td className="px-4 py-4 text-xs font-semibold text-slate-500">{sign.category}</td>
                            <td className="px-4 py-4 text-xs font-semibold text-slate-500">{sign.region}</td>
                            <td className="px-4 py-4 text-xs text-slate-600 font-medium">{sign.informant}</td>
                            <td className="px-4 py-4 text-xs text-slate-400">{sign.date}</td>
                            <td className="px-4 py-4">
                                  <select
                                   value={sign.status}
                                   onChange={async (e) => {
                                     const newStatus = e.target.value as 'Approved' | 'Pending' | 'Rejected';
                                     try {
                                       const res = await fetch(`/api/signs/${sign.id}`, {
                                         method: 'PUT',
                                         headers: { 'Content-Type': 'application/json' },
                                         body: JSON.stringify({ status: newStatus })
                                       });
                                       if (res.ok) {
                                         await fetchSigns();
                                         triggerToast(`Status berhasil diubah menjadi: ${newStatus === 'Approved' ? 'Disetujui' : newStatus === 'Pending' ? 'Menunggu' : 'Ditolak'}`);
                                       } else {
                                         triggerToast('Gagal memperbarui status.');
                                       }
                                     } catch (err) {
                                       console.error(err);
                                       triggerToast('Gagal memperbarui status.');
                                     }
                                   }}
                                   className={cn(
                                     "text-[10px] font-bold px-2 py-0.5 rounded-full border outline-none cursor-pointer bg-transparent transition-colors",
                                     sign.status === 'Approved' ? "bg-green-50 text-green-600 border-green-200" :
                                     sign.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-200" :
                                     "bg-red-50 text-red-650 border-red-200"
                                   )}
                                 >
                                   <option value="Approved" className="text-slate-800 bg-white font-medium">Disetujui</option>
                                   <option value="Pending" className="text-slate-800 bg-white font-medium">Menunggu</option>
                                   <option value="Rejected" className="text-slate-800 bg-white font-medium">Ditolak</option>
                                 </select>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex justify-end items-center gap-1.5">
                                <button 
                                  onClick={() => handleStartEdit(sign)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                  title="Edit Kosa Isyarat"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                {sign.status === 'Pending' && (
                                  <>
                                    <button 
                                      onClick={() => handleApproveSign(sign.id)}
                                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                                      title="Setujui"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleRejectSign(sign.id)}
                                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                                      title="Tolak"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                <button 
                                  onClick={() => handleDeleteSign(sign.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Informan */}
            {activeTab === 'Informan' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xl text-slate-950">{t('Daftar Informan & Kontributor')}</h3>
                  <span className="text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-full">
                    {informants.length} {settings.systemLanguage === 'en' ? 'Contributors' : 'Kontributor'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {informants.map((inf) => (
                    <div 
                      key={inf.id}
                      className="border border-slate-150 p-5 rounded-2xl flex items-start gap-4 hover:border-slate-350 transition-all duration-300 relative group"
                    >
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">
                        {inf.avatar ? (
                          <img src={inf.avatar} alt={inf.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-lg text-slate-500">
                            {inf.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900 truncate text-sm">{inf.name}</h4>
                          {inf.verified && <CheckCircle2 className="w-4 h-4 text-cyan-500 fill-cyan-50 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 font-semibold mb-2">{inf.region}</p>
                        <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          <span>{inf.contributions} {settings.systemLanguage === 'en' ? 'Signs' : 'Isyarat'}</span>
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                          <span>{settings.systemLanguage === 'en' ? 'Since' : 'Mulai'} {inf.joined}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                        <button
                          onClick={() => handleToggleVerifyInformant(inf.id)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border",
                            inf.verified 
                              ? "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100" 
                              : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100"
                          )}
                        >
                          {inf.verified ? t('Batal Verifikasi') : t('Verifikasi')}
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteInformant(inf.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Hapus Informan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB 4: Kategori */}
            {activeTab === 'Kategori' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Add Category Form (Left) */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 h-fit space-y-6">
                  <h3 className="font-bold text-lg text-slate-950">{t('Tambah Kategori')}</h3>
                  
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{t('Nama Kategori')}</label>
                      <input 
                        type="text"
                        required
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        placeholder={settings.systemLanguage === 'en' ? 'Example: Religion, Medical' : 'Contoh: Agama, Medis'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-garda-red/20 focus:border-garda-red transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{t('Deskripsi Kategori')}</label>
                      <textarea 
                        value={newCatDesc}
                        onChange={e => setNewCatDesc(e.target.value)}
                        placeholder={settings.systemLanguage === 'en' ? 'Sign words related to...' : 'Kosa isyarat yang berkaitan dengan...'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-garda-red/20 focus:border-garda-red transition-all min-h-[80px] resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-garda-red hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t('Tambah Kategori')}
                    </button>
                  </form>
                </div>

                {/* Categories List (Right) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-950">{t('Daftar Kategori')}</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full">
                      {categories.length} {settings.systemLanguage === 'en' ? 'Categories' : 'Kategori'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((cat) => {
                      const catSigns = signs.filter(s => s.category && cat.name && s.category.toLowerCase() === cat.name.toLowerCase());
                      return (
                        <div 
                          key={cat.id}
                          className="bg-slate-50/50 border border-slate-150 p-5 rounded-2xl relative hover:shadow-sm transition-all duration-300 group flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-10 h-10 rounded-xl bg-garda-red/5 text-garda-red flex items-center justify-center mb-3">
                              <MessageSquare className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-1 text-sm">{cat.name}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4 min-h-[32px]">{cat.description}</p>
                            
                            {/* Mini list of signs belonging to this category */}
                            <div className="space-y-2 mb-6">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('Daftar Kosa Isyarat:')}</span>
                              <div className="flex flex-wrap gap-1.5">
                                {catSigns.length === 0 ? (
                                  <span className="text-[10px] text-slate-400 italic">{t('Belum ada kosa isyarat')}</span>
                                ) : (
                                  catSigns.map(s => (
                                    <span key={s.id} className="text-[10px] font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-xl text-slate-700">
                                      {s.word}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 border-t border-slate-100 pt-3">
                            <span>{catSigns.length} {settings.systemLanguage === 'en' ? 'Words' : 'Kosa Kata'}</span>
                            
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="text-slate-450 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                              title={t('Hapus')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4.5: Wilayah */}
            {activeTab === 'Wilayah' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Add Region Form (Left) */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 h-fit space-y-6">
                  <h3 className="font-bold text-lg text-slate-950">{t('Tambah Wilayah')}</h3>
                  
                  <form onSubmit={handleAddRegion} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{t('Nama Wilayah')}</label>
                      <input 
                        type="text"
                        required
                        value={newRegName}
                        onChange={e => setNewRegName(e.target.value)}
                        placeholder={settings.systemLanguage === 'en' ? 'Example: Semarang, Surabaya' : 'Contoh: Semarang, Surabaya'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-garda-red/20 focus:border-garda-red transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-garda-red hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t('Tambah Wilayah')}
                    </button>
                  </form>
                </div>

                {/* Regions List (Right) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-950">{t('Daftar Wilayah')}</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full">
                      {regions.length} {settings.systemLanguage === 'en' ? 'Regions' : 'Wilayah'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {regions.map((reg) => {
                      const regSigns = signs.filter(s => s.region && reg.name && s.region.toLowerCase() === reg.name.toLowerCase());
                      return (
                        <div 
                          key={reg.id}
                          className="bg-slate-50/50 border border-slate-150 p-5 rounded-2xl relative hover:shadow-sm transition-all duration-300 group flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-10 h-10 rounded-xl bg-garda-red/5 text-garda-red flex items-center justify-center mb-3">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-1 text-sm">{reg.name}</h4>
                            
                            {/* Mini list of signs belonging to this region */}
                            <div className="space-y-2 mb-6">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('Daftar Kosa Isyarat:')}</span>
                              <div className="flex flex-wrap gap-1.5">
                                {regSigns.length === 0 ? (
                                  <span className="text-[10px] text-slate-400 italic">{t('Belum ada kosa isyarat')}</span>
                                ) : (
                                  regSigns.map(s => (
                                    <span key={s.id} className="text-[10px] font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-xl text-slate-700">
                                      {s.word}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 border-t border-slate-100 pt-3">
                            <span>{regSigns.length} {settings.systemLanguage === 'en' ? 'Words' : 'Kosa Kata'}</span>
                            
                            <button
                              onClick={() => handleDeleteRegion(reg.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                              title={t('Hapus')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 5: Pengaturan */}
            {activeTab === 'Pengaturan' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-8"
              >
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-bold text-xl text-slate-950">{t('Pengaturan Sistem')}</h3>
                  <p className="text-xs text-slate-500">{t('Konfigurasi setelan global untuk platform Garda Bisindo.')}</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-8">
                  {/* General Configuration */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('Umum')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{t('Nama Platform')}</label>
                        <input 
                          type="text"
                          value={settings.siteName}
                          onChange={e => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-garda-red/20 focus:border-garda-red transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{t('Bahasa Sistem Utama')}</label>
                        <select 
                          value={settings.systemLanguage}
                          onChange={e => setSettings(prev => ({ ...prev, systemLanguage: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-garda-red/20 focus:border-garda-red transition-all"
                        >
                          <option value="id">Bahasa Indonesia</option>
                          <option value="en">English (US)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Access Control */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('Keamanan & Akses')}</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-all">
                        <div>
                          <h5 className="text-sm font-bold text-slate-900">{t('Izinkan Upload Anonim / Tamu')}</h5>
                          <p className="text-xs text-slate-500">{t('Masyarakat dapat mengupload video kosa isyarat tanpa login.')}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleSetting('allowGuestUploads')}
                          className="text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          {settings.allowGuestUploads ? (
                            <ToggleRight className="w-10 h-10 text-emerald-500 fill-emerald-50" />
                          ) : (
                            <ToggleLeft className="w-10 h-10 text-slate-300" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-all">
                        <div>
                          <h5 className="text-sm font-bold text-slate-900">{t('Wajibkan Persetujuan Editor/Admin')}</h5>
                          <p className="text-xs text-slate-500">{t('Kosa isyarat yang baru diupload harus direview sebelum dipublish.')}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleSetting('requireApproval')}
                          className="text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          {settings.requireApproval ? (
                            <ToggleRight className="w-10 h-10 text-emerald-500 fill-emerald-50" />
                          ) : (
                            <ToggleLeft className="w-10 h-10 text-slate-300" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('Notifikasi')}</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-all">
                        <div>
                          <h5 className="text-sm font-bold text-slate-900">{t('Notifikasi Email')}</h5>
                          <p className="text-xs text-slate-500">{t('Kirim notifikasi email ke admin jika ada upload isyarat baru.')}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleSetting('emailNotifications')}
                          className="text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          {settings.emailNotifications ? (
                            <ToggleRight className="w-10 h-10 text-emerald-500 fill-emerald-50" />
                          ) : (
                            <ToggleLeft className="w-10 h-10 text-slate-300" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-all">
                        <div>
                          <h5 className="text-sm font-bold text-slate-900">{t('Notifikasi Push')}</h5>
                          <p className="text-xs text-slate-500">{t('Kirim notifikasi push ke perangkat editor/admin secara realtime.')}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleSetting('pushNotifications')}
                          className="text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          {settings.pushNotifications ? (
                            <ToggleRight className="w-10 h-10 text-emerald-500 fill-emerald-50" />
                          ) : (
                            <ToggleLeft className="w-10 h-10 text-slate-300" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-garda-red hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
                    >
                      {t('Simpan Pengaturan')}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

          </div>
        </div>

        {/* Upload Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-xl font-bold">{editingSign ? "Edit Kosa Isyarat" : "Upload Kosa Isyarat"}</h3>
                  <p className="text-sm text-slate-500">{editingSign ? "Perbarui informasi kata isyarat" : "Form pengisian data (Simulasi)"}</p>
                </div>
                 <button
                  type="button"
                  onClick={closeUploadModal}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleUploadSubmit}>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Kosa Isyarat</label>
                  <input
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-garda-red/20 transition-all"
                    placeholder="Contoh: Terima Kasih"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">Wilayah</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-garda-red/20 transition-all text-slate-800"
                    >
                      {regions.length === 0 ? (
                        <option value="Nasional">Nasional</option>
                      ) : (
                        regions.map(r => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-garda-red/20 transition-all"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-slate-700">Video Gerakan Isyarat</label>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => { setUploadMode('file'); stopCamera(); }}
                        className={cn("px-2.5 py-1 rounded-md transition-all cursor-pointer", uploadMode === 'file' ? "bg-white shadow-sm text-garda-red" : "text-slate-500")}
                      >
                        Unggah File
                      </button>
                      <button
                        type="button"
                        onClick={() => { setUploadMode('camera'); startCamera(); }}
                        className={cn("px-2.5 py-1 rounded-md transition-all cursor-pointer", uploadMode === 'camera' ? "bg-white shadow-sm text-garda-red" : "text-slate-500")}
                      >
                        Kamera Webcam
                      </button>
                    </div>
                  </div>

                  {uploadMode === 'file' ? (
                    <div className="border-2 border-dashed border-slate-200 hover:border-garda-red/40 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-50/50 group">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFileName(file.name);
                            setSelectedFile(file);
                            setRecordedVideoUrl(URL.createObjectURL(file));
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Video className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <span className="block text-xs font-bold text-slate-700">{fileName || "Pilih file video gerakan isyarat"}</span>
                      <span className="block text-[10px] text-slate-400 mt-1">MP4, WebM, atau MOV (Maks. 10MB)</span>
                    </div>
                  ) : (
                    <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center border border-slate-800 group shadow-inner">
                      {recordedVideoUrl ? (
                        <video
                          src={recordedVideoUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : stream ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                          <p className="text-xs text-slate-400">Kamera tidak aktif</p>
                          <button
                            type="button"
                            onClick={startCamera}
                            className="mt-3 px-3 py-1.5 bg-garda-red text-white text-[10px] font-bold uppercase rounded-lg hover:brightness-110 cursor-pointer"
                          >
                            Aktifkan Kamera
                          </button>
                        </div>
                      )}

                      {stream && !recordedVideoUrl && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                          {isRecording ? (
                            <button
                              type="button"
                              onClick={stopRecording}
                              className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 hover:bg-red-700 animate-pulse cursor-pointer"
                            >
                              <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" /> Hentikan Rekam
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={startRecording}
                              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 hover:bg-emerald-700 cursor-pointer"
                            >
                              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" /> Mulai Rekam Isyarat
                            </button>
                          )}
                        </div>
                      )}

                      {recordedVideoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setRecordedVideoUrl(null);
                            setFileName(null);
                            startCamera();
                          }}
                          className="absolute top-4 right-4 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-900 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                        >
                          Rekam Ulang
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Deskripsi Gerakan</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-garda-red/20 transition-all text-sm resize-none h-20"
                    placeholder="Jelaskan cara melakukan gerakan isyarat ini..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeUploadModal}
                    disabled={isUploading}
                    className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!word.trim() || isUploading}
                    className="flex-1 py-3 rounded-2xl bg-garda-red text-white font-bold hover:brightness-110 transition-colors disabled:opacity-60 disabled:hover:brightness-100 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Mengunggah...
                      </>
                    ) : (
                      editingSign ? "Simpan Perubahan" : "Publish"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Video Preview Modal */}
        <AnimatePresence>
          {previewSign && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Verifikasi Video Isyarat</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">{previewSign.word}</h3>
                  </div>
                  <button
                    onClick={() => setPreviewSign(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                  {/* Video Player */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group aspect-video">
                    <video
                      key={previewSign.id}
                      src={previewSign.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  </div>

                  {/* Meta Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-slate-400 block font-semibold mb-1">Kategori</span>
                      <span className="font-bold text-slate-700">{previewSign.category}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-slate-400 block font-semibold mb-1">Wilayah</span>
                      <span className="font-bold text-slate-700">{previewSign.region}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-slate-400 block font-semibold mb-1">Kontributor</span>
                      <span className="font-bold text-slate-700">{previewSign.informant || 'Rizki Ardhana'}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-slate-400 block font-semibold mb-1">Status</span>
                      <select
                         value={previewSign.status}
                         onChange={async (e) => {
                           const newStatus = e.target.value as 'Approved' | 'Pending' | 'Rejected';
                           try {
                             const res = await fetch(`/api/signs/${previewSign.id}`, {
                               method: 'PUT',
                               headers: { 'Content-Type': 'application/json' },
                               body: JSON.stringify({ status: newStatus })
                             });
                             if (res.ok) {
                               await fetchSigns();
                               setPreviewSign(prev => prev ? { ...prev, status: newStatus } : null);
                               triggerToast(`Status berhasil diubah menjadi: ${newStatus === 'Approved' ? 'Disetujui' : newStatus === 'Pending' ? 'Menunggu' : 'Ditolak'}`);
                             } else {
                               triggerToast('Gagal memperbarui status.');
                             }
                           } catch (err) {
                             console.error(err);
                             triggerToast('Gagal memperbarui status.');
                           }
                         }}
                         className={cn(
                           "font-bold bg-transparent outline-none cursor-pointer border-b border-dashed py-0.5 text-sm w-full",
                           previewSign.status === 'Approved' ? "text-green-600 border-green-300" :
                           previewSign.status === 'Pending' ? "text-amber-600 border-amber-300" : "text-red-650 border-red-300"
                         )}
                       >
                         <option value="Approved" className="text-slate-800 bg-white">Disetujui</option>
                         <option value="Pending" className="text-slate-800 bg-white">Menunggu</option>
                         <option value="Rejected" className="text-slate-800 bg-white">Ditolak</option>
                       </select>
                     </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Deskripsi Gerakan:</span>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {previewSign.description || 'Tidak ada deskripsi detail gerakan yang disediakan.'}
                    </p>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                  {previewSign.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => {
                          handleRejectSign(previewSign.id);
                          setPreviewSign(prev => prev ? { ...prev, status: 'Rejected' } : null);
                        }}
                        className="flex-1 py-3.5 bg-slate-100 text-amber-700 hover:bg-amber-50 hover:text-amber-800 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 cursor-pointer"
                      >
                        <X className="w-4 h-4" /> Tolak Isyarat
                      </button>
                      <button
                        onClick={() => {
                          handleApproveSign(previewSign.id);
                          setPreviewSign(prev => prev ? { ...prev, status: 'Approved' } : null);
                        }}
                        className="flex-1 py-3.5 bg-garda-red text-white hover:brightness-110 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100 cursor-pointer"
                      >
                        <Check className="w-4 h-4" /> Setujui Isyarat
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setPreviewSign(null)}
                      className="w-full py-3.5 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-bold transition-all cursor-pointer"
                    >
                      Tutup
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
