// src/app/api/generate-document/route.ts
import { NextRequest, NextResponse } from 'next/server';

// 设置最大执行时间为 60 秒
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt, model, temperature } = await req.json();

    console.log('开始调用OpenRouter API生成文档...');
    console.log('使用的模型:', model);

    // 设置超时时间
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://writing-helper.vercel.app',
          'X-Title': 'Writing Helper'
        },
        body: JSON.stringify({
          model: model,
          messages: [{
            role: "user",
            content: [{
              type: "text",
              text: prompt
            }]
          }],
          temperature: temperature,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('API响应错误:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('错误详情:', errorText);
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API响应数据:', data);
      
      // 从API响应中提取内容
      let content = '';
      if (data.choices && data.choices[0] && data.choices[0].message) {
        content = data.choices[0].message.content;
      } else {
        throw new Error('无法从API响应中提取内容');
      }
      
      console.log('成功生成文档');
      return NextResponse.json({ content });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('API请求错误:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('请求超时，请稍后重试');
      } else if (fetchError.code === 'ENOTFOUND') {
        throw new Error('无法连接到API服务器，请检查网络连接');
      }
      throw fetchError;
    }

  } catch (error: any) {
    console.error('生成文档时发生错误:', error);
    return NextResponse.json(
      { error: `生成文档失败: ${error.message}` },
      { status: 500 }
    );
  }
}