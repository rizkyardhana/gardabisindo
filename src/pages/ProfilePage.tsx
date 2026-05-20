import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, BadgeCheck, Video, Heart, Bookmark, Award, Calendar, ExternalLink, Settings, Shield, Camera, MessageSquare, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SignCard } from '@/src/components/SignCard';

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
          language: parsed.language || 'BISINDO - Jakarta'
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
      language: 'BISINDO - Jakarta'
    };
  });
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);

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
      language: settingsForm.language
    };
    localStorage.setItem('user_settings', JSON.stringify(userSettings));
    
    setSettingsSuccess(prev => prev ? prev + ' Pengaturan preferensi disimpan.' : 'Pengaturan preferensi berhasil disimpan!');
    
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
      } catch (e) {}
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
          } catch (e) {}
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
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm leading-relaxed">
                 <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Tentang Saya</h4>
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
                 <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Badges & Pencapaian</h4>
                 <div className="flex flex-wrap gap-3">
                    {profile.badges.map(badge => (
                      <span key={badge} className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-100 text-slate-600">
                        {badge}
                      </span>
                    ))}
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
                 
                 <div className="mt-12 h-32 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Growth Chart Data Visualization Placeholder</p>
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
              onClick={() => setIsSettingsOpen(false)}
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
                  onClick={() => setIsSettingsOpen(false)}
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

                {/* Notifikasi Toggles */}
                <div className="space-y-4">
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
                      onClick={() => setIsSettingsOpen(false)}
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
    </div>
  );
}
