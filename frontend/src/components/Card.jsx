import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
import { useGetCartQuery } from '../redux/api/productsApi';
import { toast } from "react-hot-toast";

const Card = () => {
  const { data, error, isError, refetch } = useGetCartQuery(); // Sepeti çekiyoruz

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Bir hata oluştu.");
    }
  }, [isError, error]);

  // Eğer sepet boşsa, kullanıcıyı bilgilendir
  if (!data || !data.products || data.products.length === 0) {
    return <div className="text-center text-gray-600">Sepetiniz boş.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 container mx-auto my-[20px]">
      {data.products.map((product) => (
        <ProductCard key={product._id} mehsul={product} />
      ))}
    </div>
  );
};

export default Card;