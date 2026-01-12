/**
 * Claude Code Workflow Studio - 加载工作流命令
 *
 * 加载特定的工作流文件并发送到 Webview
 */

import type { Webview } from 'vscode';
import type { LoadWorkflowPayload } from '../../shared/types/messages';
import type { FileService } from '../services/file-service';
import { migrateWorkflow } from '../utils/migrate-workflow';

/**
 * 加载特定工作流并发送到 webview
 *
 * @param fileService - 文件服务实例
 * @param webview - 用于发送响应的 Webview
 * @param workflowId - 工作流 ID（不带 .json 扩展名的文件名）
 * @param requestId - 用于响应匹配的请求 ID
 */
export async function loadWorkflow(
  fileService: FileService,
  webview: Webview,
  workflowId: string,
  requestId?: string
): Promise<void> {
  try {
    // 获取工作流文件路径
    const filePath = fileService.getWorkflowFilePath(workflowId);

    // 检查文件是否存在
    const exists = await fileService.fileExists(filePath);
    if (!exists) {
      webview.postMessage({
        type: 'ERROR',
        requestId,
        payload: {
          code: 'LOAD_FAILED',
          message: `Workflow "${workflowId}" not found`,
        },
      });
      return;
    }

    // 读取并解析工作流文件
    const content = await fileService.readFile(filePath);
    const parsedWorkflow = JSON.parse(content);

    // 应用迁移以实现向后兼容
    const workflow = migrateWorkflow(parsedWorkflow);

    // 发送成功响应
    const payload: LoadWorkflowPayload = { workflow };
    webview.postMessage({
      type: 'LOAD_WORKFLOW',
      requestId,
      payload,
    });

    console.log(`Workflow loaded: ${workflowId}`);
  } catch (error) {
    // 发送错误响应
    webview.postMessage({
      type: 'ERROR',
      requestId,
      payload: {
        code: 'LOAD_FAILED',
        message: error instanceof Error ? error.message : 'Failed to load workflow',
        details: error,
      },
    });
  }
}
