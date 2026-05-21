import { NextResponse } from 'next/server';
import { loadUsers } from '@/src/lib/usersDb';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, dan role wajib diisi." }, { status: 400 });
    }

    const usersDb = loadUsers();
    const user = usersDb.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password && 
      u.role === role
    );

    if (!user) {
      return NextResponse.json({ error: "Email, password, atau peran (role) salah." }, { status: 401 });
    }

    const emailBase64 = Buffer.from(email).toString('base64');
    const token = `garda_token_${role}_${emailBase64}`;

    return NextResponse.json({
      success: true,
      token,
      role,
      user: {
        email: user.email,
        name: user.name,
        region: user.region,
        bio: user.bio
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
