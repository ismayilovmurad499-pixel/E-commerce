// express modulunu idxal edirik: HTTP serveri yaratmaq, route-ları təyin etmək və middleware-ləri istifadə etmək üçün istifadə olunur.
import express from "express";

// dotenv modulunu idxal edirik: .env faylından mühit dəyişənlərini (environment variables) oxumaq üçün istifadə olunur.
import dotenv from "dotenv";

// connectDatabase funksiyasını idxal edirik: Bu funksiya MongoDB verilənlər bazasına qoşulmanı təmin edir.
import { connectDatabase } from "./config/dbConnect.js";

// cors modulunu idxal edirik: Müxtəlif domenlərdən gələn sorğulara icazə vermək üçün istifadə olunur.
import cors from "cors";

// productsRouter idxal olunur: Məhsullarla bağlı əməliyyatları idarə edən route-ları ehtiva edir.
import productsRouter from "./routes/product.js";

// userRouter idxal olunur: İstifadəçi autentifikasiyası və qeydiyyatı ilə bağlı əməliyyatları idarə edən route-ları ehtiva edir.
import userRouter from "./routes/auth.js";

// errorsMiddleware idxal olunur: Serverdə yaranan xətaları tutub müvafiq şəkildə cavab qaytaran error handler middleware-dir.
import errorsMiddleware from "./middleware/errors.js";

// cookieParser idxal olunur: HTTP sorğularında göndərilən cookie-ləri parse etmək üçün istifadə olunur.
import cookieParser from "cookie-parser";

// cartRouter idxal olunur: Burada sepet (cart) ilə bağlı əməliyyatları idarə edən router daxil edilir.
// Qeyd: Bu sətirdə "./routes/product.js" faylı cart router-i kimi idxal olunur. (Əgər cart router ayrıca mövcuddursa, fayl adı fərqli ola bilər.)
import cartRouter from "./routes/product.js"; 
import paymentRoutes from './routes/paymentRoutes.js';
// Sepet router'ını içe aktar

// dotenv.config() metodu vasitəsilə mühit dəyişənləri .env (bu halda, config/config.env) faylından yüklənir.
dotenv.config({
    path: "config/config.env"
});

// Yeni Express tətbiqini (app) yaradırıq.
const app = express();

// CORS middleware-i tətbiq edirik: Müştəri sorğularının domenlərarası mübadiləsini idarə edir.
// origin: Müştəri URL-i ("http://localhost:5173") icazə verilir.
// methods: Gözlənilən HTTP metodları (GET, POST, PUT, DELETE) təyin edilir.
// credentials: true olaraq təyin edilir ki, cookie və digər autentifikasiya məlumatları göndərilə bilsin.
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Verilənlər bazasına qoşulmanı həyata keçiririk.
connectDatabase();

// express.json() middleware-i vasitəsilə HTTP sorğusunun body hissəsində gələn JSON məlumatları parse olunur.
// Bu, req.body obyektinin düzgün formada əldə edilməsini təmin edir.
app.use(express.json());

// cookieParser() middleware-i vasitəsilə HTTP sorğularında gələn cookie-lər parse edilir,
// beləliklə, req.cookies obyektində cookie-lərə asanlıqla daxil olmaq mümkün olur.
app.use(cookieParser());

// Router-lərin tə'yini:
// /commerce/mehsullar URL-i ilə başlayan bütün sorğular üçün productsRouter, userRouter və cartRouter middleware-ləri tətbiq olunur.
// Bu deməkdir ki, bu URL altında müvafiq route-lar vasitəsilə məhsullar, istifadəçi əməliyyatları və sepet əməliyyatları idarə olunur.
app.use("/commerce/mehsullar", productsRouter, userRouter, cartRouter, paymentRoutes);

// Xəta idarəetmə middleware-i tətbiq olunur: Əvvəlki middleware-lərdə yaranan xətalar bu middleware vasitəsilə tutularaq cavab qaytarılır.
app.use(errorsMiddleware);

// Serveri işə salırıq:
// app.listen() metodu serveri müəyyən edilmiş PORT üzərində işə salır.
// process.env.PORT mühit dəyişənindən port nömrəsi götürülür.
// Callback funksiyası vasitəsilə serverin hansı portda işə düşdüyü konsola yazdırılır.
app.listen(process.env.PORT, () => console.log("Server " + process.env.PORT + " - ci portda calisir..."));
