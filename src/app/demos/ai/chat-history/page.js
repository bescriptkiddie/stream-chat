'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import DemoContainer from '@/components/DemoContainer';

// ===== 核心知识点 1: 虚拟滚动实现 =====
function VirtualChatList({ messages, containerHeight = 600, itemHeight = 80 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  
  // 计算可见范围
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const bufferSize = 3; // 上下各缓冲 3 条
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
  const endIndex = Math.min(messages.length, startIndex + visibleCount + bufferSize * 2);
  const visibleMessages = messages.slice(startIndex, endIndex);

  const totalHeight = messages.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: containerHeight, overflow: 'auto' }}
      className="border-2 border-gray-300 rounded-lg bg-gray-50"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleMessages.map((msg, idx) => (
            <div
              key={startIndex + idx}
              style={{ height: itemHeight }}
              className={`border-b border-gray-200 px-4 py-2 flex items-start gap-3 ${
                msg.role === 'user' ? 'bg-blue-50' : 'bg-white'
              }`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-1">
                  {msg.role === 'user' ? 'You' : 'AI'} · {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-800 line-clamp-2">{msg.content}</div>
              </div>
              <div className="text-xs text-gray-400">#{msg.id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== 核心知识点 2: 分页加载 =====
function usePaginatedMessages(pageSize = 20) {
  const [allMessages, setAllMessages] = useState([]);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // 模拟从服务器/数据库加载消息
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const newMessages = allMessages.slice(start, end);

    setDisplayedMessages(prev => [...prev, ...newMessages]);
    setCurrentPage(prev => prev + 1);
    setHasMore(end < allMessages.length);
    setLoading(false);
  }, [allMessages, currentPage, pageSize, loading, hasMore]);

  return {
    displayedMessages,
    loadMore,
    hasMore,
    loading,
    setAllMessages,
    reset: () => {
      setDisplayedMessages([]);
      setCurrentPage(1);
      setHasMore(true);
    },
  };
}

// ===== 核心知识点 3: LRU 缓存实现 =====
class LRUCache {
  constructor(capacity = 100) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    // 移到最后（最近使用）
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    // 如果已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, value);

    // 超出容量，删除最旧的（第一个）
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }

  get size() {
    return this.cache.size;
  }

  getStats() {
    return {
      size: this.cache.size,
      capacity: this.capacity,
      usage: `${((this.cache.size / this.capacity) * 100).toFixed(1)}%`,
    };
  }
}

export default function ChatHistoryDemo() {
  const [demoMode, setDemoMode] = useState('virtual');
  const [messageCount, setMessageCount] = useState(1000);
  const [messages, setMessages] = useState([]);
  const [cache] = useState(() => new LRUCache(50));
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0 });
  
  const {
    displayedMessages,
    loadMore,
    hasMore,
    loading,
    setAllMessages,
    reset,
  } = usePaginatedMessages(20);

  // 生成模拟消息
  const generateMessages = useCallback((count) => {
    const msgs = [];
    for (let i = 0; i < count; i++) {
      msgs.push({
        id: i + 1,
        role: i % 3 === 0 ? 'assistant' : 'user',
        content: `这是第 ${i + 1} 条消息的内容。在实际项目中，消息内容可能很长，包含代码、图片、链接等多种格式。${Math.random().toString(36).substr(2)}`,
        timestamp: Date.now() - (count - i) * 60000,
      });
    }
    return msgs;
  }, []);

  // 初始化消息
  useEffect(() => {
    const msgs = generateMessages(messageCount);
    setMessages(msgs);
    setAllMessages(msgs);
  }, [messageCount, generateMessages, setAllMessages]);

  // 模拟缓存访问
  const accessMessage = (id) => {
    if (cache.has(id)) {
      setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
      return cache.get(id);
    } else {
      setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      const msg = messages.find(m => m.id === id);
      if (msg) {
        cache.set(id, msg);
      }
      return msg;
    }
  };

  const testCache = () => {
    // 随机访问一些消息
    for (let i = 0; i < 10; i++) {
      const randomId = Math.floor(Math.random() * messageCount) + 1;
      accessMessage(randomId);
    }
  };

  const clearCache = () => {
    cache.clear();
    setCacheStats({ hits: 0, misses: 0 });
  };

  return (
    <DemoContainer
      title="对话历史优化"
      description="虚拟滚动 + 分页加载 + LRU 缓存 - AI 聊天性能优化"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📚 核心优化策略</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">虚拟滚动</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• <strong>问题：</strong>1万条消息 = 1万个 DOM 节点</li>
                <li>• <strong>解决：</strong>只渲染可见区域（~20 个节点）</li>
                <li>• <strong>效果：</strong>性能提升 500x+</li>
                <li>• <strong>关键：</strong>计算可见范围 + transform 偏移</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">分页加载</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• <strong>问题：</strong>一次加载全部历史记录</li>
                <li>• <strong>解决：</strong>按需加载，滚动到底部加载更多</li>
                <li>• <strong>效果：</strong>首屏加载快 10x+</li>
                <li>• <strong>关键：</strong>Intersection Observer + 分页 API</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-900 mb-2">LRU 缓存</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• <strong>问题：</strong>重复访问的消息重复加载</li>
                <li>• <strong>解决：</strong>最近访问的保留，最久的淘汰</li>
                <li>• <strong>效果：</strong>缓存命中率 80%+</li>
                <li>• <strong>关键：</strong>Map + 双向链表（或 Map）</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 演示模式切换 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm font-semibold text-gray-700">演示模式：</span>
            <button
              onClick={() => setDemoMode('virtual')}
              className={`px-4 py-2 rounded-lg transition ${
                demoMode === 'virtual'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-100'
              }`}
            >
              虚拟滚动
            </button>
            <button
              onClick={() => {
                setDemoMode('pagination');
                reset();
              }}
              className={`px-4 py-2 rounded-lg transition ${
                demoMode === 'pagination'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-100'
              }`}
            >
              分页加载
            </button>
            <button
              onClick={() => setDemoMode('cache')}
              className={`px-4 py-2 rounded-lg transition ${
                demoMode === 'cache'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-100'
              }`}
            >
              LRU 缓存
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">消息数量：</label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={messageCount}
                onChange={(e) => setMessageCount(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm font-mono text-gray-900 w-24">
                {messageCount.toLocaleString()} 条
              </span>
            </div>
          </div>
        </div>

        {/* 虚拟滚动演示 */}
        {demoMode === 'virtual' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h4 className="font-semibold text-blue-900 mb-2">🚀 虚拟滚动演示</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• 当前消息数：<strong>{messages.length.toLocaleString()}</strong> 条</p>
                <p>• 实际渲染：<strong>~20</strong> 个 DOM 节点（可见区域 + 缓冲区）</p>
                <p>• 性能提升：<strong>{Math.floor(messages.length / 20)}x</strong></p>
                <p>• 滚动尝试：快速滚动，观察流畅度</p>
              </div>
            </div>

            <VirtualChatList messages={messages} containerHeight={600} itemHeight={80} />

            <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg">
              <div className="mb-2 text-gray-400">// 虚拟滚动核心代码</div>
              <pre className="text-xs">
{`// 1. 计算可见范围
const visibleCount = Math.ceil(containerHeight / itemHeight);
const startIndex = Math.floor(scrollTop / itemHeight) - bufferSize;
const endIndex = startIndex + visibleCount + bufferSize * 2;

// 2. 只渲染可见消息
const visibleMessages = messages.slice(startIndex, endIndex);

// 3. 使用 transform 实现滚动
const offsetY = startIndex * itemHeight;
<div style={{ transform: \`translateY(\${offsetY}px)\` }}>
  {visibleMessages.map(msg => <MessageItem />)}
</div>`}
              </pre>
            </div>
          </div>
        )}

        {/* 分页加载演示 */}
        {demoMode === 'pagination' && (
          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h4 className="font-semibold text-green-900 mb-2">📄 分页加载演示</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p>• 总消息数：<strong>{messages.length.toLocaleString()}</strong> 条</p>
                <p>• 已加载：<strong>{displayedMessages.length}</strong> 条</p>
                <p>• 每页：<strong>20</strong> 条</p>
                <p>• 还有更多：<strong>{hasMore ? '是' : '否'}</strong></p>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg bg-gray-50 h-96 overflow-y-auto">
              {displayedMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`border-b border-gray-200 px-4 py-3 flex items-start gap-3 ${
                    msg.role === 'user' ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">
                      {msg.role === 'user' ? 'You' : 'AI'} · {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-sm text-gray-800">{msg.content}</div>
                  </div>
                </div>
              ))}

              {hasMore && (
                <div className="p-4 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    {loading ? '加载中...' : '加载更多'}
                  </button>
                </div>
              )}

              {!hasMore && displayedMessages.length > 0 && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  已加载全部 {displayedMessages.length} 条消息
                </div>
              )}
            </div>

            <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg">
              <div className="mb-2 text-gray-400">// 分页加载核心代码</div>
              <pre className="text-xs">
{`// 1. 自定义 Hook
function usePaginatedMessages(pageSize = 20) {
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const newMessages = await fetchMessages(start, end);
    
    setDisplayedMessages(prev => [...prev, ...newMessages]);
    setCurrentPage(prev => prev + 1);
    setHasMore(newMessages.length === pageSize);
  };

  return { displayedMessages, loadMore, hasMore };
}

// 2. Intersection Observer 自动加载
const observerRef = useRef();
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore) {
      loadMore();
    }
  });
  observer.observe(observerRef.current);
}, [hasMore]);`}
              </pre>
            </div>
          </div>
        )}

        {/* LRU 缓存演示 */}
        {demoMode === 'cache' && (
          <div className="space-y-4">
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <h4 className="font-semibold text-purple-900 mb-2">💾 LRU 缓存演示</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-purple-800">
                <div>
                  <p>• 缓存容量：<strong>50</strong> 条</p>
                  <p>• 当前大小：<strong>{cache.size}</strong> 条</p>
                  <p>• 使用率：<strong>{cache.getStats().usage}</strong></p>
                </div>
                <div>
                  <p>• 缓存命中：<strong className="text-green-600">{cacheStats.hits}</strong> 次</p>
                  <p>• 缓存未命中：<strong className="text-red-600">{cacheStats.misses}</strong> 次</p>
                  <p>• 命中率：<strong>{cacheStats.hits + cacheStats.misses > 0 ? ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1) : 0}%</strong></p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={testCache}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                随机访问 10 条消息
              </button>
              <button
                onClick={clearCache}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                清空缓存
              </button>
            </div>

            <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-96 overflow-y-auto">
              <div className="mb-2 text-gray-400">// LRU 缓存核心实现</div>
              <pre className="text-xs">
{`class LRUCache {
  constructor(capacity = 100) {
    this.capacity = capacity;
    this.cache = new Map(); // Map 保持插入顺序
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    // 移到最后（标记为最近使用）
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    // 如果已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, value);

    // 超出容量，删除最旧的（第一个）
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

// 使用示例
const messageCache = new LRUCache(50);

// 读取消息
function getMessage(id) {
  // 先查缓存
  let msg = messageCache.get(id);
  if (!msg) {
    // 缓存未命中，从 API/数据库加载
    msg = await fetchMessageFromDB(id);
    messageCache.set(id, msg);
  }
  return msg;
}

// 优势：
// 1. 自动淘汰最久未使用的数据
// 2. 控制内存占用
// 3. 提升访问速度
// 4. 适用于消息、图片、用户信息等场景`}
              </pre>
            </div>
          </div>
        )}

        {/* 性能对比 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 性能对比</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">场景</th>
                  <th className="p-3 text-left">未优化</th>
                  <th className="p-3 text-left">虚拟滚动</th>
                  <th className="p-3 text-left">分页加载</th>
                  <th className="p-3 text-left">三者结合</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 font-semibold">DOM 节点数</td>
                  <td className="p-3 text-red-600">10,000</td>
                  <td className="p-3 text-green-600">~20</td>
                  <td className="p-3 text-yellow-600">初始 20</td>
                  <td className="p-3 text-green-600 font-bold">~20</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">首屏渲染时间</td>
                  <td className="p-3 text-red-600">3-5s</td>
                  <td className="p-3 text-green-600">50-100ms</td>
                  <td className="p-3 text-green-600">30-50ms</td>
                  <td className="p-3 text-green-600 font-bold">30-50ms</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">滚动帧率</td>
                  <td className="p-3 text-red-600">10-20 FPS</td>
                  <td className="p-3 text-green-600">60 FPS</td>
                  <td className="p-3 text-yellow-600">30-50 FPS</td>
                  <td className="p-3 text-green-600 font-bold">60 FPS</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">内存占用</td>
                  <td className="p-3 text-red-600">~100MB</td>
                  <td className="p-3 text-yellow-600">~20MB</td>
                  <td className="p-3 text-green-600">~2MB</td>
                  <td className="p-3 text-green-600 font-bold">~5MB</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">网络请求次数</td>
                  <td className="p-3 text-red-600">1 次（全部）</td>
                  <td className="p-3 text-red-600">1 次（全部）</td>
                  <td className="p-3 text-green-600">按需</td>
                  <td className="p-3 text-green-600 font-bold">按需 + 缓存</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-green-50 p-3 rounded">
            <p className="text-sm text-green-900">
              <strong>💡 结论：</strong>虚拟滚动 + 分页加载 + LRU 缓存三者结合，可将性能提升 <strong className="text-green-700">100-500倍</strong>
            </p>
          </div>
        </div>

        {/* 面试场景模拟 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 面试场景模拟</h3>

          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：1万条聊天记录如何优化渲染性能？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ 完整优化方案：</p>
                  <div className="space-y-3 mt-2">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-semibold text-xs">1. 虚拟滚动（必做）</p>
                      <ul className="list-disc ml-5 text-xs mt-1">
                        <li>只渲染可见区域的消息（~20 条）</li>
                        <li>使用 transform 实现滚动效果</li>
                        <li>上下缓冲 3-5 条避免白屏</li>
                        <li>库推荐：react-window, react-virtualized</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-xs">2. 分页加载（按需）</p>
                      <ul className="list-disc ml-5 text-xs mt-1">
                        <li>首屏只加载最新 20 条</li>
                        <li>滚动到顶部加载更多（Intersection Observer）</li>
                        <li>加载时显示骨架屏</li>
                        <li>支持跳转到指定位置</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="font-semibold text-xs">3. 缓存策略（进阶）</p>
                      <ul className="list-disc ml-5 text-xs mt-1">
                        <li>LRU 缓存最近访问的消息</li>
                        <li>IndexedDB 持久化历史记录</li>
                        <li>图片懒加载 + CDN 缓存</li>
                        <li>Service Worker 离线缓存</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：虚拟滚动的原理是什么？有什么坑？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ 原理与注意事项：</p>
                  <div className="space-y-2 mt-2">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-semibold text-xs">原理：</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`// 1. 计算可见区域
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// 2. 只渲染可见项
const visibleItems = items.slice(startIndex, endIndex);

// 3. 使用 transform 偏移
<div style={{ 
  height: totalHeight,  // 保持总高度
  transform: \`translateY(\${startIndex * itemHeight}px)\`
}}>
  {visibleItems.map(item => <Item />)}
</div>`}
                      </pre>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <p className="font-semibold text-red-900 text-xs">⚠️ 常见坑：</p>
                      <ul className="list-disc ml-5 text-xs mt-1">
                        <li><strong>动态高度：</strong>消息高度不固定，需要动态计算</li>
                        <li><strong>白屏问题：</strong>快速滚动时加载不及时，需缓冲区</li>
                        <li><strong>定位问题：</strong>跳转到指定消息需计算累计高度</li>
                        <li><strong>滚动抖动：</strong>新消息加载导致滚动位置变化</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：LRU 缓存的实现原理？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ 两种实现方式：</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-semibold text-xs">方法 1: Map（简单）</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`class LRUCache {
  constructor(capacity) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    // 删除后重新插入 = 移到末尾
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  set(key, val) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, val);
    
    // 超容量删除第一个
    if (this.cache.size > this.capacity) {
      const first = this.cache.keys().next().value;
      this.cache.delete(first);
    }
  }
}`}
                      </pre>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-xs">方法 2: 双向链表 + HashMap（最优）</p>
                      <ul className="list-disc ml-5 text-xs mt-1">
                        <li>HashMap: 快速查找 O(1)</li>
                        <li>双向链表: 快速移动节点 O(1)</li>
                        <li>头部 = 最近使用</li>
                        <li>尾部 = 最久未使用（淘汰）</li>
                      </ul>
                      <p className="text-xs mt-2 text-purple-700">
                        💡 <strong>时间复杂度：</strong>get/set 都是 O(1)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：阶跃星辰 AI 产品中如何应用这些优化？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ 完整技术方案：</p>
                  <div className="space-y-3 mt-2">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-semibold text-xs">1. 对话列表优化</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`// 虚拟滚动 + 分页
<VirtualList
  items={messages}
  itemHeight={80}
  onScrollToTop={() => loadMoreHistory()}
  cacheSize={100}
/>`}
                      </pre>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-xs">2. 多层缓存策略</p>
                      <ul className="list-disc ml-5 text-xs mt-1">
                        <li><strong>内存缓存：</strong>LRU 缓存最近 100 条消息</li>
                        <li><strong>IndexedDB：</strong>持久化所有历史记录</li>
                        <li><strong>Service Worker：</strong>离线可用</li>
                        <li><strong>CDN：</strong>图片、附件缓存</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="font-semibold text-xs">3. 特殊场景处理</p>
                      <ul className="list-disc ml-5 text-xs mt-1">
                        <li><strong>搜索跳转：</strong>定位到指定消息</li>
                        <li><strong>引用回复：</strong>跳转到被引用的消息</li>
                        <li><strong>代码高亮：</strong>懒加载高亮库</li>
                        <li><strong>图片预览：</strong>懒加载 + 缩略图</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* 追问场景 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-3">🔥 可能的追问</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div>
              <strong>追问 1：</strong>动态高度的虚拟列表如何实现？
              <p className="ml-4 text-xs text-gray-700">→ 测量每项真实高度，维护高度数组，累加计算位置</p>
            </div>
            <div>
              <strong>追问 2：</strong>如何实现平滑滚动到指定消息？
              <p className="ml-4 text-xs text-gray-700">→ scrollTo + smooth behavior，或 requestAnimationFrame 自定义动画</p>
            </div>
            <div>
              <strong>追问 3：</strong>新消息到达时如何保持滚动位置？
              <p className="ml-4 text-xs text-gray-700">→ 判断是否在底部，是则滚动到底部，否则保持原位置</p>
            </div>
            <div>
              <strong>追问 4：</strong>缓存失效策略是什么？
              <p className="ml-4 text-xs text-gray-700">→ LRU 自动淘汰 + 定时清理 + 版本号控制</p>
            </div>
            <div>
              <strong>追问 5：</strong>移动端如何优化？
              <p className="ml-4 text-xs text-gray-700">→ 更小的缓冲区 + 懒加载图片 + 简化样式</p>
            </div>
          </div>
        </div>

        {/* 思维体系定位 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
            🧠 思维体系定位
          </h3>

          <div className="space-y-6">
            {/* 在前端体系中的位置 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">📍 在前端体系中的位置</h4>
              <div className="text-sm text-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-semibold">第四层：应用场景</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-indigo-200 text-indigo-900 rounded text-xs font-semibold">AI 产品开发</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-indigo-300 text-indigo-950 rounded text-xs font-semibold">聊天历史管理</span>
                </div>
                <p className="text-gray-600 mt-2">
                  聊天历史是 AI 对话产品的核心功能，涉及<strong>性能优化</strong>（虚拟滚动）、<strong>缓存策略</strong>（LRU）、<strong>状态管理</strong>等多个技术点。
                </p>
              </div>
            </div>

            {/* 技术栈关联 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">🔧 技术栈关联</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs font-semibold text-blue-900 mb-2">⬇️ 底层技术</div>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• 虚拟滚动</li>
                    <li>• LRU 缓存算法</li>
                    <li>• IndexedDB</li>
                    <li>• React 状态管理</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 性能优化核心</p>
                </div>

                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 协同功能</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• 流式对话</li>
                    <li>• 多会话切换</li>
                    <li>• 搜索过滤</li>
                    <li>• 导出导入</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 完整的聊天体验</p>
                </div>

                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬆️ 产品价值</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• 查看历史对话</li>
                    <li>• 上下文连续性</li>
                    <li>• 用户留存</li>
                    <li>• 数据沉淀</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 核心产品功能</p>
                </div>
              </div>
            </div>

            {/* 实现路径 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">🛤️ 实现路径建议</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">1️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">基础实现：简单列表</strong>
                    <p className="text-xs text-gray-600">用数组存储消息，直接渲染，理解基本流程</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">性能优化：虚拟滚动</strong>
                    <p className="text-xs text-gray-600">实现虚拟列表，只渲染可见区域，支持海量消息</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">缓存优化：LRU + IndexedDB</strong>
                    <p className="text-xs text-gray-600">内存缓存 + 持久化存储，提升加载速度</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">生产级：搜索、过滤、导出</strong>
                    <p className="text-xs text-gray-600">完整的历史管理功能，支持复杂业务场景</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI 公司面试重要性 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">⭐ AI 公司面试重要性</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">考察频率：</span>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <span key={i} className="text-yellow-500">⭐</span>
                      ))}
                      <span className="text-gray-300">⭐</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">AI 产品常见功能</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">业务相关度：</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className="text-purple-500">💜</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">对话产品核心功能</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-purple-50 rounded">
                <p className="text-xs text-purple-800">
                  <strong>💡 面试建议：</strong>能讲清楚虚拟滚动原理、LRU 缓存实现、IndexedDB 使用、性能优化策略（内存限制、缓冲区大小）。
                </p>
              </div>
            </div>

            {/* 实现难度评估 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">📊 实现难度评估</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>技术难度</span>
                    <span className="text-indigo-600 font-semibold">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">涉及虚拟滚动、LRU 算法、IndexedDB、性能优化</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>业务复杂度</span>
                    <span className="text-purple-600 font-semibold">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要考虑搜索、过滤、导出、缓存策略、内存管理</p>
                </div>
              </div>
            </div>

            {/* 查看完整体系 */}
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg text-center">
              <p className="text-sm text-indigo-900 mb-2">
                想了解完整的 AI 前端开发体系？
              </p>
              <a 
                href="/MINDMAP.md" 
                target="_blank"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
              >
                📖 查看完整思维导图
              </a>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
