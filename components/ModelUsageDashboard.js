// File: /components/ModelUsageDashboard.js
import { useState, useEffect } from 'react';

export default function ModelUsageDashboard() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    freeModelUses: 0,
    paidModelUses: 0,
    totalCost: 0,
    modelBreakdown: {},
    lastUsedModel: 'None',
    todaysRequests: 0,
    savingsVsClaude: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadStats();
    
    // Check if we should show dashboard (development or admin)
    const showDashboard = localStorage.getItem('griotbot-show-dashboard') === 'true' || 
                         process.env.NODE_ENV === 'development';
    setIsVisible(showDashboard);
  }, []);

  const loadStats = () => {
    const saved = localStorage.getItem('griotbot-model-stats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  };

  // Call this function from your chat handler when you get a response
  const logModelUsage = (modelUsed, estimatedCost, tokenUsage) => {
    const isFree = modelUsed.includes(':free');
    const claudeEquivalentCost = 0.08; // What this request would cost with Claude
    
    const newStats = {
      ...stats,
      totalRequests: stats.totalRequests + 1,
      freeModelUses: stats.freeModelUses + (isFree ? 1 : 0),
      paidModelUses: stats.paidModelUses + (isFree ? 0 : 1),
      totalCost: stats.totalCost + estimatedCost,
      lastUsedModel: modelUsed,
      todaysRequests: stats.todaysRequests + 1,
      savingsVsClaude: stats.savingsVsClaude + (claudeEquivalentCost - estimatedCost),
      modelBreakdown: {
        ...stats.modelBreakdown,
        [modelUsed]: (stats.modelBreakdown[modelUsed] || 0) + 1
      }
    };
    
    setStats(newStats);
    localStorage.setItem('griotbot-model-stats', JSON.stringify(newStats));
  };

  const resetStats = () => {
    const resetStats = {
      totalRequests: 0,
      freeModelUses: 0,
      paidModelUses: 0,
      totalCost: 0,
      modelBreakdown: {},
      lastUsedModel: 'None',
      todaysRequests: 0,
      savingsVsClaude: 0
    };
    setStats(resetStats);
    localStorage.setItem('griotbot-model-stats', JSON.stringify(resetStats));
  };

  const toggleDashboard = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem('griotbot-show-dashboard', newVisibility.toString());
  };

  // Make this available globally so it can be called from the chat handler
  useEffect(() => {
    window.logModelUsage = logModelUsage;
    return () => {
      delete window.logModelUsage;
    };
  }, [stats]);

  if (!isVisible) {
    return (
      <button
        onClick={toggleDashboard}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '10px',
          background: '#d7722c',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          cursor: 'pointer',
          zIndex: 9999,
        }}
      >
        📊 Stats
      </button>
    );
  }

  const freePercentage = stats.totalRequests > 0 ? 
    Math.round((stats.freeModelUses / stats.totalRequests) * 100) : 0;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.95)',
      color: 'white',
      padding: '15px',
      borderRadius: '12px',
      fontSize: '11px',
      zIndex: 9999,
      minWidth: '280px',
      maxHeight: '400px',
      overflow: 'auto',
      border: '1px solid #333'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, color: '#d7722c' }}>🤖 GriotBot Model Analytics</h4>
        <button onClick={toggleDashboard} style={{
          background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px'
        }}>✕</button>
      </div>
      
      {/* Key Metrics */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>📊 Total Requests:</span>
          <strong>{stats.totalRequests}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>🆓 Free Model Usage:</span>
          <strong style={{ color: '#4CAF50' }}>{freePercentage}%</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>💰 Total Cost:</span>
          <strong>${stats.totalCost.toFixed(4)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>💎 Savings vs Claude:</span>
          <strong style={{ color: '#4CAF50' }}>${stats.savingsVsClaude.toFixed(2)}</strong>
        </div>
      </div>
      
      {/* Last Used Model */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold', color: '#d7722c' }}>🔄 Last Model Used:</div>
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '5px', 
          borderRadius: '4px',
          fontSize: '10px',
          wordBreak: 'break-all'
        }}>
          {stats.lastUsedModel}
        </div>
      </div>
      
      {/* Model Breakdown */}
      {Object.keys(stats.modelBreakdown).length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <div style={{ marginBottom: '5px', fontWeight: 'bold', color: '#d7722c' }}>📈 Model Breakdown:</div>
          {Object.entries(stats.modelBreakdown).map(([model, count]) => (
            <div key={model} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '3px',
              fontSize: '10px'
            }}>
              <span style={{ 
                color: model.includes(':free') ? '#4CAF50' : '#FFC107',
                maxWidth: '180px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {model.includes(':free') ? '🆓' : '💰'} {model.split('/').pop()}
              </span>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
      )}
      
      {/* Actions */}
      <div style={{ display: 'flex', gap: '5px' }}>
        <button onClick={resetStats} style={{
          background: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '5px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          cursor: 'pointer'
        }}>
          Reset Stats
        </button>
        <button onClick={loadStats} style={{
          background: '#28a745',
          color: 'white',
          border: 'none',
          padding: '5px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          cursor: 'pointer'
        }}>
          Refresh
        </button>
      </div>
      
      {/* Cost Projection */}
      {stats.totalRequests > 0 && (
        <div style={{ 
          marginTop: '10px', 
          padding: '8px', 
          background: 'rgba(76, 175, 80, 0.2)',
          borderRadius: '4px',
          fontSize: '10px'
        }}>
          📊 <strong>Monthly Projection:</strong><br/>
          Current: ${(stats.totalCost * 30).toFixed(2)}<br/>
          vs Claude: ${(stats.totalRequests * 0.08 * 30).toFixed(2)}<br/>
          <strong style={{ color: '#4CAF50' }}>
            Savings: {Math.round((1 - (stats.totalCost / (stats.totalRequests * 0.08))) * 100)}%
          </strong>
        </div>
      )}
    </div>
  );
}
