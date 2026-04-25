// SNK/src/pages/Checkout.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMockProducts, saveMockProducts, mockProducts } from "../data/mockProducts";

type CartItem = {
  variantId: number;
  size: number;
  qty: number;
  status?: "cart" | "shipping";
};

type CheckoutProps = {
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const Checkout: React.FC<CheckoutProps> = ({ setCart }) => {
  const navigate = useNavigate();

  const items = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [addresses, setAddresses] = useState<string[]>(user?.addresses || []);
  const [newAddress, setNewAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || "");

  const [shipping, setShipping] = useState("fast");
  const [payment, setPayment] = useState("cod");

  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  const addAddress = () => {
    if (!newAddress) return;
    if (addresses.includes(newAddress)) return;
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    setSelectedAddress(newAddress);
    setNewAddress("");

    // Lưu lại vào thông tin user
    if (user) {
      user.addresses = updated;
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const deleteAddress = (addrToRemove: string) => {
    const updated = addresses.filter(a => a !== addrToRemove);
    setAddresses(updated);
    if (selectedAddress === addrToRemove) setSelectedAddress(updated[0] || "");
    
    // Cập nhật vào user
    if (user) {
      user.addresses = updated;
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const shippingFee = shipping === "fast" ? 30000 : 15000;

  const total = items.reduce((sum: number, item: any) => {
    const product = mockProducts.find((p) => p.variantId === item.variantId);
    return product ? sum + product.price * item.qty : sum;
  }, 0);

  const finalTotal = total + shippingFee - discount;

  const applyVoucher = () => {
    if (!voucher) return;
    const vouchers = JSON.parse(localStorage.getItem("vouchers") || "[]");
    const v = vouchers.find((x: any) => x.code === voucher.toUpperCase());
    if (!v) {
      alert("Mã không hợp lệ hoặc đã hết hạn!");
      setDiscount(0);
      return;
    }
    
    if (v.type === "percent") {
      setDiscount((total * v.value) / 100);
    } else {
      setDiscount(v.value);
    }
    alert("✅ Áp dụng thành công!");
  };

  const handleOrder = () => {
    if (!selectedAddress) {
      alert("⚠️ Chọn địa chỉ!");
      return;
    }

    // Cập nhật trạng thái sản phẩm đã checkout sang "shipping"
    const updatedCart = cart.map((c: any) => {
      const isSelected = items.some(
        (i: any) => i.variantId === c.variantId && i.size === c.size,
      );
      return isSelected ? { ...c, status: "shipping" } : c;
    });

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart); //  cập nhật App.tsx state

    // LƯU ĐƠN HÀNG VÀO LOCALSTORAGE CHO ADMIN QUẢN LÝ
    const orderItems = items.map((item: any) => {
      const product = mockProducts.find((p) => p.variantId === item.variantId);
      return {
        variantId: item.variantId,
        size: item.size,
        qty: item.qty,
        name: product?.name || "Sản phẩm ẩn",
        price: product?.price || 0,
        imageUrl: product?.imageUrl || "",
      };
    });

    const newOrder = {
      id: Date.now().toString(),
      userEmail: user?.email || "Khách Vãng Lai",
      items: orderItems,
      subTotal: total,
      shippingFee: shippingFee,
      discount: discount,
      voucher: voucher || null,
      total: finalTotal,
      address: selectedAddress,
      payment: payment,
      date: new Date().toISOString(),
      status: "Chờ duyệt",
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]));

    // GIẢM SỐ LƯỢNG TỒN KHO
    const currentProducts = getMockProducts();
    const updatedProducts = currentProducts.map(p => {
      const orderedItems = items.filter((i: any) => i.variantId === p.variantId);
      if (orderedItems.length > 0) {
        const newStock = { ...p.stock };
        orderedItems.forEach((oi: any) => {
          if (newStock[oi.size] !== undefined) {
            newStock[oi.size] = Math.max(0, newStock[oi.size] - oi.qty);
          }
        });
        return { ...p, stock: newStock };
      }
      return p;
    });
    saveMockProducts(updatedProducts);

    localStorage.removeItem("checkoutItems");

    // Thông báo đặt hàng thành công
    alert("🎉 Đặt hàng thành công! Đơn hàng đang chờ duyệt.");

    navigate("/cart");
  };

  return (
    <div className="container mt-5">
      <h2>📦 Thanh toán</h2>

      {/*  Địa chỉ */}
      <div className="card p-3 mb-3">
        <h5>📍 Địa chỉ</h5>
        {addresses.map((addr, i) => (
          <div key={i} className="d-flex justify-content-between align-items-center mb-2 border p-2 rounded">
            <div>
              <input
                type="radio"
                className="form-check-input me-2"
                checked={selectedAddress === addr}
                onChange={() => setSelectedAddress(addr)}
              />
              {addr}
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteAddress(addr)}>❌ Xóa</button>
          </div>
        ))}

        <input
          className="form-control mt-2"
          placeholder="Thêm địa chỉ"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={addAddress}>
          ➕ Thêm
        </button>
      </div>

      {/*  Ship */}
      <div className="card p-3 mb-3">
        <h5> Vận chuyển</h5>
        <select
          className="form-control"
          value={shipping}
          onChange={(e) => setShipping(e.target.value)}
        >
          <option value="fast">Nhanh (30k)</option>
          <option value="slow">Tiết kiệm (15k)</option>
        </select>
      </div>

      {/*  Payment */}
      <div className="card p-3 mb-3">
        <h5>💳 Thanh toán</h5>
        <select
          className="form-control"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option value="cod">COD</option>
          <option value="momo">MoMo</option>
          <option value="bank">Chuyển khoản</option>
        </select>
      </div>

      {/*  Voucher */}
      <div className="card p-3 mb-3">
        <h5>🎫 Mã giảm giá</h5>
        <div className="d-flex">
          <input
            className="form-control me-2"
            value={voucher}
            onChange={(e) => setVoucher(e.target.value)}
          />
          <button className="btn btn-success" onClick={applyVoucher}>
            Áp dụng
          </button>
        </div>
      </div>

      {/*  Tổng tiền */}
      <div className="card p-3 mb-3">
        <p>Tạm tính: {total.toLocaleString()}đ</p>
        <p>Phí ship: {shippingFee.toLocaleString()}đ</p>
        <p>Giảm: -{discount.toLocaleString()}đ</p>
        <h4 className="text-danger">Tổng: {finalTotal.toLocaleString()}đ</h4>

        <button className="btn btn-success mt-2" onClick={handleOrder}>
          💳 Đặt hàng
        </button>
      </div>

      {/* Items */}
      <div className="card p-3 mb-3">
        <h5>🛍 Sản phẩm</h5>
        {items.map((item: any) => {
          const product = mockProducts.find(
            (p) => p.variantId === item.variantId,
          );
          if (!product) return null;

          return (
            <div
              key={item.variantId}
              className="d-flex justify-content-between mb-2"
            >
              <span>
                {product.name} - Size: {item.size} - SL: {item.qty}
              </span>
              <span>{(product.price * item.qty).toLocaleString()}đ</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Checkout;
