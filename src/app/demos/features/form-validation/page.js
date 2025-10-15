'use client';

import { useState } from 'react';
import DemoContainer from '@/components/DemoContainer';

// 验证规则
const validators = {
  required: (value) => value.trim() !== '' || '此字段为必填项',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || '请输入有效的邮箱地址',
  minLength: (min) => (value) => value.length >= min || `最少需要 ${min} 个字符`,
  maxLength: (max) => (value) => value.length <= max || `最多允许 ${max} 个字符`,
  password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value) || '密码需包含大小写字母和数字，至少8位',
  phone: (value) => /^1[3-9]\d{9}$/.test(value) || '请输入有效的手机号码',
};

// 自定义 Hook
function useFormValidation(initialValues, rules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    if (!rules[name]) return true;

    for (const validator of rules[name]) {
      const result = validator(value);
      if (result !== true) {
        return result;
      }
    }
    return true;
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // 实时验证
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error === true ? '' : error
    }));
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // 离焦验证
    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error === true ? '' : error
    }));
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    
    // 全量验证
    const newErrors = {};
    Object.keys(rules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error !== true) {
        newErrors[name] = error;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}

export default function FormValidationDemo() {
  const [submitResult, setSubmitResult] = useState(null);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormValidation(
    { username: '', email: '', password: '', phone: '' },
    {
      username: [validators.required, validators.minLength(3), validators.maxLength(20)],
      email: [validators.required, validators.email],
      password: [validators.required, validators.password],
      phone: [validators.required, validators.phone],
    }
  );

  const onSubmit = (data) => {
    setSubmitResult(data);
    setTimeout(() => setSubmitResult(null), 3000);
  };

  return (
    <DemoContainer
      title="表单验证"
      description="多种验证策略 - 实时验证、离焦验证、提交验证"
    >
      <div className="space-y-6">
        {/* 交互式 Demo */}
        <div className="grid grid-cols-2 gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">注册表单</h3>
            
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用户名 *
              </label>
              <input
                type="text"
                value={values.username}
                onChange={(e) => handleChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring focus:ring-indigo-200 ${
                  touched.username && errors.username
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-indigo-500'
                }`}
                placeholder="3-20个字符"
              />
              {touched.username && errors.username && (
                <div className="mt-1 text-sm text-red-600">{errors.username}</div>
              )}
            </div>

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱 *
              </label>
              <input
                type="email"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring focus:ring-indigo-200 ${
                  touched.email && errors.email
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-indigo-500'
                }`}
                placeholder="example@email.com"
              />
              {touched.email && errors.email && (
                <div className="mt-1 text-sm text-red-600">{errors.email}</div>
              )}
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码 *
              </label>
              <input
                type="password"
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring focus:ring-indigo-200 ${
                  touched.password && errors.password
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-indigo-500'
                }`}
                placeholder="大小写字母+数字，至少8位"
              />
              {touched.password && errors.password && (
                <div className="mt-1 text-sm text-red-600">{errors.password}</div>
              )}
            </div>

            {/* 手机号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                手机号 *
              </label>
              <input
                type="tel"
                value={values.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:ring focus:ring-indigo-200 ${
                  touched.phone && errors.phone
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-indigo-500'
                }`}
                placeholder="13800138000"
              />
              {touched.phone && errors.phone && (
                <div className="mt-1 text-sm text-red-600">{errors.phone}</div>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              提交注册
            </button>
          </form>

          {/* 实时状态显示 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">表单状态</h3>
            
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-blue-900 mb-2">当前值</div>
              <pre className="text-xs text-blue-800 overflow-auto">
                {JSON.stringify(values, null, 2)}
              </pre>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-red-900 mb-2">错误信息</div>
              <pre className="text-xs text-red-800 overflow-auto">
                {JSON.stringify(errors, null, 2)}
              </pre>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-yellow-900 mb-2">已触摸字段</div>
              <pre className="text-xs text-yellow-800 overflow-auto">
                {JSON.stringify(touched, null, 2)}
              </pre>
            </div>

            {submitResult && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                <div className="text-sm font-semibold text-green-900 mb-2">✅ 提交成功!</div>
                <pre className="text-xs text-green-800 overflow-auto">
                  {JSON.stringify(submitResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* 核心概念 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">💡 核心概念</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>实时验证 (onChange)：</strong>用户输入时立即验证</li>
            <li>• <strong>离焦验证 (onBlur)：</strong>失去焦点时验证</li>
            <li>• <strong>提交验证 (onSubmit)：</strong>提交时全量验证</li>
            <li>• <strong>touched 状态：</strong>只显示用户操作过字段的错误</li>
          </ul>
        </div>

        {/* 核心代码实现 */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">📝 核心代码实现</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`// 验证规则
const validators = {
  required: (value) => value.trim() !== '' || '此字段为必填项',
  email: (value) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) || '请输入有效的邮箱地址',
  minLength: (min) => (value) => value.length >= min || \`最少需要 \${min} 个字符\`,
};

function useFormValidation(initialValues, rules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    for (const validator of rules[name]) {
      const result = validator(value);
      if (result !== true) return result;
    }
    return true;
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error === true ? '' : error }));
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(rules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error !== true) newErrors[name] = error;
    });
    if (Object.keys(newErrors).length === 0) {
      onSubmit(values);
    }
  };

  return { values, errors, touched, handleChange, handleBlur, handleSubmit };
}

// 使用
const { values, errors, touched, handleChange, handleBlur, handleSubmit } = 
  useFormValidation(
    { email: '', password: '' },
    {
      email: [validators.required, validators.email],
      password: [validators.required, validators.minLength(8)],
    }
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
                Q1: 为什么需要 touched 状态？
              </summary>
              <div className="mt-3 text-sm text-gray-800 space-y-2">
                <p><strong>用户体验优化：</strong></p>
                <ul className="list-disc ml-5">
                  <li>页面加载时不显示错误（用户还没操作）</li>
                  <li>只在用户编辑过字段后显示验证结果</li>
                  <li>提交时全量验证，标记所有字段为 touched</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q2: 实时验证、离焦验证、提交验证如何选择？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <ul className="list-disc ml-5">
                  <li><strong>实时验证：</strong>密码强度、用户名可用性</li>
                  <li><strong>离焦验证：</strong>邮箱格式、手机号格式</li>
                  <li><strong>提交验证：</strong>必填项、最终校验</li>
                  <li><strong>组合使用：</strong>先离焦验证，提交时全量验证</li>
                </ul>
              </div>
            </details>

            <details className="bg-white rounded-lg p-4 shadow">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Q3: 如何实现异步验证（如用户名唯一性）？
              </summary>
              <div className="mt-3 text-sm text-gray-800">
                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
{`const asyncValidators = {
  usernameUnique: async (value) => {
    const exists = await api.checkUsername(value);
    return !exists || '用户名已存在';
  }
};

// 在 handleBlur 中调用
const handleBlur = async (name) => {
  setTouched(prev => ({ ...prev, [name]: true }));
  
  if (asyncValidators[name]) {
    const error = await asyncValidators[name](values[name]);
    setErrors(prev => ({ ...prev, [name]: error === true ? '' : error }));
  }
};`}
                </pre>
              </div>
            </details>
          </div>
        </div>

        {/* 实际应用场景 */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h4 className="font-semibold text-green-900 mb-2">🎯 实际应用场景</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>注册登录：</strong>用户名、密码、邮箱验证</li>
            <li>• <strong>表单提交：</strong>订单、问卷、申请表单</li>
            <li>• <strong>个人信息：</strong>资料修改、实名认证</li>
            <li>• <strong>第三方库：</strong>Formik、React Hook Form</li>
          </ul>
        </div>

        {/* 追问场景 */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <h4 className="font-semibold text-orange-900 mb-3">🔥 可能的追问</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div>
              <strong>追问 1：</strong>如何优化频繁的实时验证？
              <p className="ml-4 text-xs text-gray-700">→ 使用 debounce 延迟验证，或只在离焦时验证</p>
            </div>
            <div>
              <strong>追问 2：</strong>如何实现字段间的依赖验证？
              <p className="ml-4 text-xs text-gray-700">→ 在验证函数中访问其他字段的值，如密码确认</p>
            </div>
            <div>
              <strong>追问 3：</strong>推荐使用哪个表单库？
              <p className="ml-4 text-xs text-gray-700">→ React Hook Form (性能好) 或 Formik (功能全)</p>
            </div>
          </div>
        </div>
      </div>
    </DemoContainer>
  );
}
