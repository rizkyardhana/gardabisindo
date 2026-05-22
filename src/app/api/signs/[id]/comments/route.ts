import { NextResponse } from 'next/server';
import { loadSigns, saveSigns } from '@/src/lib/signsDb';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comment = await request.json();

    const signs = loadSigns();
    const signIndex = signs.findIndex((s: any) => String(s.id) === String(id));

    if (signIndex === -1) {
      return NextResponse.json({ error: "Isyarat tidak ditemukan." }, { status: 404 });
    }

    if (!signs[signIndex].comments) {
      signs[signIndex].comments = [];
    }

    if (!comment.id) {
      comment.id = `c_${Date.now()}`;
    }

    signs[signIndex].comments.push(comment);
    saveSigns(signs);

    return NextResponse.json({ success: true, comments: signs[signIndex].comments });
  } catch (e: any) {
    console.error("Gagal menambahkan komentar:", e);
    return NextResponse.json({ error: "Gagal menyimpan komentar baru." }, { status: 500 });
  }
}
