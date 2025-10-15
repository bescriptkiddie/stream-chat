'use client';

import { useState, useEffect } from 'react';
import DemoContainer from '@/components/DemoContainer';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function UseDebounceDemo() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([]);
  const debouncedValue = useDebounce(input, 500);

  useEffect(() => {
    if (debouncedValue) {
      setLogs(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        value: debouncedValue
      }]);
    }
  }, [debouncedValue]);

  return (
    <DemoContainer
      title="useDebounce Hook"
      description="防抖 Hook 实现 - 常用于搜索框输入优化"
    >
      <div className="space-y-6">
        {/* 输入区 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            输入搜索词（500ms 防抖）
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="试试快速输入..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
          />
        </div>

        {/* 实时显示 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <div className="text-xs font-semibold text-yellow-700 mb-2">实时值（立即更新）</div>
            <div className="text-lg font-mono text-yellow-900">{input || '...'}</div>
          </div>
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="text-xs font-semibold text-green-700 mb-2">防抖值（延迟 500ms）</div>
            <div className="text-lg font-mono text-green-900">{debouncedValue || '...'}</div>
          </div>
        </div>

        {/* API 调用日志 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">模拟 API 调用日志（仅防抖后触发）</h3>
          <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">等待输入...</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="mb-1">
                  <span className="text-gray-500">[{log.time}]</span> 
                  <span className="text-yellow-400"> API 调用 </span>
                  search="{log.value}"
                </div>
              ))
            )}
          </div>
        </div>

        {/* 说明 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💡 核心原理</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 使用 setTimeout 延迟更新状态</li>
            <li>• useEffect cleanup 函数清除上一次的定时器</li>
            <li>• 避免频繁触发 API 请求，节省资源</li>
            <li>• 典型应用：搜索框、窗口 resize 事件</li>
          </ul>
        </div>

        {/* 核心代码实现 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">📝 核心代码实现</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设置定时器
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup: 清除上一次的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 使用示例
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearchTerm) {
    // 只有当用户停止输入 500ms 后才调用 API
    searchAPI(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);`}
            </pre>
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
                    面试官：请实现一个 useDebounce Hook
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p>useDebounce 主要用于延迟更新值，核心实现：</p>
                      <ol className="list-decimal ml-5 space-y-1">
                        <li><strong>useState：</strong>保存防抖后的值</li>
                        <li><strong>useEffect：</strong>监听原始值变化</li>
                        <li><strong>setTimeout：</strong>延迟更新</li>
                        <li><strong>cleanup：</strong>清除旧定时器</li>
                      </ol>
                      <p className="mt-2">典型应用是搜索框，用户停止输入后才发起请求。</p>
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
                    面试官：防抖和节流有什么区别？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 核心区别：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-semibold text-blue-900 mb-2">防抖 (Debounce)</p>
                          <ul className="text-xs space-y-1">
                            <li>• 连续触发只执行最后一次</li>
                            <li>• 等待用户停止操作</li>
                            <li>• 场景：搜索框、表单验证</li>
                            <li>• 节省：减少请求次数</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="font-semibold text-green-900 mb-2">节流 (Throttle)</p>
                          <ul className="text-xs space-y-1">
                            <li>• 固定时间内只执行一次</li>
                            <li>• 持续执行但控制频率</li>
                            <li>• 场景：滚动、resize</li>
                            <li>• 节省：控制执行频率</li>
                          </ul>
                        </div>
                      </div>
                      <p className="mt-2 text-purple-700">💡 <strong>记忆技巧：</strong>防抖等最后一次，节流控制频率</p>
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
                    面试官：如果需要立即执行一次怎么办？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p>可以添加 immediate 参数：</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function useDebounce(value, delay, immediate = false) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isFirstRun, setIsFirstRun] = useState(true);

  useEffect(() => {
    // 首次立即执行
    if (immediate && isFirstRun) {
      setDebouncedValue(value);
      setIsFirstRun(false);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, immediate, isFirstRun]);

  return debouncedValue;
}`}
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
                Q1: 为什么要在 useEffect cleanup 中清除定时器？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>不清除会导致：</strong></p>
                <ul className="list-disc ml-5">
                  <li>旧定时器仍会执行，造成多次更新</li>
                  <li>内存泄漏</li>
                  <li>状态更新不符合预期</li>
                </ul>
                <p className="mt-2"><strong>示例：</strong></p>
                <p className="text-xs">用户输入 "abc"，每个字母触发一次 useEffect，如果不清除，会有 3 个定时器，最终触发 3 次更新。</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: useDebounce 会造成性能问题吗？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>不会，反而优化性能：</strong></p>
                <ul className="list-disc ml-5">
                  <li>减少不必要的计算和渲染</li>
                  <li>减少 API 请求次数</li>
                  <li>setTimeout 和 clearTimeout 性能开销很小</li>
                </ul>
                <p className="mt-2 text-purple-700">💡 <strong>优化建议：</strong>对于大量实例，可以用 useMemo 缓存 Hook</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 搜索框应该用多长的延迟时间？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>推荐配置：</strong></p>
                <ul className="list-disc ml-5 space-y-1">
                  <li><strong>300-500ms：</strong>搜索框（常用）</li>
                  <li><strong>200-300ms：</strong>自动保存</li>
                  <li><strong>500-1000ms：</strong>输入验证</li>
                  <li><strong>100-200ms：</strong>实时反馈</li>
                </ul>
                <p className="mt-2 text-gray-600">根据用户体验和服务器压力平衡选择</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 如何测试 useDebounce？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

test('should debounce value', async () => {
  jest.useFakeTimers();
  
  const { result, rerender } = renderHook(
    ({ value, delay }) => useDebounce(value, delay),
    { initialProps: { value: 'initial', delay: 500 } }
  );

  expect(result.current).toBe('initial');

  // 快速改变值
  rerender({ value: 'a', delay: 500 });
  rerender({ value: 'ab', delay: 500 });
  rerender({ value: 'abc', delay: 500 });

  // 500ms 前不应更新
  act(() => {
    jest.advanceTimersByTime(300);
  });
  expect(result.current).toBe('initial');

  // 500ms 后应更新为最后的值
  act(() => {
    jest.advanceTimersByTime(200);
  });
  expect(result.current).toBe('abc');

  jest.useRealTimers();
});`}
                </pre>
              </div>
            </details>
          </div>
        </div>

        {/* 追问场景 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-3">🔥 可能的追问</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div>
              <strong>追问 1：</strong>如果组件卸载时还有未完成的定时器怎么办？
              <p className="ml-4 text-xs text-gray-700">→ useEffect cleanup 会自动清除，不会导致内存泄漏</p>
            </div>
            <div>
              <strong>追问 2：</strong>能用 useMemo 实现 useDebounce 吗？
              <p className="ml-4 text-xs text-gray-700">→ 不能，useMemo 是同步的，无法处理异步延迟</p>
            </div>
            <div>
              <strong>追问 3：</strong>在 AI 产品中如何应用？
              <p className="ml-4 text-xs text-gray-700">→ 用户输入 Prompt 时防抖，减少 Token 计算次数</p>
            </div>
            <div>
              <strong>追问 4：</strong>如何取消正在进行的防抖？
              <p className="ml-4 text-xs text-gray-700">→ 暴露 cancel 方法，或者将 delay 设为 0</p>
            </div>
          </div>
        </div>

        {/* 思维体系定位 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
            🧠 思维体系定位
          </h3>

          <div className="space-y-6">
            {/* 在前端体系中的位置 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">📍 在前端体系中的位置</h4>
              <div className="text-sm text-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-xs font-semibold">第三层：框架特性</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-cyan-200 text-cyan-900 rounded text-xs font-semibold">React Hooks</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-cyan-300 text-cyan-950 rounded text-xs font-semibold">性能优化 Hook</span>
                </div>
                <p className="text-gray-600 mt-2">
                  useDebounce 是性能优化的核心 Hook，属于<strong>框架应用层</strong>。
                  它基于 React Hooks 机制，解决高频事件性能问题。
                </p>
              </div>
            </div>

            {/* 知识关联图 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">🔗 知识关联图</h4>
              <div className="grid grid-cols-3 gap-4">
                {/* 底层技术 */}
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs font-semibold text-blue-900 mb-2">⬇️ 底层技术</div>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• useState</li>
                    <li>• useEffect</li>
                    <li>• setTimeout</li>
                    <li>• clearTimeout</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 需要掌握的基础</p>
                </div>

                {/* 横向关联 */}
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 横向关联</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• useThrottle</li>
                    <li>• useMemo</li>
                    <li>• useCallback</li>
                    <li>• 防抖函数</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 相关优化技术</p>
                </div>

                {/* 后续应用 */}
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬆️ 后续应用</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• 搜索框</li>
                    <li>• 表单验证</li>
                    <li>• 自动保存</li>
                    <li>• API 限流</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 实际应用场景</p>
                </div>
              </div>
            </div>

            {/* 学习路径建议 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">🛤️ 学习路径建议</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">1️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">理解防抖概念</strong>
                    <p className="text-xs text-gray-600">学习防抖的定义、原理和应用场景</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">手写防抖函数</strong>
                    <p className="text-xs text-gray-600">用原生 JS 实现 debounce 函数</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">封装 useDebounce</strong>
                    <p className="text-xs text-gray-600">用 React Hooks 封装成可复用的 Hook</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">实战应用</strong>
                    <p className="text-xs text-gray-600">在搜索框、表单等场景中使用</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 面试重要性评估 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">⭐ 面试重要性评估</h4>
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
                  <p className="text-xs text-gray-600">React 面试高频考点</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">难度系数：</span>
                    <div className="flex gap-1">
                      {[1,2,3].map(i => (
                        <span key={i} className="text-red-500">🔥</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">中等难度</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-purple-50 rounded">
                <p className="text-xs text-purple-800">
                  <strong>💡 面试建议：</strong>能手写实现、能讲清楚原理、能说出应用场景、能对比防抖和节流。
                </p>
              </div>
            </div>

            {/* 知识深度 vs 广度 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">📊 知识深度 vs 广度</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>深度要求</span>
                    <span className="text-indigo-600 font-semibold">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要理解 Hook 原理和 cleanup 机制</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>广度要求</span>
                    <span className="text-purple-600 font-semibold">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">应用场景广泛，需要了解各种优化技巧</p>
                </div>
              </div>
            </div>

            {/* 查看完整体系 */}
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg text-center">
              <p className="text-sm text-indigo-900 mb-2">
                想了解完整的前端知识体系？
              </p>
              <a 
                href="/MINDMAP.md" 
                target="_blank"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
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
