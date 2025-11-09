import { ChatBubble } from "@/components/grow/ChatBubble";
import type { ChatMessage } from "@/hooks/useGrowAssistant";

interface ChatTimelineProps {
  messages: ChatMessage[];
}

export const ChatTimeline = ({ messages }: ChatTimelineProps) => {
  return (
    <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: "55vh" }}>
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
    </div>
  );
};
