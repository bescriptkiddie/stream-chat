'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

const initialItems = [
  { id: 1, name: 'React', color: 'bg-blue-500' },
  { id: 2, name: 'Vue', color: 'bg-green-500' },
  { id: 3, name: 'Angular', color: 'bg-red-500' },
  { id: 4, name: 'Svelte', color: 'bg-orange-500' },
  { id: 5, name: 'Next.js', color: 'bg-purple-500' },
];

export default function DragSortDemo() {
  const [items, setItems] = useState(initialItems);
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (e, index) => {
    setDragging(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragging === null || dragging === index) return;

    const newItems = [...items];
    const draggedItem = newItems[dragging];
    
    newItems.splice(dragging, 1);
    newItems.splice(index, 0, draggedItem);
    
    setItems(newItems);
    setDragging(index);
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  const reset = () => {
    setItems(initialItems);
  };

  return (
    <DemoContainer
      title="拖拽排序 (Drag & Drop)"
      description="HTML5 Drag & Drop API 实现列表拖拽排序"
    >
      <div className="space-y-6">
        {/* 拖拽区域 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              拖动卡片重新排序
            </h3>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition"
            >
              重置顺序
            </button>
          </div>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`${item.color} p-6 rounded-lg shadow-lg cursor-move transition-all select-none ${
                  dragging === index ? 'opacity-50 scale-95' : 'opacity-100 hover:scale-105'
                }`}
              >
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">☰</span>
                    <span className="text-xl font-bold">{item.name}</span>
                  </div>
                  <span className="text-sm opacity-75">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 当前顺序 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">当前顺序</h3>
          <div className="font-mono text-sm text-gray-600">
            {items.map((item, idx) => (
              <span key={item.id}>
                {idx > 0 && ' → '}
                <span className="font-semibold text-gray-900">{item.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 说明 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💡 核心原理</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 设置元素 draggable 属性为 true</li>
            <li>• onDragStart: 记录拖拽元素的索引</li>
            <li>• onDragOver: 实时计算插入位置并更新数组</li>
            <li>• onDragEnd: 清理拖拽状态</li>
            <li>• 使用 splice 方法实现数组元素移动</li>
          </ul>
        </div>

        {/* 代码示例 */}
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`const handleDragOver = (e, index) => {
  e.preventDefault();
  const newItems = [...items];
  const draggedItem = newItems[dragging];
  
  newItems.splice(dragging, 1);
  newItems.splice(index, 0, draggedItem);
  
  setItems(newItems);
  setDragging(index);
};`}
          </pre>
        </div>

        {/* 思维体系定位 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">🧠 思维体系定位</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-purple-900 mb-2">🖱️ HTML5 API</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Drag & Drop API</li>
                <li>• DataTransfer 对象</li>
                <li>• 事件生命周期</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-blue-900 mb-2">🎨 交互设计</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 用户体验优化</li>
                <li>• 视觉反馈设计</li>
                <li>• 可访问性考虑</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-semibold text-green-900 mb-2">⚡ 性能优化</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 频繁更新优化</li>
                <li>• 大列表处理</li>
                <li>• 动画性能</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 实战应用场景 */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">🚀 实战应用场景</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">1️⃣ Notion 看板系统</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// 多列拖拽 - Todo / In Progress / Done
const [columns, setColumns] = useState({
  todo: [{ id: 1, title: 'Task 1' }],
  inProgress: [{ id: 2, title: 'Task 2' }],
  done: [{ id: 3, title: 'Task 3' }]
});

const handleDrop = (targetColumn, targetIndex) => {
  const newColumns = { ...columns };
  
  // 从源列表移除
  newColumns[sourceColumn] = newColumns[sourceColumn].filter(
    item => item.id !== draggedItem.id
  );
  
  // 插入到目标列表
  newColumns[targetColumn].splice(targetIndex, 0, draggedItem);
  
  setColumns(newColumns);
};`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">2️⃣ 优先级排序（需求管理）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// 拖拽改变任务优先级
const updatePriority = (taskId, newIndex) => {
  const updatedTasks = [...tasks];
  const task = updatedTasks.find(t => t.id === taskId);
  
  // 更新优先级（基于位置）
  task.priority = updatedTasks.length - newIndex;
  
  // 保存到后端
  await api.updateTask(taskId, { priority: task.priority });
  
  setTasks(updatedTasks);
};`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">3️⃣ 文件上传队列</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// 拖拽调整上传顺序
const [uploadQueue, setUploadQueue] = useState([]);

const reorderQueue = (fromIndex, toIndex) => {
  const queue = [...uploadQueue];
  const [movedFile] = queue.splice(fromIndex, 1);
  queue.splice(toIndex, 0, movedFile);
  
  setUploadQueue(queue);
  
  // 通知上传管理器更新顺序
  uploadManager.reorder(queue.map(f => f.id));
};`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">4️⃣ 表格行拖拽（数据表格）</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// React Table + 拖拽排序
const [data, setData] = useState(tableData);

const moveRow = (dragIndex, hoverIndex) => {
  const dragRow = data[dragIndex];
  const newData = [...data];
  
  newData.splice(dragIndex, 1);
  newData.splice(hoverIndex, 0, dragRow);
  
  setData(newData);
  
  // 批量更新顺序到后端
  batchUpdateOrder(newData.map((row, idx) => ({
    id: row.id,
    order: idx
  })));
};`}
              </pre>
            </div>
          </div>
        </div>

        {/* 面试高频 QA */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 面试高频 QA</h3>
          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: HTML5 Drag & Drop API 的核心事件有哪些？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <p className="font-semibold text-blue-900 mb-2">📋 拖拽事件流程：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 1. 在被拖拽元素上触发
dragstart  → 开始拖拽时触发一次
drag       → 拖拽过程中持续触发（每几百毫秒）
dragend    → 拖拽结束时触发一次（无论成功或失败）

// 2. 在目标元素（放置区）上触发
dragenter  → 拖拽元素进入时触发
dragover   → 拖拽元素在上方时持续触发
dragleave  → 拖拽元素离开时触发
drop       → 释放鼠标时触发（必须在 dragover 中调用 e.preventDefault()）

// 完整示例
<div
  draggable="true"
  onDragStart={(e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'data');
  }}
  onDragEnd={(e) => {
    console.log('拖拽结束');
  }}
>
  拖我
</div>

<div
  onDragOver={(e) => {
    e.preventDefault(); // 必须！否则 drop 不会触发
    e.dataTransfer.dropEffect = 'move';
  }}
  onDrop={(e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    console.log('接收到:', data);
  }}
>
  放在这里
</div>`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: DataTransfer 对象有什么作用？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                  <p className="font-semibold text-purple-900 mb-2">📦 DataTransfer 核心 API：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 1. 设置/获取数据
e.dataTransfer.setData('text/plain', 'hello');
e.dataTransfer.setData('application/json', JSON.stringify(data));
const value = e.dataTransfer.getData('text/plain');

// 2. 设置拖拽效果
e.dataTransfer.effectAllowed = 'move';  // 允许的操作
e.dataTransfer.dropEffect = 'move';     // 实际操作
// 可选值: 'copy', 'move', 'link', 'none'

// 3. 设置拖拽图像（自定义光标）
const img = new Image();
img.src = '/drag-icon.png';
e.dataTransfer.setDragImage(img, 10, 10);

// 4. 文件拖拽
e.dataTransfer.files; // 获取拖拽的文件列表（FileList）

// 5. 拖拽类型
e.dataTransfer.types; // ['text/plain', 'text/html']

// 实际应用
onDragStart={(e) => {
  // 存储拖拽项的 ID
  e.dataTransfer.setData('itemId', item.id);
  e.dataTransfer.effectAllowed = 'move';
  
  // 自定义拖拽图像
  const dragImage = document.getElementById('custom-drag-image');
  e.dataTransfer.setDragImage(dragImage, 0, 0);
}}`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 如何优化频繁触发的 dragover 事件？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                  <p className="font-semibold text-orange-900 mb-2">⚡ 性能优化方案：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 方法 1: 使用节流（Throttle）
import { throttle } from 'lodash';

const handleDragOver = throttle((e, index) => {
  e.preventDefault();
  updatePosition(index);
}, 100); // 100ms 节流

// 方法 2: 使用 requestAnimationFrame
let rafId = null;
const handleDragOver = (e, index) => {
  e.preventDefault();
  
  if (rafId) return; // 如果已有待处理的更新，跳过
  
  rafId = requestAnimationFrame(() => {
    updatePosition(index);
    rafId = null;
  });
};

// 方法 3: 只在位置变化时更新
let lastHoverIndex = null;
const handleDragOver = (e, index) => {
  e.preventDefault();
  
  if (index === lastHoverIndex) return; // 位置没变，跳过
  
  lastHoverIndex = index;
  updatePosition(index);
};

// 方法 4: 使用虚拟占位符（大列表推荐）
const [placeholder, setPlaceholder] = useState(null);
const handleDragOver = (e, index) => {
  e.preventDefault();
  setPlaceholder(index); // 只更新占位符位置
};
const handleDragEnd = () => {
  if (placeholder !== null) {
    // 拖拽结束时才真正更新数据
    updateItems(draggingItem, placeholder);
  }
};`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 移动端如何实现拖拽排序？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-teal-50 border-l-4 border-teal-500 p-3 rounded">
                  <p className="font-semibold text-teal-900 mb-2">📱 移动端方案：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 问题：移动端不支持 Drag & Drop API

// ✅ 方案 1: 使用 Touch Events
const [touchStart, setTouchStart] = useState(null);

const handleTouchStart = (e, index) => {
  setTouchStart({
    y: e.touches[0].clientY,
    index
  });
};

const handleTouchMove = (e) => {
  if (!touchStart) return;
  
  const currentY = e.touches[0].clientY;
  const diff = currentY - touchStart.y;
  
  // 计算应该移动到哪个位置
  const newIndex = calculateIndex(diff);
  if (newIndex !== touchStart.index) {
    reorderItems(touchStart.index, newIndex);
  }
};

// ✅ 方案 2: 使用第三方库
// react-beautiful-dnd（Atlassian 出品）
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="list">
    {(provided) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {items.map((item, index) => (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {item.content}
              </div>
            )}
          </Draggable>
        ))}
      </div>
    )}
  </Droppable>
</DragDropContext>

// ✅ 方案 3: 使用 @dnd-kit（现代化方案）
// 支持触摸、键盘、屏幕阅读器、虚拟列表`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q5: 如何实现跨列表拖拽？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 看板系统：Todo → In Progress → Done
const [lists, setLists] = useState({
  todo: [{ id: 1, title: 'Task 1' }],
  progress: [],
  done: []
});

const [dragState, setDragState] = useState({
  item: null,
  sourceList: null
});

const handleDragStart = (item, sourceList) => {
  setDragState({ item, sourceList });
};

const handleDrop = (targetList, targetIndex) => {
  const { item, sourceList } = dragState;
  
  setLists(prev => {
    const newLists = { ...prev };
    
    // 从源列表移除
    newLists[sourceList] = newLists[sourceList].filter(
      i => i.id !== item.id
    );
    
    // 插入到目标列表
    newLists[targetList].splice(targetIndex, 0, item);
    
    return newLists;
  });
  
  // 可选：保存到后端
  saveListState(lists);
};

// 使用
<div className="flex gap-4">
  {Object.entries(lists).map(([listId, items]) => (
    <div
      key={listId}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => handleDrop(listId, items.length)}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(item, listId)}
        >
          {item.title}
        </div>
      ))}
    </div>
  ))}
</div>`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q6: 拖拽库选型：原生 vs react-beautiful-dnd vs @dnd-kit？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-pink-50 border-l-4 border-pink-500 p-3 rounded">
                  <p className="font-semibold text-pink-900 mb-2">📊 对比表：</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs mt-2">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left">特性</th>
                          <th className="p-2 text-left">原生 API</th>
                          <th className="p-2 text-left">react-beautiful-dnd</th>
                          <th className="p-2 text-left">@dnd-kit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="p-2 font-semibold">移动端支持</td>
                          <td className="p-2 text-red-600">❌ 不支持</td>
                          <td className="p-2 text-yellow-600">⚠️ 需 polyfill</td>
                          <td className="p-2 text-green-600">✅ 原生支持</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold">学习成本</td>
                          <td className="p-2">简单</td>
                          <td className="p-2">中等</td>
                          <td className="p-2">中等</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold">性能</td>
                          <td className="p-2">好</td>
                          <td className="p-2">中（不支持虚拟列表）</td>
                          <td className="p-2 text-green-600">优秀（支持虚拟列表）</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold">可访问性</td>
                          <td className="p-2 text-red-600">需手动实现</td>
                          <td className="p-2 text-green-600">✅ 内置键盘支持</td>
                          <td className="p-2 text-green-600">✅ 全面支持</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold">动画</td>
                          <td className="p-2">需手动实现</td>
                          <td className="p-2 text-green-600">✅ 内置</td>
                          <td className="p-2 text-green-600">✅ 可定制</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold">Bundle 大小</td>
                          <td className="p-2 text-green-600">0 KB</td>
                          <td className="p-2">~34 KB</td>
                          <td className="p-2">~20 KB (模块化)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-semibold">维护状态</td>
                          <td className="p-2">-</td>
                          <td className="p-2 text-yellow-600">⚠️ 已停止维护</td>
                          <td className="p-2 text-green-600">✅ 活跃</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs mt-3 text-gray-700">
                    <strong>💡 选型建议：</strong><br/>
                    • 简单场景（PC端）：原生 API<br/>
                    • 移动端/复杂交互：@dnd-kit<br/>
                    • 已有项目使用 react-beautiful-dnd：保持不变或逐步迁移
                  </p>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q7: 如何保存拖拽后的顺序到后端？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-3 rounded">
                  <p className="font-semibold text-cyan-900 mb-2">💾 持久化方案：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 方案 1: 实时保存（用户体验好，但请求多）
const handleDragEnd = async (fromIndex, toIndex) => {
  const newItems = reorder(items, fromIndex, toIndex);
  setItems(newItems); // 乐观更新
  
  try {
    await api.updateOrder(newItems.map((item, idx) => ({
      id: item.id,
      order: idx
    })));
  } catch (error) {
    setItems(items); // 失败回滚
    showError('保存失败');
  }
};

// 方案 2: 防抖保存（减少请求）
import { debounce } from 'lodash';

const saveOrder = debounce(async (items) => {
  await api.batchUpdateOrder(items);
}, 1000); // 1秒内多次拖拽只保存一次

const handleDragEnd = (fromIndex, toIndex) => {
  const newItems = reorder(items, fromIndex, toIndex);
  setItems(newItems);
  saveOrder(newItems);
};

// 方案 3: 只保存变化的项（最优）
const handleDragEnd = async (fromIndex, toIndex) => {
  const movedItem = items[fromIndex];
  const newItems = reorder(items, fromIndex, toIndex);
  setItems(newItems);
  
  // 只更新受影响的项
  const affectedItems = getAffectedItems(fromIndex, toIndex);
  await api.updateOrder(affectedItems);
};

// 方案 4: 使用 order 字段而非 index（推荐）
// 数据库设计：每个项有一个 order 字段
// 拖拽时重新计算 order 值
const calculateNewOrder = (items, fromIndex, toIndex) => {
  const prevOrder = items[toIndex - 1]?.order || 0;
  const nextOrder = items[toIndex + 1]?.order || prevOrder + 1000;
  
  return (prevOrder + nextOrder) / 2; // 取中间值
};`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q8: 面试官追问：大列表（1000+项）如何优化拖拽？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded">
                  <p className="font-semibold text-indigo-900 mb-2">⚡ 大列表优化方案：</p>
                  <ol className="list-decimal ml-5 text-xs space-y-2">
                    <li><strong>虚拟滚动 + 拖拽：</strong>使用 @dnd-kit + react-window</li>
                    <li><strong>占位符策略：</strong>拖拽时不实时更新数据，只显示占位符</li>
                    <li><strong>分页拖拽：</strong>只允许在当前页内拖拽</li>
                    <li><strong>降级处理：</strong>超过阈值改用点击选择+移动按钮</li>
                  </ol>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// 示例：虚拟滚动 + 拖拽
import { DndContext } from '@dnd-kit/core';
import { FixedSizeList } from 'react-window';

const VirtualDragList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <DraggableItem item={items[index]} index={index} />
    </div>
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <FixedSizeList
        height={600}
        itemCount={items.length}
        itemSize={50}
        width="100%"
      >
        {Row}
      </FixedSizeList>
    </DndContext>
  );
};

// 性能对比：
// - 1000 项全渲染：渲染时间 ~200ms，内存 ~50MB
// - 1000 项虚拟滚动：渲染时间 ~20ms，内存 ~5MB`}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* 常见陷阱 */}
        <div className="bg-gradient-to-r from-yellow-50 to-red-50 border-2 border-yellow-400 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-900 mb-4">⚠️ 常见陷阱与注意事项</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
              <h4 className="font-semibold text-red-900 mb-2">❌ 陷阱 1：忘记在 dragover 中调用 preventDefault</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 错误：drop 事件不会触发
<div onDrop={handleDrop}>
  放在这里
</div>

// ✅ 正确：必须阻止默认行为
<div
  onDragOver={(e) => e.preventDefault()} // 必须！
  onDrop={handleDrop}
>
  放在这里
</div>

// 原因：浏览器默认不允许在元素上放置内容`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900 mb-2">❌ 陷阱 2：拖拽时状态更新导致组件重新渲染</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 问题：频繁更新 state 导致性能问题
const handleDragOver = (e, index) => {
  e.preventDefault();
  setItems(reorder(items, dragging, index)); // 每次都更新！
  setDragging(index);
};

// ✅ 解决方案 1：使用 useRef 存储临时状态
const draggingRef = useRef(null);
const handleDragOver = (e, index) => {
  e.preventDefault();
  if (draggingRef.current === index) return;
  draggingRef.current = index;
  // 只在拖拽结束时更新 state
};

// ✅ 解决方案 2：使用 CSS 实现视觉效果
const [dragOverIndex, setDragOverIndex] = useState(null);
// 通过 CSS class 显示占位符，不更新数据`}
              </pre>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900 mb-2">❌ 陷阱 3：移动端测试被遗忘</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// ❌ 问题：原生 API 在移动端无效
<div draggable onDragStart={handleDragStart}>
  拖我 {/* 移动端无法拖拽！ */}
</div>

// ✅ 解决方案：同时监听 touch 事件
<div
  draggable
  onDragStart={handleDragStart}
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
  拖我
</div>

// 或使用支持移动端的库
import { useSortable } from '@dnd-kit/sortable';`}
              </pre>
            </div>
          </div>
        </div>

        {/* 性能优化清单 */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-cyan-900 mb-4">⚡ 性能优化清单</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">✅ 基础优化</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 使用 CSS transform 而非 top/left 移动元素</li>
                <li>• 使用 requestAnimationFrame 节流 dragover 事件</li>
                <li>• 避免在 dragover 中执行复杂计算</li>
                <li>• 使用 will-change: transform 提前告知浏览器</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">✅ 大列表优化</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 虚拟滚动：只渲染可见项</li>
                <li>• 延迟保存：防抖后端请求</li>
                <li>• 占位符策略：拖拽时不更新数据</li>
                <li>• 分批更新：使用 startTransition (React 18)</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-900 mb-2">✅ 用户体验</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 拖拽手柄：明确指示可拖拽区域</li>
                <li>• 视觉反馈：拖拽时改变样式</li>
                <li>• 自动滚动：拖拽到边缘时自动滚动</li>
                <li>• 错误恢复：操作失败时回滚状态</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
