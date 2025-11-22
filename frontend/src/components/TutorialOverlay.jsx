import React, { useState } from 'react'
import './TutorialOverlay.css'

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Bienvenue dans Géo Challenge ! 🌍',
    content: 'Testez vos connaissances géographiques en plaçant des pays dans différentes catégories.',
    position: 'center',
    showSkip: false
  },
  {
    id: 'objective',
    title: 'Objectif du jeu',
    content: 'Votre but est d\'obtenir le score le plus petit possible. Chaque pays placé vous donne des points égaux à son rang mondial dans la catégorie choisie.',
    position: 'center',
    showSkip: true
  },
  {
    id: 'categories',
    title: 'Les 8 catégories',
    content: 'Vous devrez placer chaque pays dans une des 8 catégories : Petite superficie, PIB, Grande capitale, Armée, Football, ZEE, Riz, Francophones.',
    position: 'center',
    showSkip: true
  },
  {
    id: 'placement',
    title: 'Comment jouer',
    content: 'Cliquez sur une catégorie libre pour y placer le pays affiché. Chaque catégorie ne peut contenir qu\'un seul pays.',
    position: 'center',
    showSkip: true
  },
  {
    id: 'score',
    title: 'Le score',
    content: 'Votre score total s\'affiche en haut. Plus il est bas, mieux c\'est ! Essayez de placer chaque pays dans sa meilleure catégorie.',
    position: 'top',
    showSkip: true
  },
  {
    id: 'ready',
    title: 'Prêt à commencer ?',
    content: 'Vous pouvez maintenant commencer votre première partie. Bonne chance ! 🍀',
    position: 'center',
    showSkip: false
  }
]

function TutorialOverlay({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = TUTORIAL_STEPS[currentStep]

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-backdrop" onClick={step.showSkip ? handleSkip : undefined}></div>
      <div className={`tutorial-card tutorial-${step.position}`}>
        <div className="tutorial-header">
          <div className="tutorial-progress">
            {TUTORIAL_STEPS.map((_, index) => (
              <div
                key={index}
                className={`tutorial-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>
          {step.showSkip && (
            <button className="tutorial-skip" onClick={handleSkip}>
              Passer
            </button>
          )}
        </div>
        
        <div className="tutorial-content">
          <h2 className="tutorial-title">{step.title}</h2>
          <p className="tutorial-text">{step.content}</p>
        </div>

        <div className="tutorial-actions">
          {currentStep > 0 && (
            <button className="tutorial-button tutorial-button-secondary" onClick={handlePrevious}>
              ← Précédent
            </button>
          )}
          <button className="tutorial-button tutorial-button-primary" onClick={handleNext}>
            {currentStep === TUTORIAL_STEPS.length - 1 ? 'Commencer !' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TutorialOverlay

