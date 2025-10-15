'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function UnitTestDemo() {
  const [testOutput, setTestOutput] = useState([]);
  const [activeTab, setActiveTab] = useState('jest');

  const addOutput = (message, status = 'info') => {
    setTestOutput(prev => [...prev, {
      id: Date.now() + Math.random(),
      message,
      status
    }]);
  };

  const runMockTest = (type) => {
    setTestOutput([]);
    
    if (type === 'component') {
      addOutput('PASS  src/components/Button.test.tsx', 'pass');
      addOutput('  ✓ renders correctly (5ms)', 'pass');
      addOutput('  ✓ handles click events (3ms)', 'pass');
      addOutput('  ✓ shows loading state (4ms)', 'pass');
      addOutput('\nTest Suites: 1 passed, 1 total', 'summary');
      addOutput('Tests:       3 passed, 3 total', 'summary');
      addOutput('Time:        1.234s', 'summary');
    } else if (type === 'hook') {
      addOutput('PASS  src/hooks/useDebounce.test.ts', 'pass');
      addOutput('  ✓ delays the value update (102ms)', 'pass');
      addOutput('  ✓ cancels previous timeout (50ms)', 'pass');
      addOutput('\nTest Suites: 1 passed, 1 total', 'summary');
      addOutput('Tests:       2 passed, 2 total', 'summary');
    } else if (type === 'api') {
      addOutput('PASS  src/api/chat.test.ts', 'pass');
      addOutput('  ✓ fetches chat messages (25ms)', 'pass');
      addOutput('  ✓ handles network errors (15ms)', 'pass');
      addOutput('  ✓ retries on failure (45ms)', 'pass');
      addOutput('\nTest Suites: 1 passed, 1 total', 'summary');
      addOutput('Tests:       3 passed, 3 total', 'summary');
    }
  };

  return (
    <DemoContainer
      title="单元测试"
      description="Jest + React Testing Library - 工程质量保证"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">🧪 测试金字塔</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-3xl mb-2">🔺</div>
              <div className="font-semibold text-sm text-gray-900 mb-1">E2E 测试</div>
              <div className="text-xs text-gray-600">慢、贵、少量</div>
              <div className="text-xs text-blue-600 mt-1">Cypress/Playwright</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-3xl mb-2">🔶</div>
              <div className="font-semibold text-sm text-gray-900 mb-1">集成测试</div>
              <div className="text-xs text-gray-600">中速、中等数量</div>
              <div className="text-xs text-blue-600 mt-1">Testing Library</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center border-2 border-green-500">
              <div className="text-3xl mb-2">🟩</div>
              <div className="font-semibold text-sm text-green-900 mb-1">单元测试</div>
              <div className="text-xs text-gray-600">快、便宜、大量</div>
              <div className="text-xs text-green-600 mt-1">Jest/Vitest</div>
            </div>
          </div>
        </div>

        {/* 测试框架选择 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🛠️ 测试框架对比</h3>
          <div className="flex gap-2 mb-4">
            {['jest', 'vitest', 'rtl'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab === 'jest' && 'Jest'}
                {tab === 'vitest' && 'Vitest'}
                {tab === 'rtl' && 'React Testing Library'}
              </button>
            ))}
          </div>

          {activeTab === 'jest' && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">Jest（最成熟）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// 安装
npm install --save-dev jest @types/jest

// 配置 jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
};

// 简单测试
describe('Calculator', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
  });
  
  test('multiplies 2 * 3 to equal 6', () => {
    expect(multiply(2, 3)).toBe(6);
  });
});

// Mock 测试
jest.mock('./api');
test('fetches user data', async () => {
  api.getUser.mockResolvedValue({ id: 1, name: 'Alice' });
  const user = await fetchUser(1);
  expect(user.name).toBe('Alice');
});`}
              </pre>
            </div>
          )}

          {activeTab === 'vitest' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Vitest（速度快、与 Vite 完美集成）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// 安装
npm install --save-dev vitest @vitest/ui

// 配置 vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});

// 测试语法（与 Jest 兼容）
import { describe, test, expect } from 'vitest';

describe('useDebounce', () => {
  test('delays value update', async () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('');
    
    await act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('test');
  });
});

// 优势：
// ✅ 速度快 10x（基于 Vite）
// ✅ HMR 支持（测试热更新）
// ✅ ESM 原生支持
// ✅ 与 Jest API 兼容`}
              </pre>
            </div>
          )}

          {activeTab === 'rtl' && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">React Testing Library（用户行为导向）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// 安装
npm install --save-dev @testing-library/react @testing-library/jest-dom

// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  test('renders with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
  
  test('handles click event', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

// 核心理念：测试用户看到的，而不是实现细节
// ✅ screen.getByRole('button')
// ✅ screen.getByLabelText('Email')
// ❌ wrapper.find('.button-class')
// ❌ instance().state.value`}
              </pre>
            </div>
          )}
        </div>

        {/* 测试示例 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 常见测试场景</h3>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => runMockTest('component')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              测试组件
            </button>
            <button
              onClick={() => runMockTest('hook')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              测试 Hook
            </button>
            <button
              onClick={() => runMockTest('api')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              测试 API
            </button>
          </div>

          <div className="bg-gray-900 text-gray-100 font-mono text-xs p-4 rounded-lg h-48 overflow-y-auto">
            {testOutput.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                点击按钮运行测试
              </div>
            ) : (
              testOutput.map(item => (
                <div key={item.id} className={
                  item.status === 'pass' ? 'text-green-400' :
                  item.status === 'summary' ? 'text-blue-400 font-bold' :
                  'text-gray-400'
                }>
                  {item.message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 思维体系 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">🧠 思维体系定位</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-purple-900 mb-2">🏗️ 工程化</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 质量保证体系</li>
                <li>• CI/CD 集成</li>
                <li>• 覆盖率管理</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-blue-900 mb-2">🧪 测试策略</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 单元测试（70%）</li>
                <li>• 集成测试（20%）</li>
                <li>• E2E 测试（10%）</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-green-900 mb-2">⚡ 开发体验</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 快速反馈</li>
                <li>• TDD 开发模式</li>
                <li>• 重构信心</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 实战案例 */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">🚀 阶跃星辰 AI Chat 实战</h3>
          <div className="space-y-3">
            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                1️⃣ 测试流式聊天组件
              </summary>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2">
{`// StreamChat.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import StreamChat from './StreamChat';
import { mockSSE } from '@/test/mocks';

describe('StreamChat', () => {
  test('streams AI response token by token', async () => {
    const sse = mockSSE();
    render(<StreamChat />);
    
    // 模拟流式响应
    sse.emit('data', { token: 'Hello' });
    sse.emit('data', { token: ' world' });
    sse.emit('data', { token: '!' });
    sse.emit('done');
    
    await waitFor(() => {
      expect(screen.getByText(/Hello world!/)).toBeInTheDocument();
    });
  });
  
  test('handles stop generation', async () => {
    render(<StreamChat />);
    const stopButton = screen.getByRole('button', { name: /stop/i });
    
    fireEvent.click(stopButton);
    expect(mockAbortController).toHaveBeenCalled();
  });
});`}
              </pre>
            </details>

            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                2️⃣ 测试 useDebounce Hook
              </summary>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2">
{`// useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('delays value update by specified time', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );
    
    expect(result.current).toBe('initial');
    
    // 更新值
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // 还没到时间
    
    // 快进 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('updated');
  });
  
  test('cancels previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'a' } }
    );
    
    rerender({ value: 'b' });
    jest.advanceTimersByTime(200);
    
    rerender({ value: 'c' });
    jest.advanceTimersByTime(200);
    
    rerender({ value: 'd' });
    jest.advanceTimersByTime(500);
    
    expect(result.current).toBe('d'); // 只有最后一个生效
  });
});`}
              </pre>
            </details>

            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                3️⃣ 测试 API 层（Mock + MSW）
              </summary>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2">
{`// chat.api.test.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { chatAPI } from './chat.api';

const server = setupServer(
  rest.post('/api/chat', (req, res, ctx) => {
    return res(ctx.json({ message: 'AI response' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('chatAPI', () => {
  test('sends message and receives response', async () => {
    const response = await chatAPI.sendMessage('Hello');
    expect(response.message).toBe('AI response');
  });
  
  test('handles network error with retry', async () => {
    server.use(
      rest.post('/api/chat', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    await expect(chatAPI.sendMessage('Hello')).rejects.toThrow();
  });
  
  test('includes auth token in headers', async () => {
    let requestHeaders;
    server.use(
      rest.post('/api/chat', (req, res, ctx) => {
        requestHeaders = req.headers;
        return res(ctx.json({ ok: true }));
      })
    );
    
    await chatAPI.sendMessage('Hello');
    expect(requestHeaders.get('Authorization')).toBeTruthy();
  });
});`}
              </pre>
            </details>
          </div>
        </div>

        {/* 面试 QA */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 面试高频 QA</h3>
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: 单元测试 vs 集成测试 vs E2E 测试的区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">类型</th>
                      <th className="p-2 text-left">范围</th>
                      <th className="p-2 text-left">速度</th>
                      <th className="p-2 text-left">成本</th>
                      <th className="p-2 text-left">占比</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-2 font-semibold">单元测试</td>
                      <td className="p-2">单个函数/组件</td>
                      <td className="p-2 text-green-600">快（毫秒级）</td>
                      <td className="p-2 text-green-600">低</td>
                      <td className="p-2 text-green-600">70%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">集成测试</td>
                      <td className="p-2">多个模块交互</td>
                      <td className="p-2 text-yellow-600">中（秒级）</td>
                      <td className="p-2 text-yellow-600">中</td>
                      <td className="p-2 text-yellow-600">20%</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">E2E 测试</td>
                      <td className="p-2">完整用户流程</td>
                      <td className="p-2 text-red-600">慢（分钟级）</td>
                      <td className="p-2 text-red-600">高</td>
                      <td className="p-2 text-red-600">10%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: Jest 和 Vitest 如何选择？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 p-3 rounded">
                    <p className="font-semibold text-red-900 mb-1">Jest</p>
                    <p className="text-xs mb-2">✅ 优点：</p>
                    <ul className="text-xs space-y-1">
                      <li>• 生态成熟，文档完善</li>
                      <li>• 开箱即用，零配置</li>
                      <li>• 社区大，问题易解决</li>
                    </ul>
                    <p className="text-xs mt-2">❌ 缺点：</p>
                    <ul className="text-xs space-y-1">
                      <li>• 速度较慢</li>
                      <li>• ESM 支持不完善</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-semibold text-green-900 mb-1">Vitest</p>
                    <p className="text-xs mb-2">✅ 优点：</p>
                    <ul className="text-xs space-y-1">
                      <li>• 速度快 10x</li>
                      <li>• 与 Vite 完美集成</li>
                      <li>• HMR 支持</li>
                      <li>• ESM 原生支持</li>
                    </ul>
                    <p className="text-xs mt-2">❌ 缺点：</p>
                    <ul className="text-xs space-y-1">
                      <li>• 生态相对较新</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  💡 <strong>选择建议：</strong>新项目用 Vitest，老项目继续用 Jest
                </p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 测试覆盖率多少合适？
              </summary>
              <div className="mt-3 text-sm text-gray-800 bg-yellow-50 p-3 rounded">
                <p className="font-semibold text-yellow-900 mb-2">⚠️ 不要盲目追求 100%：</p>
                <ul className="text-xs space-y-2">
                  <li><strong>核心业务逻辑：</strong>90%+ 覆盖率</li>
                  <li><strong>工具函数：</strong>80%+ 覆盖率</li>
                  <li><strong>UI 组件：</strong>60%+ 覆盖率</li>
                  <li><strong>类型定义、配置：</strong>不需要测试</li>
                </ul>
                <p className="text-xs mt-2 text-gray-700">
                  💡 <strong>重点：</strong>测试质量比覆盖率更重要！一个好的测试能发现 bug，100 个形式主义的测试只是浪费时间。
                </p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 如何 Mock 异步请求？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 方案 1: Jest Mock
jest.mock('./api');
api.fetchUser.mockResolvedValue({ id: 1, name: 'Alice' });

// 方案 2: MSW（推荐）
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/user/:id', (req, res, ctx) => {
    return res(ctx.json({ id: 1, name: 'Alice' }));
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

// MSW 优势：
// ✅ 真实网络请求（不侵入代码）
// ✅ 同时支持测试和开发
// ✅ 模拟各种网络状态`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q5: TDD（测试驱动开发）是什么？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-blue-900 mb-2">🔄 TDD 流程（红-绿-重构）：</p>
                  <ol className="text-xs space-y-2">
                    <li><strong className="text-red-600">1. 红：</strong>写一个失败的测试</li>
                    <li><strong className="text-green-600">2. 绿：</strong>写最少代码让测试通过</li>
                    <li><strong className="text-blue-600">3. 重构：</strong>优化代码质量</li>
                  </ol>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// 1. 先写测试（红）
test('adds two numbers', () => {
  expect(add(1, 2)).toBe(3); // ❌ add 函数还不存在
});

// 2. 实现功能（绿）
function add(a, b) {
  return a + b; // ✅ 测试通过
}

// 3. 重构（保持绿）
const add = (a: number, b: number): number => a + b;`}
                  </pre>
                  <p className="text-xs mt-2 text-gray-700">
                    💡 <strong>优势：</strong>更清晰的需求、更好的设计、更高的质量
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* 最佳实践 */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-cyan-900 mb-4">✅ 最佳实践清单</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">✅ 应该做的</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 测试用户行为，不是实现细节</li>
                <li>• 一个测试只测一件事</li>
                <li>• 使用有意义的测试名称</li>
                <li>• 测试边界条件和异常</li>
                <li>• Mock 外部依赖（API、DB）</li>
                <li>• 保持测试独立性</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">❌ 不应该做的</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 测试第三方库的功能</li>
                <li>• 测试私有方法/内部状态</li>
                <li>• 测试之间有依赖关系</li>
                <li>• 使用真实的外部服务</li>
                <li>• 盲目追求 100% 覆盖率</li>
                <li>• 测试太复杂难以维护</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 常见陷阱 */}
        <div className="bg-gradient-to-r from-yellow-50 to-red-50 border-2 border-yellow-400 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-900 mb-4">⚠️ 常见陷阱</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
              <h4 className="font-semibold text-red-900 mb-2">❌ 陷阱 1：测试实现细节而不是行为</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：测试内部状态
test('increments count', () => {
  const wrapper = mount(<Counter />);
  expect(wrapper.state('count')).toBe(0);
});

// ✅ 正确：测试用户看到的
test('increments count', () => {
  render(<Counter />);
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Increment'));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900 mb-2">❌ 陷阱 2：忘记清理副作用</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：定时器泄漏
test('delays execution', async () => {
  const fn = jest.fn();
  setTimeout(fn, 1000);
  // 测试结束，定时器还在运行
});

// ✅ 正确：清理定时器
test('delays execution', async () => {
  jest.useFakeTimers();
  const fn = jest.fn();
  setTimeout(fn, 1000);
  jest.advanceTimersByTime(1000);
  expect(fn).toHaveBeenCalled();
  jest.useRealTimers(); // 清理
});`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900 mb-2">❌ 陷阱 3：测试之间有依赖</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：测试顺序依赖
let user;
test('creates user', () => {
  user = createUser();
});
test('updates user', () => {
  updateUser(user); // 依赖上一个测试
});

// ✅ 正确：每个测试独立
test('creates user', () => {
  const user = createUser();
  expect(user).toBeDefined();
});
test('updates user', () => {
  const user = createUser(); // 自己创建
  updateUser(user);
});`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
