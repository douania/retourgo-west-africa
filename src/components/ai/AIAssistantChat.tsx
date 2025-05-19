
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { useTranslation } from "@/hooks/useTranslation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "lucide-react";

const AIAssistantChat = () => {
  const { t } = useTranslation();
  const { messages, loading, sendMessage, clearConversation } = useAIAssistant();
  const [inputValue, setInputValue] = useState("");
  
  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{t("ai.assistant_title")}</span>
          <Button variant="outline" size="sm" onClick={clearConversation}>{t("ai.clear_conversation")}</Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-[400px] pr-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>{t("ai.assistant_welcome")}</p>
              <div className="mt-4 text-sm">
                <p>{t("ai.assistant_suggestions")}:</p>
                <div className="mt-2 space-y-2">
                  {["ai.suggestion_1", "ai.suggestion_2", "ai.suggestion_3", "ai.suggestion_4"].map((key) => (
                    <Button 
                      key={key}
                      variant="secondary" 
                      size="sm"
                      className="mx-1"
                      onClick={() => setInputValue(t(key))}
                    >
                      {t(key)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("ai.ask_question")}
            className="flex-grow"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className="shrink-0"
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              t("ai.send")
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIAssistantChat;
