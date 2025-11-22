import React from 'react'
import { getLeaderboard, formatDate, resetLeaderboard } from '../utils/storage'
import './LeaderboardScreen.css'

function LeaderboardScreen({ onBack, snapshot }) {
  const leaderboard = getLeaderboard()
  
  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le classement ?')) {
      resetLeaderboard()
      window.location.reload() // Recharger pour mettre à jour l'affichage
    }
  }

  const getMedal = (position) => {
    if (position === 1) return '🥇'
    if (position === 2) return '🥈'
    if (position === 3) return '🥉'
    return null
  }

  return (
    <div className="leaderboard-screen">
      <div className="leaderboard-card">
        <div className="leaderboard-header">
          <h1 className="leaderboard-title">🏆 Classement</h1>
          <button className="back-button" onClick={onBack}>
            ← Retour
          </button>
        </div>

        {leaderboard.length === 0 ? (
          <div className="empty-leaderboard">
            <p>📊 Aucun score enregistré</p>
            <p className="empty-hint">Jouez une partie pour apparaître ici !</p>
          </div>
        ) : (
          <>
            <div className="leaderboard-stats">
              <div className="stat-item">
                <span className="stat-label">Parties jouées</span>
                <span className="stat-value">{leaderboard.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Meilleur score</span>
                <span className="stat-value">{leaderboard[0]?.score || 'N/A'}</span>
              </div>
            </div>

            <div className="leaderboard-list">
              <div className="leaderboard-header-row">
                <span className="rank-header">#</span>
                <span className="score-header">Score</span>
                <span className="date-header">Date</span>
              </div>
              
              {leaderboard.map((entry, index) => {
                const position = index + 1
                const medal = getMedal(position)
                const isTopThree = position <= 3
                
                return (
                  <div 
                    key={entry.id || index} 
                    className={`leaderboard-entry ${isTopThree ? 'top-three' : ''}`}
                  >
                    <div className="entry-rank">
                      {medal || `#${position}`}
                    </div>
                    <div className="entry-score">
                      {entry.score} <span className="score-unit">pts</span>
                    </div>
                    <div className="entry-date">
                      {formatDate(entry.date)}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="leaderboard-actions">
              <button className="reset-button" onClick={handleReset}>
                Réinitialiser
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LeaderboardScreen

