'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import DemoContainer from '@/components/DemoContainer';

// 昂贵的计算函数
const expensiveCalculation = (num) => {
  console.log('💰 执行昂贵计算...');
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  return num * 2;
};

// ===== 未优化的子组件 =====
const NormalChild = ({ value, onClick }) => {
  console.log('🔴 NormalChild 渲染');
  return (
    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
      <div className="text-sm text-red-700 mb-2">未优化组件（每次都重新渲染）</div>
      <div className="text-2xl font-bold text-red-900">{value}</div>
      <button
        onClick={onClick}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        点击
      </button>
    </div>
  );
};

// ===== React.memo 优化的子组件 =====
const MemoizedChild = memo(({ value, onClick }) => {
  console.log('✅ MemoizedChild 渲染');
  return (
    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
      <div className="text-sm text-green-700 mb-2">使用 React.memo（props 不变不渲染）</div>
      <div className="text-2xl font-bold text-green-900">{value}</div>
      <button
        onClick={onClick}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        点击
      </button>
    </div>
  );
});
MemoizedChild.displayName = 'MemoizedChild';

export default function MemoizationDemo() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState(1);
  const [renderCount, setRenderCount] = useState(0);

  // ===== 演示 1: useMemo 缓存计算结果 =====
  const normalResult = expensiveCalculation(input); // 每次渲染都计算
  const memoizedResult = useMemo(() => {
    return expensiveCalculation(input);
  }, [input]); // 只在 input 变化时计算

  // ===== 演示 2: useCallback 缓存函数引用 =====
  const normalCallback = () => {
    console.log('Normal callback');
  };
  
  const memoizedCallback = useCallback(() => {
    console.log('Memoized callback');
  }, []);

  return (
    <DemoContainer
      title="memo & useMemo & useCallback"
      description="React 性能优化三件套"
    >
      <div className="space-y-6">
        {/* 控制台提示 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-sm text-yellow-800">
            💡 <strong>打开控制台</strong>查看渲染日志，观察优化效果
          </p>
        </div>

        {/* 触发重新渲染 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-3">触发重新渲染</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setCount(count + 1)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Count: {count}
            </button>
            <button
              onClick={() => setRenderCount(renderCount + 1)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              强制渲染
            </button>
          </div>
        </div>

        {/* 演示 1: useMemo */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">1️⃣ useMemo - 缓存计算结果</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              输入值（改变此值才会重新计算）
            </label>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="text-sm text-red-700 mb-2">❌ 未优化（每次都计算）</div>
              <div className="text-3xl font-bold text-red-900">Result: {normalResult}</div>
              <p className="text-xs text-red-600 mt-2">点击上面的 Count 按钮观察控制台</p>
            </div>
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="text-sm text-green-700 mb-2">✅ useMemo（input 变化才计算）</div>
              <div className="text-3xl font-bold text-green-900">Result: {memoizedResult}</div>
              <p className="text-xs text-green-600 mt-2">修改 input 才会重新计算</p>
            </div>
          </div>

          <div className="mt-4 bg-white p-3 rounded border">
            <pre className="text-xs text-gray-800">
{`// 未优化：每次渲染都计算
const result = expensiveCalculation(input);

// 使用 useMemo：只在 input 变化时计算
const result = useMemo(() => {
  return expensiveCalculation(input);
}, [input]);`}
            </pre>
          </div>
        </div>

        {/* 演示 2: React.memo */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">2️⃣ React.memo - 避免不必要的组件渲染</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <NormalChild value={100} onClick={normalCallback} />
            <MemoizedChild value={100} onClick={memoizedCallback} />
          </div>

          <div className="mt-4 bg-white p-3 rounded border">
            <pre className="text-xs text-gray-800">
{`// 未优化：父组件渲染，子组件必定渲染
const Child = ({ value }) => <div>{value}</div>;

// 使用 memo：props 不变，不重新渲染
const Child = memo(({ value }) => <div>{value}</div>);`}
            </pre>
          </div>
        </div>

        {/* 演示 3: useCallback */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">3️⃣ useCallback - 缓存函数引用</h3>
          
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm text-gray-700 mb-3">
              useCallback 配合 React.memo 使用，避免因函数引用变化导致子组件重新渲染
            </p>
            <pre className="text-xs text-gray-800 bg-gray-50 p-3 rounded">
{`// 问题：每次渲染创建新函数，导致 memo 失效
const handleClick = () => console.log('click');

// 解决：useCallback 缓存函数引用
const handleClick = useCallback(() => {
  console.log('click');
}, []); // 依赖为空，函数永远不变`}
            </pre>
          </div>
        </div>

        {/* 对比总结 */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-orange-900 mb-4">📊 三者对比</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-orange-100">
                <tr>
                  <th className="p-3 text-left">API</th>
                  <th className="p-3 text-left">用途</th>
                  <th className="p-3 text-left">缓存内容</th>
                  <th className="p-3 text-left">典型场景</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-t">
                  <td className="p-3 font-semibold text-purple-700">useMemo</td>
                  <td className="p-3">缓存计算结果</td>
                  <td className="p-3">值</td>
                  <td className="p-3">昂贵计算、复杂数据处理</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-semibold text-green-700">React.memo</td>
                  <td className="p-3">避免组件重渲染</td>
                  <td className="p-3">组件</td>
                  <td className="p-3">纯展示组件、列表项</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-semibold text-blue-700">useCallback</td>
                  <td className="p-3">缓存函数引用</td>
                  <td className="p-3">函数</td>
                  <td className="p-3">传递给 memo 组件的回调</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 面试高频 QA */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">❓ 面试高频 QA</h3>
          <div className="space-y-3">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: useMemo 和 useCallback 有什么区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <ul className="list-disc ml-5">
                  <li><strong>useMemo:</strong> 缓存<strong>值</strong> <code>useMemo(() =&gt; value, [deps])</code></li>
                  <li><strong>useCallback:</strong> 缓存<strong>函数</strong> <code>useCallback(() =&gt; {}, [deps])</code></li>
                </ul>
                <p className="mt-2 text-purple-700">💡 记忆：useCallback(fn, deps) = useMemo(() =&gt; fn, deps)</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: React.memo 什么时候会失效？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <p><strong>失效情况：</strong></p>
                <ul className="list-disc ml-5 mt-2">
                  <li>传递新的<strong>对象</strong>或<strong>数组</strong>（引用变化）</li>
                  <li>传递新的<strong>函数</strong>（需配合 useCallback）</li>
                  <li>使用 <strong>children</strong>（每次都是新的元素）</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 过度使用 memo 会有副作用吗？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <p><strong>会！</strong></p>
                <ul className="list-disc ml-5 mt-2">
                  <li>增加内存开销（缓存数据）</li>
                  <li>增加比较开销（浅比较 props）</li>
                  <li>代码复杂度提升</li>
                </ul>
                <p className="mt-2 text-orange-700">⚠️ <strong>建议：</strong>只优化性能瓶颈，不要过早优化</p>
              </div>
            </details>
          </div>
        </div>

        {/* 最佳实践 */}
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <h4 className="font-semibold text-indigo-900 mb-2">🎯 最佳实践</h4>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>✅ 列表项组件用 React.memo</li>
            <li>✅ 昂贵计算用 useMemo</li>
            <li>✅ 传给 memo 组件的回调用 useCallback</li>
            <li>❌ 不要对所有组件都用 memo</li>
            <li>❌ 简单计算不需要 useMemo</li>
            <li>💡 先测量性能，再优化</li>
          </ul>
        </div>
      </div>
    </DemoContainer>
  );
}
