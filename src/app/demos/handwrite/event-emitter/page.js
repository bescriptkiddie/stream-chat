'use client';

import { useState, useRef } from 'react';
import DemoContainer from '@/components/DemoContainer';

// ===== 手写 EventEmitter =====
class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 订阅事件
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  // 订阅一次
  once(event, listener) {
    const onceWrapper = (...args) => {
      listener.apply(this, args);
      this.off(event, onceWrapper);
    };
    return this.on(event, onceWrapper);
  }

  // 发布事件
  emit(event, ...args) {
    if (!this.events[event]) return false;
    this.events[event].forEach(listener => {
      listener.apply(this, args);
    });
    return true;
  }

  // 取消订阅
  off(event, listener) {
    if (!this.events[event]) return this;
    if (!listener) {
      delete this.events[event];
      return this;
    }
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }

  // 获取所有监听器
  listeners(event) {
    return this.events[event] || [];
  }

  // 获取监听器数量
  listenerCount(event) {
    return this.listeners(event).length;
  }
}

export default function EventEmitterDemo() {
  const [logs, setLogs] = useState([]);
  const emitterRef = useRef(new EventEmitter());

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      time: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  const clearLogs = () => setLogs([]);

  // 测试用例
  const testBasic = () => {
    clearLogs();
    const emitter = new EventEmitter();

    addLog('=== 测试 1: 基础订阅发布 ===', 'info');

    emitter.on('message', (msg) => {
      addLog(`收到消息: ${msg}`, 'success');
    });

    emitter.emit('message', 'Hello World');
    emitter.emit('message', '第二条消息');
  };

  const testOnce = () => {
    clearLogs();
    const emitter = new EventEmitter();

    addLog('=== 测试 2: once 只触发一次 ===', 'info');

    emitter.once('login', (user) => {
      addLog(`用户登录: ${user}`, 'success');
    });

    emitter.emit('login', 'Alice');
    emitter.emit('login', 'Bob'); // 不会触发
    addLog('第二次 emit 不会触发 once 监听器', 'info');
  };

  const testMultiple = () => {
    clearLogs();
    const emitter = new EventEmitter();

    addLog('=== 测试 3: 多个监听器 ===', 'info');

    emitter.on('click', () => addLog('监听器 1', 'sync'));
    emitter.on('click', () => addLog('监听器 2', 'sync'));
    emitter.on('click', () => addLog('监听器 3', 'sync'));

    addLog(`当前有 ${emitter.listenerCount('click')} 个监听器`, 'info');
    emitter.emit('click');
  };

  const testOff = () => {
    clearLogs();
    const emitter = new EventEmitter();

    addLog('=== 测试 4: 取消订阅 ===', 'info');

    const handler = () => addLog('这条消息', 'success');
    
    emitter.on('test', handler);
    emitter.emit('test');

    emitter.off('test', handler);
    addLog('已取消订阅', 'info');
    emitter.emit('test'); // 不会触发
  };

  const testRealWorld = () => {
    clearLogs();
    const emitter = emitterRef.current;

    addLog('=== 测试 5: 实际应用 - AI 对话系统 ===', 'info');

    // 模拟 AI 对话场景
    emitter.on('message:send', (msg) => {
      addLog(`📤 发送消息: ${msg}`, 'sync');
    });

    emitter.on('message:receive', (msg) => {
      addLog(`📥 接收回复: ${msg}`, 'success');
    });

    emitter.on('token:update', (count) => {
      addLog(`🪙 Token 消耗: ${count}`, 'info');
    });

    // 模拟发送消息
    setTimeout(() => {
      emitter.emit('message:send', '你好，AI！');
      emitter.emit('token:update', 5);
    }, 500);

    setTimeout(() => {
      emitter.emit('message:receive', '你好！有什么可以帮你的？');
      emitter.emit('token:update', 12);
    }, 1000);
  };

  return (
    <DemoContainer
      title="手写 EventEmitter"
      description="发布订阅模式 - 架构能力体现"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📚 发布订阅模式</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">核心方法</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• <code>on(event, fn)</code> 订阅</li>
                <li>• <code>emit(event, ...args)</code> 发布</li>
                <li>• <code>off(event, fn)</code> 取消</li>
                <li>• <code>once(event, fn)</code> 一次</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">应用场景</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 组件通信</li>
                <li>• 状态变化通知</li>
                <li>• 插件系统</li>
                <li>• 消息队列</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-900 mb-2">优势</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 解耦组件</li>
                <li>• 一对多通信</li>
                <li>• 动态添加/移除</li>
                <li>• 灵活扩展</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 测试按钮 */}
        <div className="flex gap-3 flex-wrap">
          <button onClick={testBasic} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            测试 1: 基础订阅发布
          </button>
          <button onClick={testOnce} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            测试 2: once 一次性
          </button>
          <button onClick={testMultiple} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            测试 3: 多个监听器
          </button>
          <button onClick={testOff} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
            测试 4: 取消订阅
          </button>
          <button onClick={testRealWorld} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            测试 5: 实际应用
          </button>
          <button onClick={clearLogs} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
            清空
          </button>
        </div>

        {/* 日志输出 */}
        <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              选择一个测试用例
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

        {/* 完整代码 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💻 完整实现代码</h4>
          <details>
            <summary className="cursor-pointer text-sm text-blue-800">点击查看</summary>
            <div className="mt-3 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs">
{`class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this; // 链式调用
  }

  once(event, listener) {
    const onceWrapper = (...args) => {
      listener.apply(this, args);
      this.off(event, onceWrapper);
    };
    return this.on(event, onceWrapper);
  }

  emit(event, ...args) {
    if (!this.events[event]) return false;
    this.events[event].forEach(listener => {
      listener.apply(this, args);
    });
    return true;
  }

  off(event, listener) {
    if (!this.events[event]) return this;
    if (!listener) {
      delete this.events[event];
      return this;
    }
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }
}

// 使用示例
const emitter = new EventEmitter();

// 订阅
emitter.on('message', (msg) => {
  console.log('收到:', msg);
});

// 发布
emitter.emit('message', 'Hello');`}
              </pre>
            </div>
          </details>
        </div>

        {/* 思维体系定位 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">🧠 思维体系定位</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-purple-900 mb-2">🏗️ 设计模式</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 发布订阅模式</li>
                <li>• 观察者模式对比</li>
                <li>• 事件驱动架构</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-blue-900 mb-2">📦 数据结构</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 哈希表（事件映射）</li>
                <li>• 数组（监听器列表）</li>
                <li>• 队列（消息队列）</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-green-900 mb-2">⚡ 架构能力</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 解耦与模块化</li>
                <li>• 插件系统设计</li>
                <li>• 异步通信</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 实战应用场景 */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">🚀 实战应用场景</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">1️⃣ AI 对话系统（阶跃星辰）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`const EventBus = new EventEmitter();

// 消息发送
EventBus.on('message:send', async (msg) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: msg })
  });
  EventBus.emit('message:receive', await response.json());
});

// Token 监控
EventBus.on('message:receive', (data) => {
  EventBus.emit('token:update', data.usage);
});

// 使用
EventBus.emit('message:send', '你好');`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">2️⃣ React 跨组件通信</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// EventBus.js
export const eventBus = new EventEmitter();

// ComponentA.js
function ComponentA() {
  const handleClick = () => {
    eventBus.emit('user:login', { id: 1, name: 'Alice' });
  };
}

// ComponentB.js
function ComponentB() {
  useEffect(() => {
    eventBus.on('user:login', (user) => {
      console.log('用户登录:', user);
    });
    return () => eventBus.off('user:login');
  }, []);
}`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">3️⃣ 插件系统</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`class PluginSystem {
  constructor() {
    this.emitter = new EventEmitter();
    this.plugins = [];
  }
  
  use(plugin) {
    this.plugins.push(plugin);
    plugin.install(this.emitter);
  }
  
  emit(event, data) {
    this.emitter.emit(event, data);
  }
}

// 插件
const LoggerPlugin = {
  install(emitter) {
    emitter.on('*', (event, data) => {
      console.log(\`[\${event}]\`, data);
    });
  }
};`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">4️⃣ WebSocket 消息分发</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`const ws = new WebSocket('ws://localhost:3000');
const emitter = new EventEmitter();

ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  emitter.emit(type, data);
};

// 订阅不同类型的消息
emitter.on('user:online', (user) => {
  updateUserList(user);
});

emitter.on('chat:message', (msg) => {
  appendMessage(msg);
});`}
              </pre>
            </div>
          </div>
        </div>

        {/* 面试高频 QA */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 面试高频 QA</h3>
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: 发布订阅模式 vs 观察者模式的区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <p className="font-semibold text-blue-900 mb-2">发布订阅模式</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 中间有事件中心
Publisher → EventBus → Subscriber

// 特点：
// - 发布者和订阅者不直接接触
// - 通过事件中心解耦
// - 支持多对多
// - 异步通信

const bus = new EventEmitter();
bus.on('event', fn);
bus.emit('event');`}
                    </pre>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <p className="font-semibold text-green-900 mb-2">观察者模式</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 直接订阅
Subject → Observer

// 特点：
// - 主题和观察者直接关联
// - 耦合度较高
// - 通常是同步的
// - 一对多

subject.attach(observer);
subject.notify();`}
                    </pre>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 如何实现 once 方法？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`once(event, listener) {
  // 创建包装函数
  const onceWrapper = (...args) => {
    listener.apply(this, args);  // 1. 执行原函数
    this.off(event, onceWrapper); // 2. 立即移除自己
  };
  
  // 订阅包装函数（而不是原函数）
  return this.on(event, onceWrapper);
}

// 使用
emitter.once('login', () => {
  console.log('只执行一次');
});

emitter.emit('login'); // 执行
emitter.emit('login'); // 不执行（已移除）`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 如何避免内存泄漏？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <p className="font-semibold text-red-900 mb-2">⚠️ 常见内存泄漏场景：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mb-2">
{`// ❌ 忘记取消订阅
useEffect(() => {
  emitter.on('event', handler);
  // 没有 return cleanup
}, []);

// ✅ 正确做法
useEffect(() => {
  emitter.on('event', handler);
  return () => emitter.off('event', handler);
}, []);`}
                  </pre>
                  <p className="font-semibold text-green-900 mt-3 mb-2">💡 优化方案：</p>
                  <ol className="list-decimal ml-5 text-xs space-y-1">
                    <li>组件卸载时清理所有监听器</li>
                    <li>使用 WeakMap 存储监听器</li>
                    <li>实现 removeAllListeners 方法</li>
                    <li>监听器数量限制（防止过多订阅）</li>
                  </ol>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 如何支持命名空间？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 使用冒号分隔命名空间
emitter.on('user:login', handler);
emitter.on('user:logout', handler);
emitter.on('chat:message', handler);

// 取消整个命名空间
offNamespace(namespace) {
  Object.keys(this.events).forEach(event => {
    if (event.startsWith(namespace + ':')) {
      delete this.events[event];
    }
  });
}

// 使用
emitter.offNamespace('user'); // 移除所有 user:* 事件`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q5: 如何支持异步事件处理？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-teal-50 border-l-4 border-teal-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 方法 1: 返回 Promise 数组
async emitAsync(event, ...args) {
  if (!this.events[event]) return [];
  
  const promises = this.events[event].map(listener => 
    Promise.resolve(listener.apply(this, args))
  );
  
  return Promise.all(promises);
}

// 使用
await emitter.emitAsync('data:save', data);

// 方法 2: 串行执行
async emitSerial(event, ...args) {
  if (!this.events[event]) return;
  
  for (const listener of this.events[event]) {
    await listener.apply(this, args);
  }
}

// 使用（按顺序等待）
await emitter.emitSerial('pipeline:process', data);`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q6: 如何实现通配符监听？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 支持 * 通配符
emit(event, ...args) {
  // 1. 触发精确匹配
  if (this.events[event]) {
    this.events[event].forEach(fn => fn.apply(this, args));
  }
  
  // 2. 触发通配符
  if (this.events['*']) {
    this.events['*'].forEach(fn => fn(event, ...args));
  }
  
  // 3. 触发前缀匹配（可选）
  Object.keys(this.events).forEach(pattern => {
    if (pattern.includes('*') && matchPattern(event, pattern)) {
      this.events[pattern].forEach(fn => fn.apply(this, args));
    }
  });
}

// 使用
emitter.on('*', (event, data) => {
  console.log(\`所有事件: [\${event}]\`, data);
});

emitter.on('user:*', (event, data) => {
  console.log(\`用户相关: [\${event}]\`, data);
});`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q7: Node.js EventEmitter 和手写版本的区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-pink-50 border-l-4 border-pink-500 p-3 rounded">
                  <p className="font-semibold text-pink-900 mb-2">Node.js EventEmitter 额外功能：</p>
                  <ul className="list-disc ml-5 text-xs space-y-1 mb-2">
                    <li>setMaxListeners(n) - 设置监听器数量上限</li>
                    <li>prependListener() - 添加到监听器列表开头</li>
                    <li>eventNames() - 返回所有事件名称</li>
                    <li>rawListeners() - 返回原始监听器（包含 once 包装器）</li>
                    <li>error 事件特殊处理（未监听会抛出异常）</li>
                    <li>性能优化（C++ 实现）</li>
                  </ul>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// Node.js EventEmitter
const EventEmitter = require('events');
const emitter = new EventEmitter();

// 默认最多 10 个监听器
emitter.setMaxListeners(20);

// error 事件特殊处理
emitter.emit('error', new Error('boom')); 
// 如果没有监听器，会抛出异常`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q8: 面试官追问：如何实现优先级队列？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`class PriorityEventEmitter extends EventEmitter {
  on(event, listener, priority = 0) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    // 添加优先级属性
    this.events[event].push({ listener, priority });
    
    // 按优先级排序（降序）
    this.events[event].sort((a, b) => b.priority - a.priority);
    
    return this;
  }
  
  emit(event, ...args) {
    if (!this.events[event]) return false;
    
    // 按优先级顺序执行
    this.events[event].forEach(({ listener }) => {
      listener.apply(this, args);
    });
    
    return true;
  }
}

// 使用
const emitter = new PriorityEventEmitter();
emitter.on('event', () => console.log('low'), 1);
emitter.on('event', () => console.log('high'), 10);
emitter.on('event', () => console.log('medium'), 5);

emitter.emit('event');
// 输出: high → medium → low`}
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
              <h4 className="font-semibold text-red-900 mb-2">❌ 陷阱 1：this 指向问题</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：this 丢失
class Component {
  constructor() {
    this.name = 'Component';
    emitter.on('event', this.handler);
  }
  handler() {
    console.log(this.name); // undefined
  }
}

// ✅ 方法 1：箭头函数
emitter.on('event', () => this.handler());

// ✅ 方法 2：bind
emitter.on('event', this.handler.bind(this));`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900 mb-2">❌ 陷阱 2：监听器重复添加</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 每次 render 都添加新监听器
function Component() {
  useEffect(() => {
    emitter.on('event', () => {
      console.log('handler');
    });
  }); // 缺少依赖数组
}

// ✅ 正确：添加依赖数组
useEffect(() => {
  const handler = () => console.log('handler');
  emitter.on('event', handler);
  return () => emitter.off('event', handler);
}, []); // 空数组，只执行一次`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900 mb-2">❌ 陷阱 3：监听器执行顺序依赖</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 依赖监听器执行顺序（不推荐）
emitter.on('save', saveData);
emitter.on('save', updateUI); // 依赖 saveData 先执行

// ✅ 方法 1：在监听器内部处理依赖
emitter.on('save', async () => {
  await saveData();
  updateUI();
});

// ✅ 方法 2：使用事件链
emitter.on('save', async () => {
  await saveData();
  emitter.emit('save:complete');
});
emitter.on('save:complete', updateUI);`}
              </pre>
            </div>
          </div>
        </div>

        {/* 性能优化 */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-cyan-900 mb-4">⚡ 性能优化方案</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">1️⃣ 使用 Set 替代数组（去重 + 性能）</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`class FastEventEmitter {
  constructor() {
    this.events = new Map(); // Map 比普通对象快
  }
  
  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set()); // Set 自动去重
    }
    this.events.get(event).add(listener);
    return this;
  }
  
  off(event, listener) {
    this.events.get(event)?.delete(listener); // Set.delete O(1)
    return this;
  }
}`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">2️⃣ 监听器数量限制</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`constructor() {
  this.maxListeners = 10;
}

on(event, listener) {
  if (this.listenerCount(event) >= this.maxListeners) {
    console.warn(\`MaxListenersExceeded: \${event}\`);
  }
  // ...
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* 实际应用 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">💼 阶跃星辰 AI 产品应用</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`// 1. 全局事件总线
const EventBus = new EventEmitter();

// 2. AI 消息系统
EventBus.on('ai:message:send', (message) => {
  sendToAI(message);
});

EventBus.on('ai:message:receive', (response) => {
  updateUI(response);
});

EventBus.on('ai:token:update', (count) => {
  updateTokenCount(count);
});

// 3. 会话管理
EventBus.on('session:create', (session) => {
  saveSession(session);
});

EventBus.on('session:delete', (sessionId) => {
  removeSession(sessionId);
});

// 4. 使用
function sendMessage(content) {
  EventBus.emit('ai:message:send', { content });
}`}
          </pre>
        </div>
      </div>
    </DemoContainer>
  );
}
