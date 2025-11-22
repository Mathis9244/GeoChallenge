import React, { useState, useEffect } from 'react'
import HomeScreen from './screens/HomeScreen'
import GameScreen from './screens/GameScreen'
import ResultsScreen from './screens/ResultsScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import StatsScreen from './screens/StatsScreen'
import SettingsScreen from './screens/SettingsScreen'
import TutorialOverlay from './components/TutorialOverlay'
import GameHint from './components/GameHint'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import OfflineIndicator from './components/OfflineIndicator'
import Confetti from './components/Confetti'
import PlacementFeedback from './components/PlacementFeedback'
import BadgeNotification from './components/BadgeNotification'
import { checkBadges } from './utils/badges'
import { getPersonalBest, savePersonalBest, addToLeaderboard, saveGameHistory, updateStreak, getSettings, isTutorialCompleted, markTutorialCompleted, getStats } from './utils/storage'
import './App.css'

function App() {
  const [screen, setScreen] = useState('home')
  const [gameData, setGameData] = useState(null)
  const [snapshot, setSnapshot] = useState(null)
  const [personalBest, setPersonalBest] = useState(null)
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [settings, setSettings] = useState(null)
  const [theme, setTheme] = useState('light')
  const [showTutorial, setShowTutorial] = useState(false)
  const [isFirstGame, setIsFirstGame] = useState(false)
  const [currentHint, setCurrentHint] = useState(null)
  const [showPlacementFeedback, setShowPlacementFeedback] = useState(null)
  const [newBadges, setNewBadges] = useState([])
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0)

  useEffect(() => {
    // Charger le snapshot depuis le dossier public
    // Le service worker cache ce fichier pour le mode hors-ligne
    fetch('/snapshot-2025-11.json', { cache: 'force-cache' })
      .then(res => {
        if (!res.ok) throw new Error('Snapshot non trouvé')
        return res.json()
      })
      .then(data => setSnapshot(data))
      .catch(err => {
        console.error('Erreur chargement snapshot:', err)
        // En mode hors-ligne, essayer de charger depuis le cache
        if (!navigator.onLine) {
          console.log('Mode hors-ligne détecté, tentative de chargement depuis le cache')
        }
        // Fallback pour développement
        setSnapshot({
          meta: { season: "2025-11" },
          countries: {}
        })
      })
    
    // Charger le personal best
    setPersonalBest(getPersonalBest())
    
    // Charger les paramètres
    const userSettings = getSettings()
    setSettings(userSettings)
    setTheme(userSettings.theme || 'light')
    
    // Appliquer le thème
    document.documentElement.setAttribute('data-theme', userSettings.theme || 'light')
    
    // Vérifier si le tutoriel doit être affiché
    if (!isTutorialCompleted()) {
      setShowTutorial(true)
    }
    
    // Écouter les mises à jour des paramètres
    const handleSettingsUpdate = (event) => {
      const newSettings = event.detail || getSettings()
      setSettings(newSettings)
      setTheme(newSettings.theme || 'light')
      document.documentElement.setAttribute('data-theme', newSettings.theme || 'light')
    }
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate)
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate)
    }
  }, [])

  const startGame = (customSettings = null) => {
    if (!snapshot) return
    
    // Toujours recharger les settings depuis localStorage pour avoir les dernières valeurs
    // Ignorer customSettings s'il s'agit d'un événement (clic du bouton)
    let gameSettings
    if (customSettings && (customSettings.nativeEvent || customSettings.type === 'click' || customSettings._reactName)) {
      // C'est un événement de clic, l'ignorer et recharger depuis localStorage
      gameSettings = getSettings()
      console.log('Detected click event, ignoring and loading fresh settings:', gameSettings)
    } else if (customSettings && typeof customSettings === 'object' && customSettings.difficulty !== undefined) {
      // C'est un objet de settings valide (a une propriété difficulty)
      gameSettings = customSettings
    } else {
      // Pas de customSettings ou invalide, recharger depuis localStorage
      gameSettings = getSettings()
      console.log('No custom settings, loading from localStorage:', gameSettings)
    }
    
    const difficulty = gameSettings.difficulty || 'normal'
    
    console.log('Starting game with difficulty:', difficulty, 'Settings:', gameSettings)
    
    // Définir les catégories et pays selon la difficulté
    const ALL_CATEGORIES = [
      'small_area', 'gdp', 'capital_pop', 'military', 
      'football', 'eez', 'rice', 'francophones'
    ]
    
    let numCategories, numCountries, availableCategories
    
    switch (difficulty) {
      case 'easy':
        numCategories = 6
        numCountries = 6
        // Prendre les 6 premières catégories
        availableCategories = ALL_CATEGORIES.slice(0, 6)
        break
      case 'normal':
        numCategories = 8
        numCountries = 8
        availableCategories = ALL_CATEGORIES
        break
      case 'hard':
        numCategories = 8 // On garde 8 catégories
        numCountries = 10 // Mais 10 pays - défi supplémentaire !
        availableCategories = ALL_CATEGORIES
        break
      case 'expert':
        numCategories = 8 // On garde 8 catégories
        numCountries = 12 // Mais 12 pays - défi maximum !
        availableCategories = ALL_CATEGORIES
        break
      default:
        numCategories = 8
        numCountries = 8
        availableCategories = ALL_CATEGORIES
    }
    
    // Si l'utilisateur a sélectionné manuellement des catégories, les utiliser
    // MAIS seulement si on n'est pas en mode easy/normal (qui ont leurs propres catégories)
    // En mode easy/normal, on ignore la sélection manuelle et on utilise les catégories du mode
    if (gameSettings.selectedCategories && gameSettings.selectedCategories.length > 0) {
      // En mode easy/normal, on ignore la sélection manuelle
      if (difficulty === 'easy' || difficulty === 'normal') {
        console.log('Ignoring manual category selection for', difficulty, 'mode')
      } else {
        // Pour hard/expert, on peut utiliser la sélection manuelle
        availableCategories = gameSettings.selectedCategories
        // Pour les modes hard/expert, on peut avoir plus de pays que de catégories
        if (difficulty === 'hard' || difficulty === 'expert') {
          // Garder le nombre de pays du mode, mais limiter si moins de catégories
          numCountries = Math.max(numCountries, availableCategories.length)
        }
      }
    }
    
    console.log('Game configuration:', {
      difficulty,
      numCountries,
      numCategories: availableCategories.length,
      availableCategories,
      selectedCategories: gameSettings.selectedCategories
    })
    
    // Sélectionner les pays aléatoirement
    const countryCodes = Object.keys(snapshot.countries)
    const shuffled = [...countryCodes].sort(() => Math.random() - 0.5)
    const selectedCountries = shuffled.slice(0, numCountries)
    
    const startTime = Date.now()
    
    // Vérifier si c'est la première partie
    const tutorialCompleted = isTutorialCompleted()
    const stats = getStats()
    const isFirst = !tutorialCompleted && (stats.totalGames || 0) === 0
    setIsFirstGame(isFirst)
    
    setGameData({
      countries: selectedCountries,
      currentIndex: 0,
      assignments: {},
      score: 0,
      results: [],
      startTime,
      timerEnabled: gameSettings.timerEnabled || false,
      timerDuration: gameSettings.timerDuration || 60,
      timeRemaining: gameSettings.timerEnabled ? (gameSettings.timerDuration || 60) : null,
      availableCategories,
      hintsUsed: [],
      hintCost: 0,
      history: [], // Historique pour undo
      undoCount: 0, // Nombre d'annulations utilisées
      maxUndos: 3 // Limite d'annulations par partie
    })
    setScreen('game')
    
    // Afficher un hint pour la première partie
    if (isFirst) {
      setTimeout(() => {
        setCurrentHint('firstCountry')
      }, 1000)
    }
  }

  const handleHintUsed = (cost) => {
    if (!gameData) return
    
    setGameData(prev => ({
      ...prev,
      score: prev.score + cost,
      hintCost: (prev.hintCost || 0) + cost
    }))
  }

  const handleUndo = () => {
    if (!gameData || !snapshot) return
    
    const { history, undoCount, maxUndos } = gameData
    
    // Vérifier qu'on peut annuler
    if (!history || history.length === 0 || undoCount >= maxUndos) return
    
    // Récupérer l'état précédent
    const previousState = history[history.length - 1]
    
    // Restaurer l'état précédent
    setGameData({
      ...gameData,
      currentIndex: previousState.currentIndex,
      assignments: previousState.assignments,
      score: previousState.score,
      results: previousState.results,
      history: history.slice(0, -1), // Retirer le dernier état de l'historique
      undoCount: undoCount + 1,
      timeRemaining: previousState.timeRemaining || gameData.timeRemaining
    })
    
    // Fermer le feedback de placement s'il est affiché
    setShowPlacementFeedback(null)
  }

  const handleCategorySelect = (category) => {
    if (!gameData || !snapshot) return
    
    const { countries, currentIndex, assignments, score, results, availableCategories, history } = gameData
    
    // Vérifier que la catégorie est disponible
    if (availableCategories && !availableCategories.includes(category)) return
    
    // Vérifier que la catégorie est libre
    // En mode hard/expert, on garde toujours 1 pays max par catégorie
    // Le défi vient du fait qu'on a plus de pays que de catégories disponibles
    if (assignments[category]) return
    
    // Sauvegarder l'état actuel dans l'historique avant de faire le changement
    const currentState = {
      currentIndex,
      assignments: { ...assignments },
      score,
      results: [...results],
      timeRemaining: gameData.timeRemaining
    }
    
    const currentCountry = countries[currentIndex]
    const countryData = snapshot.countries[currentCountry]
    const rank = countryData?.ranks[category] || 196
    
    // Afficher des hints contextuels pour la première partie
    if (isFirstGame) {
      setCurrentHint(null) // Fermer le hint actuel
      
      // Vérifier si c'est un bon placement
      const allRanks = Object.values(countryData?.ranks || {})
      const bestRank = Math.min(...allRanks.filter(r => r > 0))
      const isGoodPlacement = rank <= bestRank + 10
      
      setTimeout(() => {
        if (currentIndex === 0) {
          // Premier placement
          setCurrentHint(isGoodPlacement ? 'goodPlacement' : 'couldBeBetter')
        } else if (currentIndex === countries.length - 2) {
          // Avant-dernier pays
          setCurrentHint('lastCountry')
        } else if (currentIndex === Math.floor(countries.length / 2)) {
          // Milieu de partie
          setCurrentHint('midGame')
        }
      }, 500)
    }
    
    // Créer les nouveaux assignments
    // Note: En mode hard/expert, on garde 1 pays par catégorie max
    // Le défi vient du fait qu'on a plus de pays que de catégories
    const newAssignments = { ...assignments, [category]: currentCountry }
    
    // Calculer le nouveau score
    // En mode normal : score = somme des rangs
    // En mode hard/expert : même logique, mais avec plus de pays que de catégories
    // (certains pays devront être placés dans des catégories non optimales)
    const newScore = score + rank
    const newResults = [...results, {
      category,
      country: currentCountry,
      countryName: countryData?.name || currentCountry,
      rank,
      flag: countryData?.flag || '🏳️'
    }]
    
    // Ajouter l'état actuel à l'historique (avant le changement)
    const newHistory = [...(history || []), currentState]
    
    const totalCountries = countries.length
    if (currentIndex + 1 >= totalCountries) {
      // Fin du jeu - vérifier si c'est un nouveau record
      const isNewPB = savePersonalBest(newScore)
      setIsNewRecord(isNewPB)
      if (isNewPB) {
        setPersonalBest(newScore)
      }
      
      // Ajouter au classement
      addToLeaderboard(newScore, countries)
      
      // Sauvegarder dans l'historique
      const finalGameData = {
        ...gameData,
        assignments: newAssignments,
        score: newScore,
        results: newResults,
        endTime: Date.now(),
        duration: Date.now() - (gameData.startTime || Date.now()),
        optimalScore: gameData.optimalScore // Inclure le score optimal pour les badges
      }
      saveGameHistory(finalGameData)
      
      // Mettre à jour la série
      updateStreak(true)
      
      // Vérifier les badges
      const stats = getStats()
      const unlockedBadges = checkBadges(stats, finalGameData)
      if (unlockedBadges.length > 0) {
        setNewBadges(unlockedBadges)
        setCurrentBadgeIndex(0)
      }
      
      setGameData(finalGameData)
      setScreen('results')
    } else {
      // Réinitialiser le timer pour le prochain pays
      const nextTimeRemaining = gameData.timerEnabled ? (gameData.timerDuration || 60) : null
      
      setGameData({
        ...gameData,
        currentIndex: currentIndex + 1,
        assignments: newAssignments,
        score: newScore,
        results: newResults,
        timeRemaining: nextTimeRemaining,
        history: newHistory, // Sauvegarder l'historique
        undoCount: gameData.undoCount || 0
      })
    }
  }

  const resetGame = () => {
    setScreen('home')
    setGameData(null)
    setIsNewRecord(false)
    setIsFirstGame(false)
    setCurrentHint(null)
    // Recharger le personal best au cas où il aurait changé
    setPersonalBest(getPersonalBest())
  }
  
  const handleTutorialComplete = () => {
    markTutorialCompleted()
    setShowTutorial(false)
  }
  
  const handleTutorialSkip = () => {
    markTutorialCompleted()
    setShowTutorial(false)
  }

  if (!snapshot) {
    return (
      <div className="loading">
        <p>Chargement du snapshot...</p>
      </div>
    )
  }

  return (
    <div className="app">
      {showTutorial && (
        <TutorialOverlay
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}
      
      {currentHint && screen === 'game' && (
        <GameHint
          type={currentHint}
          onClose={() => setCurrentHint(null)}
        />
      )}
      
      {screen === 'home' && (
        <HomeScreen 
          onStart={startGame} 
          personalBest={personalBest}
          onShowLeaderboard={() => setScreen('leaderboard')}
          onShowStats={() => setScreen('stats')}
          onShowSettings={() => setScreen('settings')}
        />
      )}
      {screen === 'game' && gameData && (
        <GameScreen
          gameData={gameData}
          snapshot={snapshot}
          onCategorySelect={handleCategorySelect}
          onHintUsed={handleHintUsed}
          onUndo={handleUndo}
        />
      )}
      {screen === 'results' && gameData && (
        <ResultsScreen
          gameData={gameData}
          snapshot={snapshot}
          personalBest={personalBest}
          isNewRecord={isNewRecord}
          onReplay={resetGame}
          onShowLeaderboard={() => setScreen('leaderboard')}
        />
      )}
      {screen === 'leaderboard' && (
        <LeaderboardScreen
          snapshot={snapshot}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'stats' && (
        <StatsScreen
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onBack={() => {
            // Recharger les paramètres depuis le localStorage
            const newSettings = getSettings()
            setSettings(newSettings)
            setTheme(newSettings.theme || 'light')
            document.documentElement.setAttribute('data-theme', newSettings.theme || 'light')
            // Déclencher l'événement pour notifier les autres composants (comme HomeScreen)
            window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: newSettings }))
            setScreen('home')
          }}
        />
      )}
      
      {/* Composants PWA */}
      <PWAInstallPrompt />
      <OfflineIndicator />
      
      {/* Notifications de badges */}
      {newBadges.length > 0 && currentBadgeIndex < newBadges.length && (
        <BadgeNotification
          badge={newBadges[currentBadgeIndex]}
          onClose={() => {
            if (currentBadgeIndex < newBadges.length - 1) {
              setCurrentBadgeIndex(currentBadgeIndex + 1)
            } else {
              setNewBadges([])
              setCurrentBadgeIndex(0)
            }
          }}
        />
      )}
    </div>
  )
}

export default App

