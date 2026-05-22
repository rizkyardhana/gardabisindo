import fs from 'fs';
import path from 'path';

// Use /tmp in Vercel production since the root filesystem is read-only.
const isVercel = process.env.VERCEL === '1';
const SIGNS_FILE = isVercel 
  ? path.join('/tmp', 'signs.json')
  : path.join(process.cwd(), 'signs.json');

// Vercel KV REST API configuration
const KV_REST_API_URL = process.env.KV_REST_API_URL || 
                        process.env.UPSTASH_REDIS_REST_URL || 
                        process.env.PENYIMPANAN_REST_API_URL || 
                        process.env.PENYIMPANAN_URL;

const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || 
                          process.env.UPSTASH_REDIS_REST_TOKEN || 
                          process.env.PENYIMPANAN_REST_API_TOKEN || 
                          process.env.PENYIMPANAN_TOKEN;

const defaultSigns = [
  { 
    id: 1, 
    word: 'Terima Kasih', 
    category: 'Harian', 
    region: 'Jakarta', 
    status: 'Approved', 
    informant: 'Rizki Ardhana', 
    date: '2024-01-10',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/bisindo_gesture_placeholder.png',
    description: 'Gerakan telapak tangan kanan menempel di dagu lalu diayunkan ke depan sebagai simbol penghormatan dan terima kasih.',
    likes: 124,
    bookmarks: 45
  },
  { 
    id: 2, 
    word: 'Rumah', 
    category: 'Harian', 
    region: 'Yogyakarta', 
    status: 'Approved', 
    informant: 'Ahmad Hadi', 
    date: '2024-01-12',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/bisindo_gesture_placeholder.png',
    description: 'Ujung-ujung jari kedua tangan dipertemukan di atas kepala membentuk sudut segitiga menyerupai atap rumah.',
    likes: 89,
    bookmarks: 23
  },
  { 
    id: 3, 
    word: 'Makan', 
    category: 'Harian', 
    region: 'Bali', 
    status: 'Approved', 
    informant: 'Ni Wayan', 
    date: '2024-01-15',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/bisindo_gesture_placeholder.png',
    description: 'Jari-jari tangan dominan dikuncupkan lalu diarahkan ke depan mulut berulang-ulang seperti menyuap makanan.',
    likes: 210,
    bookmarks: 78
  },
  { 
    id: 4, 
    word: 'Belajar', 
    category: 'Pendidikan', 
    region: 'Nasional', 
    status: 'Approved', 
    informant: 'Budi Santoso', 
    date: '2024-01-20',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/bisindo_gesture_placeholder.png',
    description: 'Kedua telapak tangan menghadap ke atas dan digerakkan seperti membaca buku.',
    likes: 340,
    bookmarks: 120
  },
  { 
    id: 5, 
    word: 'Telepon', 
    category: 'Teknologi', 
    region: 'Nasional', 
    status: 'Approved', 
    informant: 'Siti Aminah', 
    date: '2024-01-22',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/bisindo_gesture_placeholder.png',
    description: 'Ibu jari dan kelingking menempel di telinga dan mulut melambangkan gagang telepon.',
    likes: 156,
    bookmarks: 32
  },
  { 
    id: 6, 
    word: 'Dokter', 
    category: 'Medis', 
    region: 'Sumatera Barat', 
    status: 'Approved', 
    informant: 'Dewi Lestari', 
    date: '2024-01-25',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/bisindo_gesture_placeholder.png',
    description: 'Tangan menempel di pergelangan tangan seolah mengecek denyut nadi.',
    likes: 198,
    bookmarks: 56
  },
  { 
    id: 7, 
    word: 'Sinyal', 
    category: 'Teknologi', 
    region: 'Papua', 
    status: 'Pending', 
    informant: 'Elias W.', 
    date: '2024-01-20',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/bisindo_gesture_placeholder.png',
    description: 'Isyarat sinyal digerakkan dengan mengangkat tangan dominan ke atas dan menggerakkan jari manis serta kelingking berulang seperti gelombang.',
    likes: 0,
    bookmarks: 0
  },
  { 
    id: 8, 
    word: 'Laptop', 
    category: 'Teknologi', 
    region: 'Nasional', 
    status: 'Approved', 
    informant: 'Rizki Ardhana', 
    date: '2024-01-22',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/bisindo_gesture_placeholder.png',
    description: 'Isyarat laptop digambarkan dengan menangkupkan kedua telapak tangan sejajar dada lalu membukanya ke atas menyerupai membuka layar laptop.',
    likes: 0,
    bookmarks: 0
  },
  { 
    id: 9, 
    word: 'Aplikasi', 
    category: 'Teknologi', 
    region: 'Jakarta', 
    status: 'Rejected', 
    informant: 'Rani K.', 
    date: '2024-01-24',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/bisindo_gesture_placeholder.png',
    description: 'Isyarat aplikasi digambarkan dengan tangan dominan membentuk huruf A dan ditempelkan di telapak tangan kiri yang terbuka datar.',
    likes: 0,
    bookmarks: 0
  }
];

let memoryDb: any[] | null = null;

export async function loadSigns(): Promise<any[]> {
  // 1. Try Vercel KV if available
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      const response = await fetch(`${KV_REST_API_URL}/get/signs`, {
        headers: {
          'Authorization': `Bearer ${KV_REST_API_TOKEN}`
        },
        cache: 'no-store'
      });
      const data = await response.json();
      if (data && data.result) {
        return JSON.parse(data.result);
      } else {
        // Pre-populate Vercel KV with hydrated default signs
        const hydratedSigns = defaultSigns.map(s => ({
          ...s,
          comments: [
            {
              id: `c1_${s.id}`,
              userName: 'Ahmad Hadi',
              avatarUrl: '',
              text: `Isyarat "${s.word}" di wilayah kami agak sedikit berbeda di bagian ketukan tangannya. Senang melihat variasi daerah ini terdokumentasi!`,
              createdAt: '1 hari yang lalu'
            },
            {
              id: `c2_${s.id}`,
              userName: 'Tim Ahli PUSBISINDO',
              avatarUrl: '/profil.jpg',
              text: 'Akurasi gerakan ini sudah sesuai dengan standar regional dan linguistik BISINDO. Bagus sekali kontribusinya!',
              createdAt: 'Baru saja'
            }
          ]
        }));
        await saveSigns(hydratedSigns);
        return hydratedSigns;
      }
    } catch (e) {
      console.error("Error loading signs from Vercel KV:", e);
    }
  }

  // 2. Fallback to Local Filesystem
  if (memoryDb) return memoryDb;
  
  try {
    if (fs.existsSync(SIGNS_FILE)) {
      const data = fs.readFileSync(SIGNS_FILE, "utf-8");
      memoryDb = JSON.parse(data);
      return memoryDb!;
    } else {
      const hydratedSigns = defaultSigns.map(s => ({
        ...s,
        comments: [
          {
            id: `c1_${s.id}`,
            userName: 'Ahmad Hadi',
            avatarUrl: '',
            text: `Isyarat "${s.word}" di wilayah kami agak sedikit berbeda di bagian ketukan tangannya. Senang melihat variasi daerah ini terdokumentasi!`,
            createdAt: '1 hari yang lalu'
          },
          {
            id: `c2_${s.id}`,
            userName: 'Tim Ahli PUSBISINDO',
            avatarUrl: '/profil.jpg',
            text: 'Akurasi gerakan ini sudah sesuai dengan standar regional dan linguistik BISINDO. Bagus sekali kontribusinya!',
            createdAt: 'Baru saja'
          }
        ]
      }));
      fs.writeFileSync(SIGNS_FILE, JSON.stringify(hydratedSigns, null, 2));
      memoryDb = hydratedSigns;
      return memoryDb;
    }
  } catch (e) {
    console.error("Error loading signs from file, falling back to memory:", e);
    try {
      const localFile = path.join(process.cwd(), 'signs.json');
      if (fs.existsSync(localFile)) {
        const data = fs.readFileSync(localFile, "utf-8");
        memoryDb = JSON.parse(data);
        return memoryDb!;
      }
    } catch (localError) {}
    
    const hydratedSigns = defaultSigns.map(s => ({
      ...s,
      comments: [
        {
          id: `c1_${s.id}`,
          userName: 'Ahmad Hadi',
          avatarUrl: '',
          text: `Isyarat "${s.word}" di wilayah kami agak sedikit berbeda di bagian ketukan tangannya. Senang melihat variasi daerah ini terdokumentasi!`,
          createdAt: '1 hari yang lalu'
        },
        {
          id: `c2_${s.id}`,
          userName: 'Tim Ahli PUSBISINDO',
          avatarUrl: '/profil.jpg',
          text: 'Akurasi gerakan ini sudah sesuai dengan standar regional dan linguistik BISINDO. Bagus sekali kontribusinya!',
          createdAt: 'Baru saja'
        }
      ]
    }));
    memoryDb = hydratedSigns;
    return memoryDb;
  }
}

export async function saveSigns(signsList: any[]): Promise<void> {
  memoryDb = signsList;

  // 1. Save to Vercel KV if available
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      await fetch(`${KV_REST_API_URL}/set/signs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KV_REST_API_TOKEN}`
        },
        body: JSON.stringify(signsList)
      });
      return;
    } catch (e) {
      console.error("Error saving signs to Vercel KV:", e);
    }
  }

  // 2. Save to Local Filesystem
  try {
    fs.writeFileSync(SIGNS_FILE, JSON.stringify(signsList, null, 2));
  } catch (e) {
    console.error("Error saving signs to file:", e);
    try {
      const localFile = path.join(process.cwd(), 'signs.json');
      fs.writeFileSync(localFile, JSON.stringify(signsList, null, 2));
    } catch (localError) {}
  }
}
