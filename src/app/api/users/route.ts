import { NextResponse } from 'next/server';
import { loadUsers } from '@/src/lib/usersDb';
import { loadSigns } from '@/src/lib/signsDb';

export async function GET() {
  try {
    const users = await loadUsers();
    const signs = await loadSigns();

    // Filter only users with role === 'informant'
    const informants = users.filter((u: any) => u.role === 'informant');

    // Map to include contribution counts dynamically
    const mappedInformants = informants.map((u: any) => {
      // Count signs contributed by this user (s.informant matches u.name)
      const contributions = signs.filter((s: any) => s.informant === u.name).length;

      // Default avatar for Rizki, empty for others
      const avatar = u.email === 'informan@garda.com' ? '/profil.jpg' : (u.avatar || '');

      return {
        id: u.email, // Use email as unique identifier/id
        name: u.name,
        email: u.email,
        region: u.region,
        joined: u.joined || 'Jan 2024',
        verified: u.email === 'informan@garda.com' ? true : (u.verified ?? false),
        contributions,
        avatar
      };
    });

    return NextResponse.json(mappedInformants);
  } catch (e: any) {
    console.error("Gagal memuat daftar informan:", e);
    return NextResponse.json({ error: "Gagal memuat daftar informan." }, { status: 500 });
  }
}
