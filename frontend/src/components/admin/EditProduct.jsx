import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetProductDetailsQuery, 
  useEditProductMutation, 
  useGetProductsQuery 
} from '../../redux/api/productsApi';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaUpload } from 'react-icons/fa'; // Yeni ikonlar

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetProductDetailsQuery(id);
  const { refetch } = useGetProductsQuery();
  const [editProduct, { isLoading: isUpdating }] = useEditProductMutation();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    seller: '',
    stock: '',
    ratings: '',
    color: '',
    screenSize: '',
    storage: '',
    ram: '',
    frontCamera: '',
    backCamera: '',
    battery: '',
    processor: '',
    operatingSystem: '',
    gpu: '',
    camera: '',
    batteryLife: '',
    colors: '',
    resolution: '',
    opticalZoom: '',
    sensorType: '',
    imageStabilization: '',
    connectivity: '',
    headphoneBatteryLife: '',
    noiseCancellation: '',
    cpu: '',
    consoleGPU: '',
    consoleStorage: '',
    memory: '',
    supportedResolution: '',
    consoleConnectivity: '',
    controllerIncluded: false,
    ipadScreenSize: '',
    ipadStorage: '',
    ipadRam: '',
    ipadBattery: '',
    ipadProcessor: '',
    ipadOperatingSystem: '',
    ipadCamera: '',
    cellular: false,
  });

  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Yeni şəkillərin önizləməsi üçün

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.product.name || '',
        price: data.product.price || '',
        description: data.product.description || '',
        category: data.product.category || '',
        seller: data.product.seller || '',
        stock: data.product.stock || '',
        ratings: data.product.ratings || '',
        color: data.product.color || '',
        screenSize: data.product.screenSize || '',
        storage: data.product.storage || '',
        ram: data.product.ram || '',
        frontCamera: data.product.frontCamera || '',
        backCamera: data.product.backCamera || '',
        battery: data.product.battery || '',
        processor: data.product.processor || '',
        operatingSystem: data.product.operatingSystem || '',
        gpu: data.product.gpu || '',
        camera: data.product.camera || '',
        batteryLife: data.product.batteryLife || '',
        colors: data.product.colors ? data.product.colors.join(", ") : '',
        resolution: data.product.resolution || '',
        opticalZoom: data.product.opticalZoom || '',
        sensorType: data.product.sensorType || '',
        imageStabilization: data.product.imageStabilization || '',
        connectivity: data.product.connectivity || '',
        headphoneBatteryLife: data.product.headphoneBatteryLife || '',
        noiseCancellation: data.product.noiseCancellation || '',
        cpu: data.product.cpu || '',
        consoleGPU: data.product.consoleGPU || '',
        consoleStorage: data.product.consoleStorage || '',
        memory: data.product.memory || '',
        supportedResolution: data.product.supportedResolution || '',
        consoleConnectivity: data.product.consoleConnectivity || '',
        controllerIncluded: data.product.controllerIncluded || false,
        ipadScreenSize: data.product.ipadScreenSize || '',
        ipadStorage: data.product.ipadStorage || '',
        ipadRam: data.product.ipadRam || '',
        ipadBattery: data.product.ipadBattery || '',
        ipadProcessor: data.product.ipadProcessor || '',
        ipadOperatingSystem: data.product.ipadOperatingSystem || '',
        ipadCamera: data.product.ipadCamera || '',
        cellular: data.product.cellular || false,
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);

    // Yeni şəkil önizləmələrini yarat
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  const handleRemoveExistingImage = (imageId) => {
    if (removedImages.includes(imageId)) {
      setRemovedImages(removedImages.filter((id) => id !== imageId));
    } else {
      setRemovedImages([...removedImages, imageId]);
    }
  };

  const handleRemoveNewImage = (index) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    const updatedNewImagePreviews = newImagePreviews.filter((_, i) => i !== index);
    setNewImages(updatedNewImages);
    setNewImagePreviews(updatedNewImagePreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();

    // FormData-ya bütün dəyişdirilmiş sahələri əlavə et
    Object.entries(formData).forEach(([key, value]) => {
      // Colors sahəsi xüsusi haldır, çünki backend tərəfində array olaraq saxlanıla bilər.
      if (key === 'colors' && typeof value === 'string') {
        updatedData.append(key, value.split(',').map(s => s.trim()).filter(s => s.length > 0));
      } else {
        updatedData.append(key, value);
      }
    });

    // Yeni şəkilləri əlavə et
    newImages.forEach((image) => {
      updatedData.append("newImages", image);
    });
    
    // Silinəcək şəkillərin ID-lərini əlavə et
    // Backend tərəfinin gözlədiyi formatı JSON.stringify ilə göndəririk.
    if (removedImages.length > 0) {
      updatedData.append("existingImages", JSON.stringify(removedImages.map(id => ({ public_id: id }))));
    }

    try {
      await editProduct({ id, formData: updatedData }).unwrap();
      Swal.fire({
        title: "Uğurlu! 🎉",
        text: "Məhsul uğurla yeniləndi!",
        icon: "success",
      }).then(() => {
        navigate("/admin/adminproducts");
        refetch();
      });
    } catch (err) {
      console.error("Xəta:", err);
      Swal.fire({
        title: "Xəta! 😞",
        text: err.data?.message || "Məhsul yenilənmədi!",
        icon: "error",
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          <p className="mt-4 text-xl font-semibold text-gray-700">Məlumatlar Yüklənir...</p>
        </div>
      </div>
    );
  
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-200">
          <h2 className="text-3xl font-bold text-red-600 mb-3">Xəta Baş Verdi! 🛑</h2>
          <p className="text-lg text-gray-700">Məhsul detalları yüklənərkən problem yaşandı.</p>
          <p className="text-sm text-gray-500 mt-2">Səhv: {error.data?.message || error.message || "Naməlum xəta"}</p>
        </div>
      </div>
    );

  // Input komponentini təyin et (təkrarlanmanın qarşısını almaq üçün)
  const InputField = ({ name, type = 'text', placeholder, value, onChange, step, className = "" }) => (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      step={step}
      className={`w-full p-3 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 ${className}`}
    />
  );

  const CheckboxField = ({ name, label, checked, onChange }) => (
    <div className="flex items-center p-3 border border-gray-300 bg-gray-50 rounded-lg shadow-sm">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        id={name}
        className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
      />
      <label htmlFor={name} className="ml-3 text-sm font-medium text-gray-700">
        {label}
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <header className="bg-purple-600 p-6">
          <h2 className="text-4xl font-extrabold text-white text-center flex items-center justify-center space-x-3">
            <FaEdit className="text-white" />
            <span>Məhsulu Redaktə Et</span>
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-10" encType="multipart/form-data">

          {/* 1. Ümumi Məlumatlar */}
          <section className="border border-purple-200 rounded-xl p-6 bg-purple-50 shadow-md">
            <h3 className="text-2xl font-semibold text-purple-700 mb-6 border-b pb-2 flex items-center">
              Ümumi Məlumatlar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField name="name" placeholder="Ad" value={formData.name} onChange={handleInputChange} />
              <InputField name="price" type="number" placeholder="Qiymət" value={formData.price} onChange={handleInputChange} />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 shadow-sm"
              >
                <option value="" disabled>Kateqoriya Seç</option>
                <option value="Phones">Phones</option>
                <option value="Laptops">Laptops</option>
                <option value="Cameras">Cameras</option>
                <option value="Headphones">Headphones</option>
                <option value="Console">Console</option>
                <option value="iPad">iPad</option>
              </select>
              <InputField name="seller" placeholder="Satıcı" value={formData.seller} onChange={handleInputChange} />
              <InputField name="stock" type="number" placeholder="Stok" value={formData.stock} onChange={handleInputChange} />
              <InputField name="ratings" type="number" placeholder="Reyting" value={formData.ratings} onChange={handleInputChange} step="0.1" />
            </div>
            <div className="mt-6">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Açıqlama"
                className="w-full p-4 border border-gray-300 bg-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 shadow-inner"
                rows="5"
              ></textarea>
            </div>
          </section>

          {/* 2. Kateqoriyaya Göre Spesifik Alanlar */}
          {formData.category && (
            <section className="border border-indigo-200 rounded-xl p-6 bg-indigo-50 shadow-md">
              <h3 className="text-2xl font-semibold text-indigo-700 mb-6 border-b pb-2 flex items-center">
                {formData.category} Spesifikasiyaları
              </h3>

              {/* Phones */}
              {formData.category === "Phones" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField name="color" placeholder="Rəng" value={formData.color} onChange={handleInputChange} />
                  <InputField name="screenSize" placeholder="Ekran Ölçüsü" value={formData.screenSize} onChange={handleInputChange} />
                  <InputField name="storage" placeholder="Yaddaş" value={formData.storage} onChange={handleInputChange} />
                  <InputField name="ram" placeholder="RAM" value={formData.ram} onChange={handleInputChange} />
                  <InputField name="frontCamera" placeholder="Ön Kamera" value={formData.frontCamera} onChange={handleInputChange} />
                  <InputField name="backCamera" placeholder="Arxa Kamera" value={formData.backCamera} onChange={handleInputChange} />
                  <InputField name="battery" placeholder="Batareya" value={formData.battery} onChange={handleInputChange} />
                  <InputField name="processor" placeholder="Prosessor" value={formData.processor} onChange={handleInputChange} />
                  <InputField name="operatingSystem" placeholder="Əməliyyat Sistemi" value={formData.operatingSystem} onChange={handleInputChange} />
                </div>
              )}

              {/* Laptops */}
              {formData.category === "Laptops" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField name="colors" placeholder="Rənglər (vergüllə ayırın)" value={formData.colors} onChange={handleInputChange} />
                  <InputField name="screenSize" placeholder="Ekran Ölçüsü" value={formData.screenSize} onChange={handleInputChange} />
                  <InputField name="storage" placeholder="Yaddaş" value={formData.storage} onChange={handleInputChange} />
                  <InputField name="ram" placeholder="RAM" value={formData.ram} onChange={handleInputChange} />
                  <InputField name="gpu" placeholder="GPU" value={formData.gpu} onChange={handleInputChange} />
                  <InputField name="camera" placeholder="Kamera" value={formData.camera} onChange={handleInputChange} />
                  <InputField name="processor" placeholder="Prosessor" value={formData.processor} onChange={handleInputChange} />
                  <InputField name="batteryLife" placeholder="Batareya Ömrü" value={formData.batteryLife} onChange={handleInputChange} />
                  <InputField name="operatingSystem" placeholder="Əməliyyat Sistemi" value={formData.operatingSystem} onChange={handleInputChange} />
                </div>
              )}

              {/* Cameras */}
              {formData.category === "Cameras" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField name="resolution" placeholder="Həll Etmə Qabiliyyəti" value={formData.resolution} onChange={handleInputChange} />
                  <InputField name="opticalZoom" placeholder="Optik Zoom" value={formData.opticalZoom} onChange={handleInputChange} />
                  <InputField name="sensorType" placeholder="Sensor Növü" value={formData.sensorType} onChange={handleInputChange} />
                  <InputField name="imageStabilization" placeholder="Şəkil Sabitləşdirilməsi" value={formData.imageStabilization} onChange={handleInputChange} />
                </div>
              )}

              {/* Headphones */}
              {formData.category === "Headphones" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField name="connectivity" placeholder="Əlaqə" value={formData.connectivity} onChange={handleInputChange} />
                  <InputField name="headphoneBatteryLife" placeholder="Batareya Ömrü" value={formData.headphoneBatteryLife} onChange={handleInputChange} />
                  <InputField name="noiseCancellation" placeholder="Səs-küyün Ləğvi" value={formData.noiseCancellation} onChange={handleInputChange} />
                </div>
              )}

              {/* Console */}
              {formData.category === "Console" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField name="cpu" placeholder="CPU" value={formData.cpu} onChange={handleInputChange} />
                  <InputField name="consoleGPU" placeholder="GPU" value={formData.consoleGPU} onChange={handleInputChange} />
                  <InputField name="consoleStorage" placeholder="Yaddaş" value={formData.consoleStorage} onChange={handleInputChange} />
                  <InputField name="memory" placeholder="Yaddaş (RAM)" value={formData.memory} onChange={handleInputChange} />
                  <InputField name="supportedResolution" placeholder="Dəstəklənən Həll Etmə Qabiliyyəti" value={formData.supportedResolution} onChange={handleInputChange} />
                  <InputField name="consoleConnectivity" placeholder="Əlaqə" value={formData.consoleConnectivity} onChange={handleInputChange} />
                  <CheckboxField
                    name="controllerIncluded"
                    label="Kontroller Daxildir"
                    checked={formData.controllerIncluded}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {/* iPad */}
              {formData.category === "iPad" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField name="color" placeholder="Rəng" value={formData.color} onChange={handleInputChange} />
                  <InputField name="ipadScreenSize" placeholder="Ekran Ölçüsü" value={formData.ipadScreenSize} onChange={handleInputChange} />
                  <InputField name="ipadStorage" placeholder="Yaddaş" value={formData.ipadStorage} onChange={handleInputChange} />
                  <InputField name="ipadRam" placeholder="RAM" value={formData.ipadRam} onChange={handleInputChange} />
                  <InputField name="ipadBattery" placeholder="Batareya" value={formData.ipadBattery} onChange={handleInputChange} />
                  <InputField name="ipadProcessor" placeholder="Prosessor" value={formData.ipadProcessor} onChange={handleInputChange} />
                  <InputField name="ipadOperatingSystem" placeholder="Əməliyyat Sistemi" value={formData.ipadOperatingSystem} onChange={handleInputChange} />
                  <InputField name="ipadCamera" placeholder="Kamera" value={formData.ipadCamera} onChange={handleInputChange} />
                  <CheckboxField
                    name="cellular"
                    label="Hüceyrəvi (Cellular) Dəstək"
                    checked={formData.cellular}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </section>
          )}

          {/* 3. Şəkil İdarəetməsi */}
          <section className="border border-pink-200 rounded-xl p-6 bg-pink-50 shadow-md">
            <h3 className="text-2xl font-semibold text-pink-700 mb-6 border-b pb-2 flex items-center">
              Şəkil İdarəetməsi
            </h3>
            
            {/* Mövcud Şəkillər */}
            {data && data.product && data.product.images && data.product.images.length > 0 && (
              <div className="mb-6">
                <p className="text-lg font-medium text-gray-700 mb-3">Mövcud Şəkillər:</p>
                <div className="flex flex-wrap gap-4">
                  {data.product.images
                    .map((img) => {
                      const imageId = img.public_id || img.id;
                      const isRemoved = removedImages.includes(imageId);
                      return (
                        <div key={imageId} className={`relative transition-opacity duration-300 ${isRemoved ? 'opacity-30' : 'opacity-100'}`}>
                          <img
                            src={img.url}
                            alt={formData.name}
                            className={`w-32 h-32 object-cover rounded-xl border-4 ${isRemoved ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(imageId)}
                            className={`absolute top-0 right-0 p-2 rounded-bl-xl transition transform hover:scale-105 shadow-lg ${isRemoved ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                            title={isRemoved ? "Silinməni Ləğv Et" : "Şəkli Sil"}
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                          {isRemoved && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                              <span className="text-white font-bold text-sm">SİLİNƏCƏK</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Yeni Şəkillər */}
            <label className="block text-lg font-medium text-gray-700 mb-3" htmlFor="file-upload">
              Yeni Şəkillərin Yüklənməsi:
            </label>
            <input
              type="file"
              multiple
              onChange={handleNewImagesChange}
              name="newImages"
              id="file-upload"
              accept="image/*"
              className="hidden" // Gizlədirik
            />
            <button
              type="button"
              onClick={() => document.getElementById('file-upload').click()}
              className="w-full flex items-center justify-center p-3 border-2 border-dashed border-pink-400 text-pink-700 bg-white hover:bg-pink-100 rounded-lg transition-all duration-300 font-semibold"
            >
              <FaUpload className="mr-3 w-5 h-5" />
              Şəkilləri Seçin və ya Buraxın
            </button>
            
            {/* Yeni Şəkil Önizləmələri */}
            {newImagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-md font-medium text-gray-600 mb-2">Seçilmiş Yeni Şəkillər:</p>
                <div className="flex flex-wrap gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Yeni Şəkil Önizləmə ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-xl border border-pink-300 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full -mt-2 -mr-2 transition transform hover:scale-110"
                        title="Bu şəkli ləğv et"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>


          <button
            type="submit"
            disabled={isUpdating}
            className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Yenilənir...
              </>
            ) : (
              "Məhsulu Yenilə"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;