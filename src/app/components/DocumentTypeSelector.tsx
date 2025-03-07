// src/app/components/DocumentTypeSelector.tsx
import React from 'react';
import { DocumentType, DOCUMENT_TYPES } from '../lib/types';

interface DocumentTypeSelectorProps {
  selectedType: DocumentType | null;
  onSelect: (type: DocumentType) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'standard', name: '标准公文' },
  { id: 'professional', name: '专业文书' },
  { id: 'speech', name: '讲话稿' },
  { id: 'official', name: '规范性文件' }
];

export default function DocumentTypeSelector({ 
  selectedType, 
  onSelect, 
  activeTab,
  onTabChange 
}: DocumentTypeSelectorProps) {
  // 根据当前选择的标签过滤文档类型
  const filteredTypes = DOCUMENT_TYPES.filter(type => type.category === activeTab);

  return (
    <div className="space-y-4">
      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-2.5 py-1 text-xs transition-colors duration-200
              ${activeTab === tab.id
                ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-700 ring-opacity-50'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* 文档类型网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {filteredTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type)}
            className={`
              p-2 rounded-md border text-center transition duration-200 flex items-center justify-center space-x-1.5
              ${selectedType?.id === type.id 
                ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500 ring-opacity-50' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
          >
            <span className="text-lg">{type.icon}</span>
            <span className="text-xs">{type.name}</span>
          </button>
        ))}
      </div>

      {selectedType && (
        <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
          <div className="flex items-center text-xs">
            <span className="text-blue-800">{selectedType.name}</span>
            <span className="text-blue-800 mx-1">：</span>
            <span className="text-gray-600">{selectedType.description}</span>
          </div>
        </div>
      )}
    </div>
  );
}