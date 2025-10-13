// ===== 流式对话知识点 1: Next.js API Route with Streaming =====
// Next.js 15 支持流式响应，通过返回 ReadableStream 实现 Server-Sent Events (SSE)

export const runtime = 'edge'; // 使用 Edge Runtime 以获得更好的流式性能

export async function POST(request) {
  try {
    const { messages } = await request.json();

    // ===== 知识点 2: 豆包 API 配置 =====
    const DOUBAO_API_KEY = process.env.DOUBAO_API_KEY || '5276e8a0-5bb1-44ad-ad78-f708de658103';
    const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
    const MODEL = 'doubao-seed-1-6-thinking-250715';

    // ===== 知识点 3: 启用流式响应 =====
    // stream: true 是关键参数，告诉 API 返回流式数据
    const response = await fetch(DOUBAO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOUBAO_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true, // 启用流式响应
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    // ===== 知识点 4: ReadableStream 转换 =====
    // 将 API 返回的流转换为前端可用的 SSE 格式
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        // ===== 知识点 6: Buffer 处理跨 chunk 边界（防止重复输出！）=====
        // ⚠️ 重要：不使用 buffer 会导致文字重复输出 bug！
        // 网络数据包可能在 SSE 消息中间断开，需要 buffer 来保存不完整的数据
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              // ===== 知识点 5: 流结束标记 =====
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
              break;
            }

            // ===== 知识点 6: SSE 数据格式解析 =====
            // 豆包 API 返回的是 "data: {...}\n\n" 格式的 SSE 数据
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            // 保留最后一行（可能不完整）
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;
              
              const data = trimmedLine.slice(6); // 移除 "data: " 前缀

              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }

              try {
                const json = JSON.parse(data);
                
                // ===== 知识点 7: 思考内容识别 =====
                // 豆包的思考模型会返回 reasoning_content 字段
                const choice = json.choices?.[0];
                const delta = choice?.delta;
                
                if (delta?.reasoning_content) {
                  // 模型正在思考的内容
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                    type: 'thinking',
                    content: delta.reasoning_content,
                    finish_reason: choice.finish_reason
                  })}\n\n`));
                } else if (delta?.content) {
                  // 模型回复的正式内容
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                    type: 'message',
                    content: delta.content,
                    finish_reason: choice.finish_reason
                  })}\n\n`));
                }
              } catch (parseError) {
                console.error('Failed to parse JSON:', parseError, 'Data:', data);
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // ===== 知识点 8: SSE 响应头设置 =====
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream', // SSE 必需的 Content-Type
        'Cache-Control': 'no-cache', // 禁用缓存
        'Connection': 'keep-alive', // 保持连接
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
