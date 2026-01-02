import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ShoppingCart, ShoppingBag, Star } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../cartSlice';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/product/getAllProducts');
        setProducts(res.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data || err.message || 'Failed to load products');
        setLoading(false);
      }
    }
    fetch();
  }, [])

  const handleAddToCart = async (productId) => {
    if (!user) return navigate('/login');
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      alert('Added to cart!');
    } catch (err) {
      alert('Failed: ' + err);
    }
  }

  if (loading) return <div className="py-20 text-center">Loading...</div>
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p._id} className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
            <div className="w-full h-48 bg-gray-50 flex items-center justify-center mb-3 rounded-lg cursor-pointer" onClick={() => navigate(`/product/${p._id}`)}>
              {p.images && p.images.length ? (
                <img src={p.images[0]} alt={p.name} className="max-h-full max-w-full object-contain p-4" />
              ) : (
                <ShoppingBag className="w-12 h-12 text-gray-300" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{p.name}</p>
            <div className="flex items-center justify-between gap-2 mt-4">
            <p className="text-lg font-bold text-blue-700 mb-2">${p.price}</p>
              <button
                onClick={() => handleAddToCart(p._id)}
                disabled={p.stock === 0}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm ${p.stock === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedProducts;
