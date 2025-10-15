'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function Demo() {
  return (
    <DemoContainer
      title="懒加载图片"
      description="Intersection Observer 实现图片懒加载"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">💡 核心概念</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">什么是图片懒加载？</h4>
              <p className="text-sm text-gray-700">只加载视口内的图片，滚动到可见区域才加载，提升性能</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded">
                <div className="text-sm font-semibold text-green-900">✅ 优势</div>
                <ul className="text-xs text-green-800 mt-2 space-y-1">
                  <li>• 减少初始加载时间</li>
                  <li>• 节省带宽</li>
                  <li>• 提升用户体验</li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm font-semibold text-blue-900">🔧 实现方式</div>
                <ul className="text-xs text-blue-800 mt-2 space-y-1">
                  <li>• Intersection Observer</li>
                  <li>• loading="lazy" 属性</li>
                  <li>• 第三方库</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 代码示例 */}
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 text-gray-200">📝 代码实现</h4>
          <pre className="text-sm overflow-x-auto"><code>{`// 使用 Intersection Observer
const LazyImage = ({ src, alt }) => {
  const imgRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : placeholder}
      alt={alt}
      loading="lazy"
    />
  );
};

// 原生 HTML5 方式
<img src="image.jpg" loading="lazy" alt="描述" />`}</code></pre>
        </div>

        {/* 面试 QA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">❓ 面试高频 QA</h3>
          <div className="space-y-3">
            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Q1: Intersection Observer 的优势？</summary>
              <div className="mt-2 text-sm">
                <ul className="list-disc ml-5">
                  <li>异步执行，不阻塞主线程</li>
                  <li>支持元素可见性判断</li>
                  <li>性能更好</li>
                </ul>
              </div>
            </details>
            <details className="bg-white rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Q2: loading="lazy" 兼容性？</summary>
              <div className="mt-2 text-sm">
                Chrome 76+, Firefox 75+, Edge 79+，不支持需要 polyfill
              </div>
            </details>
          </div>
        </div>

        {/* 实用提示 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h4 className="font-semibold text-yellow-900 mb-2">💡 实用提示</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• 使用占位图提升体验</li>
            <li>• 设置合适的 threshold</li>
            <li>• 考虑预加载首屏图片</li>
            <li>• 移动端优先使用</li>
          </ul>
        </div>

        {/* 返回链接 */}
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
          <p className="text-sm text-indigo-800">
            👉 <a href="/" className="font-semibold hover:underline">返回首页</a> 查看更多 Demo
          </p>
        </div>
      </div>
    </DemoContainer>
  );
}