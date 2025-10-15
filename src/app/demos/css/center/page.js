'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function CenterDemo() {
  const [method, setMethod] = useState('flex');

  const methods = [
    { id: 'flex', name: 'Flexbox', desc: '最推荐，兼容性好' },
    { id: 'grid', name: 'Grid', desc: '现代方案，简洁' },
    { id: 'absolute', name: 'Absolute + Transform', desc: '经典方案' },
    { id: 'margin', name: 'Margin Auto', desc: '水平居中' },
    { id: 'table', name: 'Table Cell', desc: '老方案' },
    { id: 'line-height', name: 'Line Height', desc: '单行文本' },
  ];

  const getCode = (id) => {
    const codes = {
      flex: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
      grid: `.container {
  display: grid;
  place-items: center;
}`,
      absolute: `.container {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`,
      margin: `.container {
  width: 600px;
}
.child {
  width: 300px;
  margin: 0 auto;
}`,
      table: `.container {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}`,
      'line-height': `.container {
  line-height: 200px;
  text-align: center;
}`
    };
    return codes[id] || '';
  };

  const getStyle = (id) => {
    const baseContainer = 'w-full h-64 bg-gray-100 border-2 border-gray-300 rounded-lg';
    const child = 'w-32 h-32 bg-indigo-600 text-white flex items-center justify-center rounded-lg font-bold';
    
    const styles = {
      flex: `${baseContainer} flex justify-center items-center`,
      grid: `${baseContainer} grid place-items-center`,
      absolute: `${baseContainer} relative`,
      margin: `${baseContainer}`,
      table: `${baseContainer}`,
      'line-height': `${baseContainer}`,
    };
    
    return styles[id] || baseContainer;
  };

  const getChildStyle = (id) => {
    const base = 'w-32 h-32 bg-indigo-600 text-white flex items-center justify-center rounded-lg font-bold';
    
    if (id === 'absolute') {
      return `${base} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`;
    }
    if (id === 'margin') {
      return `${base} mx-auto`;
    }
    return base;
  };

  return (
    <DemoContainer
      title="居中方案大全"
      description="CSS 基础必考题 - 6 种居中方法"
    >
      <div className="space-y-6">
        {/* 方法选择 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="grid grid-cols-3 gap-3">
            {methods.map(m => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-3 rounded-lg border-2 transition ${
                  method === m.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-900 border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="font-semibold text-sm">{m.name}</div>
                <div className={`text-xs mt-1 ${method === m.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {m.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 演示 */}
        <div className={getStyle(method)}>
          <div className={getChildStyle(method)}>
            居中元素
          </div>
        </div>

        {/* 代码 */}
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
          <pre className="text-sm">
            {getCode(method)}
          </pre>
        </div>

        {/* 对比表 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 方案对比</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">方案</th>
                  <th className="p-2 text-left">兼容性</th>
                  <th className="p-2 text-left">优点</th>
                  <th className="p-2 text-left">缺点</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-2 font-semibold">Flexbox</td>
                  <td className="p-2 text-green-600">IE 10+</td>
                  <td className="p-2">简单、灵活、响应式</td>
                  <td className="p-2">-</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Grid</td>
                  <td className="p-2 text-green-600">IE 11+</td>
                  <td className="p-2">最简洁，一行代码</td>
                  <td className="p-2">兼容性略差</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Absolute</td>
                  <td className="p-2 text-green-600">IE 9+</td>
                  <td className="p-2">兼容性好</td>
                  <td className="p-2">脱离文档流</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Margin</td>
                  <td className="p-2 text-green-600">所有</td>
                  <td className="p-2">简单</td>
                  <td className="p-2">只能水平居中</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 思维体系定位 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">🧠 思维体系定位</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-purple-900 mb-2">📐 布局基础</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 盒模型理解</li>
                <li>• 文档流概念</li>
                <li>• 定位方式（static/relative/absolute/fixed）</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-blue-900 mb-2">🎨 现代布局</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Flexbox 弹性布局</li>
                <li>• Grid 网格布局</li>
                <li>• 响应式设计</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-green-900 mb-2">⚡ CSS 高级</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• BFC 块级格式化上下文</li>
                <li>• transform 变换</li>
                <li>• calc() 计算函数</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 实战应用场景 */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">🚀 实战应用场景</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">1️⃣ 登录框居中（最常见）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  background: rgba(0, 0, 0, 0.5);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
}`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">2️⃣ 卡片列表居中对齐</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 水平居中 */
  gap: 20px;
  padding: 20px;
}

.card {
  width: 300px;
  padding: 20px;
  border: 1px solid #ddd;
}`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">3️⃣ 按钮垂直居中（单行）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`.button-container {
  height: 60px;
  display: flex;
  align-items: center; /* 垂直居中 */
  padding: 0 20px;
}

.button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* 面试高频 QA */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 面试高频 QA</h3>
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: 如何实现元素居中？（标准回答）
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900 mb-2">✅ 推荐回答：</p>
                  <div className="space-y-2">
                    <p><strong>现代方案（推荐）：</strong></p>
                    <ol className="list-decimal ml-5 space-y-1 text-xs">
                      <li><strong>Flexbox：</strong>display: flex + justify-content: center + align-items: center</li>
                      <li><strong>Grid：</strong>display: grid + place-items: center（最简洁）</li>
                    </ol>
                    <p><strong>传统方案：</strong></p>
                    <ol className="list-decimal ml-5 space-y-1 text-xs">
                      <li><strong>绝对定位：</strong>position: absolute + top: 50% + left: 50% + transform: translate(-50%, -50%)</li>
                      <li><strong>水平居中：</strong>margin: 0 auto（需要固定宽度）</li>
                    </ol>
                    <p className="text-purple-700 mt-2">
                      💡 <strong>实际项目：</strong>优先使用 Flexbox，简单场景用 Grid
                    </p>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: Flexbox 和 Grid 居中的区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <p className="font-semibold text-blue-900 mb-2">Flexbox（一维布局）</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`.container {
  display: flex;
  justify-content: center; /* 主轴 */
  align-items: center;     /* 交叉轴 */
}

/* 适用场景：
- 单行/单列布局
- 组件内部元素对齐
- 动态内容居中 */`}
                    </pre>
                  </div>
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                    <p className="font-semibold text-purple-900 mb-2">Grid（二维布局）</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`.container {
  display: grid;
  place-items: center;
  /* 等价于：
  justify-items: center;
  align-items: center; */
}

/* 适用场景：
- 复杂网格布局
- 多个元素同时居中
- 响应式设计 */`}
                    </pre>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 为什么 margin: 0 auto 只能水平居中？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`/* margin: auto 的原理：
   浏览器会计算剩余空间并平均分配到左右 margin */

.container {
  width: 800px;
  margin: 0 auto; /* 水平居中 ✅ */
}

/* ❌ 垂直方向为什么不行？
   因为：
   1. 块级元素默认高度由内容决定
   2. 没有"剩余空间"的概念
   3. 父容器高度通常是 auto
   
   解决方案：
   1. 给父容器设置固定高度
   2. 使用 Flexbox/Grid
   3. 使用绝对定位 */

/* ✅ 特殊情况：可以垂直居中（很少用）*/
.parent {
  height: 500px;
}
.child {
  height: 200px;
  margin: auto 0; /* 需要配合定位 */
  position: absolute;
  top: 0;
  bottom: 0;
}`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: transform: translate(-50%, -50%) 为什么能居中？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`/* 原理分解： */

/* 1. 绝对定位到父容器中心点 */
.child {
  position: absolute;
  top: 50%;    /* 顶部距离父容器高度的 50% */
  left: 50%;   /* 左边距离父容器宽度的 50% */
}
/* 此时：元素的左上角在中心点，但元素本身没居中 */

/* 2. 回退自身宽高的一半 */
.child {
  transform: translate(-50%, -50%);
  /* -50% 是相对于自身宽高计算的 */
}
/* 完美居中 ✅ */

/* 优点：
- 不需要知道元素的具体宽高
- 适用于动态内容
- 兼容性好（IE9+）

/* 缺点：
- 脱离文档流
- 可能影响其他元素布局 */`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q5: 如何实现不定宽高元素居中？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-teal-50 border-l-4 border-teal-500 p-3 rounded">
                  <p className="font-semibold text-teal-900 mb-2">💡 推荐方案（按优先级）：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`/* 1. Flexbox（最推荐）*/
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 2. Grid */
.container {
  display: grid;
  place-items: center;
}

/* 3. 绝对定位 + Transform */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 4. Table Cell（旧方案，不推荐）*/
.container {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q6: 什么是 BFC？如何用于居中？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-pink-50 border-l-4 border-pink-500 p-3 rounded">
                  <p className="font-semibold text-pink-900 mb-2">📚 BFC（Block Formatting Context）</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`/* BFC 是一个独立的渲染区域，内部元素不会影响外部 */

/* 触发 BFC 的方式：
1. float: left/right
2. position: absolute/fixed
3. display: inline-block/flex/grid
4. overflow: hidden/auto/scroll

/* BFC 特性：
- 内部盒子垂直排列
- margin 不会与外部重叠
- 不会被浮动元素覆盖
- 计算高度时包含浮动元素

/* 用于居中（不常用，主要用于清除浮动）*/
.container {
  overflow: hidden; /* 触发 BFC */
}

/* 更多用途：防止 margin 塌陷 */
.parent {
  overflow: hidden; /* BFC */
}
.child {
  margin-top: 20px; /* 不会与 parent 的 margin 合并 */
}`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q7: 如何实现响应式居中？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`/* 1. 使用 Flexbox（推荐）*/
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap; /* 小屏幕换行 */
  padding: 20px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column; /* 移动端垂直排列 */
  }
}

/* 2. Grid 响应式 */
.container {
  display: grid;
  place-items: center;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* 3. 结合 clamp() 和 calc() */
.child {
  width: clamp(300px, 50vw, 800px); /* 最小300px，最大800px */
  margin: 0 auto;
  padding: clamp(1rem, 5vw, 3rem);
}`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q8: 面试官追问：哪种方案性能最好？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded">
                  <p className="font-semibold text-indigo-900 mb-2">⚡ 性能对比：</p>
                  <ol className="list-decimal ml-5 text-xs space-y-2 mb-2">
                    <li><strong>Flexbox：</strong>性能最好，GPU 加速，现代浏览器优化充分</li>
                    <li><strong>Grid：</strong>性能略低于 Flexbox，但差距很小（微秒级别）</li>
                    <li><strong>Transform：</strong>会触发合成层（Compositing），性能好，但可能影响周围元素</li>
                    <li><strong>Table-cell：</strong>性能较差，触发 reflow</li>
                  </ol>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`/* 性能测试建议：
1. 使用 Chrome DevTools Performance 面板
2. 查看 Layout 和 Paint 时间
3. 避免在循环中频繁修改布局

/* 结论：
- 大多数场景性能差异可忽略
- 优先考虑可维护性和兼容性
- 复杂布局用 Flexbox
- 简单居中用 Grid */`}
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
              <h4 className="font-semibold text-red-900 mb-2">❌ 陷阱 1：忘记设置父容器高度</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`/* ❌ 错误：父容器没有高度，垂直居中失效 */
.container {
  display: flex;
  align-items: center; /* 不生效 */
}

/* ✅ 正确：设置高度 */
.container {
  display: flex;
  align-items: center;
  min-height: 100vh; /* 或者固定高度 */
}`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900 mb-2">❌ 陷阱 2：inline 元素无法设置宽高</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`/* ❌ span/a 等 inline 元素无法用 margin: 0 auto */
span {
  width: 200px;
  margin: 0 auto; /* 不生效 */
}

/* ✅ 改为 block 或 inline-block */
span {
  display: inline-block;
  width: 200px;
  margin: 0 auto;
}`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900 mb-2">❌ 陷阱 3：position: fixed 的居中</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`/* ❌ 固定定位相对于视口，不是父元素 */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 会相对于浏览器窗口居中，而不是父元素 */
}

/* ✅ 如果需要相对于父元素，用 absolute */
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
