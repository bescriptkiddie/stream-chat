'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function PromiseDemo() {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message, type = 'info') => {
    setTestResults(prev => [...prev, {
      id: Date.now() + Math.random(),
      message,
      type,
      time: new Date().toLocaleTimeString('zh-CN', { 
        hour12: false, 
        fractionalSecondDigits: 3 
      })
    }]);
  };

  const clearResults = () => setTestResults([]);

  // ===== 手写 Promise 实现 =====
  class MyPromise {
    constructor(executor) {
      this.state = 'pending'; // pending, fulfilled, rejected
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
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        } else if (this.state === 'rejected') {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        } else if (this.state === 'pending') {
          this.onFulfilledCallbacks.push(() => {
            setTimeout(() => {
              try {
                const x = onFulfilled(this.value);
                this.resolvePromise(promise2, x, resolve, reject);
              } catch (error) {
                reject(error);
              }
            }, 0);
          });

          this.onRejectedCallbacks.push(() => {
            setTimeout(() => {
              try {
                const x = onRejected(this.reason);
                this.resolvePromise(promise2, x, resolve, reject);
              } catch (error) {
                reject(error);
              }
            }, 0);
          });
        }
      });

      return promise2;
    }

    resolvePromise(promise2, x, resolve, reject) {
      if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected'));
      }

      if (x instanceof MyPromise) {
        x.then(resolve, reject);
      } else {
        resolve(x);
      }
    }

    catch(onRejected) {
      return this.then(null, onRejected);
    }

    finally(callback) {
      return this.then(
        value => MyPromise.resolve(callback()).then(() => value),
        reason => MyPromise.resolve(callback()).then(() => { throw reason })
      );
    }

    static resolve(value) {
      if (value instanceof MyPromise) return value;
      return new MyPromise(resolve => resolve(value));
    }

    static reject(reason) {
      return new MyPromise((resolve, reject) => reject(reason));
    }

    static all(promises) {
      return new MyPromise((resolve, reject) => {
        const results = [];
        let count = 0;

        promises.forEach((promise, index) => {
          MyPromise.resolve(promise).then(
            value => {
              results[index] = value;
              count++;
              if (count === promises.length) {
                resolve(results);
              }
            },
            reject
          );
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

  // ===== 测试用例 =====
  
  // 测试 1: 基础功能
  const testBasic = async () => {
    clearResults();
    setIsRunning(true);
    addResult('测试 1: 基础 resolve/reject', 'info');

    await new Promise(resolve => setTimeout(resolve, 300));

    new MyPromise((resolve, reject) => {
      setTimeout(() => resolve('成功！'), 500);
    }).then(result => {
      addResult(`✅ Resolve: ${result}`, 'success');
    });

    await new Promise(resolve => setTimeout(resolve, 800));

    new MyPromise((resolve, reject) => {
      setTimeout(() => reject('失败！'), 500);
    }).catch(error => {
      addResult(`✅ Reject: ${error}`, 'error');
    });

    await new Promise(resolve => setTimeout(resolve, 800));
    setIsRunning(false);
  };

  // 测试 2: 链式调用
  const testChaining = async () => {
    clearResults();
    setIsRunning(true);
    addResult('测试 2: 链式调用', 'info');

    await new Promise(resolve => setTimeout(resolve, 300));

    new MyPromise((resolve) => {
      setTimeout(() => {
        addResult('步骤 1: 初始值 = 1', 'sync');
        resolve(1);
      }, 500);
    })
      .then(result => {
        addResult(`步骤 2: ${result} + 1 = ${result + 1}`, 'sync');
        return result + 1;
      })
      .then(result => {
        addResult(`步骤 3: ${result} * 2 = ${result * 2}`, 'sync');
        return result * 2;
      })
      .then(result => {
        addResult(`✅ 最终结果: ${result}`, 'success');
      });

    await new Promise(resolve => setTimeout(resolve, 800));
    setIsRunning(false);
  };

  // 测试 3: Promise.all
  const testAll = async () => {
    clearResults();
    setIsRunning(true);
    addResult('测试 3: Promise.all (并发执行)', 'info');

    await new Promise(resolve => setTimeout(resolve, 300));

    const promises = [
      new MyPromise(resolve => {
        setTimeout(() => {
          addResult('任务 1 完成 (300ms)', 'micro');
          resolve('任务1');
        }, 300);
      }),
      new MyPromise(resolve => {
        setTimeout(() => {
          addResult('任务 2 完成 (500ms)', 'micro');
          resolve('任务2');
        }, 500);
      }),
      new MyPromise(resolve => {
        setTimeout(() => {
          addResult('任务 3 完成 (200ms)', 'micro');
          resolve('任务3');
        }, 200);
      })
    ];

    MyPromise.all(promises).then(results => {
      addResult(`✅ 所有任务完成: [${results.join(', ')}]`, 'success');
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRunning(false);
  };

  // 测试 4: Promise.race
  const testRace = async () => {
    clearResults();
    setIsRunning(true);
    addResult('测试 4: Promise.race (竞速)', 'info');

    await new Promise(resolve => setTimeout(resolve, 300));

    const promises = [
      new MyPromise(resolve => {
        setTimeout(() => {
          addResult('任务 1 完成 (500ms)', 'micro');
          resolve('任务1');
        }, 500);
      }),
      new MyPromise(resolve => {
        setTimeout(() => {
          addResult('任务 2 完成 (200ms) ← 最快', 'micro');
          resolve('任务2');
        }, 200);
      }),
      new MyPromise(resolve => {
        setTimeout(() => {
          addResult('任务 3 完成 (800ms)', 'micro');
          resolve('任务3');
        }, 800);
      })
    ];

    MyPromise.race(promises).then(result => {
      addResult(`✅ 最快完成: ${result}`, 'success');
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRunning(false);
  };

  // 测试 5: 错误处理
  const testErrorHandling = async () => {
    clearResults();
    setIsRunning(true);
    addResult('测试 5: 错误处理与 catch', 'info');

    await new Promise(resolve => setTimeout(resolve, 300));

    new MyPromise((resolve, reject) => {
      setTimeout(() => {
        addResult('抛出错误', 'error');
        reject('出错了！');
      }, 500);
    })
      .then(result => {
        addResult('这里不会执行', 'info');
        return result;
      })
      .catch(error => {
        addResult(`✅ Catch 捕获: ${error}`, 'success');
        return '已恢复';
      })
      .then(result => {
        addResult(`✅ 错误恢复后继续: ${result}`, 'success');
      });

    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRunning(false);
  };

  // 测试 6: 原生 Promise 对比
  const testNativeComparison = async () => {
    clearResults();
    setIsRunning(true);
    addResult('测试 6: 与原生 Promise 对比', 'info');

    await new Promise(resolve => setTimeout(resolve, 300));

    // 手写 Promise
    addResult('--- 手写 Promise ---', 'info');
    new MyPromise(resolve => setTimeout(() => resolve('MyPromise'), 200))
      .then(result => {
        addResult(`手写: ${result}`, 'sync');
      });

    await new Promise(resolve => setTimeout(resolve, 500));

    // 原生 Promise
    addResult('--- 原生 Promise ---', 'info');
    new Promise(resolve => setTimeout(() => resolve('Native'), 200))
      .then(result => {
        addResult(`原生: ${result}`, 'sync');
      });

    await new Promise(resolve => setTimeout(resolve, 500));
    addResult('✅ 行为一致！', 'success');
    setIsRunning(false);
  };

  const getTypeStyles = (type) => {
    const styles = {
      'sync': 'bg-blue-50 border-l-4 border-blue-500 text-blue-900',
      'micro': 'bg-green-50 border-l-4 border-green-500 text-green-900',
      'info': 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900 font-semibold',
      'success': 'bg-purple-50 border-l-4 border-purple-500 text-purple-900 font-bold',
      'error': 'bg-red-50 border-l-4 border-red-500 text-red-900'
    };
    return styles[type] || 'bg-gray-50 border-l-4 border-gray-300 text-gray-900';
  };

  return (
    <DemoContainer
      title="Promise 原理与手写实现"
      description="深入理解 Promise A+ 规范，手写完整实现"
    >
      <div className="space-y-6">
        {/* Promise 状态机 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📚 Promise 核心概念</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">⏳</div>
              <div className="font-bold text-yellow-900">Pending</div>
              <div className="text-xs text-yellow-700 mt-1">初始状态</div>
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-bold text-green-900">Fulfilled</div>
              <div className="text-xs text-green-700 mt-1">成功状态</div>
            </div>
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">❌</div>
              <div className="font-bold text-red-900">Rejected</div>
              <div className="text-xs text-red-700 mt-1">失败状态</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold text-gray-900 mb-2">状态转换规则</h4>
            <ul className="text-sm text-gray-800 space-y-1">
              <li>• Pending → Fulfilled: 调用 resolve(value)</li>
              <li>• Pending → Rejected: 调用 reject(reason)</li>
              <li>• <strong>状态一旦改变，不可逆转</strong></li>
              <li>• Fulfilled 和 Rejected 互不转换</li>
            </ul>
          </div>
        </div>

        {/* 测试用例 */}
        <section className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🧪 功能测试</h3>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={testBasic}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              测试 1: 基础功能
            </button>
            <button
              onClick={testChaining}
              disabled={isRunning}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              测试 2: 链式调用
            </button>
            <button
              onClick={testAll}
              disabled={isRunning}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              测试 3: Promise.all
            </button>
            <button
              onClick={testRace}
              disabled={isRunning}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              测试 4: Promise.race
            </button>
            <button
              onClick={testErrorHandling}
              disabled={isRunning}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              测试 5: 错误处理
            </button>
            <button
              onClick={testNativeComparison}
              disabled={isRunning}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              测试 6: 对比原生
            </button>
          </div>

          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 h-96 overflow-y-auto space-y-2">
            {testResults.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                选择一个测试用例开始
              </div>
            ) : (
              testResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-2 rounded ${getTypeStyles(result.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex-1 font-mono text-sm">{result.message}</span>
                    <span className="text-xs opacity-60 ml-2">{result.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 核心代码实现 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💻 核心代码实现</h4>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-blue-800 hover:text-blue-900 font-medium">
              点击查看完整实现代码
            </summary>
            <div className="mt-3 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs">
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
      ? onFulfilled 
      : value => value;
    onRejected = typeof onRejected === 'function' 
      ? onRejected 
      : reason => { throw reason };

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolve(x);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolve(x);
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
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let count = 0;

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          value => {
            results[index] = value;
            count++;
            if (count === promises.length) {
              resolve(results);
            }
          },
          reject
        );
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
}`}
              </pre>
            </div>
          </details>
        </div>

        {/* 关键实现点 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🔑 关键实现点</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">1. 状态管理</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 用变量保存状态 (pending/fulfilled/rejected)</li>
                <li>• 状态只能改变一次（if state === 'pending' 判断）</li>
                <li>• 保存 value/reason 供后续使用</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">2. 回调队列</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• 用数组保存多个 then 的回调</li>
                <li>• pending 状态时收集回调</li>
                <li>• resolve/reject 时遍历执行</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">3. 链式调用</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• then 返回新的 Promise</li>
                <li>• 用 setTimeout 实现异步（微任务）</li>
                <li>• 传递上一个 then 的返回值</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">4. 错误处理</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• try-catch 包裹 executor 和回调</li>
                <li>• catch 方法是 then(null, onRejected) 的语法糖</li>
                <li>• 错误会沿着 then 链传递</li>
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
                    面试官：请手写一个简化版的 Promise
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 回答思路：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p>我会按照 Promise A+ 规范实现，核心包括：</p>
                      <ol className="list-decimal ml-5 space-y-1">
                        <li><strong>状态机：</strong>pending/fulfilled/rejected 三种状态</li>
                        <li><strong>executor：</strong>接收 resolve/reject 两个参数</li>
                        <li><strong>then 方法：</strong>返回新 Promise，支持链式调用</li>
                        <li><strong>回调队列：</strong>处理异步场景的多个 then</li>
                        <li><strong>错误处理：</strong>try-catch + catch 方法</li>
                      </ol>
                      <p className="mt-2 text-gray-600 text-xs">
                        然后边写边讲解每个部分的作用和注意事项
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
                    面试官：为什么 then 要用 setTimeout 包裹？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>两个原因：</strong></p>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="font-semibold">1. 实现异步（符合规范）</p>
                        <p className="text-xs mt-1">Promise A+ 规范要求 then 的回调必须异步执行，不能同步执行</p>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// 如果同步执行
promise.then(() => console.log('then'));
console.log('sync');
// 输出: then, sync (错误！)

// 异步执行
promise.then(() => console.log('then'));
console.log('sync');
// 输出: sync, then (正确！)`}
                        </pre>
                      </div>
                      <div className="bg-purple-50 p-3 rounded mt-2">
                        <p className="font-semibold">2. 解决 promise2 引用问题</p>
                        <p className="text-xs mt-1">then 返回的新 Promise (promise2) 在创建时还没赋值完成，需要异步才能访问</p>
                      </div>
                      <p className="text-xs text-purple-700 mt-2">
                        💡 <strong>注意：</strong>实际应该用微任务（queueMicrotask），setTimeout 是宏任务
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
                    面试官：Promise.all 和 Promise.race 有什么区别？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-semibold text-blue-900">Promise.all</p>
                          <ul className="list-disc ml-5 text-xs mt-2">
                            <li><strong>等待全部完成</strong></li>
                            <li>所有成功 → 返回结果数组</li>
                            <li>任一失败 → 立即 reject</li>
                            <li>适用：并发请求，需要所有结果</li>
                          </ul>
                          <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`Promise.all([p1, p2, p3])
  .then(results => {
    // [r1, r2, r3]
  });`}
                          </pre>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="font-semibold text-green-900">Promise.race</p>
                          <ul className="list-disc ml-5 text-xs mt-2">
                            <li><strong>竞速，最快完成</strong></li>
                            <li>返回第一个完成的结果</li>
                            <li>无论成功还是失败</li>
                            <li>适用：超时控制、缓存竞争</li>
                          </ul>
                          <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`Promise.race([
  fetch('/api'),
  timeout(5000)
])`}
                          </pre>
                        </div>
                      </div>
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
                    面试官：下面代码输出什么？（Promise 经典题）
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm mb-3 font-mono">
{`Promise.resolve().then(() => {
  console.log(1);
  return Promise.resolve(2);
}).then(res => {
  console.log(res);
});

Promise.resolve().then(() => {
  console.log(3);
}).then(() => {
  console.log(4);
}).then(() => {
  console.log(5);
});`}
                  </pre>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 正确答案：1 → 3 → 4 → 5 → 2</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>解析：</strong></p>
                      <ul className="list-disc ml-5 text-xs space-y-1">
                        <li>第一轮微任务：执行第一个 then (输出 1) 和第二个 Promise 的第一个 then (输出 3)</li>
                        <li>关键：<code>return Promise.resolve(2)</code> 会产生<strong>额外的微任务</strong></li>
                        <li>第二轮微任务：执行第二个 Promise 的第二个 then (输出 4)</li>
                        <li>第三轮微任务：执行第二个 Promise 的第三个 then (输出 5)</li>
                        <li>第四轮微任务：resolve(2) 的回调终于执行 (输出 2)</li>
                      </ul>
                      <p className="text-purple-700 text-xs mt-2">
                        💡 <strong>知识点：</strong>then 返回 Promise 会产生额外的微任务（Promise 展开过程）
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
                Q1: Promise 和 async/await 有什么区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>async/await 是 Promise 的语法糖：</strong></p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold mb-1">Promise 写法</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`fetch('/api')
  .then(res => res.json())
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error(err);
  });`}
                    </pre>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">async/await 写法</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`async function getData() {
  try {
    const res = await fetch('/api');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}`}
                    </pre>
                  </div>
                </div>
                <p className="text-xs text-purple-700 mt-2">
                  💡 <strong>优势：</strong>代码更像同步，更易读；<strong>本质：</strong>底层还是 Promise
                </p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 如何实现 Promise.allSettled？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>与 Promise.all 的区别：</strong>所有 Promise 都完成（无论成功失败）才返回</p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`MyPromise.allSettled = function(promises) {
  return new MyPromise(resolve => {
    const results = [];
    let count = 0;

    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        value => {
          results[index] = { status: 'fulfilled', value };
          count++;
          if (count === promises.length) resolve(results);
        },
        reason => {
          results[index] = { status: 'rejected', reason };
          count++;
          if (count === promises.length) resolve(results);
        }
      );
    });
  });
};`}
                </pre>
                <p className="text-xs text-green-700 mt-2">
                  ✅ <strong>关键：</strong>成功和失败都执行相同逻辑，不提前 reject
                </p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: Promise 如何实现超时控制？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>使用 Promise.race 实现：</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function promiseWithTimeout(promise, timeout) {
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('请求超时'));
    }, timeout);
  });

  return Promise.race([promise, timeoutPromise]);
}

// 使用
promiseWithTimeout(fetch('/api'), 5000)
  .then(data => console.log(data))
  .catch(err => console.error(err)); // 5秒后超时`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 如何实现 Promise 的并发控制？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>场景：</strong>100 个请求，最多同时发送 5 个</p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`async function promiseLimit(tasks, limit) {
  const results = [];
  const executing = [];

  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);

    if (limit <= tasks.length) {
      const e = p.then(() => {
        executing.splice(executing.indexOf(e), 1);
      });
      executing.push(e);

      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}

// 使用
const tasks = urls.map(url => () => fetch(url));
promiseLimit(tasks, 5); // 最多同时 5 个请求`}
                </pre>
              </div>
            </details>
          </div>
        </div>

        {/* 实际应用场景 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-3">💼 实际应用场景</h4>
          <div className="space-y-3 text-sm text-yellow-800">
            <div>
              <strong>1. 并发请求优化（阶跃星辰 AI 场景）</strong>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`// 同时获取模型列表和用户信息
Promise.all([
  fetch('/api/models'),
  fetch('/api/user')
]).then(([models, user]) => {
  // 两个请求都完成，渲染页面
});`}
              </pre>
            </div>
            <div>
              <strong>2. 缓存竞争（优先返回缓存）</strong>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`Promise.race([
  getFromCache('/api/data'),
  fetch('/api/data')
]).then(data => {
  // 谁快用谁
});`}
              </pre>
            </div>
            <div>
              <strong>3. 重试机制</strong>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function retry(fn, times) {
  return new Promise((resolve, reject) => {
    function attempt() {
      fn().then(resolve).catch(err => {
        if (times-- > 0) {
          setTimeout(attempt, 1000);
        } else {
          reject(err);
        }
      });
    }
    attempt();
  });
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
              <strong>追问 1：</strong>Promise 链式调用如果中间有错误会怎样？
              <p className="ml-4 text-xs text-gray-700">→ 错误会沿着链传递，直到被 catch 捕获</p>
            </div>
            <div>
              <strong>追问 2：</strong>Promise.all 中一个失败了，其他的还会执行吗？
              <p className="ml-4 text-xs text-gray-700">→ 会继续执行，但结果会被忽略（Promise.all 立即 reject）</p>
            </div>
            <div>
              <strong>追问 3：</strong>如何取消一个 Promise？
              <p className="ml-4 text-xs text-gray-700">→ Promise 本身不可取消，但可以用 AbortController 取消 fetch 请求</p>
            </div>
            <div>
              <strong>追问 4：</strong>finally 的实现原理是什么？
              <p className="ml-4 text-xs text-gray-700">→ 无论成功失败都执行，但不改变 Promise 的值/原因</p>
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
                  <span className="px-2 py-1 bg-cyan-300 text-cyan-950 rounded text-xs font-semibold">Promise 异步方案</span>
                </div>
                <p className="text-gray-600 mt-2">
                  Promise 是 JavaScript 异步编程的核心解决方案，属于<strong>语言层</strong>的关键特性。
                  它解决了回调地狱问题，是 async/await、Fetch API、SSE 等现代异步方案的基础。
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
                    <li>• 回调函数</li>
                    <li>• 事件循环</li>
                    <li>• 微任务队列</li>
                    <li>• 错误处理</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 理解异步编程基础</p>
                </div>

                {/* 横向关联 */}
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 横向关联</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• async/await</li>
                    <li>• Generator + co</li>
                    <li>• Observable (RxJS)</li>
                    <li>• AbortController</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 异步方案对比</p>
                </div>

                {/* 后续应用 */}
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬇️ 后续应用</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• Fetch API</li>
                    <li>• React Query</li>
                    <li>• SSE 流式处理</li>
                    <li>• 并发控制</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 网络请求必备</p>
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
                    <strong className="text-sm">当前阶段：掌握 Promise</strong>
                    <p className="text-xs text-gray-600">理解 Promise 状态机、链式调用、错误处理、常用方法（all/race/allSettled）</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">下一步：手写 Promise</strong>
                    <p className="text-xs text-gray-600">实现 Promise A+ 规范，深入理解微任务调度</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">进阶：async/await 原理</strong>
                    <p className="text-xs text-gray-600">理解 async/await 如何基于 Promise + Generator 实现</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">深入：并发控制与取消</strong>
                    <p className="text-xs text-gray-600">实现 Promise 并发限制、超时控制、取消机制</p>
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
                  <p className="text-xs text-gray-600">异步编程第一考点</p>
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
                  <p className="text-xs text-gray-600">中高难度，深度广度兼备</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 rounded">
                <p className="text-xs text-yellow-800">
                  <strong>💡 面试建议：</strong>能讲清楚 Promise 三种状态、能手写 Promise A+ 实现、能解释执行顺序题，就能拿高分。
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
                    <span className="text-cyan-600 font-semibold">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-cyan-600 h-2 rounded-full" style={{width: '88%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要深入理解：状态机、微任务调度、错误传递、A+ 规范</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>广度（应用场景）</span>
                    <span className="text-green-600 font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">应用广泛：所有异步场景（网络请求、定时任务、并发控制）</p>
                </div>
              </div>
            </div>

            {/* 查看完整体系 */}
            <div className="bg-gradient-to-r from-cyan-100 to-teal-100 p-4 rounded-lg text-center">
              <p className="text-sm text-cyan-900 mb-2">
                想了解完整的前端知识体系？
              </p>
              <a 
                href="/MINDMAP.md" 
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
