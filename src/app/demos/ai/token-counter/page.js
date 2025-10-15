'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

export const dynamic = 'force-dynamic';

export default function TokenCounterDemo() {
  const [text, setText] = useState('');
  
  // 简易 Token 计算（实际用 tiktoken.js）
  const estimateTokens = (text) => {
    // 简化算法：中文 1.5 tokens/字，英文 1 token/4 字符
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const otherChars = text.length - chineseChars;
    return Math.ceil(chineseChars * 1.5 + otherChars / 4);
  };

  const tokens = estimateTokens(text);
  const cost = (tokens / 1000 * 0.002).toFixed(6); // 假设 $0.002/1K tokens

  const examples = [
    '你好，请帮我写一段代码',
    'Explain quantum computing in simple terms',
    '生成一个包含用户管理功能的 React 组件，需要支持增删改查操作',
  ];

  return (
    <DemoContainer
      title="Token 计数器"
      description="AI 成本控制 - 实时计算 Token 消耗"
    >
      <div className="space-y-6">
        {/* 核心说明 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">🪙 Token 计数器</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">什么是 Token？</h4>
              <p className="text-sm text-gray-800">
                AI 模型处理文本的基本单位，1 个中文字 ≈ 1.5 tokens，4 个英文字母 ≈ 1 token
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">为什么重要？</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• 计费单位</li>
                <li>• 成本控制</li>
                <li>• 上下文限制</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-900 mb-2">实现方案</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• tiktoken.js（精确）</li>
                <li>• GPT-Tokenizer</li>
                <li>• 简易估算（本demo）</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 示例 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-sm font-semibold text-gray-700 mb-2">快速示例：</p>
          <div className="flex gap-2">
            {examples.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => setText(ex)}
                className="px-3 py-2 bg-white border rounded-lg hover:bg-indigo-50 text-sm"
              >
                示例 {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* 输入框 */}
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="输入文本，实时计算 Token 数量..."
          />
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <div className="text-xs text-blue-600 font-semibold">字符数</div>
            <div className="text-2xl font-bold text-blue-900">{text.length}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <div className="text-xs text-green-600 font-semibold">Token 数（估算）</div>
            <div className="text-2xl font-bold text-green-900">{tokens}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <div className="text-xs text-purple-600 font-semibold">成本（美元）</div>
            <div className="text-2xl font-bold text-purple-900">${cost}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
            <div className="text-xs text-orange-600 font-semibold">人民币</div>
            <div className="text-2xl font-bold text-orange-900">¥{(cost * 7).toFixed(4)}</div>
          </div>
        </div>

        {/* 实际代码 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💻 实际项目实现（tiktoken.js）</h4>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`// 1. 安装
npm install tiktoken

// 2. 使用
import { encoding_for_model } from 'tiktoken';

const enc = encoding_for_model('gpt-3.5-turbo');

function countTokens(text) {
  const tokens = enc.encode(text);
  return tokens.length;
}

// 3. 计算成本
function calculateCost(tokens, model = 'gpt-3.5-turbo') {
  const pricing = {
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
  };
  
  const price = pricing[model];
  return {
    inputCost: (tokens / 1000) * price.input,
    outputCost: (tokens / 1000) * price.output,
  };
}

// 4. 阶跃星辰 AI 应用
function AIChat() {
  const [messages, setMessages] = useState([]);
  const [totalTokens, setTotalTokens] = useState(0);
  
  const sendMessage = async (content) => {
    const tokens = countTokens(content);
    setTotalTokens(prev => prev + tokens);
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        content,
        tokens // 传递给后端
      })
    });
  };
  
  return (
    <div>
      <div>已消耗: {totalTokens} tokens</div>
      <div>成本: $\{calculateCost(totalTokens)\}</div>
    </div>
  );
}`}
          </pre>
        </div>

        {/* 价格对比 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">💰 主流模型价格对比</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">模型</th>
                  <th className="p-2 text-left">输入价格</th>
                  <th className="p-2 text-left">输出价格</th>
                  <th className="p-2 text-left">上下文长度</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                <tr>
                  <td className="p-2 font-semibold">GPT-3.5 Turbo</td>
                  <td className="p-2">$0.0015 / 1K</td>
                  <td className="p-2">$0.002 / 1K</td>
                  <td className="p-2">4K / 16K</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">GPT-4 Turbo</td>
                  <td className="p-2">$0.01 / 1K</td>
                  <td className="p-2">$0.03 / 1K</td>
                  <td className="p-2">128K</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">阶跃星辰 Step-1</td>
                  <td className="p-2">¥0.005 / 1K</td>
                  <td className="p-2">¥0.01 / 1K</td>
                  <td className="p-2">32K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
