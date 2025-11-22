# 📦 Configuration Git

Le dépôt Git a été initialisé avec succès !

## Commandes Git utiles

### Vérifier le statut
```bash
git status
```

### Ajouter des fichiers
```bash
git add .
git add fichier_specifique.js
```

### Faire un commit
```bash
git commit -m "Description des changements"
```

### Voir l'historique
```bash
git log
git log --oneline
```

### Créer une branche
```bash
git checkout -b nom-de-la-branche
```

### Voir les branches
```bash
git branch
```

## Connexion à un dépôt distant (GitHub, GitLab, etc.)

### 1. Créer un dépôt sur GitHub/GitLab
- Créez un nouveau dépôt (vide) sur votre plateforme

### 2. Ajouter le remote
```bash
git remote add origin https://github.com/votre-username/geochallenge.git
```

### 3. Pousser le code
```bash
git branch -M main
git push -u origin main
```

## Structure du dépôt

```
geochallenge/
├── .git/              # Dépôt Git (caché)
├── .gitignore        # Fichiers à ignorer
├── .gitattributes    # Configuration Git
├── README.md         # Documentation principale
├── etl/              # Scripts ETL Python
├── frontend/         # Application React
├── data/             # Datasets locaux
└── snapshot/         # Snapshots générés
```

## Fichiers ignorés

Les fichiers suivants sont automatiquement ignorés par Git :
- `node_modules/` (dépendances npm)
- `__pycache__/` (cache Python)
- `dist/`, `build/` (fichiers compilés)
- `.env` (variables d'environnement)
- Fichiers IDE (`.vscode/`, `.idea/`)

## Workflow recommandé

1. **Développement** : Travaillez sur votre code
2. **Vérification** : `git status` pour voir les changements
3. **Ajout** : `git add .` pour ajouter les fichiers
4. **Commit** : `git commit -m "Description"` pour sauvegarder
5. **Push** : `git push` pour envoyer sur le dépôt distant

## Tags et versions

Pour créer une version :
```bash
git tag -a v1.0.0 -m "Version 1.0.0 - MVP"
git push origin v1.0.0
```

