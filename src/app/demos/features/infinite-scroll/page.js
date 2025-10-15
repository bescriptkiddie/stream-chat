'use client';

import { useState, useEffect, useRef } from 'react';
import DemoContainer from '@/components/DemoContainer';

function useInfiniteScroll(fetchMore) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef();
  const loadingRef = useRef(null);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => observer.disconnect();
  }, [hasMore, loading, page]);

  const loadMore = async () => {
    if (loading) return;
    
    setLoading(true);
    const newItems = await fetchMore(page);
    
    if (newItems.length === 0) {
      setHasMore(false);
    } else {
      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    }
    
    setLoading(false);
  };

  return { items, loading, hasMore, loadingRef };
}

export default function InfiniteScrollDemo() {
  const mockFetch = async (page) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (page > 5) return [];
    
    return Array.from({ length: 10 }, (_, i) => ({
      id: (page - 1) * 10 + i + 1,
      title: `Item ${(page - 1) * 10 + i + 1}`,
      content: `这是第 ${page} 页的第 ${i + 1} 个项目`
    }));
  };

  const { items, loading, hasMore, loadingRef } = useInfiniteScroll(mockFetch);

  return (
    <DemoContainer
      title="无限滚动"
      description="Intersection Observer 实现高性能分页加载"
    >
      <div className="space-y-6">
        {/* 交互式 Demo */}
        <div className="border-2 border-gray-300 rounded-lg p-4 h-96 overflow-y-auto">
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
                <div className="font-semibold text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600">{item.content}</div>
              </div>
            ))}
            
            {loading && (
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">加载中...</span>
              </div>
            )}
            
            {!hasMore && (
              <div className="text-center p-8 text-gray-500">
                没有更多数据了
              </div>
            )}
            
            <div ref={loadingRef} className="h-4"></div>
          </div>
        </div>

        {/* 核心概念 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💡 核心概念</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Intersection Observer：</strong>监听元素进入视口，比 scroll 事件更高效</li>
            <li>• <strong>节流优化：</strong>防止频繁触发加载</li>
            <li>• <strong>状态管理：</strong>loading、hasMore、page 状态控制</li>
            <li>• <strong>性能优化：</strong>虚拟滚动、requestAnimationFrame</li>
          </ul>
        </div>

        {/* 核心代码实现 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">📝 核心代码实现</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`function useInfiniteScroll(fetchMore) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [loading, page]);

  const loadMore = async () => {
    setLoading(true);
    const newItems = await fetchMore(page);
    setItems(prev => [...prev, ...newItems]);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  return { items, loading, loadingRef };
}

// 使用
const { items, loading, loadingRef } = useInfiniteScroll(fetchData);

return (
  <div className="overflow-y-auto">
    {items.map(item => <Item key={item.id} {...item} />)}
    {loading && <Loading />}
    <div ref={loadingRef}></div>
  </div>
);`}
            </pre>
          </div>
        </div>

        {/* 面试高频 QA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">❓ 面试高频 QA</h3>

          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: Intersection Observer 比 scroll 事件好在哪？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <ul className="list-disc ml-5">
                  <li><strong>性能更好：</strong>异步执行，不阻塞主线程</li>
                  <li><strong>不需要节流：</strong>浏览器自动优化</li>
                  <li><strong>精确度高：</strong>可以设置 threshold 阈值</li>
                  <li><strong>易于使用：</strong>不需要计算 scrollTop</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 如何防止重复加载？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <ul className="list-decimal ml-5">
                  <li>使用 loading 状态标记</li>
                  <li>检查 hasMore 是否还有数据</li>
                  <li>在加载时 disconnect observer</li>
                </ul>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`if (loading || !hasMore) return;
setLoading(true);
const data = await fetch();
setLoading(false);`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 如何实现虚拟滚动优化？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <p>虚拟滚动只渲染可见区域的元素：</p>
                <ul className="list-disc ml-5 mt-2">
                  <li>计算可见区域的起始和结束索引</li>
                  <li>只渲染这个范围内的元素</li>
                  <li>使用绝对定位保持滚动位置</li>
                  <li>推荐使用 react-window 或 react-virtualized</li>
                </ul>
              </div>
            </details>
          </div>
        </div>

        {/* 实际应用场景 */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h4 className="font-semibold text-green-900 mb-2">🎯 实际应用场景</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>社交媒体：</strong>Twitter、微博的时间线</li>
            <li>• <strong>电商列表：</strong>商品列表、搜索结果</li>
            <li>• <strong>新闻资讯：</strong>文章列表、视频流</li>
            <li>• <strong>聊天应用：</strong>历史消息加载</li>
          </ul>
        </div>
      </div>
    </DemoContainer>
  );
}
