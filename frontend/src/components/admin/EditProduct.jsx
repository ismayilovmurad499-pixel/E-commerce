import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetProductDetailsQuery, 
  useEditProductMutation, 
  useGetProductsQuery 
} from '../../redux/api/productsApi';
import Swal from 'sweetalert2';

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
    setNewImages([...e.target.files]);
  };

  const handleRemoveExistingImage = (imageId) => {
    if (removedImages.includes(imageId)) {
      setRemovedImages(removedImages.filter((id) => id !== imageId));
    } else {
      setRemovedImages([...removedImages, imageId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      updatedData.append(key, value);
    });
    newImages.forEach((image) => {
      updatedData.append("newImages", image);
    });
    if (removedImages.length > 0) {
      updatedData.append("existingImages", JSON.stringify(removedImages.map(id => ({ public_id: id }))));
    }

    try {
      await editProduct({ id, formData: updatedData }).unwrap();
      Swal.fire({
        title: "Uğurlu!",
        text: "Məhsul uğurla yeniləndi!",
        icon: "success",
      }).then(() => {
        navigate("/admin/adminproducts");
        refetch();
      });
    } catch (err) {
      console.error("Xəta:", err);
      Swal.fire({
        title: "Xəta!",
        text: "Məhsul yenilənmədi!",
        icon: "error",
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-700">
        Yüklənir...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold text-red-500">
        Xəta baş verdi: {error.message}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-10 bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8 border-b pb-4">
        Məhsulu Redaktə Et
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {/* Ümumi Sahələr */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ad"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Qiymət"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Açıqlama"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 col-span-2"
            rows="4"
          ></textarea>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
          >
            <option value="">Kateqoriya Seç</option>
            <option value="Phones">Phones</option>
            <option value="Laptops">Laptops</option>
            <option value="Cameras">Cameras</option>
            <option value="Headphones">Headphones</option>
            <option value="Console">Console</option>
            <option value="iPad">iPad</option>
          </select>
          <input
            type="text"
            name="seller"
            value={formData.seller}
            onChange={handleInputChange}
            placeholder="Satıcı"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="Stok"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
          />
          <input
            type="number"
            name="ratings"
            value={formData.ratings}
            onChange={handleInputChange}
            placeholder="Reyting"
            step="0.1"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
          />
        </div>

        {/* Kateqoriyaya Göre Spesifik Alanlar */}
        {formData.category === "Phones" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Color"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="screenSize"
              value={formData.screenSize}
              onChange={handleInputChange}
              placeholder="Screen Size"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="storage"
              value={formData.storage}
              onChange={handleInputChange}
              placeholder="Storage"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="ram"
              value={formData.ram}
              onChange={handleInputChange}
              placeholder="RAM"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="frontCamera"
              value={formData.frontCamera}
              onChange={handleInputChange}
              placeholder="Front Camera"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="backCamera"
              value={formData.backCamera}
              onChange={handleInputChange}
              placeholder="Back Camera"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="battery"
              value={formData.battery}
              onChange={handleInputChange}
              placeholder="Battery"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="processor"
              value={formData.processor}
              onChange={handleInputChange}
              placeholder="Processor"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="operatingSystem"
              value={formData.operatingSystem}
              onChange={handleInputChange}
              placeholder="Operating System"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
          </div>
        )}

        {formData.category === "Laptops" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleInputChange}
              placeholder="Colors (comma separated)"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="screenSize"
              value={formData.screenSize}
              onChange={handleInputChange}
              placeholder="Screen Size"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="storage"
              value={formData.storage}
              onChange={handleInputChange}
              placeholder="Storage"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="ram"
              value={formData.ram}
              onChange={handleInputChange}
              placeholder="RAM"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="gpu"
              value={formData.gpu}
              onChange={handleInputChange}
              placeholder="GPU"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="camera"
              value={formData.camera}
              onChange={handleInputChange}
              placeholder="Camera"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="processor"
              value={formData.processor}
              onChange={handleInputChange}
              placeholder="Processor"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="batteryLife"
              value={formData.batteryLife}
              onChange={handleInputChange}
              placeholder="Battery Life"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="operatingSystem"
              value={formData.operatingSystem}
              onChange={handleInputChange}
              placeholder="Operating System"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
          </div>
        )}

        {formData.category === "Cameras" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="resolution"
              value={formData.resolution}
              onChange={handleInputChange}
              placeholder="Resolution"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="opticalZoom"
              value={formData.opticalZoom}
              onChange={handleInputChange}
              placeholder="Optical Zoom"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="sensorType"
              value={formData.sensorType}
              onChange={handleInputChange}
              placeholder="Sensor Type"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="imageStabilization"
              value={formData.imageStabilization}
              onChange={handleInputChange}
              placeholder="Image Stabilization"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
          </div>
        )}

        {formData.category === "Headphones" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="connectivity"
              value={formData.connectivity}
              onChange={handleInputChange}
              placeholder="Connectivity"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="headphoneBatteryLife"
              value={formData.headphoneBatteryLife}
              onChange={handleInputChange}
              placeholder="Battery Life"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="noiseCancellation"
              value={formData.noiseCancellation}
              onChange={handleInputChange}
              placeholder="Noise Cancellation"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
          </div>
        )}

        {formData.category === "Console" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="cpu"
              value={formData.cpu}
              onChange={handleInputChange}
              placeholder="CPU"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="consoleGPU"
              value={formData.consoleGPU}
              onChange={handleInputChange}
              placeholder="GPU"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="consoleStorage"
              value={formData.consoleStorage}
              onChange={handleInputChange}
              placeholder="Storage"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="memory"
              value={formData.memory}
              onChange={handleInputChange}
              placeholder="Memory"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="supportedResolution"
              value={formData.supportedResolution}
              onChange={handleInputChange}
              placeholder="Supported Resolution"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="consoleConnectivity"
              value={formData.consoleConnectivity}
              onChange={handleInputChange}
              placeholder="Connectivity"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <label className="flex items-center space-x-2 text-gray-700">
              <span>Controller Included</span>
              <input
                type="checkbox"
                name="controllerIncluded"
                checked={formData.controllerIncluded}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-purple-600"
              />
            </label>
          </div>
        )}

        {formData.category === "iPad" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Color"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="ipadScreenSize"
              value={formData.ipadScreenSize}
              onChange={handleInputChange}
              placeholder="Screen Size"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="ipadStorage"
              value={formData.ipadStorage}
              onChange={handleInputChange}
              placeholder="Storage"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="ipadRam"
              value={formData.ipadRam}
              onChange={handleInputChange}
              placeholder="RAM"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="ipadBattery"
              value={formData.ipadBattery}
              onChange={handleInputChange}
              placeholder="Battery"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="ipadProcessor"
              value={formData.ipadProcessor}
              onChange={handleInputChange}
              placeholder="Processor"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="ipadOperatingSystem"
              value={formData.ipadOperatingSystem}
              onChange={handleInputChange}
              placeholder="Operating System"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <input
              type="text"
              name="ipadCamera"
              value={formData.ipadCamera}
              onChange={handleInputChange}
              placeholder="Camera"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            />
            <label className="flex items-center space-x-2 text-gray-700">
              <span>Cellular</span>
              <input
                type="checkbox"
                name="cellular"
                checked={formData.cellular}
                onChange={handleInputChange}
                className="form-checkbox h-5 w-5 text-purple-600"
              />
            </label>
          </div>
        )}

        {/* Mövcud Şəkillər */}
        {data && data.product && data.product.images && data.product.images.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {data.product.images
              .filter((img) => !removedImages.includes(img.public_id || img.id))
              .map((img) => (
                <div key={img.public_id || img.id} className="relative">
                  <img
                    src={img.url}
                    alt={formData.name}
                    className="w-32 h-32 object-cover rounded-xl border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(img.public_id || img.id)}
                    className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-bl-lg transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Yeni Şəkillərin Yüklənməsi */}
        <input
          type="file"
          multiple
          onChange={handleNewImagesChange}
          name="newImages"
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
        />

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-full font-semibold transition-all duration-300 shadow-lg"
        >
          {isUpdating ? "Yenilənir..." : "Yenilə"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
