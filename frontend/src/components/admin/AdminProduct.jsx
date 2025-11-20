import React from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteProductMutation, useGetProductsQuery } from "../../redux/api/productsApi";
import ChartComponent from "./ChartComponent";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import Swal from "sweetalert2";

const AdminProducts = () => {
  const { data, error, isLoading, refetch } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const navigate = useNavigate();

  // İstatistik üçün məhsul adları və rastgele satış dəyərləri (nümunə məqsədli)
  const products = data?.products?.map((product) => product.name) || [];
  const sales = data?.products?.map(() => Math.round(Math.random() * 200) + 50) || [];

  const handleEdit = (id) => navigate(`/admin/edit-product/${id}`);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Məhsulu silmək istədiyinizdən əminsinizmi?",
      text: "Bu əməliyyat geri qaytarıla bilməz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Xeyr, ləğv et",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        await refetch();
        Swal.fire("Silindi!", "Məhsul uğurla silindi.", "success");
      } catch (error) {
        console.error("Məhsul silinərkən xəta baş verdi:", error);
        Swal.fire("Xəta!", "Məhsul silinirken xəta baş verdi.", "error");
      }
    } else {
      Swal.fire("Ləğv edildi", "Məhsul silinmədi", "info");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl text-gray-300">
        <span>📦 Yüklənir...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl text-red-500">
        <span>❌ Xəta: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* İstatistikler – Grafik Bölməsi */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-3xl p-6 md:p-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 md:mb-8 tracking-wide">
            Admin Panel Statistika
          </h2>
          <ChartComponent 
            labels={products}
            dataPoints={sales}
            gradientFrom="#4F46E5"
            gradientTo="#6366F1"
          />
        </div>

        {/* Məhsullar Siyahısı */}
        <div className="bg-white rounded-3xl shadow-3xl overflow-hidden">
          <div className="px-4 md:px-8 py-4 md:py-6 border-b border-gray-300 bg-gradient-to-r from-gray-100 to-gray-50">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 tracking-wide">
              Məhsullar Siyahısı
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 md:px-8 py-3 text-left text-base md:text-lg font-semibold text-gray-600 uppercase tracking-wider">
                    Ad
                  </th>
                  <th className="px-4 md:px-8 py-3 text-left text-base md:text-lg font-semibold text-gray-600 uppercase tracking-wider">
                    Qiymət
                  </th>
                  <th className="px-4 md:px-8 py-3 text-left text-base md:text-lg font-semibold text-gray-600 uppercase tracking-wider">
                    Kateqoriya
                  </th>
                  <th className="px-4 md:px-8 py-3 text-center text-base md:text-lg font-semibold text-gray-600 uppercase tracking-wider">
                    Əməliyyatlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 md:px-8 py-3 whitespace-nowrap text-base md:text-lg font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 md:px-8 py-3 whitespace-nowrap text-base md:text-lg font-semibold text-blue-600">
                      {product.price} AZN
                    </td>
                    <td className="px-4 md:px-8 py-3 whitespace-nowrap text-base md:text-lg text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-4 md:px-8 py-3 whitespace-nowrap text-base md:text-lg text-center">
                      <div className="flex justify-center gap-2 md:gap-4">
                        <button
                          onClick={() => handleEdit(product._id)}
                          className="p-2 md:p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors duration-200"
                        >
                          <FaRegEdit className="text-xl md:text-2xl" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 md:p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200"
                        >
                          <MdDeleteSweep className="text-xl md:text-2xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
