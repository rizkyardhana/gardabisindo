export async function sendRecoveryEmail(toEmail: string, userName: string, passwordText: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY tidak disetel. Pengiriman email asli dilewati.");
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Garda Bisindo <onboarding@resend.dev>',
        to: [toEmail],
        subject: 'Pemulihan Password Akun Garda BISINDO',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #4f46e5; margin: 0;">Garda BISINDO</h2>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">Platform Pendokumentasian Kosa Isyarat Daerah</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p>Halo <strong>${userName}</strong>,</p>
            <p>Kami menerima permintaan untuk memulihkan kata sandi akun Garda BISINDO Anda. Berikut adalah detail informasi masuk Anda:</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4f46e5;">
              <p style="margin: 0; font-size: 15px; color: #374151;"><strong>Email:</strong> ${toEmail}</p>
              <p style="margin: 5px 0 0 0; font-size: 15px; color: #374151;"><strong>Kata Sandi:</strong> <code style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 16px;">${passwordText}</code></p>
            </div>
            <p>Silakan masuk kembali ke aplikasi menggunakan kata sandi tersebut. Demi keamanan akun Anda, kami sangat menyarankan untuk segera mengubah kata sandi setelah Anda masuk di menu pengaturan profil Anda.</p>
            <p style="color: #ef4444; font-size: 13px;">*Jika Anda tidak merasa mengajukan permintaan ini, silakan abaikan email ini.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="font-size: 14px; color: #9ca3af; margin: 0;">Salam hangat,</p>
            <p style="font-size: 14px; color: #4f46e5; font-weight: bold; margin: 5px 0 0 0;">Tim Garda BISINDO</p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gagal mengirim email lewat Resend:", errorData);
      return false;
    }

    console.log(`Email pemulihan sukses dikirim ke ${toEmail}`);
    return true;
  } catch (e) {
    console.error("Error mengirim email pemulihan:", e);
    return false;
  }
}
