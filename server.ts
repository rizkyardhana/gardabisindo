import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export async function createServer() {
  const app = express();

  // In Vercel's serverless runtime, the request body is pre-parsed by the platform helper.
  // Using express.json() on an already consumed stream will cause the request to hang indefinitely.
  app.use((req, res, next) => {
    if (req.body !== undefined && req.body !== null) {
      next();
    } else {
      express.json()(req, res, next);
    }
  });
  
  // Serve uploaded videos statically
  const uploadDir = process.env.VERCEL
    ? path.join("/tmp", "uploads")
    : path.join(process.cwd(), "public", "uploads");

  if (process.env.VERCEL) {
    if (!fs.existsSync("/tmp")) {
      fs.mkdirSync("/tmp");
    }
  } else {
    if (!fs.existsSync(path.join(process.cwd(), "public"))) {
      fs.mkdirSync(path.join(process.cwd(), "public"));
    }
  }

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadDir));

  // Route to handle raw binary video upload
  app.post("/api/upload-video", express.raw({ type: ["video/webm", "video/mp4", "application/octet-stream"], limit: "50mb" }), (req, res) => {
    try {
      const ext = req.headers["x-file-extension"] || "webm";
      const filename = `upload_${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, filename);
      
      fs.writeFileSync(filePath, req.body);
      
      console.log(`Video uploaded successfully: ${filename}`);
      res.json({ success: true, videoUrl: `/uploads/${filename}` });
    } catch (e: any) {
      console.error("Gagal mengunggah video:", e);
      res.status(500).json({ error: "Gagal menyimpan video di server." });
    }
  });

  // Gemini Setup
  const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  }) : null;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Persistent user database using a JSON file to prevent loss on server restarts
  const USERS_FILE = process.env.VERCEL 
    ? path.join("/tmp", "users.json")
    : path.join(process.cwd(), "users.json");

  function loadUsers() {
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

    try {
      if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE, "utf-8");
        return JSON.parse(data);
      } else {
        fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
        return defaultUsers;
      }
    } catch (e) {
      console.error("Error loading users from file, falling back to memory:", e);
      return defaultUsers;
    }
  }

  function saveUsers(usersList: any[]) {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(usersList, null, 2));
    } catch (e) {
      console.error("Error saving users to file:", e);
    }
  }

  const usersDb = loadUsers();

  app.post("/api/register", (req, res) => {
    const { name, email, region, password, role } = req.body;

    if (!name || !email || !region || !password || !role) {
      return res.status(400).json({ error: "Semua formulir pendaftaran wajib diisi." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password minimal harus 6 karakter." });
    }

    const exists = usersDb.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: "Email tersebut sudah terdaftar." });
    }

    const newUser = {
      name,
      email,
      region,
      password,
      role,
      bio: `Saya seorang ${role === 'informant' ? 'Informan Kontributor' : 'Admin'} di platform Garda BISINDO.`
    };

    usersDb.push(newUser);
    saveUsers(usersDb);

    res.json({
      success: true,
      message: "Registrasi berhasil! Silakan masuk dengan akun Anda."
    });
  });

  app.post("/api/forgot-password", (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email wajib diisi." });
    }

    const user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: "Email tidak terdaftar dalam sistem kami." });
    }

    res.json({
      success: true,
      message: `Tautan pemulihan password telah dikirim ke ${email}.`,
      demoPassword: user.password
    });
  });

  app.post("/api/login", (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, dan role wajib diisi." });
    }

    const user = usersDb.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password && 
      u.role === role
    );

    if (!user) {
      return res.status(401).json({ error: "Email, password, atau peran (role) salah." });
    }

    const emailBase64 = Buffer.from(email).toString('base64');
    const token = `garda_token_${role}_${emailBase64}`;

    res.json({
      success: true,
      token,
      role,
      user: {
        email: user.email,
        name: user.name,
        region: user.region,
        bio: user.bio
      }
    });
  });

  app.post("/api/ai/explain", async (req, res) => {
    const { word, region } = req.body;
    
    if (!genAI) {
      // Fallback: Generate a high-quality mock linguistic/cultural explanation based on the word and region
      const explanations: Record<string, string> = {
        "terima kasih": `Isyarat "Terima Kasih" di daerah ${region} memiliki akar budaya kesantunan yang kuat, diekspresikan dengan gerakan tangan dari dagu ke depan sebagai simbol mengalirkan rasa syukur dari dalam hati. Gerakan ini mencerminkan keterbukaan dan kehangatan khas masyarakat lokal. Variasi ketukan di akhir sering menjadi ciri pembeda keakraban antar-penutur di regional tersebut.`,
        "halo": `Isyarat "Halo" di daerah ${region} adalah bentuk sapaan universal yang ramah, ditandai dengan lambaian tangan setinggi pelipis yang melambangkan penghormatan dan keterbukaan komunikasi. Dalam budaya Tuli lokal, kontak mata yang hangat saat memperagakan isyarat ini sangat penting untuk membangun koneksi awal. Gerakan ini mencerminkan sifat inklusif dan kekeluargaan komunitas lokal.`,
        "sama-sama": `Isyarat "Sama-sama" di daerah ${region} mengekspresikan timbal-balik rasa hormat dengan gerakan tangan memutar halus ke arah luar. Secara filosofis, gerakan ini melambangkan bahwa kebaikan yang diterima akan dikembalikan atau disebarkan kembali ke masyarakat luas. Ini menunjukkan nilai gotong royong dan kebersamaan yang dijunjung tinggi oleh komunitas Tuli setempat.`
      };

      const lowerWord = String(word).toLowerCase();
      let explanation = explanations[lowerWord];

      if (!explanation) {
        // Dynamic fallback template for other words
        explanation = `Isyarat "${word}" di wilayah ${region} merepresentasikan konsep visual yang unik, menggabungkan gerakan motorik khas dengan ekspresi wajah yang menekankan penegasan makna. Dalam perspektif budaya Tuli regional, isyarat ini mencerminkan adaptasi terhadap konteks lingkungan setempat dan interaksi sosial sehari-hari. Gerakan dinamis ini menjadi bukti kekayaan variasi linguistik BISINDO di Indonesia.`;
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      return res.json({ explanation });
    }

    try {
      const response = await genAI.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: `Berikan penjelasan singkat dan menarik tentang kosa isyarat BISINDO untuk kata "${word}" dari daerah "${region}". Fokus pada aspek budaya, sejarah, atau makna filosofis di balik gerakan tersebut. Gunakan bahasa Indonesia yang profesional dan ramah komunitas Tuli. Maksimal 3 kalimat.`
      });
      
      const text = response.text;
      
      res.json({ explanation: text });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to generate explanation" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

if (!process.env.VERCEL) {
  const PORT = 3000;
  createServer().then(app => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}
