"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
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
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  };
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2",
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
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2">
        <div
          className="absolute top-0 left-0 h-full bg-black rounded-full"
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
        className="absolute top-1/2 w-4 h-4 bg-black rounded-full shadow transform -translate-y-1/2"
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
};

// Custom Checkbox component
const Checkbox = ({ label, ...props }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-black rounded border-gray-300 focus:ring-black"
        {...props}
      />
      <span className="text-sm">{label}</span>
    </label>
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

  // Sidebar bölmələrinin açıq/bağlı vəziyyəti
  const [expandedSections, setExpandedSections] = useState([
    "category",
    "brand",
    "memory",
    "screenSize",
    "storage",
    "battery",
    "processor",
    // İstəyə görə digər bölmələr
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

  // Sidebar bölmələrinin açılıb/bağlanma funksiyası
  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-14 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              Shop - Full Width
            </h1>
            <p className="text-gray-200 font-medium mt-2 text-lg">
              HOME / <span className="text-white font-semibold">SHOP</span>
            </p>
          </div>
          <img
            src="https://res.cloudinary.com/dwdvr0oxa/image/upload/v1739266328/banner_eqhh6u.png"
            alt="Product"
            className="h-40 md:h-52 lg:h-60 object-contain drop-shadow-xl transition-all duration-500 hover:scale-105"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-800">
                Home
              </a>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-800">
                Catalog
              </a>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-800">Smartphones</li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Mobil Sidebar */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </button>
          </div>

          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
              <div
                className="absolute inset-0 bg-black bg-opacity-25"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-6">
                  {/* Price Filter */}
                  <div>
                    <h3 className="font-medium mb-4">Price</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <input
                          type="number"
                          placeholder="From"
                          value={priceMin}
                          onChange={(e) =>
                            setPriceMin(Number(e.target.value))
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <input
                          type="number"
                          placeholder="To"
                          value={priceMax}
                          onChange={(e) =>
                            setPriceMax(Number(e.target.value))
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <Slider min={0} max={5000} value={priceMax} onChange={setPriceMax} />
                    </div>
                  </div>
                  {/* Dinamik Sidebar Bölmələri */}
                  {Object.keys(filterData).map((section) => (
                    <div key={section} className="border-b pb-4">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSection(section)}
                        className="flex justify-between items-center w-full py-2"
                      >
                        <span className="font-medium">
                          {filterData[section].label}
                        </span>
                        <span
                          className={`transform transition-transform ${
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
                              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              />
                            </div>
                          )}
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {filterData[section].items.map((item) => (
                              <div
                                key={item.name || item.size}
                                className="flex items-center justify-between"
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
                                <span className="text-gray-500">
                                  ({item.count})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button onClick={() => setIsMobileFilterOpen(false)} className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden lg:block sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-6">
              {/* Price Filter */}
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceMin}
                      onChange={(e) => setPriceMin(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <Slider min={0} max={5000} value={priceMax} onChange={setPriceMax} />
                </div>
              </div>
              {/* Dinamik Sidebar Bölmələri */}
              {Object.keys(filterData).map((section) => (
                <div key={section}>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSection(section)}
                    className="flex justify-between items-center w-full py-2"
                  >
                    <span className="font-medium">
                      {filterData[section].label}
                    </span>
                    <span
                      className={`transform transition-transform ${
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
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      )}
                      <div className="space-y-3">
                        {filterData[section].items.map((item) => (
                          <div
                            key={item.name || item.size}
                            className="flex items-center justify-between"
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
                            <span className="text-gray-500">
                              ({item.count})
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
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                  <span className="font-medium text-gray-900">
                    {filteredData?.products?.length || 0}
                  </span>{" "}
                  products found
                </div>
                <select className="w-full sm:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black">
                  <option value="relevance">Sort by Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData?.products?.map((product) => (
                  <ProductCard key={product._id} mehsul={product} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EcommerceApp;
