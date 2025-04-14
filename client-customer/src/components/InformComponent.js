import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import '../App'; // Import CSS tùy chỉnh

class Inform extends Component {
  static contextType = MyContext;

  render() {
    const { token, customer, mycart } = this.context;
    return (
      <div className="inform-container border-bottom">
        <div className="container d-flex justify-content-between align-items-center py-2">
          {/* Left Section: Login/Logout Info */}
          <div className="inform-left">
            {token === '' ? (
              <ul className="nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt mr-1"></i> Đăng nhập
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    <i className="fas fa-user-plus mr-1"></i> Đăng kí
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="nav">
                <li className="nav-item">
                  <span className="nav-link text-dark">
                    Xin chào <b>{customer?.name || 'người dùng'}</b>
                  </span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/home" onClick={() => this.lnkLogoutClick()}>
                    <i className="fas fa-sign-out-alt mr-1"></i> Đăng xuất
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/myprofile">
                    <i className="fas fa-user mr-1"></i> Hồ sơ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/myorders">
                    <i className="fas fa-shopping-bag mr-1"></i> Đơn hàng
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Right Section: My Cart */}
          <div className="inform-right">
            <Link to="/mycart" className="cart-link">
              <i className="fas fa-shopping-cart mr-1"></i> Giỏ hàng (<b>{mycart?.length || 0}</b>)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // event-handlers
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }
}

export default Inform;
