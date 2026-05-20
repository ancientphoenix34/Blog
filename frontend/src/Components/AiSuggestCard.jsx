import React from 'react'

const AiSuggestCard = ({ titles, category, onSelectTitle, onSelectCategory, onClose }) => {
  if (!titles || titles.length === 0) return null

  return (
    <div className="ai-suggest-card">
      <div className="ai-suggest-card_header">
        <span>✨ AI Suggestions</span>
        <button type="button" className="ai-close-btn" onClick={onClose}>✕</button>
      </div>
      <div className="ai-suggest-card_titles">
        {titles.map((t, i) => (
          <button key={i} type="button" className="ai-title-option" onClick={() => onSelectTitle(t)}>
            {t}
          </button>
        ))}
      </div>
      {category && (
        <div className="ai-suggest-card_category">
          <span>Suggested category:</span>
          <button type="button" className="ai-category-chip" onClick={() => onSelectCategory(category)}>
            {category}
          </button>
        </div>
      )}
    </div>
  )
}

export default AiSuggestCard
