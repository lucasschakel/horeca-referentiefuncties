import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const TIMEOUT_DURATION = 60000

function timeout(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  )
}

export async function POST(req: Request) {
  //Mock API and error handling
  if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
    const { message } = await req.json()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return NextResponse.json({
      response: `This is a mock response for the message: "${message}"`,
    })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    )
  }

  const controller = new AbortController()
  const { signal } = controller

  try {
    const { message } = await req.json()

    const responsePromise = (async () => {
      // Retrieve the assistant using the OPENAI_ASSISTANT_ID
      // This corresponds to the "Retrieve assistant" endpoint in the API docs
      const assistant = await openai.beta.assistants.retrieve(
        process.env.OPENAI_ASSISTANT_ID!
      )

      // Create a new thread for the conversation
      // This corresponds to the "Create thread" endpoint in the API docs
      const thread = await openai.beta.threads.create()

      // Add the user's message to the thread
      // This corresponds to the "Create message" endpoint in the API docs
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: message,
      })

      // Create a run for the thread with the assistant
      // This corresponds to the "Create run" endpoint in the API docs
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      })

      // Poll for the run to complete
      // This uses the "Retrieve run" endpoint in the API docs
      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
      while (runStatus.status !== 'completed') {
        if (signal.aborted) {
          throw new Error('Request aborted')
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
      }

      // Retrieve the assistant's response
      // This uses the "List messages" endpoint in the API docs
      const messages = await openai.beta.threads.messages.list(thread.id)
      const assistantMessage = messages.data.find((m) => m.role === 'assistant')

      // Extract the text content from the assistant's message
      if (
        assistantMessage &&
        assistantMessage.content &&
        assistantMessage.content.length > 0
      ) {
        const messageContent = assistantMessage.content[0]
        if ('text' in messageContent) {
          return messageContent.text.value
        }
      }

      return 'No response from assistant'
    })()

    // Race the response promise against a timeout
    const response = await Promise.race([
      responsePromise,
      timeout(TIMEOUT_DURATION),
    ])
    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error in chat API route:', error)
    if (error instanceof Error && error.message === 'Timeout') {
      return NextResponse.json({ error: 'Request timed out' }, { status: 504 })
    }
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  } finally {
    controller.abort()
  }
}
