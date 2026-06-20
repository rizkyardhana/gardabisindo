import { NextResponse } from 'next/server';
import { loadCategories, saveCategories } from '@/src/lib/categoriesDb';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
    }

    const categories = await loadCategories();
    const index = categories.findIndex(c => String(c.id) === String(id));
    
    if (index === -1) {
      return NextResponse.json({ error: "Kategori tidak ditemukan." }, { status: 404 });
    }

    const deleted = categories.splice(index, 1);
    await saveCategories(categories);

    return NextResponse.json({ success: true, deletedCategory: deleted[0] });
  } catch (e: any) {
    console.error("Gagal menghapus kategori:", e);
    return NextResponse.json({ error: "Gagal menghapus kategori." }, { status: 500 });
  }
}
