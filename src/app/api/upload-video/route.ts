import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const ext = request.headers.get("x-file-extension") || "webm";
    const filename = `upload_${Date.now()}.${ext}`;

    const buffer = Buffer.from(await request.arrayBuffer());

    // Check if Vercel Blob token is available
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      console.log("Uploading video to Vercel Blob...");
      const blob = await put(filename, buffer, {
        access: "public",
        token: blobToken,
      });
      console.log(`Video uploaded to Vercel Blob: ${blob.url}`);
      return NextResponse.json({ success: true, videoUrl: blob.url });
    }

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
