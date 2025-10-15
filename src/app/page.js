import Link from 'next/link';

const demos = [
  {
    category: 'React Hooks',
    items: [
      { title: 'useDebounce 防抖', path: '/demos/hooks/use-debounce', desc: '自定义防抖 Hook 实现' },
      { title: 'useThrottle 节流', path: '/demos/hooks/use-throttle', desc: '自定义节流 Hook 实现' },
      { title: 'useLocalStorage', path: '/demos/hooks/use-local-storage', desc: '持久化状态管理' },
    ]
  },
  {
    category: '性能优化',
    items: [
      { title: '虚拟列表', path: '/demos/performance/virtual-list', desc: '大数据列表渲染优化' },
      { title: 'memo & useMemo', path: '/demos/performance/memoization', desc: 'React 性能优化实践' },
      { title: '懒加载图片', path: '/demos/performance/lazy-image', desc: 'Intersection Observer 实现' },
    ]
  },
  {
    category: '状态管理',
    items: [
      { title: 'Context + Reducer', path: '/demos/state/context-reducer', desc: '轻量级状态管理方案' },
      { title: '发布订阅模式', path: '/demos/state/pub-sub', desc: '跨组件通信' },
    ]
  },
  {
    category: '常见功能',
    items: [
      { title: '拖拽排序', path: '/demos/features/drag-sort', desc: 'HTML5 Drag & Drop API' },
      { title: '无限滚动', path: '/demos/features/infinite-scroll', desc: '分页加载实现' },
      { title: '表单验证', path: '/demos/features/form-validation', desc: '自定义表单校验' },
      { title: '流式聊天', path: '/demos/features/stream-chat', desc: 'SSE 流式响应 + 打字效果' },
    ]
  },
  {
    category: '算法可视化',
    items: [
      { title: '防抖节流对比', path: '/demos/algorithm/debounce-throttle', desc: '可视化演示区别' },
      { title: '二分查找', path: '/demos/algorithm/binary-search', desc: '动画演示查找过程' },
    ]
  },
  {
    category: 'JavaScript 基础',
    items: [
      { title: '闭包演示', path: '/demos/js-basic/closure', desc: '计数器、私有变量、作用域链' },
      { title: '原型链', path: '/demos/js-basic/prototype', desc: '可视化原型链关系' },
      { title: 'this 指向', path: '/demos/js-basic/this-binding', desc: '各种场景下的 this' },
      { title: '事件循环', path: '/demos/js-basic/event-loop', desc: '宏任务 & 微任务执行顺序' },
      { title: 'Promise 原理', path: '/demos/js-basic/promise', desc: '手写 Promise 实现' },
      { title: '深拷贝 vs 浅拷贝', path: '/demos/js-basic/clone', desc: '对比演示与实现' },
    ]
  },
  {
    category: 'CSS 技巧',
    items: [
      { title: '居中方案大全', path: '/demos/css/center', desc: '水平垂直居中 N 种方法' },
      { title: '经典布局', path: '/demos/css/layout', desc: '圣杯/双飞翼/Flex/Grid' },
      { title: 'CSS 动画', path: '/demos/css/animation', desc: 'Transition & Keyframes' },
      { title: 'BFC 原理', path: '/demos/css/bfc', desc: '块级格式化上下文演示' },
      { title: '响应式布局', path: '/demos/css/responsive', desc: 'Media Query + Flex' },
    ]
  },
  {
    category: '浏览器相关',
    items: [
      { title: '跨域解决方案', path: '/demos/browser/cors', desc: 'CORS、JSONP、代理演示' },
      { title: '本地存储对比', path: '/demos/browser/storage-cache', desc: 'LocalStorage/SessionStorage/Cookie' },
      { title: '事件委托', path: '/demos/browser/event-delegation', desc: 'Event Delegation 实战' },
      { title: '浏览器缓存', path: '/demos/browser/cache', desc: '强缓存 & 协商缓存' },
    ]
  },
  {
    category: '网络与性能',
    items: [
      { title: 'AJAX 封装', path: '/demos/network/ajax', desc: '手写 AJAX & Fetch' },
      { title: 'WebSocket', path: '/demos/network/websocket', desc: '实时双向通信' },
      { title: '图片优化', path: '/demos/network/image-optimization', desc: '预加载 & 懒加载 & 压缩' },
    ]
  },
  {
    category: '手写系列',
    items: [
      { title: '手写 Promise', path: '/demos/handwrite/promise', desc: '符合 A+ 规范' },
      { title: '手写 call/apply/bind', path: '/demos/handwrite/call-apply-bind', desc: '改变 this 指向' },
      { title: '手写深拷贝', path: '/demos/handwrite/deep-clone', desc: '处理循环引用' },
      { title: '手写 EventEmitter', path: '/demos/handwrite/event-emitter', desc: '发布订阅模式' },
      { title: '手写节流防抖', path: '/demos/handwrite/debounce-throttle', desc: '带取消功能' },
    ]
  },
  {
    category: 'AI 前端集成',
    items: [
      { title: 'SSE 流式对话', path: '/demos/ai/stream-chat', desc: 'Server-Sent Events 实时打字效果' },
      { title: '流式代码高亮', path: '/demos/ai/code-highlight', desc: 'Prism.js 实时语法高亮' },
      { title: 'LaTeX 公式渲染', path: '/demos/ai/latex-render', desc: 'KaTeX 数学公式实时渲染' },
      { title: '停止生成功能', path: '/demos/ai/abort-generation', desc: 'AbortController 取消请求' },
      { title: '多会话管理', path: '/demos/ai/multi-session', desc: '会话切换 + IndexedDB 持久化' },
      { title: '对话历史优化', path: '/demos/ai/chat-history', desc: '虚拟滚动 + 分页加载' },
      { title: 'MCP 客户端', path: '/demos/ai/mcp-client', desc: 'Model Context Protocol 实现' },
      { title: 'Function Calling', path: '/demos/ai/function-calling', desc: 'AI 调用本地函数（天气、搜索）' },
      { title: 'RAG 知识库', path: '/demos/ai/rag', desc: '向量检索 + 语义搜索' },
      { title: 'Token 计数器', path: '/demos/ai/token-counter', desc: 'tiktoken.js 实时计算成本' },
      { title: 'Prompt 工程', path: '/demos/ai/prompt-engineering', desc: 'Few-shot、CoT 优化技巧' },
      { title: '流式 Markdown', path: '/demos/ai/stream-markdown', desc: '边接收边渲染 MD 格式' },
    ]
  },
  {
    category: 'TypeScript 实战',
    items: [
      { title: '泛型封装 API', path: '/demos/typescript/generic-api', desc: '类型安全的请求封装' },
      { title: '类型体操实战', path: '/demos/typescript/type-challenges', desc: 'Partial/Pick/Omit 实现' },
      { title: '类型守卫', path: '/demos/typescript/type-guards', desc: '类型收窄与判断' },
      { title: '装饰器实现', path: '/demos/typescript/decorators', desc: '方法装饰器与日志' },
      { title: '高级类型', path: '/demos/typescript/advanced-types', desc: '联合/交叉/映射类型' },
    ]
  },
  {
    category: 'React 高级特性',
    items: [
      { title: 'Error Boundary', path: '/demos/react-advanced/error-boundary', desc: '错误边界处理' },
      { title: 'Suspense + lazy', path: '/demos/react-advanced/suspense', desc: '懒加载与占位' },
      { title: 'Portal 模态框', path: '/demos/react-advanced/portal', desc: '传送门实现弹窗' },
      { title: 'useImperativeHandle', path: '/demos/react-advanced/imperative-handle', desc: 'Ref 转发实战' },
      { title: 'Concurrent Mode', path: '/demos/react-advanced/concurrent', desc: 'useTransition & useDeferredValue' },
    ]
  },
  {
    category: '工程化实践',
    items: [
      { title: 'Vite 打包优化', path: '/demos/engineering/vite-optimization', desc: '代码分割与 Tree Shaking' },
      { title: '单元测试', path: '/demos/engineering/unit-test', desc: 'Jest + React Testing Library' },
      { title: 'CI/CD 流程', path: '/demos/engineering/ci-cd', desc: 'GitHub Actions 自动部署' },
      { title: 'Monorepo 管理', path: '/demos/engineering/monorepo', desc: 'pnpm workspace 实践' },
    ]
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            前端面试 Demo 集合
          </h1>
          <p className="text-xl text-gray-600">
            React + JavaScript + CSS + 浏览器原理 + AI 集成 高频面试题实现
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm flex-wrap">
            <a 
              href="/docs/MINDMAP" 
              target="_blank"
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:from-cyan-700 hover:to-teal-700 transition font-medium shadow-lg"
            >
              🧠 前端思维体系全景图
            </a>
            <a 
              href="/docs/PRIORITY" 
              target="_blank"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              📋 学习优先级
            </a>
            <span className="text-gray-500">
              共 15 大分类 · 70+ 个 Demo
            </span>
          </div>
        </header>

        <div className="space-y-12">
          {demos.map((section) => (
            <section key={section.category} className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-500 pb-2">
                {section.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((demo) => (
                  <Link
                    key={demo.path}
                    href={demo.path}
                    className="group block p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:shadow-xl transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {demo.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {demo.desc}
                    </p>
                    <div className="mt-4 text-indigo-500 text-sm font-medium group-hover:translate-x-2 transition-transform">
                      查看演示 →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
