// Update in pages/index.js - Enhanced handleSendMessage function
const handleSendMessage = async (messageText, customStorytellerMode = null) => {
  const useStorytellerMode = customStorytellerMode !== null ? customStorytellerMode : storytellerMode;
  
  if (!messageText || typeof messageText !== 'string' || !messageText.trim()) {
    return;
  }

  const userMessage = {
    role: 'user',
    content: messageText.trim(),
    time: new Date().toISOString()
  };

  const newMessagesWithUser = [...messages, userMessage];
  setMessages(newMessagesWithUser);
  setIsLoading(true);
  setShowWelcome(false);

  try {
    console.log('🚀 Sending request to enhanced anti-hallucination API...');
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 
        prompt: messageText.trim(),
        storytellerMode: useStorytellerMode
      })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Error: Status ${res.status}`);
    }
    
    const data = await res.json();
    const botResponse = data.choices?.[0]?.message?.content || 
                      'I apologize, but I seem to be having trouble processing your request.';
    
    // 🎯 ENHANCED: Log model usage WITH quality metrics
    if (window.logModelUsage && data.model_used) {
      console.log(`📊 Enhanced logging with quality metrics:`, {
        model: data.model_used,
        cost: data.estimated_cost || 0,
        quality: data.quality_metrics || {}
      });
      
      // Pass quality metrics to dashboard
      window.logModelUsage(
        data.model_used, 
        data.estimated_cost || 0, 
        data.usage || {},
        data.quality_metrics || {} // 🛡️ NEW: Quality metrics
      );
    }
    
    // Enhanced logging with quality insights
    console.log(`✅ Model used: ${data.model_used || 'Unknown'}`);
    console.log(`💰 Estimated cost: $${data.estimated_cost || 0}`);
    console.log(`🛡️ Quality metrics:`, data.quality_metrics);
    
    if (data.usage) {
      console.log(`📊 Token usage: ${data.usage.total_tokens || 0} tokens`);
    }
    
    // 🛡️ Log quality alerts
    if (data.quality_metrics?.hallucination_risk === 'high') {
      console.warn('🚨 HIGH HALLUCINATION RISK detected in response');
    }
    if (data.quality_metrics?.confidence_enhanced) {
      console.info('✅ Response enhanced with confidence indicators');
    }
    
    const botMessage = {
      role: 'bot',
      content: botResponse,
      time: new Date().toISOString(),
      // Store quality metrics for potential future use
      modelUsed: data.model_used,
      estimatedCost: data.estimated_cost,
      isFree: data.is_free,
      qualityMetrics: data.quality_metrics // 🛡️ NEW: Store quality data
    };

    const finalMessages = [...newMessagesWithUser, botMessage];
    setMessages(finalMessages);
    saveChatHistory(finalMessages);
    
  } catch (err) {
    console.error('API error:', err);
    
    const errorMessage = {
      role: 'bot',
      content: `I'm sorry, I encountered an error: ${err.message}. Please try again later.`,
      time: new Date().toISOString()
    };

    const finalMessages = [...newMessagesWithUser, errorMessage];
    setMessages(finalMessages);
    saveChatHistory(finalMessages);
  } finally {
    setIsLoading(false);
  }
};
