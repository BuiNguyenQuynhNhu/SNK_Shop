// SNK/src/pages/ProductDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMockProducts, ProductType } from "../data/mockProducts";
import { Link } from "react-router-dom";
import { getBrandLogo } from "../data/brandLogo";

type ProductDetailProps = {
  addToCart: (variantId: number, size: number, qty?: number) => void;
  addToWishlist: (variantId: number) => void;
  purchasedVariants?: number[];
  showNotify?: (msg: string) => void;
};

const ProductDetail: React.FC<ProductDetailProps> = ({
  addToCart,
  addToWishlist,
  purchasedVariants = [],
  showNotify = () => {},
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<number | undefined>();
  const [rating, setRating] = useState<number>(0);

  const isPurchased = product
    ? purchasedVariants.includes(product.variantId)
    : false;

  useEffect(() => {
    if (id) {
      const products = getMockProducts();
      const p = products.find((p) => p.id === Number(id));
      setProduct(p);
    }
  }, [id]);

  if (!product)
    return <p className="text-center mt-5">Sản phẩm không tồn tại</p>;

  const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
  const stockForSelectedSize =
    selectedSize !== undefined ? product.stock[selectedSize] : totalStock;

  const handleAddToCart = () => {
    if (!selectedSize) {
      showNotify("Vui lòng chọn size trước khi thêm vào giỏ");
      return;
    }
    if (product.stock[selectedSize!] <= 0) {
      showNotify("Sản phẩm đã hết hàng cho size này");
      return;
    }
    addToCart(product.variantId, selectedSize, 1);
    showNotify("🛒 Đã thêm vào giỏ hàng");
  };

  const handleAddToWishlist = () => {
    addToWishlist(product.variantId);
    showNotify("❤️ Đã thêm vào yêu thích");
  };

  const handleRating = (value: number) => {
    if (!isPurchased) {
      showNotify("Chỉ được đánh giá khi đã mua sản phẩm");
      return;
    }
    setRating(value);
    showNotify(`Bạn đã đánh giá ${value} sao`);
  };

  // const brandLogoUrl = `https://logo.clearbit.com/${product.brand}.com`;

  return (
    <div className="container my-5" style={{ position: "relative" }}>
      {/* Brand Logo */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
        }}
      >
        <Link to={`/brand/${product.brand}`}>
          <img
            src={getBrandLogo(product.brand)}
            alt={product.brand}
            style={{
              width: 60,
              height: 60,
              objectFit: "contain",
              cursor: "pointer",
              border: "1px solid #eee",
              borderRadius: 10,
              padding: 5,
              background: "#fff",
            }}
          />
        </Link>
      </div>

      <div className="row">
        {/* Product Image */}
        <div className="col-md-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid shadow-sm"
          />
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted mb-1">Brand: {product.brand}</p>
          <p className="text-danger fw-bold mb-1">
            {product.price.toLocaleString()}đ
          </p>

          {/* Tồn kho */}
          <p className="mb-1">
            <strong>Tồn kho:</strong>{" "}
            {selectedSize
              ? product.stock[selectedSize] > 0
                ? `${product.stock[selectedSize]} sản phẩm`
                : "Hết hàng"
              : `${totalStock} sản phẩm`}
          </p>

          {/* Size selector */}
          <div className="mb-3">
            <label htmlFor="sizeSelect" className="form-label">
              Chọn size:
            </label>
            <select
              id="sizeSelect"
              className="form-select w-auto"
              value={selectedSize || ""}
              onChange={(e) => setSelectedSize(Number(e.target.value))}
            >
              <option value="">Chọn size</option>
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-2 mb-3">
            <button
              className="btn btn-success btn-lg"
              style={{ minWidth: 150 }}
              onClick={handleAddToCart}
              disabled={stockForSelectedSize === 0}
            >
              Thêm vào giỏ
            </button>
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={handleAddToWishlist}
            >
              ❤️ Yêu thích
            </button>
          </div>

          {/* Rating */}
          <div>
            <strong>Đánh giá:</strong>{" "}
            {isPurchased ? (
              [1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  style={{
                    cursor: "pointer",
                    color: s <= rating ? "#ffc107" : "#e4e5e9",
                    fontSize: "1.5rem",
                  }}
                  onClick={() => handleRating(s)}
                >
                  ★
                </span>
              ))
            ) : (
              <span className="text-muted">Chỉ được đánh giá khi đã mua</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
