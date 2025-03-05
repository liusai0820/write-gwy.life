"use client";

import React, { useState } from 'react';

export default function WritingAssistant() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [keywords, setKeywords] = useState('');
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const model = 'anthropic/claude-3.5-sonnet';
  const temperature = 0.7;

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const keywordsList = keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      // 构建提示词
      let fullPrompt = prompt;
      if (keywordsList.length > 0) {
        fullPrompt += `\n\n关键词：${keywordsList.join('、')}`;
      }
      
      // 调用后端API
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          apiKey,
          model,
          temperature
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.content);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成内容时出错');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (result) {
      // 创建Blob对象
      const blob = new Blob([result], { type: 'text/markdown' });
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'writing-result.md';
      
      // 触发下载
      document.body.appendChild(a);
      a.click();
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    }
  };

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  const toggleApiSettings = () => {
    setShowApiSettings(!showApiSettings);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">写作助手</h1>
      
      <div className="mb-4">
        <button 
          onClick={toggleApiSettings}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {showApiSettings ? '隐藏API设置' : '显示API设置'}
        </button>
      </div>
      
      {showApiSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OpenRouter API密钥
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              className="w-full p-2 border rounded"
              placeholder="sk-or-..."
            />
            <p className="text-xs text-gray-500 mt-1">
              如果不提供API密钥，将使用模拟响应。请在<a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenRouter</a>获取API密钥。
            </p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            提示词
          </label>
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            className="w-full p-2 border rounded h-32"
            placeholder="请输入您的写作提示..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            关键词（用逗号分隔）
          </label>
          <input
            type="text"
            value={keywords}
            onChange={handleKeywordsChange}
            className="w-full p-2 border rounded"
            placeholder="关键词1, 关键词2, ..."
          />
        </div>
        
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? '生成中...' : '生成内容'}
          </button>
          
          {result && (
            <button
              type="button"
              onClick={handleExport}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              导出为Markdown
            </button>
          )}
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">生成结果</h2>
          <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
      
      <div className="mt-8 text-right">
        <button 
          onClick={toggleDebugInfo}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          {showDebugInfo ? '隐藏调试信息' : '显示调试信息'}
        </button>
      </div>
      
      {showDebugInfo && (
        <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono">
          <pre>{JSON.stringify({ prompt, apiKey: apiKey ? '***' : undefined, keywords: keywords.split(',').map(k => k.trim()).filter(k => k.length > 0), model, temperature }, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 