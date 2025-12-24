import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

const calculateTotal = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    let price = 0;
    if (typeof item.productId === 'object' && item.productId?.price) {
      price = item.productId.price;
    }
    const quantity = item.quantity || 0;
    return sum + (price * quantity);
  }, 0);
};

const getItemsFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload?.items) return payload.items;
  if (payload?.cart?.items) return payload.cart.items;
  return [];
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/cart/getCart');
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/cart/addCart', { productId, quantity });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add to cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/cart/removeCart', { productId });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove from cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put('/cart/updateCartItem', { productId, quantity });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update cart item');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.total = calculateTotal(state.items);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.total = calculateTotal(state.items);
      })

      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.total = calculateTotal(state.items);
      })

      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.total = calculateTotal(state.items);
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;