import React from 'react';

interface ChatBubbleProps {
  type: 'user' | 'ai';
  message: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ type, message }) => {
  return (
    <div className={`mb-2 ${type === 'user' ? 'text-right' : ''}`}>
      <div
        className={`inline-block rounded-lg px-3 py-2 max-w-3/4 ${
          type === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        {message}
      </div>
    </div>
  );
};
