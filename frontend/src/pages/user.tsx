import React, { useState } from "react";
import ListChamCongNV from "./ChamCong_nv";
import ListTaiKhoanNV from "./ThongTin_nv";
import BaoCaoLuongNV from "./BaoCaoLuong_nv";
import "../css/User.css";


export default function User({ username, onLogout }: { username: string, onLogout: () => void }) {
  const [renderPage, setRenderPage] = useState("trangchu");

  return (
    <div className="user-page">
      {/* Sidebar trái */}
      <aside className="user-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Hệ Thống Nhân Viên</div>
          <div className="sidebar-subtitle">Thông tin cá nhân</div>
        </div>
        <div className="user-info-card">
          <div className="user-info">
            <div className="avatar-sidebar">NG</div>
            <div className="user-details-group">
              <div className="name">Nguyễn Văn A</div>
              <div className="employee-id">Mã NV: 12345</div>
            </div>
          </div>

          <div className="user-details">
            <div className="detail-item">
              <span className="label">Phòng ban:</span>
              <span className="value">Phát triển</span>
            </div>
            <div className="detail-item">
              <span className="label">Chức vụ:</span>
              <span className="value">Nhân viên</span>
            </div>
          </div>
        </div>

        <nav className="user-nav">
          <a className={renderPage === "trangchu" ? "active" : ""}
    onClick={() => setRenderPage("trangchu")}>🏠 Trang chủ</a>
          <a className={renderPage === "baocaoluong" ? "active" : ""}
    onClick={() => setRenderPage("baocaoluong")}>💲 Báo cáo lương</a>
          <a className={renderPage === "chamcong" ? "active" : ""}
    onClick={() => setRenderPage("chamcong")}>⏱️ Chấm công</a>
          <a className={renderPage === "taikhoan" ? "active" : ""}
    onClick={() => setRenderPage("taikhoan")}>👥 Tài khoản</a>
        </nav>
        <button className="logout-btn" onClick={onLogout}>⏎ Đăng xuất</button>
        <div className="copyright">© 2025 Hệ thống Quản lý Nhân viên</div>
      </aside>



      <main className="user-main">
        {renderPage === "trangchu" && (
          <>
            {/* ==== Phần 1: Thông tin cá nhân ==== */}
            <div className="user-card">
              <div className="user-header">
                <div>
                  <h2>Nguyễn Văn An</h2>
                  <p>Đơn vị: Phát triển</p>
                  <p>Vai trò: Nhân viên</p>
                  <p><i className="icon-company"></i> A.ISOFT</p>
                </div>
                <div className="user-avatar-circle">NA</div>
              </div>
            </div>

            {/* ==== Phần 2: Thống kê tháng ==== */}
            <div className="user-cardh1">
              <div className="stats-section">
                <h3 className="bao-cao-header">Thống kê tháng</h3>
                <div className="stat-item">
                  <span>Số buổi làm việc</span>
                  <span>52</span>
                </div>
                <div className="stat-item">
                  <span>Tổng giờ làm việc</span>
                  <span>209.9 giờ</span>
                </div>
                <div className="stat-item">
                  <span>Lương cơ bản</span>
                  <span>NaN ₫</span>
                </div>
                <div className="stat-item">
                  <span>Lương làm thêm</span>
                  <span>0 ₫</span>
                </div>
                <div className="stat-total">
                  <span>Tổng dự kiến</span>
                  <span>NaN ₫</span>
                </div>
              </div>
            </div>
            <div className="user-cardh1">
              <div className="stats-section">
                <h3 className="bao-cao-header" >Kết quả trong ngày</h3>
                <div className="stats-section1" style={{ textAlign: "center", width: "100%" }}>
                  <p className="no-record">Không có bản ghi chấm công nào hôm nay</p>
                </div>
              </div>
            </div>

            <div className="two-small-cards">
              {/* CARD 1 */}
              <div className="small-card-box flex items-center gap-4">
                {/* ICON CLOCK */}
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <div>
                  <h3>Giờ đã làm</h3>
                  <p className="value">209.9h</p>
                </div>
              </div>

              {/* CARD 2 */}
              <div className="small-card-box flex items-center gap-4">
                {/* ICON TREND */}
                <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
                  </svg>
                </div>

                <div>
                  <h3>Giờ làm thêm</h3>
                  <p className="value">169.9h</p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {renderPage === "chamcong" && <ListChamCongNV />}
        {renderPage === "baocaoluong" && <BaoCaoLuongNV />}
        {renderPage === "taikhoan" && <ListTaiKhoanNV />}
      </main>

    </div>
  );
}
