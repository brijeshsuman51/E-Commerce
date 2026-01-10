import React from 'react';
import { X, Check, Star } from 'lucide-react';

const FilterModal = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  tempFilters,
  setTempFilters,
  uniqueCategories,
  uniqueBrands,
  applyFilters,
  clearFilters,
  showCategoryTab = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Filter Products</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            {showCategoryTab && (
              <button 
                onClick={() => setActiveTab('category')}
                className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors ${activeTab === 'category' ? 'bg-white border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:bg-gray-100'}`}
              >
                Category
              </button>
            )}
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

            {showCategoryTab && activeTab === 'category' && (
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 mb-2">Select Category</h4>
                {uniqueCategories.map(cat => (
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
  );
};

export default FilterModal;