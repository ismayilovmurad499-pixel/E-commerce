import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
import { useGetProductsQuery } from '../redux/api/productsApi';
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const Product = ({ category }) => {
  const { data, error, isError } = useGetProductsQuery();
  const { name } = useParams(); // URL-dən məhsul adını alırıq
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  // Məhsulları filtrlə
  const filteredProducts = data?.products?.filter((product) => {
    if (name) {
      // Əgər URL-də məhsul adı varsa, onu da nəzərə al
      return (
        product.name.toLowerCase().includes(name.toLowerCase()) &&
        (!category || product.category === category)
      );
    }
    // Əgər kateqoriya varsa, yalnız o kateqoriyaya aid məhsulları göstər
    return !category || product.category === category;
  });

  useEffect(() => {
    if (name && filteredProducts?.length === 0) {
      navigate("/404"); // Məhsul tapılmadıqda 404 səhifəsinə yönləndir
    }
  }, [name, filteredProducts, navigate]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 container mx-auto my-[20px]'>
      {filteredProducts?.map((product) => (
        <ProductCard key={product.id} mehsul={product} />
      ))}
    </div>
  );
};

export default Product;