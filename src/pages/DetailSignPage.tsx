import { useParams, Link } from 'react-router-dom';
import { Share2, Heart, Bookmark, MapPin, User, ArrowLeft, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { SignCard } from '@/src/components/SignCard';
import { useState } from 'react';
import type { Sign } from '@/src/types';

export function DetailSignPage() {
  const { id } = useParams();
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Load signs list from localStorage to dynamically match the detail view
  const [localSigns] = useState<any[]>(() => {
    const saved = localStorage.getItem('garda_signs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Find current sign from database, fallback to mock details if not found
  const rawSign = localSigns.find(s => String(s.id) === String(id));
  const sign = {
    id: id || '1',
    word: rawSign?.word || 'Terima Kasih',
    category: rawSign?.category || 'Harian',
    region: rawSign?.region || 'Jakarta',
    thumbnailUrl: rawSign?.thumbnailUrl || '/bisindo_gesture_placeholder.png',
    videoUrl: rawSign?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: rawSign?.description || 'Gerakan telapak tangan kanan menempel di dagu lalu diayunkan ke depan sebagai simbol penghormatan dan terima kasih.',
    informant: rawSign?.informant || 'Rizki Ardhana',
    likes: rawSign?.likes || 124,
    bookmarks: rawSign?.bookmarks || 45,
    createdAt: rawSign?.date || rawSign?.createdAt || '2026-05-18',
    etymology: 'Berasal dari gerakan sopan santun masyarakat Indonesia dalam menyatakan rasa hormat.',
    usageContext: 'Gunakan saat menerima bantuan, pemberian, atau layanan dari orang lain.'
  };

  const [commentText, setCommentText] = useState('');

  // Load current user profile for avatar/name representation
  const [userProfile] = useState<{ name: string; avatar?: string; role?: string } | null>(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Comments state
  const [comments, setComments] = useState<{
    id: string;
    userName: string;
    avatarUrl: string;
    text: string;
    createdAt: string;
  }[]>(() => {
    const saved = localStorage.getItem(`garda_comments_${id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaults = [
      {
        id: 'c1',
        userName: 'Ahmad Hadi',
        avatarUrl: '',
        text: `Isyarat "${sign.word}" di wilayah kami agak sedikit berbeda di bagian ketukan tangannya. Senang melihat variasi daerah ini terdokumentasi!`,
        createdAt: '1 hari yang lalu'
      },
      {
        id: 'c2',
        userName: 'Tim Ahli PUSBISINDO',
        avatarUrl: '/profil.jpg',
        text: 'Akurasi gerakan ini sudah sesuai dengan standar regional dan linguistik BISINDO. Bagus sekali kontribusinya!',
        createdAt: 'Baru saja'
      }
    ];
    localStorage.setItem(`garda_comments_${id}`, JSON.stringify(defaults));
    return defaults;
  });

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `c_${Date.now()}`,
      userName: userProfile?.name || 'Kontributor Tamu',
      avatarUrl: userProfile?.avatar || '',
      text: commentText.trim(),
      createdAt: 'Baru saja'
    };

    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(`garda_comments_${id}`, JSON.stringify(updated));
    setCommentText('');
  };

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleUpdateComment = (commentId: string) => {
    if (!editingText.trim()) return;
    const updated = comments.map(c => 
      c.id === commentId ? { ...c, text: editingText.trim() } : c
    );
    setComments(updated);
    localStorage.setItem(`garda_comments_${id}`, JSON.stringify(updated));
    setEditingCommentId(null);
    triggerToast('Komentar berhasil diperbarui!');
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus masukan ini?')) {
      const updated = comments.filter(c => c.id !== commentId);
      setComments(updated);
      localStorage.setItem(`garda_comments_${id}`, JSON.stringify(updated));
      triggerToast('Komentar berhasil dihapus.');
    }
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [isLiked, setIsLiked] = useState<boolean>(() => {
    const saved = localStorage.getItem('liked_signs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.includes(String(id));
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    const saved = localStorage.getItem('bookmarked_signs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.includes(String(id));
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const handleLikeClick = () => {
    let likedArr: string[] = [];
    const saved = localStorage.getItem('liked_signs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) likedArr = parsed;
      } catch (e) {}
    }

    if (isLiked) {
      likedArr = likedArr.filter(item => item !== String(id));
      setIsLiked(false);
      triggerToast('Batal menyukai kosa isyarat.');
    } else {
      likedArr.push(String(id));
      setIsLiked(true);
      triggerToast('Menyukai kosa isyarat ini!');
    }
    localStorage.setItem('liked_signs', JSON.stringify(likedArr));
  };

  const handleBookmarkClick = () => {
    let bookmarkedArr: string[] = [];
    const saved = localStorage.getItem('bookmarked_signs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) bookmarkedArr = parsed;
      } catch (e) {}
    }

    if (isBookmarked) {
      bookmarkedArr = bookmarkedArr.filter(item => item !== String(id));
      setIsBookmarked(false);
      triggerToast('Batal menyimpan kosa isyarat.');
    } else {
      bookmarkedArr.push(String(id));
      setIsBookmarked(true);
      triggerToast('Kosa isyarat berhasil disimpan!');
    }
    localStorage.setItem('bookmarked_signs', JSON.stringify(bookmarkedArr));
  };

  const handleShareClick = () => {
    const shareText = `Pelajari kosa isyarat BISINDO untuk kata "${sign.word}" (${sign.region}) di platform Garda Bisindo Digital: ${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
      triggerToast('Tautan berhasil disalin ke clipboard!');
    }).catch(err => {
      console.error('Gagal menyalin:', err);
      triggerToast('Gagal menyalin tautan.');
    });
  };

  const fetchAiInsight = async () => {
    setIsLoadingAi(true);
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: sign.word, region: sign.region })
      });
      const data = await response.json();
      setAiInsight(data.explanation);
    } catch (error) {
      console.error(error);
      setAiInsight("Gagal mendapatkan wawasan AI.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Build some related signs from the database, excluding the current one
  const relatedSigns: Sign[] = localSigns
    .filter((s: any) => String(s.id) !== String(id) && s.status === 'Approved')
    .slice(0, 2)
    .map((s: any) => ({
      id: String(s.id),
      word: s.word,
      category: s.category,
      region: s.region,
      videoUrl: s.videoUrl || '#',
      thumbnailUrl: s.thumbnailUrl || '/bisindo_gesture_placeholder.png',
      description: s.description || '',
      informantId: 'inf-default',
      likes: s.likes || 0,
      bookmarks: s.bookmarks || 0,
      createdAt: s.date || s.createdAt || '2026-05-18'
    }));

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/dictionary" className="inline-flex items-center gap-2 text-slate-500 hover:text-garda-red transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Kamus
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative border-4 border-white flex items-center justify-center">
              {sign.videoUrl && (sign.videoUrl.includes('youtube') || sign.videoUrl.includes('embed')) ? (
                <iframe 
                  className="w-full h-full"
                  src={sign.videoUrl}
                  title="Video Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video 
                  className="w-full h-full object-contain"
                  src={sign.videoUrl}
                  controls
                  autoPlay
                  muted
                />
              )}
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                       <span className="px-3 py-1 bg-garda-red/10 text-garda-red text-[10px] font-bold uppercase tracking-widest rounded-full">{sign.category}</span>
                       <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <MapPin className="w-3 h-3" />
                         {sign.region}
                       </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl mb-0">{sign.word}</h1>
                  </div>

                  <div className="flex items-center gap-3">
                     <button 
                       onClick={handleLikeClick}
                       className={`p-4 rounded-2xl transition-all border cursor-pointer ${
                         isLiked 
                           ? "bg-red-50 text-red-500 border-red-200 shadow-md shadow-red-50/50 scale-105" 
                           : "bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 border-slate-100"
                       }`}
                     >
                        <Heart className={`w-6 h-6 ${isLiked ? "fill-red-500" : ""}`} />
                     </button>
                     <button 
                       onClick={handleBookmarkClick}
                       className={`p-4 rounded-2xl transition-all border cursor-pointer ${
                         isBookmarked 
                           ? "bg-cyan-50 text-cyan-600 border-cyan-200 shadow-md shadow-cyan-50/50 scale-105" 
                           : "bg-slate-50 hover:bg-cyan-50 text-slate-400 hover:text-cyan-500 border-slate-100"
                       }`}
                     >
                        <Bookmark className={`w-6 h-6 ${isBookmarked ? "fill-cyan-500" : ""}`} />
                     </button>
                     <button 
                       onClick={handleShareClick}
                       className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100 cursor-pointer active:scale-95"
                     >
                        <Share2 className="w-6 h-6" />
                     </button>
                  </div>
               </div>

               <hr className="border-slate-100 mb-8" />

               <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Deskripsi Gerakan</h4>
                    <p className="text-slate-600 text-lg leading-relaxed">{sign.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Asal-usul (Etimologi)</h4>
                      <p className="text-slate-600 leading-relaxed italic">{sign.etymology}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Konteks Penggunaan</h4>
                      <p className="text-slate-600 leading-relaxed">{sign.usageContext}</p>
                    </div>
                  </div>

                  {/* AI Insight Feature */}
                  <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-20 h-20 text-indigo-600" />
                     </div>
                     <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-indigo-600">
                           <Sparkles className="w-5 h-5" />
                           <span className="text-xs font-bold uppercase tracking-widest">AI Cultural Insight</span>
                        </div>
                        <h4 className="text-xl font-bold mb-4">Wawasan Budaya Digital</h4>
                        
                        {aiInsight ? (
                           <motion.p 
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="text-slate-600 leading-relaxed"
                           >
                             {aiInsight}
                           </motion.p>
                        ) : (
                           <button 
                             onClick={fetchAiInsight}
                             disabled={isLoadingAi}
                             className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 cursor-pointer"
                           >
                             {isLoadingAi ? "Menganalisis Budaya..." : "Dapatkan Wawasan AI"}
                           </button>
                        )}
                        <p className="mt-4 text-[10px] text-slate-400 font-medium">Powered by Gemini AI - Menganalisis konteks regional dan linguistik.</p>
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Comments / Community Discussion */}
            <div className="bg-slate-100/50 rounded-[2.5rem] p-10 border border-slate-200">
               <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="text-slate-400" />
                  <h3 className="text-xl font-bold">Diskusi Komunitas</h3>
               </div>
               
               <form onSubmit={handleSendComment} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                    {userProfile?.avatar ? (
                      <img src={userProfile.avatar} alt="Profil Anda" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                     <textarea 
                       placeholder="Tambahkan catatan atau variasi daerah lain..." 
                       value={commentText}
                       onChange={e => setCommentText(e.target.value)}
                       className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-garda-red/20 outline-none transition-all text-sm resize-none"
                       rows={3}
                       required
                     />
                     <button type="submit" className="mt-4 px-6 py-2 bg-garda-red hover:bg-red-700 text-white rounded-xl font-bold ml-auto block text-sm cursor-pointer transition-colors shadow-md shadow-red-100">
                       Kirim Masukan
                     </button>
                  </div>
               </form>

               {/* Comments List */}
               <div className="mt-8 space-y-6">
                 {comments.length === 0 ? (
                   <p className="text-xs text-slate-400 italic text-center">Belum ada diskusi. Jadilah yang pertama memberikan masukan!</p>
                 ) : (
                    comments.map((comment) => {
                      const isOwner = comment.userName === userProfile?.name || comment.id.startsWith('c_');
                      const isAdmin = userProfile?.role === 'admin';
                      return (
                        <div key={comment.id} className="flex gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md animate-fade-in">
                          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border border-slate-200 shrink-0">
                            {comment.avatarUrl ? (
                              <img src={comment.avatarUrl} alt={comment.userName} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm text-slate-900">{comment.userName}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{comment.createdAt}</span>
                            </div>
                            {editingCommentId === comment.id ? (
                              <div className="space-y-2 mt-2">
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-garda-red/20 outline-none resize-none bg-slate-50"
                                  rows={2}
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setEditingCommentId(null)}
                                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] uppercase tracking-wider cursor-pointer transition-colors"
                                  >
                                    Batal
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateComment(comment.id)}
                                    className="px-3 py-1 bg-garda-red hover:bg-red-700 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider cursor-pointer transition-colors"
                                  >
                                    Simpan
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-slate-600 text-sm leading-relaxed">{comment.text}</p>
                                {(isOwner || isAdmin) && (
                                  <div className="flex gap-3 mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {isOwner && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingCommentId(comment.id);
                                          setEditingText(comment.text);
                                        }}
                                        className="hover:text-indigo-600 cursor-pointer transition-colors"
                                      >
                                        Edit
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteComment(comment.id)}
                                      className="hover:text-garda-red cursor-pointer transition-colors"
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                 )}
               </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
               <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Informan Tuli</h4>
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg">{sign.informant}</h5>
                    <p className="text-xs text-slate-500">{sign.region}</p>
                  </div>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  {sign.informant} adalah bagian dari kontributor aktif relawan komunitas Tuli yang berkomitmen tinggi mendokumentasikan bahasa isyarat daerah {sign.region} agar lestari.
               </p>
               <Link to="/profile" className="block w-full py-3 text-center bg-slate-50 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                 Lihat Profil & Kontribusi
               </Link>
            </div>

            <div className="bg-garda-navy rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                 <ShieldCheck className="w-10 h-10 text-garda-cyan mb-4" />
                 <h4 className="font-bold text-xl mb-4">Verifikasi Akurasi</h4>
                 <p className="text-slate-400 text-sm leading-relaxed mb-6">
                   Video ini telah divalidasi oleh tim ahli PUSBISINDO untuk memastikan akurasi penggunaan isyarat secara linguistik.
                 </p>
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-garda-cyan">
                   <div className="w-2 h-2 bg-garda-cyan rounded-full animate-pulse" />
                   Certified BISINDO
                 </div>
               </div>
            </div>

            {relatedSigns.length > 0 && (
              <div>
                 <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Isyarat Terkait</h4>
                 <div className="space-y-6">
                    {relatedSigns.map(rs => (
                      <SignCard key={rs.id} sign={rs} className="shadow-none border-slate-200" />
                    ))}
                 </div>
              </div>
            )}
           </div>
         </div>
       </div>

       {/* Toast Notification */}
       {toastMessage && (
         <div className="fixed bottom-6 right-6 z-[200] bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-800 animate-fade-in">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
           {toastMessage}
         </div>
       )}
     </div>
   );
 }
