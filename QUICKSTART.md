# 🚀 Guide de démarrage rapide

## Installation (première fois)

### 1. Installer les dépendances du frontend

```bash
cd frontend
npm install
```

### 2. (Optionnel) Installer les dépendances Python pour l'ETL

```bash
cd etl
pip install -r requirements.txt
```

## Lancer le jeu

```bash
cd frontend
npm run dev
```

Ouvrez votre navigateur sur `http://localhost:5173` (ou l'URL affichée dans le terminal)

## Générer un nouveau snapshot

Si vous voulez mettre à jour les données :

```bash
cd etl
python etl.py
```

Puis copiez le snapshot généré dans `frontend/public/` :

```bash
# Windows PowerShell
Copy-Item ..\snapshot\snapshot-2025-11.json ..\frontend\public\snapshot-2025-11.json

# Linux/Mac
cp ../snapshot/snapshot-2025-11.json ../frontend/public/snapshot-2025-11.json
```

## Structure des fichiers importants

- `frontend/public/snapshot-2025-11.json` - Snapshot utilisé par le jeu
- `snapshot/snapshot-2025-11.json` - Snapshot source (généré par ETL)
- `data/*.json` - Datasets locaux (FIFA, EEZ, francophones, riz)

## Dépannage

**Le jeu ne charge pas le snapshot :**
- Vérifiez que `frontend/public/snapshot-2025-11.json` existe
- Ouvrez la console du navigateur (F12) pour voir les erreurs

**Erreurs lors de la génération du snapshot :**
- Vérifiez votre connexion internet (les APIs externes sont nécessaires)
- Certaines APIs peuvent avoir des limites de taux, attendez quelques minutes

