from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from get_response_from_ai import get_ai_response_func
import uvicorn

app = FastAPI()

received_messages = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "ChicEnsemble Style Assistant API is running!",
        "endpoints": ["/api/chat"],
        "ai_model": "Google Gemini"
    }

@app.post("/api/chat")
async def chat(request: Request):
    try:
        # Try to parse as JSON first
        try:
            data = await request.json()
            message = data.get('message', '')
            gender = data.get('gender', 'men')
            image = None
        except:
            # If JSON fails, try FormData
            form = await request.form()
            message = form.get('message', '')
            gender = form.get('gender', 'men')
            image = form.get('image', None)
        
        if not message:
            return {
                "status": "error",
                "error": "No message provided"
            }
        
        print("=" * 50)
        print("USER PROMPT:")
        print(message)
        print(f"Gender: {gender}")
        print("=" * 50)
        
        # Store the message
        received_messages.append({
            "message": message,
            "gender": gender
        })
        
        # Get AI response
        
        ai_response = get_ai_response_func(prompt=message, image=image)
        
        print("AI RESPONSE:")
        print(ai_response)
        print("=" * 50)
        
        return {
            "status": "success",
            "response": ai_response
        }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "status": "error",
            "error": str(e)
        }

@app.get("/messages")
async def get_messages():
    """Get all received messages"""
    return {
        "total": len(received_messages),
        "messages": received_messages
    }

if __name__ == "__main__":
    print("=" * 60)
    print("Starting ChicEnsemble Style Assistant Backend Server")
    print("AI Model: Google Gemini")
    print("Server URL: http://localhost:8001")
    print("API Endpoint: http://localhost:8001/api/chat")
    print("API Docs: http://localhost:8001/docs")
    print("=" * 60)
    
    uvicorn.run(app, host="0.0.0.0", port=8001)