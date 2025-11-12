import React,{useEffect, useState} from "react";
import '../css/PhongBan.css';
import axios from "axios";


interface PhongBan {
  ma_phong: string;
  ten_phong: string;
  nam_thanh_lap: string;
  trang_thai: string;
}

const ListPhongBan: React.FC = () => {
  const [phongBan, setPhongBan] = useState<PhongBan[]>([]);
  const [showForm, setshowForm] = useState(false);
  const [maPB, setmaPB] = useState("");
  const [tenPB, settenPB] = useState("");
  const [namThanhLap, setnamThanhLap] = useState("");
  const [trangThai, settrangThai] = useState("");
  const [formUpdate, setformUpdate] = useState(false);
  const [maPBCu, setmaPBCu] = useState("");
  const [maPBMoi, setmaPBMoi] = useState("");
  const [tenPBMoi, settenPBMoi] = useState("");
  const [namThanhLapMoi, setnamThanhLapMoi] = useState("");
  const [trangThaiMoi, settrangThaiMoi] = useState("");
  const [searchBox, setSearchBox] = useState("");



  useEffect(() => {
      fetchData();
    }, []);

  const fetchData = () => {
    axios
      .get<PhongBan[]>("http://localhost:5000/api/phongban")
      .then((res) => setPhongBan(res.data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  };

  const handleAddPhongBan = async() => {
    if (!maPB || !tenPB || !namThanhLap || !trangThai) {
      alert("Bạn chưa điền đủ thông tin.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/phongban",
        {
          ma_phong: maPB,
          ten_phong:tenPB,
          nam_thanh_lap:namThanhLap,
          trang_thai:trangThai
        });
      fetchData();
      setmaPB("");
      settenPB("");
      setnamThanhLap("");
      settrangThai("");
      setshowForm(false);
    }catch (error) {
      alert("Thêm phòng ban thất bại.")
    }
  }

  const handleDeletePhongBan = async(ma_phong: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/phongban/${ma_phong}`);
      fetchData();
      alert("Bạn có muốn chắc chắn xóa phong này?")
    }catch (error) {
      alert("Xóa phòng thất bại.")
    }
  }

  const handleUpdatePhongBan = async(ma_phong: string) => {
    if(!maPBMoi || !tenPBMoi || !namThanhLapMoi || !trangThaiMoi) {
      alert("Bạn chưa điền đủ thông tin.")
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/phongban/${ma_phong}`, {
        ma_phong_ban_moi: maPBMoi,
        ten_phong_ban_moi: tenPBMoi,
        nam_thanh_lap_moi: namThanhLapMoi,
        trang_thai_moi: trangThaiMoi
      })
      fetchData();
      setmaPBMoi("")
      settenPBMoi("")
      setnamThanhLapMoi("")
      settrangThaiMoi("")
      setformUpdate(false)
      alert("Bạn chắc chắn muốn cập nhật phòng này?")
    } catch (error) {
        alert("Cập nhập thành công.")
    }
  }

  const handleSearch = phongBan.filter((pb) => {
    return  pb.ten_phong.toLowerCase().includes(searchBox.toLowerCase()) ||
            pb.ma_phong.toLowerCase().includes(searchBox.toLowerCase()) ||
            pb.nam_thanh_lap.toString().toLowerCase().includes(searchBox.toLowerCase()) ||
            pb.trang_thai.toLowerCase().includes(searchBox.toLowerCase());
  })

  return (
    <div className="content">
      <div className="content_title">
        <div className="content_title_1">
          <h4> Quản lý Phòng ban</h4>
          <p> Quản lý thông tin các phòng ban trong đơn vị </p>
        </div>
        <div className="searchbox_pb">
          <input type="text"
                  placeholder="Tìm mã hoặc tên phòng ..."
                  value={searchBox}
                  onChange={(e) => setSearchBox(e.target.value)}
          />
        </div>
        <div className="content_title_pb">
          <button onClick={() => setshowForm(true)}>+ Thêm phòng ban</button>
        </div>
      </div>

      <div className="content_main">
        <div className="content_main_table">
          <table>
            <thead>
              <tr>
                <th>Mã phòng</th>
                <th>Tên phòng</th>
                <th>Năm thành lập</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {handleSearch.map((item) => (
                <tr key={item.ma_phong}>
                  <td>{item.ma_phong}</td>
                  <td>{item.ten_phong}</td>
                  <td>{item.nam_thanh_lap}</td>
                  <td>{item.trang_thai}</td>
                  <td>
                    <div className="buttons_group">
                      <button className="button_edit" onClick={() => {setformUpdate(true); setmaPBCu(item.ma_phong)}}> 🖋️ </button>
                      <button className="button_delete" onClick={() => handleDeletePhongBan(item.ma_phong)}> 🗑️ </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



      {showForm && (
        <div className="form_overlay" onClick={() => setshowForm(false)}>
          <div className="form_container" onClick={(e) => e.stopPropagation()}>
            <div>
              <h4>Thêm phòng ban mới</h4>
              <p>Nhập thông tin phòng ban mới</p>
            </div>
            <div className="form_input">
              <label>Mã phòng (3 ký tự):</label>
              <input
                type="text"
                value={maPB}
                onChange={(e) => setmaPB(e.target.value)}
              />
            </div>
            <div className="form_input">
              <label>Tên phòng:</label>
              <input
                type="text"
                value={tenPB}
                onChange={(e) => settenPB(e.target.value)}
              />
            </div>
            <div className="form_input">
              <label>Năm thành lập:</label>
              <input
                type="number"
                value={namThanhLap}
                onChange={(e) => setnamThanhLap(e.target.value)}
              />
            </div>
            <div className="form_input">
              <label>Trạng thái:</label>
              <select
                value={trangThai}
                onChange={(e) => settrangThai(e.target.value)}
                > 
                  <option value="">--- Chọn ---</option>
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Ngừng hoạt động">Ngừng hoạt động</option>
              </select>
            </div>
            <div className="form_buttons">
              <div className="button_add">
                <button onClick={handleAddPhongBan}> Thêm mới </button>
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
              <h4>Sửa phòng ban</h4>
              <p>Cập nhật thông tin phòng ban</p>
            </div>
            <div className="form_input">
              <label>Mã phòng:</label>
              <input
                type="text"
                value={maPBMoi}
                onChange={(e) => setmaPBMoi(e.target.value)}
              />
            </div>
            <div className="form_input">
              <label>Tên phòng:</label>
              <input
                type="text"
                value={tenPBMoi}
                onChange={(e) => settenPBMoi(e.target.value)}
              />
            </div>
            <div className="form_input">
              <label>Năm thành lập:</label>
              <input
                type="text"
                value={namThanhLapMoi}
                onChange={(e) => setnamThanhLapMoi(e.target.value)}
              />
            </div>
            <div className="form_input">
              <label>Trạng thái:</label>
              <select
                value={trangThai}
                onChange={(e) => settrangThai(e.target.value)}
                >
                  <option value="">--- Chọn ---</option>
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Ngừng hoạt động">Ngừng hoạt động</option>
              </select>
            </div>
            <div className="form_buttons">
              <div className="button_add">
                <button onClick={() =>handleUpdatePhongBan(maPBCu)}> Cập nhật </button>
              </div>
              <div className="button_cancel">
                <button onClick={() => setformUpdate(false)}> Hủy </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>  
  );
};

export default ListPhongBan;
