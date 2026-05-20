import React from 'react'

const ConfirmationBox = ({ message, onConfirm, onCancel, confirmLabel = 'Confirm', isDanger = false }) => {
  return (
    <div className="confirmation-overlay" onClick={onCancel}>
      <div className="confirmation-box" onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <div className="confirmation-box_actions">
          <button className="btn sm" onClick={onCancel}>Cancel</button>
          <button className={`btn sm ${isDanger ? 'danger' : 'primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationBox
