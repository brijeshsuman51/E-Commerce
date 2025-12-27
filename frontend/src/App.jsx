import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  return (
    
      <Router>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
}

export default App;