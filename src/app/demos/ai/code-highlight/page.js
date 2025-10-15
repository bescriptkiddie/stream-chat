'use client';

import { useState, useEffect, useRef } from 'react';
import DemoContainer from '@/components/DemoContainer';

// 模拟 AI 流式返回的文本（包含代码块）
const mockStreamText = `好的，我来帮你写一个 React 计数器组件：

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>计数: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}
\`\`\`

这个组件使用了 useState Hook 来管理状态。

还需要 CSS 样式：

\`\`\`css
.counter {
  text-align: center;
  padding: 20px;
}

button {
  background: #0070f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
\`\`\`

这样就完成了！`;

// ===== 核心知识点 1: 简单的代码高亮实现 =====
// 不依赖外部库，用 CSS 实现基础高亮
function highlightCode(code, language) {
  // 简单的关键词高亮（实际项目用 Prism.js 或 highlight.js）
  const keywords = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'import', 'export', 'from'],
    css: ['color', 'background', 'padding', 'margin', 'border', 'width', 'height'],
  };

  let highlighted = code;
  const langKeywords = keywords[language] || [];

  // 高亮关键词
  langKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
  });

  // 高亮字符串
  highlighted = highlighted.replace(/(["'`])(.*?)\1/g, '<span class="string">$1$2$1</span>');
  
  // 高亮注释
  highlighted = highlighted.replace(/\/\/(.*?)$/gm, '<span class="comment">//$1</span>');

  return highlighted;
}

// ===== 核心知识点 2: 解析 Markdown 代码块 =====
function parseMarkdownWithCode(text) {
  const parts = [];
  let currentIndex = 0;
  
  // 匹配 ```language ... ``` 格式
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // 添加代码块前的普通文本
    if (match.index > currentIndex) {
      parts.push({
        type: 'text',
        content: text.slice(currentIndex, match.index)
      });
    }

    // 添加代码块
    parts.push({
      type: 'code',
      language: match[1] || 'plaintext',
      content: match[2].trim()
    });

    currentIndex = match.index + match[0].length;
  }

  // 添加剩余文本
  if (currentIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(currentIndex)
    });
  }

  return parts;
}

export default function CodeHighlightDemo() {
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [speed, setSpeed] = useState(20); // 打字速度（ms）
  const streamIndexRef = useRef(0);

  // ===== 核心知识点 3: 流式文本模拟 =====
  const startStreaming = () => {
    setStreamedText('');
    setIsStreaming(true);
    streamIndexRef.current = 0;

    const interval = setInterval(() => {
      if (streamIndexRef.current < mockStreamText.length) {
        setStreamedText(mockStreamText.slice(0, streamIndexRef.current + 1));
        streamIndexRef.current++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, speed);

    return () => clearInterval(interval);
  };

  const reset = () => {
    setStreamedText('');
    setIsStreaming(false);
    streamIndexRef.current = 0;
  };

  // ===== 核心知识点 4: 解析并渲染内容 =====
  const parsedContent = parseMarkdownWithCode(streamedText);

  return (
    <DemoContainer
      title="流式代码高亮"
      description="AI 生成代码时的实时语法高亮显示"
    >
      <div className="space-y-6">
        {/* 控制面板 */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
          <button
            onClick={startStreaming}
            disabled={isStreaming}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
          >
            {isStreaming ? '正在生成...' : '开始流式生成'}
          </button>
          <button
            onClick={reset}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
          >
            重置
          </button>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">速度:</label>
            <input
              type="range"
              min="5"
              max="50"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-32"
              disabled={isStreaming}
            />
            <span className="text-sm text-gray-600">{speed}ms</span>
          </div>
        </div>

        {/* 流式输出展示区 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
          <div className="prose max-w-none">
            {parsedContent.map((part, index) => {
              if (part.type === 'text') {
                return (
                  <div key={index} className="whitespace-pre-wrap text-gray-800 mb-4">
                    {part.content}
                  </div>
                );
              } else {
                // 代码块渲染
                return (
                  <div key={index} className="mb-4">
                    <div className="bg-gray-800 text-white px-3 py-1 text-xs font-mono rounded-t-lg flex items-center justify-between">
                      <span>{part.language}</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(part.content)}
                        className="text-gray-400 hover:text-white transition"
                      >
                        复制
                      </button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
                      <code
                        className="text-sm font-mono"
                        dangerouslySetInnerHTML={{
                          __html: highlightCode(part.content, part.language)
                        }}
                      />
                    </pre>
                  </div>
                );
              }
            })}
            
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-indigo-600 animate-pulse ml-1" />
            )}
          </div>
        </div>

        {/* 技术要点说明 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💡 核心技术要点</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <div>
              <strong>1. 流式文本接收</strong>
              <p className="ml-4 text-blue-700">逐字追加文本，模拟 AI 实时生成效果</p>
            </div>
            <div>
              <strong>2. Markdown 代码块解析</strong>
              <p className="ml-4 text-blue-700">正则匹配 <code>`​``language...`​``</code> 格式，区分普通文本和代码</p>
            </div>
            <div>
              <strong>3. 语法高亮实现</strong>
              <p className="ml-4 text-blue-700">关键词匹配 + CSS 样式，实际项目用 Prism.js 或 highlight.js</p>
            </div>
            <div>
              <strong>4. 实时渲染优化</strong>
              <p className="ml-4 text-blue-700">每次追加文本重新解析，避免闪烁</p>
            </div>
          </div>
        </div>

        {/* 代码示例 */}
        <details className="bg-gray-50 border rounded-lg p-4">
          <summary className="cursor-pointer font-semibold text-gray-900 mb-2">
            查看核心代码实现
          </summary>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mt-2">
            <pre className="text-sm">
{`// 解析 Markdown 代码块
function parseMarkdownWithCode(text) {
  const parts = [];
  const regex = /\`\`\`(\\w+)?\\n([\\s\\S]*?)\`\`\`/g;
  let match;
  let currentIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    // 添加普通文本
    if (match.index > currentIndex) {
      parts.push({
        type: 'text',
        content: text.slice(currentIndex, match.index)
      });
    }

    // 添加代码块
    parts.push({
      type: 'code',
      language: match[1] || 'plaintext',
      content: match[2].trim()
    });

    currentIndex = match.index + match[0].length;
  }

  return parts;
}`}
            </pre>
          </div>
        </details>

        {/* 实际项目建议 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-2">🚀 实际项目建议</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 使用 <strong>Prism.js</strong> 或 <strong>highlight.js</strong> 进行专业语法高亮</li>
            <li>• 使用 <strong>react-markdown</strong> + <strong>rehype-highlight</strong> 插件</li>
            <li>• 添加复制按钮、行号、语言标识等 UI 增强</li>
            <li>• 考虑代码块懒加载，避免长文本性能问题</li>
            <li>• 支持自定义主题（VS Code Dark、GitHub Light 等）</li>
          </ul>
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
                    面试官：你们项目中 AI 生成的代码是怎么展示的？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p>我们使用流式渲染配合语法高亮，主要分几个步骤：</p>
                      <ol className="list-decimal ml-5 space-y-1">
                        <li><strong>流式接收：</strong>通过 SSE 接收 AI 返回的文本流</li>
                        <li><strong>实时解析：</strong>用正则表达式识别 Markdown 代码块格式</li>
                        <li><strong>语法高亮：</strong>使用 Prism.js 对代码块进行语法高亮</li>
                        <li><strong>性能优化：</strong>使用 React.memo 避免不必要的重新渲染</li>
                      </ol>
                      <p className="mt-2 text-gray-600">这样用户可以实时看到代码生成过程，体验更好。</p>
                    </div>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mt-2">
                    <div className="font-semibold text-red-900 mb-2">❌ 差的回答：</div>
                    <div className="text-sm text-gray-800">
                      "就是显示出来而已，用了一些库。"（太模糊，没有技术细节）
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
                    面试官：流式渲染代码高亮时，如何避免性能问题？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 核心要点：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>1. 节流渲染：</strong></p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto mt-1">
{`// 不要每个字符都触发高亮，而是批量处理
let buffer = '';
const flushInterval = setInterval(() => {
  if (buffer) {
    setContent(prev => prev + buffer);
    buffer = '';
  }
}, 100); // 每 100ms 刷新一次`}
                      </pre>
                      <p><strong>2. 按需高亮：</strong>只对完整的代码块进行高亮，未结束的代码块显示为普通文本</p>
                      <p><strong>3. 虚拟滚动：</strong>如果代码块很多，使用虚拟滚动只渲染可见区域</p>
                      <p><strong>4. Web Worker：</strong>语法高亮计算在 Worker 中进行，避免阻塞主线程</p>
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
                    面试官：如果 AI 返回的代码块格式不标准怎么办？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p>需要做兼容处理：</p>
                      <ul className="list-disc ml-5 space-y-1">
                        <li><strong>模糊匹配：</strong>支持 <code>`​``js</code>、<code>`​``javascript</code>、<code>`​``JavaScript</code> 等变体</li>
                        <li><strong>自动检测：</strong>没有语言标识时，通过关键词自动识别（如检测到 function 判断为 JS）</li>
                        <li><strong>容错机制：</strong>代码块未闭合时，显示加载状态或提示</li>
                        <li><strong>降级方案：</strong>无法识别时，显示为纯文本代码块</li>
                      </ul>
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
                Q1: Prism.js 和 highlight.js 有什么区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>Prism.js：</strong></p>
                <ul className="list-disc ml-5">
                  <li>更轻量（~2KB gzipped）</li>
                  <li>支持按需加载语言包</li>
                  <li>主题丰富，易于定制</li>
                  <li>适合前端项目</li>
                </ul>
                <p><strong>highlight.js：</strong></p>
                <ul className="list-disc ml-5">
                  <li>自动语言检测</li>
                  <li>支持更多语言（190+）</li>
                  <li>适合后端渲染</li>
                </ul>
                <p className="text-purple-700">💡 <strong>推荐：</strong>React 项目用 react-syntax-highlighter，它同时支持两者。</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 为什么不用 dangerouslySetInnerHTML？有安全风险吗？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>确实有 XSS 风险：</strong></p>
                <ul className="list-disc ml-5">
                  <li>如果 AI 返回恶意脚本（如 <code>&lt;script&gt;alert(1)&lt;/script&gt;</code>），会被执行</li>
                </ul>
                <p><strong>安全措施：</strong></p>
                <ol className="list-decimal ml-5">
                  <li>使用 <strong>DOMPurify</strong> 库清理 HTML</li>
                  <li>只高亮代码块，不高亮普通文本</li>
                  <li>转义特殊字符：<code>&lt;</code> → <code>&amp;lt;</code></li>
                  <li>Content-Security-Policy 设置</li>
                </ol>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">
{`import DOMPurify from 'dompurify';

const safeHTML = DOMPurify.sanitize(highlightedCode);
<div dangerouslySetInnerHTML={{ __html: safeHTML }} />`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 流式渲染会导致代码块重复渲染吗？如何优化？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>问题：</strong>每次追加文本都重新解析，性能差</p>
                <p><strong>优化方案：</strong></p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li><strong>增量解析：</strong>只解析新增的部分，不重新解析已完成的代码块</li>
                  <li><strong>React.memo：</strong>对已完成的代码块使用 memo 缓存</li>
                  <li><strong>虚拟滚动：</strong>长对话只渲染可见部分</li>
                  <li><strong>节流更新：</strong>不是每个字符都触发更新，而是批量更新</li>
                </ol>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto mt-2">
{`const CodeBlock = React.memo(({ code, language }) => {
  // 只有 code 变化才重新渲染
  return <HighlightedCode code={code} language={language} />;
});`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 阶跃星辰的 AI 产品中，你会怎么实现这个功能？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>完整方案：</strong></p>
                <div className="bg-blue-50 p-3 rounded">
                  <p><strong>1. 技术选型</strong></p>
                  <ul className="list-disc ml-5 text-xs">
                    <li>使用 <code>react-markdown</code> + <code>remark-gfm</code> 解析 Markdown</li>
                    <li>使用 <code>react-syntax-highlighter</code> 进行语法高亮</li>
                    <li>主题选择 VS Code Dark（符合开发者习惯）</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-3 rounded mt-2">
                  <p><strong>2. 性能优化</strong></p>
                  <ul className="list-disc ml-5 text-xs">
                    <li>按需加载语言包（只加载常用的 10 种语言）</li>
                    <li>代码块懒加载（Intersection Observer）</li>
                    <li>使用 Web Worker 处理大型代码块高亮</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-3 rounded mt-2">
                  <p><strong>3. 用户体验</strong></p>
                  <ul className="list-disc ml-5 text-xs">
                    <li>添加复制按钮（一键复制代码）</li>
                    <li>支持代码折叠（长代码自动折叠）</li>
                    <li>语言标识 + 行号显示</li>
                    <li>代码 diff 对比（修改建议场景）</li>
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* 追问场景 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-3">🔥 可能的追问</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div>
              <strong>追问 1：</strong>如果代码块特别大（10000 行），怎么处理？
              <p className="ml-4 text-xs text-gray-700">→ 虚拟滚动 + 按需高亮 + 分片渲染</p>
            </div>
            <div>
              <strong>追问 2：</strong>如何支持代码编辑功能？
              <p className="ml-4 text-xs text-gray-700">→ 使用 Monaco Editor（VS Code 内核）</p>
            </div>
            <div>
              <strong>追问 3：</strong>如何处理多语言混合的代码块？
              <p className="ml-4 text-xs text-gray-700">→ 按语言标识分别高亮，或使用 highlight.js 自动检测</p>
            </div>
            <div>
              <strong>追问 4：</strong>移动端如何优化代码展示？
              <p className="ml-4 text-xs text-gray-700">→ 横向滚动 + 字体缩放 + 精简主题</p>
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
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-semibold">第四层：应用场景</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-indigo-200 text-indigo-900 rounded text-xs font-semibold">AI 产品开发</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-indigo-300 text-indigo-950 rounded text-xs font-semibold">流式代码高亮</span>
                </div>
                <p className="text-gray-600 mt-2">
                  流式代码高亮是 AI 编程助手的核心展示功能，属于<strong>应用层</strong>的关键特性。
                  它结合了 SSE 流式传输、语法解析、实时渲染等技术，是 AI 代码生成产品的必备能力。
                </p>
              </div>
            </div>

            {/* 技术栈关联 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">🔧 技术栈关联</h4>
              <div className="grid grid-cols-3 gap-4">
                {/* 底层技术 */}
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs font-semibold text-blue-900 mb-2">⬇️ 底层技术</div>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• SSE 流式传输</li>
                    <li>• 正则表达式解析</li>
                    <li>• React 增量渲染</li>
                    <li>• Prism.js / highlight.js</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 需要掌握的基础</p>
                </div>

                {/* 协同功能 */}
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 协同功能</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• 流式 Markdown</li>
                    <li>• 停止生成</li>
                    <li>• 代码复制</li>
                    <li>• 主题切换</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 配合使用的功能</p>
                </div>

                {/* 产品价值 */}
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬆️ 产品价值</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• 提升用户体验</li>
                    <li>• 实时反馈</li>
                    <li>• 专业视觉效果</li>
                    <li>• 增强可读性</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 对用户的价值</p>
                </div>
              </div>
            </div>

            {/* 实现路径 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">🛤️ 实现路径建议</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">1️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">基础实现：正则匹配 + 语法高亮</strong>
                    <p className="text-xs text-gray-600">识别 Markdown 代码块，使用 Prism.js 高亮</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">优化体验：流式渲染</strong>
                    <p className="text-xs text-gray-600">边接收边渲染，处理代码块边界问题</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">性能优化：React.memo + 防抖</strong>
                    <p className="text-xs text-gray-600">避免频繁重新渲染，节流更新频率</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">生产级：多语言 + 主题 + 复制</strong>
                    <p className="text-xs text-gray-600">支持 30+ 语言、多主题切换、一键复制代码</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI 公司面试重要性 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">⭐ AI 公司面试重要性</h4>
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
                  <p className="text-xs text-gray-600">AI 编程助手产品必考</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">业务相关度：</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className="text-purple-500">💜</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">代码生成场景核心功能</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-purple-50 rounded">
                <p className="text-xs text-purple-800">
                  <strong>💡 面试建议：</strong>能讲清楚流式渲染原理、语法高亮方案、性能优化策略，最好有实际项目经验。
                </p>
              </div>
            </div>

            {/* 实现难度评估 */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">📊 实现难度评估</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>技术难度</span>
                    <span className="text-indigo-600 font-semibold">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要处理语法解析、流式边界、增量渲染</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>业务复杂度</span>
                    <span className="text-purple-600 font-semibold">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要考虑多语言支持、主题切换、用户体验</p>
                </div>
              </div>
            </div>

            {/* 查看完整体系 */}
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg text-center">
              <p className="text-sm text-indigo-900 mb-2">
                想了解完整的 AI 前端开发体系？
              </p>
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

      {/* 内联样式 */}
      <style jsx>{`
        :global(.keyword) {
          color: #c678dd;
          font-weight: 600;
        }
        :global(.string) {
          color: #98c379;
        }
        :global(.comment) {
          color: #5c6370;
          font-style: italic;
        }
      `}</style>
    </DemoContainer>
  );
}
