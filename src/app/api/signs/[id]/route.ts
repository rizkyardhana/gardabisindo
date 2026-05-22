import { NextResponse } from 'next/server';
import { loadSigns, saveSigns } from '@/src/lib/signsDb';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedFields = await request.json();
    
    const signs = loadSigns();
    const index = signs.findIndex((s: any) => String(s.id) === String(id));
    
    if (index === -1) {
      return NextResponse.json({ error: "Isyarat tidak ditemukan." }, { status: 404 });
    }

    signs[index] = { ...signs[index], ...updatedFields };
    saveSigns(signs);

    return NextResponse.json({ success: true, sign: signs[index] });
  } catch (e: any) {
    console.error("Gagal memperbarui kosa isyarat:", e);
    return NextResponse.json({ error: "Gagal memperbarui kosa isyarat." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const signs = loadSigns();
    const index = signs.findIndex((s: any) => String(s.id) === String(id));
    
    if (index === -1) {
      return NextResponse.json({ error: "Isyarat tidak ditemukan." }, { status: 404 });
    }

    const deleted = signs.splice(index, 1);
    saveSigns(signs);

    return NextResponse.json({ success: true, deletedSign: deleted[0] });
  } catch (e: any) {
    console.error("Gagal menghapus kosa isyarat:", e);
    return NextResponse.json({ error: "Gagal menghapus kosa isyarat." }, { status: 500 });
  }
}
