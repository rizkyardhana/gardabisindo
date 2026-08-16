import { NextResponse } from 'next/server';
import { loadSigns, saveSigns } from '@/src/lib/signsDb';

export async function GET() {
  try {
    const signs = await loadSigns();
    return NextResponse.json(signs, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      }
    });
  } catch (e: any) {
    console.error("Gagal memuat kosa isyarat:", e);
    return NextResponse.json({ error: "Gagal memuat kosa isyarat dari database." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newSign = await request.json();
    
    if (!newSign || !newSign.word) {
      return NextResponse.json({ error: "Data isyarat tidak lengkap." }, { status: 400 });
    }

    if (!newSign.id) {
      newSign.id = Date.now();
    }

    if (!newSign.comments) {
      newSign.comments = [];
    }

    const signs = await loadSigns();
    signs.unshift(newSign);
    await saveSigns(signs);

    return NextResponse.json({ success: true, sign: newSign });
  } catch (e: any) {
    console.error("Gagal menambahkan kosa isyarat:", e);
    return NextResponse.json({ error: "Gagal menyimpan kosa isyarat baru." }, { status: 500 });
  }
}
