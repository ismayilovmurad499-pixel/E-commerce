// "Product" modelini idxal edirik. Bu model MongoDB-dəki "products" kolleksiyasına aid sənədlərlə işləmək üçün istifadə olunur.
import { Product } from "../model/Product.js"; // Modelin yerləşdiyi yerə uyğun düzəldin

// "getFilteredProducts" asinxron funksiyası HTTP sorğusuna əsaslanaraq məhsulları filterləyir və cavab olaraq qaytarır.
export const getFilteredProducts = async (req, res) => {
  try {
    // ----------------------------------------------------------------------------------
    // URL query parametrlərindən bütün filter dəyərlərini əldə edirik.
    // "req.query" obyektində URL-dəki bütün query parametrlər mövcuddur.
    // Hər bir dəyişən müştəri tərəfindən göndərilə bilən filter dəyərlərini təmsil edir.
    // ----------------------------------------------------------------------------------
    const {
      name,               // Məhsul adı üçün filter
      seller,             // Satıcı üçün filter
      priceMin,           // Minimal qiymət
      priceMax,           // Maksimal qiymət
      category,           // Məhsul kateqoriyası
      // Phones, iPad və digər kateqoriyalara aid xassələr:
      color,              // Rəng
      screenSize,         // Ekran ölçüsü
      storage,            // Saxlama həcmi
      ram,                // RAM (yaddaş)
      frontCamera,        // Ön kamera
      backCamera,         // Arxa kamera
      battery,            // Batareya
      processor,          // Prosessor
      operatingSystem,    // Əməliyyat sistemi
      // Laptops üçün əlavə xassələr:
      gpu,                // Qrafik kartı (GPU)
      camera,             // Kamera
      batteryLife,        // Batareya ömrü
      // Cameras üçün əlavə xassələr:
      resolution,         // Çözünürlük
      opticalZoom,        // Optik zoom
      sensorType,         // Sensor növü
      imageStabilization, // Şəkil sabitləşdirmə
      // Headphones üçün xassələr:
      connectivity,       // Əlaqə növü (Bluetooth, kabel və s.)
      noiseCancellation,  // Səs-küyü azaldan xüsusiyyət
      // Console üçün xassələr:
      cpu,                // Prosessor (CPU)
      memory,             // Yaddaş (RAM və ya daxili yaddaş)
      supportedResolution,// Dəstəklənən ekran çözünürlüğü
      controllerIncluded, // Kontrollerin daxil olub olmaması (boolean dəyər kimi)
      // iPad üçün əlavə xassələr:
      cellular,           // Hüceyrə şəbəkəsi dəstəyi (boolean dəyər kimi)
      // Sıralama (sort) parametri:
      sort,               // Məhsulların sıralanma qaydasını təyin edir (məsələn, rating, price-low, price-high, newest)
    } = req.query;

    // ----------------------------------------------------------------------------------
    // Dinamik filter query obyektini yaradırıq.
    // Bu obyekt MongoDB üçün filter şərtlərini saxlayacaq.
    // ----------------------------------------------------------------------------------
    let filterQuery = {};

    // ----------------------------------------------------------------------------------
    // Ümumi (common) xassələr üzrə filterlər
    // ----------------------------------------------------------------------------------
    if (name) {
      // Məhsul adı üzrə filter:
      // $regex operatoru hissə-hissə (partial) axtarış aparır,
      // $options: "i" – böyük/kiçik hərf həssaslığını aradan qaldırır.
      filterQuery.name = { $regex: name, $options: "i" };
    }

    if (seller) {
      // "seller" dəyəri vergüllə ayrılmış string kimi göndərilə bilər.
      // split() metodu ilə string-i vergülə görə parçalayırıq,
      // map() ilə hər hissəni trim() edərək boşluqları silirik.
      const sellersArray = seller.split(",").map((s) => s.trim());
      // $in operatoru, seller dəyəri bu array daxilindədirsə filter tətbiq edir.
      filterQuery.seller = { $in: sellersArray };
    }

    if (priceMin || priceMax) {
      // Qiymət üçün obyekt yaradırıq
      filterQuery.price = {};
      // $gte: qiymət minimum dəyərdən böyük və ya bərabər olmalıdır
      if (priceMin) filterQuery.price.$gte = Number(priceMin);
      // $lte: qiymət maksimum dəyərdən kiçik və ya bərabər olmalıdır
      if (priceMax) filterQuery.price.$lte = Number(priceMax);
    }

    if (category) {
      // Məhsulun kateqoriyasına görə filter tətbiq olunur.
      filterQuery.category = category;
    }

    // ----------------------------------------------------------------------------------
    // Məhsula aid spesifik xassələr üzrə filterlər (əgər query parametrləri verilibsə)
    // Hər bir "if" şərti, əgər müvafiq filter dəyəri varsa filterQuery obyektinə həmin sahəni əlavə edir.
    // ----------------------------------------------------------------------------------
    if (color) filterQuery.color = color;
    if (screenSize) filterQuery.screenSize = screenSize;
    if (storage) filterQuery.storage = storage;
    if (ram) filterQuery.ram = ram;
    if (frontCamera) filterQuery.frontCamera = frontCamera;
    if (backCamera) filterQuery.backCamera = backCamera;
    if (battery) filterQuery.battery = battery;
    if (processor) filterQuery.processor = processor;
    if (operatingSystem) filterQuery.operatingSystem = operatingSystem;
    if (gpu) filterQuery.gpu = gpu;
    if (camera) filterQuery.camera = camera;
    if (batteryLife) filterQuery.batteryLife = batteryLife;
    if (resolution) filterQuery.resolution = resolution;
    if (opticalZoom) filterQuery.opticalZoom = opticalZoom;
    if (sensorType) filterQuery.sensorType = sensorType;
    if (imageStabilization) filterQuery.imageStabilization = imageStabilization;
    if (connectivity) filterQuery.connectivity = connectivity;
    if (noiseCancellation) filterQuery.noiseCancellation = noiseCancellation;
    if (cpu) filterQuery.cpu = cpu;
    if (memory) filterQuery.memory = memory;
    if (supportedResolution) filterQuery.supportedResolution = supportedResolution;
    
    // ----------------------------------------------------------------------------------
    // Boolean dəyərlər üçün çevirmə: 
    // "controllerIncluded" və "cellular" kimi sahələr string olaraq "true" və ya "false" ola bilər.
    // Bu dəyərləri boolean tipə çevirmək üçün müqayisə edirik.
    // ----------------------------------------------------------------------------------
    if (controllerIncluded !== undefined)
      filterQuery.controllerIncluded = controllerIncluded === "true";
    if (cellular !== undefined)
      filterQuery.cellular = cellular === "true";

    // ----------------------------------------------------------------------------------
    // Sıralama üçün "sortOptions" obyektini yaradırıq.
    // Bu obyekt, Mongoose-un .sort() metoduna veriləcək.
    // ----------------------------------------------------------------------------------
    let sortOptions = {};
    if (sort) {
      if (sort === "rating") {
        // "rating" üzrə azalan sırada sıralamaq (ən yüksək rəylər əvvəl)
        sortOptions.rating = -1;
      } else if (sort === "price-low") {
        // Qiymət üzrə artan sırada sıralamaq (əvvəl ucuz məhsullar)
        sortOptions.price = 1;
      } else if (sort === "price-high") {
        // Qiymət üzrə azalan sırada sıralamaq (əvvəl baha məhsullar)
        sortOptions.price = -1;
      } else if (sort === "newest") {
        // "createdAt" sahəsinə əsaslanaraq, ən yeni məhsulları əvvəl göstərmək
        sortOptions.createdAt = -1;
      }
    }

    // ----------------------------------------------------------------------------------
    // Mongoose vasitəsilə filter query obyektini icra edirik:
    // "Product.find(filterQuery)" verilən filter şərtlərinə uyğun məhsulları tapır,
    // .sort(sortOptions) isə tapılan nəticələri təyin olunmuş qaydada sıralayır.
    // ----------------------------------------------------------------------------------
    const products = await Product.find(filterQuery).sort(sortOptions);

    // ----------------------------------------------------------------------------------
    // HTTP cavabını göndəririk:
    // res.status(200) - cavabın status kodunu 200 (OK) təyin edir.
    // res.json() - cavabı JSON formatında müştəriyə göndərir.
    // "success: true" əməliyyatın uğurlu olduğunu bildirir.
    // "products" tapılmış məhsulların siyahısını ehtiva edir.
    // ----------------------------------------------------------------------------------
    return res.status(200).json({ success: true, products });
  } catch (error) {
    // ----------------------------------------------------------------------------------
    // Əgər try blokunda xəta baş verərsə, xəta konsola yazılır və
    // res.status(500) vasitəsilə 500 (Server Error) status kodu ilə JSON cavabı göndərilir.
    // "error.message" xətanın mesajını ehtiva edir.
    // ----------------------------------------------------------------------------------
    console.error("Məhsulları filterləmə zamanı xəta:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
