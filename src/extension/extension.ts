/**
 * Claude Code Workflow Studio - 扩展入口点
 *
 * VSCode 扩展的主要激活和停用逻辑。
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { registerOpenEditorCommand } from './commands/open-editor';
import { handleConnectSlackManual } from './commands/slack-connect-manual';
import { WorkflowPreviewEditorProvider } from './editors/workflow-preview-editor-provider';
import { SlackApiService } from './services/slack-api-service';
import { SlackTokenManager } from './utils/slack-token-manager';

/**
 * 用于日志记录的全局输出通道
 */
let outputChannel: vscode.OutputChannel | null = null;

/**
 * 获取全局输出通道实例
 */
export function getOutputChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    throw new Error('Output channel not initialized. Call activate() first.');
  }
  return outputChannel;
}

/**
 * 将消息记录到输出通道
 *
 * @param level - 日志级别 (INFO, WARN, ERROR)
 * @param message - 要记录的消息
 * @param data - 可选的额外数据
 */
export function log(level: 'INFO' | 'WARN' | 'ERROR', message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  if (outputChannel) {
    outputChannel.appendLine(logMessage);
    if (data) {
      outputChannel.appendLine(`  Data: ${JSON.stringify(data, null, 2)}`);
    }
  }

  // 同时输出到控制台用于调试
  console.log(logMessage, data ?? '');
}

/**
 * 从 globalStorageUri 清理遗留的 BM25 索引数据
 *
 * 此函数删除 BM25 搜索功能启用时存储的旧代码库索引数据。
 * 该功能已被移除，此清理确保用户设备上不会残留孤立数据。
 *
 * @param context - 包含 globalStorageUri 的扩展上下文
 */
async function cleanupLegacyBM25Index(context: vscode.ExtensionContext): Promise<void> {
  try {
    if (!context.globalStorageUri) {
      log('WARN', 'BM25 Cleanup: globalStorageUri not available, skipping cleanup');
      return;
    }

    const indexesDir = path.join(context.globalStorageUri.fsPath, 'indexes');

    // 检查索引目录是否存在
    try {
      await fs.access(indexesDir);
    } catch {
      // 目录不存在，无需清理
      log('INFO', 'BM25 Cleanup: No legacy index data found');
      return;
    }

    // 目录存在，删除它
    log('INFO', 'BM25 Cleanup: Removing legacy index directory', { path: indexesDir });
    await fs.rm(indexesDir, { recursive: true, force: true });
    log('INFO', 'BM25 Cleanup: Successfully removed legacy index data');
  } catch (error) {
    // 记录错误但不阻止扩展激活
    log('ERROR', 'BM25 Cleanup: Failed to remove legacy index data', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * 扩展激活函数
 * 在扩展激活时调用（首次调用命令时）
 */
export function activate(context: vscode.ExtensionContext): void {
  // 创建输出通道
  outputChannel = vscode.window.createOutputChannel('Claude Code Workflow Studio');
  context.subscriptions.push(outputChannel);

  log('INFO', 'Claude Code Workflow Studio is now active');

  // 清理遗留的 BM25 索引数据（触发后不等待）
  cleanupLegacyBM25Index(context).catch((error) => {
    log('ERROR', 'BM25 Cleanup: Unexpected error during cleanup', { error });
  });

  // 注册命令
  registerOpenEditorCommand(context);

  // 注册工作流预览的自定义编辑器提供程序
  context.subscriptions.push(WorkflowPreviewEditorProvider.register(context));

  // 注册 Slack 导入命令 (T031)
  context.subscriptions.push(
    vscode.commands.registerCommand('claudeCodeWorkflowStudio.slack.importWorkflow', async () => {
      log('INFO', 'Slack: Import Workflow command invoked');

      // 显示输入框以获取 Slack 文件 URL 或 ID
      const input = await vscode.window.showInputBox({
        prompt: 'Enter Slack file URL or file ID',
        placeHolder: 'https://files.slack.com/... or F0123456789',
      });

      if (!input) {
        log('INFO', 'User cancelled Slack import');
        return;
      }

      log('INFO', 'Slack import input received', { input });

      // TODO: 解析 URL 并提取文件 ID，然后触发导入
      // 目前显示错误消息
      vscode.window.showErrorMessage(
        'Slack import via command is not fully implemented yet. Use the "Import to VS Code" button in Slack messages.'
      );
    })
  );

  // 注册 Slack 手动令牌连接命令 (T103)
  context.subscriptions.push(
    vscode.commands.registerCommand('claudeCodeWorkflowStudio.slack.connectManual', async () => {
      log('INFO', 'Slack: Connect Workspace (Manual Token) command invoked');

      const tokenManager = new SlackTokenManager(context);
      const slackApiService = new SlackApiService(tokenManager);

      await handleConnectSlackManual(tokenManager, slackApiService);
    })
  );

  // 注册 URI 处理器用于深度链接 (vscode://cc-wf-studio/import?...)
  context.subscriptions.push(
    vscode.window.registerUriHandler({
      handleUri(uri: vscode.Uri): void {
        log('INFO', 'URI handler invoked', { uri: uri.toString() });

        // 解析 URI 路径和查询参数
        const path = uri.path;
        const query = new URLSearchParams(uri.query);

        if (path === '/import') {
          // 提取导入参数
          const fileId = query.get('fileId');
          const channelId = query.get('channelId');
          const messageTs = query.get('messageTs');
          const workspaceId = query.get('workspaceId');
          const workflowId = query.get('workflowId');
          const workspaceNameBase64 = query.get('workspaceName');

          // 如果存在，从 Base64 解码工作区名称
          let workspaceName: string | undefined;
          if (workspaceNameBase64) {
            try {
              workspaceName = Buffer.from(workspaceNameBase64, 'base64').toString('utf-8');
            } catch (_e) {
              log('WARN', 'Failed to decode workspace name from Base64', { workspaceNameBase64 });
            }
          }

          if (!fileId || !channelId || !messageTs || !workspaceId || !workflowId) {
            log('ERROR', 'Missing required import parameters', {
              fileId,
              channelId,
              messageTs,
              workspaceId,
              workflowId,
            });
            vscode.window.showErrorMessage('Invalid import URL: Missing required parameters');
            return;
          }

          log('INFO', 'Importing workflow from Slack via deep link', {
            fileId,
            channelId,
            messageTs,
            workspaceId,
            workflowId,
            workspaceName,
          });

          // 使用导入参数打开编辑器
          vscode.commands
            .executeCommand('cc-wf-studio.openEditor', {
              fileId,
              channelId,
              messageTs,
              workspaceId,
              workflowId,
              workspaceName,
            })
            .then(() => {
              log('INFO', 'Editor opened with import parameters', { workflowId });
            });
        } else {
          log('WARN', 'Unknown URI path', { path });
          vscode.window.showErrorMessage(`Unknown deep link path: ${path}`);
        }
      },
    })
  );

  log('INFO', 'Claude Code Workflow Studio: All commands and handlers registered');
}

/**
 * 扩展停用函数
 * 在扩展停用时调用
 */
export function deactivate(): void {
  log('INFO', 'Claude Code Workflow Studio is now deactivated');
  outputChannel?.dispose();
  outputChannel = null;
}
