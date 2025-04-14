import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import '../App'; // Import CSS tùy chỉnh

import Menu from './MenuComponent';
import Inform from './InformComponent';
import Home from './HomeComponent';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import Signup from './SignupComponent';
import Login from './LoginComponent';
import Myprofile from './MyprofileComponent';
import Mycart from './MycartComponent';
import Myorders from './MyordersComponent';

class Main extends Component {
  render() {
    return (
      <div className="body-customer">
        {/* Header Section */}
        <header className="main-header">
          <Inform />
          <Menu />
        </header>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/product/category/:cid" element={<Product />} />
            <Route path="/product/search/:keyword" element={<Product />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/myprofile" element={<Myprofile />} />
            <Route path="/mycart" element={<Mycart />} />
            <Route path="/myorders" element={<Myorders />} />
          </Routes>
        </main>

        {/* Footer Section */}
        <footer className="main-footer">
          <div className="container text-center py-3">
            <p className="footer-text">
              © Bản quyền thuộc về Huy Hùng | Designed with <i className="fas fa-heart text-danger"></i>
            </p>
          </div>
        </footer>
      </div>
    );
  }
}

export default Main;