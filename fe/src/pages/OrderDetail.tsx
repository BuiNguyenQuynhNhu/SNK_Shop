import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  //  LOAD ORDER DETAIL
  const fetchOrder = async () => {
    try {
      const data = await api(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      console.error("Lỗi load order:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  if (!order) {
    return <h2 className="text-center mt-5">❌ Không tìm thấy đơn</h2>;
  }

  return (
    <div className="container mt-5">
      <h2>📦 Chi tiết đơn hàng</h2>

      {/* INFO */}
      <div className="card p-3 mb-3">
        <p>
          <b>Mã đơn:</b> {order.id}
        </p>

        <p>
          <b>Địa chỉ:</b> {order.address}
        </p>

        <p>
          <b>Thanh toán:</b> {order.payment}
        </p>

        <p>
          <b>Trạng thái:</b>{" "}
          <span
            className={
              order.status === "COMPLETED"
                ? "text-success"
                : order.status === "PENDING"
                  ? "text-warning"
                  : "text-secondary"
            }
          >
            {order.status}
          </span>
        </p>

        <p className="text-muted">
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* ITEMS */}
      <div className="card p-3">
        <h5>Sản phẩm:</h5>

        {order.items?.map((item: any, index: number) => (
          <div
            key={index}
            className="d-flex justify-content-between border-bottom py-2"
          >
            <span>
              {item.variant?.sneaker?.name} (Size {item.variant?.size})
            </span>

            <span>x{item.quantity}</span>

            <span>
              {(item.variant?.sneaker?.price * item.quantity).toLocaleString()}đ
            </span>
          </div>
        ))}

        <h4 className="text-danger mt-3">
          Tổng: {Number(order.total || 0).toLocaleString()}đ
        </h4>
      </div>
    </div>
  );
}

export default OrderDetail;
