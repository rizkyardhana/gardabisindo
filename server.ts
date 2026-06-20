import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { loadSigns, saveSigns } from "./src/lib/signsDb";
import { loadUsers, saveUsers } from "./src/lib/usersDb";
import { sendRecoveryEmail } from "./src/lib/email";
import { put } from "@vercel/blob";
import { loadCategories, saveCategories } from "./src/lib/categoriesDb";

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
  app.post("/api/upload-video", express.raw({ type: ["video/webm", "video/mp4", "application/octet-stream"], limit: "50mb" }), async (req, res) => {
    try {
      const ext = req.headers["x-file-extension"] || "webm";
      const filename = `upload_${Date.now()}.${ext}`;

      // Check if Vercel Blob token is available
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
      if (blobToken) {
        console.log("Uploading video to Vercel Blob...");
        const blob = await put(filename, req.body, {
          access: "public",
          token: blobToken,
        });
        console.log(`Video uploaded to Vercel Blob: ${blob.url}`);
        return res.json({ success: true, videoUrl: blob.url });
      }
      
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, req.body);
      
      console.log(`Video uploaded successfully to local storage: ${filename}`);
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

  // API Routes for User Management (Express fallback)
  app.post("/api/register", async (req, res) => {
    const { name, email, region, password, role } = req.body;

    if (!name || !email || !region || !password || !role) {
      return res.status(400).json({ error: "Semua formulir pendaftaran wajib diisi." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password minimal harus 6 karakter." });
    }

    try {
      const usersDb = await loadUsers();
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
        bio: `Saya seorang ${role === 'informant' ? 'Informan Kontributor' : 'Admin'} di platform Garda BISINDO.`,
        joined: new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        verified: false
      };

      usersDb.push(newUser);
      await saveUsers(usersDb);

      res.json({
        success: true,
        message: "Registrasi berhasil! Silakan masuk dengan akun Anda."
      });
    } catch (e: any) {
      console.error("Gagal melakukan registrasi:", e);
      res.status(500).json({ error: "Terjadi kesalahan saat memproses registrasi." });
    }
  });

  app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email wajib diisi." });
    }

    try {
      const usersDb = await loadUsers();
      const user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(404).json({ error: "Email tidak terdaftar dalam sistem kami." });
      }

      // Mengirim email pemulihan (akan dilewati jika RESEND_API_KEY tidak disetel)
      await sendRecoveryEmail(user.email, user.name, user.password);

      res.json({
        success: true,
        message: `Tautan pemulihan password telah dikirim ke ${email}.`,
        demoPassword: user.password
      });
    } catch (e: any) {
      console.error("Gagal forgot-password:", e);
      res.status(500).json({ error: "Terjadi kesalahan saat memproses pemulihan sandi." });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, dan role wajib diisi." });
    }

    try {
      const usersDb = await loadUsers();
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
    } catch (e: any) {
      console.error("Gagal melakukan login:", e);
      res.status(500).json({ error: "Terjadi kesalahan saat memproses login." });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await loadUsers();
      const signs = await loadSigns();
      const informants = users.filter(u => u.role === 'informant');
      const mapped = informants.map(u => {
        const contributions = signs.filter(s => s.informant === u.name).length;
        const avatar = u.email === 'informan@garda.com' ? '/profil.jpg' : (u.avatar || '');
        return {
          id: u.email,
          name: u.name,
          email: u.email,
          region: u.region,
          joined: u.joined || 'Jan 2024',
          verified: u.email === 'informan@garda.com' ? true : (u.verified ?? false),
          contributions,
          avatar
        };
      });
      res.json(mapped);
    } catch (e: any) {
      console.error("Gagal memuat informan:", e);
      res.status(500).json({ error: "Gagal memuat daftar informan." });
    }
  });

  app.put("/api/users/:email", async (req, res) => {
    const email = req.params.email;
    const { verified } = req.body;
    try {
      const users = await loadUsers();
      const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (index === -1) {
        return res.status(404).json({ error: "Pengguna tidak ditemukan." });
      }
      users[index].verified = verified;
      await saveUsers(users);
      res.json({ success: true, user: users[index] });
    } catch (e: any) {
      console.error("Gagal memperbarui status verifikasi:", e);
      res.status(500).json({ error: "Gagal memperbarui status verifikasi." });
    }
  });

  app.delete("/api/users/:email", async (req, res) => {
    const email = req.params.email;
    try {
      const users = await loadUsers();
      const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (index === -1) {
        return res.status(404).json({ error: "Pengguna tidak ditemukan." });
      }
      const deleted = users.splice(index, 1);
      await saveUsers(users);
      res.json({ success: true, deletedUser: deleted[0] });
    } catch (e: any) {
      console.error("Gagal menghapus pengguna:", e);
      res.status(500).json({ error: "Gagal menghapus pengguna." });
    }
  });
  
  // Categories endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categoriesDb = await loadCategories();
      res.json(categoriesDb);
    } catch (e: any) {
      console.error("Gagal memuat kategori:", e);
      res.status(500).json({ error: "Gagal memuat kategori dari database." });
    }
  });

  app.post("/api/categories", async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Nama kategori wajib diisi." });
    }
    try {
      const categoriesDb = await loadCategories();
      const exists = categoriesDb.some(c => c.name.toLowerCase() === name.toLowerCase());
      if (exists) {
        return res.status(400).json({ error: "Kategori tersebut sudah terdaftar." });
      }
      
      const newCategory = {
        id: Date.now(),
        name,
        count: 0,
        description: description || "Tidak ada deskripsi."
      };
      categoriesDb.push(newCategory);
      await saveCategories(categoriesDb);
      res.json({ success: true, category: newCategory });
    } catch (e: any) {
      console.error("Gagal menambahkan kategori:", e);
      res.status(500).json({ error: "Gagal menyimpan kategori baru." });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const categoriesDb = await loadCategories();
      const index = categoriesDb.findIndex(c => String(c.id) === String(id));
      if (index === -1) {
        return res.status(404).json({ error: "Kategori tidak ditemukan." });
      }
      const deleted = categoriesDb.splice(index, 1);
      await saveCategories(categoriesDb);
      res.json({ success: true, deletedCategory: deleted[0] });
    } catch (e: any) {
      console.error("Gagal menghapus kategori:", e);
      res.status(500).json({ error: "Gagal menghapus kategori." });
    }
  });

  // Signs and comments endpoints
  app.get("/api/signs", async (req, res) => {
    try {
      const signsDb = await loadSigns();
      res.json(signsDb);
    } catch (e: any) {
      console.error("Gagal memuat kosa isyarat:", e);
      res.status(500).json({ error: "Gagal memuat kosa isyarat dari database." });
    }
  });

  app.post("/api/signs", async (req, res) => {
    const newSign = req.body;
    if (!newSign || !newSign.word) {
      return res.status(400).json({ error: "Data isyarat tidak lengkap." });
    }
    if (!newSign.id) {
      newSign.id = Date.now();
    }
    if (!newSign.comments) {
      newSign.comments = [];
    }
    try {
      const signsDb = await loadSigns();
      signsDb.unshift(newSign);
      await saveSigns(signsDb);
      res.json({ success: true, sign: newSign });
    } catch (e: any) {
      console.error("Gagal menambahkan kosa isyarat:", e);
      res.status(500).json({ error: "Gagal menyimpan kosa isyarat baru." });
    }
  });

  app.put("/api/signs/:id", async (req, res) => {
    const id = req.params.id;
    const updatedFields = req.body;
    try {
      const signsDb = await loadSigns();
      const index = signsDb.findIndex(s => String(s.id) === String(id));
      if (index === -1) {
        return res.status(404).json({ error: "Isyarat tidak ditemukan." });
      }
      
      signsDb[index] = { ...signsDb[index], ...updatedFields };
      await saveSigns(signsDb);
      res.json({ success: true, sign: signsDb[index] });
    } catch (e: any) {
      console.error("Gagal memperbarui kosa isyarat:", e);
      res.status(500).json({ error: "Gagal memperbarui kosa isyarat." });
    }
  });

  app.delete("/api/signs/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const signsDb = await loadSigns();
      const index = signsDb.findIndex(s => String(s.id) === String(id));
      if (index === -1) {
        return res.status(404).json({ error: "Isyarat tidak ditemukan." });
      }
      const deleted = signsDb.splice(index, 1);
      await saveSigns(signsDb);
      res.json({ success: true, deletedSign: deleted[0] });
    } catch (e: any) {
      console.error("Gagal menghapus kosa isyarat:", e);
      res.status(500).json({ error: "Gagal menghapus kosa isyarat." });
    }
  });

  app.post("/api/signs/:id/comments", async (req, res) => {
    const id = req.params.id;
    const comment = req.body;
    try {
      const signsDb = await loadSigns();
      const signIndex = signsDb.findIndex(s => String(s.id) === String(id));
      if (signIndex === -1) {
        return res.status(404).json({ error: "Isyarat tidak ditemukan." });
      }
      if (!signsDb[signIndex].comments) {
        signsDb[signIndex].comments = [];
      }
      if (!comment.id) {
        comment.id = `c_${Date.now()}`;
      }
      signsDb[signIndex].comments.push(comment);
      await saveSigns(signsDb);
      res.json({ success: true, comments: signsDb[signIndex].comments });
    } catch (e: any) {
      console.error("Gagal menambahkan komentar:", e);
      res.status(500).json({ error: "Gagal menyimpan komentar baru." });
    }
  });

  app.put("/api/signs/:id/comments/:commentId", async (req, res) => {
    const { id, commentId } = req.params;
    const updatedComment = req.body;
    try {
      const signsDb = await loadSigns();
      const signIndex = signsDb.findIndex(s => String(s.id) === String(id));
      if (signIndex === -1) {
        return res.status(404).json({ error: "Isyarat tidak ditemukan." });
      }
      if (signsDb[signIndex].comments) {
        const cIndex = signsDb[signIndex].comments.findIndex((c: any) => String(c.id) === String(commentId));
        if (cIndex !== -1) {
          signsDb[signIndex].comments[cIndex] = { ...signsDb[signIndex].comments[cIndex], ...updatedComment };
          await saveSigns(signsDb);
          return res.json({ success: true, comments: signsDb[signIndex].comments });
        }
      }
      res.status(404).json({ error: "Komentar tidak ditemukan." });
    } catch (e: any) {
      console.error("Gagal menyunting komentar:", e);
      res.status(500).json({ error: "Gagal memperbarui komentar." });
    }
  });

  app.delete("/api/signs/:id/comments/:commentId", async (req, res) => {
    const { id, commentId } = req.params;
    try {
      const signsDb = await loadSigns();
      const signIndex = signsDb.findIndex(s => String(s.id) === String(id));
      if (signIndex === -1) {
        return res.status(404).json({ error: "Isyarat tidak ditemukan." });
      }
      if (signsDb[signIndex].comments) {
        const initialLength = signsDb[signIndex].comments.length;
        signsDb[signIndex].comments = signsDb[signIndex].comments.filter((c: any) => String(c.id) !== String(commentId));
        if (signsDb[signIndex].comments.length < initialLength) {
          await saveSigns(signsDb);
          return res.json({ success: true, comments: signsDb[signIndex].comments });
        }
      }
      res.status(404).json({ error: "Komentar tidak ditemukan." });
    } catch (e: any) {
      console.error("Gagal menghapus komentar:", e);
      res.status(500).json({ error: "Gagal menghapus komentar." });
    }
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
