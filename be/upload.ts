import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";
import { BlobServiceClient } from "@azure/storage-blob";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

const ROOT_FOLDER = "/home/mi/Desktop/SNK_Shop/ut-zap50k-images";

// ================= ENV =================
function mustGetEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env: ${key}`);
  return value;
}

// ================= OLLAMA =================
const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llava"; // 👈 FIX: vision model

// ================= AZURE =================
const blobServiceClient = BlobServiceClient.fromConnectionString(
  mustGetEnv("AZURE_STORAGE_CONNECTION_STRING")
);

const containerClient = blobServiceClient.getContainerClient(
  mustGetEnv("AZURE_CONTAINER")
);

// ================= PROMPT =================
const PROMPT = `
You are a sneaker ecommerce data extraction system.

CRITICAL RULES:
- Output MUST be valid JSON ONLY
- NO markdown
- NO explanation
- NO extra text
- If unsure, guess reasonably

Return JSON:

{
  "brand": "",
  "model": "",
  "style": "",
  "colors": [],
  "material": "",
  "use_case": [],
  "gender": "",
  "tags": [],
  "description": "",
  "size": [38,39,40,41,42],
  "price": 120,
  "stock": 10
}
`;

// ================= FILE SCAN =================
function getAllImages(dir: string): string[] {
  const results: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      results.push(...getAllImages(full));
    } else if (/\.(jpg|jpeg|png)$/i.test(full)) {
      results.push(full);
    }
  }

  return results;
}

// ================= PATH PARSE =================
function parsePath(filePath: string) {
  const parts = filePath.split(path.sep);
  const idx = parts.indexOf("ut-zap50k-images");

  return {
    category: parts[idx + 1] || "Unknown",
    brandFolder: parts[idx + 3] || "Unknown",
  };
}

// ================= AZURE UPLOAD =================
async function uploadToAzure(filePath: string) {
  // Bypassing Azure upload: just use the local file path as the URL
  return filePath;
}

// ================= SAFE JSON =================
function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

// ================= OLLAMA ANALYZE =================
async function analyzeImage(filePath: string) {
  const imageBase64 = fs.readFileSync(filePath).toString("base64");

  const res = await axios.post(OLLAMA_URL, {
    model: MODEL,
    stream: false,
    prompt: PROMPT,
    images: [imageBase64],
  });

  return safeJsonParse(res.data.response);
}

// ================= MAIN =================
async function run() {
  console.log("🚀 START OLLAMA PIPELINE");

  const files = getAllImages(ROOT_FOLDER);
  console.log("📦 TOTAL IMAGES:", files.length);

  for (const file of files) {
    console.log("📸 Processing:", file);

    try {
      const { category, brandFolder } = parsePath(file);

      // 1. Upload image
      const imageUrl = await uploadToAzure(file);

      // 2. AI analyze
      const aiData = await analyzeImage(file);
      if (!aiData) {
        console.log("⚠️ Skip (AI failed)");
        continue;
      }

      // 3. Brand
      const finalBrand = aiData.brand || brandFolder;

      const brand = await prisma.brand.upsert({
        where: { name: finalBrand },
        update: {},
        create: { name: finalBrand },
      });

      // 4. Category
      const categoryDb = await prisma.category.upsert({
        where: { name: category },
        update: {},
        create: { name: category },
      });

      // 5. Media
      let media = await prisma.media.findUnique({ where: { url: imageUrl } });
      if (media) {
        console.log("⚠️ Skip (Already processed)");
        continue;
      }
      media = await prisma.media.create({
        data: {
          url: imageUrl,
          type: "SNEAKER",
          imageType: "MAIN",
        },
      });

      // 6. Sneaker
      const sneaker = await prisma.sneaker.create({
        data: {
          name: aiData.model || path.basename(file),
          description: aiData.description || "",
          brandId: brand.id,
          categoryId: categoryDb.id,
        },
      });

      // 7. Variants (batch insert FIX)
      const sizes = aiData.size?.length ? aiData.size : [40];

      await prisma.variant.createMany({
        data: sizes.map((size: number, index: number) => ({
          sneakerId: sneaker.id,
          color: aiData.colors?.[0] || "unknown",
          size,
          price: aiData.price || 99,
          stock: aiData.stock || 10,
          imageId: index === 0 ? media.id : null,
        })),
      });

      console.log("✅ DONE:", sneaker.id);
    } catch (err) {
      console.error("❌ ERROR:", err);
    }
  }

  await prisma.$disconnect();
}

run();