import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullname: "",
    phone: "",
    role: "customer",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.fullname) {
      alert("⚠️ Nhập thiếu thông tin!");
      return;
    }

    try {
      const payload = {
        email: form.email,
        password: form.password,
        name: form.fullname,
        phone: form.phone,
        role: form.role,
      };

      console.log("SEND REGISTER:", payload);

      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "❌ Đăng ký thất bại");
        return;
      }

      alert("🎉 Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      alert("❌ Lỗi server");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">📝 Đăng ký</h2>

        <input
          name="email"
          className="form-control my-2"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          className="form-control my-2"
          placeholder="Password"
          onChange={handleChange}
        />

        <input
          name="fullname"
          className="form-control my-2"
          placeholder="Họ tên"
          onChange={handleChange}
        />

        <input
          name="phone"
          className="form-control my-2"
          placeholder="SĐT"
          onChange={handleChange}
        />

        {/* 🔥 ROLE */}
        <select
          name="role"
          className="form-control my-3"
          value={form.role}
          onChange={handleChange}
        >
          <option value="customer">Người mua</option>
          <option value="seller">Người bán</option>
          {/* <option value="admin">Admin</option> nếu cần */}
        </select>

        <button className="btn btn-success w-100" onClick={handleRegister}>
          Đăng ký
        </button>
      </div>
    </div>
  );
}

export default Register;
