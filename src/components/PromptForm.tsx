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
      console.log("Sending request to:", webhookUrl);
      console.log("Request payload:", { prompt });
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ prompt }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error text:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
      }

      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid JSON response from webhook");
      }
      
      console.log("Parsed response data:", data);
      
      // Handle different response structures with better validation
      const htmlContent = data.html || data.output?.html || data.content || data.result;
      
      if (htmlContent && typeof htmlContent === 'string' && htmlContent.trim()) {
        console.log("HTML content found, length:", htmlContent.length);
        onResponse(htmlContent);
        toast({
          title: "Success",
          description: "HTML content received and enhanced!",
        });
      } else {
        console.error("No valid HTML content found in response:", data);
        const availableKeys = Object.keys(data).join(", ");
        throw new Error(`No HTML content in response. Available keys: ${availableKeys || 'none'}`);
      }
    } catch (error) {
      console.error("Request failed:", error);
      
      let errorMessage = "Failed to process request";
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "Network error - check CORS settings or webhook URL";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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