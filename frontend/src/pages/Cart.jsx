import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, removeFromCart, updateCartItem } from '../cartSlice';
import { ShoppingBag, Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], loading, error, total = 0 } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

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

    setPlacingOrder(true);
    try {
      const orderData = {
        products: items.map(item => ({
          productId: item.productId?._id || item.productId, 
          quantity: item.quantity
        })),
        shippingAddress: {
          street: "Default Street",
          city: "Default City",
          state: "Default State",
          zipCode: "12345",
          country: "Default Country"
        },
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
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
                  const price = product.price || 0;
                  const itemTotal = price * item.quantity;

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
                        <p className="text-gray-600">${price.toFixed(2)}</p>
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
                          ${itemTotal.toFixed(2)}
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${(Number(total) || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold text-blue-600">${(Number(total) || 0).toFixed(2)}</span>
                    </div>
                  </div>
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