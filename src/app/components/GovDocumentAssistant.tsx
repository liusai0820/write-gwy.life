// src/app/components/GovDocumentAssistant.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { DocumentType, DocumentContext, formatPrompt } from '../lib/types';
import DocumentTypeSelector from './DocumentTypeSelector';
import DocumentContextForm from './DocumentContextForm';
import DocumentPreview from './DocumentPreview';
import FileUploader from './FileUploader';
import UserProfileSelector from './UserProfileSelector';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { getServerConfig } from '../lib/api';

// 预定义的模型配置
const DEFAULT_MODEL_CONFIG = {
  model: "anthropic/claude-3.5-sonnet",
  temperature: 0.6,
};

const PRODUCT_HIGHLIGHTS = {
  modelCapability: {
    title: "覆盖32+种标准公文格式",
    description: "",
    icon: "📋"
  },
  
  contextAwareness: {
    title: "精准匹配个性化应用场景",
    description: "",
    icon: "🎯"
  },
  
  professionalTerms: {
    title: "内置10万+政务语料库",
    description: "",
    icon: "📚"
  },
  
  efficientGeneration: {
    title: "10秒内完成从构思到成稿",
    description: "",
    icon: "⚡"
  }
};

export default function GovDocumentAssistant() {
  // 文档类型状态
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null);
  
  // 文档上下文信息
  const [documentContext, setDocumentContext] = useState<DocumentContext>({
    subject: '',
    recipients: '',
    keywords: [],
    specialRequirements: '',
    referenceFiles: [],
    background: ''
  });
  
  // 模型配置
  const [modelConfig, setModelConfig] = useState(DEFAULT_MODEL_CONFIG);
  
  // 生成的内容
  const [generatedContent, setGeneratedContent] = useState<string>('');
  
  // 加载状态
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // 错误信息
  const [error, setError] = useState<string | null>(null);

  // 当前选择的功能标签
  const [activeTab, setActiveTab] = useState<string>('standard');

  // 设置对话框状态
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // 用户背景信息状态
  const [selectedBackground, setSelectedBackground] = useState('');

  // 检查是否是首次访问
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setIsSettingsOpen(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  // 获取服务器配置
  useEffect(() => {
    async function fetchServerConfig() {
      try {
        const config = await getServerConfig();
        if (config.defaultModel) {
          setModelConfig(prev => ({
            ...prev,
            model: config.defaultModel
          }));
          console.log('从服务器获取的默认模型:', config.defaultModel);
        }
      } catch (err) {
        console.error('获取服务器配置失败:', err);
        // 使用默认配置，不显示错误
      }
    }
    
    fetchServerConfig();
  }, []);

  // 处理文档生成请求
  const handleGenerateDocument = async () => {
    if (!selectedDocType) {
      setError('请选择公文类型');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 构建提示词
      const prompt = formatPrompt(selectedDocType, documentContext);
      
      // 实际请求语言模型API
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: modelConfig.model,
          temperature: modelConfig.temperature
        })
      });
      
      if (!response.ok) {
        throw new Error('生成文档失败，请稍后再试');
      }
      
      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* 顶部导航栏 */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">公文笔杆子</h1>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">基于最先进的大语言模型，帮你一键成稿，胜似主任出手</p>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            身份设置
          </button>
        </div>

        {/* 产品亮点展示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-8">
          {Object.values(PRODUCT_HIGHLIGHTS).map((highlight, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center">
                <span className="text-xl mr-2">{highlight.icon}</span>
                <span className="text-xs text-gray-800">
                  {highlight.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* 左侧表单区域 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 文档类型选择 */}
            <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
              <h2 className="text-base text-gray-800 mb-3 flex items-center">
                <svg className="h-4 w-4 mr-1.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                公文类型
              </h2>
              
              <DocumentTypeSelector 
                selectedType={selectedDocType}
                onSelect={setSelectedDocType}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
            
            {/* 上下文信息 */}
            <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
              <h2 className="text-base font-medium mb-3 text-gray-800 flex items-center">
                <svg className="h-4 w-4 mr-1.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                文档信息
              </h2>
              
              <DocumentContextForm
                context={documentContext}
                onChange={setDocumentContext}
              />
            </div>
            
            {/* 参考文件上传 */}
            <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
              <h2 className="text-base font-medium mb-3 text-gray-800 flex items-center">
                <svg className="h-4 w-4 mr-1.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                参考资料
              </h2>
              
              <FileUploader
                files={documentContext.referenceFiles}
                onFilesChange={(files) => setDocumentContext({...documentContext, referenceFiles: files})}
              />
            </div>
            
            {/* 提交按钮 */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleGenerateDocument}
                disabled={isLoading || !selectedDocType}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition duration-200 flex items-center justify-center ${
                  (isLoading || !selectedDocType) ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成中...
                  </span>
                ) : '生成公文草稿'}
              </button>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200 text-sm">
                  <div className="font-medium flex items-center">
                    <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 右侧预览区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 h-full flex flex-col">
              <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                <h2 className="text-base font-medium text-gray-800 flex items-center">
                  <svg className="h-4 w-4 mr-1.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  公文预览
                </h2>
                
                {generatedContent && (
                  <div className="flex space-x-2">
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded-md text-sm flex items-center"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedContent);
                        // 显示复制成功的提示
                        const button = document.getElementById('copy-button');
                        if (button) {
                          const originalText = button.innerHTML;
                          button.innerHTML = `
                            <svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            已复制
                          `;
                          button.classList.remove('bg-gray-100', 'hover:bg-gray-200');
                          button.classList.add('bg-green-100', 'text-green-700');
                          
                          setTimeout(() => {
                            button.innerHTML = originalText;
                            button.classList.remove('bg-green-100', 'text-green-700');
                            button.classList.add('bg-gray-100', 'hover:bg-gray-200');
                          }, 2000);
                        }
                      }}
                      id="copy-button"
                    >
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      复制
                    </button>
                    
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-md text-sm flex items-center"
                      onClick={() => {
                        // 获取完整的文档内容
                        const fullContent = generatedContent;
                        
                        // 创建一个新的docx文档
                        const doc = new Document({
                          sections: [
                            {
                              properties: {},
                              children: generateDocxContent(fullContent)
                            }
                          ]
                        });
                        
                        // 生成并保存文件
                        Packer.toBlob(doc).then(blob => {
                          // 使用文档标题作为文件名
                          const docTitle = extractTitle(fullContent);
                          const fileName = docTitle 
                            ? `${docTitle.trim()}.docx`
                            : '未命名公文.docx';
                          
                          saveAs(blob, fileName);
                        });
                      }}
                    >
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      导出
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex-1 overflow-auto">
                <div className="h-full">
                  <DocumentPreview 
                    content={generatedContent}
                    isLoading={isLoading}
                    onContentChange={setGeneratedContent}
                    documentType={selectedDocType}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 设置对话框 */}
      {isSettingsOpen && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-[480px] border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">身份设置</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm text-gray-500 mb-4">
                设置您的职务身份，以获得更精准的写作建议
              </p>
              <UserProfileSelector
                selectedBackground={selectedBackground}
                onBackgroundChange={(backgroundInfo) => {
                  setSelectedBackground(backgroundInfo);
                  setDocumentContext(prev => ({
                    ...prev,
                    background: backgroundInfo
                  }));
                }}
                onSave={() => setIsSettingsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function generateDocxContent(content: string) {
  const paragraphs: Paragraph[] = [];
  
  // 移除Markdown符号并提取内容
  const cleanLines = content.split('\n').map(line => {
    // 移除所有Markdown符号
    if (line.startsWith('# ')) return line.substring(2);
    if (line.startsWith('## ')) return line.substring(3);
    if (line.startsWith('### ')) return line.substring(4);
    if (line.startsWith('- ')) return line.substring(2);
    return line;
  }).filter(line => line.trim() !== ''); // 过滤掉空行
  
  // 提取标题、正文、落款和联系人信息
  let title = '';
  let recipient = '';
  let sender = '';
  let date = '';
  let contactInfo = '';
  const contentLines: string[] = [];
  const attachments: string[] = [];
  
  // 查找标题（通常是文档开头的非空行）
  let currentIndex = 0;
  
  // 跳过开头的空行
  while (currentIndex < cleanLines.length && cleanLines[currentIndex].trim() === '') {
    currentIndex++;
  }
  
  // 提取标题 - 可能跨多行，需要合并
  const titleLines = [];
  while (currentIndex < cleanLines.length && 
         cleanLines[currentIndex].trim() !== '' && 
         !cleanLines[currentIndex].includes('：') && 
         !cleanLines[currentIndex].includes(':')) {
    titleLines.push(cleanLines[currentIndex].trim());
    currentIndex++;
  }
  
  // 合并标题行
  if (titleLines.length > 0) {
    title = titleLines.join('');
  }
  
  // 查找收件人/抬头（通常在标题后的非空行）
  while (currentIndex < cleanLines.length && cleanLines[currentIndex].trim() === '') {
    currentIndex++;
  }
  
  // 提取收件人/抬头
  if (currentIndex < cleanLines.length) {
    recipient = cleanLines[currentIndex];
    currentIndex++;
  }
  
  // 提取正文内容
  const startContent = currentIndex;
  let endContent = cleanLines.length;
  
  // 查找落款（通常在文档末尾）
  for (let i = cleanLines.length - 1; i >= 0; i--) {
    const line = cleanLines[i].trim();
    
    // 查找日期行（格式如：2023年10月30日）
    if (/^\d{4}年\d{1,2}月\d{1,2}日$/.test(line)) {
      date = line;
      endContent = Math.min(endContent, i);
    }
    
    // 查找发件人/单位名称（通常在日期前）
    else if (date && i < cleanLines.length - 1 && cleanLines[i+1].trim() === date) {
      sender = line;
      endContent = Math.min(endContent, i);
    }
    
    // 查找联系人信息（通常包含"联系人"或电话号码或"联系方式"）
    else if (/联系人|电话|联系方式|[0-9]{5,}/.test(line)) {
      contactInfo = line;
      endContent = Math.min(endContent, i);
    }
    
    // 查找附件信息
    else if (line.startsWith('附件:') || line.startsWith('附件：')) {
      let j = i;
      while (j < cleanLines.length && (cleanLines[j].trim().startsWith('附件') || cleanLines[j].trim().startsWith('    ') || cleanLines[j].trim().startsWith('　　'))) {
        attachments.unshift(cleanLines[j]);
        j++;
      }
      endContent = Math.min(endContent, i);
      break;
    }
  }
  
  // 提取正文
  for (let i = startContent; i < endContent; i++) {
    contentLines.push(cleanLines[i]);
  }
  
  // 添加标题
  if (title) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 32, // 16pt
            font: {
              name: "方正小标宋",
              hint: "eastAsia"
            }
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 400,
          before: 400,
          line: 360 // 28磅行间距
        }
      })
    );
  }
  
  // 添加收件人/抬头
  if (recipient) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: recipient,
            size: 24, // 12pt
            font: {
              name: "仿宋",
              hint: "eastAsia"
            }
          })
        ],
        spacing: {
          after: 240,
          before: 240,
          line: 360 // 28磅行间距
        }
      })
    );
  }
  
  // 处理正文内容
  contentLines.forEach((line: string) => {
    if (line.trim() === '') {
      // 空行 - 不添加额外的段落间距
      paragraphs.push(new Paragraph({
        spacing: {
          line: 360 // 28磅行间距
        }
      }));
    } else if (/^[一二三四五六七八九十]+[、.．]/.test(line.trim())) {
      // 一级标题（如：一、二、三、等）
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              bold: true,
              size: 28,
              font: {
                name: "黑体",
                hint: "eastAsia"
              }
            })
          ],
          indent: {
            firstLine: 480
          },
          spacing: {
            line: 360
          }
        })
      );
    } else if (/^（[一二三四五六七八九十]+）/.test(line.trim())) {
      // 二级标题（如：（一）（二）等）
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 26,
              font: {
                name: "楷体",
                hint: "eastAsia"
              }
            })
          ],
          spacing: {
            line: 360
          }
        })
      );
    } else {
      // 普通段落
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 24,
              font: {
                name: "仿宋",
                hint: "eastAsia"
              }
            })
          ],
          indent: {
            firstLine: 480
          },
          spacing: {
            line: 360
          }
        })
      );
    }
  });
  
  // 添加附件
  if (attachments.length > 0) {
    paragraphs.push(
      new Paragraph({
        spacing: {
          before: 240,
          line: 360 // 28磅行间距
        }
      })
    );
    
    attachments.forEach((attachment: string) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: attachment,
              size: 24, // 12pt
              font: {
                name: "仿宋",
                hint: "eastAsia"
              }
            })
          ],
          spacing: {
            line: 360 // 28磅行间距
          }
        })
      );
    });
  }
  
  // 添加发件人/单位名称
  if (sender) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: sender,
            size: 24, // 12pt
            font: {
              name: "仿宋",
              hint: "eastAsia"
            }
          })
        ],
        alignment: AlignmentType.RIGHT,
        spacing: {
          before: 240,
          line: 360 // 28磅行间距
        }
      })
    );
  }
  
  // 添加日期
  if (date) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: date,
            size: 24, // 12pt
            font: {
              name: "仿宋",
              hint: "eastAsia"
            }
          })
        ],
        alignment: AlignmentType.RIGHT,
        spacing: {
          line: 360 // 28磅行间距
        }
      })
    );
  }
  
  // 添加联系人信息
  if (contactInfo) {
    paragraphs.push(
      new Paragraph({
        spacing: {
          before: 240,
          line: 360 // 28磅行间距
        }
      })
    );
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfo,
            size: 24, // 12pt
            font: {
              name: "仿宋",
              hint: "eastAsia"
            }
          })
        ],
        spacing: {
          line: 360 // 28磅行间距
        }
      })
    );
  }
  
  return paragraphs;
}

// 优化提取标题的函数
function extractTitle(content: string): string {
  const lines = content.split('\n');
  // 跳过开头的空行
  let currentIndex = 0;
  while (currentIndex < lines.length && lines[currentIndex].trim() === '') {
    currentIndex++;
  }
  
  // 提取第一个非空行作为标题
  if (currentIndex < lines.length) {
    const title = lines[currentIndex].trim()
      .replace(/^[#\s]+/, '') // 移除开头的#号和空格
      .replace(/[:：].*$/, ''); // 移除冒号及其后面的内容
    return title || '未命名公文';
  }
  
  return '未命名公文';
}