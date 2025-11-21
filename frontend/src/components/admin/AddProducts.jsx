"use client"; // Bu direktiv komponentin müştəri tərəfində (browserdə) render olunacağını göstərir.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Redux Toolkit Query API-dən idxallar
import {
  useAddProductMutation, // Yeni məhsul əlavə etmək üçün mutasiya hook-u
  useGetProductsQuery, // Məhsul siyahısını yenidən yükləmək üçün sorgu hook-u
} from "../../redux/api/productsApi";

/**
 * @component AddProduct
 * @description Yeni məhsul əlavə etmək üçün form komponenti.
 * Məhsulun ümumi və kateqoriyaya xas xüsusiyyətlərini (spesifikasiyalarını) qeyd etməyə imkan verir.
 */
const AddProduct = () => {
  // --- STATE İDARƏETMƏSİ ---

  // Form sahələri üçün ilkin dəyərlər. Boş string və ya false (checkbox üçün).
  const initialState = {
    name: "",
    price: "",
    description: "",
    category: "",
    seller: "",
    stock: "",
    ratings: "",
    screenSize: "",
    storage: "",
    ram: "",
    battery: "",
    processor: "",
    operatingSystem: "",
    frontCamera: "",
    backCamera: "",
    gpu: "",
    camera: "",
    batteryLife: "",
    resolution: "",
    opticalZoom: "",
    sensorType: "",
    imageStabilization: "",
    connectivity: "",
    noiseCancellation: "",
    cpu: "",
    memory: "",
    supportedResolution: "",
    controllerIncluded: false,
    cellular: false,
  };

  // 1. Form məlumatları üçün state
  const [formData, setFormData] = useState(initialState);
  // 2. Yüklənən şəkil faylları üçün state (maksimum 15 ədəd)
  const [images, setImages] = useState([]);
  // 3. Şəkil yükləmə zamanı yaranan xəta mesajı üçün state
  const [imageError, setImageError] = useState("");

  // --- HOOK İSTİFADƏSİ ---

  // Redux Toolkit Query mutasiyası: məhsul əlavə etmə funksiyası
  const [addProduct] = useAddProductMutation();
  // Redux Toolkit Query sorgusu: məhsul siyahısını yeniləmə funksiyası
  const { refetch } = useGetProductsQuery();
  // React Router yönləndirmə funksiyası
  const navigate = useNavigate();

  // --- FUNKSİYALAR ---

  /**
   * @function handleInputChange
   * @description Input və ya textarea elementlərindəki dəyişiklikləri izləyir və formData state-i yeniləyir.
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Checkbox tipindəki elementlər üçün dəyər `checked` (true/false) olur.
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue, // Dəyişən inputun dəyərini adı (name) ilə yenilə
    }));
  };

  /**
   * @function handleFileChange
   * @description Fayl inputunda seçilən şəkilləri idarə edir.
   * Şəkillərin sayını yoxlayır və xəta mesajını təyin edir.
   */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 15;

    if (files.length > maxImages) {
      // Maksimum say aşıldıqda xəbərdarlıq və sıfırlama
      setImageError(`Maksimum ${maxImages} şəkil yükləyə bilərsiniz.`);
      setImages([]);
    } else {
      // Normal yükləmə
      setImageError("");
      setImages(files);
    }
  };

  /**
   * @function handleSubmit
   * @description Form göndərilmə hadisəsini idarə edir.
   * Məlumatları `FormData` obyekti şəklində serverə göndərir və nəticəni emal edir.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Səhifənin yenilənməsinin qarşısını alır

    // Şəkil xətası varsa, prosesi dayandır
    if (imageError) {
      Swal.fire({
        title: "Xəta!",
        text: "Zəhmət olmasa 15-dən çox olmayan şəkil yükləyin.",
        icon: "error",
        confirmButtonText: "Tamam",
      });
      return;
    }

    // `multipart/form-data` formatı üçün FormData obyekti yaradılır
    const form = new FormData();

    // 1. formData-dakı mətn dəyərlərini FormData-ya əlavə et
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    // 2. Şəkil fayllarını FormData-ya əlavə et
    images.forEach((file) => {
      form.append("newImages", file);
    });

    try {
      // Redux mutasiyasını çağır (API sorğusu)
      await addProduct(form).unwrap();

      // Uğurlu bildiriş
      Swal.fire({
        title: "Uğurla əlavə edildi! 🎉",
        text: "Məhsul uğurla əlavə edildi.",
        icon: "success",
        confirmButtonText: "Əla",
      });

      // Məhsul siyahısını yenidən yüklə və admin səhifəsinə yönləndir
      await refetch();
      navigate("/admin/products");

      // Formu sıfırla
      setFormData(initialState);
      setImages([]);
    } catch (error) {
      // Xəta bildirişi
      console.error("Məhsul əlavə edilərkən xəta baş verdi:", error);
      Swal.fire({
        title: "Xəta!",
        text: "Məhsul əlavə edilərkən xəta baş verdi.",
        icon: "error",
        confirmButtonText: "Bağla",
      });
    }
  };

  // --- RENDER HİSSƏSİ (JSX) ---

  return (
    <div className="max-w-4xl mx-auto mt-10 p-10 bg-white rounded-xl shadow-2xl border border-gray-200">
      {/* Başlıq */}
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Yeni Məhsul Əlavə Et
      </h2>

      {/* Əsas Form */}
      <form
        className="space-y-6"
        onSubmit={handleSubmit}
        encType="multipart/form-data" // Fayl yükləmə üçün vacibdir
      >
        {/*
          ==================================
          1. Əsas Məhsul Məlumatları (Bütün Kateqoriyalar üçün Ümumi)
          ==================================
        */}
        <fieldset className="space-y-6 p-4 border border-gray-300 rounded-lg">
          <legend className="text-xl font-bold text-gray-700 px-2">Ümumi Məlumatlar</legend>
          {/* Ad */}
          <input
            type="text"
            name="name"
            placeholder="Ad"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          />
          {/* Qiymət */}
          <input
            type="number"
            name="price"
            placeholder="Qiymət"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          />
          {/* Açıqlama */}
          <textarea
            name="description"
            placeholder="Açıqlama"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          ></textarea>
          {/* Kateqoriya Seçimi */}
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          >
            <option value="" disabled>Kateqoriya Seç</option>
            <option value="Phones">Telefonlar</option>
            <option value="Laptops">Noutbuklar</option>
            <option value="Cameras">Kameralar</option>
            <option value="Headphones">Qulaqcıqlar</option>
            <option value="Console">Oyun Konsolları</option>
            <option value="iPad">Planşetlər</option>
          </select>
          {/* Satıcı */}
          <input
            type="text"
            name="seller"
            placeholder="Satıcı"
            value={formData.seller}
            onChange={handleInputChange}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          />
          {/* Stok */}
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={formData.stock}
            onChange={handleInputChange}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          />
          {/* Rating */}
          <input
            type="number"
            step="0.1"
            name="ratings"
            placeholder="Rating (məsələn, 4.5)"
            value={formData.ratings}
            onChange={handleInputChange}
            max="5"
            min="0"
            className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          />
        </fieldset>

        {/*
          ==================================
          2. Kateqoriyaya Xas Spesifikasiyalar
          ==================================
        */}
        {formData.category && (
          <fieldset className="space-y-6 p-4 border border-gray-300 rounded-lg">
            <legend className="text-xl font-bold text-gray-700 px-2">
              {formData.category} Spesifikasiyaları
            </legend>

            {/* Əgər kateqoriya "Phones" seçilibsə */}
            {formData.category === "Phones" && (
              <>
                <input type="text" name="screenSize" placeholder="Ekran Ölçüsü" value={formData.screenSize} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="storage" placeholder="Daxili Yaddaş (Storage)" value={formData.storage} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="ram" placeholder="RAM" value={formData.ram} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="frontCamera" placeholder="Ön Kamera" value={formData.frontCamera} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="backCamera" placeholder="Arxa Kamera" value={formData.backCamera} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="battery" placeholder="Batareya" value={formData.battery} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="processor" placeholder="Prosessor" value={formData.processor} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="operatingSystem" placeholder="Əməliyyat Sistemi" value={formData.operatingSystem} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
              </>
            )}

            {/* Əgər kateqoriya "Laptops" seçilibsə */}
            {formData.category === "Laptops" && (
              <>
                <input type="text" name="screenSize" placeholder="Ekran Ölçüsü" value={formData.screenSize} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="storage" placeholder="Yaddaş (Storage)" value={formData.storage} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="ram" placeholder="RAM" value={formData.ram} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="gpu" placeholder="GPU" value={formData.gpu} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="camera" placeholder="Kamera" value={formData.camera} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="processor" placeholder="Prosessor" value={formData.processor} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="batteryLife" placeholder="Batareya Ömrü" value={formData.batteryLife} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="operatingSystem" placeholder="Əməliyyat Sistemi" value={formData.operatingSystem} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
              </>
            )}

            {/* Əgər kateqoriya "Cameras" seçilibsə */}
            {formData.category === "Cameras" && (
              <>
                <input type="text" name="resolution" placeholder="Çözümlülük (Resolution)" value={formData.resolution} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="opticalZoom" placeholder="Optik Zoom" value={formData.opticalZoom} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="sensorType" placeholder="Sensor Növü" value={formData.sensorType} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="imageStabilization" placeholder="Görüntü Sabitləşdirmə" value={formData.imageStabilization} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
              </>
            )}

            {/* Əgər kateqoriya "Headphones" seçilibsə */}
            {formData.category === "Headphones" && (
              <>
                <input type="text" name="connectivity" placeholder="Qoşulma (Connectivity)" value={formData.connectivity} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="batteryLife" placeholder="Batareya Ömrü" value={formData.batteryLife} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="noiseCancellation" placeholder="Səs-küyün Ləğvi (Noise Cancellation)" value={formData.noiseCancellation} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
              </>
            )}

            {/* Əgər kateqoriya "Console" seçilibsə */}
            {formData.category === "Console" && (
              <>
                <input type="text" name="cpu" placeholder="CPU" value={formData.cpu} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="gpu" placeholder="GPU" value={formData.gpu} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="storage" placeholder="Yaddaş (Storage)" value={formData.storage} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="memory" placeholder="Yaddaş (Memory)" value={formData.memory} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="supportedResolution" placeholder="Dəstəklənən Çözümlülük" value={formData.supportedResolution} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="connectivity" placeholder="Qoşulma (Connectivity)" value={formData.connectivity} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                {/* Checkbox: Controller Included */}
                <label className="flex items-center space-x-2">
                  <span className="text-gray-700">Controller Daxildir</span>
                  <input
                    type="checkbox"
                    name="controllerIncluded"
                    checked={formData.controllerIncluded}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              </>
            )}

            {/* Əgər kateqoriya "iPad" (Planşetlər) seçilibsə */}
            {formData.category === "iPad" && (
              <>
                <input type="text" name="screenSize" placeholder="Ekran Ölçüsü" value={formData.screenSize} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="storage" placeholder="Daxili Yaddaş (Storage)" value={formData.storage} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="ram" placeholder="RAM" value={formData.ram} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="battery" placeholder="Batareya" value={formData.battery} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="processor" placeholder="Prosessor" value={formData.processor} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="operatingSystem" placeholder="Əməliyyat Sistemi" value={formData.operatingSystem} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                <input type="text" name="camera" placeholder="Kamera" value={formData.camera} onChange={handleInputChange} className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors" />
                {/* Checkbox: Cellular */}
                <label className="flex items-center space-x-2">
                  <span className="text-gray-700">Cellular Dəstəyi</span>
                  <input
                    type="checkbox"
                    name="cellular"
                    checked={formData.cellular}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              </>
            )}
          </fieldset>
        )}

        {/*
          ==================================
          3. Şəkil Yükləmə Sahəsi
          ==================================
        */}
        <fieldset className="space-y-4 p-4 border border-gray-300 rounded-lg">
          <legend className="text-xl font-bold text-gray-700 px-2">Şəkillər (Max 15)</legend>
          {/* Fayl Yükləmə Inputu */}
          <input
            onChange={handleFileChange}
            name="newImages"
            type="file"
            multiple
            accept="image/*" // Yalnız şəkil fayllarını qəbul et
            className="w-full px-5 py-3 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
          />

          {/* Xəta Mesajı */}
          {imageError && <p className="text-red-600 font-medium mt-2">{imageError}</p>}

          {/* Şəkil Önizləmələri */}
          {images.length > 0 && (
            <div className="flex gap-4 mt-4 flex-wrap p-2 border border-dashed border-gray-400 rounded-lg bg-gray-50">
              {images.map((file, index) => (
                <img
                  key={index}
                  // Müvəqqəti URL yaradılır
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md border-2 border-green-400 shadow-md"
                />
              ))}
            </div>
          )}
        </fieldset>

        {/* Formu Göndərmə Düyməsi */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-indigo-300 mt-6"
        >
          Məhsulu Əlavə Et
        </button>
      </form>
    </div>
  );
};

// Komponentin ixracı
export default AddProduct;