import { useState } from "react";
import PromptForm from "@/components/PromptForm";
import HtmlViewer from "@/components/HtmlViewer";

const Index = () => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResponse = (html: string) => {
    setHtmlContent(html);
  };

  const handleClear = () => {
    setHtmlContent("");
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <PromptForm 
          onResponse={handleResponse}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        
        {htmlContent && (
          <HtmlViewer 
            htmlContent={htmlContent}
            onClear={handleClear}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
