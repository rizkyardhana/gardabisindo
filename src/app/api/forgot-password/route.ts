import { NextResponse } from 'next/server';
import { loadUsers } from '@/src/lib/usersDb';
import { sendRecoveryEmail } from '@/src/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi." }, { status: 400 });
    }

    const usersDb = await loadUsers();
    const user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return NextResponse.json({ error: "Email tidak terdaftar dalam sistem kami." }, { status: 404 });
    }

    // Mengirim email pemulihan (akan dilewati jika RESEND_API_KEY tidak disetel)
    await sendRecoveryEmail(user.email, user.name, user.password);

    return NextResponse.json({
      success: true,
      message: `Tautan pemulihan password telah dikirim ke ${email}.`,
      demoPassword: user.password
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
