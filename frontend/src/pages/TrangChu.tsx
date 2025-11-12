import React, { useEffect, useState } from "react";
import axios from "axios";

// 🧩 Định nghĩa kiểu dữ liệu của nhân viên
interface NhanVien {
  ma_nv: string;
  ten_nv: string;
  ma_phong: string;
  ma_chuc_vu: string;
  muc_luong_cb: number;
}

const NhanVienList: React.FC = () => {
  // 🧠 Khai báo state có kiểu cụ thể
  const [nhanVien, setNhanVien] = useState<NhanVien[]>([]);

  // 🪄 Lấy dữ liệu từ API khi component mount
  useEffect(() => {
    axios
      .get<NhanVien[]>("http://localhost:5000/api/nhanvien")
      .then((res) => setNhanVien(res.data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  }, []);

  return (
    <div>
      <h2>Danh sách nhân viên</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Mã NV</th>
            <th>Tên NV</th>
            <th>Phòng</th>
            <th>Chức vụ</th>
            <th>Lương cơ bản</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </table>
    </div>
  );
};

export default NhanVienList;

