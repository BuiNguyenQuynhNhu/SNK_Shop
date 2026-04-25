import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// TYPE USER
type User = {
  email: string;
  role?: string;
};

// PROPS
type Props = {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

function Login({ setUser }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(" Sai tài khoản hoặc mật khẩu");
        return;
      }

      // SAVE TOKEN
      localStorage.setItem("token", data.access_token);

      // LẤY ROLE CHUẨN
      const user: User = {
        email: data.user?.email || email,
        name: data.user?.name || "Admin/User",
        role: data.user?.role || "CUSTOMER", //  fix
      };

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      alert("✅ Login thành công");

      //  CHUYỂN TRANG ĐÚNG ROLE
      if (user.role === "STAFF") {
        navigate("/seller");
      } else if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/product"); // CUSTOMER
      }
    } catch (err) {
      console.error(err);
      alert(" Lỗi server");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">🔐 Đăng nhập</h2>

        {/* EMAIL */}
        <input
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BTN */}
        <button className="btn btn-dark w-100 mb-3" onClick={handleLogin}>
          Đăng nhập
        </button>

        {/* LINKS */}
        <div className="d-flex justify-content-between">
          <Link to="/register">Đăng ký</Link>
          <Link to="/forgot">Quên mật khẩu</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
