"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";

export default function ThreadChatPage() {
  const params = useParams();
  const threadId = typeof params?.threadId === "string" ? params.threadId : Array.isArray(params?.threadId) ? params.threadId[0] : "";

  return <ChatWorkspace initialThreadId={threadId} />;
}
