'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ToastProvider, useToast } from '@/components/ToastContext'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { callOpenAIAssistant } from '@/lib/openAi'
import { translations } from '@/locales/translations'
import ChatBubble from '@/components/ui/ChatBubble'
import EmptyState from '@/components/ui/EmptyState'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Translations {
  title: string
  startPrompt: string
  inputPlaceholderInitial: string
  inputPlaceholderOngoing: string
  poweredBy: string
  thinking: string
  exampleQuestions: string[]
}

function HorecaReferentiefunctiesChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [language, setLanguage] = useState('nl')
  const [cancelToken, setCancelToken] = useState<AbortController | null>(null)

  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const link = document.createElement('link')
    link.href =
      'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  useEffect(() => {
    if (
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      inputRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    scrollToBottom()
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [messages, isThinking])

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'nl'
    setLanguage(savedLanguage)
  }, [])

  const handleLanguageChange = () => {
    const newLanguage = language === 'nl' ? 'en' : 'nl'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const handleRefresh = () => {
    cancelToken?.abort()
    setMessages([])
    setIsThinking(false)
    setInputMessage('')
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    setMessages((prev) => [...prev, { role: 'user', content: message }])
    setInputMessage('')
    setIsThinking(true)

    const abortController = new AbortController()
    setCancelToken(abortController)

    try {
      const response = await callOpenAIAssistant(
        message,
        abortController.signal
      )
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: 'Error',
          description: 'Failed to get a response.',
          variant: 'destructive',
        })
      }
    } finally {
      setIsThinking(false)
      setCancelToken(null)
    }
  }

  const t = translations[language as keyof typeof translations]

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        title={t.title}
        language={language}
        onLanguageChange={handleLanguageChange}
        onRefresh={handleRefresh}
        showRefresh={messages.length > 0}
      />
      <div
        className={`mx-auto w-full max-w-2xl px-3 pb-[56px] md:px-0 ${messages.length === 0 ? 'my-auto' : 'pb-32 pt-14'}`}
      >
        <main>
          {messages.length === 0 ? (
            <EmptyState t={t} onSendMessage={handleSendMessage} />
          ) : (
            <ChatMessages
              messages={messages}
              isThinking={isThinking}
              t={t}
              messagesEndRef={messagesEndRef}
            />
          )}
        </main>
      </div>
      <Footer
        inputRef={inputRef}
        inputMessage={inputMessage}
        onInputChange={(e) => setInputMessage(e.target.value)}
        onSendMessage={() => handleSendMessage(inputMessage)}
        placeholderText={
          messages.length === 0
            ? t.inputPlaceholderInitial
            : t.inputPlaceholderOngoing
        }
        poweredByText={t.poweredBy}
      />
    </div>
  )
}

const ChatMessages: React.FC<{
  messages: Message[]
  isThinking: boolean
  t: Translations
  messagesEndRef: React.RefObject<HTMLDivElement>
}> = ({ messages, isThinking, t, messagesEndRef }) => (
  <div className="">
    {messages.map((message, index) => (
      <article key={index}>
        <ChatBubble role={message.role} content={message.content} />
      </article>
    ))}
    {isThinking && (
      <article>
        <ChatBubble role="thinking" content="" thinkingText={t.thinking} />
      </article>
    )}
    <div ref={messagesEndRef} />
  </div>
)

export default function Page() {
  return (
    <ToastProvider>
      <ToastContainer />
      <HorecaReferentiefunctiesChat />
    </ToastProvider>
  )
}
