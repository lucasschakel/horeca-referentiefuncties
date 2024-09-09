'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useToast } from '@/components/ToastContext'
import { callOpenAIAssistant } from '@/lib/openAi'
import { translations } from '@/locales/translations'
import ChatLayout from '@/components/ui/ChatLayout'
import EmptyState from '@/components/ui/EmptyState'
import ChatBubble from '@/components/ui/ChatBubble'

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

export default function Home() {
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
    <ChatLayout
      title={t.title}
      language={language}
      onLanguageChange={handleLanguageChange}
      onRefresh={handleRefresh}
      showRefresh={messages.length > 0}
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
    >
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
    </ChatLayout>
  )
}

const ChatMessages: React.FC<{
  messages: Message[]
  isThinking: boolean
  t: Translations
  messagesEndRef: React.RefObject<HTMLDivElement>
}> = ({ messages, isThinking, t, messagesEndRef }) => (
  <div>
    {messages.map((message, index) => (
      <ChatBubble key={index} role={message.role} content={message.content} />
    ))}
    {isThinking && (
      <ChatBubble role="thinking" content="" thinkingText={t.thinking} />
    )}
    <div ref={messagesEndRef} />
  </div>
)
