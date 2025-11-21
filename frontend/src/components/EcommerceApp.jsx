"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { toast } from "react-hot-toast";

// RTK Query hook'ları
import { useGetProductsQuery, useGetFilteredProductsQuery } from "../redux/api/productsApi";

// Custom Button component
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-black focus:ring-gray-500 shadow-sm hover:shadow-md",
    outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300 shadow-sm hover:shadow-md",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    pagination: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
    paginationActive: "bg-gray-900 text-white border-gray-900 hover:bg-black focus:ring-gray-500",
  };
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Slider component
const Slider = ({
  min,
  max,
  step = 1,
  value: controlledValue,
  defaultValue = min,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full h-6">
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2">
        <div
          className="absolute top-0 left-0 h-full bg-gray-900 rounded-full transition-all duration-200"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div
        className="absolute top-1/2 w-5 h-5 bg-gray-900 border-2 border-white rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-200 hover:scale-110"
        style={{ left: `calc(${percentage}% - 10px)` }}
      />
    </div>
  );
};

// Custom Checkbox component
const Checkbox = ({ label, ...props }) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900 transition-colors duration-200"
        {...props}
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 font-medium">
        {label}
      </span>
    </label>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  // Sayfa numaralarını oluştur
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pages.push("...");
    }
  }

  // Tekrar eden "..." leri kaldır
  const uniquePages = pages.filter((page, index) => pages.indexOf(page) === index);

  return (
    <div className="flex items-center justify-center space-x-3 mt-12">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>

      <div className="flex items-center space-x-2">
        {uniquePages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`min-w-[44px] h-10 px-3 rounded-lg font-semibold transition-all duration-200 border ${
              page === currentPage
                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                : page === "..."
                ? "text-gray-400 cursor-default border-transparent"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

const EcommerceApp = () => {
  // Price aralığı üçün state
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(5000);

  // Seçilmiş filtrlər üçün state'lər
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedScreenSizes, setSelectedScreenSizes] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [selectedBatteries, setSelectedBatteries] = useState([]);
  const [selectedProcessors, setSelectedProcessors] = useState([]);

  // Sayfalama state'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Sidebar bölmələrinin açıq/bağlı vəziyyəti
  const [expandedSections, setExpandedSections] = useState([
    "category",
    "brand",
    "memory",
    "screenSize",
    "storage",
    "battery",
    "processor",
    "color",
  ]);

  // Mobil filter modalının vəziyyəti
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Bütün məhsulları gətiririk (dinamik filterlər üçün)
  const { data: allData, isError: isAllError, error: allError } =
    useGetProductsQuery();

  useEffect(() => {
    if (isAllError) {
      console.log(allError);
      toast.error(allError?.data?.message || "Bir xəta baş verdi.");
    }
  }, [isAllError, allError]);

  // Sayfa değiştiğinde scroll'u yukarı al
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Dinamik kateqoriyalar (bütün məhsullar üzərində)
  const categoryObj = allData?.products?.reduce((acc, product) => {
    const cat = product.category;
    if (cat) {
      acc[cat] = (acc[cat] || 0) + 1;
    }
    return acc;
  }, {});
  const dynamicCategories = categoryObj
    ? Object.entries(categoryObj).map(([name, count]) => ({ name, count }))
    : [];

  // Seçilmiş kateqoriyalara əsaslanaraq digər filterlər üçün məhsulları süzürük
  const filteredProductsForFilters =
    selectedCategories.length > 0
      ? allData?.products?.filter((product) =>
          selectedCategories.includes(product.category)
        )
      : allData?.products;

  // Dinamik marka filteri
  const brandObj = filteredProductsForFilters?.reduce((acc, product) => {
    const seller = product.seller;
    if (seller) {
      acc[seller] = (acc[seller] || 0) + 1;
    }
    return acc;
  }, {});
  const dynamicBrands = brandObj
    ? Object.entries(brandObj).map(([name, count]) => ({ name, count }))
    : [];

  const memoryObj = filteredProductsForFilters?.reduce((acc, product) => {
    const mem = product.ram;
    if (mem) {
      acc[mem] = (acc[mem] || 0) + 1;
    }
    return acc;
  }, {});
  const dynamicMemory = memoryObj
    ? Object.entries(memoryObj).map(([size, count]) => ({ size, count }))
    : [];

  const colorObj = filteredProductsForFilters?.reduce((acc, product) => {
    const clr = product.color;
    if (clr) {
      acc[clr] = (acc[clr] || 0) + 1;
    }
    return acc;
  }, {});
  const dynamicColors = colorObj
    ? Object.entries(colorObj).map(([name, count]) => ({ name, count }))
    : [];

  const screenSizeObj = filteredProductsForFilters?.reduce((acc, product) => {
    const size = product.screenSize;
    if (size) {
      acc[size] = (acc[size] || 0) + 1;
    }
    return acc;
  }, {});
  const dynamicScreenSizes = screenSizeObj
    ? Object.entries(screenSizeObj).map(([name, count]) => ({ name, count }))
    : [];

  const storageObj = filteredProductsForFilters?.reduce((acc, product) => {
    const st = product.storage;
    if (st) {
      acc[st] = (acc[st] || 0) + 1;
    }
    return acc;
  }, {});
  const dynamicStorage = storageObj
    ? Object.entries(storageObj).map(([name, count]) => ({ name, count }))
    : [];

  const batteryObj = filteredProductsForFilters?.reduce((acc, product) => {
    const bat = product.battery;
    if (bat) {
      acc[bat] = (acc[bat] || 0) + 1;
    }
    return acc;
  }, {});
  const dynamicBatteries = batteryObj
    ? Object.entries(batteryObj).map(([name, count]) => ({ name, count }))
    : [];

  const processorObj = filteredProductsForFilters?.reduce((acc, product) => {
    const proc = product.processor;
    if (proc) {
      acc[proc] = (acc[proc] || 0) + 1;
    }
    return acc;
  }, {});
  const dynamicProcessors = processorObj
    ? Object.entries(processorObj).map(([name, count]) => ({ name, count }))
    : [];

  // Sidebar üçün filter məlumatları
  const filterData = {
    category: {
      label: "Category",
      items: dynamicCategories,
      selected: selectedCategories,
      setSelected: setSelectedCategories,
    },
    brand: {
      label: "Brand",
      items: dynamicBrands,
      selected: selectedBrands,
      setSelected: setSelectedBrands,
    },
    memory: {
      label: "RAM",
      items: dynamicMemory,
      selected: selectedMemory,
      setSelected: setSelectedMemory,
    },
    screenSize: {
      label: "Screen Size",
      items: dynamicScreenSizes,
      selected: selectedScreenSizes,
      setSelected: setSelectedScreenSizes,
    },
    storage: {
      label: "Storage",
      items: dynamicStorage,
      selected: selectedStorage,
      setSelected: setSelectedStorage,
    },
    battery: {
      label: "Battery",
      items: dynamicBatteries,
      selected: selectedBatteries,
      setSelected: setSelectedBatteries,
    },
    processor: {
      label: "Processor",
      items: dynamicProcessors,
      selected: selectedProcessors,
      setSelected: setSelectedProcessors,
    },
    color: {
      label: "Color",
      items: dynamicColors,
      selected: selectedColors,
      setSelected: setSelectedColors,
    },
  };

  // Filter endpoint üçün parametrlər
  const filterParams = {
    priceMin,
    priceMax,
    category: selectedCategories.length ? selectedCategories.join(",") : undefined,
    seller: selectedBrands.length ? selectedBrands.join(",") : undefined,
    ram: selectedMemory.length ? selectedMemory.join(",") : undefined,
    color: selectedColors.length ? selectedColors.join(",") : undefined,
    screenSize: selectedScreenSizes.length ? selectedScreenSizes.join(",") : undefined,
    storage: selectedStorage.length ? selectedStorage.join(",") : undefined,
    battery: selectedBatteries.length ? selectedBatteries.join(",") : undefined,
    processor: selectedProcessors.length ? selectedProcessors.join(",") : undefined,
  };

  // Backend-dən filterlənmiş məhsulları gətiririk
  const { data: filteredData, error: filterError, isError: isFilterError } =
    useGetFilteredProductsQuery(filterParams);

  useEffect(() => {
    if (isFilterError) {
      console.log(filterError);
      toast.error(
        filterError?.data?.message || "Məhsullar filterlənərkən xəta baş verdi."
      );
    }
  }, [isFilterError, filterError]);

  // Sayfalama hesaplamaları
  const filteredProducts = filteredData?.products || [];
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Mevcut sayfadaki ürünleri al
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Sayfa değiştirildiğinde
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Filtre değiştiğinde sayfayı sıfırla
  useEffect(() => {
    setCurrentPage(1);
  }, [priceMin, priceMax, selectedCategories, selectedBrands, selectedMemory, 
      selectedColors, selectedScreenSizes, selectedStorage, selectedBatteries, selectedProcessors]);

  // Sidebar bölmələrinin açılıb/bağlanma funksiyası
  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen ">
      {/* Yeni Header - Resimdeki gibi */}
      <div className="bg-[#faf7f0] py-12 border-b border-gray-200 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#faf7f0]">
          <div className="text-center">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4">
              <ol className="flex items-center justify-center space-x-2 bg-[#faf7f0]">
                <li>
                  <a href="#" className="hover:text-gray-700 transition-colors duration-200">
                    DEMO
                  </a>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium">Shop</li>
              </ol>
            </nav>
            
            {/* Ana Başlık */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Shop
            </h1>

            {/* Kategori Menüsü */}
           
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Mobil Sidebar */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters & Sort
            </button>
          </div>

          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
              <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-8">
                  {/* Price Filter */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Price Range</h3>
                    <div className="space-y-5">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Min</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={priceMin}
                            onChange={(e) => setPriceMin(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Max</label>
                          <input
                            type="number"
                            placeholder="5000"
                            value={priceMax}
                            onChange={(e) => setPriceMax(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                      <Slider min={0} max={5000} value={priceMax} onChange={setPriceMax} />
                    </div>
                  </div>
                  
                  {/* Dinamik Sidebar Bölmələri */}
                  {Object.keys(filterData).map((section) => (
                    <div key={section} className="border-b border-gray-200 pb-6">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSection(section)}
                        className="flex justify-between items-center w-full py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      >
                        <span className="font-bold text-gray-900 text-base">
                          {filterData[section].label}
                        </span>
                        <span
                          className={`transform transition-transform duration-200 ${
                            expandedSections.includes(section)
                              ? "rotate-180"
                              : ""
                          }`}
                        >
                          ▼
                        </span>
                      </Button>
                      {expandedSections.includes(section) && (
                        <div className="mt-4 space-y-4">
                          {section !== "color" && (
                            <div className="relative">
                              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                              />
                            </div>
                          )}
                          <div className="space-y-1 max-h-60 overflow-y-auto">
                            {filterData[section].items.map((item) => (
                              <div
                                key={item.name || item.size}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                              >
                                <Checkbox
                                  label={item.name || item.size}
                                  checked={filterData[section].selected.includes(
                                    item.name || item.size
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      filterData[section].setSelected([
                                        ...filterData[section].selected,
                                        item.name || item.size,
                                      ]);
                                    } else {
                                      filterData[section].setSelected(
                                        filterData[section].selected.filter(
                                          (val) =>
                                            val !== (item.name || item.size)
                                        )
                                      );
                                    }
                                  }}
                                />
                                <span className="text-gray-500 text-sm font-medium bg-gray-100 px-2 py-1 rounded-full">
                                  {item.count}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button 
                    onClick={() => setIsMobileFilterOpen(false)} 
                    className="w-full py-4 text-base font-semibold"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden lg:block sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto bg-white shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
            <div className="space-y-8">
              {/* Price Filter */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={priceMin}
                        onChange={(e) => setPriceMin(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max</label>
                      <input
                        type="number"
                        placeholder="5000"
                        value={priceMax}
                        onChange={(e) => setPriceMax(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  <Slider min={0} max={5000} value={priceMax} onChange={setPriceMax} />
                </div>
              </div>
              
              {/* Dinamik Sidebar Bölmələri */}
              {Object.keys(filterData).map((section) => (
                <div key={section} className="border-b border-gray-200 pb-6">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSection(section)}
                    className="flex justify-between items-center w-full py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <span className="font-bold text-gray-900">
                      {filterData[section].label}
                    </span>
                    <span
                      className={`transform transition-transform duration-200 ${
                        expandedSections.includes(section)
                          ? "rotate-180"
                          : ""
                      }`}
                    >
                      ▼
                    </span>
                  </Button>
                  {expandedSections.includes(section) && (
                    <div className="mt-4 space-y-4">
                      {section !== "color" && (
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      )}
                      <div className="space-y-1 max-h-60 overflow-y-auto">
                        {filterData[section].items.map((item) => (
                          <div
                            key={item.name || item.size}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Checkbox
                              label={item.name || item.size}
                              checked={filterData[section].selected.includes(
                                item.name || item.size
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  filterData[section].setSelected([
                                    ...filterData[section].selected,
                                    item.name || item.size,
                                  ]);
                                } else {
                                  filterData[section].setSelected(
                                    filterData[section].selected.filter(
                                      (val) =>
                                        val !== (item.name || item.size)
                                    )
                                  );
                                }
                              }}
                            />
                            <span className="text-gray-500 text-sm font-medium bg-gray-100 px-2 py-1 rounded-full">
                              {item.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <main>
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <div className="text-lg text-gray-700 mb-4 sm:mb-0">
                  <span className="font-bold text-gray-900 text-xl">
                    {totalItems}
                  </span>{" "}
                  products found
                  {totalPages > 1 && (
                    <span className="ml-3 text-gray-500 font-medium">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
                </div>
                <select className="w-full sm:w-auto px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 font-medium shadow-sm">
                  <option value="relevance">Sort by Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {currentItems.map((product) => (
                  <ProductCard key={product._id} mehsul={product} />
                ))}
              </div>

              {/* Sayfalama */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EcommerceApp;