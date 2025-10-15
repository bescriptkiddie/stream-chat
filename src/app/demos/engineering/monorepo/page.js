'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function MonorepoDemo() {
  const [activeTab, setActiveTab] = useState('structure');

  return (
    <DemoContainer
      title="Monorepo 管理"
      description="pnpm workspace + Turborepo 多包管理"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">📦 Monorepo 是什么？</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-900 mb-2">Monorepo（单一仓库）</h4>
              <p className="text-xs text-gray-700 mb-2">多个项目/包在同一个 Git 仓库中</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>✅ 代码复用方便</li>
                <li>✅ 统一版本管理</li>
                <li>✅ 原子化提交</li>
                <li>✅ 依赖管理简单</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-600 mb-2">Multirepo（多个仓库）</h4>
              <p className="text-xs text-gray-700 mb-2">每个项目/包在独立的 Git 仓库中</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>❌ 代码复用困难</li>
                <li>❌ 版本管理复杂</li>
                <li>❌ 跨仓库修改麻烦</li>
                <li>❌ 依赖升级困难</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 使用 Monorepo 的公司 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">🏢 谁在使用 Monorepo？</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Google', desc: '所有项目在一个仓库' },
              { name: 'Facebook', desc: 'React/React Native' },
              { name: 'Microsoft', desc: 'VS Code' },
              { name: 'Vercel', desc: 'Next.js/Turbo' },
              { name: 'Babel', desc: '数百个包' },
              { name: 'Vue', desc: 'Vue 3 生态' }
            ].map((company, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg shadow text-center">
                <div className="font-semibold text-sm text-gray-900">{company.name}</div>
                <div className="text-xs text-gray-600 mt-1">{company.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monorepo 工具对比 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🛠️ Monorepo 工具选择</h3>
          <div className="flex gap-2 mb-4 flex-wrap">
            {['structure', 'pnpm', 'turborepo', 'nx', 'lerna'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-lg transition text-xs ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab === 'structure' && '目录结构'}
                {tab === 'pnpm' && 'pnpm workspace'}
                {tab === 'turborepo' && 'Turborepo'}
                {tab === 'nx' && 'Nx'}
                {tab === 'lerna' && 'Lerna'}
              </button>
            ))}
          </div>

          {activeTab === 'structure' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">典型 Monorepo 目录结构</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`stepfun-monorepo/
├── packages/               # 共享包
│   ├── ui/                # UI 组件库
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── utils/             # 工具函数
│   │   ├── src/
│   │   │   ├── format.ts
│   │   │   ├── validate.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── config/            # 共享配置
│       ├── eslint-config/
│       ├── tsconfig/
│       └── vite-config/
│
├── apps/                  # 应用项目
│   ├── web/               # Web 应用
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── admin/             # 管理后台
│   │   ├── src/
│   │   └── package.json
│   │
│   └── mobile/            # 移动端
│       ├── src/
│       └── package.json
│
├── package.json           # 根 package.json
├── pnpm-workspace.yaml    # pnpm 配置
├── turbo.json             # Turborepo 配置
└── tsconfig.json          # 根 TypeScript 配置

# 优势：
# ✅ 代码复用：apps/web 直接引用 packages/ui
# ✅ 统一工具：所有项目共享 ESLint/TS 配置
# ✅ 原子提交：一次提交同时更新 UI 和使用方
# ✅ 依赖提升：node_modules 提升到根目录`}
              </pre>
            </div>
          )}

          {activeTab === 'pnpm' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">pnpm workspace（推荐）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# ===== 1. pnpm-workspace.yaml =====
packages:
  - 'apps/*'
  - 'packages/*'

# ===== 2. 根 package.json =====
{
  "name": "stepfun-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.0.0"
  }
}

# ===== 3. packages/ui/package.json =====
{
  "name": "@stepfun/ui",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}

# ===== 4. apps/web/package.json =====
{
  "name": "web",
  "dependencies": {
    "@stepfun/ui": "workspace:*",      # 引用本地包
    "@stepfun/utils": "workspace:*",
    "react": "^18.0.0"
  }
}

# ===== 5. 使用（apps/web/src/App.tsx）=====
import { Button } from '@stepfun/ui';  # 直接引用本地包
import { formatDate } from '@stepfun/utils';

# ===== 6. pnpm 命令 =====
# 安装所有依赖
pnpm install

# 给特定包安装依赖
pnpm add react --filter web
pnpm add lodash --filter @stepfun/utils

# 运行所有包的 dev
pnpm -r dev

# 只运行 web 的 dev
pnpm --filter web dev

# 构建所有包
pnpm -r build

# 优势：
# ✅ 速度快（硬链接）
# ✅ 节省空间（依赖去重）
# ✅ 严格依赖（幽灵依赖问题少）`}
              </pre>
            </div>
          )}

          {activeTab === 'turborepo' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Turborepo（极速构建）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# ===== turbo.json =====
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],        # 依赖包先构建
      "outputs": ["dist/**", ".next/**"],
      "cache": true                   # 缓存构建结果
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "cache": true
    }
  }
}

# ===== 核心特性 =====

# 1. 增量构建（只构建变化的包）
turbo run build
# ✅ @stepfun/ui 变化了 -> 重新构建
# ✅ web 依赖 ui -> 重新构建
# ⏭️ admin 没变化 -> 跳过构建（使用缓存）

# 2. 并行执行（最大化利用 CPU）
turbo run build --parallel
# 同时构建所有无依赖关系的包

# 3. 远程缓存（团队共享）
turbo run build --token=<your-token>
# ✅ A 同学构建过的，B 同学直接用缓存
# 首次构建 5 分钟 -> 有缓存 10 秒

# 4. 依赖图可视化
turbo run build --graph
# 生成 .turbo/graph.html

# 5. 过滤执行
turbo run build --filter=web...  # 只构建 web 及其依赖
turbo run test --filter=...ui    # 只测试 ui 及其依赖者

# ===== 性能对比 =====
# 传统方式：
cd packages/ui && npm run build     # 30s
cd packages/utils && npm run build  # 20s
cd apps/web && npm run build        # 60s
cd apps/admin && npm run build      # 50s
# 总计：160s（串行）

# Turborepo：
turbo run build
# ✅ ui + utils 并行构建（30s）
# ✅ web + admin 并行构建（60s）
# ✅ 使用缓存后续构建（5s）
# 总计：30s（首次） -> 5s（缓存）`}
              </pre>
            </div>
          )}

          {activeTab === 'nx' && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Nx（企业级方案）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# ===== 安装 =====
npx create-nx-workspace@latest

# ===== 核心特性 =====

# 1. 智能依赖图
nx graph

# 2. 受影响分析（只测试变化的包）
nx affected:test
nx affected:build

# 3. 代码生成器
nx generate @nrwl/react:component Button

# 4. 分布式任务执行
nx run-many --target=build --projects=app1,app2 --parallel

# 5. 云缓存
nx run build --with-cloud-cache

# ===== 优势 =====
# ✅ 功能最全（代码生成/插件系统）
# ✅ 智能分析（只测试受影响的包）
# ✅ 可视化工具（依赖图/性能分析）

# ===== 劣势 =====
# ❌ 学习曲线陡峭
# ❌ 配置复杂
# ❌ 侵入性强（需要适配）`}
              </pre>
            </div>
          )}

          {activeTab === 'lerna' && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Lerna（传统方案，逐渐被替代）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# ===== 安装 =====
npm install -g lerna
lerna init

# ===== lerna.json =====
{
  "version": "independent",
  "npmClient": "pnpm",
  "packages": ["packages/*", "apps/*"]
}

# ===== 常用命令 =====
lerna bootstrap  # 安装依赖
lerna run build  # 运行所有包的 build
lerna publish    # 发布包到 npm

# ===== 现状 =====
# ⚠️ Lerna 已经不太推荐了
# ✅ 替代方案：pnpm workspace + Turborepo
# • pnpm 更快、更省空间
# • Turborepo 缓存更智能`}
              </pre>
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
                <li>• 代码组织</li>
                <li>• 依赖管理</li>
                <li>• 构建优化</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-blue-900 mb-2">🔄 协作效率</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 代码复用</li>
                <li>• 统一工具链</li>
                <li>• 原子化提交</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-green-900 mb-2">⚡ 性能优化</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 增量构建</li>
                <li>• 并行执行</li>
                <li>• 远程缓存</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 实战案例 */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">🚀 阶跃星辰 AI Monorepo 实战</h3>
          <div className="space-y-3">
            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                1️⃣ 完整的 Monorepo 架构
              </summary>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2">
{`stepfun-ai/
├── apps/
│   ├── web/                    # 主站（chat.stepfun.com）
│   ├── admin/                  # 管理后台
│   ├── docs/                   # 文档站
│   └── mobile/                 # 移动端
│
├── packages/
│   ├── ui/                     # UI 组件库
│   │   ├── Button/
│   │   ├── Input/
│   │   └── ChatBubble/        # 聊天气泡组件
│   │
│   ├── api-client/             # API 客户端
│   │   ├── chat.ts            # 聊天 API
│   │   ├── streaming.ts       # 流式响应
│   │   └── auth.ts            # 认证
│   │
│   ├── hooks/                  # 共享 Hooks
│   │   ├── useDebounce.ts
│   │   ├── useChat.ts
│   │   └── useStreamResponse.ts
│   │
│   ├── utils/                  # 工具函数
│   │   ├── format.ts
│   │   ├── validate.ts
│   │   └── tokenizer.ts       # Token 计算
│   │
│   └── config/                 # 共享配置
│       ├── eslint-config/
│       ├── tsconfig/
│       └── vite-config/
│
├── pnpm-workspace.yaml
├── turbo.json
└── package.json

# 好处：
# ✅ web/admin 共享 UI 组件（Button/ChatBubble）
# ✅ 统一的 API 客户端（版本一致）
# ✅ 修改 Button 组件，所有应用自动同步
# ✅ 一键构建所有项目`}
              </pre>
            </details>

            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                2️⃣ 共享组件如何使用
              </summary>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2">
{`# ===== packages/ui/src/ChatBubble.tsx =====
export function ChatBubble({ message, role }: Props) {
  return (
    <div className={role === 'user' ? 'user-bubble' : 'ai-bubble'}>
      {message}
    </div>
  );
}

# ===== apps/web/src/Chat.tsx =====
import { ChatBubble } from '@stepfun/ui';  # 直接引用

function Chat() {
  return (
    <div>
      <ChatBubble message="Hello" role="user" />
      <ChatBubble message="Hi!" role="assistant" />
    </div>
  );
}

# ===== apps/admin/src/Logs.tsx =====
import { ChatBubble } from '@stepfun/ui';  # 管理后台也能用

# 好处：
# ✅ 修改 ChatBubble -> web/admin 自动同步
# ✅ 不需要发布 npm 包
# ✅ TypeScript 类型提示完美
# ✅ 热更新支持（修改组件立即生效）`}
              </pre>
            </details>

            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                3️⃣ Turborepo 加速构建
              </summary>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2">
{`# ===== turbo.json =====
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}

# ===== 构建场景 =====
# 场景 1：修改了 UI 组件
turbo run build
# ✅ @stepfun/ui 重新构建（20s）
# ✅ web 重新构建（依赖 ui，40s）
# ✅ admin 重新构建（依赖 ui，35s）
# ⏭️ docs 跳过（不依赖 ui，使用缓存）
# 总计：40s（并行）

# 场景 2：没修改任何代码
turbo run build
# ⚡ 全部使用缓存（3s）

# 场景 3：只修改了 web 代码
turbo run build
# ⏭️ ui/utils 跳过（使用缓存）
# ✅ web 重新构建（40s）
# ⏭️ admin/docs 跳过（使用缓存）
# 总计：40s

# 场景 4：团队协作（远程缓存）
# A 同学构建 -> 上传缓存
# B 同学拉代码 -> 直接用 A 的缓存
turbo run build --token=xxx
# ⚡ 5s（下载缓存）vs 5分钟（重新构建）`}
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
                Q1: Monorepo vs Multirepo 如何选择？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-semibold text-green-900 mb-2">✅ 适合 Monorepo：</p>
                    <ul className="text-xs space-y-1">
                      <li>• 多个相关联的项目</li>
                      <li>• 代码复用需求高</li>
                      <li>• 团队规模中小</li>
                      <li>• 需要原子化提交</li>
                      <li>• 例：UI 组件库 + 多个应用</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <p className="font-semibold text-red-900 mb-2">❌ 适合 Multirepo：</p>
                    <ul className="text-xs space-y-1">
                      <li>• 项目完全独立</li>
                      <li>• 团队规模大（权限隔离）</li>
                      <li>• 发布周期不同</li>
                      <li>• 技术栈差异大</li>
                      <li>• 例：电商 + 社交网络</li>
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: pnpm vs npm/yarn 为什么更快？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-blue-900 mb-2">⚡ pnpm 核心优势：</p>
                  <ol className="text-xs space-y-2 list-decimal ml-5">
                    <li><strong>硬链接（Hard Link）：</strong>
                      <br/>• npm/yarn: 复制依赖到 node_modules（占用大量空间）
                      <br/>• pnpm: 硬链接到全局 store（节省 50%+ 空间）
                    </li>
                    <li><strong>非扁平化：</strong>
                      <br/>• npm/yarn: 提升所有依赖到根目录（幽灵依赖）
                      <br/>• pnpm: 严格依赖（只能访问声明的依赖）
                    </li>
                    <li><strong>并行安装：</strong>
                      <br/>• 同时下载多个包
                    </li>
                  </ol>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: Turborepo 如何加速构建？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-semibold text-green-900 mb-2">🚀 核心机制：</p>
                  <ol className="text-xs space-y-2 list-decimal ml-5">
                    <li><strong>增量构建：</strong>只构建变化的包</li>
                    <li><strong>依赖分析：</strong>自动分析包之间的依赖关系</li>
                    <li><strong>并行执行：</strong>无依赖的包同时构建</li>
                    <li><strong>本地缓存：</strong>缓存构建结果（基于文件内容哈希）</li>
                    <li><strong>远程缓存：</strong>团队共享构建缓存</li>
                    <li><strong>Pipeline：</strong>定义任务执行顺序</li>
                  </ol>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`# 例子：
# 传统：A->B->C->D（串行，200s）
# Turborepo：(A+B)||C->D（并行+缓存，60s）`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: workspace协议（workspace:*）是什么？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`# apps/web/package.json
{
  "dependencies": {
    "@stepfun/ui": "workspace:*",     # 始终使用本地版本
    "@stepfun/utils": "workspace:^",  # 本地版本需符合 ^
    "react": "^18.0.0"                # 外部依赖
  }
}

# 含义：
# workspace:* - 任意本地版本
# workspace:^ - 符合 semver 的本地版本
# workspace:~ - 符合 patch 的本地版本

# 好处：
# ✅ 开发时用本地版本（热更新）
# ✅ 发布时自动替换为实际版本号
# ✅ 类型提示完美（直接引用源码）`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q5: 如何处理版本管理和发布？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-purple-50 p-3 rounded">
                  <p className="font-semibold text-purple-900 mb-2">📦 版本管理策略：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`# 1. 统一版本（Fixed）
# 所有包使用相同版本号
# 适合：紧密关联的包（React/React-DOM）
{
  "version": "1.0.0",
  "packages": ["packages/*"]
}

# 2. 独立版本（Independent）
# 每个包独立管理版本
# 适合：松散关联的包（Babel 插件）
{
  "version": "independent"
}

# 3. 发布流程（Changesets）
pnpm changeset        # 记录变更
pnpm changeset version # 更新版本号
pnpm publish -r       # 发布到 npm

# 4. 自动化发布（GitHub Actions）
# .github/workflows/release.yml
on:
  push:
    branches: [main]
jobs:
  release:
    - run: pnpm changeset version
    - run: pnpm publish -r
    - run: git push --follow-tags`}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* 最佳实践 */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-cyan-900 mb-4">✅ Monorepo 最佳实践</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">✅ 应该做的</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 使用 pnpm workspace</li>
                <li>• 配置 Turborepo 加速</li>
                <li>• 统一代码规范（ESLint/TS）</li>
                <li>• 共享配置（tsconfig/vite.config）</li>
                <li>• 原子化提交（同时修改多个包）</li>
                <li>• 使用 workspace:* 引用本地包</li>
                <li>• 开启远程缓存（团队协作）</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">❌ 不应该做的</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 包之间循环依赖</li>
                <li>• 直接修改 node_modules</li>
                <li>• 不同包使用不同工具链</li>
                <li>• 忽略依赖分析</li>
                <li>• 手动管理版本号</li>
                <li>• 所有代码放一个包里</li>
                <li>• 不配置缓存</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 常见陷阱 */}
        <div className="bg-gradient-to-r from-yellow-50 to-red-50 border-2 border-yellow-400 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-900 mb-4">⚠️ 常见陷阱</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
              <h4 className="font-semibold text-red-900 mb-2">❌ 陷阱 1：循环依赖</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：A 依赖 B，B 依赖 A
// packages/ui/Button.tsx
import { formatDate } from '@stepfun/utils';

// packages/utils/format.ts
import { Button } from '@stepfun/ui';  // 循环依赖！

// ✅ 正确：提取共享逻辑到第三个包
// packages/shared/
// packages/ui/ -> shared
// packages/utils/ -> shared`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900 mb-2">❌ 陷阱 2：忘记构建依赖包</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：直接运行 apps/web
cd apps/web && npm run dev
# 报错：找不到 @stepfun/ui

// ✅ 正确：先构建依赖
turbo run build --filter=@stepfun/ui
turbo run dev --filter=web

// ✅ 更好：使用 turbo pipeline
turbo run dev  # 自动处理依赖顺序`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900 mb-2">❌ 陷阱 3：幽灵依赖</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：使用未声明的依赖
// apps/web/src/App.tsx
import lodash from 'lodash';  # lodash 是 ui 包的依赖

// apps/web/package.json
{
  "dependencies": {
    "@stepfun/ui": "workspace:*"
    # 没有声明 lodash！
  }
}

// ✅ pnpm 会报错（严格依赖）
// ✅ 正确做法：显式声明
{
  "dependencies": {
    "@stepfun/ui": "workspace:*",
    "lodash": "^4.17.21"  # 显式声明
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
