import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './Styles/global.scss';

import Header from './Components/Header';
import Footer from './Components/Footer';

import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import ProductPage from './Pages/Product';
import AddProduct from './Pages/CreateProduct';
import EditProduct from './Pages/EditProduct';
import Balance from './Pages/AddBalance';
import PrivateRouteWithLoginModal from './Components/PrivateRouterWithLoginModal'; 
import Purchase from './Pages/Purchase';
import ForeignProfilePage from './Pages/ForeignProfilePage';
import ChatPage from './Pages/ChatPage';
import OrdersPage from './Pages/OrderPage';
import ContactPage from './Pages/Contacts'; 
import PrivacyPolicy from './Pages/Privacy';
import ForumPage from './Pages/ForumPage';
import ForumCategoryCreate from './Pages/ForumCategoryCreate';
import CreateTopic from './Pages/CreateTopic';
import TopicPage from './Pages/TopicPage';
import Dashboard from './Pages/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [balanceUpdateTrigger, setBalanceUpdateTrigger] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ accessToken: token });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload(); 
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />

        <div className="main-container" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacts" element={<ContactPage />} />
            <Route path="/product/:id" element={<ProductPage />} />  
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/profile/:id" element={<ForeignProfilePage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/topic/:id" element={<TopicPage />} /> 

            <Route
              element={
                <PrivateRouteWithLoginModal
                  requiredRoles={["user", "admin"]} 
                  onLogin={handleLogin}
                />
              }
            >
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path="/create-topic" element={<CreateTopic />} />
              <Route path="/category/create" element={<ForumCategoryCreate />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
              <Route path="/messages" element={<ChatPage />} />
              <Route path="/balance" element={<Balance />} />
              <Route path="/purchase/:id" element={<Purchase />} />
            </Route>
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}
