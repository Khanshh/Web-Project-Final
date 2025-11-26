import React, {useEffect, useState} from "react";
import './css/App.css';
import TaiKhoan_Admin from './components/TaiKhoan_Admin';

  function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const sampleAccount = {
    username: "admin",
    password: "123456",
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

    if (username === sampleAccount.username && password === sampleAccount.password) {
      setLoggedIn(true);
    } else {
      alert("❌ Sai tên đăng nhập hoặc mật khẩu!");
    }};

    if (loggedIn) {
      return <TaiKhoan_Admin 
        setLoggedIn={setLoggedIn}
        setUsername={setUsername}
        setPassword={setPassword} 
        />;
    }


    
    return (
    <div className="page">
      {/* ==== PHẦN HEADER TRÊN CÙNG ==== */}
      <div className="top-header">
        <div className="logo">
          <img src="/vite.svg" alt="Logo" />
        </div>
        <h1>Hệ thống Quản lý Nhân viên</h1>
        <p>Giải pháp quản lý nhân sự và tính lương hiện đại</p>
        </div>

      {/* ==== FORM ĐĂNG NHẬP ==== */}
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <div className="login-header">
            <h2>Đăng nhập</h2>
            <p className="subtext">Nhập thông tin để truy cập hệ thống</p>
            <div className="divider"></div>
          </div>

          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">Đăng nhập</button>
        </form>

        <p className="register">
          Chưa có tài khoản? <a href="#">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  );
}

export default App;

