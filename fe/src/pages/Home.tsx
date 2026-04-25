import React from "react";
import { useNavigate } from "react-router-dom";
import { getMockProducts, ProductType } from "../data/mockProducts";

type HomeProps = {
  addToCart: (variantId: number, qty?: number) => void;
  addToWishlist: (variantId: number) => void;
  removeFromWishlist?: (variantId: number) => void;
};

const Home: React.FC<HomeProps> = ({ addToCart, addToWishlist }) => {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState<ProductType[]>([]);

  React.useEffect(() => {
    setProducts(getMockProducts());
  }, []);

  const handleAddToCart = (variantId: number) => {
    addToCart(variantId, 1);
  };

  const handleAddToWishlist = (variantId: number) => {
    addToWishlist(variantId);
  };

  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  // Chỉ lấy 3 sản phẩm đầu
  const topProducts = products.slice(0, 3);

  return (
    <div>
      {/* Banner */}
      <div className="bg-dark text-white text-center p-5">
        <h1 className="display-4 fw-bold text-warning">SNK STORE 👟</h1>
        <p className="lead">Giày đẹp - Chất lượng - Giá hợp lý</p>
      </div>

      {/* Products */}
      <div className="container mt-5">
        <h2 className="mb-4 fw-bold">Sản phẩm nổi bật</h2>
        <div className="row">
          {topProducts.map((p: ProductType) => (
            <div className="col-md-4 mb-4" key={p.id}>
              <div
                className="card h-100 shadow-sm"
                style={{ cursor: "pointer", transition: "0.3s" }}
              >
                {/* IMAGE */}
                <img
                  src={
                    p.imageUrl ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={p.name}
                  style={{ height: 200, objectFit: "cover", width: "100%" }}
                  onClick={() => handleProductClick(p.id)}
                />

                {/* INFO */}
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

                  {/* Tồn kho */}
                  <p className="mb-1">
                    <strong>Tồn kho:</strong>{" "}
                    {Object.values(p.stock).reduce((a, b) => a + b, 0)} sản phẩm
                  </p>

                  {/* BUTTONS */}
                  <div className="mt-auto d-flex justify-content-between">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCart(p.variantId)}
                    >
                      Mua ngay
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleAddToWishlist(p.variantId)}
                    >
                      Yêu thích
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
