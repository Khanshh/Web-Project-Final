import { useState } from "react";
import "./App.css";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";


function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  // Tài khoản mẫu có sẵn
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
    }
  };

const DashboardChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Trưởng phòng", "Phó phòng", "Nhân viên"],
        datasets: [
          {
            label: "Số lượng",
            data: [2, 3, 1],
            backgroundColor: ["#4f8beb", "#0350f5", "#72c2ff"],
            borderColor: ["#4f8beb", "#0350f5", "#72c2ff"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
        plugins: { legend: { display: false } },
      },
    });
  }, []);

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <canvas ref={chartRef} />
    </div>
  );
};

  // Nếu đã đăng nhập thì hiển thị trang chính
  if (loggedIn) {
     return (
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="brand">
              <div className="brand-icon" aria-hidden></div>
              <div>
                <div className="brand-title">Hệ thống Quản lý</div>
                <div className="brand-sub">Nhân viên & Lương</div>
                <div className="divido"></div>
              </div>
            </div>

            <div className="profile">
              <div className="avatar">👑</div>
              <div className="profile-txt">
                <div className="profile-name">Administrator</div>
                <div className="profile-handle">@admin</div>
              </div>
              <div className="role-chip">Admin</div>
            </div>

            <nav className="nav">
              <a className={`nav-item ${activePage === "dashboard" ? "active" : ""}`} 
    onClick={() => setActivePage("dashboard")}><span className="icon">🏠</span>Trang chủ</a>
              <a className={`nav-item ${activePage === "department" ? "active" : ""}`} 
    onClick={() => setActivePage("department")} ><span className="icon">🏢</span>Phòng ban</a>
              <a className="nav-item"><span className="icon">🎓</span>Chức vụ</a>
              <a className="nav-item"><span className="icon">👥</span>Nhân viên</a>
              <a  className={`nav-item ${activePage === "attendance" ? "active" : ""}`} 
    onClick={() => setActivePage("attendance")}><span className="icon">⏱️</span>Chấm công</a>
              <a className="nav-item"><span className="icon">💲</span>Báo cáo lương</a>
            </nav>
          </div>

          <div className="sidebar-bottom">
            <button className="logout" onClick={() => { setLoggedIn(false); setUsername(""); setPassword(""); }}>
              ⏎ Đăng xuất
            </button>
            <div className="copyright">© 2025 Hệ thống Quản lý Nhân viên</div>
          </div>
        </aside>

        <main className="main">
          

           {activePage === "dashboard" && (
    <>
      <div className="hero">
            <div className="hero-left">
              <div className="hero-icon">👑</div>
              <div>
                <h2>Chào mừng, Administrator!</h2>
                <p>Quản trị viên hệ thống • Dashboard tổng quan</p>
              </div>
            </div>
            <div className="hero-right">
              <div className="admin-pill">👤 Admin</div>
            </div>
          </div>

      <div className="content">
        <div className="grid">
          <section className="card stat">
            <div className="stat-title">Nhân viên</div>
            <div className="stat-value">0</div>
            <div className="stat-sub">0 tổng<br />0 đã ẩn</div>
          </section>

          <section className="card stat">
            <div className="stat-title">Chấm công tháng này</div>
            <div className="stat-value">0</div>
            <div className="stat-sub">0 tổng • 0.0% của tổng</div>
          </section>

          <section className="card wide">
            <h3>Phân bố theo Phòng ban</h3>
            <div className="placeholder">Chưa có dữ liệu phòng ban</div>
          </section>

          <section className="card wide">
            <h3>Phân bố theo Chức vụ</h3>
              <DashboardChart />
          </section>

          <section className="card">
            <h3>Ranking KPI Nhân viên</h3>
            <div className="placeholder">Chưa có dữ liệu chấm công tháng trước</div>
          </section>

          <section className="card">
            <h3>Tình trạng hệ thống</h3>
            <div className="progress-row">
              <div className="label">Phòng ban <span className="num">0</span></div>
              <div className="progress"><div style={{ width: "0%" }}></div></div>

              <div className="label">Chức vụ <span className="num">3</span></div>
              <div className="progress"><div style={{ width: "30%" }}></div></div>

              <div className="label">Nhân viên hoạt động <span className="num green">0/0</span></div>
              <div className="progress"><div style={{ width: "0%" }}></div></div>

              <div className="label">Bản ghi chấm công <span className="num">0</span></div>
              <div className="progress"><div style={{ width: "0%" }}></div></div>

              <button className="export">⬇ Xuất báo cáo hệ thống</button>
            </div>
          </section>
        </div>
      </div>
    </>
  )}
 

           {activePage === "attendance" && (
    <div className="content">
      <h2 style={{ fontSize: "24px", marginBottom: "-0.3cm" }}>Chấm công</h2>
      <p>Theo dõi giờ vào - giờ ra của nhân viên</p>

      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Chọn ngày</h3>
        <input type="date" defaultValue="2025-11-11" style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }} />
      </div>

      <div className="card attendance-card" style={{ marginTop: "20px" }}>
        <h3>Danh sách chấm công</h3>
        <p>0 nhân viên đã chấm công ngày 11/11/2025</p>
        <table className="attendance-table">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Giờ buổi sáng</th>
            <th>Giờ buổi chiều</th>
            <th>Tổng giờ</th>
          </tr>
        </thead>
        </table>
        <div className="placeholder">Chưa có bản ghi chấm công nào trong ngày này</div>
      </div>

      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Quy định giờ làm việc</h3>
        <ul>
          <li>Buổi sáng: 8:00 - 12:00 (4 giờ)</li>
          <li>Buổi chiều: 13:30 - 17:30 (4 giờ)</li>
        </ul>
      </div>
    </div>
  )}
        </main>
      </div>
    );
    
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
