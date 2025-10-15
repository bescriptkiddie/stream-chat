'use client';

import { useState, useRef } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function AbortGenerationDemo() {
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState([]);
  const abortControllerRef = useRef(null);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  // ===== 核心知识点 1: 创建 AbortController =====
  const startGeneration = async () => {
    setOutput('');
    setIsGenerating(true);
    addLog('开始生成内容', 'success');

    // 创建 AbortController 实例
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      // ===== 核心知识点 2: 将 signal 传递给 fetch =====
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Generate a long article' }),
        signal // 关键：传递 signal
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      // ===== 核心知识点 3: 读取流式响应 =====
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          addLog('生成完成', 'success');
          setIsGenerating(false);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        setOutput(prev => prev + chunk);
      }
    } catch (error) {
      // ===== 核心知识点 4: 处理取消错误 =====
      if (error.name === 'AbortError') {
        addLog('用户主动停止生成', 'warning');
      } else {
        addLog(`错误: ${error.message}`, 'error');
      }
      setIsGenerating(false);
    }
  };

  // ===== 核心知识点 5: 调用 abort() 方法 =====
  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      addLog('发送停止信号', 'warning');
      setIsGenerating(false);
    }
  };

  // 模拟流式生成（因为没有真实 API）
  const simulateGeneration = () => {
    setOutput('');
    setIsGenerating(true);
    addLog('开始模拟生成', 'success');

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const text = `这是一个模拟的 AI 生成内容。

在实际项目中，我们需要处理以下场景：
1. 用户可能在生成过程中想要停止
2. 网络请求可能需要被取消
3. 流式响应需要优雅地中断

AbortController 提供了标准的取消机制：
- 创建 AbortController 实例
- 将 signal 传递给 fetch
- 调用 abort() 方法取消请求
- 捕获 AbortError 处理取消逻辑

这在 AI 对话产品中非常重要，因为：
• 用户体验：允许用户随时停止不需要的生成
• 资源节约：避免浪费 API 调用和 Token
• 成本控制：及时停止可以节省费用

实际应用场景：
- ChatGPT 的停止生成按钮
- 阶跃星辰 AI 的中断功能
- Claude 的取消响应按钮

技术细节：
1. AbortController 是浏览器原生 API
2. 支持取消 fetch、addEventListener 等
3. 可以在 React 中配合 useEffect cleanup 使用
4. 多个请求可以共享同一个 signal

代码示例见下方...`;

    let index = 0;
    const interval = setInterval(() => {
      // ===== 核心知识点 6: 检查是否已取消 =====
      if (signal.aborted) {
        clearInterval(interval);
        addLog('检测到取消信号，停止生成', 'warning');
        return;
      }

      if (index < text.length) {
        const chunk = text.slice(index, index + 5);
        setOutput(prev => prev + chunk);
        index += 5;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        addLog('模拟生成完成', 'success');
      }
    }, 50);
  };

  const clearAll = () => {
    setOutput('');
    setLogs([]);
    setIsGenerating(false);
  };

  return (
    <DemoContainer
      title="停止生成功能"
      description="使用 AbortController 实现 AI 流式生成的优雅中断"
    >
      <div className="space-y-6">
        {/* 控制面板 */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
          <button
            onClick={simulateGeneration}
            disabled={isGenerating}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
          >
            {isGenerating ? '生成中...' : '开始生成'}
          </button>
          
          <button
            onClick={stopGeneration}
            disabled={!isGenerating}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium flex items-center gap-2"
          >
            <span className={isGenerating ? 'animate-pulse' : ''}>⏹</span>
            停止生成
          </button>

          <button
            onClick={clearAll}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
          >
            清空
          </button>

          <div className="flex-1" />

          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>正在生成中...</span>
            </div>
          )}
        </div>

        {/* 输出展示区 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 生成内容 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">生成内容</h3>
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 h-96 overflow-y-auto">
              {output ? (
                <div className="whitespace-pre-wrap text-gray-800">
                  {output}
                  {isGenerating && (
                    <span className="inline-block w-2 h-4 ml-1 bg-indigo-600 animate-pulse" />
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  点击"开始生成"查看效果
                </div>
              )}
            </div>
          </div>

          {/* 日志 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">执行日志</h3>
            <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">等待操作...</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="mb-1">
                    <span className="text-gray-500">[{log.time}]</span>
                    <span className={
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'warning' ? 'text-yellow-400' :
                      log.type === 'error' ? 'text-red-400' :
                      'text-gray-400'
                    }> {log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 核心代码实现 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💡 核心代码实现</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`// 1. 创建 AbortController
const abortController = new AbortController();
const { signal } = abortController;

// 2. 传递 signal 给 fetch
const response = await fetch('/api/generate', {
  method: 'POST',
  signal // 关键！
});

// 3. 读取流式响应
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // 处理数据...
}

// 4. 停止按钮调用
function stopGeneration() {
  abortController.abort(); // 取消请求
}

// 5. 捕获取消错误
try {
  // ... fetch 逻辑
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('用户取消了请求');
  }
}`}
            </pre>
          </div>
        </div>

        {/* 技术要点 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">🎯 技术要点总结</h3>
          
          <div className="space-y-3 text-gray-800">
            <div className="flex gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <strong>创建 AbortController</strong>
                <p className="text-sm text-gray-600">每个请求创建一个新实例，获取 signal 对象</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <strong>传递 signal</strong>
                <p className="text-sm text-gray-600">将 signal 作为 fetch 的选项传递</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <strong>调用 abort()</strong>
                <p className="text-sm text-gray-600">用户点击停止按钮时，调用 abortController.abort()</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">4️⃣</span>
              <div>
                <strong>处理 AbortError</strong>
                <p className="text-sm text-gray-600">catch 块中判断 error.name === 'AbortError'</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">5️⃣</span>
              <div>
                <strong>检查 signal.aborted</strong>
                <p className="text-sm text-gray-600">在长时间操作中定期检查是否已取消</p>
              </div>
            </div>
          </div>
        </div>

        {/* 实际项目注意事项 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-2">⚠️ 实际项目注意事项</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• <strong>清理资源：</strong>abort 后要清理定时器、事件监听等</li>
            <li>• <strong>UI 反馈：</strong>给用户明确的停止提示</li>
            <li>• <strong>状态管理：</strong>正确更新 loading 状态，避免 UI 卡住</li>
            <li>• <strong>后端配合：</strong>后端也要支持连接关闭时停止生成</li>
            <li>• <strong>重复请求：</strong>停止后再次生成，要创建新的 AbortController</li>
          </ul>
        </div>

        {/* 浏览器兼容性 */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h4 className="font-semibold text-green-900 mb-2">✅ 浏览器兼容性</h4>
          <div className="text-sm text-green-800 space-y-2">
            <p><strong>AbortController 支持情况：</strong></p>
            <ul className="list-disc ml-5">
              <li>Chrome 66+</li>
              <li>Firefox 57+</li>
              <li>Safari 12.1+</li>
              <li>Edge 16+</li>
            </ul>
            <p className="mt-2"><strong>Polyfill：</strong>如需支持旧浏览器，可以使用 <code className="bg-gray-200 px-1 rounded">abortcontroller-polyfill</code></p>
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
                    面试官：你们项目中如何实现 AI 生成的停止功能？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p>我们使用 <strong>AbortController</strong> 实现，主要分 4 步：</p>
                      <ol className="list-decimal ml-5 space-y-1">
                        <li><strong>创建实例：</strong>每次发起生成请求时，创建新的 AbortController</li>
                        <li><strong>传递 signal：</strong>将 signal 传递给 fetch 请求</li>
                        <li><strong>用户停止：</strong>点击停止按钮时调用 abort() 方法</li>
                        <li><strong>错误处理：</strong>catch 中判断 AbortError，更新 UI 状态</li>
                      </ol>
                      <p className="mt-2">这样既能优雅地取消请求，又能节省 API 成本。</p>
                    </div>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mt-2">
                    <div className="font-semibold text-red-900 mb-2">❌ 差的回答：</div>
                    <div className="text-sm text-gray-800">
                      "就是加个停止按钮，点了就不显示了。"（没有取消请求，浪费资源）
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
                    面试官：如果用户快速点击"生成"和"停止"，会有什么问题？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 核心要点：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>问题：</strong>可能出现多个并发请求，状态混乱</p>
                      <p><strong>解决方案：</strong></p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`let currentController = null;

function startGeneration() {
  // 1. 先取消之前的请求
  if (currentController) {
    currentController.abort();
  }
  
  // 2. 创建新的 Controller
  currentController = new AbortController();
  
  // 3. 发起请求
  fetch('/api/generate', { 
    signal: currentController.signal 
  });
}

function stopGeneration() {
  if (currentController) {
    currentController.abort();
    currentController = null; // 清理引用
  }
}`}
                      </pre>
                      <p className="mt-2"><strong>关键：</strong>用变量保存当前 Controller，新请求前先取消旧请求</p>
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
                    面试官：停止生成后，后端还在计算怎么办？
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <div className="font-semibold text-green-900 mb-2">✅ 好的回答：</div>
                    <div className="text-sm text-gray-800 space-y-2">
                      <p><strong>前端层面：</strong></p>
                      <ul className="list-disc ml-5">
                        <li>AbortController 会关闭 HTTP 连接</li>
                        <li>SSE 连接中断，后端能检测到</li>
                      </ul>
                      <p><strong>后端层面：</strong></p>
                      <ul className="list-disc ml-5">
                        <li>监听客户端连接状态（如 Node.js 的 req.on('close')）</li>
                        <li>检测到断开后，停止 AI 生成任务</li>
                        <li>释放资源，取消 API 调用</li>
                      </ul>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// Node.js 后端示例
app.post('/api/generate', (req, res) => {
  let aborted = false;
  
  req.on('close', () => {
    aborted = true; // 客户端断开
    console.log('Client disconnected');
  });
  
  async function* generate() {
    for (let chunk of aiStream) {
      if (aborted) break; // 停止生成
      yield chunk;
    }
  }
});`}
                      </pre>
                      <p className="text-purple-700 mt-2">💡 <strong>关键：</strong>前后端配合，完整实现取消逻辑</p>
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
                Q1: AbortController 和 setTimeout 取消有什么区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-semibold text-blue-900">AbortController</p>
                    <ul className="list-disc ml-5 text-xs mt-2">
                      <li>标准浏览器 API</li>
                      <li>可以取消 fetch、事件监听</li>
                      <li>支持多个操作共享 signal</li>
                      <li>有标准的错误处理</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-semibold text-green-900">clearTimeout</p>
                    <ul className="list-disc ml-5 text-xs mt-2">
                      <li>只能取消定时器</li>
                      <li>需要保存 timerId</li>
                      <li>不能取消网络请求</li>
                      <li>无错误对象</li>
                    </ul>
                  </div>
                </div>
                <p className="text-purple-700 mt-2">💡 <strong>推荐：</strong>网络请求用 AbortController，定时器用 clearTimeout</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 一个 signal 可以用于多个请求吗？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>可以！这是 signal 的强大之处</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`const controller = new AbortController();
const { signal } = controller;

// 多个请求共享同一个 signal
Promise.all([
  fetch('/api/user', { signal }),
  fetch('/api/posts', { signal }),
  fetch('/api/comments', { signal })
]);

// 一次取消，所有请求都停止
controller.abort();`}
                </pre>
                <p><strong>应用场景：</strong></p>
                <ul className="list-disc ml-5">
                  <li>页面切换时取消所有未完成的请求</li>
                  <li>组件卸载时清理所有异步操作</li>
                  <li>搜索功能，新搜索时取消所有旧请求</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: React 中如何配合 useEffect 使用？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>在 useEffect cleanup 中调用 abort：</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`useEffect(() => {
  const controller = new AbortController();
  
  async function fetchData() {
    try {
      const res = await fetch('/api/data', {
        signal: controller.signal
      });
      const data = await res.json();
      setData(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    }
  }
  
  fetchData();
  
  // cleanup: 组件卸载时取消请求
  return () => {
    controller.abort();
  };
}, []);`}
                </pre>
                <p className="text-purple-700 mt-2">💡 <strong>好处：</strong>避免内存泄漏，防止已卸载组件更新状态</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 阶跃星辰的产品中，停止生成功能还需要考虑什么？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>完整的用户体验方案：</strong></p>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold">1. UI 反馈</p>
                  <ul className="list-disc ml-5 text-xs">
                    <li>停止按钮明显，易于点击</li>
                    <li>停止后显示"已停止"提示</li>
                    <li>已生成的内容保留</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-3 rounded mt-2">
                  <p className="font-semibold">2. 成本统计</p>
                  <ul className="list-disc ml-5 text-xs">
                    <li>记录实际生成的 Token 数</li>
                    <li>停止时计算消耗</li>
                    <li>给用户展示节省的成本</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-3 rounded mt-2">
                  <p className="font-semibold">3. 会话管理</p>
                  <ul className="list-disc ml-5 text-xs">
                    <li>停止后的内容算作一轮对话</li>
                    <li>支持在停止的位置继续生成</li>
                    <li>保存停止时的上下文</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-3 rounded mt-2">
                  <p className="font-semibold">4. 错误处理</p>
                  <ul className="list-disc ml-5 text-xs">
                    <li>区分用户主动停止和网络错误</li>
                    <li>停止失败时的降级方案</li>
                    <li>连接断开的重连策略</li>
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
              <strong>追问 1：</strong>如果后端不支持中断，前端如何处理？
              <p className="ml-4 text-xs text-gray-700">→ 前端停止显示，后台静默继续，但不消耗用户注意力</p>
            </div>
            <div>
              <strong>追问 2：</strong>停止后能否恢复继续生成？
              <p className="ml-4 text-xs text-gray-700">→ 需要后端支持，传递之前的 context 和停止位置</p>
            </div>
            <div>
              <strong>追问 3：</strong>WebSocket 连接如何实现停止？
              <p className="ml-4 text-xs text-gray-700">→ 发送停止消息给后端，或直接关闭 WebSocket 连接</p>
            </div>
            <div>
              <strong>追问 4：</strong>停止功能如何做埋点统计？
              <p className="ml-4 text-xs text-gray-700">→ 记录停止时间、已生成字数、用户停止原因等</p>
            </div>
            <div>
              <strong>追问 5：</strong>移动端如何优化停止按钮的可用性？
              <p className="ml-4 text-xs text-gray-700">→ 悬浮按钮、手势滑动停止、震动反馈</p>
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
                  <span className="px-2 py-1 bg-indigo-300 text-indigo-950 rounded text-xs font-semibold">停止生成控制</span>
                </div>
                <p className="text-gray-600 mt-2">
                  停止生成是 AI 产品的核心用户体验功能，属于<strong>应用层</strong>的关键特性。
                  它涉及 AbortController、流中断、状态管理等技术，是用户掌控感的重要体现。
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
                    <li>• AbortController API</li>
                    <li>• EventSource 控制</li>
                    <li>• Promise 取消</li>
                    <li>• 状态管理</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 流控制核心</p>
                </div>

                {/* 协同功能 */}
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 协同功能</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• 流式对话</li>
                    <li>• 加载状态</li>
                    <li>• 错误处理</li>
                    <li>• 用户反馈</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 完整的交互体验</p>
                </div>

                {/* 产品价值 */}
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬆️ 产品价值</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• 用户掌控感</li>
                    <li>• 节省成本</li>
                    <li>• 提升体验</li>
                    <li>• 减少等待</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 用户体验关键</p>
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
                    <strong className="text-sm">基础实现：AbortController</strong>
                    <p className="text-xs text-gray-600">创建 AbortController，传递 signal 给 fetch/EventSource</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">优化体验：按钮状态管理</strong>
                    <p className="text-xs text-gray-600">根据生成状态动态显示/隐藏停止按钮，防止重复点击</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">性能优化：清理资源</strong>
                    <p className="text-xs text-gray-600">停止后及时关闭连接、清理监听器、释放内存</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">生产级：错误处理 + 埋点</strong>
                    <p className="text-xs text-gray-600">处理边界情况、记录停止原因、统计用户行为</p>
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
                  <p className="text-xs text-gray-600">用户体验关键功能</p>
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
                  <p className="text-xs text-gray-600">AI 产品标配功能</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-purple-50 rounded">
                <p className="text-xs text-purple-800">
                  <strong>💡 面试建议：</strong>能讲清楚 AbortController 原理、能实现完整的停止逻辑、能处理各种边界情况。
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
                    <span className="text-indigo-600 font-semibold">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要掌握 AbortController、流中断、状态管理</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>业务复杂度</span>
                    <span className="text-purple-600 font-semibold">50%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '50%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要考虑按钮状态、用户反馈、资源清理</p>
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
    </DemoContainer>
  );
}
