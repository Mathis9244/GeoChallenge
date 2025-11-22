import React, { useState, useEffect } from 'react'
import HomeScreen from './screens/HomeScreen'
import GameScreen from './screens/GameScreen'
import ResultsScreen from './screens/ResultsScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import { getPersonalBest, savePersonalBest, addToLeaderboard } from './utils/storage'
import './App.css'

function App() {
  const [screen, setScreen] = useState('home')
  const [gameData, setGameData] = useState(null)
  const [snapshot, setSnapshot] = useState(null)
  const [personalBest, setPersonalBest] = useState(null)
  const [isNewRecord, setIsNewRecord] = useState(false)

  useEffect(() => {
    // Charger le snapshot depuis le dossier public
    fetch('/snapshot-2025-11.json')
      .then(res => {
        if (!res.ok) throw new Error('Snapshot non trouvé')
        return res.json()
      })
      .then(data => setSnapshot(data))
      .catch(err => {
        console.error('Erreur chargement snapshot:', err)
        // Fallback pour développement
        setSnapshot({
          meta: { season: "2025-11" },
          countries: {}
        })
      })
    
    // Charger le personal best
    setPersonalBest(getPersonalBest())
  }, [])

  const startGame = () => {
    if (!snapshot) return
    
    // Sélectionner 8 pays aléatoirement
    const countryCodes = Object.keys(snapshot.countries)
    const shuffled = [...countryCodes].sort(() => Math.random() - 0.5)
    const selectedCountries = shuffled.slice(0, 8)
    
    setGameData({
      countries: selectedCountries,
      currentIndex: 0,
      assignments: {},
      score: 0,
      results: []
    })
    setScreen('game')
  }

  const handleCategorySelect = (category) => {
    if (!gameData || !snapshot) return
    
    const { countries, currentIndex, assignments, score, results } = gameData
    
    // Vérifier que la catégorie est libre
    if (assignments[category]) return
    
    const currentCountry = countries[currentIndex]
    const countryData = snapshot.countries[currentCountry]
    const rank = countryData?.ranks[category] || 196
    
    const newAssignments = { ...assignments, [category]: currentCountry }
    const newScore = score + rank
    const newResults = [...results, {
      category,
      country: currentCountry,
      countryName: countryData?.name || currentCountry,
      rank,
      flag: countryData?.flag || '🏳️'
    }]
    
    if (currentIndex + 1 >= 8) {
      // Fin du jeu - vérifier si c'est un nouveau record
      const isNewPB = savePersonalBest(newScore)
      setIsNewRecord(isNewPB)
      if (isNewPB) {
        setPersonalBest(newScore)
      }
      
      // Ajouter au classement
      addToLeaderboard(newScore, countries)
      
      setGameData({
        ...gameData,
        assignments: newAssignments,
        score: newScore,
        results: newResults
      })
      setScreen('results')
    } else {
      setGameData({
        countries,
        currentIndex: currentIndex + 1,
        assignments: newAssignments,
        score: newScore,
        results: newResults
      })
    }
  }

  const resetGame = () => {
    setScreen('home')
    setGameData(null)
    setIsNewRecord(false)
    // Recharger le personal best au cas où il aurait changé
    setPersonalBest(getPersonalBest())
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
      {screen === 'home' && (
        <HomeScreen 
          onStart={startGame} 
          personalBest={personalBest}
          onShowLeaderboard={() => setScreen('leaderboard')}
        />
      )}
      {screen === 'game' && gameData && (
        <GameScreen
          gameData={gameData}
          snapshot={snapshot}
          onCategorySelect={handleCategorySelect}
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
    </div>
  )
}

export default App

