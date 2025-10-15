export default function DemoContainer({ title, description, children, showCode = false, code = '' }) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* 标题栏 */}
      <div className="border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-indigo-100 text-sm">{description}</p>
        )}
      </div>

      {/* 内容区 */}
      <div className={`flex-1 overflow-auto ${showCode ? 'grid grid-cols-2 divide-x' : ''}`}>
        {/* Demo 展示 */}
        <div className="p-8">
          {children}
        </div>

        {/* 代码展示 */}
        {showCode && code && (
          <div className="bg-gray-900 p-6 overflow-auto">
            <pre className="text-sm text-gray-100">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
