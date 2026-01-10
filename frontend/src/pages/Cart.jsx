import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, removeFromCart, updateCartItem } from '../cartSlice';
import { ShoppingBag, Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { getPriceForCountry, getCurrencyForCountry, formatConvertedPrice } from '../utils/pricing';
import { ProductCardShimmer } from '../components/Shimmer';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], loading, error, total = 0 } = useSelector((state) => state.cart);
  const { user, selectedCountry } = useSelector((state) => state.auth);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [currentFreshSale, setCurrentFreshSale] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
      fetchCurrentFreshSale();
    }
    
    if (loading) {
      setShowContent(false);
      const timer = setTimeout(() => setShowContent(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowContent(true);
    }
  }, [dispatch, user, loading]);

  const fetchCurrentFreshSale = async () => {
    try {
      const response = await axiosClient.get('/freshsale/current');
      const data = response.data.freshSale;
      setCurrentFreshSale(data);
    } catch (error) {
      console.error('Failed to fetch current fresh sale:', error);
      setCurrentFreshSale(null);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
  if (newQuantity <= 0) {
    handleRemoveItem(productId);
  } else {
    dispatch(updateCartItem({ productId, quantity: newQuantity }));
  }
};

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    if (!user.phone || !user.phone.trim()) {
      alert('Please update your profile with a phone number before placing an order.');
      navigate('/profile');
      return;
    }

    if (!user.address || !user.address.street || !user.address.city || !user.address.state || !user.address.zipCode) {
      alert('Please update your profile with complete address information before placing an order.');
      navigate('/profile');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderData = {
        products: items.map(item => ({
          productId: item.productId?._id || item.productId,
          quantity: item.quantity
        })),
        shippingAddress: user.address,
        paymentMethod: "credit_card"
      };

      await axiosClient.post('/order/createOrder', orderData);
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert('Failed to place order: ' + (error.response?.data || error.message));
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <ProductCardShimmer key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-3 rounded-lg">Continue Shopping</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                {items.map((item) => {
                  const product = item.productId || {};
                  const originalPrice = getPriceForCountry(product, selectedCountry).price || 0;
                  
                  const hasSale = currentFreshSale && currentFreshSale.productId === product._id;
                  const discountedPrice = hasSale ? originalPrice * (1 - currentFreshSale.discount / 100) : originalPrice;
                  const itemTotal = discountedPrice * item.quantity;
                  const savings = hasSale ? (originalPrice - discountedPrice) * item.quantity : 0;

                  return (
                    <div key={product._id || Math.random()} className="flex items-center p-6 border-b border-gray-100 last:border-b-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full"><ShoppingBag className="w-8 h-8 text-gray-300" /></div>
                        )}
                      </div>

                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name || 'Product'}</h3>
                        <div className="flex items-center gap-2">
                          {hasSale ? (
                            <>
                              <span className="text-gray-400 line-through">{getPriceForCountry(product, selectedCountry).symbol}{originalPrice.toFixed(2)}</span>
                              <span className="text-red-600 font-semibold">{formatConvertedPrice(discountedPrice, selectedCountry).symbol}{formatConvertedPrice(discountedPrice, selectedCountry).price}</span>
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                {currentFreshSale.discount}% OFF
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-600">{getPriceForCountry(product, selectedCountry).symbol}{originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        {hasSale && (
                          <p className="text-sm text-green-600 font-medium">
                            You save {formatConvertedPrice(savings, selectedCountry).symbol}{formatConvertedPrice(savings, selectedCountry).price} on this item
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(product._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="ml-6 text-right">
                        <p className="font-bold text-gray-900">
                          {formatConvertedPrice(itemTotal, selectedCountry).symbol}{formatConvertedPrice(itemTotal, selectedCountry).price}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  {(() => {
                    // Calculate totals with discounts
                    let subtotal = 0;
                    let totalSavings = 0;
                    
                    items.forEach((item) => {
                      const product = item.productId || {};
                      const originalPrice = getPriceForCountry(product, selectedCountry).price || 0;
                      const hasSale = currentFreshSale && currentFreshSale.productId === product._id;
                      const finalPrice = hasSale ? originalPrice * (1 - currentFreshSale.discount / 100) : originalPrice;
                      
                      subtotal += finalPrice * item.quantity;
                      if (hasSale) {
                        totalSavings += (originalPrice - finalPrice) * item.quantity;
                      }
                    });

                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">{formatConvertedPrice(subtotal + totalSavings, selectedCountry).symbol}{formatConvertedPrice(subtotal + totalSavings, selectedCountry).price}</span>
                        </div>
                        {totalSavings > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span className="font-medium">You save</span>
                            <span className="font-semibold">-{formatConvertedPrice(totalSavings, selectedCountry).symbol}{formatConvertedPrice(totalSavings, selectedCountry).price}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-semibold">Free</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-lg font-bold text-blue-600">{formatConvertedPrice(subtotal, selectedCountry).symbol}{formatConvertedPrice(subtotal, selectedCountry).price}</span>
                          </div>
                          {totalSavings > 0 && (
                            <div className="text-sm text-green-600 text-right mt-1">
                              Originally {formatConvertedPrice(subtotal + totalSavings, selectedCountry).symbol}{formatConvertedPrice(subtotal + totalSavings, selectedCountry).price}
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || items.length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {placingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;