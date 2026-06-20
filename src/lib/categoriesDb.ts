import fs from 'fs';
import path from 'path';

// Use /tmp in Vercel production since the root filesystem is read-only.
const isVercel = process.env.VERCEL === '1';
const CATEGORIES_FILE = isVercel 
  ? path.join('/tmp', 'categories.json')
  : path.join(process.cwd(), 'categories.json');

// Vercel KV REST API configuration
const KV_REST_API_URL = process.env.KV_REST_API_URL || 
                        process.env.UPSTASH_REDIS_REST_URL || 
                        process.env.PENYIMPANAN_REST_API_URL || 
                        process.env.PENYIMPANAN_URL;

const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || 
                          process.env.UPSTASH_REDIS_REST_TOKEN || 
                          process.env.PENYIMPANAN_REST_API_TOKEN || 
                          process.env.PENYIMPANAN_TOKEN;

const defaultCategories = [
  { id: 1, name: 'Harian', count: 850, description: 'Isyarat percakapan sehari-hari seperti sapaan, makan, tidur.' },
  { id: 2, name: 'Teknologi', count: 120, description: 'Isyarat terkait komputer, internet, gawai, dan teknologi digital.' },
  { id: 3, name: 'Pendidikan', count: 240, description: 'Isyarat istilah sekolah, pelajaran, dan dunia akademik.' },
  { id: 4, name: 'Medis', count: 95, description: 'Isyarat istilah kesehatan, penyakit, obat, dan rumah sakit.' },
];

let memoryDb: any[] | null = null;

export async function loadCategories(): Promise<any[]> {
  // 1. Try Vercel KV if available
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      const response = await fetch(`${KV_REST_API_URL}/get/categories`, {
        headers: {
          'Authorization': `Bearer ${KV_REST_API_TOKEN}`
        },
        cache: 'no-store'
      });
      const data = await response.json();
      if (data && data.result) {
        return JSON.parse(data.result);
      } else {
        // Pre-populate Vercel KV with default categories
        await saveCategories(defaultCategories);
        return defaultCategories;
      }
    } catch (e) {
      console.error("Error loading categories from Vercel KV:", e);
    }
  }

  // 2. Fallback to Local Filesystem
  if (memoryDb) return memoryDb;
  
  try {
    if (fs.existsSync(CATEGORIES_FILE)) {
      const data = fs.readFileSync(CATEGORIES_FILE, "utf-8");
      memoryDb = JSON.parse(data);
      return memoryDb!;
    } else {
      fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(defaultCategories, null, 2));
      memoryDb = [...defaultCategories];
      return memoryDb;
    }
  } catch (e) {
    console.error("Error loading categories from file, falling back to memory:", e);
    try {
      const localFile = path.join(process.cwd(), 'categories.json');
      if (fs.existsSync(localFile)) {
        const data = fs.readFileSync(localFile, "utf-8");
        memoryDb = JSON.parse(data);
        return memoryDb!;
      }
    } catch (localError) {}
    
    memoryDb = [...defaultCategories];
    return memoryDb;
  }
}

export async function saveCategories(categoriesList: any[]): Promise<void> {
  memoryDb = categoriesList;

  // 1. Save to Vercel KV if available
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      await fetch(`${KV_REST_API_URL}/set/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KV_REST_API_TOKEN}`
        },
        body: JSON.stringify(categoriesList)
      });
      return;
    } catch (e) {
      console.error("Error saving categories to Vercel KV:", e);
    }
  }

  // 2. Save to Local Filesystem
  try {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categoriesList, null, 2));
  } catch (e) {
    console.error("Error saving categories to file:", e);
    try {
      const localFile = path.join(process.cwd(), 'categories.json');
      fs.writeFileSync(localFile, JSON.stringify(categoriesList, null, 2));
    } catch (localError) {}
  }
}
