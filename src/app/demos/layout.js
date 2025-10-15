'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DemosLayout({ children }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} overflow-hidden`}>
        <div className="p-4 border-b flex items-center justify-between">
          {isOpen && (
            <Link href="/" className="text-lg font-bold text-gray-800 hover:text-indigo-600">
              ← 返回首页
            </Link>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {isOpen ? '←' : '→'}
          </button>
        </div>

        {isOpen && (
          <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-73px)]">
            <NavSection 
              title="React Hooks"
              items={[
                { label: 'useDebounce', path: '/demos/hooks/use-debounce' },
                { label: 'useThrottle', path: '/demos/hooks/use-throttle' },
                { label: 'useLocalStorage', path: '/demos/hooks/use-local-storage' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="性能优化"
              items={[
                { label: '虚拟列表', path: '/demos/performance/virtual-list' },
                { label: 'memo & useMemo', path: '/demos/performance/memoization' },
                { label: '懒加载图片', path: '/demos/performance/lazy-image' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="状态管理"
              items={[
                { label: 'Context + Reducer', path: '/demos/state/context-reducer' },
                { label: '发布订阅', path: '/demos/state/pub-sub' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="常见功能"
              items={[
                { label: '拖拽排序', path: '/demos/features/drag-sort' },
                { label: '无限滚动', path: '/demos/features/infinite-scroll' },
                { label: '表单验证', path: '/demos/features/form-validation' },
                { label: '流式聊天', path: '/demos/features/stream-chat' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="算法可视化"
              items={[
                { label: '防抖节流对比', path: '/demos/algorithm/debounce-throttle' },
                { label: '二分查找', path: '/demos/algorithm/binary-search' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="JavaScript 基础"
              items={[
                { label: '闭包演示', path: '/demos/js-basic/closure' },
                { label: '原型链', path: '/demos/js-basic/prototype' },
                { label: 'this 指向', path: '/demos/js-basic/this-binding' },
                { label: '事件循环', path: '/demos/js-basic/event-loop' },
                { label: 'Promise 原理', path: '/demos/js-basic/promise' },
                { label: '深浅拷贝', path: '/demos/js-basic/clone' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="CSS 技巧"
              items={[
                { label: '居中方案', path: '/demos/css/center' },
                { label: '经典布局', path: '/demos/css/layout' },
                { label: 'CSS 动画', path: '/demos/css/animation' },
                { label: 'BFC 原理', path: '/demos/css/bfc' },
                { label: '响应式布局', path: '/demos/css/responsive' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="浏览器相关"
              items={[
                { label: '跨域方案', path: '/demos/browser/cors' },
                { label: '本地存储', path: '/demos/browser/storage' },
                { label: '事件委托', path: '/demos/browser/event-delegation' },
                { label: '浏览器缓存', path: '/demos/browser/cache' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="网络与性能"
              items={[
                { label: 'AJAX 封装', path: '/demos/network/ajax' },
                { label: 'WebSocket', path: '/demos/network/websocket' },
                { label: '图片优化', path: '/demos/network/image-optimization' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="手写系列"
              items={[
                { label: 'Promise', path: '/demos/handwrite/promise' },
                { label: 'call/apply/bind', path: '/demos/handwrite/call-apply-bind' },
                { label: '深拷贝', path: '/demos/handwrite/deep-clone' },
                { label: 'EventEmitter', path: '/demos/handwrite/event-emitter' },
                { label: '节流防抖', path: '/demos/handwrite/debounce-throttle' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="AI 前端集成"
              items={[
                { label: 'SSE 流式对话', path: '/demos/ai/stream-chat' },
                { label: '代码高亮', path: '/demos/ai/code-highlight' },
                { label: 'LaTeX 渲染', path: '/demos/ai/latex-render' },
                { label: '停止生成', path: '/demos/ai/abort-generation' },
                { label: '多会话管理', path: '/demos/ai/multi-session' },
                { label: '对话历史', path: '/demos/ai/chat-history' },
                { label: 'MCP 客户端', path: '/demos/ai/mcp-client' },
                { label: 'Function Calling', path: '/demos/ai/function-calling' },
                { label: 'RAG 知识库', path: '/demos/ai/rag' },
                { label: 'Token 计数', path: '/demos/ai/token-counter' },
                { label: 'Prompt 工程', path: '/demos/ai/prompt-engineering' },
                { label: '流式 Markdown', path: '/demos/ai/stream-markdown' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="TypeScript 实战"
              items={[
                { label: '泛型 API', path: '/demos/typescript/generic-api' },
                { label: '类型体操', path: '/demos/typescript/type-challenges' },
                { label: '类型守卫', path: '/demos/typescript/type-guards' },
                { label: '装饰器', path: '/demos/typescript/decorators' },
                { label: '高级类型', path: '/demos/typescript/advanced-types' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="React 高级特性"
              items={[
                { label: 'Error Boundary', path: '/demos/react-advanced/error-boundary' },
                { label: 'Suspense', path: '/demos/react-advanced/suspense' },
                { label: 'Portal', path: '/demos/react-advanced/portal' },
                { label: 'Ref 转发', path: '/demos/react-advanced/imperative-handle' },
                { label: 'Concurrent', path: '/demos/react-advanced/concurrent' },
              ]}
              pathname={pathname}
            />

            <NavSection 
              title="工程化实践"
              items={[
                { label: 'Vite 优化', path: '/demos/engineering/vite-optimization' },
                { label: '单元测试', path: '/demos/engineering/unit-test' },
                { label: 'CI/CD', path: '/demos/engineering/ci-cd' },
                { label: 'Monorepo', path: '/demos/engineering/monorepo' },
              ]}
              pathname={pathname}
            />
          </nav>
        )}
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function NavSection({ title, items, pathname }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.path
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
