import os

# 所有30个页面的数据
all_pages = {
    "handwrite/call-apply-bind": ["手写call/apply/bind", "改变this指向", "实现三个改变this的方法", "call参数列表，apply数组，bind返回新函数"],
    "handwrite/debounce-throttle": ["手写节流防抖", "带取消功能", "防抖延迟执行，节流固定频率", "防抖-搜索框，节流-滚动事件"],
    "react-advanced/portal": ["Portal模态框", "createPortal实现", "将组件渲染到body", "突破CSS overflow限制"],
    "react-advanced/imperative-handle": ["useImperativeHandle", "Ref转发实战", "暴露特定方法给父组件", "控制暴露给父组件的内容"],
    "state/context-reducer": ["Context+Reducer", "轻量级状态管理", "Context全局状态+useReducer复杂逻辑", "比Redux更轻量，适合中小型项目"],
    "state/pub-sub": ["发布订阅模式", "EventEmitter实现", "发布者和订阅者解耦通信", "有事件中心，解耦更彻底"],
    "features/infinite-scroll": ["无限滚动", "分页加载", "监听滚动到底部时加载更多", "使用节流和虚拟滚动优化"],
    "features/form-validation": ["表单验证", "自定义校验规则", "实时验证、离焦验证、提交验证", "onChange实时，onBlur离焦，onSubmit提交"],
    "algorithm/debounce-throttle": ["防抖节流对比", "可视化演示", "防抖等最后一次，节流控制频率", "搜索框用防抖，滚动事件用节流"],
    "algorithm/binary-search": ["二分查找", "动画演示", "有序数组中快速查找O(log n)", "前提：数组必须有序"],
    "css/animation": ["CSS动画", "Transition&Keyframes", "transition简单动画，animation复杂动画", "transition需要触发，animation自动执行"],
    "css/bfc": ["BFC原理", "块级格式化上下文", "BFC是独立的渲染区域", "清除浮动、防止margin重叠、自适应布局"],
    "css/responsive": ["响应式布局", "MediaQuery+Flex", "根据屏幕尺寸调整布局", "移动优先，渐进增强性能更好"],
    "browser/cors": ["跨域解决方案", "CORS/JSONP/代理", "突破浏览器同源策略限制", "CORS支持所有HTTP方法，JSONP只支持GET"],
    "browser/cache": ["浏览器缓存", "强缓存&协商缓存", "强缓存直接使用，协商缓存询问服务器", "强缓存不请求服务器，协商缓存需要"],
    "network/ajax": ["AJAX封装", "XMLHttpRequest&Fetch", "异步数据交互", "Fetch基于Promise，更现代化"],
    "network/websocket": ["WebSocket", "实时双向通信", "HTTP单向，WebSocket双向长连接", "应用：聊天、实时通知、协同编辑"],
    "typescript/type-guards": ["类型守卫", "类型收窄", "通过类型守卫缩小类型范围", "typeof检查基本类型，instanceof检查实例"],
    "typescript/decorators": ["装饰器", "方法&类装饰器", "装饰器是函数，用于修改类或方法", "执行顺序：从下到上，从右到左"],
    "typescript/advanced-types": ["高级类型", "联合/交叉/映射", "TypeScript强大的类型系统", "联合是或，交叉是且"],
    "react-advanced/concurrent": ["ConcurrentMode", "useTransition", "React 18并发特性优化体验", "将状态更新标记为非紧急"],
    "ai/mcp-client": ["MCP客户端", "ModelContextProtocol", "AI应用的标准协议", "标准化、可互操作"],
    "ai/rag": ["RAG知识库", "检索增强生成", "结合向量数据库让AI访问自定义知识", "比Fine-tuning更灵活，无需重新训练"],
    "ai/prompt-engineering": ["Prompt工程", "Few-shot&CoT", "优化提示词提升AI输出质量", "Few-shot提供示例效果更好"],
    "network/image-optimization": ["图片优化", "预加载/懒加载/压缩", "减小图片体积优化加载", "WebP体积更小质量相同"],
    "engineering/vite-optimization": ["Vite打包优化", "代码分割&TreeShaking", "优化构建速度和产物大小", "Vite开发模式更快，基于ESM"],
    "engineering/unit-test": ["单元测试", "Jest+ReactTestingLibrary", "测试组件行为保证质量", "单元测试粒度小，集成测试覆盖广"],
    "engineering/ci-cd": ["CI/CD流程", "GitHubActions", "自动化测试构建部署", "自动化、快速反馈、降低风险"],
    "engineering/monorepo": ["Monorepo管理", "pnpm workspace", "多个包在一个仓库管理", "便于管理、统一依赖、代码共享"]
}

template = """'use client';

import Link from 'next/link';
import DemoContainer from '@/components/DemoContainer';

export default function Demo() {
  return (
    <DemoContainer
      title="TITLE"
      description="DESC"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">💡 核心概念</h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-800 leading-relaxed">CONCEPT</p>
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
            <p className="text-sm text-gray-800 leading-relaxed">QA</p>
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
}"""

created_count = 0
failed_count = 0

print("开始批量创建页面...\n")

for path, data in all_pages.items():
    try:
        content = template
        content = content.replace("TITLE", data[0])
        content = content.replace("DESC", data[1])
        content = content.replace("CONCEPT", data[2])
        content = content.replace("QA", data[3])
        
        file_path = f"src/app/demos/{path}/page.js"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        
        created_count += 1
        print(f"✓ {path}")
    except Exception as e:
        failed_count += 1
        print(f"✗ {path}: {e}")

print(f"\n{'='*50}")
print(f"✅ 成功创建: {created_count}/{len(all_pages)} 个页面")
if failed_count > 0:
    print(f"❌ 失败: {failed_count} 个")
else:
    print("🎉 全部成功！")
