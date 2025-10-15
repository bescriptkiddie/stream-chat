// 思维体系定位模板 - 复制到每个 demo 的合适位置

/* ============================================
   📍 JS 基础类 - 思维体系定位模板
   ============================================ */

{/* 思维体系定位 - JS 基础 */}
<div className="bg-gradient-to-r from-cyan-50 to-teal-50 border-2 border-cyan-300 rounded-lg p-6">
  <h3 className="text-xl font-bold text-cyan-900 mb-4 flex items-center gap-2">
    🧠 思维体系定位
  </h3>

  <div className="space-y-6">
    {/* 在前端体系中的位置 */}
    <div className="bg-white rounded-lg p-4 shadow">
      <h4 className="font-semibold text-cyan-900 mb-3">📍 在前端体系中的位置</h4>
      <div className="text-sm text-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-xs font-semibold">第二层：语言核心</span>
          <span className="text-gray-400">→</span>
          <span className="px-2 py-1 bg-cyan-200 text-cyan-900 rounded text-xs font-semibold">JavaScript 核心</span>
          <span className="text-gray-400">→</span>
          <span className="px-2 py-1 bg-cyan-300 text-cyan-950 rounded text-xs font-semibold">[知识点名称]</span>
        </div>
        <p className="text-gray-600 mt-2">
          [一句话描述该知识点在前端体系中的位置和重要性]
        </p>
      </div>
    </div>

    {/* 知识关联图 */}
    <div className="bg-white rounded-lg p-4 shadow">
      <h4 className="font-semibold text-cyan-900 mb-3">🔗 知识关联图</h4>
      <div className="grid grid-cols-3 gap-4">
        {/* 前置知识 */}
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-xs font-semibold text-blue-900 mb-2">⬆️ 前置知识</div>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• [前置知识1]</li>
            <li>• [前置知识2]</li>
            <li>• [前置知识3]</li>
          </ul>
          <p className="text-xs text-blue-600 mt-2">💡 先掌握这些，更容易理解</p>
        </div>

        {/* 横向关联 */}
        <div className="bg-purple-50 p-3 rounded">
          <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 横向关联</div>
          <ul className="text-xs text-purple-800 space-y-1">
            <li>• [关联知识1]</li>
            <li>• [关联知识2]</li>
            <li>• [关联知识3]</li>
          </ul>
          <p className="text-xs text-purple-600 mt-2">💡 同层级的核心概念</p>
        </div>

        {/* 后续应用 */}
        <div className="bg-green-50 p-3 rounded">
          <div className="text-xs font-semibold text-green-900 mb-2">⬇️ 后续应用</div>
          <ul className="text-xs text-green-800 space-y-1">
            <li>• [应用场景1]</li>
            <li>• [应用场景2]</li>
            <li>• [应用场景3]</li>
          </ul>
          <p className="text-xs text-green-600 mt-2">💡 实际项目中的应用</p>
        </div>
      </div>
    </div>

    {/* 学习路径 */}
    <div className="bg-white rounded-lg p-4 shadow">
      <h4 className="font-semibold text-cyan-900 mb-3">🛤️ 学习路径建议</h4>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-lg">1️⃣</span>
          <div className="flex-1">
            <strong className="text-sm">当前阶段：[当前学习目标]</strong>
            <p className="text-xs text-gray-600">[具体学习内容]</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg">2️⃣</span>
          <div className="flex-1">
            <strong className="text-sm">下一步：[下一步目标]</strong>
            <p className="text-xs text-gray-600">[具体学习内容]</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg">3️⃣</span>
          <div className="flex-1">
            <strong className="text-sm">进阶：[进阶目标]</strong>
            <p className="text-xs text-gray-600">[具体学习内容]</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg">4️⃣</span>
          <div className="flex-1">
            <strong className="text-sm">深入：[深入目标]</strong>
            <p className="text-xs text-gray-600">[具体学习内容]</p>
          </div>
        </div>
      </div>
    </div>

    {/* 面试重要性 */}
    <div className="bg-white rounded-lg p-4 shadow">
      <h4 className="font-semibold text-cyan-900 mb-3">⭐ 面试重要性评估</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold">考察频率：</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="text-yellow-500">⭐</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-600">[频率描述]</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold">难度系数：</span>
            <div className="flex gap-1">
              {[1,2,3].map(i => (
                <span key={i} className="text-red-500">🔥</span>
              ))}
              <span className="text-gray-300">🔥🔥</span>
            </div>
          </div>
          <p className="text-xs text-gray-600">[难度描述]</p>
        </div>
      </div>
      <div className="mt-3 p-3 bg-yellow-50 rounded">
        <p className="text-xs text-yellow-800">
          <strong>💡 面试建议：</strong>[具体的面试建议]
        </p>
      </div>
    </div>

    {/* 知识深度与广度 */}
    <div className="bg-white rounded-lg p-4 shadow">
      <h4 className="font-semibold text-cyan-900 mb-3">📊 知识深度 vs 广度</h4>
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span>深度（理论层面）</span>
            <span className="text-cyan-600 font-semibold">85%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-cyan-600 h-2 rounded-full" style={{width: '85%'}}></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">[深度描述]</p>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span>广度（应用场景）</span>
            <span className="text-green-600 font-semibold">90%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{width: '90%'}}></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">[广度描述]</p>
        </div>
      </div>
    </div>

    {/* 查看完整体系 */}
    <div className="bg-gradient-to-r from-cyan-100 to-teal-100 p-4 rounded-lg text-center">
      <p className="text-sm text-cyan-900 mb-2">
        想了解完整的前端知识体系？
      </p>
      <a 
        href="/MINDMAP.md" 
        target="_blank"
        className="inline-block px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium"
      >
        📖 查看完整思维导图
      </a>
    </div>
  </div>
</div>


/* ============================================
   📍 AI 应用类 - 思维体系定位模板
   ============================================ */

{/* 思维体系定位 - AI 应用 */}
<div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
  <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
    🧠 思维体系定位
  </h3>

  <div className="space-y-6">
    {/* 在前端体系中的位置 */}
    <div className="bg-white rounded-lg p-4 shadow">
      <h4 className="font-semibold text-indigo-900 mb-3">📍 在前端体系中的位置</h4>
      <div className="text-sm text-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-semibold">第四层：应用场景</span>
          <span className="text-gray-400">→</span>
          <span className="px-2 py-1 bg-indigo-200 text-indigo-900 rounded text-xs font-semibold">AI 产品开发</span>
          <span className="text-gray-400">→</span>
          <span className="px-2 py-1 bg-indigo-300 text-indigo-950 rounded text-xs font-semibold">[功能名称]</span>
        </div>
        <p className="text-gray-600 mt-2">
          [一句话描述该功能在 AI 产品中的位置和重要性]
        </p>
      </div>
    </div>

    {/* 技术栈关联 */}
    <div className="bg-white rounded-lg p-4 shadow">
      <h4 className="font-semibold text-indigo-900 mb-3">🔧 技术栈关联</h4>
      <div className="grid grid-cols-3 gap-4">
        {/* 底层技术 */}
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-xs font-semibold text-blue-900 mb-2">⬇️ 底层技术</div>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• [技术1]</li>
            <li>• [技术2]</li>
            <li>• [技术3]</li>
          </ul>
          <p className="text-xs text-blue-600 mt-2">💡 需要掌握的基础</p>
        </div>

        {/* 协同功能 */}
        <div className="bg-purple-50 p-3 rounded">
          <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 协同功能</div>
          <ul className="text-xs text-purple-800 space-y-1">
            <li>• [功能1]</li>
            <li>• [功能2]</li>
            <li>• [功能3]</li>
          </ul>
          <p className="text-xs text-purple-600 mt-2">💡 配合使用的功能</p>
        </div>

        {/* 产品价值 */}
        <div className="bg-green-50 p-3 rounded">
          <div className="text-xs font-semibold text-green-900 mb-2">⬆️ 产品价值</div>
          <ul className="text-xs text-green-800 space-y-1">
            <li>• [价值点1]</li>
            <li>• [价值点2]</li>
            <li>• [价值点3]</li>
          </ul>
          <p className="text-xs text-green-600 mt-2">💡 对用户的价值</p>
        </div>
      </div>
    </div>

    {/* 实现路径 */}
    <div className="bg-white rounded-lg p-4 shadow">
      <h4 className="font-semibold text-indigo-900 mb-3">🛤️ 实现路径建议</h4>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-lg">1️⃣</span>
          <div className="flex-1">
            <strong className="text-sm">基础实现：[第一步]</strong>
            <p className="text-xs text-gray-600">[具体实现内容]</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg">2️⃣</span>
          <div className="flex-1">
            <strong className="text-sm">优化体验：[第二步]</strong>
            <p className="text-xs text-gray-600">[具体优化内容]</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg">3️⃣</span>
          <div className="flex-1">
            <strong className="text-sm">性能优化：[第三步]</strong>
            <p className="text-xs text-gray-600">[具体优化内容]</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg">4️⃣</span>
          <div className="flex-1">
            <strong className="text-sm">生产级：[第四步]</strong>
            <p className="text-xs text-gray-600">[生产环境考虑]</p>
          </div>
        </div>
      </div>
    </div>

    {/* AI 公司面试重要性 */}
    <div className="bg-white rounded-lg p-4 shadow">
      <h4 className="font-semibold text-indigo-900 mb-3">⭐ AI 公司面试重要性</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold">考察频率：</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="text-yellow-500">⭐</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-600">[AI 公司考察频率]</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold">业务相关度：</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="text-purple-500">💜</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-600">[与 AI 业务的相关度]</p>
        </div>
      </div>
      <div className="mt-3 p-3 bg-purple-50 rounded">
        <p className="text-xs text-purple-800">
          <strong>💡 面试建议：</strong>[针对 AI 公司的面试建议]
        </p>
      </div>
    </div>

    {/* 实现难度评估 */}
    <div className="bg-white rounded-lg p-4 shadow">
      <h4 className="font-semibold text-indigo-900 mb-3">📊 实现难度评估</h4>
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span>技术难度</span>
            <span className="text-indigo-600 font-semibold">[X]%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full" style={{width: '[X]%'}}></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">[技术难点描述]</p>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span>业务复杂度</span>
            <span className="text-purple-600 font-semibold">[X]%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{width: '[X]%'}}></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">[业务复杂度描述]</p>
        </div>
      </div>
    </div>

    {/* 查看完整体系 */}
    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg text-center">
      <p className="text-sm text-indigo-900 mb-2">
        想了解完整的 AI 前端开发体系？
      </p>
      <a 
        href="/MINDMAP.md" 
        target="_blank"
        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
      >
        📖 查看完整思维导图
      </a>
    </div>
  </div>
</div>
