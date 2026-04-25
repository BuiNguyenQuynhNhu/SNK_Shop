import { useState } from "react";

// TYPE USER
type User = {
  username?: string;
  email: string;
  role?: string;
  fullname?: string;
  phone?: string;
  password?: string;
  addresses?: string[];
};

// PROPS
type Props = {
  user: User;
  logout: () => void;
};

function Profile({ user, logout }: Props) {
  const [info, setInfo] = useState({
    ...user,
    addresses: user.addresses || [],
    newAddress: "",
    oldPass: "",
    newPass: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  // MAP ROLE
  const getRoleName = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "🛠 Quản lý";
      case "STAFF":
        return "🛒 Người bán";
      default:
        return "👤 CUSTOMER";
    }
  };

  // SAVE INFO
  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const updated = users.map((u: any) =>
      u.username === user.username ? info : u,
    );

    localStorage.setItem("users", JSON.stringify(updated));
    localStorage.setItem("user", JSON.stringify(info));

    alert("💾 Cập nhật thành công!");
  };

  // ADD ADDRESS
  const addAddress = () => {
    if (!info.newAddress) return;

    setInfo({
      ...info,
      addresses: [...(info.addresses || []), info.newAddress],
      newAddress: "",
    });
  };

  // REMOVE ADDRESS
  const removeAddress = (index: number) => {
    const newList = (info.addresses || []).filter((_, i) => i !== index);
    setInfo({ ...info, addresses: newList });
  };

  // CHANGE PASSWORD
  const changePassword = () => {
    if (info.oldPass !== user.password) {
      alert("❌ Sai mật khẩu cũ!");
      return;
    }

    if (!info.newPass) {
      alert("⚠️ Nhập mật khẩu mới!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const updated = users.map((u: any) =>
      u.username === user.username ? { ...u, password: info.newPass } : u,
    );

    localStorage.setItem("users", JSON.stringify(updated));

    alert("🔐 Đổi mật khẩu thành công!");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">👤 Tài khoản</h2>

        {/* ROLE */}
        <div className="mb-3">
          <b>Vai trò:</b>
          <div className="text-primary fw-bold">{getRoleName(user.role)}</div>
        </div>

        {/* INFO */}
        <input
          name="fullname"
          className="form-control my-2"
          value={info.fullname || ""}
          onChange={handleChange}
          placeholder="Họ tên"
        />

        <input
          name="email"
          className="form-control my-2"
          value={info.email || ""}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          name="phone"
          className="form-control my-2"
          value={info.phone || ""}
          onChange={handleChange}
          placeholder="SĐT"
        />

        <button className="btn btn-primary w-100 my-2" onClick={handleSave}>
          💾 Lưu thông tin
        </button>

        <hr />

        {/* ADDRESS */}
        <h4>📍 Địa chỉ</h4>

        <input
          className="form-control my-2"
          placeholder="Thêm địa chỉ"
          name="newAddress"
          value={info.newAddress}
          onChange={handleChange}
        />

        <button className="btn btn-success mb-2 w-100" onClick={addAddress}>
          Thêm địa chỉ
        </button>

        {(info.addresses || []).map((addr: string, i: number) => (
          <div key={i} className="d-flex justify-content-between mb-2">
            <span>{addr}</span>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeAddress(i)}
            >
              Xóa
            </button>
          </div>
        ))}

        <hr />

        {/* PASSWORD */}
        <h4>🔐 Đổi mật khẩu</h4>

        <input
          type="password"
          className="form-control my-2"
          placeholder="Mật khẩu cũ"
          name="oldPass"
          onChange={handleChange}
        />

        <input
          type="password"
          className="form-control my-2"
          placeholder="Mật khẩu mới"
          name="newPass"
          onChange={handleChange}
        />

        <button className="btn btn-warning w-100" onClick={changePassword}>
          Đổi mật khẩu
        </button>

        <hr />

        <button className="btn btn-danger w-100" onClick={logout}>
          🚪 Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default Profile;
