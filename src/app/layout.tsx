import type { Metadata } from "next";
import "./globals.css";
import FeedbackButton from "./components/FeedbackButton";

export const metadata: Metadata = {
  title: "公文笔杆子",
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
      <body className="min-h-screen bg-gray-50" style={{
        fontFamily: 'KaiTi, 楷体, STKaiti, 华文楷体, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            {children}
          </div>
          <footer>
            <div className="container mx-auto px-4 py-4">
              <div className="text-center text-gray-500 text-xs flex items-center justify-center gap-4">
                <span>© 2025 公文笔杆子 · 专为公务人员提供高效公文写作服务</span>
                <FeedbackButton />
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
