// src/app/components/DocumentContextForm.tsx
import React from 'react';
import { DocumentContext } from '../lib/types';

interface DocumentContextFormProps {
  context: DocumentContext;
  onChange: (context: DocumentContext) => void;
}

export default function DocumentContextForm({ context, onChange }: DocumentContextFormProps) {
  return (
    <div className="space-y-6">
      {/* 主题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          公文标题
        </label>
        <input
          type="text"
          value={context.subject}
          onChange={(e) => onChange({ ...context, subject: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2.5"
          placeholder="公文标题应简明扼要，一般用“关于...的函”、“...情况的报告”等形式"
        />
      </div>

      {/* 接收方 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          收文单位
        </label>
        <input
          type="text"
          value={context.recipients}
          onChange={(e) => onChange({ ...context, recipients: e.target.value })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2.5"
          placeholder="请按照行政级别和部门顺序排列，以逗号分隔，最后以冒号结尾"
        />
      </div>

      {/* 关键词 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          关键要点
        </label>
        <input
          type="text"
          value={context.keywords.join('、')}
          onChange={(e) => onChange({ ...context, keywords: e.target.value.split('、').filter(k => k.trim()) })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2.5"
          placeholder="请输入3-5个体现文件主要内容的关键词，如：整改、审计、预算、第一议题"
        />
      </div>

      {/* 特殊要求 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          特殊要求
        </label>
        <textarea
          value={context.specialRequirements}
          onChange={(e) => onChange({ ...context, specialRequirements: e.target.value })}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2.5"
          placeholder="请说明文件的细节要求（如使用场合、重点侧重、文风要求（如务实、简洁）、篇幅字数等"
        />
      </div>
    </div>
  );
}
