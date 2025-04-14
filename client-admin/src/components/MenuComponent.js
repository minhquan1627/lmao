import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import '../styles/menu.css';

class Menu extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      showCategorySubmenu: false,
      showProductSubmenu: false,

    };
  }

  toggleCategorySubmenu = () => {
    this.setState(prevState => ({
      showCategorySubmenu: !prevState.showCategorySubmenu,
    }));
  };
  toggleProductSubmenu = () => {
    this.setState(prevState => ({
      showProductSubmenu: !prevState.showProductSubmenu,
    }));
  };

  handleLogout = () => {
    this.context.setToken('');
    this.context.setUsername('');
  };

  render() {
    const { showCategorySubmenu } = this.state;
    const { showProductSubmenu } = this.state;
    const { username } = this.context;

    return (
      <div className="menu-container">
        <aside className="sidebar">
          <div className="user-info">
            <div className="avatar">{username.charAt(0)}</div>
            <div className="user-details">
              <span className="username">{username}</span>
            </div>
          </div>

          <ul className="menu-list">
            <li className="menu-item">
              <NavLink to="/admin/home" activeClassName="active">
                <i className="fas fa-home mr-2"></i> <span>Trang chủ</span>
              </NavLink>
            </li>

            {/* Menu Danh mục */}
            <li
              className={`menu-item category-toggle ${showCategorySubmenu ? 'open' : ''}`}
              onClick={this.toggleCategorySubmenu}
            >
              <span>
                <i className="fas fa-list-ul"></i> {/* icon Danh mục */}
                Danh mục <span className="arrow">{showCategorySubmenu ? '▲' : '▼'}</span>
              </span>
            </li>

            {showCategorySubmenu && (
              <ul className="submenu">
                <li className="submenu-item">
                  <Link to="/admin/category">
                    <i className="fas fa-table-list"></i> Danh sách danh mục
                  </Link>
                </li>
                <li className="submenu-item">
                  <Link to="/admin/category/add">
                    <i className="fas fa-plus-circle"></i> Thêm danh mục
                  </Link>
                </li>
              </ul>
            )}

            {/* Menu Sản phẩm */}
            <li
              className={`menu-item product-toggle ${showProductSubmenu ? 'open' : ''}`}
              onClick={this.toggleProductSubmenu}
            >
              <span>
                <i className="fas fa-boxes-stacked"></i> {/* icon Sản phẩm */}
                Sản phẩm <span className="arrow">{showProductSubmenu ? '▲' : '▼'}</span>
              </span>
            </li>

            {showProductSubmenu && (
              <ul className="submenu">
                <li className="submenu-item">
                  <Link to="/admin/product">
                    <i className="fas fa-box"></i> Danh sách sản phẩm
                  </Link>
                </li>
                <li className="submenu-item">
                  <Link to="/admin/product/add">
                    <i className="fas fa-plus"></i> Thêm sản phẩm
                  </Link>
                </li>
              </ul>
            )}
            <li className="menu-item">
              <NavLink to="/admin/order" activeClassName="active">
                <i className="fas fa-shopping-cart mr-2"></i> <span>Đơn hàng</span>
              </NavLink>
            </li>

            <li className="menu-item">
              <NavLink to="/admin/customer" activeClassName="active">
                <i className="fas fa-users mr-2"></i> <span>Khách hàng</span>
              </NavLink>
            </li>
          </ul>

          <div className="logout-container">
            <Link to="/admin/home" onClick={this.handleLogout} className="logout-link">
              <i className="fas fa-sign-out-alt mr-1"></i> <span>Đăng xuất</span>
            </Link>
          </div>
        </aside>
      </div>
    );
  }
}

export default Menu;