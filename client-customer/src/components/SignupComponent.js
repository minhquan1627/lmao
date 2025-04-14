import axios from 'axios';
import React, { Component } from 'react';
import withNavigation from '../utils/withNavigation'; // thêm dòng này ở đầu
import '../App'; // Import CSS tùy chỉnh

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
    };
  }

  render() {
    return (
      <div className="signup-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-8 col-sm-10">
              <div className="signup-card">
                <h2 className="signup-title">ĐĂNG KÝ</h2>
                <div className="underline"></div>
                <form onSubmit={(e) => this.btnSignupClick(e)}>
                  <div className="form-group mb-4">
                    <label className="form-label">Tên đăng nhập</label>
                    <input
                      type="text"
                      className="form-control signup-input"
                      value={this.state.txtUsername}
                      onChange={(e) => this.setState({ txtUsername: e.target.value })}
                      placeholder="Nhập tên đăng nhập"
                      required  
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control signup-input"
                      value={this.state.txtPassword}
                      onChange={(e) => this.setState({ txtPassword: e.target.value })}
                      placeholder="Nhập mật khẩu"
                      required
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label">Họ và tên</label>
                    <input
                      type="text"
                      className="form-control signup-input"
                      value={this.state.txtName}
                      onChange={(e) => this.setState({ txtName: e.target.value })}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="text"
                      pattern="[0-9]{10}"
                      className="form-control signup-input"
                      value={this.state.txtPhone}
                      onChange={(e) => this.setState({ txtPhone: e.target.value })}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control signup-input"
                      value={this.state.txtEmail}
                      onChange={(e) => this.setState({ txtEmail: e.target.value })}
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                  <button type="submit" className="btn signup-btn">
                    <i className="fas fa-user-plus mr-2"></i> ĐĂNG KÝ
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // event-handlers
  btnSignupClick = (e) => {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;

    if (!txtUsername.trim() || !txtPassword.trim() || !txtName.trim() || !txtPhone.trim() || !txtEmail.trim()) {
      this.setState({ errorMessage: "⚠️ Vui lòng nhập đầy đủ thông tin!" });
      return;
    }

    const newUser = { username: txtUsername, password: txtPassword, name: txtName, phone: txtPhone, email: txtEmail };
    this.apiSignup(newUser);
  };

  // apis
  apiSignup(account) {
    axios.post("/api/customer/signup", account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        alert("🎉 Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
        this.setState({ errorMessage: "lỗi rồi cu ơi" });
        this.props.navigate('/home');
      } else {
        this.setState({ errorMessage: result.message });
      }
    });
}
}
export default withNavigation(Signup);

