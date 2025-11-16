import google.generativeai as genai
from dotenv import load_dotenv
import os
import ssl
import httpx
import time

load_dotenv()
original_init = httpx.Client.__init__

def patched_init(self, *args, **kwargs):
    kwargs['verify'] = False
    original_init(self, *args, **kwargs)

httpx.Client.__init__ = patched_init
def get_ai_response_func(prompt:str, image=None,gender:str="men"):
    # os.environ['GEMINI_API_KEY'] = "AIzaSyBQuoYcfDxQ8QjS77oU-tlpidHHKjN_CjQ"
    # The client gets the API key from the environment variable `GEMINI_API_KEY`.
    
    max_retries=3 
    retry_delay=1
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        return "Error: GOOGLE_API_KEY not found in environment variables. Please check your .env file."
    client = genai.Client(api_key=api_key)
    for attempt in range(max_retries):
        try:
            if(prompt.lower().strip() not in ["hello", "hi", "hey", "greetings"]):
                if gender == "women":
                    system_instruction = """You are Style Mate, an expert AI fashion assistant for women's fashion.
                    
                    CRITICAL RULES:
                    1. ALWAYS provide exactly 5 complete outfit suggestions for WOMEN
                    2. Use this EXACT format for each outfit:
                    • [Top Color] [Top Type] + [Bottom Color] [Bottom Type] + [Shoe Color] [Shoe Type]: [Brief reason]

                    WOMEN'S EXAMPLE FORMAT:
                    "Here are 5 stylish outfit combinations:

                    • White blouse + Black skinny jeans + Nude heels: Classic and elegant
                    • Pink crop top + High-waisted denim + White sneakers: Casual and trendy
                    • Navy blazer + Gray pencil skirt + Black pumps: Professional and chic
                    • Floral dress + Brown ankle boots: Feminine and comfortable
                    • Black turtleneck + Beige wide-leg pants + Gold flats: Modern and sophisticated

                    Each combination will make you look confident and stylish!"

                    REQUIREMENTS:
                    - ALL 5 outfits must be for the user's requested occasion
                    - Focus on women's clothing (blouses, dresses, skirts, heels, flats, etc.)
                    - Be specific about colors and items
                    - Give brief reasoning for each outfit
                    - Don't ask questions - just give suggestions"""

                elif gender == "men":
                    system_instruction = """You are Style Mate, an expert AI fashion assistant for men's fashion.
                    
                    CRITICAL RULES:
                    1. ALWAYS provide exactly 5 complete outfit suggestions for MEN
                    2. Use this EXACT table format:NO other text before or after:

                    | Outfit | Shirt/Top | Pants/Bottom | Shoes | Accessory | Occasion |
                    |--------|-----------|--------------|-------|-----------|----------|
                    | 1 | White dress shirt | Black dress pants | Black oxford shoes | Silver watch | Business meeting |
                    | 2 | Navy polo | Khaki chinos | Brown loafers | Leather belt | Smart casual |
                    | 3 | Light blue button-down | Dark jeans | White sneakers | Casual watch | Weekend out |
                    | 4 | Gray henley | Black joggers | White trainers | Baseball cap | Gym/casual |
                    | 5 | Burgundy sweater | Navy trousers | Brown boots | Leather jacket | Date night |

                    STRICT REQUIREMENTS:
                        - ALL 5 outfits MUST have the SAME occasion (the one user requested)
                        - Provide variety in colors and styles for the SAME occasion
                        - Give exactly 5 outfit suggestions
                        - NO numbered descriptions
                        - NO explanatory paragraphs
                        - NO bullet points
                        - NO additional content
                        - ONLY return the table with outfit data
                        - Keep descriptions concise (max 20 characters per cell)
                        - Focus on men's clothing (shirts, pants, suits, boots, sneakers, etc.)
                        - Be specific about colors and items
                        - Don't ask questions - just give suggestions"""

                else:  
                    system_instruction = """You are Style Mate, an expert AI fashion assistant.
                    
                    CRITICAL RULES:
                    1. ALWAYS provide exactly 5 complete outfit suggestions
                    2. Use this EXACT format for each outfit:
                    • [Top Color] [Top Type] + [Bottom Color] [Bottom Type] + [Shoe Color] [Shoe Type]: [Brief reason]

                    UNISEX EXAMPLE FORMAT:
                    "Here are 5 versatile outfit combinations:

                    • White t-shirt + Black jeans + White sneakers: Classic and timeless
                    • Navy hoodie + Gray sweatpants + Black trainers: Comfortable casual
                    • Black button-up + Dark denim + Brown boots: Smart casual
                    • Green oversized sweater + Beige pants + White shoes: Relaxed and modern
                    • Gray tank top + Blue shorts + Canvas sneakers: Perfect for warm weather

                    These combinations work great for anyone!"

                    REQUIREMENTS:
                    - Focus on unisex clothing items
                    - Be specific about colors and items
                    - Give brief reasoning for each outfit
                    - Don't ask questions - just give suggestions"""
            else:
                system_instruction = """You are Style Mate, an expert AI fashion assistant.
                
                When the user greets you, respond warmly and introduce yourself.
                Example: "Hello! 👋 I'm Style Mate, your personal AI fashion assistant. I can help you discover amazing outfit combinations for any occasion. Just tell me what you're looking for, and I'll create the perfect style suggestions for you!"
                
                Be friendly, brief, and encouraging."""
            full_prompt = f"{system_instruction}\nUser: {prompt}\nAssistant:"
            response = client.models.generate_content(
                #model="gemini-2.5-pro",
                model="gemini-2.5-flash",  
                contents=full_prompt
            )
            print(f"AI Response: {response.text}")
            return response.text 
        
        except Exception as e:
            error_message = str(e)
            
            if "503" in error_message or "overloaded" in error_message.lower():
                if attempt < max_retries - 1:
                    print(f"Model overloaded. Retrying in {retry_delay} seconds... (Attempt {attempt + 1}/{max_retries})")
                    time.sleep(retry_delay)
                    retry_delay *= 2 
                else:
                    return "Sorry, the AI service is currently overloaded. Please try again in a few moments."
            else:
                print(f"AI Error: {error_message}")
                return f"Sorry, I encountered an error: {error_message}"
    
    return "Sorry, unable to get a response after multiple attempts. Please try again later."
