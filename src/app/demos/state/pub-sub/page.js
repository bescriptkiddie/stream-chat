'use client';

import { useState, useEffect } from 'react';
import DemoContainer from '@/components/DemoContainer';

// 发布订阅模式实现 (EventEmitter)
class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 订阅事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    
    // 返回取消订阅函数
    return () => this.off(eventName, callback);
  }

  // 取消订阅
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
  }

  // 发布事件
  emit(eventName, data) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach(callback => callback(data));
  }

  // 订阅一次
  once(eventName, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }
}

// 全局事件总线
const eventBus = new EventEmitter();

// 组件A：发布者
function Publisher() {
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);

  const handlePublish = () => {
    if (!message.trim()) return;
    
    const timestamp = new Date().toLocaleTimeString();
    eventBus.emit('message', { text: message, time: timestamp });
    
    setLogs(prev => [...prev, { type: 'publish', text: message, time: timestamp }]);
    setMessage('');
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">📢 发布者 A</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handlePublish()}
          placeholder="输入消息..."
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        />
        <button
          onClick={handlePublish}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          发布
        </button>
      </div>
      
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 h-32 overflow-y-auto">
        <div className="text-xs font-semibold text-blue-700 mb-2">发布记录</div>
        {logs.length === 0 ? (
          <div className="text-gray-500 text-sm">暂无记录</div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="text-sm text-blue-900 mb-1">
              [{log.time}] 发布: "{log.text}"
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 组件B：订阅者1
function Subscriber1() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = eventBus.on('message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">👂 订阅者 B</h3>
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 h-32 overflow-y-auto">
        <div className="text-xs font-semibold text-green-700 mb-2">接收到的消息</div>
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm">等待消息...</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="text-sm text-green-900 mb-1">
              [{msg.time}] {msg.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 组件C：订阅者2 (只订阅一次)
function Subscriber2() {
  const [firstMessage, setFirstMessage] = useState(null);

  useEffect(() => {
    eventBus.once('message', (data) => {
      setFirstMessage(data);
    });
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">👂 订阅者 C (仅订阅一次)</h3>
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 h-32 overflow-y-auto">
        <div className="text-xs font-semibold text-yellow-700 mb-2">第一条消息</div>
        {!firstMessage ? (
          <div className="text-gray-500 text-sm">等待第一条消息...</div>
        ) : (
          <div className="text-sm text-yellow-900">
            [{firstMessage.time}] {firstMessage.text}
            <div className="text-xs text-yellow-600 mt-1">已自动取消订阅</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PubSubDemo() {
  return (
    <DemoContainer
      title="发布订阅模式"
      description="EventEmitter 实现解耦通信"
    >
      <div className="space-y-6">
        {/* 交互式 Demo */}
        <div className="grid grid-cols-1 gap-4">
          <Publisher />
          <div className="grid grid-cols-2 gap-4">
            <Subscriber1 />
            <Subscriber2 />
          </div>
        </div>

        {/* 核心概念 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💡 核心概念</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>解耦通信：</strong>发布者和订阅者不直接通信，通过事件中心</li>
            <li>• <strong>一对多：</strong>一个事件可以有多个订阅者</li>
            <li>• <strong>动态订阅：</strong>可以随时订阅和取消订阅</li>
            <li>• <strong>vs 观察者模式：</strong>发布订阅有事件中心，观察者模式是直接订阅</li>
          </ul>
        </div>

        {/* 核心代码实现 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">📝 核心代码实现</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 订阅事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    
    // 返回取消订阅函数
    return () => this.off(eventName, callback);
  }

  // 取消订阅
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(
      cb => cb !== callback
    );
  }

  // 发布事件
  emit(eventName, data) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach(callback => callback(data));
  }

  // 订阅一次
  once(eventName, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }
}

// 使用示例
const eventBus = new EventEmitter();

// 订阅
eventBus.on('userLogin', (user) => {
  console.log('User logged in:', user);
});

// 发布
eventBus.emit('userLogin', { id: 1, name: 'Alice' });`}
            </pre>
          </div>
        </div>

        {/* 面试场景模拟 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 面试场景模拟</h3>

          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：发布订阅模式和观察者模式有什么区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-semibold text-blue-900 mb-2">发布订阅模式</p>
                    <ul className="text-xs space-y-1">
                      <li>✅ 有事件中心（EventBus）</li>
                      <li>✅ 发布者和订阅者解耦</li>
                      <li>✅ 更灵活，支持多对多</li>
                      <li>✅ 示例：EventEmitter、Vue $on/$emit</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="font-semibold text-purple-900 mb-2">观察者模式</p>
                    <ul className="text-xs space-y-1">
                      <li>• 没有事件中心</li>
                      <li>• 主题直接维护观察者列表</li>
                      <li>• 较紧耦合</li>
                      <li>• 示例：DOM 事件、RxJS</li>
                    </ul>
                  </div>
                </div>
                <p className="text-purple-700 mt-2">💡 <strong>记忆技巧：</strong>发布订阅有"中介"，观察者是"直接订阅"</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：如何防止内存泄漏？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>问题：</strong>忘记取消订阅会导致内存泄漏</p>
                <p><strong>解决方案：</strong></p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li><strong>返回取消订阅函数：</strong>on 方法返回 unsubscribe 函数</li>
                  <li><strong>React useEffect cleanup：</strong>组件卸载时自动清理</li>
                  <li><strong>once 方法：</strong>自动取消订阅</li>
                  <li><strong>offAll 方法：</strong>清除所有订阅</li>
                </ol>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`useEffect(() => {
  const unsubscribe = eventBus.on('message', handleMessage);
  
  // cleanup: 组件卸载时取消订阅
  return unsubscribe;
}, []);`}
                </pre>
              </div>
            </details>
          </div>
        </div>

        {/* 面试高频 QA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">❓ 面试高频 QA</h3>

          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: 如何实现 once 方法？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`once(eventName, callback) {
  const wrapper = (data) => {
    callback(data);
    this.off(eventName, wrapper);
  };
  this.on(eventName, wrapper);
}

// 使用
eventBus.once('load', () => {
  console.log('只执行一次');
});`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 如何支持异步事件？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 异步 emit
async emitAsync(eventName, data) {
  if (!this.events[eventName]) return;
  
  await Promise.all(
    this.events[eventName].map(callback => callback(data))
  );
}

// 使用
eventBus.on('save', async (data) => {
  await api.save(data);
});

await eventBus.emitAsync('save', userData);`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 如何添加命名空间？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 支持命名空间
on(eventName, callback) {
  const [namespace, event] = eventName.split(':');
  const key = namespace ? eventName : \`default:\${eventName}\`;
  
  if (!this.events[key]) {
    this.events[key] = [];
  }
  this.events[key].push(callback);
}

// 使用
eventBus.on('user:login', handleLogin);
eventBus.on('user:logout', handleLogout);
eventBus.emit('user:login', userData);`}
                </pre>
              </div>
            </details>
          </div>
        </div>

        {/* 实际应用场景 */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h4 className="font-semibold text-green-900 mb-2">🎯 实际应用场景</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>全局通知：</strong>跨组件消息通知</li>
            <li>• <strong>模块通信：</strong>解耦模块间通信</li>
            <li>• <strong>插件系统：</strong>主应用和插件通信</li>
            <li>• <strong>埋点上报：</strong>统一的事件上报中心</li>
            <li>• <strong>状态同步：</strong>多个组件状态同步</li>
          </ul>
        </div>

        {/* 追问场景 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-3">🔥 可能的追问</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div>
              <strong>追问 1：</strong>如何实现优先级订阅？
              <p className="ml-4 text-xs text-gray-700">→ 给订阅者添加 priority 属性，执行时按优先级排序</p>
            </div>
            <div>
              <strong>追问 2：</strong>如何实现 removeAll 清除所有订阅？
              <p className="ml-4 text-xs text-gray-700">→ this.events = {} 或 delete this.events[eventName]</p>
            </div>
            <div>
              <strong>追问 3：</strong>Vue 2 和 Vue 3 的事件总线有什么区别？
              <p className="ml-4 text-xs text-gray-700">→ Vue 2 用 new Vue()，Vue 3 移除了，推荐用 mitt 库</p>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
