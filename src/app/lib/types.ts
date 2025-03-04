// src/app/lib/types.ts

// 公文类型接口定义
export interface DocumentType {
  id: string;
  name: string;
  icon: string;
  description: string;
  templatePrompt: string;
  category: 'standard' | 'professional' | 'speech' | 'official'; // 分类
}

// 文档上下文接口
export interface DocumentContext {
  subject: string;
  recipients: string;
  keywords: string[];
  specialRequirements: string;
  referenceFiles: File[];
  background: string;  // 添加背景信息字段
}

// 风格偏好设置
export interface StylePreference {
  formalityLevel: number;    // 正式程度 (1-5)
  toneStyle: string;         // 风格体系
  detailLevel: number;       // 详细程度 (1-5)
  structurePreference: string; // 结构偏好
}

// 预定义公文类型 - 按分类组织
export const DOCUMENT_TYPES: DocumentType[] = [
  // 标准公文类型
  {
    id: 'report',
    name: '工作报告',
    icon: '📊',
    description: '总结过去工作情况、分析存在问题、提出下一步工作计划或建议的报告类文件',
    templatePrompt: `请根据以下信息撰写一份工作报告，格式要求包括：标题、正文（包含工作情况、主要成绩、存在问题、下一步计划等部分）和结尾。语言要求准确、简明、规范。`,
    category: 'standard'
  },
  {
    id: 'notice',
    name: '通知',
    icon: '📢',
    description: '传达政策规定、工作安排或活动组织等事项的文件',
    templatePrompt: `请根据以下信息撰写一份通知，包括通知标题、正文（说明通知事项的目的、对象、时间、地点、方式、要求等）和结尾（如联系方式、单位名称和日期）。语言要求清晰明了、格式规范。`,
    category: 'standard'
  },
  {
    id: 'decision',
    name: '决定',
    icon: '⚖️',
    description: '对重要事项或重大行动作出安排，对已明确并需要遵循的规则、定论作出明确表述的法定公文',
    templatePrompt: `请根据以下信息撰写一份决定，包括标题、正文（说明决定的背景、依据、具体内容、执行要求等）和结尾。语言要求严谨、规范、有权威性。`,
    category: 'standard'
  },
  {
    id: 'reply',
    name: '批复',
    icon: '✅',
    description: '对下级机关请示事项的答复性公文',
    templatePrompt: `请根据以下信息撰写一份批复，包括标题、正文（简述请示事项、明确批复意见、提出相关要求等）和结尾。语言要求准确、清晰、规范。`,
    category: 'standard'
  },
  {
    id: 'request',
    name: '请示',
    icon: '🔍',
    description: '向上级机关请求指示或批准的公文',
    templatePrompt: `请根据以下信息撰写一份请示，包括标题、正文（说明请示事项的背景、内容、理由和具体请求等）和结尾。语言要求准确、清晰、简明扼要。`,
    category: 'standard'
  },
  {
    id: 'letter',
    name: '函',
    icon: '✉️',
    description: '用于不相隶属机关之间商洽工作、询问和答复问题、请求批准和答复审批事项的公文',
    templatePrompt: `请根据以下信息撰写一份函，包括标题、正文（说明发函目的、具体事项、相关要求等）和结尾（如联系方式、单位名称和日期）。语言要求礼貌、规范、简明。`,
    category: 'standard'
  },
  {
    id: 'minutes',
    name: '会议纪要',
    icon: '📝',
    description: '记录会议主要内容和议定事项的文件',
    templatePrompt: `请根据以下信息撰写一份会议纪要，包括标题、会议基本情况（时间、地点、主持人、参会人员等）、主要内容、议定事项和结尾。语言要求客观、简明、准确。`,
    category: 'standard'
  },
  {
    id: 'announcement',
    name: '公告',
    icon: '📌',
    description: '向社会公开宣布重要事项或法定事项的公文',
    templatePrompt: `请根据以下信息撰写一份公告，包括标题、正文（公告事项的内容、依据、范围、生效时间等）和落款。语言要求权威、规范、简明。`,
    category: 'standard'
  },
  {
    id: 'circular',
    name: '通报',
    icon: '📃',
    description: '表彰先进、批评错误、传达重要精神或情况的公文',
    templatePrompt: `请根据以下信息撰写一份通报，包括标题、正文（说明通报的主要内容、具体情况、成绩或问题、表彰或批评意见等）和结尾。语言要求客观公正、实事求是。`,
    category: 'standard'
  },

  // 专业报告类型
  {
    id: 'summary',
    name: '工作总结',
    icon: '📋',
    description: '对某一时期的工作、事项或情况进行回顾总结的文件',
    templatePrompt: `请根据以下信息撰写一份工作总结，包括标题、正文（工作回顾、成绩亮点、问题不足、经验体会等）和结尾。语言要求客观、全面、有深度。`,
    category: 'professional'
  },
  {
    id: 'plan',
    name: '工作计划',
    icon: '📅',
    description: '对未来一段时间工作进行规划安排的文件',
    templatePrompt: `请根据以下信息撰写一份工作计划，包括标题、正文（指导思想、总体目标、主要任务、具体措施、保障机制等）和结尾。语言要求明确、具体、可操作性强。`,
    category: 'professional'
  },
  {
    id: 'research',
    name: '调研报告',
    icon: '🔎',
    description: '对某个问题或现象进行调查研究后形成的报告',
    templatePrompt: `请根据以下信息撰写一份调研报告，包括标题、正文（调研背景、基本情况、存在问题、原因分析、对策建议等）和结尾。语言要求客观、全面、有见地。`,
    category: 'professional'
  },
  {
    id: 'feasibility',
    name: '可行性报告',
    icon: '📈',
    description: '对拟建项目或实施方案进行可行性分析的报告',
    templatePrompt: `请根据以下信息撰写一份可行性报告，包括标题、正文（项目背景、必要性、可行性分析、风险评估、实施方案等）和结尾。语言要求客观、专业、论证充分。`,
    category: 'professional'
  },
  {
    id: 'proposal',
    name: '提案',
    icon: '💡',
    description: '针对某一问题或工作提出意见和建议的文件',
    templatePrompt: `请根据以下信息撰写一份提案，包括标题、正文（说明提案背景、问题分析、具体建议等）和结尾。语言要求客观、有理有据、有建设性。`,
    category: 'professional'
  },
  {
    id: 'opinion',
    name: '意见',
    icon: '📣',
    description: '对某项工作提出见解和处理办法的公文',
    templatePrompt: `请根据以下信息撰写一份意见，包括标题、正文（说明背景情况、分析问题、提出意见和建议等）和结尾。语言要求准确、有针对性、可操作性强。`,
    category: 'professional'
  },
  {
    id: 'performance',
    name: '述职报告',
    icon: '👨‍💼',
    description: '汇报个人或单位任职期间履行职责情况的报告',
    templatePrompt: `请根据以下信息撰写一份述职报告，包括标题、正文（基本情况、履职情况、工作成绩、问题不足、今后打算等）和结尾。语言要求客观、实事求是、重点突出。`,
    category: 'professional'
  },
  {
    id: 'analysis',
    name: '形势分析报告',
    icon: '📊',
    description: '分析当前形势状况和发展趋势的报告',
    templatePrompt: `请根据以下信息撰写一份形势分析报告，包括标题、正文（总体形势、具体分析、发展趋势、对策建议等）和结尾。语言要求客观、全面、有前瞻性。`,
    category: 'professional'
  },

  // 讲话稿件类型
  {
    id: 'speech',
    name: '领导讲话稿',
    icon: '🎤',
    description: '为领导在各类场合发言准备的讲话文稿',
    templatePrompt: `请根据以下信息撰写一份领导讲话稿，包括开场白、主体内容（包括对形势的分析、对工作的总结、对问题的剖析、对未来的展望等）和结束语。语言要求庄重、有高度、有温度。`,
    category: 'speech'
  },
  {
    id: 'party-study',
    name: '党建学习分享',
    icon: '📚',
    description: '学习习总书记重要讲话，结合工作实际谈心得体会',
    templatePrompt: `请根据以下信息撰写一份党建学习分享发言稿，包括：
1. 开场：表明学习主题和重要意义
2. 主要内容：
   - 重要讲话的核心要义和精神实质
   - 对讲话精神的深刻理解和思考
   - 结合本职工作的具体实践和体会
   - 下一步工作思路和改进措施
3. 结束语：表达继续深入学习和践行的决心
语言要求：政治性强、思想深刻、联系实际、富有感染力。`,
    category: 'speech'
  },
  {
    id: 'ceremony-speech',
    name: '仪式致辞',
    icon: '🏆',
    description: '为各类仪式、庆典场合准备的致辞稿',
    templatePrompt: `请根据以下信息撰写一份仪式致辞，包括开场白、主体内容（对活动意义的阐述、对相关人员的感谢等）和结束语。语言要求庄重、热情、简洁有力。`,
    category: 'speech'
  },
  {
    id: 'conference-speech',
    name: '会议发言稿',
    icon: '👥',
    description: '为各类会议发言准备的文稿',
    templatePrompt: `请根据以下信息撰写一份会议发言稿，包括开场白、主体内容（对相关工作的汇报、经验交流或意见建议等）和结束语。语言要求简明扼要、重点突出。`,
    category: 'speech'
  },
  {
    id: 'inspection-speech',
    name: '调研讲话稿',
    icon: '🔍',
    description: '领导在调研考察过程中的讲话文稿',
    templatePrompt: `请根据以下信息撰写一份调研讲话稿，包括开场白、主体内容（调研感受、肯定成绩、指出问题、提出要求等）和结束语。语言要求亲切自然、有针对性。`,
    category: 'speech'
  },
  {
    id: 'welcome-speech',
    name: '欢迎词',
    icon: '🤝',
    description: '欢迎来宾、客人的讲话稿',
    templatePrompt: `请根据以下信息撰写一份欢迎词，包括问候语、欢迎内容、活动或会晤意义、祝愿等部分。语言要求热情友好、礼节性强、简明扼要。`,
    category: 'speech'
  },
  {
    id: 'election-speech',
    name: '竞选演讲稿',
    icon: '📣',
    description: '参加选举或竞聘的演讲稿',
    templatePrompt: `请根据以下信息撰写一份竞选演讲稿，包括自我介绍、能力展示、工作设想、郑重承诺等部分。语言要求真诚、有感染力、有说服力。`,
    category: 'speech'
  },
  {
    id: 'theme-speech',
    name: '主题演讲稿',
    icon: '🎯',
    description: '围绕特定主题的演讲稿',
    templatePrompt: `请根据以下信息撰写一份主题演讲稿，包括开场引入、主题阐述、案例分析、结论启示等部分。语言要求生动、有深度、有内涵。`,
    category: 'speech'
  },

  // 规章制度类型
  {
    id: 'regulation',
    name: '规章制度',
    icon: '📜',
    description: '规范组织内部运行和管理的制度性文件',
    templatePrompt: `请根据以下信息撰写一份规章制度，包括标题、总则（制定目的、依据、适用范围等）、正文（具体规定、职责分工、工作流程等）、附则（实施时间、解释权限等）。语言要求规范、严谨、条理清晰。`,
    category: 'official'
  },
  {
    id: 'measure',
    name: '实施办法',
    icon: '📋',
    description: '为贯彻执行某项工作而制定的具体措施',
    templatePrompt: `请根据以下信息撰写一份实施办法，包括标题、总则（制定目的、依据等）、正文（具体办法、程序步骤等）、附则（实施时间等）。语言要求具体、明确、可操作性强。`,
    category: 'official'
  },
  {
    id: 'rule',
    name: '管理办法',
    icon: '⚙️',
    description: '对某一领域或事项进行规范管理的制度性文件',
    templatePrompt: `请根据以下信息撰写一份管理办法，包括标题、总则（制定目的、适用范围等）、正文（管理内容、实施要求、监督检查等）、附则（实施时间等）。语言要求严谨、全面、可操作。`,
    category: 'official'
  },
  {
    id: 'procedure',
    name: '工作流程',
    icon: '🔄',
    description: '规范工作步骤和操作规范的文件',
    templatePrompt: `请根据以下信息撰写一份工作流程，包括标题、流程概述、详细步骤（各环节、责任人、操作要点等）、注意事项等部分。语言要求简明、准确、便于执行。`,
    category: 'official'
  },
  {
    id: 'standard',
    name: '工作标准',
    icon: '📏',
    description: '明确工作要求和评价标准的规范性文件',
    templatePrompt: `请根据以下信息撰写一份工作标准，包括标题、适用范围、标准内容（质量要求、时间要求、流程要求等）、评价方法等部分。语言要求客观、量化、易于考核。`,
    category: 'official'
  },
  {
    id: 'initiative',
    name: '倡议书',
    icon: '🙋',
    description: '发起某项活动或提倡某种行为的文件',
    templatePrompt: `请根据以下信息撰写一份倡议书，包括标题、开头（说明发起倡议的背景和意义）、主体（具体倡议内容）、结尾（号召和期望）、落款。语言要求真诚、有感染力、有号召力。`,
    category: 'official'
  },
  {
    id: 'thanks',
    name: '感谢信',
    icon: '💌',
    description: '表达感谢之情的正式信函',
    templatePrompt: `请根据以下信息撰写一份感谢信，包括标题、称谓、正文（表达感谢的事由、具体感谢内容、良好祝愿等）、结尾、落款。语言要求真诚、得体、有温度。`,
    category: 'official'
  },
  {
    id: 'invitation',
    name: '邀请函',
    icon: '🎟️',
    description: '邀请参加活动或会议的正式函件',
    templatePrompt: `请根据以下信息撰写一份邀请函，包括标题、称谓、正文（活动背景、邀请事项、时间地点、联系方式等）、结尾、落款。语言要求礼貌、热情、详细明确。`,
    category: 'official'
  }
];

// 格式化提示词函数
export function formatPrompt(
  documentType: DocumentType,
  context: DocumentContext & { background?: string },
  preferences: StylePreference
): string {
  // 基本信息部分
  const basicInfo = `
文档类型：${documentType.name}
主题：${context.subject}
接收方：${context.recipients}
`;

  // 内容指导部分
  const contentGuide = `
内容指导：
${context.background ? `背景信息：${context.background}\n` : ''}
${context.keywords.length > 0 ? `关键词：${context.keywords.join('、')}\n` : ''}
${context.specialRequirements ? `特殊要求：${context.specialRequirements}` : ''}
`;

  // 风格要求部分
  const styleGuide = `
风格要求：
- 正式程度：${preferences.formalityLevel}/5
- 详细程度：${preferences.detailLevel}/5
- 文风体系：${preferences.toneStyle}
- 结构风格：${preferences.structurePreference}
  `.trim();

  return `${basicInfo}\n${contentGuide}\n${styleGuide}`;
}