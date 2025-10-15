'use client';

import { useState, useRef, useEffect } from 'react';
import DemoContainer from '@/components/DemoContainer';

const ITEM_HEIGHT = 50;
const BUFFER_SIZE = 5;

function VirtualList({ data, height, itemHeight = ITEM_HEIGHT }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const visibleCount = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - BUFFER_SIZE);
  const endIndex = Math.min(data.length, startIndex + visibleCount + BUFFER_SIZE * 2);
  const visibleData = data.slice(startIndex, endIndex);

  const totalHeight = data.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height, overflow: 'auto' }}
      className="border-2 border-gray-300 rounded-lg"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleData.map((item, idx) => (
            <div
              key={startIndex + idx}
              style={{ height: itemHeight }}
              className="border-b border-gray-200 px-4 flex items-center hover:bg-indigo-50 transition"
            >
              <span className="font-mono text-sm text-gray-500 mr-4">#{item.id}</span>
              <span className="text-gray-800">{item.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VirtualListDemo() {
  const [itemCount, setItemCount] = useState(10000);
  const [data, setData] = useState([]);
  const [renderTime, setRenderTime] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const newData = Array.from({ length: itemCount }, (_, i) => ({
      id: i + 1,
      content: `列表项 ${i + 1} - ${Math.random().toString(36).substr(2, 9)}`
    }));
    setData(newData);
    const end = performance.now();
    setRenderTime((end - start).toFixed(2));
  }, [itemCount]);

  return (
    <DemoContainer
      title="虚拟列表 (Virtual List)"
      description="大数据列表渲染优化 - 仅渲染可见区域"
    >
      <div className="space-y-6">
        {/* 控制面板 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              数据量：
            </label>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-bold text-indigo-600 w-32">
              {itemCount.toLocaleString()} 条
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            渲染耗时: <span className="font-mono text-green-600">{renderTime}ms</span>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="text-xs text-blue-600 font-semibold">总数据量</div>
            <div className="text-2xl font-bold text-blue-900">{data.length.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="text-xs text-green-600 font-semibold">DOM 节点数</div>
            <div className="text-2xl font-bold text-green-900">~{Math.ceil(500 / ITEM_HEIGHT) + BUFFER_SIZE * 2}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div className="text-xs text-purple-600 font-semibold">性能提升</div>
            <div className="text-2xl font-bold text-purple-900">{Math.floor(data.length / (Math.ceil(500 / ITEM_HEIGHT) + BUFFER_SIZE * 2))}x</div>
          </div>
        </div>

        {/* 虚拟列表 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">虚拟列表（仅渲染可见区域 + 缓冲区）</h3>
          <VirtualList data={data} height={500} />
        </div>

        {/* 说明 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💡 核心原理</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 计算容器可见区域的起始和结束索引</li>
            <li>• 仅渲染可见区域 + 上下缓冲区的元素</li>
            <li>• 使用 transform 偏移实现滚动效果</li>
            <li>• 大幅减少 DOM 节点，提升渲染性能</li>
            <li>• 适用场景：长列表、表格、聊天记录等</li>
          </ul>
        </div>

        {/* 思维体系定位 */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
            🧠 思维体系定位
          </h3>

          <div className="space-y-6">
            {/* 在前端体系中的位置 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-orange-900 mb-3">📍 在前端体系中的位置</h4>
              <div className="text-sm text-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-semibold">第四层：应用场景</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-orange-200 text-orange-900 rounded text-xs font-semibold">性能优化</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-orange-300 text-orange-950 rounded text-xs font-semibold">长列表优化</span>
                </div>
                <p className="text-gray-600 mt-2">
                  虚拟列表是前端性能优化的经典方案，属于<strong>应用层</strong>的核心技术。
                  它通过只渲染可见区域来解决长列表性能问题，是大数据展示、聊天记录等场景的必备技术。
                </p>
              </div>
            </div>

            {/* 知识关联图 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-orange-900 mb-3">🔗 知识关联图</h4>
              <div className="grid grid-cols-3 gap-4">
                {/* 前置知识 */}
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs font-semibold text-blue-900 mb-2">⬆️ 前置知识</div>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• React 渲染机制</li>
                    <li>• 浏览器渲染原理</li>
                    <li>• 滚动事件处理</li>
                    <li>• DOM 操作成本</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 性能优化基础</p>
                </div>

                {/* 横向关联 */}
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 横向关联</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• 懒加载</li>
                    <li>• 分页加载</li>
                    <li>• IntersectionObserver</li>
                    <li>• 防抖节流</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 性能优化手段</p>
                </div>

                {/* 后续应用 */}
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬇️ 后续应用</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• AI 聊天历史</li>
                    <li>• 大数据表格</li>
                    <li>• 商品列表</li>
                    <li>• 移动端优化</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 实际应用场景</p>
                </div>
              </div>
            </div>

            {/* 学习路径 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-orange-900 mb-3">🛤️ 学习路径建议</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">1️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">当前阶段：理解虚拟列表原理</strong>
                    <p className="text-xs text-gray-600">掌握可视区域计算、偏移量处理、缓冲区设计</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">下一步：手写虚拟列表</strong>
                    <p className="text-xs text-gray-600">实现基础版本，处理滚动事件、动态高度</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">进阶：性能优化</strong>
                    <p className="text-xs text-gray-600">节流滚动事件、requestAnimationFrame、React.memo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">深入：复杂场景</strong>
                    <p className="text-xs text-gray-600">动态高度、瀑布流、表格虚拟化、无限滚动</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 面试重要性 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-orange-900 mb-3">⭐ 面试重要性评估</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">考察频率：</span>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <span key={i} className="text-yellow-500">⭐</span>
                      ))}
                      <span className="text-gray-300">⭐</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">性能优化专题必考</p>
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
                  <p className="text-xs text-gray-600">中高难度，需实战经验</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 rounded">
                <p className="text-xs text-yellow-800">
                  <strong>💡 面试建议：</strong>能讲清楚原理（只渲染可见区域）、能手写基础实现、能分析性能提升幅度、能处理动态高度。
                </p>
              </div>
            </div>

            {/* 知识深度与广度 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-orange-900 mb-3">📊 知识深度 vs 广度</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>深度（理论层面）</span>
                    <span className="text-orange-600 font-semibold">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要理解：渲染机制、滚动原理、性能指标</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>广度（应用场景）</span>
                    <span className="text-green-600 font-semibold">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">应用场景：长列表、表格、聊天、商品展示</p>
                </div>
              </div>
            </div>

            {/* 查看完整体系 */}
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-lg text-center">
              <p className="text-sm text-orange-900 mb-2">
                想了解完整的前端知识体系？
              </p>
              <a 
                href="/docs/MINDMAP" 
                target="_blank"
                className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium"
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
