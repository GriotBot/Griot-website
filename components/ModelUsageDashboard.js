// File: /components/ModelUsageDashboard.js - WITH HALLUCINATION MONITORING
import { useState, useEffect } from 'react';

export default function ModelUsageDashboard() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalCost: 0,
    modelUsed: 'openai/gpt-3.5-turbo',
    todaysRequests: 0,
    savingsVsClaude: 0,
    averageTokens: 0,
    totalTokens: 0,
    // 🛡️ NEW: Hallucination tracking
    factualQueries: 0,
    hallucinationRisk: {
      low: 0,
      medium: 0,
      high: 0
    },
    confidenceEnhancements: 0,
    averageTemperature: 0.7
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadStats();
    
    const showDashboard = localStorage.getItem('griotbot-show-dashboard') === 'true' || 
                         process.env.NODE_ENV === 'development';
    setIsVisible(showDashboard);
  }, []);

  const loadStats = () => {
    const saved = localStorage.getItem('griotbot-enhanced-stats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  };

  // Enhanced logging function for the API to call
  const logModelUsage = (modelUsed, estimatedCost, tokenUsage, qualityMetrics) => {
    const claudeEquivalentCost = 0.08;
    const tokensUsed = tokenUsage?.total_tokens || 0;
    
    const newStats = {
      ...stats,
      totalRequests: stats.totalRequests + 1,
      totalCost: stats.totalCost + estimatedCost,
      modelUsed: modelUsed,
      todaysRequests: stats.todaysRequests + 1,
      savingsVsClaude: stats.savingsVsClaude + (claudeEquivalentCost - estimatedCost),
      totalTokens: stats.totalTokens + tokensUsed,
      averageTokens: Math.round((stats.totalTokens + tokensUsed) / (stats.totalRequests + 1)),
      
      // 🛡️ NEW: Quality metrics tracking
      factualQueries: stats.factualQueries + (qualityMetrics?.is_factual_query ? 1 : 0),
      hallucinationRisk: {
        low: stats.hallucinationRisk.low + (qualityMetrics?.hallucination_risk === 'low' ? 1 : 0),
        medium: stats.hallucinationRisk.medium + (qualityMetrics?.hallucination_risk === 'medium' ? 1 : 0),
        high: stats.hallucinationRisk.high + (qualityMetrics?.hallucination_risk === 'high' ? 1 : 0)
      },
      confidenceEnhancements: stats.confidenceEnhancements + (qualityMetrics?.confidence_enhanced ? 1 : 0),
      averageTemperature: ((stats.averageTemperature * stats.totalRequests) + (qualityMetrics?.temperature_used || 0.7)) / (stats.totalRequests + 1)
    };
    
    setStats(newStats);
    localStorage.setItem('griotbot-enhanced-stats', JSON.stringify(newStats));
  };

  const resetStats = () => {
    const resetStats = {
      totalRequests: 0,
      totalCost: 0,
      modelUsed: 'openai/gpt-3.5-turbo',
      todaysRequests: 0,
      savingsVsClaude: 0,
      averageTokens: 0,
      totalTokens: 0,
      factualQueries: 0,
      hallucinationRisk: { low: 0, medium: 0, high: 0 },
      confidenceEnhancements: 0,
      averageTemperature: 0.7
    };
    setStats(resetStats);
    localStorage.setItem('griotbot-enhanced-stats', JSON.stringify(resetStats));
  };

  const toggleDashboard = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem('griotbot-show-dashboard', newVisibility.toString());
  };

  // Make this available globally
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
        🛡️ Quality
      </button>
    );
  }

  const costEfficiency = stats.totalRequests > 0 ? 
    Math.round((1 - (stats.totalCost / (stats.totalRequests * 0.08))) * 100) : 0;
  
  const factualPercentage = stats.totalRequests > 0 ? 
    Math.round((stats.factualQueries / stats.totalRequests) * 100) : 0;
  
  const highRiskPercentage = stats.totalRequests > 0 ? 
    Math.round((stats.hallucinationRisk.high / stats.totalRequests) * 100) : 0;

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
      minWidth: '300px',
      maxHeight: '500px',
      overflow: 'auto',
      border: '1px solid #333'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, color: '#d7722c' }}>🛡️ GriotBot Quality Monitor</h4>
        <button onClick={toggleDashboard} style={{
          background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px'
        }}>✕</button>
      </div>
      
      {/* Basic Metrics */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>📊 Total Requests:</span>
          <strong>{stats.totalRequests}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>🤖 Model:</span>
          <strong style={{ color: '#4CAF50' }}>GPT-3.5</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>💰 Total Cost:</span>
          <strong>${stats.totalCost.toFixed(4)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>⚡ Efficiency:</span>
          <strong style={{ color: '#4CAF50' }}>{costEfficiency}%</strong>
        </div>
      </div>
      
      {/* 🛡️ NEW: Quality Metrics */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold', color: '#d7722c' }}>🛡️ Quality Metrics:</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span>📚 Factual Queries:</span>
          <strong>{factualPercentage}%</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span>🌡️ Avg Temperature:</span>
          <strong>{stats.averageTemperature.toFixed(2)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span>✅ Confidence Enhanced:</span>
          <strong>{stats.confidenceEnhancements}</strong>
        </div>
      </div>
      
      {/* Hallucination Risk Breakdown */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold', color: '#d7722c' }}>🔍 Risk Assessment:</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span style={{ color: '#4CAF50' }}>🟢 Low Risk:</span>
          <strong>{stats.hallucinationRisk.low}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span style={{ color: '#FFC107' }}>🟡 Medium Risk:</span>
          <strong>{stats.hallucinationRisk.medium}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span style={{ color: '#F44336' }}>🔴 High Risk:</span>
          <strong>{stats.hallucinationRisk.high}</strong>
        </div>
        {highRiskPercentage > 0 && (
          <div style={{ 
            background: 'rgba(244, 67, 54, 0.2)', 
            padding: '4px', 
            borderRadius: '4px',
            marginTop: '5px',
            fontSize: '10px'
          }}>
            ⚠️ {highRiskPercentage}% high-risk responses detected
          </div>
        )}
      </div>
      
      {/* Token Usage */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold', color: '#d7722c' }}>📈 Token Usage:</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span>Total Tokens:</span>
          <strong>{stats.totalTokens.toLocaleString()}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span>Avg per Request:</span>
          <strong>{stats.averageTokens}</strong>
        </div>
      </div>
      
      {/* Actions */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
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
      
      {/* Summary */}
      {stats.totalRequests > 0 && (
        <div style={{ 
          padding: '8px', 
          background: stats.hallucinationRisk.high === 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)',
          borderRadius: '4px',
          fontSize: '10px'
        }}>
          📊 <strong>Quality Summary:</strong><br/>
          {stats.hallucinationRisk.high === 0 ? 
            '✅ All responses within acceptable risk levels' : 
            `⚠️ ${stats.hallucinationRisk.high} high-risk responses detected`
          }<br/>
          💰 Monthly cost: ${(stats.totalCost * 30).toFixed(2)}<br/>
          🎯 vs Claude: ${((stats.totalRequests * 0.08 * 30) - (stats.totalCost * 30)).toFixed(2)} saved
        </div>
      )}
    </div>
  );
}
