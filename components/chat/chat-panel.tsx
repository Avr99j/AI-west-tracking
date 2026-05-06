'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STARTERS = [
  "What's our total pipeline value?",
  "Which follow-ups are overdue?",
  "List all Active engagements",
  "Who are the top 3 deals by value?",
];

export function ChatPanel() {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const assistantMsg: Message = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.body) throw new Error('No response body');
      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const raw = line.slice(6).trim();
            if (raw === '[DONE]') break;
            try {
              const parsed = JSON.parse(raw);
              if (parsed.text) {
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: updated[updated.length - 1].content + parsed.text,
                  };
                  return updated;
                });
              }
            } catch { /* skip malformed chunks */ }
          }
        }
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' };
        return updated;
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-4 py-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 py-8">
            <div className="p-3 rounded-full bg-blue-50">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">West AI Assistant</p>
              <p className="text-xs text-slate-500 mt-1">Ask about any client, project status, or pipeline metrics.</p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
              {STARTERS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m, i) => <ChatMessage key={i} message={m} />)}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      <div className="border-t border-slate-200 p-3">
        <form
          onSubmit={e => { e.preventDefault(); send(input); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about projects, pipeline, status…"
            disabled={loading}
            className="flex-1 border-slate-200 text-sm"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
