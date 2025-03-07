import { WritingRequest, ApiResponse } from './types';

// 添加获取服务器配置的接口
export interface ServerConfig {
  defaultModel: string;
  error?: string;
}

// 获取服务器配置
export async function getServerConfig(): Promise<ServerConfig> {
  try {
    const response = await fetch('/api/config');
    if (!response.ok) {
      throw new Error(`获取配置失败: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('获取服务器配置时发生错误:', error);
    return {
      defaultModel: 'anthropic/claude-3.5-sonnet', // 默认回退值
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

export async function generateContent(request: WritingRequest): Promise<ApiResponse> {
  try {
    // 使用OpenRouter作为默认API提供商
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    
    // 构建请求体
    const body = {
      model: request.model || 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的写作助手，擅长根据用户的要求生成高质量的文本内容。'
        },
        {
          role: 'user',
          content: request.prompt
        }
      ],
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 2000
    };

    // 设置请求头
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin || 'https://write-gwy.life',
      'X-Title': 'Writing Assistant'
    };

    // 添加API密钥（如果提供）
    if (request.apiKey) {
      headers['Authorization'] = `Bearer ${request.apiKey}`;
    } else {
      // 如果没有提供API密钥，返回模拟响应
      console.log('未提供API密钥，返回模拟响应');
      return {
        content: `这是一个模拟响应，因为没有提供API密钥。\n\n请在设置中添加您的OpenRouter API密钥以获取真实的AI生成内容。\n\n您的提示词是：\n${request.prompt}\n\n关键词：${request.keywords?.join(', ') || '无'}`
      };
    }

    // 发送请求
    console.log('正在发送API请求到OpenRouter...');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    // 处理响应
    if (!response.ok) {
      const errorData = await response.text();
      console.error('API响应错误:', response.status, response.statusText);
      console.error('错误详情:', errorData);
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    return { content };
  } catch (error) {
    console.error('API请求错误:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

export function exportToMarkdown(content: string, filename: string = 'document.md'): void {
  // 创建Blob对象
  const blob = new Blob([content], { type: 'text/markdown' });
  
  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  // 触发下载
  document.body.appendChild(a);
  a.click();
  
  // 清理
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
} 