'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import DemoContainer from '@/components/DemoContainer';

function useThrottle(callback, delay) {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
    }
  }, [callback, delay]);
}

export default function UseThrottleDemo() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicks, setClicks] = useState(0);
  const [throttledClicks, setThrottledClicks] = useState(0);
  const [logs, setLogs] = useState([]);

  const throttledLog = useThrottle((x, y) => {
    setLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      x, y
    }]);
  }, 1000);

  const throttledClick = useThrottle(() => {
    setThrottledClicks(prev => prev + 1);
  }, 1000);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
    throttledLog(x, y);
  };

  const handleClick = () => {
    setClicks(prev => prev + 1);
    throttledClick();
  };

  return (
    <DemoContainer
      title="useThrottle Hook"
      description="节流 Hook 实现 - 常用于高频事件优化"
    >
      <div className="space-y-6">

                {/* 点击计数演示 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            点击计数演示（1 秒节流）
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleClick}
              className="px-8 py-12 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-lg font-semibold transition active:scale-95"
            >
              快速点击我 🚀
            </button>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <div className="text-xs text-yellow-700 font-semibold mb-1">实际点击次数</div>
                <div className="text-3xl font-bold text-yellow-900">{clicks}</div>
              </div>
              <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <div className="text-xs text-green-700 font-semibold mb-1">节流后执行</div>
                <div className="text-3xl font-bold text-green-900">{throttledClicks}</div>
              </div>
            </div>
          </div>
        </div>
        {/* 鼠标跟踪区域 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            鼠标跟踪演示（1 秒节流）
          </h3>
          <div
            onMouseMove={handleMouseMove}
            className="h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg border-2 border-dashed border-purple-400 flex items-center justify-center cursor-crosshair relative overflow-hidden"
          >
            <div
              className="absolute w-4 h-4 bg-red-500 rounded-full pointer-events-none transition-all"
              style={{
                left: position.x - 8,
                top: position.y - 8,
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)'
              }}
            />
            <div className="text-center pointer-events-none">
              <p className="text-gray-600 font-medium mb-2">移动鼠标查看效果</p>
              <p className="font-mono text-sm text-gray-500">
                X: {position.x.toFixed(0)} | Y: {position.y.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* 日志 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            鼠标位置记录日志（1 秒一次）
          </h3>
          <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-48 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">移动鼠标开始记录...</div>
            ) : (
              logs.slice(-20).map((log, idx) => (
                <div key={idx} className="mb-1">
                  <span className="text-gray-500">[{log.time}]</span>
                  <span className="text-yellow-400"> Position </span>
                  x={log.x.toFixed(0)}, y={log.y.toFixed(0)}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 说明 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💡 核心原理</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 记录上次执行时间，间隔足够才执行</li>
            <li>• 区别于防抖：立即执行，不会延迟</li>
            <li>• 保证固定时间间隔内只执行一次</li>
            <li>• 典型应用：滚动事件、鼠标移动、resize 等高频事件</li>
            <li>• 防抖 vs 节流：防抖是"最后一次"，节流是"固定频率"</li>
          </ul>
        </div>
      </div>
    </DemoContainer>
  );
}
