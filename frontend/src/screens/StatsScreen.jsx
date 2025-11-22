import React from 'react'
import { getGameHistory, getStats, calculateLevel, formatDate } from '../utils/storage'
import { getUnlockedBadges, BADGES, BADGE_CATEGORIES } from '../utils/badges'
import './StatsScreen.css'

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

function StatsScreen({ onBack }) {
  const history = getGameHistory()
  const stats = getStats()
  const levelData = calculateLevel()
  const unlockedBadgeIds = getUnlockedBadges()
  
  // Calculer les statistiques par catégorie
  const categoryStats = Object.entries(stats.byCategory || {}).map(([cat, data]) => ({
    category: cat,
    name: CATEGORY_NAMES[cat] || cat,
    ...data
  })).sort((a, b) => b.total - a.total)
  
  // Préparer les données pour le graphique (10 dernières parties)
  const recentGames = history.slice(0, 10).reverse()
  const chartData = recentGames.map((game, index) => ({
    x: index + 1,
    score: game.score
  }))
  
  // Organiser les badges par catégorie
  const badgesByCategory = Object.keys(BADGE_CATEGORIES).map(category => ({
    category,
    name: BADGE_CATEGORIES[category],
    badges: Object.values(BADGES)
      .filter(badge => badge.category === category)
      .map(badge => ({
        ...badge,
        unlocked: unlockedBadgeIds.includes(badge.id)
      }))
  }))
  
  const totalBadges = Object.keys(BADGES).length
  const unlockedCount = unlockedBadgeIds.length

  return (
    <div className="stats-screen">
      <div className="stats-card">
        <div className="stats-header">
          <h1 className="stats-title">📊 Statistiques</h1>
          <button className="back-button" onClick={onBack}>
            ← Retour
          </button>
        </div>

        {/* Niveau et progression */}
        <div className="level-section">
          <div className="level-info">
            <div className="level-badge">Niveau {levelData.level}</div>
            <div className="xp-info">
              <div className="xp-bar">
                <div 
                  className="xp-fill" 
                  style={{ width: `${levelData.progress}%` }}
                ></div>
              </div>
              <div className="xp-text">
                {levelData.xpInLevel} / {levelData.xpForNextLevel} XP
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-value">{stats.totalGames || 0}</div>
            <div className="stat-label">Parties jouées</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{stats.bestScore || 'N/A'}</div>
            <div className="stat-label">Meilleur score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-value">{stats.averageScore || 0}</div>
            <div className="stat-label">Score moyen</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">{stats.bestStreak || 0}</div>
            <div className="stat-label">Meilleure série</div>
          </div>
        </div>

        {/* Graphique d'évolution */}
        {recentGames.length > 0 && (
          <div className="chart-section">
            <h2>Évolution des scores (10 dernières parties)</h2>
            <div className="chart-container">
              <div className="chart">
                {chartData.map((point, index) => {
                  const maxScore = Math.max(...chartData.map(p => p.score), 200)
                  const height = (point.score / maxScore) * 100
                  return (
                    <div key={index} className="chart-bar-container">
                      <div 
                        className="chart-bar"
                        style={{ height: `${100 - height}%` }}
                        title={`Partie ${point.x}: ${point.score} pts`}
                      >
                        <span className="chart-value">{point.score}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Statistiques par catégorie */}
        {categoryStats.length > 0 && (
          <div className="category-stats-section">
            <h2>Performance par catégorie</h2>
            <div className="category-stats-list">
              {categoryStats.map((cat, index) => (
                <div key={index} className="category-stat-item">
                  <div className="category-stat-header">
                    <span className="category-stat-name">{cat.name}</span>
                    <span className="category-stat-count">{cat.total} placements</span>
                  </div>
                  <div className="category-stat-details">
                    <span>Meilleur: {cat.best}</span>
                    <span>Moyenne: {cat.average}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collection de badges */}
        <div className="badges-section">
          <div className="badges-header">
            <h2>🏆 Badges</h2>
            <div className="badges-progress">
              {unlockedCount} / {totalBadges} débloqués
            </div>
          </div>
          <div className="badges-progress-bar">
            <div 
              className="badges-progress-fill" 
              style={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
            ></div>
          </div>
          {badgesByCategory.map((category, catIndex) => (
            <div key={catIndex} className="badge-category">
              <h3 className="badge-category-title">{category.name}</h3>
              <div className="badges-grid">
                {category.badges.map((badge, badgeIndex) => (
                  <div 
                    key={badgeIndex} 
                    className={`badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`}
                    title={badge.unlocked ? badge.description : 'Badge verrouillé'}
                  >
                    <div 
                      className="badge-icon" 
                      style={{ 
                        color: badge.unlocked ? badge.color : '#ccc',
                        filter: badge.unlocked ? 'none' : 'grayscale(100%)'
                      }}
                    >
                      {badge.icon}
                    </div>
                    <div className="badge-name">{badge.name}</div>
                    {badge.unlocked && (
                      <div className="badge-check">✓</div>
                    )}
                    {!badge.unlocked && (
                      <div className="badge-lock">🔒</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Historique récent */}
        {history.length > 0 && (
          <div className="history-section">
            <h2>Historique récent</h2>
            <div className="history-list">
              {history.slice(0, 10).map((game, index) => (
                <div key={game.id || index} className="history-item">
                  <div className="history-score">{game.score} pts</div>
                  <div className="history-date">{formatDate(game.timestamp)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length === 0 && (
          <div className="empty-stats">
            <p>📊 Aucune statistique disponible</p>
            <p className="empty-hint">Jouez des parties pour voir vos statistiques !</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsScreen

