// src/app/components/DocumentTypeSelector.tsx
import React from 'react';
import { DocumentType, DOCUMENT_TYPES } from '../lib/types';

interface DocumentTypeSelectorProps {
  selectedType: DocumentType | null;
  onSelect: (type: DocumentType) => void;
  activeTab: string;
}

export default function DocumentTypeSelector({ selectedType, onSelect, activeTab }: DocumentTypeSelectorProps) {
  // 根据当前选择的标签过滤文档类型
  const filteredTypes = DOCUMENT_TYPES.filter(type => type.category === activeTab);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {filteredTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type)}
            className={`
              p-3 rounded-md border text-center transition duration-200 flex flex-col items-center 
              ${selectedType?.id === type.id 
                ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500 ring-opacity-50' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
          >
            <span className="text-2xl mb-2">{type.icon}</span>
            <span className="font-medium text-sm">{type.name}</span>
          </button>
        ))}
      </div>

      {selectedType && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-1">{selectedType.name}</h3>
          <p className="text-sm text-gray-600">{selectedType.description}</p>
        </div>
      )}
    </div>
  );
}