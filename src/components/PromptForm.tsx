import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Settings, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptFormProps {
  onResponse: (html: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const PromptForm = ({ onResponse, isLoading, setIsLoading }: PromptFormProps) => {
  const [prompt, setPrompt] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    if (!webhookUrl.trim()) {
      toast({
        title: "Error", 
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.html) {
        onResponse(data.html);
        toast({
          title: "Success",
          description: "HTML content received and enhanced!",
        });
      } else {
        throw new Error("No HTML content in response");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full text-primary-foreground font-medium animate-glow">
          <Sparkles className="w-4 h-4" />
          n8n HTML Enhancer
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Transform Your Content
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Send prompts to your n8n workflow and get beautifully enhanced HTML content
        </p>
      </div>

      <Card className="p-6 bg-gradient-accent backdrop-blur-sm border-primary/20 shadow-glow-secondary">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="webhook" className="text-sm font-medium">
                Webhook URL
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="h-8 w-8 p-0"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            
            {(showSettings || !webhookUrl) && (
              <Input
                id="webhook"
                type="url"
                placeholder="https://your-n8n-instance.com/webhook/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="transition-smooth focus:shadow-glow-primary"
                required
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium">
              Your Prompt
            </Label>
            <Textarea
              id="prompt"
              placeholder="Enter your content prompt here... (e.g., Create a landing page for a coffee shop)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] transition-smooth focus:shadow-glow-primary resize-none"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !prompt.trim() || !webhookUrl.trim()}
            className="w-full bg-gradient-primary hover:shadow-glow-primary transition-spring group"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                Generate Enhanced HTML
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PromptForm;