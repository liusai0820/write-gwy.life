# 模型配置说明

本应用支持通过环境变量配置默认使用的AI模型。这使您可以在不修改代码的情况下，轻松切换应用使用的模型。

## 环境变量设置

应用使用以下环境变量：

- `DEFAULT_MODEL`: 指定默认使用的模型名称，例如 `anthropic/claude-3.5-sonnet` 或 `openai/gpt-4o`
- `OPENROUTER_API_KEY`: OpenRouter API密钥（如果用户未提供自己的API密钥）

## 在Vercel中设置环境变量

1. 登录您的Vercel账户
2. 进入项目设置
3. 点击"Environment Variables"选项卡
4. 添加新的环境变量：
   - 名称：`DEFAULT_MODEL`
   - 值：从OpenRouter获取的模型名称，例如 `anthropic/claude-3.5-sonnet`
5. 点击"Save"保存设置

## 支持的模型

您可以在OpenRouter平台上查看所有支持的模型列表。常用的模型包括：

- `anthropic/claude-3.5-sonnet`
- `anthropic/claude-3-opus`
- `openai/gpt-4o`
- `openai/gpt-4-turbo`
- `google/gemini-1.5-pro`
- `meta-llama/llama-3-70b-instruct`

## 注意事项

- 更改环境变量后，需要重新部署应用才能生效
- 确保使用的模型名称与OpenRouter平台上的名称完全一致
- 不同模型可能有不同的定价和性能特点，请根据您的需求选择合适的模型 