import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Copy, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — WorkSmart AI" },
      {
        name: "description",
        content:
          "Chat with the WorkSmart AI assistant to brainstorm ideas, rewrite text, and check grammar, with context kept across the conversation.",
      },
      { property: "og:title", content: "AI Chatbot — WorkSmart AI" },
      {
        property: "og:description",
        content: "A work-focused AI chat for brainstorming, rewriting, and grammar checks.",
      },
    ],
  }),
  component: ChatPage,
});

const MAX_CHARS = 4000;

const QUICK_PROMPTS = [
  { label: "Brainstorm ideas", starter: "Brainstorm ideas for " },
  { label: "Rewrite this text", starter: "Rewrite this text to be clearer and more concise:\n\n" },
  { label: "Check grammar", starter: "Check the grammar and spelling of this text:\n\n" },
] as const;

function messageText(parts: { type: string; text?: string }[]) {
  return parts
    .map((part) => (part.type === "text" && part.text ? part.text : ""))
    .join("")
    .trim();
}

function ChatInner() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error, regenerate, setMessages } = useChat({ transport });
  const { textInput } = usePromptInputController();
  const composerRef = useRef<HTMLDivElement>(null);
  const [showLimit, setShowLimit] = useState(false);

  const isBusy = status === "submitted" || status === "streaming";
  const tooLong = textInput.value.length > MAX_CHARS;

  const focusInput = () => {
    composerRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus();
  };

  useEffect(() => {
    focusInput();
  }, []);

  useEffect(() => {
    if (!isBusy) focusInput();
  }, [isBusy]);

  const handleSubmit = (message: { text?: string }) => {
    const text = (message.text ?? "").trim();
    if (!text || isBusy) return;
    if (text.length > MAX_CHARS) {
      setShowLimit(true);
      return;
    }
    setShowLimit(false);
    void sendMessage({ text });
    textInput.clear();
  };

  const insertStarter = (starter: string) => {
    textInput.setInput(starter);
    focusInput();
  };

  const copyMessage = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Message copied");
  };

  const clearConversation = () => {
    setMessages([]);
    textInput.clear();
    focusInput();
  };

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
      <div className="mb-3 flex items-center justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={messages.length === 0}>
              <Trash2 className="size-4" aria-hidden="true" />
              Clear Conversation
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear this conversation?</AlertDialogTitle>
              <AlertDialogDescription>
                All messages in this session will be removed. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearConversation}>Clear</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Conversation className="min-h-0 flex-1 rounded-lg border border-border bg-card">
        <ConversationContent
          aria-live="polite"
          aria-label="Conversation transcript"
          className="gap-4"
        >
          {messages.length === 0 ? (
            <ConversationEmptyState>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  How can I help with your work today?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ask anything, or start with one of these.
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {QUICK_PROMPTS.map(({ label, starter }) => (
                  <Button
                    key={label}
                    variant="outline"
                    size="sm"
                    onClick={() => insertStarter(starter)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message) => {
              const text = messageText(message.parts as { type: string; text?: string }[]);
              if (!text) return null;
              return (
                <div key={message.id} className="space-y-1">
                  <Message from={message.role === "user" ? "user" : "assistant"}>
                    <MessageContent
                      className={
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-transparent px-0 text-foreground"
                      }
                    >
                      {message.role === "user" ? (
                        <p className="whitespace-pre-wrap">{text}</p>
                      ) : (
                        <MessageResponse>{text}</MessageResponse>
                      )}
                    </MessageContent>
                  </Message>
                  {message.role === "assistant" && (
                    <div className="flex justify-start">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(text)}
                        aria-label="Copy assistant message"
                      >
                        <Copy className="size-4" aria-hidden="true" />
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {status === "submitted" && <Shimmer>Thinking…</Shimmer>}

          {error && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
              <p className="min-w-0 flex-1">
                That message couldn't be sent. Check your connection and try again.
              </p>
              <Button variant="outline" size="sm" onClick={() => regenerate()}>
                <RotateCcw className="size-4" aria-hidden="true" />
                Retry
              </Button>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="pt-3" ref={composerRef}>
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            placeholder="Ask anything about your work… (Enter to send, Shift+Enter for a new line)"
            aria-label="Message"
            aria-invalid={tooLong}
          />
          <PromptInputFooter className="justify-between">
            <span
              className={
                tooLong || showLimit
                  ? "text-xs font-medium text-destructive"
                  : "text-xs text-muted-foreground"
              }
            >
              {textInput.value.length} / {MAX_CHARS}
              {tooLong ? " — message is too long to send." : ""}
            </span>
            <PromptInputSubmit
              status={status}
              disabled={!textInput.value.trim() || tooLong || isBusy}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

function ChatPage() {
  return (
    <AppShell title="AI Chatbot" description="A running conversation for everyday work" fullHeight>
      <PromptInputProvider>
        <ChatInner />
      </PromptInputProvider>
    </AppShell>
  );
}
