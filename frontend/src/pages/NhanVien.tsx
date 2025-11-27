import {useEffect, useState} from "react";
import '../css/NhanVien.css';
import axios from "axios";


interface NhanVien {
  ma_nhan_vien: string;
  ho_ten: string;
  ma_phong: string;
  ma_chuc_vu: string;
  muc_luong_co_ban: string;
} 

interface ChucVu {
  ma_chuc_vu: string;
  ten_chuc_vu: string;
}

interface PhongBan {
  ma_phong: string;
  ten_phong: string;
}

const ListNhanVien = () => {
  const [nhamVien, setNhanVien] = useState<NhanVien[]>([]);
  const [showForm, setshowForm] = useState(false);
  const [maNV, setmaNV] = useState("");
  const [hoTen, sethoTen] = useState("");
  const [maPhong, setmaPhong] = useState("");
  const [maChucVu, setmaChucVu] = useState("");
  const [mucLuongCoBan, setmucLuongCoBan] = useState("");
  const [formUpdate, setformUpdate] = useState(false);
  const [maNVCu, setmaNVCu] = useState("");
  const [maNVMoi, setmaNVMoi] = useState("");
  const [hoTenMoi, sethoTenMoi] = useState("");
  const [maPhongMoi, setmaPhongMoi] = useState("");
  const [maChucVuMoi, setmaChucVuMoi] = useState("");
  const [mucLuongCoBanMoi, setmucLuongCoBanMoi] = useState("");
  const [searchBox, setSearchBox] = useState("");

  const [showTable, setShowTable] = useState(true);
  const [phongBan, setPhongBan] = useState<PhongBan[]>([]);
  const [chucVu, setChucVu] = useState<ChucVu[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get<NhanVien[]>("http://localhost:5000/api/nhanvien")
      .then((res) => setNhanVien(res.data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));

    axios
      .get<PhongBan[]>("http://localhost:5000/api/phongban")
      .then((res) => setPhongBan(res.data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
      
    axios
      .get<ChucVu[]>("http://localhost:5000/api/chucvu")
      .then((res) => setChucVu(res.data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));  
  } 

  const handleAddNhanVien = async() => {
    console.log({ maNV, hoTen, maPhong, maChucVu, mucLuongCoBan });
    if (!hoTen || !maPhong || !maChucVu || !mucLuongCoBan) {
      alert("Bạn chưa điền đủ thông tin.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/nhanvien",
        {
          ho_ten: hoTen,
          ma_phong: maPhong,
          ma_chuc_vu: maChucVu,
          muc_luong_co_ban: mucLuongCoBan
        });
      fetchData();
      setmaNV("");
      sethoTen("");
      setmaPhong("");
      setmaChucVu("");
      setmucLuongCoBan("");
      setshowForm(false);
    } catch (error) {
      alert("Thêm nhân viên thất bại.")
    }
  };

  const handleDeleteNhanVien = async(ma_nhan_vien: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/nhanvien/${ma_nhan_vien}`);
      fetchData();
      alert("Bạn chắc chắn muốn xóa nhân viên này?");
    } catch (error) {
      alert("Xóa nhân viên thất bại.");
    }
  }

  const handleUpdateNhanVien = async(ma_nhan_vien: string) => {
    if (!maNVMoi || !hoTenMoi || !maPhongMoi || !maChucVuMoi || !mucLuongCoBanMoi) {
      alert("Bạn chưa điền đủ thông tin.");
      return;
    }try {
      await axios.put(`http://localhost:5000/api/nhanvien/${ma_nhan_vien}`, {
        ho_ten_moi: hoTenMoi,
        ma_phong_moi: maPhongMoi,
        ma_chuc_vu_moi: maChucVuMoi,
        muc_luong_co_ban_moi: mucLuongCoBanMoi
      });
      fetchData();
      setmaNVMoi("")
      sethoTenMoi("");
      setmaPhongMoi("");
      setmaChucVuMoi("");
      setmucLuongCoBanMoi("");
      setformUpdate(false);
      alert("Bạn chắc chắn muốn cập nhật nhân viên này?");
    } catch (error) {
      alert("Cập nhật nhân viên thất bại.");
    }
  }

  const handleSearch = nhamVien.filter((nv) => {
    return  nv.ho_ten.toLowerCase().includes(searchBox.toLowerCase()) || 
            nv.ma_nhan_vien.toLowerCase().includes(searchBox.toLowerCase()) ||
            nv.ma_phong.toLowerCase().includes(searchBox.toLowerCase()) ||
            nv.ma_chuc_vu.toLowerCase().includes(searchBox.toLowerCase()) ||
            nv.muc_luong_co_ban.toString().toLowerCase().includes(searchBox.toLowerCase());
  });

  const openUpdateForm = (nv: NhanVien) => {
    setmaNVCu(nv.ma_nhan_vien);
    sethoTenMoi(nv.ho_ten);
    setmaPhongMoi(nv.ma_phong);
    setmaChucVuMoi(nv.ma_chuc_vu);
    setmucLuongCoBanMoi(nv.muc_luong_co_ban);
    setformUpdate(true);
  };

  return (
    <div className="content">
      <div className="content_title nhanvien-layout">
        <div className="content_title_1">
          <h4> Quản lý Nhân viên</h4>
          <p>Quản lý thông tin chi tiết nhân viên và mức lương </p>
        </div>
        <div className="searchbox_nv">
          <input type="text"
                  placeholder="Tìm mã, tên, phòng ..."
                  value={searchBox}
                  onChange={(e) => setSearchBox(e.target.value)}
          />
        </div>
        <div className="showtable">
          <button onClick={() => setShowTable(!showTable)}>{showTable ? "Ẩn nhân viên" : "Hiển thị nhân viên"}</button>
        </div>
        <div className="content_title_nv">
          <button onClick={() => setshowForm(true)}>+ Thêm nhân viên</button>
        </div>
      </div>

      {showTable && (
        <div className="content_main">
          <div className="content_main_table">
            <table>
              <thead>
                <tr>
                  <th>Mã NV</th>
                  <th>Tên nhân viên</th>
                  <th>Phòng ban</th>
                  <th>Chức vụ</th>
                  <th>Lương cơ bản</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {handleSearch.map((item) => (
                  <tr key={item.ma_nhan_vien}>
                    <td>{item.ma_nhan_vien}</td>
                    <td>{item.ho_ten}</td>
                    <td>{item.ma_phong}</td>
                    <td>{item.ma_chuc_vu}</td>
                    <td>{item.muc_luong_co_ban} đ</td>
                    <td>Hoạt động</td>
                    <td>
                      <div className="buttons_group">
                        <button className="button_edit" onClick={() => openUpdateForm(item)}> 🖋️ </button>
                        <button className="button_delete" onClick={() => handleDeleteNhanVien(item.ma_nhan_vien)}> 🗑️ </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}        


      {showForm && (
        <div className="form_overlay" onClick={() => setshowForm(false)}>
          <div className="form_container" onClick={(e) => e.stopPropagation()}>
            <div>
              <h4>Thêm nhân viên mới</h4>
              <p>Nhập thông tin nhân viên mới</p>
            </div>
            <div className="form_input">
              <label>Tên nhân viên</label>
              <input
                type="text"
                value={hoTen}
                onChange={(e) => sethoTen(e.target.value)}
              />
            </div>
            <div className="form_input">
              <label>Phòng ban</label>
              <select 
                value={maPhong}
                onChange={(e) => setmaPhong(e.target.value)}
                >
                  <option value="">--- Chọn ---</option>
                  {phongBan.map((pb) => (
                    <option key={pb.ma_phong} value={pb.ma_phong}>
                      {pb.ten_phong} ({pb.ma_phong})
                    </option>
                  ))}
              </select>
            </div>
            <div className="form_input">
              <label>Chức vụ</label>
              <select 
                value={maChucVu}
                onChange={(e) => setmaChucVu(e.target.value)}
                >
                  <option value="">--- Chọn ---</option>
                  {chucVu.map((cv) => (
                    <option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>
                      {cv.ten_chuc_vu} ({cv.ma_chuc_vu})
                    </option>
                  ))}
              </select>
            </div>
            <div className="form_input">
              <label>Lương cơ bản (VNĐ/tháng)</label>
              <input 
                type="number"
                value={mucLuongCoBan} 
                onChange={(e) => setmucLuongCoBan(e.target.value)} 
                />
            </div>
            <div className="form_buttons_nv">
              <div className="button_add">
                <button onClick={handleAddNhanVien}> Thêm mới </button>
              </div>
              <div className="button_cancel">
                <button onClick={() => setshowForm(false)}> Hủy </button>
              </div>
            </div>  
          </div>
        </div>
      )}

      {formUpdate && (
        <div className="form_overlay" onClick={() => setformUpdate(false)}>
          <div className="form_container" onClick={(e) => e.stopPropagation()}>
            <div>
              <h4>Sửa nhân viên</h4>
              <p>Cập nhật thông tin nhân viên</p>
            </div>
            <div className="form_input">
              <label>Tên nhân viên</label>
              <input
                type="text"
                value={hoTenMoi}
                onChange={(e) => sethoTenMoi(e.target.value)}
              />
            </div>
            <div className="form_input">
              <label>Phòng ban</label>
              <select 
                value={maPhongMoi}
                onChange={(e) => setmaPhongMoi(e.target.value)}
                >
                  <option value="">--- Chọn ---</option>
                  {phongBan.map((pb) => (
                    <option key={pb.ma_phong} value={pb.ma_phong}>
                      {pb.ten_phong} ({pb.ma_phong})
                    </option>
                  ))}
              </select>
            </div>
            <div className="form_input">
              <label>Chức vụ</label>
              <select 
                value={maChucVuMoi}
                onChange={(e) => setmaChucVuMoi(e.target.value)}
                >
                  <option value="">--- Chọn ---</option>
                  {chucVu.map((cv) => (
                    <option key={cv.ma_chuc_vu} value={cv.ma_chuc_vu}>
                      {cv.ten_chuc_vu} ({cv.ma_chuc_vu})
                    </option>
                  ))}
              </select>
            </div>
            <div className="form_input">
              <label>Lương cơ bản (VNĐ/tháng)</label>
              <input 
                type="number"
                value={mucLuongCoBanMoi} 
                onChange={(e) => setmucLuongCoBanMoi(e.target.value)} 
                />
            </div>
            <div className="form_buttons_nv">
              <div className="button_add">
                <button onClick={() =>handleUpdateNhanVien(maNVCu)}> Cập nhật </button>
              </div>
              <div className="button_cancel">
                <button onClick={() => setformUpdate(false)}> Hủy </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )

}
export default ListNhanVien;