# 🔄 Guide de mise à jour du snapshot

## Problème

Le jeu charge le snapshot depuis `frontend/public/snapshot-2025-11.json`, qui est généré par le script ETL à partir des fichiers JSON dans `data/`.

Si vous modifiez les fichiers JSON dans `data/`, vous devez **régénérer le snapshot** pour que le jeu prenne en compte vos modifications.

## Solution

### 1. Régénérer le snapshot

```bash
cd etl
python etl.py
```

Cela génère `snapshot/snapshot-2025-11.json` avec les données mises à jour.

### 2. Copier le snapshot dans le frontend

```bash
# Windows PowerShell
Copy-Item snapshot/snapshot-2025-11.json frontend/public/snapshot-2025-11.json -Force

# Linux/Mac
cp snapshot/snapshot-2025-11.json frontend/public/snapshot-2025-11.json
```

### 3. Vider le cache du navigateur

Le jeu utilise `cache: 'force-cache'` pour charger le snapshot, ce qui peut causer des problèmes de cache.

**Options :**
- **Hard refresh** : `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac)
- **Vider le cache** : Ouvrez les DevTools (F12) > Application > Clear storage > Clear site data
- **Mode navigation privée** : Testez dans une fenêtre privée

### 4. Redémarrer le serveur de développement

Si vous utilisez `npm run dev`, redémarrez-le :

```bash
cd frontend
npm run dev
```

### 5. Vider le cache du service worker (PWA)

Si l'application est installée en PWA, le service worker peut avoir mis en cache l'ancien snapshot.

**Solution :**
1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet "Application"
3. Cliquez sur "Service Workers"
4. Cliquez sur "Unregister" pour désinscrire le service worker
5. Rechargez la page

## Script automatique (optionnel)

Vous pouvez créer un script pour automatiser ces étapes :

**Windows (`update-snapshot.ps1`) :**
```powershell
Write-Host "Génération du snapshot..." -ForegroundColor Cyan
cd etl
python etl.py
cd ..

Write-Host "Copie du snapshot dans frontend/public..." -ForegroundColor Cyan
Copy-Item snapshot/snapshot-2025-11.json frontend/public/snapshot-2025-11.json -Force

Write-Host "Snapshot mis à jour avec succès!" -ForegroundColor Green
```

**Linux/Mac (`update-snapshot.sh`) :**
```bash
#!/bin/bash
echo "Génération du snapshot..."
cd etl
python etl.py
cd ..

echo "Copie du snapshot dans frontend/public..."
cp snapshot/snapshot-2025-11.json frontend/public/snapshot-2025-11.json

echo "Snapshot mis à jour avec succès!"
```

## Vérification

Pour vérifier que le snapshot a bien été mis à jour :

1. Ouvrez `frontend/public/snapshot-2025-11.json`
2. Vérifiez que les données correspondent à vos modifications dans `data/`
3. Rechargez le jeu avec un hard refresh (`Ctrl+Shift+R`)

## Note importante

Les fichiers JSON dans `data/` servent de **fallback** pour le script ETL. Si les APIs externes échouent, le script utilise ces fichiers. Mais le jeu utilise toujours le **snapshot final** généré, pas directement les fichiers `data/`.

