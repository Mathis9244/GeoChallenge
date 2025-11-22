// Script Node.js pour générer les icônes PWA
// Utilise canvas pour créer les icônes programmatiquement

const fs = require('fs')
const path = require('path')

// Pour générer les icônes, vous pouvez :
// 1. Utiliser l'outil en ligne : https://www.pwabuilder.com/imageGenerator
// 2. Utiliser un outil comme ImageMagick ou Sharp
// 3. Créer manuellement des icônes 192x192 et 512x512

// Pour l'instant, créons un fichier SVG simple qui peut être converti
const createIconSVG = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.35}" fill="white"/>
  <text x="${size / 2}" y="${size / 2}" font-size="${size * 0.4}" text-anchor="middle" dominant-baseline="middle" fill="#667eea" font-weight="bold">🌍</text>
</svg>`
}

console.log('Pour générer les icônes PWA :')
console.log('1. Ouvrez frontend/public/icon-generator.html dans votre navigateur')
console.log('2. Les icônes seront téléchargées automatiquement')
console.log('3. Placez-les dans frontend/public/')
console.log('')
console.log('Ou utilisez un outil en ligne comme :')
console.log('- https://www.pwabuilder.com/imageGenerator')
console.log('- https://realfavicongenerator.net/')

