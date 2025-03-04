// src/app/components/StyleOptions.tsx
import React from 'react';
import { StylePreference } from '../lib/types';

interface StyleOptionsProps {
  preferences: StylePreference;
  onChange: (preferences: StylePreference) => void;
}

export default function StyleOptions({ preferences, onChange }: StyleOptionsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          正式程度 (1-5)
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={preferences.formalityLevel}
          onChange={(e) => onChange({ ...preferences, formalityLevel: Number(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>非正式</span>
          <span>中等</span>
          <span>极正式</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          语气风格
        </label>
        <select
          value={preferences.toneStyle}
          onChange={(e) => onChange({ ...preferences, toneStyle: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="党政机关公文">党政机关公文</option>
          <option value="事业单位公文">事业单位公文</option>
          <option value="企业公文">企业公文</option>
          <option value="社会组织公文">社会组织公文</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          细节程度 (1-5)
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={preferences.detailLevel}
          onChange={(e) => onChange({ ...preferences, detailLevel: Number(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>简略</span>
          <span>适中</span>
          <span>详尽</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          结构偏好
        </label>
        <select
          value={preferences.structurePreference}
          onChange={(e) => onChange({ ...preferences, structurePreference: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="标准结构">标准结构</option>
          <option value="简明结构">简明结构</option>
          <option value="详细结构">详细结构</option>
        </select>
      </div>
    </div>
  );
}
