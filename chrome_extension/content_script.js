// content_script.js
(function () {
  if (window.__tool_assistant_injected) return;
  window.__tool_assistant_injected = true;

  let backendUrl = 'http://localhost:8000';
  let chatWidget = null;
  let isWidgetOpen = false;

  // Copy code to clipboard function with fallback
  window.copyCodeToClipboard = function(codeId) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) {
      console.error('Code element not found:', codeId);
      return;
    }
    
    // Extract only text content, excluding any images or other elements
    let codeText = '';
    
    // If it's a code element, get its text content directly
    if (codeElement.tagName === 'CODE') {
      // Clone the element to avoid modifying the original
      const clone = codeElement.cloneNode(true);
      
      // Remove any img elements that might have been inserted
      const images = clone.querySelectorAll('img');
      images.forEach(img => img.remove());
      
      // Remove any other non-text elements
      const nonTextElements = clone.querySelectorAll('img, svg, canvas, video, audio, iframe');
      nonTextElements.forEach(el => el.remove());
      
      codeText = clone.textContent || clone.innerText || '';
    } else {
      // Fallback to direct text content
      codeText = codeElement.textContent || codeElement.innerText || '';
    }
    
    // Clean up the text - remove extra whitespace but preserve code formatting
    codeText = codeText.trim();
    
    // Debug logging
    console.log('Copying code:', codeText.substring(0, 100) + (codeText.length > 100 ? '...' : ''));
    
    const copyBtn = document.querySelector(`[data-code-id="${codeId}"]`);
    
    // Function to show visual feedback
    function showCopyFeedback(success = true) {
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        const originalBg = copyBtn.style.background;
        
        if (success) {
          copyBtn.textContent = '✓';
          copyBtn.style.background = 'rgba(34, 197, 94, 0.3)';
        } else {
          copyBtn.textContent = '✗';
          copyBtn.style.background = 'rgba(239, 68, 68, 0.3)';
        }
        
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = originalBg || 'rgba(255, 255, 255, 0.2)';
        }, 1500);
      }
    }
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codeText).then(() => {
        console.log('Code copied successfully via Clipboard API');
        showCopyFeedback(true);
      }).catch(err => {
        console.warn('Clipboard API failed, trying fallback:', err);
        fallbackCopyTextToClipboard(codeText, showCopyFeedback);
      });
    } else {
      // Fallback for older browsers or insecure contexts
      fallbackCopyTextToClipboard(codeText, showCopyFeedback);
    }
  };
  
  // Fallback copy function using execCommand
  function fallbackCopyTextToClipboard(text, callback) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      console.log('Fallback copy', successful ? 'successful' : 'failed');
      callback(successful);
    } catch (err) {
      console.error('Fallback copy failed:', err);
      callback(false);
    }
    
    document.body.removeChild(textArea);
  }

  // Enhanced Markdown to HTML converter with syntax highlighting
  function markdownToHtml(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Code blocks with language detection
    html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, function(match, lang, code) {
      const language = (lang || 'text').toUpperCase();
      const trimmedCode = code.trim();
      const codeId = 'code_' + Math.random().toString(36).substr(2, 9);
      
      return `<div class="ta-code-block">
        <div class="ta-code-header">
          <span class="ta-code-language">${language}</span>
          <button class="ta-copy-btn" data-code-id="${codeId}" onclick="copyCodeToClipboard('${codeId}')">📋</button>
        </div>
        <pre><code class="language-${language.toLowerCase()}" id="${codeId}">${trimmedCode}</code></pre>
      </div>`;
    });
    
    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Images (enhanced to show actual images when possible)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function(match, alt, src) {
      return `<div class="ta-image-container">
        <img src="${src}" alt="${alt}" class="ta-response-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class="ta-image-fallback" style="display:none;">
          <span class="ta-image-icon">🖼️</span>
          <span class="ta-image-text">Image: ${alt || 'No description'}</span>
          <a href="${src}" target="_blank" class="ta-image-link">View Image</a>
        </div>
      </div>`;
    });
    
    // Bullet points
    html = html.replace(/^[\s]*[-*+] (.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Numbered lists
    html = html.replace(/^[\s]*\d+\. (.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ol>)/g, '$1');
    html = html.replace(/(<\/ol>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<div class="ta-code-block">)/g, '$1');
    html = html.replace(/(<\/div>)<\/p>/g, '$1');
    html = html.replace(/<p>(<div class="ta-image-container">)/g, '$1');
    
    return html;
  }

  // Create trigger button
  const container = document.createElement('div');
  container.id = 'ta-trigger-container';
  container.className = 'ta-trigger-container';

  const btn = document.createElement('button');
  btn.id = 'ta-trigger';
  btn.title = 'Open LearnMate';
  
  // Use the earlier message emoji icon that looked good
  btn.innerText = '💬';

  container.appendChild(btn);
  document.body.appendChild(container);

  // Function to extract comprehensive content from the webpage
  function extractPageContent() {
    let content = '';
    let codeBlocks = [];
    let images = [];
    let videos = [];
    
    const contentSelectors = [
      'main',
      'article',
      '[role="main"]',
      '.content',
      '.main-content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '#content',
      '#main',
      '.container'
    ];
    
    let mainElement = null;
    for (const selector of contentSelectors) {
      mainElement = document.querySelector(selector);
      if (mainElement) break;
    }
    
    if (!mainElement) {
      mainElement = document.body;
    }
    
    if (mainElement) {
      const clone = mainElement.cloneNode(true);
      
      // Extract code blocks before removing unwanted elements
      const codeElements = clone.querySelectorAll('pre, code, .highlight, .code-block, [class*="lang-"], [class*="language-"]');
      codeElements.forEach((el, index) => {
        const codeText = el.textContent || el.innerText || '';
        if (codeText.trim().length > 10) { // Only include substantial code blocks
          const language = el.className.match(/(?:language-|lang-)(\w+)/)?.[1] || 
                          el.closest('[class*="language-"]')?.className.match(/language-(\w+)/)?.[1] || 
                          'text';
          codeBlocks.push({
            id: index,
            language: language,
            code: codeText.trim(),
            context: el.previousElementSibling?.textContent?.trim()?.substring(0, 100) || ''
          });
        }
      });
      
      // Extract images
      const imageElements = clone.querySelectorAll('img');
      imageElements.forEach((img, index) => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy');
        const alt = img.alt || img.title || '';
        const caption = img.closest('figure')?.querySelector('figcaption')?.textContent || 
                       img.nextElementSibling?.textContent || '';
        
        if (src && !src.includes('data:image') && alt.length > 0) {
          images.push({
            id: index,
            src: src,
            alt: alt,
            caption: caption.trim().substring(0, 200),
            context: img.closest('p, div, section')?.textContent?.trim()?.substring(0, 150) || ''
          });
        }
      });
      
      // Extract videos
      const videoElements = clone.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="embed"]');
      videoElements.forEach((video, index) => {
        let src = '';
        let title = '';
        
        if (video.tagName === 'VIDEO') {
          src = video.src || video.querySelector('source')?.src || '';
          title = video.title || video.getAttribute('aria-label') || '';
        } else if (video.tagName === 'IFRAME') {
          src = video.src || '';
          title = video.title || video.getAttribute('aria-label') || '';
        }
        
        const caption = video.closest('figure')?.querySelector('figcaption')?.textContent || 
                       video.nextElementSibling?.textContent || '';
        
        if (src) {
          videos.push({
            id: index,
            src: src,
            title: title,
            caption: caption.trim().substring(0, 200),
            context: video.closest('p, div, section')?.textContent?.trim()?.substring(0, 150) || ''
          });
        }
      });
      
      const unwantedSelectors = [
        'nav', 'header', 'footer', 'aside',
        '.navigation', '.nav', '.menu', '.sidebar',
        '.advertisement', '.ads', '.ad',
        'script', 'style', 'noscript',
        '.comments', '.comment-section',
        '.social-share', '.share-buttons',
        '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
        '#ta-trigger-container', '#ta-chat-widget' // Exclude our own elements
      ];
      
      unwantedSelectors.forEach(selector => {
        const elements = clone.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
      
      content = clone.textContent || clone.innerText || '';
      content = content
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      
      if (content.length > 8000) {
        content = content.substring(0, 8000) + '...';
      }
    }
    
    return {
      content: content,
      codeBlocks: codeBlocks,
      images: images,
      videos: videos
    };
  }

  // Create chat widget
  function createChatWidget() {
    if (chatWidget) return;

    chatWidget = document.createElement('div');
    chatWidget.id = 'ta-chat-widget';
    chatWidget.innerHTML = `
      <div class="ta-chat-header">
        <span>LearnMate</span>
        <button class="ta-close-btn">×</button>
      </div>
      <div class="ta-chat-messages" id="ta-messages"></div>
      <div class="ta-chat-context">
        <span id="ta-page-context">Loading...</span>
      </div>
      <div class="ta-chat-footer">
        <textarea id="ta-input" placeholder="Ask about this page..."></textarea>
        <button id="ta-send">Send</button>
      </div>
    `;

    document.body.appendChild(chatWidget);

    // Add event listeners
    const closeBtn = chatWidget.querySelector('.ta-close-btn');
    const sendBtn = chatWidget.querySelector('#ta-send');
    const input = chatWidget.querySelector('#ta-input');
    const messages = chatWidget.querySelector('#ta-messages');

    closeBtn.addEventListener('click', toggleWidget);
    sendBtn.addEventListener('click', sendQuery);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendQuery();
      }
    });

    // Update page context
    updatePageContext();
  }

  function updatePageContext() {
    const pageData = extractPageContent();
    const context = {
      url: window.location.href,
      title: document.title,
      selection: window.getSelection ? window.getSelection().toString() : '',
      content: pageData.content,
      codeBlocks: pageData.codeBlocks,
      images: pageData.images,
      videos: pageData.videos,
      timestamp: Date.now()
    };

    const pageContextSpan = chatWidget.querySelector('#ta-page-context');
    const hasContent = context.content && context.content.length > 0;
    const contentLength = hasContent ? context.content.length : 0;
    
    // Create enhanced context display
    let contextText = `📄 ${context.title || 'Current Page'}`;
    if (hasContent) {
      contextText += ` (${contentLength} chars`;
      if (context.codeBlocks.length > 0) contextText += `, ${context.codeBlocks.length} code blocks`;
      if (context.images.length > 0) contextText += `, ${context.images.length} images`;
      if (context.videos.length > 0) contextText += `, ${context.videos.length} videos`;
      contextText += ')';
      pageContextSpan.style.color = '#059669';
    } else {
      pageContextSpan.style.color = '#6b7280';
    }
    
    pageContextSpan.textContent = contextText;

    // Store context for use in queries
    window.__ta_page_context = context;
  }

  function appendMessage(text, cls) {
    const messages = chatWidget.querySelector('#ta-messages');
    const el = document.createElement('div');
    el.className = `ta-msg ta-${cls}`;
    
    if (cls === 'assistant' && text !== '…thinking') {
      // Render Markdown for assistant messages
      el.innerHTML = markdownToHtml(text);
    } else {
      // Use plain text for user messages and thinking indicator
      el.textContent = text;
    }
    
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendQuery() {
    const input = chatWidget.querySelector('#ta-input');
    const q = input.value.trim();
    if (!q) return;
    
    appendMessage(q, 'user');
    input.value = '';
    
    // Create a streaming message container
    const messages = chatWidget.querySelector('#ta-messages');
    const streamingMsg = document.createElement('div');
    streamingMsg.className = 'ta-msg ta-assistant ta-streaming';
    streamingMsg.innerHTML = '<span class="ta-thinking">…thinking</span>';
    messages.appendChild(streamingMsg);
    messages.scrollTop = messages.scrollHeight;

    try {
      const response = await fetch(`${backendUrl}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          page_context: window.__ta_page_context || {},
          top_k: 4
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamedContent = '';
      let isFirstContent = true;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'content') {
                // Remove thinking indicator on first content
                if (isFirstContent) {
                  streamingMsg.innerHTML = '';
                  isFirstContent = false;
                }
                
                // Append new content
                streamedContent += data.content;
                
                // Update the message with rendered markdown
                streamingMsg.innerHTML = markdownToHtml(streamedContent);
                
                // Auto-scroll to bottom
                messages.scrollTop = messages.scrollHeight;
                
              } else if (data.type === 'error') {
                streamingMsg.innerHTML = `<span style="color: #ef4444;">Error: ${data.error}</span>`;
                break;
                
              } else if (data.type === 'done') {
                // Final render and cleanup
                streamingMsg.className = 'ta-msg ta-assistant'; // Remove streaming class
                streamingMsg.innerHTML = markdownToHtml(streamedContent || 'No response generated');
                break;
              }
              
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', parseError);
            }
          }
        }
      }

    } catch (err) {
      console.error('Streaming chat error:', err);
      streamingMsg.innerHTML = `<span style="color: #ef4444;">Error contacting backend: ${err.message}</span>`;
    }
  }

  function toggleWidget() {
    if (!chatWidget) {
      createChatWidget();
    }

    isWidgetOpen = !isWidgetOpen;
    
    if (isWidgetOpen) {
      chatWidget.style.display = 'flex';
      btn.style.display = 'none';
      updatePageContext();
    } else {
      chatWidget.style.display = 'none';
      btn.style.display = 'block';
    }
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleWidget();
  });

  // Close widget when clicking outside
  document.addEventListener('click', (e) => {
    if (isWidgetOpen && chatWidget && !chatWidget.contains(e.target) && e.target !== btn) {
      toggleWidget();
    }
  });
})();
