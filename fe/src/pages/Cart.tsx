// SNK/src/pages/Cart.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockProducts } from "../data/mockProducts";

type CartItem = {
  variantId: number;
  qty: number;
  size?: number;
  status?: "cart" | "shipping"; // trạng thái
};

type CartProps = {
  cart: CartItem[];
  updateCartQty: (variantId: number, size: number, qty: number) => void;
  removeFromCart: (variantId: number, size: number) => void;
};

const Cart: React.FC<CartProps> = ({ cart, updateCartQty, removeFromCart }) => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [cartState, setCartState] = useState<CartItem[]>([]);

  // đồng bộ state với props
  useEffect(() => {
    setCartState(cart);
  }, [cart]);

  // key unique (vì có size)
  const getKey = (item: CartItem) => `${item.variantId}-${item.size}`;

  // chọn 1
  const toggleSelect = (item: CartItem) => {
    const key = getKey(item);
    setSelectedItems((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key],
    );
  };

  // chọn tất cả
  const toggleSelectAll = () => {
    if (selectedItems.length === cartState.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartState.map((item) => getKey(item)));
    }
  };

  // tính tiền
  const total = cartState.reduce((sum, item) => {
    const key = getKey(item);
    if (!selectedItems.includes(key)) return sum;

    const product = mockProducts.find((p) => p.variantId === item.variantId);
    return product ? sum + product.price * item.qty : sum;
  }, 0);

  return (
    <div className="container mt-5">
      <h2>🛒 Giỏ hàng</h2>

      {cartState.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <div className="mb-3">
            <input
              type="checkbox"
              checked={selectedItems.length === cartState.length}
              onChange={toggleSelectAll}
            />{" "}
            Chọn tất cả
          </div>

          {cartState.map((item) => {
            const product = mockProducts.find(
              (p) => p.variantId === item.variantId,
            );
            if (!product) return null;

            const key = getKey(item);

            return (
              <div
                key={key}
                className="card mb-2 p-2 d-flex flex-row align-items-center"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(key)}
                  onChange={() => toggleSelect(item)}
                />

                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    margin: "0 10px",
                  }}
                />

                <div className="flex-grow-1">
                  <h5>{product.name}</h5>
                  <p>Brand: {product.brand}</p>
                  <p>Size: {item.size}</p>
                  <p>Giá: {product.price.toLocaleString()}đ</p>

                  {/* STATUS */}
                  <p>
                    Trạng thái:{" "}
                    {item.status === "shipping" ? (
                      <span className="badge bg-warning">Đang giao hàng</span>
                    ) : (
                      <span className="badge bg-secondary"> Trong giỏ</span>
                    )}
                  </p>

                  {/* Số lượng */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        updateCartQty(item.variantId, item.size!, item.qty - 1)
                      }
                      disabled={item.qty <= 1 || item.status === "shipping"}
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        updateCartQty(item.variantId, item.size!, item.qty + 1)
                      }
                      disabled={item.status === "shipping"}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(item.variantId, item.size!)}
                  disabled={item.status === "shipping"}
                >
                  Xóa
                </button>
              </div>
            );
          })}

          {/* TOTAL */}
          <div className="mt-3">
            <h4>Tổng: {total.toLocaleString()}đ</h4>

            <button
              className="btn btn-success"
              disabled={selectedItems.length === 0}
              onClick={() => {
                const selected = cartState.filter((item) =>
                  selectedItems.includes(getKey(item)),
                );

                localStorage.setItem("checkoutItems", JSON.stringify(selected));

                navigate("/checkout");
              }}
            >
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
