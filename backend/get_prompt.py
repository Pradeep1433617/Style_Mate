from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from get_response_from_ai import get_ai_response_func
import uvicorn
import os
import datetime
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

@app.get("/health")
async def health_check():
    """Health check endpoint to prevent sleep"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    print("=" * 60)
    print("Starting StyleMate Assistant Backend Server")
    print("AI Model: Google Gemini")
    print(f"Server URL: http://0.0.0.0:{port}")
    print(f"API Endpoint: http://0.0.0.0:{port}/api/chat")
    print(f"API Docs: http://0.0.0.0:{port}/docs")
    print("=" * 60)
    
    uvicorn.run(app, host="0.0.0.0", port=port)