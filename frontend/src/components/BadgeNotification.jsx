import React, { useEffect, useState } from 'react'
import './BadgeNotification.css'

function BadgeNotification({ badge, onClose }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
    const timer = setTimeout(() => {
      setShow(false)
      if (onClose) {
        setTimeout(onClose, 500) // Attendre la fin de l'animation
      }
    }, 3000) // Afficher pendant 3 secondes
    return () => clearTimeout(timer)
  }, [badge, onClose])

  if (!badge || !show) return null

  return (
    <div className="badge-notification">
      <div className="badge-notification-content">
        <div className="badge-notification-icon" style={{ color: badge.color }}>
          {badge.icon}
        </div>
        <div className="badge-notification-text">
          <div className="badge-notification-title">Badge débloqué !</div>
          <div className="badge-notification-name">{badge.name}</div>
          <div className="badge-notification-description">{badge.description}</div>
        </div>
        <button className="badge-notification-close" onClick={() => {
          setShow(false)
          if (onClose) setTimeout(onClose, 500)
        }}>
          ×
        </button>
      </div>
    </div>
  )
}

export default BadgeNotification

