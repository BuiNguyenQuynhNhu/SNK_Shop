import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY!,
});

async function run() {
  const models = await ai.models.list();
  console.log(models);
}

run();