import { useState, useEffect } from "react";
import { getMockProducts, saveMockProducts, ProductType } from "../data/mockProducts";
import { api } from "../api/api";

type BrandType = {
  name: string;
  imageUrl: string;
  description: string;
};

type VoucherType = {
  code: string;
  type: "percent" | "fixed";
  value: number;
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products");

  // --- PRODUCTS STATE ---
  const [products, setProducts] = useState<ProductType[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState<{ [key: number]: number }>({ 38: 0, 39: 0, 40: 0, 41: 0, 42: 0 });
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- BRANDS STATE ---
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDesc, setNewBrandDesc] = useState("");
  const [newBrandFile, setNewBrandFile] = useState<File | null>(null);

  // --- VOUCHERS STATE ---
  const [vouchers, setVouchers] = useState<VoucherType[]>([]);
  const [newVoucherCode, setNewVoucherCode] = useState("");
  const [newVoucherType, setNewVoucherType] = useState<"percent" | "fixed">("percent");
  const [newVoucherValue, setNewVoucherValue] = useState("");

  // --- ORDERS STATE ---
  const [orders, setOrders] = useState<any[]>([]);

  // --- STAFF STATE ---
  const [users, setUsers] = useState<any[]>([]);
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");

  useEffect(() => {
    // Load Products
    setProducts(getMockProducts());
    
    // Load Brands
    const defaultBrands: BrandType[] = [
      { name: "Nike", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", description: "Hãng giày nổi tiếng toàn cầu" },
      { name: "Adidas", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg", description: "Thương hiệu thể thao đình đám" }
    ];
    let savedBrandsRaw = localStorage.getItem("brands");
    let savedBrands: any[] = savedBrandsRaw ? JSON.parse(savedBrandsRaw) : defaultBrands;
    if (savedBrands.length > 0 && typeof savedBrands[0] === "string") {
      savedBrands = savedBrands.map(b => ({ name: b, imageUrl: "", description: "" }));
      localStorage.setItem("brands", JSON.stringify(savedBrands));
    }
    setBrands(savedBrands);
    setBrand(savedBrands.length > 0 ? savedBrands[0].name : "Other");

    // Load Vouchers
    const savedVouchersRaw = localStorage.getItem("vouchers");
    const defaultVouchers: VoucherType[] = [
      { code: "SALE10", type: "percent", value: 10 },
      { code: "SNK50", type: "fixed", value: 50000 }
    ];
    if (savedVouchersRaw) {
      setVouchers(JSON.parse(savedVouchersRaw));
    } else {
      setVouchers(defaultVouchers);
      localStorage.setItem("vouchers", JSON.stringify(defaultVouchers));
    }

    // Load Orders
    setOrders(JSON.parse(localStorage.getItem("orders") || "[]"));

    // Load Users
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api("/users");
      setUsers(res || []);
    } catch (e) {
      console.error(e);
    }
  };

  // ===================== PRODUCTS LOGIC =====================
  const handleStockChange = (size: number, value: string) => {
    setStock((prev) => ({ ...prev, [size]: Math.max(0, Number(value)) }));
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setBrand(brands.length > 0 ? brands[0].name : "Other");
    setPrice("");
    setStock({ 38: 0, 39: 0, 40: 0, 41: 0, 42: 0 });
    setImageUrl("");
    setFile(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return alert("Vui lòng nhập tên, giá sản phẩm");
    setIsUploading(true);
    let finalImageUrl = imageUrl;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await api("/products/upload", { method: "POST", body: formData });
        finalImageUrl = res.url;
      } catch (err: any) {
        alert("Upload ảnh thất bại: " + (err.message || ""));
        setIsUploading(false);
        return;
      }
    }
    let newList: ProductType[];
    if (editId) {
      newList = products.map((p) => p.id === editId ? { ...p, name, brand: brand || "Other", price: Number(price), imageUrl: finalImageUrl || p.imageUrl, stock: { ...stock } } : p);
    } else {
      const newProduct: ProductType = { id: Date.now(), name, brand: brand || "Other", price: Number(price), variantId: Date.now() + 1000, imageUrl: finalImageUrl || "https://via.placeholder.com/300x200?text=No+Image", sizes: [38, 39, 40, 41, 42], stock: { ...stock } };
      newList = [newProduct, ...products];
    }
    setProducts(newList);
    saveMockProducts(newList);
    resetForm();
    setIsUploading(false);
  };

  const deleteProduct = (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    const newList = products.filter((p) => p.id !== id);
    setProducts(newList);
    saveMockProducts(newList);
  };

  const editProduct = (product: ProductType) => {
    setEditId(product.id);
    setName(product.name);
    setBrand(product.brand);
    setPrice(product.price.toString());
    setStock(product.stock || { 38: 0, 39: 0, 40: 0, 41: 0, 42: 0 });
    setImageUrl(product.imageUrl);
    setFile(null);
  };

  // ===================== BRANDS LOGIC =====================
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName) return alert("Vui lòng nhập tên hãng");
    if (brands.some(b => b.name === newBrandName)) return alert("Hãng đã tồn tại");
    
    setIsUploading(true);
    let finalImageUrl = "";
    if (newBrandFile) {
      const formData = new FormData();
      formData.append("file", newBrandFile);
      try {
        const res = await api("/products/upload", { method: "POST", body: formData });
        finalImageUrl = res.url;
      } catch (err: any) {
        alert("Upload ảnh thất bại: " + (err.message || ""));
        setIsUploading(false);
        return;
      }
    }

    const newBrandObj: BrandType = {
      name: newBrandName,
      description: newBrandDesc,
      imageUrl: finalImageUrl || "https://via.placeholder.com/150?text=No+Logo"
    };

    const updated = [...brands, newBrandObj];
    setBrands(updated);
    localStorage.setItem("brands", JSON.stringify(updated));
    setNewBrandName("");
    setNewBrandDesc("");
    setNewBrandFile(null);
    setIsUploading(false);
  };

  const handleDeleteBrand = (bName: string) => {
    if (!window.confirm(`Xóa hãng ${bName}?`)) return;
    const updated = brands.filter(x => x.name !== bName);
    setBrands(updated);
    localStorage.setItem("brands", JSON.stringify(updated));
  };

  // ===================== VOUCHERS LOGIC =====================
  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherCode || !newVoucherValue) return alert("Vui lòng nhập đủ thông tin");
    const code = newVoucherCode.toUpperCase();
    if (vouchers.some(v => v.code === code)) return alert("Mã đã tồn tại");

    const newVal = Number(newVoucherValue);
    if (isNaN(newVal) || newVal <= 0) return alert("Mức giảm không hợp lệ");

    const newVoucher: VoucherType = {
      code,
      type: newVoucherType,
      value: newVal
    };

    const updated = [...vouchers, newVoucher];
    setVouchers(updated);
    localStorage.setItem("vouchers", JSON.stringify(updated));
    setNewVoucherCode("");
    setNewVoucherValue("");
  };

  const handleDeleteVoucher = (code: string) => {
    if (!window.confirm(`Xóa mã ${code}?`)) return;
    const updated = vouchers.filter(v => v.code !== code);
    setVouchers(updated);
    localStorage.setItem("vouchers", JSON.stringify(updated));
  };

  // ===================== ORDERS LOGIC =====================
  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  // ===================== STAFF LOGIC =====================
  const handleUpdateUserRole = async (email: string, role: string) => {
    try {
      await api(`/users/${email}`, { method: "PUT", body: JSON.stringify({ role }) });
      fetchUsers();
    } catch(e) {
      alert("Cập nhật quyền thất bại");
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!window.confirm(`Xóa tài khoản ${email}?`)) return;
    try {
      await api(`/users/${email}`, { method: "DELETE" });
      fetchUsers();
    } catch(e) {
      alert("Xóa thất bại");
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail || !newStaffPassword || !newStaffName) return alert("Vui lòng điền đủ thông tin");
    try {
      await api("/auth/register", { 
        method: "POST", 
        body: JSON.stringify({ email: newStaffEmail, password: newStaffPassword, name: newStaffName, phone: "", role: "STAFF" }) 
      });
      alert("Tạo nhân viên thành công");
      setNewStaffEmail("");
      setNewStaffName("");
      setNewStaffPassword("");
      fetchUsers();
    } catch (err: any) {
      alert("Tạo nhân viên thất bại: " + (err.message || ""));
    }
  };

  const staffUsers = users.filter(u => u.role === "STAFF" || u.role === "ADMIN");

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-primary">⚙️ Quản trị hệ thống (Admin)</h2>
      
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'products' ? 'active' : 'bg-light text-dark'}`} onClick={() => setActiveTab('products')}>👟 Sản phẩm</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'orders' ? 'active' : 'bg-light text-dark'}`} onClick={() => setActiveTab('orders')}>📦 Đơn hàng</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'brands' ? 'active' : 'bg-light text-dark'}`} onClick={() => setActiveTab('brands')}>🏷️ Thương hiệu</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'promotions' ? 'active' : 'bg-light text-dark'}`} onClick={() => setActiveTab('promotions')}>🎫 Khuyến mãi</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'staff' ? 'active' : 'bg-light text-dark'}`} onClick={() => setActiveTab('staff')}>👥 Nhân viên</button>
        </li>
      </ul>

      {/* TABS CONTENT */}
      {activeTab === 'products' && (
        <div>
          {/* FORM THÊM/SỬA SẢN PHẨM */}
          <div className="card shadow-sm mb-5">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">{editId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveProduct}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tên sản phẩm</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Hãng (Brand)</label>
                    <select className="form-select" value={brand} onChange={(e) => setBrand(e.target.value)}>
                      {brands.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                      <option value="Other">Khác (Other)</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Giá (VNĐ)</label>
                    <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Số lượng theo Size</label>
                    <div className="d-flex flex-wrap gap-2">
                      {[38, 39, 40, 41, 42].map(size => (
                        <div key={size} className="input-group input-group-sm" style={{ width: "120px" }}>
                          <span className="input-group-text bg-light fw-bold">Size {size}</span>
                          <input type="number" className="form-control text-center" value={stock[size] || 0} onChange={(e) => handleStockChange(size, e.target.value)} min="0" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tải ảnh lên</label>
                    <input type="file" className="form-control" onChange={(e) => setFile(e.target.files?.[0] || null)} accept="image/*" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Hoặc URL Ảnh</label>
                    <input type="text" className="form-control" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={file !== null} />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={isUploading}>{isUploading ? "⏳ Đang xử lý..." : editId ? "💾 Lưu thay đổi" : "➕ Thêm sản phẩm"}</button>
                  {editId && <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={isUploading}>Hủy</button>}
                </div>
              </form>
            </div>
          </div>

          {/* DANH SÁCH SẢN PHẨM */}
          <div className="card shadow-sm">
            <div className="card-header bg-white"><h5 className="mb-0">Danh sách sản phẩm ({products.length})</h5></div>
            <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light sticky-top">
                  <tr><th>ID</th><th>Ảnh</th><th>Tên</th><th>Hãng</th><th>Giá</th><th>Tồn kho</th><th className="text-center">Thao tác</th></tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td><img src={p.imageUrl} alt={p.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }} /></td>
                      <td className="fw-bold">{p.name}</td>
                      <td>{p.brand}</td>
                      <td className="text-danger fw-bold">{p.price.toLocaleString()}đ</td>
                      <td>{Object.values(p.stock).reduce((a, b) => a + b, 0)}</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editProduct(p)}>✏️ Sửa</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(p.id)}>❌ Xóa</button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && <tr><td colSpan={7} className="text-center py-4 text-muted">Chưa có sản phẩm nào.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="card shadow-sm">
          <div className="card-header bg-white"><h5 className="mb-0">Quản lý Đơn hàng</h5></div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th>Mã Đơn</th><th>Khách hàng</th><th>Chi tiết</th><th>Thanh toán</th><th>Trạng thái</th><th className="text-center">Thao tác</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.userEmail}<br/><small className="text-muted">{o.address}</small></td>
                    <td>
                      <ul className="mb-0 ps-3">
                        {o.items.map((i: any, idx: number) => (
                          <li key={idx}><small>{i.name} (Size: {i.size}) x {i.qty}</small></li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="text-muted text-decoration-line-through"><small>{(o.subTotal || 0).toLocaleString()}đ</small></span>
                        {o.discount > 0 && <span className="text-success"><small>Giảm: -{o.discount.toLocaleString()}đ {o.voucher && `(${o.voucher})`}</small></span>}
                        <span className="text-danger fw-bold fs-6">{o.total?.toLocaleString()}đ</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${o.status === 'Chờ duyệt' ? 'bg-warning' : o.status === 'Đang giao' ? 'bg-info' : o.status === 'Hoàn thành' ? 'bg-success' : 'bg-danger'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <select className="form-select form-select-sm d-inline-block w-auto" value={o.status} onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}>
                        <option value="Chờ duyệt">Chờ duyệt</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={6} className="text-center py-4 text-muted">Chưa có đơn hàng nào.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'brands' && (
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white"><h5 className="mb-0">Thêm / Sửa Thương hiệu</h5></div>
          <div className="card-body border-bottom mb-4">
            <form onSubmit={handleAddBrand} className="row align-items-end">
              <div className="col-md-3 mb-3">
                <label className="form-label">Tên hãng</label>
                <input type="text" className="form-control" placeholder="VD: Biti's" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Mô tả ngắn</label>
                <input type="text" className="form-control" placeholder="Hãng giày Việt Nam..." value={newBrandDesc} onChange={e => setNewBrandDesc(e.target.value)} />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Logo hãng (Tải ảnh lên)</label>
                <input type="file" className="form-control" onChange={e => setNewBrandFile(e.target.files?.[0] || null)} accept="image/*" />
              </div>
              <div className="col-md-2 mb-3">
                <button type="submit" className="btn btn-primary w-100" disabled={isUploading}>{isUploading ? "⏳ Đang lưu..." : "➕ Thêm hãng"}</button>
              </div>
            </form>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th>Logo</th><th>Tên hãng</th><th>Mô tả</th><th className="text-center">Thao tác</th></tr>
              </thead>
              <tbody>
                {brands.map((b) => (
                  <tr key={b.name}>
                    <td><img src={b.imageUrl || "https://via.placeholder.com/50?text=Logo"} alt={b.name} style={{ width: "50px", height: "50px", objectFit: "contain", background: "#f8f9fa", borderRadius: "5px" }} /></td>
                    <td className="fw-bold">{b.name}</td>
                    <td className="text-muted">{b.description || "Không có mô tả"}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteBrand(b.name)}>❌ Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'promotions' && (
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white"><h5 className="mb-0">Tạo Mã giảm giá (Voucher)</h5></div>
          <div className="card-body border-bottom mb-4">
             <form onSubmit={handleAddVoucher} className="row align-items-end">
              <div className="col-md-3 mb-3">
                <label className="form-label">Mã Code (Chữ hoa)</label>
                <input type="text" className="form-control text-uppercase" placeholder="VD: SALE2026" value={newVoucherCode} onChange={e => setNewVoucherCode(e.target.value)} required />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Loại giảm giá</label>
                <select className="form-select" value={newVoucherType} onChange={e => setNewVoucherType(e.target.value as "percent" | "fixed")}>
                  <option value="percent">Giảm theo %</option>
                  <option value="fixed">Trừ tiền cố định (đ)</option>
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Mức giảm</label>
                <input type="number" className="form-control" placeholder={newVoucherType === 'percent' ? "VD: 10" : "VD: 50000"} value={newVoucherValue} onChange={e => setNewVoucherValue(e.target.value)} required min="1" />
              </div>
              <div className="col-md-3 mb-3">
                <button type="submit" className="btn btn-primary w-100">➕ Tạo Voucher</button>
              </div>
            </form>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th>Mã Voucher</th><th>Loại</th><th>Mức giảm</th><th className="text-center">Thao tác</th></tr>
              </thead>
              <tbody>
                {vouchers.map((v) => (
                  <tr key={v.code}>
                    <td className="fw-bold text-success">{v.code}</td>
                    <td>{v.type === 'percent' ? "Giảm theo phần trăm" : "Giảm tiền mặt"}</td>
                    <td className="text-danger fw-bold">{v.type === 'percent' ? `${v.value}%` : `${v.value.toLocaleString()}đ`}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteVoucher(v.code)}>❌ Xóa</button>
                    </td>
                  </tr>
                ))}
                {vouchers.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-muted">Chưa có mã giảm giá nào.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white"><h5 className="mb-0">Tạo tài khoản Nhân viên mới</h5></div>
          <div className="card-body border-bottom mb-4">
             <form onSubmit={handleCreateStaff} className="row align-items-end">
              <div className="col-md-4 mb-3">
                <label className="form-label">Tên nhân viên</label>
                <input type="text" className="form-control" placeholder="Nhập tên..." value={newStaffName} onChange={e => setNewStaffName(e.target.value)} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="staff@example.com" value={newStaffEmail} onChange={e => setNewStaffEmail(e.target.value)} required />
              </div>
              <div className="col-md-2 mb-3">
                <label className="form-label">Mật khẩu</label>
                <input type="password" className="form-control" placeholder="******" value={newStaffPassword} onChange={e => setNewStaffPassword(e.target.value)} required />
              </div>
              <div className="col-md-2 mb-3">
                <button type="submit" className="btn btn-primary w-100">➕ Tạo Staff</button>
              </div>
            </form>
          </div>
          <div className="card-header bg-white"><h5 className="mb-0">Danh sách Nhân viên quản trị</h5></div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th>Tên</th><th>Email</th><th>Quyền hiện tại</th><th className="text-center">Thao tác phân quyền</th></tr>
              </thead>
              <tbody>
                {staffUsers.map((u) => (
                  <tr key={u.email}>
                    <td className="fw-bold">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-center">
                      <select className="form-select form-select-sm d-inline-block w-auto me-2" value={u.role} onChange={(e) => handleUpdateUserRole(u.email, e.target.value)}>
                        <option value="STAFF">STAFF</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(u.email)}>Xóa</button>
                    </td>
                  </tr>
                ))}
                {staffUsers.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-muted">Chưa có nhân viên nào.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
