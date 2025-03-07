import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 从环境变量获取默认模型，如果未设置则使用claude-3.5-sonnet
    const defaultModel = process.env.DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet';
    
    // 返回配置信息
    return NextResponse.json({
      defaultModel,
      // 可以在这里添加其他配置信息
    });
  } catch (error) {
    console.error('获取配置信息时发生错误:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { error: `获取配置信息失败: ${errorMessage}` },
      { status: 500 }
    );
  }
} 