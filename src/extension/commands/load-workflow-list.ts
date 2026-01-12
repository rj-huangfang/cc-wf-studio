/**
 * Claude Code Workflow Studio - 加载工作流列表命令
 *
 * 从 .vscode/workflows/ 目录加载可用工作流列表
 */

import type { Webview } from 'vscode';
import * as vscode from 'vscode';
import type { WorkflowListPayload } from '../../shared/types/messages';
import type { FileService } from '../services/file-service';

/**
 * 加载工作流列表并发送到 webview
 *
 * @param fileService - 文件服务实例
 * @param webview - 用于发送响应的 Webview
 * @param requestId - 用于响应匹配的请求 ID
 */
export async function loadWorkflowList(
  fileService: FileService,
  webview: Webview,
  requestId?: string
): Promise<void> {
  try {
    // 确保工作流目录存在
    await fileService.ensureWorkflowsDirectory();

    // 读取所有工作流文件
    const workflowsPath = fileService.getWorkflowsDirectory();
    const uri = vscode.Uri.file(workflowsPath);

    let files: [string, vscode.FileType][] = [];
    try {
      files = await vscode.workspace.fs.readDirectory(uri);
    } catch (error) {
      // 目录不存在或为空
      console.log('No workflows directory or empty:', error);
      files = [];
    }

    // 过滤 JSON 文件并加载元数据
    const workflows = [];
    for (const [filename, fileType] of files) {
      if (fileType === vscode.FileType.File && filename.endsWith('.json')) {
        try {
          const filePath = fileService.getWorkflowFilePath(filename.replace('.json', ''));
          const content = await fileService.readFile(filePath);
          const workflow = JSON.parse(content);

          workflows.push({
            id: filename.replace('.json', ''), // 始终使用文件名作为 ID
            name: workflow.name || filename.replace('.json', ''),
            description: workflow.description,
            updatedAt: workflow.updatedAt || new Date().toISOString(),
          });
        } catch (error) {
          console.error(`Failed to parse workflow file ${filename}:`, error);
        }
      }
    }

    // 发送成功响应
    const payload: WorkflowListPayload = { workflows };
    webview.postMessage({
      type: 'WORKFLOW_LIST_LOADED',
      requestId,
      payload,
    });
  } catch (error) {
    // 发送错误响应
    webview.postMessage({
      type: 'ERROR',
      requestId,
      payload: {
        code: 'LOAD_FAILED',
        message: error instanceof Error ? error.message : 'Failed to load workflow list',
        details: error,
      },
    });
  }
}
