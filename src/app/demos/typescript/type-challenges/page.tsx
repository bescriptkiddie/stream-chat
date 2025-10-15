'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

// ===== 类型体操实现 =====

// 1. Partial - 将所有属性变为可选
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// 2. Required - 将所有属性变为必填
type MyRequired<T> = {
  [P in keyof T]-?: T[P];
};

// 3. Readonly - 将所有属性变为只读
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 4. Pick - 选择部分属性
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 5. Omit - 排除部分属性
type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;

// 6. Exclude - 从联合类型中排除
type MyExclude<T, U> = T extends U ? never : T;

// 7. Extract - 从联合类型中提取
type MyExtract<T, U> = T extends U ? T : never;

// 8. NonNullable - 排除 null 和 undefined
type MyNonNullable<T> = T extends null | undefined ? never : T;

// 9. ReturnType - 获取函数返回值类型
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 10. Parameters - 获取函数参数类型
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

// 11. Record - 创建对象类型
type MyRecord<K extends string | number | symbol, T> = {
  [P in K]: T;
};

// 12. DeepReadonly - 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 13. DeepPartial - 深度可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 14. PartialPick - 部分属性可选
type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

// 15. GetRequired - 获取必填属性
type GetRequired<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P];
};

// 16. GetOptional - 获取可选属性
type GetOptional<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P];
};

// 17. Mutable - 移除 readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// 18. PromiseType - 提取 Promise 类型
type PromiseType<T> = T extends Promise<infer U> ? U : T;

// 19. FunctionArguments - 获取第一个参数类型
type FirstArg<T> = T extends (arg: infer U, ...args: any[]) => any ? U : never;

// 20. TupleToUnion - 元组转联合类型
type TupleToUnion<T> = T extends (infer U)[] ? U : never;

// ===== 示例类型定义 =====
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  readonly createdAt: Date;
}

interface Company {
  name: string;
  address: {
    street: string;
    city: string;
  };
}

export default function TypeChallengesDemo() {
  const [activeChallenge, setActiveChallenge] = useState<number>(1);
  const [showAnswer, setShowAnswer] = useState(false);

  const challenges = [
    {
      id: 1,
      title: 'Partial - 全部可选',
      difficulty: '简单',
      question: '实现 TypeScript 的 Partial 工具类型，将对象所有属性变为可选',
      hint: '使用映射类型 + ?: 修饰符',
      implementation: `type MyPartial<T> = {
  [P in keyof T]?: T[P];
};`,
      example: `interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = MyPartial<User>;
// {
//   id?: number;
//   name?: string;
//   email?: string;
// }`,
      explanation: `
**原理：**
1. 使用 [P in keyof T] 遍历 T 的所有键
2. ?: 将属性变为可选
3. T[P] 保持原有的类型

**应用场景：**
- 更新对象时，只传递要修改的字段
- 表单提交，允许部分字段为空
- API 参数，支持可选配置`,
    },
    {
      id: 2,
      title: 'Required - 全部必填',
      difficulty: '简单',
      question: '实现 TypeScript 的 Required 工具类型，将对象所有属性变为必填',
      hint: '使用 -?: 移除可选修饰符',
      implementation: `type MyRequired<T> = {
  [P in keyof T]-?: T[P];
};`,
      example: `interface User {
  id: number;
  name?: string;
  email?: string;
}

type RequiredUser = MyRequired<User>;
// {
//   id: number;
//   name: string;  // 不再可选
//   email: string; // 不再可选
// }`,
      explanation: `
**原理：**
1. -?: 移除属性的可选性
2. 强制所有属性必填

**应用场景：**
- 数据库实体定义
- 验证必填字段
- 严格的类型约束`,
    },
    {
      id: 3,
      title: 'Pick - 选择属性',
      difficulty: '简单',
      question: '实现 TypeScript 的 Pick 工具类型，从对象中选择部分属性',
      hint: '使用 K extends keyof T 约束，然后映射 K',
      implementation: `type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};`,
      example: `interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserBasicInfo = MyPick<User, 'id' | 'name'>;
// {
//   id: number;
//   name: string;
// }`,
      explanation: `
**原理：**
1. K extends keyof T 确保 K 是 T 的键
2. [P in K] 只遍历选中的键
3. T[P] 保持原有类型

**应用场景：**
- 创建 DTO（Data Transfer Object）
- 只暴露部分字段给前端
- 表单数据子集`,
    },
    {
      id: 4,
      title: 'Omit - 排除属性',
      difficulty: '中等',
      question: '实现 TypeScript 的 Omit 工具类型，排除对象的部分属性',
      hint: '结合 Pick 和 Exclude',
      implementation: `type MyOmit<T, K extends keyof T> = 
  MyPick<T, Exclude<keyof T, K>>;
  
// 或者直接实现
type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};`,
      example: `interface User {
  id: number;
  name: string;
  password: string;
  email: string;
}

type UserPublicInfo = MyOmit<User, 'password'>;
// {
//   id: number;
//   name: string;
//   email: string;
// }`,
      explanation: `
**原理：**
1. Exclude<keyof T, K> 得到不包含 K 的键
2. 遍历剩余的键创建新类型

**应用场景：**
- 隐藏敏感信息（密码等）
- 去除冗余字段
- 创建新类型而不影响原类型`,
    },
    {
      id: 5,
      title: 'ReturnType - 函数返回值',
      difficulty: '中等',
      question: '实现获取函数返回值类型的工具类型',
      hint: '使用 infer 推断返回值',
      implementation: `type MyReturnType<T> = 
  T extends (...args: any[]) => infer R 
    ? R 
    : never;`,
      example: `function getUser() {
  return { id: 1, name: "Alice" };
}

type UserType = MyReturnType<typeof getUser>;
// { id: number; name: string; }

async function fetchData() {
  return { data: "hello" };
}

type DataType = MyReturnType<typeof fetchData>;
// Promise<{ data: string; }>`,
      explanation: `
**原理：**
1. T extends (...args: any[]) => infer R 检查是否是函数
2. infer R 推断返回值类型
3. 不是函数返回 never

**应用场景：**
- 根据函数推断返回值类型
- API 响应类型推断
- 高阶函数类型定义`,
    },
    {
      id: 6,
      title: 'DeepReadonly - 深度只读',
      difficulty: '困难',
      question: '实现深度只读，将对象及其所有嵌套对象都变为只读',
      hint: '递归处理，判断是否是对象',
      implementation: `type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};`,
      example: `interface Company {
  name: string;
  address: {
    street: string;
    city: string;
  };
}

type ReadonlyCompany = DeepReadonly<Company>;
// {
//   readonly name: string;
//   readonly address: {
//     readonly street: string;
//     readonly city: string;
//   };
// }`,
      explanation: `
**原理：**
1. 检查属性是否是对象
2. 是对象则递归调用 DeepReadonly
3. 不是对象直接设为 readonly

**应用场景：**
- 配置对象保护
- Redux state 不可变
- 深度冻结数据结构`,
    },
  ];

  const currentChallenge = challenges.find(c => c.id === activeChallenge);

  return (
    <DemoContainer
      title="类型体操 - TypeScript 工具类型实现"
      description="手写 Partial、Pick、Omit 等工具类型，深入理解 TypeScript 类型系统"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📚 类型体操核心技术</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm">映射类型</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`[P in K]: T[P]`}
              </pre>
              <p className="text-xs text-gray-600 mt-1">遍历类型的键</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2 text-sm">条件类型</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`T extends U
  ? X : Y`}
              </pre>
              <p className="text-xs text-gray-600 mt-1">类型判断</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-900 mb-2 text-sm">infer 关键字</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`T extends 
  (...args) => 
    infer R`}
              </pre>
              <p className="text-xs text-gray-600 mt-1">推断类型</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-orange-900 mb-2 text-sm">keyof 操作符</h4>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`keyof T
// 获取所有键`}
              </pre>
              <p className="text-xs text-gray-600 mt-1">提取键</p>
            </div>
          </div>
        </div>

        {/* 挑战列表 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <h3 className="text-lg font-bold text-gray-900">🎯 类型挑战（点击切换）</h3>
          </div>

          <div className="flex">
            {/* 左侧：题目列表 */}
            <div className="w-64 border-r bg-gray-50 p-4 space-y-2">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  onClick={() => {
                    setActiveChallenge(challenge.id);
                    setShowAnswer(false);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    activeChallenge === challenge.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="font-medium text-sm">{challenge.title}</div>
                  <div className={`text-xs mt-1 ${
                    activeChallenge === challenge.id ? 'text-indigo-200' : 'text-gray-500'
                  }`}>
                    {challenge.difficulty}
                  </div>
                </div>
              ))}
            </div>

            {/* 右侧：题目详情 */}
            <div className="flex-1 p-6">
              {currentChallenge && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {currentChallenge.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        currentChallenge.difficulty === '简单' ? 'bg-green-100 text-green-800' :
                        currentChallenge.difficulty === '中等' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {currentChallenge.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-700">{currentChallenge.question}</p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                    <div className="font-semibold text-yellow-900 text-sm">💡 提示</div>
                    <div className="text-sm text-yellow-800 mt-1">{currentChallenge.hint}</div>
                  </div>

                  <div>
                    <button
                      onClick={() => setShowAnswer(!showAnswer)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      {showAnswer ? '隐藏答案' : '查看答案'}
                    </button>
                  </div>

                  {showAnswer && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="font-semibold text-blue-900 mb-2">✅ 实现代码</div>
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {currentChallenge.implementation}
                        </pre>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="font-semibold text-green-900 mb-2">📝 使用示例</div>
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {currentChallenge.example}
                        </pre>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="font-semibold text-purple-900 mb-2">📖 详细讲解</div>
                        <div className="text-sm text-gray-800 whitespace-pre-line">
                          {currentChallenge.explanation}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 类型体操速查表 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📋 类型体操速查表</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">工具类型</th>
                  <th className="p-2 text-left">作用</th>
                  <th className="p-2 text-left">实现关键</th>
                  <th className="p-2 text-left">难度</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { name: 'Partial<T>', desc: '所有属性可选', key: '[P in keyof T]?: T[P]', diff: '⭐' },
                  { name: 'Required<T>', desc: '所有属性必填', key: '[P in keyof T]-?: T[P]', diff: '⭐' },
                  { name: 'Readonly<T>', desc: '所有属性只读', key: 'readonly [P in keyof T]', diff: '⭐' },
                  { name: 'Pick<T, K>', desc: '选择部分属性', key: '[P in K]: T[P]', diff: '⭐' },
                  { name: 'Omit<T, K>', desc: '排除部分属性', key: 'Pick + Exclude', diff: '⭐⭐' },
                  { name: 'Exclude<T, U>', desc: '从联合类型排除', key: 'T extends U ? never : T', diff: '⭐⭐' },
                  { name: 'Extract<T, U>', desc: '从联合类型提取', key: 'T extends U ? T : never', diff: '⭐⭐' },
                  { name: 'NonNullable<T>', desc: '排除null/undefined', key: 'T extends null|undefined ? never : T', diff: '⭐⭐' },
                  { name: 'ReturnType<T>', desc: '获取返回值类型', key: 'infer R', diff: '⭐⭐⭐' },
                  { name: 'Parameters<T>', desc: '获取参数类型', key: 'infer P', diff: '⭐⭐⭐' },
                  { name: 'Record<K, T>', desc: '创建对象类型', key: '[P in K]: T', diff: '⭐⭐' },
                  { name: 'DeepReadonly<T>', desc: '深度只读', key: '递归', diff: '⭐⭐⭐⭐' },
                  { name: 'DeepPartial<T>', desc: '深度可选', key: '递归', diff: '⭐⭐⭐⭐' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2 font-mono text-indigo-600">{row.name}</td>
                    <td className="p-2 text-gray-700">{row.desc}</td>
                    <td className="p-2 font-mono text-xs text-gray-600">{row.key}</td>
                    <td className="p-2">{row.diff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 进阶挑战 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🔥 进阶挑战</h3>

          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                挑战 1: 实现 DeepPartial（深度可选）
              </summary>
              <div className="mt-3 space-y-2">
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-sm text-yellow-900 font-semibold">要求：</p>
                  <p className="text-xs text-yellow-800">将对象及其所有嵌套对象的属性都变为可选</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-green-900 font-semibold">答案：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object 
    ? DeepPartial<T[P]> 
    : T[P];
};

// 使用
interface Config {
  app: {
    name: string;
    version: string;
    settings: {
      theme: string;
    };
  };
}

type PartialConfig = DeepPartial<Config>;
// app 可选, app.name 可选, app.settings.theme 可选`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                挑战 2: 实现 PartialPick（部分属性可选）
              </summary>
              <div className="mt-3 space-y-2">
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-sm text-yellow-900 font-semibold">要求：</p>
                  <p className="text-xs text-yellow-800">选中的属性变为可选，其他属性保持不变</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-green-900 font-semibold">答案：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`type PartialPick<T, K extends keyof T> = 
  Partial<Pick<T, K>> & Omit<T, K>;

// 使用
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserPartialName = PartialPick<User, 'name' | 'email'>;
// {
//   id: number;        // 必填
//   name?: string;     // 可选
//   email?: string;    // 可选
//   age: number;       // 必填
// }`}
                  </pre>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                挑战 3: 实现 GetRequired（获取必填属性）
              </summary>
              <div className="mt-3 space-y-2">
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-sm text-yellow-900 font-semibold">要求：</p>
                  <p className="text-xs text-yellow-800">从对象中提取所有必填属性</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-green-900 font-semibold">答案：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`type GetRequired<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P];
};

// 使用
interface User {
  id: number;
  name: string;
  email?: string;
  age?: number;
}

type UserRequired = GetRequired<User>;
// {
//   id: number;
//   name: string;
// }`}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* 面试高频 QA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">❓ 面试高频 QA</h3>

          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q1: 映射类型中的 ? 和 -? 有什么区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-semibold text-blue-900 text-xs">? 添加可选</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`type Partial<T> = {
  [P in keyof T]?: T[P];
};
// 将属性变为可选`}
                    </pre>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-semibold text-green-900 text-xs">-? 移除可选</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`type Required<T> = {
  [P in keyof T]-?: T[P];
};
// 移除可选，变为必填`}
                    </pre>
                  </div>
                </div>
                <p className="text-purple-700 text-xs mt-2">
                  💡 同理，readonly 和 -readonly 分别添加和移除只读
                </p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: infer 是如何工作的？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>infer 用于在条件类型中推断类型：</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`// 1. 推断函数返回值
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
//                                                 ^^^^^^^ 推断这里的类型

// 2. 推断函数参数
type Parameters<T> = T extends (...args: infer P) => any ? P : never;
//                                        ^^^^^^^ 推断这里的类型

// 3. 推断 Promise 类型
type Awaited<T> = T extends Promise<infer U> ? U : T;
//                                  ^^^^^^^ 推断这里的类型

// 4. 推断数组元素类型
type ArrayElement<T> = T extends (infer U)[] ? U : never;
//                                 ^^^^^^^ 推断这里的类型`}
                </pre>
                <p className="text-purple-700 text-xs mt-2">
                  💡 <strong>关键：</strong>infer 声明一个类型变量，TS 会自动推断其类型
                </p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 为什么需要 extends keyof T 约束？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>类型安全保证：</strong></p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 p-3 rounded">
                    <p className="font-semibold text-red-900 text-xs">❌ 没有约束</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`type Pick<T, K> = {
  [P in K]: T[P]; 
  // ❌ 错误：K 可能不是 T 的键
};

type Result = Pick<User, 'xyz'>;
// 编译通过，但 'xyz' 不存在`}
                    </pre>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-semibold text-green-900 text-xs">✅ 有约束</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
  // ✅ K 必须是 T 的键
};

type Result = Pick<User, 'xyz'>;
// ❌ 编译错误：'xyz' 不是 User 的键`}
                    </pre>
                  </div>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 实际项目中如何应用这些类型体操？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>阶跃星辰 AI 产品的实际应用：</strong></p>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-semibold text-xs">1. API 请求参数</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`interface CreateSessionDto {
  title: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

// 更新时只需部分字段
type UpdateSessionDto = Partial<CreateSessionDto>;

// 响应只返回部分字段
type SessionResponse = Pick<Session, 'id' | 'title' | 'createdAt'>;`}
                    </pre>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-semibold text-xs">2. 表单状态管理</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

// 表单错误状态（所有字段可选）
type FormErrors = Partial<Record<keyof FormData, string>>;

// 表单验证规则（部分字段必填）
type FormRules = PartialPick<FormData, 'rememberMe'>;`}
                    </pre>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="font-semibold text-xs">3. Redux State</p>
                    <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`interface AppState {
  user: User;
  sessions: Session[];
  config: Config;
}

// State 只读
type ReadonlyState = DeepReadonly<AppState>;

// Action payload 类型
type UpdateUserAction = {
  type: 'UPDATE_USER';
  payload: Partial<User>;
};`}
                    </pre>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* 追问场景 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-3">🔥 可能的追问</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div>
              <strong>追问 1：</strong>类型体操会影响运行时性能吗？
              <p className="ml-4 text-xs text-gray-700">→ 不会，TypeScript 编译后会擦除所有类型信息</p>
            </div>
            <div>
              <strong>追问 2：</strong>如何调试复杂的类型？
              <p className="ml-4 text-xs text-gray-700">→ 使用 type-fest 库 + TS Playground + 类型注释</p>
            </div>
            <div>
              <strong>追问 3：</strong>递归类型有深度限制吗？
              <p className="ml-4 text-xs text-gray-700">→ 有，TS 4.5+ 支持尾递归优化，深度限制约 1000 层</p>
            </div>
            <div>
              <strong>追问 4：</strong>类型体操和 JavaScript 运行时有什么关系？
              <p className="ml-4 text-xs text-gray-700">→ 完全无关，类型是编译时概念，不存在于运行时</p>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
