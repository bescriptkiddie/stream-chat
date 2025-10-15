'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function ViteOptimizationDemo() {
  const [activeTab, setActiveTab] = useState('vite-vs-webpack');
  const [buildStats, setBuildStats] = useState(null);

  const runMockBuild = (type) => {
    if (type === 'before') {
      setBuildStats({
        chunks: 15,
        totalSize: '2.8 MB',
        mainChunk: '850 KB',
        vendorChunk: '1.2 MB',
        buildTime: '45.2s',
        status: 'slow'
      });
    } else {
      setBuildStats({
        chunks: 8,
        totalSize: '1.2 MB',
        mainChunk: '280 KB',
        vendorChunk: '420 KB',
        buildTime: '8.3s',
        status: 'fast'
      });
    }
  };

  return (
    <DemoContainer
      title="Vite 打包优化"
      description="代码分割 + Tree Shaking + 极速构建"
    >
      <div className="space-y-6">
        {/* 核心优势 */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">⚡ Vite 核心优势</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-4xl mb-2">🚀</div>
              <div className="font-semibold text-sm text-gray-900 mb-1">极速冷启动</div>
              <div className="text-xs text-gray-600">无需打包，直接启动</div>
              <div className="text-2xl font-bold text-green-600 mt-2">&lt;1s</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="font-semibold text-sm text-gray-900 mb-1">即时热更新</div>
              <div className="text-xs text-gray-600">HMR 毫秒级响应</div>
              <div className="text-2xl font-bold text-green-600 mt-2">&lt;100ms</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-4xl mb-2">📦</div>
              <div className="font-semibold text-sm text-gray-900 mb-1">优化构建</div>
              <div className="text-xs text-gray-600">基于 Rollup</div>
              <div className="text-2xl font-bold text-green-600 mt-2">5x</div>
            </div>
          </div>
        </div>

        {/* 对比选项卡 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 深度对比</h3>
          <div className="flex gap-2 mb-4">
            {[
              { id: 'vite-vs-webpack', label: 'Vite vs Webpack' },
              { id: 'code-split', label: '代码分割' },
              { id: 'tree-shaking', label: 'Tree Shaking' },
              { id: 'optimization', label: '构建优化' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition text-sm ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'vite-vs-webpack' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Vite vs Webpack</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">特性</th>
                    <th className="p-2 text-left">Vite</th>
                    <th className="p-2 text-left">Webpack</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs">
                  <tr>
                    <td className="p-2 font-semibold">冷启动速度</td>
                    <td className="p-2 text-green-600">⚡ 秒级（无需打包）</td>
                    <td className="p-2 text-orange-600">⏱️ 分钟级（需打包）</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">热更新速度</td>
                    <td className="p-2 text-green-600">⚡ &lt;100ms</td>
                    <td className="p-2 text-orange-600">⏱️ 1-5s</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">生产构建</td>
                    <td className="p-2">Rollup（体积小）</td>
                    <td className="p-2">Webpack（配置灵活）</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">配置复杂度</td>
                    <td className="p-2 text-green-600">简单（零配置）</td>
                    <td className="p-2 text-orange-600">复杂（需配置）</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">生态成熟度</td>
                    <td className="p-2">新（2020）</td>
                    <td className="p-2 text-green-600">成熟（2012）</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">开发原理</td>
                    <td className="p-2">ESM 按需加载</td>
                    <td className="p-2">Bundle 全量打包</td>
                  </tr>
                </tbody>
              </table>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2">
{`// Vite 开发原理（ESM）
import { foo } from './foo.js';  // 浏览器直接请求 foo.js
import { bar } from './bar.js';  // 浏览器直接请求 bar.js
// ✅ 按需加载，修改 foo.js 只更新 foo.js

// Webpack 开发原理（Bundle）
// 1. 入口文件 -> 依赖分析 -> 打包成 bundle.js
// 2. 修改任何文件 -> 重新打包整个 bundle
// ❌ 全量打包，速度随项目增大而变慢`}
              </pre>
            </div>
          )}

          {activeTab === 'code-split' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">代码分割策略</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">🎯 核心目标：减少首屏加载时间</p>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// ===== 方案 1: 路由懒加载（最常用）=====
// React Router
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/Home'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const SettingsPage = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  );
}

// ===== 方案 2: 组件懒加载 =====
const HeavyChart = lazy(() => import('./components/HeavyChart'));

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton />}>
        <HeavyChart data={data} />
      </Suspense>
    </div>
  );
}

// ===== 方案 3: 按需加载（第三方库）=====
// ❌ 错误：全量引入
import _ from 'lodash';
console.log(_.debounce);

// ✅ 正确：按需引入
import debounce from 'lodash/debounce';

// ✅ 更好：使用 lodash-es（支持 Tree Shaking）
import { debounce } from 'lodash-es';

// ===== 方案 4: Vite 配置手动分包 =====
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 全家桶单独打包
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI 库单独打包
          'ui-vendor': ['antd', '@ant-design/icons'],
          // 工具库单独打包
          'utils': ['lodash-es', 'dayjs', 'axios'],
        }
      }
    }
  }
}`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'tree-shaking' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Tree Shaking 原理</h4>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-green-900 mb-2">🌳 摇树优化：删除未使用的代码</p>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// ===== 如何生效 Tree Shaking =====

// 1. 使用 ES Module（必须！）
// ✅ 支持 Tree Shaking
export function foo() { }
export function bar() { }

import { foo } from './utils'; // 只打包 foo，bar 被删除

// ❌ 不支持 Tree Shaking
module.exports = { foo, bar };
const { foo } = require('./utils'); // foo 和 bar 都会被打包

// 2. 避免副作用（Side Effects）
// ✅ 纯函数，可以安全删除
export function add(a, b) {
  return a + b;
}

// ❌ 有副作用，不会被删除
export function init() {
  window.myGlobal = 'value'; // 修改全局变量
  console.log('Initializing...'); // 控制台输出
}

// 3. package.json 标记副作用
{
  "name": "my-lib",
  "sideEffects": false, // 告诉打包工具：我的代码无副作用，可以安全 Tree Shaking
  
  // 或者指定有副作用的文件
  "sideEffects": [
    "*.css",  // CSS 文件有副作用
    "./src/polyfills.js"  // polyfill 有副作用
  ]
}

// ===== 实战案例 =====

// ❌ 错误：导入整个库（2MB）
import moment from 'moment';
console.log(moment().format('YYYY-MM-DD'));

// ✅ 正确：使用轻量级替代（6KB）
import dayjs from 'dayjs';
console.log(dayjs().format('YYYY-MM-DD'));

// ❌ 错误：Lodash 全量导入（70KB）
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ 正确：lodash-es 按需导入（2KB）
import { debounce } from 'lodash-es';
debounce(fn, 300);`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'optimization' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Vite 构建优化配置</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    // 打包体积分析
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  // ===== 1. 依赖预构建优化 =====
  optimizeDeps: {
    // 强制预构建（提升开发速度）
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'lodash-es',
    ],
    // 排除预构建（动态导入的库）
    exclude: ['@vite/client'],
  },

  // ===== 2. 构建优化 =====
  build: {
    // 目标浏览器
    target: 'es2015',
    
    // 生成 sourcemap（方便调试）
    sourcemap: false,
    
    // chunk 大小警告阈值
    chunkSizeWarningLimit: 500,
    
    // Rollup 配置
    rollupOptions: {
      output: {
        // ===== 手动分包 =====
        manualChunks(id) {
          // node_modules 按包名分割
          if (id.includes('node_modules')) {
            // React 全家桶
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // UI 库
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'ui-vendor';
            }
            // 其他第三方库
            return 'vendor';
          }
        },
        
        // ===== 文件命名 =====
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
      },
    },
    
    // ===== 3. 压缩配置 =====
    minify: 'terser',
    terserOptions: {
      compress: {
        // 删除 console
        drop_console: true,
        // 删除 debugger
        drop_debugger: true,
      },
    },
  },

  // ===== 4. 服务器配置 =====
  server: {
    // 端口
    port: 3000,
    // 自动打开浏览器
    open: true,
    // 代理配置（解决跨域）
    proxy: {
      '/api': {
        target: 'https://api.stepfun.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, ''),
      },
    },
  },
});

// ===== 5. 环境变量优化 =====
// .env.production
VITE_API_URL=https://api.stepfun.com
VITE_CDN_URL=https://cdn.example.com

// 使用
import.meta.env.VITE_API_URL`}
              </pre>
            </div>
          )}
        </div>

        {/* 构建对比演示 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📦 构建优化效果对比</h3>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => runMockBuild('before')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              优化前构建
            </button>
            <button
              onClick={() => runMockBuild('after')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              优化后构建
            </button>
          </div>

          {buildStats && (
            <div className={`p-4 rounded-lg ${buildStats.status === 'slow' ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 text-xs">总大小</div>
                  <div className="font-bold text-lg">{buildStats.totalSize}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">主 Chunk</div>
                  <div className="font-bold text-lg">{buildStats.mainChunk}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Vendor</div>
                  <div className="font-bold text-lg">{buildStats.vendorChunk}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Chunk 数量</div>
                  <div className="font-bold text-lg">{buildStats.chunks} 个</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">构建时间</div>
                  <div className={`font-bold text-lg ${buildStats.status === 'slow' ? 'text-red-600' : 'text-green-600'}`}>
                    {buildStats.buildTime}
                  </div>
                </div>
              </div>
              {buildStats.status === 'fast' && (
                <div className="mt-3 text-green-700 text-xs">
                  ✅ 体积减少 57%，构建速度提升 5.4x
                </div>
              )}
            </div>
          )}
        </div>

        {/* 思维体系 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">🧠 思维体系定位</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-purple-900 mb-2">🏗️ 工程化</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 构建工具选型</li>
                <li>• 打包优化策略</li>
                <li>• 性能监控</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-blue-900 mb-2">⚡ 性能优化</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 代码分割</li>
                <li>• Tree Shaking</li>
                <li>• 懒加载</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-green-900 mb-2">📦 模块化</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• ESM vs CJS</li>
                <li>• 依赖管理</li>
                <li>• Bundle 分析</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 面试 QA */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 面试高频 QA</h3>
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: Vite 为什么比 Webpack 快？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-semibold text-green-900 mb-2">核心原因：</p>
                  <ol className="text-xs space-y-2">
                    <li><strong>1. 开发模式：</strong>
                      <br/>• Vite: 基于 ESM，浏览器按需加载模块，无需打包
                      <br/>• Webpack: 全量打包成 bundle，启动慢
                    </li>
                    <li><strong>2. 热更新（HMR）：</strong>
                      <br/>• Vite: 只更新修改的模块
                      <br/>• Webpack: 重新打包相关模块
                    </li>
                    <li><strong>3. 依赖预构建：</strong>
                      <br/>• Vite: esbuild 预构建依赖（Go 编写，速度快 10-100x）
                      <br/>• Webpack: JavaScript 实现，速度慢
                    </li>
                  </ol>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 什么是 Tree Shaking？如何生效？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-blue-900 mb-2">📚 定义：</p>
                  <p className="text-xs mb-2">基于 ES Module 的静态分析，删除未使用的代码（Dead Code Elimination）</p>
                  <p className="font-semibold text-blue-900 mb-2">✅ 生效条件：</p>
                  <ol className="text-xs space-y-1 list-decimal ml-5">
                    <li>使用 ES Module（import/export）</li>
                    <li>代码无副作用（或标记 sideEffects: false）</li>
                    <li>生产环境构建</li>
                    <li>使用支持 Tree Shaking 的打包工具</li>
                  </ol>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 如何分析打包体积？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 1. rollup-plugin-visualizer
npm install --save-dev rollup-plugin-visualizer

// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';
export default {
  plugins: [
    visualizer({
      open: true, // 自动打开
      gzipSize: true,
      brotliSize: true,
    })
  ]
}

// 2. vite-bundle-analyzer  
npm install --save-dev vite-bundle-analyzer

// 3. 命令行查看
npm run build -- --report

// 4. webpack-bundle-analyzer (Webpack)
npx webpack-bundle-analyzer dist/stats.json`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 代码分割有哪些方式？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-purple-50 p-3 rounded">
                  <ol className="text-xs space-y-2 list-decimal ml-5">
                    <li><strong>路由懒加载：</strong>React.lazy() + Suspense</li>
                    <li><strong>组件懒加载：</strong>按需加载重型组件</li>
                    <li><strong>第三方库按需引入：</strong>lodash-es</li>
                    <li><strong>动态 import()：</strong>条件加载</li>
                    <li><strong>手动分包：</strong>manualChunks 配置</li>
                  </ol>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q5: 生产环境如何优化首屏加载？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-teal-50 p-3 rounded">
                  <p className="font-semibold text-teal-900 mb-2">🚀 综合优化方案：</p>
                  <ol className="text-xs space-y-2 list-decimal ml-5">
                    <li><strong>代码层面：</strong>
                      <br/>• 路由懒加载
                      <br/>• Tree Shaking
                      <br/>• 删除 console.log
                    </li>
                    <li><strong>资源层面：</strong>
                      <br/>• 图片压缩/WebP 格式
                      <br/>• 字体子集化
                      <br/>• CDN 加速
                    </li>
                    <li><strong>网络层面：</strong>
                      <br/>• HTTP/2 多路复用
                      <br/>• Gzip/Brotli 压缩
                      <br/>• 浏览器缓存（Cache-Control）
                    </li>
                    <li><strong>渲染层面：</strong>
                      <br/>• SSR/SSG（Next.js）
                      <br/>• 骨架屏/Loading
                      <br/>• 关键 CSS 内联
                    </li>
                  </ol>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* 最佳实践 */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-cyan-900 mb-4">✅ Vite 最佳实践</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">✅ 应该做的</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 使用 ESM 模块（import/export）</li>
                <li>• 配置依赖预构建（optimizeDeps）</li>
                <li>• 手动分包（manualChunks）</li>
                <li>• 使用 visualizer 分析体积</li>
                <li>• 路由懒加载 + Suspense</li>
                <li>• 按需引入第三方库</li>
                <li>• 生产环境删除 console</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">❌ 不应该做的</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 全量引入 lodash（用 lodash-es）</li>
                <li>• 全量引入 moment（用 dayjs）</li>
                <li>• 使用 CommonJS（module.exports）</li>
                <li>• 忽略 chunk 大小警告</li>
                <li>• 所有代码打包成一个文件</li>
                <li>• 不分析打包产物</li>
                <li>• 开发环境使用生产构建</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 常见陷阱 */}
        <div className="bg-gradient-to-r from-yellow-50 to-red-50 border-2 border-yellow-400 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-900 mb-4">⚠️ 常见陷阱</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
              <h4 className="font-semibold text-red-900 mb-2">❌ 陷阱 1：ESM 和 CJS 混用</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 混用导致 Tree Shaking 失效
import foo from 'esm-lib';
const bar = require('cjs-lib'); // CommonJS

// ✅ 统一使用 ESM
import foo from 'esm-lib';
import bar from 'cjs-lib';`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900 mb-2">❌ 陷阱 2：动态 import 路径</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 完全动态路径无法分析
const lang = 'zh-CN';
import(\`./locales/\${lang}.js\`); // Vite 无法静态分析

// ✅ 使用有限的动态路径
import(\`./locales/\${lang}.js\`); // 确保 ./locales 下所有文件都存在

// ✅ 或使用预定义映射
const locales = {
  'zh-CN': () => import('./locales/zh-CN.js'),
  'en-US': () => import('./locales/en-US.
