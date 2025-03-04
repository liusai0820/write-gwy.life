// src/app/components/DocumentContextForm.tsx
import React from 'react';
import { DocumentContext } from '../lib/types';

interface DocumentContextFormProps {
  context: DocumentContext;
  onChange: (context: DocumentContext) => void;
}

export default function DocumentContextForm({ context, onChange }: DocumentContextFormProps) {
  const handleChange = (field: keyof DocumentContext, value: string) => {
    onChange({
      ...context,
      [field]: field === 'keywords' ? value.split('、') : value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          主题
        </label>
        <input
          type="text"
          value={context.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="请输入文档主题"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          接收方
        </label>
        <input
          type="text"
          value={context.recipients}
          onChange={(e) => handleChange('recipients', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="请输入接收方"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          关键词（用、分隔）
        </label>
        <input
          type="text"
          value={context.keywords.join('、')}
          onChange={(e) => handleChange('keywords', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="请输入关键词，用顿号分隔"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          特殊要求
        </label>
        <textarea
          value={context.specialRequirements}
          onChange={(e) => handleChange('specialRequirements', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
          placeholder="请输入特殊要求"
        />
      </div>
    </div>
  );
}
