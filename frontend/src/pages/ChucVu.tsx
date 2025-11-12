import React, {useEffect, useState} from "react";
import "../css/ChucVu.css";
import axios from "axios";

interface ChucVu {
  ma_chuc_vu: string;
  ten_chuc_vu: string;
}

const ListChucVu: React.FC = () => {
  const [chucVu, setChucVu] = useState<ChucVu[]>([]);
  const [showForm, setshowForm] = useState(false);
  const [maCV, setmaCV] = useState("");
  const [tenCV, settenCV] = useState("");
  const [formUpdate, setformUpdate] = useState(false);
  const [maCVCU, setmaCVCU] = useState("");
  const [maCVMoi, setmaCVMoi] = useState("");
  const [tenCVMoi, settenCVMoi] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get<ChucVu[]>("http://localhost:5000/api/chucvu")
      .then((res) => setChucVu(res.data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  };

  const handleAddChucVu = async() => {
    if (!maCV || !tenCV) {
      alert("Bạn chưa điền đủ thông tin.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/chucvu",
        {
          ma_chuc_vu: maCV,
          ten_chuc_vu: tenCV
        });
      fetchData();
      setmaCV("");
      settenCV("");
      setshowForm(false);
    } catch (error) {
      alert("Thêm chức vụ thất bại.")
    }
  };

  const handleDeleteChucVu = async(ma_chuc_vu: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/chucvu/${ma_chuc_vu}`);
      fetchData();
      alert("Bạn chắc chấn muốn xóa chức vụ này?")
    } 
    catch (error) {
      alert("Xóa chức vụ thất bại.");
    }
  };

  const handleUpdateChucVu = async(ma_chuc_vu: string) => {
    if (!maCVMoi || !tenCVMoi) {
      alert("Bạn chưa điền đủ thông tin.");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/chucvu/${ma_chuc_vu}`, {
        ma_chuc_vu_moi: maCVMoi,
        ten_chuc_vu_moi: tenCVMoi
      });
      fetchData();
      setmaCVMoi("");
      settenCVMoi("");
      setformUpdate(false);
      alert("Bạn chắc chắn muốn cập nhật chức vụ này?");
    } catch (error) {
      alert("Cập nhật chức vụ thất bại.");
    }
  };

  return (
    <div className="content">
      <div className="content_title">
        <div className="content_title_1">
          <h4> Quản Lý Chức Vụ </h4>
          <p> Quản lý danh mục các chức vụ trong đơn vị </p>
        </div>
        <div className="content_title_cv">
          <button onClick={() => setshowForm(true)}>+ Thêm chức vụ</button>
        </div>
      </div>

      <div className="content_main">
        <div className="content_main_table">
          <table>
            <thead>
              <tr>
                <th>Mã chức vụ</th>
                <th>Tên chức vụ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {chucVu.map((item) => (
                <tr key={item.ma_chuc_vu}>
                  <td>{item.ma_chuc_vu}</td>
                  <td>{item.ten_chuc_vu}</td>
                  <td>
                    <div className="buttons_group">
                      <button className="button_edit" onClick={() => {setformUpdate(true); setmaCVCU(item.ma_chuc_vu)}}> 🖋️ </button>
                      <button className="button_delete" onClick={() => handleDeleteChucVu(item.ma_chuc_vu)}> 🗑️ </button>
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
              <h4>Thêm Chức Vụ Mới</h4>
              <p>Nhập thông tin chức vụ mới</p>
            </div>
            <div className="form_input">
              <label>Mã chức vụ:</label>
              <input
                type="text"
                value={maCV}
                onChange={(e) => setmaCV(e.target.value)}
              />
            </div>
            <div className="form_input">
              <label>Tên chức vụ:</label>
              <input
                type="text"
                value={tenCV}
                onChange={(e) => settenCV(e.target.value)}
              />
            </div>
            <div className="form_buttons">
              <div className="button_add">
                <button onClick={handleAddChucVu}> Thêm mới </button>
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
              <h4>Cập Nhật Chức Vụ</h4>
              <p>Cập nhật thông tin chức vụ</p>
            </div>
            <div className="form_input">
              <label>Mã chức vụ mới:</label>
              <input
                type="text"
                value={maCVMoi}
                onChange={(e) => setmaCVMoi(e.target.value)}
              />
            </div>
            <div className="form_input">
              <label>Tên chức vụ mới:</label>
              <input
                type="text"
                value={tenCVMoi}
                onChange={(e) => settenCVMoi(e.target.value)}
              />
            </div>
            <div className="form_buttons">
              <div className="button_add">
                <button onClick={() =>handleUpdateChucVu(maCVCU)}> Cập nhật </button>
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

export default ListChucVu;
