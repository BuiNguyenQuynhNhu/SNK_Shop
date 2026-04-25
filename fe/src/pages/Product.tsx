// SNK/src/pages/Product.tsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMockProducts, ProductType } from "../data/mockProducts";

type ProductProps = {
  addToCart: (variantId: number, qty?: number) => void;
  addToWishlist: (variantId: number) => void;
};

const Product: React.FC<ProductProps> = ({ addToCart, addToWishlist }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isStaffOrAdmin = user && (user.role === "STAFF" || user.role === "ADMIN");

  // State tìm kiếm, lọc hãng và thông báo
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [notify, setNotify] = useState("");
  const [products, setProducts] = useState<ProductType[]>([]);

  React.useEffect(() => {
    setProducts(getMockProducts());
  }, []);

  // Hàm hiển thị thông báo
  const showNotify = (msg: string) => {
    setNotify(msg);
    setTimeout(() => setNotify(""), 1500);
  };

  // Lọc sản phẩm theo search + brand
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand ? p.brand === selectedBrand : true;
      return matchesSearch && matchesBrand;
    });
  }, [searchTerm, selectedBrand, products]);

  // Danh sách brand duy nhất
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Tất cả sản phẩm</h2>

      {/* SEARCH & SELECT */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">Tất cả hãng</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="row">
        {filteredProducts.map((p: ProductType) => (
          <div className="col-md-4 mb-4" key={p.id}>
            <div className="card h-100 shadow-sm" style={{ cursor: "pointer" }}>
              <img
                src={p.imageUrl}
                alt={p.name}
                className="card-img-top"
                style={{ height: 200, objectFit: "cover" }}
                onClick={() => handleProductClick(p.id)}
              />
              <div className="card-body d-flex flex-column">
                <h5
                  className="fw-bold"
                  onClick={() => handleProductClick(p.id)}
                >
                  {p.name}
                </h5>
                <p className="text-danger fw-bold">
                  {p.price.toLocaleString()}đ
                </p>
                <p className="text-muted">{p.brand}</p>
                <div className="mt-auto d-flex justify-content-between">
                  {!isStaffOrAdmin && (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          addToCart(p.variantId);
                          showNotify("Đã thêm vào giỏ hàng");
                        }}
                      >
                        Thêm giỏ hàng
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          addToWishlist(p.variantId);
                          showNotify("Đã thêm vào yêu thích");
                        }}
                      >
                        Yêu thích
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* THÔNG BÁO TINH GỌN KHI THÊM GIỎ HÀNG / YÊU THÍCH */}
      {notify && (
        <div
          className="position-fixed"
          style={{
            bottom: 20,
            right: 20,
            backgroundColor: "#f8f9fa",
            color: "#212529",
            borderRadius: 6,
            padding: "6px 12px",
            fontSize: "0.85rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 1000,
          }}
        >
          {notify}
        </div>
      )}
    </div>
  );
};

export default Product;
