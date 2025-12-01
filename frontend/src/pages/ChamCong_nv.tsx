import React, {useEffect, useState} from "react";
import "../css/ChamCong_nv.css";
import axios from "axios";

interface ChamCong {
// cho phần dữ liệu lấy ra tuwd backend
}


interface TimeChamCong {
  checkin: string;
  checkout: string;
}


const ListChamCongNV: React.FC = () => {
  const [chamCong, setChamCong] = useState<ChamCong[]>([]);
  const [timeChamCong, setTimeChamCong] = useState<TimeChamCong>({checkin: "",checkout: ""});
  const [formChamCong, setFormChamCong] = useState(false)
  const [dateTime, setDateTime] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date());


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="cham-cong-container">
      <div className="cham-cong-header">
        <div className="content_header">
          <h4> Quản Lý Chức Vụ </h4>
          <p> Quản lý danh mục các chức vụ trong đơn vị </p>
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
              value = {dateTime}
              onChange = {(e) => setDateTime(e.target.value)}
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
              <th>Nhân viên</th>
              <th>🕔Buổi sáng (8:00 - 12:00)</th>
              <th>🕔Buổi chiều (13:30 - 17:30)</th>
              <th>Tổng giờ</th>
            </thead>
            <tbody>
              <td>Nguyễn Văn A</td>
              <td>
                Check In: 07:55 <br />
                Check Out: 12:00
              </td>
              <td>
                Check In: 13:30 <br />
                Check Out: 17:30
              </td>
              <td>8.2h</td>
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
              onClick={() => {
                const time = currentTime.toLocaleTimeString("vi-VN", { hour12: false });

                if (!timeChamCong.checkin) {
                  // Chưa check-in → lưu check-in
                  setTimeChamCong({ checkin: time, checkout: "" });
                } else if (!timeChamCong.checkout) {
                  // Đã check-in → lưu check-out và đóng popup
                  setTimeChamCong(prev => ({ ...prev, checkout: time }));
                  setTimeout(() => {
                    setTimeChamCong({ checkin: "", checkout: "" });
                    setFormChamCong(false); // chỉ thoát khi check-out xong
                  }, 1500);
                }
                // Nếu đã check-in và check-out xong → không làm gì
              }}
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
