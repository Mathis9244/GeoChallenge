import React, { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { QRCodeSVG } from 'qrcode.react'
import './ShareModal.css'

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

function ShareModal({ gameData, score, personalBest, isNewRecord, optimalScore, efficiency, onClose }) {
  const [activeTab, setActiveTab] = useState('image') // 'image', 'qr', 'export'
  const [isGenerating, setIsGenerating] = useState(false)
  const shareImageRef = useRef(null)

  const generateShareImage = async () => {
    if (!shareImageRef.current) return
    
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(shareImageRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      })
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `geo-challenge-${score}pts-${Date.now()}.png`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        setIsGenerating(false)
      }, 'image/png')
    } catch (error) {
      console.error('Erreur lors de la génération de l\'image:', error)
      alert('Erreur lors de la génération de l\'image')
      setIsGenerating(false)
    }
  }

  const copyImageToClipboard = async () => {
    if (!shareImageRef.current) return
    
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(shareImageRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      })
      
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
          alert('Image copiée dans le presse-papier !')
        } catch (err) {
          console.error('Erreur lors de la copie:', err)
          alert('Impossible de copier l\'image. Téléchargez-la à la place.')
        }
        setIsGenerating(false)
      }, 'image/png')
    } catch (error) {
      console.error('Erreur lors de la génération de l\'image:', error)
      alert('Erreur lors de la génération de l\'image')
      setIsGenerating(false)
    }
  }

  const shareText = () => {
    const text = `J'ai obtenu ${score} points au Géo Challenge ! 🌍\n\n${isNewRecord ? '🏆 Nouveau record personnel !\n' : ''}${efficiency ? `Efficacité: ${efficiency}%\n` : ''}${optimalScore ? `Score optimal: ${optimalScore} points\n` : ''}\nRelevez le défi : https://geochallenge.app`
    navigator.clipboard?.writeText(text).then(() => {
      alert('Texte copié dans le presse-papier !')
    })
  }

  const exportJSON = () => {
    const data = {
      score,
      personalBest,
      isNewRecord,
      optimalScore,
      efficiency,
      duration: gameData.duration,
      results: gameData.results,
      timestamp: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `geo-challenge-results-${Date.now()}.json`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const headers = ['Catégorie', 'Pays', 'Rang', 'Points']
    const rows = gameData.results.map(r => [
      CATEGORY_NAMES[r.category] || r.category,
      r.countryName,
      r.rank,
      r.rank
    ])
    
    const csv = [
      ['Score', score],
      ['Meilleur score', personalBest || 'N/A'],
      ['Score optimal', optimalScore || 'N/A'],
      ['Efficacité', efficiency ? `${efficiency}%` : 'N/A'],
      ['Durée', gameData.duration ? `${Math.round(gameData.duration / 1000)}s` : 'N/A'],
      [],
      ...headers.map(h => [h]),
      ...rows
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `geo-challenge-results-${Date.now()}.csv`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  const shareUrl = window.location.origin + window.location.pathname
  const shareData = {
    score,
    personalBest,
    isNewRecord,
    optimalScore,
    efficiency,
    timestamp: Date.now()
  }
  const qrData = `${shareUrl}?share=${encodeURIComponent(JSON.stringify(shareData))}`

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <button className="share-modal-close" onClick={onClose}>×</button>
        <h2 className="share-modal-title">Partager votre score</h2>
        
        <div className="share-modal-tabs">
          <button 
            className={`share-tab ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => setActiveTab('image')}
          >
            📷 Image
          </button>
          <button 
            className={`share-tab ${activeTab === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            📱 QR Code
          </button>
          <button 
            className={`share-tab ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            💾 Export
          </button>
        </div>

        <div className="share-modal-content">
          {activeTab === 'image' && (
            <div className="share-image-section">
              <div className="share-image-preview" ref={shareImageRef}>
                <div className="share-image-header">
                  <h1 className="share-image-title">Géo Challenge</h1>
                  <div className="share-image-score">
                    {isNewRecord && (
                      <div className="share-image-badge">🏆 Nouveau record !</div>
                    )}
                    <div className="share-image-score-value">{score}</div>
                    <div className="share-image-score-label">points</div>
                    {personalBest !== null && (
                      <div className="share-image-pb">Meilleur: {personalBest} pts</div>
                    )}
                    {optimalScore && (
                      <div className="share-image-optimal">Optimal: {optimalScore} pts</div>
                    )}
                    {efficiency && (
                      <div className="share-image-efficiency">Efficacité: {efficiency}%</div>
                    )}
                  </div>
                </div>
                <div className="share-image-results">
                  <h3>Détail des placements</h3>
                  <div className="share-image-table">
                    {gameData.results.slice(0, 5).map((result, index) => (
                      <div key={index} className="share-image-row">
                        <span className="share-image-category">
                          {CATEGORY_NAMES[result.category] || result.category}
                        </span>
                        <span className="share-image-country">{result.countryName}</span>
                        <span className="share-image-rank">#{result.rank}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="share-image-footer">
                  <div className="share-image-url">geochallenge.app</div>
                </div>
              </div>
              <div className="share-image-actions">
                <button 
                  className="share-button-primary"
                  onClick={generateShareImage}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Génération...' : '📥 Télécharger l\'image'}
                </button>
                {navigator.clipboard && (
                  <button 
                    className="share-button-secondary"
                    onClick={copyImageToClipboard}
                    disabled={isGenerating}
                  >
                    📋 Copier l'image
                  </button>
                )}
                <button 
                  className="share-button-secondary"
                  onClick={shareText}
                >
                  📝 Copier le texte
                </button>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="share-qr-section">
              <div className="share-qr-container">
                <QRCodeSVG 
                  value={qrData}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
                <div className="share-qr-info">
                  <p>Scannez ce QR code pour partager votre score !</p>
                  <div className="share-qr-url">{shareUrl}</div>
                </div>
              </div>
              <div className="share-qr-actions">
                <button 
                  className="share-button-primary"
                  onClick={async () => {
                    const svg = document.querySelector('.share-qr-section svg')
                    if (svg) {
                      const svgData = new XMLSerializer().serializeToString(svg)
                      const canvas = document.createElement('canvas')
                      const ctx = canvas.getContext('2d')
                      const img = new Image()
                      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
                      const url = URL.createObjectURL(svgBlob)
                      
                      img.onload = () => {
                        canvas.width = img.width
                        canvas.height = img.height
                        ctx.drawImage(img, 0, 0)
                        canvas.toBlob((blob) => {
                          const downloadUrl = URL.createObjectURL(blob)
                          const link = document.createElement('a')
                          link.download = `geo-challenge-qr-${Date.now()}.png`
                          link.href = downloadUrl
                          link.click()
                          URL.revokeObjectURL(downloadUrl)
                          URL.revokeObjectURL(url)
                        }, 'image/png')
                      }
                      img.src = url
                    }
                  }}
                >
                  📥 Télécharger le QR code
                </button>
                <button 
                  className="share-button-secondary"
                  onClick={shareText}
                >
                  📝 Copier le texte
                </button>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="share-export-section">
              <h3>Exporter vos résultats</h3>
              <p>Choisissez le format d'export :</p>
              <div className="share-export-actions">
                <button 
                  className="share-button-primary"
                  onClick={exportJSON}
                >
                  📄 Exporter en JSON
                </button>
                <button 
                  className="share-button-primary"
                  onClick={exportCSV}
                >
                  📊 Exporter en CSV
                </button>
                <button 
                  className="share-button-secondary"
                  onClick={shareText}
                >
                  📝 Copier le texte
                </button>
              </div>
              <div className="share-export-preview">
                <h4>Aperçu des données :</h4>
                <pre className="share-export-data">
{JSON.stringify({
  score,
  personalBest,
  isNewRecord,
  optimalScore,
  efficiency,
  duration: gameData.duration ? `${Math.round(gameData.duration / 1000)}s` : null,
  resultsCount: gameData.results.length
}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareModal

