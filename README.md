# Claude Code Workflow Studio

<p align="center">
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://github.com/breaking-brake/cc-wf-studio/stargazers"><img src="https://img.shields.io/github/stars/breaking-brake/cc-wf-studio" alt="GitHub Stars" /></a>
  <a href="https://snyk.io/test/github/breaking-brake/cc-wf-studio"><img src="https://snyk.io/test/github/breaking-brake/cc-wf-studio/badge.svg" alt="Known Vulnerabilities" /></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=breaking-brake.cc-wf-studio"><img src="https://img.shields.io/visual-studio-marketplace/v/breaking-brake.cc-wf-studio?label=VS%20Marketplace" alt="VS Code Marketplace" /></a>
  <a href="https://open-vsx.org/extension/breaking-brake/cc-wf-studio"><img src="https://img.shields.io/open-vsx/v/breaking-brake/cc-wf-studio?label=OpenVSX" alt="OpenVSX" /></a>
</p>

<p align="center">
  <img src="./resources/hero.png" alt="Claude Code Workflow Studio" width="800">
</p>

<p align="center">
  <strong>通过可视化工作流编辑器加速 Claude Code 自动化</strong>
</p>

<p align="center">
  使用拖放功能直观地设计复杂的 AI 代理工作流。无需编写代码即可构建子代理编排和条件分支，然后直接导出为 <code>.claude</code> 格式以立即执行。
</p>

<!-- Hero image placeholder - recommended size: 1600x900px or 16:9 aspect ratio -->
<!-- Place image at: /resources/hero.png -->

---

<!-- AI Edit Demo GIF: PR Code Review Workflow -->
<p align="center">
  <img src="./resources/demo_edit_with_ai.gif" alt="AI-Assisted Workflow Creation Demo - PR Code Review" width="800">
</p>

<p align="center">
  <em>✨ AI 编辑：使用 MCP、技能和条件分支创建 PR 代码审查工作流 - 全部使用自然语言</em>
</p>

---

<!-- Run Workflow Demo GIF -->
<p align="center">
  <img src="./resources/demo_run_workflow.gif" alt="Run Workflow Demo - Execute workflows directly from the editor" width="800">
</p>

<p align="center">
  <em>▶️ 直接从编辑器运行工作流 - 立即查看您的 AI 自动化操作</em>
</p>

---

<!-- Slack Sharing Demo GIFs -->
<p align="center">
  <img src="./resources/slack-export-demo.gif" alt="Export Workflow to Slack" width="800">
</p>

<p align="center">
  <em>📤 将工作流导出到 Slack 并显示预览卡片</em>
</p>

<p align="center">
  <img src="./resources/slack-import-demo.gif" alt="Import Workflow from Slack" width="800">
</p>

<p align="center">
  <em>📥 从 Slack 一键导入工作流</em>
</p>

---

## 为什么选择 Claude Code Workflow Studio？

### 🎯 无代码工作流设计
无需编程。通过可视化连接子代理和用户决策节点来构建复杂的自动化流程。

### ⚡ 即时执行
设计的工作流自动导出到 `.claude/agents/` 和 `.claude/commands/`。可立即与 Claude Code 配合使用。

### 🔄 轻松迭代
将工作流保存并加载为 JSON 格式。通过反复试验来实验和完善您的流程。

### 🔒 完全本地化且安全
所有操作都在 VSCode 本地运行。**注意：** MCP 工具节点可能需要网络连接，具体取决于特定 MCP 服务器配置（例如远程 API 服务器）。非 MCP 功能完全离线运行。

## 主要功能

✨ **可视化工作流编辑器** - 直观的拖放画布，无需代码即可设计 AI 工作流

🤖 **AI 辅助工作流优化** - 通过对话式 AI 迭代改进工作流 - 使用自然语言反馈请求更改、添加功能或优化逻辑

📤 **一键导出** - 生成可立即与 Claude Code 配合使用的 `.claude/agents/*.md` 和 `.claude/commands/*.md` 文件

💬 **Slack 工作流共享（β）** - 直接将工作流共享到 Slack 频道，配有预览卡片和一键导入链接，实现无缝团队协作

🧩 **丰富的节点类型** - 使用多样化的节点类型构建复杂工作流：提示（模板）、子代理（AI 任务）、技能（Claude Code 技能）、MCP（外部工具）、IfElse/Switch（条件分支）和 AskUserQuestion（用户决策）

## AI 辅助工作流优化

### 概述

通过对话式 AI 迭代改进您的工作流。与其只生成一次工作流，您可以通过请求更改、添加功能或调整逻辑来持续优化它们 - 全部使用自然语言。AI 维护对话历史并逐步应用您的反馈。

### 前置条件

- 必须安装 **Claude Code CLI** 并在 PATH 中可访问
- 安装地址：https://claude.com/claude-code

验证安装：
```bash
claude --version
```

### 使用方法

1. **打开或创建工作流**
   - 启动 Claude Code Workflow Studio
   - 创建新工作流或打开现有工作流

2. **点击"使用 AI 编辑"按钮**
   - 位于主工具栏（闪光图标 ✨）
   - 打开 AI 优化对话框

3. **描述您的更改**
   - 编写自然语言请求（最多 2000 个字符）
   - 示例："添加一个验证输入数据的新子代理节点"
   - 示例："在处理器之前添加一个 AskUserQuestion 节点以选择输出格式"
   - 示例："将错误处理程序连接到日志记录子代理"

4. **迭代优化**
   - 点击"应用更改"或按 `Ctrl+Enter` / `Cmd+Enter`
   - AI 处理您的请求并更新工作流
   - 在画布上查看更改
   - 提出后续问题或请求进一步优化
   - 重复直到满意

5. **接受或放弃**
   - 点击"接受更改"以保留优化后的工作流
   - 点击"取消"以放弃所有 AI 修改并返回原始工作流

### 功能特性

- **对话式优化**：通过多轮反馈构建工作流
- **上下文感知**：AI 记住对话中的先前更改
- **智能定位**：自动放置新节点以避免重叠
- **增量更新**：仅应用请求的更改，保留工作流的其余部分
- **验证**：所有 AI 输出都经过模式规则验证（最多 50 个节点、有效连接等）
- **错误处理**：如果优化失败，提供清晰的错误消息和可操作的指导
- **多语言支持**：所有 UI 元素和错误消息支持 5 种语言（en、ja、ko、zh-CN、zh-TW）

### 获得最佳结果的技巧

✅ **具体明确**：提及确切的节点类型和连接
✅ **一次一个更改**：请求小型、集中的更改以获得更好的准确性
✅ **逐步构建**：从简单开始，然后通过迭代添加复杂性
✅ **审查每一步**：在请求更多优化之前验证更改

❌ **避免**：模糊的请求，如"让它更好"
❌ **避免**：要求完全重写（请改用"使用 AI 生成"）
❌ **避免**：一次请求太多更改（分解为较小的步骤）

### 示例优化请求

**模式 1：初始创建**（参见上面的演示 GIF）
```
例如：创建一个包含 MCP、技能和条件分支的 PR 代码审查工作流
```

**模式 2：迭代优化**
```
例如：在 MCP 工具无法获取 PR 详细信息时添加错误处理
```

**添加验证逻辑**
```
添加一个在处理之前验证用户输入的子代理节点
```

**修改连接**
```
将验证器的错误输出连接到新的错误处理程序子代理
```

**调整配置**
```
将 AskUserQuestion 节点更改为有 3 个选项而不是 2 个：高、中、低
```

**复杂的多步骤请求**
```
1. 添加一个读取 PDF 文件的技能节点
2. 将其连接到输入提示节点之后
3. 如果 PDF 读取失败，添加错误处理
```

### 错误消息

| 错误代码 | 含义 | 解决方案 |
|------------|---------|----------|
| `COMMAND_NOT_FOUND` | 未安装 Claude Code CLI | 安装 Claude Code CLI |
| `TIMEOUT` | 请求超过配置的超时时间 | 简化请求、增加超时设置或重试 |
| `PARSE_ERROR` | 无法解析 AI 输出 | 重新表述请求并重试 |
| `VALIDATION_ERROR` | 工作流超过限制（最多 50 个节点） | 删除节点或降低复杂性 |

### 限制

- 每个工作流最多 50 个节点
- AI 处理超时（默认 90 秒，可通过 UI 选择器配置：30 秒-5 分钟）
- 请求限制为 2000 个字符
- 对话历史仅在活动会话期间存储
- 需要活动的 Claude Code CLI 安装

## 入门指南

### 安装

**从 VSCode 市场安装**（即将推出）

1. 打开 VSCode 扩展（`Ctrl+Shift+X` / `Cmd+Shift+X`）
2. 搜索"Claude Code Workflow Studio"
3. 点击**安装**

**从源代码安装**

1. 克隆仓库
   ```bash
   git clone https://github.com/breaking-brake/cc-wf-studio.git
   cd cc-wf-studio
   ```
2. 安装依赖
   ```bash
   npm install
   cd src/webview && npm install && cd ../..
   ```
3. 构建扩展
   ```bash
   npm run build
   ```
4. 打包扩展
   ```bash
   npx vsce package
   ```
5. 安装生成的 `.vsix` 文件
   - 打开 VSCode 扩展（`Ctrl+Shift+X` / `Cmd+Shift+X`）
   - 点击 `...` 菜单 → "从 VSIX 安装..."
   - 选择生成的 `cc-wf-studio-x.x.x.vsix` 文件

### 快速开始

**1. 打开编辑器**
   - 按 `Ctrl+Shift+P` / `Cmd+Shift+P`
   - 输入"Claude Code Workflow Studio: Open Editor"
   - 按 Enter

**2. 参加互动教程**（首次用户）
   - 首次启动时会自动开始互动入门教程
   - 按照逐步指导教程实际学习工作流创建
   - 随时点击工具栏中的 **?** 按钮重新启动教程
   - 支持英语、日语、韩语、简体中文和繁体中文

**3. 创建您的工作流**
   - **添加节点**：左侧调色板分为以下部分：
     - **基础节点**：提示（模板）、子代理（AI 任务）
     - **控制流**：IfElse（二元分支）、Switch（多路分支）、AskUserQuestion（用户决策）
     - **集成**：技能（Claude Code 技能）、MCP（模型上下文协议工具）
   - **配置**：点击节点以在右侧面板中编辑其属性
   - **连接**：从输出端口（右侧）拖动到输入端口（左侧）以创建流程

**4. 保存和导出**
   - 在工具栏中输入工作流名称
   - 点击**保存**以将其存储为 `.vscode/workflows/` 中的 JSON
   - 点击**导出**以生成可立即用于 Claude Code 的 `.claude` 文件

## 工作原理

### 提示节点
使用以下功能定义可重用的提示模板：
- 使用 `{{variableName}}` 语法的模板变量
- 运行时动态值替换
- 变量检测和验证

### 子代理节点
配置具有以下功能的自主 AI 代理：
- 自定义系统提示
- 工具权限（读取、写入、Bash 等）
- 模型选择（Sonnet 用于平衡、Opus 用于复杂任务、Haiku 用于速度）

### 技能节点
将 Claude Code 技能集成到您的工作流中：
- **个人技能**：从 `~/.claude/skills/` 引用技能供个人使用
- **项目技能**：使用 `.claude/skills/` 中的团队共享技能进行一致的协作
- **创建新技能**：使用引导表单直接从可视化编辑器构建技能
- **浏览和选择**：交互式技能浏览器显示可用技能及其描述和范围指示器
- **自动依赖跟踪**：导出的工作流包含所有引用技能的文档

技能是在 `SKILL.md` 文件中定义的专门代理功能，带有 YAML 前置内容。当工作流引用技能时，Claude Code 会根据技能的描述触发器自动调用它。

**创建新技能：**
1. 在工作流中选择技能节点
2. 在属性面板中点击"创建新技能"
3. 填写技能详细信息：
   - **名称**：小写，允许连字符（例如 `pdf-analyzer`）
   - **描述**：简要总结技能的作用和使用时机
   - **说明**：Markdown 格式的完整提示/说明
   - **允许的工具**：可选工具限制（读取、Grep、Bash 等）
   - **范围**：选择个人（仅您的机器）或项目（与团队共享）
4. 技能会自动创建并由节点引用

### MCP 工具节点
将模型上下文协议（MCP）工具集成到您的工作流中：
- **MCP 服务器发现**：浏览 Claude Code 中配置的可用 MCP 服务器
- **工具选择**：从任何连接的服务器搜索和过滤 MCP 工具
- **参数配置**：基于工具模式的动态表单生成（字符串、数字、布尔值、数组、对象类型）
- **实时验证**：自动参数验证并显示错误消息
- **导出集成**：导出的工作流包含完整的 MCP 工具文档，包括服务器、工具名称和配置的参数

MCP（模型上下文协议）是 Claude Code 的可扩展性系统，允许与外部工具和服务集成。MCP 工具可以访问数据库、API、文件系统等 - 扩展 Claude 超越内置工具的功能。

**添加 MCP 工具：**
1. 从调色板向工作流添加 MCP 节点
2. 从下拉列表中选择 MCP 服务器（在 Claude Code 中配置）
3. 浏览可用工具或使用搜索按名称过滤
4. 选择工具 - 节点将显示其描述
5. 在属性面板中配置参数：
   - 必需参数标有星号
   - 每个参数显示其类型（字符串、数字、布尔值等）
   - 验证错误实时显示
6. 保存您的工作流 - MCP 工具配置已保留

**前置条件：**
- 必须安装 Claude Code CLI 并配置 MCP 服务器
- 必须在 Claude Code 设置中正确配置 MCP 服务器（用户/项目/企业范围）

**网络连接：**
- **本地 MCP 服务器**（例如文件系统工具）：不需要外部网络
- **远程 MCP 服务器**（例如云 API）：需要外部网络连接
- 扩展本身不对外通信 - 网络使用完全取决于您配置的 MCP 服务器

### 条件分支节点
使用专门的节点实现条件逻辑：

#### IfElse 节点
用于二元条件的固定 2 路分支：
- True/False、Yes/No、Success/Error 模式
- 简化常见条件场景的配置
- 分支之间的清晰视觉区分（绿色/红色指示器）

#### Switch 节点
可变多路分支（2-N 个分支）：
- 从单个决策点开始的多个条件路径
- 动态分支管理（添加/删除案例）
- 适用于复杂的路由逻辑

#### 分支节点（旧版 - 已弃用）
具有双模式的原始分支节点已弃用：
- 仍可用于向后兼容
- 在调色板中标有弃用警告
- **推荐**：为新工作流使用 IfElse 或 Switch 节点

### AskUserQuestion 节点
创建决策点，其中：
- 用户从 2-4 个选项中选择（或多选）
- 每个选项分支到不同的节点
- AI 可以根据上下文动态生成选项

### 导出格式
生成即用文件：
- `.claude/agents/*.md` - 子代理定义
- `.claude/commands/*.md` - 用于执行工作流的 SlashCommand

**国际化**：可视化编辑器 UI 和所有导出的文件会自动适应您的 VSCode 显示语言设置（`vscode.env.language`）。支持的语言：英语（默认）、日语、韩语、简体中文（zh-CN）和繁体中文（zh-TW/zh-HK）。这确保了编辑体验和生成的工作流对于国际团队来说都是可访问的，无论他们身在何处。

## 使用示例

### 示例 1：数据分析管道
1. **收集数据**子代理 → 从文件收集数据
2. **询问用户**："选择分析类型" → 统计/可视化
3. **统计分析**子代理或**数据可视化**子代理
4. **生成报告**子代理 → 创建最终输出

### 示例 2：代码审查工作流
1. **代码扫描器**子代理 → 识别问题
2. **询问用户**："优先级级别？" → 仅关键/所有问题
3. **过滤结果**子代理
4. **生成修复建议**子代理

### 示例 3：使用技能的文档处理
1. **上传文档**提示 → 询问用户文件路径
2. **PDF 提取器**技能（个人） → 从 PDF 文件中提取文本
3. **询问用户**："处理类型？" → 总结/翻译/分析
4. **文档处理器**技能（项目） → 团队共享的处理逻辑
5. **格式化结果**子代理 → 创建最终输出

### 示例 4：使用 MCP 工具的 Web 自动化
1. **输入 URL**提示 → 询问用户目标网站
2. **Playwright 导航** MCP 工具 → 打开浏览器并导航到 URL（使用 playwright-mcp 服务器）
3. **询问用户**："操作类型？" → 截图/提取文本/点击元素
4. **Playwright 操作** MCP 工具 → 执行所选的浏览器操作
5. **处理结果**子代理 → 分析和格式化输出

## 常见问题

**问：什么是 Claude Code？**
答：Claude Code 是 Anthropic 的官方 CLI 工具，用于构建 AI 驱动的工作流。此扩展使创建和管理这些工作流的可视化变得更加容易。

**问：我需要编程经验吗？**
答：不需要！可视化编辑器专为任何人设计。只需通过 UI 拖放和配置节点即可。

**问：我可以手动编辑导出的文件吗？**
答：可以！导出的 `.claude` 文件是带有前置内容的纯 Markdown。如果需要，可以直接编辑它们。

**问：如果工作流文件已存在会怎样？**
答：扩展将检测冲突并在覆盖任何文件之前请求确认。

**问：我可以添加多少个节点？**
答：每个工作流最多 50 个节点。大多数工作流使用 3-10 个节点。

**问：支持哪些语言？**
答：可视化编辑器 UI 和导出的工作流都会自动使用您的 VSCode 显示语言设置。目前支持：英语（默认）、日语、韩语、简体中文（zh-CN）和繁体中文（zh-TW/zh-HK）。扩展检测 `vscode.env.language` 并以适当的语言显示所有 UI 元素并生成文档。这包括工具栏按钮、节点调色板、属性面板标签和所有导出的文件。

**问：什么是技能节点？**
答：技能节点允许您将 Claude Code 技能（专门的代理功能）集成到您的工作流中。技能在 `SKILL.md` 文件中定义，带有 YAML 前置内容，可以由 Claude 根据其描述触发器自动调用。

**问：个人技能和项目技能有什么区别？**
答：个人技能存储在 `~/.claude/skills/` 中，特定于您的机器。项目技能存储在项目目录中的 `.claude/skills/` 中，可以通过版本控制与您的团队共享。对个人工作流使用个人技能，对团队协作使用项目技能。

**问：我可以手动创建技能而不是使用可视化编辑器吗？**
答：可以！您可以在适当的目录（`~/.claude/skills/[skill-name]/` 或 `.claude/skills/[skill-name]/`）中手动创建 `SKILL.md` 文件。技能浏览器将自动检测它们。可视化编辑器的"创建新技能"功能只是为了方便。

**问：如果引用的技能文件丢失会怎样？**
答：可视化编辑器将在加载工作流时检测到丢失的技能文件，并在技能节点上显示警告指示器。然后，您可以重新选择有效的技能或删除损坏的引用。

**问：什么是 MCP 工具节点？**
答：MCP（模型上下文协议）工具节点允许您将外部工具和服务集成到您的工作流中。MCP 是 Claude Code 的可扩展性系统，可以连接到数据库、API、Web 浏览器（通过 Playwright）、文件系统等。可视化编辑器会自动发现在 Claude Code 中配置的可用 MCP 服务器和工具。

**问：如何设置 MCP 服务器？**
答：MCP 服务器在 Claude Code 设置中配置，而不是在此扩展中。您需要首先通过 Claude Code CLI 安装和配置 MCP 服务器。配置后，它们将自动显示在 MCP 节点的服务器下拉列表中。有关 MCP 服务器设置说明，请参阅 Claude Code 文档。

**问：如果 MCP 服务器未运行会怎样？**
答：可视化编辑器将在加载工具列表时检测到不可用的 MCP 服务器，并在 MCP 节点上显示验证警告。工作流仍可以保存和导出，但如果服务器在运行时不可用，执行将失败。在执行导出的工作流之前，请确保所有必需的 MCP 服务器都在运行。

## 故障排除

**工作流无法保存**
- 确保工作流名称仅包含字母、数字、连字符和下划线
- 检查所有必填字段是否已填写
- 在 VSCode 通知中查找错误消息

**导出失败**
- 验证所有节点是否具有有效配置
- 确保节点名称是唯一的
- 检查 `.claude` 目录的写入权限

**无法加载工作流**
- 点击刷新按钮（↻）以更新列表
- 验证文件是否存在于 `.vscode/workflows/` 中
- 检查 JSON 文件是否未损坏

## 许可证

本项目根据 **GNU Affero 通用公共许可证 v3.0**（AGPL-3.0-or-later）授权。

有关完整许可证文本，请参阅 [LICENSE](./LICENSE) 文件。

### 这意味着什么

- 您可以使用、修改和分发此软件
- 如果您修改和部署此软件（包括作为网络服务），您必须：
  - 根据 AGPL-3.0 提供修改后的源代码
  - 为与服务交互的用户提供对源代码的访问
- 允许商业使用，但不允许专有修改

版权所有 (c) 2025 breaking-brake

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=breaking-brake/cc-wf-studio&type=Date)](https://star-history.com/#breaking-brake/cc-wf-studio&Date)

## 致谢

使用 [React Flow](https://reactflow.dev/) 构建 • 由 [Claude Code](https://claude.com/claude-code) 驱动 • 受 [Dify](https://dify.ai/) 启发

---

**使用 Claude Code Workflow Studio 制作**
