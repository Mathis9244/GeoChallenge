# Géo Challenge - MVP

Jeu de géographie basé sur le concept TikTok "Géo Challenge".

🌐 **Dépôt GitHub** : [https://github.com/Mathis9244/GeoChallenge](https://github.com/Mathis9244/GeoChallenge)

📦 **Version actuelle** : v1.0.0 - [Voir les releases](https://github.com/Mathis9244/GeoChallenge/releases)

## 🎮 Concept

Le jeu tire 8 pays aléatoirement. Pour chaque pays, vous devez le placer dans une des 8 catégories disponibles. Vous gagnez des points égaux au rang mondial du pays dans cette catégorie. **Objectif : obtenir le score total le plus petit possible !**

## 📁 Structure du projet

```
geochallenge/
├── etl/                    # Script ETL pour générer le snapshot
│   ├── etl.py             # Script principal
│   └── requirements.txt   # Dépendances Python
├── frontend/              # Application React
│   ├── src/
│   │   ├── screens/       # Écrans du jeu
│   │   └── App.jsx        # Composant principal
│   ├── public/            # Fichiers statiques
│   └── package.json
├── data/                   # Datasets locaux
│   ├── fifa_ranking.json
│   ├── eez_data.json
│   ├── francophones.json
│   └── rice_production.json
└── snapshot/               # Snapshots générés (versionnés par saison)
    └── snapshot-2025-11.json
```

## 🚀 Démarrage rapide

### 1. Installation des dépendances

**Frontend (React + Vite) :**
```bash
cd frontend
npm install
```

**ETL (Python) - Optionnel pour générer de nouveaux snapshots :**
```bash
cd etl
pip install -r requirements.txt
```

### 2. Lancer le jeu

```bash
cd frontend
npm run dev
```

Le jeu sera accessible sur `http://localhost:5173` (ou un autre port si celui-ci est occupé)

> **Note :** Un snapshot exemple est déjà fourni dans `frontend/public/snapshot-2025-11.json`

### 3. Générer un nouveau snapshot (optionnel)

```bash
cd etl
python etl.py
```

Le snapshot sera généré dans `snapshot/snapshot-2025-11.json`. Copiez-le ensuite dans `frontend/public/` pour qu'il soit accessible par le frontend.

## 📊 Catégories

1. **📏 Petite superficie** - World Bank API (Land area)
2. **💰 PIB global** - World Bank API (GDP)
3. **🏙️ Grande capitale** - Wikidata SPARQL (Population capitale)
4. **⚔️ Taille de l'armée** - World Bank API (Armed forces)
5. **⚽ Football** - Classement FIFA (snapshot local)
6. **🌊 Taille ZEE** - Marine Regions dataset (local)
7. **🌾 Production de riz** - FAOSTAT API
8. **🗣️ Nombre de francophones** - OIF dataset (local)

## 🎯 Règles du jeu

- **8 pays** sont tirés aléatoirement (sans doublon)
- Chaque pays doit être placé dans **une catégorie libre**
- **Points = rang mondial** du pays dans cette catégorie (1 = meilleur classement)
- La partie se termine quand les 8 pays sont placés
- **Objectif : obtenir le score total le plus petit possible**

## 🛠️ Technologies

- **Frontend :** React 18 + Vite
- **ETL :** Python 3 avec requests, pandas, SPARQLWrapper
- **APIs :** World Bank, Wikidata SPARQL, FAOSTAT

## 📝 Notes

- Le snapshot est généré à l'avance et ne nécessite pas d'appels API pendant le jeu
- Les datasets locaux (FIFA, EEZ, francophones) doivent être mis à jour manuellement
- Le snapshot est versionné par saison (format : `snapshot-YYYY-MM.json`)

## 🚢 Déploiement

Le frontend peut être déployé sur :
- **Vercel :** `vercel --prod`
- **Netlify :** `netlify deploy --prod`
- **GitHub Pages :** Configurer dans `vite.config.js` et déployer via GitHub Actions

