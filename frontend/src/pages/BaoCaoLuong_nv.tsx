import React from "react";
import "../css/BaoCaoLuong_nv.css";


export default function BaoCaoLuong() {
  return (
    <div className="salary-page">
      <div className="salary-header">
        <h1>Báo cáo lương</h1>
        <p className="subtitle">Thống kê thu nhập theo cá nhân và theo tháng</p>
<div className="bao-cao-box">    
  <div className="bao-cao-header">
    <div className="title-block">
      <h1>Báo cáo thu nhập cá nhân</h1> 
      <h2>Thống kê và thu nhập cá nhân của nhân viên theo năm</h2>
    </div>

    <button className="export-btn">Xuất báo cáo</button>
  </div>


<div className="filter-row">
  

  <div className="field">
    <label>Năm</label>
    <input type="text" value="2025" readOnly />
  </div>
</div>

        
        <div className="employee-info-card">
          <div className="info-block">
            <span className="label">Mã nhân viên</span>
            <span className="value">PDTN0001</span>
          </div>
          <div className="info-block">
            <span className="label">Tên nhân viên</span>
            <span className="value">Nguyễn Văn An</span>
          </div>
          <div className="info-block">
            <span className="label">Phòng ban</span>
            <span className="value">Phát triển</span>
          </div>
          <div className="info-block">
            <span className="label">Chức vụ</span>
            <span className="value">Nhân viên</span>
          </div>
        </div>
        </div>   
        <div className="bao-cao-box">
        <h2 className="bao-cao-header">Tổng kết năm 2025</h2>

        <div className="summary-cards">
          <div className="sum-card green">
            <p className="title">Tổng thu nhập</p>
            <h3>117.777.000 đ</h3>
          </div>

          <div className="sum-card blue">
            <p className="title">Tổng giờ làm việc</p>
            <h3>120.4 giờ</h3>
          </div>

          <div className="sum-card yellow">
            <p className="title">Tổng giờ làm thêm</p>
            <h3>72.6 giờ</h3>
          </div>
        </div>
        </div>
      </div>
      <div className="monthly-detail">
       <div className="bao-cao-box">
        <div className="bao-cao-header">Chi tiết theo tháng</div>
        <div className="bao-cao-body">
        <table className="salary-table">
          <thead>
            <tr>
              <th>Tháng</th>
              <th>Lương cơ bản</th>
              <th>Giờ làm việc</th>
              <th>Giờ làm thêm</th>
              <th>Lương làm thêm</th>
              <th>Tổng lương</th>
            </tr>
          </thead>

          <tbody>
            {[
              "Tháng 1 năm 2025",
              "Tháng 2 năm 2025",
              "Tháng 3 năm 2025",
              "Tháng 4 năm 2025",
              "Tháng 5 năm 2025",
              "Tháng 6 năm 2025",
              "Tháng 7 năm 2025",
              "Tháng 8 năm 2025",
              "Tháng 9 năm 2025",
              "Tháng 10 năm 2025",
              "Tháng 11 năm 2025",
              "Tháng 12 năm 2025"
            ].map((month, i) => (
              <tr key={i}>
                <td>{month}</td>
                <td>8.000.000 đ</td>
                <td>0.0h</td>
                <td>0.0h</td>
                <td>0 đ</td>
                <td>8.000.000 đ</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </div>
      </div>

    </div>
  );
}
