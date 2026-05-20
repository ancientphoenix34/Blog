import React from 'react'

const SummaryCard = ({ summary, isStreaming, onClose }) => {
  return (
    <div className="summary-card">
      <div className="summary-card_header">
        <span>📄 TL;DR</span>
        <button type="button" className="ai-close-btn" onClick={onClose}>✕</button>
      </div>
      <p className="summary-card_text">
        {summary}
        {isStreaming && <span className="summary-cursor">|</span>}
      </p>
    </div>
  )
}

export default SummaryCard
