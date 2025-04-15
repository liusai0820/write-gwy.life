// src/app/components/UserProfileSelector.tsx
"use client";

import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../lib/types';

interface UserProfileSelectorProps {
  selectedBackground: string;
  onBackgroundChange: (background: string) => void;
  onSave?: () => void;
}

// 默认预设的用户背景资料
const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'gov',
    name: '政府部门',
    subName: '党政机关',
    backgroundInfo: '本单位是深圳市发展和改革委员会，主要职责包括：贯彻执行国家、省、市有关国民经济和社会发展、经济体制改革和对外开放的法律法规和政策；拟订并组织实施国民经济和社会发展战略、中长期规划和年度计划；牵头组织统一规划体系建设；牵头拟订并组织实施深圳建设中国特色社会主义先行示范区中长期规划；统筹提出全市国民经济和社会发展主要目标建议；推进全市优化营商环境改革；负责投资综合管理；推进落实区域协调发展战略；拟订综合性产业政策；推动实施创新驱动发展战略；组织编制国民经济动员规划；负责社会发展与国民经济发展的政策衔接；统筹可持续发展战略实施等重要职责。作为深圳市重要的宏观经济管理部门，近年来深入贯彻新发展理念，全力推进"双区"建设，积极服务保障重大战略实施。'
  },
  {
    id: 'institution',
    name: '事业单位',
    subName: '事业单位',
    backgroundInfo: '本单位是深圳国家高技术产业创新中心（深圳发展改革研究院），是国家发展改革委与深圳市政府联合成立的事业单位，深圳市法定机构试点单位，归口深圳市发展改革委管理。中心现有员工近240人，其中研究员达200人，博士80人，硕士120人，中高级职称36人。中心内设数字经济研究所、生物经济研究所、材料产业研究所等11个业务部门及6个支撑部门。近十年来中心累计承担国家/省/市/区级大型研究课题超过400项，业务范围涵盖国家战略及政策研究、综合类重大规划、区域规划、产业规划、创新平台建设运营、项目评审/项目导入、科技转化等。中心聚焦"高端智库+平台运营+创新服务"三大发展方向，全力构建党委政府决策咨询思想库、产业协同创新技术平台、全过程创新生态链服务平台。'
  },
  {
    id: 'enterprise',
    name: '国有企业',
    subName: '国有企业',
    backgroundInfo: '本企业是XX省XX市直属国有企业，注册资本XX亿元，主要从事XX领域业务。现有员工1000余人，年营业收入XX亿元。近年来，企业深入贯彻新发展理念，加快转型升级步伐。'
  },
  {
    id: 'education',
    name: '教育单位',
    subName: '教育',
    backgroundInfo: '本校是XX省XX市重点中学，创办于XX年，现有教职工200人，在校学生3000余人。学校秉承"XX"的办学理念，以培养德智体美劳全面发展的社会主义建设者和接班人为目标。'
  },
  {
    id: 'medical',
    name: '医疗卫生',
    subName: '医疗卫生',
    backgroundInfo: '本院是XX省XX市三级甲等综合医院，设有XX个临床科室，XX个医技科室，编制床位1000张，现有医护人员1500人。医院始终坚持"以病人为中心"的服务理念。'
  }
];

export default function UserProfileSelector({ 
  selectedBackground, 
  onBackgroundChange,
  onSave 
}: UserProfileSelectorProps) {
  const [editedBackground, setEditedBackground] = useState(selectedBackground);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setEditedBackground(selectedBackground);
  }, [selectedBackground]);

  const handleProfileSelect = (profile: UserProfile) => {
    setEditedBackground(profile.backgroundInfo);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      onBackgroundChange(editedBackground);
      setSaveMessage('保存成功');
      if (onSave) {
        setTimeout(onSave, 500);
      }
    } catch {
      setSaveMessage('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 预设选项按钮组 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {DEFAULT_PROFILES.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleProfileSelect(profile)}
            className={`p-3 rounded-md border text-center transition duration-200 flex flex-col items-center
              ${editedBackground === profile.backgroundInfo
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
          >
            <span className="font-medium">{profile.name}</span>
            <span className="text-sm text-gray-500">{profile.subName}</span>
          </button>
        ))}
      </div>

      {/* 单个编辑框 */}
      <div className="space-y-2">
        <textarea
          value={editedBackground}
          onChange={(e) => setEditedBackground(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={6}
          placeholder="请选择预设背景或直接编辑背景信息..."
        />
        
        {/* 保存按钮和状态提示 */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSave}
            disabled={isSaving || editedBackground === selectedBackground}
            className={`px-4 py-2 rounded-md text-white font-medium flex items-center space-x-2
              ${(isSaving || editedBackground === selectedBackground)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>保存中...</span>
              </>
            ) : '保存修改'}
          </button>
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}