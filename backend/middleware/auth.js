// catchAsyncErrors: Asinxron funksiyalarda yaranan xətaları avtomatik tutmaq üçün istifadə olunan middleware-dir.
// Bu, hər bir asinxron funksiyada try/catch bloklarını yazmağa ehtiyac qalmadan, xətaları növbəti error handler-ə ötürür.
import catchAsyncErrors from "./catchAsyncErrors.js";

// ErrorHandler: Xətaları standart formatda yaratmaq və onlara müvafiq status kodları təyin etmək üçün istifadə olunan sinifdir.
import ErrorHandler from "../utils/errorHandler.js";

// jwt (jsonwebtoken) kitabxanası: JSON Web Token-lərin yaradılması, imzalanması və yoxlanması üçün istifadə olunur.
import jwt from "jsonwebtoken";

// User modeli: MongoDB-də istifadəçi məlumatlarını idarə etmək üçün istifadə olunan model.
import User from "../model/User.js";

// "Callstack Heap Stack" kimi şərhlər yaddaş strukturları ilə bağlı anlayışlardır, amma bu kodda birbaşa istifadə olunmur.
 
// ======================================================================
// İstifadəçinin doğrulanması (Authentication) üçün middleware: isAuthenticatedUser
// ======================================================================
// Bu middleware, istifadəçinin cookie-lərində saxlanılan token-i yoxlayır və əgər token düzgündürsə,
// istifadəçinin məlumatlarını (məsələn, ID) əldə edib req.user obyektinə əlavə edir. Əks halda, xətanı error handler-ə ötürür.
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    // req.cookies: Müştərinin brauzerindən göndərilən cookie-ləri ehtiva edir.
    // Optional chaining (?.) operatoru vasitəsilə, əgər cookies və ya token mövcud deyilsə, undefined alınır.
    const token = req?.cookies?.token;
   
    try {
        // jwt.verify() metodu token-i yoxlayır:
        // - Token "header", "payload" və "signature" hissələrindən ibarətdir.
        // - process.env.JWT_SECRET_KEY: Token-i imzalamaq və yoxlamaq üçün istifadə olunan gizli açardır.
        // Əgər token etibarlıdırsa, deşifrə olunmuş məlumat obyektini (decoded) qaytarır.
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded); // Konsola deşifrə olunmuş token məlumatlarını yazırıq (məsələn, { id: "123abc..." }).
        
        // decoded obyektindən istifadəçinin ID-sini alırıq və User modelindən həmin istifadəçini tapırıq.
        // Bu, req.user obyektinə istifadəçi məlumatlarının əlavə edilməsini təmin edir.
        req.user = await User.findById(decoded.id);
        
        // Əgər token və istifadəçi məlumatları uğurla tapıldısa, növbəti middleware və ya route handler-ə keçirik.
        next();
    } catch(err) {
        // Əgər token yoxlanarkən xəta baş verərsə (məsələn, token etibarsızdır və ya mövcud deyil),
        // ErrorHandler vasitəsilə 401 (Unauthorized) status kodu ilə xəta yaradılır və növbəti error handler-ə ötürülür.
        return next(new ErrorHandler("Girish etmelisen", 401));
    }
});


// ======================================================================
// İstifadəçinin rola əsaslanaraq icazə verilməsi (Authorization) üçün middleware: authorizeRoles
// ======================================================================
// Bu funksiya, daxil edilmiş rollar siyahısına əsaslanaraq, istifadəçinin resurslara giriş icazəsini yoxlayır.
// ...roles: İstənilən sayda rol dəyəri qəbul edir.
export const authorizeRoles = (...roles) => {
    // Middleware funksiyası qaytarılır. Bu funksiya req, res və next parametrlərini qəbul edir.
    return (req, res, next) => {
        // req.user.role: isAuthenticatedUser middleware tərəfindən təyin edilmiş istifadəçinin rolunu alır.
        // roles.includes(req.user.role): İstifadəçinin rolu daxil edilmiş rollar arasında varsa, true qaytarır.
        if (!roles.includes(req.user.role)) {
            // Əgər istifadəçinin rolu daxil edilmiş rollar arasında deyilsə, 403 (Forbidden) status kodu ilə xəta yaradılır.
            // Xəta mesajında istifadəçinin cari rolu da göstərilir.
            return next(new ErrorHandler(`Senin rolun ${req.user.role} ve senin bu resurslara girish icazen yoxdur!`, 403));
        }
        // Əgər istifadəçinin rolu uyğun gəlirsə, növbəti middleware və ya route handler-ə keçid edirik.
        next();
    };
};
