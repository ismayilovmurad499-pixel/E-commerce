import mongoose from "mongoose"; // Mongoose kitabxanasını daxil edirik (MongoDB ilə işləmək üçün)

// Verilənlər bazasına qoşulmaq üçün funksiya
export const connectDatabase = () => {
    // Verilənlər bazası ünvanını (URI) saxlayacaq dəyişən
    let DB_URI = "";

    // Əgər tətbiq inkişaf (development) rejimindədirsə,
    // .env faylında təyin olunmuş LOCAL_URI dəyərini DB_URI-yə mənimsəyirik
    if (process.env.NODE_ENV === "DEVELOPMENT") DB_URI = process.env.LOCAL_URI;

    // Əgər tətbiq istehsal (production) rejimindədirsə,
    // .env faylında təyin olunmuş DB_URI dəyərini DB_URI-yə mənimsəyirik
    if (process.env.NODE_ENV === "PRODUCTION") DB_URI = process.env.DB_URI;

    // Mongoose vasitəsilə DB_URI ilə verilənlər bazasına qoşuluruq
    mongoose.connect(DB_URI)
        .then((con) => {
            // Əgər qoşulma uğurlu olarsa, bu blok icra olunur.
            // Burada qoşulma ilə bağlı əlavə əməliyyatlar həyata keçirilə bilər.
        })
        .catch((err) => {
            // Əgər qoşulma zamanı xəta baş verərsə, bu blok işə düşür.
            console.error("Verilənlər bazasına qoşularkən xəta baş verdi:", err);
        });
}
