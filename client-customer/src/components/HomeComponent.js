import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App'; // Import CSS tùy chỉnh

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
    };
  }

  render() {
    const newprods = this.state.newprods
  .filter(item => item && item._id)
  .map((item) => (
    <div key={item._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="product-card">
        <Link to={`/product/${item._id}`}>
          <img
            src={`data:image/jpg;base64,${item.image}`}
            alt={item.name}
            className="product-image"
          />
        </Link>
        <div className="product-info">
          <h5 className="product-name">{item.name}</h5>
          <p className="product-price">Price: ${item.price}</p>
        </div>
      </div>
    </div>
  ));

const hotprods = this.state.hotprods
  .filter(item => item && item._id)
  .map((item) => (
    <div key={item._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="product-card">
        <Link to={`/product/${item._id}`}>
          <img
            src={`data:image/jpg;base64,${item.image}`}
            alt={item.name}
            className="product-image"
          />
        </Link>
        <div className="product-info">
          <h5 className="product-name">{item.name}</h5>
          <p className="product-price">Price: ${item.price}</p>
        </div>
      </div>
    </div>
  ));


    return (
      <div className="home-container">
        <div className="container">
          <div className="section">
            <h2 className="section-title text-center">NEW PRODUCTS</h2>
            <div className="row">{newprods}</div>
          </div>

          {this.state.hotprods.length > 0 && (
            <div className="section">
              <h2 className="section-title text-center">HOT PRODUCTS</h2>
              <div className="row">{hotprods}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  // apis
  apiGetNewProducts() {
    axios.get('/api/customer/products/new').then((res) => {
      const result = res.data;
      this.setState({ newprods: result });
    });
  }

  apiGetHotProducts() {
    axios.get('/api/customer/products/hot').then((res) => {
      const result = res.data;
      this.setState({ hotprods: result });
    });
  }
}

export default Home;