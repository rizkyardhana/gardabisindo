import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;
    
    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    let ext = 'webm';
    if (file instanceof File) {
      ext = file.name.split('.').pop() || 'webm';
    } else {
      const mime = file.type || '';
      ext = mime.includes('mp4') ? 'mp4' : 'webm';
    }

    const filename = `upload_${Date.now()}.${ext}`;
    
    // On Vercel, we use /tmp since the filesystem is read-only.
    // Locally we use public/uploads so the files can be served statically.
    const isVercel = process.env.VERCEL === '1';
    const uploadDir = isVercel 
      ? path.join('/tmp', 'uploads')
      : path.join(process.cwd(), 'public', 'uploads');
      
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    
    fs.writeFileSync(filePath, buffer);
    
    console.log(`Video uploaded successfully: ${filename}`);
    
    // Serve dynamically via /api/uploads/[filename] on Vercel
    const videoUrl = `/api/uploads/${filename}`;
    return NextResponse.json({ success: true, videoUrl });
  } catch (e: any) {
    console.error("Gagal mengunggah video:", e);
    return NextResponse.json({ error: e.message || "Gagal menyimpan video di server." }, { status: 500 });
  }
}
