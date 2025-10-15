'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export default function FunctionCallingDemo() {
  const [logs, setLogs] = useState([]);
  const [userInput, setUserInput] = useState('');

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      time: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  // 定义可调用的本地函数
  const functions = {
    getCurrentWeather: ({ location }) => {
      return { location, temperature: 22, condition: '晴天' };
    },
    searchDatabase: ({ query }) => {
      return { results: ['结果1', '结果2', '结果3'], total: 3 };
    },
    sendEmail: ({ to, subject }) => {
      return { success: true, messageId: 'msg_123' };
    },
  };

  // 函数描述（发送给 AI）
  const functionDefinitions = [
    {
      name: 'getCurrentWeather',
      description: '获取指定地点的当前天气',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: '城市名称' }
        },
        required: ['location']
      }
    },
    {
      name: 'searchDatabase',
      description: '在数据库中搜索',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: '搜索关键词' }
        },
        required: ['query']
      }
    }
  ];

  // 模拟 AI 返回 Function Call
  const simulateAIResponse = (input) => {
    if (input.includes('天气')) {
      return {
        type: 'function_call',
        function: {
          name: 'getCurrentWeather',
          arguments: JSON.stringify({ location: '北京' })
        }
      };
    }
    if (input.includes('搜索')) {
      return {
        type: 'function_call',
        function: {
          name: 'searchDatabase',
          arguments: JSON.stringify({ query: '用户数据' })
        }
      };
    }
    return { type: 'message', content: '我理解了你的问题' };
  };

  // 执行 Function Call
  const handleFunctionCall = (functionCall) => {
    const { name, arguments: args } = functionCall;
    const parsedArgs = JSON.parse(args);
    
    addLog(`🤖 AI 决定调用函数: ${name}`, 'info');
    addLog(`📋 参数: ${JSON.stringify(parsedArgs)}`, 'sync');
    
    if (functions[name]) {
      const result = functions[name](parsedArgs);
      addLog(`✅ 执行结果: ${JSON.stringify(result)}`, 'success');
      addLog(`🤖 AI 继续处理结果...`, 'info');
      return result;
    }
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    
    setLogs([]);
    addLog(`👤 用户: ${userInput}`, 'info');
    
    // 1. 发送给 AI
    addLog('📤 发送给 AI（带函数定义）', 'sync');
    
    // 2. AI 返回
    const response = simulateAIResponse(userInput);
    
    if (response.type === 'function_call') {
      // 3. 执行函数
      const result = handleFunctionCall(response.function);
      
      // 4. 将结果返回给 AI
      addLog('📤 将函数结果返回给 AI', 'sync');
      addLog('🤖 AI: 根据结果，' + userInput.includes('天气') ? '北京今天天气不错，22°C，晴天' : '找到了3条相关结果', 'success');
    } else {
      addLog(`🤖 AI: ${response.content}`, 'success');
    }
  };

  const examples = [
    '北京今天天气怎么样？',
    '帮我搜索用户数据',
    '你好，介绍一下你自己'
  ];

  return (
    <DemoContainer
      title="Function Calling"
      description="AI 调用本地函数 - 扩展 AI 能力"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">🔧 Function Calling</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">是什么？</h4>
              <p className="text-sm text-gray-800">
                AI 模型可以识别用户意图，调用你定义的本地函数，实现与外部系统的交互
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">应用场景</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 查询数据库</li>
                <li>• 调用 API</li>
                <li>• 操作系统功能</li>
                <li>• 执行业务逻辑</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-900 mb-2">工作流程</h4>
              <ol className="text-sm text-gray-800 space-y-1">
                <li>1. 定义函数</li>
                <li>2. AI 识别意图</li>
                <li>3. 调用函数</li>
                <li>4. 返回结果</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 示例 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-sm font-semibold text-gray-700 mb-2">快速体验：</p>
          <div className="flex gap-2 mb-3">
            {examples.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => setUserInput(ex)}
                className="px-3 py-2 bg-white border rounded-lg hover:bg-indigo-50 text-sm"
              >
                {ex}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="输入问题..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              发送
            </button>
          </div>
        </div>

        {/* 日志 */}
        <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              输入问题，观察 Function Calling 过程
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="mb-1">
                <span className="text-gray-500">[{log.time}]</span>{' '}
                <span className={
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'sync' ? 'text-blue-400' :
                  'text-gray-400'
                }>{log.message}</span>
              </div>
            ))
          )}
        </div>

        {/* 完整代码 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💻 完整实现代码</h4>
          <details>
            <summary className="cursor-pointer text-sm text-blue-800">点击查看</summary>
            <div className="mt-3 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs">
{`// 1. 定义可调用的函数
const functions = {
  getCurrentWeather: ({ location }) => {
    // 调用天气 API
    return fetch(\`/api/weather?location=\${location}\`)
      .then(res => res.json());
  },
  
  searchDatabase: ({ query }) => {
    // 查询数据库
    return db.search(query);
  }
};

// 2. 定义函数描述（发送给 AI）
const functionDefinitions = [
  {
    name: 'getCurrentWeather',
    description: '获取指定地点的当前天气',
    parameters: {
      type: 'object',
      properties: {
        location: { 
          type: 'string', 
          description: '城市名称，如：北京、上海' 
        }
      },
      required: ['location']
    }
  }
];

// 3. 调用 AI（OpenAI 示例）
const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: '北京天气怎么样？' }],
  functions: functionDefinitions,
  function_call: 'auto'
});

// 4. 处理响应
const message = response.choices[0].message;

if (message.function_call) {
  // AI 决定调用函数
  const { name, arguments: args } = message.function_call;
  const parsedArgs = JSON.parse(args);
  
  // 执行本地函数
  const result = await functions[name](parsedArgs);
  
  // 将结果返回给 AI
  const finalResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: '北京天气怎么样？' },
      message,
      { 
        role: 'function', 
        name, 
        content: JSON.stringify(result) 
      }
    ]
  });
  
  console.log(finalResponse.choices[0].message.content);
}

// 5. 阶跃星辰 API 示例
const response = await fetch('https://api.stepfun.com/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'step-1-turbo',
    messages: [{ role: 'user', content: '北京天气？' }],
    functions: functionDefinitions
  })
});`}
              </pre>
            </div>
          </details>
        </div>

        {/* 实际应用 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">💼 阶跃星辰实际应用</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <p className="font-semibold text-blue-900">1. 数据查询助手</p>
              <p className="text-xs text-blue-800">用户问"最近一周的销售数据"，AI 调用数据库查询函数</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="font-semibold text-green-900">2. 智能客服</p>
              <p className="text-xs text-green-800">用户问"我的订单在哪"，AI 调用订单查询 API</p>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <p className="font-semibold text-purple-900">3. 代码执行</p>
              <p className="text-xs text-purple-800">用户问"计算 1+1"，AI 调用计算器函数</p>
            </div>
          </div>
        </div>

        {/* 思维体系定位 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">🧠 思维体系定位</h3>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">📍 在前端体系中的位置</h4>
              <div className="text-sm text-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-semibold">第四层：应用场景</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-indigo-200 text-indigo-900 rounded text-xs font-semibold">AI 产品开发</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-indigo-300 text-indigo-950 rounded text-xs font-semibold">函数调用 (Function Calling)</span>
                </div>
                <p className="text-gray-600 mt-2">
                  Function Calling 是 AI 与外部系统交互的桥梁，让 AI 能够调用真实 API、查询数据库、执行操作，是 AI Agent 的核心能力。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">🔧 技术栈关联</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs font-semibold text-blue-900 mb-2">⬇️ 底层技术</div>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• OpenAI Function Calling</li>
                    <li>• JSON Schema 验证</li>
                    <li>• 异步函数执行</li>
                    <li>• 错误处理机制</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 AI 能力扩展</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 协同功能</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• 流式对话</li>
                    <li>• 工具管理</li>
                    <li>• 参数验证</li>
                    <li>• 结果展示</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 完整的 Agent 系统</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬆️ 产品价值</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• 查询实时数据</li>
                    <li>• 执行业务操作</li>
                    <li>• 集成第三方</li>
                    <li>• 自动化任务</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 AI Agent 核心</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">🛤️ 实现路径建议</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">1️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">基础实现：单个函数调用</strong>
                    <p className="text-xs text-gray-600">定义工具schema，处理AI返回的function_call</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">多工具管理：工具库</strong>
                    <p className="text-xs text-gray-600">注册多个工具，动态选择和执行</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">链式调用：多轮对话</strong>
                    <p className="text-xs text-gray-600">函数结果作为context继续对话，实现复杂任务</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">生产级：权限控制 + 审计</strong>
                    <p className="text-xs text-gray-600">函数白名单、参数校验、执行日志、异常处理</p>
                  </div>
                </div>
              </div>
            </div>

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
                  <p className="text-xs text-gray-600">AI Agent 必备技能</p>
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
                  <p className="text-xs text-gray-600">Agent 产品核心能力</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-purple-50 rounded">
                <p className="text-xs text-purple-800">
                  <strong>💡 面试建议：</strong>能讲清楚 Function Calling 原理、能设计工具schema、能处理多轮调用、能考虑安全性（权限、参数校验）。
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold text-indigo-900 mb-3">📊 实现难度评估</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>技术难度</span>
                    <span className="text-indigo-600 font-semibold">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要理解 JSON Schema、异步执行、多轮对话</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>业务复杂度</span>
                    <span className="text-purple-600 font-semibold">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">需要考虑权限、参数校验、链式调用、异常处理</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg text-center">
              <p className="text-sm text-indigo-900 mb-2">想了解完整的 AI 前端开发体系？</p>
              <a 
                href="/docs/MINDMAP" 
                target="_blank"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
              >
                📖 查看完整思维导图
              </a>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
