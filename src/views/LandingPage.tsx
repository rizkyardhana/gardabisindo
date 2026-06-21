import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Play, ArrowRight, ShieldCheck, Video, MapPin, Users, BookOpen, Sparkles, Compass, HelpCircle, Check, X, Award, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SignCard } from '@/src/components/SignCard';
import { useLanguage } from '../contexts/LanguageContext';

const partners = [
  { name: 'DPP Gerkatin Pusat', logo: '/logo dpp gerkatin pusat.jpeg' },
  { name: 'DPD Gerkatin DIY', logo: '/logo dpd gerkatin provinis diy.jpg' },
  { name: 'Pusbisindo', logo: '/pusbisindo.png' },
  { name: 'Diktisaintek', logo: '/logo diktisaintek.svg' },
  { name: 'Komdigi', logo: '/logo komdigi.svg' },
  { name: 'PLJ', logo: '/plj.jpg' },
  { name: 'UGM', logo: '/logo ugm.webp' },
  { name: 'UI', logo: '/logo ui.webp' },
  { name: 'UAJY', logo: '/logo uajy.png' },
  { name: 'USD', logo: '/logo usd.png' },
  { name: 'Google', logo: '/logo google.jpg' },
  { name: 'GoTo', logo: '/logo goto.png' },
  { name: 'Gojek', logo: '/logo gojek.png' },
  { name: 'Tokopedia', logo: '/logo tokopedia.png' },
  { name: 'Traveloka', logo: '/logo traveloka.webp' },
  { name: 'Starbucks', logo: '/logo starbucks.png' },
  { name: 'Garuda Indonesia', logo: '/logo garuda indonesia.png' },
  { name: 'DRD', logo: '/logo drd.png' },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    word: 'Terima Kasih',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    options: ['Rumah', 'Terima Kasih', 'Makan', 'Sama-sama'],
    correctAnswer: 'Terima Kasih',
    explanation: 'Gerakan menempelkan telapak tangan di dagu lalu diarahkan ke depan melambangkan rasa syukur atau terima kasih.'
  },
  {
    id: 2,
    word: 'Rumah',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    options: ['Sekolah', 'Kantor', 'Rumah', 'Buku'],
    correctAnswer: 'Rumah',
    explanation: 'Kedua tangan membentuk sudut segitiga seperti atap di atas kepala untuk mensimbolkan tempat tinggal.'
  },
  {
    id: 3,
    word: 'Makan',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    options: ['Minum', 'Makan', 'Tidur', 'Bicara'],
    correctAnswer: 'Makan',
    explanation: 'Jari-jari tangan dirapatkan menghadap ke bawah dan didekatkan ke mulut berulang kali menunjukkan aktivitas makan.'
  }
];

const REGIONAL_INFO = [
  {
    id: 'sumatera',
    name: 'Sumatera',
    archivedCount: '620+',
    featuredWord: 'Bungo (Bunga)',
    regionName: 'Medan',
    description: 'Dialek Sumatera kaya akan ekspresi wajah yang tegas dengan isyarat tangan yang lugas.'
  },
  {
    id: 'jawa',
    name: 'Jawa',
    archivedCount: '1,150+',
    featuredWord: 'Maturnuwun (Terima Kasih)',
    regionName: 'Yogyakarta & Solo',
    description: 'Variasi isyarat di Jawa memiliki gerakan tangan yang sangat halus dengan kontras dialek pesisir yang dinamis.'
  },
  {
    id: 'kalimantan',
    name: 'Kalimantan',
    archivedCount: '310+',
    featuredWord: 'Sungai',
    regionName: 'Pontianak',
    description: 'Isyarat lokal di Kalimantan banyak dipengaruhi oleh penamaan alam sekitar seperti sungai dan hutan.'
  },
  {
    id: 'sulawesi',
    name: 'Sulawesi',
    archivedCount: '420+',
    featuredWord: 'Torang (Kita)',
    regionName: 'Manado',
    description: 'Bahasa isyarat di Sulawesi memiliki pergerakan tangan berputar yang khas dan ekspresif.'
  },
  {
    id: 'bali-nusa',
    name: 'Bali & Nusa Tenggara',
    archivedCount: '280+',
    featuredWord: 'Mepatut (Setuju)',
    regionName: 'Bengkala (Kolok)',
    description: 'Terkenal dengan Desa Bengkala di Bali yang memiliki bahasa isyarat alami sendiri (Kata Kolok) selama berabad-abad.'
  },
  {
    id: 'papua',
    name: 'Maluku & Papua',
    archivedCount: '190+',
    featuredWord: 'Sa (Saya)',
    regionName: 'Jayapura',
    description: 'Memiliki struktur dialek lokal yang unik dengan kombinasi isyarat visual yang luas.'
  }
];

const REGION_THEMES: Record<string, { text: string; bg: string; border: string; badge: string; accent: string; dot: string }> = {
  sumatera: {
    text: 'text-cyan-600',
    bg: 'bg-cyan-50/40',
    border: 'border-cyan-150',
    badge: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    accent: 'bg-cyan-500',
    dot: 'bg-cyan-500 ring-cyan-400'
  },
  jawa: {
    text: 'text-rose-600',
    bg: 'bg-rose-50/40',
    border: 'border-rose-150',
    badge: 'bg-rose-50 border-rose-200 text-rose-700',
    accent: 'bg-rose-500',
    dot: 'bg-red-500 ring-red-400'
  },
  kalimantan: {
    text: 'text-emerald-600',
    bg: 'bg-emerald-50/40',
    border: 'border-emerald-150',
    badge: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    accent: 'bg-emerald-500',
    dot: 'bg-emerald-500 ring-emerald-400'
  },
  sulawesi: {
    text: 'text-purple-600',
    bg: 'bg-purple-50/40',
    border: 'border-purple-150',
    badge: 'bg-purple-50 border-purple-200 text-purple-700',
    accent: 'bg-purple-500',
    dot: 'bg-purple-500 ring-purple-400'
  },
  'bali-nusa': {
    text: 'text-amber-600',
    bg: 'bg-amber-50/40',
    border: 'border-amber-150',
    badge: 'bg-amber-50 border-amber-200 text-amber-700',
    accent: 'bg-amber-500',
    dot: 'bg-amber-500 ring-amber-400'
  },
  papua: {
    text: 'text-blue-600',
    bg: 'bg-blue-50/40',
    border: 'border-blue-150',
    badge: 'bg-blue-50 border-blue-200 text-blue-700',
    accent: 'bg-blue-500',
    dot: 'bg-blue-500 ring-blue-400'
  }
};

export function LandingPage() {
  const { t, lang } = useLanguage();

  const localizedQuizQuestions = QUIZ_QUESTIONS.map(q => ({
    ...q,
    word: t(q.word),
    options: q.options.map(o => t(o)),
    correctAnswer: t(q.correctAnswer),
    explanation: t(q.explanation)
  }));

  const localizedRegionalInfo = REGIONAL_INFO.map(reg => ({
    ...reg,
    name: t(reg.name),
    description: t(reg.description),
    featuredWord: t(reg.featuredWord)
  }));

  const [selectedRegionId, setSelectedRegionId] = useState('jawa');
  const selectedRegion = localizedRegionalInfo.find(r => r.id === selectedRegionId) || localizedRegionalInfo[1];

  // Quiz states
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSubmit = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    const currentQuestion = localizedQuizQuestions[currentQuizIndex];
    if (option === currentQuestion.correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuizIndex < localizedQuizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
    setShowExplanation(false);
  };
  const stats = [
    { label: t('Kosa Isyarat'), value: '2,500+', icon: BookOpen },
    { label: t('Kontributor Tuli'), value: '150+', icon: Users },
    { label: t('Provinsi Terarsip'), value: '38', icon: MapPin },
    { label: t('Video Dokumentasi'), value: '1,200', icon: Video },
  ];

  const sampleSigns = [
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
      id: '2',
      word: 'Rumah',
      category: 'Harian',
      region: 'Yogyakarta',
      thumbnailUrl: '/bisindo_gesture_placeholder.png',
      videoUrl: '#',
      description: 'Kedua tangan membentuk atap di atas kepala untuk melambangkan tempat tinggal.',
      informantId: 'inf2',
      likes: 89,
      bookmarks: 23,
      createdAt: '2024-01-12'
    },
    {
      id: '3',
      word: 'Makan',
      category: 'Harian',
      region: 'Bali',
      thumbnailUrl: '/bisindo_gesture_placeholder.png',
      videoUrl: '#',
      description: 'Tangan kanan menguncup dan digerakkan ke arah mulut secara berulang.',
      informantId: 'inf3',
      likes: 210,
      bookmarks: 78,
      createdAt: '2024-01-15'
    }
  ];

  const localizedSampleSigns = sampleSigns.map(sign => ({
    ...sign,
    word: t(sign.word),
    category: t(sign.category),
    region: t(sign.region),
    description: t(sign.description)
  }));

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-6 bg-slate-950 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
          <img
            src="/tim garda bisindo.jpg"
            alt="tim garda bisindo"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-garda-red/10 border border-garda-red/20 rounded-full mb-6">
              <span className="w-2 h-2 bg-garda-red rounded-full animate-pulse" />
              <span className="text-garda-red text-xs font-bold uppercase tracking-widest leading-none">{t('Preserving Culture through Tech')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.9] tracking-tight">
              SAVE <span className="text-garda-red">BISINDO</span><br />
              SAVE OUR CULTURE
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              {t('Gerakan Arsip & Dokumentasi Digital Bahasa Isyarat Indonesia (BISINDO). Melindungi warisan komunikasi komunitas Tuli Indonesia untuk generasi mendatang.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dictionary" className="px-8 py-4 bg-garda-red text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-900/40 group">
                {t('Jelajahi Kamus')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5 fill-white" />
                {t('Tonton Dokumenter')}
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800" />
                ))}
              </div>
              <p className="text-slate-500 text-sm">
                {t('Bergabung bersama')} <span className="text-white font-bold">500+</span> {t('relawan komunitas')}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-garda-red/20 rounded-full blur-[100px] animate-pulse" />
              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl glass">
                <img
                  src="/bisindo_gesture_placeholder.png"
                  alt="BISINDO Demo"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-6 left-6 right-6 p-4 glass-dark rounded-2xl">
                  <p className="text-white font-medium text-sm flex items-center gap-2">
                    <ShieldCheck className="text-garda-cyan w-4 h-4" />
                    {t('Arsip Terverifikasi oleh Gerkatin')}
                  </p>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -right-8 p-4 glass rounded-2xl shadow-xl w-48"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Syncing Data</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full mb-3">
                  <div className="h-full w-2/3 bg-garda-red rounded-full" />
                </div>
                <p className="text-xs font-bold">{t('12 Kosa Isyarat Baru')}</p>
                <p className="text-[10px] text-slate-400">{lang === 'en' ? 'Region' : 'Wilayah'}: {t('Maluku & Papua')}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group hover:bg-garda-red transition-all">
                  <stat.icon className="w-8 h-8 text-garda-red group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-4xl font-display font-bold mb-2">{stat.value}</h3>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-slate-50 px-6 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <p className="text-garda-red font-bold text-xs uppercase tracking-[0.3em] mb-4">{t('Mulai Belajar')}</p>
              <h2 className="text-4xl md:text-5xl">{t('Arsip Kosa Isyarat Pilihan')}</h2>
            </div>
            <Link to="/dictionary" className="text-garda-red font-bold flex items-center gap-2 hover:gap-3 transition-all">
              {t('Semua Kosa Isyarat')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {localizedSampleSigns.map((sign) => (
              <SignCard key={sign.id} sign={sign} />
            ))}
          </div>
        </div>
      </section>

      {/* Latar Belakang Section (About) */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-900 border-8 border-white shadow-2xl">
              <img
                src="/bisindo_gesture_placeholder.png"
                alt="Community"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 p-8 glass rounded-[2.5rem] shadow-2xl max-w-sm hidden md:block">
              <h4 className="text-xl font-bold mb-4">{t('Visi Kami')}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('Memastikan tidak ada variasi kosa isyarat daerah yang hilang dari sejarah budaya Indonesia melalui dokumentasi berbasis data and AI.')}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-5xl mb-8">{t('Mengapa GARDA BISINDO hadir?')}</h2>
            <div className="space-y-8">
              <p className="text-slate-600 text-lg leading-relaxed">
                {t('Bahasa Isyarat Indonesia (BISINDO) merupakan bagian penting dari identitas dan budaya komunitas Tuli Indonesia. Namun saat ini, banyak kosa isyarat daerah mulai hilang karena minimnya dokumentasi dan arsip digital yang tersedia.')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-10 h-10 bg-garda-cyan/10 rounded-xl flex items-center justify-center mb-4">
                    <ShieldCheck className="text-garda-cyan w-6 h-6" />
                  </div>
                  <h4 className="font-bold mb-2">{t('Perlindungan Budaya')}</h4>
                  <p className="text-xs text-slate-500">{t('Menjaga identitas komunitas Tuli Indonesia agar tetap hidup.')}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-10 h-10 bg-garda-red/10 rounded-xl flex items-center justify-center mb-4">
                    <Users className="text-garda-red w-6 h-6" />
                  </div>
                  <h4 className="font-bold mb-2">{t('Edukasi Publik')}</h4>
                  <p className="text-xs text-slate-500">{t('Memberikan akses belajar inklusif bagi masyarakat luas.')}</p>
                </div>
              </div>
              <button className="px-10 py-5 bg-garda-navy text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-navy-100">
                {t('Pahami Lebih Lanjut')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Eksplorasi Dialek Nusantara (Interactive Map Selection) */}
      <section className="py-24 bg-white px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 border border-cyan-150 rounded-full mb-4">
              <Compass className="w-4 h-4 text-cyan-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-cyan-700 text-xs font-bold uppercase tracking-widest leading-none">{t('Jelajahi Daerah')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              {t('Eksplorasi Dialek Nusantara')}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {t('Bahasa Isyarat memiliki dialek khas di tiap daerah. Klik daerah di peta grafis atau tombol list untuk melihat detailnya.')}
            </p>
          </div>

          <div className="space-y-8">
            {/* Wide Map Card */}
            <div className="bg-slate-50 border border-slate-150 rounded-[2.5rem] p-4 relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none" />

              <div className="relative w-full aspect-[2.2/1] rounded-3xl overflow-hidden border border-slate-200/80 shadow-inner bg-gradient-to-b from-sky-100 to-sky-50">
                <img
                  src="/peta pulau indonesia.jpg"
                  alt={t('Peta Kepulauan Indonesia')}
                  className="w-full h-full object-cover mix-blend-multiply opacity-90 contrast-105"
                />

                {/* Hotspots - Recalculated top positions to map physical islands on 2.2:1 cropped aspect ratio */}
                {[
                  { id: 'sumatera', name: 'Sumatera', top: '38%', left: '15%' },
                  { id: 'jawa', name: 'Jawa', top: '73%', left: '36%' },
                  { id: 'kalimantan', name: 'Kalimantan', top: '38%', left: '41%' },
                  { id: 'sulawesi', name: 'Sulawesi', top: '44%', left: '59%' },
                  { id: 'bali-nusa', name: 'Bali & Nusa Tenggara', top: '80%', left: '55%' },
                  { id: 'papua', name: 'Maluku & Papua', top: '56%', left: '85%' }
                ].map((pos) => {
                  const isActive = selectedRegionId === pos.id;
                  const regionObj = localizedRegionalInfo.find(r => r.id === pos.id);
                  const theme = REGION_THEMES[pos.id] || REGION_THEMES['jawa'];
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => regionObj && setSelectedRegionId(regionObj.id)}
                      style={{ top: pos.top, left: pos.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer z-10 p-1"
                    >
                      {/* Glow animation */}
                      <span className={`absolute inline-flex h-6 w-6 rounded-full opacity-75 animate-ping -left-[1px] -top-[1px] ${isActive ? 'bg-garda-red' : theme.dot}`} />
                      {/* Core pin */}
                      <span className={`relative block h-4 w-4 rounded-full border-2 border-white shadow-md transition-all duration-300 ${isActive ? 'bg-garda-red scale-125' : theme.dot}`} />

                      {/* Tooltip Label */}
                      <span className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1 text-[10px] font-bold text-white rounded-lg opacity-0 group-hover/pin:opacity-100 transition-all duration-250 transform translate-y-1 group-hover/pin:translate-y-0 whitespace-nowrap shadow-md pointer-events-none flex flex-col items-center ${isActive ? 'opacity-100 bg-garda-red translate-y-0' : 'bg-slate-900/90 backdrop-blur-sm'}`}>
                        {t(pos.name)}
                        {/* Caret pointing down */}
                        <span className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${isActive ? 'border-t-garda-red' : 'border-t-slate-900/90'}`} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Panel: Selected Region Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Region Selector Pills (Col span 4) */}
              <div className="lg:col-span-4 space-y-4">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 block uppercase">
                  {t('Pilih Wilayah')}
                </span>
                <div className="flex flex-wrap lg:flex-col gap-2.5">
                  {localizedRegionalInfo.map((reg) => {
                    const isActive = selectedRegionId === reg.id;
                    const regTheme = REGION_THEMES[reg.id] || REGION_THEMES['jawa'];
                    return (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => setSelectedRegionId(reg.id)}
                        className={`w-full lg:text-left px-5 py-3.5 rounded-2xl text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${isActive
                          ? 'bg-slate-900 text-white border-slate-950 shadow-md translate-x-1'
                          : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full transition-transform ${isActive ? 'bg-garda-red scale-110 animate-pulse' : regTheme.accent}`} />
                          <span>{reg.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] ${isActive ? 'bg-garda-red text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {reg.archivedCount} {t('Isyarat')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Region Stats & Highlights Card (Col span 8) */}
              <div className="lg:col-span-8">
                <motion.div
                  key={selectedRegion.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-slate-50 border border-slate-150 rounded-[2.5rem] p-8 space-y-6 shadow-sm relative overflow-hidden"
                >
                  {/* Subtle top indicator bar matching the regional color */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 w-full ${(REGION_THEMES[selectedRegion.id] || REGION_THEMES['jawa']).accent}`} />

                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase border ${(REGION_THEMES[selectedRegion.id] || REGION_THEMES['jawa']).badge}`}>
                        {t('Wilayah Terpilih')}
                      </span>
                      <h3 className="text-3xl font-display font-bold text-slate-900 mt-3">{selectedRegion.name}</h3>
                      <p className="text-slate-500 text-xs mt-1">{t('Pusat Penelitian:')} <span className="font-semibold text-slate-700">{selectedRegion.regionName}</span></p>
                    </div>

                    <Link
                      to={`/dictionary?region=${selectedRegion.name}`}
                      className="hidden sm:flex px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs transition-all items-center gap-2 group shadow-lg shadow-slate-900/10 cursor-pointer"
                    >
                      {t('Buka Kamus')} {selectedRegion.name}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedRegion.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200/65 p-4 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">{t('Arsip Video')}</span>
                      <span className="text-2xl font-bold text-slate-800">{selectedRegion.archivedCount}</span>
                    </div>
                    <div className="bg-white border border-slate-200/65 p-4 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">{t('Kosa Kata Unggulan')}</span>
                      <span className={`text-sm font-bold block truncate mt-1 ${(REGION_THEMES[selectedRegion.id] || REGION_THEMES['jawa']).text}`}>{selectedRegion.featuredWord}</span>
                    </div>
                  </div>

                  <div className="pt-2 sm:hidden">
                    <Link
                      to={`/dictionary?region=${selectedRegion.name}`}
                      className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-slate-900/10 cursor-pointer"
                    >
                      {t('Buka Kamus')} {selectedRegion.name}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Kuis Isyarat Cepat (Interactive Quiz Widget) */}
      <section className="py-24 bg-slate-50 px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-150 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-garda-red animate-pulse" />
              <span className="text-garda-red text-xs font-bold uppercase tracking-widest leading-none">{t('Tebak BISINDO')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              {t('Kuis Isyarat Interaktif')}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {t('Uji kemampuan visual bahasa isyarat Anda sekarang juga. Menangkan skor tertinggi!')}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
              <div
                className="h-full bg-garda-red transition-all duration-500"
                style={{ width: `${((currentQuizIndex + (quizFinished ? 1 : 0)) / localizedQuizQuestions.length) * 100}%` }}
              />
            </div>

            {!quizFinished ? (
              <div className="space-y-8">
                {/* Header info */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>{t('Soal')} {currentQuizIndex + 1} {t('dari')} {localizedQuizQuestions.length}</span>
                  <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">{t('Skor:')} {quizScore}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Left: Video Container */}
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-950 border border-slate-250 relative group shadow-sm flex items-center justify-center">
                    <video
                      key={localizedQuizQuestions[currentQuizIndex].videoUrl}
                      className="w-full h-full object-cover"
                      src={localizedQuizQuestions[currentQuizIndex].videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                    <div className="absolute bottom-4 left-4 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-white text-[10px] font-bold">
                      <Video className="w-3.5 h-3.5 text-garda-red animate-pulse" />
                      {t('MEMUTAR ISYARAT')}
                    </div>
                  </div>

                  {/* Right: Answer Choices */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t('Tebak arti gerakan isyarat di samping:')}</h3>

                    <div className="space-y-3">
                      {localizedQuizQuestions[currentQuizIndex].options.map((option) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === localizedQuizQuestions[currentQuizIndex].correctAnswer;
                        const hasAnswered = selectedAnswer !== null;

                        let buttonStyles = "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                        if (hasAnswered) {
                          if (isCorrect) {
                            buttonStyles = "bg-green-50 border-green-300 text-green-700 font-bold";
                          } else if (isSelected) {
                            buttonStyles = "bg-red-50 border-red-300 text-red-700 font-bold";
                          } else {
                            buttonStyles = "opacity-50 border-slate-100 text-slate-400";
                          }
                        }

                        return (
                          <button
                            key={option}
                            disabled={hasAnswered}
                            onClick={() => handleAnswerSubmit(option)}
                            className={`w-full py-4 px-6 border text-left rounded-2xl text-sm font-semibold transition-all flex items-center justify-between group cursor-pointer ${buttonStyles}`}
                          >
                            {option}
                            {hasAnswered && isCorrect && <Check className="w-5 h-5 text-green-600 animate-bounce" />}
                            {hasAnswered && isSelected && !isCorrect && <X className="w-5 h-5 text-red-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom explanation section */}
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 border border-slate-150 p-6 rounded-3xl space-y-3"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider">
                      <HelpCircle className="w-4 h-4 text-garda-red" />
                      {t('Penjelasan Gerakan')}
                    </div>
                    <p className="text-sm text-slate-650 leading-relaxed font-medium">
                      {localizedQuizQuestions[currentQuizIndex].explanation}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleNextQuiz}
                        className="px-6 py-3 bg-garda-red hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-red-100"
                      >
                        {currentQuizIndex < localizedQuizQuestions.length - 1 ? t('Soal Selanjutnya') : t('Lihat Hasil Akhir')}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6 max-w-md mx-auto"
              >
                <div className="w-24 h-24 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Award className="w-12 h-12 text-garda-red" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-display font-bold text-slate-900">{t('Kuis Selesai!')}</h3>
                  <p className="text-slate-500 font-medium">
                    {t('Skor akhir Anda adalah:')} <span className="text-garda-red font-bold text-lg">{quizScore} / {localizedQuizQuestions.length}</span>
                  </p>
                </div>

                <p className="text-sm text-slate-650 font-medium">
                  {quizScore === localizedQuizQuestions.length
                    ? t('Luar biasa! Anda memahami bahasa isyarat BISINDO dengan sangat baik.')
                    : t('Pekerjaan yang bagus! Ayo coba lagi untuk menyempurnakan pemahaman Anda.')}
                </p>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 py-4 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> {t('Ulangi Kuis')}
                  </button>
                  <Link
                    to="/dictionary"
                    className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 cursor-pointer"
                  >
                    {t('Belajar Lagi')}
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-12">{t('Bekerja Sama Dengan')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-stretch justify-center">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-center h-20 hover:border-slate-200 hover:shadow-md transition-all duration-300 group"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto p-12 lg:p-20 bg-garda-navy rounded-[3rem] text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-garda-red/10 animate-pulse pointer-events-none" />
          <h2 className="text-4xl md:text-6xl mb-8 relative z-10">{t('Mulai Dokumentasi Sekarang')}</h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 relative z-10">
            {t('Jadilah bagian dari gerakan pelestarian budaya. Bantu kami mendokumentasikan kosa isyarat di daerahmu.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <button className="px-10 py-5 bg-garda-red text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-red-500/40">
              {t('Daftar Jadi Informan')}
            </button>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
              {t('Donasi Campaign')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
