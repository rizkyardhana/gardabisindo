import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, MapPin } from 'lucide-react';

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center rounded-2xl bg-garda-red px-4 py-3 text-white font-bold hover:brightness-110 transition cursor-pointer ${className ?? ''}`}
    />
  );
}

type Role = 'admin' | 'informant';
type AuthMode = 'login' | 'register' | 'forgot';

// Tutorials removed

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');

  // Login & Shared State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('informant');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Registration Only State
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [demoPassword, setDemoPassword] = useState<string | null>(null);

  // Feedback alerts
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!email.trim() || password.trim().length < 6) {
      setError('Email dan password (min. 6 karakter) wajib diisi.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Terjadi kesalahan saat login.');
        setLoading(false);
        return;
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_role', data.role);

      // Save user profile details to localStorage
      const userProfile = {
        name: data.user.name,
        role: data.role === 'admin' ? 'Admin Platform' : 'Informan Kontributor',
        location: data.user.region || 'Indonesia',
        bio: data.user.bio || 'Saya adalah bagian dari pelestarian Bahasa Isyarat Indonesia (BISINDO).',
        contributions: data.role === 'admin' ? 0 : 1,
        joinedDate: 'Mei 2026',
        badges: data.role === 'admin' ? ['System Admin'] : ['Kontributor Baru'],
        avatar: '/profil.jpg'
      };
      localStorage.setItem('user_profile', JSON.stringify(userProfile));

      // Trigger dynamic events for favicon and profile updates
      window.dispatchEvent(new Event('profileUpdate'));

      if (data.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal terhubung ke backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!name.trim() || !email.trim() || !region.trim() || password.trim().length < 6) {
      setError('Semua data registrasi wajib diisi. Password minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          region: region.trim(),
          password: password.trim(),
          role: role // Registers with the selected role (informant/admin)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Terjadi kesalahan saat registrasi.');
        setLoading(false);
        return;
      }

      setSuccess('Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.');
      setMode('login');
      // Keep email populated to ease login
      setPassword('');
      setShowRegisterPassword(false);
    } catch (err) {
      console.error(err);
      setError('Gagal terhubung ke backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setDemoPassword(null);
    setLoading(true);

    if (!forgotEmail.trim()) {
      setError('Masukkan email Anda untuk pemulihan sandi.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Email tidak terdaftar.');
        setLoading(false);
        return;
      }

      setSuccess(data.message);
      setDemoPassword(data.demoPassword);
    } catch (err) {
      console.error(err);
      setError('Gagal terhubung ke backend server.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    setDemoPassword(null);
    setShowLoginPassword(false);
    setShowRegisterPassword(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-xl"
      >
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden min-h-[500px] p-8 md:p-12 flex flex-col justify-center">
          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && (
            <div className="flex border-b border-slate-100 pb-4 mb-6">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 pb-2 text-center font-bold text-lg border-b-2 transition-all cursor-pointer ${mode === 'login' ? 'border-garda-red text-garda-red' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 pb-2 text-center font-bold text-lg border-b-2 transition-all cursor-pointer ${mode === 'register' ? 'border-garda-red text-garda-red' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
              >
                Daftar
              </button>
            </div>
          )}

          <h1 className="text-3xl font-bold mb-2 text-slate-800">
            {mode === 'login' && 'Login'}
            {mode === 'register' && 'Registrasi Akun'}
            {mode === 'forgot' && 'Lupa Password'}
          </h1>
          <p className="text-slate-500 mb-6">
            {mode === 'login' && 'Masuk untuk mengakses dashboard & profil Anda.'}
            {mode === 'register' && 'Daftar sebagai anggota atau admin baru platform Garda BISINDO.'}
            {mode === 'forgot' && 'Masukkan email Anda untuk pemulihan atau melihat kata sandi Anda.'}
          </p>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-semibold border border-emerald-100">
              {success}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex gap-2 mb-4 bg-slate-50 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRole('informant')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${role === 'informant'
                    ? 'bg-garda-red text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Informan
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${role === 'admin'
                    ? 'bg-garda-red text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Admin
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-garda-red/20 transition-all text-sm text-slate-800"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-garda-red/20 transition-all text-sm text-slate-800"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-xs font-bold text-slate-400 hover:text-garda-red transition-colors cursor-pointer"
                  >
                    Lupa Password?
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-2 py-4 rounded-2xl">
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>

              <p className="text-xs text-slate-400 pt-2 text-center">
                Belum punya akun? <button type="button" onClick={() => switchMode('register')} className="text-garda-red font-bold hover:underline cursor-pointer">Daftar Kontributor</button>
              </p>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex gap-2 mb-4 bg-slate-50 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRole('informant')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${role === 'informant'
                    ? 'bg-garda-red text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Informan
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${role === 'admin'
                    ? 'bg-garda-red text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  Admin
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-garda-red/20 transition-all text-sm text-slate-800"
                    placeholder="nama lengkap"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-garda-red/20 transition-all text-sm text-slate-800"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Wilayah / Kota Asal</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-garda-red/20 transition-all text-sm text-slate-800"
                    placeholder="Jakarta Selatan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showRegisterPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-garda-red/20 transition-all text-sm text-slate-800"
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-2 py-4 rounded-2xl bg-garda-navy">
                {loading ? 'Mendaftarkan...' : 'Daftar Akun'}
              </Button>

              <p className="text-xs text-slate-400 pt-2 text-center">
                Sudah punya akun? <button type="button" onClick={() => switchMode('login')} className="text-garda-red font-bold hover:underline cursor-pointer">Masuk</button>
              </p>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Email Terdaftar</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-garda-red/20 transition-all text-sm text-slate-800"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {demoPassword && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-sm">
                  <p className="font-bold mb-1">Simulasi Demo Pemulihan:</p>
                  <p>Kata sandi akun Anda saat ini: <strong className="text-garda-red font-mono text-base">{demoPassword}</strong></p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full mt-2 py-4 rounded-2xl">
                {loading ? 'Mengirim...' : 'Kirim Permintaan Pemulihan'}
              </Button>

              <p className="text-xs text-slate-400 pt-2 text-center">
                Kembali ke <button type="button" onClick={() => switchMode('login')} className="text-garda-red font-bold hover:underline cursor-pointer">Halaman Login</button>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
