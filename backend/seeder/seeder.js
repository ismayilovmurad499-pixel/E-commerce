// Mongoose modulunu idxal edirik. 
// Mongoose, Node.js tətbiqində MongoDB ilə əlaqə yaratmaq və sənəd modelləri üzərində əməliyyatlar aparmaq üçün istifadə olunur.
import mongoose from "mongoose";

// "./data.js" faylından məhsul məlumatlarını idxal edirik.
// Bu, yüklənəcək (seed) məhsulların siyahısını ehtiva edən verilənlərdir.
import products from "./data.js";

// "../model/Product.js" faylından Product modelini idxal edirik.
// Bu model, MongoDB-də "Product" kolleksiyasında saxlanacaq məhsul sənədlərinin strukturunu müəyyən edir.
import Product from "../model/Product.js";

// "seedProducts" asinxron funksiyası yaradılır.
// Bu funksiya verilənlər bazasına qoşulur, mövcud məhsulları silir və yeni məhsul məlumatlarını əlavə edir.
const seedProducts = async () => {
    try {
        // Mongoose vasitəsilə MongoDB verilənlər bazasına qoşuluruq.
        // "mongodb://localhost:27017/e-commerce" - Bu URL, yerli (local) MongoDB serverinə qoşulma ünvanıdır,
        // burada "e-commerce" verilənlər bazasının adı kimi istifadə olunur.
        await mongoose.connect("mongodb://localhost:27017/e-commerce");

        // "Product.deleteMany()" metodu vasitəsilə, "Product" kolleksiyasında mövcud olan bütün sənədlər silinir.
        // Bu, verilənlər bazasında təmiz bir başlanğıc təmin etmək üçün edilir.
        await Product.deleteMany();
        // Konsola məlumat yazırıq ki, məhsulların silindiyi bildirilsin.
        console.log("Mehsullar silindi");

        // "Product.insertMany(products)" metodu vasitəsilə, idxal edilmiş "products" array-ində olan
        // məhsul obyektləri MongoDB-də "Product" kolleksiyasına əlavə olunur.
        await Product.insertMany(products);
        // Konsola məlumat yazırıq ki, məhsulların uğurla əlavə edildiyi bildirilsin.
        console.log("Mehsullar elave edildi...");

        // "process.exit()" metodu, Node.js prosesini uğurla (exit code 0 ilə) bitirmək üçün çağırılır.
        // Bu, seed əməliyyatları tamamlandıqdan sonra proqramın bağlanmasını təmin edir.
        process.exit();
    } catch (err) {
        // Əgər try blokunda hər hansı xəta baş verərsə, catch bloku işə düşür.
        // "process.exit(1)" metodu, xəta səbəbindən proqramı 1 exit code ilə (xəta ilə) bitirir.
        process.exit(1);
    }
};

// "seedProducts()" funksiyası çağırılır ki, yuxarıdakı əməliyyatlar icra olunsun.
seedProducts();
