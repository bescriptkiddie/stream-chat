import Link from 'next/link';

export default function AIGuideLink() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-purple-900 mb-1">📚 AI前端集成完整指南</h4>
          <p className="text-sm text-purple-700">
            查看所有AI技术要点、面试问答和最佳实践的完整总结
          </p>
        </div>
        <Link 
          href="/docs/AI_FRONTEND_INTEGRATION" 
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium whitespace-nowrap ml-4"
        >
          查看完整指南 →
        </Link>
      </div>
    </div>
  );
}
