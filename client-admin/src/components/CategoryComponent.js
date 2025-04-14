import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import '../styles/category.css';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
      showEditForm: false,
      editCategory: {
        _id: '',
        name: '',
      },
      successMessage: '',
      confirmDeleteId: null,
      showConfirmDeleteModal: false,
    };
  }

  render() {
    const cates = this.state.categories.map((item) => (
      <tr
        key={item._id}
        className={`datatable-row ${this.state.itemSelected?._id === item._id ? 'selected' : ''}`}
        onClick={() => this.trItemClick(item)}
      >
        <td data-label="ID">{item._id}</td>
        <td data-label="Tên">{item.name}</td>
        <td data-label="Hành động">
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

    const { editCategory, showEditForm } = this.state;

    return (
      <div className="category-container">
        <div className="category-header">
          {this.state.successMessage && (
            <div className="alert-success global-msg">
              {this.state.successMessage}
            </div>
          )}
          <div className="breadcrumb">
            <Link to="/admin/home"><span>Trang chủ</span></Link> /{' '}
            <Link to="/admin/category"><span>Danh mục</span></Link>
          </div>
          <Link to="/admin/category/add" className="btn-link-wrapper">
            <button className="btn-add-category">Thêm danh mục</button>
          </Link>
        </div>

        <div className="category-list float-left">
          <h2 className="category-title">Danh sách danh mục</h2>
          {this.state.categories.length === 0 ? (
            <div className="loading">Đang tải danh mục...</div>
          ) : (
            <table className="category-table">
              <thead>
                <tr className="datatable-header">
                  <th>ID</th>
                  <th>TÊN</th>
                  <th>HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>{cates}</tbody>
            </table>
          )}
        </div>

        {showEditForm && (
          <div className="category-edit-modal">
            <div className="category-edit-form">
              <h2 className="category-edit-title">Chỉnh sửa danh mục</h2>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label>Tên danh mục</label>
                  <input
                    type="text"
                    name="name"
                    value={editCategory.name}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-publish">
                    <i className="fas fa-save"></i> Cập nhật
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={this.closeEditForm}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {this.state.showConfirmDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Xác nhận xóa</h3>
              <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
              <div className="modal-actions">
                <button className="btn-confirm" onClick={this.confirmDelete}>
                  Có
                </button>
                <button className="btn-cancel" onClick={this.cancelDelete}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="float-clear" />
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  trItemClick(item) {
    this.setState({
      itemSelected: item,
      showEditForm: true,
      editCategory: {
        _id: item._id,
        name: item.name,
      },
    });
  }

  closeEditForm = () => {
    this.setState({
      showEditForm: false,
      editCategory: { _id: '', name: '' },
    });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      editCategory: {
        ...prevState.editCategory,
        [name]: value,
      },
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { editCategory } = this.state;
    const config = { headers: { 'x-access-token': this.context.token } };
    this.closeEditForm();
    axios
      .put(`/api/admin/categories/${editCategory._id}`, { name: editCategory.name }, config)
      .then((res) => {
        if (res.data) {
          this.apiGetCategories();
          this.setState({
            successMessage: 'Cập nhật danh mục thành công!',
          });
          setTimeout(() => {
            this.setState({ successMessage: '' });
          }, 2000);
        }
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật danh mục:', error);
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
      .delete(`/api/admin/categories/${confirmDeleteId}`, config)
      .then((res) => {
        if (res.data) {
          this.apiGetCategories();
          this.setState({
            successMessage: 'Xóa danh mục thành công!',
            showConfirmDeleteModal: false,
            confirmDeleteId: null,
          });
          setTimeout(() => {
            this.setState({ successMessage: '' });
          }, 2000);
        }
      })
      .catch((error) => {
        console.error('Lỗi khi xóa danh mục:', error);
      });
  };

  cancelDelete = () => {
    this.setState({
      showConfirmDeleteModal: false,
      confirmDeleteId: null,
    });
  };

  updateCategories = (categories) => {
    this.setState({ categories });
  };

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        this.setState({ categories: res.data });
      })
      .catch((error) => {
        console.error('Lỗi khi tải danh mục:', error);
      });
  }
}

export default Category;
