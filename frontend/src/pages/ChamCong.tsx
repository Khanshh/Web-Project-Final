import { useEffect, useState } from "react";
import "../css/TrangChu.css";
import axios from "axios";

interface ChamCong {
  id: string;
  ma_nhan_vien: string;
  ngay: string;
  checkin: string;
  checkout: string;
}

const ListChamCong = () => {
  const [chamCongList, setChamCongList] = useState<ChamCong[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchChamCong();
  }, []);

  const fetchChamCong = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chamcong");
      setChamCongList(res.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const filteredList = chamCongList.filter(cc => cc.ngay === selectedDate);

  return (
    <div className="content">
      <h2 style={{ fontSize: "24px", marginBottom: "-0.3cm" }}>Chấm công</h2>
      <p>Theo dõi giờ vào - giờ ra của nhân viên</p>

      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Chọn ngày</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
      </div>

      <div className="card attendance-card" style={{ marginTop: "20px" }}>
        <h3>Danh sách chấm công</h3>
        <p>{filteredList.length} nhân viên đã chấm công ngày {selectedDate}</p>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Giờ Check-in</th>
              <th>Giờ Check-out</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((cc) => (
              <tr key={cc.id}>
                <td>{cc.ma_nhan_vien}</td>
                <td>{cc.checkin || "--:--"}</td>
                <td>{cc.checkout || "--:--"}</td>
                <td>
                  {cc.checkin && cc.checkout ? "Hoàn thành" : "Đang làm việc"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredList.length === 0 && (
          <div className="placeholder">Chưa có bản ghi chấm công nào trong ngày này</div>
        )}
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
};

export default ListChamCong;
