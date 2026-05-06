'use client';

import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  message: Message;
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return <li key={i} className="ml-4 list-disc">{line.replace(/^[-•]\s/, '')}</li>;
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-semibold">{line.replace(/\*\*/g, '')}</p>;
    }
    if (line === '') return <br key={i} />;
    return <p key={i}>{line}</p>;
  });
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-slate-100 text-slate-800 rounded-bl-sm'
        )}
      >
        {isUser ? message.content : renderMarkdown(message.content)}
      </div>
    </div>
  );
}
