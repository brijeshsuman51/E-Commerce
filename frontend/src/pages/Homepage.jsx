import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { 
  ShoppingBag, Star, Truck, Shield, Loader2, ChevronLeft, ChevronRight, 
  Filter, X, Check, ShoppingCart 
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../cartSlice';


const CategoryCard = ({ title, products, type = "single", navigate, categorySlug }) => {
    if (!products || products.length === 0) return null;
  
    return (
      <div className="bg-white p-4 flex flex-col justify-between h-full z-10 shadow-lg rounded-xl cursor-pointer hover:shadow-xl transition-shadow border border-blue-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800 line-clamp-2 h-14">{title}</h2>
        
        <div className="flex-grow">
          {type === "grid" && products.length >= 4 ? (
            <div className="grid grid-cols-2 gap-2 h-full">
              {products.slice(0, 4).map((item, idx) => (
                <div key={idx} onClick={() => navigate(`/product/${item._id}`)}>
                  <img 
                    src={item.images?.[0]} 
                    alt={item.name} 
                    className="w-full h-24 object-contain mb-1 p-1 bg-gray-50 rounded-lg"
                  />
                  <p className="text-xs text-gray-600 line-clamp-1">{item.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div onClick={() => navigate(`/product/${products[0]._id}`)} className="h-full">
              <img 
                src={products[0].images?.[0]} 
                alt={products[0].name} 
                className="w-full h-64 object-contain mb-2 p-2 bg-gray-50 rounded-lg" 
              />
            </div>
          )}
        </div>
  

        <button 
            onClick={(e) => {
                e.stopPropagation();
                navigate(`/recomendcategory/${categorySlug}`);
            }}
            className="text-sm text-left text-blue-600 font-semibold hover:text-blue-800 hover:underline mt-4 block"
        >
          Explore Category &rarr;
        </button>
      </div>
    );
  };
  

  const ProductCarousel = ({ title, products, navigate, handleAddToCart }) => {
    const scrollRef = useRef(null);
  
    const scroll = (direction) => {
      if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = direction === 'left' ? -500 : 500;
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };
  
    if (!products || products.length === 0) return null;
  
    return (
      <div className="bg-white p-6 mb-8 shadow-sm rounded-xl border border-blue-100 relative group mx-4">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
          {title}
        </h3>
        
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-200 p-2 rounded-full shadow-lg text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-200 p-2 rounded-full shadow-lg text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
  
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div 
              key={product._id} 
              className="flex-none w-52 cursor-pointer group/item flex flex-col"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="w-52 h-52 bg-gray-50 flex items-center justify-center mb-3 rounded-xl p-4 border border-transparent group-hover/item:border-blue-200 transition-all">
                <img 
                  src={product.images?.[0]} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain group-hover/item:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover/item:text-blue-600 h-10">
                {product.name}
              </p>
              <p className="text-lg font-bold text-blue-700 mb-3">${product.price}</p>
              
              {/* Add to Cart Button */}
              <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product._id);
                }}
                disabled={product.stock === 0}
                className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                    product.stock === 0 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

const Homepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoriesList = ['electronics','clothing','books','home','sports','beauty','toys','automotive'];

  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: 'name'
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({...filters});
  const [activeTab, setActiveTab] = useState('category');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/product/getAllProducts');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data || "Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleShopNow = () => {
    const featuredSection = document.getElementById('featured-products');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      alert('Added to cart!');
    } catch (error) {
      alert('Failed: ' + error);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
  };

  const openFilterModal = () => {
    setTempFilters({...filters});
    setIsFilterModalOpen(true);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sortBy: 'name'
    });
    setIsFilterModalOpen(false);
  };


  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false;
    if (filters.minRating && product.rating < parseFloat(filters.minRating)) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'priceLow') return a.price - b.price;
    if (filters.sortBy === 'priceHigh') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });

  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];


  const electronics = products.filter(p => p.category?.toLowerCase().includes('electronic') || p.category?.toLowerCase().includes('tech'));
  const home = products.filter(p => p.category?.toLowerCase().includes('home') || p.category?.toLowerCase().includes('appliance'));
  const fashion = products.filter(p => p.category?.toLowerCase().includes('cloth') || p.category?.toLowerCase().includes('fashion'));

  const displayElectronics = electronics.length ? electronics : products.slice(0, 4);
  const displayHome = home.length ? home : products.slice(4, 8);
  const displayFashion = fashion.length ? fashion : products.slice(8, 9);


  return (
    <div className="min-h-screen bg-blue-50/50 relative">

      {/* TOP FILTER BAR */}
      <section className="bg-white border-b border-blue-100 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex gap-3 items-center">
          
          <button 
            onClick={openFilterModal}
            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg font-medium transition-colors border border-blue-200 whitespace-nowrap"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>

          <div className="w-px h-8 bg-gray-200 mx-1"></div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full pb-1" style={{ scrollbarWidth: 'none' }}>
             <button 
                onClick={() => setFilters({...filters, category: ''})}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              >
                All Products
              </button>
            
            {categoriesList.map((cat) => (
              <button 
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-white text-gray-700 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white relative">
        <div className="container mx-auto px-4 text-center pt-20 pb-48"> 
          <h1 className="text-5xl font-bold mb-6 drop-shadow-md">
            Welcome to Our E-Commerce Store
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, secure delivery.
          </p>
        </div>
      </section>

      {/* QUAD CARDS */}
      <div className="container mx-auto px-4 -mt-32 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard 
            title="Electronics & Gadgets" 
            products={displayElectronics} 
            categorySlug="electronics"
            type="grid" 
            navigate={navigate}
          />
          <CategoryCard 
            title="Home Appliances" 
            products={displayHome} 
            categorySlug="home"
            type="single" 
            navigate={navigate}
          />
          <CategoryCard 
            title="Fashion Trends" 
            products={displayFashion} 
            categorySlug="clothing"
            type="single" 
            navigate={navigate}
          />
          <div className="bg-white p-4 flex flex-col justify-between h-full shadow-lg rounded-xl border border-blue-100">
            <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Sign in for the best experience</h2>
                <button 
                    onClick={() => !user && navigate('/login')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-lg shadow-md transition-colors"
                >
                    {user ? `Welcome back, ${user.firstName}` : 'Sign in securely'}
                </button>
            </div>
            {products[0] && (
               <div className="mt-4 bg-blue-50 rounded-lg p-4 text-center">
                    <img src={products[0]?.images?.[0]} className="w-full h-24 object-contain mx-auto" alt="Deal" />
                    <p className="text-blue-600 font-bold mt-2">Deal of the Day</p>
                    <span className="text-xs text-gray-500">Ends in 02:45:12</span>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <section id="featured-products" className="py-8 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
           {(filters.category || filters.brand || filters.minPrice) && (
             <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
               Showing filtered results
             </span>
           )}
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group bg-white border border-blue-100 rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
                <div 
                  className="relative bg-gray-50 w-full h-60 rounded-lg mb-4 overflow-hidden cursor-pointer flex items-center justify-center"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                  )}
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm">
                      Only {product.stock} left!
                    </span>
                  )}
                </div>

                <div className="text-left">
                  <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">
                    {product.category}
                  </p>
                  <h3 
                    className="font-bold text-gray-900 truncate mb-1 cursor-pointer hover:text-blue-600 transition-colors" 
                    title={product.name}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 4) ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    <button 
                      disabled={product.stock === 0}
                      onClick={() => handleAddToCart(product._id)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
                        product.stock === 0 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                      }`}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CAROUSELS */}
      <div className="container mx-auto pb-10 mt-8">
        <ProductCarousel 
            title="Recommended For You" 
            products={filteredProducts.slice().reverse()} 
            navigate={navigate} 
            handleAddToCart={handleAddToCart}
        />
        <ProductCarousel 
            title="Best Sellers in Home" 
            products={displayHome.filter(p => filteredProducts.includes(p))} 
            navigate={navigate} 
            handleAddToCart={handleAddToCart}
        />
      </div>

      {/* FOOTER & MODAL */}
            <section className="py-16 bg-white border-t border-blue-100">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                      <Truck className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Fast Delivery</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Get your orders delivered quickly and safely to your doorstep within 24 hours.</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                      <Shield className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Secure Shopping</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Your personal information and payments are fully protected with 256-bit encryption.</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-100 transition-colors">
                      <Star className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Quality Products</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">We offer only the highest quality products verified by our quality control team.</p>
                  </div>
                </div>
              </div>
            </section>
      
            <section className="bg-gray-900 text-white py-16">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
                <p className="text-xl mb-8 text-gray-300">Join thousands of satisfied customers today.</p>
                <div className="space-x-4">
                  <button 
                    onClick={handleShopNow}
                    className="bg-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-500 transition-colors shadow-lg hover:shadow-blue-500/50"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </section>

      {isFilterModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  
                  {/* Modal Header */}
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Filter Products</h3>
                    <button onClick={() => setIsFilterModalOpen(false)} className="text-gray-400 hover:text-red-500">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
      
                  <div className="flex flex-1 overflow-hidden">
                    
                    <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                      <button 
                        onClick={() => setActiveTab('category')}
                        className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors ${activeTab === 'category' ? 'bg-white border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:bg-gray-100'}`}
                      >
                        Category
                      </button>
                      <button 
                        onClick={() => setActiveTab('brand')}
                        className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors ${activeTab === 'brand' ? 'bg-white border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:bg-gray-100'}`}
                      >
                        Brands
                      </button>
                      <button 
                        onClick={() => setActiveTab('price')}
                        className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors ${activeTab === 'price' ? 'bg-white border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:bg-gray-100'}`}
                      >
                        Price Range
                      </button>
                      <button 
                        onClick={() => setActiveTab('rating')}
                        className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors ${activeTab === 'rating' ? 'bg-white border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:bg-gray-100'}`}
                      >
                        Rating
                      </button>
                    </div>
      

                    <div className="w-2/3 p-6 overflow-y-auto bg-white">
                      
                      
                      {activeTab === 'category' && (
                        <div className="space-y-3">
                          <h4 className="font-bold text-gray-800 mb-2">Select Category</h4>
                          {['category', 'brand', 'price', 'rating'].map(cat => (
                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${tempFilters.category === cat ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                                 {tempFilters.category === cat && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={tempFilters.category === cat}
                                onChange={() => setTempFilters({...tempFilters, category: tempFilters.category === cat ? '' : cat})}
                              />
                              <span className={`text-sm ${tempFilters.category === cat ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>{cat}</span>
                            </label>
                          ))}
                        </div>
                      )}
      
                      {/* BRAND OPTIONS */}
                      {activeTab === 'brand' && (
                        <div className="space-y-3">
                          <h4 className="font-bold text-gray-800 mb-2">Select Brand</h4>
                          {uniqueBrands.map(brand => (
                            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${tempFilters.brand === brand ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                                 {tempFilters.brand === brand && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={tempFilters.brand === brand}
                                onChange={() => setTempFilters({...tempFilters, brand: tempFilters.brand === brand ? '' : brand})}
                              />
                              <span className={`text-sm ${tempFilters.brand === brand ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>{brand}</span>
                            </label>
                          ))}
                        </div>
                      )}
      
                      {/* PRICE OPTIONS */}
                      {activeTab === 'price' && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-gray-800 mb-2">Price Range</h4>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Minimum Price</label>
                            <input 
                              type="number"
                              placeholder="0"
                              value={tempFilters.minPrice}
                              onChange={(e) => setTempFilters({...tempFilters, minPrice: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Maximum Price</label>
                            <input 
                              type="number"
                              placeholder="10000"
                              value={tempFilters.maxPrice}
                              onChange={(e) => setTempFilters({...tempFilters, maxPrice: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                        </div>
                      )}
      
                      {/* RATING OPTIONS */}
                      {activeTab === 'rating' && (
                        <div className="space-y-3">
                          <h4 className="font-bold text-gray-800 mb-2">Minimum Rating</h4>
                          {[4, 3, 2, 1].map((star) => (
                            <label key={star} className="flex items-center gap-3 cursor-pointer group">
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${tempFilters.minRating === String(star) ? 'border-blue-600' : 'border-gray-300'}`}>
                                 {tempFilters.minRating === String(star) && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                              </div>
                              <input 
                                type="radio" 
                                name="rating"
                                className="hidden"
                                checked={tempFilters.minRating === String(star)}
                                onChange={() => setTempFilters({...tempFilters, minRating: String(star)})}
                              />
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold">{star}+ Stars</span>
                                <div className="flex text-yellow-400">
                                   {[...Array(5)].map((_, i) => (
                                     <Star key={i} className={`w-3 h-3 ${i < star ? 'fill-current' : 'text-gray-300'}`} />
                                   ))}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
      
                    </div>
                  </div>
      
                  {/* Modal Footer */}
                  <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                    <button 
                      onClick={clearFilters}
                      className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={applyFilters}
                      className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-transform active:scale-95"
                    >
                      APPLY FILTER
                    </button>
                  </div>
                </div>
              </div>
            )}

    </div>
  );
};

export default Homepage;