import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { feedback, email, mood } = await request.json();

    const moodEmojis = {
      1: '😢',
      2: '🙁',
      3: '😐',
      4: '😊',
      5: '🥰',
    };

    const moodLabels = {
      1: '非常不满意',
      2: '不满意',
      3: '一般',
      4: '满意',
      5: '非常满意',
    };

    const emailContent = `
      <h2>收到新的用户反馈</h2>
      <p><strong>满意度：</strong>${moodEmojis[mood as keyof typeof moodEmojis]} ${moodLabels[mood as keyof typeof moodLabels]}</p>
      <p><strong>反馈内容：</strong>${feedback}</p>
      ${email ? `<p><strong>联系方式：</strong>${email}</p>` : ''}
      <hr>
      <p style="color: #666; font-size: 12px;">此邮件由系统自动发送，请勿直接回复。</p>
    `;

    await resend.emails.send({
      from: 'Feedback <feedback@gwy.life>',
      to: process.env.NOTIFICATION_EMAIL!,
      subject: `[用户反馈] ${moodEmojis[mood as keyof typeof moodEmojis]} ${feedback.slice(0, 20)}...`,
      html: emailContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('处理反馈时出错:', error);
    return NextResponse.json({ error: '提交反馈失败' }, { status: 500 });
  }
} 