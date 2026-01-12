/**
 * Claude Code Workflow Studio - 改进状态存储
 *
 * 用于管理 AI 辅助工作流改进聊天状态的 Zustand 存储
 * 基于: /specs/001-ai-workflow-refinement/quickstart.md Section 3.1
 */

import type { ClaudeModel } from '@shared/types/messages';
import type { ConversationHistory, ConversationMessage } from '@shared/types/workflow-definition';
import { create } from 'zustand';

// localStorage 键
const MODEL_STORAGE_KEY = 'cc-wf-studio.refinement.selectedModel';
const ALLOWED_TOOLS_STORAGE_KEY = 'cc-wf-studio.refinement.allowedTools';

// Claude Code CLI 可用工具（用于 AI 编辑允许的工具）
export const AVAILABLE_TOOLS = [
  'AskUserQuestion',
  'Bash',
  'BashOutput',
  'Edit',
  'ExitPlanMode',
  'Glob',
  'Grep',
  'KillShell',
  'MCPSearch',
  'NotebookEdit',
  'Read',
  'Skill',
  'SlashCommand',
  'Task',
  'TodoWrite',
  'WebFetch',
  'WebSearch',
  'Write',
] as const;

// 官方 Claude Code 工具用于钩子匹配器（PreToolUse, PostToolUse）
// 基于: https://code.claude.com/docs/en/hooks
export const HOOKS_MATCHER_TOOLS = [
  'Bash',
  'BashOutput',
  'Edit',
  'ExitPlanMode',
  'Glob',
  'Grep',
  'KillShell',
  'NotebookEdit',
  'Read',
  'SlashCommand',
  'Task',
  'TodoWrite',
  'WebFetch',
  'WebSearch',
  'Write',
] as const;

// 默认允许的工具（只读工具以确保安全）
export const DEFAULT_ALLOWED_TOOLS: string[] = [
  'Read',
  'Grep',
  'Glob',
  'WebSearch',
  'WebFetch',
  'TodoWrite',
];

/**
 * 从 localStorage 加载选定的模型
 * 如果没有存储值或值无效，则返回 'haiku' 作为默认值
 */
function loadModelFromStorage(): ClaudeModel {
  try {
    const saved = localStorage.getItem(MODEL_STORAGE_KEY);
    if (saved === 'sonnet' || saved === 'opus' || saved === 'haiku') {
      return saved;
    }
  } catch {
    // localStorage 可能在某些上下文中不可用
  }
  return 'haiku'; // 默认
}

/**
 * 将选定的模型保存到 localStorage
 */
function saveModelToStorage(model: ClaudeModel): void {
  try {
    localStorage.setItem(MODEL_STORAGE_KEY, model);
  } catch {
    // localStorage 可能在某些上下文中不可用
  }
}

/**
 * 从 localStorage 加载允许的工具
 * 如果没有存储值或值无效，则返回 DEFAULT_ALLOWED_TOOLS
 */
function loadAllowedToolsFromStorage(): string[] {
  try {
    const saved = localStorage.getItem(ALLOWED_TOOLS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.every((t) => typeof t === 'string')) {
        return parsed;
      }
    }
  } catch {
    // localStorage 可能不可用或 JSON 解析失败
  }
  return DEFAULT_ALLOWED_TOOLS;
}

/**
 * 将允许的工具保存到 localStorage
 */
function saveAllowedToolsToStorage(tools: string[]): void {
  try {
    localStorage.setItem(ALLOWED_TOOLS_STORAGE_KEY, JSON.stringify(tools));
  } catch {
    // localStorage 可能在某些上下文中不可用
  }
}

// ============================================================================
// 会话状态类型
// ============================================================================

/**
 * UI 中显示的会话状态
 * - 'none': 无会话（新对话，无先前上下文）
 * - 'connected': sessionId 存在且有效（会话继续）
 * - 'reconnected': 发生会话回退（先前会话已过期）
 */
export type SessionStatus = 'none' | 'connected' | 'reconnected';

// ============================================================================
// 存储状态接口
// ============================================================================

interface RefinementStore {
  // 状态
  isOpen: boolean;
  conversationHistory: ConversationHistory | null;
  isProcessing: boolean;
  currentInput: string;
  currentRequestId: string | null;
  useSkills: boolean;
  timeoutSeconds: number;
  selectedModel: ClaudeModel;
  allowedTools: string[];

  // 会话状态
  sessionStatus: SessionStatus;

  // SubAgentFlow 改进状态
  targetType: 'workflow' | 'subAgentFlow';
  targetSubAgentFlowId: string | null;

  // 操作
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  toggleUseSkills: () => void;
  setTimeoutSeconds: (seconds: number) => void;
  setSelectedModel: (model: ClaudeModel) => void;
  setAllowedTools: (tools: string[]) => void;
  toggleAllowedTool: (toolName: string) => void;
  resetAllowedTools: () => void;
  initConversation: () => void;
  loadConversationHistory: (history: ConversationHistory | undefined) => void;
  setTargetContext: (
    targetType: 'workflow' | 'subAgentFlow',
    subAgentFlowId?: string | null
  ) => void;
  setInput: (input: string) => void;
  addUserMessage: (message: string) => void;
  startProcessing: (requestId: string) => void;
  handleRefinementSuccess: (
    aiMessage: ConversationMessage,
    updatedHistory: ConversationHistory
  ) => void;
  handleRefinementFailed: () => void;
  /**
   * 完成处理而不替换对话历史记录。
   * 当前端已经管理了消息时使用此方法（例如，带有解释文本的流式传输）。
   * 可选地接受 sessionId 以持久化会话继续。
   * @param sessionId - 来自 CLI 的新会话 ID
   * @param sessionReconnected - 是否发生了会话回退
   */
  finishProcessing: (sessionId?: string, sessionReconnected?: boolean) => void;
  clearHistory: () => void;

  // 会话状态操作
  /**
   * 将会话状态设置为 'reconnected'（在发生会话回退时调用）
   */
  setSessionReconnected: () => void;
  /**
   * 清除会话状态（在清除历史记录时调用）
   */
  clearSessionStatus: () => void;

  // Phase 3.7: Message operations for loading state
  addLoadingAiMessage: (messageId: string) => void;
  updateMessageLoadingState: (messageId: string, isLoading: boolean) => void;
  updateMessageContent: (messageId: string, content: string) => void;

  // Phase 3.8: Error state operations
  updateMessageErrorState: (
    messageId: string,
    isError: boolean,
    errorCode?:
      | 'COMMAND_NOT_FOUND'
      | 'TIMEOUT'
      | 'PARSE_ERROR'
      | 'VALIDATION_ERROR'
      | 'PROHIBITED_NODE_TYPE'
      | 'UNKNOWN_ERROR'
  ) => void;

  // Phase 3.11: Message removal operation
  removeMessage: (messageId: string) => void;

  // Tool Execution Actions (Tool Loading Animation)
  updateMessageToolInfo: (messageId: string, toolInfo: string | null) => void;

  // Computed
  canSend: () => boolean;
  shouldShowWarning: () => boolean;

  // ============================================================================
  // DEBUG: Temporary sessionId editor for testing session reconnection
  // TODO: Remove this before merging to main
  // ============================================================================
  debugSetSessionId: (sessionId: string | undefined) => void;
}

// ============================================================================
// Store Implementation
// ============================================================================

/**
 * Zustand store for refinement chat state management
 */
export const useRefinementStore = create<RefinementStore>((set, get) => ({
  // Initial State
  isOpen: false,
  conversationHistory: null,
  isProcessing: false,
  currentInput: '',
  currentRequestId: null,
  useSkills: true,
  timeoutSeconds: 0, // Default timeout: None (0 = use system guard)
  selectedModel: loadModelFromStorage(), // Load from localStorage, default: 'haiku'
  allowedTools: loadAllowedToolsFromStorage(), // Load from localStorage, default: DEFAULT_ALLOWED_TOOLS

  // Session Status Initial State
  sessionStatus: 'none',

  // SubAgentFlow Refinement Initial State
  targetType: 'workflow',
  targetSubAgentFlowId: null,

  // Actions
  openChat: () => {
    set({ isOpen: true });
  },

  closeChat: () => {
    set({ isOpen: false });
  },

  toggleChat: () => {
    set({ isOpen: !get().isOpen });
  },

  toggleUseSkills: () => {
    set({ useSkills: !get().useSkills });
  },

  setTimeoutSeconds: (seconds: number) => {
    set({ timeoutSeconds: seconds });
  },

  setSelectedModel: (model: ClaudeModel) => {
    set({ selectedModel: model });
    saveModelToStorage(model);
  },

  setAllowedTools: (tools: string[]) => {
    set({ allowedTools: tools });
    saveAllowedToolsToStorage(tools);
  },

  toggleAllowedTool: (toolName: string) => {
    const currentTools = get().allowedTools;
    const newTools = currentTools.includes(toolName)
      ? currentTools.filter((t) => t !== toolName)
      : [...currentTools, toolName];
    set({ allowedTools: newTools });
    saveAllowedToolsToStorage(newTools);
  },

  resetAllowedTools: () => {
    set({ allowedTools: DEFAULT_ALLOWED_TOOLS });
    saveAllowedToolsToStorage(DEFAULT_ALLOWED_TOOLS);
  },

  initConversation: () => {
    const history: ConversationHistory = {
      schemaVersion: '1.0.0',
      messages: [],
      currentIteration: 0,
      maxIterations: 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({ conversationHistory: history });
  },

  loadConversationHistory: (history: ConversationHistory | undefined) => {
    if (history) {
      // Set sessionStatus based on whether sessionId exists
      const sessionStatus = history.sessionId ? 'connected' : 'none';
      set({ conversationHistory: history, sessionStatus });
    } else {
      // Initialize new conversation if no history exists
      get().initConversation();
      set({ sessionStatus: 'none' });
    }
  },

  setTargetContext: (targetType: 'workflow' | 'subAgentFlow', subAgentFlowId?: string | null) => {
    set({
      targetType,
      targetSubAgentFlowId: targetType === 'subAgentFlow' ? (subAgentFlowId ?? null) : null,
    });
  },

  setInput: (input: string) => {
    set({ currentInput: input });
  },

  addUserMessage: (message: string) => {
    const history = get().conversationHistory;
    if (!history) {
      return;
    }

    const userMessage: ConversationMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    set({
      conversationHistory: {
        ...history,
        messages: [...history.messages, userMessage],
        updatedAt: new Date().toISOString(),
      },
      currentInput: '',
    });
  },

  startProcessing: (requestId: string) => {
    set({ isProcessing: true, currentRequestId: requestId });
  },

  handleRefinementSuccess: (
    _aiMessage: ConversationMessage,
    updatedHistory: ConversationHistory
  ) => {
    set({
      conversationHistory: updatedHistory,
      isProcessing: false,
      currentRequestId: null,
    });
  },

  handleRefinementFailed: () => {
    set({ isProcessing: false, currentRequestId: null });
  },

  finishProcessing: (sessionId?: string, sessionReconnected?: boolean) => {
    const history = get().conversationHistory;
    if (sessionId && history) {
      // Determine session status
      // If sessionReconnected is true, set to 'reconnected', otherwise 'connected'
      const newSessionStatus = sessionReconnected ? 'reconnected' : 'connected';

      // Update sessionId in conversationHistory for session continuation
      set({
        conversationHistory: {
          ...history,
          sessionId,
          updatedAt: new Date().toISOString(),
        },
        isProcessing: false,
        currentRequestId: null,
        sessionStatus: newSessionStatus,
      });
    } else {
      set({ isProcessing: false, currentRequestId: null });
    }
  },

  clearHistory: () => {
    const history = get().conversationHistory;
    if (history) {
      set({
        conversationHistory: {
          ...history,
          messages: [],
          currentIteration: 0,
          updatedAt: new Date().toISOString(),
          sessionId: undefined, // Clear session for fresh start
        },
        sessionStatus: 'none', // Clear session status for fresh start
      });
    }
  },

  // Session Status Actions
  setSessionReconnected: () => {
    set({ sessionStatus: 'reconnected' });
  },

  clearSessionStatus: () => {
    set({ sessionStatus: 'none' });
  },

  // Phase 3.7: Message operations
  addLoadingAiMessage: (messageId: string) => {
    const history = get().conversationHistory;
    if (!history) {
      return;
    }

    const loadingMessage: ConversationMessage = {
      id: messageId,
      sender: 'ai',
      content: '', // Empty content during loading
      timestamp: new Date().toISOString(),
      isLoading: true,
    };

    set({
      conversationHistory: {
        ...history,
        messages: [...history.messages, loadingMessage],
        updatedAt: new Date().toISOString(),
      },
    });
  },

  updateMessageLoadingState: (messageId: string, isLoading: boolean) => {
    const history = get().conversationHistory;
    if (!history) {
      return;
    }

    const updatedMessages = history.messages.map((msg) =>
      msg.id === messageId ? { ...msg, isLoading } : msg
    );

    set({
      conversationHistory: {
        ...history,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  updateMessageContent: (messageId: string, content: string) => {
    const history = get().conversationHistory;
    if (!history) {
      return;
    }

    const updatedMessages = history.messages.map((msg) =>
      msg.id === messageId ? { ...msg, content } : msg
    );

    set({
      conversationHistory: {
        ...history,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  // Phase 3.8: Error state operations
  updateMessageErrorState: (
    messageId: string,
    isError: boolean,
    errorCode?:
      | 'COMMAND_NOT_FOUND'
      | 'TIMEOUT'
      | 'PARSE_ERROR'
      | 'VALIDATION_ERROR'
      | 'PROHIBITED_NODE_TYPE'
      | 'UNKNOWN_ERROR'
  ) => {
    const history = get().conversationHistory;
    if (!history) {
      return;
    }

    const updatedMessages = history.messages.map((msg) =>
      msg.id === messageId ? { ...msg, isError, errorCode, isLoading: false } : msg
    );

    set({
      conversationHistory: {
        ...history,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  // Phase 3.11: Message removal operation
  removeMessage: (messageId: string) => {
    const history = get().conversationHistory;
    if (!history) {
      return;
    }

    const updatedMessages = history.messages.filter((msg) => msg.id !== messageId);

    set({
      conversationHistory: {
        ...history,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  // Tool Execution Actions (Tool Loading Animation)
  updateMessageToolInfo: (messageId: string, toolInfo: string | null) => {
    const history = get().conversationHistory;
    if (!history) {
      return;
    }

    const updatedMessages = history.messages.map((msg) =>
      msg.id === messageId ? { ...msg, toolInfo } : msg
    );

    set({
      conversationHistory: {
        ...history,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  // Computed Methods
  canSend: () => {
    const { conversationHistory, isProcessing, currentInput } = get();

    // Cannot send if processing or no input
    if (isProcessing) {
      return false;
    }

    if (!currentInput.trim()) {
      return false;
    }

    // Cannot send if no conversation history initialized
    if (!conversationHistory) {
      return false;
    }

    // No hard limit - always allow sending if other conditions are met
    return true;
  },

  shouldShowWarning: () => {
    const { conversationHistory } = get();

    if (!conversationHistory) {
      return false;
    }

    // Show warning when 20 or more iterations have been completed
    return conversationHistory.currentIteration >= 20;
  },

  // ============================================================================
  // DEBUG: Temporary sessionId editor for testing session reconnection
  // TODO: Remove this before merging to main
  // ============================================================================
  debugSetSessionId: (sessionId: string | undefined) => {
    const history = get().conversationHistory;
    if (history) {
      console.log('[DEBUG] Setting sessionId:', { previous: history.sessionId, new: sessionId });
      set({
        conversationHistory: {
          ...history,
          sessionId: sessionId || undefined,
          updatedAt: new Date().toISOString(),
        },
        sessionStatus: sessionId ? 'connected' : 'none',
      });
    }
  },
}));
