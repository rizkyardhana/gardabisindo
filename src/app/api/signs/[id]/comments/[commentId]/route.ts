import { NextResponse } from 'next/server';
import { loadSigns, saveSigns } from '@/src/lib/signsDb';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await params;
    const updatedComment = await request.json();

    const signs = loadSigns();
    const signIndex = signs.findIndex((s: any) => String(s.id) === String(id));

    if (signIndex === -1) {
      return NextResponse.json({ error: "Isyarat tidak ditemukan." }, { status: 404 });
    }

    if (signs[signIndex].comments) {
      const cIndex = signs[signIndex].comments.findIndex((c: any) => String(c.id) === String(commentId));
      if (cIndex !== -1) {
        signs[signIndex].comments[cIndex] = { ...signs[signIndex].comments[cIndex], ...updatedComment };
        saveSigns(signs);
        return NextResponse.json({ success: true, comments: signs[signIndex].comments });
      }
    }

    return NextResponse.json({ error: "Komentar tidak ditemukan." }, { status: 404 });
  } catch (e: any) {
    console.error("Gagal menyunting komentar:", e);
    return NextResponse.json({ error: "Gagal memperbarui komentar." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await params;

    const signs = loadSigns();
    const signIndex = signs.findIndex((s: any) => String(s.id) === String(id));

    if (signIndex === -1) {
      return NextResponse.json({ error: "Isyarat tidak ditemukan." }, { status: 404 });
    }

    if (signs[signIndex].comments) {
      const initialLength = signs[signIndex].comments.length;
      signs[signIndex].comments = signs[signIndex].comments.filter((c: any) => String(c.id) !== String(commentId));
      
      if (signs[signIndex].comments.length < initialLength) {
        saveSigns(signs);
        return NextResponse.json({ success: true, comments: signs[signIndex].comments });
      }
    }

    return NextResponse.json({ error: "Komentar tidak ditemukan." }, { status: 404 });
  } catch (e: any) {
    console.error("Gagal menghapus komentar:", e);
    return NextResponse.json({ error: "Gagal menghapus komentar." }, { status: 500 });
  }
}
