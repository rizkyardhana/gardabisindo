import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const ext = request.headers.get("x-file-extension") || "webm";
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
    const buffer = Buffer.from(await request.arrayBuffer());
    
    fs.writeFileSync(filePath, buffer);
    
    console.log(`Video uploaded successfully: ${filename}`);
    
    const videoUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, videoUrl });
  } catch (e: any) {
    console.error("Gagal mengunggah video:", e);
    return NextResponse.json({ error: "Gagal menyimpan video di server." }, { status: 500 });
  }
}
