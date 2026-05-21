import fs from 'fs';
import path from 'path';

// Use /tmp in Vercel production since the root filesystem is read-only.
const isVercel = process.env.VERCEL === '1';
const USERS_FILE = isVercel 
  ? path.join('/tmp', 'users.json')
  : path.join(process.cwd(), 'users.json');

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

// In-memory fallback if file system is completely locked/unavailable
let memoryDb: any[] | null = null;

export function loadUsers() {
  if (memoryDb) return memoryDb;
  
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      memoryDb = JSON.parse(data);
      return memoryDb!;
    } else {
      // Try writing default users to initialize file
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
      memoryDb = [...defaultUsers];
      return memoryDb;
    }
  } catch (e) {
    console.error("Error loading users from file, falling back to memory:", e);
    // Try process.cwd() if /tmp didn't work for some reason
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

export function saveUsers(usersList: any[]) {
  memoryDb = usersList;
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersList, null, 2));
  } catch (e) {
    console.error("Error saving users to file:", e);
    // Try writing to process.cwd() as fallback
    try {
      const localFile = path.join(process.cwd(), 'users.json');
      fs.writeFileSync(localFile, JSON.stringify(usersList, null, 2));
    } catch (localError) {}
  }
}
