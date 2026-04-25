const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "e:/Thuc_hanh_nghe_nghiep/doan_CK/SNK/backend/SNK_Shop/.env" });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    const models = data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name);
    console.log(models);
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();
