import React, { useEffect, useState } from 'react'
import './Confetti.css'

function Confetti({ trigger }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (trigger) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
      }, 3000) // Afficher pendant 3 secondes
      return () => clearTimeout(timer)
    }
  }, [trigger])

  if (!show) return null

  return (
    <div className="confetti-container">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'][Math.floor(Math.random() * 8)]
          }}
        />
      ))}
    </div>
  )
}

export default Confetti

