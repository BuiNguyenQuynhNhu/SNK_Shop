import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [inputOtp, setInputOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [step, setStep] = useState(1); // 1=email, 2=OTP, 3=new password

  // GỬI OTP
  const sendOTP = () => {
    if (!email) return alert("⚠️ Nhập email!");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      alert("❌ Email không tồn tại!");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(code);

    alert(`📧 OTP (fake): ${code}`);
    setStep(2);
  };

  //  VERIFY OTP
  const verifyOTP = () => {
    if (!inputOtp) return alert("⚠️ Nhập OTP!");
    if (inputOtp !== otp) return alert("❌ Sai OTP!");
    setStep(3);
  };

  //  RESET PASSWORD
  const resetPassword = () => {
    if (!newPass) return alert("⚠️ Nhập mật khẩu mới!");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updated = users.map((u: any) =>
      u.email === email ? { ...u, password: newPass } : u,
    );
    localStorage.setItem("users", JSON.stringify(updated));

    alert("🎉 Đổi mật khẩu thành công!");
    navigate("/login");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <div className="card p-4 shadow">
        <h2 className="text-center mb-4">🔑 Quên mật khẩu</h2>

        {/* STEP 1: Nhập email */}
        {step === 1 && (
          <>
            <input
              className="form-control mb-3"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-dark w-100" onClick={sendOTP}>
              Gửi OTP
            </button>
          </>
        )}

        {/* STEP 2: Nhập OTP */}
        {step === 2 && (
          <>
            <input
              className="form-control mb-3"
              placeholder="Nhập OTP"
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value)}
            />
            <button className="btn btn-warning w-100" onClick={verifyOTP}>
              Xác nhận OTP
            </button>
          </>
        )}

        {/* STEP 3: Nhập mật khẩu mới */}
        {step === 3 && (
          <>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Mật khẩu mới"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <button className="btn btn-success w-100" onClick={resetPassword}>
              Đổi mật khẩu
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
