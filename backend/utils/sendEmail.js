// nodemailer modulunu idxal edirik.
// nodemailer email göndərmək üçün Node.js-də geniş istifadə olunan kitabxanadır.
import nodemailer from "nodemailer"

// SMTP (Simple Mail Transfer Protocol) – email göndərmək üçün istifadə olunan standart protokoldur.
// POP3 isə email qəbul etmək üçün istifadə olunur (bu kodda istifadə olunmur, yalnız şərhdə qeyd olunur).

// sendEmail funksiyası asinxron şəkildə email göndərir.
// Bu funksiya "options" adlı obyekt qəbul edir, hansı ki, göndəriləcək emailin parametrlərini (email ünvanı, başlıq, mesaj və s.) ehtiva edir.
export const sendEmail = async (options) => {
  // nodemailer.createTransport() metodu vasitəsilə SMTP server parametrləri ilə email göndərmək üçün transport (nəqliyyat) obyektini yaradırıq.
  // Transport obyektində SMTP host, port və autentifikasiya məlumatları (email və şifrə) təyin olunur.
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,         // SMTP serverinin host ünvanı (məsələn, smtp.gmail.com)
    port: process.env.SMTP_PORT,         // SMTP serverinin port nömrəsi (adətən 587 və ya 465)
    auth: {
      user: process.env.SMTP_EMAIL,      // SMTP serverində autentifikasiya üçün istifadə olunan email ünvanı
      pass: process.env.SMTP_PASSWORD    // SMTP serverində autentifikasiya üçün istifadə olunan şifrə
    }
  });

  // "message" obyektində göndəriləcək emailin parametrləri müəyyən edilir:
  // - "from": Göndərənin email ünvanı və adı. process.env.SMTP_FROM_EMAIL və process.env.SMTP_FROM_NAME mühit dəyişənlərindən götürülür.
  // - "to": Emailin göndəriləcəyi ünvan; bu dəyər "options.email" vasitəsilə ötürülür.
  // - "subject": Emailin başlığı, "options.subject" vasitəsilə ötürülür.
  // - "html": Emailin mətni HTML formatında; "options.message" vasitəsilə ötürülür.
  const message = {
    from: `${process.env.SMTP_FROM_EMAIL} <${process.env.SMTP_FROM_NAME}>`,
    to: options.email,
    subject: options.subject,
    html: options.message
  }

  // transport.sendMail() metodu vasitəsilə email göndərilir.
  // Bu metod asinxron işləyir, ona görə də await istifadə olunur ki, email göndərmə əməliyyatı tamamlanana qədər növbəti xətt gözlənsin.
  await transport.sendMail(message)
}
