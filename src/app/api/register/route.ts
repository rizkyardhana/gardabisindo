import { NextResponse } from 'next/server';
import { loadUsers, saveUsers } from '@/src/lib/usersDb';

export async function POST(request: Request) {
  try {
    const { name, email, region, password, role } = await request.json();

    if (!name || !email || !region || !password || !role) {
      return NextResponse.json({ error: "Semua formulir pendaftaran wajib diisi." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal harus 6 karakter." }, { status: 400 });
    }

    const usersDb = await loadUsers();
    const exists = usersDb.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return NextResponse.json({ error: "Email tersebut sudah terdaftar." }, { status: 400 });
    }

    const newUser = {
      name,
      email,
      region,
      password,
      role,
      bio: `Saya seorang ${role === 'informant' ? 'Informan Kontributor' : 'Admin'} di platform Garda BISINDO.`,
      joined: new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
      verified: false
    };

    usersDb.push(newUser);
    await saveUsers(usersDb);

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Silakan masuk dengan akun Anda."
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
