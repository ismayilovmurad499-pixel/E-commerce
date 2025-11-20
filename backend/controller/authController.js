// catchAsyncErrors: Asinxron funksiyalarda yaranan xətaları avtomatik tutmaq üçün istifadə olunan middleware-dir.
// Bu, hər bir asinxron funksiya daxilində try/catch bloklarından qaçınmağa kömək edir.
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

// User modelini idxal edirik. Bu model MongoDB-də istifadəçi sənədlərini idarə edir.
import User from "../model/User.js";

// ErrorHandler: Xətaları müəyyən standart formatda yaratmaq üçün istifadə olunan sinifdir.
import ErrorHandler from "../utils/errorHandler.js";

// sendToken: İstifadəçiyə token (məsələn, JWT) yaradıb göndərmək üçün util funksiya.
import sendToken from "../utils/sendToken.js";

// getResetPasswordTemplate: Şifrə sıfırlama üçün email şablonunu yaradan funksiya.
// Bu funksiya, istifadəçinin adını və reset linkini daxil edərək email mətni yaradır.
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";

// sendEmail: Konfiqurasiya olunmuş email server vasitəsilə email göndərmək üçün util funksiya.
import { sendEmail } from "../utils/sendEmail.js";

// crypto: Node.js-in daxili moduludur və kriptoqrafik əməliyyatlar (məsələn, hash yaratmaq) üçün istifadə olunur.
import crypto from "crypto";


// ======================================================================
// 1. İstifadəçi qeydiyyatı (registerUser)
// ======================================================================
// Bu funksiya POST sorğusu vasitəsilə istifadəçi qeydiyyatı üçün göndərilən məlumatları (ad, email, şifrə)
// alır, yeni istifadəçi yaradır və uğurla qeydiyyatdan keçdiyini təsdiqləmək üçün istifadəçiyə token göndərir.
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    // req.body: Müştərinin göndərdiyi sorğunun body hissəsindəki məlumatları alırıq.
    const { name, email, password } = req.body;

    // User.create() metodu ilə yeni istifadəçi yaradılır və verilənlər bazasına əlavə edilir.
    // Bu əməliyyat asinxron olduğu üçün await istifadə olunur.
    const user = await User.create({ name, email, password });

    // İstifadəçi uğurla yaradıldıqdan sonra, sendToken funksiyası vasitəsilə ona token yaradılır və HTTP status kodu 201 (yaradılıb) ilə göndərilir.
    sendToken(user, 201, res);
});


// ======================================================================
// 2. İstifadəçi girişi (login)
// ======================================================================
// Bu funksiya POST sorğusu vasitəsilə istifadəçinin email və şifrəsini alır,
// istifadəçinin məlumatlarını yoxlayır və düzgün olduqda ona giriş tokeni göndərir.
export const login = catchAsyncErrors(async (req, res, next) => {
    // req.body-dən istifadəçi tərəfindən göndərilən email və şifrə dəyərlərini alırıq.
    const { email, password } = req.body;

    // Əgər email və ya şifrə daxil edilməyibsə, ErrorHandler vasitəsilə 400 (Bad Request) status kodu ilə xəta yaradılır.
    if (!email || !password) {
        return next(new ErrorHandler("Zəhmət olmasa emaili və ya şifrəni daxil edin", 400));
    }

    // Verilən email əsasında istifadəçi tapılır.
    // .select("+password") metodu, şifrə sahəsinin default olaraq seçilmədiyi hallarda onu da əlavə edir.
    const user = await User.findOne({ email }).select("+password");

    // Əgər istifadəçi tapılmazsa, 401 (Unauthorized) status kodu ilə xəta yaradılır.
    if (!user) {
        return next(new ErrorHandler("Belə bir emailə sahib istifadəçi tapılmadı", 401));
    }

    // İstifadəçinin daxil etdiyi şifrənin, verilənlər bazasında saxlanılan şifrə ilə uyğunluğunu yoxlayırıq.
    // user.shifreleriMuqayiseEt() metodu, modeldə təyin olunmuş şifrə müqayisə metodudur və true/false qaytarır.
    const isPasswordMatched = await user.shifreleriMuqayiseEt(password);

    // Əgər şifrə yanlışdırsa, 401 status kodu ilə xəta yaradılır.
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Şifrə yanlışdır", 401));
    }

    // Əgər hər şey qaydasındadırsa, sendToken funksiyası vasitəsilə istifadəçiyə token yaradılır və HTTP status kodu 200 (OK) ilə göndərilir.
    sendToken(user, 200, res);
});


// ======================================================================
// 3. İstifadəçi çıxışı (logout)
// ======================================================================
// Bu funksiya istifadəçinin çıxış etməsini təmin edir. 
// Çünki, server tərəfindən istifadəçinin token saxlandığı cookie-nin dəyəri boşlaşdırılır və vaxtı dərhal keçmiş kimi təyin olunur.
export const logout = catchAsyncErrors(async (req, res, next) => {
    // res.cookie() metodu ilə "token" adlı cookie-nin dəyəri null təyin edilir.
    // expires: new Date(Date.now()) – cookie dərhal vaxtı keçmiş kimi təyin edilir.
    // httpOnly: true – bu cookie yalnız HTTP sorğuları vasitəsilə əldə edilə bilər, JavaScript ilə əlçatan deyil.
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    // Uğurlu çıxış edildiyini təsdiq edən mesaj HTTP status kodu 200 (OK) ilə JSON formatında müştəriyə göndərilir.
    res.status(200).json({
        message: "Uğurla çıxış edildi"
    });
});


// ======================================================================
// 4. Şifrəni unutma (forgotPassword)
// ======================================================================
// Bu funksiya istifadəçinin POST sorğusu vasitəsilə göndərdiyi email əsasında istifadəçini tapır,
// şifrə sıfırlama tokeni yaradır, həmin token əsasında reset linki formalaşdırır və istifadəçinin email ünvanına göndərir.
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    // req.body.email: Müştərinin göndərdiyi email dəyəri vasitəsilə istifadəçi tapılır.
    const user = await User.findOne({ email: req.body.email });

    // Əgər istifadəçi tapılmazsa, 404 (Not Found) status kodu ilə xəta yaradılır.
    if (!user) {
        return next(new ErrorHandler("İstifadəçi tapılmadı", 404));
    }

    // getResetPasswordToken() metodu vasitəsilə istifadəçiyə aid reset token yaradılır.
    // Bu metod həm tokenin dəyərini, həm də tokenin bitmə vaxtını (expire) təyin edir.
    const resetToken = user.getResetPasswordToken();

    // Yaradılan token və onun bitmə vaxtı verilənlər bazasına yazılır.
    await user.save();

    // FRONTEND_URL mühit dəyişəni əsasında reset linki yaradılır.
    // resetToken linkin bir hissəsi kimi URL-ə əlavə olunur.
    const resetUrl = `${process.env.FRONTEND_URL}/commerce/mehsullar/password/reset/token/${resetToken}`;

    // getResetPasswordTemplate() funksiyası istifadəçinin adını və reset linkini daxil edərək email şablonunu yaradır.
    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
        // sendEmail() funksiyası vasitəsilə, istifadəçinin email ünvanına reset şifrənin sıfırlanması üçün email göndərilir.
        await sendEmail({
            email: user?.email,
            subject: "Şifrənin sıfırlanması mərhələsi",
            message
        });

        // Email uğurla göndərildikdən sonra, HTTP status kodu 200 (OK) ilə müvafiq cavab JSON formatında müştəriyə göndərilir.
        res.status(200).json({
            message: "Emailinizi yoxlayın"
        });
    } catch (err) {
        // Əgər email göndərilərkən xəta baş verərsə, istifadəçinin resetPasswordExpire və resetPasswordToken dəyərləri sıfırlanır.
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        // Dəyişikliklər verilənlər bazasına yazılır.
        await user.save();

        // 500 (Internal Server Error) status kodu ilə xəta növbəti error handler-ə ötürülür.
        return next(new ErrorHandler("Serverdə gözlənilməyən bir xəta baş verdi", 500));
    }
});


// ======================================================================
// 5. Şifrə sıfırlama (resetPassword)
// ======================================================================
// Bu funksiya, URL-dən göndərilən reset token əsasında istifadəçini tapır,
// daxil edilən yeni şifrə və təsdiq şifrənin uyğunluğunu yoxlayır,
// əgər uyğunlaşırsa, istifadəçinin şifrəsini yeniləyir, reset token və expire dəyərlərini silir,
// və istifadəçiyə yenidən token göndərir.
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    // req.params.token: URL parametrlərindəki token dəyərini alırıq.
    // crypto.createHash("sha256") metodu ilə SHA-256 alqoritmi istifadə edilərək token hash-lənir.
    // .update() metodu token dəyərini daxil edir və .digest("hex") metodu hash dəyərini hexadecimal formatda qaytarır.
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req?.params?.token)
        .digest("hex");

    // İstifadəçi, hash-lənmiş token və resetPasswordExpire sahəsinin, indiki vaxtdan böyük olduğu şərtinə görə tapılır.
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    // Əgər istifadəçi tapılmazsa, token yanlışdır və ya müddəti keçib, 400 (Bad Request) status kodu ilə xəta yaradılır.
    if (!user) {
        return next(new ErrorHandler("Reset token yanlışdır və ya müddəti keçib", 400));
    }

    // req.body.password və req.body.confirmPassword: Müştərinin göndərdiyi yeni şifrə və təsdiq şifrənin uyğunluğunu yoxlayırıq.
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Şifrələr uyğunlaşmır", 400));
    }

    // Yeni şifrəni istifadəçinin sənədində yeniləyirik.
    user.password = req.body.password;

    // Reset token və expire dəyərlərini silirik ki, artıq istifadə oluna bilməsin.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Yenilənmiş istifadəçi məlumatları verilənlər bazasına yazılır.
    await user.save();

    // İstifadəçi uğurla şifrəsini dəyişdirdikdən sonra, sendToken funksiyası vasitəsilə ona yenidən token yaradılır və göndərilir.
    sendToken(user, 200, res);
});
