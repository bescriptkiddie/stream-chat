'use client';
import Link from 'next/link';
import DemoContainer from '@/components/DemoContainer';
export default function Demo() {
  return (
    <DemoContainer title="经典布局" description="圣杯/双飞翼/Flex/Grid">
      <div className="space-y-6">
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">💡 核心概念</h3>
          <div className="bg-white p-4 rounded-lg"><p>多种布局方式实现</p></div>
        </div>
        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">❓ 面试要点</h3>
          <div className="bg-white p-4 rounded-lg"><p className="text-sm">Flex一维，Grid二维</p></div>
        </div>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <Link href="/" className="text-indigo-800 hover:underline">← 返回首页</Link>
        </div>
      </div>
    </DemoContainer>
  );
}