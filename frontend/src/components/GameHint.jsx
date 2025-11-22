import React, { useState, useEffect } from 'react'
import './GameHint.css'

const HINTS = {
  firstCountry: {
    title: '💡 Premier pays',
    content: 'Prenez votre temps pour analyser ce pays. Regardez ses caractéristiques et choisissez la catégorie où il est le mieux classé.'
  },
  midGame: {
    title: '💡 Astuce',
    content: 'Pensez à garder les meilleures catégories pour les pays qui arrivent. Analysez les rangs avant de placer.'
  },
  lastCountry: {
    title: '💡 Dernier pays',
    content: 'Il ne reste qu\'une catégorie disponible. C\'est votre dernier placement, faites de votre mieux !'
  },
  goodPlacement: {
    title: '✅ Bon placement !',
    content: 'Ce pays est bien classé dans cette catégorie. Continuez ainsi !'
  },
  couldBeBetter: {
    title: '⚠️ Placement correct',
    content: 'Ce placement est correct, mais ce pays aurait peut-être pu être mieux placé dans une autre catégorie.'
  }
}

function GameHint({ type, onClose, autoClose = true }) {
  const [visible, setVisible] = useState(true)
  const hint = HINTS[type]

  useEffect(() => {
    if (autoClose && visible) {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(() => onClose(), 300)
      }, 5000) // Auto-fermeture après 5 secondes

      return () => clearTimeout(timer)
    }
  }, [autoClose, visible, onClose])

  if (!hint || !visible) return null

  return (
    <div className="game-hint">
      <div className="game-hint-content">
        <div className="game-hint-header">
          <h3 className="game-hint-title">{hint.title}</h3>
          <button className="game-hint-close" onClick={() => {
            setVisible(false)
            setTimeout(() => onClose(), 300)
          }}>
            ×
          </button>
        </div>
        <p className="game-hint-text">{hint.content}</p>
      </div>
    </div>
  )
}

export default GameHint

