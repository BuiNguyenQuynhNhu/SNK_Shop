// SNK/src/App.tsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// COMPONENTS
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import ProtectedRoute from "./components/ProtectedRoute";

// PAGES
import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ChatBot from "./pages/ChatBot";
import BrandPage from "./pages/BrandPage";
import Seller from "./pages/Seller"; // 🔥 dùng file Seller.tsx
import ForgotPassword from "./pages/ForgotPassword";
import Forbidden from "./pages/Forbidden"; // 🔥 import

// ===== TYPES =====
type User = {
  name: string;
  email: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
};

type WishlistItem = { variantId: number };
type CartItem = {
  variantId: number;
  size: number;
  qty: number;
  status?: "cart" | "shipping";
};

const App: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [notify, setNotify] = useState("");

  // ===== LOAD LOCAL =====
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const savedUser = localStorage.getItem("user");
    
    setCart(savedCart);
    setWishlist(savedWishlist);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ===== SYNC LOCAL =====
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // ===== NOTIFY =====
  const showNotify = (msg: string) => {
    setNotify(msg);
    setTimeout(() => setNotify(""), 2000);
  };

  // ===== CART =====
  const addToCart = (variantId: number, size: number, qty: number = 1) => {
    if (!size) {
      showNotify("Vui lòng chọn size trước khi thêm vào giỏ hàng");
      return;
    }

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.variantId === variantId && item.size === size,
      );
      if (existing) {
        return prev.map((item) =>
          item.variantId === variantId && item.size === size
            ? { ...item, qty: item.qty + qty }
            : item,
        );
      }
      return [...prev, { variantId, size, qty, status: "cart" }];
    });

    showNotify("🛒 Đã thêm vào giỏ hàng");
  };

  const removeFromCart = (variantId: number, size: number) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.variantId === variantId && item.size === size),
      ),
    );
    showNotify("🗑️ Đã xóa khỏi giỏ hàng");
  };

  const updateCartQty = (variantId: number, size: number, qty: number) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.variantId === variantId && item.size === size
          ? { ...item, qty }
          : item,
      ),
    );
  };

  // ===== WISHLIST =====
  const addToWishlist = (variantId: number) => {
    if (!wishlist.some((w) => w.variantId === variantId)) {
      setWishlist((prev) => [...prev, { variantId }]);
      showNotify("❤️ Đã thêm vào yêu thích");
    }
  };

  const removeFromWishlist = (variantId: number) => {
    setWishlist((prev) => prev.filter((w) => w.variantId !== variantId));
    showNotify("🗑️ Đã bỏ khỏi yêu thích");
  };

  // ===== LOGOUT =====
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showNotify("👋 Đã đăng xuất");
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <Navbar cartCount={cart.length} wishCount={wishlist.length} user={user} />

      {/* NOTIFICATION */}
      <Notification message={notify} />

      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        <ChatBot />
      </div>

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <Home
              wishlist={wishlist}
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              removeFromWishlist={removeFromWishlist}
            />
          }
        />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Product */}
        <Route
          path="/product"
          element={
            <Product addToCart={addToCart} addToWishlist={addToWishlist} />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetail
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              purchasedVariants={[]}
              showNotify={showNotify}
            />
          }
        />

        {/* Brand */}
        <Route path="/brand/:brand" element={<BrandPage />} />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              updateCartQty={updateCartQty}
              removeFromCart={removeFromCart}
            />
          }
        />

        {/* Checkout */}
        <Route path="/checkout" element={<Checkout setCart={setCart} />} />

        {/* Auth */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} logout={logout} />
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Seller (Admin & Staff) */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute roles={["ADMIN", "STAFF"]}>
              <Seller />
            </ProtectedRoute>
          }
        />
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
    </>
  );
};

export default App;
