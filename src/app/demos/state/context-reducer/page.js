'use client';

import { createContext, useContext, useReducer } from 'react';
import DemoContainer from '@/components/DemoContainer';

// 1. 创建 Context
const CartContext = createContext();

// 2. 定义 Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    default:
      return state;
  }
}

// 3. Provider 组件
function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <CartContext.Provider value={{ state, dispatch, total }}>
      {children}
    </CartContext.Provider>
  );
}

// 4. 自定义 Hook
function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

// 商品列表组件
function ProductList() {
  const { dispatch } = useCart();
  
  const products = [
    { id: 1, name: 'MacBook Pro', price: 12999 },
    { id: 2, name: 'iPhone 15', price: 5999 },
    { id: 3, name: 'AirPods Pro', price: 1999 },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">商品列表</h3>
      {products.map(product => (
        <div key={product.id} className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition">
          <div>
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">¥{product.price}</div>
          </div>
          <button
            onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
          >
            加入购物车
          </button>
        </div>
      ))}
    </div>
  );
}

// 购物车组件
function ShoppingCart() {
  const { state, dispatch, total } = useCart();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">购物车</h3>
        {state.items.length > 0 && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_CART' })}
            className="text-sm text-red-600 hover:text-red-700"
          >
            清空
          </button>
        )}
      </div>
      
      {state.items.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          购物车为空
        </div>
      ) : (
        <>
          {state.items.map(item => (
            <div key={item.id} className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">¥{item.price}</div>
                </div>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  删除
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch({
                    type: 'UPDATE_QUANTITY',
                    payload: { id: item.id, quantity: Math.max(1, item.quantity - 1) }
                  })}
                  className="w-8 h-8 bg-white border-2 border-gray-300 rounded hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => dispatch({
                    type: 'UPDATE_QUANTITY',
                    payload: { id: item.id, quantity: item.quantity + 1 }
                  })}
                  className="w-8 h-8 bg-white border-2 border-gray-300 rounded hover:bg-gray-100"
                >
                  +
                </button>
                <span className="ml-auto font-semibold text-green-700">
                  ¥{item.price * item.quantity}
                </span>
              </div>
            </div>
          ))}
          
          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>总计</span>
              <span>¥{total.toLocaleString()}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Demo 主组件
function CartDemo() {
  return (
    <CartProvider>
      <div className="grid grid-cols-2 gap-6">
        <ProductList />
        <ShoppingCart />
      </div>
    </CartProvider>
  );
}

export default function ContextReducerDemo() {
  return (
    <DemoContainer
      title="Context + Reducer"
      description="React 轻量级状态管理方案 - 购物车示例"
    >
      <div className="space-y-6">
        {/* 交互式 Demo */}
        <CartDemo />

        {/* 核心概念 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💡 核心概念</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Context：</strong>提供全局状态，避免 props 层层传递</li>
            <li>• <strong>useReducer：</strong>管理复杂状态逻辑，类似 Redux</li>
            <li>• <strong>组合使用：</strong>比 Redux 更轻量，适合中小型项目</li>
            <li>• <strong>自定义 Hook：</strong>封装 useContext，简化使用</li>
          </ul>
        </div>

        {/* 核心代码实现 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">📝 核心代码实现</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`// 1. 创建 Context
const CartContext = createContext();

// 2. 定义 Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    default:
      return state;
  }
}

// 3. Provider 组件
function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

// 4. 自定义 Hook
function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

// 5. 使用
function ProductList() {
  const { dispatch } = useCart();
  
  return (
    <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}>
      加入购物车
    </button>
  );
}`}
            </pre>
          </div>
        </div>

        {/* 面试场景模拟 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">🎤 面试场景模拟</h3>

          <div className="space-y-4">
            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：Context + Reducer 和 Redux 有什么区别？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-semibold text-blue-900 mb-2">Context + Reducer</p>
                    <ul className="text-xs space-y-1">
                      <li>✅ React 内置，无需额外依赖</li>
                      <li>✅ 学习成本低</li>
                      <li>✅ 适合中小型项目</li>
                      <li>❌ 缺少中间件、DevTools</li>
                      <li>❌ 性能优化需手动处理</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="font-semibold text-purple-900 mb-2">Redux</p>
                    <ul className="text-xs space-y-1">
                      <li>✅ 强大的中间件系统</li>
                      <li>✅ Redux DevTools</li>
                      <li>✅ 性能优化完善</li>
                      <li>❌ 需要额外安装</li>
                      <li>❌ 样板代码较多</li>
                    </ul>
                  </div>
                </div>
                <p className="text-purple-700 mt-2">💡 <strong>选择建议：</strong>中小型项目用 Context+Reducer，大型复杂项目用 Redux/Zustand</p>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：Context 会导致不必要的重渲染吗？如何优化？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>是的，Context value 变化会导致所有消费者重渲染</strong></p>
                <p><strong>优化方案：</strong></p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li><strong>拆分 Context：</strong>状态和 dispatch 分开</li>
                  <li><strong>useMemo：</strong>缓存 value 对象</li>
                  <li><strong>React.memo：</strong>包裹消费组件</li>
                  <li><strong>useSelector：</strong>只订阅需要的状态</li>
                </ol>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`// 拆分 Context 优化
const StateContext = createContext();
const DispatchContext = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                面试官：请手写一个简单的状态管理
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
{`// 完整示例：计数器状态管理
import { createContext, useContext, useReducer } from 'react';

const CountContext = createContext();

function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      throw new Error(\`Unknown action: \${action.type}\`);
  }
}

export function CountProvider({ children }) {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <CountContext.Provider value={{ state, dispatch }}>
      {children}
    </CountContext.Provider>
  );
}

export function useCount() {
  const context = useContext(CountContext);
  if (!context) {
    throw new Error('useCount must be used within CountProvider');
  }
  return context;
}

// 使用
function Counter() {
  const { state, dispatch } = useCount();
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}`}
                </pre>
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
                Q1: 为什么要自定义 Hook（如 useCart）？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <ul className="list-disc ml-5">
                  <li><strong>简化使用：</strong>不需要每次都 import Context</li>
                  <li><strong>错误检查：</strong>确保在 Provider 内使用</li>
                  <li><strong>类型安全：</strong>TypeScript 类型推导更好</li>
                  <li><strong>易于维护：</strong>统一的访问入口</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: Reducer 的命名规范是什么？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <ul className="list-disc ml-5">
                  <li><strong>Action type：</strong>大写下划线，如 ADD_ITEM、REMOVE_ITEM</li>
                  <li><strong>Reducer 函数：</strong>名词 + Reducer，如 cartReducer</li>
                  <li><strong>State 字段：</strong>驼峰命名，如 isLoading、userInfo</li>
                  <li><strong>遵循 Redux 风格：</strong>保持一致性，方便团队协作</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 如何处理异步操作？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <p><strong>方案1：在组件中处理</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`async function handleSubmit() {
  dispatch({ type: 'LOADING' });
  try {
    const data = await api.fetchData();
    dispatch({ type: 'SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'ERROR', payload: error.message });
  }
}`}
                </pre>
                <p className="mt-2"><strong>方案2：自定义 Hook 封装</strong></p>
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs mt-2">
{`function useAsyncAction() {
  const { dispatch } = useCart();
  
  return async (action) => {
    dispatch({ type: 'LOADING' });
    try {
      const result = await action();
      dispatch({ type: 'SUCCESS', payload: result });
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error });
    }
  };
}`}
                </pre>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q4: 如何实现类似 Redux 中间件的功能？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`// 增强版 dispatch
function useEnhancedReducer(reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const enhancedDispatch = (action) => {
    // 日志中间件
    console.log('Dispatching:', action);
    console.log('Previous state:', state);
    
    dispatch(action);
    
    // 注意：这里无法获取最新状态，需要用 useEffect
  };
  
  return [state, enhancedDispatch];
}

// 使用
const [state, dispatch] = useEnhancedReducer(reducer, initialState);`}
                </pre>
              </div>
            </details>
          </div>
        </div>

        {/* 实际应用场景 */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h4 className="font-semibold text-green-900 mb-2">🎯 实际应用场景</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>购物车：</strong>商品增删改、价格计算</li>
            <li>• <strong>表单管理：</strong>多步骤表单、复杂验证</li>
            <li>• <strong>主题切换：</strong>全局主题状态管理</li>
            <li>• <strong>用户认证：</strong>登录状态、权限管理</li>
            <li>• <strong>通知系统：</strong>全局消息、Toast 管理</li>
          </ul>
        </div>

        {/* 追问场景 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-3">🔥 可能的追问</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div>
              <strong>追问 1：</strong>多个 Context 嵌套会有什么问题？
              <p className="ml-4 text-xs text-gray-700">→ Provider Hell，可以用组合 Provider 或者 Zustand 解决</p>
            </div>
            <div>
              <strong>追问 2：</strong>Context 更新会导致所有子组件重渲染吗？
              <p className="ml-4 text-xs text-gray-700">→ 只有消费了 Context 的组件会重渲染，可以用 React.memo 优化</p>
            </div>
            <div>
              <strong>追问 3：</strong>什么时候用 useState，什么时候用 useReducer？
              <p className="ml-4 text-xs text-gray-700">→ 简单状态用 useState，复杂状态逻辑用 useReducer</p>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}