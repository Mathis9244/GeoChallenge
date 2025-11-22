# 🚀 Guide de déploiement

## Dépôt GitHub

Le projet est maintenant disponible sur GitHub :
**https://github.com/Mathis9244/GeoChallenge**

## Configuration actuelle

- **Remote** : `https://github.com/Mathis9244/GeoChallenge.git`
- **Branche principale** : `main`
- **Protocole** : HTTPS (pour éviter les problèmes de clés SSH)

## Commandes Git utiles

### Vérifier l'état
```bash
git status
```

### Ajouter et commiter des changements
```bash
git add .
git commit -m "Description des changements"
git push
```

### Récupérer les changements
```bash
git pull
```

### Voir l'historique
```bash
git log --oneline
```

## Passer à SSH (optionnel)

Si vous voulez utiliser SSH au lieu de HTTPS :

1. **Générer une clé SSH** (si vous n'en avez pas) :
```bash
ssh-keygen -t ed25519 -C "votre-email@example.com"
```

2. **Ajouter la clé à GitHub** :
   - Copiez le contenu de `~/.ssh/id_ed25519.pub`
   - Allez sur GitHub → Settings → SSH and GPG keys → New SSH key

3. **Changer le remote** :
```bash
git remote set-url origin git@github.com:Mathis9244/GeoChallenge.git
```

## Déploiement du frontend

### Vercel (recommandé)
```bash
cd frontend
npm install -g vercel
vercel
```

### Netlify
1. Connectez votre dépôt GitHub sur Netlify
2. Configurez :
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`

### GitHub Pages
1. Dans `frontend/vite.config.js`, ajoutez :
```js
export default defineConfig({
  base: '/GeoChallenge/',
  // ...
})
```

2. Créez un workflow GitHub Actions (`.github/workflows/deploy.yml`)

## Mise à jour des données

Pour mettre à jour le snapshot :
```bash
cd etl
python etl.py
cd ..
git add snapshot/snapshot-2025-11.json frontend/public/snapshot-2025-11.json
git commit -m "Update snapshot"
git push
```

## Tags de version

Pour créer une version :
```bash
git tag -a v1.0.0 -m "Version 1.0.0 - MVP"
git push origin v1.0.0
```

