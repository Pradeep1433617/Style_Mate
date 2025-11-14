# 👗 Style Mate - AI Fashion Companion

**Style Mate** is an intelligent AI-powered fashion assistant that helps users discover perfect outfit combinations for any occasion. Get personalized style suggestions for men, women, or unisex fashion with just a simple prompt!

![Style Mate Banner](https://img.shields.io/badge/AI-Fashion%20Assistant-purple?style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-Authentication-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-TypeScript-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-FastAPI-green?style=for-the-badge)

## ✨ Features

### 🎨 **AI-Powered Style Recommendations**
- Get 5 personalized outfit suggestions for any occasion
- Gender-specific styling (Men/Women/Unisex)
- Smart combination of tops, bottoms, shoes, and accessories
- Real-time chat interface with typing indicators

### 🔐 **Secure Authentication**
- Firebase email/password authentication
- Password reset functionality
- Session management with JWT tokens
- User-friendly error handling

### 💬 **Interactive Chat Experience**
- Multiple chat sessions with history
- Suggested prompts for quick styling ideas
- Beautiful markdown table rendering for outfit cards
- Responsive design for mobile and desktop

### 🌓 **Modern UI/UX**
- Dark/Light theme support
- Smooth animations and transitions
- Gradient designs with glassmorphism effects
- Gender selection with animated buttons

---

## 🚀 Tech Stack

### **Frontend**
- ⚛️ **React 18** with TypeScript
- 🎨 **Tailwind CSS** for styling
- 🔥 **Firebase** for authentication
- 🧩 **Shadcn UI** components
- 📱 **Vite** for fast development
- 🎭 **Lucide React** icons

### **Backend**
- 🐍 **Python 3.11+**
- ⚡ **FastAPI** for REST API
- 🤖 **Google Gemini AI** (gemini-2.0-flash-exp)
- 🔐 **python-dotenv** for environment variables
- 🌐 **HTTPX** for HTTP requests

---

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm/bun
- Python 3.11+
- Firebase account
- Google AI API key

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/style-mate.git
cd style-mate
```

### **2. Backend Setup**

#### Navigate to backend folder
```bash
cd backend
```

#### Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install dependencies
```bash
pip install -r requirements.txt
```

#### Create `.env` file
```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

#### Start the backend server
```bash
uvicorn get_prompt:app --reload --port 8001
```

**Backend will run on:** `http://localhost:8001`

---

### **3. Frontend Setup**

#### Navigate to frontend folder
```bash
cd frontend
```

#### Install dependencies
```bash
npm install
# or
bun install
```

#### Create `.env` file
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:8001
```

#### Start the development server
```bash
npm run dev
# or
bun dev
```

**Frontend will run on:** `http://localhost:5173`

---

## 🎯 Usage Guide

### **1. Sign Up / Login**
- Create a new account with email and password
- Or login with existing credentials
- Use "Forgot Password" to reset if needed

### **2. Select Gender Preference**
- Choose **Men** 👔 for men's fashion
- Choose **Women** 👗 for women's fashion
- Choose **Unisex** ✨ for versatile styles

### **3. Ask for Style Suggestions**
Example prompts:
- "Suggest outfits for a wedding"
- "What should I wear to a job interview?"
- "Casual weekend brunch outfit ideas"
- "Business formal attire for presentation"

### **4. View Outfit Recommendations**
- Get 5 complete outfit suggestions
- Each outfit includes:
  - Top/Shirt
  - Bottom/Pants
  - Shoes
  - Accessories
  - Occasion context

### **5. Manage Chats**
- Create new chat sessions
- Switch between previous conversations
- Delete old chat history
- All chats are saved locally

---

## 🔧 Configuration

### **Firebase Setup**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Email/Password Authentication**
4. Get your Firebase config credentials
5. Add them to `frontend/.env`

### **Google AI (Gemini) Setup**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to `backend/.env` as `GOOGLE_API_KEY`

---

## 📂 Project Structure

```
style-mate/
├── backend/
│   ├── get_prompt.py           # FastAPI main server
│   ├── get_response_from_ai.py # AI integration logic
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Backend environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Index.tsx       # Landing page
│   │   │   ├── Login.tsx       # Auth page
│   │   │   └── StyleChat.tsx   # Main chat interface
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/
│   │   │   └── firebase.ts     # Firebase configuration
│   │   └── hooks/              # Custom React hooks
│   ├── package.json
│   └── .env                    # Frontend environment variables
│
└── README.md                   # This file
```

---

## 🌟 Key Features Explained

### **Gender-Based Styling**
- **Men:** Table format with formal wear focus
- **Women:** Bullet-point format with elegant descriptions
- **Unisex:** Versatile casual and smart-casual options

### **AI Response Format**

#### Men's Fashion (Table)
| Outfit | Shirt/Top | Pants/Bottom | Shoes | Accessory | Occasion |
|--------|-----------|--------------|-------|-----------|----------|
| 1 | Light blue dress shirt | Navy dress pants | Brown oxfords | Silver watch | Wedding |

#### Women's Fashion (List)
• White blouse + Black skinny jeans + Nude heels: Classic and elegant

### **Error Handling**
- ✅ Gender selection required validation
- ✅ Firebase auth error messages
- ✅ Network error handling
- ✅ API retry mechanism (max 3 attempts)

---

## 🐛 Troubleshooting

### **Backend Issues**

**Problem:** `GOOGLE_API_KEY not found`
```bash
# Solution: Check backend/.env file exists and has valid API key
echo $GOOGLE_API_KEY  # Should not be empty
```

**Problem:** Port 8001 already in use
```bash
# Solution: Use a different port
uvicorn get_prompt:app --reload --port 8002
# Update VITE_API_URL in frontend/.env
```

### **Frontend Issues**

**Problem:** Firebase auth errors
```bash
# Solution: Verify Firebase credentials in frontend/.env
# Ensure Email/Password auth is enabled in Firebase Console
```

**Problem:** Gender warning not showing
```bash
# Solution: Check browser console for errors
# Verify toast notifications are working
# Clear browser cache and reload
```

---

## 📝 API Endpoints

### **POST** `/api/chat`
Send a chat message and get AI outfit suggestions.

**Request:**
```json
{
  "message": "Suggest outfits for a wedding",
  "gender": "men"
}
```

**Response:**
```json
{
  "status": "success",
  "response": "| Outfit | Shirt/Top | ... |"
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- [Firebase](https://firebase.google.com/) for authentication
- [Shadcn UI](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [FastAPI](https://fastapi.tiangolo.com/) for backend framework

---

## 📸 Screenshots

### Landing Page
![Landing Page](https://via.placeholder.com/800x400?text=Landing+Page)

### Login/Signup
![Auth Page](https://via.placeholder.com/800x400?text=Login+Page)

### Chat Interface
![Chat Interface](https://via.placeholder.com/800x400?text=Chat+Interface)

### Outfit Suggestions
![Outfit Cards](https://via.placeholder.com/800x400?text=Outfit+Suggestions)

---

## 🔮 Future Enhancements

- [ ] Image upload for style matching
- [ ] Save favorite outfits
- [ ] Shopping links integration
- [ ] Social sharing features
- [ ] Virtual wardrobe management
- [ ] Weather-based recommendations
- [ ] Color palette suggestions
- [ ] Brand recommendations

---

## 📊 Version History

### **v1.0.0** (Current)
- ✅ AI-powered outfit suggestions
- ✅ Gender-based styling
- ✅ Firebase authentication
- ✅ Chat history management
- ✅ Dark/Light theme
- ✅ Responsive design

---

## 💡 Tips

- Always select gender before asking for outfit suggestions
- Use specific occasion names for better results
- Try different prompts to explore various styles
- Save your favorite chats for future reference
- Enable notifications for password reset emails

---

## 📞 Support

Having issues? Reach out:
- 📧 Email: support@stylemate.com
- 💬 Discord: [Join Server](https://discord.gg/stylemate)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/style-mate/issues)

---

<div align="center">

**Made with ❤️ by Style Mate Team**

[⭐ Star this repo](https://github.com/yourusername/style-mate) | [🐛 Report Bug](https://github.com/yourusername/style-mate/issues) | [✨ Request Feature](https://github.com/yourusername/style-mate/issues)

</div>