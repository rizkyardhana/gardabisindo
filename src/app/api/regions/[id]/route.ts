import { NextResponse } from 'next/server';
import { loadRegions, saveRegions } from '@/src/lib/regionsDb';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
    }

    const regions = await loadRegions();
    const index = regions.findIndex(r => String(r.id) === String(id));
    
    if (index === -1) {
      return NextResponse.json({ error: "Wilayah tidak ditemukan." }, { status: 404 });
    }

    const deleted = regions.splice(index, 1);
    await saveRegions(regions);

    return NextResponse.json({ success: true, deletedRegion: deleted[0] });
  } catch (e: any) {
    console.error("Gagal menghapus wilayah:", e);
    return NextResponse.json({ error: "Gagal menghapus wilayah." }, { status: 500 });
  }
}
