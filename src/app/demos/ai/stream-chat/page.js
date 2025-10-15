'use client';

import { useState, useRef, useEffect } from 'react';
import AIGuideLink from '@/components/AIGuideLink';

export default function StreamChatDemo() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingContent, setThinkingContent] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinkingContent]);

  const appendToLastMessage = (content) => {
    setMessages(prev => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      
      if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.completed) {
        newMessages[newMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + content
        };
        return newMessages;
      } else {
        return [...newMessages, { 
          role: 'assistant', 
          content, 
          completed: false 
        }];
      }
    });
  };

  const handleStreamResponse = async (response) => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;
          
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                newMessages[newMessages.length - 1] = {
                  ...lastMessage,
                  completed: true
                };
              }
              return newMessages;
            });
            setIsThinking(false);
            setThinkingContent('');
            setIsLoading(false);
            return;
          }

          try {
            const json = JSON.parse(data);
            
            if (json.type === 'thinking') {
              setIsThinking(true);
              setThinkingContent(prev => prev + json.content);
            } 
            else if (json.type === 'message') {
              setIsThinking(false);
              appendToLastMessage(json.content);
            }
          } catch (e) {
            console.error('Failed to parse streaming data:', e);
          }
        }
      }
    } catch (error) {
      console.error('Stream reading error:', error);
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setThinkingContent('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      await handleStreamResponse(response);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，发生了错误。请稍后重试。',
        completed: true 
      }]);
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">
          SSE 流式对话 Demo
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Server-Sent Events 实现 AI 流式响应 + 实时打字效果
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-xl mb-2">👋 开始对话吧！</p>
            <p className="text-sm">输入消息，体验流式打字效果</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}
            >
              <div className="text-xs opacity-70 mb-1">
                {msg.role === 'user' ? '👤 You' : '🤖 AI'}
              </div>
              
              <div className="whitespace-pre-wrap">
                {msg.content}
                {!msg.completed && (
                  <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                )}
              </div>
            </div>
          </div>
        ))}

        {isThinking && thinkingContent && (
          <div className="flex justify-start">
            <div className="max-w-[70%] rounded-lg px-4 py-2 bg-yellow-50 text-gray-700 border border-yellow-200">
              <div className="text-xs text-yellow-600 mb-1 flex items-center gap-1">
                <span className="animate-spin">🧠</span>
                <span>AI 正在思考...</span>
              </div>
              <div className="text-sm whitespace-pre-wrap opacity-80">
                {thinkingContent}
                <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {isLoading && !isThinking && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm">正在连接...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息... (Enter 发送，Shift+Enter 换行)"
            disabled={isLoading}
            className="flex-1 resize-none border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows={3}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto mt-2 text-xs text-gray-500 text-center">
          {isLoading && '⚡ 正在实时接收流式响应...'}
        </div>
      </div>

      {/* 技术说明 */}
      <div className="bg-blue-50 border-t p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* AI完整指南链接 */}
          <AIGuideLink />
          
          <details className="text-sm">
            <summary className="cursor-pointer font-semibold text-blue-900 mb-2">💡 技术要点</summary>
            <ul className="text-blue-800 space-y-1 ml-4">
              <li>• <strong>SSE (Server-Sent Events)</strong>: 使用 <code>ReadableStream</code> 实现服务器推送</li>
              <li>• <strong>打字效果</strong>: 逐字追加到消息末尾，避免重复渲染</li>
              <li>• <strong>Buffer 处理</strong>: 防止跨 chunk 边界导致数据不完整</li>
              <li>• <strong>思考过程展示</strong>: 区分 <code>reasoning_content</code> 和 <code>content</code></li>
              <li>• <strong>状态管理</strong>: 区分加载、思考、完成三种状态</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
