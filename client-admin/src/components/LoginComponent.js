import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import '../styles/login.css'; 

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: "",
      txtPassword: "",
      errorMessage: "",
    };
  }

  render() {
    if (this.context.token === '') {
      return (
        <div className="login-container">
          <div className="login-box">
            <h2 className="login-title">ADMIN LOGIN</h2>
            <form onSubmit={(e) => this.btnLoginClick(e)}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                  type="text" 
                  id="username"
                  value={this.state.txtUsername} 
                  onChange={(e) => this.setState({ txtUsername: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password"
                  value={this.state.txtPassword} 
                  onChange={(e) => this.setState({ txtPassword: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              <button type="submit" className="login-button">
                LOGIN
              </button>
            </form>
          </div>
        </div>
      );
    }
    return (<div />);
  }

  btnLoginClick = (e) => {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;

    if (!txtUsername.trim() || !txtPassword.trim()) {
      this.setState({ errorMessage: "⚠️ Vui lòng nhập đầy đủ Username và Password!" });
      return;
    }

    const account = { username: txtUsername, password: txtPassword };
    this.apiLogin(account);
  };

  apiLogin(account) {
    axios.post("/api/admin/login", account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
        this.setState({ errorMessage: "" });
      } else {
        this.setState({ errorMessage: result.message });
      }
    });
  }
}

export default Login;