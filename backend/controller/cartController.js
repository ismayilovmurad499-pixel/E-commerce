// mongoose modulunu idxal edirik - MongoDB ilə əlaqə qurmaq üçün istifadə olunur
import mongoose from "mongoose";

// Cart modelini idxal edirik - istifadəçilərin səbət məlumatlarını saxlamaq üçün
import Cart from "../model/Cart.js";

// Product modelini idxal edirik - məhsul məlumatlarını saxlamaq üçün
import { Product } from "../model/Product.js";

// Xəta idarəetmə sinifini idxal edirik - xətaları standart şəkildə yaratmaq və göndərmək üçün
import ErrorHandler from "../utils/errorHandler.js";

// Asinxron funksiyalarda yaranan xətaları tutmaq üçün hazırlanmış middleware-ni idxal edirik
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

// ------------------------------------------------------------------
// Məhsulu səbətə əlavə etmə funksiyası (addToCart)
// ------------------------------------------------------------------
export const addToCart = catchAsyncErrors(async (req, res, next) => {
  // req.body-dən məhsulun ID-sini və miqdarını alırıq.
  // quantity üçün default dəyər 1-dir əgər müştəri tərəfindən göndərilməyibsə.
  const { productId, quantity = 1 } = req.body;

  // req.user.id: Authentication middleware tərəfindən təyin edilmiş, hazırda giriş etmiş istifadəçinin ID-si.
  const userId = req.user.id;

  try {
    // ---------------------------
    // 1. Məhsul ID-nin düzgün formatda olub olmadığını yoxlayırıq
    // ---------------------------
    // mongoose.Types.ObjectId.isValid() metodu göndərilən productId-nin MongoDB ObjectId formatında olub olmadığını yoxlayır.
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      // Əgər format düzgün deyilsə, 400 (Bad Request) status kodu ilə xəta atırıq.
      throw new ErrorHandler("Geçersiz ürün ID'si.", 400);
    }

    // ---------------------------
    // 2. Məhsulu verilənlər bazasından tapırıq
    // ---------------------------
    // Product.findById() metodu məhsulun məlumatlarını verilən productId əsasında axtarır.
    const product = await Product.findById(productId);
    if (!product) {
      // Əgər məhsul tapılmasa, 404 (Not Found) status kodu ilə xəta növbəti middleware-ə ötürülür.
      return next(new ErrorHandler("Şu anda ürün bulunmamaktadır.", 404));
    }

    // ---------------------------
    // 3. İstifadəçinin səbətini tapırıq; əgər yoxdursa, yeni səbət yaradırıq
    // ---------------------------
    // Cart.findOne() metodu verilən istifadəçi ID-sinə uyğun səbət sənədini axtarır.
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Əgər istifadəçinin səbəti yoxdursa, yeni Cart obyekti yaradılır.
      // Burada "products" array-i başlanğıcda boş olaraq təyin edilir.
      cart = new Cart({ user: userId, products: [] });
    }

    // ---------------------------
    // 4. Səbətdə məhsulun olub olmadığını yoxlayırıq
    // ---------------------------
    // cart.products array-ində hər bir elementin "product" sahəsini stringə çevirərək müqayisə edirik.
    // findIndex() metodu şərtə uyğun gələn elementin indeksini qaytarır və əgər tapılmazsa, -1 qaytarır.
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex !== -1) {
      // Əgər məhsul artıq səbətdə varsa, mövcud miqdara əlavə olaraq yeni miqdarı artırırıq.
      cart.products[productIndex].quantity += quantity;
    } else {
      // Əgər məhsul səbətdə yoxdursa, yeni obyekt kimi "products" array-inə əlavə edirik.
      // Burada obyektin tərkibində məhsul ID və miqdar saxlanılır.
      cart.products.push({ product: productId, quantity });
    }

    // ---------------------------
    // 5. Yenilənmiş səbəti verilənlər bazasına qeyd edirik
    // ---------------------------
    // cart.save() metodu cart obyektindəki dəyişiklikləri verilənlər bazasına yazır.
    await cart.save();

    // ---------------------------
    // 6. HTTP cavabını müştəriyə göndəririk
    // ---------------------------
    // res.status(200): HTTP cavab status kodunu 200 (OK) təyin edir.
    // res.json() metodu göndəriləcək cavabı JSON formatında qurur.
    res.status(200).json({
      success: true, // Əməliyyatın uğurlu olduğunu bildirir
      message: "Ürün sepete eklendi.", // İstifadəçiyə məlumat verən mesaj
      cart, // Yenilənmiş səbət obyektini göndərir
    });
  } catch (error) {
    // Hər hansı xəta baş verərsə, catch bloku error-u "next" funksiyası vasitəsilə növbəti error middleware-ə ötürür.
    next(error);
  }
});

// ------------------------------------------------------------------
// Səbətdən məhsulun silinməsi funksiyası (removeFromCart)
// ------------------------------------------------------------------
export const removeFromCart = catchAsyncErrors(async (req, res, next) => {
  // req.params-dan URL-dəki məhsul ID-ni alırıq.
  const { productId } = req.params;
  // İstifadəçi ID-si, authentication middleware tərəfindən təyin edilmiş req.user obyektindən götürülür.
  const userId = req.user.id;

  try {
    // ---------------------------
    // 1. İstifadəçinin səbətini tapırıq
    // ---------------------------
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Əgər səbət tapılmasa, 404 (Not Found) status kodu ilə xəta ötürülür.
      return next(new ErrorHandler("Şu anda ürün bulunmamaktadır.", 404));
    }

    // ---------------------------
    // 2. Səbətdə məhsulun olub olmadığını yoxlayırıq
    // ---------------------------
    // findIndex() metodu ilə məhsulun səbətdə olub olmadığını müəyyən edirik.
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1) {
      // Əgər məhsul səbətdə tapılmırsa, 404 xətası göndərilir.
      return next(new ErrorHandler("Şu anda ürün bulunmamaktadır.", 404));
    }

    // ---------------------------
    // 3. Səbətdən məhsulu silirik
    // ---------------------------
    // splice() metodu array-dən müəyyən indeksdən elementləri silmək üçün istifadə olunur.
    cart.products.splice(productIndex, 1);

    // ---------------------------
    // 4. Əgər səbət tamamilə boşalırsa, səbəti silirik
    // ---------------------------
    if (cart.products.length === 0) {
      // Cart.findOneAndDelete() metodu verilən şərtə uyğun səbət sənədini silir.
      await Cart.findOneAndDelete({ user: userId });
      // Səbət silindiyindən, müştəriyə uyğun mesaj ilə cavab göndəririk.
      return res.status(200).json({
        success: true,
        message: "Ürün sepetten kaldırıldı və sepet tamamen silindi.",
      });
    }

    // ---------------------------
    // 5. Əks halda, yenilənmiş səbəti yadda saxlayırıq
    // ---------------------------
    await cart.save();

    // ---------------------------
    // 6. HTTP cavabını JSON formatında müştəriyə göndəririk
    // ---------------------------
    res.status(200).json({
      success: true,
      message: "Ürün sepetten kaldırıldı.",
      cart, // Yenilənmiş səbət obyektini göndəririk
    });
  } catch (error) {
    // Əgər hər hansı xəta baş verərsə, error-u növbəti middleware-ə ötürürük.
    next(error);
  }
});

// ------------------------------------------------------------------
// İstifadəçinin səbətindəki məhsulları əldə edən funksiya (getCartProducts)
// ------------------------------------------------------------------
export const getCartProducts = catchAsyncErrors(async (req, res, next) => {
  // İstifadəçi ID-ni auth middleware vasitəsilə əldə edirik.
  const userId = req.user.id;

  try {
    // ---------------------------
    // 1. İstifadəçinin səbətini tapırıq
    // ---------------------------
    // Cart.findOne() metodu ilə istifadəçinin səbətini tapırıq.
    // populate() metodu "products.product" sahəsində olan əlaqəli məhsul məlumatlarını (name, price, images) doldurur.
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      select: "name price images",
    });

    if (!cart) {
      // Əgər səbət tapılmasa, 404 status kodu ilə xəta göndəririk.
      return next(new ErrorHandler("Şu anda ürün bulunmamaktadır.", 404));
    }

    // ---------------------------
    // 2. HTTP cavabını JSON formatında göndəririk
    // ---------------------------
    res.status(200).json({
      success: true,
      // Sadece cart.products hissəsini müştəriyə göndəririk,
      // bu, səbətdəki hər bir məhsulun məlumatlarını əhatə edir.
      cart: cart.products,
    });
  } catch (error) {
    // Xəta baş verərsə, error-u növbəti error handler-ə ötürürük.
    next(error);
  }
});

// ------------------------------------------------------------------
// Səbətdəki məhsulun miqdarını yeniləyən funksiya (updateCartQuantity)
// ------------------------------------------------------------------
export const updateCartQuantity = catchAsyncErrors(async (req, res, next) => {
  // URL parametrlərindən məhsul ID-ni alırıq.
  const { productId } = req.params;
  // Request-in body hissəsindən yenilənmiş miqdarı alırıq.
  const { quantity } = req.body;
  // Authentication middleware tərəfindən təyin edilmiş istifadəçi ID-ni alırıq.
  const userId = req.user.id;

  try {
      // ---------------------------
      // 1. Məhsulun mövcudluğunu və stokunu yoxlayırıq
      // ---------------------------
      // Product.findById() metodu məhsulun məlumatlarını əldə edir.
      const product = await Product.findById(productId);
      if (!product) {
          // Əgər məhsul tapılmasa, 404 status kodu ilə xəta göndəririk.
          return next(new ErrorHandler("Məhsul tapılmadı", 404));
      }

      // ---------------------------
      // 2. İstənilən miqdarın məhsulun stokundan artıq olmadığını yoxlayırıq
      // ---------------------------
      if (quantity > product.stock) {
          // Əgər tələb olunan miqdar məhsulun stokundan artıqdırsa, 400 status kodu ilə xəta göndəririk.
          return next(new ErrorHandler("Kifayət qədər stok yoxdur", 400));
      }

      // ---------------------------
      // 3. Miqdarın minimum 1-dən az ola bilməyəcəyini yoxlayırıq
      // ---------------------------
      if (quantity < 1) {
          return next(new ErrorHandler("Miqdar 1-dən az ola bilməz", 400));
      }

      // ---------------------------
      // 4. İstifadəçinin səbətini tapırıq
      // ---------------------------
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
          return next(new ErrorHandler("Səbət tapılmadı", 404));
      }

      // ---------------------------
      // 5. Səbətdə həmin məhsulun olub olmadığını yoxlayırıq
      // ---------------------------
      const productIndex = cart.products.findIndex(
          (p) => p.product.toString() === productId
      );

      if (productIndex === -1) {
          // Əgər məhsul səbətdə yoxdursa, 404 status kodu ilə xəta göndəririk.
          return next(new ErrorHandler("Məhsul səbətdə tapılmadı", 404));
      }

      // ---------------------------
      // 6. Səbətdəki məhsulun miqdarını yeniləyirik
      // ---------------------------
      cart.products[productIndex].quantity = quantity;
      await cart.save(); // Dəyişiklikləri verilənlər bazasına yazırıq.

      // ---------------------------
      // 7. Yenilənmiş səbəti, əlaqəli məhsul məlumatları ilə birlikdə əldə edirik
      // ---------------------------
      // populate() metodu "products.product" sahəsini doldurur,
      // beləliklə hər bir məhsul haqqında əlavə məlumat (name, price, images, stock) əldə edilir.
      const updatedCart = await Cart.findOne({ user: userId }).populate({
          path: "products.product",
          select: "name price images stock"
      });

      // ---------------------------
      // 8. HTTP cavabını JSON formatında müştəriyə göndəririk
      // ---------------------------
      res.status(200).json({
          success: true,
          message: "Məhsul miqdarı yeniləndi",
          // Yenilənmiş səbətdəki məhsulların siyahısını göndəririk
          cart: updatedCart.products,
      });
  } catch (error) {
      // Hər hansı xəta baş verərsə, onu növbəti error handler-ə ötürürük.
      next(error);
  }
});
