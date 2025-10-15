#!/bin/bash

# 创建一个通用的404替代页面模板
create_placeholder_page() {
  local path=$1
  local title=$2
  local desc=$3
  
  cat > "$path" <<'EOF'
'use client';

import DemoContainer from '@/components/DemoContainer';

export default function PlaceholderDemo() {
  return (
    <DemoContainer
      title="TITLE_PLACEHOLDER"
      description="DESC_PLACEHOLDER"
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Demo 开发中</h2>
          <p className="text-gray-600 mb-4">
            此 Demo 正在开发中，敬请期待！
          </p>
          <p className="text-sm text-gray-500">
            您可以查看其他已完成的 Demo
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-2">📝 计划实现的功能</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 核心功能演示</li>
            <li>• 交互式示例</li>
            <li>• 代码实现展示</li>
            <li>• 面试要点总结</li>
          </ul>
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <h4 className="font-semibold text-indigo-900 mb-2">🔗 相关资源</h4>
          <div className="space-y-2 text-sm text-indigo-800">
            <a href="/" className="block hover:underline">← 返回首页查看所有 Demo</a>
            <a href="/PRIORITY.md" target="_blank" className="block hover:underline">查看学习优先级</a>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
EOF

  # 替换占位符
  sed -i '' "s/TITLE_PLACEHOLDER/$title/g" "$path"
  sed -i '' "s/DESC_PLACEHOLDER/$desc/g" "$path"
}

echo "开始创建页面..."

# 创建所有缺失的页面
