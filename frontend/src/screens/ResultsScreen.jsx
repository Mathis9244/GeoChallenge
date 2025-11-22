import React from 'react'
import './ResultsScreen.css'

const CATEGORY_NAMES = {
  small_area: 'Petite superficie',
  gdp: 'PIB global',
  capital_pop: 'Grande capitale',
  military: 'Taille de l\'armée',
  football: 'Football',
  eez: 'Taille ZEE',
  rice: 'Production de riz',
  francophones: 'Francophones'
}

function ResultsScreen({ gameData, snapshot, personalBest, isNewRecord, onReplay, onShowLeaderboard }) {
  const { results, score } = gameData
  
  const getScoreColor = (score) => {
    if (score <= 50) return '#4caf50' // Excellent
    if (score <= 100) return '#ff9800' // Bon
    return '#f44336' // À améliorer
  }

  const getScoreMessage = (score) => {
    if (score <= 50) return 'Excellent ! 🎉'
    if (score <= 100) return 'Bon score ! 👍'
    return 'Peut mieux faire ! 💪'
  }

  return (
    <div className="results-screen">
      <div className="results-card">
        <h1 className="results-title">Résultats</h1>
        
        <div className="final-score" style={{ color: getScoreColor(score) }}>
          {isNewRecord && (
            <div className="new-record-badge">
              🏆 Nouveau record personnel !
            </div>
          )}
          <div className="score-value">{score}</div>
          <div className="score-label">points</div>
          <div className="score-message">{getScoreMessage(score)}</div>
          {personalBest !== null && (
            <div className="personal-best-display">
              <span className="pb-label">Meilleur score: </span>
              <span className="pb-value">{personalBest} points</span>
            </div>
          )}
        </div>

        <div className="results-table">
          <h2>Détail des placements</h2>
          <table>
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Pays</th>
                <th>Rang</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>
                    <span className="category-cell">
                      {CATEGORY_NAMES[result.category] || result.category}
                    </span>
                  </td>
                  <td>
                    <span className="country-cell">
                      <img 
                        src={result.flag || 'https://flagcdn.com/w40/xx.png'} 
                        alt={`Drapeau ${result.countryName}`}
                        className="flag-emoji"
                        onError={(e) => {
                          e.target.src = 'https://flagcdn.com/w40/xx.png'
                        }}
                      />
                      <span className="country-name">{result.countryName}</span>
                    </span>
                  </td>
                  <td className="rank-cell">{result.rank}</td>
                  <td className="points-cell">+{result.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="results-actions">
          <button className="replay-button" onClick={onReplay}>
            Rejouer
          </button>
          <button 
            className="leaderboard-button-results" 
            onClick={onShowLeaderboard}
          >
            🏆 Classement
          </button>
          <button 
            className="share-button" 
            onClick={() => {
              const text = `J'ai obtenu ${score} points au Géo Challenge ! 🌍`
              navigator.clipboard?.writeText(text).then(() => {
                alert('Score copié dans le presse-papier !')
              })
            }}
          >
            Partager
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultsScreen

