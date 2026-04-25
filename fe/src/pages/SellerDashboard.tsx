// SNK/src/pages/SellerDashboard.tsx
import React, { useState, useEffect } from "react";

type Order = {
  id: number;
  customer: string;
  productName: string;
  variantId: number;
  size: number;
  qty: number;
  total: number;
  status: "pending" | "shipping" | "delivered" | "cancelled";
};

const SellerDashboard: React.FC = () => {
  // ===== Orders từ localStorage =====
  const [orders, setOrders] = useState<Order[]>(() => {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  });

  // Sync localStorage
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // ===== THÊM / SỬA trạng thái =====
  const updateStatus = (id: number, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // ===== XÓA đơn =====
  const handleDelete = (id: number) => {
    if (!window.confirm("Xóa đơn này?")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // ===== THỐNG KÊ =====
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="container mt-5">
      <h2>🛠 Quản lý đơn hàng (ADMIN)</h2>
      <p>Tổng đơn: {totalOrders}</p>
      <p>Tổng doanh thu: {totalRevenue.toLocaleString()}đ</p>

      <div className="table-responsive mt-4">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Size</th>
              <th>Số lượng</th>
              <th>Tổng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.productName}</td>
                <td>{o.size}</td>
                <td>{o.qty}</td>
                <td>{o.total.toLocaleString()}đ</td>
                <td>
                  <select
                    className="form-select"
                    value={o.status}
                    onChange={(e) =>
                      updateStatus(o.id, e.target.value as Order["status"])
                    }
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="shipping">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Hủy</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(o.id)}
                  >
                    ❌ Xóa
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center">
                  Chưa có đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerDashboard;
