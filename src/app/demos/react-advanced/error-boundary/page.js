'use client';

import { Component, useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

// ===== 核心知识点 1: 基础 Error Boundary 实现 =====
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
    };
  }

  // 捕获渲染错误
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // 捕获详细错误信息
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // 实际项目中可以上报到错误监控平台
    // logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-2">
                糟糕！组件出错了
              </h3>
              <p className="text-sm text-red-700">
                不用担心，错误已被捕获，不会影响其他功能
              </p>
            </div>
          </div>

          {this.state.error && (
            <div className="bg-white border border-red-200 rounded p-3 mb-3">
              <div className="text-xs font-semibold text-red-900 mb-1">
                错误信息：
              </div>
              <div className="text-sm text-red-800 font-mono">
                {this.state.error.toString()}
              </div>
            </div>
          )}

          {this.state.errorInfo && (
            <details className="bg-white border border-red-200 rounded p-3 mb-3">
              <summary className="text-xs font-semibold text-red-900 cursor-pointer">
                组件堆栈（点击展开）
              </summary>
              <pre className="text-xs text-red-700 mt-2 overflow-x-auto">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <button
            onClick={this.resetError}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
          >
            重新尝试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ===== 核心知识点 2: 高级 Error Boundary（带日志上报）=====
class AdvancedErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const { onError, maxRetries = 3 } = this.props;
    
    this.setState(prev => ({
      error,
      errorInfo,
      errorCount: prev.errorCount + 1,
    }));

    // 错误上报
    if (onError) {
      onError(error, errorInfo, this.state.errorCount);
    }

    // 错误日志
    console.group('🔴 Error Boundary Caught');
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Count:', this.state.errorCount + 1);
    console.groupEnd();
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error, errorCount } = this.state;
    const { maxRetries = 3, fallback } = this.props;

    if (hasError) {
      // 自定义 fallback
      if (fallback) {
        return fallback({ error, resetError: this.resetError, errorCount });
      }

      // 超过最大重试次数
      if (errorCount >= maxRetries) {
        return (
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6 text-center">
            <span className="text-4xl mb-3 block">😵</span>
            <h3 className="text-lg font-bold text-red-900 mb-2">
              组件多次失败
            </h3>
            <p className="text-sm text-red-700 mb-4">
              已尝试 {errorCount} 次，建议刷新页面或联系支持
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              刷新页面
            </button>
          </div>
        );
      }

      // 默认错误 UI
      return (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-2">
            ⚠️ 出了点小问题
          </h3>
          <p className="text-sm text-yellow-800 mb-3">
            {error?.message || '未知错误'}
          </p>
          <p className="text-xs text-yellow-700 mb-4">
            重试次数：{errorCount}/{maxRetries}
          </p>
          <button
            onClick={this.resetError}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
          >
            重试 ({maxRetries - errorCount} 次机会)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ===== 会出错的组件示例 =====
function BuggyComponent({ shouldError }) {
  if (shouldError) {
    throw new Error('这是一个故意抛出的错误！');
  }
  return (
    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
      <span className="text-3xl mb-2 block">✅</span>
      <p className="text-green-900 font-semibold">组件运行正常</p>
    </div>
  );
}

function AsyncBuggyComponent({ shouldError }) {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    if (shouldError) {
      // 模拟异步操作中的错误
      setTimeout(() => {
        throw new Error('异步错误：这个错误不会被 Error Boundary 捕获！');
      }, 100);
    }
    setCount(count + 1);
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
      <p className="text-blue-900 mb-3">点击次数：{count}</p>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {shouldError ? '触发异步错误' : '正常点击'}
      </button>
    </div>
  );
}

function NetworkErrorComponent({ shouldError }) {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      if (shouldError) {
        throw new Error('网络请求失败');
      }
      setData({ message: '数据加载成功' });
    } catch (error) {
      // 手动抛出错误让 Error Boundary 捕获
      throw error;
    }
  };

  if (shouldError && !data) {
    fetchData();
  }

  return (
    <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
      <p className="text-purple-900">
        {data ? data.message : '准备加载数据...'}
      </p>
    </div>
  );
}

export default function ErrorBoundaryDemo() {
  const [scenario, setScenario] = useState('basic');
  const [triggerError, setTriggerError] = useState(false);
  const [errorLogs, setErrorLogs] = useState([]);

  const handleError = (error, errorInfo, errorCount) => {
    setErrorLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      error: error.toString(),
      count: errorCount,
    }]);
  };

  const resetDemo = () => {
    setTriggerError(false);
    setErrorLogs([]);
  };

  return (
    <DemoContainer
      title="Error Boundary - React 错误边界"
      description="捕获组件错误，避免整个应用崩溃"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📚 Error Boundary 核心概念</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">是什么？</h4>
              <p className="text-sm text-gray-800">
                Error Boundary 是 React 组件，可以捕获子组件树中的 JavaScript 错误，记录错误日志，并展示降级 UI。
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">能捕获什么？</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 渲染期间的错误</li>
                <li>• 生命周期方法中的错误</li>
                <li>• 构造函数中的错误</li>
                <li>• 子组件树的错误</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-red-900 mb-2">不能捕获什么？</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 事件处理器中的错误</li>
                <li>• 异步代码（setTimeout）</li>
                <li>• 服务端渲染错误</li>
                <li>• Error Boundary 自身错误</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 场景切换 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm font-semibold text-gray-700">演示场景：</span>
            <button
              onClick={() => { setScenario('basic'); resetDemo(); }}
              className={`px-4 py-2 rounded-lg transition ${
                scenario === 'basic'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-100'
              }`}
            >
              基础捕获
            </button>
            <button
              onClick={() => { setScenario('advanced'); resetDemo(); }}
              className={`px-4 py-2 rounded-lg transition ${
                scenario === 'advanced'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-100'
              }`}
            >
              高级特性
            </button>
            <button
              onClick={() => { setScenario('limitation'); resetDemo(); }}
              className={`px-4 py-2 rounded-lg transition ${
                scenario === 'limitation'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-100'
              }`}
            >
              局限性演示
            </button>

            <div className="flex-1" />

            <button
              onClick={() => setTriggerError(!triggerError)}
              className={`px-4 py-2 rounded-lg transition ${
                triggerError
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {triggerError ? '🐛 已触发错误' : '✅ 组件正常'}
            </button>
          </div>
        </div>

        {/* 场景 1: 基础捕获 */}
        {scenario === 'basic' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 场景 1: 基础错误捕获</h4>
              <p className="text-sm text-blue-800">
                点击右上角按钮触发错误，观察 Error Boundary 如何捕获并展示降级 UI
              </p>
            </div>

            <ErrorBoundary>
              <BuggyComponent shouldError={triggerError} />
            </ErrorBoundary>

            <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg">
              <div className="mb-2 text-gray-400">// 基础 Error Boundary 实现</div>
              <pre className="text-xs overflow-x-auto">
{`class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // 捕获错误，更新状态
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // 记录错误详情
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    // 上报到错误监控平台
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 展示降级 UI
      return <h2>出错了，请稍后重试</h2>;
    }
    return this.props.children;
  }
}

// 使用
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>`}
              </pre>
            </div>
          </div>
        )}

        {/* 场景 2: 高级特性 */}
        {scenario === 'advanced' && (
          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h4 className="font-semibold text-green-900 mb-2">🚀 场景 2: 高级特性</h4>
              <p className="text-sm text-green-800">
                支持重试、最大重试次数、自定义 fallback、错误上报等
              </p>
            </div>

            <AdvancedErrorBoundary
              maxRetries={3}
              onError={handleError}
            >
              <BuggyComponent shouldError={triggerError} />
            </AdvancedErrorBoundary>

            {errorLogs.length > 0 && (
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">📋 错误日志</h4>
                <div className="space-y-2">
                  {errorLogs.map((log, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-200 rounded p-2 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">{log.time}</span>
                        <span className="text-xs text-red-600">重试次数: {log.count}</span>
                      </div>
                      <div className="text-red-800 font-mono text-xs">{log.error}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg">
              <div className="mb-2 text-gray-400">// 高级特性</div>
              <pre className="text-xs overflow-x-auto">
{`class AdvancedErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    const { onError, maxRetries } = this.props;
    
    // 错误计数
    this.setState(prev => ({
      errorCount: prev.errorCount + 1
    }));

    // 错误上报（实际项目）
    if (onError) {
      onError(error, errorInfo, this.state.errorCount);
    }

    // 发送到 Sentry / 阶跃星辰监控平台
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    });
  }

  render() {
    const { hasError, errorCount } = this.state;
    const { maxRetries, fallback } = this.props;

    if (hasError) {
      // 自定义降级 UI
      if (fallback) {
        return fallback({ 
          error, 
          resetError: this.resetError,
          errorCount 
        });
      }

      // 超过最大重试次数
      if (errorCount >= maxRetries) {
        return <FatalErrorUI />;
      }

      return <RetryUI />;
    }

    return this.props.children;
  }
}`}
              </pre>
            </div>
          </div>
        )}

        {/* 场景 3: 局限性 */}
        {scenario === 'limitation' && (
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <h4 className="font-semibold text-red-900 mb-2">⚠️ 场景 3: Error Boundary 的局限性</h4>
              <p className="text-sm text-red-800 mb-2">
                以下错误 <strong>不会</strong> 被 Error Boundary 捕获：
              </p>
              <ul className="text-sm text-red-800 space-y-1 list-disc ml-5">
                <li>事件处理器中的错误（需要 try-catch）</li>
                <li>异步代码（setTimeout、Promise）</li>
                <li>服务端渲染错误</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-900">
                <strong>⚠️ 注意：</strong>下面的异步错误会在控制台报错，但不会被 Error Boundary 捕获
              </p>
            </div>

            <ErrorBoundary>
              <AsyncBuggyComponent shouldError={triggerError} />
            </ErrorBoundary>

            <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg">
              <div className="mb-2 text-gray-400">// 异步错误处理方案</div>
              <pre className="text-xs overflow-x-auto">
{`// ❌ 不会被捕获
function handleClick() {
  setTimeout(() => {
    throw new Error('异步错误'); // Error Boundary 捕获不到
  }, 0);
}

// ✅ 解决方案 1: try-catch + 状态管理
function handleClick() {
  setTimeout(() => {
    try {
      throw new Error('异步错误');
    } catch (error) {
      setError(error); // 更新状态，触发重新渲染
    }
  }, 0);
}

// ✅ 解决方案 2: 全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // 发送到监控平台
  logErrorToService(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // 发送到监控平台
  logErrorToService(event.reason);
});

// ✅ 解决方案 3: React 18 的 useErrorHandler
import { useErrorHandler } from 'react-error-boundary';

function MyComponent() {
  const handleError = useErrorHandler();

  const handleClick = async () => {
    try {
      await fetchData();
    } catch (error) {
      handleError(error); // 手动触发 Error Boundary
    }
  };
}`}
              </pre>
            </div>
          </div>
        )}

        {/* 最佳实践 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Error Boundary 最佳实践</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">1. 粒度控制</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2 overflow-x-auto">
{`// ✅ 好的做法：多个小范围 Error Boundary
<Layout>
  <ErrorBoundary name="Header">
    <Header />
  </ErrorBoundary>
  
  <ErrorBoundary name="Content">
    <MainContent />
  </ErrorBoundary>
  
  <ErrorBoundary name="Sidebar">
    <Sidebar />
  </ErrorBoundary>
</Layout>

// ❌ 不好的做法：一个大 Error Boundary 包裹整个应用
<ErrorBoundary>
  <App /> {/* 任何组件错误都会导致整个应用白屏 */}
</ErrorBoundary>`}
              </pre>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">2. 阶跃星辰 AI 产品中的应用</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2 overflow-x-auto">
{`// AI 对话界面的 Error Boundary 布局
<PageLayout>
  {/* 会话列表：独立错误边界 */}
  <ErrorBoundary 
    fallback={<SessionListError />}
    onError={(error) => logToSentry(error, 'SessionList')}
  >
    <SessionList />
  </ErrorBoundary>

  {/* 聊天区域：核心功能，独立边界 */}
  <ErrorBoundary
    fallback={<ChatAreaError />}
    onError={(error) => logToSentry(error, 'ChatArea')}
  >
    <ChatArea />
  </ErrorBoundary>

  {/* 设置面板：独立边界 */}
  <ErrorBoundary fallback={<SettingsError />}>
    <SettingsPanel />
  </ErrorBoundary>
</PageLayout>

// 好处：某个区域出错不影响其他功能`}
              </pre>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">3. 错误监控集成</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2 overflow-x-auto">
{`import * as Sentry from '@sentry/react';

// 初始化 Sentry
Sentry.init({
  dsn: "your-dsn",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// 使用 Sentry 的 Error Boundary
<Sentry.ErrorBoundary 
  fallback={<ErrorFallback />}
  showDialog
>
  <App />
</Sentry.ErrorBoundary>

// 或自定义 Error Boundary 集成
class MyErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // 上报到 Sentry
    Sentry.captureException(error, {
      contexts: {
        react: { componentStack: errorInfo.componentStack }
      },
      tags: {
        boundary: this.props.name,
        userId: currentUser.id,
      }
    });
  }
}`}
              </pre>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">4. 降级 UI 设计</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-xs font-semibold text-yellow-900 mb-1">❌ 不好的设计</p>
                  <div className="bg-red-100 border border-red-300 p-2 rounded text-xs text-center">
                    Something went wrong
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-yellow-900 mb-1">✅ 好的设计</p>
                  <div className="bg-white border border-gray-300 p-2 rounded text-xs">
                    <p className="font-semibold mb-1">😕 加载失败</p>
                    <p className="text-gray-600 mb-2">无法加载聊天记录</p>
                    <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                      重试
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 面试场景模拟 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 面试场景模拟</h3>

          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：Error Boundary 为什么不能捕获事件处理器中的错误？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ 好的回答：</p>
                  <div className="space-y-2 mt-2">
                    <p><strong>原因：</strong></p>
                    <ul className="list-disc ml-5 text-xs space-y-1">
                      <li>Error Boundary 只捕获 <strong>React 生命周期</strong>中的错误</li>
                      <li>事件处理器是在 React 渲染完成后、用户交互时执行的</li>
                      <li>不在 React 的调用栈中，React 无法捕获</li>
                    </ul>
                    <p className="mt-2"><strong>解决方案：</strong></p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`// 方案 1: try-catch
handleClick = () => {
  try {
    doSomething();
  } catch (error) {
    this.setState({ error });
  }
};

// 方案 2: 手动触发 Error Boundary
import { useErrorHandler } from 'react-error-boundary';

function MyComponent() {
  const handleError = useErrorHandler();
  
  const handleClick = () => {
    try {
      doSomething();
    } catch (error) {
      handleError(error); // 手动触发
    }
  };
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：如何在生产环境中使用 Error Boundary？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ 完整方案：</p>
                  <div className="space-y-3 mt-2">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-semibold text-xs">1. 多层级 Error Boundary</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`<ErrorBoundary name="App" level="critical">
  <App>
    <ErrorBoundary name="Page" level="high">
      <Page>
        <ErrorBoundary name="Widget" level="low">
          <Widget />
        </ErrorBoundary>
      </Page>
    </ErrorBoundary>
  </App>
</ErrorBoundary>`}
                      </pre>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-xs">2. 错误上报</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`componentDidCatch(error, errorInfo) {
  // 发送到监控平台
  Sentry.captureException(error, {
    level: this.props.level,
    tags: { boundary: this.props.name },
    extra: { componentStack: errorInfo.componentStack }
  });
  
  // 本地日志
  console.error('[ErrorBoundary]', {
    name: this.props.name,
    error: error.toString(),
    stack: error.stack
  });
}`}
                      </pre>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="font-semibold text-xs">3. 用户友好的降级 UI</p>
                      <ul className="list-disc ml-5 text-xs mt-1">
                        <li>明确的错误提示</li>
                        <li>重试按钮</li>
                        <li>联系支持的入口</li>
                        <li>保留用户数据（不刷新页面）</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：React 18 对 Error Boundary 有什么改进？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ React 18 新特性：</p>
                  <div className="space-y-2 mt-2">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-semibold text-xs">1. 自动批处理错误</p>
                      <p className="text-xs">多个组件同时出错，只触发一次 Error Boundary</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-xs">2. Concurrent Mode 支持</p>
                      <p className="text-xs">Suspense 边界和 Error Boundary 配合使用</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Loading />}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>`}
                      </pre>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="font-semibold text-xs">3. 更好的错误恢复</p>
                      <p className="text-xs">支持部分hydration恢复，不会导致整个应用重新渲染</p>
                    </div>
                  </div>
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
              <strong>追问 1：</strong>Error Boundary 可以用函数组件实现吗？
              <p className="ml-4 text-xs text-gray-700">→ 不行，必须是类组件（目前没有对应的 Hook）</p>
            </div>
            <div>
              <strong>追问 2：</strong>如何测试 Error Boundary？
              <p className="ml-4 text-xs text-gray-700">→ 使用 Jest + React Testing Library，手动抛出错误</p>
            </div>
            <div>
              <strong>追问 3：</strong>Error Boundary 的性能影响？
              <p className="ml-4 text-xs text-gray-700">→ 几乎没有，只在错误发生时才执行</p>
            </div>
            <div>
              <strong>追问 4：</strong>多个 Error Boundary 嵌套时如何工作？
              <p className="ml-4 text-xs text-gray-700">→ 由最近的父级 Error Boundary 捕获，向上冒泡直到被捕获</p>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
