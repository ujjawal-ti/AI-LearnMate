// popup.js
const sendBtn = document.getElementById('send');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const pageContextSpan = document.getElementById('page-context');

let backendUrl = 'http://0.0.0.0:8000'; // CHANGE if your backend runs elsewhere

function appendMessage(text, cls) {
  const el = document.createElement('div');
  el.className = `msg ${cls}`;
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

// load page context
chrome.storage.local.get('ta_page_context', (res) => {
  const ctx = res.ta_page_context || {};
  const hasContent = ctx.content && ctx.content.length > 0;
  const contentLength = hasContent ? ctx.content.length : 0;
  
  if (hasContent) {
    pageContextSpan.textContent = `📄 ${ctx.title || 'Current Page'} (${contentLength} chars) — ${ctx.url || ''}`;
    pageContextSpan.style.color = '#059669'; // Green to indicate content is available
  } else {
    pageContextSpan.textContent = (ctx.title ? ctx.title + ' — ' : '') + (ctx.url || '');
    pageContextSpan.style.color = '#6b7280'; // Gray for no content
  }
});

// send query to backend
async function sendQuery() {
  const q = input.value.trim();
  if (!q) return;
  appendMessage(q, 'user');
  input.value = '';
  appendMessage('…thinking', 'assistant');

  // get page context just before sending
  chrome.storage.local.get('ta_page_context', async (res) => {
    const ctx = res.ta_page_context || {};
    try {
      const r = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          page_context: ctx,
          top_k: 4
        })
      });
      const data = await r.json();
      // replace last '…thinking' with real assistant answer
      const last = messages.querySelector('.assistant:last-child');
      if (last) last.textContent = data.answer || 'No answer';
      else appendMessage(data.answer || 'No answer', 'assistant');
    } catch (err) {
      console.error(err);
      const last = messages.querySelector('.assistant:last-child');
      if (last) last.textContent = 'Error contacting backend';
      else appendMessage('Error contacting backend', 'assistant');
    }
  });
}

sendBtn.addEventListener('click', sendQuery);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendQuery();
  }
});
