// src/app/components/DocumentPreview.tsx
import React, { useState } from 'react';
import { DocumentType } from '../lib/types';

interface DocumentPreviewProps {
  content: string;
  isLoading: boolean;
  onContentChange: (content: string) => void;
  documentType: DocumentType | null;
}

interface DocumentStructure {
  title: string;
  recipients: string[];
  mainBody: {
    preface: string[];
    sections: {
      title: string;
      subsections: {
        title: string;
        content: string[];
      }[];
      content: string[];
    }[];
  };
  ending: {
    content: string[];
    sender: string;
    date: string;
    attachments: string[];
    distribution: string[];
    notes: string[];
    contact?: string;
    phone?: string;
    email?: string;
  };
}

interface SectionStructure {
  title: string;
  subsections: SubsectionStructure[];
  content: string[];
}

interface SubsectionStructure {
  title: string;
  content: string[];
}

interface EndingStructure {
  content: string[];
  sender: string;
  date: string;
  attachments: string[];
  distribution: string[];
  notes: string[];
  contact?: string;
  phone?: string;
  email?: string;
}

class DocumentParser {
  private lines: string[];
  private currentIndex: number = 0;

  constructor(content: string) {
    this.lines = content.split('\n').map(line => line.trim()).filter(line => line);
  }

  public parse(): DocumentStructure {
    const structure: DocumentStructure = {
      title: '',
      recipients: [],
      mainBody: {
        preface: [],
        sections: []
      },
      ending: {
        content: [],
        sender: '',
        date: '',
        attachments: [],
        distribution: [],
        notes: [],
        contact: '',
        phone: '',
        email: ''
      }
    };

    // 解析标题
    structure.title = this.parseTitle();

    // 解析发文对象
    structure.recipients = this.parseRecipients();

    // 解析帽段
    structure.mainBody.preface = this.parsePreface();

    // 解析正文部分
    while (this.currentIndex < this.lines.length) {
      const section = this.parseSection();
      if (section) {
        structure.mainBody.sections.push(section);
      } else {
        break;
      }
    }

    // 解析结尾部分
    structure.ending = this.parseEnding();

    return structure;
  }

  private parseTitle(): string {
    const titleLines: string[] = [];
    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex];
      if (this.isRecipient(line) || this.isSectionTitle(line)) break;
      if (line) {
        titleLines.push(line);
      }
      this.currentIndex++;
    }
    return titleLines.join('');
  }

  private parseRecipients(): string[] {
    const recipients: string[] = [];
    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex];
      if (this.isRecipient(line)) {
        recipients.push(line);
        this.currentIndex++;
      } else {
        break;
      }
    }
    return recipients;
  }

  private parsePreface(): string[] {
    const preface: string[] = [];
    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex];
      if (this.isSectionTitle(line)) break;
      preface.push(line);
      this.currentIndex++;
    }
    return preface;
  }

  private parseSection(): SectionStructure | null {
    const line = this.lines[this.currentIndex];
    if (!this.isSectionTitle(line)) return null;

    const section: SectionStructure = {
      title: line,
      subsections: [],
      content: []
    };
    this.currentIndex++;

    while (this.currentIndex < this.lines.length) {
      const currentLine = this.lines[this.currentIndex];
      if (this.isSectionTitle(currentLine)) break;

      if (this.isSubsectionTitle(currentLine)) {
        const subsection = this.parseSubsection();
        section.subsections.push(subsection);
      } else {
        section.content.push(currentLine);
        this.currentIndex++;
      }
    }

    return section;
  }

  private parseSubsection(): SubsectionStructure {
    const subsection: SubsectionStructure = {
      title: this.lines[this.currentIndex],
      content: []
    };
    this.currentIndex++;

    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex];
      if (this.isSectionTitle(line) || this.isSubsectionTitle(line)) break;
      subsection.content.push(line);
      this.currentIndex++;
    }

    return subsection;
  }

  private parseEnding(): EndingStructure {
    const ending: EndingStructure = {
      content: [],
      sender: '',
      date: '',
      attachments: [],
      distribution: [],
      notes: [],
      contact: '',
      phone: '',
      email: ''
    };

    let hasFoundSpecialEnding = false;

    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex];
      
      // 检查是否是特殊结束语（如"特此通知"）
      if (line.includes('特此') || line.includes('此致')) {
        hasFoundSpecialEnding = true;
        ending.content.push(line);
      }
      // 附件部分应该在特殊结束语之后处理
      else if ((line.startsWith('附件：') || line.startsWith('附件:')) && hasFoundSpecialEnding) {
        const attachmentContent = line.replace(/^附件[：:]\s*/, '');
        if (attachmentContent) {
          ending.attachments.push(attachmentContent);
        }
      }
      // 发文单位和日期应该在最后处理
      else if (/深圳市.*委员会$/.test(line)) {
        ending.sender = line;
      }
      else if (/^\d{4}年\d{1,2}月\d{1,2}日$/.test(line)) {
        ending.date = line;
      }
      else if (line.includes('联系人：') || line.includes('联系人:')) {
        ending.contact = line;
      }
      else if (line.includes('电话：') || line.includes('电话:')) {
        ending.phone = line;
      }
      else if (line.includes('@') && line.includes('.')) {
        ending.email = line;
      }
      else if (!hasFoundSpecialEnding) {
        ending.content.push(line);
      }
      
      this.currentIndex++;
    }

    return ending;
  }

  private isRecipient(line: string): boolean {
    return line.endsWith('：') || line.endsWith(':') || 
           line.includes('各区') || line.includes('各市') || 
           line.includes('各县') || line.includes('单位：');
  }

  private isSectionTitle(line: string): boolean {
    return /^[一二三四五六七八九十]+[、.．]/.test(line);
  }

  private isSubsectionTitle(line: string): boolean {
    return /^（[一二三四五六七八九十]+）/.test(line);
  }
}

class DocumentRenderer {
  private structure: DocumentStructure;

  constructor(structure: DocumentStructure) {
    this.structure = structure;
  }

  public render(): React.ReactElement[] {
    return [
      this.renderTitle(),
      ...this.renderRecipients(),
      ...this.renderMainBody(),
      ...this.renderEnding()
    ];
  }

  private renderTitle(): React.ReactElement {
    return (
      <div key="title" className="text-center mb-8 mt-6">
        <h1 className="text-xl font-bold whitespace-pre-wrap mx-auto max-w-full" 
            style={{ fontFamily: '"方正小标宋", SimSun, serif' }}>
          {this.structure.title}
        </h1>
      </div>
    );
  }

  private renderRecipients(): React.ReactElement[] {
    return this.structure.recipients.map((recipient, index) => (
      <div key={`recipient-${index}`} className="mb-6">
        <p className="text-left" style={{ fontFamily: '"仿宋", FangSong, serif' }}>
          {recipient}
        </p>
      </div>
    ));
  }

  private renderMainBody(): React.ReactElement[] {
    const result: React.ReactElement[] = [];

    // 渲染帽段
    this.structure.mainBody.preface.forEach((paragraph, index) => {
      result.push(
        <p key={`preface-${index}`} 
           className="my-1 text-base leading-relaxed" 
           style={{ 
             fontFamily: '"仿宋", FangSong, serif',
             textIndent: '2em'  // 使用2em确保是2个字符的缩进
           }}>
          {paragraph}
        </p>
      );
    });

    // 渲染各节
    this.structure.mainBody.sections.forEach((section, sectionIndex) => {
      // 渲染节标题
      result.push(
        <h2 key={`section-${sectionIndex}`} 
            className="text-lg font-bold mt-4 mb-2" 
            style={{ 
              fontFamily: '"黑体", SimHei, sans-serif',
              textIndent: '2em'  // 一级标题缩进2字符
            }}>
          {section.title}
        </h2>
      );

      // 渲染节内容
      section.content.forEach((paragraph, paraIndex) => {
        result.push(
          <p key={`section-${sectionIndex}-content-${paraIndex}`} 
             className="my-1 text-base leading-relaxed" 
             style={{ 
               fontFamily: '"仿宋", FangSong, serif',
               textIndent: '2em'
             }}>
            {paragraph}
          </p>
        );
      });

      // 渲染小节
      section.subsections.forEach((subsection, subsectionIndex) => {
        result.push(
          <h3 key={`section-${sectionIndex}-subsection-${subsectionIndex}`} 
              className="text-base font-medium mt-3 mb-2" 
              style={{ 
                fontFamily: '"楷体", KaiTi, serif',
                textIndent: '2em'  // 二级标题缩进2字符
              }}>
            {subsection.title}
          </h3>
        );

        subsection.content.forEach((paragraph, paraIndex) => {
          result.push(
            <p key={`section-${sectionIndex}-subsection-${subsectionIndex}-content-${paraIndex}`} 
               className="my-1 text-base leading-relaxed" 
               style={{ 
                 fontFamily: '"仿宋", FangSong, serif',
                 textIndent: '2em'
               }}>
              {paragraph}
            </p>
          );
        });
      });
    });

    return result;
  }

  private renderEnding(): React.ReactElement[] {
    const result: React.ReactElement[] = [];

    // 渲染结束语（如"特此通知"）
    this.structure.ending.content.forEach((paragraph, index) => {
      result.push(
        <p key={`ending-${index}`} 
           className="my-1 text-base leading-relaxed" 
           style={{ 
             fontFamily: '"仿宋", FangSong, serif',
             textIndent: '2em'
           }}>
          {paragraph}
        </p>
      );
    });

    // 渲染附件（确保在特此通知之后）
    if (this.structure.ending.attachments && this.structure.ending.attachments.length > 0) {
      result.push(
        <div key="attachments" className="mt-4">
          <p className="mb-2" style={{ fontFamily: '"仿宋", FangSong, serif' }}>
            附件：
          </p>
          {this.structure.ending.attachments.map((attachment, index) => (
            <p key={`attachment-${index}`} 
               className="ml-4" 
               style={{ fontFamily: '"仿宋", FangSong, serif' }}>
              {`${index + 1}. ${attachment}`}
            </p>
          ))}
        </div>
      );
    }

    // 渲染发文单位和日期（右对齐）
    const senderDateContainer = (
      <div key="sender-date" className="mt-8 flex flex-col items-end">
        {this.structure.ending.sender && (
          <div className="text-right">
            <p style={{ fontFamily: '"仿宋", FangSong, serif' }}>
              {this.structure.ending.sender}
            </p>
          </div>
        )}
        {this.structure.ending.date && (
          <div className="text-right mt-2">
            <p style={{ fontFamily: '"仿宋", FangSong, serif' }}>
              {this.structure.ending.date}
            </p>
          </div>
        )}
      </div>
    );
    result.push(senderDateContainer);

    // 渲染联系信息
    if (this.structure.ending.contact || this.structure.ending.phone || this.structure.ending.email) {
      const contactInfo = (
        <div key="contact-info" className="mt-4 flex flex-col items-end">
          {this.structure.ending.contact && (
            <p style={{ fontFamily: '"仿宋", FangSong, serif' }}>
              {this.structure.ending.contact}
            </p>
          )}
          {this.structure.ending.phone && (
            <p style={{ fontFamily: '"仿宋", FangSong, serif' }}>
              {this.structure.ending.phone}
            </p>
          )}
          {this.structure.ending.email && (
            <p style={{ fontFamily: '"仿宋", FangSong, serif' }}>
              {this.structure.ending.email}
            </p>
          )}
        </div>
      );
      result.push(contactInfo);
    }

    return result;
  }
}

export default function DocumentPreview({ 
  content, 
  isLoading, 
  onContentChange,
  documentType 
}: DocumentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const renderDocument = (text: string) => {
    if (!text) return [];
    
    const parser = new DocumentParser(text);
    const structure = parser.parse();
    const renderer = new DocumentRenderer(structure);
    return renderer.render();
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
          请在左侧选择公文类型并填写相关信息，然后点击&quot;生成公文草稿&quot;按钮
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
      <div className="px-6 py-2 flex justify-end">
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
          className="flex-1 w-full resize-none border border-gray-200 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm"
          style={{
            minHeight: '500px'
          }}
        />
      ) : (
        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="document-preview prose max-w-none mx-auto bg-white rounded-sm">
            {renderDocument(content)}
          </div>
        </div>
      )}
    </div>
  );
}
