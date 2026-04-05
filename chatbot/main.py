import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("gemini_key")

client = genai.Client(api_key=API_KEY)

system_context = None

with open("context.txt", "r", encoding="utf-8") as f:
    system_context = f.read()


prompt = input("Bắt đầu")

chat_session = client.chats.create(
    model='gemini-2.5-flash',
    config=types.GenerateContentConfig(
        system_instruction=system_context,
        temperature=0.2 
    )
)

print("🤖 Chatbot bán hàng đã sẵn sàng! (Gõ 'thoat' để dừng cuộc trò chuyện)")
print("-" * 60)

while True:
    prompt = input("🧑 Khách hàng: ")
    
    if prompt.lower() in ['thoat', 'quit', 'exit', 'q']:
        print("🤖 Chatbot: Dạ em cảm ơn anh/chị. Hẹn gặp lại anh/chị ạ!")
        break
    
    if not prompt.strip():
        continue

    response = chat_session.send_message(prompt)
    print(f"🤖 Chatbot: {response.text}\n")