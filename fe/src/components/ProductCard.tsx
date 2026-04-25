import { Link } from "react-router-dom";

function ProductCard({ shoe, addToCart, addToWishlist }: any) {
  return (
    <div className="col-6 col-md-4 col-lg-3">
      {/*  tăng size nhẹ lại để đủ chỗ */}

      <div className="card shadow-sm h-100 d-flex flex-column">
        <Link to={`/product/${shoe.id}`}>
          <img
            src={shoe.image}
            className="card-img-top"
            style={{ height: "150px", objectFit: "cover" }}
          />
        </Link>

        <div className="card-body d-flex flex-column justify-content-between p-2 text-center">
          <div>
            <h6 style={{ fontSize: "14px" }}>{shoe.name}</h6>

            <p
              className="text-danger fw-bold mb-2"
              style={{ fontSize: "13px" }}
            >
              {shoe.price.toLocaleString()}đ
            </p>
          </div>

          {/*  NÚT KHÔNG BỊ MẤT */}
          <div>
            <button
              className="btn btn-dark btn-sm w-100 mb-1"
              onClick={() => addToCart(shoe)}
            >
              🛒 Thêm
            </button>

            <button
              className="btn btn-outline-danger btn-sm w-100"
              onClick={() => addToWishlist(shoe)}
            >
              ❤️ Yêu thích
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
