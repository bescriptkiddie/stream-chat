'use client';

import { useState, useEffect } from 'react';
import DemoContainer from '@/components/DemoContainer';

// ===== IndexedDB 封装 =====
class SessionDB {
  constructor(dbName = 'ChatSessions', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  // 初始化数据库
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // 创建会话存储
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionStore.createIndex('createdAt', 'createdAt', { unique: false });
          sessionStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // 创建消息存储
        if (!db.objectStoreNames.contains('messages')) {
          const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
          messageStore.createIndex('sessionId', 'sessionId', { unique: false });
          messageStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  // 创建会话
  async createSession(title = '新对话') {
    const session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messageCount: 0
    };

    const transaction = this.db.transaction(['sessions'], 'readwrite');
    const store = transaction.objectStore('sessions');
    await store.add(session);

    return session;
  }

  // 获取所有会话
  async getAllSessions() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const index = store.index('updatedAt');
      const request = index.openCursor(null, 'prev'); // 按更新时间倒序

      const sessions = [];
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          sessions.push(cursor.value);
          cursor.continue();
        } else {
          resolve(sessions);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 删除会话
  async deleteSession(sessionId) {
    // 删除会话和相关消息
    const transaction = this.db.transaction(['sessions', 'messages'], 'readwrite');
    
    // 删除会话
    await transaction.objectStore('sessions').delete(sessionId);

    // 删除该会话的所有消息
    const messageStore = transaction.objectStore('messages');
    const index = messageStore.index('sessionId');
    const request = index.openCursor(IDBKeyRange.only(sessionId));

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    return new Promise((resolve) => {
      transaction.oncomplete = () => resolve();
    });
  }

  // 更新会话标题
  async updateSessionTitle(sessionId, title) {
    const transaction = this.db.transaction(['sessions'], 'readwrite');
    const store = transaction.objectStore('sessions');
    const request = store.get(sessionId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const session = request.result;
        if (session) {
          session.title = title;
          session.updatedAt = Date.now();
          store.put(session);
          resolve(session);
        } else {
          reject(new Error('Session not found'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 添加消息
  async addMessage(sessionId, role, content) {
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      role,
      content,
      createdAt: Date.now()
    };

    const transaction = this.db.transaction(['messages', 'sessions'], 'readwrite');
    
    // 添加消息
    await transaction.objectStore('messages').add(message);

    // 更新会话的消息计数和更新时间
    const sessionStore = transaction.objectStore('sessions');
    const sessionRequest = sessionStore.get(sessionId);

    sessionRequest.onsuccess = () => {
      const session = sessionRequest.result;
      if (session) {
        session.messageCount++;
        session.updatedAt = Date.now();
        sessionStore.put(session);
      }
    };

    return message;
  }

  // 获取会话的所有消息
  async getMessages(sessionId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readonly');
      const store = transaction.objectStore('messages');
      const index = store.index('sessionId');
      const request = index.openCursor(IDBKeyRange.only(sessionId));

      const messages = [];
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          messages.push(cursor.value);
          cursor.continue();
        } else {
          // 按创建时间排序
          resolve(messages.sort((a, b) => a.createdAt - b.createdAt));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 清空所有数据
  async clearAll() {
    const transaction = this.db.transaction(['sessions', 'messages'], 'readwrite');
    await transaction.objectStore('sessions').clear();
    await transaction.objectStore('messages').clear();
  }
}

export default function MultiSessionDemo() {
  const [db, setDb] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  // 初始化数据库
  useEffect(() => {
    const initDB = async () => {
      const sessionDB = new SessionDB();
      await sessionDB.init();
      setDb(sessionDB);
      await loadSessions(sessionDB);
    };
    initDB();
  }, []);

  // 加载所有会话
  const loadSessions = async (database = db) => {
    if (!database) return;
    const allSessions = await database.getAllSessions();
    setSessions(allSessions);
    
    // 如果没有当前会话且有会话列表，选择第一个
    if (!currentSessionId && allSessions.length > 0) {
      selectSession(allSessions[0].id, database);
    }
  };

  // 创建新会话
  const createNewSession = async () => {
    if (!db) return;
    const session = await db.createSession(`对话 ${sessions.length + 1}`);
    await loadSessions();
    selectSession(session.id);
  };

  // 选择会话
  const selectSession = async (sessionId, database = db) => {
    if (!database) return;
    setCurrentSessionId(sessionId);
    const sessionMessages = await database.getMessages(sessionId);
    setMessages(sessionMessages);
  };

  // 删除会话
  const deleteSession = async (sessionId) => {
    if (!db || !confirm('确定要删除这个对话吗？')) return;
    
    await db.deleteSession(sessionId);
    await loadSessions();

    // 如果删除的是当前会话，清空消息
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setMessages([]);
    }
  };

  // 开始编辑标题
  const startEditTitle = (session) => {
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  // 保存标题
  const saveTitle = async (sessionId) => {
    if (!db || !editingTitle.trim()) return;
    
    await db.updateSessionTitle(sessionId, editingTitle.trim());
    await loadSessions();
    setEditingSessionId(null);
  };

  // 发送消息
  const sendMessage = async () => {
    if (!db || !currentSessionId || !input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    // 添加用户消息
    await db.addMessage(currentSessionId, 'user', userInput);
    await selectSession(currentSessionId);

    // 模拟 AI 回复
    setTimeout(async () => {
      const aiResponse = `这是对 "${userInput}" 的回复。这是一个演示，实际项目中会调用 AI API。`;
      await db.addMessage(currentSessionId, 'assistant', aiResponse);
      await selectSession(currentSessionId);
      await loadSessions(); // 更新会话列表（消息计数）
      setIsLoading(false);
    }, 1000);
  };

  // 清空所有数据
  const clearAllData = async () => {
    if (!db || !confirm('确定要清空所有对话吗？此操作不可恢复！')) return;
    
    await db.clearAll();
    setSessions([]);
    setCurrentSessionId(null);
    setMessages([]);
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <DemoContainer
      title="多会话管理 (Multi-Session)"
      description="使用 IndexedDB 实现 AI 对话的多会话持久化存储"
    >
      <div className="space-y-6">
        {/* 核心技术说明 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📚 核心技术</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">IndexedDB</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 浏览器端数据库</li>
                <li>• 支持大量数据存储</li>
                <li>• 异步 API</li>
                <li>• 离线可用</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">数据结构</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• sessions: 会话列表</li>
                <li>• messages: 消息记录</li>
                <li>• 索引: 提升查询性能</li>
                <li>• 关联: sessionId 外键</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-900 mb-2">应用场景</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• ChatGPT 式多对话</li>
                <li>• 离线消息缓存</li>
                <li>• 历史记录持久化</li>
                <li>• 大文件本地存储</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 主界面 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* 左侧：会话列表 */}
            <div className="w-64 border-r bg-gray-50 flex flex-col">
              {/* 头部 */}
              <div className="p-4 border-b bg-white">
                <button
                  onClick={createNewSession}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <span className="text-lg">+</span>
                  新建对话
                </button>
              </div>

              {/* 会话列表 */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {sessions.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8 text-sm">
                    点击上方按钮创建对话
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-3 rounded-lg cursor-pointer transition group relative ${
                        currentSessionId === session.id
                          ? 'bg-indigo-100 border-2 border-indigo-300'
                          : 'bg-white hover:bg-gray-100 border-2 border-transparent'
                      }`}
                      onClick={() => selectSession(session.id)}
                    >
                      {editingSessionId === session.id ? (
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => saveTitle(session.id)}
                          onKeyPress={(e) => e.key === 'Enter' && saveTitle(session.id)}
                          className="w-full px-2 py-1 border rounded text-sm"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          <div className="font-medium text-gray-900 text-sm truncate pr-16">
                            {session.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {session.messageCount} 条消息
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(session.updatedAt).toLocaleString('zh-CN')}
                          </div>

                          {/* 操作按钮 */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditTitle(session);
                              }}
                              className="p-1 bg-white border rounded hover:bg-gray-100 text-xs"
                              title="重命名"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSession(session.id);
                              }}
                              className="p-1 bg-white border rounded hover:bg-red-50 text-xs"
                              title="删除"
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* 底部统计 */}
              <div className="p-3 border-t bg-white text-xs text-gray-600">
                <div>总会话数: {sessions.length}</div>
                <div>总消息数: {sessions.reduce((sum, s) => sum + s.messageCount, 0)}</div>
                <button
                  onClick={clearAllData}
                  className="mt-2 w-full px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                >
                  清空所有数据
                </button>
              </div>
            </div>

            {/* 右侧：聊天区域 */}
            <div className="flex-1 flex flex-col">
              {currentSession ? (
                <>
                  {/* 头部 */}
                  <div className="p-4 border-b bg-white">
                    <h3 className="font-semibold text-gray-900">{currentSession.title}</h3>
                    <p className="text-xs text-gray-500">
                      {currentSession.messageCount} 条消息 · 创建于 {new Date(currentSession.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>

                  {/* 消息列表 */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        开始新的对话吧！
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              msg.role === 'user'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-800 shadow-sm border'
                            }`}
                          >
                            <div className="text-xs opacity-70 mb-1">
                              {msg.role === 'user' ? '👤 You' : '🤖 AI'}
                            </div>
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                            <div className="text-xs opacity-60 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString('zh-CN')}
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                          <div className="flex items-center gap-2 text-gray-500">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-sm">AI 正在思考...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 输入框 */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="输入消息..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
                      >
                        {isLoading ? '发送中...' : '发送'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <div className="text-lg font-medium">选择或创建一个对话</div>
                    <div className="text-sm mt-2">开始你的 AI 对话之旅</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* IndexedDB 核心代码 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💻 IndexedDB 核心实现</h4>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-blue-800 hover:text-blue-900 font-medium">
              点击查看核心代码
            </summary>
            <div className="mt-3 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs">
{`// 1. 初始化数据库
async init() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(this.dbName, this.version);

    request.onsuccess = () => {
      this.db = request.result;
      resolve(this.db);
    };

    // 创建表结构
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // 会话表
      const sessionStore = db.createObjectStore('sessions', { 
        keyPath: 'id' 
      });
      sessionStore.createIndex('updatedAt', 'updatedAt');

      // 消息表
      const messageStore = db.createObjectStore('messages', { 
        keyPath: 'id' 
      });
      messageStore.createIndex('sessionId', 'sessionId');
    };
  });
}

// 2. 添加数据
async createSession(title) {
  const session = {
    id: \`session_\${Date.now()}\`,
    title,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  const transaction = this.db.transaction(['sessions'], 'readwrite');
  await transaction.objectStore('sessions').add(session);
  return session;
}

// 3. 查询数据（使用索引）
async getAllSessions() {
  return new Promise((resolve) => {
    const transaction = this.db.transaction(['sessions'], 'readonly');
    const store = transaction.objectStore('sessions');
    const index = store.index('updatedAt');
    const request = index.openCursor(null, 'prev'); // 倒序

    const sessions = [];
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        sessions.push(cursor.value);
        cursor.continue();
      } else {
        resolve(sessions);
      }
    };
  });
}

// 4. 删除数据（级联删除）
async deleteSession(sessionId) {
  const transaction = this.db.transaction(
    ['sessions', 'messages'], 
    'readwrite'
  );
  
  // 删除会话
  await transaction.objectStore('sessions').delete(sessionId);

  // 删除相关消息
  const messageStore = transaction.objectStore('messages');
  const index = messageStore.index('sessionId');
  const request = index.openCursor(IDBKeyRange.only(sessionId));

  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      cursor.delete();
      cursor.continue();
    }
  };
}`}
              </pre>
            </div>
          </details>
        </div>

        {/* 面试场景模拟 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
            🎤 面试场景模拟
          </h3>

          <div className="space-y-6">
            {/* 场景 1 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">👔</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    面试官：为什么选择 IndexedDB 而不是 LocalStorage？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-semibold text-blue-900">LocalStorage</p>
                          <ul className="list-disc ml-5 text-xs mt-2">
                            <li>同步 API，阻塞主线程</li>
                            <li>只能存储字符串（5-10MB）</li>
                            <li>无索引，查询慢</li>
                            <li>适合：简单配置、token</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="font-semibold text-green-900">IndexedDB</p>
                          <ul className="list-disc ml-5 text-xs mt-2">
                            <li>异步 API，不阻塞</li>
                            <li>存储任意类型（数百 MB）</li>
                            <li>支持索引，查询快</li>
                            <li>适合：大量数据、复杂查询</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-purple-700 text-xs mt-2">
                        💡 <strong>AI 对话场景：</strong>需要存储大量消息历史，支持多会话查询，IndexedDB 是最佳选择
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 场景 2 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">👔</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    面试官：IndexedDB 的事务机制是什么？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p>IndexedDB 所有操作都必须在事务中进行：</p>
                      <ol className="list-decimal ml-5 space-y-1 text-xs">
                        <li><strong>readonly：</strong>只读事务，多个可并发</li>
                        <li><strong>readwrite：</strong>读写事务，同一 store 会串行</li>
                        <li><strong>versionchange：</strong>升级数据库结构时使用</li>
                      </ol>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// 创建事务
const transaction = db.transaction(['sessions'], 'readwrite');
const store = transaction.objectStore('sessions');

// 操作数据
store.add(data);
store.get(id);

// 事务自动提交，无需手动 commit`}
                      </pre>
                      <p className="text-purple-700 text-xs mt-2">
                        💡 <strong>优势：</strong>保证数据一致性，操作要么全成功，要么全失败
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 场景 3 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">👔</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    面试官：如何实现多会话的搜索功能？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>方案 1：客户端全文搜索</strong></p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`async search(keyword) {
  const sessions = await this.getAllSessions();
  const results = [];

  for (const session of sessions) {
    const messages = await this.getMessages(session.id);
    const matchedMessages = messages.filter(msg =>
      msg.content.includes(keyword)
    );
    
    if (matchedMessages.length > 0) {
      results.push({ session, messages: matchedMessages });
    }
  }

  return results;
}`}
                      </pre>
                      <p><strong>方案 2：建立索引（性能更好）</strong></p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`// 创建全文索引表
const indexStore = db.createObjectStore('searchIndex', { 
  keyPath: 'id' 
});
indexStore.createIndex('keyword', 'keyword');

// 添加消息时同时建立索引
await addToSearchIndex(messageId, keywords);`}
                      </pre>
                      <p className="text-purple-700 text-xs mt-2">
                        💡 <strong>阶跃星辰场景：</strong>结合后端搜索 API，本地索引作为快速预览
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 面试高频 QA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">❓ 面试高频 QA</h3>

          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: IndexedDB 的浏览器兼容性如何？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>支持情况：</strong></p>
                <ul className="list-disc ml-5 text-xs">
                  <li>Chrome 24+</li>
                  <li>Firefox 16+</li>
                  <li>Safari 10+</li>
                  <li>Edge 12+</li>
                  <li>移动端：iOS 10+, Android 4.4+</li>
                </ul>
                <p className="text-green-700 text-xs mt-2">✅ <strong>结论：</strong>现代浏览器全面支持，可放心使用</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: IndexedDB 的存储上限是多少？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>存储配额：</strong></p>
                <ul className="list-disc ml-5 text-xs">
                  <li>Chrome: 可用磁盘空间的 60%</li>
                  <li>Firefox: 可用磁盘空间的 50%</li>
                  <li>Safari: 1GB（可申请更多）</li>
                  <li>移动端：通常 50MB-100MB</li>
                </ul>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// 查询存储配额
if (navigator.storage && navigator.storage.estimate) {
  const { usage, quota } = await navigator.storage.estimate();
  console.log(\`已使用: \${usage / 1024 / 1024}MB\`);
  console.log(\`总配额: \${quota / 1024 / 1024}MB\`);
}`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 如何处理数据迁移和版本升级？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>onupgradeneeded 事件中处理：</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const oldVersion = event.oldVersion;

  // v1 → v2: 添加新字段
  if (oldVersion < 2) {
    const transaction = event.target.transaction;
    const store = transaction.objectStore('sessions');
    
    // 遍历所有记录，添加新字段
    store.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        const data = cursor.value;
        data.newField = 'default';
        cursor.update(data);
        cursor.continue();
      }
    };
  }

  // v2 → v3: 创建新表
  if (oldVersion < 3) {
    db.createObjectStore('newStore', { keyPath: 'id' });
  }
};`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: IndexedDB 和后端数据如何同步？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>常见同步策略：</strong></p>
                <div className="space-y-2">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-semibold text-blue-900 text-xs">策略 1: 本地优先（Offline First）</p>
                    <ul className="list-disc ml-5 text-xs mt-1">
                      <li>操作先写入 IndexedDB</li>
                      <li>后台异步同步到服务器</li>
                      <li>记录同步状态（pending/synced）</li>
                      <li>适用：离线应用、PWA</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-semibold text-green-900 text-xs">策略 2: 服务端优先（Server First）</p>
                    <ul className="list-disc ml-5 text-xs mt-1">
                      <li>操作先发送到服务器</li>
                      <li>成功后更新 IndexedDB</li>
                      <li>IndexedDB 作为缓存</li>
                      <li>适用：实时协作、多端同步</li>
                    </ul>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* 实际应用场景 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-3">💼 实际应用场景</h4>
          <div className="space-y-3 text-sm text-yellow-800">
            <div>
              <strong>1. ChatGPT 式多对话管理</strong>
              <ul className="list-disc ml-5 text-xs mt-1">
                <li>左侧会话列表，支持创建、删除、重命名</li>
                <li>右侧消息展示，按时间排序</li>
                <li>离线可用，打开即可看到历史对话</li>
              </ul>
            </div>
            <div>
              <strong>2. 邮件客户端</strong>
              <ul className="list-disc ml-5 text-xs mt-1">
                <li>缓存邮件列表和内容</li>
                <li>支持离线阅读</li>
                <li>本地搜索历史邮件</li>
              </ul>
            </div>
            <div>
              <strong>3. 笔记应用</strong>
              <ul className="list-disc ml-5 text-xs mt-1">
                <li>保存用户笔记到本地</li>
                <li>支持富文本、图片</li>
                <li>后台同步到云端</li>
              </ul>
            </div>
            <div>
              <strong>4. 游戏存档</strong>
              <ul className="list-disc ml-5 text-xs mt-1">
                <li>保存玩家进度</li>
                <li>存储游戏配置</li>
                <li>缓存游戏资源</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 追问场景 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-3">🔥 可能的追问</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div>
              <strong>追问 1：</strong>IndexedDB 是否支持跨域访问？
              <p className="ml-4 text-xs text-gray-700">→ 不支持，每个源（origin）有独立的数据库</p>
            </div>
            <div>
              <strong>追问 2：</strong>如何清理过期数据？
              <p className="ml-4 text-xs text-gray-700">→ 定期扫描 createdAt，删除超过 N 天的记录</p>
            </div>
            <div>
              <strong>追问 3：</strong>IndexedDB 性能如何优化？
              <p className="ml-4 text-xs text-gray-700">→ 使用索引、批量操作、避免大事务、合理分表</p>
            </div>
            <div>
              <strong>追问 4：</strong>用户清除浏览器数据会丢失吗？
              <p className="ml-4 text-xs text-gray-700">→ 会丢失，需要定期同步到服务器备份</p>
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
                  <span className="px-2 py-1 bg-indigo-300 text-indigo-950 rounded text-xs font-semibold">多会话管理</span>
                </div>
                <p className="text-gray-600 mt-2">
                  多会话管理是 AI 聊天产品的核心功能，属于<strong>应用层</strong>的关键特性。
                  它涉及数据持久化、状态管理、性能优化等多个技术点，是产品体验的基础。
                </p>
              </div>
            </div>

            {/* 技术栈关联 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">🔧 技术栈关联</h4>
              <div className="grid grid-cols-3 gap-4">
                {/* 底层技术 */}
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs font-semibold text-blue-900 mb-2">⬇️ 底层技术</div>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• IndexedDB API</li>
                    <li>• 事务处理</li>
                    <li>• LRU 缓存策略</li>
                    <li>• React 状态管理</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 数据持久化核心</p>
                </div>

                {/* 协同功能 */}
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 协同功能</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• 会话切换</li>
                    <li>• 搜索过滤</li>
                    <li>• 数据导出</li>
                    <li>• 云端同步</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 完整的会话体验</p>
                </div>

                {/* 产品价值 */}
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬆️ 产品价值</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• 多任务并行</li>
                    <li>• 历史回溯</li>
                    <li>• 离线可用</li>
                    <li>• 数据安全</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 提升用户留存</p>
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
                    <strong className="text-sm">基础实现：IndexedDB 增删改查</strong>
                    <p className="text-xs text-gray-600">使用 idb 库封装 IndexedDB 操作，实现基本的 CRUD</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">优化体验：快速切换 + 预加载</strong>
                    <p className="text-xs text-gray-600">缓存最近 10 个会话到内存，切换时 0 延迟</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">性能优化：LRU 缓存 + 懒加载</strong>
                    <p className="text-xs text-gray-600">限制内存占用，超过 100 条消息的会话分页加载</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">生产级：云端同步 + 冲突解决</strong>
                    <p className="text-xs text-gray-600">定期备份到服务器，处理多设备数据冲突</p>
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
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className="text-yellow-500">⭐</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">AI 聊天产品核心功能</p>
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
                  <p className="text-xs text-gray-600">产品体验决定性功能</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-purple-50 rounded">
                <p className="text-xs text-purple-800">
                  <strong>💡 面试建议：</strong>能讲清楚 IndexedDB vs LocalStorage 的区别、事务处理、缓存策略、性能优化方案。
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
                  <p className="text-xs text-gray-600 mt-1">需要掌握 IndexedDB、事务、异步处理、LRU缓存</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>业务复杂度</span>
                    <span className="text-purple-600 font-semibold">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要考虑数据同步、冲突解决、存储限制、用户体验</p>
                </div>
              </div>
            </div>

            {/* 查看完整体系 */}
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg text-center">
              <p className="text-sm text-indigo-900 mb-2">
                想了解完整的 AI 前端开发体系？
              </p>
              <a 
                href="/docs/MINDMAP" 
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
