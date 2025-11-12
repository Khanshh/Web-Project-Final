import { Routes, Route } from 'react-router-dom';
import TrangChu from '../pages/TrangChu';
import PhongBan from '../pages/PhongBan';
import ChucVu from '../pages/ChucVu';
import NhanVien from '../pages/NhanVien';
import ChamCong from '../pages/ChamCong';
import BaoCaoLuong from '../pages/BaoCaoLuong';
import '../css/TaiKhoan_Admin.css';
import { Link } from "react-router-dom";


interface MenuPage {
    path: string;
    label: string;
    icon: string;
}

const TaiKhoan_Admin = () => {

  const menupages: MenuPage[] = [
        {path: '/trangchu', label: 'Trang Chủ', icon: '🏠'},
        {path: '/phongban', label: 'Phòng Ban', icon: '🏢'},
        {path: '/chucvu', label: 'Chức Vụ', icon: '👔'},
        {path: '/nhanvien', label: 'Nhân Viên', icon: '👨‍💼'},
        {path: '/chamcong', label: 'Chấm Công', icon: '🕒'},
        {path: '/baocaoluong', label: 'Báo Cáo Lương', icon: '📊'},
    ];


    return (
      <div className="app-container">
        <div className="content-navigation">
            <div className="content-header">
                <h2>Hệ thống Quản lý</h2>
                <p>Nhân viên & Lương</p>

                <h4>Thông tin người đăng nhập</h4>
                <h4>ADMIN</h4>
            </div>
            <nav className="menu-page">
                <ul>
                    {menupages.map((page) => (
                        <li key={page.path}>
                            <Link to={page.path}>
                                {page.icon} {page.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<TrangChu />} />
            <Route path="/trangchu" element={<TrangChu />} />
            <Route path="/phongban" element={<PhongBan />} />
            <Route path="/chucvu" element={<ChucVu />} />
            <Route path="/nhanvien" element={<NhanVien />} />
            <Route path="/chamcong" element={<ChamCong />} />
            <Route path="/baocaoluong" element={<BaoCaoLuong />} />
          </Routes>
        </div>
      </div>
    );
}
export default TaiKhoan_Admin;