'use client';

import { Suspense, useState, lazy } from 'react';
import DemoContainer from '@/components/DemoContainer';

// 模拟异步组件
const HeavyComponent = lazy(() => 
  new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2">✅ 重组件加载完成</h3>
            <p className="text-green-800">这是一个懒加载的重组件</p>
          </div>
        )
      });
    }, 2000);
  })
);

function LoadingFallback() {
  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-blue-900">组件加载中...</span>
      </div>
    </div>
  );
}

export default function SuspenseDemo() {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <DemoContainer
      title="Suspense + lazy"
      description="React 代码分割与懒加载"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">⚡ Suspense + lazy 核心概念</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">lazy()</h4>
              <p className="text-sm text-gray-800">
                动态导入组件，只在需要时加载
              </p>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`const Comp = lazy(() => 
  import('./Heavy')
);`}
              </pre>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">Suspense</h4>
              <p className="text-sm text-gray-800">
                在组件加载时显示 fallback
              </p>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`<Suspense fallback={
  <Loading />
}>
  <Comp />
</Suspense>`}
              </pre>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-900 mb-2">优势</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 减小首屏体积</li>
                <li>• 按需加载</li>
                <li>• 提升性能</li>
                <li>• 更好的用户体验</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 演示 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <button
            onClick={() => setShowHeavy(!showHeavy)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {showHeavy ? '隐藏' : '加载'}重组件（2秒延迟）
          </button>
        </div>

        {showHeavy && (
          <Suspense fallback={<LoadingFallback />}>
            <HeavyComponent />
          </Suspense>
        )}

        {/* 实际代码 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💻 实际项目代码</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`// 1. 路由懒加载
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// 2. 条件懒加载
const HeavyChart = lazy(() => import('./components/Chart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowChart(true)}>
        显示图表
      </button>
      
      {showChart && (
        <Suspense fallback={<ChartLoader />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}

// 3. 嵌套 Suspense
<Suspense fallback={<AppLoader />}>
  <Layout>
    <Suspense fallback={<SidebarLoader />}>
      <Sidebar />
    </Suspense>
    
    <Suspense fallback={<ContentLoader />}>
      <Content />
    </Suspense>
  </Layout>
</Suspense>

// 4. 阶跃星辰 AI 应用
const CodeEditor = lazy(() => import('./CodeEditor'));
const ImageGallery = lazy(() => import('./ImageGallery'));

<Suspense fallback={<Skeleton />}>
  {showEditor && <CodeEditor />}
  {showGallery && <ImageGallery />}
</Suspense>`}
          </pre>
        </div>

        {/* 最佳实践 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 最佳实践</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <p className="font-semibold text-blue-900">✅ 适合懒加载的场景：</p>
              <ul className="list-disc ml-5 mt-1 text-blue-800">
                <li>路由页面</li>
                <li>模态框、抽屉等弹出组件</li>
                <li>图表、编辑器等重组件</li>
                <li>条件渲染的组件</li>
              </ul>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="font-semibold text-red-900">❌ 不适合懒加载：</p>
              <ul className="list-disc ml-5 mt-1 text-red-800">
                <li>首屏必须的组件</li>
                <li>小组件（体积小于 20KB）</li>
                <li>经常使用的组件</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
