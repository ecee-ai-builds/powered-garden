import { ChatMessage } from "@/hooks/useGrowAssistant";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: ChatMessage;
}

const roleColor: Record<ChatMessage["role"], string> = {
  assistant: "bg-primary/10 border border-primary/40 text-primary",
  user: "bg-secondary/10 border border-secondary/40 text-secondary",
  system: "bg-muted border border-muted text-muted-foreground",
};

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}> 
      <div
        className={cn(
          "max-w-xl rounded-lg px-4 py-3 text-sm leading-relaxed shadow-sm backdrop-blur",
          roleColor[message.role],
          isUser && "text-right"
        )}
      >
        <p className="whitespace-pre-line">{message.content}</p>
      </div>
    </div>
  );
};
