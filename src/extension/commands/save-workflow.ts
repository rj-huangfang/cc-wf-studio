/**
 * Claude Code Workflow Studio - 保存工作流命令
 *
 * 处理将工作流定义保存到 .vscode/workflows/
 * 基于: /specs/001-cc-wf-studio/contracts/extension-webview-api.md
 */

import type { Webview } from 'vscode';
import * as vscode from 'vscode';
import type { SaveSuccessPayload } from '../../shared/types/messages';
import type { Workflow } from '../../shared/types/workflow-definition';
import type { FileService } from '../services/file-service';

/**
 * 将工作流保存到文件
 *
 * @param fileService - 文件服务实例
 * @param webview - 用于发送响应的 Webview
 * @param workflow - 要保存的工作流
 * @param requestId - 用于响应匹配的请求 ID
 */
export async function saveWorkflow(
  fileService: FileService,
  webview: Webview,
  workflow: Workflow,
  requestId?: string
): Promise<void> {
  try {
    // 确保工作流目录存在
    await fileService.ensureWorkflowsDirectory();

    // 验证工作流（基本检查）
    validateWorkflow(workflow);

    // 获取文件路径
    const filePath = fileService.getWorkflowFilePath(workflow.name);

    // 检查文件是否已存在
    if (await fileService.fileExists(filePath)) {
      // 显示警告对话框以确认覆盖
      const answer = await vscode.window.showWarningMessage(
        `Workflow "${workflow.name}" already exists.\n\nDo you want to overwrite it?`,
        { modal: true },
        'Overwrite'
      );

      if (answer !== 'Overwrite') {
        // 用户取消 - 发送取消消息（不是错误）
        webview.postMessage({
          type: 'SAVE_CANCELLED',
          requestId,
        });
        return;
      }
    }

    // 将工作流序列化为 JSON，使用 2 空格缩进
    const content = JSON.stringify(workflow, null, 2);

    // 写入文件
    await fileService.writeFile(filePath, content);

    // 将成功消息发送回 webview
    const payload: SaveSuccessPayload = {
      filePath,
      timestamp: new Date().toISOString(),
    };

    webview.postMessage({
      type: 'SAVE_SUCCESS',
      requestId,
      payload,
    });

    // 显示成功通知
    vscode.window.showInformationMessage(`Workflow "${workflow.name}" saved successfully!`);

    console.log(`Workflow saved: ${workflow.name}`);
  } catch (error) {
    // 将错误消息发送回 webview
    webview.postMessage({
      type: 'ERROR',
      requestId,
      payload: {
        code: 'SAVE_FAILED',
        message: error instanceof Error ? error.message : 'Failed to save workflow',
        details: error,
      },
    });

    // 显示错误通知
    vscode.window.showErrorMessage(
      `Failed to save workflow: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * 保存前验证工作流
 *
 * @param workflow - 要验证的工作流
 * @throws 如果验证失败则抛出错误
 */
function validateWorkflow(workflow: Workflow): void {
  // 检查必需字段
  if (!workflow.id) {
    throw new Error('Workflow ID is required');
  }

  if (!workflow.name) {
    throw new Error('Workflow name is required');
  }

  // 验证名称格式（仅小写字母、数字、连字符、下划线）
  const namePattern = /^[a-z0-9_-]+$/;
  if (!namePattern.test(workflow.name)) {
    throw new Error(
      'Workflow name must contain only lowercase letters, numbers, hyphens, and underscores'
    );
  }

  // 检查名称长度（1-100 个字符）
  if (workflow.name.length < 1 || workflow.name.length > 100) {
    throw new Error('Workflow name must be between 1 and 100 characters');
  }

  // 验证版本格式（语义化版本）
  const versionPattern = /^\d+\.\d+\.\d+$/;
  if (!workflow.version || !versionPattern.test(workflow.version)) {
    throw new Error('Workflow version must follow semantic versioning (e.g., 1.0.0)');
  }

  // 检查最大节点数（50）
  if (workflow.nodes.length > 50) {
    throw new Error('Workflow cannot have more than 50 nodes');
  }
}
