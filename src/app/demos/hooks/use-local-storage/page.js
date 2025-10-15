'use client';

import { useState, useEffect } from 'react';
import DemoContainer from '@/components/DemoContainer';

// ===== 核心：useLocalStorage Hook 实现 =====
function useLocalStorage(key, initialValue) {
  // 状态初始化
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // 更新 localStorage
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default function UseLocalStorageDemo() {
  const [name, setName] = useLocalStorage('userName', '');
  const [age, setAge] = useLocalStorage('userAge', 0);
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearAll = () => {
    setName('');
    setAge(0);
    setTheme('light');
    setTodos([]);
  };

  return (
    <DemoContainer
      title="useLocalStorage Hook"
      description="持久化状态管理 - 自动同步到 localStorage"
    >
      <div className="space-y-6">
        {/* 基础用法 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">📝 基础用法</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名（会自动保存）
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入姓名..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年龄
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                placeholder="输入年龄..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              主题偏好
            </label>
            <div className="flex gap-2">
              {['light', 'dark', 'auto'].map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    theme === t
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 复杂数据结构 */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">📋 Todo List（持久化）</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="添加待办事项..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring focus:ring-green-200"
            />
            <button
              onClick={addTodo}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              添加
            </button>
          </div>
          <div className="space-y-2">
            {todos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                暂无待办事项，添加一个试试
              </div>
            ) : (
              todos.map(todo => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5"
                  />
                  <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                  >
                    删除
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 当前存储的值 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">💾 当前 LocalStorage 中的值</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
            <div><span className="text-yellow-400">userName:</span> "{name}"</div>
            <div><span className="text-yellow-400">userAge:</span> {age}</div>
            <div><span className="text-yellow-400">theme:</span> "{theme}"</div>
            <div><span className="text-yellow-400">todos:</span> {JSON.stringify(todos, null, 2)}</div>
          </div>
          <button
            onClick={clearAll}
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            清空所有数据
          </button>
        </div>

        {/* 核心代码实现 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💡 核心代码实现</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`function useLocalStorage(key, initialValue) {
  // 初始化：从 localStorage 读取
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // 更新：同时更新 state 和 localStorage
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// 使用
const [name, setName] = useLocalStorage('userName', '');
const [todos, setTodos] = useLocalStorage('todos', []);`}
            </pre>
          </div>
        </div>

        {/* 优势与注意事项 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h4 className="font-semibold text-green-900 mb-2">✅ 优势</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• 自动持久化，刷新页面不丢失</li>
              <li>• API 与 useState 一致，易用</li>
              <li>• 支持复杂数据结构（自动 JSON 序列化）</li>
              <li>• 减少样板代码</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ 注意事项</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• 容量限制：5-10MB</li>
              <li>• 只能存储字符串（需要序列化）</li>
              <li>• 同步 API，大数据可能阻塞</li>
              <li>• 不适合敏感数据（明文存储）</li>
            </ul>
          </div>
        </div>

        {/* 面试要点 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">🎯 面试考点</h3>
          <div className="space-y-3">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: useLocalStorage 和 useState 有什么区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <p><strong>核心区别：</strong></p>
                <ul className="list-disc ml-5 mt-2">
                  <li><strong>useState:</strong> 只在内存中，刷新丢失</li>
                  <li><strong>useLocalStorage:</strong> 持久化到磁盘，刷新保留</li>
                </ul>
                <p className="mt-2">useLocalStorage = useState + localStorage 同步</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 如何实现跨标签页同步？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <p>监听 <code>storage</code> 事件：</p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === key && e.newValue) {
      setStoredValue(JSON.parse(e.newValue));
    }
  };
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, [key]);`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 什么时候用 localStorage vs sessionStorage vs Cookie？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <ul className="space-y-2">
                  <li><strong>localStorage:</strong> 永久数据（用户偏好、缓存）</li>
                  <li><strong>sessionStorage:</strong> 临时数据（表单草稿、会话状态）</li>
                  <li><strong>Cookie:</strong> 需要发送到服务器（Token、会话ID）</li>
                </ul>
              </div>
            </details>
          </div>
        </div>

        {/* 实际应用 */}
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <h4 className="font-semibold text-indigo-900 mb-2">🚀 实际应用场景</h4>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• <strong>用户偏好：</strong>主题、语言、字体大小</li>
            <li>• <strong>表单草稿：</strong>自动保存，防止数据丢失</li>
            <li>• <strong>购物车：</strong>离线购物车数据</li>
            <li>• <strong>最近浏览：</strong>历史记录</li>
            <li>• <strong>离线缓存：</strong>API 响应缓存</li>
          </ul>
        </div>
      </div>
    </DemoContainer>
  );
}
