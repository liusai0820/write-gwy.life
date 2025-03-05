/**
 * AI 写作助手 - Markdown 编辑器组件
 * 
 * @license MIT
 * Copyright (c) 2024
 */

"use client";

import React, { useState, useEffect } from 'react';

interface MarkdownEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

export default function MarkdownEditor({
  initialContent = '',
  onChange,
  readOnly = false
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange?.(newContent);
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <span className="text-sm font-medium">Markdown编辑器</span>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        readOnly={readOnly}
        className="w-full p-4 min-h-[300px] focus:outline-none resize-y font-mono text-sm"
        placeholder={readOnly ? "暂无内容" : "在此输入Markdown内容..."}
      />
    </div>
  );
} 