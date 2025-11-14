import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/toaster'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import StyleChat from './pages/StyleChat'
import Login from '@/pages/Login';

function App() {
  return (
    <ThemeProvider defaultMode="light" storageKey="ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/style-chat" element={<StyleChat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  )
}

export default App