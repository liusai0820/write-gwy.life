import type { Metadata } from "next";
import "./globals.css";

// 使用系统字体替代
const systemFont = {
  className: 'system-font',
  style: { 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  }
};

const systemMonoFont = {
  className: 'system-mono-font',
  style: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  }
};

export const metadata: Metadata = {
  title: "智能公文助手",
  description: "专业的公务写作辅助工具",
  icons: {
    icon: '/pen.svg'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        {children}
      </body>
    </html>
  )
}
