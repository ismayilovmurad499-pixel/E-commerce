import React from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteProductMutation, useGetProductsQuery } from "../../redux/api/productsApi";
import ChartComponent from "./ChartComponent";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { BarChart3, ShoppingBag, PlusCircle, DollarSign, Package } from 'lucide-react'; // Yeni ikonlar
import Swal from "sweetalert2";

const AdminProducts = () => {
    const { data, error, isLoading, refetch } = useGetProductsQuery();
    const [deleteProduct] = useDeleteProductMutation();
    const navigate = useNavigate();

    const products = data?.products || [];
    // Nümunə statistik dəyərləri
    const productNames = products.map((product) => product.name) || [];
    const sales = products.map(() => Math.round(Math.random() * 200) + 50) || [];
    const totalProducts = products.length;
    const averagePrice = products.reduce((acc, p) => acc + p.price, 0) / (totalProducts || 1);

    const handleEdit = (id) => navigate(`/admin/edit-product/${id}`);
    const handleCreate = () => navigate("/admin/create-product");

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Məhsulu silmək istədiyinizdən əminsinizmi?",
            text: "Bu əməliyyat geri qaytarıla bilməz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Xeyr, ləğv et",
            reverseButtons: true,
            customClass: {
                popup: 'shadow-2xl rounded-xl',
                confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                cancelButton: 'bg-gray-400 hover:bg-gray-500',
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteProduct(id).unwrap();
                await refetch();
                Swal.fire("Silindi!", "Məhsul uğurla silindi.", "success");
            } catch (err) {
                console.error("Məhsul silinərkən xəta baş verdi:", err);
                Swal.fire("Xəta!", "Məhsul silinərkən xəta baş verdi.", "error");
            }
        } else {
            Swal.fire("Ləğv edildi", "Məhsul silinmədi", "info");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-2xl text-indigo-400">
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Yüklənir...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-2xl text-red-500">
                <span>❌ Xəta baş verdi: {error.data?.message || error.error}</span>
            </div>
        );
    }

    // --- Statistik Göstəricilər üçün Card Komponenti (Daxili) ---
    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                <div className={`p-2 rounded-full ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
            <p className="mt-1 text-3xl font-extrabold text-gray-900">
                {value}
            </p>
        </div>
    );
    // -------------------------------------------------------------------

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-10">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Dashboard Başlığı */}
                <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tighter">
                    Məhsullar İdarəetmə Paneli 🛍️
                </h1>

                {/* --- Rəqəmsal Statistika Kartları --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        title="Ümumi Məhsul Sayı" 
                        value={totalProducts} 
                        icon={Package} 
                        color="bg-indigo-500"
                    />
                    <StatCard 
                        title="Orta Qiymət" 
                        value={`${averagePrice.toFixed(2)} ₼`} 
                        icon={DollarSign} 
                        color="bg-green-500"
                    />
                    <StatCard 
                        title="Gözlənilən Satışlar (Test)" 
                        value={`+${sales.reduce((a, b) => a + b, 0)}`} 
                        icon={BarChart3} 
                        color="bg-red-500"
                    />
                </div>
                
                {/* --- Qrafik Bölməsi (Daha kiçik kölgə ilə) --- */}
                <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-lg p-6 md:p-10 border border-gray-200">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-3">
                        <BarChart3 className="w-7 h-7 text-indigo-600" />
                        Satış Statistika Qrafiki
                    </h2>
                    {products.length > 0 ? (
                        <ChartComponent 
                            labels={productNames}
                            dataPoints={sales}
                            gradientFrom="#4F46E5"
                            gradientTo="#6366F1"
                        />
                    ) : (
                        <div className="text-center py-8 text-lg text-gray-500">Qrafiki göstərmək üçün kifayət qədər məhsul yoxdur.</div>
                    )}
                </div>
                
                <div className="border-t border-gray-700/50"></div>

                {/* --- Məhsullar Siyahısı --- */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="px-6 md:px-10 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <ShoppingBag className="w-6 h-6 text-indigo-600" />
                            Bütün Məhsullar Siyahısı
                        </h2>
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition-all duration-200 text-base transform hover:-translate-y-0.5"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Yeni Məhsul
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 md:px-10 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 md:px-10 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Məhsul Adı
                                    </th>
                                    <th className="px-6 md:px-10 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Qiymət
                                    </th>
                                    <th className="px-6 md:px-10 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Kateqoriya
                                    </th>
                                    <th className="px-6 md:px-10 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Əməliyyat
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product._id} className="hover:bg-indigo-50/30 transition-all duration-150">
                                            {/* Məhsul ID-si */}
                                            <td className="px-6 md:px-10 py-3 whitespace-nowrap text-sm font-mono text-gray-500">
                                                ...{product._id.slice(-4)}
                                            </td>
                                            {/* Məhsul Adı (Vurğulama) */}
                                            <td className="px-6 md:px-10 py-3 font-semibold text-gray-900 border-l-4 border-indigo-400">
                                                {product.name}
                                            </td>
                                            {/* Qiymət */}
                                            <td className="px-6 md:px-10 py-3 whitespace-nowrap text-base font-extrabold text-blue-600">
                                                {product.price} ₼
                                            </td>
                                            {/* Kateqoriya */}
                                            <td className="px-6 md:px-10 py-3 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {product.category}
                                                </span>
                                            </td>
                                            {/* Əməliyyatlar */}
                                            <td className="px-6 md:px-10 py-3 whitespace-nowrap text-center">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => handleEdit(product._id)}
                                                        className="p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg transition-transform duration-200 transform hover:scale-110"
                                                        title="Düzəliş et"
                                                    >
                                                        <FaRegEdit className="text-lg" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform duration-200 transform hover:scale-110"
                                                        title="Sil"
                                                    >
                                                        <MdDeleteSweep className="text-lg" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-lg text-gray-500">
                                            Heç bir məhsul tapılmadı. Zəhmət olmasa yeni məhsul əlavə edin.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default AdminProducts;