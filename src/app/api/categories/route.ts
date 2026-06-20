import { NextResponse } from 'next/server';
import { loadCategories, saveCategories } from '@/src/lib/categoriesDb';

export async function GET() {
  try {
    const categories = await loadCategories();
    return NextResponse.json(categories);
  } catch (e: any) {
    console.error("Gagal memuat kategori:", e);
    return NextResponse.json({ error: "Gagal memuat kategori dari database." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Nama kategori wajib diisi." }, { status: 400 });
    }

    const categories = await loadCategories();
    const exists = categories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      return NextResponse.json({ error: "Kategori tersebut sudah terdaftar." }, { status: 400 });
    }

    const newCategory = {
      id: Date.now(),
      name,
      count: 0,
      description: description || "Tidak ada deskripsi."
    };

    categories.push(newCategory);
    await saveCategories(categories);

    return NextResponse.json({ success: true, category: newCategory });
  } catch (e: any) {
    console.error("Gagal menambahkan kategori:", e);
    return NextResponse.json({ error: "Gagal menyimpan kategori baru." }, { status: 500 });
  }
}
