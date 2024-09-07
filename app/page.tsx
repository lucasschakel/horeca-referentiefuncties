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
      
      <main className="flex-grow overflow-hidden flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 pt-2 pb-8 min-h-full flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-grow flex items-center justify-center">
                <div className="space-y-6">
                  <p className="text-center text-muted-foreground">
                    {t.startPrompt}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 gap-2">
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
              </div>
            ) : (
              <div>
                {messages.map((message, index) => (
                  <MessageBubble key={index} role={message.role} content={message.content} />
                ))}
                {isThinking && <ThinkingAnimation thinkingText={t.thinking} />}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      <Footer 
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