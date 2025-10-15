'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function ClosureDemo() {
  // ===== 场景 1: 计数器（最经典的闭包应用）=====
  const [counters, setCounters] = useState([]);

  // 创建闭包计数器
  function createCounter() {
    let count = 0; // 私有变量，外部无法直接访问
    
    return {
      increment: () => ++count,
      decrement: () => --count,
      getCount: () => count
    };
  }

  const addCounter = () => {
    const newCounter = createCounter();
    setCounters([...counters, { id: Date.now(), counter: newCounter, value: 0 }]);
  };

  const updateCounter = (id, action) => {
    setCounters(counters.map(item => {
      if (item.id === id) {
        const newValue = action === 'inc' ? item.counter.increment() : item.counter.decrement();
        return { ...item, value: newValue };
      }
      return item;
    }));
  };

  // ===== 场景 2: 循环陷阱（经典面试题）=====
  const [loopResults, setLoopResults] = useState([]);

  // 错误示例：使用 var
  const wrongLoop = () => {
    const results = [];
    for (var i = 0; i < 5; i++) {
      setTimeout(() => {
        results.push(`点击按钮 ${i}`); // i 始终是 5
      }, 100);
    }
    setTimeout(() => setLoopResults(results), 200);
  };

  // 正确示例 1：使用 let
  const correctLoop1 = () => {
    const results = [];
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        results.push(`点击按钮 ${i}`); // 每个 i 都被闭包捕获
      }, 100);
    }
    setTimeout(() => setLoopResults(results), 200);
  };

  // 正确示例 2：使用闭包
  const correctLoop2 = () => {
    const results = [];
    for (var i = 0; i < 5; i++) {
      (function(index) { // 立即执行函数创建闭包
        setTimeout(() => {
          results.push(`点击按钮 ${index}`);
        }, 100);
      })(i);
    }
    setTimeout(() => setLoopResults(results), 200);
  };

  // ===== 场景 3: 私有变量（模拟私有属性）=====
  const [bankAccount, setBankAccount] = useState(null);

  function createBankAccount(initialBalance) {
    let balance = initialBalance; // 私有变量

    return {
      deposit: (amount) => {
        if (amount > 0) {
          balance += amount;
          return `存入 ${amount} 元，余额: ${balance}`;
        }
        return '金额必须大于 0';
      },
      withdraw: (amount) => {
        if (amount > 0 && amount <= balance) {
          balance -= amount;
          return `取出 ${amount} 元，余额: ${balance}`;
        }
        return '余额不足或金额无效';
      },
      getBalance: () => balance
    };
  }

  const initAccount = () => {
    setBankAccount(createBankAccount(1000));
  };

  const handleDeposit = () => {
    if (bankAccount) {
      const result = bankAccount.deposit(100);
      alert(result);
      setBankAccount({ ...bankAccount }); // 触发重新渲染
    }
  };

  const handleWithdraw = () => {
    if (bankAccount) {
      const result = bankAccount.withdraw(50);
      alert(result);
      setBankAccount({ ...bankAccount });
    }
  };

  return (
    <DemoContainer
      title="闭包演示 (Closure)"
      description="JavaScript 闭包原理与实际应用场景"
    >
      <div className="space-y-8">
        {/* 闭包定义 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📚 什么是闭包？</h3>
          <div className="text-gray-800 space-y-2">
            <p className="text-lg">
              <strong>简单定义：</strong>函数 + 函数能访问的外部变量 = 闭包
            </p>
            <p className="text-sm text-gray-600">
              当内部函数引用了外部函数的变量时，即使外部函数执行完毕，这些变量也不会被销毁，内部函数依然可以访问。
            </p>
          </div>
        </div>

        {/* 场景 1: 计数器 */}
        <section className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            场景 1: 计数器（私有变量）
          </h3>
          
          <div className="mb-4">
            <button
              onClick={addCounter}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              + 创建新计数器
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {counters.map((item) => (
              <div key={item.id} className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-3xl font-bold text-blue-900">{item.value}</div>
                  <div className="text-xs text-gray-600">计数器 #{item.id.toString().slice(-4)}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateCounter(item.id, 'dec')}
                    className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateCounter(item.id, 'inc')}
                    className="flex-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
{`function createCounter() {
  let count = 0; // 私有变量，外部无法访问
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter1 = createCounter();
counter1.increment(); // 1
counter1.increment(); // 2

const counter2 = createCounter();
counter2.increment(); // 1 (独立的闭包)
`}
            </pre>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            💡 每个计数器都有自己独立的 <code className="bg-gray-200 px-1 rounded">count</code> 变量，互不干扰
          </div>
        </section>

        {/* 场景 2: 循环陷阱 */}
        <section className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            场景 2: 循环中的闭包陷阱 ⚠️（高频面试题）
          </h3>

          <div className="flex gap-3 mb-4">
            <button
              onClick={wrongLoop}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              错误示例 (var)
            </button>
            <button
              onClick={correctLoop1}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              正确示例 (let)
            </button>
            <button
              onClick={correctLoop2}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              正确示例 (IIFE)
            </button>
          </div>

          {loopResults.length > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
              <div className="font-semibold mb-2">执行结果：</div>
              {loopResults.map((result, idx) => (
                <div key={idx} className="text-sm">{result}</div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <strong className="text-red-900">❌ 错误写法 (var):</strong>
              <pre className="text-sm text-red-800 mt-2 overflow-x-auto">
{`for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // 全部输出 5
  }, 100);
}
// 原因: var 是函数作用域，i 被共享`}
              </pre>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
              <strong className="text-green-900">✅ 正确写法 1 (let):</strong>
              <pre className="text-sm text-green-800 mt-2 overflow-x-auto">
{`for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // 输出 0, 1, 2, 3, 4
  }, 100);
}
// 原因: let 是块级作用域，每次循环创建新的 i`}
              </pre>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <strong className="text-blue-900">✅ 正确写法 2 (立即执行函数):</strong>
              <pre className="text-sm text-blue-800 mt-2 overflow-x-auto">
{`for (var i = 0; i < 5; i++) {
  (function(index) {
    setTimeout(() => {
      console.log(index); // 输出 0, 1, 2, 3, 4
    }, 100);
  })(i);
}
// 原因: IIFE 创建闭包，捕获每次的 i 值`}
              </pre>
            </div>
          </div>
        </section>

        {/* 场景 3: 私有变量 */}
        <section className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            场景 3: 模拟私有属性（银行账户）
          </h3>

          {!bankAccount ? (
            <button
              onClick={initAccount}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-lg"
            >
              创建银行账户（初始 1000 元）
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 text-center">
                <div className="text-sm text-gray-600 mb-1">当前余额</div>
                <div className="text-4xl font-bold text-purple-900">
                  ¥ {bankAccount.getBalance()}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeposit}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  存入 100 元
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  取出 50 元
                </button>
              </div>

              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`function createBankAccount(initialBalance) {
  let balance = initialBalance; // 私有变量
  
  return {
    deposit: (amount) => {
      balance += amount;
      return balance;
    },
    withdraw: (amount) => {
      if (amount <= balance) {
        balance -= amount;
        return balance;
      }
      return '余额不足';
    },
    getBalance: () => balance
  };
}

// 无法直接访问 balance
// account.balance = 9999; // ❌ 不起作用
// 只能通过暴露的方法操作 ✅
`}
                </pre>
              </div>

              <div className="text-sm text-gray-600">
                💡 <code className="bg-gray-200 px-1 rounded">balance</code> 变量无法从外部直接访问或修改，保证了数据安全
              </div>
            </div>
          )}
        </section>

        {/* 总结 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">🎯 闭包核心要点总结</h3>
          
          <div className="space-y-3 text-gray-800">
            <div className="flex gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <strong>什么是闭包？</strong>
                <p className="text-sm text-gray-600">内部函数引用外部函数变量，形成封闭作用域</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <strong>闭包的作用</strong>
                <p className="text-sm text-gray-600">• 创建私有变量 • 保持状态 • 模块化封装</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <strong>常见应用场景</strong>
                <p className="text-sm text-gray-600">计数器、防抖节流、事件处理、柯里化、模块模式</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">4️⃣</span>
              <div>
                <strong>注意事项</strong>
                <p className="text-sm text-gray-600">• 内存泄漏风险 • 循环中的陷阱 • 及时释放引用</p>
              </div>
            </div>
          </div>
        </div>

        {/* 思维体系定位 */}
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 border-2 border-cyan-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-cyan-900 mb-4 flex items-center gap-2">
            🧠 思维体系定位
          </h3>

          <div className="space-y-6">
            {/* 在前端体系中的位置 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-cyan-900 mb-3">📍 在前端体系中的位置</h4>
              <div className="text-sm text-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-xs font-semibold">第二层：语言核心</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-cyan-200 text-cyan-900 rounded text-xs font-semibold">JavaScript 核心</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-cyan-300 text-cyan-950 rounded text-xs font-semibold">作用域链</span>
                </div>
                <p className="text-gray-600 mt-2">
                  闭包是 JavaScript 中最核心的概念之一，属于<strong>语言层</strong>的基础能力。
                  它是理解作用域链、执行上下文的关键，也是 React Hooks、模块化等上层应用的基础。
                </p>
              </div>
            </div>

            {/* 知识关联图 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-cyan-900 mb-3">🔗 知识关联图</h4>
              <div className="grid grid-cols-3 gap-4">
                {/* 前置知识 */}
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs font-semibold text-blue-900 mb-2">⬆️ 前置知识</div>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• 执行上下文</li>
                    <li>• 作用域（全局/局部）</li>
                    <li>• 函数调用栈</li>
                    <li>• 变量提升</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 先掌握这些，闭包更容易理解</p>
                </div>

                {/* 横向关联 */}
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 横向关联</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• this 指向</li>
                    <li>• 原型链</li>
                    <li>• 箭头函数</li>
                    <li>• IIFE（立即执行函数）</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 同层级的核心概念</p>
                </div>

                {/* 后续应用 */}
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬇️ 后续应用</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• React Hooks（useState）</li>
                    <li>• 防抖/节流</li>
                    <li>• 模块化（ES6 Module）</li>
                    <li>• 柯里化</li>
                    <li>• 发布订阅模式</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 实际项目中的应用</p>
                </div>
              </div>
            </div>

            {/* 学习路径 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-cyan-900 mb-3">🛤️ 学习路径建议</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">1️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">当前阶段：理解闭包</strong>
                    <p className="text-xs text-gray-600">掌握闭包的定义、原理、应用场景、注意事项</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">下一步：学习 this 指向</strong>
                    <p className="text-xs text-gray-600">结合闭包，理解 this 在不同场景下的表现</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">进阶：手写防抖节流</strong>
                    <p className="text-xs text-gray-600">将闭包应用到实际项目中，加深理解</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">深入：理解 React Hooks</strong>
                    <p className="text-xs text-gray-600">从原理层面理解 useState 如何利用闭包</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 面试重要性 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-cyan-900 mb-3">⭐ 面试重要性评估</h4>
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
                  <p className="text-xs text-gray-600">几乎每场 JS 面试都会问到</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">难度系数：</span>
                    <div className="flex gap-1">
                      {[1,2,3].map(i => (
                        <span key={i} className="text-red-500">🔥</span>
                      ))}
                      <span className="text-gray-300">🔥🔥</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">中等难度，关键是理解透彻</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 rounded">
                <p className="text-xs text-yellow-800">
                  <strong>💡 面试建议：</strong>能用一句话解释，能手写应用场景，能讲清楚原理和注意事项，就能拿到 90 分以上。
                </p>
              </div>
            </div>

            {/* 知识深度与广度 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-cyan-900 mb-3">📊 知识深度 vs 广度</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>深度（理论层面）</span>
                    <span className="text-cyan-600 font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-cyan-600 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要深入理解：作用域链、执行上下文、内存管理</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>广度（应用场景）</span>
                    <span className="text-green-600 font-semibold">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">应用广泛：防抖节流、模块化、Hooks、柯里化、事件处理等</p>
                </div>
              </div>
            </div>

            {/* 查看完整体系 */}
            <div className="bg-gradient-to-r from-cyan-100 to-teal-100 p-4 rounded-lg text-center">
              <p className="text-sm text-cyan-900 mb-2">
                想了解完整的前端知识体系？
              </p>
              <a 
                href="/docs/MINDMAP" 
                target="_blank"
                className="inline-block px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium"
              >
                📖 查看完整思维导图
              </a>
            </div>
          </div>
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
                    面试官：能用一句话解释什么是闭包吗？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p className="font-bold text-lg">"闭包就是函数加上它能访问的外部变量"</p>
                      <p>更准确地说：当一个内部函数引用了外部函数的变量时，即使外部函数执行完毕，这些变量也不会被销毁，内部函数依然可以访问它们，这就形成了闭包。</p>
                      <p className="text-gray-600 mt-2">举个例子：</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function outer() {
  let count = 0;  // 外部变量
  return function inner() {
    count++;      // 内部函数引用外部变量
    return count;
  };
}
const counter = outer();
counter(); // 1  ← 闭包让 count 一直存活
counter(); // 2`}
                      </pre>
                    </div>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mt-2">
                    <div className="font-semibold text-red-900 mb-2">❌ 差的回答：</div>
                    <div className="text-sm text-gray-800">
                      "闭包就是函数里面套函数"（不准确，嵌套函数不一定是闭包）
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
                    面试官：下面代码会输出什么？
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm mb-3">
{`for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
// 输出什么？`}
                  </pre>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>输出：3 3 3</strong></p>
                      <p><strong>原因分析：</strong></p>
                      <ol className="list-decimal ml-5 space-y-1">
                        <li><code>var</code> 是函数作用域，整个循环只有一个 <code>i</code></li>
                        <li>setTimeout 是异步的，回调函数会在循环结束后才执行</li>
                        <li>执行时 <code>i</code> 已经变成 3，所以三次都输出 3</li>
                      </ol>
                      <p className="mt-2"><strong>解决方法：</strong></p>
                      <div className="space-y-2">
                        <div>
                          <strong>方法 1：改用 let</strong>
                          <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// 输出 0 1 2 (let 是块级作用域)`}
                          </pre>
                        </div>
                        <div>
                          <strong>方法 2：立即执行函数（IIFE）</strong>
                          <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 1000);
  })(i);
}
// 输出 0 1 2 (IIFE 创建新作用域)`}
                          </pre>
                        </div>
                      </div>
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
                    面试官：闭包会造成内存泄漏吗？怎么避免？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>闭包本身不会造成内存泄漏，但使用不当会导致</strong></p>
                      <p className="text-red-700 font-semibold">❌ 容易泄漏的场景：</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function createHandler() {
  const largeData = new Array(1000000);
  
  return function() {
    console.log(largeData.length); // 持续引用大对象
  };
}

const handler = createHandler();
// largeData 永远不会被释放，导致内存泄漏`}
                      </pre>
                      <p className="text-green-700 font-semibold mt-3">✅ 避免泄漏的方法：</p>
                      <ol className="list-decimal ml-5 space-y-1">
                        <li><strong>及时解除引用：</strong></li>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`let handler = createHandler();
// 使用完后
handler = null; // 解除引用，允许垃圾回收`}
                        </pre>
                        <li><strong>只保留必要的变量：</strong></li>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function createHandler() {
  const largeData = new Array(1000000);
  const length = largeData.length; // 只保留需要的
  
  return function() {
    console.log(length); // 不引用整个 largeData
  };
}`}
                        </pre>
                        <li><strong>使用 WeakMap 存储大对象：</strong>弱引用不会阻止垃圾回收</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 场景 4 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">👔</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    面试官：实际项目中闭包有哪些应用场景？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-3">
                      <div>
                        <p><strong>1. 防抖节流（最常见）</strong></p>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function debounce(fn, delay) {
  let timer = null; // 闭包变量
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`}
                        </pre>
                      </div>
                      <div>
                        <p><strong>2. 模块化封装（私有方法）</strong></p>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`const userModule = (() => {
  const users = []; // 私有数据
  
  return {
    addUser: (user) => users.push(user),
    getUsers: () => [...users] // 返回副本
  };
})();`}
                        </pre>
                      </div>
                      <div>
                        <p><strong>3. 柯里化（函数式编程）</strong></p>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
}

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6`}
                        </pre>
                      </div>
                      <div>
                        <p><strong>4. React Hooks 内部实现</strong></p>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function useState(initialValue) {
  let state = initialValue; // 闭包保存状态
  
  function setState(newValue) {
    state = newValue;
    render(); // 触发重新渲染
  }
  
  return [state, setState];
}`}
                        </pre>
                      </div>
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
                Q1: 闭包和作用域链是什么关系？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>闭包是作用域链的应用：</strong></p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>作用域链：当前作用域 → 外层作用域 → 全局作用域</li>
                  <li>闭包保存了函数定义时的整个作用域链</li>
                  <li>即使外层函数执行完毕，作用域链仍然保留</li>
                </ul>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`let global = 'global';

function outer() {
  let outerVar = 'outer';
  
  function inner() {
    let innerVar = 'inner';
    console.log(innerVar);  // 当前作用域
    console.log(outerVar);  // 外层作用域（闭包）
    console.log(global);    // 全局作用域
  }
  return inner;
}

const fn = outer(); // inner 的作用域链被保留`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 箭头函数会形成闭包吗？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>会！箭头函数也能形成闭包</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function outer() {
  let count = 0;
  
  // 箭头函数形成闭包
  return () => ++count;
}

const counter = outer();
counter(); // 1
counter(); // 2`}
                </pre>
                <p><strong>区别：</strong></p>
                <ul className="list-disc ml-5">
                  <li>箭头函数没有自己的 <code>this</code>，会继承外层的 <code>this</code></li>
                  <li>这也是一种闭包行为（捕获外层的 <code>this</code>）</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 如何检测是否存在内存泄漏？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>使用 Chrome DevTools：</strong></p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>打开 Performance 标签，录制内存快照</li>
                  <li>重复操作，观察内存是否持续增长</li>
                  <li>使用 Memory 标签查看堆快照（Heap Snapshot）</li>
                  <li>对比不同时间点的快照，查找未释放的对象</li>
                </ol>
                <p className="mt-2"><strong>代码层面检测：</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`// 记录对象创建
const activeHandlers = new Set();

function createHandler() {
  const handler = () => {};
  activeHandlers.add(handler);
  return handler;
}

// 定期检查
setInterval(() => {
  console.log('Active handlers:', activeHandlers.size);
}, 5000);`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 闭包的性能影响大吗？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>性能影响很小，不必过度担心</strong></p>
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ 可以放心使用的场景：</p>
                  <ul className="list-disc ml-5 text-xs">
                    <li>事件处理函数（数量有限）</li>
                    <li>防抖节流（每个函数只创建一个闭包）</li>
                    <li>React Hooks（框架层面优化）</li>
                    <li>模块化封装（单例模式）</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-3 rounded mt-2">
                  <p className="font-semibold text-red-900">⚠️ 需要注意的场景：</p>
                  <ul className="list-disc ml-5 text-xs">
                    <li>循环中大量创建闭包（优先用 let）</li>
                    <li>闭包引用大对象（WeakMap 优化）</li>
                    <li>长期保留的闭包未清理（及时解除引用）</li>
                  </ul>
                </div>
                <p className="text-purple-700">💡 <strong>建议：</strong>先写清晰的代码，遇到性能问题再优化。</p>
              </div>
            </details>
          </div>
        </div>

        {/* 追问场景 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-3">🔥 可能的追问</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div>
              <strong>追问 1：</strong>能手写一个 React 的 useState 吗？
              <p className="ml-4 text-xs text-gray-700">→ 考察闭包 + 状态管理理解</p>
            </div>
            <div>
              <strong>追问 2：</strong>为什么函数式组件每次渲染都会创建新闭包？
              <p className="ml-4 text-xs text-gray-700">→ 考察 React 原理 + 闭包理解</p>
            </div>
            <div>
              <strong>追问 3：</strong>闭包和原型链有什么区别？
              <p className="ml-4 text-xs text-gray-700">→ 考察 JS 基础概念区分</p>
            </div>
            <div>
              <strong>追问 4：</strong>如何用闭包实现单例模式？
              <p className="ml-4 text-xs text-gray-700">→ 考察设计模式 + 闭包应用</p>
            </div>
            <div>
              <strong>追问 5：</strong>ES6 模块和闭包实现的模块有什么区别？
              <p className="ml-4 text-xs text-gray-700">→ 考察现代 JS 特性理解</p>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
