// SNK/backend/SNK_Shop/server.js
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PrismaClient } = require("@prisma/client");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
const prisma = new PrismaClient();
const PORT = 3000;


// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  systemInstruction: `Bạn là trợ lý AI của cửa hàng giày SNK Store. 
Nhiệm vụ của bạn là tư vấn sản phẩm, size giày, chính sách đổi trả, vận chuyển và hỗ trợ khách hàng.
Bạn có quyền truy cập vào danh sách sản phẩm và thương hiệu thông qua các công cụ được cung cấp.
Nếu khách hỏi về giày, hãy sử dụng công cụ 'search_sneakers' để tìm thông tin chính xác.
Nếu khách hỏi về thương hiệu, hãy dùng 'get_brands'.
Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt.
Nếu khách hỏi ngoài phạm vi giày dép và cửa hàng, hãy nhẹ nhàng hướng họ trở lại chủ đề.`,
  tools: [
    {
      functionDeclarations: [
        {
          name: "search_sneakers",
          description: "Tìm kiếm danh sách giày dựa trên tên hoặc thương hiệu",
          parameters: {
            type: "OBJECT",
            properties: {
              query: { type: "STRING", description: "Từ khóa tìm kiếm (tên giày hoặc thương hiệu)" },
              brand: { type: "STRING", description: "Tên thương hiệu để lọc" }
            }
          }
        },
        {
          name: "get_brands",
          description: "Lấy danh sách các thương hiệu giày có trong cửa hàng",
        }
      ]
    }
  ]
});

// Dữ liệu Mock dự phòng khi không kết nối được DB
const MOCK_SNEAKERS = [
  { id: 1, name: "Nike Air Max 270", brand: "Nike", description: "Giày chạy bộ êm ái", variants: [{ price: 3500000, size: 40 }, { price: 3500000, size: 41 }] },
  { id: 2, name: "Adidas Ultraboost 22", brand: "Adidas", description: "Đệm Boost cực nhẹ", variants: [{ price: 4200000, size: 39 }, { price: 4200000, size: 42 }] },
  { id: 3, name: "Puma Cali Dream", brand: "Puma", description: "Phong cách đường phố", variants: [{ price: 2100000, size: 37 }, { price: 2100000, size: 38 }] },
];

const MOCK_BRANDS = [
  { id: 1, name: "Nike" },
  { id: 2, name: "Adidas" },
  { id: 3, name: "Puma" },
  { id: 4, name: "New Balance" }
];

// Định nghĩa logic thực thi cho các tools
const functions = {
  search_sneakers: async ({ query, brand }) => {
    try {
      const sneakers = await prisma.sneaker.findMany({
        where: {
          OR: [
            query ? { name: { contains: query } } : {},
            brand ? { brand: { name: { contains: brand } } } : {}
          ]
        },
        include: {
          brand: true,
          variants: true
        },
        take: 5
      });
      
      const results = sneakers.length > 0 ? sneakers : (
        MOCK_SNEAKERS.filter(s => 
          (!query || s.name.toLowerCase().includes(query.toLowerCase())) &&
          (!brand || s.brand.toLowerCase().includes(brand.toLowerCase()))
        )
      );

      if (results.length === 0) return { message: "Không tìm thấy sản phẩm nào phù hợp." };
      
      return results.map(s => ({
        id: s.id,
        name: s.name,
        brand: s.brand?.name || s.brand,
        description: s.description,
        price_range: s.variants.length > 0 ? `${Math.min(...s.variants.map(v => v.price))} - ${Math.max(...s.variants.map(v => v.price))} VNĐ` : "Chưa có giá",
        sizes: [...new Set(s.variants.map(v => v.size))].sort()
      }));
    } catch (error) {
      console.warn("Prisma error, using MOCK data:", error.message);
      const results = MOCK_SNEAKERS.filter(s => 
        (!query || s.name.toLowerCase().includes(query.toLowerCase())) &&
        (!brand || s.brand.toLowerCase().includes(brand.toLowerCase()))
      );
      return results.map(s => ({
        id: s.id,
        name: s.name,
        brand: s.brand,
        description: s.description,
        price_range: s.variants.length > 0 ? `${Math.min(...s.variants.map(v => v.price))} - ${Math.max(...s.variants.map(v => v.price))} VNĐ` : "Chưa có giá",
        sizes: [...new Set(s.variants.map(v => v.size))].sort()
      }));
    }
  },
  get_brands: async () => {
    try {
      const brands = await prisma.brand.findMany();
      if (brands.length > 0) return brands.map(b => ({ id: b.id, name: b.name }));
      return MOCK_BRANDS;
    } catch (error) {
      return MOCK_BRANDS;
    }
  }
};



app.use(cors());
app.use(bodyParser.json());

// Phục vụ file tĩnh
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Config multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// ===== Dữ liệu sẵn =====
let users = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: "123456",
    role: "ADMIN",
  },
  {
    name: "Staff",
    email: "staff@example.com",
    password: "123456",
    role: "STAFF",
  },
  {
    name: "Người mua",
    email: "customer@example.com",
    password: "123456",
    role: "CUSTOMER",
  },
];

let orders = [
  {
    id: 1,
    variantId: 101,
    productName: "Nike Air Max",
    qty: 2,
    price: 2500000,
    date: new Date("2026-04-10"),
  },
  {
    id: 2,
    variantId: 102,
    productName: "Adidas Ultraboost",
    qty: 1,
    price: 3000000,
    date: new Date("2026-04-12"),
  },
  {
    id: 3,
    variantId: 101,
    productName: "Nike Air Max",
    qty: 1,
    price: 2500000,
    date: new Date("2026-04-15"),
  },
];

// ===== Routes =====

// Test backend
app.get("/", (req, res) => {
  res.send("Backend SNK is running!");
});

// Tải ảnh lên
app.post("/api/products/upload", upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không có file được tải lên" });
  }
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// Đăng nhập
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user)
    return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

  // Fake token
  const access_token =
    "fake-jwt-token-" + Math.random().toString(36).substr(2, 9);

  res.json({ access_token, user });
});

// Đăng ký
app.post("/api/auth/register", (req, res) => {
  const { email, password, name, phone, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
  }

  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ message: "Email đã tồn tại" });
  }

  const newUser = { email, password, role: role.toUpperCase() };
  users.push(newUser);

  res.json({ message: "Đăng ký thành công", user: newUser });
});

// API thống kê cho seller/admin
app.get("/api/stats", (req, res) => {
  const { role } = req.query; // ADMIN / STAFF

  const totalOrders = orders.length;

  const productStats = {};
  orders.forEach((o) => {
    if (!productStats[o.productName])
      productStats[o.productName] = { qty: 0, revenue: 0 };
    productStats[o.productName].qty += o.qty;
    productStats[o.productName].revenue += o.qty * o.price;
  });

  let totalRevenue = 0;
  if (role === "ADMIN") {
    totalRevenue = orders.reduce((sum, o) => sum + o.qty * o.price, 0);
  }

  res.json({ totalOrders, productStats, totalRevenue });
});

// API Quản lý Người dùng (Dành cho Admin)
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.put("/api/users/:email", (req, res) => {
  const { email } = req.params;
  const { role } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

  if (role) user.role = role.toUpperCase();
  res.json({ message: "Cập nhật thành công", user });
});

app.delete("/api/users/:email", (req, res) => {
  const { email } = req.params;
  users = users.filter((u) => u.email !== email);
  res.json({ message: "Xóa thành công" });
});

// ===== REST API ChatBot (thay thế Socket) =====
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: "Thiếu nội dung tin nhắn" });

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    return res.status(500).json({ error: "GEMINI_API_KEY chưa được cấu hình trong file .env" });
  }

  try {
    // Khởi tạo chat với lịch sử hội thoại
    const chatHistory = (history || []).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({ history: chatHistory });
    let result = await chat.sendMessage(message);
    let response = result.response;

    // Xử lý Tool Calls nếu có
    const call = response.functionCalls();
    if (call && call.length > 0) {
      const toolResults = {};
      for (const fnCall of call) {
        const fnName = fnCall.name;
        const fnArgs = fnCall.args;
        console.log(`AI gọi tool: ${fnName}`, fnArgs);
        
        if (functions[fnName]) {
          toolResults[fnName] = await functions[fnName](fnArgs);
        }
      }

      // Gửi kết quả tool lại cho AI để nó tổng hợp câu trả lời
      const parts = Object.entries(toolResults).map(([name, content]) => ({
        functionResponse: { name, response: { content } }
      }));
      
      result = await chat.sendMessage(parts);
      response = result.response;
    }

    const reply = response.text();
    res.json({ reply });

  } catch (err) {
    console.error("Gemini API error:", err.message);
    res.status(500).json({ error: "Lỗi kết nối AI: " + err.message });
  }
});

// ===== Socket.io (giữ lại tương thích cũ) =====
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

// ===== Start server =====
httpServer.listen(PORT, () => {
  console.log(`Backend SNK running at http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    console.warn("⚠️  GEMINI_API_KEY chưa được cấu hình! ChatBot AI sẽ không hoạt động.");
  } else {
    console.log("✅ Gemini AI ChatBot đã sẵn sàng!");
  }
});
