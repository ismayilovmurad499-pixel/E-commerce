// multer modulunu idxal edirik – HTTP sorğularından gələn faylların yüklənməsi üçün istifadə olunur.
import multer from "multer";

// fs modulunu idxal edirik – fayl sistemində əməliyyatlar aparmaq üçün (məsələn, qovluqların yaradılması, faylların silinməsi).
import fs from "fs"; // Filesystem moduludur

// path modulunu idxal edirik – fayl və qovluq yollarını idarə etmək üçün istifadə olunur.
import path from "path";

// ======================================================================
// 1. Upload Qovluğunun Yaradılması və Yolu
// ======================================================================

// 'uploads' adlı qovluğun tam yolunu əldə edirik.
// path.resolve() cari işçi qovluq (current working directory) əsasında tam (absolute) yol qaytarır.
const uploadDirectory = path.resolve('uploads'); // Kök qovluğunda "uploads" qovluğu üçün tam yol

// Əgər "uploads" qovluğu mövcud deyilsə, onu yaradırıq.
// fs.existsSync() – verilmiş yolun (qovluğun) mövcud olub olmadığını yoxlayır.
// fs.mkdirSync() – sinkron şəkildə yeni qovluq yaradır.
// { recursive: true } parametri, əgər valideyn qovluqlar yoxdursa onları da yaradır.
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// ======================================================================
// 2. Multer Konfiqurasiyası: Storage Yaratmaq
// ======================================================================

// Multer-in diskStorage metodunu istifadə edərək yüklənən faylların necə saxlanacağını təyin edirik.
const storage = multer.diskStorage({
  // destination funksiyası: Yüklənən faylların hansı qovluğa yazılacağını müəyyən edir.
  // Parametrlər:
  //   req: HTTP sorğusu (request) obyekti.
  //   file: Yüklənən fayl obyekti.
  //   cb: Callback funksiyası (error və destination path qaytarır).
  destination: (req, file, cb) => {
    // İlk parametr: error (null, çünki xəta yoxdur)
    // İkinci parametr: uploadDirectory – yüklənən faylların saxlanacağı qovluğun tam yolu.
    cb(null, uploadDirectory); // Fayllar "uploads" qovluğunda saxlanacaq.
  },
  // filename funksiyası: Yüklənən faylın adını necə təyin edəcəyimizi müəyyən edir.
  // Parametrlər:
  //   req: HTTP sorğusu obyekti.
  //   file: Yüklənən fayl obyekti.
  //   cb: Callback funksiyası (error və yeni fayl adı qaytarır).
  filename: (req, file, cb) => {
    // Unikal ad yaratmaq üçün: cari vaxtın millisaniyəsi və təsadüfi ədəd istifadə edilir.
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1E9);
    // path.extname() metodu faylın orijinal adından genişlənməni (məsələn, .jpg, .png) əldə edir.
    const fileExtension = path.extname(file.originalname);
    // Callback funksiyasına, xəta olmadığı üçün ilk parametr null və ikinci parametr isə unikal ad + genişlənmə verilir.
    cb(null, `${uniqueSuffix}${fileExtension}`); // Məsələn: 1618923456789_123456789.jpg
  },
});

// ======================================================================
// 3. Multer Konfiqurasiyası: Fayl Ölçüsü və Fayl Növləri Məhdudiyyəti
// ======================================================================

// multer() funksiyasını çağıraraq yükləmə konfiqurasiyasını qururuq.
const upload = multer({
  // Yuxarıda təyin edilmiş storage obyekti istifadə olunur.
  storage,
  // limits obyekti: Yüklənən faylların ölçüsünə limit qoyur.
  // fileSize: Maksimum fayl ölçüsü 5MB (5 * 1024 * 1024 bayt).
  limits: { fileSize: 5 * 1024 * 1024 },
  // fileFilter funksiyası: Yüklənən faylın növünü (mimetype) yoxlayır.
  // Parametrlər:
  //   req: HTTP sorğusu obyekti.
  //   file: Yüklənən fayl obyekti.
  //   cb: Callback funksiyası (error və boolean dəyər qaytarır: true - qəbul et, false - rədd et).
  fileFilter: (req, file, cb) => {
    // İcazə verilən MIME tipləri array-də saxlanılır.
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; // Yalnız JPEG, PNG və GIF şəkil formatlarına icazə verilir.
    // Əgər yüklənən faylın MIME tipi icazə verilənlər siyahısında varsa:
    if (allowedMimeTypes.includes(file.mimetype)) {
      // İlk parametr: error (null, çünki xəta yoxdur)
      // İkinci parametr: true (fayl qəbul edilir)
      cb(null, true);
    } else {
      // Əks halda, fayl qəbul edilmir.
      // İlk parametr: yeni Error obyektini yaradaraq göndəririk.
      // İkinci parametr: false (fayl rədd edilir)
      cb(new Error('Yalnız şəkil formatları yükləyə bilərsiniz!'), false);
    }
  }
})
// .array('newImages'): Bu metod bir name atributu olan (burada 'newImages') çoxsaylı faylları qəbul etmək üçün istifadə olunur.
// Yəni, form vasitəsilə çoxsaylı şəkillər yüklənə bilər.
.array('newImages');

// ======================================================================
// 4. Konfiqurasiya olunmuş multer obyektini ixrac edirik
// ======================================================================

// İxrac edərək, bu uploadImages middleware-i digər fayllarda istifadə etmək mümkün olacaq.
export const uploadImages = upload;
