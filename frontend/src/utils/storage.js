/**
 * Utilitaires pour le stockage local (localStorage)
 */

const STORAGE_KEY = 'geo-challenge-pb'
const LEADERBOARD_KEY = 'geo-challenge-leaderboard'
const HISTORY_KEY = 'geo-challenge-history'
const SETTINGS_KEY = 'geo-challenge-settings'
const STATS_KEY = 'geo-challenge-stats'
const TUTORIAL_KEY = 'geo-challenge-tutorial'
const MAX_LEADERBOARD_ENTRIES = 50
const MAX_HISTORY_ENTRIES = 100

/**
 * Récupère le personal best depuis le localStorage
 * @returns {number|null} Le meilleur score ou null si aucun
 */
export function getPersonalBest() {
  try {
    const pb = localStorage.getItem(STORAGE_KEY)
    return pb ? parseInt(pb, 10) : null
  } catch (error) {
    console.error('Erreur lecture localStorage:', error)
    return null
  }
}

/**
 * Sauvegarde un nouveau personal best
 * @param {number} score - Le score à sauvegarder
 * @returns {boolean} True si c'est un nouveau record, false sinon
 */
export function savePersonalBest(score) {
  try {
    const currentPB = getPersonalBest()
    
    // Si pas de PB ou si le nouveau score est meilleur (plus petit)
    if (currentPB === null || score < currentPB) {
      localStorage.setItem(STORAGE_KEY, score.toString())
      return true // Nouveau record
    }
    
    return false // Pas de nouveau record
  } catch (error) {
    console.error('Erreur écriture localStorage:', error)
    return false
  }
}

/**
 * Réinitialise le personal best
 */
export function resetPersonalBest() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Erreur suppression localStorage:', error)
  }
}

/**
 * Ajoute un score au classement
 * @param {number} score - Le score à ajouter
 * @param {Array} countries - Les pays joués (optionnel)
 * @returns {Object} Informations sur le score ajouté
 */
export function addToLeaderboard(score, countries = []) {
  try {
    const leaderboard = getLeaderboard()
    const entry = {
      score,
      date: new Date().toISOString(),
      countries: countries.slice(0, 8), // Limiter à 8 pays
      id: Date.now() + Math.random() // ID unique
    }
    
    leaderboard.push(entry)
    
    // Trier par score (croissant - meilleur score = plus petit)
    leaderboard.sort((a, b) => a.score - b.score)
    
    // Garder seulement les meilleurs scores
    const trimmed = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES)
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed))
    
    // Trouver la position du nouveau score
    const position = trimmed.findIndex(e => e.id === entry.id) + 1
    
    return {
      ...entry,
      position,
      isNewRecord: position === 1 && (leaderboard.length === 1 || score < leaderboard[1]?.score)
    }
  } catch (error) {
    console.error('Erreur ajout au classement:', error)
    return null
  }
}

/**
 * Récupère le classement complet
 * @returns {Array} Liste des scores triés
 */
export function getLeaderboard() {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Erreur lecture classement:', error)
    return []
  }
}

/**
 * Réinitialise le classement
 */
export function resetLeaderboard() {
  try {
    localStorage.removeItem(LEADERBOARD_KEY)
  } catch (error) {
    console.error('Erreur suppression classement:', error)
  }
}

/**
 * Formate une date pour l'affichage
 * @param {string} isoDate - Date au format ISO
 * @returns {string} Date formatée
 */
export function formatDate(isoDate) {
  try {
    const date = new Date(isoDate)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  } catch (error) {
    return isoDate
  }
}

/**
 * Sauvegarde une partie dans l'historique
 * @param {Object} gameData - Données de la partie
 * @returns {void}
 */
export function saveGameHistory(gameData) {
  try {
    const history = getGameHistory()
    const entry = {
      ...gameData,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString()
    }
    
    history.unshift(entry) // Ajouter au début
    const trimmed = history.slice(0, MAX_HISTORY_ENTRIES)
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
    updateStats(gameData)
  } catch (error) {
    console.error('Erreur sauvegarde historique:', error)
  }
}

/**
 * Récupère l'historique des parties
 * @returns {Array} Liste des parties
 */
export function getGameHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Erreur lecture historique:', error)
    return []
  }
}

/**
 * Met à jour les statistiques globales
 * @param {Object} gameData - Données de la partie
 */
function updateStats(gameData) {
  try {
    const stats = getStats()
    const { score, results } = gameData
    
    stats.totalGames = (stats.totalGames || 0) + 1
    stats.totalScore = (stats.totalScore || 0) + score
    stats.averageScore = Math.round(stats.totalScore / stats.totalGames)
    stats.bestScore = stats.bestScore ? Math.min(stats.bestScore, score) : score
    
    // Statistiques par catégorie
    if (!stats.byCategory) stats.byCategory = {}
    results.forEach(result => {
      if (!stats.byCategory[result.category]) {
        stats.byCategory[result.category] = { total: 0, sum: 0, best: Infinity }
      }
      stats.byCategory[result.category].total++
      stats.byCategory[result.category].sum += result.rank
      stats.byCategory[result.category].best = Math.min(
        stats.byCategory[result.category].best,
        result.rank
      )
      stats.byCategory[result.category].average = Math.round(
        stats.byCategory[result.category].sum / stats.byCategory[result.category].total
      )
    })
    
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error('Erreur mise à jour stats:', error)
  }
}

/**
 * Récupère les statistiques globales
 * @returns {Object} Statistiques
 */
export function getStats() {
  try {
    const data = localStorage.getItem(STATS_KEY)
    return data ? JSON.parse(data) : {
      totalGames: 0,
      totalScore: 0,
      averageScore: 0,
      bestScore: null,
      byCategory: {}
    }
  } catch (error) {
    console.error('Erreur lecture stats:', error)
    return {
      totalGames: 0,
      totalScore: 0,
      averageScore: 0,
      bestScore: null,
      byCategory: {}
    }
  }
}

/**
 * Réinitialise les statistiques
 */
export function resetStats() {
  try {
    localStorage.removeItem(STATS_KEY)
    localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    console.error('Erreur réinitialisation stats:', error)
  }
}

/**
 * Récupère les paramètres utilisateur
 * @returns {Object} Paramètres
 */
export function getSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    return data ? JSON.parse(data) : {
      theme: 'light',
      difficulty: 'normal', // 'easy', 'normal', 'hard', 'expert'
      selectedCategories: null, // null = toutes (selon difficulté)
      timerEnabled: false,
      timerDuration: 60, // secondes par pays
      hintsEnabled: true,
      soundEnabled: true
    }
  } catch (error) {
    console.error('Erreur lecture paramètres:', error)
    return {
      theme: 'light',
      difficulty: 'normal',
      selectedCategories: null,
      timerEnabled: false,
      timerDuration: 60,
      hintsEnabled: true,
      soundEnabled: true
    }
  }
}

/**
 * Sauvegarde les paramètres utilisateur
 * @param {Object} settings - Nouveaux paramètres
 */
export function saveSettings(settings) {
  try {
    const current = getSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Erreur sauvegarde paramètres:', error)
  }
}

/**
 * Gestion des streaks (séries)
 */
export function updateStreak(isWin) {
  try {
    const stats = getStats()
    const today = new Date().toDateString()
    const lastPlayDate = stats.lastPlayDate
    
    if (lastPlayDate === today) {
      // Déjà joué aujourd'hui
      return stats.currentStreak || 0
    }
    
    if (lastPlayDate && new Date(lastPlayDate).toDateString() === new Date(Date.now() - 86400000).toDateString()) {
      // Continuation de la série
      stats.currentStreak = (stats.currentStreak || 0) + 1
    } else {
      // Nouvelle série
      stats.currentStreak = 1
    }
    
    if (stats.currentStreak > (stats.bestStreak || 0)) {
      stats.bestStreak = stats.currentStreak
    }
    
    stats.lastPlayDate = today
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
    
    return stats.currentStreak
  } catch (error) {
    console.error('Erreur mise à jour streak:', error)
    return 0
  }
}

/**
 * Calcule le niveau basé sur les statistiques
 * @returns {Object} Niveau et XP
 */
export function calculateLevel() {
  try {
    const stats = getStats()
    const totalGames = stats.totalGames || 0
    const bestScore = stats.bestScore
    
    // XP basé sur les parties jouées et le meilleur score
    const xp = totalGames * 10 + (bestScore ? Math.max(0, 200 - bestScore) * 5 : 0)
    const level = Math.floor(xp / 100) + 1
    const xpInLevel = xp % 100
    const xpForNextLevel = 100
    
    return {
      level,
      xp,
      xpInLevel,
      xpForNextLevel,
      progress: (xpInLevel / xpForNextLevel) * 100
    }
  } catch (error) {
    console.error('Erreur calcul niveau:', error)
    return { level: 1, xp: 0, xpInLevel: 0, xpForNextLevel: 100, progress: 0 }
  }
}

/**
 * Vérifie si le tutoriel a été complété
 * @returns {boolean} True si le tutoriel a été complété
 */
export function isTutorialCompleted() {
  try {
    const completed = localStorage.getItem(TUTORIAL_KEY)
    return completed === 'true'
  } catch (error) {
    console.error('Erreur lecture tutoriel:', error)
    return false
  }
}

/**
 * Marque le tutoriel comme complété
 */
export function markTutorialCompleted() {
  try {
    localStorage.setItem(TUTORIAL_KEY, 'true')
  } catch (error) {
    console.error('Erreur sauvegarde tutoriel:', error)
  }
}

/**
 * Réinitialise le tutoriel (pour le refaire)
 */
export function resetTutorial() {
  try {
    localStorage.removeItem(TUTORIAL_KEY)
  } catch (error) {
    console.error('Erreur réinitialisation tutoriel:', error)
  }
}

