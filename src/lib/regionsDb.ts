import fs from 'fs';
import path from 'path';
import { put, list } from '@vercel/blob';

// Use /tmp in Vercel production since the root filesystem is read-only.
const isVercel = process.env.VERCEL === '1';
const REGIONS_FILE = isVercel 
  ? path.join('/tmp', 'regions.json')
  : path.join(process.cwd(), 'regions.json');

// Vercel KV REST API configuration
const KV_REST_API_URL = process.env.KV_REST_API_URL || 
                        process.env.UPSTASH_REDIS_REST_URL || 
                        process.env.PENYIMPANAN_REST_API_URL || 
                        process.env.PENYIMPANAN_URL;

const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || 
                          process.env.UPSTASH_REDIS_REST_TOKEN || 
                          process.env.PENYIMPANAN_REST_API_TOKEN || 
                          process.env.PENYIMPANAN_TOKEN;

const defaultRegions = [
  { id: 1, name: 'Nasional' },
  { id: 2, name: 'Jakarta' },
  { id: 3, name: 'Yogyakarta' },
  { id: 4, name: 'Bali' },
  { id: 5, name: 'Sumatera Barat' },
  { id: 6, name: 'Sulawesi Selatan' },
  { id: 7, name: 'Papua' },
];

let memoryDb: any[] | null = null;

export async function loadRegions(): Promise<any[]> {
  // 1. Try Vercel KV if available
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      const response = await fetch(`${KV_REST_API_URL}/get/regions`, {
        headers: {
          'Authorization': `Bearer ${KV_REST_API_TOKEN}`
        },
        cache: 'no-store'
      });
      const data = await response.json();
      if (data && data.result) {
        return JSON.parse(data.result);
      } else {
        await saveRegions(defaultRegions);
        return defaultRegions;
      }
    } catch (e) {
      console.error("Error loading regions from Vercel KV:", e);
    }
  }

  // 2. Try Vercel Blob Storage if available
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    try {
      const { blobs } = await list({ prefix: 'db_data/regions.json', token: blobToken });
      if (blobs && blobs.length > 0) {
        const latest = blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
        const response = await fetch(`${latest.url}?t=${Date.now()}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            memoryDb = data;
            return data;
          }
        }
      }
    } catch (e) {
      console.error("Error loading regions from Vercel Blob:", e);
    }
  }

  // 3. Fallback to Local Filesystem
  if (memoryDb) return memoryDb;
  
  try {
    if (fs.existsSync(REGIONS_FILE)) {
      const data = fs.readFileSync(REGIONS_FILE, "utf-8");
      memoryDb = JSON.parse(data);
      return memoryDb!;
    } else {
      fs.writeFileSync(REGIONS_FILE, JSON.stringify(defaultRegions, null, 2));
      memoryDb = [...defaultRegions];
      return memoryDb;
    }
  } catch (e) {
    console.error("Error loading regions from file, falling back to memory:", e);
    try {
      const localFile = path.join(process.cwd(), 'regions.json');
      if (fs.existsSync(localFile)) {
        const data = fs.readFileSync(localFile, "utf-8");
        memoryDb = JSON.parse(data);
        return memoryDb!;
      }
    } catch (localError) {}
    
    memoryDb = [...defaultRegions];
    return memoryDb;
  }
}

export async function saveRegions(regionsList: any[]): Promise<void> {
  memoryDb = regionsList;

  // 1. Save to Vercel KV if available
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      await fetch(`${KV_REST_API_URL}/set/regions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KV_REST_API_TOKEN}`
        },
        body: JSON.stringify(regionsList)
      });
      return;
    } catch (e) {
      console.error("Error saving regions to Vercel KV:", e);
    }
  }

  // 2. Save to Vercel Blob Storage if available
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    try {
      await put('db_data/regions.json', JSON.stringify(regionsList), {
        access: 'public',
        addRandomSuffix: true,
        token: blobToken
      });
    } catch (e) {
      console.error("Error saving regions to Vercel Blob:", e);
    }
  }

  // 3. Save to Local Filesystem
  try {
    fs.writeFileSync(REGIONS_FILE, JSON.stringify(regionsList, null, 2));
  } catch (e) {
    console.error("Error saving regions to file:", e);
    try {
      const localFile = path.join(process.cwd(), 'regions.json');
      fs.writeFileSync(localFile, JSON.stringify(regionsList, null, 2));
    } catch (localError) {}
  }
}
