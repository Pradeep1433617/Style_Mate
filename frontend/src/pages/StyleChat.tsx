import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Send, Home, Sparkles, User, Bot, Plus, MessageSquare, Trash2, Menu, X, Shirt, Award, ShoppingBag, LogOut,AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface OutfitData {
  outfit: string;
  shirt: string;
  pants: string;
  shoes: string;
  accessory: string;
  occasion: string;
}

// Helper function to parse markdown table
const parseMarkdownTable = (text: string): OutfitData[] | null => {
  const lines = text.trim().split('\n');
  if (lines.length < 3) return null;

  // Check if it's a table
  if (!lines[0].includes('|') || !lines[1].includes('|')) return null;

  const outfits: OutfitData[] = [];
  
  // Skip header (line 0) and separator (line 1), parse data rows
  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i].split('|').map(cell => cell.trim()).filter(cell => cell);
    if (cells.length >= 6) {
      outfits.push({
        outfit: cells[0],
        shirt: cells[1],
        pants: cells[2],
        shoes: cells[3],
        accessory: cells[4],
        occasion: cells[5],
      });
    }
  }

  return outfits.length > 0 ? outfits : null;
};

// Outfit Card Component
const OutfitCard = ({ outfit, index }: { outfit: OutfitData; index: number }) => {
  const colors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
  ];
  
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 hover:border-purple-400">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${colors[index % colors.length]} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5" />
            Outfit {outfit.outfit}
          </h3>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
            {outfit.occasion}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Shirt/Top */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
            <Shirt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-semibold uppercase">Top</p>
            <p className="text-sm font-medium">{outfit.shirt}</p>
          </div>
        </div>

        {/* Pants/Bottom */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-semibold uppercase">Bottom</p>
            <p className="text-sm font-medium">{outfit.pants}</p>
          </div>
        </div>

        {/* Shoes */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-semibold uppercase">Footwear</p>
            <p className="text-sm font-medium">{outfit.shoes}</p>
          </div>
        </div>

        {/* Accessory */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-semibold uppercase">Accessories</p>
            <p className="text-sm font-medium">{outfit.accessory}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-muted/30 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs group-hover:bg-purple-100 dark:group-hover:bg-purple-900 transition-colors"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Save This Look
        </Button>
      </div>
    </Card>
  );
};

// Message Content Component with Card Layout
const MessageContent = ({ content }: { content: string }) => {
  const outfits = parseMarkdownTable(content);

  if (outfits) {
    return (
      <div className="space-y-4">
        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Here are your personalized outfit suggestions:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {outfits.map((outfit, index) => (
            <OutfitCard key={index} outfit={outfit} index={index} />
          ))}
        </div>
      </div>
    );
  }

  // Regular text with line breaks
  return <p className="text-sm md:text-base whitespace-pre-line break-words">{content}</p>;
};

const StyleChat = () => {
   const [showGenderWarning, setShowGenderWarning] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "Welcome Chat",
      messages: [
        {
          id: "1",
          role: "assistant",
          content: "Hello! I'm your personal style assistant. I can help you find the perfect outfit for any occasion. What are you looking to style today?",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    },
  ]);
  const [gender, setGender] = useState<'men' | 'women' | 'unisex' | null>(null);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userGender');
      
      toast({
        title: "Logged out successfully",
        description: "See you again soon!",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const [currentChatId, setCurrentChatId] = useState("1");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChatSwitch = (chatId: string) => {
    setCurrentChatId(chatId);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const suggestedPrompts = [
    "What should I wear to a job interview?",
    "Suggest a casual weekend outfit",
    "I have a date tonight, what should I wear?",
    "Business casual outfit for summer",
  ];

  // Replace lines 246-290 with this COMPLETE function:

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      console.log('🚀 Sending message to backend:', userMessage);
      console.log('👤 Selected gender:', gender);
      
      // ✅ Hardcode for testing
      const API_URL = 'https://style-mate-paxh.onrender.com';
      
      // ✅ Debug logging
      console.log('🔗 API_URL being used:', API_URL);
      console.log('🔍 Env variable:', import.meta.env.VITE_API_URL);
      console.log('🔍 All env vars:', import.meta.env);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      // ✅ Debug logs to see what's happening
      console.log('🔗 API URL being used:', API_URL);
      console.log('🔍 Environment Mode:', import.meta.env.MODE);
      console.log('🔍 Raw VITE_API_URL:', import.meta.env.VITE_API_URL);
      console.log('🔍 All env vars:', import.meta.env);
      
      // ✅ Make the API call
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          gender: gender || 'unisex'
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      console.log('✅ Response status:', response.status);
      console.log('✅ Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      
      if (data.status === 'success') {
        return data.response;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error: any) {
      console.error('❌ Error calling backend:', error);
      console.error('❌ Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      
      toast({
        title: "Connection Error",
        description: `Could not connect to ${API_URL}. Please check if the backend is accessible.`,
        variant: "destructive",
      });
      
      return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment!";
    }
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [
        {
          id: "1",
          role: "assistant",
          content: "Hello! I'm your personal style assistant. I can help you find the perfect outfit for any occasion. What are you looking to style today?",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const deleteChat = (chatId: string) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    if (currentChatId === chatId && updatedChats.length > 0) {
      setCurrentChatId(updatedChats[0].id);
    } else if (updatedChats.length === 0) {
      createNewChat();
    }
  };

  const handleSend = async () => {
    console.log('handleSend called'); // Debug log
    console.log('Current gender:', gender); // Debug log
    console.log('Input value:', input.trim()); // Debug log
    if (!input.trim()) {
      console.log('Input is empty, returning');
      return;
    }
    // ✅ FIXED: Check gender with explicit null check
    // ✅ Check gender BEFORE checking currentChat
    if (gender === null || gender === undefined) {
      console.log('Gender not selected, showing toast'); // Debug log
      setShowGenderWarning(true);
      setTimeout(() => setShowGenderWarning(false), 4000);
      toast({
        title: "⚠️ Gender Selection Required",
        description: "Please select a style preference (Men/Women/Unisex) before sending your message.",
        variant: "destructive",
      });
      return; // Stop execution
    }
    if (!currentChat) {
    console.log('No current chat');
    return;
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const updatedChats = chats.map((chat) => {
      if (chat.id === currentChatId) {
        const newTitle = chat.messages.length === 1 ? input.slice(0, 30) + "..." : chat.title;
        return {
          ...chat,
          title: newTitle,
          messages: [...chat.messages, userMessage],
        };
      }
      return chat;
    });

    setChats(updatedChats);
    const userPrompt = input;
    setInput("");
    setIsTyping(true);

    try {
      const aiResponseText = await getAIResponse(userPrompt);
      
      console.log('AI Response received:', aiResponseText);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponseText,
        timestamp: new Date(),
      };
      
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, aiResponse] }
            : chat
        )
      );
    } catch (error) {
      console.error('Error in handleSend:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-50 md:z-0 w-64 md:w-64 transition-transform duration-300 border-r bg-card h-full flex flex-col`}
      >
        <div className="p-3 md:p-4 border-b">
          <Button
            onClick={createNewChat}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm md:text-base"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-xs text-muted-foreground px-3 py-2 font-semibold">Chat History</p>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-2 p-2 md:p-3 rounded-lg mb-1 cursor-pointer hover:bg-muted ${
                currentChatId === chat.id ? "bg-muted" : ""
              }`}
              onClick={() => handleChatSwitch(chat.id)}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm truncate">{chat.title}</p>
                <p className="text-xs text-muted-foreground">
                  {chat.messages.length} messages
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
              >
                <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>

        <div className="p-3 md:p-4 border-t">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full text-sm md:text-base"
            size="sm"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b bg-card flex-shrink-0">
          <div className="px-3 md:px-4 py-3 md:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex-shrink-0 md:hidden"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div className="min-w-0">
                <h1 className="text-base md:text-xl font-bold flex items-center gap-2 truncate">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-600 flex-shrink-0" />
                  <span className="truncate">Style Mate</span>
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">AI-Powered Fashion Advisor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 md:gap-4 mb-4 md:mb-6 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                )}
                
                <div
                  className={`${
                    message.role === "user"
                      ? "max-w-[85%] md:max-w-[80%]"
                      : "flex-1"
                  }`}
                >
                  <Card
                    className={`p-3 md:p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-muted"
                    }`}
                  >
                    <MessageContent content={message.content} />
                    <p className={`text-xs mt-2 ${
                      message.role === "user" ? "text-white/70" : "text-muted-foreground"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </Card>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <Card className="p-3 md:p-4 bg-muted">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="max-w-6xl mx-auto px-3 md:px-4 pb-3 md:pb-4 flex-shrink-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">Suggested questions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-2 md:py-3 text-xs md:text-sm"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Gender Selection + Input Area */}
        <div className="border-t bg-card flex-shrink-0">
          <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
            {/* Warning Alert */}
            {showGenderWarning && (
              <Alert variant="destructive" className="mb-3 animate-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Gender Selection Required</AlertTitle>
                <AlertDescription>
                  Please select a style preference (Men/Women/Unisex) before sending your message.
                </AlertDescription>
              </Alert>
            )}
            {/* Gender Selector - Compact & Refined */}
            <div className="mb-3 flex items-center justify-center">
              
              <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg p-1 gap-1 shadow-md backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50">
                {/* Men Button */}
                <button
                  onClick={() => {
                    setGender('men');
                    toast({
                      title: "👔 Men's Style Selected",
                      description: "I'll suggest stylish outfits for men!",
                    });
                  }}
                  className={`
                    relative px-3 py-2 rounded-md text-xs font-semibold transition-all duration-300 ease-out
                    transform hover:scale-105
                    ${gender === 'men' 
                      ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 text-white shadow-lg scale-105 ring-2 ring-blue-300 dark:ring-blue-700' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-sm'
                    }
                  `}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span className={`text-base transition-transform duration-300 ${gender === 'men' ? 'animate-bounce' : ''}`}>
                      👔
                    </span>
                    <span className="hidden sm:inline">Men</span>
                  </span>
                  {gender === 'men' && (
                    <>
                      <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 animate-pulse"></span>
                      <span className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 opacity-10 animate-ping"></span>
                    </>
                  )}
                </button>

                {/* Women Button */}
                <button
                  onClick={() => {
                    setGender('women');
                    toast({
                      title: "👗 Women's Style Selected",
                      description: "I'll suggest elegant outfits for women!",
                    });
                  }}
                  className={`
                    relative px-3 py-2 rounded-md text-xs font-semibold transition-all duration-300 ease-out
                    transform hover:scale-105
                    ${gender === 'women' 
                      ? 'bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 text-white shadow-lg scale-105 ring-2 ring-pink-300 dark:ring-pink-700' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-sm'
                    }
                    `}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span className={`text-base transition-transform duration-300 ${gender === 'women' ? 'animate-bounce' : ''}`}>
                      👗
                    </span>
                    <span className="hidden sm:inline">Women</span>
                  </span>
                  {gender === 'women' && (
                    <>
                      <span className="absolute inset-0 rounded-md bg-gradient-to-r from-pink-400 to-rose-400 opacity-20 animate-pulse"></span>
                      <span className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-pink-500 to-rose-500 opacity-10 animate-ping"></span>
                    </>
                  )}
                </button>

                {/* Unisex Button */}
                <button
                  onClick={() => {
                    setGender('unisex');
                    toast({
                      title: "✨ Unisex Style Selected",
                      description: "I'll suggest versatile outfits for everyone!",
                    });
                  }}
                  className={`
                    relative px-3 py-2 rounded-md text-xs font-semibold transition-all duration-300 ease-out
                    transform hover:scale-105
                    ${gender === 'unisex' 
                      ? 'bg-gradient-to-br from-purple-500 via-indigo-500 to-violet-600 text-white shadow-lg scale-105 ring-2 ring-purple-300 dark:ring-purple-700' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-sm'
                    }
                  `}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span className={`text-base transition-transform duration-300 ${gender === 'unisex' ? 'animate-bounce' : ''}`}>
                      ✨
                    </span>
                    <span className="hidden sm:inline">Unisex</span>
                  </span>
                  {gender === 'unisex' && (
                    <>
                      <span className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-400 to-indigo-400 opacity-20 animate-pulse"></span>
                      <span className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 opacity-10 animate-ping"></span>
                    </>
                  )}
                </button>
              </div>
            </div>
            {/* Input Box */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me about outfits..."
                className="flex-1 text-sm md:text-base"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping } // ✅ Disable if no gender
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex-shrink-0"
                size="icon"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center hidden sm:block">
              AI-powered styling assistant • Press Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StyleChat;

