# 写作助手

一个基于AI的写作辅助工具，帮助用户生成高质量的文本内容。

## 功能特点

- 基于提示词生成文本内容
- 支持关键词引导
- 使用OpenRouter API调用多种AI模型
- 支持导出为Markdown格式

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
   - 在 `.env.local` 文件中填入您的 OpenRouter API 密钥

```bash
cp .env.example .env.local
```

然后编辑 `.env.local` 文件，填入您的 API 密钥：
```
OPENROUTER_API_KEY="sk-or-your-actual-api-key"
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

## 使用方法

1. 访问 http://localhost:3000
2. 在提示词文本框中输入您的写作需求
3. 可选：添加关键词以引导生成内容
4. 点击"生成内容"按钮
5. 生成完成后，可以查看结果并选择导出为Markdown文件

## API密钥设置

您可以通过以下两种方式提供API密钥：

1. 在环境变量中设置 `OPENROUTER_API_KEY`（推荐用于生产环境）
2. 在应用界面的API设置中直接输入（方便开发和测试）

如果没有提供API密钥，应用将返回模拟响应。

## 获取OpenRouter API密钥

1. 访问 [OpenRouter](https://openrouter.ai/keys)
2. 注册或登录账号
3. 创建新的API密钥
4. 复制API密钥并按上述方法配置

## 许可证

MIT 