import { useState } from "react";
import { api } from "../api/api";

export default function AdminProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Chọn file trước");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api("/products/upload", {
        method: "POST",
        body: formData,
      });

      const imageUrl = res.url;

      await api("/products", {
        method: "POST",
        body: JSON.stringify({
          name,
          price: Number(price),
          imageUrl,
        }),
      });

      setMessage("✅ Tạo sản phẩm thành công");
      setName("");
      setPrice("");
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Tạo sản phẩm thất bại: " + (err.message || ""));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Thêm sản phẩm mới</h2>

      <div className="mb-3">
        <label className="form-label">Tên sản phẩm</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên sản phẩm"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Giá</label>
        <input
          type="number"
          className="form-control"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Nhập giá"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Hình ảnh</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <button className="btn btn-primary" onClick={handleUpload}>
        Tạo sản phẩm
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
