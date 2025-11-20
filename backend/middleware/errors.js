// ErrorHandler sinifini idxal edirik. Bu sinif, xətaların standart formatda yaradılmasına kömək edir.
import ErrorHandler from "../utils/errorHandler.js";

// Aşağıdakı funksiya Express-in error handler middleware-dir.
// Bu funksiya dörd parametr qəbul edir:
//   - err: Əvvəlki middleware və ya route handler tərəfindən ötürülən xəta obyekti.
//   - req: HTTP sorğusunu təmsil edən obyekt. (body, params, query, headers və s.)
//   - res: HTTP cavab obyektidir. (status kodu təyin etmək, JSON cavab göndərmək və s.)
//   - next: Növbəti middleware-ə keçid etmək üçün istifadə olunan funksiya.
export default (err, req, res, next) => {

    // "error" adlı dəyişən yaradılır və ilkin dəyəri olaraq:
    //   - statusCode: Əgər err.statusCode mövcuddursa onu, əks halda 500 (Internal Server Error).
    //   - message: Əgər err.message mövcuddursa onu, əks halda "Internal Server Error".
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal Server Error"
    }

    // Əgər xəta obyektinin "name" xassəsi "CastError"-dirsə:
    // "CastError" adətən yanlış tipdə və ya keçərli olmayan identifikator verildikdə yaranır.
    if (err.name === "CastError") {
        // Xəta mesajı yaradılır; burada err.path dəyəri, hansı sahədə xəta baş verdiyini göstərir.
        // Object.values() burada istifadə olunur, amma əslində sadəcə mesajı string kimi istifadə etmək olar.
        const message = Object.values(`Resurs tapilmadi ${err?.path}`);
        // Yeni ErrorHandler obyekti yaradılır, status kodu 400 (Bad Request) təyin edilir.
        error = new ErrorHandler(message, 400);
    }

    // Əgər xəta obyektinin "name" xassəsi "ValidationError"-dirsə:
    // "ValidationError" Mongoose modellərində verilənlər bazasına daxil edilən məlumatların
    // validasiyadan keçmədiyi hallarda yaranır.
    if (err.name === "ValidationError") {
        // err.errors obyekti içərisində olan hər bir xətanın mesajını alırıq və array halında toplayırıq.
        const message = Object.values(err.errors).map((value) => value.message);
        // Yeni ErrorHandler obyekti yaradılır, status kodu 400 (Bad Request) təyin edilir.
        error = new ErrorHandler(message, 400);
    }

    // Ətraf mühit dəyişəninə (environment variable) əsaslanaraq, xətanın ətraflı məlumatını göndəririk.
    // Əgər NODE_ENV "DEVELOPMENT"dirsə, daha geniş məlumat (xəta obyekti, stack trace) göndərilir.
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        // res.status() metodu cavabın status kodunu təyin edir (burada error.statusCode).
        // res.json() metodu isə cavabı JSON formatında müştəriyə göndərir.
        res.status(error.statusCode).json({
            message: error.message,   // Xəta mesajı
            error: err,               // Ətraflı xəta obyekti (debug üçün)
            stack: err?.stack         // Xətanın stack trace-i (hansı xəttdən baş verdiyini göstərir)
        });
    }

    // Əgər NODE_ENV "PRODUCTION"dirsə, təhlükəsizlik məqsədi ilə sadəcə xəta mesajı göndərilir.
    if (process.env.NODE_ENV === "PRODUCTION") {
        res.status(error.statusCode).json({
            message: error.message    // Yalnız xəta mesajı göndərilir, digər detal yoxlanılır.
        });
    }
}
