'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function CallApplyBindDemo() {
  const [testOutput, setTestOutput] = useState([]);

  const addOutput = (title, result) => {
    setTestOutput(prev => [...prev, { title, result }]);
  };

  const clearOutput = () => setTestOutput([]);

  // ===== 手写 call 实现 =====
  Function.prototype.myCall = function(context, ...args) {
    // 处理 null 和 undefined
    context = context || window;
    
    // 创建唯一的属性名，避免覆盖原有属性
    const fn = Symbol('fn');
    
    // 将函数设为对象的方法
    context[fn] = this;
    
    // 调用函数
    const result = context[fn](...args);
    
    // 删除临时属性
    delete context[fn];
    
    return result;
  };

  // ===== 手写 apply 实现 =====
  Function.prototype.myApply = function(context, args) {
    context = context || window;
    const fn = Symbol('fn');
    context[fn] = this;
    
    // apply 接收数组参数
    const result = args ? context[fn](...args) : context[fn]();
    
    delete context[fn];
    return result;
  };

  // ===== 手写 bind 实现 =====
  Function.prototype.myBind = function(context, ...args1) {
    const self = this;
    
    // 返回一个新函数
    const fBound = function(...args2) {
      // 合并参数
      const args = [...args1, ...args2];
      
      // 如果作为构造函数调用，this 指向实例
      // 否则指向绑定的 context
      return self.apply(
        this instanceof fBound ? this : context,
        args
      );
    };
    
    // 维护原型链
    if (this.prototype) {
      fBound.prototype = Object.create(this.prototype);
    }
    
    return fBound;
  };

  // 测试用例
  const runTest1 = () => {
    clearOutput();
    
    const person = { name: 'Alice' };
    
    function greet(greeting, punctuation) {
      return `${greeting}, I'm ${this.name}${punctuation}`;
    }

    // 原生 call
    const result1 = greet.call(person, 'Hello', '!');
    addOutput('原生 call', result1);

    // 手写 call
    const result2 = greet.myCall(person, 'Hello', '!');
    addOutput('手写 myCall', result2);
  };

  const runTest2 = () => {
    clearOutput();
    
    const person = { name: 'Bob' };
    
    function introduce(age, city) {
      return `I'm ${this.name}, ${age} years old, from ${city}`;
    }

    // 原生 apply
    const result1 = introduce.apply(person, [25, 'Beijing']);
    addOutput('原生 apply', result1);

    // 手写 apply
    const result2 = introduce.myApply(person, [25, 'Beijing']);
    addOutput('手写 myApply', result2);
  };

  const runTest3 = () => {
    clearOutput();
    
    const person = { name: 'Charlie' };
    
    function sayHello(greeting) {
      return `${greeting}, I'm ${this.name}`;
    }

    // 原生 bind
    const boundFunc1 = sayHello.bind(person, 'Hi');
    addOutput('原生 bind', boundFunc1());

    // 手写 bind
    const boundFunc2 = sayHello.myBind(person, 'Hi');
    addOutput('手写 myBind', boundFunc2());

    // 测试柯里化
    const boundFunc3 = sayHello.myBind(person);
    addOutput('myBind 柯里化', boundFunc3('Hey'));
  };

  const runAllTests = () => {
    clearOutput();
    
    const obj = { value: 42 };
    
    function test(a, b) {
      return `value: ${this.value}, a: ${a}, b: ${b}`;
    }

    addOutput('call 测试', test.myCall(obj, 1, 2));
    addOutput('apply 测试', test.myApply(obj, [3, 4]));
    
    const bound = test.myBind(obj, 5);
    addOutput('bind 测试', bound(6));
  };

  return (
    <DemoContainer
      title="手写 call/apply/bind"
      description="改变 this 指向的三个核心方法 - 面试高频"
    >
      <div className="space-y-6">
        {/* 核心区别对比 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">🎯 三者核心区别</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-3 text-left">方法</th>
                  <th className="p-3 text-left">参数格式</th>
                  <th className="p-3 text-left">返回值</th>
                  <th className="p-3 text-left">执行时机</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-t">
                  <td className="p-3 font-semibold text-blue-700">call</td>
                  <td className="p-3">fn.call(obj, arg1, arg2, ...)</td>
                  <td className="p-3">立即返回函数结果</td>
                  <td className="p-3 text-green-600">立即执行</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-semibold text-indigo-700">apply</td>
                  <td className="p-3">fn.apply(obj, [arg1, arg2, ...])</td>
                  <td className="p-3">立即返回函数结果</td>
                  <td className="p-3 text-green-600">立即执行</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-semibold text-purple-700">bind</td>
                  <td className="p-3">fn.bind(obj, arg1, arg2, ...)</td>
                  <td className="p-3">返回新函数</td>
                  <td className="p-3 text-orange-600">稍后执行</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 交互测试 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🎮 交互测试</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={runTest1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              测试 call
            </button>
            <button
              onClick={runTest2}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              测试 apply
            </button>
            <button
              onClick={runTest3}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              测试 bind
            </button>
            <button
              onClick={runAllTests}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              运行全部测试
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
            {testOutput.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                点击按钮运行测试，查看结果
              </div>
            ) : (
              <div className="space-y-2">
                {testOutput.map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded border-l-4 border-green-500">
                    <div className="text-xs font-semibold text-gray-600">{item.title}</div>
                    <div className="text-sm text-gray-900 mt-1">{item.result}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 实现代码 */}
        <div className="space-y-4">
          {/* call 实现 */}
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-blue-400">1️⃣ call 实现</h4>
            <pre className="text-sm overflow-x-auto">
{`Function.prototype.myCall = function(context, ...args) {
  // 1. 处理 null 和 undefined
  context = context || window;
  
  // 2. 创建唯一属性名（避免覆盖）
  const fn = Symbol('fn');
  
  // 3. 将函数设为对象的方法
  context[fn] = this;
  
  // 4. 调用函数
  const result = context[fn](...args);
  
  // 5. 删除临时属性
  delete context[fn];
  
  return result;
};

// 使用
const obj = { name: 'Alice' };
function greet(msg) {
  return msg + ', ' + this.name;
}
greet.myCall(obj, 'Hello');  // "Hello, Alice"`}
            </pre>
          </div>

          {/* apply 实现 */}
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-indigo-400">2️⃣ apply 实现</h4>
            <pre className="text-sm overflow-x-auto">
{`Function.prototype.myApply = function(context, args) {
  context = context || window;
  const fn = Symbol('fn');
  context[fn] = this;
  
  // 唯一区别：参数是数组
  const result = args ? context[fn](...args) : context[fn]();
  
  delete context[fn];
  return result;
};

// 使用
greet.myApply(obj, ['Hi']);  // "Hi, Alice"`}
            </pre>
          </div>

          {/* bind 实现 */}
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-purple-400">3️⃣ bind 实现（最复杂）</h4>
            <pre className="text-sm overflow-x-auto">
{`Function.prototype.myBind = function(context, ...args1) {
  const self = this;
  
  const fBound = function(...args2) {
    // 合并参数（柯里化）
    const args = [...args1, ...args2];
    
    // 如果作为构造函数，this 指向实例
    // 否则指向绑定的 context
    return self.apply(
      this instanceof fBound ? this : context,
      args
    );
  };
  
  // 维护原型链
  if (this.prototype) {
    fBound.prototype = Object.create(this.prototype);
  }
  
  return fBound;
};

// 使用
const boundFunc = greet.myBind(obj, 'Hey');
boundFunc();  // "Hey, Alice"`}
            </pre>
          </div>
        </div>

        {/* 面试场景 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 真实面试场景</h3>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="font-semibold text-gray-900 mb-2">
                👔 面试官：call 和 apply 的区别是什么？你能手写实现吗？
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded text-sm">
                <p className="font-semibold text-green-900 mb-2">✅ 标准回答：</p>
                <p className="text-gray-800 mb-2">
                  <strong>唯一区别：参数格式不同</strong>
                </p>
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>call：fn.call(obj, 1, 2, 3) - 参数列表</li>
                  <li>apply：fn.apply(obj, [1, 2, 3]) - 参数数组</li>
                </ul>
                <p className="mt-2 text-purple-700">
                  💡 <strong>记忆技巧：</strong>apply 的 a 代表 array（数组）
                </p>
                <p className="mt-2 text-gray-700">
                  实现原理相同：都是把函数设为对象的方法，调用后删除
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
              <div className="font-semibold text-gray-900 mb-2">
                👔 面试官：bind 为什么要返回函数？有什么特殊之处？
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded text-sm">
                <p className="font-semibold text-green-900 mb-2">✅ 关键点：</p>
                <ol className="list-decimal ml-5 text-gray-700 space-y-2">
                  <li>
                    <strong>延迟执行：</strong>bind 返回新函数，不立即调用
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`const bound = fn.bind(obj);
bound();  // 稍后调用`}
                    </pre>
                  </li>
                  <li>
                    <strong>柯里化：</strong>支持参数分批传入
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`const add = (a, b) => a + b;
const add5 = add.bind(null, 5);
add5(10);  // 15`}
                    </pre>
                  </li>
                  <li>
                    <strong>构造函数支持：</strong>new bound() 时，this 指向实例而不是绑定对象
                  </li>
                </ol>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
              <div className="font-semibold text-gray-900 mb-2">
                👔 面试官：为什么用 Symbol 而不是普通字符串？
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded text-sm">
                <p className="text-gray-800">
                  <strong>防止属性名冲突：</strong>
                </p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// 如果用普通字符串
context.fn = this;  // 可能覆盖原有的 fn 属性

// 用 Symbol 保证唯一
const fn = Symbol('fn');  // 绝对不会冲突
context[fn] = this;`}
                </pre>
                <p className="mt-2 text-purple-700">
                  💡 这是面试加分点，展示你对细节的把控！
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 高频QA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">❓ 高频面试问题</h3>
          <div className="space-y-3">
            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">
                Q1: 什么时候用 call/apply，什么时候用 bind？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <ul className="list-disc ml-5 space-y-2">
                  <li><strong>call/apply：</strong>需要立即执行时（如借用方法）</li>
                  <li><strong>bind：</strong>需要保留函数稍后执行时（如事件处理器）</li>
                </ul>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// 立即执行：用 call
Math.max.apply(null, [1, 2, 3]);

// 稍后执行：用 bind
button.onclick = handler.bind(this);`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">
                Q2: 如何选择用 call 还是 apply？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <p>根据参数形式选择：</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>参数明确且少：用 call</li>
                  <li>参数是数组或不确定：用 apply</li>
                </ul>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// 参数明确：call
greet.call(obj, 'Hello', 'World');

// 参数是数组：apply
const args = [1, 2, 3];
fn.apply(obj, args);`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">
                Q3: bind 可以多次绑定吗？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <p><strong>不可以！第一次绑定后，this 就固定了：</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`const obj1 = { name: 'obj1' };
const obj2 = { name: 'obj2' };

const bound1 = fn.bind(obj1);
const bound2 = bound1.bind(obj2);  // 无效！

bound2();  // this 仍然是 obj1`}
                </pre>
              </div>
            </details>
          </div>
        </div>

        {/* 应用场景 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-2">💡 实际应用场景</h4>
          <div className="text-sm text-yellow-800 space-y-2">
            <div>
              <strong>1. 类数组转数组：</strong>
              <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                Array.prototype.slice.call(arguments)
              </code>
            </div>
            <div>
              <strong>2. 求数组最大值：</strong>
              <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                Math.max.apply(null, [1,2,3])
              </code>
            </div>
            <div>
              <strong>3. React 事件处理：</strong>
              <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                onClick={'{this.handleClick.bind(this)}'}
              </code>
            </div>
            <div>
              <strong>4. 柯里化函数：</strong>
              <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                const add5 = add.bind(null, 5)
              </code>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
