'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

// ===== 手写 Promise 实现 =====
class MyPromise {
  constructor(executor) {
    this.state = 'pending';  // pending, fulfilled, rejected
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }

      if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let count = 0;
      
      if (promises.length === 0) {
        resolve(results);
        return;
      }

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(value => {
          results[index] = value;
          count++;
          if (count === promises.length) {
            resolve(results);
          }
        }, reject);
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        MyPromise.resolve(promise).then(resolve, reject);
      });
    });
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected'));
  }

  if (x instanceof MyPromise) {
    x.then(resolve, reject);
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let called = false;
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

export default function HandwritePromiseDemo() {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, result, status) => {
    setTestResults(prev => [...prev, { test, result, status }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // 测试用例
  const runTests = async () => {
    setIsRunning(true);
    clearResults();

    // 测试1：基本resolve
    const p1 = new MyPromise(resolve => {
      setTimeout(() => resolve('成功！'), 500);
    });
    p1.then(value => {
      addResult('测试1: 基本resolve', value, 'success');
    });

    // 测试2：基本reject
    const p2 = new MyPromise((resolve, reject) => {
      setTimeout(() => reject('失败！'), 600);
    });
    p2.catch(reason => {
      addResult('测试2: 基本reject', reason, 'error');
    });

    // 测试3：链式调用
    const p3 = new MyPromise(resolve => {
      setTimeout(() => resolve(1), 700);
    });
    p3.then(value => value + 1)
      .then(value => value + 1)
      .then(value => {
        addResult('测试3: 链式调用', `1 + 1 + 1 = ${value}`, 'success');
      });

    // 测试4：Promise.all
    const p4 = MyPromise.all([
      MyPromise.resolve(1),
      MyPromise.resolve(2),
      MyPromise.resolve(3)
    ]);
    p4.then(values => {
      addResult('测试4: Promise.all', `[${values.join(', ')}]`, 'success');
    });

    // 测试5：Promise.race
    const p5 = MyPromise.race([
      new MyPromise(resolve => setTimeout(() => resolve('慢'), 1000)),
      new MyPromise(resolve => setTimeout(() => resolve('快'), 800))
    ]);
    p5.then(value => {
      addResult('测试5: Promise.race', `最快的是: ${value}`, 'success');
    });

    setTimeout(() => setIsRunning(false), 1500);
  };

  return (
    <DemoContainer
      title="手写 Promise"
      description="符合 Promise/A+ 规范的完整实现 - 大厂面试必考"
    >
      <div className="space-y-6">
        {/* 核心知识点 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">🎯 核心知识点</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-900 mb-2">三种状态</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• pending - 进行中</li>
                <li>• fulfilled - 已成功</li>
                <li>• rejected - 已失败</li>
              </ul>
              <p className="text-xs text-purple-600 mt-2">状态只能改变一次！</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">核心方法</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• then() - 注册回调</li>
                <li>• catch() - 捕获错误</li>
                <li>• resolve() - 成功</li>
                <li>• reject() - 失败</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">静态方法</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Promise.all()</li>
                <li>• Promise.race()</li>
                <li>• Promise.resolve()</li>
                <li>• Promise.reject()</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 交互演示 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">🎮 运行测试</h3>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition font-medium"
            >
              {isRunning ? '测试运行中...' : '运行所有测试'}
            </button>
          </div>

          <div className="space-y-2">
            {testResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                点击按钮运行测试，查看 Promise 实现效果
              </div>
            ) : (
              testResults.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-l-4 ${
                    item.status === 'success'
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="font-semibold text-sm text-gray-900">{item.test}</div>
                  <div className={`text-sm mt-1 ${
                    item.status === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {item.result}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 完整代码实现 */}
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">📝 完整实现代码</h4>
          <details className="cursor-pointer">
            <summary className="text-yellow-400 mb-2">点击查看完整代码（约150行）</summary>
            <pre className="text-xs overflow-x-auto mt-2 bg-gray-800 p-4 rounded">
{`class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' 
      ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' 
      ? onRejected : reason => { throw reason };

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      // ... 其他状态处理
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let count = 0;
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(value => {
          results[index] = value;
          count++;
          if (count === promises.length) resolve(results);
        }, reject);
      });
    });
  }
}`}
            </pre>
          </details>
        </div>

        {/* 面试场景模拟 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 真实面试场景</h3>

          <div className="space-y-6">
            {/* 场景1 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👔</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    面试官：请手写一个符合 Promise/A+ 规范的 Promise
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 回答思路：</div>
                    <ol className="text-sm text-gray-800 space-y-2 list-decimal ml-5">
                      <li><strong>状态管理：</strong>pending、fulfilled、rejected三种状态，只能改变一次</li>
                      <li><strong>then方法：</strong>返回新Promise，支持链式调用</li>
                      <li><strong>异步处理：</strong>使用回调队列存储，状态改变后执行</li>
                      <li><strong>值穿透：</strong>then参数不是函数时，值要向下传递</li>
                      <li><strong>错误捕获：</strong>executor执行错误要reject</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* 场景2 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👔</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    面试官：Promise.all 和 Promise.race 的区别是什么？手写实现
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 核心区别：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>Promise.all：</strong>所有成功才成功，一个失败就失败</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`static all(promises) {
  return new MyPromise((resolve, reject) => {
    const results = [];
    let count = 0;
    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        value => {
          results[index] = value;
          if (++count === promises.length) resolve(results);
        },
        reject  // 一个失败就reject
      );
    });
  });
}`}
                      </pre>
                      <p className="mt-2"><strong>Promise.race：</strong>最快的决定结果</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`static race(promises) {
  return new MyPromise((resolve, reject) => {
    promises.forEach(promise => {
      MyPromise.resolve(promise).then(resolve, reject);
    });
  });
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 场景3 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👔</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    面试官：为什么 then 方法要用 setTimeout？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 原因：</div>
                    <div className="text-sm text-gray-800">
                      <p className="mb-2">Promise/A+ 规范要求 then 回调必须<strong>异步执行</strong>：</p>
                      <ul className="list-disc ml-5 space-y-1">
                        <li>保证 then 方法在 Promise resolve 之后执行</li>
                        <li>避免同步执行导致的栈溢出</li>
                        <li>确保执行顺序的一致性</li>
                      </ul>
                      <p className="mt-2 text-purple-700">
                        💡 <strong>生产环境：</strong>可以用 queueMicrotask() 或 MutationObserver 实现微任务
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 高频QA */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">❓ 高频面试问题</h3>
          <div className="space-y-3">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold cursor-pointer">Q1: Promise 解决了什么问题？</summary>
              <div className="mt-3 text-sm text-gray-800">
                <p><strong>解决了回调地狱问题：</strong></p>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>让异步代码更优雅，链式调用代替嵌套</li>
                  <li>统一的错误处理机制（catch）</li>
                  <li>更好的状态管理和流程控制</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold cursor-pointer">Q2: Promise 有哪些缺点？</summary>
              <div className="mt-3 text-sm text-gray-800">
                <ul className="list-disc ml-5 space-y-1">
                  <li>无法取消，一旦创建就会执行</li>
                  <li>内部错误如果不catch，外部无法捕获</li>
                  <li>pending状态时，无法知道进度</li>
                </ul>
                <p className="mt-2 text-blue-700">💡 解决方案：使用 async/await 或引入取消机制</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold cursor-pointer">Q3: async/await 和 Promise 的关系？</summary>
              <div className="mt-3 text-sm text-gray-800">
                <p>async/await 是 Promise 的语法糖：</p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// Promise 写法
function getData() {
  return fetch('/api')
    .then(res => res.json())
    .then(data => console.log(data));
}

// async/await 写法（本质还是Promise）
async function getData() {
  const res = await fetch('/api');
  const data = await res.json();
  console.log(data);
}`}
                </pre>
              </div>
            </details>
          </div>
        </div>

        {/* 关键要点 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-2">⚠️ 面试关键要点</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>✅ <strong>必须能手写：</strong>至少写出基础版本（构造函数 + then）</li>
            <li>✅ <strong>讲清楚原理：</strong>三种状态、回调队列、链式调用</li>
            <li>✅ <strong>对比Promise和async/await：</strong>知道本质关系</li>
            <li>✅ <strong>知道应用场景：</strong>并发请求（all）、超时控制（race）</li>
            <li>💡 <strong>加分项：</strong>了解 Promise/A+ 规范细节</li>
          </ul>
        </div>
      </div>
    </DemoContainer>
  );
}
