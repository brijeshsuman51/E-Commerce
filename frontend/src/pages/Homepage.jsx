import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { 
  Loader2, ChevronLeft, ChevronRight, 
  Filter, X, ShoppingCart, Clock, Zap, Mail, Megaphone
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../cartSlice';

const CategoryCard = ({ title, products, type = "single", navigate, categorySlug, handleProductClick }) => {
    if (!products || products.length === 0) return null;
  
    return (
      <div className="bg-white p-4 flex flex-col justify-between h-full z-10 shadow-lg rounded-xl cursor-pointer hover:shadow-xl transition-shadow border border-blue-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800 line-clamp-2 h-14">{title}</h2>
        
        <div className="flex-grow">
          {type === "grid" && products.length >= 4 ? (
            <div className="grid grid-cols-2 gap-2 h-full">
              {products.slice(0, 4).map((item, idx) => (
                <div key={idx} onClick={() => handleProductClick(item)}>
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
            <div onClick={() => handleProductClick(products[0])} className="h-full">
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

const ProductCarousel = ({ title, products, navigate, handleAddToCart, freshSaleData, handleProductClick }) => {
    const scrollRef = useRef(null);
  
    const scroll = (direction) => {
      if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = direction === 'left' ? -500 : 500;
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };
  
    const getPrice = (product) => {
        if (freshSaleData && freshSaleData.productId === product._id && freshSaleData.isActive) {
            const discounted = product.price * (1 - freshSaleData.discount / 100);
            return (
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400 line-through">${product.price}</span>
                    <span className="text-lg font-bold text-red-600 flex items-center gap-1">
                        ${discounted.toFixed(2)} <Zap className="w-3 h-3 fill-current" />
                    </span>
                </div>
            );
        }
        return <p className="text-lg font-bold text-blue-700 mb-3">${product.price}</p>;
    };
  
    if (!products || products.length === 0) return null;
  
    return (
      <div className="bg-white p-6 mb-8 shadow-sm rounded-xl border border-blue-100 relative group mx-4">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
          {title}
        </h3>
        
        <button onClick={() => scroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-200 p-2 rounded-full shadow-lg text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={() => scroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-blue-200 p-2 rounded-full shadow-lg text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50">
          <ChevronRight className="w-6 h-6" />
        </button>
  
        <div ref={scrollRef} className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {products.map((product) => (
            <div key={product._id} className="flex-none w-52 cursor-pointer group/item flex flex-col" onClick={() => handleProductClick(product)}>
              <div className="w-52 h-52 bg-gray-50 flex items-center justify-center mb-3 rounded-xl p-4 border border-transparent group-hover/item:border-blue-200 transition-all relative">
                {freshSaleData?.productId === product._id && freshSaleData.isActive && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-md z-10 animate-pulse">
                        -{freshSaleData.discount}% OFF
                    </span>
                )}
                <img src={product.images?.[0]} alt={product.name} className="max-w-full max-h-full object-contain group-hover/item:scale-105 transition-transform duration-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover/item:text-blue-600 h-10">
                {product.name}
              </p>
              <div className="mb-3 h-12 flex items-center">
                  {getPrice(product)}
              </div>
              
              <button
                onClick={(e) => { e.stopPropagation(); handleAddToCart(product._id); }}
                disabled={product.stock === 0}
                className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                    product.stock === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white'
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
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const featuredScrollRef = useRef(null);

  const categoriesList = ['electronics','clothing','books','home','sports','beauty','toys','automotive'];

  const [filters, setFilters] = useState({ category: '', brand: '', minPrice: '', maxPrice: '', minRating: '', sortBy: 'name', search: '' });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({...filters});
  const [freshSaleData, setFreshSaleData] = useState({ isActive: false, timeString: '00:00:00', productId: null, discount: 0 });
  const [freshProduct, setFreshProduct] = useState(null);

  useEffect(() => {
    const fetchFreshSale = async () => {
      try {
        const response = await axiosClient.get('/freshsale/current');
        const data = response.data.freshSale;
        
        if (data) {
          setFreshSaleData({
            isActive: true,
            timeString: data.timeString,
            productId: data.productId,
            discount: data.discount
          });
        } else {
          setFreshSaleData({ isActive: false, timeString: '00:00:00', productId: null, discount: 0 });
        }
      } catch (err) {
        // console.error("Error fetching fresh sale:", err);
        setFreshSaleData({ isActive: false, timeString: '00:00:00', productId: null, discount: 0 });
      }
    };

    fetchFreshSale();
    const interval = setInterval(fetchFreshSale, 1000);
    return () => clearInterval(interval);
  }, []);

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


  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }
  }, [searchParams]);

  useEffect(() => {
      if (products.length > 0 && freshSaleData.productId) {
          const found = products.find(p => p._id === freshSaleData.productId);
          setFreshProduct(found);
      }
  }, [products, freshSaleData.productId]);

  const handleShopNow = () => {
    const featuredSection = document.getElementById('featured-products');
    if (featuredSection) featuredSection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = async (productId) => {
    if (!user) { navigate('/login'); return; }
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      alert('Added to cart!');
    } catch (error) { alert('Failed: ' + error); }
  };


  const trackSearchHistory = async (query, category = '') => {
    if (!user || !query.trim()) return;
    try {
      await axiosClient.post('/user/searchHistory', { query, category });
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  };

  const trackProductClick = async (product) => {
    if (!user) return;
    try {
      await axiosClient.post('/user/clickedProduct', {
        productId: product._id,
        productName: product.name,
        productCategory: product.category
      });
    } catch (error) {
      console.error('Failed to track product click:', error);
    }
  };

  const handleProductClick = async (product) => {
    const searchQuery = searchParams.get('search');
    if (user && searchQuery) {
      try {
        await axiosClient.post('/user/searchHistory', {
          productId: product._id,
          productName: product.name,
          productCategory: product.category,
          searchQuery: searchQuery
        });
      } catch (error) {
        console.error('Failed to track search history:', error);
      }
    }
    
    await trackProductClick(product);
    navigate(`/product/${product._id}`);
  };

  const handleCategoryClick = (category) => {
    setFilters({...filters, category});
    if (user) {
      trackSearchHistory(`Category: ${category}`, category);
    }
  };
  
  const scrollFeatured = (direction) => {
    if (featuredScrollRef.current) {
      const { current } = featuredScrollRef;
      const scrollAmount = direction === 'left' ? -500 : 500;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const openFilterModal = () => { setTempFilters({...filters}); setIsFilterModalOpen(true); };
  const applyFilters = () => { 
    setFilters(tempFilters); 
    setIsFilterModalOpen(false);
    

    if (user && (tempFilters.category || tempFilters.brand || tempFilters.minPrice || tempFilters.maxPrice)) {
      const searchQuery = `Filter: ${tempFilters.category || 'All'} ${tempFilters.brand ? `Brand: ${tempFilters.brand}` : ''} ${tempFilters.minPrice ? `Min: $${tempFilters.minPrice}` : ''} ${tempFilters.maxPrice ? `Max: $${tempFilters.maxPrice}` : ''}`.trim();
      trackSearchHistory(searchQuery, tempFilters.category || '');
    }
  };
  const clearFilters = () => { setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', minRating: '', sortBy: 'name', search: '' }); setIsFilterModalOpen(false); };

  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false;
    if (filters.minRating && product.rating < parseFloat(filters.minRating)) return false;
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !product.brand?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.category.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'priceLow') return a.price - b.price;
    if (filters.sortBy === 'priceHigh') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });

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
          <button onClick={openFilterModal} className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg font-medium transition-colors border border-blue-200 whitespace-nowrap">
            <Filter className="w-4 h-4" /> <span>Filter</span>
          </button>
          <div className="w-px h-8 bg-gray-200 mx-1"></div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full pb-1" style={{ scrollbarWidth: 'none' }}>
             <button onClick={() => {
               setFilters({...filters, category: ''});
               if (user) {
                 trackSearchHistory('All Products', '');
               }
             }} className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200">
                All Products
              </button>
            {categoriesList.map((cat) => (
              <button key={cat} onClick={() => handleCategoryClick(cat)} className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-white text-gray-700 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 hover:text-blue-600">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white relative">
        <div className="container mx-auto px-4 text-center pt-20 pb-48"> 
          <h1 className="text-5xl font-bold mb-6 drop-shadow-md">Welcome to Our Buy Zone</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">Discover amazing products at unbeatable prices.</p>
        </div>
      </section>

      {/* QUAD CARDS */}
      <div className="container mx-auto px-4 -mt-32 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard title="Electronics & Gadgets" products={displayElectronics} categorySlug="electronics" type="grid" navigate={navigate} handleProductClick={handleProductClick}/>
          <CategoryCard title="Home Appliances" products={displayHome} categorySlug="home" type="single" navigate={navigate} handleProductClick={handleProductClick}/>
          <CategoryCard title="Fashion Trends" products={displayFashion} categorySlug="clothing" type="single" navigate={navigate} handleProductClick={handleProductClick}/>
          
          {/* SPONSORSHIP */}
          <div className="bg-white flex flex-col justify-between h-full shadow-lg rounded-xl border border-blue-100 overflow-hidden relative">
            

            <div className="p-4 bg-white border-b border-gray-100 z-20">
                <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-1">
                    {user ? `Welcome back, ${user.firstName}` : 'Sign in for best experience'}
                </h2>
                <button 
                    onClick={() => user ? navigate('/profile') : navigate('/login')}
                    className={`w-full text-sm font-semibold py-2.5 rounded-lg shadow-sm transition-colors ${
                        user 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    {user ? 'My Account' : 'Sign in securely'}
                </button>
            </div>


            <div className="flex-1 p-4 relative flex flex-col justify-center">
                {freshSaleData.isActive ? (
                    <div className="cursor-pointer group h-full flex flex-col" onClick={() => navigate(`/product/${freshProduct?._id}`)}>
                         <div className="flex justify-between items-center mb-2">
                             <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded border border-red-100 flex items-center gap-1 animate-pulse">
                                 <Zap className="w-3 h-3 fill-current" /> FRESH DEAL
                             </span>
                             <div className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {freshSaleData.timeString}
                             </div>
                         </div>
    
                        <div className="relative flex-1 bg-gray-50 rounded-lg p-2 mb-2 flex items-center justify-center overflow-hidden">
                            <img src={freshProduct?.images?.[0]} alt="Deal" className="max-w-full h-24 object-contain group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                                -{freshSaleData.discount}%
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-800 line-clamp-1 mb-1">{freshProduct?.name}</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 line-through">Was ${freshProduct?.price}</span>
                                    <span className="text-lg font-bold text-red-600 leading-none">
                                        ${(freshProduct?.price * (1 - freshSaleData.discount / 100)).toFixed(0)}
                                    </span>
                                </div>
                                <button className="bg-red-100 text-red-600 p-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                                    <ShoppingCart className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-dashed border-gray-300 p-4">
                        <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                            <Megaphone className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="font-bold text-gray-700 mb-1">Advertise Here</h3>
                        <p className="text-xs text-gray-500 mb-4 px-2">
                            Reach thousands of customers daily. Boost your brand visibility now.
                        </p>
                        <button className="text-xs font-bold text-blue-600 border border-blue-200 bg-white px-3 py-1.5 rounded-full hover:bg-blue-50 flex items-center gap-1 transition-colors">
                            <Mail className="w-3 h-3" /> Contact Sales
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <section id="featured-products" className="py-8 container mx-auto px-4 relative group">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
           <div className="flex items-center gap-4">
             <button onClick={() => navigate('/featured')} className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 hover:underline">
               See All Products <ChevronRight className="w-4 h-4" />
             </button>
           </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" /><p>Loading...</p></div>
        ) : (
          <div className="relative">
             <button onClick={() => scrollFeatured('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 border border-gray-200 p-2 rounded-full shadow-lg text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white -ml-4"><ChevronLeft className="w-6 h-6" /></button>
             <button onClick={() => scrollFeatured('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 border border-gray-200 p-2 rounded-full shadow-lg text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white -mr-4"><ChevronRight className="w-6 h-6" /></button>

             <div ref={featuredScrollRef} className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
               {filteredProducts.map((product) => {
                 const isFresh = freshSaleData.isActive && freshSaleData.productId === product._id;
                 const finalPrice = isFresh 
                    ? (product.price * (1 - freshSaleData.discount / 100)).toFixed(2)
                    : product.price;

                 return (
                 <div key={product._id} className={`min-w-[280px] w-[280px] group/card bg-white border rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 ${isFresh ? 'border-red-200 ring-1 ring-red-100' : 'border-blue-100'}`}>
                   <div className="relative bg-gray-50 w-full h-60 rounded-lg mb-4 overflow-hidden cursor-pointer flex items-center justify-center" onClick={() => handleProductClick(product)}>
                     {isFresh && (
                        <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" /> {freshSaleData.timeString}
                        </div>
                     )}
                     <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-contain p-4 group-hover/card:scale-105 transition-transform duration-300" />
                   </div>

                   <div className="text-left">
                     <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">{product.category}</p>
                     <h3 className="font-bold text-gray-900 truncate mb-1 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate(`/product/${product._id}`)}>{product.name}</h3>
                     
                     <div className="flex items-center justify-between mt-2">
                       <div className="flex flex-col">
                           {isFresh && <span className="text-xs text-gray-400 line-through">${product.price}</span>}
                           <span className={`text-xl font-bold ${isFresh ? 'text-red-600' : 'text-gray-900'}`}>${finalPrice}</span>
                       </div>
                       <button 
                         disabled={product.stock === 0}
                         onClick={() => handleAddToCart(product._id)}
                         className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${product.stock === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'}`}
                       >
                         {product.stock === 0 ? 'Out' : 'Add'}
                       </button>
                     </div>
                   </div>
                 </div>
               )})}
             </div>
          </div>
        )}
      </section>

      {/* CAROUSELS */}
      <div className="container mx-auto pb-10 mt-8">
        <ProductCarousel title="Recommended For You" products={filteredProducts.slice().reverse()} navigate={navigate} handleAddToCart={handleAddToCart} freshSaleData={freshSaleData} handleProductClick={handleProductClick} />
      </div>
      
      {/* FILTER MODAL */}
      {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <button onClick={() => setIsFilterModalOpen(false)}><X className="text-gray-500 hover:text-red-500"/></button>
                </div>

                <div className="space-y-4">
                    <button onClick={clearFilters} className="w-full border py-2 rounded">Clear Filters</button>
                    <button onClick={applyFilters} className="w-full bg-blue-600 text-white py-2 rounded">Apply Filters</button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default Homepage;