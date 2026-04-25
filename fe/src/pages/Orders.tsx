import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";

function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // LOAD ORDERS FROM API
  const fetchOrders = async () => {
    try {
      const data = await api("/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi load orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  return (
    <div className="container mt-5">
      <h2>📦 Đơn hàng của tôi</h2>

      {orders.length === 0 ? (
        <p>Chưa có đơn</p>
      ) : (
        orders.map((o: any) => (
          <Link
            key={o.id}
            to={`/order/${o.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="card p-3 mb-3 shadow-sm">
              <p>
                <b>Mã đơn:</b> {o.id}
              </p>

              <p>
                <b>Trạng thái:</b>{" "}
                <span
                  className={
                    o.status === "COMPLETED"
                      ? "text-success"
                      : o.status === "PENDING"
                        ? "text-warning"
                        : "text-secondary"
                  }
                >
                  {o.status}
                </span>
              </p>

              <p>
                <b>Tổng:</b> {Number(o.total || 0).toLocaleString()}đ
              </p>

              <p className="text-muted" style={{ fontSize: 12 }}>
                {new Date(o.createdAt).toLocaleString()}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default Orders;
