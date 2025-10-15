/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 静态导出
  images: {
    unoptimized: true,  // GitHub Pages 不支持 Next.js Image Optimization
  },
  eslint: {
    ignoreDuringBuilds: true,  // 构建时忽略 ESLint 错误
  },
  // GitHub Pages 部署到 username.github.io/repo-name 需要配置 basePath
  basePath: '/stream-chat',
  assetPrefix: '/stream-chat',
};

export default nextConfig;
