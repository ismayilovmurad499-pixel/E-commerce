// Bu funksiya "controllerFunction" adlı kontroller funksiyasını qəbul edir və onu 
// asinxron funksiya kimi icra edərək, yaranan xətaları avtomatik tutmaq üçün .catch(next) ilə sarır.
// Beləliklə, hər hansı xətanın yaranması halında, error avtomatik olaraq Express-in error handler-ə ötürülür.
export default (controllerFunction) => 
    // Bu qaytarılan funksiya Express middleware kimi işləyir və üç parametr qəbul edir: req, res və next.
    (req, res, next) =>
      // "Promise.resolve" metodu ilə controllerFunction() çağırılır və onun nəticəsi Promise-ə çevrilir.
      // Bu, controllerFunction asinxron (Promise qaytaran) olsa da, sinxron olsa da işləyəcək.
      Promise.resolve(controllerFunction(req, res, next))
        // Əgər controllerFunction icrası zamanı hər hansı xəta baş verərsə, .catch(next) vasitəsilə həmin xəta "next" funksiyasına ötürülür.
        // "next" Express-in error handling sisteminə xətanı göndərmək üçün istifadə olunur.
        .catch(next);
  