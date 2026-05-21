import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, BadgeCheck, Video, Heart, Bookmark, Award, Calendar, ExternalLink, Settings, Shield, Camera, MessageSquare, ToggleLeft, ToggleRight, Sparkles, Volume2, BookOpen, TrendingUp, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SignCard } from '@/src/components/SignCard';

const BADGE_CONFIGS = {
  'Top Contributor': {
    name: 'Top Contributor',
    description: 'Diberikan kepada pengguna yang aktif mengunggah dan mendokumentasikan kosa kata isyarat baru secara konsisten di platform.',
    category: 'Kontribusi Konten',
    progress: 58,
    target: 100,
    metric: 'video diunggah',
    perks: [
      'Prioritas verifikasi untuk unggahan video baru',
      'Akses awal ke fitur kamus eksperimental',
      'Ikon khusus "Top Contributor" di samping nama profil'
    ],
    iconName: 'Award',
    theme: {
      bg: 'bg-amber-50/40',
      text: 'text-amber-600',
      border: 'border-amber-150',
      badge: 'bg-amber-50 border-amber-200 text-amber-700',
      accent: 'bg-amber-500',
      progressBg: 'bg-amber-100'
    }
  },
  'Verified Informant': {
    name: 'Verified Informant',
    description: 'Telah melewati tahap seleksi portofolio, kompetensi linguistik bahasa isyarat, dan verifikasi identitas resmi oleh tim PUSBISINDO.',
    category: 'Status Kredibilitas',
    progress: 10,
    target: 10,
    metric: 'tahap verifikasi selesai',
    perks: [
      'Video kontribusi otomatis ditandai sebagai "Terverifikasi"',
      'Dapat memberikan masukan resmi (review) pada unggahan pengguna lain',
      'Terdaftar di direktori publik Informan Terpercaya GARDA BISINDO'
    ],
    iconName: 'BadgeCheck',
    theme: {
      bg: 'bg-cyan-50/40',
      text: 'text-cyan-600',
      border: 'border-cyan-150',
      badge: 'bg-cyan-50 border-cyan-200 text-cyan-700',
      accent: 'bg-cyan-500',
      progressBg: 'bg-cyan-100'
    }
  },
  'Culture Preserver': {
    name: 'Culture Preserver',
    description: 'Diberikan kepada kontributor yang gigih mendokumentasikan variasi kosa isyarat daerah atau dialek lokal guna melestarikan keragaman budaya isyarat.',
    category: 'Pelestarian Budaya',
    progress: 3,
    target: 5,
    metric: 'dialek daerah dikontribusikan',
    perks: [
      'Akses forum diskusi editor regional',
      'Undangan resmi ke lokakarya tahunan pelestarian bahasa isyarat daerah',
      'Hak suara ganda dalam penentuan istilah dialek lokal baru'
    ],
    iconName: 'Sparkles',
    theme: {
      bg: 'bg-purple-50/40',
      text: 'text-purple-600',
      border: 'border-purple-150',
      badge: 'bg-purple-50 border-purple-200 text-purple-700',
      accent: 'bg-purple-500',
      progressBg: 'bg-purple-100'
    }
  }
};

const REGIONAL_DIALECTS = {
  'BISINDO - Jakarta': {
    region: 'DKI Jakarta',
    features: 'Menggunakan variasi isyarat dua tangan dengan pengaruh alfabet isyarat lokal yang kuat, tempo isyarat cenderung cepat dan ekspresif.',
    vocabularySample: 'Makan, Masuk, Kerja (memiliki gestur penekanan unik)',
    contributorCount: '150+ Kontributor aktif'
  },
  'BISINDO - Yogyakarta': {
    region: 'DI Yogyakarta',
    features: 'Tempo gerakan lebih anggun, banyak menggunakan isyarat berbasis satu tangan dominan dengan variasi lengkungan halus pada pergelangan tangan.',
    vocabularySample: 'Nuwun (Terima Kasih lokal), Monggo, Sekolah',
    contributorCount: '95+ Kontributor aktif'
  },
  'BISINDO - Bali': {
    region: 'Bali',
    features: 'Menggabungkan ekspresi lirikan mata yang kuat (serupa gerakan tari Bali) untuk memberikan konteks nada bicara/intonasi pada kalimat isyarat.',
    vocabularySample: 'Suksma (Terima Kasih), Rahajeng, Matur',
    contributorCount: '60+ Kontributor aktif'
  },
  'BISINDO - Nasional': {
    region: 'Nasional (Standar PUSBISINDO)',
    features: 'Bahasa isyarat pemersatu yang paling umum dipahami lintas wilayah. Digunakan dalam siaran berita nasional, seminar formal, dan materi ajar dasar.',
    vocabularySample: 'Indonesia, Pancasila, Merdeka',
    contributorCount: '500+ Kontributor terdaftar'
  }
};

export function ProfilePage() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      name: 'Rizki Ardhana',
      role: 'Informan Kontributor',
      location: 'Jakarta Selatan, Indonesia',
      bio: 'Saya seorang aktivis Tuli yang berdedikasi untuk mendokumentasikan kosa isyarat daerah Jakarta agar tidak terlupakan oleh sejarah perkembangan teknologi.',
      contributions: 58,
      joinedDate: 'Januari 2024',
      badges: ['Top Contributor', 'Verified Informant', 'Culture Preserver'],
      avatar: '/profil.jpg',
      cover: ''
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    bio: '',
    avatar: '',
    cover: ''
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState(() => {
    const saved = localStorage.getItem('user_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          emailNotify: parsed.emailNotify ?? true,
          pushNotify: parsed.pushNotify ?? false,
          language: parsed.language || 'BISINDO - Jakarta',
          highContrast: parsed.highContrast ?? false,
          textSize: parsed.textSize || 'normal',
          textToSpeech: parsed.textToSpeech ?? false
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      emailNotify: true,
      pushNotify: false,
      language: 'BISINDO - Jakarta',
      highContrast: false,
      textSize: 'normal',
      textToSpeech: false
    };
  });
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);

  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [activePoint, setActivePoint] = useState<number | null>(null);

  const speakText = (text: string) => {
    if (!settingsForm.textToSpeech) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
    }
  };

  // Real-time accessibility changes preview
  useEffect(() => {
    try {
      if (settingsForm.highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }

      document.documentElement.classList.remove('text-size-large', 'text-size-xlarge');
      if (settingsForm.textSize === 'large') {
        document.documentElement.classList.add('text-size-large');
      } else if (settingsForm.textSize === 'xlarge') {
        document.documentElement.classList.add('text-size-xlarge');
      }
    } catch (e) {
      console.error(e);
    }
  }, [settingsForm.highContrast, settingsForm.textSize]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError(null);
    setSettingsSuccess(null);

    if (settingsForm.newPassword) {
      if (settingsForm.newPassword.length < 6) {
        setSettingsError('Password baru minimal harus 6 karakter.');
        return;
      }
      if (settingsForm.newPassword !== settingsForm.confirmPassword) {
        setSettingsError('Password baru dan konfirmasi password tidak cocok.');
        return;
      }
      setSettingsSuccess('Kata sandi berhasil diperbarui!');
    }

    const userSettings = {
      emailNotify: settingsForm.emailNotify,
      pushNotify: settingsForm.pushNotify,
      language: settingsForm.language,
      highContrast: settingsForm.highContrast,
      textSize: settingsForm.textSize,
      textToSpeech: settingsForm.textToSpeech
    };
    localStorage.setItem('user_settings', JSON.stringify(userSettings));

    setSettingsSuccess(prev => prev ? prev + ' Pengaturan preferensi disimpan.' : 'Pengaturan preferensi berhasil disimpan!');

    // Dispatch event to sync globally
    window.dispatchEvent(new Event('accessibilityUpdate'));

    setTimeout(() => {
      setIsSettingsOpen(false);
      setSettingsSuccess(null);
      setSettingsError(null);
      setSettingsForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }, 1500);
  };

  const handleCancelSettings = () => {
    setIsSettingsOpen(false);
    setSettingsError(null);
    setSettingsSuccess(null);

    // Revert settingsForm to saved localStorage state
    const saved = localStorage.getItem('user_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettingsForm(prev => ({
          ...prev,
          emailNotify: parsed.emailNotify ?? true,
          pushNotify: parsed.pushNotify ?? false,
          language: parsed.language || 'BISINDO - Jakarta',
          highContrast: parsed.highContrast ?? false,
          textSize: parsed.textSize || 'normal',
          textToSpeech: parsed.textToSpeech ?? false,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } catch (e) { }
    } else {
      setSettingsForm(prev => ({
        ...prev,
        emailNotify: true,
        pushNotify: false,
        language: 'BISINDO - Jakarta',
        highContrast: false,
        textSize: 'normal',
        textToSpeech: false,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
  };

  const [myComments] = useState<{
    signId: string;
    signWord: string;
    commentId: string;
    text: string;
    createdAt: string;
  }[]>(() => {
    const list: any[] = [];
    const signsSaved = localStorage.getItem('garda_signs');
    let signs: any[] = [];
    if (signsSaved) {
      try {
        signs = JSON.parse(signsSaved);
      } catch (e) { }
    }

    const userName = profile?.name || 'Rizki Ardhana';

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('garda_comments_')) {
        const signId = key.replace('garda_comments_', '');
        const commentsSaved = localStorage.getItem(key);
        if (commentsSaved) {
          try {
            const commentsParsed = JSON.parse(commentsSaved);
            if (Array.isArray(commentsParsed)) {
              commentsParsed.forEach((c: any) => {
                if (c.userName === userName || c.id.startsWith('c_')) {
                  const matchingSign = signs.find(s => String(s.id) === String(signId));
                  list.push({
                    signId,
                    signWord: matchingSign?.word || 'Kosa Kata Isyarat',
                    commentId: c.id,
                    text: c.text,
                    createdAt: c.createdAt
                  });
                }
              });
            }
          } catch (e) { }
        }
      }
    }
    return list;
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEditing) {
          setEditForm(prev => ({ ...prev, avatar: base64String }));
        } else {
          setProfile(prev => {
            const updated = { ...prev, avatar: base64String };
            localStorage.setItem('user_profile', JSON.stringify(updated));
            window.dispatchEvent(new Event('profileUpdate'));
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEditing) {
          setEditForm(prev => ({ ...prev, cover: base64String }));
        } else {
          setProfile(prev => {
            const updated = { ...prev, cover: base64String };
            localStorage.setItem('user_profile', JSON.stringify(updated));
            window.dispatchEvent(new Event('profileUpdate'));
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => {
      const updated = {
        ...prev,
        name: editForm.name,
        location: editForm.location,
        bio: editForm.bio,
        avatar: editForm.avatar || prev.avatar,
        cover: editForm.cover || prev.cover
      };
      localStorage.setItem('user_profile', JSON.stringify(updated));
      window.dispatchEvent(new Event('profileUpdate'));
      return updated;
    });
    setIsEditing(false);
  };

  const myContributions = [
    {
      id: '1',
      word: 'Terima Kasih',
      category: 'Harian',
      region: 'Jakarta',
      thumbnailUrl: '/bisindo_gesture_placeholder.png',
      videoUrl: '#',
      description: 'Gerakan tangan menempel di dagu lalu digerakkan ke depan sebagai bentuk apresiasi.',
      informantId: 'inf1',
      likes: 124,
      bookmarks: 45,
      createdAt: '2024-01-10'
    },
    {
      id: '5',
      word: 'Telepon',
      category: 'Teknologi',
      region: 'Nasional',
      thumbnailUrl: '/bisindo_gesture_placeholder.png',
      videoUrl: '#',
      description: 'Ibu jari dan kelingking menempel di telinga dan mulut melambangkan gagang telepon.',
      informantId: 'inf5',
      likes: 156,
      bookmarks: 32,
      createdAt: '2024-01-22'
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Profile Header Card */}
        <div className="relative mb-12">
          {/* Banner Placeholder */}
          <div className="h-48 md:h-64 bg-garda-navy rounded-[2.5rem] overflow-hidden relative group/banner">
            {profile.cover ? (
              <img
                src={profile.cover}
                alt="Sampul Profil"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-garda-red/20 to-transparent animate-pulse" />
            )}

            {/* Edit Cover Overlay Button */}
            <label className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer text-xs font-bold transition-all opacity-0 group-hover/banner:opacity-100 shadow-lg">
              <Camera className="w-4 h-4" />
              <span>Ubah Sampul</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="px-10 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white border-8 border-white shadow-2xl overflow-hidden flex items-center justify-center relative group">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <label className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-white">
                <Camera className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Ubah Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="pb-4 flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl">{profile.name}</h1>
                <BadgeCheck className="text-cyan-500 w-6 h-6 fill-cyan-50" />
              </div>
              <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Bergabung {profile.joinedDate}</span>
              </div>
            </div>

            <div className="pb-4 flex gap-3">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                title="Pengaturan Akun"
              >
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  setEditForm({
                    name: profile.name,
                    location: profile.location,
                    bio: profile.bio,
                    avatar: profile.avatar,
                    cover: profile.cover || ''
                  });
                  setIsEditing(true);
                }}
                className="px-6 py-3 bg-garda-red text-white font-bold rounded-2xl shadow-xl shadow-red-100 hover:scale-105 transition-all"
              >
                Edit Profil
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar Info */}
          <div className="space-y-8">
            <div
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm leading-relaxed cursor-pointer hover:shadow-md transition-shadow group/about"
              onClick={() => speakText(`Tentang Saya. Bio: ${profile.bio}. Total Kontribusi: ${profile.contributions} Video. Peringkat Komunitas: Perak.`)}
              title={settingsForm.textToSpeech ? "Klik untuk mendengarkan audio" : undefined}
            >
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-between">
                <span>Tentang Saya</span>
                {settingsForm.textToSpeech && <Volume2 className="w-4 h-4 text-slate-300 group-hover/about:text-garda-red transition-colors" />}
              </h4>
              <p className="text-slate-600 italic">"{profile.bio}"</p>

              <hr className="my-8 border-slate-100" />

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Total Kontribusi</span>
                  <span className="font-bold text-lg">{profile.contributions} Video</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Peringkat Komunitas</span>
                  <span className="font-bold text-amber-500 flex items-center gap-1"><Award className="w-4 h-4" /> Silver</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-between">
                <span>Badges & Pencapaian</span>
                {settingsForm.textToSpeech && <span className="text-[9px] lowercase font-normal text-slate-400 font-sans">Hover untuk audio</span>}
              </h4>
              <div className="flex flex-wrap gap-3">
                {profile.badges.map(badge => {
                  const config = BADGE_CONFIGS[badge as keyof typeof BADGE_CONFIGS];
                  const theme = config?.theme || {
                    bg: 'bg-slate-50',
                    text: 'text-slate-600',
                    border: 'border-slate-100',
                    accent: 'bg-slate-500'
                  };
                  return (
                    <button
                      key={badge}
                      onClick={() => {
                        setSelectedBadge(badge);
                        speakText(`Lencana ${badge}. Detail: ${config?.description || ''}`);
                      }}
                      onMouseEnter={() => {
                        speakText(badge);
                      }}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer flex items-center gap-1.5 ${theme.bg} ${theme.border} ${theme.text}`}
                    >
                      {config?.iconName === 'Award' && <Award className="w-3.5 h-3.5" />}
                      {config?.iconName === 'BadgeCheck' && <BadgeCheck className="w-3.5 h-3.5" />}
                      {config?.iconName === 'Sparkles' && <Sparkles className="w-3.5 h-3.5" />}
                      <span>{badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-8 bg-garda-cyan/10 border border-garda-cyan/20 rounded-[2.5rem] relative overflow-hidden group">
              <Shield className="absolute -bottom-6 -right-6 w-32 h-32 text-garda-cyan opacity-10 group-hover:rotate-12 transition-transform" />
              <h4 className="font-bold text-xl mb-4 text-slate-900">Verifikasi Informan</h4>
              <p className="text-slate-600 text-sm mb-6 relative z-10">
                Profil ini telah terverifikasi sebagai Informan Resmi GARDA BISINDO di bawah naungan PUSBISINDO.
              </p>
              <button className="text-xs font-bold text-garda-red flex items-center gap-2">
                Pelajari Proses Verifikasi <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl">Kontribusi Terakhir</h2>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold">Terpopuler</button>
                  <button className="px-4 py-1.5 text-slate-400 text-xs font-bold">Terbaru</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {myContributions.map(sign => (
                  <SignCard key={sign.id} sign={sign} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h3 className="text-2xl mb-8">Statistik Kontribusi</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Penayangan</p>
                  <h4 className="text-3xl font-display font-bold text-garda-navy">15.2k</h4>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Suka</p>
                  <h4 className="text-3xl font-display font-bold text-red-500">2.1k</h4>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Disimpan</p>
                  <h4 className="text-3xl font-display font-bold text-cyan-500">842</h4>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Dibagikan</p>
                  <h4 className="text-3xl font-display font-bold text-purple-500">320</h4>
                </div>
              </div>
              {/* Interactive SVG Line/Area Chart */}
              <div className="mt-12 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-garda-red" />
                    Grafik Kontribusi Bulanan (6 Bulan Terakhir)
                  </span>
                  {settingsForm.textToSpeech && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                      <Volume2 className="w-3.5 h-3.5" />
                      Arahkan kursor untuk info audio
                    </span>
                  )}
                </div>

                <div className="relative p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1 w-full">
                    <svg viewBox="0 0 500 200" className="w-full h-auto overflow-visible">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-garda-red, #E11D48)" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="var(--color-garda-red, #E11D48)" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="var(--color-garda-red, #E11D48)" />
                          <stop offset="100%" stopColor="var(--color-garda-cyan, #22D3EE)" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="40" y1="43.3" x2="440" y2="43.3" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="97.8" x2="440" y2="97.8" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="160" x2="440" y2="160" stroke="#e2e8f0" strokeWidth="1.5" />

                      {/* X-Axis ticks */}
                      <line x1="40" y1="160" x2="40" y2="165" stroke="#cbd5e1" strokeWidth="1" />
                      <line x1="120" y1="160" x2="120" y2="165" stroke="#cbd5e1" strokeWidth="1" />
                      <line x1="200" y1="160" x2="200" y2="165" stroke="#cbd5e1" strokeWidth="1" />
                      <line x1="280" y1="160" x2="280" y2="165" stroke="#cbd5e1" strokeWidth="1" />
                      <line x1="360" y1="160" x2="360" y2="165" stroke="#cbd5e1" strokeWidth="1" />
                      <line x1="440" y1="160" x2="440" y2="165" stroke="#cbd5e1" strokeWidth="1" />

                      {/* Area under the line */}
                      <motion.path
                        d="M 40 121.2 L 120 66.7 L 200 97.8 L 280 43.3 L 360 82.2 L 440 97.8 L 440 160 L 40 160 Z"
                        fill="url(#chartGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                      />

                      {/* Connection path line */}
                      <motion.path
                        d="M 40 121.2 L 120 66.7 L 200 97.8 L 280 43.3 L 360 82.2 L 440 97.8"
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />

                      {/* Interactive circular points */}
                      {[
                        { x: 40, y: 121.2 },
                        { x: 120, y: 66.7 },
                        { x: 200, y: 97.8 },
                        { x: 280, y: 43.3 },
                        { x: 360, y: 82.2 },
                        { x: 440, y: 97.8 }
                      ].map((pt, idx) => {
                        const months = [
                          { month: 'Des', uploads: 5, likes: 120, comments: 2, label: 'Desember 2023' },
                          { month: 'Jan', uploads: 12, likes: 350, comments: 8, label: 'Januari 2024' },
                          { month: 'Feb', uploads: 8, likes: 210, comments: 5, label: 'Februari 2024' },
                          { month: 'Mar', uploads: 15, likes: 480, comments: 12, label: 'Maret 2024' },
                          { month: 'Apr', uploads: 10, likes: 320, comments: 4, label: 'April 2024' },
                          { month: 'Mei', uploads: 8, likes: 620, comments: 10, label: 'Mei 2024' }
                        ];
                        const m = months[idx];
                        const isActive = activePoint === idx;
                        return (
                          <g
                            key={idx}
                            className="cursor-pointer"
                            onMouseEnter={() => {
                              setActivePoint(idx);
                              speakText(`${m.label}: ${m.uploads} video diunggah, ${m.likes} suka, ${m.comments} masukan diskusi.`);
                            }}
                            onMouseLeave={() => setActivePoint(null)}
                          >
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isActive ? 12 : 6}
                              fill={isActive ? "var(--color-garda-cyan, #22D3EE)" : "#ffffff"}
                              stroke={isActive ? "var(--color-garda-navy, #0F172A)" : "var(--color-garda-red, #E11D48)"}
                              strokeWidth={isActive ? 3 : 2.5}
                              className="transition-all duration-200"
                            />
                            {isActive && (
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r="4"
                                fill="var(--color-garda-red, #E11D48)"
                              />
                            )}
                          </g>
                        );
                      })}

                      {/* Month labels */}
                      {['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'].map((m, idx) => {
                        const xPoints = [40, 120, 200, 280, 360, 440];
                        return (
                          <text
                            key={idx}
                            x={xPoints[idx]}
                            y="185"
                            textAnchor="middle"
                            className="text-[10px] font-bold fill-slate-400 font-sans tracking-wider"
                          >
                            {m}
                          </text>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Tooltip Card Panel beside/below the graph */}
                  <div className="w-full md:w-44 bg-white p-4 rounded-2xl border border-slate-100 shadow-inner flex flex-col justify-center min-h-[140px] text-center md:text-left transition-all">
                    {activePoint !== null ? (
                      (() => {
                        const data = [
                          { month: 'Desember 2023', uploads: 5, likes: 120, comments: 2 },
                          { month: 'Januari 2024', uploads: 12, likes: 350, comments: 8 },
                          { month: 'Februari 2024', uploads: 8, likes: 210, comments: 5 },
                          { month: 'Maret 2024', uploads: 15, likes: 480, comments: 12 },
                          { month: 'April 2024', uploads: 10, likes: 320, comments: 4 },
                          { month: 'Mei 2024 (Aktif)', uploads: 8, likes: 620, comments: 10 }
                        ][activePoint];
                        return (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-garda-red block leading-none">
                              {data.month}
                            </span>
                            <div>
                              <span className="text-xs text-slate-400 block">Diupload</span>
                              <span className="text-base font-bold text-slate-900 leading-none">{data.uploads} Video</span>
                            </div>
                            <div>
                              <span className="text-xs text-slate-400 block">Suka Gained</span>
                              <span className="text-base font-bold text-emerald-500 leading-none">+{data.likes}</span>
                            </div>
                            <div>
                              <span className="text-xs text-slate-400 block">Diskusi</span>
                              <span className="text-xs font-bold text-cyan-500 leading-none">{data.comments} Komentar</span>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-slate-400 flex flex-col items-center justify-center h-full space-y-1">
                        <BookOpen className="w-5 h-5 text-slate-300 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Detail Bulan</span>
                        <span className="text-[9px] text-slate-400 block text-center mt-1 leading-tight">Arahkan kursor ke titik grafik untuk melihat rincian kontribusi.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Community Discussions Section */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm mt-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-6 h-6 text-garda-red" />
                <h3 className="text-2xl font-bold">Diskusi Komunitas</h3>
              </div>

              {myComments.length === 0 ? (
                <div className="text-center py-10 bg-slate-50/50 rounded-3xl border border-slate-100">
                  <p className="text-slate-400 text-sm italic">Belum ada diskusi atau masukan yang Anda kirimkan.</p>
                  <Link to="/dictionary" className="mt-4 inline-block px-6 py-2.5 bg-garda-red text-white text-xs font-bold rounded-xl shadow-md hover:bg-red-700 transition-colors">
                    Jelajahi Kamus untuk Berdiskusi
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {myComments.map((item) => (
                    <div key={item.commentId} className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col justify-between gap-3 hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Pada Isyarat:</span>
                          <Link to={`/sign/${item.signId}`} className="font-bold text-slate-900 hover:text-garda-red transition-colors text-sm underline decoration-dotted decoration-slate-300 hover:decoration-garda-red">
                            "{item.signWord}"
                          </Link>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.createdAt}</span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed bg-white p-4 rounded-2xl border border-slate-100 shadow-inner">
                        {item.text}
                      </p>
                      <div className="flex justify-end gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <Link to={`/sign/${item.signId}`} className="hover:text-garda-navy transition-colors">
                          Lihat Diskusi &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full border border-slate-100 shadow-2xl relative z-10"
            >
              <h3 className="text-2xl font-bold mb-6 text-slate-900">Edit Profil</h3>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="relative mb-6 bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
                  {/* Mini Banner Preview */}
                  <div className="h-28 bg-garda-navy rounded-2xl overflow-hidden relative group/minibanner">
                    {editForm.cover ? (
                      <img
                        src={editForm.cover}
                        alt="Pratinjau Sampul"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-garda-red/20 to-transparent" />
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer text-white opacity-0 group-hover/minibanner:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 mr-1" />
                      <span className="text-xs font-semibold">Ubah Sampul</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Mini Avatar Preview overlapping the mini banner */}
                  <div className="flex justify-center -mt-10 relative z-10">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden relative border-4 border-white bg-slate-200 shadow-md group/miniavatar">
                      <img
                        src={editForm.avatar || '/profil.jpg'}
                        alt="Pratinjau Foto"
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black/45 flex items-center justify-center cursor-pointer text-white opacity-0 group-hover/miniavatar:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Klik foto atau sampul untuk mengganti</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-garda-red/20 focus:border-garda-red transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Lokasi</label>
                  <input
                    type="text"
                    required
                    value={editForm.location}
                    onChange={e => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-garda-red/20 focus:border-garda-red transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Bio / Tentang Saya</label>
                  <textarea
                    required
                    value={editForm.bio}
                    onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-garda-red/20 focus:border-garda-red transition-all min-h-[100px] resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-garda-red hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelSettings}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full border border-slate-100 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h3>
                <button
                  type="button"
                  onClick={handleCancelSettings}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {settingsError && (
                <div className="mb-4 p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                  {settingsError}
                </div>
              )}

              {settingsSuccess && (
                <div className="mb-4 p-4 rounded-2xl bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                  {settingsSuccess}
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Preferensi Bahasa */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Pilihan Bahasa Isyarat Utama</label>
                  <select
                    value={settingsForm.language}
                    onChange={e => setSettingsForm(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-garda-red/20 focus:border-garda-red transition-all"
                  >
                    <option value="BISINDO - Jakarta">BISINDO - Jakarta</option>
                    <option value="BISINDO - Yogyakarta">BISINDO - Yogyakarta</option>
                    <option value="BISINDO - Bali">BISINDO - Bali</option>
                    <option value="BISINDO - Nasional">BISINDO - Nasional</option>
                  </select>
                </div>

                {/* Dialect Info Card */}
                {(() => {
                  const dInfo = REGIONAL_DIALECTS[settingsForm.language as keyof typeof REGIONAL_DIALECTS] || REGIONAL_DIALECTS['BISINDO - Jakarta'];
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={settingsForm.language}
                      className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-2"
                    >
                      <div className="flex justify-between items-center font-bold text-slate-700">
                        <span className="text-slate-900 font-display">Karakteristik {dInfo.region}</span>
                        <span className="px-2 py-0.5 bg-garda-cyan/15 text-[9px] uppercase tracking-wider text-cyan-700 rounded-full font-bold">
                          {dInfo.contributorCount}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        <span className="text-slate-400 font-bold block mb-0.5">Fitur Dialek:</span>
                        {dInfo.features}
                      </p>
                      <p className="text-slate-600 font-semibold italic">
                        <span className="text-slate-400 font-bold block not-italic mb-0.5">Contoh Kosa Kata:</span>
                        "{dInfo.vocabularySample}"
                      </p>
                    </motion.div>
                  );
                })()}

                {/* Aksesibilitas Toggles */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-400">Preferensi Aksesibilitas</span>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Mode Kontras Tinggi</span>
                      <span className="text-xs text-slate-500">Meningkatkan kontras warna untuk teks lebih terbaca.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettingsForm(prev => ({ ...prev, highContrast: !prev.highContrast }))}
                      className="text-slate-400 hover:text-garda-red transition-all"
                    >
                      {settingsForm.highContrast ? (
                        <ToggleRight className="w-12 h-8 text-garda-red fill-garda-red/10" />
                      ) : (
                        <ToggleLeft className="w-12 h-8 text-slate-300" />
                      )}
                    </button>
                  </div>

                  {/* Text Size */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Ukuran Teks Aplikasi</span>
                      <span className="text-xs text-slate-500">Sesuaikan ukuran font di seluruh aplikasi.</span>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { value: 'normal', label: 'A', desc: 'Normal' },
                        { value: 'large', label: 'A+', desc: 'Besar' },
                        { value: 'xlarge', label: 'A++', desc: 'Sangat Besar' }
                      ].map(sz => (
                        <button
                          key={sz.value}
                          type="button"
                          onClick={() => setSettingsForm(prev => ({ ...prev, textSize: sz.value }))}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${settingsForm.textSize === sz.value
                              ? 'bg-garda-red border-garda-red text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                          {sz.label} <span className="font-normal opacity-85 text-[10px]">({sz.desc})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text to Speech */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Suara Pendamping (Text-to-Speech)</span>
                      <span className="text-xs text-slate-500">Membaca menu & lencana pencapaian secara otomatis.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !settingsForm.textToSpeech;
                        setSettingsForm(prev => ({ ...prev, textToSpeech: nextVal }));
                        if (nextVal) {
                          setTimeout(() => {
                            try {
                              window.speechSynthesis.cancel();
                              const utterance = new SpeechSynthesisUtterance('Suara pendamping aktif');
                              utterance.lang = 'id-ID';
                              window.speechSynthesis.speak(utterance);
                            } catch (e) { }
                          }, 100);
                        }
                      }}
                      className="text-slate-400 hover:text-garda-red transition-all"
                    >
                      {settingsForm.textToSpeech ? (
                        <ToggleRight className="w-12 h-8 text-garda-red fill-garda-red/10" />
                      ) : (
                        <ToggleLeft className="w-12 h-8 text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Notifikasi Toggles */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-400">Preferensi Notifikasi</span>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Notifikasi Email</span>
                      <span className="text-xs text-slate-500">Terima update status unggahan video via email.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettingsForm(prev => ({ ...prev, emailNotify: !prev.emailNotify }))}
                      className="text-slate-400 hover:text-garda-red transition-all"
                    >
                      {settingsForm.emailNotify ? (
                        <ToggleRight className="w-12 h-8 text-garda-red fill-garda-red/10" />
                      ) : (
                        <ToggleLeft className="w-12 h-8 text-slate-300" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">Notifikasi Push Browser</span>
                      <span className="text-xs text-slate-500">Terima notifikasi instan langsung di browser Anda.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettingsForm(prev => ({ ...prev, pushNotify: !prev.pushNotify }))}
                      className="text-slate-400 hover:text-garda-red transition-all"
                    >
                      {settingsForm.pushNotify ? (
                        <ToggleRight className="w-12 h-8 text-garda-red fill-garda-red/10" />
                      ) : (
                        <ToggleLeft className="w-12 h-8 text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Ubah Password */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <span className="block text-xs font-bold uppercase tracking-widest text-slate-400">Ubah Kata Sandi (Opsional)</span>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Kata Sandi Baru</label>
                    <input
                      type="password"
                      value={settingsForm.newPassword}
                      onChange={e => setSettingsForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-garda-red/20 focus:border-garda-red transition-all"
                      placeholder="Minimal 6 karakter"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Konfirmasi Kata Sandi Baru</label>
                    <input
                      type="password"
                      value={settingsForm.confirmPassword}
                      onChange={e => setSettingsForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-garda-red/20 focus:border-garda-red transition-all"
                      placeholder="Ulangi kata sandi baru"
                    />
                  </div>
                </div>

                {/* Submit & Keluar */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleCancelSettings}
                      className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-sm"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-garda-red hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all text-sm"
                    >
                      Simpan
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('auth_token');
                      localStorage.removeItem('auth_role');
                      window.location.href = '/';
                    }}
                    className="w-full py-4 text-center border border-red-200 hover:bg-red-50 text-garda-red font-bold rounded-2xl transition-all text-sm mt-2"
                  >
                    Keluar dari Akun (Logout)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBadge && (
          (() => {
            const badgeData = BADGE_CONFIGS[selectedBadge as keyof typeof BADGE_CONFIGS];
            if (!badgeData) return null;
            const progressPct = Math.min(100, Math.round((badgeData.progress / badgeData.target) * 100));
            const theme = badgeData.theme;

            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedBadge(null)}
                  className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                />

                {/* Modal Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full border border-slate-100 shadow-2xl relative z-10 text-center"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedBadge(null)}
                    className="absolute top-6 right-6 p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all text-sm font-bold hover:scale-105"
                  >
                    ✕
                  </button>

                  {/* Badge Icon Animation Container */}
                  <div className="flex justify-center mb-6 mt-2">
                    <motion.div
                      initial={{ rotate: -15, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      className={`w-24 h-24 rounded-[2rem] flex items-center justify-center border-2 ${theme.bg} ${theme.border} ${theme.text} shadow-lg relative group`}
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-[2rem] bg-current opacity-10 blur-xl group-hover:opacity-20 transition-opacity" />

                      {badgeData.iconName === 'Award' && <Award className="w-12 h-12" />}
                      {badgeData.iconName === 'BadgeCheck' && <BadgeCheck className="w-12 h-12" />}
                      {badgeData.iconName === 'Sparkles' && <Sparkles className="w-12 h-12" />}
                    </motion.div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    {badgeData.category}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{badgeData.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 px-2">
                    {badgeData.description}
                  </p>

                  {/* Progress Section */}
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 mb-6 text-left">
                    <div className="flex justify-between items-center text-xs font-bold mb-2">
                      <span className="text-slate-400">Progres Pencapaian</span>
                      <span className={theme.text}>
                        {badgeData.progress} / {badgeData.target} {badgeData.metric}
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${theme.accent}`}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                      <span>0%</span>
                      <span>{progressPct}% Selesai</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Perks Section */}
                  <div className="text-left mb-8">
                    <span className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                      Hak Istimewa (Perks) yang Didapat:
                    </span>
                    <ul className="space-y-2 text-xs text-slate-600 font-medium">
                      {badgeData.perks.map((perk, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${theme.text}`} />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedBadge(null)}
                      className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-sm"
                    >
                      Tutup
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`Saya berhasil mendapatkan lencana "${badgeData.name}" di platform Garda BISINDO!`);
                        setCopiedBadge(true);
                        speakText('Teks berhasil disalin ke clipboard');
                        setTimeout(() => setCopiedBadge(false), 2000);
                      }}
                      className={`flex-1 py-4 text-white font-bold rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-1.5 ${theme.accent} hover:brightness-95 hover:scale-[1.02]`}
                    >
                      {copiedBadge ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Bagikan Lencana</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            );
          })()
        )}
      </AnimatePresence>
    </div>
  );
}
