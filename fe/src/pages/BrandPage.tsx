import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockProducts, ProductType } from "../data/mockProducts";

const BrandPage: React.FC = () => {
  const { brand } = useParams<{ brand: string }>();
  const navigate = useNavigate();

  const brandProducts = mockProducts.filter(
    (p) => p.brand.toLowerCase() === brand?.toLowerCase(),
  );

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (!brand || brandProducts.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2>⚠️ Thương hiệu không tồn tại hoặc chưa có sản phẩm</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Sản phẩm thương hiệu: {brand}</h2>

      <div className="row g-4">
        {brandProducts.map((p: ProductType) => {
          const totalStock = Object.values(p.stock).reduce((a, b) => a + b, 0);
          return (
            <div className="col-6 col-md-3" key={p.id}>
              <div
                className="card h-100 shadow-sm position-relative"
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  transform: hoveredId === p.id ? "scale(1.05)" : "scale(1)",
                }}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  style={{ width: "100%", height: 200, objectFit: "cover" }}
                  onClick={() => navigate(`/product/${p.id}`)}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold">{p.name}</h6>
                  <p className="text-danger fw-bold mb-1">
                    {p.price.toLocaleString()}đ
                  </p>
                  <p className="text-muted mb-1">{p.brand}</p>
                  {hoveredId === p.id && (
                    <div className="mb-2">
                      <p className="mb-1">
                        <strong>Tồn kho:</strong> {totalStock} sản phẩm
                      </p>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm flex-grow-1"
                          onClick={() => navigate(`/product/${p.id}`)}
                        >
                          Mua ngay
                        </button>
                        <button className="btn btn-outline-secondary btn-sm flex-grow-1">
                          ❤️ Yêu thích
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrandPage;
