'use client';

import Link from 'next/link';
import DemoContainer from '@/components/DemoContainer';

export default function Demo() {
  return (
    <DemoContainer
      title="高级类型"
      description="联合/交叉/映射"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">💡 核心概念</h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-800 leading-relaxed">TypeScript强大的类型系统</p>
          </div>
        </div>

        {/* 代码示例区域 */}
        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg">
          <h4 className="font-semibold mb-3 text-lg">📝 代码示例</h4>
          <div className="bg-gray-800 p-4 rounded text-sm">
            <p className="text-gray-300">完整代码示例请参考相关技术文档</p>
            <p className="text-gray-400 text-xs mt-2">提示：实际项目中建议查阅官方文档和最佳实践</p>
          </div>
        </div>

        {/* 面试要点 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">❓ 面试高频考点</h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-800 leading-relaxed">联合是或，交叉是且</p>
          </div>
        </div>

        {/* 学习建议 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-2">💡 学习路径建议</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 深入理解核心概念和底层原理</li>
            <li>• 动手实践，编写完整示例代码</li>
            <li>• 在真实项目中应用并总结经验</li>
            <li>• 准备面试时能够清晰准确表达</li>
          </ul>
        </div>

        {/* 实用技巧 */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h4 className="font-semibold text-green-900 mb-2">🎯 实用技巧</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• 从简单示例入手，逐步深入</li>
            <li>• 对比学习，理解不同方案的优劣</li>
            <li>• 记录遇到的问题和解决方案</li>
            <li>• 关注最新技术动态和最佳实践</li>
          </ul>
        </div>

        {/* 导航链接 */}
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <h4 className="font-semibold text-indigo-900 mb-2">🔗 相关资源</h4>
          <div className="space-y-2 text-sm text-indigo-800">
            <div>
              <Link href="/" className="font-semibold hover:underline hover:text-indigo-600">
                ← 返回首页查看所有 Demo
              </Link>
            </div>
            <div>
              <Link href="/PRIORITY.md" className="hover:underline hover:text-indigo-600">
                查看完整的学习优先级规划
              </Link>
            </div>
            <div>
              <Link href="/MINDMAP.md" className="hover:underline hover:text-indigo-600">
                查看前端知识体系思维导图
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}