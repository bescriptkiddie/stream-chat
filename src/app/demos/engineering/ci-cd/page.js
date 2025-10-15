'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function CICDDemo() {
  const [activeTab, setActiveTab] = useState('github-actions');
  const [pipelineStatus, setPipelineStatus] = useState(null);

  const runMockPipeline = () => {
    setPipelineStatus({ stage: 'installing', status: 'running' });
    
    setTimeout(() => {
      setPipelineStatus({ stage: 'installing', status: 'success' });
      setPipelineStatus({ stage: 'linting', status: 'running' });
    }, 1000);
    
    setTimeout(() => {
      setPipelineStatus({ stage: 'linting', status: 'success' });
      setPipelineStatus({ stage: 'testing', status: 'running' });
    }, 2000);
    
    setTimeout(() => {
      setPipelineStatus({ stage: 'testing', status: 'success' });
      setPipelineStatus({ stage: 'building', status: 'running' });
    }, 3500);
    
    setTimeout(() => {
      setPipelineStatus({ stage: 'building', status: 'success' });
      setPipelineStatus({ stage: 'deploying', status: 'running' });
    }, 5000);
    
    setTimeout(() => {
      setPipelineStatus({ stage: 'deploying', status: 'success' });
      setPipelineStatus({ stage: 'completed', status: 'success' });
    }, 6500);
  };

  const stages = [
    { id: 'installing', name: '安装依赖', icon: '📦' },
    { id: 'linting', name: '代码检查', icon: '🔍' },
    { id: 'testing', name: '运行测试', icon: '🧪' },
    { id: 'building', name: '构建打包', icon: '🏗️' },
    { id: 'deploying', name: '部署上线', icon: '🚀' }
  ];

  return (
    <DemoContainer
      title="CI/CD 流程"
      description="GitHub Actions + 自动化部署"
    >
      <div className="space-y-6">
        {/* CI/CD 核心概念 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">🔄 CI/CD 是什么？</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">CI - 持续集成</h4>
              <p className="text-xs text-gray-700 mb-2">Continuous Integration</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 代码提交触发自动构建</li>
                <li>• 自动运行测试</li>
                <li>• 代码质量检查（Lint）</li>
                <li>• 及早发现问题</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">CD - 持续部署</h4>
              <p className="text-xs text-gray-700 mb-2">Continuous Deployment</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 自动部署到生产环境</li>
                <li>• 零停机部署</li>
                <li>• 快速回滚</li>
                <li>• 提升发布频率</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pipeline 可视化演示 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🔄 CI/CD Pipeline 演示</h3>
          <button
            onClick={runMockPipeline}
            className="mb-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            运行 Pipeline
          </button>
          
          <div className="space-y-3">
            {stages.map((stage, idx) => {
              const isActive = pipelineStatus?.stage === stage.id;
              const isPassed = pipelineStatus && stages.findIndex(s => s.id === pipelineStatus.stage) > idx;
              const isRunning = isActive && pipelineStatus.status === 'running';
              const isSuccess = isActive && pipelineStatus.status === 'success' || isPassed;
              
              return (
                <div 
                  key={stage.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition ${
                    isRunning ? 'border-blue-500 bg-blue-50' :
                    isSuccess ? 'border-green-500 bg-green-50' :
                    'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="text-2xl">{stage.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{stage.name}</div>
                    <div className="text-xs text-gray-600">
                      {isRunning && '运行中...'}
                      {isSuccess && '✓ 完成'}
                      {!isRunning && !isSuccess && '等待中'}
                    </div>
                  </div>
                  {isRunning && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  )}
                  {isSuccess && (
                    <div className="text-green-600 text-xl">✓</div>
                  )}
                </div>
              );
            })}
          </div>
          
          {pipelineStatus?.stage === 'completed' && (
            <div className="mt-4 p-3 bg-green-100 border-2 border-green-500 rounded-lg text-green-900 text-sm">
              🎉 Pipeline 执行成功！代码已部署到生产环境
            </div>
          )}
        </div>

        {/* CI/CD 工具对比 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🛠️ CI/CD 工具选择</h3>
          <div className="flex gap-2 mb-4">
            {['github-actions', 'gitlab-ci', 'jenkins', 'vercel'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-lg transition text-xs ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab === 'github-actions' && 'GitHub Actions'}
                {tab === 'gitlab-ci' && 'GitLab CI'}
                {tab === 'jenkins' && 'Jenkins'}
                {tab === 'vercel' && 'Vercel'}
              </button>
            ))}
          </div>

          {activeTab === 'github-actions' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">GitHub Actions（推荐）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

jobs:
  # ===== Job 1: 代码检查和测试 =====
  test:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v3
      
      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: 安装 pnpm
        run: npm install -g pnpm
      
      - name: 安装依赖
        run: pnpm install --frozen-lockfile
      
      - name: 代码检查
        run: pnpm run lint
      
      - name: 类型检查
        run: pnpm run type-check
      
      - name: 运行测试
        run: pnpm run test
      
      - name: 生成覆盖率报告
        run: pnpm run test:coverage
      
      - name: 上传覆盖率到 Codecov
        uses: codecov/codecov-action@v3
        with:
          token: \${{ secrets.CODECOV_TOKEN }}

  # ===== Job 2: 构建和部署 =====
  deploy:
    needs: test  # 依赖 test job 成功
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'  # 只在 main 分支部署
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v3
      
      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: 安装依赖
        run: pnpm install
      
      - name: 构建项目
        run: pnpm run build
        env:
          VITE_API_URL: \${{ secrets.VITE_API_URL }}
      
      - name: 部署到 Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: 通知部署成功
        if: success()
        run: |
          curl -X POST \${{ secrets.SLACK_WEBHOOK }} \\
            -H 'Content-Type: application/json' \\
            -d '{"text":"🚀 部署成功！"}'`}
              </pre>
            </div>
          )}

          {activeTab === 'gitlab-ci' && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">GitLab CI</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# .gitlab-ci.yml
stages:
  - install
  - test
  - build
  - deploy

# 缓存 node_modules
cache:
  paths:
    - node_modules/

install:
  stage: install
  script:
    - npm install

lint:
  stage: test
  script:
    - npm run lint

test:
  stage: test
  script:
    - npm run test
  coverage: '/Lines\\s*:\\s*(\\d+\\.\\d+)%/'

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy_production:
  stage: deploy
  only:
    - main
  script:
    - npm run deploy
  environment:
    name: production
    url: https://app.stepfun.com`}
              </pre>
            </div>
          )}

          {activeTab === 'jenkins' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Jenkins</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// Jenkinsfile
pipeline {
  agent any
  
  stages {
    stage('安装依赖') {
      steps {
        sh 'npm install'
      }
    }
    
    stage('代码检查') {
      steps {
        sh 'npm run lint'
      }
    }
    
    stage('运行测试') {
      steps {
        sh 'npm run test'
      }
    }
    
    stage('构建') {
      steps {
        sh 'npm run build'
      }
    }
    
    stage('部署') {
      when {
        branch 'main'
      }
      steps {
        sh 'npm run deploy'
      }
    }
  }
  
  post {
    success {
      echo '🎉 Pipeline 执行成功！'
    }
    failure {
      echo '❌ Pipeline 执行失败！'
    }
  }
}`}
              </pre>
            </div>
          )}

          {activeTab === 'vercel' && (
            <div className="bg-black text-white p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Vercel（零配置部署）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署（首次）
vercel

# 4. 部署到生产环境
vercel --prod

# 5. vercel.json 配置
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}

# ✅ 优势：
# • 自动检测框架（Next.js/Vite/React）
# • 自动 HTTPS
# • 全球 CDN
# • 自动预览部署（PR）
# • 零停机部署`}
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
                <li>• 自动化流程</li>
                <li>• 持续集成</li>
                <li>• 持续部署</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-blue-900 mb-2">🔒 质量保证</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 自动化测试</li>
                <li>• 代码审查</li>
                <li>• 及早发现问题</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-green-900 mb-2">⚡ 效率提升</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 快速部署</li>
                <li>• 快速回滚</li>
                <li>• 降低风险</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 实战案例 */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">🚀 阶跃星辰 AI 实战案例</h3>
          <div className="space-y-3">
            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                1️⃣ 前端项目 CI/CD 完整流程
              </summary>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2">
{`# .github/workflows/deploy.yml
name: Deploy StepFun Chat

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Lint
        run: pnpm run lint
      
      - name: Test
        run: pnpm run test
      
      - name: Build
        run: pnpm run build
        env:
          VITE_STEPFUN_API_KEY: \${{ secrets.STEPFUN_API_KEY }}
          VITE_API_BASE_URL: https://api.stepfun.com
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'`}
              </pre>
            </details>

            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                2️⃣ 多环境部署（开发/测试/生产）
              </summary>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2">
{`# .github/workflows/multi-env.yml
name: Multi-Environment Deploy

on:
  push:
    branches:
      - dev      # 开发环境
      - staging  # 测试环境
      - main     # 生产环境

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Determine environment
        id: env
        run: |
          if [[ \${{ github.ref }} == 'refs/heads/main' ]]; then
            echo "ENV=production" >> $GITHUB_OUTPUT
            echo "API_URL=https://api.stepfun.com" >> $GITHUB_OUTPUT
          elif [[ \${{ github.ref }} == 'refs/heads/staging' ]]; then
            echo "ENV=staging" >> $GITHUB_OUTPUT
            echo "API_URL=https://api-staging.stepfun.com" >> $GITHUB_OUTPUT
          else
            echo "ENV=development" >> $GITHUB_OUTPUT
            echo "API_URL=https://api-dev.stepfun.com" >> $GITHUB_OUTPUT
          fi
      
      - name: Build for \${{ steps.env.outputs.ENV }}
        run: pnpm run build
        env:
          VITE_API_URL: \${{ steps.env.outputs.API_URL }}
          VITE_ENV: \${{ steps.env.outputs.ENV }}
      
      - name: Deploy
        run: vercel deploy --prod=${{ steps.env.outputs.ENV == 'production' }}`}
              </pre>
            </details>

            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                3️⃣ PR 预览部署（Preview Deploy）
              </summary>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs mt-2">
{`# .github/workflows/pr-preview.yml
name: PR Preview Deploy

on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Preview
        uses: amondnet/vercel-action@v20
        id: deploy
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
      
      - name: Comment Preview URL
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.name,
              body: '🚀 Preview deployed: \${{ steps.deploy.outputs.preview-url }}'
            })`}
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
                Q1: CI/CD 的好处是什么？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-semibold text-green-900 mb-2">✅ 核心价值：</p>
                  <ol className="text-xs space-y-2 list-decimal ml-5">
                    <li><strong>提升效率：</strong>自动化构建部署，从手动 30 分钟 → 自动 5 分钟</li>
                    <li><strong>降低风险：</strong>每次提交都测试，及早发现问题</li>
                    <li><strong>快速反馈：</strong>代码问题几分钟内就能发现</li>
                    <li><strong>频繁发布：</strong>每天可以发布多次，而不是每周一次</li>
                    <li><strong>一致性：</strong>所有环境使用相同的构建流程</li>
                    <li><strong>可追溯：</strong>每次部署都有记录，方便回滚</li>
                  </ol>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: GitHub Actions 的核心概念？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-blue-50 p-3 rounded">
                  <ul className="text-xs space-y-2">
                    <li><strong>Workflow：</strong>工作流，定义在 .github/workflows/*.yml</li>
                    <li><strong>Job：</strong>任务，一个 workflow 包含多个 job</li>
                    <li><strong>Step：</strong>步骤，一个 job 包含多个 step</li>
                    <li><strong>Action：</strong>可复用的步骤（如 actions/checkout@v3）</li>
                    <li><strong>Runner：</strong>执行环境（ubuntu-latest/windows/macos）</li>
                    <li><strong>Event：</strong>触发条件（push/pull_request/schedule）</li>
                  </ul>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 如何优化 CI/CD 速度？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="font-semibold text-yellow-900 mb-2">⚡ 优化策略：</p>
                  <ol className="text-xs space-y-2 list-decimal ml-5">
                    <li><strong>缓存依赖：</strong>缓存 node_modules（actions/cache）</li>
                    <li><strong>并行执行：</strong>多个 job 并行运行</li>
                    <li><strong>增量构建：</strong>只构建变化的部分</li>
                    <li><strong>Docker 镜像：</strong>使用预构建镜像</li>
                    <li><strong>矩阵策略：</strong>多版本并行测试</li>
                    <li><strong>按需触发：</strong>只在必要时运行（paths 过滤）</li>
                  </ol>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 如何管理环境变量和密钥？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`# 1. GitHub Secrets（推荐）
# Settings -> Secrets and variables -> Actions
# 添加 secret: VERCEL_TOKEN

# 2. 在 workflow 中使用
env:
  API_KEY: \${{ secrets.API_KEY }}

# 3. 不同环境使用不同密钥
env:
  API_URL: \${{ 
    github.ref == 'refs/heads/main' && 
    secrets.PROD_API_URL || 
    secrets.DEV_API_URL 
  }}

# 4. 环境变量文件
# .env.production（不提交）
# .env.example（提交，作为模板）

# ⚠️ 注意：
# • 永远不要在代码中硬编码密钥
# • 不要在日志中打印密钥
# • 使用 GitHub Secrets 管理敏感信息`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q5: 部署失败如何快速回滚？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-red-50 p-3 rounded">
                  <p className="font-semibold text-red-900 mb-2">🔄 回滚策略：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`# 1. Vercel 快速回滚
vercel rollback

# 2. Git 回滚
git revert <commit-hash>
git push origin main

# 3. 蓝绿部署（Zero Downtime）
# • 部署新版本到新环境
# • 测试通过后切换流量
# • 出问题立即切回旧环境

# 4. 金丝雀发布（Canary）
# • 5% 流量到新版本
# • 观察指标正常后逐步放量
# • 10% -> 50% -> 100%

# 5. 自动回滚
# • 监控关键指标（错误率/响应时间）
# • 指标异常自动回滚`}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* 最佳实践 */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-cyan-900 mb-4">✅ CI/CD 最佳实践</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">✅ 应该做的</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 每次提交都触发 CI</li>
                <li>• 测试失败阻止合并</li>
                <li>• 自动化部署到测试环境</li>
                <li>• 手动确认后部署到生产</li>
                <li>• 使用 Secrets 管理密钥</li>
                <li>• 缓存依赖提升速度</li>
                <li>• 部署成功后发送通知</li>
                <li>• 保留部署历史记录</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">❌ 不应该做的</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 跳过测试直接部署</li>
                <li>• 在代码中硬编码密钥</li>
                <li>• 手动部署到生产环境</li>
                <li>• 没有回滚机制</li>
                <li>• 忽略 CI 失败</li>
                <li>• 测试和部署串行执行</li>
                <li>• 没有环境隔离</li>
                <li>• 不监控部署状态</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 常见陷阱 */}
        <div className="bg-gradient-to-r from-yellow-50 to-red-50 border-2 border-yellow-400 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-900 mb-4">⚠️ 常见陷阱</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
              <h4 className="font-semibold text-red-900 mb-2">❌ 陷阱 1：密钥泄露</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：硬编码密钥
const API_KEY = 'sk-123456789';

// ❌ 错误：提交 .env 文件
git add .env

// ✅ 正确：使用 GitHub Secrets
env:
  API_KEY: \${{ secrets.API_KEY }}

// ✅ 正确：.gitignore 忽略
.env
.env.local
.env.production`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900 mb-2">❌ 陷阱 2：没有缓存导致构建慢</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：每次都重新安装依赖
- run: npm install  # 5 分钟

// ✅ 正确：缓存 node_modules
- uses: actions/cache@v3
  with:
    path: node_modules
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
- run: npm install  # 10 秒`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900 mb-2">❌ 陷阱 3：没有回滚机制</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：部署后无法回滚
deploy:
  - run: npm run deploy
  # 出问题了怎么办？

// ✅ 正确：支持快速回滚
deploy:
  - run: npm run deploy
  - name: Rollback on failure
    if: failure()
    run: vercel rollback`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
