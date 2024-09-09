'use client'

import React from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

interface ChatLayoutProps {
  children: React.ReactNode
  title: string
  language: string
  onLanguageChange: () => void
  onRefresh: () => void
  showRefresh: boolean
  inputRef: React.RefObject<HTMLInputElement>
  inputMessage: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSendMessage: () => void
  placeholderText: string
  poweredByText: string
  isEmpty: boolean
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  children,
  title,
  language,
  onLanguageChange,
  onRefresh,
  showRefresh,
  inputRef,
  inputMessage,
  onInputChange,
  onSendMessage,
  placeholderText,
  poweredByText,
  isEmpty,
}) => {
  return (
    <>
      <Header
        title={title}
        language={language}
        onLanguageChange={onLanguageChange}
        onRefresh={onRefresh}
        showRefresh={showRefresh}
      />
      <main
        className={`flex-1 overflow-y-auto ${isEmpty ? 'flex items-center' : ''}`}
      >
        <div
          className={`mx-auto w-full max-w-2xl px-3 ${isEmpty ? 'py-0 pb-[40px]' : 'py-4'} md:px-0`}
        >
          {children}
        </div>
      </main>
      <Footer
        inputRef={inputRef}
        inputMessage={inputMessage}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
        placeholderText={placeholderText}
        poweredByText={poweredByText}
      />
    </>
  )
}

export default ChatLayout
