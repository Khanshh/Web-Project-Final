import React from "react";
import '../css/TrangChu.css';
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

 function TrangChu() {
    const DashboardChart = () => {
      const chartRef = useRef<HTMLCanvasElement>(null);
      const chartInstanceRef = useRef<Chart | null>(null);

      useEffect(() => {
        if (!chartRef.current) return;

        if (chartInstanceRef.current) chartInstanceRef.current.destroy();

        chartInstanceRef.current = new Chart(chartRef.current, {
          type: "bar",
          data: {
            labels: ["Trưởng phòng", "Phó phòng", "Nhân viên"],
            datasets: [
              {
                label: "Số lượng",
                data: [2, 3, 1],
                backgroundColor: ["#4f8beb", "#0350f5", "#72c2ff"],
                borderColor: ["#4f8beb", "#0350f5", "#72c2ff"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1 } },
            },
            plugins: { legend: { display: false } },
          },
        });
      }, []);

      return (
        <div style={{ height: "300px", width: "100%" }}>
          <canvas ref={chartRef} />
        </div>
      );
    };
  return (
    <>
      <div className="hero">
        <div className="hero-left">
          <div className="hero-icon">👑</div>
          <div>
            <h2>Chào mừng, Administrator!</h2>
            <p>Quản trị viên hệ thống • Dashboard tổng quan</p>
          </div>
        </div>
        <div className="hero-right">
          <div className="admin-pill">👤 Admin</div>
        </div>
      </div>

      <div className="content">
        <div className="grid">
          <section className="card stat">
            <div className="stat-title">Nhân viên</div>
            <div className="stat-value">0</div>
            <div className="stat-sub">
              0 tổng
              <br />
              0 đã ẩn
            </div>
          </section>

          <section className="card stat">
            <div className="stat-title">Chấm công tháng này</div>
            <div className="stat-value">0</div>
            <div className="stat-sub">0 tổng • 0.0% của tổng</div>
          </section>

          <section className="card wide">
            <h3>Phân bố theo Phòng ban</h3>
            <div className="placeholder">Chưa có dữ liệu phòng ban</div>
          </section>

          <section className="card wide">
            <h3>Phân bố theo Chức vụ</h3>
            <DashboardChart />
          </section>

          <section className="card">
            <h3>Ranking KPI Nhân viên</h3>
            <div className="placeholder">Chưa có dữ liệu chấm công tháng trước</div>
          </section>

          <section className="card">
            <h3>Tình trạng hệ thống</h3>
            <div className="progress-row">
              <div className="label">
                Phòng ban <span className="num">0</span>
              </div>
              <div className="progress">
                <div style={{ width: "0%" }}></div>
              </div>

              <div className="label">
                Chức vụ <span className="num">3</span>
              </div>
              <div className="progress">
                <div style={{ width: "30%" }}></div>
              </div>

              <div className="label">
                Nhân viên hoạt động <span className="num green">0/0</span>
              </div>
              <div className="progress">
                <div style={{ width: "0%" }}></div>
              </div>

              <div className="label">
                Bản ghi chấm công <span className="num">0</span>
              </div>
              <div className="progress">
                <div style={{ width: "0%" }}></div>
              </div>

              <button className="export">⬇ Xuất báo cáo hệ thống</button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
export default TrangChu;