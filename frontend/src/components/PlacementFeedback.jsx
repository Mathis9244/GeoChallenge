import React, { useEffect, useState } from 'react'
import './PlacementFeedback.css'

function PlacementFeedback({ isGood, rank, onComplete }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
    const timer = setTimeout(() => {
      setShow(false)
      if (onComplete) {
        setTimeout(onComplete, 300) // Attendre la fin de l'animation
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [isGood, rank, onComplete])

  if (!show) return null

  return (
    <div className={`placement-feedback ${isGood ? 'good' : 'bad'}`}>
      <div className="feedback-icon">
        {isGood ? '✅' : '⚠️'}
      </div>
      <div className="feedback-text">
        {isGood ? (
          <>
            <div className="feedback-title">Excellent placement !</div>
            <div className="feedback-subtitle">Rang #{rank}</div>
          </>
        ) : (
          <>
            <div className="feedback-title">Peut mieux faire</div>
            <div className="feedback-subtitle">Rang #{rank}</div>
          </>
        )}
      </div>
    </div>
  )
}

export default PlacementFeedback

