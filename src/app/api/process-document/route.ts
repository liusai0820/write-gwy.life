// src/app/api/process-document/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

// 设置临时文件目录
const tmpDir = join(process.cwd(), 'tmp');

// 确保临时目录存在
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// 处理文件上传和文本提取
export async function POST(request: NextRequest) {
  try {
    // 获取表单数据
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: { message: '未找到上传的文件' } },
        { status: 400 }
      );
    }

    // 文件信息
    const fileInfo = {
      name: file.name,
      type: file.type,
      size: file.size
    };

    console.log('处理上传文件:', fileInfo);

    // 获取文件扩展名
    const extension = path.extname(file.name).toLowerCase();
    
    // 将文件保存到临时目录
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const tempFilePath = join(tmpDir, `upload_${Date.now()}${extension}`);
    await writeFile(tempFilePath, buffer);
    
    // 根据文件类型提取文本
    let textContent = '';
    let extractionMethod = '';
    
    try {
      if (extension === '.pdf') {
        // PDF文件处理
        const pdfParse = (await import('pdf-parse')).default;
        const data = await pdfParse(buffer);
        textContent = data.text || '';
        extractionMethod = 'pdf-parse';
      } 
      else if (extension === '.docx' || extension === '.doc') {
        // Word文档处理
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ path: tempFilePath });
        textContent = result.value || '';
        extractionMethod = 'mammoth';
      } 
      else if (extension === '.xlsx' || extension === '.xls') {
        // Excel文件处理
        const XLSX = await import('xlsx');
        const workbook = XLSX.readFile(tempFilePath);
        
        // 合并所有工作表的内容
        const sheetNames = workbook.SheetNames;
        textContent = sheetNames.map(name => {
          const sheet = workbook.Sheets[name];
          return `--- 工作表: ${name} ---\n${XLSX.utils.sheet_to_csv(sheet)}`;
        }).join('\n\n');
        
        extractionMethod = 'xlsx';
      } 
      else if (extension === '.txt') {
        // 纯文本文件处理
        textContent = buffer.toString('utf8');
        extractionMethod = 'text';
      }
      else {
        textContent = `未支持的文件类型: ${extension}`;
        extractionMethod = 'unsupported';
      }
    } catch (extractError) {
      console.error('文件内容提取错误:', extractError);
      textContent = `提取失败: ${extractError instanceof Error ? extractError.message : '未知错误'}`;
      extractionMethod = 'error';
    }
    
    // 清理临时文件
    try {
      fs.unlinkSync(tempFilePath);
    } catch (cleanupError) {
      console.error('临时文件清理错误:', cleanupError);
    }

    // 如果提取的文本过长，进行截断
    const maxLength = 10000; // 最大字符数
    const isTruncated = textContent.length > maxLength;
    
    if (isTruncated) {
      textContent = textContent.substring(0, maxLength) + '...(内容已截断)';
    }

    // 返回结果
    return NextResponse.json({
      success: true,
      fileInfo,
      extractionMethod,
      isTruncated,
      contentLength: textContent.length,
      textContent
    });
  } catch (error) {
    console.error('文件处理错误:', error);
    return NextResponse.json(
      { 
        error: { 
          message: error instanceof Error ? error.message : '文件处理失败',
          details: error instanceof Error ? error.stack : undefined
        } 
      },
      { status: 500 }
    );
  }
}