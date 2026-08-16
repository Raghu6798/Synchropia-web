"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { authClient } from "@/lib/auth-client";
import {
  ChatMessage,
  ChatSessionSummary,
  ChatStreamEvent,
  ChatStreamRequest,
  HandoffInterruptState,
  streamChatEvents,
} from "@/lib/chat";
import { ChatSidebar } from "./ChatSidebar";
import { ConversationPane } from "./ConversationPane";

interface ChatWorkspaceProps {
  initialThreadId?: string;
}

export function ChatWorkspace({ initialThreadId }: ChatWorkspaceProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // Stable conversation thread id
  const [threadId, setThreadId] = useState<string>(initialThreadId || "");
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [activeAgent, setActiveAgent] = useState<string>("architect");
  const [handoffEvents, setHandoffEvents] = useState<
    { source: string; target: string; tool?: string; time: string }[]
  >([]);
  const [interrupt, setInterrupt] = useState<HandoffInterruptState | null>(null);
  const [isResuming, setIsResuming] = useState<boolean>(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState<boolean>(false);

  // Store initial configuration params for exact resumption parity
  const lastRequestParamsRef = useRef<ChatStreamRequest | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize or set threadId
  useEffect(() => {
    if (initialThreadId) {
      setThreadId(initialThreadId);
    } else {
      const newId = uuidv4();
      setThreadId(newId);
    }
  }, [initialThreadId]);

  // Fetch session history for sidebar
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/chat/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.warn("Failed to load sessions list", err);
    }
  }, []);

  // Fetch message history for existing threadId
  const fetchThreadHistory = useCallback(async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/v1/chat/sessions/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(
            data.messages.map((m: any) => ({
              id: m.id || uuidv4(),
              sender: m.sender || "user",
              message: m.message || "",
              created_at: m.created_at || new Date().toISOString(),
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Failed to load thread history", err);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (initialThreadId) {
      fetchThreadHistory(initialThreadId);
    }
  }, [initialThreadId, fetchThreadHistory]);

  const handleNewChat = () => {
    const newId = uuidv4();
    setThreadId(newId);
    setMessages([]);
    setStreamingContent("");
    setHandoffEvents([]);
    setInterrupt(null);
    router.push("/chat");
  };

  // Main stream runner
  const executeStream = async (reqBody: ChatStreamRequest) => {
    setIsStreaming(true);
    setStreamingContent("");
    setInterrupt(null);
    lastRequestParamsRef.current = reqBody;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulatedTokens = "";
    let currentAgent = "architect";

    await streamChatEvents(
      reqBody,
      (event: ChatStreamEvent) => {
        // Handle connected event
        if (event.event === "connected") {
          setActiveAgent("architect");
        }

        // Handle agent response tokens
        if (event.event_type === "agent_response" || event.tokens || event.content) {
          const delta = event.tokens || event.content || "";
          accumulatedTokens += delta;
          setStreamingContent(accumulatedTokens);
          if (event.source_agent) {
            currentAgent = event.source_agent;
            setActiveAgent(event.source_agent);
          }
        }

        // Handle tool calls / handoff transitions
        if (
          event.event_type === "handoff" ||
          event.event_type === "tool_call" ||
          (event.source_agent && event.target_agent)
        ) {
          setHandoffEvents((prev) => [
            ...prev,
            {
              source: event.source_agent || "architect",
              target: event.target_agent || "pm",
              tool: event.tool_name,
              time: new Date().toLocaleTimeString(),
            },
          ]);
          if (event.target_agent) {
            currentAgent = event.target_agent;
            setActiveAgent(event.target_agent);
          }
        }

        // Handle handoff interrupted checkpoint
        if (event.event_type === "handoff_interrupted") {
          setInterrupt({
            isActive: true,
            promptMessage:
              event.payload?.prompt_message ||
              "Please enter your query for the active agent:",
            sourceAgent: event.source_agent || "swarm",
            targetAgent: event.target_agent || currentAgent,
            runId: event.run_id,
            sessionId: event.session_id,
          });
        }

        // Handle error event
        if (event.event === "error" || event.error) {
          const errMsg = event.message || event.error || "An error occurred during swarm execution.";
          accumulatedTokens += `\n\n⚠️ **Error:** ${errMsg}`;
          setStreamingContent(accumulatedTokens);
        }
      },
      (err: any) => {
        console.error("Stream execution error:", err);
        setIsStreaming(false);
        setIsResuming(false);
      },
      controller.signal
    );

    // When stream completes cleanly
    setIsStreaming(false);
    setIsResuming(false);

    if (accumulatedTokens.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          sender: (currentAgent as any) || "architect",
          message: accumulatedTokens,
          created_at: new Date().toISOString(),
        },
      ]);
      setStreamingContent("");
    }

    // Refresh session sidebar list
    fetchSessions();
  };

  // Initial user prompt send
  const handleSendMessage = (promptText: string, provider: string, model: string) => {
    const userMsg: ChatMessage = {
      id: uuidv4(),
      sender: "user",
      message: promptText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    const activeThread = threadId || uuidv4();
    if (!threadId) {
      setThreadId(activeThread);
    }

    const org = session?.user?.name || "Synchropia Workspace";
    const orgId = (session?.user as any)?.organizationId || null;

    const requestPayload: ChatStreamRequest = {
      prompt: promptText,
      provider,
      model,
      temperature: 0.7,
      max_tokens: 2048,
      org,
      org_id: orgId,
      dir_path: "",
      thread_id: activeThread,
      resume: false,
    };

    executeStream(requestPayload);
  };

  // Resume handoff interrupted checkpoint
  const handleResumeInterrupt = async (userQuery: string) => {
    setIsResuming(true);
    const lastParams = lastRequestParamsRef.current;

    const resumePayload: ChatStreamRequest = {
      prompt: userQuery,
      provider: lastParams?.provider || "sambanova",
      model: lastParams?.model || "gpt-oss-120b",
      temperature: lastParams?.temperature ?? 0.7,
      max_tokens: lastParams?.max_tokens ?? 2048,
      org: lastParams?.org || session?.user?.name || "Synchropia Workspace",
      org_id: lastParams?.org_id || (session?.user as any)?.organizationId || null,
      dir_path: lastParams?.dir_path || "",
      thread_id: threadId,
      resume: true,
    };

    // Add user's continuation instruction to messages list
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        sender: "user",
        message: `[Resuming with confirmation]: ${userQuery}`,
        created_at: new Date().toISOString(),
      },
    ]);

    setInterrupt(null);
    executeStream(resumePayload);
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0C10] overflow-hidden">
      {/* Left Session History Rail */}
      <ChatSidebar
        sessions={sessions}
        activeThreadId={threadId}
        onNewChat={handleNewChat}
        isOpenMobile={isSidebarMobileOpen}
        onCloseMobile={() => setIsSidebarMobileOpen(false)}
      />

      {/* Main Conversation Pane (with left margin for fixed sidebar on md+) */}
      <div className="flex-1 flex flex-col md:pl-72 h-full">
        <ConversationPane
          threadId={threadId}
          messages={messages}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
          activeAgent={activeAgent}
          handoffEvents={handoffEvents}
          interrupt={interrupt}
          onSendMessage={handleSendMessage}
          onResumeInterrupt={handleResumeInterrupt}
          isResuming={isResuming}
          onToggleSidebarMobile={() => setIsSidebarMobileOpen((prev) => !prev)}
          orgName={session?.user?.name || "Synchropia Workspace"}
          orgId={(session?.user as any)?.organizationId}
        />
      </div>
    </div>
  );
}
