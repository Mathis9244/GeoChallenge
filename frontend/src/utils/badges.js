/**
 * Système de badges pour les accomplissements
 */

const BADGES_KEY = 'geo-challenge-badges'

// Définition de tous les badges disponibles
export const BADGES = {
  // Badges de progression
  FIRST_GAME: {
    id: 'first_game',
    name: 'Premier pas',
    description: 'Terminer votre première partie',
    icon: '🎮',
    color: '#4caf50',
    category: 'progression'
  },
  FIVE_GAMES: {
    id: 'five_games',
    name: 'Habitué',
    description: 'Jouer 5 parties',
    icon: '🎯',
    color: '#2196f3',
    category: 'progression'
  },
  TWENTY_GAMES: {
    id: 'twenty_games',
    name: 'Passionné',
    description: 'Jouer 20 parties',
    icon: '🔥',
    color: '#ff9800',
    category: 'progression'
  },
  FIFTY_GAMES: {
    id: 'fifty_games',
    name: 'Expert',
    description: 'Jouer 50 parties',
    icon: '⭐',
    color: '#9c27b0',
    category: 'progression'
  },
  
  // Badges de score
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Score parfait',
    description: 'Obtenir le score optimal',
    icon: '💯',
    color: '#ffd700',
    category: 'score'
  },
  TOP_10_SCORE: {
    id: 'top_10_score',
    name: 'Top 10',
    description: 'Obtenir un score dans le top 10',
    icon: '🏆',
    color: '#ff6b6b',
    category: 'score'
  },
  TOP_50_SCORE: {
    id: 'top_50_score',
    name: 'Top 50',
    description: 'Obtenir un score dans le top 50',
    icon: '🥇',
    color: '#4ecdc4',
    category: 'score'
  },
  
  // Badges de performance
  STREAK_5: {
    id: 'streak_5',
    name: 'Série de 5',
    description: 'Jouer 5 jours consécutifs',
    icon: '📅',
    color: '#667eea',
    category: 'performance'
  },
  STREAK_10: {
    id: 'streak_10',
    name: 'Série de 10',
    description: 'Jouer 10 jours consécutifs',
    icon: '📆',
    color: '#764ba2',
    category: 'performance'
  },
  STREAK_30: {
    id: 'streak_30',
    name: 'Série de 30',
    description: 'Jouer 30 jours consécutifs',
    icon: '🗓️',
    color: '#f0932b',
    category: 'performance'
  },
  
  // Badges de difficulté
  EASY_MASTER: {
    id: 'easy_master',
    name: 'Maître Facile',
    description: 'Gagner 10 parties en mode Facile',
    icon: '🌱',
    color: '#4caf50',
    category: 'difficulty'
  },
  NORMAL_MASTER: {
    id: 'normal_master',
    name: 'Maître Normal',
    description: 'Gagner 10 parties en mode Normal',
    icon: '📚',
    color: '#2196f3',
    category: 'difficulty'
  },
  HARD_MASTER: {
    id: 'hard_master',
    name: 'Maître Difficile',
    description: 'Gagner 10 parties en mode Difficile',
    icon: '⚔️',
    color: '#ff9800',
    category: 'difficulty'
  },
  EXPERT_MASTER: {
    id: 'expert_master',
    name: 'Maître Expert',
    description: 'Gagner 10 parties en mode Expert',
    icon: '👑',
    color: '#9c27b0',
    category: 'difficulty'
  },
  
  // Badges spéciaux
  NO_HINTS: {
    id: 'no_hints',
    name: 'Sans aide',
    description: 'Terminer une partie sans utiliser d\'indices',
    icon: '🧠',
    color: '#607d8b',
    category: 'special'
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Éclair',
    description: 'Terminer une partie en moins de 2 minutes',
    icon: '⚡',
    color: '#ffd700',
    category: 'special'
  },
  PERFECTIONIST: {
    id: 'perfectionist',
    name: 'Perfectionniste',
    description: 'Obtenir 3 scores parfaits',
    icon: '✨',
    color: '#e91e63',
    category: 'special'
  }
}

// Catégories de badges
export const BADGE_CATEGORIES = {
  progression: 'Progression',
  score: 'Scores',
  performance: 'Performance',
  difficulty: 'Difficulté',
  special: 'Spéciaux'
}

/**
 * Récupère tous les badges débloqués
 */
export function getUnlockedBadges() {
  try {
    const badges = localStorage.getItem(BADGES_KEY)
    return badges ? JSON.parse(badges) : []
  } catch (error) {
    console.error('Erreur lecture badges:', error)
    return []
  }
}

/**
 * Vérifie si un badge est débloqué
 */
export function isBadgeUnlocked(badgeId) {
  const unlocked = getUnlockedBadges()
  return unlocked.includes(badgeId)
}

/**
 * Débloque un badge
 */
export function unlockBadge(badgeId) {
  try {
    const unlocked = getUnlockedBadges()
    if (!unlocked.includes(badgeId)) {
      unlocked.push(badgeId)
      localStorage.setItem(BADGES_KEY, JSON.stringify(unlocked))
      return true // Nouveau badge débloqué
    }
    return false // Badge déjà débloqué
  } catch (error) {
    console.error('Erreur déblocage badge:', error)
    return false
  }
}

/**
 * Réinitialise tous les badges (pour les tests)
 */
export function resetBadges() {
  try {
    localStorage.removeItem(BADGES_KEY)
  } catch (error) {
    console.error('Erreur réinitialisation badges:', error)
  }
}

/**
 * Vérifie et débloque les badges basés sur les statistiques
 */
export function checkBadges(stats, gameData = null) {
  const newBadges = []
  
  if (!stats) return newBadges
  
  // Badges de progression
  if (stats.totalGames >= 1 && !isBadgeUnlocked(BADGES.FIRST_GAME.id)) {
    unlockBadge(BADGES.FIRST_GAME.id)
    newBadges.push(BADGES.FIRST_GAME)
  }
  if (stats.totalGames >= 5 && !isBadgeUnlocked(BADGES.FIVE_GAMES.id)) {
    unlockBadge(BADGES.FIVE_GAMES.id)
    newBadges.push(BADGES.FIVE_GAMES)
  }
  if (stats.totalGames >= 20 && !isBadgeUnlocked(BADGES.TWENTY_GAMES.id)) {
    unlockBadge(BADGES.TWENTY_GAMES.id)
    newBadges.push(BADGES.TWENTY_GAMES)
  }
  if (stats.totalGames >= 50 && !isBadgeUnlocked(BADGES.FIFTY_GAMES.id)) {
    unlockBadge(BADGES.FIFTY_GAMES.id)
    newBadges.push(BADGES.FIFTY_GAMES)
  }
  
  // Badges de score
  if (gameData && gameData.score) {
    const optimalScore = gameData.optimalScore || gameData.score
    if (gameData.score === optimalScore && !isBadgeUnlocked(BADGES.PERFECT_SCORE.id)) {
      unlockBadge(BADGES.PERFECT_SCORE.id)
      newBadges.push(BADGES.PERFECT_SCORE)
    }
    if (gameData.score <= 10 && !isBadgeUnlocked(BADGES.TOP_10_SCORE.id)) {
      unlockBadge(BADGES.TOP_10_SCORE.id)
      newBadges.push(BADGES.TOP_10_SCORE)
    }
    if (gameData.score <= 50 && !isBadgeUnlocked(BADGES.TOP_50_SCORE.id)) {
      unlockBadge(BADGES.TOP_50_SCORE.id)
      newBadges.push(BADGES.TOP_50_SCORE)
    }
  }
  
  // Badges de performance (séries)
  if (stats.currentStreak >= 5 && !isBadgeUnlocked(BADGES.STREAK_5.id)) {
    unlockBadge(BADGES.STREAK_5.id)
    newBadges.push(BADGES.STREAK_5)
  }
  if (stats.currentStreak >= 10 && !isBadgeUnlocked(BADGES.STREAK_10.id)) {
    unlockBadge(BADGES.STREAK_10.id)
    newBadges.push(BADGES.STREAK_10)
  }
  if (stats.currentStreak >= 30 && !isBadgeUnlocked(BADGES.STREAK_30.id)) {
    unlockBadge(BADGES.STREAK_30.id)
    newBadges.push(BADGES.STREAK_30)
  }
  
  // Badges spéciaux
  if (gameData) {
    // Pas d'indices utilisés
    if (gameData.hintCost === 0 && !isBadgeUnlocked(BADGES.NO_HINTS.id)) {
      unlockBadge(BADGES.NO_HINTS.id)
      newBadges.push(BADGES.NO_HINTS)
    }
    
    // Vitesse
    if (gameData.duration && gameData.duration < 120000 && !isBadgeUnlocked(BADGES.SPEED_DEMON.id)) {
      unlockBadge(BADGES.SPEED_DEMON.id)
      newBadges.push(BADGES.SPEED_DEMON)
    }
  }
  
  return newBadges
}

