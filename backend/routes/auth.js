// 'express' modulunu idxal edirik. Bu modul HTTP server qurmaq və route-ları təyin etmək üçün istifadə olunur.
import exporess from 'express'; // Qeyd: Burada "exporess" yazılıb, amma adətən "express" olaraq istifadə olunur.

// authController.js faylından autentifikasiya ilə bağlı funksiyaları idxal edirik:
// - registerUser: Yeni istifadəçinin qeydiyyatdan keçməsi üçün,
// - login: İstifadəçinin giriş etməsi üçün,
// - logout: İstifadəçinin sistemdən çıxması üçün,
// - forgotPassword: Şifrəni unutma prosesində şifrə sıfırlama tokeni yaradıb email göndərmək üçün,
// - resetPassword: Şifrə sıfırlama linkində gələn token vasitəsilə şifrəni yeniləmək üçün.
import { registerUser, login, logout, forgotPassword, resetPassword } from '../controller/authController.js';

// Yeni bir router yaradılır. Router, HTTP sorğularını müəyyən URL-lərə yönləndirmək üçün istifadə olunur.
const router = exporess.Router();

// POST sorğusu ilə "/register" URL-ə daxil olan sorğunu registerUser funksiyasına yönləndirir.
// Bu, yeni istifadəçinin qeydiyyatdan keçməsi üçün istifadə olunur.
router.post("/register", registerUser);

// POST sorğusu ilə "/login" URL-ə daxil olan sorğunu login funksiyasına yönləndirir.
// Bu, istifadəçinin giriş etməsi üçün istifadə olunur.
router.post("/login", login);

// GET sorğusu ilə "/logout" URL-ə daxil olan sorğunu logout funksiyasına yönləndirir.
// Bu, istifadəçinin çıxış əməliyyatını yerinə yetirir.
router.get("/logout", logout);

// POST sorğusu ilə "/password/forgot" URL-ə daxil olan sorğunu forgotPassword funksiyasına yönləndirir.
// Bu, şifrəni unutma halında, istifadəçinin email ünvanına şifrə sıfırlama linki göndərmək üçün istifadə olunur.
router.post("/password/forgot", forgotPassword);

// PUT sorğusu ilə "/password/reset/:token" URL-ə daxil olan sorğunu resetPassword funksiyasına yönləndirir.
// ":token" URL parametridir; istifadəçi, email vasitəsilə aldığı şifrə sıfırlama linkindəki token-i URL vasitəsilə göndərir.
// Bu funksiya həmin token-i yoxlayır və şifrəni yeniləyir.
router.put("/password/reset/:token", resetPassword);

// Yaradılmış router-i ixrac edirik ki, bu router digər modullarda (məsələn, serverin əsas faylında)
// istifadə olunsun və autentifikasiya ilə bağlı sorğuların idarə olunmasını təmin etsin.
export default router;
