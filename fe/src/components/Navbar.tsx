import { Link } from "react-router-dom";

function Navbar({ cartCount, wishCount, user }: any) {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand text-warning fw-bold" to="/">
          👟 SNK
        </Link>

        <div>
          <Link className="btn btn-outline-light me-2" to="/">
            Trang chủ
          </Link>

          <Link className="btn btn-outline-light me-2" to="/product">
            Sản phẩm
          </Link>

          {(!user || (user.role !== "STAFF" && user.role !== "ADMIN")) && (
            <>
              <Link className="btn btn-outline-danger me-2" to="/wishlist">
                ❤️ ({wishCount})
              </Link>

              <Link className="btn btn-warning me-2" to="/cart">
                🛒 ({cartCount})
              </Link>
            </>
          )}
          {user?.role === "ADMIN" && (
            <Link className="btn btn-outline-info ms-2 me-2" to="/admin">
              ⚙️ Admin
            </Link>
          )}
          {user?.role === "STAFF" && (
            <Link className="btn btn-outline-info ms-2 me-2" to="/seller">
              🏪 Seller
            </Link>
          )}

          {user ? (
            <Link className="btn btn-success" to="/profile">
              {user.name || user.email}
            </Link>
          ) : (
            <Link className="btn btn-primary" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
