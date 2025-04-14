import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import '../styles/product.css';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      itemSelected: null,
      showEditForm: false,
      editProduct: {
        _id: '',
        name: '',
        price: 0,
        category: '',
        image: '',
      },
      successMessage: '',
      confirmDeleteId: null,
      showConfirmDeleteModal: false,
      noPages: 0,
      curPage: 1,
      categoriesLoaded: false,
      categoriesError: '',
    };
  }

  render() {
    const prods = this.state.products.map((item) => (
      <tr
        key={item._id}
        className={`datatable-row ${this.state.itemSelected?._id === item._id ? 'selected' : ''}`}
        onClick={() => this.trItemClick(item)}
      >
        <td>{item._id}</td>
        <td>{item.name}</td>
        <td>{item.price.toLocaleString()}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.category.name}</td>
        <td>
          <img
            src={"data:image/jpg;base64," + item.image}
            width="100px"
            height="100px"
            alt={item.name}
            className="product-image"
          />
        </td>
        <td>
          <button
            className="btn-edit"
            onClick={(e) => {
              e.stopPropagation();
              this.trItemClick(item);
            }}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn-delete"
            onClick={(e) => {
              e.stopPropagation();
              this.btnDeleteClick(item._id);
            }}
          >
            <i className="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    ));

    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      const page = index + 1;
      return (
        <span
          key={index}
          className={`pagination-item ${page === this.state.curPage ? 'active' : 'link'}`}
          onClick={() => page !== this.state.curPage && this.lnkPageClick(page)}
        >
          {page}
        </span>
      );
    });

    return (
      <div className="product-container">
        <div className="product-header">
          {this.state.successMessage && (
            <div className="alert-success global-msg">
              {this.state.successMessage}
            </div>
          )}
          <div className="breadcrumb">
            <Link to="/admin/home"><span>Trang chủ</span></Link> /{' '}
            <Link to="/admin/product"><span>Sản phẩm</span></Link>
          </div>
          <Link to="/admin/product/add" className="btn-link-wrapper">
            <button className="btn-add-product">Thêm sản phẩm</button>
          </Link>
        </div>

        <div className="product-list float-left">
          <h2 className="product-title">Danh sách sản phẩm</h2>
          {this.state.products.length === 0 ? (
            <div className="loading">Loading products...</div>
          ) : (
            <table className="product-table">
              <thead>
                <tr className="datatable-header">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Creation Date</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{prods}</tbody>
            </table>
          )}
        </div>

        {this.state.showEditForm && (
          <div className="product-edit-modal">
            <div className="product-edit-form">
              <h2 className="product-edit-title">Edit Product</h2>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={this.state.editProduct.name}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={this.state.editProduct.price}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  {this.state.categoriesLoaded ? (
                    this.state.categoriesError ? (
                      <div className="error-message">{this.state.categoriesError}</div>
                    ) : (
                      <select
                        name="category"
                        value={this.state.editProduct.category}
                        onChange={this.handleInputChange}
                        required
                      >
                        <option value="">-- Select Category --</option>
                        {Array.isArray(this.context.categories) &&
                          this.context.categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    )
                  ) : (
                    <div className="loading">Loading categories...</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={this.handleImageChange}
                  />
                  {this.state.editProduct.image && (
                    <div className="image-preview">
                      <img
                        src={"data:image/jpg;base64," + this.state.editProduct.image}
                        alt="Preview"
                        className="product-image-preview"
                      />
                    </div>
                  )}
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-publish">
                    <i className="fas fa-save"></i> Update Product
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={this.closeEditForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {this.state.showConfirmDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this product?</p>
              <div className="modal-actions">
                <button className="btn-confirm" onClick={this.confirmDelete}>
                  Yes
                </button>
                <button className="btn-cancel" onClick={this.cancelDelete}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="pagination">{pagination}</div>
        <div className="float-clear" />
      </div>
    );
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
    // Kiểm tra xem categories đã được tải chưa
    if (Array.isArray(this.context.categories) && this.context.categories.length > 0) {
      this.setState({ categoriesLoaded: true });
    } else {
      this.apiGetCategories();
    }
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.context.setCategories(res.data);
          this.setState({ categoriesLoaded: true, categoriesError: '' });
        } else {
          this.setState({
            categoriesLoaded: true,
            categoriesError: 'No categories found.',
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        this.setState({
          categoriesLoaded: true,
          categoriesError: 'Failed to load categories. Please try again later.',
        });
      });
  }

  trItemClick(item) {
    this.setState({
      itemSelected: item,
      showEditForm: true,
      editProduct: {
        _id: item._id,
        name: item.name,
        price: item.price,
        category: item.category._id,
        image: item.image,
      },
    });
  }

  closeEditForm = () => {
    this.setState({
      showEditForm: false,
      editProduct: { _id: '', name: '', price: 0, category: '', image: '' },
    });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      editProduct: {
        ...prevState.editProduct,
        [name]: value,
      },
    }));
  };

  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        this.setState((prevState) => ({
          editProduct: {
            ...prevState.editProduct,
            image: base64String,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { editProduct } = this.state;
    const config = { headers: { 'x-access-token': this.context.token } };
    this.closeEditForm();
    axios
      .put(`/api/admin/products/${editProduct._id}`, { ...editProduct }, config)
      .then((res) => {
        if (res.data) {
          this.apiGetProducts(this.state.curPage);
          this.setState({
            successMessage: 'Product updated successfully!',
          });
          setTimeout(() => {
            this.setState({ successMessage: '' });
          }, 2000);
        }
      })
      .catch((error) => {
        console.error('Error updating product:', error);
      });
  };

  btnDeleteClick(id) {
    this.setState({
      confirmDeleteId: id,
      showConfirmDeleteModal: true,
    });
  }

  confirmDelete = () => {
    const { confirmDeleteId } = this.state;
    const config = { headers: { 'x-access-token': this.context.token } };

    axios
      .delete(`/api/admin/products/${confirmDeleteId}`, config)
      .then((res) => {
        if (res.data) {
          this.apiGetProducts(this.state.curPage);
          this.setState({
            successMessage: 'Product deleted successfully!',
            showConfirmDeleteModal: false,
            confirmDeleteId: null,
          });
          setTimeout(() => {
            this.setState({ successMessage: '' });
          }, 2000);
        }
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  cancelDelete = () => {
    this.setState({
      showConfirmDeleteModal: false,
      confirmDeleteId: null,
    });
  };

  lnkPageClick(page) {
    this.apiGetProducts(page);
  }

  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get(`/api/admin/products?page=${page}`, config)
      .then((res) => {
        const result = res.data;
        this.setState({
          products: result.products,
          noPages: result.noPages,
          curPage: result.curPage,
        });
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }
}

export default Product;