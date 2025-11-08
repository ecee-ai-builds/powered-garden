import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chat = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary tracking-wider">
          CHAT
        </h1>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">AI Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chat interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
