import React, {useEffect, useState} from "react";
import '../css/TrangChu.css';

function ChamCong() {
  return (
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
  );
}

export default ChamCong;   // ✅ export default