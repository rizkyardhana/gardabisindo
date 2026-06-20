import { NextResponse } from 'next/server';
import { loadRegions, saveRegions } from '@/src/lib/regionsDb';

export async function GET() {
  try {
    const regions = await loadRegions();
    return NextResponse.json(regions);
  } catch (e: any) {
    console.error("Gagal memuat wilayah:", e);
    return NextResponse.json({ error: "Gagal memuat wilayah dari database." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Nama wilayah wajib diisi." }, { status: 400 });
    }

    const regions = await loadRegions();
    const exists = regions.some(r => r.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      return NextResponse.json({ error: "Wilayah tersebut sudah terdaftar." }, { status: 400 });
    }

    const newRegion = {
      id: Date.now(),
      name
    };

    regions.push(newRegion);
    await saveRegions(regions);

    return NextResponse.json({ success: true, region: newRegion });
  } catch (e: any) {
    console.error("Gagal menambahkan wilayah:", e);
    return NextResponse.json({ error: "Gagal menyimpan wilayah baru." }, { status: 500 });
  }
}
