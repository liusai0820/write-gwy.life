# 智能公文助手

专为公务人员提供的高效公文写作服务平台。

## 功能特点

- 覆盖32+种标准公文格式
- 精准匹配个性化应用场景
- 内置10万+政务语料库
- 10秒内完成从构思到成稿
- 支持一键导出Word文档
- 智能反馈系统
- 自适应身份设置
- 参考资料上传功能

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenRouter API
- Resend Email Service

## 环境要求

- Node.js 18.0.0 或更高版本
- npm 或 yarn

## 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/write-gwy.life.git
cd write-gwy.life
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 配置环境变量
   - 复制 `.env.example` 文件为 `.env.local`
   - 配置必要的环境变量

```bash
cp .env.example .env.local
```

在 `.env.local` 文件中配置以下环境变量：
```
# OpenRouter API密钥
OPENROUTER_API_KEY="your-api-key"

# Email配置 (使用Resend邮件服务)
RESEND_API_KEY="your-resend-api-key"
NOTIFICATION_EMAIL="your-email@example.com"

# GitHub配置（可选）
GITHUB_ACCESS_TOKEN="your-github-token"
GITHUB_REPO_OWNER="your-github-username"
GITHUB_REPO_NAME="your-repo-name"
```

## 运行项目

### 开发环境
```bash
npm run dev
# 或
yarn dev
```

### 生产环境
```bash
npm run build
npm run start
# 或
yarn build
yarn start
```

## 主要功能

### 1. 公文类型支持
- 支持多种标准公文格式
- 智能模板匹配
- 自动格式调整

### 2. 智能写作
- 基于上下文的智能补全
- 政务专业用语建议
- 实时写作指导

### 3. 文档导出
- 一键导出Word文档
- 自动排版
- 标准格式化

### 4. 用户反馈系统
- 实时反馈收集
- 邮件通知集成
- 用户体验追踪

## API配置说明

### OpenRouter API
用于AI模型调用，支持多种大语言模型：
1. 访问 [OpenRouter](https://openrouter.ai/keys)
2. 注册并创建API密钥
3. 在环境变量中配置

### Resend Email Service
用于发送反馈通知邮件：
1. 访问 [Resend](https://resend.com)
2. 注册并获取API密钥
3. 在环境变量中配置

## 许可证

MIT 