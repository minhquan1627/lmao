import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../contexts/MyContext';
import '../styles/category-detail.css';

class CategoryDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtName: '',
      successMessage: '',
      errorMessage: '',
    };
  }

  render() {
    const { mode } = this.props;
    const isAddMode = mode === 'add';

    return (
      <div className="category-container">
        <div className="category-header">
          <div className="breadcrumb-container">
            <div className="breadcrumb">
              <Link to="/admin/home">
                <span>Trang chủ</span>
              </Link>{' '}
              /{' '}
              <Link to="/admin/category/add">
                <span>Thêm danh mục</span>
              </Link>
            </div>
            {this.state.successMessage && (
              <div className="alert-success global-msg">
                {this.state.successMessage}
              </div>
            )}
          </div>
        </div>

        <div className="category-detail">
          <h2 className="category-detail-title">
            {isAddMode ? 'THÊM DANH MỤC' : 'CHI TIẾT DANH MỤC'}
          </h2>

          {this.state.errorMessage && (
            <div className="alert-error global-msg">
              {this.state.errorMessage}
            </div>
          )}

          <form className="category-detail-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Tên danh mục</label>
              <input
                type="text"
                value={this.state.txtName}
                onChange={(e) => this.setState({ txtName: e.target.value })}
                className="form-input"
                placeholder="Nhập tên danh mục"
              />
            </div>
            <div className="form-actions">
              {isAddMode ? (
                <button
                  type="submit"
                  className="btn btn-add"
                  onClick={(e) => this.btnAddClick(e)}
                >
                  THÊM MỚI
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.mode === 'add' && prevProps.mode !== 'add') {
      this.setState({
        txtName: '',
      });
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) {
      const cate = { name: name };
      this.apiPostCategory(cate);
    } else {
      this.setState({
        errorMessage: 'Vui lòng nhập tên danh mục',
        successMessage: '',
      });
    }
  }

  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .post('/api/admin/categories', cate, config)
      .then((res) => {
        const result = res.data;
        if (result) {
          this.setState({
            successMessage: 'Thêm danh mục thành công!',
            errorMessage: '',
          });
          this.setState({ txtName: '' });
          setTimeout(() => {
            this.setState({ successMessage: '' });
          }, 2000);
        } else {
          this.setState({
            errorMessage: 'Lỗi! Đã xảy ra lỗi. Vui lòng thử lại sau.',
            successMessage: '',
          });
        }
      })
      .catch((error) => {
        console.error('Lỗi khi thêm danh mục:', error);
        this.setState({
          errorMessage: 'Đã xảy ra lỗi khi thêm danh mục.',
          successMessage: '',
        });
      });
  }
}

export default CategoryDetail;
