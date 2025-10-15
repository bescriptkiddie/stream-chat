'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function LatexRenderDemo() {
  const [latex, setLatex] = useState('E = mc^2');

  const examples = [
    { name: '爱因斯坦质能方程', formula: 'E = mc^2' },
    { name: '二次方程求根公式', formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
    { name: '积分', formula: '\\int_{a}^{b} f(x) dx' },
    { name: '求和', formula: '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}' },
    { name: '矩阵', formula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { name: '极限', formula: '\\lim_{x \\to \\infty} \\frac{1}{x} = 0' },
  ];

  // 简易 LaTeX 渲染（实际项目用 KaTeX 或 MathJax）
  const renderLatex = (text) => {
    return text
      .replace(/\^(\d)/g, '<sup>$1</sup>')
      .replace(/_(\d)/g, '<sub>$1</sub>')
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, '<span class="frac"><span>$1</span><span>$2</span></span>')
      .replace(/\\sqrt{([^}]+)}/g, '√($1)')
      .replace(/\\pm/g, '±')
      .replace(/\\int/g, '∫')
      .replace(/\\sum/g, 'Σ')
      .replace(/\\lim/g, 'lim')
      .replace(/\\to/g, '→')
      .replace(/\\infty/g, '∞');
  };

  return (
    <DemoContainer
      title="LaTeX 公式渲染"
      description="Step 模型数学能力展示 - 支持数学公式"
    >
      <div className="space-y-6">
        {/* 核心说明 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📐 LaTeX 数学公式</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">常用库</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• <strong>KaTeX:</strong> 快速、轻量（推荐）</li>
                <li>• <strong>MathJax:</strong> 功能完整、体积大</li>
                <li>• <strong>react-katex:</strong> React 封装</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">使用场景</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• AI 数学推理</li>
                <li>• 在线教育</li>
                <li>• 科研论文</li>
                <li>• 技术文档</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 示例选择 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">选择示例：</h4>
          <div className="grid grid-cols-3 gap-2">
            {examples.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => setLatex(ex.formula)}
                className="px-3 py-2 bg-white border rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition text-sm"
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        {/* 输入框 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            输入 LaTeX 公式：
          </label>
          <textarea
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            className="w-full h-24 px-4 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="输入 LaTeX 公式..."
          />
        </div>

        {/* 渲染结果 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">渲染结果（简易版）：</h4>
          <div 
            className="text-2xl text-center py-8"
            dangerouslySetInnerHTML={{ __html: renderLatex(latex) }}
          />
          <p className="text-xs text-gray-500 mt-4 text-center">
            注：这是简易渲染，实际项目请使用 KaTeX 或 MathJax
          </p>
        </div>

        {/* 实际项目代码 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💻 实际项目实现（KaTeX）</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`// 1. 安装依赖
npm install katex react-katex

// 2. 引入样式
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// 3. 使用
function MathComponent() {
  return (
    <>
      {/* 行内公式 */}
      <InlineMath math="E = mc^2" />
      
      {/* 块级公式 */}
      <BlockMath math="\\int_{a}^{b} f(x) dx" />
    </>
  );
}

// 4. 结合 Markdown
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

<ReactMarkdown
  remarkPlugins={[remarkMath]}
  rehypePlugins={[rehypeKatex]}
>
  {content}
</ReactMarkdown>

// 5. 阶跃星辰 AI 应用
function AIResponse({ content }) {
  // 解析消息中的 LaTeX
  const renderWithLatex = (text) => {
    return <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {text}
    </ReactMarkdown>;
  };
  
  return renderWithLatex(content);
}`}
          </pre>
        </div>

        {/* 常用 LaTeX 语法 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📝 常用 LaTeX 语法速查</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-2">基础符号：</p>
              <ul className="space-y-1 font-mono text-xs">
                <li>• 上标: x^2 → x²</li>
                <li>• 下标: x_1 → x₁</li>
                <li>• 分数: \\frac{'{a}'}{'{b}'} → a/b</li>
                <li>• 根号: \\sqrt{'{x}'} → √x</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">运算符：</p>
              <ul className="space-y-1 font-mono text-xs">
                <li>• 积分: \\int_{'{a}'}^{'{b}'}</li>
                <li>• 求和: \\sum_{'{i=1}'}^{'{n}'}</li>
                <li>• 极限: \\lim_{'{x \\to \\infty}'}</li>
                <li>• 偏导: \\frac{'{\\partial y}'}{'{\\partial x}'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 思维体系定位 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">🧠 思维体系定位</h3>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">📍 在前端体系中的位置</h4>
              <div className="text-sm text-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-semibold">第四层：应用场景</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-indigo-200 text-indigo-900 rounded text-xs font-semibold">AI 产品开发</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-indigo-300 text-indigo-950 rounded text-xs font-semibold">LaTeX 数学公式渲染</span>
                </div>
                <p className="text-gray-600 mt-2">
                  LaTeX 渲染是 AI 数学/科学对话的必备功能，让 AI 能够清晰展示数学公式、方程式、矩阵等内容。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">🔧 技术栈关联</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs font-semibold text-blue-900 mb-2">⬇️ 底层技术</div>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• KaTeX / MathJax</li>
                    <li>• 正则表达式解析</li>
                    <li>• React 组件封装</li>
                    <li>• SSR 兼容性</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 公式渲染引擎</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 协同功能</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• Markdown 渲染</li>
                    <li>• 代码高亮</li>
                    <li>• 流式内容</li>
                    <li>• 复制功能</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 富文本展示</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬆️ 产品价值</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• 数学/科学对话</li>
                    <li>• 教育场景</li>
                    <li>• 论文阅读</li>
                    <li>• 专业表达</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 专业AI助手</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">🛤️ 实现路径建议</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">1️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">基础实现：集成 KaTeX</strong>
                    <p className="text-xs text-gray-600">安装 KaTeX，渲染单个公式</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">解析混合内容：正则识别</strong>
                    <p className="text-xs text-gray-600">识别 $..$ 和 $$...$$ 标记，分离文本和公式</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">流式渲染：边接收边显示</strong>
                    <p className="text-xs text-gray-600">处理公式跨 chunk 问题，缓冲不完整公式</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">生产级：错误处理 + 性能优化</strong>
                    <p className="text-xs text-gray-600">公式错误降级、懒加载KaTeX、memo优化</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">⭐ AI 公司面试重要性</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">考察频率：</span>
                    <div className="flex gap-1">
                      {[1,2,3].map(i => (
                        <span key={i} className="text-yellow-500">⭐</span>
                      ))}
                      <span className="text-gray-300">⭐⭐</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">教育/科研类产品关注</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">业务相关度：</span>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <span key={i} className="text-purple-500">💜</span>
                      ))}
                      <span className="text-gray-300">💜</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">专业对话场景必备</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-purple-50 rounded">
                <p className="text-xs text-purple-800">
                  <strong>💡 面试建议：</strong>能讲清楚 KaTeX 原理、能处理流式渲染中的公式分割问题、能优化渲染性能。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">📊 实现难度评估</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>技术难度</span>
                    <span className="text-indigo-600 font-semibold">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要理解 KaTeX API、正则解析、流式处理</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>业务复杂度</span>
                    <span className="text-purple-600 font-semibold">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">主要是渲染逻辑，业务场景相对简单</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg text-center">
              <p className="text-sm text-indigo-900 mb-2">想了解完整的 AI 前端开发体系？</p>
              <a 
                href="/docs/MINDMAP" 
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
