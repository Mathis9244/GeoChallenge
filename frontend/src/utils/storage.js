/**
 * Utilitaires pour le stockage local (localStorage)
 */

const STORAGE_KEY = 'geo-challenge-pb'
const LEADERBOARD_KEY = 'geo-challenge-leaderboard'
const MAX_LEADERBOARD_ENTRIES = 50

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

