'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

// ===== 核心知识点 1: 泛型接口定义 =====

// API 响应的通用结构
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 分页数据结构
interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 用户类型
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

// AI 会话类型
interface Session {
  id: string;
  title: string;
  model: string;
  createdAt: number;
}

// AI 消息类型
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

// ===== 核心知识点 2: 泛型函数封装 =====

// 通用 HTTP 请求方法
async function request<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    const data: ApiResponse<T> = await response.json();
    
    if (data.code !== 200) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

// GET 请求
async function get<T>(url: string): Promise<ApiResponse<T>> {
  return request<T>(url, { method: 'GET' });
}

// POST 请求
async function post<T, D = any>(
  url: string,
  data?: D
): Promise<ApiResponse<T>> {
  return request<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// PUT 请求
async function put<T, D = any>(
  url: string,
  data?: D
): Promise<ApiResponse<T>> {
  return request<T>(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// DELETE 请求
async function del<T>(url: string): Promise<ApiResponse<T>> {
  return request<T>(url, { method: 'DELETE' });
}

// ===== 核心知识点 3: 具体业务 API 封装 =====

// 用户 API
const userApi = {
  // 获取用户信息
  getUser: (id: number) => get<User>(`/api/users/${id}`),
  
  // 获取用户列表
  getUserList: (page: number, pageSize: number) =>
    get<PageData<User>>(`/api/users?page=${page}&pageSize=${pageSize}`),
  
  // 创建用户
  createUser: (data: Omit<User, 'id'>) => post<User, Omit<User, 'id'>>('/api/users', data),
  
  // 更新用户
  updateUser: (id: number, data: Partial<User>) => put<User, Partial<User>>(`/api/users/${id}`, data),
  
  // 删除用户
  deleteUser: (id: number) => del<void>(`/api/users/${id}`),
};

// AI 会话 API
const sessionApi = {
  // 获取会话列表
  getSessions: () => get<Session[]>('/api/sessions'),
  
  // 创建会话
  createSession: (data: Pick<Session, 'title' | 'model'>) =>
    post<Session, Pick<Session, 'title' | 'model'>>('/api/sessions', data),
  
  // 获取会话消息
  getMessages: (sessionId: string) => get<Message[]>(`/api/sessions/${sessionId}/messages`),
  
  // 发送消息
  sendMessage: (sessionId: string, content: string) =>
    post<Message, { content: string }>(`/api/sessions/${sessionId}/messages`, { content }),
};

// ===== 核心知识点 4: 泛型约束 =====

// 确保 T 有 id 属性
interface HasId {
  id: string | number;
}

// 通用查找函数（需要 id）
function findById<T extends HasId>(items: T[], id: string | number): T | undefined {
  return items.find(item => item.id === id);
}

// 通用更新函数
function updateById<T extends HasId>(items: T[], id: string | number, updates: Partial<T>): T[] {
  return items.map(item => 
    item.id === id ? { ...item, ...updates } : item
  );
}

// ===== 核心知识点 5: 泛型工具类型 =====

// 提取 Promise 的返回值类型
type Awaited<T> = T extends Promise<infer U> ? U : T;

// 提取函数的返回值类型
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

// 使 API 响应可选
type OptionalResponse<T> = ApiResponse<T | null>;

// ===== 核心知识点 6: 高级泛型封装 =====

// API 钩子工厂
function createApiHook<T, P extends any[] = []>(
  apiCall: (...params: P) => Promise<ApiResponse<T>>
) {
  return function useApi() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (...params: P) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiCall(...params);
        setData(response.data);
        return response.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    return { data, loading, error, execute };
  };
}

// 使用示例
const useUserApi = createApiHook(userApi.getUser);
const useSessionsApi = createApiHook(sessionApi.getSessions);

export default function GenericApiDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'examples'>('basic');

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearLogs = () => setLogs([]);

  // ===== 示例 1: 基础泛型使用 =====
  const testBasicGeneric = () => {
    clearLogs();
    addLog('=== 示例 1: 基础泛型使用 ===');
    
    // 模拟 API 数据
    const mockUsers: User[] = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
    ];

    // 使用泛型查找
    const user = findById(mockUsers, 1);
    addLog(`✅ 查找用户 ID=1: ${JSON.stringify(user)}`);

    // 使用泛型更新
    const updated = updateById(mockUsers, 1, { name: 'Alice Updated' });
    addLog(`✅ 更新后: ${JSON.stringify(updated[0])}`);

    // 类型安全：编译时检查
    addLog('💡 TypeScript 在编译时确保类型安全');
    addLog('💡 如果传入没有 id 的对象，会编译错误');
  };

  // ===== 示例 2: API 封装演示 =====
  const testApiEncapsulation = async () => {
    clearLogs();
    addLog('=== 示例 2: API 封装演示 ===');

    // 模拟 API 响应
    const mockResponse: ApiResponse<User> = {
      code: 200,
      message: 'success',
      data: { id: 1, name: 'Alice', email: 'alice@example.com' },
      timestamp: Date.now(),
    };

    addLog('📡 调用 API: userApi.getUser(1)');
    addLog(`✅ 响应类型: ApiResponse<User>`);
    addLog(`✅ 数据: ${JSON.stringify(mockResponse.data)}`);
    addLog('💡 TypeScript 自动推断 data 的类型为 User');
    addLog('💡 可以直接访问 data.name, data.email 等属性');

    // 分页数据
    const mockPageData: ApiResponse<PageData<User>> = {
      code: 200,
      message: 'success',
      data: {
        list: [mockResponse.data],
        total: 100,
        page: 1,
        pageSize: 10,
      },
      timestamp: Date.now(),
    };

    addLog('\n📡 调用 API: userApi.getUserList(1, 10)');
    addLog(`✅ 响应类型: ApiResponse<PageData<User>>`);
    addLog(`✅ 总数: ${mockPageData.data.total}, 当前页: ${mockPageData.data.page}`);
    addLog('💡 嵌套泛型：PageData<User> 包含 User 数组');
  };

  // ===== 示例 3: 类型推断 =====
  const testTypeInference = () => {
    clearLogs();
    addLog('=== 示例 3: TypeScript 类型推断 ===');

    addLog('1️⃣ 函数返回值类型推断:');
    addLog('   const result = await userApi.getUser(1);');
    addLog('   // TS 自动推断 result.data 为 User 类型');

    addLog('\n2️⃣ 泛型约束推断:');
    addLog('   findById(users, 1);');
    addLog('   // TS 检查 users 中的元素必须有 id 属性');

    addLog('\n3️⃣ 工具类型推断:');
    addLog('   type UserData = Awaited<ReturnType<typeof userApi.getUser>>;');
    addLog('   // TS 推断为 ApiResponse<User>');

    addLog('\n💡 TypeScript 的类型推断能力极大提升开发体验');
    addLog('💡 无需手动标注类型，编译器自动推断');
  };

  // ===== 示例 4: 实际应用场景 =====
  const testRealWorldScenario = () => {
    clearLogs();
    addLog('=== 示例 4: 阶跃星辰 AI 实际应用 ===');

    addLog('🎯 场景 1: 获取 AI 会话列表');
    addLog('   const sessions = await sessionApi.getSessions();');
    addLog('   // 返回类型: ApiResponse<Session[]>');
    addLog('   sessions.data.forEach(s => console.log(s.title));');

    addLog('\n🎯 场景 2: 创建新会话');
    addLog('   const newSession = await sessionApi.createSession({');
    addLog('     title: "新对话",');
    addLog('     model: "step-1-turbo"');
    addLog('   });');
    addLog('   // TS 确保只能传递 title 和 model');

    addLog('\n🎯 场景 3: 发送消息');
    addLog('   const message = await sessionApi.sendMessage(');
    addLog('     sessionId,');
    addLog('     "你好，请帮我写代码"');
    addLog('   );');
    addLog('   // 返回类型: ApiResponse<Message>');

    addLog('\n💡 泛型让 API 调用类型安全、自动补全、编译检查');
  };

  // ===== 示例 5: 高级泛型模式 =====
  const testAdvancedGeneric = () => {
    clearLogs();
    addLog('=== 示例 5: 高级泛型模式 ===');

    addLog('🔥 模式 1: 条件类型');
    addLog('   type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;');
    addLog('   // 自动提取 Promise 的返回值类型');

    addLog('\n🔥 模式 2: 映射类型');
    addLog('   type Readonly<T> = { readonly [P in keyof T]: T[P] };');
    addLog('   // 将所有属性变为只读');

    addLog('\n🔥 模式 3: 工具类型组合');
    addLog('   type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>;');
    addLog('   // 选择部分属性并变为可选');

    addLog('\n🔥 模式 4: 递归泛型');
    addLog('   type DeepReadonly<T> = {');
    addLog('     readonly [P in keyof T]: DeepReadonly<T[P]>');
    addLog('   };');
    addLog('   // 递归将所有嵌套属性变为只读');

    addLog('\n💡 高级泛型是 TypeScript 的核心能力');
  };

  return (
    <DemoContainer
      title="泛型封装 API - TypeScript 实战"
      description="深入理解泛型在实际项目中的应用"
    >
      <div className="space-y-6">
        {/* 核心概念 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-3">📚 泛型核心概念</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-blue-900 mb-2">什么是泛型？</h4>
              <p className="text-sm text-gray-800 mb-2">
                泛型是类型的参数化，让代码可以适用于多种类型。
              </p>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`function identity<T>(arg: T): T {
  return arg;
}

identity<number>(42);
identity<string>("hello");`}
              </pre>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-green-900 mb-2">为什么用泛型？</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• <strong>类型安全：</strong>编译时检查</li>
                <li>• <strong>代码复用：</strong>一份代码多种类型</li>
                <li>• <strong>类型推断：</strong>自动推导类型</li>
                <li>• <strong>约束灵活：</strong>可添加类型约束</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-purple-900 mb-2">应用场景</h4>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• API 请求封装</li>
                <li>• 数据结构（数组、映射）</li>
                <li>• React Hooks 封装</li>
                <li>• 工具函数库</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
          <div className="flex border-b">
            {(['basic', 'advanced', 'examples'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 font-medium transition ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab === 'basic' && '基础概念'}
                {tab === 'advanced' && '高级特性'}
                {tab === 'examples' && '实战示例'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* 基础概念 */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">泛型基础语法</h3>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">1. 泛型函数</h4>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// 基础泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 使用
const num = identity<number>(42);    // 显式指定
const str = identity("hello");       // 类型推断

// 多个泛型参数
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair<string, number>("age", 25);`}
                  </pre>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">2. 泛型接口</h4>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// API 响应接口
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 使用
const userResponse: ApiResponse<User> = {
  code: 200,
  message: "success",
  data: { id: 1, name: "Alice" }
};

const listResponse: ApiResponse<User[]> = {
  code: 200,
  message: "success",
  data: [{ id: 1, name: "Alice" }]
};`}
                  </pre>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">3. 泛型类</h4>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`class DataStore<T> {
  private data: T[] = [];

  add(item: T): void {
    this.data.push(item);
  }

  get(index: number): T | undefined {
    return this.data[index];
  }

  getAll(): T[] {
    return [...this.data];
  }
}

// 使用
const userStore = new DataStore<User>();
userStore.add({ id: 1, name: "Alice" });
const user = userStore.get(0); // 类型是 User | undefined`}
                  </pre>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">4. 泛型约束</h4>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// 约束 T 必须有 length 属性
function logLength<T extends { length: number }>(arg: T): void {
  console.log(arg.length);
}

logLength("hello");        // ✅ 字符串有 length
logLength([1, 2, 3]);      // ✅ 数组有 length
logLength({ length: 10 }); // ✅ 对象有 length
// logLength(42);          // ❌ 数字没有 length

// 约束 T 必须有 id
interface HasId {
  id: string | number;
}

function findById<T extends HasId>(items: T[], id: string | number): T | undefined {
  return items.find(item => item.id === id);
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* 高级特性 */}
            {activeTab === 'advanced' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">泛型高级特性</h3>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">1. 条件类型</h4>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// 提取 Promise 的返回值类型
type Awaited<T> = T extends Promise<infer U> ? U : T;

type Result1 = Awaited<Promise<string>>; // string
type Result2 = Awaited<number>;          // number

// 排除 null 和 undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type Result3 = NonNullable<string | null>; // string
type Result4 = NonNullable<number | undefined>; // number`}
                  </pre>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">2. 映射类型</h4>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// 将所有属性变为可选
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 将所有属性变为必填
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// 将所有属性变为只读
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 使用示例
interface User {
  id: number;
  name: string;
  email?: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

type RequiredUser = Required<User>;
// { id: number; name: string; email: string; }

type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; readonly email?: string; }`}
                  </pre>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">3. 工具类型</h4>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// Pick: 选择部分属性
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type UserBasicInfo = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }

// Omit: 排除部分属性
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type UserWithoutId = Omit<User, 'id'>;
// { name: string; email?: string; }

// Record: 创建对象类型
type Record<K extends string | number | symbol, T> = {
  [P in K]: T;
};

type UserMap = Record<string, User>;
// { [key: string]: User; }`}
                  </pre>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">4. infer 关键字</h4>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`// 提取函数返回值类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser(): User { /*...*/ }
type UserType = ReturnType<typeof getUser>; // User

// 提取函数参数类型
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number) { /*...*/ }
type CreateUserParams = Parameters<typeof createUser>; // [string, number]

// 提取数组元素类型
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type NumberArray = number[];
type Element = ArrayElement<NumberArray>; // number`}
                  </pre>
                </div>
              </div>
            )}

            {/* 实战示例 */}
            {activeTab === 'examples' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">实战示例：API 封装</h3>

                <div className="space-y-3">
                  <button
                    onClick={testBasicGeneric}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    示例 1: 基础泛型使用
                  </button>
                  <button
                    onClick={testApiEncapsulation}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ml-2"
                  >
                    示例 2: API 封装演示
                  </button>
                  <button
                    onClick={testTypeInference}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition ml-2"
                  >
                    示例 3: 类型推断
                  </button>
                  <button
                    onClick={testRealWorldScenario}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition ml-2"
                  >
                    示例 4: 实际应用
                  </button>
                  <button
                    onClick={testAdvancedGeneric}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ml-2"
                  >
                    示例 5: 高级泛型
                  </button>
                  <button
                    onClick={clearLogs}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition ml-2"
                  >
                    清空
                  </button>
                </div>

                <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg h-96 overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="text-gray-500 text-center mt-10">
                      点击按钮查看示例
                    </div>
                  ) : (
                    logs.map((log, idx) => (
                      <div key={idx} className="mb-1">
                        {log}
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2">完整 API 封装代码</h4>
                  <details>
                    <summary className="cursor-pointer text-sm text-indigo-800 hover:text-indigo-900">
                      点击查看完整代码
                    </summary>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto mt-2">
{`// 1. 定义响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 2. 通用请求函数
async function request<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, options);
  return response.json();
}

// 3. HTTP 方法封装
async function get<T>(url: string): Promise<ApiResponse<T>> {
  return request<T>(url, { method: 'GET' });
}

async function post<T, D = any>(
  url: string,
  data?: D
): Promise<ApiResponse<T>> {
  return request<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// 4. 业务 API
const userApi = {
  getUser: (id: number) => get<User>(\`/api/users/\${id}\`),
  getUserList: () => get<User[]>('/api/users'),
  createUser: (data: Omit<User, 'id'>) => 
    post<User, Omit<User, 'id'>>('/api/users', data),
};

// 5. 使用
const user = await userApi.getUser(1);
// TypeScript 自动推断 user.data 为 User 类型
console.log(user.data.name);`}
                    </pre>
                  </details>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 面试场景模拟 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 面试场景模拟</h3>

          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：为什么需要泛型？直接用 any 不行吗？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ 好的回答：</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-red-50 p-3 rounded">
                      <p className="font-semibold text-red-900 text-xs">用 any 的问题：</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function identity(arg: any): any {
  return arg;
}

const result = identity("hello");
result.toUpperCase();  // ✅ 编译通过
result.toFixed();      // ✅ 编译通过（运行报错！）
// any 失去了类型检查`}
                      </pre>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-900 text-xs">用泛型的好处：</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function identity<T>(arg: T): T {
  return arg;
}

const result = identity("hello");
result.toUpperCase();  // ✅ 编译通过
result.toFixed();      // ❌ 编译错误！
// 泛型保留类型信息`}
                      </pre>
                    </div>
                  </div>
                  <p className="text-purple-700 text-xs mt-2">
                    💡 <strong>关键：</strong>泛型提供类型安全 + 代码复用，any 只有代码复用
                  </p>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：泛型约束 extends 是怎么工作的？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ 详细讲解：</p>
                  <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`// 1. 基础约束：T 必须有 length 属性
function logLength<T extends { length: number }>(arg: T): void {
  console.log(arg.length); // TS 知道 T 一定有 length
}

// 2. 接口约束
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// 3. 多重约束
interface Comparable {
  compareTo(other: this): number;
}

function sort<T extends HasId & Comparable>(items: T[]): T[] {
  return items.sort((a, b) => a.compareTo(b));
}

// 4. keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alice" };
getProperty(user, "name");  // ✅ 编译通过
getProperty(user, "age");   // ❌ 编译错误：age 不存在`}
                  </pre>
                  <p className="text-purple-700 text-xs mt-2">
                    💡 <strong>extends 的作用：</strong>缩小泛型的范围，确保类型安全
                  </p>
                </div>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：实际项目中泛型有哪些应用场景？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <p className="font-semibold text-green-900">✅ 阶跃星辰 AI 产品的实际应用：</p>
                  <div className="space-y-3 mt-2">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-semibold text-xs">1. API 请求封装</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`// AI 模型列表
const models = await api.get<ModelInfo[]>('/api/models');

// 创建对话
const session = await api.post<Session, CreateSessionDto>(
  '/api/sessions',
  { title: '新对话', model: 'step-1' }
);`}
                      </pre>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-semibold text-xs">2. React Hooks 封装</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`function useApi<T, P extends any[]>(
  apiCall: (...params: P) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const execute = (...params: P) => apiCall(...params);
  return { data, execute };
}

// 使用
const { data: sessions, execute: fetchSessions } = 
  useApi(sessionApi.getSessions);`}
                      </pre>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="font-semibold text-xs">3. 状态管理</p>
                      <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-1">
{`interface Store<T> {
  state: T;
  setState: (updater: Partial<T>) => void;
  subscribe: (listener: (state: T) => void) => void;
}

const sessionStore: Store<SessionState> = createStore({
  sessions: [],
  currentSession: null
});`}
                      </pre>
                    </div>
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
              <strong>追问 1：</strong>泛型的默认值如何设置？
              <p className="ml-4 text-xs text-gray-700">→ <code>function foo&lt;T = string&gt;(arg: T): T</code></p>
            </div>
            <div>
              <strong>追问 2：</strong>泛型类型参数可以互相引用吗？
              <p className="ml-4 text-xs text-gray-700">→ 可以，如 <code>function f&lt;T, U extends T&gt;(a: T, b: U)</code></p>
            </div>
            <div>
              <strong>追问 3：</strong>如何约束泛型必须是联合类型的一部分？
              <p className="ml-4 text-xs text-gray-700">→ 使用 extends: <code>function f&lt;T extends 'a' | 'b'&gt;(arg: T)</code></p>
            </div>
            <div>
              <strong>追问 4：</strong>泛型在运行时存在吗？
              <p className="ml-4 text-xs text-gray-700">→ 不存在，TypeScript 编译后会擦除所有类型信息</p>
            </div>
          </div>
        </div>

        {/* 思维体系定位 */}
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
                  <span className="px-2 py-1 bg-cyan-200 text-cyan-900 rounded text-xs font-semibold">TypeScript</span>
                  <span className="text-gray-400">→</span>
                  <span className="px-2 py-1 bg-cyan-300 text-cyan-950 rounded text-xs font-semibold">泛型系统</span>
                </div>
                <p className="text-gray-600 mt-2">
                  泛型是 TypeScript 类型系统的核心特性，属于<strong>语言层</strong>的高级概念。
                  它实现了类型安全的代码复用，是构建类型安全 API、组件库、工具函数的基础。
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
                    <li>• TypeScript 基础</li>
                    <li>• 类型系统</li>
                    <li>• 接口与类型别名</li>
                    <li>• 函数类型</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">💡 类型安全基础</p>
                </div>

                {/* 横向关联 */}
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-xs font-semibold text-purple-900 mb-2">↔️ 横向关联</div>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• 类型推断</li>
                    <li>• 条件类型</li>
                    <li>• 映射类型</li>
                    <li>• 类型守卫</li>
                  </ul>
                  <p className="text-xs text-purple-600 mt-2">💡 高级类型系统</p>
                </div>

                {/* 后续应用 */}
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs font-semibold text-green-900 mb-2">⬇️ 后续应用</div>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• 类型安全的 API</li>
                    <li>• React 组件泛型</li>
                    <li>• 工具函数库</li>
                    <li>• 大型项目架构</li>
                  </ul>
                  <p className="text-xs text-green-600 mt-2">💡 生产级应用</p>
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
                    <strong className="text-sm">当前阶段：掌握泛型基础</strong>
                    <p className="text-xs text-gray-600">理解泛型函数、泛型接口、泛型类的使用和约束</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">2️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">下一步：泛型约束</strong>
                    <p className="text-xs text-gray-600">extends 关键字、keyof、in、as 等操作符</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">3️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">进阶：条件类型 + 映射类型</strong>
                    <p className="text-xs text-gray-600">实现 Partial、Pick、Omit 等工具类型</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">4️⃣</span>
                  <div className="flex-1">
                    <strong className="text-sm">深入：类型体操</strong>
                    <p className="text-xs text-gray-600">递归类型、infer 推断、复杂类型变换</p>
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
                      {[1,2,3,4].map(i => (
                        <span key={i} className="text-yellow-500">⭐</span>
                      ))}
                      <span className="text-gray-300">⭐</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">中高级 TS 必考</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">难度系数：</span>
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <span key={i} className="text-red-500">🔥</span>
                      ))}
                      <span className="text-gray-300">🔥</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">中高难度，需要理解类型系统</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 rounded">
                <p className="text-xs text-yellow-800">
                  <strong>💡 面试建议：</strong>能讲清楚泛型的作用、能手写泛型工具函数、能实现基本的工具类型（Partial/Pick/Omit）。
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
                  <p className="text-xs text-gray-600 mt-1">需要深入理解：类型推断、类型兼容性、协变逆变</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>广度（应用场景）</span>
                    <span className="text-green-600 font-semibold">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">应用广泛：API 封装、组件开发、工具库、大型项目</p>
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
      </div>
    </DemoContainer>
  );
}
