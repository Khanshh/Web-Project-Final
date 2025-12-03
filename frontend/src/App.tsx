import { useState, useEffect, useRef } from "react";
import "./css/App.css";
import "./css/TrangChu.css";
import "./css/User.css";

import ListPhongBan from "./pages/PhongBan";
import ListChucVu from "./pages/ChucVu";
import ListNhanVien from "./pages/NhanVien";
import ListChamCong from "./pages/ChamCong";
import ListBaoCaoLuong from "./pages/BaoCaoLuong";
import DangKy from "./components/DangKi";

import Chart from "chart.js/auto";
import User from "./pages/user";  // U viết hoa
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>({
    nhan_vien_count: 0,
    cham_cong_today: 0,
    phong_ban_count: 0,
    chuc_vu_count: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password
      });
      if (res.data.message === "Login successful") {
        setLoggedIn(true);
        setCurrentUser(res.data.user);
        if (res.data.role === "admin") {
          setActivePage("dashboard");
        } else {
          setActivePage("user");
        }
      }
    } catch (error) {
      alert("❌ Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  useEffect(() => {
    if (loggedIn && activePage === "dashboard") {
      fetchDashboardStats();
    }
  }, [loggedIn, activePage]);

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard/stats");
      setDashboardStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
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
              data: [2, 3, 1], // Mock data for chart, could be real API too
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


  if (loggedIn && activePage === "user") {
    return (
      <User
        username={username}
        maNhanVien={currentUser?.ma_nhan_vien || null}
        onLogout={() => {
          setLoggedIn(false);
          setUsername("");
          setPassword("");
          setActivePage("");
          setCurrentUser(null);
        }}
      />
    );
  }


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
                <div className="profile-name">{currentUser?.ho_ten || "Administrator"}</div>
                <div className="profile-handle">@{currentUser?.username || "admin"}</div>
              </div>
              <div className="role-chip">Admin</div>
            </div>

            <nav className="nav">
              <a className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
                onClick={() => setActivePage("dashboard")}><span className="icon">🏠</span>Trang chủ</a>
              <a className={`nav-item ${activePage === "department" ? "active" : ""}`}
                onClick={() => setActivePage("department")} ><span className="icon">🏢</span>Phòng ban</a>
              <a className={`nav-item ${activePage === "position" ? "active" : ""}`}
                onClick={() => setActivePage("position")}><span className="icon">🎓</span>Chức vụ</a>
              <a className={`nav-item ${activePage === "employee" ? "active" : ""}`}
                onClick={() => setActivePage("employee")}><span className="icon">👥</span>Nhân viên</a>
              <a className={`nav-item ${activePage === "attendance" ? "active" : ""}`}
                onClick={() => setActivePage("attendance")}><span className="icon">⏱️</span>Chấm công</a>
              <a className={`nav-item ${activePage === "salary-report" ? "active" : ""}`}
                onClick={() => setActivePage("salary-report")}><span className="icon">💲</span>Báo cáo lương</a>
            </nav>
          </div>

          <div className="sidebar-bottom">
            <button className="logout" onClick={() => { setLoggedIn(false); setUsername(""); setPassword(""); setCurrentUser(null); }}>
              ⏎ Đăng xuất
            </button>
            <div className="copyright">© 2025 Hệ thống Quản lý Nhân viên</div>
          </div>
        </aside>

        <main className="main">

          {activePage === "register" && (
            <DangKy onBack={() => setActivePage("dashboard")} />
          )}

          {activePage === "dashboard" && (
            <>
              <div className="hero">
                <div className="hero-left">
                  <div className="hero-icon">👑</div>
                  <div>
                    <h2>Chào mừng, {currentUser?.ho_ten || "Administrator"}!</h2>
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
                    <div className="stat-value">{dashboardStats.nhan_vien_count}</div>
                    <div className="stat-sub">{dashboardStats.nhan_vien_count} tổng<br />0 đã ẩn</div>
                  </section>

                  <section className="card stat">
                    <div className="stat-title">Chấm công hôm nay</div>
                    <div className="stat-value">{dashboardStats.cham_cong_today}</div>
                    <div className="stat-sub">{dashboardStats.cham_cong_today} tổng</div>
                  </section>

                  <section className="card wide">
                    <h3>Phân bố theo Phòng ban</h3>
                    <div className="stat-value" style={{ fontSize: "24px" }}>{dashboardStats.phong_ban_count} Phòng ban</div>
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
                      <div className="label">Phòng ban <span className="num">{dashboardStats.phong_ban_count}</span></div>
                      <div className="progress"><div style={{ width: "100%" }}></div></div>

                      <div className="label">Chức vụ <span className="num">{dashboardStats.chuc_vu_count}</span></div>
                      <div className="progress"><div style={{ width: "100%" }}></div></div>

                      <div className="label">Nhân viên hoạt động <span className="num green">{dashboardStats.nhan_vien_count}/{dashboardStats.nhan_vien_count}</span></div>
                      <div className="progress"><div style={{ width: "100%" }}></div></div>

                      <div className="label">Bản ghi chấm công <span className="num">{dashboardStats.cham_cong_today}</span></div>
                      <div className="progress"><div style={{ width: "100%" }}></div></div>

                      <button className="export">⬇ Xuất báo cáo hệ thống</button>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}

          {activePage === "department" && (
            <ListPhongBan />
          )}

          {activePage === "position" && (
            <ListChucVu />
          )}

          {activePage === "employee" && (
            <ListNhanVien />
          )}

          {activePage === "attendance" && (
            <ListChamCong />
          )}

          {activePage === "salary-report" && (
            <ListBaoCaoLuong />
          )}

        </main>
      </div>
    );
  }

  if (showRegister) {
    return <DangKy onBack={() => setShowRegister(false)} />;
  }

  // Giao diện đăng nhập chính
  return (
    <div className="page">
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
          Chưa có tài khoản?{" "}
          <span className="reg-link" onClick={() => setShowRegister(true)}>
            Đăng ký ngay
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;