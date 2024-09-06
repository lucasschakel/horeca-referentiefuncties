export async function callOpenAIAssistant(message: string): Promise<string> {
    if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      return `This is a mock response for the message: "${message}"`;
    } else {
      // Real API call
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to get response from the assistant');
        }
  
        const data = await response.json();
        return data.response;
      } catch (error) {
        console.error('Error calling OpenAI Assistant:', error);
        throw error;
      }
    }
  }