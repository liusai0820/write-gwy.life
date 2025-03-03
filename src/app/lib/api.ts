"use client";

import { WritingRequest, ApiResponse, PromptStyle } from './types';

export async function generateContent(request: WritingRequest): Promise<ApiResponse> {
  try {
    const { promptStyle, topic, keywords, wordCount, llmApiUrl, llmApiKey, model } = request;
    
    // Format the prompt template
    const promptTemplate = formatPromptTemplate(promptStyle, topic, keywords, wordCount);
    
    // Detect API provider type from URL (simple detection)
    const isGrokApi = llmApiUrl.includes('grok') || llmApiUrl.includes('xai');
    
    // Prepare request body based on API provider
    let requestBody: Record<string, unknown>;
    
    if (isGrokApi) {
      // Grok API format
      requestBody = {
        messages: [
          {
            role: 'user',
            content: promptTemplate
          }
        ],
        model: "grok-2-latest", // 使用Grok模型而不是用户输入的模型
        temperature: 0.7,
        stream: false
      };
    } else {
      // OpenAI-compatible API format (default)
      requestBody = {
        model: model || 'gpt-4', // 使用用户选择的模型，或默认为gpt-4
        messages: [
          {
            role: 'user',
            content: promptTemplate
          }
        ],
        temperature: 0.7
      };
    }
    
    // Prepare headers based on API provider
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add appropriate authorization header
    if (isGrokApi) {
      headers['Authorization'] = `Bearer ${llmApiKey}`; // 确保Grok API也使用Bearer格式
    } else {
      headers['Authorization'] = `Bearer ${llmApiKey}`;
    }

    console.log('准备发送请求到:', llmApiUrl);
    console.log('请求头:', JSON.stringify(headers, null, 2).replace(llmApiKey, '[REDACTED]'));
    console.log('请求体:', JSON.stringify(requestBody, null, 2));
    
    // 使用本地 API 代理来避免 CORS 问题
    try {
      // 尝试使用本地代理
      const proxyResponse = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUrl: llmApiUrl,
          headers,
          body: requestBody
        })
      });
      
      if (!proxyResponse.ok) {
        const errorData = await proxyResponse.json().catch(() => ({ error: { message: `代理服务错误: ${proxyResponse.status}` } }));
        throw new Error(errorData.error?.message || `代理服务错误: ${proxyResponse.status}: ${proxyResponse.statusText}`);
      }
      
      const data = await proxyResponse.json();
      console.log('API 响应:', data);
      
      // 保存原始响应用于调试
      console.log('原始 API 响应:', JSON.stringify(data, null, 2));
      
      // 以与测试页面相同的方式尝试不同方法提取内容
      let content = '';
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        // 标准格式
        content = data.choices[0].message.content;
        console.log('从 choices[0].message.content 提取内容');
      } else if (data.message && data.message.content) {
        // 替代格式1
        content = data.message.content;
        console.log('从 message.content 提取内容');
      } else if (data.content) {
        // 替代格式2
        content = data.content;
        console.log('从 content 提取内容');
      } else if (data.output) {
        // 替代格式3
        content = data.output;
        console.log('从 output 提取内容');
      } else if (data.response) {
        // 替代格式4
        content = data.response;
        console.log('从 response 提取内容');
      } else if (data.text) {
        // 替代格式5
        content = data.text;
        console.log('从 text 提取内容');
      } else if (typeof data === 'string') {
        // 可能整个响应就是文本
        content = data;
        console.log('使用整个响应作为内容');
      } else if (data.error) {
        // 有明确的错误信息
        throw new Error(`API 错误: ${data.error.message || JSON.stringify(data.error)}`);
      } else {
        // 无法解析的响应
        throw new Error(`无法从API响应中提取内容: ${JSON.stringify(data)}`);
      }
      
      return { content };
    } catch (proxyError) {
      console.error('代理请求失败:', proxyError);
      throw proxyError;
    }
  } catch (error) {
    console.error('生成内容错误:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

export function formatPromptTemplate(
  style: PromptStyle, 
  topic: string, 
  keywords: string[], 
  wordCount: number
): string {
  // Convert the style object to a formatted JSON string
  const styleJson = JSON.stringify(style, null, 4);
  
  // Format the keywords as a comma-separated list
  const keywordsStr = keywords.join('、');
  
  // Construct the complete prompt
  return `${styleJson}

---
遵循以上风格为我编写一篇${wordCount}字的文章，主题是${topic}。
关键词：${keywordsStr}`;
}

export function exportToMarkdown(content: string): void {
  // Create a blob with the content
  const blob = new Blob([content], { type: 'text/markdown' });
  
  // Create a download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `writing_${new Date().toISOString().slice(0, 10)}.md`;
  
  // Trigger download
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
} 