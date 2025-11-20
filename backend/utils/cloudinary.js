// dotenv modulunu idxal edirik.
// dotenv modulunun köməyi ilə .env və ya digər mühit konfiqurasiya fayllarından dəyişənləri yükləyə bilərik.
import dotenv from 'dotenv';

// path modulunu idxal edirik.
// path modulunun köməyi ilə fayl və qovluq yolları ilə əməliyyatlar aparırıq.
// Bu modul Node.js-ə daxildir və əlavə quraşdırmaya ehtiyac yoxdur.
import path from 'path'; // Node.js default olaraq gəlir

// cloudinary modulunu idxal edirik.
// Bu modul Cloudinary API ilə əlaqə qurmaq və şəkil yükləmə, silmə kimi əməliyyatları yerinə yetirmək üçün istifadə olunur.
import cloudinary from 'cloudinary';

// 'fileURLToPath' funksiyasını 'url' modulundan idxal edirik.
// Bu funksiya, ES modul sistemində (ESM) cari faylın (module) yolunu almağa imkan verir.
import { fileURLToPath } from 'url';

// __filename dəyişəni, cari modulun tam yolunu (file path) təyin edir.
// import.meta.url - ES modul sistemində cari modulun URL-ni verir.
// fileURLToPath() funksiyası isə bu URL-ni fayl yoluna çevirir.
const __filename = fileURLToPath(import.meta.url);

// __dirname dəyişəni, cari modulun yerləşdiyi qovluğun tam yolunu təyin edir.
// path.dirname() funksiyası verilmiş fayl yolundan qovluq adını çıxarır.
const __dirname = path.dirname(__filename);

// envPath dəyişəni, mühit konfiqurasiya faylının tam yolunu təyin edir.
// path.resolve() funksiyası cari qovluq (__dirname) əsasında '../config/config.env' yolunu tamamlayır.
const envPath = path.resolve(__dirname, '../config/config.env');

// dotenv.config() metodu vasitəsilə mühit dəyişənləri yüklənir.
// { path: envPath } – .env faylının yerini (bu halda, config.env faylını) təyin edir.
dotenv.config({ path: envPath });

// Cloudinary konfiqurasiyası üçün cloudinary.v2.config() metodu çağırılır.
// Burada Cloudinary hesabınızın cloud_name, api_key və api_secret dəyərləri mühit dəyişənlərindən götürülür.
// process.env: Node.js-də mühit dəyişənlərini təmsil edən obyekt.
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Cloudinary hesabınızın cloud name dəyəri
  api_key: process.env.CLOUDINARY_API_KEY,          // Cloudinary API açarı
  api_secret: process.env.CLOUDINARY_API_SECRET,    // Cloudinary API sirri (secret)
});

// Yaradılmış cloudinary konfiqurasiya obyektini default olaraq ixrac edirik.
// Bu, digər modul və fayllarda cloudinary modulunu konfiqurasiya olunmuş halda istifadə etməyə imkan verir.
export default cloudinary;
