'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function ThisBindingDemo() {
  const [testResults, setTestResults] = useState([]);

  const addResult = (message, type = 'info') => {
    setTestResults(prev => [...prev, {
      id: Date.now() + Math.random(),
      message,
      type
    }]);
  };

  const clearResults = () => setTestResults([]);

  // ===== 手写 call/apply/bind =====
  
  // 手写 call
  Function.prototype.myCall = function(context, ...args) {
    // 处理 null/undefined
    context = context || window;
    
    // 创建唯一属性名，避免覆盖
    const fnSymbol = Symbol();
    context[fnSymbol] = this;
    
    // 执行函数
    const result = context[fnSymbol](...args);
    
    // 删除临时属性
    delete context[fnSymbol];
    
    return result;
  };

  // 手写 apply
  Function.prototype.myApply = function(context, argsArray) {
    context = context || window;
    const fnSymbol = Symbol();
    context[fnSymbol] = this;
    
    // apply 接收数组参数
    const result = argsArray 
      ? context[fnSymbol](...argsArray)
      : context[fnSymbol]();
    
    delete context[fnSymbol];
    return result;
  };

  // 手写 bind
  Function.prototype.myBind = function(context, ...args) {
    const fn = this;
    
    // bind 返回一个新函数
    return function(...newArgs) {
      // 支持 new 调用
      if (this instanceof fn) {
        return new fn(...args, ...newArgs);
      }
      
      // 普通调用
      return fn.apply(context, [...args, ...newArgs]);
    };
  };

  // ===== 测试场景 =====
  
  // 场景 1: 默认绑定
  const testDefaultBinding = () => {
    clearResults();
    addResult('场景 1: 默认绑定（全局调用）', 'info');

    function showThis() {
      return this;
    }

    const result = showThis();
    addResult(`普通函数调用：this === window (严格模式下是 undefined)`, 'sync');
    addResult(`实际值：${result}`, result === window ? 'success' : 'error');
  };

  // 场景 2: 隐式绑定
  const testImplicitBinding = () => {
    clearResults();
    addResult('场景 2: 隐式绑定（对象方法调用）', 'info');

    const obj = {
      name: 'Alice',
      greet: function() {
        return `Hello, I'm ${this.name}`;
      }
    };

    addResult(`obj.greet()：this 指向 obj`, 'sync');
    const result1 = obj.greet();
    addResult(`✅ 结果: ${result1}`, 'success');

    addResult(`\n隐式绑定丢失（赋值给变量）：`, 'info');
    const greet = obj.greet;
    addResult(`const greet = obj.greet; greet();`, 'sync');
    addResult(`this 变成 window/undefined，name 是 undefined`, 'error');
    try {
      const result2 = greet();
      addResult(`结果: ${result2}`, 'error');
    } catch (e) {
      addResult(`报错: ${e.message}`, 'error');
    }
  };

  // 场景 3: 显式绑定 (call/apply/bind)
  const testExplicitBinding = () => {
    clearResults();
    addResult('场景 3: 显式绑定（call/apply/bind）', 'info');

    function introduce(age, city) {
      return `${this.name}, ${age} 岁, 来自 ${city}`;
    }

    const person = { name: 'Bob' };

    addResult('--- 原生 call ---', 'info');
    const result1 = introduce.call(person, 25, '北京');
    addResult(`call(person, 25, '北京'): ${result1}`, 'success');

    addResult('\n--- 手写 myCall ---', 'info');
    const result2 = introduce.myCall(person, 25, '北京');
    addResult(`myCall(person, 25, '北京'): ${result2}`, 'success');

    addResult('\n--- 原生 apply ---', 'info');
    const result3 = introduce.apply(person, [30, '上海']);
    addResult(`apply(person, [30, '上海']): ${result3}`, 'success');

    addResult('\n--- 手写 myApply ---', 'info');
    const result4 = introduce.myApply(person, [30, '上海']);
    addResult(`myApply(person, [30, '上海']): ${result4}`, 'success');

    addResult('\n--- 原生 bind ---', 'info');
    const boundIntroduce = introduce.bind(person, 35);
    const result5 = boundIntroduce('深圳');
    addResult(`bind(person, 35)('深圳'): ${result5}`, 'success');

    addResult('\n--- 手写 myBind ---', 'info');
    const myBoundIntroduce = introduce.myBind(person, 35);
    const result6 = myBoundIntroduce('深圳');
    addResult(`myBind(person, 35)('深圳'): ${result6}`, 'success');
  };

  // 场景 4: new 绑定
  const testNewBinding = () => {
    clearResults();
    addResult('场景 4: new 绑定（构造函数）', 'info');

    function Person(name, age) {
      this.name = name;
      this.age = age;
      this.greet = function() {
        return `Hello, I'm ${this.name}, ${this.age} years old`;
      };
    }

    addResult('new Person("Charlie", 28)', 'sync');
    const charlie = new Person('Charlie', 28);
    addResult(`this 指向新创建的对象`, 'success');
    addResult(`charlie.name: ${charlie.name}`, 'success');
    addResult(`charlie.greet(): ${charlie.greet()}`, 'success');
  };

  // 场景 5: 箭头函数
  const testArrowFunction = () => {
    clearResults();
    addResult('场景 5: 箭头函数（继承外层 this）', 'info');

    const obj = {
      name: 'David',
      regularFunc: function() {
        return this.name;
      },
      arrowFunc: () => {
        return this?.name || 'window/undefined';
      },
      nestedArrow: function() {
        const arrow = () => this.name;
        return arrow();
      }
    };

    addResult('普通函数：', 'sync');
    addResult(`obj.regularFunc(): ${obj.regularFunc()}`, 'success');

    addResult('\n箭头函数（this 继承外层）：', 'sync');
    addResult(`obj.arrowFunc(): ${obj.arrowFunc()}`, 'error');
    addResult('箭头函数没有自己的 this，继承外层（这里是 window）', 'error');

    addResult('\n嵌套箭头函数：', 'sync');
    addResult(`obj.nestedArrow(): ${obj.nestedArrow()}`, 'success');
    addResult('内部箭头函数继承 nestedArrow 的 this (obj)', 'success');
  };

  // 场景 6: 优先级对比
  const testPriority = () => {
    clearResults();
    addResult('场景 6: 绑定优先级对比', 'info');

    function showName() {
      return this.name;
    }

    const obj1 = { name: 'Object 1' };
    const obj2 = { name: 'Object 2' };

    addResult('--- new 绑定 vs 显式绑定 ---', 'info');
    function Person(name) {
      this.name = name;
    }
    const BoundPerson = Person.bind(obj1);
    const instance = new BoundPerson('New Instance');
    addResult(`bind(obj1) 后再 new：this 指向新对象`, 'success');
    addResult(`instance.name: ${instance.name}`, 'success');
    addResult('优先级：new > bind', 'success');

    addResult('\n--- 显式绑定 vs 隐式绑定 ---', 'info');
    obj1.showName = showName;
    addResult(`obj1.showName()：${obj1.showName()}`, 'sync');
    addResult(`obj1.showName.call(obj2)：${obj1.showName.call(obj2)}`, 'success');
    addResult('优先级：call/apply/bind > 对象方法', 'success');

    addResult('\n--- 总结 ---', 'info');
    addResult('绑定优先级：new > 显式绑定 (call/apply/bind) > 隐式绑定 (对象方法) > 默认绑定 (全局)', 'success');
  };

  // 场景 7: 常见陷阱
  const testCommonPitfalls = () => {
    clearResults();
    addResult('场景 7: 常见 this 陷阱', 'info');

    // 陷阱 1: setTimeout
    addResult('--- 陷阱 1: setTimeout 中的 this ---', 'info');
    const obj = {
      name: 'Eva',
      delayGreet: function() {
        setTimeout(function() {
          addResult(`普通函数 this.name: ${this?.name || 'undefined'}`, 'error');
          addResult('setTimeout 中普通函数 this 指向 window', 'error');
        }, 100);
        
        setTimeout(() => {
          addResult(`箭头函数 this.name: ${this.name}`, 'success');
          addResult('箭头函数继承外层 this (obj)', 'success');
        }, 200);
      }
    };
    obj.delayGreet();

    // 陷阱 2: 事件处理器
    setTimeout(() => {
      addResult('\n--- 陷阱 2: 事件处理器 ---', 'info');
      addResult('DOM 事件中，this 指向触发事件的元素', 'sync');
      addResult('解决：使用箭头函数或 bind', 'success');
    }, 400);

    // 陷阱 3: 数组方法
    setTimeout(() => {
      addResult('\n--- 陷阱 3: 数组方法回调 ---', 'info');
      const obj2 = {
        name: 'Frank',
        items: [1, 2, 3],
        printItems: function() {
          this.items.forEach(function(item) {
            addResult(`普通函数 - item: ${item}, this.name: undefined`, 'error');
          });
          
          this.items.forEach((item) => {
            addResult(`箭头函数 - item: ${item}, this.name: ${this.name}`, 'success');
          });
        }
      };
      obj2.printItems();
    }, 600);
  };

  const getTypeStyles = (type) => {
    const styles = {
      'sync': 'bg-blue-50 border-l-4 border-blue-500 text-blue-900',
      'info': 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900 font-semibold',
      'success': 'bg-green-50 border-l-4 border-green-500 text-green-900',
      'error': 'bg-red-50 border-l-4 border-red-500 text-red-900'
    };
    return styles[type] || 'bg-gray-50 border-l-4 border-gray-300 text-gray-900';
  };

  return (
    <DemoContainer
      title="this 指向与绑定规则"
      description="深入理解 JavaScript 中的 this，手写 call/apply/bind"
    >
      <div className="space-y-6">
        {/* 四种绑定规则 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📚 this 的四种绑定规则</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">1️⃣</span>
                <h4 className="font-semibold text-gray-900">默认绑定</h4>
              </div>
              <p className="text-sm text-gray-700 mb-2">独立函数调用，this 指向全局对象</p>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`function foo() {
  console.log(this); // window
}
foo();`}
              </pre>
              <p className="text-xs text-gray-600 mt-1">严格模式下是 undefined</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">2️⃣</span>
                <h4 className="font-semibold text-gray-900">隐式绑定</h4>
              </div>
              <p className="text-sm text-gray-700 mb-2">对象方法调用，this 指向对象</p>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`const obj = {
  name: 'Alice',
  greet() {
    console.log(this.name);
  }
};
obj.greet(); // 'Alice'`}
              </pre>
              <p className="text-xs text-red-600 mt-1">⚠️ 赋值给变量会丢失绑定</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">3️⃣</span>
                <h4 className="font-semibold text-gray-900">显式绑定</h4>
              </div>
              <p className="text-sm text-gray-700 mb-2">call/apply/bind 显式指定 this</p>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`function greet() {
  console.log(this.name);
}
const obj = { name: 'Bob' };
greet.call(obj); // 'Bob'`}
              </pre>
              <p className="text-xs text-green-600 mt-1">✅ 优先级高于隐式绑定</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">4️⃣</span>
                <h4 className="font-semibold text-gray-900">new 绑定</h4>
              </div>
              <p className="text-sm text-gray-700 mb-2">构造函数调用，this 指向新对象</p>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`function Person(name) {
  this.name = name;
}
const p = new Person('Charlie');
console.log(p.name); // 'Charlie'`}
              </pre>
              <p className="text-xs text-green-600 mt-1">✅ 优先级最高</p>
            </div>
          </div>

          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
            <p className="text-sm font-semibold text-yellow-900">
              🎯 优先级顺序：new 绑定 &gt; 显式绑定 &gt; 隐式绑定 &gt; 默认绑定
            </p>
          </div>
        </div>

        {/* 测试场景 */}
        <section className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🧪 交互式测试</h3>

          <div className="grid grid-cols-4 gap-3 mb-6">
            <button
              onClick={testDefaultBinding}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              默认绑定
            </button>
            <button
              onClick={testImplicitBinding}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
            >
              隐式绑定
            </button>
            <button
              onClick={testExplicitBinding}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
            >
              显式绑定
            </button>
            <button
              onClick={testNewBinding}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm"
            >
              new 绑定
            </button>
            <button
              onClick={testArrowFunction}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              箭头函数
            </button>
            <button
              onClick={testPriority}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
            >
              优先级对比
            </button>
            <button
              onClick={testCommonPitfalls}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
            >
              常见陷阱
            </button>
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
            >
              清空
            </button>
          </div>

          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 h-[500px] overflow-y-auto space-y-2">
            {testResults.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                选择一个测试场景开始
              </div>
            ) : (
              testResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-2 rounded ${getTypeStyles(result.type)}`}
                >
                  <span className="font-mono text-sm whitespace-pre-wrap">{result.message}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 手写实现 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💻 手写 call/apply/bind</h4>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-blue-800 hover:text-blue-900 font-medium">
              点击查看完整实现
            </summary>
            <div className="mt-3 space-y-4">
              <div>
                <p className="font-semibold text-sm mb-1">手写 call:</p>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`Function.prototype.myCall = function(context, ...args) {
  // 1. 处理 null/undefined，指向 window
  context = context || window;
  
  // 2. 将函数设为对象的属性（使用 Symbol 避免覆盖）
  const fnSymbol = Symbol();
  context[fnSymbol] = this;
  
  // 3. 执行函数
  const result = context[fnSymbol](...args);
  
  // 4. 删除临时属性
  delete context[fnSymbol];
  
  return result;
};`}
                </pre>
              </div>

              <div>
                <p className="font-semibold text-sm mb-1">手写 apply:</p>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`Function.prototype.myApply = function(context, argsArray) {
  context = context || window;
  const fnSymbol = Symbol();
  context[fnSymbol] = this;
  
  // 与 call 的唯一区别：参数是数组
  const result = argsArray 
    ? context[fnSymbol](...argsArray)
    : context[fnSymbol]();
  
  delete context[fnSymbol];
  return result;
};`}
                </pre>
              </div>

              <div>
                <p className="font-semibold text-sm mb-1">手写 bind:</p>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`Function.prototype.myBind = function(context, ...args) {
  const fn = this;
  
  // bind 返回一个新函数
  return function(...newArgs) {
    // 判断是否用 new 调用
    if (this instanceof fn) {
      // new 调用：this 指向新对象
      return new fn(...args, ...newArgs);
    }
    
    // 普通调用：使用绑定的 context
    return fn.apply(context, [...args, ...newArgs]);
  };
};`}
                </pre>
              </div>
            </div>
          </details>
        </div>

        {/* 核心要点 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🔑 核心要点总结</h3>
          
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">1. 判断 this 的流程</h4>
              <ol className="list-decimal ml-5 text-sm text-blue-800 space-y-1">
                <li>是否用 new 调用？→ this 指向新对象</li>
                <li>是否用 call/apply/bind？→ this 指向传入的对象</li>
                <li>是否是对象方法？→ this 指向该对象</li>
                <li>默认情况 → this 指向 window (严格模式 undefined)</li>
              </ol>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">2. 箭头函数特殊规则</h4>
              <ul className="list-disc ml-5 text-sm text-green-800 space-y-1">
                <li>没有自己的 this，继承外层作用域的 this</li>
                <li>不能用 call/apply/bind 改变 this</li>
                <li>不能用 new 调用（没有 constructor）</li>
                <li>适用场景：回调函数、需要继承外层 this 的地方</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">3. call vs apply vs bind</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-2">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="p-2 text-left">方法</th>
                      <th className="p-2 text-left">参数</th>
                      <th className="p-2 text-left">返回值</th>
                      <th className="p-2 text-left">执行时机</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-800">
                    <tr className="border-t">
                      <td className="p-2 font-mono">call</td>
                      <td className="p-2">逐个传参</td>
                      <td className="p-2">函数执行结果</td>
                      <td className="p-2">立即执行</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2 font-mono">apply</td>
                      <td className="p-2">数组传参</td>
                      <td className="p-2">函数执行结果</td>
                      <td className="p-2">立即执行</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2 font-mono">bind</td>
                      <td className="p-2">逐个传参</td>
                      <td className="p-2">新函数</td>
                      <td className="p-2">返回函数，延迟执行</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
              <div className="flex items-start gap-3">
                <span className="text-2xl">👔</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    面试官：下面代码输出什么？
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm mb-3">
{`const obj = {
  name: 'Alice',
  greet: function() {
    console.log(this.name);
  }
};

const greet = obj.greet;
greet();
setTimeout(obj.greet, 1000);
[obj.greet].forEach(fn => fn());`}
                  </pre>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 正确答案：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <ul className="list-disc ml-5 space-y-1 text-xs">
                        <li><code>greet()</code>: undefined（隐式绑定丢失）</li>
                        <li><code>setTimeout(obj.greet, 1000)</code>: undefined（传参时丢失绑定）</li>
                        <li><code>[obj.greet].forEach(...)</code>: undefined（回调函数丢失绑定）</li>
                      </ul>
                      <p className="text-purple-700 text-xs mt-2">
                        💡 <strong>解决方法：</strong>使用箭头函数或 bind
                      </p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`setTimeout(() => obj.greet(), 1000);  // 'Alice'
setTimeout(obj.greet.bind(obj), 1000); // 'Alice'`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 场景 2 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👔</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    面试官：手写一个 call 方法
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 实现思路：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>核心原理：</strong>将函数作为对象的方法调用</p>
                      <ol className="list-decimal ml-5 space-y-1 text-xs">
                        <li>将函数设为 context 的属性</li>
                        <li>执行该方法（this 自动指向 context）</li>
                        <li>删除临时属性</li>
                        <li>返回结果</li>
                      </ol>
                      <p className="text-xs text-purple-700 mt-2">
                        💡 <strong>关键点：</strong>用 Symbol 避免属性名冲突
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 场景 3 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👔</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    面试官：箭头函数的 this 和普通函数有什么区别？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-semibold text-blue-900 text-xs">普通函数</p>
                          <ul className="list-disc ml-5 text-xs mt-1">
                            <li>this 在调用时确定</li>
                            <li>可被 call/apply/bind 改变</li>
                            <li>可用 new 调用</li>
                            <li>有 arguments 对象</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="font-semibold text-green-900 text-xs">箭头函数</p>
                          <ul className="list-disc ml-5 text-xs mt-1">
                            <li>this 在定义时确定</li>
                            <li>不可改变 this</li>
                            <li>不可用 new 调用</li>
                            <li>没有 arguments</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-purple-700 text-xs mt-2">
                        💡 <strong>使用场景：</strong>需要继承外层 this 时用箭头函数，需要动态 this 时用普通函数
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 场景 4 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👔</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    面试官：bind 返回的函数可以用 new 调用吗？
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm mb-3">
{`function Person(name) {
  this.name = name;
}

const obj = { name: 'Object' };
const BoundPerson = Person.bind(obj);
const instance = new BoundPerson('Instance');

console.log(instance.name); // ?`}
                  </pre>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 正确答案：'Instance'</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>关键点：</strong></p>
                      <ul className="list-disc ml-5 text-xs space-y-1">
                        <li>bind 返回的函数可以用 new 调用</li>
                        <li>new 调用时，bind 的 this 绑定会被忽略</li>
                        <li>this 指向新创建的对象 (instance)</li>
                        <li>这是 bind 的特殊行为，需要在实现中处理</li>
                      </ul>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// myBind 实现中的关键代码
return function(...newArgs) {
  if (this instanceof fn) {
    // new 调用：忽略 bind 的 context
    return new fn(...args, ...newArgs);
  }
  return fn.apply(context, [...args, ...newArgs]);
};`}
                      </pre>
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
                Q1: React 中的 this 绑定问题
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>类组件中的事件处理器：</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`class MyComponent extends React.Component {
  handleClick() {
    console.log(this); // undefined!
  }

  render() {
    return <button onClick={this.handleClick}>Click</button>;
  }
}

// 解决方法 1: 箭头函数
<button onClick={() => this.handleClick()}>Click</button>

// 解决方法 2: bind
constructor() {
  this.handleClick = this.handleClick.bind(this);
}

// 解决方法 3: 类字段 (推荐)
handleClick = () => {
  console.log(this); // 组件实例
};`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: call 和 apply 的性能差异
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>结论：现代浏览器中几乎没有差异</strong></p>
                <ul className="list-disc ml-5 text-xs">
                  <li>早期：apply 需要展开数组，性能略差</li>
                  <li>现代：JS 引擎优化，性能差异可忽略</li>
                  <li>选择标准：根据参数形式选择，不必纠结性能</li>
                </ul>
                <p className="text-purple-700 text-xs mt-2">
                  💡 <strong>使用建议：</strong>参数明确用 call，参数是数组用 apply
                </p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 如何让 setTimeout 中的 this 指向特定对象？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>四种方法：</strong></p>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-xs">方法 1: 箭头函数（推荐）</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`setTimeout(() => {
  console.log(this.name);
}, 1000);`}
                    </pre>
                  </div>
                  <div>
                    <p className="font-semibold text-xs">方法 2: bind</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`setTimeout(function() {
  console.log(this.name);
}.bind(this), 1000);`}
                    </pre>
                  </div>
                  <div>
                    <p className="font-semibold text-xs">方法 3: 闭包保存 this</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`const self = this;
setTimeout(function() {
  console.log(self.name);
}, 1000);`}
                    </pre>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 阶跃星辰 AI 产品中，this 会有哪些应用场景？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>常见场景：</strong></p>
                <ol className="list-decimal ml-5 text-xs space-y-2">
                  <li>
                    <strong>事件处理器绑定</strong>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1">
{`class ChatPanel {
  handleSend = () => {
    // 箭头函数自动绑定 this
    this.sendMessage();
  };
}`}
                    </pre>
                  </li>
                  <li>
                    <strong>API 请求回调</strong>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1">
{`fetchMessages().then(data => {
  // 箭头函数继承外层 this
  this.setState({ messages: data });
});`}
                    </pre>
                  </li>
                  <li>
                    <strong>流式响应处理</strong>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1">
{`reader.read().then(function process({ done, value }) {
  if (done) return;
  // 需要 bind 或箭头函数保持 this
  this.appendMessage(value);
  return reader.read().then(process.bind(this));
}.bind(this));`}
                    </pre>
                  </li>
                </ol>
              </div>
            </details>
          </div>
        </div>

        {/* 追问场景 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-3">🔥 可能的追问</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div>
              <strong>追问 1：</strong>严格模式对 this 有什么影响？
              <p className="ml-4 text-xs text-gray-700">→ 默认绑定时 this 是 undefined 而不是 window</p>
            </div>
            <div>
              <strong>追问 2：</strong>为什么不推荐在构造函数中使用箭头函数定义方法？
              <p className="ml-4 text-xs text-gray-700">→ 每个实例都会创建新函数，浪费内存；应该定义在原型上</p>
            </div>
            <div>
              <strong>追问 3：</strong>eval 中的 this 指向什么？
              <p className="ml-4 text-xs text-gray-700">→ 继承外层作用域的 this</p>
            </div>
            <div>
              <strong>追问 4：</strong>Object.create(null) 创建的对象能用 call 绑定吗？
              <p className="ml-4 text-xs text-gray-700">→ 可以，this 会指向该对象</p>
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
                  <span className="px-2 py-1 bg-cyan-300 text-cyan-950 rounded text-xs font-semibold">this 指向机制</span>
                </div>
                <p className="text-gray-600 mt-2">
                  this 指向是 JavaScript 的核心概念，属于<strong>语言层</strong>的底层机制。
                  它决定了函数执行时的上下文，是理解面向对象编程、事件处理、React 组件方法的基础。
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
                    <li>• 作用域链</li>
                    <li>• 函数调用方式</li>
                    <li>• 对象属性访问</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 理解函数执行机制</p>
                </div>

                {/* 横向关联 */}
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 横向关联</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• 闭包</li>
                    <li>• 箭头函数</li>
                    <li>• 原型链</li>
                    <li>• class 类</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 面向对象核心</p>
                </div>

                {/* 后续应用 */}
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬇️ 后续应用</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• React 类组件方法</li>
                    <li>• 事件处理器</li>
                    <li>• call/apply/bind</li>
                    <li>• 函数柯里化</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 日常开发必备</p>
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
                    <strong className="text-sm">当前阶段：掌握 this 四种绑定</strong>
                    <p className="text-xs text-gray-600">理解默认、隐式、显式、new 绑定的优先级和应用场景</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">下一步：手写 call/apply/bind</strong>
                    <p className="text-xs text-gray-600">通过实现深入理解 this 显式绑定原理</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">进阶：箭头函数 vs 普通函数</strong>
                    <p className="text-xs text-gray-600">理解箭头函数词法 this 的本质和使用场景</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">深入：React 中的 this 处理</strong>
                    <p className="text-xs text-gray-600">理解 React 类组件中为何需要 bind，以及现代方案</p>
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
                  <p className="text-xs text-gray-600">JavaScript 必考题</p>
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
                  <p className="text-xs text-gray-600">中等难度，重在理解规则</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 rounded">
                <p className="text-xs text-yellow-800">
                  <strong>💡 面试建议：</strong>能说出优先级顺序（new &gt; 显式 &gt; 隐式 &gt; 默认），能手写 call/apply/bind，能解释箭头函数特殊性。
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
                    <span className="text-cyan-600 font-semibold">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-cyan-600 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要理解：四种绑定规则、优先级、特殊情况</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>广度（应用场景）</span>
                    <span className="text-green-600 font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">应用广泛：面向对象、事件处理、React 组件、函数式编程</p>
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
