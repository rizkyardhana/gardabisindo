import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> | { filename: string } }
) {
  try {
    // In Next.js 15, dynamic route params should be awaited if they are a promise
    const resolvedParams = 'then' in params ? await params : params;
    const { filename } = resolvedParams;

    if (!filename) {
      return new Response('Bad request: Missing filename', { status: 400 });
    }

    const isVercel = process.env.VERCEL === '1';
    const uploadDir = isVercel
      ? path.join('/tmp', 'uploads')
      : path.join(process.cwd(), 'public', 'uploads');

    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return new Response('Video not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type
    const ext = filename.split('.').pop() || 'webm';
    const contentType = ext === 'mp4' ? 'video/mp4' : 'video/webm';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    });
  } catch (e: any) {
    console.error("Error serving uploaded video:", e);
    return new Response('Internal Server Error', { status: 500 });
  }
}
