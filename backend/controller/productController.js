// mongoose modulunu idxal edirik – MongoDB ilə işləmək üçün tələb olunur.
import mongoose from "mongoose";

// Asinxron funksiyalarda yaranan xətaları tutmaq üçün hazırlanmış middleware-ni idxal edirik.
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

// Xəta idarəetmə sinifi – xətaları standart formatda yaratmaq üçün istifadə olunur.
import ErrorHandler from "../utils/errorHandler.js";

// Cloudinary modulunu idxal edirik – şəkillərin bulud üzərindən yüklənməsi və silinməsi üçün.
import cloudinary from "../utils/cloudinary.js";

// FS (file system) modulunu idxal edirik – serverdəki fayllarla işləmək üçün.
import fs from "fs";

// Məhsulların modellərini idxal edirik: Product və kateqoriyalara aid digər modellər (Phone, Laptop, Camera, Headphone, Console, iPad)
import { Product, Phone, Laptop, Camera, Headphone, Console, iPad } from "../model/Product.js";


// ======================================================================
// 1. Məhsulların siyahısını əldə edən funksiya (limit və offset dəstəyi ilə)
// ======================================================================
export const getProducts = catchAsyncErrors(async (req, res, next) => {
  // Query parametrlərindən "limit" və "offset" dəyərlərini alırıq.
  // parseInt() ilə string-dən ədədə çevrilir, əgər göndərilməyibsə default olaraq 100 və 0 təyin edilir.
  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0;

  // Product modelindən bütün məhsulları tapırıq, sonra "skip" metodu ilə offset qədər keçirik və "limit" qədər nəticə qaytarırıq.
  const products = await Product.find().skip(offset).limit(limit);
  
  // Əgər heç bir məhsul tapılmazsa, 404 xətası göndəririk.
  if (!products) {
    return next(new ErrorHandler("Məhsullar yoxdur", 404));
  }
  // Uğurlu cavab: status 200 (OK) və JSON formatında məhsulların siyahısı.
  res.status(200).json({ products });
});


// ======================================================================
// 2. Məhsul detallarını əldə edən funksiya
// ======================================================================
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  // URL-dəki "id" parametrinə əsaslanaraq məhsulu tapırıq.
  const product = await Product.findById(req.params.id);
  
  // Əgər məhsul tapılmazsa, 404 status kodu ilə xəta göndəririk.
  if (!product) {
    return next(new ErrorHandler("Məhsul tapılmadı", 404));
  }
  // Uğurlu cavab: status 200 və tapılmış məhsul JSON formatında qaytarılır.
  res.status(200).json({ product });
});


// ======================================================================
// 3. Məhsul silmə funksiyası
// ======================================================================
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    // URL-dəki "id" parametrinə əsaslanaraq məhsulu tapırıq.
    const product = await Product.findById(req.params.id);
    
    // Əgər məhsul tapılmazsa, status 404 ilə xəta mesajı qaytarırıq.
    if (!product) {
      return res.status(404).json({ error: "Məhsul tapılmadı" });
    }
    
    // Əgər məhsulun şəkilləri varsa (product.images array-i mövcuddursa və boş deyilsə):
    if (product.images && product.images.length > 0) {
      // Hər bir şəkil üçün Cloudinary üzərindən şəkili silməyə çalışırıq.
      for (let image of product.images) {
        try {
          // Cloudinary-dən şəkili silmək üçün uploader.destroy metodundan istifadə edirik.
          await cloudinary.v2.uploader.destroy(image.public_id);
        } catch (cloudinaryError) {
          // Əgər Cloudinary-dən silinərkən xəta baş verərsə, xəta konsola yazılır.
          console.error(
            `Cloudinary-dən ${image.public_id} id-li şəkil silinərkən xəta:`,
            cloudinaryError
          );
        }
      }
    }
    // Məhsulu MongoDB-dən silirik.
    await Product.deleteOne({ _id: req.params.id });
    // Uğurlu cavab: status 200 və silinmə mesajı.
    return res.status(200).json({ message: "Məhsul uğurla silindi" });
  } catch (error) {
    // Əsas "deleteProduct" funksiyasında xəta baş verərsə, xəta konsola yazılır və status 500 (server xətası) qaytarılır.
    console.error("deleteProduct funksiyasında xəta baş verdi:", error);
    return res.status(500).json({
      error: "Daxili server xətası",
      message: error.message,
    });
  }
});


// ======================================================================
// 4. Yeni məhsul yaratma funksiyası
// ======================================================================
export const newProduct = catchAsyncErrors(async (req, res, next) => {
  // Yüklənmiş şəkilləri saxlamaq üçün boş array yaradırıq.
  const images = [];
  
  // Əgər sorğuda (req.files) şəkillər varsa:
  if (req.files) {
    // Hər bir fayl üçün:
    for (let file of req.files) {
      try {
        // Cloudinary-dən faylı yükləyirik, "products" qovluğu altında.
        const result = await cloudinary.v2.uploader.upload(file.path, { folder: "products" });
        // Yüklənmiş şəkilin public_id və secure_url dəyərlərini images array-ə əlavə edirik.
        images.push({ public_id: result.public_id, url: result.secure_url });
        // Yüklənmiş faylı serverdən silirik.
        fs.unlinkSync(file.path);
      } catch (error) {
        // Əgər şəkil yüklənərkən xəta baş verərsə, status 500 ilə cavab göndəririk.
        return res.status(500).json({ error: "Şəkil yüklənmədi", message: error.message });
      }
    }
  }
  // Sorğu məlumatları (req.body) və yüklənmiş şəkilləri images array-ini birləşdirərək yeni məhsul yaradırıq.
  const product = await Product.create({ ...req.body, images });
  // Uğurlu cavab: status 201 (yaradılıb) və yaradılmış məhsul JSON formatında qaytarılır.
  res.status(201).json({ success: true, product });
});


// ======================================================================
// 5. Məhsulu güncəlləmə funksiyası (kategori dəyişməsi halında yeni model ilə yaradılır)
// ======================================================================
export const updateProduct = catchAsyncErrors(async (req, res) => {
  // URL-dən məhsul ID-ni alırıq.
  const productId = req.params.id;
  // Mövcud məhsulu tapırıq.
  let product = await Product.findById(productId);
  if (!product) {
    // Əgər məhsul tapılmazsa, status 404 ilə cavab göndəririk.
    return res.status(404).json({ error: "Məhsul tapılmadı" });
  }

  // Yeni kategori dəyərini req.body-dən alırıq.
  const newCategory = req.body.category;
  // Əgər yeni kategori mövcuddursa və cari məhsulun kategoriyasından fərqlidirsə:
  if (newCategory && newCategory !== product.category) {
    let NewModel; // Yeni modelin dəyişəni

    // Yeni kateqoriyaya uyğun model seçilir.
    switch (newCategory) {
      case "Phones":
        NewModel = Phone;
        break;
      case "Laptops":
        NewModel = Laptop;
        break;
      case "Cameras":
        NewModel = Camera;
        break;
      case "Headphones":
        NewModel = Headphone;
        break;
      case "Console":
        NewModel = Console;
        break;
      case "iPad":
        NewModel = iPad;
        break;
      default:
        NewModel = Product;
    }

    // Mövcud məhsulun şəkillərini alırıq.
    let images = product.images || [];
    
    // Əgər "existingImages" adlı sahə varsa (güncəlləmədə silinməsi istənən şəkillər):
    if (req.body.existingImages) {
      try {
        // JSON string şəklində gələn "existingImages" dəyərini parse edirik.
        const imagesToRemove = JSON.parse(req.body.existingImages);
        // Hər bir silinəcək şəkil üçün:
        for (let image of imagesToRemove) {
          try {
            // Cloudinary-dən həmin şəkili silməyə çalışırıq.
            await cloudinary.v2.uploader.destroy(image.public_id);
          } catch (error) {
            console.error(`Cloudinary-dən ${image.public_id} id-li şəkil silinərkən xəta:`, error);
          }
        }
        // Favori şəkillərdən silinmək istənənləri çıxarırıq.
        images = images.filter(
          (img) => !imagesToRemove.some((rm) => rm.public_id === img.public_id)
        );
      } catch (parseError) {
        console.error("existingImages parse xətası:", parseError);
      }
    }

    // Yeni yüklənmiş şəkillər üçün boş array yaradırıq.
    const newImages = [];
    // Əgər yeni şəkillər yüklənibsə:
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        try {
          // Cloudinary-dən faylı yükləyirik və nəticədən public_id və url alırıq.
          const result = await cloudinary.v2.uploader.upload(file.path, { folder: "products" });
          newImages.push({ public_id: result.public_id, url: result.secure_url });
          // Serverdə olan faylı silirik.
          fs.unlinkSync(file.path);
        } catch (error) {
          return res.status(500).json({ error: "Şəkil yüklənmədi", message: error.message });
        }
      }
    }
    // Yeni və mövcud şəkilləri birləşdiririk.
    images = [...images, ...newImages];

    // Yeni məhsul üçün form məlumatlarını (req.body) və şəkilləri images array-i ilə birləşdiririk.
    const newProductData = { ...req.body, images };

    try {
      // Əvvəlcə, köhnə məhsulu silirik.
      await Product.deleteOne({ _id: productId });
      // Yeni model ilə yeni məhsul yaradılır.
      const newProduct = await NewModel.create(newProductData);
      return res.status(200).json({
        success: true,
        message: "Məhsul kateqoriya dəyişdirilərək yeniləndi",
        product: newProduct,
      });
    } catch (creationError) {
      console.error("Yeni məhsul yaradılarkən xəta:", creationError);
      return res.status(400).json({ error: "Yeni məhsul yaradılarkən xəta", details: creationError.message });
    }
  } else {
    // Əgər kategori dəyişməyibsə, klassik güncəlləmə edilir.
    let updatedImages = product.images || [];
    if (req.body.existingImages) {
      try {
        // Silinməsi istənən şəkilləri parse edirik.
        const imagesToRemove = JSON.parse(req.body.existingImages);
        for (let image of imagesToRemove) {
          try {
            await cloudinary.v2.uploader.destroy(image.public_id);
          } catch (error) {
            console.error(`Cloudinary-dən ${image.public_id} id-li şəkil silinərkən xəta:`, error);
          }
        }
        // Mövcud şəkillərdən silinənləri çıxarırıq.
        updatedImages = updatedImages.filter(
          (img) => !imagesToRemove.some((rm) => rm.public_id === img.public_id)
        );
      } catch (parseError) {
        console.error("existingImages parse xətası:", parseError);
      }
    }
    // Yeni yüklənmiş şəkillər üçün boş array.
    const newImages = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        try {
          const result = await cloudinary.v2.uploader.upload(file.path, { folder: "products" });
          newImages.push({ public_id: result.public_id, url: result.secure_url });
          fs.unlinkSync(file.path);
        } catch (error) {
          return res.status(500).json({ error: "Şəkil yüklənmədi", message: error.message });
        }
      }
    }
    // Güncəllənmiş şəkilləri birləşdiririk.
    for (const key in req.body) {
      // "existingImages" sahəsi güncəlləmə prosesində istifadə olunmur, onu keçirik.
      if (key === "existingImages") continue;
      // Digər sahələri məhsul obyekti üzərinə yazırıq.
      product[key] = req.body[key];
    }
    // Əgər yeni şəkillər yüklənibsə, onları mövcud şəkillərlə birləşdiririk.
    if (newImages.length > 0) {
      updatedImages = [...updatedImages, ...newImages];
    }
    // Məhsulun images sahəsini yenilənmiş şəkillərlə əvəz edirik.
    product.images = updatedImages;
    // Dəyişiklikləri verilənlər bazasında yadda saxlayırıq.
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Məhsul uğurla yeniləndi",
      product,
    });
  }
});


// ======================================================================
// 6. Məhsul axtarışı funksiyası (limit və offset dəstəyi ilə)
// ======================================================================
export const searchProducts = catchAsyncErrors(async (req, res, next) => {
  // Query parametrlərindən "query", "page" və "limit" dəyərlərini alırıq.
  // Əgər "page" və "limit" verilməyibsə, default olaraq 1 və 10 təyin edilir.
  const { query, page = 1, limit = 10 } = req.query;
  // Əgər "query" boşdursa, müvafiq xəta göndəririk.
  if (!query) {
    return next(new ErrorHandler("Lütfen bir arama sorgusu girin.", 400));
  }
  // RegExp obyekti yaradılır, "i" flag-i ilə böyük-kiçik hərf həssaslığı aradan qaldırılır.
  const searchRegex = new RegExp(query, "i");
  // Məhsul adında axtarış aparırıq və skip() & limit() metodları ilə səhifələmə tətbiq edirik.
  const products = await Product.find({ name: { $regex: searchRegex } })
    .skip((page - 1) * limit)
    .limit(limit);
  // Axtarışa uyğun məhsulların sayını tapırıq.
  const totalProducts = await Product.countDocuments({ name: { $regex: searchRegex } });
  // Əgər heç bir məhsul tapılmazsa, 404 xətası göndəririk.
  if (products.length === 0) {
    return next(new ErrorHandler("Aramanızla eşleşen ürün bulunamadı.", 404));
  }
  // Uğurlu cavab: axtarış nəticələri, ümumi məhsul sayı, səhifə sayı və cari səhifə dəyərləri JSON formatında qaytarılır.
  res.status(200).json({
    success: true,
    message: "Arama sonuçları başarıyla getirildi.",
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
  });
});


// ======================================================================
// 7. Məhsul üçün rəyin yaradılması və ya güncəllənməsi funksiyası
// ======================================================================
export const createOrUpdateReview = catchAsyncErrors(async (req, res, next) => {
  // req.body-dən məhsul ID-si, rəyin qiyməti (rating) və şərhi (comment) alınır.
  const { productId, rating, comment } = req.body;

  // Məhsul tapılır.
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Məhsul tapılmadı", 404));
  }

  // Rəy obyektini yaradırıq.
  // Əgər istifadəçi doğrulanıbsa (req.user varsa) onun ID-si, yoxsa req.body-dən user məlumatı alınır.
  const review = {
    user: req.user ? req.user._id : req.body.user,
    rating: Number(rating), // Qiymət dəyəri number tipinə çevrilir.
    comment, // Şərh mətni
  };

  // Məhsulun reviews array-ində istifadəçinin artıq rəy verib-vermədiyini tapırıq.
  const existingReviewIndex = product.reviews.findIndex(
    (rev) => rev.user.toString() === review.user.toString()
  );

  if (existingReviewIndex !== -1) {
    // İstifadəçi artıq rəy əlavə edibsə, onun rəyini güncəlləyirik.
    product.reviews[existingReviewIndex].rating = review.rating;
    product.reviews[existingReviewIndex].comment = review.comment;
  } else {
    // Əks halda, yeni rəy əlavə edirik və rəy sayını güncəlləyirik.
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Məhsulun ümumi rəylərinin ortalaması hesablanır.
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  // Məhsul məlumatları yadda saxlanılır; validateBeforeSave false edilib ki, bəzi yoxlamalar keçilsin.
  await product.save({ validateBeforeSave: false });

  // Uğurlu cavab: status 200 və rəyin əlavə/güncəllənməsi haqqında mesaj.
  res.status(200).json({
    success: true,
    message: "Rəy uğurla əlavə edildi/güncəlləndi",
  });
});


// ======================================================================
// 8. Bir məhsulun bütün rəylərini və ortalama rating dəyərini əldə edən funksiya
// ======================================================================
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  // URL-dəki "id" parametrindən məhsul ID-si alınır.
  const productId = req.params.id;

  // Məhsul tapılır.
  const product = await Product.findById(productId);

  // Əgər məhsul tapılmazsa, 404 xətası göndərilir.
  if (!product) {
    return next(new ErrorHandler("Məhsul tapılmadı", 404));
  }

  // Uğurlu cavab: status 200 və məhsulun rəyləri, ortalama rating və rəy sayı JSON formatında qaytarılır.
  res.status(200).json({
    success: true,
    message: "Məhsulun rəyləri uğurla gətirildi",
    reviews: product.reviews,
    ratings: product.ratings,
    numOfReviews: product.numOfReviews,
  });
});
