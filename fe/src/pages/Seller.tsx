import React, { useState, useEffect } from "react";
import { getMockProducts, saveMockProducts, ProductType } from "../data/mockProducts";

type PosItem = {
  variantId: number;
  name: string;
  size: number;
  price: number;
  qty: number;
};

export default function Seller() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<PosItem[]>([]);
  
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Modal / Chọn size
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    setProducts(getMockProducts());
  }, []);

  const handleSelectProduct = (p: ProductType) => {
    // Chỉ lấy những size còn hàng
    const availableSizes = p.sizes.filter(s => p.stock[s] > 0);
    if (availableSizes.length === 0) {
      alert("Sản phẩm này đã hết hàng tất cả các size!");
      return;
    }
    setSelectedProduct(p);
  };

  const handleAddToCart = (size: number) => {
    if (!selectedProduct) return;
    
    // Check stock
    const currentStock = selectedProduct.stock[size];
    const existingItem = cart.find(i => i.variantId === selectedProduct.variantId && i.size === size);
    if (existingItem && existingItem.qty >= currentStock) {
      alert(`Size ${size} chỉ còn ${currentStock} sản phẩm trong kho!`);
      return;
    }

    if (existingItem) {
      setCart(cart.map(i => i === existingItem ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, {
        variantId: selectedProduct.variantId,
        name: selectedProduct.name,
        size: size,
        price: selectedProduct.price,
        qty: 1
      }]);
    }
    setSelectedProduct(null); // Đóng modal
  };

  const updateQty = (item: PosItem, delta: number) => {
    const newQty = item.qty + delta;
    if (newQty <= 0) {
      setCart(cart.filter(i => i !== item));
      return;
    }
    // Check stock limits
    const product = products.find(p => p.variantId === item.variantId);
    if (product && newQty > product.stock[item.size]) {
      alert(`Không thể thêm, size ${item.size} chỉ còn ${product.stock[item.size]} sản phẩm!`);
      return;
    }
    setCart(cart.map(i => i === item ? { ...i, qty: newQty } : i));
  };

  const applyVoucher = () => {
    if (!voucherCode) return;
    const vouchers = JSON.parse(localStorage.getItem("vouchers") || "[]");
    const v = vouchers.find((x: any) => x.code === voucherCode.toUpperCase());
    if (!v) {
      alert("Mã không hợp lệ hoặc đã hết hạn!");
      setDiscount(0);
      return;
    }
    
    const sub = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (v.type === "percent") {
      setDiscount((sub * v.value) / 100);
    } else {
      setDiscount(v.value);
    }
    alert("✅ Đã áp dụng mã giảm giá!");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Giỏ hàng trống!");
    
    // 1. Giảm tồn kho
    let updatedProducts = [...products];
    cart.forEach(item => {
      const pIndex = updatedProducts.findIndex(p => p.variantId === item.variantId);
      if (pIndex !== -1) {
        const newP = { ...updatedProducts[pIndex] };
        newP.stock = { ...newP.stock };
        newP.stock[item.size] = Math.max(0, newP.stock[item.size] - item.qty);
        updatedProducts[pIndex] = newP;
      }
    });
    setProducts(updatedProducts);
    saveMockProducts(updatedProducts);

    // 2. Lưu đơn hàng
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const finalTotal = Math.max(0, subTotal - discount);

    const newOrder = {
      id: Date.now().toString(),
      userEmail: user?.email || "Nhân viên quầy",
      items: cart.map(i => {
        const p = updatedProducts.find(x => x.variantId === i.variantId);
        return {
          variantId: i.variantId,
          size: i.size,
          qty: i.qty,
          name: i.name,
          price: i.price,
          imageUrl: p?.imageUrl || ""
        };
      }),
      subTotal,
      shippingFee: 0,
      discount,
      voucher: voucherCode || null,
      total: finalTotal,
      address: "Mua trực tiếp tại cửa hàng",
      payment: "Tiền mặt / Quẹt thẻ",
      date: new Date().toISOString(),
      status: "Hoàn thành", // Giao ngay tại quầy
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]));

    // 3. Reset
    alert("🎉 Thanh toán thành công! Đã lưu hóa đơn.");
    setCart([]);
    setDiscount(0);
    setVoucherCode("");
  };

  const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const finalTotal = Math.max(0, subTotal - discount);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container-fluid mt-4 mb-5 px-4">
      <h2 className="mb-4 text-primary">💻 Hệ thống POS (Bán hàng tại quầy)</h2>
      
      <div className="row">
        {/* CỘT TRÁI: SẢN PHẨM */}
        <div className="col-md-8">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Danh mục sản phẩm</h5>
              <input 
                type="text" 
                className="form-control form-control-sm w-50" 
                placeholder="🔍 Tìm kiếm sản phẩm..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="card-body bg-light" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              <div className="row g-3">
                {filteredProducts.map(p => {
                  const totalStock = Object.values(p.stock).reduce((a,b)=>a+b,0);
                  return (
                    <div key={p.id} className="col-md-4 col-sm-6">
                      <div 
                        className={`card h-100 border-0 shadow-sm ${totalStock === 0 ? 'opacity-50' : 'cursor-pointer'}`}
                        style={{ cursor: totalStock > 0 ? 'pointer' : 'not-allowed' }}
                        onClick={() => totalStock > 0 && handleSelectProduct(p)}
                      >
                        <img src={p.imageUrl} alt={p.name} className="card-img-top" style={{ height: "150px", objectFit: "cover" }} />
                        <div className="card-body p-2 text-center">
                          <h6 className="card-title text-truncate mb-1">{p.name}</h6>
                          <p className="text-danger fw-bold mb-1">{p.price.toLocaleString()}đ</p>
                          <small className="text-muted">Kho: {totalStock}</small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: GIỎ HÀNG POS */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100 d-flex flex-column">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">🧾 Hóa đơn hiện tại</h5>
            </div>
            <div className="card-body p-0 flex-grow-1" style={{ overflowY: "auto", maxHeight: "40vh" }}>
              {cart.length === 0 ? (
                <div className="text-center text-muted p-5">Chưa có sản phẩm nào</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {cart.map((item, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <div className="w-50">
                        <h6 className="mb-0 text-truncate" style={{ fontSize: '0.9rem' }}>{item.name}</h6>
                        <small className="text-muted">Size: {item.size} - {item.price.toLocaleString()}đ</small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-sm btn-outline-secondary px-2 py-0" onClick={() => updateQty(item, -1)}>-</button>
                        <span className="fw-bold">{item.qty}</span>
                        <button className="btn btn-sm btn-outline-secondary px-2 py-0" onClick={() => updateQty(item, 1)}>+</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="card-footer bg-white border-top-0 pt-3">
              <div className="d-flex mb-3 gap-2">
                <input type="text" className="form-control form-control-sm" placeholder="Mã giảm giá (VD: TET2026)" value={voucherCode} onChange={e => setVoucherCode(e.target.value)} />
                <button className="btn btn-sm btn-outline-success" onClick={applyVoucher}>Áp dụng</button>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Tạm tính:</span>
                <span>{subTotal.toLocaleString()}đ</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Giảm giá:</span>
                <span className="text-success">-{discount.toLocaleString()}đ</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between mb-3 align-items-center">
                <h5 className="mb-0">Thực thu:</h5>
                <h4 className="mb-0 text-danger fw-bold">{finalTotal.toLocaleString()}đ</h4>
              </div>
              <button className="btn btn-primary w-100 py-2 fs-5 fw-bold" onClick={handleCheckout}>💰 THANH TOÁN</button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CHỌN SIZE */}
      {selectedProduct && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chọn Size - {selectedProduct.name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedProduct(null)}></button>
              </div>
              <div className="modal-body text-center">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
                <p className="text-danger fw-bold">{selectedProduct.price.toLocaleString()}đ</p>
                <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
                  {selectedProduct.sizes.map(s => {
                    const stock = selectedProduct.stock[s];
                    return (
                      <button 
                        key={s} 
                        className={`btn ${stock > 0 ? 'btn-outline-primary' : 'btn-outline-secondary disabled'}`}
                        onClick={() => handleAddToCart(s)}
                      >
                        Size {s} <br/><small>({stock > 0 ? `Còn ${stock}` : 'Hết'})</small>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
