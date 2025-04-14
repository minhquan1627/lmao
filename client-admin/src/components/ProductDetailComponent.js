import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import '../styles/product-detail.css';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '',
      successMessage: '',
      errorMessage: '',
    };
  }

  render() {
    const cates = this.state.categories.map((cate) => (
      <option key={cate._id} value={cate._id} selected={this.props.item?.category?._id === cate._id}>
        {cate.name}
      </option>
    ));

    const { mode } = this.props; // Get mode prop (add or edit)
    const isAddMode = mode === 'add'; // Check if it is "Add" mode

    return (
      <div className="product-container">
        <div className="product-header">
          <div className="breadcrumb-container">
            <div className="breadcrumb">
              <Link to="/admin/home">
                <span>Trang chủ</span>
              </Link>{' '}
              /{' '}
              <Link to="/admin/product/add">
                <span>Thêm sản phẩm</span>
              </Link>
            </div>
            {/* Display success or error message in breadcrumb */}
            {this.state.successMessage && (
              <div className="alert-success global-msg">{this.state.successMessage}</div>
            )}
          </div>
        </div>

        <div className="product-detail">
          <h2 className="product-detail-title">
            {isAddMode ? 'Thêm sản phẩm' : 'PRODUCT DETAIL'}
          </h2>

          {/* Display error message */}
          {this.state.errorMessage && (
            <div className="alert-error global-msg">{this.state.errorMessage}</div>
          )}

          <form className="product-detail-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>ID</label>
              <input
                type="text"
                value={this.state.txtID}
                onChange={(e) => this.setState({ txtID: e.target.value })}
                readOnly={true}
                className="form-input readonly"
                placeholder="ID"
              />
            </div>
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                value={this.state.txtName}
                onChange={(e) => this.setState({ txtName: e.target.value })}
                className="form-input"
                placeholder="NAME"
              />
            </div>
            <div className="form-group">
              <label>Giá</label>
              <input
                type="number"
                value={this.state.txtPrice}
                onChange={(e) => this.setState({ txtPrice: e.target.value })}
                className="form-input"
                placeholder="PRICE"
              />
            </div>
            <div className="form-group">
              <label>Danh mục</label>
              <select
                value={this.state.cmbCategory}
                onChange={(e) => this.setState({ cmbCategory: e.target.value })}
                className="form-input"
              >
                <option value="">Chọn Danh mục</option>
                {cates}
              </select>
            </div>
            <div className="form-group">
              <label>Ảnh</label>
              <input
                type="file"
                name="fileImage"
                accept="image/jpeg, image/png, image/gif"
                onChange={(e) => this.previewImage(e)}
                className="form-input"
              />
            </div>
            {this.state.imgProduct && (
              <div className="image-preview">
                <img
                  src={this.state.imgProduct}
                  width="300px"
                  height="300px"
                  alt="Preview"
                  className="preview-image"
                />
              </div>
            )}
            <div className="form-actions">
              {isAddMode ? (
                <button
                  type="submit"
                  className="btn btn-add"
                  onClick={(e) => this.btnAddClick(e)}
                >
                  Lưu
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-update"
                  onClick={(e) => this.btnUpdateClick(e)}
                >
                  UPDATE
                </button>
              )}
              {isAddMode ? null : (
                <button
                  type="submit"
                  className="btn btn-delete"
                  onClick={(e) => this.btnDeleteClick(e)}
                >
                  DELETE
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      this.setState({
        txtID: this.props.item._id || '',
        txtName: this.props.item.name || '',
        txtPrice: this.props.item.price || 0,
        cmbCategory: this.props.item.category?._id || '',
        imgProduct: this.props.item.image ? 'data:image/jpg;base64,' + this.props.item.image : '',
      });
    }

    // Reset name for 'add' mode when mode changes
    if (this.props.mode === 'add' && prevProps.mode !== 'add') {
      this.setState({
        txtName: '',
        successMessage: '',
        errorMessage: '',
      });
    }
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const { txtName, txtPrice, cmbCategory, imgProduct } = this.state;
    const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

    if (txtName && txtPrice && cmbCategory && image) {
      const prod = { name: txtName, price: parseInt(txtPrice), category: cmbCategory, image };
      this.apiPostProduct(prod);
    } else {
      this.setState({ errorMessage: 'Please input name, price, category, and image', successMessage: '' });
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID, txtName, txtPrice, cmbCategory, imgProduct } = this.state;
    const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

    if (txtID && txtName && txtPrice && cmbCategory && image) {
      const prod = { name: txtName, price: parseInt(txtPrice), category: cmbCategory, image };
      this.apiPutProduct(txtID, prod);
    } else {
      this.setState({ errorMessage: 'Please input id, name, price, category, and image', successMessage: '' });
    }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteProduct(id);
      } else {
        this.setState({ errorMessage: 'Please input id', successMessage: '' });
      }
    }
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        this.setState({ categories: res.data });
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }

  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .post('/api/admin/products', prod, config)
      .then((res) => {
        const result = res.data;
        if (result) {
          this.setState({ successMessage: 'Product added successfully!', errorMessage: '' });
          this.setState({ txtID: '', txtName: '', txtPrice: 0, cmbCategory: '', imgProduct: '' });
          setTimeout(() => this.setState({ successMessage: '' }), 2000);
        } else {
          this.setState({ errorMessage: 'Error! An error occurred. Please try again later.', successMessage: '' });
        }
      })
      .catch((error) => {
        console.error('Error adding product:', error);
        this.setState({ errorMessage: 'Error occurred while adding product', successMessage: '' });
      });
  }

  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .put('/api/admin/products/' + id, prod, config)
      .then((res) => {
        const result = res.data;
        if (result) {
          this.setState({ successMessage: 'Product updated successfully!', errorMessage: '' });
          setTimeout(() => this.setState({ successMessage: '' }), 2000);
        } else {
          this.setState({ errorMessage: 'Error! An error occurred. Please try again later.', successMessage: '' });
        }
      })
      .catch((error) => {
        console.error('Error updating product:', error);
        this.setState({ errorMessage: 'Error occurred while updating product', successMessage: '' });
      });
  }

  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .delete('/api/admin/products/' + id, config)
      .then((res) => {
        const result = res.data;
        if (result) {
          this.setState({ successMessage: 'Product deleted successfully!', errorMessage: '' });
          setTimeout(() => this.setState({ successMessage: '' }), 2000);
        } else {
          this.setState({ errorMessage: 'Error! An error occurred. Please try again later.', successMessage: '' });
        }
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        this.setState({ errorMessage: 'Error occurred while deleting product', successMessage: '' });
      });
  }
}

export default ProductDetail;
