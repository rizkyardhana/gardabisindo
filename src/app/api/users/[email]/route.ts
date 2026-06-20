import { NextResponse } from 'next/server';
import { loadUsers, saveUsers } from '@/src/lib/usersDb';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;
    const body = await request.json();
    const { verified } = body;

    if (!email) {
      return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
    }

    const decodedEmail = decodeURIComponent(email);
    const users = await loadUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === decodedEmail.toLowerCase());

    if (index === -1) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    users[index].verified = verified;
    await saveUsers(users);

    return NextResponse.json({ success: true, user: users[index] });
  } catch (e: any) {
    console.error("Gagal memperbarui status verifikasi:", e);
    return NextResponse.json({ error: "Gagal memperbarui status verifikasi." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;

    if (!email) {
      return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
    }

    const decodedEmail = decodeURIComponent(email);
    const users = await loadUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === decodedEmail.toLowerCase());

    if (index === -1) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const deleted = users.splice(index, 1);
    await saveUsers(users);

    return NextResponse.json({ success: true, deletedUser: deleted[0] });
  } catch (e: any) {
    console.error("Gagal menghapus pengguna:", e);
    return NextResponse.json({ error: "Gagal menghapus pengguna." }, { status: 500 });
  }
}
