'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function EventLoopDemo() {
  const [executionLog, setExecutionLog] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // ===== 核心知识点：事件循环的执行顺序 =====
  const demoCode = `console.log('1: 同步代码开始');

setTimeout(() => {
  console.log('2: setTimeout (宏任务)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise.then (微任务)');
});

console.log('4: 同步代码结束');`;

  const addLog = (message, type = 'sync', step = null) => {
    setExecutionLog(prev => [...prev, {
      id: Date.now() + Math.random(),
      message,
      type,
      step,
      time: new Date().toLocaleTimeString('zh-CN', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        fractionalSecondDigits: 3 
      })
    }]);
  };

  // ===== 场景 1: 基础事件循环 =====
  const runBasicEventLoop = async () => {
    setExecutionLog([]);
    setIsRunning(true);
    setCurrentStep(0);

    // 模拟执行顺序
    await new Promise(r => setTimeout(r, 300));
    addLog('1: 同步代码开始', 'sync', 1);
    setCurrentStep(1);

    await new Promise(r => setTimeout(r, 300));
    addLog('注册 setTimeout 回调到宏任务队列', 'macro-register', 2);
    setCurrentStep(2);

    await new Promise(r => setTimeout(r, 300));
    addLog('注册 Promise.then 回调到微任务队列', 'micro-register', 3);
    setCurrentStep(3);

    await new Promise(r => setTimeout(r, 300));
    addLog('4: 同步代码结束', 'sync', 4);
    setCurrentStep(4);

    await new Promise(r => setTimeout(r, 500));
    addLog('同步代码执行完毕，开始清空微任务队列', 'info', 5);
    setCurrentStep(5);

    await new Promise(r => setTimeout(r, 300));
    addLog('3: Promise.then (微任务)', 'micro', 6);
    setCurrentStep(6);

    await new Promise(r => setTimeout(r, 500));
    addLog('微任务队列清空，开始执行宏任务', 'info', 7);
    setCurrentStep(7);

    await new Promise(r => setTimeout(r, 300));
    addLog('2: setTimeout (宏任务)', 'macro', 8);
    setCurrentStep(8);

    await new Promise(r => setTimeout(r, 300));
    addLog('✅ 事件循环完成', 'success', 9);
    setCurrentStep(9);
    setIsRunning(false);
  };

  // ===== 场景 2: 复杂事件循环 =====
  const complexCode = `console.log('1: start');

setTimeout(() => {
  console.log('2: setTimeout1');
  Promise.resolve().then(() => {
    console.log('3: Promise in setTimeout1');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('4: Promise1');
  setTimeout(() => {
    console.log('5: setTimeout in Promise1');
  }, 0);
});

Promise.resolve().then(() => {
  console.log('6: Promise2');
});

console.log('7: end');`;

  const runComplexEventLoop = async () => {
    setExecutionLog([]);
    setIsRunning(true);
    setCurrentStep(0);

    const steps = [
      { msg: '1: start', type: 'sync', delay: 300 },
      { msg: '注册 setTimeout1 → 宏任务队列', type: 'macro-register', delay: 300 },
      { msg: '注册 Promise1.then → 微任务队列', type: 'micro-register', delay: 300 },
      { msg: '注册 Promise2.then → 微任务队列', type: 'micro-register', delay: 300 },
      { msg: '7: end', type: 'sync', delay: 300 },
      { msg: '--- 同步代码完成，清空微任务队列 ---', type: 'info', delay: 500 },
      { msg: '4: Promise1', type: 'micro', delay: 300 },
      { msg: '  ↳ 注册 setTimeout2 → 宏任务队列', type: 'macro-register', delay: 200 },
      { msg: '6: Promise2', type: 'micro', delay: 300 },
      { msg: '--- 微任务清空，执行第1个宏任务 ---', type: 'info', delay: 500 },
      { msg: '2: setTimeout1', type: 'macro', delay: 300 },
      { msg: '  ↳ 注册 Promise3.then → 微任务队列', type: 'micro-register', delay: 200 },
      { msg: '--- 清空微任务队列 ---', type: 'info', delay: 300 },
      { msg: '3: Promise in setTimeout1', type: 'micro', delay: 300 },
      { msg: '--- 执行第2个宏任务 ---', type: 'info', delay: 500 },
      { msg: '5: setTimeout in Promise1', type: 'macro', delay: 300 },
      { msg: '✅ 所有任务完成', type: 'success', delay: 300 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, steps[i].delay));
      addLog(steps[i].msg, steps[i].type, i + 1);
      setCurrentStep(i + 1);
    }

    setIsRunning(false);
  };

  // ===== 场景 3: 实际运行（浏览器真实执行）=====
  const runRealEventLoop = () => {
    setExecutionLog([]);
    addLog('开始真实执行...', 'info');

    console.log('1: start');
    addLog('1: start', 'sync');

    setTimeout(() => {
      console.log('2: setTimeout1');
      addLog('2: setTimeout1', 'macro');
      
      Promise.resolve().then(() => {
        console.log('3: Promise in setTimeout1');
        addLog('3: Promise in setTimeout1', 'micro');
      });
    }, 0);

    Promise.resolve().then(() => {
      console.log('4: Promise1');
      addLog('4: Promise1', 'micro');
      
      setTimeout(() => {
        console.log('5: setTimeout in Promise1');
        addLog('5: setTimeout in Promise1', 'macro');
      }, 0);
    });

    Promise.resolve().then(() => {
      console.log('6: Promise2');
      addLog('6: Promise2', 'micro');
    });

    console.log('7: end');
    addLog('7: end', 'sync');
    
    setTimeout(() => {
      addLog('✅ 真实执行完成（检查控制台）', 'success');
    }, 100);
  };

  const clearLog = () => {
    setExecutionLog([]);
    setCurrentStep(0);
  };

  const getTypeStyles = (type) => {
    const styles = {
      'sync': 'bg-blue-50 border-l-4 border-blue-500 text-blue-900',
      'macro': 'bg-red-50 border-l-4 border-red-500 text-red-900',
      'micro': 'bg-green-50 border-l-4 border-green-500 text-green-900',
      'macro-register': 'bg-red-100 border-l-4 border-red-300 text-red-700 text-sm',
      'micro-register': 'bg-green-100 border-l-4 border-green-300 text-green-700 text-sm',
      'info': 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900 font-semibold',
      'success': 'bg-purple-50 border-l-4 border-purple-500 text-purple-900 font-bold'
    };
    return styles[type] || 'bg-gray-50 border-l-4 border-gray-300 text-gray-900';
  };

  return (
    <DemoContainer
      title="事件循环 (Event Loop)"
      description="JavaScript 异步编程核心 - 宏任务与微任务的执行顺序"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📚 事件循环核心概念</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                同步任务 (Synchronous)
              </h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 立即执行的代码</li>
                <li>• 在主线程上按顺序执行</li>
                <li>• 会阻塞后续代码</li>
                <li>• 例: console.log, 变量声明</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">🔴</span>
                宏任务 (Macro Task)
              </h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 异步执行的任务</li>
                <li>• 每次只执行一个宏任务</li>
                <li>• 执行完后检查微任务</li>
                <li>• 例: setTimeout, setInterval, I/O</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">🟢</span>
                微任务 (Micro Task)
              </h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 优先级高于宏任务</li>
                <li>• 会清空整个微任务队列</li>
                <li>• 在下一个宏任务前执行</li>
                <li>• 例: Promise.then, MutationObserver</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">🔄</span>
                执行顺序
              </h4>
              <ol className="text-sm text-gray-800 space-y-1 list-decimal ml-4">
                <li>执行所有同步代码</li>
                <li>清空微任务队列</li>
                <li>执行一个宏任务</li>
                <li>重复步骤 2-3</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 场景 1: 基础演示 */}
        <section className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            场景 1: 基础事件循环（逐步演示）
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {/* 代码 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">示例代码</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto font-mono">
{demoCode}
              </pre>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={runBasicEventLoop}
                  disabled={isRunning}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                >
                  {isRunning ? '执行中...' : '开始逐步演示'}
                </button>
                <button
                  onClick={clearLog}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  清空
                </button>
              </div>
            </div>

            {/* 执行日志 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">执行顺序</h4>
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 h-80 overflow-y-auto space-y-2">
                {executionLog.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    点击"开始逐步演示"查看执行过程
                  </div>
                ) : (
                  executionLog.map((log) => (
                    <div
                      key={log.id}
                      className={`p-2 rounded ${getTypeStyles(log.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="flex-1">{log.message}</span>
                        <span className="text-xs opacity-60 ml-2">{log.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
            <p className="text-sm text-yellow-800">
              <strong>💡 正确答案：</strong>1 → 4 → 3 → 2
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              同步代码先执行 (1, 4)，然后清空微任务 (3)，最后执行宏任务 (2)
            </p>
          </div>
        </section>

        {/* 场景 2: 复杂嵌套 */}
        <section className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            场景 2: 复杂嵌套（面试高频）⚠️
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {/* 代码 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">示例代码</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto font-mono whitespace-pre">
{complexCode}
              </pre>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={runComplexEventLoop}
                  disabled={isRunning}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                >
                  {isRunning ? '执行中...' : '逐步演示'}
                </button>
                <button
                  onClick={runRealEventLoop}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  真实运行
                </button>
                <button
                  onClick={clearLog}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  清空
                </button>
              </div>
            </div>

            {/* 执行日志 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">执行顺序详解</h4>
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 h-[500px] overflow-y-auto space-y-2">
                {executionLog.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    点击按钮查看执行过程
                  </div>
                ) : (
                  executionLog.map((log) => (
                    <div
                      key={log.id}
                      className={`p-2 rounded ${getTypeStyles(log.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="flex-1 font-mono text-sm">{log.message}</span>
                        <span className="text-xs opacity-60 ml-2">{log.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-3 rounded">
            <p className="text-sm text-green-800">
              <strong>💡 正确答案：</strong>1 → 7 → 4 → 6 → 2 → 3 → 5
            </p>
            <p className="text-xs text-green-700 mt-1">
              关键理解：每个宏任务执行后，都要清空微任务队列！
            </p>
          </div>
        </section>

        {/* 核心规则总结 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">🎯 事件循环核心规则</h4>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal ml-5">
            <li>
              <strong>同步代码优先：</strong>主线程的同步代码最先执行
            </li>
            <li>
              <strong>微任务优先于宏任务：</strong>Promise.then 比 setTimeout 先执行
            </li>
            <li>
              <strong>清空微任务队列：</strong>微任务会一次性全部执行完
            </li>
            <li>
              <strong>宏任务逐个执行：</strong>每次只执行一个宏任务
            </li>
            <li>
              <strong>循环检查：</strong>宏任务 → 微任务 → 宏任务 → 微任务...
            </li>
          </ol>
        </div>

        {/* 常见任务分类 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📋 常见任务分类表</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">同步任务</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• console.log()</li>
                <li>• 变量声明/赋值</li>
                <li>• 函数调用</li>
                <li>• 循环、条件判断</li>
                <li>• 同步 API 调用</li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-3">宏任务</h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• setTimeout()</li>
                <li>• setInterval()</li>
                <li>• setImmediate()</li>
                <li>• I/O 操作</li>
                <li>• UI 渲染</li>
                <li>• requestAnimationFrame</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-3">微任务</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Promise.then()</li>
                <li>• Promise.catch()</li>
                <li>• Promise.finally()</li>
                <li>• async/await</li>
                <li>• MutationObserver</li>
                <li>• queueMicrotask()</li>
              </ul>
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
                    面试官：请解释一下 JavaScript 的事件循环机制
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p>JavaScript 是单线程语言，通过事件循环实现异步。核心机制是：</p>
                      <ol className="list-decimal ml-5 space-y-1">
                        <li><strong>执行栈：</strong>执行所有同步代码</li>
                        <li><strong>微任务队列：</strong>清空所有微任务（Promise.then）</li>
                        <li><strong>宏任务队列：</strong>执行一个宏任务（setTimeout）</li>
                        <li><strong>循环：</strong>重复步骤 2-3，直到所有任务完成</li>
                      </ol>
                      <p className="mt-2">
                        <strong>关键点：</strong>微任务优先级高于宏任务，每执行一个宏任务后都要清空微任务队列。
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mt-2">
                    <div className="font-semibold text-red-900 mb-2">❌ 差的回答：</div>
                    <div className="text-sm text-gray-800">
                      "就是异步任务放到队列里，然后按顺序执行"（太笼统，没有区分宏任务和微任务）
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
                    面试官：下面代码输出什么？（经典题）
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm mb-3 font-mono">
{`async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

async1();

new Promise(resolve => {
  console.log('promise1');
  resolve();
}).then(() => {
  console.log('promise2');
});

console.log('script end');`}
                  </pre>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 正确答案：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <pre className="bg-white p-2 rounded text-xs font-mono">
{`script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout`}
                      </pre>
                      <p><strong>解析：</strong></p>
                      <ol className="list-decimal ml-5 space-y-1 text-xs">
                        <li>同步代码：script start → async1 start → async2 → promise1 → script end</li>
                        <li>微任务：async1 end (await后的代码) → promise2</li>
                        <li>宏任务：setTimeout</li>
                      </ol>
                      <p className="text-xs text-purple-700 mt-2">
                        💡 <strong>关键：</strong>await 后面的代码相当于 Promise.then()，是微任务！
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
                    面试官：为什么微任务要一次性清空，而宏任务要逐个执行？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>设计目的不同：</strong></p>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="font-semibold text-blue-900">微任务（一次性清空）</p>
                        <ul className="list-disc ml-5 text-xs mt-1">
                          <li>目的：保证状态一致性</li>
                          <li>场景：Promise 链式调用需要连续执行</li>
                          <li>好处：避免中间状态被宏任务打断</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 p-3 rounded mt-2">
                        <p className="font-semibold text-red-900">宏任务（逐个执行）</p>
                        <ul className="list-disc ml-5 text-xs mt-1">
                          <li>目的：避免阻塞渲染</li>
                          <li>场景：setTimeout、I/O 等耗时操作</li>
                          <li>好处：每个宏任务后都能渲染 UI，保证响应性</li>
                        </ul>
                      </div>
                      <p className="text-purple-700 text-xs mt-2">
                        💡 <strong>比喻：</strong>微任务像"快递员一次送完所有快递"，宏任务像"每送一件快递休息一下"
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
                Q1: Node.js 的事件循环和浏览器有什么区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>主要区别：</strong></p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-semibold text-blue-900">浏览器</p>
                    <ul className="list-disc ml-5 text-xs mt-2">
                      <li>微任务：清空队列</li>
                      <li>宏任务：逐个执行</li>
                      <li>每个宏任务后可能渲染</li>
                      <li>setTimeout 最小延迟 4ms</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-semibold text-green-900">Node.js</p>
                    <ul className="list-disc ml-5 text-xs mt-2">
                      <li>分为 6 个阶段（timers、I/O等）</li>
                      <li>每个阶段执行完才检查微任务</li>
                      <li>setImmediate 和 setTimeout 顺序不固定</li>
                      <li>process.nextTick 优先级最高</li>
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: requestAnimationFrame 是宏任务还是微任务？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>都不是！它是独立的渲染阶段任务</strong></p>
                <p>执行顺序：</p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1 font-mono">
{`1. 执行同步代码
2. 清空微任务队列
3. 执行 requestAnimationFrame 回调
4. 渲染 UI
5. 执行宏任务`}
                </pre>
                <p className="text-purple-700 text-xs">
                  💡 rAF 在每次浏览器重绘前执行，用于流畅动画（60fps）
                </p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: async/await 是如何转换成 Promise 的？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>await 会将后续代码放入微任务队列：</strong></p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold mb-1">async/await 写法</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono">
{`async function foo() {
  console.log('1');
  await bar();
  console.log('2');
}

foo();
console.log('3');`}
                    </pre>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">等价的 Promise 写法</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono">
{`function foo() {
  console.log('1');
  return Promise.resolve(bar())
    .then(() => {
      console.log('2');
    });
}

foo();
console.log('3');`}
                    </pre>
                  </div>
                </div>
                <p className="text-xs">输出：1 → 3 → 2</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 如何让宏任务立即执行？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>无法！但可以用这些技巧：</strong></p>
                <ol className="list-decimal ml-5 space-y-2 text-xs">
                  <li>
                    <strong>使用 Promise 替代 setTimeout：</strong>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1 font-mono">
{`// setTimeout 是宏任务，会等微任务完成
setTimeout(() => console.log('宏任务'), 0);

// Promise.then 是微任务，更快执行
Promise.resolve().then(() => console.log('微任务'));`}
                    </pre>
                  </li>
                  <li>
                    <strong>Node.js 使用 setImmediate：</strong>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1 font-mono">
{`setImmediate(() => {
  console.log('比 setTimeout 更快');
});`}
                    </pre>
                  </li>
                  <li>
                    <strong>关键理解：</strong>宏任务必须等微任务清空，这是设计原则，无法绕过
                  </li>
                </ol>
              </div>
            </details>
          </div>
        </div>

        {/* 实际应用场景 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-3">💼 实际应用场景</h4>
          <div className="space-y-3 text-sm text-yellow-800">
            <div>
              <strong>1. 优化用户体验（分批渲染大量数据）</strong>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1 font-mono">
{`function renderLargeList(items) {
  const batchSize = 100;
  let index = 0;
  
  function renderBatch() {
    const batch = items.slice(index, index + batchSize);
    batch.forEach(item => renderItem(item));
    index += batchSize;
    
    if (index < items.length) {
      setTimeout(renderBatch, 0); // 分批渲染，不阻塞 UI
    }
  }
  
  renderBatch();
}`}
              </pre>
            </div>
            <div>
              <strong>2. 确保 DOM 更新后执行（微任务）</strong>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1 font-mono">
{`element.textContent = 'new value';

Promise.resolve().then(() => {
  // 保证在这次渲染周期内执行，但在 DOM 更新后
  console.log(element.offsetHeight); // 获取最新高度
});`}
              </pre>
            </div>
            <div>
              <strong>3. 防抖节流原理（宏任务）</strong>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1 font-mono">
{`function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer); // 取消之前的宏任务
    timer = setTimeout(() => fn(...args), delay); // 创建新的宏任务
  };
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* 追问场景 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-3">🔥 可能的追问</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div>
              <strong>追问 1：</strong>如果微任务中又创建了新的微任务，会怎样？
              <p className="ml-4 text-xs text-gray-700">→ 新的微任务会加入队列，继续执行，直到队列清空（可能死循环）</p>
            </div>
            <div>
              <strong>追问 2：</strong>为什么 setTimeout(fn, 0) 不是立即执行？
              <p className="ml-4 text-xs text-gray-700">→ 因为要等同步代码和微任务执行完，且浏览器有 4ms 最小延迟</p>
            </div>
            <div>
              <strong>追问 3：</strong>如何实现一个精准的定时器？
              <p className="ml-4 text-xs text-gray-700">→ 使用 requestAnimationFrame + 时间戳校准，或 Web Worker</p>
            </div>
            <div>
              <strong>追问 4：</strong>React 的 setState 是同步还是异步的？
              <p className="ml-4 text-xs text-gray-700">→ 在事件处理中是"异步"（批量更新），在 setTimeout 中是"同步"</p>
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
                  <span className="px-2 py-1 bg-cyan-300 text-cyan-950 rounded text-xs font-semibold">事件循环机制</span>
                </div>
                <p className="text-gray-600 mt-2">
                  事件循环是 JavaScript 异步编程的核心机制，属于<strong>语言层</strong>的底层原理。
                  它是理解 Promise、async/await、定时器、React 状态更新等所有异步行为的基础。
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
                    <li>• 调用栈（Call Stack）</li>
                    <li>• 执行上下文</li>
                    <li>• 同步与异步概念</li>
                    <li>• 回调函数</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 理解单线程模型</p>
                </div>

                {/* 横向关联 */}
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 横向关联</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• Promise 原理</li>
                    <li>• async/await</li>
                    <li>• Generator 函数</li>
                    <li>• 浏览器渲染机制</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 异步编程全家桶</p>
                </div>

                {/* 后续应用 */}
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬇️ 后续应用</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• React 状态更新</li>
                    <li>• 防抖节流</li>
                    <li>• SSE 流式处理</li>
                    <li>• 性能优化</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 异步场景必备</p>
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
                    <strong className="text-sm">当前阶段：理解事件循环</strong>
                    <p className="text-xs text-gray-600">掌握宏任务、微任务执行顺序，能画出执行流程图</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">下一步：深入 Promise</strong>
                    <p className="text-xs text-gray-600">理解 Promise 是如何利用微任务实现的</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">进阶：async/await 原理</strong>
                    <p className="text-xs text-gray-600">理解 async/await 的语法糖本质和执行流程</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">深入：React 调度机制</strong>
                    <p className="text-xs text-gray-600">理解 React 如何利用事件循环实现批量更新和并发模式</p>
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
                  <p className="text-xs text-gray-600">几乎每场面试必考</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">难度系数：</span>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <span key={i} className="text-red-500">🔥</span>
                      ))}
                      <span className="text-gray-300">🔥</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">中高难度，需深入理解</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 rounded">
                <p className="text-xs text-yellow-800">
                  <strong>💡 面试建议：</strong>能画出执行流程图，能手写执行顺序题，能讲清楚宏任务和微任务的区别，就能拿 90 分以上。
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
                    <span className="text-cyan-600 font-semibold">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-cyan-600 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要深入理解：任务队列、执行栈、浏览器渲染时机</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>广度（应用场景）</span>
                    <span className="text-green-600 font-semibold">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '95%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">应用极广：所有异步场景（定时器、网络请求、React、Vue等）</p>
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
      </div>
    </DemoContainer>
  );
}
