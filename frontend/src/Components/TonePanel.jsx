import React from 'react'

const getBadgeClass = (value) => {
  const v = (value || '').toLowerCase()
  if (['negative'].some(k => v.includes(k))) return 'tone-badge tone-badge--negative'
  if (['positive', 'formal', 'confident', 'professional', 'academic'].some(k => v.includes(k))) return 'tone-badge tone-badge--primary'
  return 'tone-badge tone-badge--neutral'
}

const TonePanel = ({ result, onClose }) => {
  if (!result) return null

  return (
    <div className="tone-panel">
      <div className="tone-panel_header">
        <span>🎭 Tone Analysis</span>
        <button type="button" className="ai-close-btn" onClick={onClose}>✕</button>
      </div>
      <div className="tone-panel_badges">
        {[
          { label: 'Tone', value: result.tone },
          { label: 'Sentiment', value: result.sentiment },
          { label: 'Style', value: result.style },
          { label: 'Audience', value: result.audience },
        ].map(({ label, value }) => (
          <div key={label} className="tone-badge-group">
            <span className="tone-badge-label">{label}</span>
            <span className={getBadgeClass(value)}>{value}</span>
          </div>
        ))}
      </div>
      {result.tip && (
        <p className="tone-panel_tip">
          <strong>💡 Tip:</strong> {result.tip}
        </p>
      )}
    </div>
  )
}

export default TonePanel
