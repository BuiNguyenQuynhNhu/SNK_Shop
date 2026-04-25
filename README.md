# 🛒 SNK Shop - Hệ thống bán giày Sneaker

## 📌 Giới thiệu

**SNK Shop** là một hệ thống thương mại điện tử chuyên bán giày sneaker, được xây dựng theo kiến trúc **fullstack tách biệt frontend - backend**, tích hợp chatbot AI hỗ trợ khách hàng.

Hệ thống gồm:
![Architecture](arch.jpeg)
* 🖥️ **Frontend**: Vue.js
* ⚙️ **Backend**: NestJS
* 🤖 **Chatbot AI (Gemini)**: hỗ trợ tư vấn sản phẩm
* 🗄️ **Database**: PostgreSQL
* ☁️ **Storage**: Azure Blob Storage

---

## 🏗️ Kiến trúc hệ thống

```
SNK-shop/
│
├── fe/        # Frontend (Vue.js)
├── be/        # Backend (NestJS API)
├── chatbot/   # Chatbot AI (Gemini)
└── README.md
```

---

## 🚀 Công nghệ sử dụng

### Frontend

* Vue.js
* Axios
* Vue Router

### Backend

* NestJS
* PostgreSQL
* JWT Authentication

### AI Chatbot

* Gemini API (Google AI)

### Cloud & Storage

* Azure Blob Storage

---

## ⚙️ Cài đặt môi trường

### 1. Clone project

```bash
git clone https://github.com/BuiNguyenQuynhNhu/SNK_Shop
cd SNK_shop
```

---

### 2. Backend (NestJS)

```bash
cd be
npm install
```

#### Tạo file `.env`

```env
DATABASE_URL= ... 
DB_HOST= ... 
DB_PORT= ... 
DB_USER= ...
DB_PASS= ...
DB_NAME= ...

JWT_SECRET= ...

API_KEY=your_gemini_api_key

AZURE_CONTAINER=images
AZURE_STORAGE_CONNECTION_STRING=your_azure_connection_string
```

#### Run backend

```bash
npm run start:dev
```

---

### 3. Frontend (Vue)

```bash
cd fe
npm install
npm run dev
```

---

### 4. Chatbot (Gemini)

```bash
cd chatbot
npm install
npm start
```

---

## 📦 Chức năng chính

* 🛍️ Xem danh sách sản phẩm giày sneaker
* 🔍 Tìm kiếm và lọc sản phẩm
* 🛒 Quản lý giỏ hàng
* 👤 Đăng ký / Đăng nhập (JWT)
* 📦 Đặt hàng
* 🤖 Chatbot tư vấn sản phẩm
* ☁️ Upload và hiển thị ảnh từ Azure

---

## 🔗 API chính (Backend)

| Method | Endpoint       | Mô tả                  |
| ------ | -------------- | ---------------------- |
| GET    | /products      | Lấy danh sách sản phẩm |
| GET    | /products/:id  | Chi tiết sản phẩm      |
| POST   | /auth/login    | Đăng nhập              |
| POST   | /auth/register | Đăng ký                |
| POST   | /cart          | Thêm vào giỏ hàng      |
| PUT    | /cart          | Cập nhật giỏ hàng      |
| DELETE | /cart/:id      | Xóa sản phẩm khỏi giỏ  |

---

## 🤖 Chatbot AI

Chatbot sử dụng **Gemini API** để:

* Gợi ý sản phẩm theo nhu cầu
* Trả lời câu hỏi về size, giá, thương hiệu
* Hỗ trợ khách hàng 24/7

---

## 📷 Storage

* Ảnh sản phẩm được lưu trên **Azure Blob Storage**
* Backend xử lý upload và trả URL cho frontend

---


## 📌 TODO

* [ ] Thanh toán online (VNPay / Momo)
* [ ] Recommendation system
* [ ] Admin dashboard
* [ ] Order tracking realtime

---

## 📄 License

MIT License
