"use client" // Bu direktiv komponentin müştəri tərəfində render olunacağını göstərir (məsələn, Next.js kimi SSR tətbiqlərində istifadə olunur).

// React-in useState hook-u ilə komponentin lokal state-lərini idarə edirik.
import { useState } from "react";

// Redux Toolkit Query API-dən hook-lar idxal olunur:
// useAddProductMutation: Yeni məhsul əlavə etmək üçün API mutasiyası hook-u.
// useGetProductsQuery: Məhsulların siyahısını əldə etmək və yenidən yükləmək üçün API sorgusu hook-u.
import { useAddProductMutation, useGetProductsQuery } from "../../redux/api/productsApi";

// SweetAlert2 kitabxanası idxal olunur, bu kitabxana gözəl pop-up bildirişlər göstərir.
import Swal from "sweetalert2";

// React Router-dən useNavigate hook-u idxal olunur. Bu hook proqram daxilində yönləndirmə aparmağa imkan verir.
import { useNavigate } from "react-router-dom";

// AddProduct komponenti yaradılır.
const AddProduct = () => {
  // initialState: Formun bütün sahələri üçün ilkin dəyərləri təyin edir.
  // Mətn sahələri üçün boş string, rəqəmsal sahələr üçün boş string və checkbox-lar üçün false dəyəri verilir.
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

  // formData state: Form daxilində daxil edilən məlumatları saxlayır.
  const [formData, setFormData] = useState(initialState);

  // images state: İstifadəçi tərəfindən yüklənən şəkilləri (faylları) saxlayır.
  const [images, setImages] = useState([]);

  // imageError state: Şəkil yükləmə zamanı yaranan xəta mesajını saxlayır.
  const [imageError, setImageError] = useState("");

  // useAddProductMutation hook-u vasitəsilə addProduct funksiyası əldə edilir.
  // Bu funksiya, məhsul əlavə etmək üçün serverə sorğu göndərir.
  const [addProduct] = useAddProductMutation();

  // useGetProductsQuery hook-dan refetch funksiyası əldə edilir.
  // Bu funksiya, məhsullar siyahısını yenidən yükləmək üçün istifadə olunur.
  const { refetch } = useGetProductsQuery();

  // useNavigate hook-u ilə yönləndirmə funksiyası əldə edilir.
  // Bu funksiya müəyyən URL-ə keçid etmək üçün istifadə olunur.
  const navigate = useNavigate();

  // handleInputChange funksiyası, formdakı input elementlərində hər hansı dəyişiklik baş verdikdə çağırılır.
  // e.target vasitəsilə inputun name, value, type və əgər checkbox-dursa checked dəyəri əldə edilir.
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Əgər input tipi checkbox-dursa, dəyər checked (true/false) olur, əks halda value olur.
    const newValue = type === "checkbox" ? checked : value;
    // Mövcud formData obyektini saxlayaraq yalnız dəyişən inputun dəyərini yeniləyirik.
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  // handleFileChange funksiyası, fayl inputundan fayllar seçildikdə çağırılır.
  // e.target.files array-like obyektidir və Array.from() ilə həqiqi array-ə çevrilir.
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Əgər seçilən faylların sayı 15-dən çoxdursa, imageError state-i təyin olunur və images state-i boşaldılır.
    if (files.length > 15) {
      setImageError("Maksimum 15 şəkil yükləyə bilərsiniz.");
      setImages([]);
    } else {
      // Əks halda, imageError sıfırlanır və images state-i seçilən fayllərlə doldurulur.
      setImageError("");
      setImages(files);
    }
  };

  // handleSubmit funksiyası, form göndərildikdə çağırılır.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Formun default davranışını (səhifənin reload olunmasını) qarşısını alır.

    // Əgər imageError state-də bir xəta varsa, Swal vasitəsilə istifadəçiyə xəbərdarlıq göstərilir və funksiya dayandırılır.
    if (imageError) {
      Swal.fire({
        title: "Xəta!",
        text: "Zəhmət olmasa 15-dən çox olmayan şəkil yükləyin.",
        icon: "error",
        confirmButtonText: "Tamam",
      });
      return;
    }

    // Yeni FormData obyekti yaradılır. Bu obyekt, form məlumatlarını "multipart/form-data" formatında serverə göndərmək üçün istifadə olunur.
    const form = new FormData();
    // formData obyektindəki hər bir açar-dəyər cütü FormData obyektinə əlavə edilir.
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    // Yüklənmiş hər bir şəkil, "newImages" açarı altında FormData obyektinə əlavə edilir.
    images.forEach((file) => {
      form.append("newImages", file);
    });

    try {
      // addProduct mutasiyası çağırılır və FormData obyektini serverə göndərir.
      // unwrap() metodu Promise-dən dəyəri çıxarmağa və potensial xətaları tutmağa imkan verir.
      await addProduct(form).unwrap();

      // Əməliyyat uğurlu olarsa, Swal vasitəsilə uğur bildirişi göstərilir.
      Swal.fire({
        title: "Uğurla əlavə edildi!",
        text: "Məhsul uğurla əlavə edildi.",
        icon: "success",
        confirmButtonText: "Tamam",
      });

      // Yönləndirmə: Məhsul əlavə edildikdən sonra istifadəçi "/admin/products" səhifəsinə yönləndirilir.
      navigate("/admin/products");

      // refetch() metodu ilə məhsullar siyahısı yenidən yüklənir.
      await refetch();

      // Formdakı bütün məlumatlar ilkin vəziyyətə gətirilir.
      setFormData(initialState);
      // Yüklənmiş şəkillər state-i sıfırlanır.
      setImages([]);
    } catch (error) {
      // Əgər məhsul əlavə edilərkən xəta baş verərsə, xəta konsola yazılır və Swal vasitəsilə xəta bildirişi göstərilir.
      console.error(error);
      Swal.fire({
        title: "Xəta!",
        text: "Məhsul əlavə edilərkən xəta baş verdi.",
        icon: "error",
        confirmButtonText: "Tamam",
      });
    }
  };

  // JSX hissəsi: Komponentin render olunacaq görünüşü.
  return (
    // Ümumi konteyner div: 
    // - "max-w-4xl": Maksimum eni 4xl,
    // - "mx-auto": Mərkəzləşdirilmiş,
    // - "mt-10": Üst boşluğu (margin-top) 10,
    // - "p-10": İç boşluğu (padding) 10,
    // - "bg-white": Ağ arxa fon,
    // - "rounded-xl": Yuvarlaq künclər,
    // - "shadow-2xl": Güclü kölgə,
    // - "border border-gray-200": Açıq boz rəngli border.
    <div className="max-w-4xl mx-auto mt-10 p-10 bg-white rounded-xl shadow-2xl border border-gray-200">
      {/* Başlıq */}
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Yeni Məhsul Əlavə Et
      </h2>
      {/* Form elementi:
          - "space-y-6": Elementlər arasında dik boşluq,
          - "onSubmit": Form göndərildikdə handleSubmit funksiyası çağırılır,
          - "encType": "multipart/form-data" fayl yükləmələri üçün tələb olunur.
      */}
      <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Məhsulun adı üçün input */}
        <input
          type="text"
          name="name"
          placeholder="Ad"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        />
        {/* Məhsulun qiyməti üçün input */}
        <input
          type="number"
          name="price"
          placeholder="Qiymət"
          value={formData.price}
          onChange={handleInputChange}
          className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        />
        {/* Məhsulun açıqlaması üçün textarea */}
        <textarea
          name="description"
          placeholder="Açıqlama"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        ></textarea>
        {/* Kateqoriya seçimi üçün select elementi */}
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        >
          <option value="">Kateqoriya Seç</option>
          <option value="Phones">Phones</option>
          <option value="Laptops">Laptops</option>
          <option value="Cameras">Cameras</option>
          <option value="Headphones">Headphones</option>
          <option value="Console">Console</option>
          <option value="iPad">iPad</option>
        </select>
        {/* Satıcı üçün input */}
        <input
          type="text"
          name="seller"
          placeholder="Satıcı"
          value={formData.seller}
          onChange={handleInputChange}
          className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        />
        {/* Stok üçün input */}
        <input
          type="number"
          name="stock"
          placeholder="Stok"
          value={formData.stock}
          onChange={handleInputChange}
          className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        />
        {/* Rating üçün input */}
        <input
          type="number"
          step="0.1"
          name="ratings"
          placeholder="Rating (məsələn, 4.5)"
          value={formData.ratings}
          onChange={handleInputChange}
          className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        />

        {/* Kateqoriyaya uyğun əlavə sahələr */}
        {/* Əgər kateqoriya "Phones" seçilibsə, telefonlara aid əlavə sahələr render olunur */}
        {formData.category === "Phones" && (
          <>
            <input
              type="text"
              name="screenSize"
              placeholder="Screen Size"
              value={formData.screenSize}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="storage"
              placeholder="Storage"
              value={formData.storage}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="ram"
              placeholder="RAM"
              value={formData.ram}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="frontCamera"
              placeholder="Front Camera"
              value={formData.frontCamera}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="backCamera"
              placeholder="Back Camera"
              value={formData.backCamera}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="battery"
              placeholder="Battery"
              value={formData.battery}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="processor"
              placeholder="Processor"
              value={formData.processor}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="operatingSystem"
              placeholder="Operating System"
              value={formData.operatingSystem}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
          </>
        )}

        {/* Əgər kateqoriya "Laptops" seçilibsə, laptoplara aid əlavə sahələr render olunur */}
        {formData.category === "Laptops" && (
          <>
            <input
              type="text"
              name="screenSize"
              placeholder="Screen Size"
              value={formData.screenSize}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="storage"
              placeholder="Storage"
              value={formData.storage}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="ram"
              placeholder="RAM"
              value={formData.ram}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="gpu"
              placeholder="GPU"
              value={formData.gpu}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="camera"
              placeholder="Kamera"
              value={formData.camera}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="processor"
              placeholder="Processor"
              value={formData.processor}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="batteryLife"
              placeholder="Battery Life"
              value={formData.batteryLife}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="operatingSystem"
              placeholder="Operating System"
              value={formData.operatingSystem}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
          </>
        )}

        {/* Əgər kateqoriya "Cameras" seçilibsə, kameralara aid əlavə sahələr render olunur */}
        {formData.category === "Cameras" && (
          <>
            <input
              type="text"
              name="resolution"
              placeholder="Resolution"
              value={formData.resolution}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="opticalZoom"
              placeholder="Optical Zoom"
              value={formData.opticalZoom}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="sensorType"
              placeholder="Sensor Type"
              value={formData.sensorType}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="imageStabilization"
              placeholder="Image Stabilization"
              value={formData.imageStabilization}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
          </>
        )}

        {/* Əgər kateqoriya "Headphones" seçilibsə, qulaqcıqlara aid əlavə sahələr render olunur */}
        {formData.category === "Headphones" && (
          <>
            <input
              type="text"
              name="connectivity"
              placeholder="Connectivity"
              value={formData.connectivity}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="batteryLife"
              placeholder="Battery Life"
              value={formData.batteryLife}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="noiseCancellation"
              placeholder="Noise Cancellation"
              value={formData.noiseCancellation}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
          </>
        )}

        {/* Əgər kateqoriya "Console" seçilibsə, konsol məhsullarına aid əlavə sahələr render olunur */}
        {formData.category === "Console" && (
          <>
            <input
              type="text"
              name="cpu"
              placeholder="CPU"
              value={formData.cpu}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="gpu"
              placeholder="GPU"
              value={formData.gpu}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="storage"
              placeholder="Storage"
              value={formData.storage}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="memory"
              placeholder="Memory"
              value={formData.memory}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="supportedResolution"
              placeholder="Supported Resolution"
              value={formData.supportedResolution}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="connectivity"
              placeholder="Connectivity"
              value={formData.connectivity}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            {/* Checkbox üçün label */}
            <label className="flex items-center space-x-2">
              <span className="text-gray-700">Controller Included</span>
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

        {/* Əgər kateqoriya "iPad" seçilibsə, iPad məhsullarına aid əlavə sahələr render olunur */}
        {formData.category === "iPad" && (
          <>
            <input
              type="text"
              name="screenSize"
              placeholder="Screen Size"
              value={formData.screenSize}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="storage"
              placeholder="Storage"
              value={formData.storage}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="ram"
              placeholder="RAM"
              value={formData.ram}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="battery"
              placeholder="Battery"
              value={formData.battery}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="processor"
              placeholder="Processor"
              value={formData.processor}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="operatingSystem"
              placeholder="Operating System"
              value={formData.operatingSystem}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            <input
              type="text"
              name="camera"
              placeholder="Camera"
              value={formData.camera}
              onChange={handleInputChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
            />
            {/* Checkbox üçün label: Cellular */}
            <label className="flex items-center space-x-2">
              <span className="text-gray-700">Cellular</span>
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

        {/* Fayl yükləmə inputu: Bir neçə fayl seçmək üçün "multiple" atributu */}
        <input
          onChange={handleFileChange}
          name="newImages"
          type="file"
          multiple
          className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 transition-colors"
        />

        {/* Əgər imageError state-də xəta varsa, qırmızı rəngdə xəta mesajı göstərilir */}
        {imageError && <p className="text-red-500 mt-2">{imageError}</p>}

        {/* Şəkil önizləmələri: Yüklənmiş şəkillərin müvəqqəti URL-ləri yaradılır və görüntülənir */}
        {images.length > 0 && (
          <div className="flex gap-4 mt-4 flex-wrap">
            {images.map((file, index) => (
              <img
                key={index}
                // URL.createObjectURL() metodu fayl obyektindən müvəqqəti URL yaradır.
                src={URL.createObjectURL(file) || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-24 h-24 object-cover rounded-md border border-gray-300"
              />
            ))}
          </div>
        )}

        {/* Formu göndərmək üçün submit düyməsi */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-md hover:from-purple-700 hover:to-indigo-700 transition-colors"
        >
          Əlavə Et
        </button>
      </form>
    </div>
  );
};

// Komponent default olaraq ixrac olunur, beləliklə digər fayllarda istifadə edilə bilər.
export default AddProduct;
