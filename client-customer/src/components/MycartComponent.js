import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';
import '../App'; // Import CSS tùy chỉnh

class Mycart extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    const mycart = this.context.mycart.map((item, index) => (
      <tr key={item.product._id} className="cart-item">
        <td>{index + 1}</td>
        <td>{item.product._id}</td>
        <td>{item.product.name}</td>
        <td>{item.product.category.name}</td>
        <td>
          <img
            src={'data:image/jpg;base64,' + item.product.image}
            width="70px"
            height="70px"
            alt={item.product.name}
            className="cart-image"
          />
        </td>
        <td>${item.product.price.toLocaleString()}</td>
        <td>{item.quantity}</td>
        <td>${(item.product.price * item.quantity).toLocaleString()}</td>
        <td>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => this.lnkRemoveClick(item.product._id)}
          >
            <i className="fas fa-trash-alt"></i> Xóa
          </button>
        </td>
      </tr>
    ));

    return (
      <div className="mycart-container">
        <div className="container">
          <h2 className="text-center my-4">GIỎ HÀNG</h2>
          {this.context.mycart.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Mã SP</th>
                    <th scope="col">Tên sản phẩm</th>
                    <th scope="col">Danh mục</th>
                    <th scope="col">Hình ảnh</th>
                    <th scope="col">Giá</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Thành tiền</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>{mycart}</tbody>
                <tfoot>
                  <tr>
                    <td colSpan="7" className="text-right font-weight-bold">
                      Tổng cộng
                    </td>
                    <td className="font-weight-bold">
                      ${CartUtil.getTotal(this.context.mycart).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-block"
                        onClick={() => this.lnkCheckoutClick()}
                      >
                        <i className="fas fa-check-circle"></i> Thanh toán
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center my-5">
              <h4>Giỏ hàng của bạn đang trống!</h4>
              <a href="/home" className="btn btn-primary mt-3">
                Tiếp tục mua sắm
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // event-handlers
  lnkRemoveClick(id) {
    const mycart = this.context.mycart;
    const index = mycart.findIndex((x) => x.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  lnkCheckoutClick() {
    if (window.confirm('Bạn có chắc chắn muốn thanh toán?')) {
      if (this.context.mycart.length > 0) {
        const total = CartUtil.getTotal(this.context.mycart);
        const items = this.context.mycart;
        const customer = this.context.customer;
        if (customer) {
          this.apiCheckout(total, items, customer);
        } else {
          this.props.navigate('/login');
        }
      } else {
        alert('Giỏ hàng của bạn đang trống');
      }
    }
  }

  // apis
  apiCheckout(total, items, customer) {
    const body = { total: total, items: items, customer: customer };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/customer/checkout', body, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Thanh toán thành công!');
        this.context.setMycart([]);
        this.props.navigate('/home');
      } else {
        alert('Lỗi! Đã xảy ra sự cố. Vui lòng thử lại sau.');
      }
    });
  }
}

export default withRouter(Mycart);