import React from 'react'
import './HomeScreen.css'

function HomeScreen({ onStart, personalBest, onShowLeaderboard }) {
  return (
    <div className="home-screen">
      <div className="home-card">
        <h1 className="title">🌍 Géo Challenge</h1>
        <p className="subtitle">Testez vos connaissances géographiques !</p>
        
        {personalBest !== null && (
          <div className="personal-best">
            <div className="pb-label">Meilleur score</div>
            <div className="pb-value">{personalBest} points</div>
          </div>
        )}
        
        <div className="rules">
          <h2>Règles du jeu</h2>
          <ul>
            <li>8 pays vous seront présentés un par un</li>
            <li>Placez chaque pays dans une catégorie libre</li>
            <li>Vous gagnez des points = rang mondial du pays dans cette catégorie</li>
            <li>Objectif : obtenir le score total le plus petit possible</li>
          </ul>
        </div>

        <div className="home-actions">
          <button className="play-button" onClick={onStart}>
            Jouer
          </button>
          <button className="leaderboard-button" onClick={onShowLeaderboard}>
            🏆 Classement
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen

