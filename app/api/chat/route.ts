import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
    // Mock API response
    const { message } = await req.json();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    return NextResponse.json({ response: `This is a mock response for the message: "${message}"` });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    const assistant = await openai.beta.assistants.retrieve(
      process.env.OPENAI_ASSISTANT_ID!
    );

    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    // Poll for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Retrieve the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(m => m.role === 'assistant');

    if (assistantMessage && assistantMessage.content && assistantMessage.content.length > 0) {
      const messageContent = assistantMessage.content[0];
      if ('text' in messageContent) {
        return NextResponse.json({ response: messageContent.text.value });
      }
    }

    return NextResponse.json({ response: 'No response from assistant' });
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}