/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToastProvider, useToast } from "@/components/ui/toastContext"
import { ToastContainer } from "@/components/ui/toastContainer"
import { callOpenAIAssistant } from "@/lib/openAi"
import { translations } from '@/locales/translations'
import '@/app/globals.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function HorecaReferentiefunctiesChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [language, setLanguage] = useState('nl')
  const [cancelToken, setCancelToken] = useState<AbortController | null>(null);

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isThinking])

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'nl';
    setLanguage(savedLanguage);
  }, []);
  
  const handleLanguageChange = () => {
    const newLanguage = language === 'nl' ? 'en' : 'nl';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleRefresh = () => {
    if (cancelToken) {
      cancelToken.abort();
    }
    setMessages([])
    setIsThinking(false)
    setInputMessage('')
  }
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return
  
    const userMessage: Message = { role: 'user', content: message }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsThinking(true)
  
    const abortController = new AbortController();
    setCancelToken(abortController);
  
    try {
      const response = await callOpenAIAssistant(message, abortController.signal)
      const assistantMessage: Message = { role: 'assistant', content: response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was aborted, do nothing
      } else {
        toast({
          title: "Error",
          description: "Failed to get a response.",
          variant: "destructive",
        })
      }
    } finally {
      setIsThinking(false)
      setCancelToken(null)
    }
  }

  const t = translations[language as keyof typeof translations]

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-white shadow-sm py-1 md:py-2 sticky top-0 z-10">
        <div className="mx-auto px-4 flex justify-between items-center">
          <h1 className="text-lg md:text-2xl font-semibold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {t.title}
          </h1>
          <div className="flex items-center space-x-2">
            {messages.length > 0 && (
              <button 
                className="p-2.5 rounded-full hover:bg-gray-100" 
                aria-label="Refresh Chat"
                onClick={handleRefresh}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
                </svg>
              </button>
            )}
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label={`Switch to ${language === 'nl' ? 'English' : 'Dutch'}`}
              onClick={handleLanguageChange}
            >
              <img 
                src={language === 'nl' ? '/flag-uk.svg' : '/flag-nl.svg'} 
                alt={language === 'nl' ? 'Switch to English' : 'Switch to Dutch'}
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow overflow-y-auto">
        <div className="max-w-2xl mx-auto h-full px-4 py-8">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="space-y-6">
                <p className="text-center text-muted-foreground">
                  {t.startPrompt}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 gap-2">
                  {t.exampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleSendMessage(question)}
                      className={`text-left h-auto whitespace-normal ${index === 3 ? 'hidden md:block' : ''}`}
                      noIcon={true}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                <div className={`flex items-start max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.role === 'assistant' && (
                    <div className="w-6 h-6 mr-2 rounded-full overflow-hidden flex-shrink-0">
                      <svg viewBox="0 0 12 12" className="w-full h-full">
                        <image href="/Soigne-e.svg" width="12" height="12" />
                      </svg>
                    </div>
                  )}
                  <div className={`px-4 py-2 md:py-2.5 my-0.5 md:my-1 rounded-xl text-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-[#E7E1DE]'}`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
          {isThinking && (
            <div className="flex justify-start mb-4">
              <div className="flex items-start max-w-[80%]">
                <div className="w-6 h-6 mr-2 rounded-full overflow-hidden flex-shrink-0">
                  <svg viewBox="0 0 12 12" className="w-full h-full">
                    <image href="/Soigne-e.svg" width="12" height="12" />
                  </svg>
                </div>
                <div className="mx-2 p-3 rounded-2xl bg-[#E7E1DE] animate-pulse">
                  <span className="inline-flex items-center">
                    {t.thinking}
                    <span className="ml-1">
                      <span className="thinking-dot">.</span>
                      <span className="thinking-dot">.</span>
                      <span className="thinking-dot">.</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white shadow-md py-3 md:py-4 sticky bottom-0 z-10">
        <div className="max-w-2xl mx-auto px-4 flex flex-col space-y-3 md:space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder={messages.length === 0 ? "Stel je vraag" : "Typ je bericht"}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
            />
            <Button onClick={() => handleSendMessage(inputMessage)} className="w-10 sm:w-auto">
              {t.sendButton}
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
            <a 
              href="https://soigne.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
            >
              <span>{t.poweredBy}</span>
              <svg width="55" height="18" viewBox="0 0 55 18" className="inline-block">
                <image href="/soigne.svg" width="55" height="18" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <ToastProvider>
      <ToastContainer />
      <HorecaReferentiefunctiesChat />
    </ToastProvider>
  )
}