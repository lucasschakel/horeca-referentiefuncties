'use client'

import '@/app/globals.css'
import { useState, useEffect, useRef } from 'react'
import { ToastProvider, useToast } from "@/components/ToastContext"
import { ToastContainer } from "@/components/ui/ToastContainer"
import { callOpenAIAssistant } from "@/lib/openAi"
import { translations } from '@/locales/translations'
import { ExampleQuestion } from '@/components/ui/ExampleQuestion'
import MessageBubble from '@/components/ui/MessageBubble'
import ThinkingAnimation from '@/components/ui/ThinkingAnimation'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import Image from 'next/image'

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
  const inputRef = useRef<HTMLInputElement>(null)
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
    const isMobileDevice = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Focus the input only if it's not a mobile device
    if (!isMobileDevice() && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    scrollToBottom()
    // Add a small delay to ensure scrolling after the DOM has updated
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
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
      <Header 
        title={t.title}
        language={language}
        onLanguageChange={handleLanguageChange}
        onRefresh={handleRefresh}
        showRefresh={messages.length > 0}
      />
      
      <main className="relative flex h-full w-full overflow-hidden transition-colors flex-1 flex-col">
        <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="flex flex-col items-center justify-start h-full text-sm">
                {messages.length === 0 ? (
                  <div className="w-full md:max-w-2xl lg:max-w-3xl px-4 py-8 flex flex-col items-center justify-center h-full">
                    <div className="flex justify-center mb-4">
                      <div className="w-[40px] h-[40px] relative">
                        <Image
                          src="/soigne-e.svg"
                          alt="Soigne Logo"
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    </div>
                    <p className="text-center text-muted-foreground mb-6">
                      {t.startPrompt}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 gap-3 w-full">
                      {t.exampleQuestions.map((question, index) => (
                        <ExampleQuestion
                          key={index}
                          onClick={() => handleSendMessage(question)}
                          className={`text-left h-auto whitespace-normal ${index === 3 ? 'hidden md:block' : ''}`}
                        >
                          {question}
                        </ExampleQuestion>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full md:max-w-2xl lg:max-w-3xl p-4 md:pb-8 flex flex-col">
                    {messages.map((message, index) => (
                      <MessageBubble key={index} role={message.role} content={message.content} />
                    ))}
                    {isThinking && <ThinkingAnimation thinkingText={t.thinking} />}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer 
        inputRef={inputRef}
        inputMessage={inputMessage}
        onInputChange={(e) => setInputMessage(e.target.value)}
        onSendMessage={() => handleSendMessage(inputMessage)}
        placeholderText={messages.length === 0 ? t.inputPlaceholderInitial : t.inputPlaceholderOngoing}
        poweredByText={t.poweredBy}
      />
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