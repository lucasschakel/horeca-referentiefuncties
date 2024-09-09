import React from 'react'
import Image from 'next/image'
import { ExampleQuestion } from '@/components/ui/ExampleQuestion'

export interface Translations {
  title: string
  startPrompt: string
  inputPlaceholderInitial: string
  inputPlaceholderOngoing: string
  poweredBy: string
  thinking: string
  exampleQuestions: string[]
}

interface EmptyStateProps {
  t: Translations
  onSendMessage: (message: string) => void
}

const EmptyState: React.FC<EmptyStateProps> = ({ t, onSendMessage }) => {
  return (
    <>
      <div className="mb-6 flex flex-col items-center">
        <div className="relative mb-4 h-[40px] w-[40px]">
          <Image
            src="/Soigne-e.svg"
            alt="Soigne Logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <p className="text-center text-[15px] leading-6 text-muted-foreground md:text-[16px]">
          {t.startPrompt}
        </p>
      </div>
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-2">
        {t.exampleQuestions.map((question: string, index: number) => (
          <ExampleQuestion
            key={index}
            onClick={() => onSendMessage(question)}
            className={`h-auto whitespace-normal text-left ${
              index === 3 ? 'hidden md:block' : ''
            }`}
          >
            {question}
          </ExampleQuestion>
        ))}
      </div>
    </>
  )
}

export default EmptyState
