export async function sendReservationEmail({
  to,
  customerName,
  restaurantName,
  date,
  time,
  partySize,
  code,
}: {
  to: string;
  customerName: string;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
  code: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY bulunamadı, e-posta gönderimi atlanıyor.");
    return { success: false, error: "API key missing" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // Resend Sandbox modunda sadece onboarding@resend.dev adresinden gönderebilirsiniz.
        // Domain doğrulaması yaptıktan sonra burayı "Restoran Rezervasyon <noreply@siteniz.com>" şeklinde değiştirebilirsiniz.
        from: "Restoran Rezervasyon <onboarding@resend.dev>",
        to: [to],
        subject: `Rezervasyon Onayı: ${restaurantName}`,
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0b0b0c; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; color: #ffffff;">
            <!-- Logo / Başlık Alanı -->
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="font-size: 24px; font-weight: 900; letter-spacing: 0.1em; color: #ffffff; text-transform: uppercase;">RESTORAN</span>
              <div style="width: 50px; height: 2px; background: #ef4444; margin: 10px auto;"></div>
            </div>

            <!-- Karşılama Mesajı -->
            <h2 style="font-size: 20px; font-weight: 800; color: #ef4444; text-align: center; margin-top: 0; text-transform: uppercase; letter-spacing: 0.05em;">Rezervasyonunuz Onaylandı!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; text-align: center;">
              Merhaba <strong>${customerName}</strong>, <strong>${restaurantName}</strong> restoranındaki rezervasyon talebiniz onaylanmış ve sistemimize kaydedilmiştir.
            </p>

            <!-- Rezervasyon Detay Kartı -->
            <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; margin: 25px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Rezervasyon Kodu</td>
                  <td style="padding: 10px 0; font-size: 16px; font-weight: 900; color: #ef4444; text-align: right; font-family: monospace;">${code}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Restoran</td>
                  <td style="padding: 10px 0; font-size: 14px; font-weight: 700; color: #ffffff; text-align: right;">${restaurantName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Tarih</td>
                  <td style="padding: 10px 0; font-size: 14px; font-weight: 700; color: #ffffff; text-align: right;">${date}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Saat</td>
                  <td style="padding: 10px 0; font-size: 14px; font-weight: 700; color: #ffffff; text-align: right;">${time}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">Kişi Sayısı</td>
                  <td style="padding: 10px 0; font-size: 14px; font-weight: 700; color: #ffffff; text-align: right;">${partySize} Kişi</td>
                </tr>
              </table>
            </div>

            <!-- Bilgilendirme Notu -->
            <p style="font-size: 11px; line-height: 1.6; color: #52525b; text-align: center; margin-bottom: 0;">
              Lütfen rezervasyon saatinde restoranda hazır bulunuz. Rezervasyon bilgilerinizi kullanıcı panelinizden dilediğiniz an inceleyebilir veya yönetebilirsiniz.
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("Resend API Hatası:", errData);
      return { success: false, error: errData };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error("E-posta gönderimi sırasında beklenmedik hata:", error);
    return { success: false, error: error.message };
  }
}
