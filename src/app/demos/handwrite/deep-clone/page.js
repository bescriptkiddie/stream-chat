'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function DeepCloneDemo() {
  const [testResults, setTestResults] = useState([]);

  const addResult = (message, type = 'info') => {
    setTestResults(prev => [...prev, { id: Date.now() + Math.random(), message, type }]);
  };

  const clearResults = () => setTestResults([]);

  // ===== 版本 1: 基础深拷贝（递归）=====
  function deepClone1(obj, hash = new WeakMap()) {
    if (obj === null) return null;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    if (typeof obj !== 'object') return obj;

    // 处理循环引用
    if (hash.has(obj)) return hash.get(obj);

    const cloneObj = Array.isArray(obj) ? [] : {};
    hash.set(obj, cloneObj);

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloneObj[key] = deepClone1(obj[key], hash);
      }
    }

    return cloneObj;
  }

  // ===== 版本 2: 完整深拷贝（支持更多类型）=====
  function deepClone2(obj, hash = new WeakMap()) {
    // null 和 undefined
    if (obj === null || obj === undefined) return obj;

    // 基本类型
    if (typeof obj !== 'object') return obj;

    // 处理循环引用
    if (hash.has(obj)) return hash.get(obj);

    // Date
    if (obj instanceof Date) return new Date(obj);

    // RegExp
    if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);

    // Map
    if (obj instanceof Map) {
      const cloneMap = new Map();
      hash.set(obj, cloneMap);
      obj.forEach((value, key) => {
        cloneMap.set(deepClone2(key, hash), deepClone2(value, hash));
      });
      return cloneMap;
    }

    // Set
    if (obj instanceof Set) {
      const cloneSet = new Set();
      hash.set(obj, cloneSet);
      obj.forEach(value => {
        cloneSet.add(deepClone2(value, hash));
      });
      return cloneSet;
    }

    // 数组
    if (Array.isArray(obj)) {
      const cloneArr = [];
      hash.set(obj, cloneArr);
      obj.forEach((item, index) => {
        cloneArr[index] = deepClone2(item, hash);
      });
      return cloneArr;
    }

    // 普通对象
    const cloneObj = Object.create(Object.getPrototypeOf(obj));
    hash.set(obj, cloneObj);

    // 拷贝所有自有属性（包括不可枚举属性）
    Reflect.ownKeys(obj).forEach(key => {
      cloneObj[key] = deepClone2(obj[key], hash);
    });

    return cloneObj;
  }

  // ===== 测试用例 =====

  const testBasic = () => {
    clearResults();
    addResult('=== 测试 1: 基础类型 ===', 'info');

    const obj = {
      num: 42,
      str: 'hello',
      bool: true,
      nul: null,
      undef: undefined,
      arr: [1, 2, 3],
      nested: { a: 1, b: 2 }
    };

    const cloned = deepClone2(obj);
    
    addResult(`原对象: ${JSON.stringify(obj)}`, 'sync');
    addResult(`克隆对象: ${JSON.stringify(cloned)}`, 'sync');
    addResult(`深度相等: ${JSON.stringify(obj) === JSON.stringify(cloned)}`, 'success');
    addResult(`引用不同: ${obj !== cloned && obj.nested !== cloned.nested}`, 'success');
  };

  const testCircular = () => {
    clearResults();
    addResult('=== 测试 2: 循环引用 ===', 'info');

    const obj = { name: 'Alice' };
    obj.self = obj; // 循环引用

    try {
      const cloned = deepClone2(obj);
      addResult(`✅ 成功处理循环引用`, 'success');
      addResult(`原对象指向自己: ${obj.self === obj}`, 'success');
      addResult(`克隆对象指向自己: ${cloned.self === cloned}`, 'success');
      addResult(`但两者不是同一个对象: ${obj !== cloned}`, 'success');
    } catch (e) {
      addResult(`❌ 失败: ${e.message}`, 'error');
    }
  };

  const testSpecialTypes = () => {
    clearResults();
    addResult('=== 测试 3: 特殊类型 ===', 'info');

    const obj = {
      date: new Date('2024-01-01'),
      regex: /test/gi,
      map: new Map([['key', 'value']]),
      set: new Set([1, 2, 3]),
    };

    const cloned = deepClone2(obj);

    addResult(`Date: ${cloned.date instanceof Date && cloned.date.getTime() === obj.date.getTime()}`, 'success');
    addResult(`RegExp: ${cloned.regex instanceof RegExp && cloned.regex.source === obj.regex.source}`, 'success');
    addResult(`Map: ${cloned.map instanceof Map && cloned.map.get('key') === 'value'}`, 'success');
    addResult(`Set: ${cloned.set instanceof Set && cloned.set.has(1)}`, 'success');
  };

  const testPerformance = () => {
    clearResults();
    addResult('=== 测试 4: 性能对比 ===', 'info');

    const largeObj = {
      data: Array(1000).fill(null).map((_, i) => ({
        id: i,
        name: `Item ${i}`,
        nested: { value: i * 2 }
      }))
    };

    // JSON 方法
    const start1 = performance.now();
    const cloned1 = JSON.parse(JSON.stringify(largeObj));
    const time1 = (performance.now() - start1).toFixed(2);

    // 自定义方法
    const start2 = performance.now();
    const cloned2 = deepClone2(largeObj);
    const time2 = (performance.now() - start2).toFixed(2);

    addResult(`JSON 方法: ${time1}ms`, 'sync');
    addResult(`自定义方法: ${time2}ms`, 'sync');
    addResult(`性能差异: ${(time2 / time1).toFixed(2)}x`, time2 < time1 ? 'success' : 'info');
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
      title="手写深拷贝"
      description="递归 + 循环引用处理 - 高频算法面试题"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📚 深拷贝 vs 浅拷贝</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">浅拷贝</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mb-2">
{`const obj = { a: 1, b: { c: 2 } };
const copy = { ...obj };
// or
const copy = Object.assign({}, obj);

copy.b.c = 999;
console.log(obj.b.c); // 999 (被修改了！)`}
              </pre>
              <p className="text-xs text-gray-600">只复制第一层，嵌套对象仍是引用</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">深拷贝</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mb-2">
{`const obj = { a: 1, b: { c: 2 } };
const copy = deepClone(obj);

copy.b.c = 999;
console.log(obj.b.c); // 2 (不受影响)`}
              </pre>
              <p className="text-xs text-gray-600">递归复制所有层级，完全独立</p>
            </div>
          </div>
        </div>

        {/* 测试按钮 */}
        <div className="flex gap-3">
          <button onClick={testBasic} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            测试 1: 基础类型
          </button>
          <button onClick={testCircular} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            测试 2: 循环引用
          </button>
          <button onClick={testSpecialTypes} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            测试 3: 特殊类型
          </button>
          <button onClick={testPerformance} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
            测试 4: 性能对比
          </button>
          <button onClick={clearResults} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
            清空
          </button>
        </div>

        {/* 测试结果 */}
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 h-64 overflow-y-auto space-y-2">
          {testResults.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              选择一个测试用例开始
            </div>
          ) : (
            testResults.map((result) => (
              <div key={result.id} className={`p-2 rounded ${getTypeStyles(result.type)}`}>
                <span className="font-mono text-sm">{result.message}</span>
              </div>
            ))
          )}
        </div>

        {/* 完整实现代码 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💻 完整实现代码</h4>
          <details>
            <summary className="cursor-pointer text-sm text-blue-800 hover:text-blue-900 font-medium">
              点击查看完整代码
            </summary>
            <div className="mt-3 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs">
{`function deepClone(obj, hash = new WeakMap()) {
  // 1. null 和 undefined
  if (obj === null || obj === undefined) return obj;

  // 2. 基本类型
  if (typeof obj !== 'object') return obj;

  // 3. 处理循环引用
  if (hash.has(obj)) return hash.get(obj);

  // 4. Date
  if (obj instanceof Date) return new Date(obj);

  // 5. RegExp
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);

  // 6. Map
  if (obj instanceof Map) {
    const cloneMap = new Map();
    hash.set(obj, cloneMap);
    obj.forEach((value, key) => {
      cloneMap.set(deepClone(key, hash), deepClone(value, hash));
    });
    return cloneMap;
  }

  // 7. Set
  if (obj instanceof Set) {
    const cloneSet = new Set();
    hash.set(obj, cloneSet);
    obj.forEach(value => {
      cloneSet.add(deepClone(value, hash));
    });
    return cloneSet;
  }

  // 8. 数组
  if (Array.isArray(obj)) {
    const cloneArr = [];
    hash.set(obj, cloneArr);
    obj.forEach((item, index) => {
      cloneArr[index] = deepClone(item, hash);
    });
    return cloneArr;
  }

  // 9. 普通对象
  const cloneObj = Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, cloneObj);

  // 拷贝所有自有属性（包括 Symbol）
  Reflect.ownKeys(obj).forEach(key => {
    cloneObj[key] = deepClone(obj[key], hash);
  });

  return cloneObj;
}

// 关键点：
// 1. WeakMap 存储已拷贝对象，解决循环引用
// 2. 判断各种特殊类型分别处理
// 3. 使用 Reflect.ownKeys 获取所有属性（包括 Symbol）
// 4. Object.create(Object.getPrototypeOf(obj)) 保持原型链`}
              </pre>
            </div>
          </details>
        </div>

        {/* 思维体系定位 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">🧠 思维体系定位</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-purple-900 mb-2">📦 数据结构</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 对象与数组遍历</li>
                <li>• Map/Set 操作</li>
                <li>• WeakMap 应用</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-blue-900 mb-2">🔄 算法思维</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 递归遍历</li>
                <li>• 哈希表去重</li>
                <li>• 图论（循环引用检测）</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-green-900 mb-2">⚡ JS 核心</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 引用类型 vs 值类型</li>
                <li>• 原型链理解</li>
                <li>• 类型判断技巧</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 实战应用场景 */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">🚀 实战应用场景</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">1️⃣ React 状态管理</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// 避免直接修改 state
const [form, setForm] = useState(initialForm);

// ❌ 错误：直接修改
form.user.name = 'New Name';
setForm(form); // 不会触发更新！

// ✅ 正确：深拷贝后修改
const newForm = deepClone(form);
newForm.user.name = 'New Name';
setForm(newForm);`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">2️⃣ 撤销重做功能</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`class History {
  constructor() {
    this.snapshots = [];
  }
  
  save(state) {
    // 保存当前状态的深拷贝
    this.snapshots.push(deepClone(state));
  }
  
  undo() {
    return this.snapshots.pop();
  }
}`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">3️⃣ 表单数据备份</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// 保存原始数据，支持重置
const originalData = deepClone(formData);

// 用户修改后可以重置
const resetForm = () => {
  setFormData(deepClone(originalData));
};`}
              </pre>
            </div>
          </div>
        </div>

        {/* 面试场景 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 面试高频 QA</h3>
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: JSON.parse(JSON.stringify()) 有什么问题？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-2">
                  <p className="font-semibold text-red-900">❌ 无法处理：</p>
                  <ul className="list-disc ml-5 text-xs mt-1">
                    <li>undefined、Symbol、函数会被忽略</li>
                    <li>Date 会变成字符串</li>
                    <li>RegExp、Map、Set 会变成空对象</li>
                    <li>循环引用会报错</li>
                    <li>无法拷贝原型链</li>
                    <li>NaN、Infinity 会变成 null</li>
                  </ul>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`const obj = {
  date: new Date(),
  regex: /test/g,
  func: () => {},
  undef: undefined,
  nan: NaN,
};
obj.self = obj; // 循环引用

JSON.parse(JSON.stringify(obj));
// ❌ TypeError: Converting circular structure to JSON`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 如何处理循环引用？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ 使用 WeakMap：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`function deepClone(obj, hash = new WeakMap()) {
  // 如果已经拷贝过，直接返回
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  const cloneObj = Array.isArray(obj) ? [] : {};
  
  // 先存储，再递归（避免无限循环）
  hash.set(obj, cloneObj);

  for (let key in obj) {
    cloneObj[key] = deepClone(obj[key], hash);
  }

  return cloneObj;
}

// WeakMap 的优势：
// 1. 键必须是对象，值可以是任意类型
// 2. 键是弱引用，不影响垃圾回收
// 3. 不可遍历，防止内存泄漏`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 为什么用 WeakMap 而不是 Map？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// Map: 强引用，可能导致内存泄漏
const map = new Map();
let obj = { data: 'large object' };
map.set(obj, 'value');
obj = null; // obj 仍被 map 引用，无法被 GC

// WeakMap: 弱引用，自动垃圾回收
const weakMap = new WeakMap();
let obj2 = { data: 'large object' };
weakMap.set(obj2, 'value');
obj2 = null; // obj2 可以被 GC 回收

// 结论：
// - 短期使用: Map（性能更好）
// - 长期缓存: WeakMap（防止内存泄漏）`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 如何拷贝不可枚举属性和 Symbol？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ for...in 只能获取可枚举属性
for (let key in obj) {
  cloneObj[key] = obj[key];
}

// ✅ Reflect.ownKeys 获取所有属性（包括 Symbol）
Reflect.ownKeys(obj).forEach(key => {
  cloneObj[key] = deepClone(obj[key], hash);
});

// Reflect.ownKeys = Object.getOwnPropertyNames + Object.getOwnPropertySymbols
// 包括：可枚举、不可枚举、Symbol 属性`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q5: 深拷贝如何保持原型链？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：丢失原型链
const cloneObj = {};

// ✅ 正确：保持原型链
const cloneObj = Object.create(Object.getPrototypeOf(obj));

// 示例
class Person {
  sayHi() { return 'Hi'; }
}
const person = new Person();
person.name = 'Alice';

const cloned = deepClone(person);
cloned.sayHi(); // 'Hi' - 方法仍然可用
cloned instanceof Person; // true - 原型链保持`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q6: structuredClone 和手写深拷贝的区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-teal-50 border-l-4 border-teal-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// structuredClone (浏览器原生 API, Node 17+)
const cloned = structuredClone(obj);

// ✅ 优点：
// - 支持循环引用
// - 支持 Date、RegExp、Map、Set、ArrayBuffer
// - 性能更好（原生实现）

// ❌ 缺点：
// - 不支持函数、Symbol
// - 不支持原型链
// - 兼容性要求高

// 结论：
// - 纯数据对象: structuredClone
// - 复杂对象（含函数/原型）: 手写深拷贝
// - 面试: 必须会手写`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q7: 如何优化深拷贝性能？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 1. 使用迭代代替递归（避免栈溢出）
function deepCloneIterative(obj) {
  const root = {};
  const stack = [{ parent: root, key: undefined, data: obj }];

  while (stack.length) {
    const { parent, key, data } = stack.pop();
    let res = parent;
    
    if (typeof key !== 'undefined') {
      res = parent[key] = Array.isArray(data) ? [] : {};
    }

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === 'object') {
          stack.push({ parent: res, key: k, data: data[k] });
        } else {
          res[k] = data[k];
        }
      }
    }
  }
  return root;
}

// 2. 使用消息队列（多层嵌套）
// 3. 使用 Web Worker（大数据量）`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q8: 面试官追问：如果对象非常大怎么办？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-pink-50 border-l-4 border-pink-500 p-3 rounded">
                  <p className="font-semibold text-pink-900 mb-2">💡 优化策略：</p>
                  <ol className="list-decimal ml-5 text-xs space-y-2">
                    <li><strong>惰性拷贝：</strong>只拷贝访问的属性（Proxy + Getter）</li>
                    <li><strong>分片处理：</strong>使用 requestIdleCallback 分批拷贝</li>
                    <li><strong>Web Worker：</strong>在后台线程处理，避免阻塞 UI</li>
                    <li><strong>结构化共享：</strong>只拷贝修改的部分（Immutable.js 思路）</li>
                  </ol>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// 示例：分片深拷贝
function deepCloneAsync(obj, callback) {
  const chunks = splitIntoChunks(obj, 1000); // 每批 1000 个属性
  
  function processChunk(index) {
    if (index >= chunks.length) {
      callback(result);
      return;
    }
    
    requestIdleCallback(() => {
      processChunk(chunks[index]);
      processChunk(index + 1);
    });
  }
  
  processChunk(0);
}`}
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
              <h4 className="font-semibold text-red-900 mb-2">❌ 陷阱 1：忘记处理 null</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// typeof null === 'object'，需要单独判断
if (obj === null) return null;`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900 mb-2">❌ 陷阱 2：Date/RegExp 当作普通对象</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 必须用 instanceof 优先判断特殊类型
if (obj instanceof Date) return new Date(obj);
if (obj instanceof RegExp) return new RegExp(obj);`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900 mb-2">❌ 陷阱 3：hasOwnProperty 可能被覆盖</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 不安全
obj.hasOwnProperty(key)

// ✅ 安全
Object.prototype.hasOwnProperty.call(obj, key)`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
