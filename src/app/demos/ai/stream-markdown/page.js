'use client';

import { useState, useRef, useEffect } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function StreamMarkdownDemo() {
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [speed, setSpeed] = useState(30);
  const streamIndexRef = useRef(0);
  const intervalRef = useRef(null);

  // ===== 模拟 AI 返回的 Markdown 文本 =====
  const mockMarkdownText = `# AI 生成内容示例

这是一个**流式 Markdown 渲染**的演示。

## 核心特性

### 1. 标题渲染
支持 H1-H6 各级标题，实时渲染。

### 2. 文本格式化
- **粗体文本**
- *斜体文本*
- ~~删除线~~
- \`行内代码\`

### 3. 列表支持

**无序列表：**
- 第一项
- 第二项
  - 嵌套项 2.1
  - 嵌套项 2.2
- 第三项

**有序列表：**
1. 首先做这个
2. 然后做那个
3. 最后完成

### 4. 代码块

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

\`\`\`python
def hello_world():
    print("Hello, World!")
    return True

if __name__ == "__main__":
    hello_world()
\`\`\`

### 5. 引用块

> 这是一段引用文本。
> 可以跨越多行。
>
> 甚至可以有段落。

### 6. 链接和图片

访问 [阶跃星辰官网](https://stepfun.com) 了解更多。

### 7. 表格

| 模型 | 参数量 | 特点 |
|------|--------|------|
| Step-1 | 万亿 | 强大推理 |
| Step-2 | - | 多模态 |

### 8. 任务列表

- [x] 完成需求分析
- [x] 实现核心功能
- [ ] 编写测试用例
- [ ] 部署上线

---

## 技术实现要点

1. **增量解析**：只解析新增的部分
2. **状态保持**：记录当前解析状态
3. **边界处理**：处理跨 chunk 的标签
4. **性能优化**：避免重复渲染

**总结：**流式 Markdown 渲染是 AI 产品的核心体验之一！`;

  // ===== 核心：增量 Markdown 解析器 =====
  const parseMarkdown = (text) => {
    let html = text;

    // 1. 代码块（优先处理，避免内部语法被解析）
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="code-block"><div class="code-lang">${lang || 'plaintext'}</div><code>${escapeHtml(code.trim())}</code></pre>`;
    });

    // 2. 行内代码
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // 3. 标题
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // 4. 粗体、斜体、删除线
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    // 5. 链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="markdown-link">$1</a>');

    // 6. 无序列表
    html = html.replace(/^[\s]*[-*] (.+)$/gim, '<li class="list-item">$1</li>');
    html = html.replace(/(<li class="list-item">.*<\/li>)/s, '<ul class="list-ul">$1</ul>');

    // 7. 有序列表
    html = html.replace(/^\d+\. (.+)$/gim, '<li class="list-item-ordered">$1</li>');
    html = html.replace(/(<li class="list-item-ordered">.*<\/li>)/s, '<ol class="list-ol">$1</ol>');

    // 8. 引用块
    html = html.replace(/^> (.+)$/gim, '<blockquote class="quote">$1</blockquote>');

    // 9. 分隔线
    html = html.replace(/^---$/gm, '<hr class="divider" />');

    // 10. 任务列表
    html = html.replace(/^- \[x\] (.+)$/gim, '<div class="task-item"><input type="checkbox" checked disabled /> <span>$1</span></div>');
    html = html.replace(/^- \[ \] (.+)$/gim, '<div class="task-item"><input type="checkbox" disabled /> <span>$1</span></div>');

    // 11. 表格
    html = html.replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(Boolean).map(cell => cell.trim());
      return '<tr>' + cells.map(cell => {
        if (cell.match(/^-+$/)) return ''; // 跳过分隔行
        return `<td>${cell}</td>`;
      }).join('') + '</tr>';
    });
    html = html.replace(/(<tr>.*<\/tr>)/s, '<table class="markdown-table"><tbody>$1</tbody></table>');

    // 12. 段落（最后处理）
    html = html.replace(/^(?!<[^>]+>)(.+)$/gim, '<p>$1</p>');

    return html;
  };

  const escapeHtml = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  };

  // ===== 流式渲染控制 =====
  const startStreaming = () => {
    setStreamedText('');
    setIsStreaming(true);
    streamIndexRef.current = 0;

    intervalRef.current = setInterval(() => {
      if (streamIndexRef.current < mockMarkdownText.length) {
        // 每次追加 3-5 个字符（模拟真实流式）
        const chunkSize = Math.floor(Math.random() * 3) + 3;
        const nextIndex = Math.min(streamIndexRef.current + chunkSize, mockMarkdownText.length);
        setStreamedText(mockMarkdownText.slice(0, nextIndex));
        streamIndexRef.current = nextIndex;
      } else {
        clearInterval(intervalRef.current);
        setIsStreaming(false);
      }
    }, speed);
  };

  const stopStreaming = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsStreaming(false);
    }
  };

  const reset = () => {
    stopStreaming();
    setStreamedText('');
    streamIndexRef.current = 0;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const parsedHtml = parseMarkdown(streamedText);

  return (
    <DemoContainer
      title="流式 Markdown 渲染"
      description="AI 生成内容的实时 Markdown 格式化展示"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📚 核心技术要点</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">增量解析</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 每次只解析新增文本</li>
                <li>• 避免全量重新解析</li>
                <li>• 提升渲染性能</li>
                <li>• 减少 CPU 占用</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">边界处理</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 跨 chunk 的标签</li>
                <li>• 不完整的代码块</li>
                <li>• 未闭合的格式</li>
                <li>• 缓冲区机制</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-900 mb-2">性能优化</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 虚拟 DOM diff</li>
                <li>• 节流渲染</li>
                <li>• 懒加载图片</li>
                <li>• Web Worker 解析</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={startStreaming}
              disabled={isStreaming}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
            >
              {isStreaming ? '生成中...' : '开始流式生成'}
            </button>
            <button
              onClick={stopStreaming}
              disabled={!isStreaming}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
            >
              停止
            </button>
            <button
              onClick={reset}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
            >
              重置
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">速度:</label>
              <input
                type="range"
                min="10"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-32"
                disabled={isStreaming}
              />
              <span className="text-sm text-gray-600 w-16">{speed}ms</span>
            </div>
          </div>

          <div className="text-xs text-gray-600">
            进度: {streamIndexRef.current} / {mockMarkdownText.length} 字符
            ({((streamIndexRef.current / mockMarkdownText.length) * 100).toFixed(1)}%)
          </div>
        </div>

        {/* 双栏对比 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 原始 Markdown */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>📝 原始 Markdown</span>
              {isStreaming && <span className="animate-pulse text-indigo-600">生成中...</span>}
            </h3>
            <div className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-lg h-[600px] overflow-y-auto whitespace-pre-wrap">
              {streamedText}
              {isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-green-400 animate-pulse" />}
            </div>
          </div>

          {/* 渲染结果 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">🎨 渲染结果</h3>
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 h-[600px] overflow-y-auto markdown-content">
              <div dangerouslySetInnerHTML={{ __html: parsedHtml }} />
              {isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-indigo-600 animate-pulse" />}
            </div>
          </div>
        </div>

        {/* 核心代码 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💻 核心实现代码</h4>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-blue-800 hover:text-blue-900 font-medium">
              点击查看 Markdown 解析器实现
            </summary>
            <div className="mt-3 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs">
{`const parseMarkdown = (text) => {
  let html = text;

  // 1. 代码块（优先处理，避免内部语法被解析）
  html = html.replace(/\`\`\`(\\w+)?\\n([\\s\\S]*?)\`\`\`/g, (match, lang, code) => {
    return \`<pre><code class="language-\${lang}">\${escapeHtml(code)}</code></pre>\`;
  });

  // 2. 行内代码
  html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');

  // 3. 标题 (H1-H3)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 4. 粗体、斜体
  html = html.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>');
  html = html.replace(/\\*([^*]+)\\*/g, '<em>$1</em>');

  // 5. 链接
  html = html.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2">$1</a>');

  // 6. 列表
  html = html.replace(/^[\\s]*[-*] (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\\/li>)/s, '<ul>$1</ul>');

  return html;
};

// 流式渲染
const [streamedText, setStreamedText] = useState('');

// 逐字追加
setInterval(() => {
  setStreamedText(prev => prev + nextChunk);
}, 50);

// 实时解析
const parsedHtml = parseMarkdown(streamedText);`}
              </pre>
            </div>
          </details>
        </div>

        {/* 实际项目建议 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-3">🚀 实际项目建议</h4>
          <div className="space-y-3 text-sm text-yellow-800">
            <div>
              <strong>1. 使用成熟的 Markdown 库</strong>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
>
  {streamedText}
</ReactMarkdown>`}
              </pre>
            </div>
            <div>
              <strong>2. 增量渲染优化</strong>
              <ul className="list-disc ml-5 text-xs mt-1">
                <li>只渲染变化的部分（React.memo + key 优化）</li>
                <li>使用虚拟滚动处理长文档</li>
                <li>节流更新频率（100-200ms 批量刷新）</li>
                <li>代码高亮懒加载（Intersection Observer）</li>
              </ul>
            </div>
            <div>
              <strong>3. 边界情况处理</strong>
              <ul className="list-disc ml-5 text-xs mt-1">
                <li>代码块跨 chunk：缓冲未闭合的 ```</li>
                <li>表格跨 chunk：缓冲不完整的行</li>
                <li>链接跨 chunk：识别 [text]( 模式</li>
              </ul>
            </div>
            <div>
              <strong>4. 安全性</strong>
              <ul className="list-disc ml-5 text-xs mt-1">
                <li>使用 DOMPurify 清理 HTML</li>
                <li>限制允许的标签和属性</li>
                <li>CSP 策略防止 XSS</li>
              </ul>
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
                    面试官：流式 Markdown 渲染的核心难点是什么？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>三个核心难点：</strong></p>
                      <ol className="list-decimal ml-5 space-y-2 text-xs">
                        <li>
                          <strong>边界处理：</strong>Markdown 语法可能跨多个 chunk
                          <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1">
                            <code>
{`chunk1: "\`\`\`javascri"
chunk2: "pt\\ncode\\n\`\`\`"
// 需要缓冲，等待完整的代码块`}
                            </code>
                          </pre>
                        </li>
                        <li>
                          <strong>性能优化：</strong>每次追加都重新解析，CPU 占用高
                          <p className="ml-4">解决：增量解析 + 节流更新 + React.memo</p>
                        </li>
                        <li>
                          <strong>视觉连贯性：</strong>避免布局跳动和闪烁
                          <p className="ml-4">解决：预留空间 + 骨架屏 + CSS transition</p>
                        </li>
                      </ol>
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
                    面试官：如何处理代码块跨 chunk 的情况？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 实现思路：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>状态机方案：</strong></p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`const [parseState, setParseState] = useState({
  inCodeBlock: false,
  codeBlockLang: '',
  codeBlockContent: '',
  buffer: ''
});

function processChunk(chunk) {
  let text = parseState.buffer + chunk;
  
  // 检查是否开始代码块
  if (text.includes('\`\`\`')) {
    const match = text.match(/\`\`\`(\\w+)?\\n/);
    if (match) {
      setParseState({
        ...parseState,
        inCodeBlock: true,
        codeBlockLang: match[1] || 'plaintext'
      });
    }
  }
  
  // 检查是否结束代码块
  if (parseState.inCodeBlock && text.includes('\`\`\`')) {
    setParseState({
      ...parseState,
      inCodeBlock: false,
      buffer: ''
    });
  } else {
    // 保存到缓冲区
    setParseState({
      ...parseState,
      buffer: text
    });
  }
}`}
                      </pre>
                      <p className="text-purple-700 text-xs mt-2">
                        💡 <strong>关键：</strong>维护解析状态，缓冲不完整的语法块
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
                    面试官：如何优化大段文本的渲染性能？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 多层优化方案：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="font-semibold text-blue-900 text-xs">1. 节流更新（减少渲染次数）</p>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`let buffer = '';
const flushInterval = setInterval(() => {
  if (buffer) {
    setStreamedText(prev => prev + buffer);
    buffer = '';
  }
}, 100); // 每 100ms 批量更新`}
                        </pre>
                      </div>
                      <div className="bg-green-50 p-3 rounded mt-2">
                        <p className="font-semibold text-green-900 text-xs">2. 虚拟滚动（只渲染可见部分）</p>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`<VirtualList
  items={paragraphs}
  renderItem={(p) => <Markdown>{p}</Markdown>}
  height={600}
/>`}
                        </pre>
                      </div>
                      <div className="bg-purple-50 p-3 rounded mt-2">
                        <p className="font-semibold text-purple-900 text-xs">3. Web Worker 解析（不阻塞主线程）</p>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`const worker = new Worker('/markdown-worker.js');
worker.postMessage({ text: streamedText });
worker.onmessage = (e) => {
  setRenderedHtml(e.data.html);
};`}
                        </pre>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded mt-2">
                        <p className="font-semibold text-yellow-900 text-xs">4. React.memo 缓存（避免重复渲染）</p>
                        <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`const MarkdownBlock = React.memo(({ content }) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
});`}
                        </pre>
                      </div>
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
                    面试官：阶跃星辰的 AI 产品中，你会怎么实现这个功能？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 完整方案：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>技术栈选择：</strong></p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`// 1. Markdown 解析
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';

// 2. 组件封装
const StreamingMarkdown = ({ text, isStreaming }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypePrism]}
      components={{
        code: CodeBlock,  // 自定义代码块组件
        a: LinkComponent, // 自定义链接组件
      }}
    >
      {text}
      {isStreaming && <Cursor />}
    </ReactMarkdown>
  );
};`}
                      </pre>
                      <p><strong>流式接收处理：</strong></p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  buffer += decoder.decode(value, { stream: true });
  
  // 批量更新，避免频繁渲染
  if (buffer.length > 50 || Date.now() - lastUpdate > 100) {
    setStreamedText(prev => prev + buffer);
    buffer = '';
    lastUpdate = Date.now();
  }
}`}
                      </pre>
                      <p className="text-purple-700 text-xs mt-2">
                        💡 <strong>关键：</strong>成熟库 + 批量更新 + 自定义组件增强
                      </p>
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
                Q1: React-Markdown 和手写解析器各有什么优缺点？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-semibold text-blue-900 text-xs">React-Markdown</p>
                    <p className="text-xs mt-1"><strong>优点：</strong></p>
                    <ul className="list-disc ml-5 text-xs">
                      <li>功能完整，支持 GFM</li>
                      <li>插件生态丰富</li>
                      <li>安全性好（XSS 防护）</li>
                      <li>维护成本低</li>
                    </ul>
                    <p className="text-xs mt-2"><strong>缺点：</strong></p>
                    <ul className="list-disc ml-5 text-xs">
                      <li>包体积较大（~50KB）</li>
                      <li>性能开销较高</li>
                      <li>定制化受限</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-semibold text-green-900 text-xs">手写解析器</p>
                    <p className="text-xs mt-1"><strong>优点：</strong></p>
                    <ul className="list-disc ml-5 text-xs">
                      <li>体积小，性能好</li>
                      <li>完全可控</li>
                      <li>针对性优化</li>
                      <li>按需实现功能</li>
                    </ul>
                    <p className="text-xs mt-2"><strong>缺点：</strong></p>
                    <ul className="list-disc ml-5 text-xs">
                      <li>开发成本高</li>
                      <li>功能不完整</li>
                      <li>安全性需自行保证</li>
                      <li>维护成本高</li>
                    </ul>
                  </div>
                </div>
                <p className="text-purple-700 text-xs mt-2">
                  💡 <strong>建议：</strong>生产环境用成熟库，面试/Demo 可手写展示理解
                </p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 如何防止 Markdown 中的 XSS 攻击？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>多层防护：</strong></p>
                <ol className="list-decimal ml-5 text-xs space-y-2">
                  <li>
                    <strong>使用 DOMPurify 清理 HTML：</strong>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1">
{`import DOMPurify from 'dompurify';

const cleanHtml = DOMPurify.sanitize(html, {
  ALLOWED_TAGS: ['p', 'a', 'strong', 'em', 'code', 'pre'],
  ALLOWED_ATTR: ['href', 'target']
});`}
                    </pre>
                  </li>
                  <li>
                    <strong>禁用危险的 Markdown 特性：</strong>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1">
{`<ReactMarkdown
  disallowedElements={['script', 'iframe', 'object']}
  unwrapDisallowed={true}
>
  {text}
</ReactMarkdown>`}
                    </pre>
                  </li>
                  <li>
                    <strong>设置 CSP 策略：</strong>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded mt-1">
{`<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'none';">`}
                    </pre>
                  </li>
                </ol>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 如何支持 LaTeX 数学公式？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>使用 KaTeX 或 MathJax：</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`// 1. 安装依赖
npm install remark-math rehype-katex katex

// 2. 配置插件
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

<ReactMarkdown
  remarkPlugins={[remarkMath]}
  rehypePlugins={[rehypeKatex]}
>
  {text}
</ReactMarkdown>

// 3. Markdown 中使用
行内公式: $E = mc^2$
块级公式:
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$`}
                </pre>
                <p className="text-purple-700 text-xs mt-2">
                  💡 <strong>阶跃星辰 Step 模型：</strong>支持数学推理，LaTeX 渲染是必备功能
                </p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 如何实现 Markdown 编辑器的实时预览？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>双栏同步滚动方案：</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`const MarkdownEditor = () => {
  const [text, setText] = useState('');
  const editorRef = useRef();
  const previewRef = useRef();

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercent = scrollTop / (scrollHeight - clientHeight);
    
    // 同步滚动预览区
    const preview = previewRef.current;
    const targetScroll = scrollPercent * 
      (preview.scrollHeight - preview.clientHeight);
    preview.scrollTop = targetScroll;
  };

  return (
    <div className="grid grid-cols-2">
      <textarea
        ref={editorRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onScroll={handleScroll}
      />
      <div ref={previewRef}>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
};`}
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
              <strong>追问 1：</strong>如何处理超长代码块的性能问题？
              <p className="ml-4 text-xs text-gray-700">→ 虚拟滚动 + 懒加载高亮 + 折叠功能</p>
            </div>
            <div>
              <strong>追问 2：</strong>Markdown 表格跨 chunk 怎么处理？
              <p className="ml-4 text-xs text-gray-700">→ 缓冲不完整的行，检测 | 符号判断表格边界</p>
            </div>
            <div>
              <strong>追问 3：</strong>如何支持自定义 Markdown 语法？
              <p className="ml-4 text-xs text-gray-700">→ 编写 remark/rehype 插件，或自定义 components</p>
            </div>
            <div>
              <strong>追问 4：</strong>移动端如何优化 Markdown 渲染？
              <p className="ml-4 text-xs text-gray-700">→ 简化样式、懒加载图片、代码块横向滚动</p>
            </div>
          </div>
        </div>
      </div>

      {/* 内联样式 */}
      <style jsx global>{`
        .markdown-content h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #1a202c;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }
        .markdown-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: #2d3748;
        }
        .markdown-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #4a5568;
        }
        .markdown-content p {
          margin-bottom: 1rem;
          line-height: 1.6;
          color: #4a5568;
        }
        .markdown-content strong {
          font-weight: 700;
          color: #2d3748;
        }
        .markdown-content em {
          font-style: italic;
          color: #4a5568;
        }
        .markdown-content del {
          text-decoration: line-through;
          color: #718096;
        }
        .markdown-content .inline-code {
          background: #edf2f7;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          color: #c53030;
        }
        .markdown-content .code-block {
          background: #1a202c;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
          overflow-x: auto;
        }
        .markdown-content .code-lang {
          color: #a0aec0;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .markdown-content .code-block code {
          color: #e2e8f0;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .markdown-content .list-ul,
        .markdown-content .list-ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-content .list-item,
        .markdown-content .list-item-ordered {
          margin-bottom: 0.5rem;
          color: #4a5568;
        }
        .markdown-content .quote {
          border-left: 4px solid #4299e1;
          padding-left: 1rem;
          color: #4a5568;
          font-style: italic;
          margin: 1rem 0;
        }
        .markdown-content .divider {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 1.5rem 0;
        }
        .markdown-content .markdown-link {
          color: #4299e1;
          text-decoration: underline;
        }
        .markdown-content .markdown-link:hover {
          color: #2b6cb0;
        }
        .markdown-content .task-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .markdown-content .markdown-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        .markdown-content .markdown-table td {
          border: 1px solid #e2e8f0;
          padding: 0.5rem;
          color: #4a5568;
        }
      `}</style>

      {/* 思维体系定位 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6 mt-6">
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
                <span className="px-2 py-1 bg-indigo-300 text-indigo-950 rounded text-xs font-semibold">流式 Markdown</span>
              </div>
              <p className="text-gray-600 mt-2">
                流式 Markdown 渲染是 AI 对话展示的核心技术，属于<strong>应用层</strong>的关键特性。
                它需要处理增量解析、边界问题、实时渲染等复杂场景，是 AI 产品体验的基石。
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
                  <li>• Markdown 解析</li>
                  <li>• 增量渲染</li>
                  <li>• React 状态管理</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2">💡 实时渲染核心</p>
              </div>

              {/* 协同功能 */}
              <div className="bg-purple-50 p-3 rounded">
                <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 协同功能</div>
                <ul className="text-xs text-purple-800 space-y-1">
                  <li>• 代码高亮</li>
                  <li>• LaTeX 渲染</li>
                  <li>• 表格解析</li>
                  <li>• 任务列表</li>
                </ul>
                <p className="text-xs text-purple-600 mt-2">💡 富文本展示</p>
              </div>

              {/* 产品价值 */}
              <div className="bg-green-50 p-3 rounded">
                <div className="text-xs font-semibold text-green-900 mb-2">⬆️ 产品价值</div>
                <ul className="text-xs text-green-800 space-y-1">
                  <li>• 实时反馈</li>
                  <li>• 专业展示</li>
                  <li>• 阅读体验</li>
                  <li>• 格式化输出</li>
                </ul>
                <p className="text-xs text-green-600 mt-2">💡 提升内容质量</p>
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
                  <strong className="text-sm">基础实现：Markdown 解析</strong>
                  <p className="text-xs text-gray-600">使用 marked 或 markdown-it 解析 Markdown 语法</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">2️⃣</span>
                <div className="flex-1">
                  <strong className="text-sm">优化体验：增量渲染</strong>
                  <p className="text-xs text-gray-600">边接收边解析，处理代码块、表格等边界情况</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">3️⃣</span>
                <div className="flex-1">
                  <strong className="text-sm">性能优化：React.memo + 虚拟滚动</strong>
                  <p className="text-xs text-gray-600">避免频繁重渲染，长文档使用虚拟滚动</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">4️⃣</span>
                <div className="flex-1">
                  <strong className="text-sm">生产级：安全 + 扩展</strong>
                  <p className="text-xs text-gray-600">XSS 防护、自定义组件、插件系统</p>
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
                <p className="text-xs text-gray-600">AI 内容展示核心技术</p>
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
                <p className="text-xs text-gray-600">内容质量决定性技术</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-purple-50 rounded">
              <p className="text-xs text-purple-800">
                <strong>💡 面试建议：</strong>能讲清楚增量解析原理、边界处理方案、性能优化策略、XSS 防护措施。
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
                  <span className="text-indigo-600 font-semibold">80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">需要处理增量解析、边界情况、性能优化</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>业务复杂度</span>
                  <span className="text-purple-600 font-semibold">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">需要考虑多种格式、布局稳定性、用户体验</p>
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
    </DemoContainer>
  );
}
