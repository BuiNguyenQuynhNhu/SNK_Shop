import os
import requests
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("gemini_key")
API_BASE_URL = "http://localhost:3000"

client = genai.Client(api_key=API_KEY)

def get_all_brands() -> list[dict]:
    """Get a list of all available shoe brands from the store. Use this to know what brands are sold."""
    try:
        response = requests.get(f"{API_BASE_URL}/brands")
        if response.status_code == 200:
            return response.json()
        return [{"error": f"API error: {response.status_code}"}]
    except Exception as e:
        return [{"error": str(e)}]

def search_products(query: str, brand_name: str = None) -> list[dict]:
    """Search for sneakers in the store by name, description, or brand. Use this to help customers find products."""
    try:
        params = {}
        if query:
            params['search'] = query
            
        response = requests.get(f"{API_BASE_URL}/products", params=params)
        if response.status_code == 200:
            sneakers = response.json()
            
            # Filter by brand if specified
            if brand_name:
                sneakers = [
                    s for s in sneakers 
                    if s.get('brand') and brand_name.lower() in s['brand']['name'].lower()
                ]
                
            return sneakers[:5]
        return [{"error": f"API error: {response.status_code}"}]
    except Exception as e:
        return [{"error": str(e)}]

def get_product_details(sneaker_id: int) -> dict:
    """Get detailed information about a specific sneaker including its full description, available sizes, colors, price, and stock. Use this when a customer asks about sizes, colors, or details of a specific shoe."""
    try:
        response = requests.get(f"{API_BASE_URL}/products/{sneaker_id}")
        if response.status_code == 200:
            return response.json()
        return {"error": f"API error: {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}

def get_brand_details(brand_id: int) -> dict:
    """Get more information about a specific brand including its description and history. Use this when a customer asks to know more about a brand."""
    try:
        response = requests.get(f"{API_BASE_URL}/brands/{brand_id}")
        if response.status_code == 200:
            return response.json()
        return {"error": f"API error: {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}

system_context = """
Bạn là nhân viên tư vấn khách hàng nhiệt tình và lễ phép của cửa hàng sneaker 'SNK Store'.
Luôn xưng "em" và gọi khách là "anh/chị".
Bạn CÓ THỂ TÌM KIẾM SẢN PHẨM thông qua hệ thống của cửa hàng bằng công cụ search_products và xem danh sách thương hiệu bằng get_all_brands.
Bạn có thể xem chi tiết sản phẩm (size, màu sắc, tồn kho) bằng get_product_details và thông tin thương hiệu bằng get_brand_details.
Luôn sử dụng công cụ này để kiểm tra xem sản phẩm khách yêu cầu có tồn tại không, giá bao nhiêu, và cửa hàng còn những size/màu nào.
Tuyệt đối không tự bịa ra sản phẩm hoặc size nếu hệ thống không có.
Khi khách hỏi mua, nhờ tìm giày, hoặc hỏi về size/màu, hãy tư vấn dựa trên dữ liệu chi tiết bạn tìm được.
Giữ thái độ thân thiện, nhiệt tình và ưu tiên chốt đơn.
"""

prompt = input("Bắt đầu (Nhấn Enter để tiếp tục): ")

chat_session = client.chats.create(
    model='gemini-2.5-flash',
    config=types.GenerateContentConfig(
        system_instruction=system_context,
        temperature=0.2,
        tools=[get_all_brands, search_products, get_product_details, get_brand_details]
    )
)

print("🤖 Chatbot bán hàng đã sẵn sàng (API mode)! (Gõ 'thoat' để dừng cuộc trò chuyện)")
print("-" * 60)

while True:
    prompt = input("🧑 Khách hàng: ")
    
    if prompt.lower() in ['thoat', 'quit', 'exit', 'q']:
        print("🤖 Chatbot: Dạ em cảm ơn anh/chị. Hẹn gặp lại anh/chị ạ!")
        break
    
    if not prompt.strip():
        continue

    try:
        response = chat_session.send_message(prompt)
        print(f"🤖 Chatbot: {response.text}\n")
    except Exception as e:
        print(f"🤖 Lỗi kết nối AI: {e}\n(Vui lòng thử lại sau vì model có thể đang bị quá tải!)")