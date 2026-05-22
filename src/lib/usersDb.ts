import fs from 'fs';
import path from 'path';

// Use /tmp in Vercel production since the root filesystem is read-only.
const isVercel = process.env.VERCEL === '1';
const USERS_FILE = isVercel 
  ? path.join('/tmp', 'users.json')
  : path.join(process.cwd(), 'users.json');

// Vercel KV REST API configuration
const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

const defaultUsers = [
  {
    email: "admin@garda.com",
    password: "password123",
    role: "admin",
    name: "Admin GARDA",
    region: "Nasional",
    bio: "Administrator platform Garda BISINDO."
  },
  {
    email: "informan@garda.com",
    password: "password123",
    role: "informant",
    name: "Rizki Ardhana",
    region: "Jakarta Selatan",
    bio: "Saya seorang aktivis Tuli yang berdedikasi untuk mendokumentasikan kosa isyarat daerah Jakarta agar tidak terlupakan oleh sejarah perkembangan teknologi."
  }
];

let memoryDb: any[] | null = null;

export async function loadUsers(): Promise<any[]> {
  // 1. Try Vercel KV if available
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      const response = await fetch(`${KV_REST_API_URL}/get/users`, {
        headers: {
          'Authorization': `Bearer ${KV_REST_API_TOKEN}`
        },
        cache: 'no-store'
      });
      const data = await response.json();
      if (data && data.result) {
        return JSON.parse(data.result);
      } else {
        // Pre-populate Vercel KV with default users
        await saveUsers(defaultUsers);
        return defaultUsers;
      }
    } catch (e) {
      console.error("Error loading users from Vercel KV:", e);
    }
  }

  // 2. Fallback to Local Filesystem
  if (memoryDb) return memoryDb;
  
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      memoryDb = JSON.parse(data);
      return memoryDb!;
    } else {
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
      memoryDb = [...defaultUsers];
      return memoryDb;
    }
  } catch (e) {
    console.error("Error loading users from file, falling back to memory:", e);
    try {
      const localFile = path.join(process.cwd(), 'users.json');
      if (fs.existsSync(localFile)) {
        const data = fs.readFileSync(localFile, "utf-8");
        memoryDb = JSON.parse(data);
        return memoryDb!;
      }
    } catch (localError) {}
    
    memoryDb = [...defaultUsers];
    return memoryDb;
  }
}

export async function saveUsers(usersList: any[]): Promise<void> {
  memoryDb = usersList;

  // 1. Save to Vercel KV if available
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      await fetch(`${KV_REST_API_URL}/set/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KV_REST_API_TOKEN}`
        },
        body: JSON.stringify(usersList)
      });
      return;
    } catch (e) {
      console.error("Error saving users to Vercel KV:", e);
    }
  }

  // 2. Save to Local Filesystem
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersList, null, 2));
  } catch (e) {
    console.error("Error saving users to file:", e);
    try {
      const localFile = path.join(process.cwd(), 'users.json');
      fs.writeFileSync(localFile, JSON.stringify(usersList, null, 2));
    } catch (localError) {}
  }
}
