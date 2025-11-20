// mongoose modulunu idxal edirik. Bu modul MongoDB ilə işləmək üçün istifadə olunur.
import mongoose from "mongoose";

// bcryptjs modulunu idxal edirik. Bu modul şifrələrin hash-lənməsi və müqayisəsi üçün istifadə olunur.
import bcrypt from "bcryptjs";

// jsonwebtoken modulunu idxal edirik. Bu modul JWT (JSON Web Token) yaratmaq və yoxlamaq üçün istifadə olunur.
import jwt from "jsonwebtoken";

// crypto modulunu idxal edirik. Bu modul kriptoqrafik əməliyyatlar (məsələn, random bytes, hash-ləmə) üçün istifadə olunur.
import crypto from "crypto";

// İstifadəçi üçün yeni bir schema (şema) yaradılır.
// Burada istifadəçi sənədlərində saxlanacaq bütün xassələr (fields) müəyyən edilir.
const userSchema = new mongoose.Schema(
  {
    // "name" sahəsi: İstifadəçinin adı.
    name: {
      type: String, // Məlumat tipi: String
      required: [true, "Adinizi daxil edin"], // Bu sahə mütləq doldurulmalıdır; əgər doldurulmazsa göstəriləcək mesaj.
      maxLength: [50, "Adiniz maksimum 50 simvoldan ibaret olmalidir"] // Maksimum simvol sayı 50-dir.
    },
    // "email" sahəsi: İstifadəçinin email ünvanı.
    email: {
      type: String, // Məlumat tipi: String
      required: [true, "Emailinizi daxil edin"], // Mütləq doldurulmalıdır.
      unique: true // Hər email unikal olmalıdır.
    },
    // "password" sahəsi: İstifadəçinin şifrəsi.
    password: {
      type: String, // Məlumat tipi: String
      required: [true, "Shifrenizi daxil edin"], // Mütləq doldurulmalıdır.
      select: false, // Default olaraq bu sahə sorğularda göstərilməyəcək (gizlidir).
      minLength: [8, "Shifrenin minimum uzunlugu 8 simvol olmalidir"] // Minimum uzunluq 8 simvol.
    },
    // "avatar" sahəsi: İstifadəçinin profil şəklinə aid məlumatlar.
    // Bu obyekt daxilində "public_id" və "url" sahələri saxlanılır.
    avatar: {
      public_id: String, // Şəkilin cloud service-də saxlanılması üçün public identifikator.
      url: String // Şəklin internetdəki ünvanı.
    },
    // "role" sahəsi: İstifadəçi rolunu təyin edir (məsələn, "user", "admin").
    role: {
      type: String, // Məlumat tipi: String
      default: "user" // Əgər rol verilməyibsə, default olaraq "user" təyin edilir.
    },
    // Şifrə sıfırlama üçün token:
    resetPasswordToken: String, // Yaratılan token dəyəri
    resetPasswordExpire: Date // Token-in bitmə vaxtı (expire)
  },
  {
    // Schema konfiqurasiya seçimləri:
    // timestamps: true - Hər bir sənədə avtomatik olaraq "createdAt" və "updatedAt" sahələri əlavə olunur.
    timestamps: true
  }
);

// ----------------------------------------------------------------------
// Pre-save Hook: Şifrəni hash-ləmək
// ----------------------------------------------------------------------
// Bu middleware hər dəfə istifadəçi sənədi yadda saxlanmazdan (save) əvvəl işləyir.
// Əgər "password" sahəsi dəyişdirilibsə, o zaman şifrə hash-lənir.
userSchema.pre("save", async function (next) {
  // "this" cari istifadəçi sənədini təmsil edir.
  // Əgər şifrə dəyişdirilməyibsə, hash-ləmə prosesinə ehtiyac yoxdur.
  if (!this.isModified("password")) {
    next(); // Növbəti middleware-ə keçid.
  }
  // Əks halda, bcrypt.hash() metodu vasitəsilə şifrə 10 "salt rounds" ilə hash-lənir.
  this.password = await bcrypt.hash(this.password, 10);
  // Hash-ləmə tamamlandıqdan sonra növbəti middleware-ə keçid edilir.
});

// ----------------------------------------------------------------------
// Metod: jwtTokeniEldeEt (JWT tokenini əldə et)
// ----------------------------------------------------------------------
// Bu metod istifadəçi sənədindən JWT token yaradır.
// Token-in içərisində istifadəçinin _id-sini saxlayır və müəyyən müddət üçün etibarlı olur.
userSchema.methods.jwtTokeniEldeEt = function () {
  return jwt.sign(
    {
      id: this._id, // Token payload hissəsində istifadəçinin ID-si saxlanılır.
    },
    process.env.JWT_SECRET_KEY, // Token-i imzalamaq üçün istifadə olunan gizli açar.
    {
      expiresIn: String(process.env.JWT_EXPIRES_TIME) // Token-in etibarlılıq müddəti (saniyə, dəqiqə və s.).
    }
  );
};

// ----------------------------------------------------------------------
// Metod: shifreleriMuqayiseEt (Şifrələri müqayisə et)
// ----------------------------------------------------------------------
// Bu asinxron metod daxil edilən şifrə ilə verilənlər bazasında saxlanılan hash-lənmiş şifrəni müqayisə edir.
userSchema.methods.shifreleriMuqayiseEt = async function (enteredPassword) {
  // bcrypt.compare() metodu daxil edilən şifrəni hash-lənmiş şifrə ilə müqayisə edir və true/false qaytarır.
  return await bcrypt.compare(enteredPassword, this.password);
};

// ----------------------------------------------------------------------
// Metod: getResetPasswordToken (Şifrə sıfırlama tokeni əldə et)
// ----------------------------------------------------------------------
// Bu metod yeni bir reset token yaradır, onu hash-ləyir və istifadəçi sənədində saxlayır.
// Eyni zamanda, tokenin etibarlılıq müddətini təyin edir (məsələn, 30 dəqiqə).
userSchema.methods.getResetPasswordToken = function () {
  // crypto.randomBytes(20) metodu 20 bayt random məlumat yaradır.
  // .toString("hex") ilə bu məlumat hexadecimal string-ə çevrilir.
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Yaradılan token, SHA-256 alqoritmi ilə hash-lənir.
  // crypto.createHash("sha256") - SHA-256 hash obyektini yaradır.
  // .update(resetToken) - resetToken dəyəri hash obyektinə daxil edilir.
  // .digest("hex") - hash dəyəri hexadecimal formatda əldə edilir.
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Tokenin etibarlılıq müddəti indiki vaxtdan 30 dəqiqə (30*60*1000 ms) sonrakı vaxt kimi təyin olunur.
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  // Əsas reset token orijinal (hash-lənməmiş) dəyəri geri qaytarılır.
  // Bu dəyər email vasitəsilə istifadəçiyə göndərilə bilər.
  return resetToken;
};

// ----------------------------------------------------------------------
// Modelin İxracı
// ----------------------------------------------------------------------
// mongoose.model("User", userSchema) metodu "User" adlı model yaradır və bu model userSchema əsasında yaradılır.
// Bu model vasitəsilə istifadəçi sənədləri üzərində CRUD əməliyyatları həyata keçirilə bilər.
export default mongoose.model("User", userSchema);
