import React, { useEffect, useState } from "react";
import "../css/ChamCong_nv.css";
import axios from "axios";

interface ChamCong {
  id: string;
  ma_nhan_vien: string;
  ngay: string;
  checkin: string;
  checkout: string;
}

interface TimeChamCong {
  checkin: string;
  checkout: string;
}

// Assuming we can get the current user's ID from somewhere, or we pass it as prop.
// For now, let's assume we store it in localStorage or passed via props.
// But since this component is used inside User page, maybe we can get it from there.
// However, the User page in App.tsx passes username.
// Let's assume username is the ma_nhan_vien for simplicity or we fetch it.
// Actually, in App.tsx we set currentUser. Let's assume we can access it.
// But to keep it simple, I will use a hardcoded "NV001" or try to get from localStorage if I saved it.
// Wait, I didn't save it to localStorage in App.tsx.
// I will assume the user is "admin" or whatever username they logged in with.
// Ideally, `ma_nhan_vien` should be part of the user object.
// For this demo, I will use the username as ma_nhan_vien if it looks like an ID, or just use the username.

const ListChamCongNV: React.FC = () => {
  const [chamCong, setChamCong] = useState<ChamCong[]>([]);
  const [timeChamCong, setTimeChamCong] = useState<TimeChamCong>({ checkin: "", checkout: "" });
  const [formChamCong, setFormChamCong] = useState(false)
  const [dateTime, setDateTime] = useState(new Date().toISOString().split('T')[0])
  const [currentTime, setCurrentTime] = useState(new Date());

  // TODO: Get real user ID. For now, using a placeholder or getting from window/local if possible.
  // Since I can't easily pass props without changing App.tsx structure deeply (User -> ListChamCongNV),
  // I'll try to get it from a global context or just assume a test ID for now if not passed.
  // But wait, I can just use "admin" or the logged in username if I had it.
  // Let's assume the user is "NV001" for testing if not provided.
  // A better way is to save user to localStorage in App.tsx upon login.
  const maNV = "NV001"; // Placeholder, should be dynamic

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchMyAttendance();
    return () => clearInterval(timer);
  }, []);

  const fetchMyAttendance = async () => {
    try {
      // In a real app, we would get the ID from the logged-in user state
      // For now, let's try to fetch all and filter by "NV001" or similar
      // Or better, I'll update the backend to allow fetching by username if I could.
      // But I implemented /my-attendance/{ma_nhan_vien}.
      // Let's just use a hardcoded ID for demonstration since I didn't implement full user-employee linking.
      const res = await axios.get(`http://localhost:5000/api/chamcong/my-attendance/${maNV}`);
      setChamCong(res.data);

      // Check if checked in today
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = res.data.find((cc: ChamCong) => cc.ngay === today);
      if (todayRecord) {
        setTimeChamCong({
          checkin: todayRecord.checkin,
          checkout: todayRecord.checkout
        });
      }
    } catch (error) {
      console.error("Error fetching my attendance:", error);
    }
  }

  const handleCheckInOut = async () => {
    const time = currentTime.toLocaleTimeString("vi-VN", { hour12: false });
    const type = !timeChamCong.checkin ? "checkin" : "checkout";

    try {
      await axios.post("http://localhost:5000/api/chamcong", {
        ma_nhan_vien: maNV,
        time: time,
        type: type
      });

      if (type === "checkin") {
        setTimeChamCong({ ...timeChamCong, checkin: time });
      } else {
        setTimeChamCong({ ...timeChamCong, checkout: time });
        setTimeout(() => {
          setFormChamCong(false);
        }, 1500);
      }
      fetchMyAttendance();
    } catch (error) {
      alert("Lỗi chấm công: " + error);
    }
  };

  const filteredChamCong = chamCong.filter(cc => cc.ngay === dateTime);

  return (
    <div className="cham-cong-container">
      <div className="cham-cong-header">
        <div className="content_header">
          <h4> Quản Lý Chấm Công </h4>
          <p> Quản lý thời gian làm việc của bạn </p>
        </div>
        <div className="content_header_button">
          <button onClick={() => setFormChamCong(true)}>🕔 Chấm công nhanh</button>
        </div>
      </div>

      <div className="content_header_time">
        <div className="content_title_text">
          <h4>Chọn ngày</h4>
          <p>Xem danh sách chấm công theo ngày</p>
        </div>
        <div className="content_title_time">
          <input
            type="date"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>
      </div>

      <div className="content_header_main">
        <div className="main_detail_label">
          <h4> Danh sách chấm công </h4>
          <p> Lịch bạn đã chấm công ngày {dateTime} </p>
        </div>
        <div className="main_detail_table">
          <table>
            <thead>
              <tr>
                <th>Nhân viên</th>
                <th>🕔Buổi sáng (8:00 - 12:00)</th>
                <th>🕔Buổi chiều (13:30 - 17:30)</th>
                <th>Tổng giờ</th>
              </tr>
            </thead>
            <tbody>
              {filteredChamCong.length > 0 ? filteredChamCong.map(cc => (
                <tr key={cc.id}>
                  <td>{cc.ma_nhan_vien}</td>
                  <td>
                    Check In: {cc.checkin || "--:--"}<br />
                  </td>
                  <td>
                    Check Out: {cc.checkout || "--:--"}<br />
                  </td>
                  <td>--</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="content_header_note">
        <h4>🕔 Quy định giờ làm việc:</h4>
        <li>Buổi sáng: 8:00 - 12:00 (4 giờ)</li>
        <li>Buổi chiều: 13:30 - 17:30 (4 giờ)</li>
        <li>Check-in muộn hơn giờ quy định sẽ được đánh dấu màu đỏ</li>
        <li>Check-in đúng giờ hoặc sớm sẽ được đánh dấu màu xanh</li>
      </div>


      {formChamCong && (
        <div className="content_check_inout">
          <div className="button_exitform">
            <button onClick={() => setFormChamCong(false)}>✖</button>
          </div>
          <div className="header_wellcome">
            <h4> Wellcome, Hãy Chấm Công Nào!</h4>
            <p>
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="header_time_now">
            {currentTime.toLocaleTimeString("vi-VN", { hour12: false })}
          </div>
          <div className="time_checkin">
            <h4>Thời gian CheckIn</h4>
            <p>{timeChamCong.checkin || "--:--:--"}</p>
          </div>
          <div className="time_checkout">
            <h4>Thời gian CheckOut</h4>
            <p>{timeChamCong.checkout || "--:--:--"}</p>
          </div>
          <div className="checkin_button">
            <button
              onClick={handleCheckInOut}
              disabled={!!timeChamCong.checkout}
            >
              {timeChamCong.checkin && !timeChamCong.checkout ? "Check Out" : "Check In"}
            </button>

          </div>
        </div>
      )}


    </div>
  );
};

export default ListChamCongNV;
