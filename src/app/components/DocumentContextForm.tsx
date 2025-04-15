// src/app/components/DocumentContextForm.tsx
import React from 'react';
import { DocumentContext } from '../lib/types';

interface DocumentContextFormProps {
  context: DocumentContext;
  onChange: (context: DocumentContext) => void;
  examplePlaceholder: string;
}

export default function DocumentContextForm({ 
  context, 
  onChange, 
  examplePlaceholder 
}: DocumentContextFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...context,
      userInput: e.target.value,
    });
  };

  const isDisplayingExample = context.userInput === examplePlaceholder;

  return (
    <div className="space-y-2">
      <textarea
        id="userInput"
        value={context.userInput}
        onChange={handleInputChange}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2.5 ${isDisplayingExample ? 'text-gray-400' : 'text-gray-900'}`}
        rows={10}
        placeholder={examplePlaceholder}
      />
      <p className="text-xs text-gray-500">将您所有的想法输入这里，AI 会尽力理解并生成相应内容。</p>
    </div>
  );
}
