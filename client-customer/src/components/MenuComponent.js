import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import '../App'; // Import CSS tùy chỉnh

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: '',
    };
  }

  render() {
    const cates = this.state.categories.map((item) => (
      <li key={item._id} className="nav-item">
        <Link className="nav-link" to={'/product/category/' + item._id}>
          {item.name}
        </Link>
      </li>
    ));

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container">
          {/* Menu Toggle for Mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu Items */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Trang chủ
                </Link>
              </li>
              {cates}
            </ul>

            {/* Search Form */}
            <form className="form-inline my-2 my-lg-0" onSubmit={(e) => this.btnSearchClick(e)}>
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Tìm kiếm..."
                aria-label="Search"
                value={this.state.txtKeyword}
                onChange={(e) => this.setState({ txtKeyword: e.target.value })}
              />
              <button className="btn btn-search my-2 my-sm-0" type="submit">
                <i className="fas fa-search"></i> TÌM KIẾM
              </button>
            </form>
          </div>
        </div>
      </nav>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  // event-handlers
  btnSearchClick(e) {
    e.preventDefault();
    if (this.state.txtKeyword.trim()) {
      this.props.navigate('/product/search/' + this.state.txtKeyword);
    }
  }

  // apis
  apiGetCategories() {
    axios.get('/api/customer/categories').then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}

export default withRouter(Menu);