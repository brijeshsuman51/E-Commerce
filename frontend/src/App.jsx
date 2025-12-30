import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from './authSlice';
import NavBar from './components/NavBar';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import Order from './pages/Order';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import CreateProduct from './product/CreateProduct';
import UpdateProduct from './product/UpdateProduct';
import DeleteProduct from './product/DeleteProduct';
import AdminProducts from './pages/AdminProducts';
import Category from './pages/CategoryPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  return (
    
      <Router>
          <NavBar />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/create" element={<CreateProduct />} />
              <Route path="/admin/products/update/:id" element={<UpdateProduct />} />
              <Route path="/admin/products/delete/:id" element={<DeleteProduct />} />
              <Route path="/category/:categoryName" element={<Category />} />   
            </Routes>
      </Router>
  );
}

export default App;