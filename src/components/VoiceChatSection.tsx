import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { Mic, MicOff, Volume2, VolumeX, Trash2, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function VoiceChatSection() {
  const {
    isSupported,
    isListening,
    isSpeaking,
    isProcessing,
    transcript,
    messages,
    currentResponse,
    startListening,
    stopListening,
    stopSpeaking,
    clearConversation,
  } = useVoiceChat();

  if (!isSupported) {
    return (
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Talk with AI</h2>
          </div>
          <p className="text-muted-foreground">Your voice-powered coding assistant</p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-warning" />
            <h3 className="text-lg font-semibold text-foreground">Browser Not Supported</h3>
            <p className="text-muted-foreground max-w-md">
              Voice chat requires a browser that supports the Web Speech API. 
              Please use Chrome, Edge, or Safari for the best experience.
            </p>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <MessageCircle className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Talk with AI</h2>
        </div>
        <p className="text-muted-foreground">
          Ask coding questions using your voice • Get spoken answers instantly
        </p>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border p-6">
        <div className="space-y-6">
          {/* Voice Control Area */}
          <div className="flex flex-col items-center gap-6">
            {/* Main Mic Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={cn(
                "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
                "focus:outline-none focus:ring-4 focus:ring-primary/30",
                isListening
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : isProcessing
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
              )}
            >
              {isProcessing ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : isListening ? (
                <MicOff className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
              
              {/* Listening animation rings */}
              {isListening && (
                <>
                  <span className="absolute inset-0 rounded-full border-4 border-destructive animate-ping opacity-75" />
                  <span className="absolute inset-[-8px] rounded-full border-2 border-destructive/50 animate-pulse" />
                </>
              )}
            </button>

            {/* Status Badge */}
            <Badge 
              variant={isListening ? "destructive" : isSpeaking ? "default" : "secondary"}
              className="text-sm px-4 py-1"
            >
              {isListening
                ? "🎤 Listening..."
                : isProcessing
                ? "🤔 Thinking..."
                : isSpeaking
                ? "🔊 Speaking..."
                : "Click mic to start"}
            </Badge>

            {/* Live Transcript */}
            {transcript && (
              <div className="w-full max-w-lg">
                <Card className="bg-secondary/50 border-border p-4">
                  <p className="text-sm text-muted-foreground mb-1">You're saying:</p>
                  <p className="text-foreground italic">"{transcript}"</p>
                </Card>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            {isSpeaking && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopSpeaking}
                className="gap-2"
              >
                <VolumeX className="h-4 w-4" />
                Stop Speaking
              </Button>
            )}
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearConversation}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Chat
              </Button>
            )}
          </div>

          {/* Conversation History */}
          {messages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Conversation</h3>
              <ScrollArea className="h-[300px] w-full rounded-lg border border-border bg-background/50 p-4">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-3 text-sm",
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {msg.role === "user" ? (
                            <Mic className="h-3 w-3" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                          <span className="text-xs opacity-75">
                            {msg.role === "user" ? "You" : "AI Assistant"}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Instructions */}
          {messages.length === 0 && (
            <div className="text-center text-sm text-muted-foreground space-y-2 pt-4">
              <p>💡 <strong>How it works:</strong></p>
              <ul className="space-y-1">
                <li>1. Click the microphone button to start speaking</li>
                <li>2. Ask your coding question clearly</li>
                <li>3. The AI will respond with voice</li>
                <li>4. Click again to ask follow-up questions</li>
              </ul>
            </div>
          )}
        </div>
      </Card>
    </section>
  );
}
