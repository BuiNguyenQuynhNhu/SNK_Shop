// SNK/src/pages/Wishlist.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { mockProducts, ProductType } from "../data/mockProducts";

type WishlistProps = {
  wishlist: { variantId: number }[];
  setWishlist: React.Dispatch<React.SetStateAction<{ variantId: number }[]>>;
};

const Wishlist: React.FC<WishlistProps> = ({ wishlist, setWishlist }) => {
  const navigate = useNavigate();

  // Lấy các sản phẩm trong wishlist
  const favoriteProducts = wishlist
    .map((w) => mockProducts.find((p) => p.variantId === w.variantId))
    .filter((p): p is ProductType => p !== undefined);

  const handleRemove = (variantId: number) => {
    const confirm = window.confirm(
      "Bạn có chắc chắn muốn bỏ sản phẩm này khỏi danh sách yêu thích?",
    );
    if (!confirm) return;

    setWishlist((prev) => prev.filter((w) => w.variantId !== variantId));
  };

  const handleViewDetail = (id: number) => {
    navigate(`/product/${id}`);
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h3>Chưa có sản phẩm yêu thích nào 😢</h3>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold">Sản phẩm yêu thích</h2>
      <div className="row">
        {favoriteProducts.map((p) => (
          <div className="col-md-4 mb-4" key={p.variantId}>
            <div className="card h-100 shadow-sm">
              {/* IMAGE clickable */}
              <img
                src={p.imageUrl}
                alt={p.name}
                className="card-img-top"
                style={{ height: 200, objectFit: "cover", cursor: "pointer" }}
                onClick={() => handleViewDetail(p.id)}
              />
              <div className="card-body d-flex flex-column">
                {/* NAME clickable */}
                <h5
                  className="fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleViewDetail(p.id)}
                >
                  {p.name}
                </h5>
                <p className="text-danger fw-bold">
                  {p.price.toLocaleString()}đ
                </p>
                <p className="text-muted">{p.brand}</p>
                <div className="mt-auto">
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() => handleRemove(p.variantId)}
                  >
                    Bỏ yêu thích
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
