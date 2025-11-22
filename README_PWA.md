# Guide d'installation PWA - Géo Challenge

## Génération des icônes

Pour générer les icônes nécessaires à l'installation PWA :

1. Ouvrez `frontend/public/icon-generator.html` dans votre navigateur
2. Les icônes `icon-192.png` et `icon-512.png` seront automatiquement téléchargées
3. Placez-les dans le dossier `frontend/public/`

## Installation

### En développement

1. Lancez le serveur de développement :
   ```bash
   cd frontend
   npm run dev
   ```

2. Le service worker sera automatiquement activé en mode développement

### En production

1. Build l'application :
   ```bash
   cd frontend
   npm run build
   ```

2. Le service worker sera généré automatiquement dans le dossier `dist/`

3. Déployez le contenu du dossier `dist/` sur votre serveur

## Fonctionnalités PWA

### Mode hors-ligne
- L'application fonctionne sans connexion Internet
- Les données du snapshot sont mises en cache
- Les drapeaux sont mis en cache pour 30 jours
- Les fichiers JSON sont mis en cache pour 1 jour

### Installation
- Sur mobile : l'utilisateur verra une bannière d'installation
- Sur desktop : l'utilisateur peut installer via le menu du navigateur
- L'application s'ouvre en mode standalone (sans barre d'adresse)

### Mises à jour
- Le service worker vérifie automatiquement les mises à jour
- L'utilisateur est notifié lorsqu'une nouvelle version est disponible

## Test du mode hors-ligne

1. Ouvrez l'application dans votre navigateur
2. Ouvrez les DevTools (F12)
3. Allez dans l'onglet "Application" > "Service Workers"
4. Cochez "Offline" pour simuler le mode hors-ligne
5. Rechargez la page - l'application devrait fonctionner normalement

## Support des navigateurs

- ✅ Chrome/Edge (Android, Desktop)
- ✅ Firefox (Android, Desktop)
- ✅ Safari (iOS 11.3+, macOS)
- ✅ Opera (Android, Desktop)

## Notes importantes

- Les icônes doivent être présentes dans `frontend/public/` pour que l'installation fonctionne
- Le manifest.json est généré automatiquement par Vite PWA
- Le service worker est généré automatiquement lors du build

