import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Code, Copy, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HtmlViewerProps {
  htmlContent: string;
  onClear: () => void;
}

const HtmlViewer = ({ htmlContent, onClear }: HtmlViewerProps) => {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [showRawHtml, setShowRawHtml] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const { toast } = useToast();
  
  // Validate and sanitize HTML content
  const isValidHtml = htmlContent && typeof htmlContent === 'string' && htmlContent.trim().length > 0;
  
  if (!isValidHtml) {
    console.warn("Invalid HTML content received:", htmlContent);
  }

  const enhancedHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enhanced Content</title>
      <style>
        * { box-sizing: border-box; }
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #334155;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #1e293b;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }
        h1 { font-size: 2.5rem; background: linear-gradient(135deg, #7c3aed, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        h2 { font-size: 2rem; }
        h3 { font-size: 1.5rem; }
        p { margin-bottom: 1em; }
        a { 
          color: #7c3aed; 
          text-decoration: none; 
          transition: all 0.3s ease;
          border-bottom: 1px solid transparent;
        }
        a:hover { 
          color: #a855f7; 
          border-bottom-color: currentColor;
        }
        img { 
          max-width: 100%; 
          height: auto; 
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        img:hover { transform: scale(1.02); }
        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        button, .btn {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          display: inline-block;
          text-decoration: none;
        }
        button:hover, .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
        }
        .card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin: 20px 0;
          border: 1px solid #e2e8f0;
        }
        ul, ol { padding-left: 1.5em; }
        li { margin: 0.5em 0; }
        blockquote {
          border-left: 4px solid #7c3aed;
          padding-left: 1.5em;
          margin: 1.5em 0;
          font-style: italic;
          color: #64748b;
        }
        code {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Fira Code', monospace;
          color: #7c3aed;
        }
        pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        th {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          font-weight: 600;
        }
        @media (max-width: 768px) {
          body { padding: 10px; }
          .container { padding: 15px; }
          h1 { font-size: 2rem; }
          h2 { font-size: 1.5rem; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${htmlContent}
      </div>
    </body>
    </html>
  `;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(enhancedHtml);
    toast({
      title: "Copied!",
      description: "Enhanced HTML copied to clipboard",
    });
  };

  const downloadHtml = () => {
    const blob = new Blob([enhancedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enhanced-content.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Enhanced HTML file downloaded",
    });
  };

  return (
    <div className="w-full space-y-6 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
            Enhanced Content
          </Badge>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "preview" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("preview")}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button
              variant={viewMode === "code" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("code")}
              className="gap-2"
            >
              <Code className="w-4 h-4" />
              Code
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
            <Copy className="w-4 h-4" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={downloadHtml} className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={onClear} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            New
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-primary/20 shadow-glow-secondary">
        {!isValidHtml ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No valid HTML content to display</p>
            <p className="text-sm mt-2">Received: {typeof htmlContent} - {String(htmlContent).slice(0, 100)}...</p>
          </div>
        ) : viewMode === "preview" ? (
          <div className="relative">
            {iframeLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Loading preview...
                </div>
              </div>
            )}
            <div className="w-full" style={{ height: 'calc(100vh - 300px)', minHeight: '600px' }}>
              <iframe
                srcDoc={enhancedHtml}
                className="w-full h-full border-0"
                title="Enhanced HTML Preview"
                sandbox="allow-same-origin allow-scripts allow-forms allow-links"
                onLoad={() => setIframeLoading(false)}
                style={{
                  background: 'white',
                  borderRadius: '8px'
                }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 border-b">
              <Button
                variant={showRawHtml ? "outline" : "default"}
                size="sm"
                onClick={() => setShowRawHtml(false)}
              >
                Enhanced HTML
              </Button>
              <Button
                variant={showRawHtml ? "default" : "outline"}
                size="sm"
                onClick={() => setShowRawHtml(true)}
              >
                Raw HTML
              </Button>
            </div>
            <div className="h-[600px] overflow-auto">
              <pre className="text-sm p-4 bg-slate-900 text-slate-100 h-full overflow-auto">
                <code>{showRawHtml ? htmlContent : enhancedHtml}</code>
              </pre>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HtmlViewer;