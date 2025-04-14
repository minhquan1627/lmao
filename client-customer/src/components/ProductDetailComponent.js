import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
import '../App'; // Import CSS tùy chỉnh

class ProductDetail extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
    };
  }

  render() {
    const prod = this.state.product;
    if (prod != null) {
      return (
        <div className="product-detail-container">
          <div className="container">
            <h2 className="text-center my-4">CHI TIẾT SẢN PHẨM</h2>
            <div className="row align-items-center">
              {/* Product Image */}
              <div className="col-lg-6 col-md-12 mb-4">
                <img
                  src={'data:image/jpg;base64,' + prod.image}
                  alt={prod.name}
                  className="product-image img-fluid"
                />
              </div>

              {/* Product Info */}
              <div className="col-lg-6 col-md-12">
                <div className="product-info">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="text-right font-weight-bold">Mã SP:</td>
                        <td>{prod._id}</td>
                      </tr>
                      <tr>
                        <td className="text-right font-weight-bold">Tên:</td>
                        <td>{prod.name}</td>
                      </tr>
                      <tr>
                        <td className="text-right font-weight-bold">Giá:</td>
                        <td>${prod.price.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-right font-weight-bold">Danh mục:</td>
                        <td>{prod.category.name}</td>
                      </tr>
                      <tr>
                        <td className="text-right font-weight-bold">Số lượng:</td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={this.state.txtQuantity}
                            onChange={(e) => this.setState({ txtQuantity: e.target.value })}
                            className="form-control quantity-input"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          <button
                            className="btn btn-primary btn-block"
                            onClick={(e) => this.btnAdd2CartClick(e)}
                          >
                            <i className="fas fa-cart-plus mr-2"></i> Thêm vào giỏ hàng
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div className="text-center my-5">Đang tải...</div>;
  }

  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }

  // event-handlers
  btnAdd2CartClick(e) {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);
    if (quantity && quantity > 0) {
      const mycart = this.context.mycart;
      const index = mycart.findIndex((x) => x.product._id === product._id);
      if (index === -1) {
        const newItem = { product: product, quantity: quantity };
        mycart.push(newItem);
      } else {
        mycart[index].quantity += quantity;
      }
      this.context.setMycart(mycart);
      alert('Đã thêm vào giỏ hàng!');
    } else {
      alert('Vui lòng nhập số lượng hợp lệ');
    }
  }

  // apis
  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
    });
  }
}

export default withRouter(ProductDetail);