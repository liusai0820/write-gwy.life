// src/app/components/DocumentPreview.tsx
import React, { useState } from 'react';
import { DocumentType } from '../lib/types';

interface DocumentPreviewProps {
  content: string;
  isLoading: boolean;
  onContentChange: (content: string) => void;
  documentType: DocumentType | null;
}

export default function DocumentPreview({ 
  content, 
  isLoading, 
  onContentChange,
  documentType 
}: DocumentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);

  // 处理内容变化
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  // 切换编辑模式
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // 格式化文本以显示
  const formatContent = (text: string) => {
    if (!text) return [];
    
    // 将文本分割成段落
    return text.split('\n').map((paragraph, index) => {
      // 检查是否为标题
      if (paragraph.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-bold mt-6 mb-4">
            {paragraph.substring(2)}
          </h1>
        );
      } else if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold mt-5 mb-3">
            {paragraph.substring(3)}
          </h2>
        );
      } else if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-bold mt-4 mb-2">
            {paragraph.substring(4)}
          </h3>
        );
      } else if (paragraph.startsWith('- ')) {
        // 列表项
        return (
          <li key={index} className="ml-6 list-disc my-1">
            {paragraph.substring(2)}
          </li>
        );
      } else if (paragraph.trim() === '') {
        // 空行
        return <div key={index} className="my-2"></div>;
      } else {
        // 普通段落
        return (
          <p key={index} className="my-3 text-gray-800 leading-relaxed">
            {paragraph}
          </p>
        );
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">正在生成公文，请稍候...</p>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            AI 正在根据您提供的信息撰写公文内容
          </p>
        </div>
      </div>
    );
  }

  if (!content && !isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-center text-gray-500">
        <svg className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium mb-2">尚未生成公文</h3>
        <p className="text-sm max-w-md">
          请在左侧选择公文类型并填写相关信息，然后点击"生成公文草稿"按钮
        </p>
        {documentType && (
          <div className="mt-6 text-sm bg-red-50 text-red-700 rounded-md p-3 border border-red-200 max-w-md">
            <p className="font-medium">已选择: {documentType.name}</p>
            <p className="mt-1">{documentType.description}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 编辑/预览切换 */}
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={toggleEditMode}
          className="text-sm flex items-center text-gray-700 hover:text-red-600"
        >
          {isEditing ? (
            <>
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              预览模式
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              编辑模式
            </>
          )}
        </button>
      </div>
      
      {isEditing ? (
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full h-full resize-none border border-gray-200 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm"
        />
      ) : (
        <div className="document-preview overflow-auto prose max-w-none">
          {formatContent(content)}
        </div>
      )}
    </div>
  );
}
