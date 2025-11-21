import React from 'react'
import { Link } from 'react-router-dom' 
import { Search, Calendar, User } from 'lucide-react' // Yeni ikonlar əlavə edildi

// --- Mock Data (Test məlumatları) ---

// Recent Posts Mock Data (Sidebar üçün)
const recentPosts = [
  { id: 1, category: "JEAN", title: "Fashion Trends In Summer 2024", imageUrl: "" },
  { id: 2, category: "FRUITS", title: "Organic Good For Health Trending in Winter 2024", imageUrl: "" },
  { id: 3, category: "YOGA", title: "Trending Excercise in Summer 2024", imageUrl: "" },
]

// Main Blog Posts Mock Data (Əsas məzmun üçün)
const mockBlogPosts = [
    { 
        id: 101, 
        categories: ["JEAN", "SHOES"], 
        title: "How To Build A Sustainable And Stylish Wardrobe", 
        author: "Alex Balde", 
        date: "Dec 21, 2023", 
        excerpt: "Build a versatile and timeless wardrobe with our list of must-have fashion staples. From the classic little black dress to the perfect pair of jeans.",
        imageUrl: "https://res.cloudinary.com/derzgbs7x/image/upload/v1740132581/products/xmpyisulgltsv4k6ypfs.png"
    },
    { 
        id: 102, 
        categories: ["BEAUTY"], 
        title: "The Ultimate Guide to Winter Skincare Routines", 
        author: "Emily Clark", 
        date: "Jan 15, 2024", 
        excerpt: "Keep your skin hydrated and glowing all winter long with these expert tips and product recommendations for cold weather.",
        imageUrl: "https://res.cloudinary.com/derzgbs7x/image/upload/v1740132581/products/xmpyisulgltsv4k6ypfs.png"
    },
];

// --- Kiçik Post Kartı komponenti (Sidebar üçün) ---
const RecentPostCard = ({ post }) => (
  <Link to={`/blog/${post.id}`} className="flex items-center space-x-4 group">
    {/* Image */}
    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden relative">
      <img
        // Placeholder istifadə olunur, çünki mock datada imageUrl boşdur
        src={`https://placehold.co/64x64/E9DCC9/333333?text=${post.category}`} 
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span className="absolute top-1 left-1 bg-black text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full">
        {post.category}
      </span>
    </div>
    
    {/* Content */}
    <div>
      <h4 className="text-sm font-medium text-gray-800 group-hover:text-black transition-colors leading-snug">
        {post.title}
      </h4>
    </div>
  </Link>
);

// --- Əsas Blog Post Kartı komponenti (Yeni əlavə) ---
const BlogPostCard = ({ post }) => {
    // Şəkildəki kateqoriya etiketinin rənginə uyğun Tailwind class-ı
    const categoryClass = "bg-[#d8e8ca] text-[#4d7328] font-bold text-xs uppercase px-3 py-1 rounded-full mr-2 mb-2 inline-block";

    return (
        <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
            {/* Image Section */}
            <div className="overflow-hidden">
                <Link to={`/blog/${post.id}`}>
                    <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-80 object-cover transition-transform duration-500 hover:scale-[1.03] rounded-t-xl"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x400/DCC7B3/333333?text=Blog+Image"; }}
                    />
                </Link>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
                {/* Categories */}
                <div className="flex flex-wrap">
                    {post.categories.map((cat, index) => (
                        <span key={index} className={categoryClass}>
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight hover:text-black transition-colors">
                    <Link to={`/blog/${post.id}`}>
                        {post.title}
                    </Link>
                </h2>

                {/* Metadata (Author & Date) */}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>by {post.author}</span>
                    </div>
                    <span className="text-gray-400">—</span>
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{post.date}</span>
                    </div>
                </div>

                {/* Excerpt */}
                <p className="text-gray-700 leading-relaxed pt-2">
                    {post.excerpt}
                </p>

                {/* Read More Link */}
                <Link 
                    to={`/blog/${post.id}`} 
                    className="inline-block text-sm font-semibold text-gray-900 hover:text-black transition-colors border-b-2 border-transparent hover:border-black pb-1"
                >
                    Read More
                </Link>
            </div>
        </article>
    );
};


const Blog = () => {
  return (
    <>
      {/* Blog Page Header / Başlıq hissəsi */}
      <section className="bg-[#faf7f0] py-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Əsas Başlıq */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Blog Default
          </h1>
          
          {/* Breadcrumb Naviqasiyası */}
          <nav className="text-sm font-medium text-gray-600">
            <ol className="flex justify-center space-x-2">
              <li>
                <Link to="/" className="hover:text-black transition-colors">
                  Homepage
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-semibold">
                Blog Default
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* --- Blog Məzmunu və Sidebar --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Sol Tərəf: Əsas Blog Məzmunu (2/3 hissə) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Blog Postlarını Listləmə (BlogPostCard istifadə olunur) */}
            {mockBlogPosts.map(post => (
                <BlogPostCard key={post.id} post={post} />
            ))}
            
            {/* Pagination */}
            <div className="flex justify-center pt-8">
                <nav className="inline-flex items-center space-x-2 rounded-full border border-gray-200 p-1">
                    <button className="px-4 py-2 text-sm font-medium text-gray-500 rounded-full hover:bg-gray-100 transition-colors">
                        Previous
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-full shadow-md">
                        1
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                        2
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-500 rounded-full hover:bg-gray-100 transition-colors">
                        Next
                    </button>
                </nav>
            </div>
            
          </div>
          
          {/* Sağ Tərəf: Sidebar (1/3 hissə) */}
          <aside className="lg:col-span-1 space-y-10">
            
            {/* 1. Axtarış Çubuğu */}
            <div className="border border-gray-200 rounded-lg p-4">
              <form className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-black transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>
            
            {/* 2. Son Postlar (Recent Posts) */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Recent Posts
              </h3>
              <div className="space-y-6">
                {recentPosts.map((post) => (
                  <RecentPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
            
            {/* 3. Digər Sidebar Məzmunu: Kateqoriyalar */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Categories
              </h3>
              <ul className="space-y-3">
                {['Fashion (12)', 'Life Style (8)', 'Technology (5)', 'Food (10)', 'Travel (3)'].map((category, index) => (
                    <li key={index}>
                        <Link to={`/category/${category.split(' ')[0].toLowerCase()}`} className="flex justify-between items-center text-gray-700 hover:text-black transition-colors border-b border-gray-100 pb-2">
                            <span>{category.split('(')[0].trim()}</span>
                            <span className="text-sm font-semibold">({category.split('(')[1].replace(')', '')})</span>
                        </Link>
                    </li>
                ))}
              </ul>
            </div>
            
          </aside>
          
        </div>
        
      </div>
    </>
  )
}

export default Blog