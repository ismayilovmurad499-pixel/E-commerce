// MongoDB ilə işləmək üçün mongoose modulunu idxal edirik
import mongoose from "mongoose";

// Asinxron funksiyalarda yaranan xətaları tutmaq üçün hazırlanmış middleware-ni idxal edirik
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

// Favorilər siyahısını təmsil edən model (Favorite) idxal edilir
import Favorite from "../model/Favorite.js";

// Məhsullar haqqında məlumatların saxlandığı model (Product) idxal edilir
import { Product } from "../model/Product.js";

// Xəta yarananda standart şəkildə xəta obyekti yaratmaq üçün ErrorHandler sinifini idxal edirik
import ErrorHandler from "../utils/errorHandler.js";

// ------------------------------------------------------------------
// FAVORİLƏRƏ ƏLAVƏ ETMƏ FUNKSİYASI (addToFavorites)
// ------------------------------------------------------------------
export const addToFavorites = catchAsyncErrors(async (req, res, next) => {
    // req.body: Müştəridən gələn POST sorğusunun body hissəsindəki məlumatlar
    // Destrukturasiya edirik və "productId" dəyərini alırıq
    const { productId } = req.body;
    
    // req.user.id: Authentication middleware tərəfindən əlavə edilmiş, hazırda giriş etmiş istifadəçinin ID-si
    const userId = req.user.id;

    try {
        // ---------------------------------------------------
        // 1. Məhsul ID-sinin düzgünlüyünü yoxlayırıq
        // ---------------------------------------------------
        // mongoose.Types.ObjectId.isValid() metodu, göndərilən productId-nin düzgün MongoDB ObjectId formatında olub olmadığını yoxlayır.
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            // Əgər productId formatı səhvdirsə, ErrorHandler vasitəsilə 400 status kodu (Bad Request) ilə xəta atırıq.
            throw new ErrorHandler("Yanlış məhsul ID-si.", 400);
        }

        // ---------------------------------------------------
        // 2. Məhsulu verilənlər bazasından tapırıq
        // ---------------------------------------------------
        // Product.findById() metodu vasitəsilə məhsulun məlumatlarını tapırıq.
        const product = await Product.findById(productId);
        // Əgər məhsul tapılmazsa, 404 (Not Found) status kodu ilə xəta göndəririk.
        if (!product) {
            return next(new ErrorHandler("Hal-hazırda məhsul mövcud deyil.", 404));
        }

        // ---------------------------------------------------
        // 3. İstifadəçinin favori siyahısını tapırıq və ya yenisini yaradırıq
        // ---------------------------------------------------
        // Favorite.findOne() metodu ilə istifadəçinin favori siyahısını tapırıq.
        let favorite = await Favorite.findOne({ user: userId });
        // Əgər istifadəçiyə aid favori siyahısı yoxdursa, yeni bir Favorite obyekti yaradırıq.
        if (!favorite) {
            favorite = new Favorite({ user: userId, products: [] });
        }

        // ---------------------------------------------------
        // 4. Məhsulun artıq favoridə olub olmadığını yoxlayırıq
        // ---------------------------------------------------
        // Array.findIndex() metodu ilə favori siyahısındakı hər bir məhsulun string formatda ID-sini productId ilə müqayisə edirik.
        const productIndex = favorite.products.findIndex(
            (p) => p.toString() === productId
        );

        // Əgər məhsul artıq siyahıda varsa, 400 status kodu ilə xəta göndəririk.
        if (productIndex !== -1) {
            return next(new ErrorHandler("Məhsul artıq favorilərinizdədir.", 400));
        }

        // ---------------------------------------------------
        // 5. Məhsulu favori siyahısına əlavə edirik
        // ---------------------------------------------------
        // push() metodu ilə məhsul ID-sini favori siyahısına əlavə edirik.
        favorite.products.push(productId);
        // Yenilənmiş favori siyahısını verilənlər bazasına yazırıq.
        await favorite.save();

        // ---------------------------------------------------
        // 6. HTTP cavabını müştəriyə göndəririk
        // ---------------------------------------------------
        // res.status(200): HTTP cavabın status kodunu 200 (OK) təyin edir.
        // res.json(): Cavabı JSON formatında göndərir.
        res.status(200).json({
            success: true, // Əməliyyatın uğurlu olduğunu bildirir
            message: "Məhsul favorilərə əlavə edildi.", // Müştəriyə göndəriləcək məlumat mesajı
            favorite, // Yenilənmiş favori siyahısı obyekti
        });
    } catch (error) {
        // Əgər try blokunda hər hansı xəta baş verərsə, catch bloku error-u növbəti middleware (error handler) vasitəsilə ötürür.
        next(error);
    }
});

// ------------------------------------------------------------------
// FAVORİLƏRDƏN MƏHSUL SILMƏ FUNKSİYASI (removeFromFavorites)
// ------------------------------------------------------------------
export const removeFromFavorites = catchAsyncErrors(async (req, res, next) => {
    // req.params: URL-dəki parametr obyektidir; burada productId URL vasitəsilə göndərilir.
    const { productId } = req.params;
    
    // Hal-hazırda giriş etmiş istifadəçinin ID-sini alırıq.
    const userId = req.user.id;

    try {
        // ---------------------------------------------------
        // 1. İstifadəçinin favori siyahısını tapırıq
        // ---------------------------------------------------
        let favorite = await Favorite.findOne({ user: userId });
        // Əgər favori siyahısı tapılmazsa, 404 (Not Found) status kodu ilə xəta göndəririk.
        if (!favorite) {
            return next(new ErrorHandler("Hal-hazırda məhsul mövcud deyil.", 404));
        }

        // ---------------------------------------------------
        // 2. Favori siyahısında məhsulun olub olmadığını yoxlayırıq
        // ---------------------------------------------------
        const productIndex = favorite.products.findIndex(
            (p) => p.toString() === productId
        );

        // Əgər məhsul favori siyahısında tapılmazsa, 404 status kodu ilə xəta göndəririk.
        if (productIndex === -1) {
            return next(new ErrorHandler("Hal-hazırda məhsul mövcud deyil.", 404));
        }

        // ---------------------------------------------------
        // 3. Məhsulu favori siyahısından silirik
        // ---------------------------------------------------
        // splice() metodu ilə array-dən müəyyən indeksdən məhsulu çıxarırıq.
        favorite.products.splice(productIndex, 1);

        // ---------------------------------------------------
        // 4. Əgər favori siyahısı tamamilə boşdursa, siyahını silirik
        // ---------------------------------------------------
        if (favorite.products.length === 0) {
            // Favorite.findOneAndDelete() metodu ilə istifadəçinin favori siyahısını tamamilə silirik.
            await Favorite.findOneAndDelete({ user: userId });
            // Favori siyahısı silindiyindən, HTTP cavabını göndəririk.
            return res.status(200).json({
                success: true,
                message: "Məhsul favorilərdən silindi və favori siyahısı tam silindi.",
            });
        }

        // ---------------------------------------------------
        // 5. Əks halda, yenilənmiş favori siyahısını yadda saxlayırıq
        // ---------------------------------------------------
        await favorite.save();

        // ---------------------------------------------------
        // 6. HTTP cavabını JSON formatında müştəriyə göndəririk
        // ---------------------------------------------------
        res.status(200).json({
            success: true,
            message: "Məhsul favorilərdən silindi.",
            favorite, // Yenilənmiş favori siyahısı obyekti
        });
    } catch (error) {
        // Hər hansı xəta baş verərsə, error-u növbəti error handler-ə ötürürük.
        next(error);
    }
});

// ------------------------------------------------------------------
// FAVORİLƏRDƏKİ MƏHSULLARI ƏLDƏ ETMƏ FUNKSİYASI (getFavoriteProducts)
// ------------------------------------------------------------------
export const getFavoriteProducts = catchAsyncErrors(async (req, res, next) => {
    // Hal-hazırda giriş etmiş istifadəçinin ID-sini alırıq.
    const userId = req.user.id;

    try {
        // ---------------------------------------------------
        // 1. İstifadəçinin favori siyahısını tapırıq
        // ---------------------------------------------------
        // Favorite.findOne() metodu ilə favori siyahısını tapırıq.
        // populate() metodu vasitəsilə "products" array-indəki hər bir məhsulun əlaqəli məlumatlarını (name, price, images) doldururuq.
        const favorite = await Favorite.findOne({ user: userId }).populate({
            path: "products",
            select: "name price images",
        });

        // Əgər favori siyahısı tapılmazsa, 404 (Not Found) status kodu ilə xəta göndəririk.
        if (!favorite) {
            return next(new ErrorHandler("Hal-hazırda məhsul mövcud deyil.", 404));
        }

        // ---------------------------------------------------
        // 2. HTTP cavabını JSON formatında müştəriyə göndəririk
        // ---------------------------------------------------
        res.status(200).json({
            success: true,
            // "favorites" sahəsində, favori siyahısındakı məhsulların siyahısı göndərilir.
            favorites: favorite.products,
        });
    } catch (error) {
        // Əgər xəta baş verərsə, error-u növbəti middleware-ə ötürürük.
        next(error);
    }
});
