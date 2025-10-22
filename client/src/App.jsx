import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Toaster } from "react-hot-toast";
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import Allproducts from './pages/Allproducts';
import Productcategoru from './pages/Productcategoru';
import ProductDetails from './pages/Productdetails';
import Cart from './pages/Cart';
import Addaddress from './pages/Addaddress';
import Myorders from './pages/Myorders';
import Sellerlogin from './components/seller/Sellerlogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import Profile from './pages/Profile';

const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller")
  const { showUserLogin, isSeller } = useAppContext();
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      { }
      <Toaster />
      <div className={` ${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Allproducts />} />
          <Route path="/products/:category" element={<Productcategoru />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<Addaddress />} />
          <Route path="/my-orders" element={<Myorders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/seller" element={isSeller ? <SellerLayout /> : <Sellerlogin />}>
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>

        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;