// background.js
// Background script for Tool Assistant extension
// The chat widget is now handled directly in the content script
// This file can be used for future background tasks if needed

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle any future background tasks here
  console.log('Background script received message:', message);
  
  // For now, we don't need to handle any messages since the chat widget
  // is implemented directly in the content script
  return true;
});

// Optional: Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Tool Assistant extension installed/updated:', details.reason);
});
