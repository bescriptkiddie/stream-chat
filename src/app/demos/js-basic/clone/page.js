'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function CloneDemo() {
  const [obj1] = useState({ a: 1, b: { c: 2 } });
  const [shallowCopy] = useState({ ...obj1 });
  const [deepCopy] = useState(JSON.parse(JSON.stringify(obj1)));

  // 修改原对象
  const [modified, setModified] = useState(false);
  const modifyOriginal = () => {
    obj1.b.c = 999;
    setModified(true);
  };

  return (
    <DemoContainer
      title="深拷贝 vs 浅拷贝"
      description="理解引用类型的拷贝机制"
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">📦 核心区别</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">浅拷贝 (Shallow Copy)</h4>
              <p className="text-sm text-gray-700 mb-2">只复制第一层，嵌套对象仍是引用</p>
              <div className="bg-blue-50 p-2 rounded text-xs">
                <div className="font-mono text-blue-800">
                  const copy = {'{ ...obj }'}<br/>
                  const copy = Object.assign({'{}'},obj)
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-indigo-900 mb-2">深拷贝 (Deep Copy)</h4>
              <p className="text-sm text-gray-700 mb-2">递归复制所有层级，完全独立</p>
              <div className="bg-indigo-50 p-2 rounded text-xs">
                <div className="font-mono text-indigo-800">
                  const copy = JSON.parse(<br/>
                  &nbsp;&nbsp;JSON.stringify(obj)<br/>
                  )
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🎮 交互演示</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-gray-50 rounded border">
              <div className="text-sm font-semibold text-gray-700 mb-2">原对象</div>
              <pre className="text-xs">{JSON.stringify(obj1, null, 2)}</pre>
            </div>
            <div className="p-4 bg-yellow-50 rounded border border-yellow-300">
              <div className="text-sm font-semibold text-yellow-700 mb-2">浅拷贝</div>
              <pre className="text-xs">{JSON.stringify(shallowCopy, null, 2)}</pre>
              {modified && <p className="text-xs text-red-600 mt-2">⚠️ 受影响</p>}
            </div>
            <div className="p-4 bg-green-50 rounded border border-green-300">
              <div className="text-sm font-semibold text-green-700 mb-2">深拷贝</div>
              <pre className="text-xs">{JSON.stringify(deepCopy, null, 2)}</pre>
              {modified && <p className="text-xs text-green-600 mt-2">✓ 不受影响</p>}
            </div>
          </div>
          <button
            onClick={modifyOriginal}
            disabled={modified}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            修改原对象的嵌套属性 (obj1.b.c = 999)
          </button>
        </div>

        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">💻 手写深拷贝</h4>
          <pre className="text-sm overflow-x-auto">{`function deepClone(obj, hash = new WeakMap()) {
  // 处理 null 和基本类型
  if (obj === null || typeof obj !== 'object') return obj;
  
  // 处理循环引用
  if (hash.has(obj)) return hash.get(obj);
  
  // 处理 Date
  if (obj instanceof Date) return new Date(obj);
  
  // 处理 RegExp
  if (obj instanceof RegExp) return new RegExp(obj);
  
  // 处理数组和对象
  const cloneObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, cloneObj);
  
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  
  return cloneObj;
}`}</pre>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">❓ 面试高频 QA</h3>
          <div className="space-y-3">
            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Q1: 浅拷贝的常见方法？</summary>
              <div className="mt-2 text-sm space-y-2">
                <ul className="list-disc ml-5">
                  <li>Object.assign()</li>
                  <li>展开运算符 {...obj}</li>
                  <li>Array.slice()</li>
                  <li>Array.concat()</li>
                </ul>
              </div>
            </details>
            
            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Q2: JSON 深拷贝的缺陷？</summary>
              <div className="mt-2 text-sm">
                <ul className="list-disc ml-5 text-red-700">
                  <li>无法处理函数</li>
                  <li>无法处理 undefined</li>
                  <li>无法处理循环引用</li>
                  <li>Date 会变成字符串</li>
                  <li>RegExp 会变成空对象</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Q3: 如何处理循环引用？</summary>
              <div className="mt-2 text-sm">
                <p>使用 WeakMap 记录已拷贝的对象：</p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">{`const hash = new WeakMap();
if (hash.has(obj)) return hash.get(obj);
hash.set(obj, cloneObj);`}</pre>
              </div>
            </details>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-2">⚠️ 使用建议</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• <strong>简单对象:</strong> JSON.parse(JSON.stringify())</li>
            <li>• <strong>复杂对象:</strong> 手写递归深拷贝</li>
            <li>• <strong>生产环境:</strong> 使用 lodash.cloneDeep</li>
            <li>• <strong>性能要求高:</strong> 考虑结构化克隆 structuredClone()</li>
          </ul>
        </div>
      </div>
    </DemoContainer>
  );
}