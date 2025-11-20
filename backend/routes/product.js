// Express modulunu idxal edirik. Express HTTP serveri yaratmaq və route-ları təyin etmək üçün istifadə olunur.
import express from "express";

// Yeni bir router obyekti yaradırıq. Bu, route-ları qruplaşdırmaq və modullar arasında bölüşmək üçün istifadə olunur.
const router = express.Router();

// Aşağıdakı sətirlərdə müxtəlif controller funksiyaları idxal edilir.
// Bu funksiyalar, məhsulların, səbətin, favorilərin və filtrin idarə olunması kimi əməliyyatları yerinə yetirir.
import { 
    getProducts, 
    getProductDetails, 
    updateProduct, 
    deleteProduct, 
    newProduct, 
    searchProducts, 
    createOrUpdateReview, 
    getProductReviews 
} from "../controller/productController.js";

// Authentication və authorization (icazə) middleware-ləri idxal edilir.
// isAuthenticatedUser: İstifadəçinin daxil olub olmadığını yoxlayır.
// authorizeRoles: İstifadəçinin müəyyən rollara sahib olub olmadığını yoxlayır.
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

// Səbət (cart) ilə bağlı əməliyyatları yerinə yetirən controller funksiyaları idxal edilir.
import { 
    addToCart, 
    getCartProducts, 
    removeFromCart, 
    updateCartQuantity 
} from "../controller/cartController.js";

// Favorilər (favorites) ilə bağlı əməliyyatları yerinə yetirən controller funksiyaları idxal edilir.
import { 
    addToFavorites, 
    getFavoriteProducts, 
    removeFromFavorites 
} from "../controller/favoriteController.js";

// Multer middleware-i idxal edilir. Bu, HTTP sorğularından gələn şəkillərin yüklənməsi üçün istifadə olunur.
import { uploadImages } from "../middleware/multer.js";

// Filtrləmə əməliyyatlarını yerinə yetirən controller funksiyası idxal edilir.
import { getFilteredProducts } from "../controller/filterController.js";

// ======================================================================
// Cart və Favorite Route-ları
// ======================================================================

// PUT sorğusu ilə '/products/cart/update/:productId' ünvanına daxil olan sorğunu işləyir.
// isAuthenticatedUser: İstifadəçinin daxil olub olmadığını yoxlayır.
// updateCartQuantity: Səbətdəki məhsul miqdarını güncəlləyir.
// :productId: URL parametridir, güncəllənəcək məhsulun ID-sini təmsil edir.
router.put('/products/cart/update/:productId', isAuthenticatedUser, updateCartQuantity);

// POST sorğusu ilə '/products/cart' ünvanına daxil olan sorğunu işləyir.
// isAuthenticatedUser middleware-i istifadəçinin daxil olub olmadığını yoxlayır.
// addToCart: İstifadəçinin seçdiyi məhsulu səbətə əlavə edir.
router.post("/products/cart", isAuthenticatedUser, addToCart);

// DELETE sorğusu ilə '/products/cart/:productId' ünvanına daxil olan sorğunu işləyir.
// removeFromCart: Səbətdən məhsulu silir.
router.delete("/products/cart/:productId", isAuthenticatedUser, removeFromCart);

// GET sorğusu ilə '/products/cart' ünvanına daxil olan sorğunu işləyir.
// getCartProducts: İstifadəçinin səbətindəki məhsulları əldə edir.
router.get("/products/cart", isAuthenticatedUser, getCartProducts);

// POST sorğusu ilə '/products/favorites' ünvanına daxil olan sorğunu işləyir.
// addToFavorites: İstifadəçinin favorilər siyahısına məhsul əlavə edir.
router.post("/products/favorites", isAuthenticatedUser, addToFavorites);

// GET sorğusu ilə '/products/filter' ünvanına daxil olan sorğunu işləyir.
// getFilteredProducts: Müxtəlif filter parametrlərinə əsaslanaraq məhsulları əldə edir.
router.get("/products/filter", getFilteredProducts);

// GET sorğusu ilə '/products/favorites' ünvanına daxil olan sorğunu işləyir.
// Bu sorğu, istifadəçinin bütün favori məhsullarını əldə etmək üçündür.
router.get("/products/favorites", isAuthenticatedUser, getFavoriteProducts);

// DELETE sorğusu ilə '/products/favorites/:productId' ünvanına daxil olan sorğunu işləyir.
// removeFromFavorites: Favorilər siyahısından məhsulu silir.
router.delete("/products/favorites/:productId", isAuthenticatedUser, removeFromFavorites);

// ======================================================================
// Məhsul və Axtarış Route-ları
// ======================================================================

// GET sorğusu ilə '/products/search' ünvanına daxil olan sorğunu işləyir.
// searchProducts: Məhsul adlarına görə axtarış aparır və nəticələri qaytarır.
router.get("/products/search", searchProducts);

// GET sorğusu ilə '/products' ünvanına daxil olan sorğunu işləyir.
// getProducts: Bütün məhsulların siyahısını əldə edir.
router.get("/products", getProducts);

// GET sorğusu ilə '/products/:id' ünvanına daxil olan sorğunu işləyir.
// getProductDetails: Müəyyən bir məhsulun detallarını əldə edir.
// :id: URL parametridir, məhsulun unikal ID-sini təmsil edir.
router.get("/products/:id", getProductDetails);

// ======================================================================
// Admin Məhsul Əməliyyatları
// ======================================================================

// PUT sorğusu ilə '/admin/products/:id' ünvanına daxil olan sorğunu işləyir.
// Bu route, admin hüququna malik istifadəçilər üçün nəzərdə tutulub.
// isAuthenticatedUser: İstifadəçinin daxil olub olmadığını yoxlayır.
// authorizeRoles("admin"): İstifadəçinin "admin" roluna sahib olub olmadığını yoxlayır.
// uploadImages: Şəkil yükləmək üçün Multer middleware-i tətbiq olunur.
// updateProduct: Məhsulu güncəlləyir.
router.put("/admin/products/:id", isAuthenticatedUser, authorizeRoles("admin"), uploadImages, updateProduct);

// DELETE sorğusu ilə '/admin/products/:id' ünvanına daxil olan sorğunu işləyir.
// Bu route admin hüququna malik istifadəçilər üçün nəzərdə tutulub.
// deleteProduct: Məhsulu silir.
router.delete("/admin/products/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// POST sorğusu ilə '/admin/products' ünvanına daxil olan sorğunu işləyir.
// Bu route, yeni məhsul yaratmaq üçün admin hüququna malik istifadəçilərə aiddir.
// uploadImages: Yeni məhsul üçün şəkillərin yüklənməsi üçün istifadə olunur.
// newProduct: Yeni məhsul yaradır.
router.post("/admin/products", isAuthenticatedUser, authorizeRoles("admin"), uploadImages, newProduct);

// ======================================================================
// Məhsul Rəyi Əməliyyatları
// ======================================================================

// POST sorğusu ilə '/products/review' ünvanına daxil olan sorğunu işləyir.
// createOrUpdateReview: İstifadəçi məhsul üçün rəy əlavə edir və ya mövcud rəyini güncəlləyir.
router.post("/products/review", isAuthenticatedUser, createOrUpdateReview);

// GET sorğusu ilə '/products/:id/reviews' ünvanına daxil olan sorğunu işləyir.
// getProductReviews: Müəyyən bir məhsulun bütün rəylərini və ortalama rating dəyərini əldə edir.
router.get("/products/:id/reviews", getProductReviews);

// ======================================================================
// Yaradılmış Router-in İxracı
// ======================================================================
// export default router;  
// Yaradılmış router default olaraq ixrac edilir ki, bu modul digər fayllarda istifadə olunsun.
export default router;
