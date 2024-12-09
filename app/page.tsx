'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ user: string; bot?: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { user: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { ...userMessage, bot: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { user: userInput, bot: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };



  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="w-full max-w-2xl p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>
        <div className="flex flex-col space-y-4 overflow-y-auto max-h-80">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="bg-blue-500 text-white p-2 rounded-lg self-start">
                {msg.user}
              </div>
              {msg.bot && (
                <div className="bg-gray-300 text-gray-800 p-2 rounded-lg self-end">
                  {msg.bot}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex mt-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none text-gray-900"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
