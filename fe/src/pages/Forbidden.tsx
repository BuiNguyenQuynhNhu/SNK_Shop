import React from "react";
import { useNavigate } from "react-router-dom";

const Forbidden: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h2 className="text-danger">🚫 403 - Forbidden</h2>
      <p>Bạn không có quyền truy cập trang này.</p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Quay về trang chủ
      </button>
    </div>
  );
};

export default Forbidden;
