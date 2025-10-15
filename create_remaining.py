import os

pages = {
    "css/layout": ["经典布局", "圣杯/双飞翼/Flex/Grid", "多种布局方式实现", "Flex一维，Grid二维"],
    "browser/event-delegation": ["事件委托", "Event Delegation", "利用事件冒泡", "减少监听器数量"],
    "handwrite/promise": ["手写Promise", "符合A+规范", "实现then/catch", "三种状态"],
}

template = """'use client';
import Link from 'next/link';
import DemoContainer from '@/components/DemoContainer';
export default function Demo() {
  return (
    <DemoContainer title="T1" description="T2">
      <div className="space-y-6">
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">💡 核心概念</h3>
          <div className="bg-white p-4 rounded-lg"><p>T3</p></div>
        </div>
        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">❓ 面试要点</h3>
          <div className="bg-white p-4 rounded-lg"><p className="text-sm">T4</p></div>
        </div>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <Link href="/" className="text-indigo-800 hover:underline">← 返回首页</Link>
        </div>
      </div>
    </DemoContainer>
  );
}"""

for path, d in pages.items():
    c = template.replace("T1",d[0]).replace("T2",d[1]).replace("T3",d[2]).replace("T4",d[3])
    with open(f"src/app/demos/{path}/page.js", "w") as f:
        f.write(c)
    print(f"✓ {path}")
