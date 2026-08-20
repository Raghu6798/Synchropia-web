export interface ChatMessage {
  id: string;
  sender: "user" | "architect" | "pm" | "devops" | "qa" | "frontend_dev" | "backend_dev" | "system";
  message: string;
  created_at: string;
  run_id?: string;
  source_agent?: string;
  target_agent?: string;
}

export interface ChatSessionSummary {
  id: string;
  title: string;
  user_id: string;
  organization_id?: string;
  created_at: string;
  status?: string;
  current_agent?: string;
}

export interface ChatStreamRequest {
  prompt: string;
  provider: string;
  model: string;
  temperature?: number;
  max_tokens?: number;
  org: string;
  org_id?: string | null;
  dir_path?: string;
  thread_id?: string;
  resume?: boolean;
}

export interface ChatStreamEvent {
  event?: string;
  event_type?: string;
  run_id?: string;
  thread_id?: string;
  session_id?: string;
  content?: string;
  tokens?: string;
  message?: string;
  source_agent?: string;
  target_agent?: string;
  tool_name?: string;
  payload?: {
    prompt_message?: string;
    [key: string]: any;
  };
  error?: string;
}

export interface HandoffInterruptState {
  isActive: boolean;
  promptMessage: string;
  sourceAgent?: string;
  targetAgent?: string;
  runId?: string;
  sessionId?: string;
}

export const AGENT_ROLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  architect: {
    label: "Architect Agent",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
  },
  pm: {
    label: "PM Orchestrator",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
  backend_dev: {
    label: "Backend Specialist",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  frontend_dev: {
    label: "Frontend Specialist",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
  },
  devops: {
    label: "DevOps Agent",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  qa: {
    label: "QA & SonarQube",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
  },
  system: {
    label: "System",
    color: "text-zinc-400",
    bg: "bg-zinc-800/50",
    border: "border-zinc-700/50",
  },
};

/**
 * Parses SSE stream chunk lines formatted as `data: {...}`
 */
export async function streamChatEvents(
  reqBody: ChatStreamRequest,
  onEvent: (event: ChatStreamEvent) => void,
  onError: (err: any) => void,
  signal?: AbortSignal
): Promise<void> {
  try {
    const response = await fetch("/api/v1/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Chat stream failed with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response stream body available");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data:")) {
          const jsonStr = trimmed.slice(5).trim();
          if (jsonStr) {
            try {
              const parsed: ChatStreamEvent = JSON.parse(jsonStr);
              onEvent(parsed);
            } catch (err) {
              console.warn("Failed to parse SSE JSON chunk", jsonStr, err);
            }
          }
        }
      }
    }
  } catch (err) {
    if (signal?.aborted) return;
    onError(err);
  }
}
