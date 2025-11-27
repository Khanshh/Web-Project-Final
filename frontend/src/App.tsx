import { useState } from "react";
import "./css/App.css";
import "./css/TrangChu.css";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ListPhongBan from "./pages/PhongBan";
import ListChucVu from "./pages/ChucVu";
import ListNhanVien from "./pages/NhanVien";


function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [reportType, setReportType] = useState("day");

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
              <a className={`nav-item ${activePage === "position" ? "active" : ""}`} 
    onClick={() => setActivePage("position")}><span className="icon">🎓</span>Chức vụ</a>
              <a className={`nav-item ${activePage === "employee" ? "active" : ""}`} 
    onClick={() => setActivePage("employee")}><span className="icon">👥</span>Nhân viên</a>
              <a  className={`nav-item ${activePage === "attendance" ? "active" : ""}`} 
    onClick={() => setActivePage("attendance")}><span className="icon">⏱️</span>Chấm công</a>
              <a className={`nav-item ${activePage === "salary-report" ? "active" : ""}`} 
    onClick={() => setActivePage("salary-report")}><span className="icon">💲</span>Báo cáo lương</a>
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
  {activePage === "salary-report" && (
  <div className="content">
    <h2 style={{ fontSize: "24px", marginBottom: "-0.3cm" }}>Báo cáo lương</h2>
    <p>Thống kê thu nhập theo cá nhân và theo khoảng thời gian</p>

    {/* Tabs chọn chế độ */}
    <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
      <button
        onClick={() => setReportType("day")}
        style={{
          padding: "8px 16px",
          borderRadius: "25px",
          border: reportType === "day" ? "1px solid #4a80ff" : "1px solid #ccc",
          background: reportType === "day" ? "#e9f0ff" : "#f9f9f9",
          color: reportType === "day" ? "#0040c1" : "#333",
          fontWeight: 600,
          cursor: "pointer",
          transition: "0.25s",
        }}
      >
        📊 Báo cáo theo ngày
      </button>

      <button
        onClick={() => setReportType("month")}
        style={{
          padding: "8px 16px",
          borderRadius: "25px",
          border: reportType === "month" ? "1px solid #4a80ff" : "1px solid #ccc",
          background: reportType === "month" ? "#e9f0ff" : "#f9f9f9",
          color: reportType === "month" ? "#0040c1" : "#333",
          fontWeight: 600,
          cursor: "pointer",
          transition: "0.25s",
        }}
      >
        📅 Báo cáo theo tháng
      </button>
    </div>

    {/* --- Nội dung Báo cáo theo Ngày --- */}
    {reportType === "day" && (
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Báo cáo thu nhập cá nhân theo ngày</h3>
        <p>Thống kê lương và thưởng của nhân viên trong một ngày cụ thể</p>

        <div style={{ display: "flex", gap: "40px", alignItems: "flex-end", marginTop: "20px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "600" }}>Chọn nhân viên</label>
            <select
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                background: "#f9fbfe",
              }}
            >
              <option value="">Chọn nhân viên</option>
              <option value="NV001">Nguyễn Văn A</option>
              <option value="NV002">Trần Thị B</option>
              <option value="NV003">Lê Văn C</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "600" }}>Chọn ngày</label>
            <input
              type="date"
              defaultValue="2025-11-12"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                background: "#f9fbfe",
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h4>Kết quả thu nhập</h4>
          <table style={{ width: "100%", marginTop: "8px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f5ff", textAlign: "left" }}>
                <th style={{ padding: "10px" }}>Khoản mục</th>
                <th style={{ padding: "10px" }}>Số tiền (VND)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "10px" }}>Lương cơ bản</td>
                <td style={{ padding: "10px" }}>15,000,000</td>
              </tr>
              <tr>
                <td style={{ padding: "10px" }}>Thưởng chuyên cần</td>
                <td style={{ padding: "10px" }}>1,000,000</td>
              </tr>
              <tr>
                <td style={{ padding: "10px" }}>Phụ cấp</td>
                <td style={{ padding: "10px" }}>500,000</td>
              </tr>
              <tr style={{ background: "#f9f9f9", fontWeight: "600" }}>
                <td style={{ padding: "10px" }}>Tổng thu nhập</td>
                <td style={{ padding: "10px", color: "#0040c1" }}>16,500,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* --- Nội dung Báo cáo theo Tháng --- */}
    {reportType === "month" && (
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Báo cáo tổng hợp theo tháng</h3>
        <p>Hiển thị tổng lương, thưởng và phụ cấp trong tháng</p>

        <div style={{ display: "flex", gap: "40px", alignItems: "flex-end", marginTop: "20px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "600" }}>Chọn nhân viên</label>
            <select
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                background: "#f9fbfe",
              }}
            >
              <option value="">Chọn nhân viên</option>
              <option value="NV001">Nguyễn Văn A</option>
              <option value="NV002">Trần Thị B</option>
              <option value="NV003">Lê Văn C</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "600" }}>Chọn tháng</label>
            <input
              type="month"
              defaultValue="2025-11"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                background: "#f9fbfe",
              }}
            />
          </div>
        </div>

        <div className="placeholder" style={{ marginTop: "30px" }}>
          Chưa có dữ liệu báo cáo tháng này
        </div>
      </div>
    )}
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
