import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import '../App.css'; // Đảm bảo import đúng file css nếu cần

const Login = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const [txtUsername, setTxtUsername] = useState('');
  const [txtPassword, setTxtPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const btnLoginClick = async (e) => {
    e.preventDefault();

    if (!txtUsername.trim() || !txtPassword.trim()) {
      setErrorMessage("⚠️ Vui lòng nhập đầy đủ Username và Password!");
      return;
    }

    const account = { username: txtUsername, password: txtPassword };

    try {
      const res = await axios.post("/api/customer/login", account);
      const result = res.data;

      if (result.success === true) {
        context.setToken(result.token);
        context.setUsername(account.username);
        // lưu vào localStorage để giữ sau reload
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", account.username);
        setErrorMessage('');
        navigate('/home');
      } else {
        setErrorMessage(result.message || "Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Lỗi kết nối đến máy chủ";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="container">
      <div className="login__form">
        <div className="row justify-content-center">
          <div className="col-sm-12 col-lg-6">
            <form className="form" onSubmit={btnLoginClick}>
              <h3 className="heading text-center">CUSTOMER LOGIN</h3>
              {errorMessage && (
                <div className="text-danger text-center mb-3">{errorMessage}</div>
              )}

              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="VD: minhquan1627"
                  className="form-control"
                  value={txtUsername}
                  onChange={(e) => setTxtUsername(e.target.value)}
                />
              </div>

              <div className="form-group matkhau position-relative">
                <label htmlFor="password" className="form-label">Mật khẩu</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  className="form-control"
                  value={txtPassword}
                  onChange={(e) => setTxtPassword(e.target.value)}
                />
                <span
                  className="show-hide"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                >
                  <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </span>
              </div>

              <button
                type="submit"
                className="form-submit btn-blocker w-100"
                style={{ borderRadius: 'unset' }}
              >
                ĐĂNG NHẬP <i className="fas fa-arrow-right" style={{ fontSize: '16px', marginLeft: '10px' }}></i>
              </button>
            </form>
          </div>

          <div className="col-sm-12 col-lg-6">
            <h3 className="heading">TẠO MỘT TÀI KHOẢN</h3>
            <p className="text-login">
              Thật dễ dàng tạo một tài khoản. Hãy nhập địa chỉ email của bạn và điền vào mẫu trên trang tiếp theo và tận hưởng những lợi ích của việc sở hữu một tài khoản:
            </p>
            <ul>
              {[
                "Tổng quan đơn giản về thông tin cá nhân của bạn",
                "Thanh toán nhanh hơn",
                "Ưu đãi và khuyến mãi độc quyền",
                "Các sản phẩm mới nhất",
                "Các bộ sưu tập giới hạn và bộ sưu tập theo mùa mới",
                "Các sự kiện sắp tới",
              ].map((text, index) => (
                <li className="text-login-item" key={index}>
                  <i className="fas fa-check"></i>
                  <p className="text-login">{text}</p>
                </li>
              ))}
            </ul>

            <Link to="/signup">
              <button
                type="button"
                className="form-submit btn-blocker w-100"
                style={{ borderRadius: 'unset' }}
              >
                ĐĂNG KÍ <i className="fas fa-arrow-right" style={{ fontSize: '16px', marginLeft: '10px' }}></i>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
