import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import MarkdownViewer from '@/components/MarkdownViewer';

export default async function DocPage({ params }) {
  const { slug } = await params;
  
  // 读取根目录的 .md 文件
  const filePath = path.join(process.cwd(), `${slug}.md`);
  
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-red-600 mb-4">📄 文档未找到</h1>
            <p className="text-gray-600 mb-6">抱歉，文档 <code className="bg-gray-100 px-2 py-1 rounded">{slug}.md</code> 不存在</p>
            <Link href="/" className="text-blue-600 hover:underline">
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // 读取文件内容
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 从内容中提取标题（第一个 # 开头的行）
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : slug.toUpperCase();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← 返回首页
          </Link>
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <div className="w-24"></div> {/* 占位，保持居中 */}
        </div>
      </div>
      
      {/* Markdown 内容 */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <MarkdownViewer content={content} />
        </div>
      </div>
    </div>
  );
}

// 生成静态参数（可选，用于静态生成）
export async function generateStaticParams() {
  const rootDir = process.cwd();
  const files = fs.readdirSync(rootDir);
  
  // 找出所有 .md 文件
  const mdFiles = files.filter(file => file.endsWith('.md'));
  
  return mdFiles.map(file => ({
    slug: file.replace('.md', '')
  }));
}
