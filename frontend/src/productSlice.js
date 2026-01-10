import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/product/getAllProducts');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/product/getProductById/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch product');
    }
  }
);

const initialState = {
  allProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  lastFetchTime: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = action.payload || [];
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Single Product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
