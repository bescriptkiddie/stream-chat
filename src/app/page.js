'use client';

// ===== 流式对话知识点 9: React Client Component =====
// 流式聊天需要使用客户端组件来处理 EventSource 和实时状态更新

import { useState, useRef, useEffect } from 'react';

export default function StreamChatDemo() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingContent, setThinkingContent] = useState('');
  const messagesEndRef = useRef(null);

  // ===== 知识点 10: 自动滚动到底部 =====
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinkingContent]);

  // ===== 知识点 11: 打字效果实现 =====
  // 通过逐字追加内容来实现打字机效果
  const appendToLastMessage = (content, type = 'message') => {
    setMessages(prev => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      
      if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.completed) {
        // ⚠️ 重要：必须创建新对象，不能直接修改！否则会导致重复渲染
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

  // ===== 知识点 12: 处理流式响应 =====
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
        
        // 保留不完整的行
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;
          
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            // ===== 知识点 13: 流结束处理 =====
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                // ⚠️ 创建新对象标记完成状态
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
            
            // ===== 知识点 14: 思考状态展示 =====
            if (json.type === 'thinking') {
              setIsThinking(true);
              setThinkingContent(prev => prev + json.content);
            } 
            // ===== 知识点 15: 消息内容打字效果 =====
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

  // ===== 知识点 16: 发送消息并接收流式响应 =====
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
      {/* ===== 知识点 17: 头部标题栏 ===== */}
      <header className="bg-white shadow-sm p-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">
          流式对话 Demo - 豆包 AI
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          展示：打字效果 + 思考过程 + SSE 流式响应
        </p>
      </header>

      {/* ===== 知识点 18: 消息展示区域 ===== */}
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
              {/* ===== 知识点 19: 角色标识 ===== */}
              <div className="text-xs opacity-70 mb-1">
                {msg.role === 'user' ? '👤 You' : '🤖 AI'}
              </div>
              
              {/* ===== 知识点 20: 打字效果的视觉呈现 ===== */}
              <div className="whitespace-pre-wrap">
                {msg.content}
                {!msg.completed && (
                  <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* ===== 知识点 21: 思考状态展示 ===== */}
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

        {/* ===== 知识点 22: 加载状态指示器 ===== */}
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

      {/* ===== 知识点 23: 输入框区域 ===== */}
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
        
        {/* ===== 知识点 24: 状态提示 ===== */}
        <div className="max-w-4xl mx-auto mt-2 text-xs text-gray-500 text-center">
          {isLoading && '⚡ 正在实时接收流式响应...'}
        </div>
      </div>
    </div>
  );
}
