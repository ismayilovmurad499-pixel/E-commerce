// mongoose modulunu idxal edirik. 
// Bu modul MongoDB ilə əlaqə yaratmaq, modellər və şemalar təyin etmək üçün istifadə olunur.
import mongoose from "mongoose";

// ----------------------------- Ümumi Seçimlər -----------------------------
// Discriminator üçün ümumi seçimlər obyektidir.
// - discriminatorKey: Hər bir discriminator sənədində hansı açarın (bu halda "category") saxlanacağını təyin edir.
// - timestamps: true – Hər bir sənədə avtomatik olaraq "createdAt" və "updatedAt" sahələri əlavə olunur.
const options = { discriminatorKey: "category", timestamps: true };

// ----------------------------- Əsas Məhsul Şeması -----------------------------
// Bu şema bütün məhsullar üçün ortaq olan xassələri müəyyən edir.
const productSchema = new mongoose.Schema(
  {
    // Məhsulun adı: String tipində, mütləq daxil edilməlidir və maksimum 255 simvol ola bilər.
    name: {
      type: String,
      required: [true, "Məhsul adını daxil edin"],
      maxLength: [255, "Məhsulun adı 255 simvoldan çox ola bilməz"],
    },
    // Məhsulun qiyməti: Number tipində və mütləq daxil edilməlidir.
    price: {
      type: Number,
      required: [true, "Qiyməti daxil edin"],
    },
    // Məhsulun təsviri: String tipində, daxil edilməsi zəruridir.
    description: {
      type: String,
      required: [true, "Açıqlama hissəsini daxil edin"],
    },
    // Məhsulun rəylərinin ümumi ortalaması: Number tipində, default olaraq 0 təyin edilir.
    ratings: {
      type: Number,
      default: 0,
    },
    // Məhsulun şəkilləri: Array şəklində obyektlərdən ibarətdir.
    // Hər bir obyektin içərisində "public_id" və "url" sahələri vardır və hər ikisi də tələb olunur.
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    // Məhsulun kateqoriyası: String tipində, daxil edilməlidir.
    // enum vasitəsilə yalnız müəyyən dəyərlər qəbul edilir: "Phones", "Laptops", "Cameras", "Headphones", "Console", "iPad".
    category: {
      type: String,
      required: [true, "Kateqoriyanı seçməlisiniz"],
      enum: ["Phones", "Laptops", "Cameras", "Headphones", "Console", "iPad"],
    },
    // Məhsulu satan şirkətin adı: String tipində və tələb olunur.
    seller: {
      type: String,
      required: [true, "Məhsulu satan şirkəti daxil edin"],
    },
    // Məhsulun stok miqdarı: Number tipində, daxil edilməsi vacibdir.
    stock: {
      type: Number,
      required: [true, "Stok miqdarını daxil edin"],
    },
    // Məhsula verilmiş rəylərin sayı: Number tipində, default olaraq 0.
    numOfReviews: {
      type: Number,
      default: 0,
    },
    // Məhsulun rəyləri: Array şəklində obyektlərdən ibarətdir.
    // Hər bir rəy obyektində istifadəçi (User modelinə referans), rating (rəqəmsal qiymət) və comment (mətn) sahələri var.
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
      },
    ],
    // Məhsulu yaradan istifadəçi: User modelinə referans verən ObjectId.
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  // Ümumi seçimlər obyektini (discriminatorKey və timestamps) burada tətbiq edirik.
  options
);

// Əsas məhsul modelini yaradırıq. 
// "Product" modeli vasitəsilə bütün ümumi xassələrə malik məhsullar üzərində əməliyyatlar aparılır.
const Product = mongoose.model("Product", productSchema);

/* ----------------------------- Phones Discriminator ----------------------------- */
// "Phones" kateqoriyasına aid məhsullar üçün xüsusi əlavə xassələri təyin edirik.
const phoneSchema = new mongoose.Schema({
  // Ekran ölçüsü: String tipində, tələb olunur.
  screenSize: {
    type: String,
    required: [true, "Screen size daxil edin"],
  },
  // Saxlama (storage): String tipində, tələb olunur.
  storage: {
    type: String,
    required: [true, "Storage məlumatını daxil edin"],
  },
  // RAM: String tipində, tələb olunur.
  ram: {
    type: String,
    required: [true, "RAM məlumatını daxil edin"],
  },
  // Ön kamera: String tipində, tələb olunur.
  frontCamera: {
    type: String,
    required: [true, "Front camera məlumatını daxil edin"],
  },
  // Arxa kamera: String tipində, tələb olunur.
  backCamera: {
    type: String,
    required: [true, "Back camera məlumatını daxil edin"],
  },
  // Batareya: String tipində, tələb olunur.
  battery: {
    type: String,
    required: [true, "Battery məlumatını daxil edin"],
  },
  // Prosessor: String tipində, tələb olunur.
  processor: {
    type: String,
    required: [true, "Processor məlumatını daxil edin"],
  },
  // Əməliyyat sistemi: String tipində, tələb olunur.
  operatingSystem: {
    type: String,
    required: [true, "Əməliyyat sistemi məlumatını daxil edin"],
  },
});
// Discriminator metodu vasitəsilə "Phones" kateqoriyası üçün xüsusi model yaradılır.
// Burada Product modelinin əsasında əlavə xassələr əlavə olunaraq "Phone" modeli yaradılır.
const Phone = Product.discriminator("Phones", phoneSchema);

/* ----------------------------- Laptops Discriminator ----------------------------- */
// "Laptops" kateqoriyasına aid məhsullar üçün xüsusi şema.
const laptopSchema = new mongoose.Schema({
  screenSize: {
    type: String,
    required: [true, "Screen size daxil edin"],
  },
  storage: {
    type: String,
    required: [true, "Storage məlumatını daxil edin"],
  },
  ram: {
    type: String,
    required: [true, "RAM məlumatını daxil edin"],
  },
  // Qrafik kartı (GPU): String tipində, tələb olunur.
  gpu: {
    type: String,
    required: [true, "GPU məlumatını daxil edin"],
  },
  // Kamera: String tipində, tələb olunur.
  camera: {
    type: String,
    required: [true, "Kamera məlumatını daxil edin"],
  },
  processor: {
    type: String,
    required: [true, "Processor məlumatını daxil edin"],
  },
  // Batareya ömrü: String tipində, tələb olunur.
  batteryLife: {
    type: String,
    required: [true, "Battery life məlumatını daxil edin"],
  },
  operatingSystem: {
    type: String,
    required: [true, "Əməliyyat sistemi məlumatını daxil edin"],
  },
});
// Product modelinin üzərində discriminator metodu ilə "Laptops" üçün xüsusi model yaradılır.
const Laptop = Product.discriminator("Laptops", laptopSchema);

/* ----------------------------- Cameras Discriminator ----------------------------- */
// "Cameras" kateqoriyasına aid məhsullar üçün xüsusi şema.
const cameraSchema = new mongoose.Schema({
  // Çözünürlük: String tipində, tələb olunur.
  resolution: {
    type: String,
    required: [true, "Resolution məlumatını daxil edin"],
  },
  // Optik zoom: String tipində, tələb olunur.
  opticalZoom: {
    type: String,
    required: [true, "Optical zoom məlumatını daxil edin"],
  },
  // Sensor növü: String tipində, tələb olunur.
  sensorType: {
    type: String,
    required: [true, "Sensor növünü daxil edin"],
  },
  // Şəkil sabitləşdirmə: String tipində, tələb olunur.
  imageStabilization: {
    type: String,
    required: [true, "Image stabilization məlumatını daxil edin"],
  },
});
// Discriminator metodu ilə "Cameras" kateqoriyası üçün xüsusi model yaradılır.
const Camera = Product.discriminator("Cameras", cameraSchema);

/* ----------------------------- Headphones Discriminator ----------------------------- */
// "Headphones" kateqoriyasına aid məhsullar üçün xüsusi şema.
const headphoneSchema = new mongoose.Schema({
  // Əlaqə (connectivity): String tipində, tələb olunur.
  connectivity: {
    type: String,
    required: [true, "Connectivity məlumatını daxil edin"],
  },
  // Batareya ömrü: String tipində, tələb olunur.
  batteryLife: {
    type: String,
    required: [true, "Battery life məlumatını daxil edin"],
  },
  // Səs-küyün azaldılması (noise cancellation): String tipində, tələb olunur.
  noiseCancellation: {
    type: String,
    required: [true, "Noise cancellation məlumatını daxil edin"],
  },
});
// "Headphones" kateqoriyası üçün Product modelinin discriminator-u yaradılır.
const Headphone = Product.discriminator("Headphones", headphoneSchema);

/* ----------------------------- Console Discriminator ----------------------------- */
// "Console" kateqoriyasına aid məhsullar üçün xüsusi şema.
const consoleSchema = new mongoose.Schema({
  // CPU: String tipində, tələb olunur.
  cpu: {
    type: String,
    required: [true, "CPU məlumatını daxil edin"],
  },
  // GPU: String tipində, tələb olunur.
  gpu: {
    type: String,
    required: [true, "GPU məlumatını daxil edin"],
  },
  // Storage: String tipində, tələb olunur.
  storage: {
    type: String,
    required: [true, "Storage məlumatını daxil edin"],
  },
  // Memory: String tipində, tələb olunur.
  memory: {
    type: String,
    required: [true, "Memory məlumatını daxil edin"],
  },
  // Dəstəklənən çözünürlük: String tipində, tələb olunur.
  supportedResolution: {
    type: String,
    required: [true, "Dəstəklənən çözünürlük məlumatını daxil edin"],
  },
  // Əlaqə (connectivity): String tipində, tələb olunur.
  connectivity: {
    type: String,
    required: [true, "Connectivity məlumatını daxil edin"],
  },
  // Kontrollerin daxil olub olmaması: Boolean tipindədir və default olaraq true təyin edilir.
  controllerIncluded: {
    type: Boolean,
    default: true,
  },
});
// "Console" kateqoriyası üçün xüsusi model yaradılır.
const Console = Product.discriminator("Console", consoleSchema);

/* ----------------------------- iPad Discriminator ----------------------------- */
// "iPad" kateqoriyasına aid məhsullar üçün xüsusi şema.
const iPadSchema = new mongoose.Schema({
  // Ekran ölçüsü: String tipində, tələb olunur.
  screenSize: {
    type: String,
    required: [true, "Screen size daxil edin"],
  },
  // Storage: String tipində, tələb olunur.
  storage: {
    type: String,
    required: [true, "Storage məlumatını daxil edin"],
  },
  // RAM: String tipində, tələb olunur.
  ram: {
    type: String,
    required: [true, "RAM məlumatını daxil edin"],
  },
  // Batareya: String tipində, tələb olunur.
  battery: {
    type: String,
    required: [true, "Battery məlumatını daxil edin"],
  },
  // Prosessor: String tipində, tələb olunur.
  processor: {
    type: String,
    required: [true, "Processor məlumatını daxil edin"],
  },
  // Əməliyyat sistemi: String tipində, tələb olunur.
  operatingSystem: {
    type: String,
    required: [true, "Əməliyyat sistemi məlumatını daxil edin"],
  },
  // Kamera: String tipində, tələb olunur.
  camera: {
    type: String,
    required: [true, "Kamera məlumatını daxil edin"],
  },
  // Cellular variantı: Boolean tipində, tələb olunur.
  cellular: {
    type: Boolean,
    required: [true, "Cellular variantını daxil edin"],
  },
});
// "iPad" kateqoriyası üçün xüsusi model yaradılır.
const iPad = Product.discriminator("iPad", iPadSchema);

// ----------------------------- Modellərin İxracı -----------------------------
// Yaradılmış bütün modelləri ixrac edirik ki, digər modul və fayllarda istifadə olunsun.
export { Product, Phone, Laptop, Camera, Headphone, Console, iPad };
