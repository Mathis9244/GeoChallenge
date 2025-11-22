# 🚀 Comment démarrer l'application

## Méthode 1 : Via la ligne de commande

1. Ouvrez un terminal dans le dossier `frontend`
2. Exécutez :
```bash
npm run dev
```

3. Le navigateur devrait s'ouvrir automatiquement sur `http://localhost:5173` (ou un autre port si celui-ci est occupé)

## Méthode 2 : Via le script batch (Windows)

Double-cliquez sur `frontend/start.bat`

## Port utilisé

Par défaut, l'application utilise le port **5173** (port par défaut de Vite).

Si ce port est occupé, Vite utilisera automatiquement le port suivant disponible (5174, 5175, etc.).

**Important :** Regardez toujours dans le terminal pour voir l'URL exacte affichée, surtout si vous avez plusieurs applications qui tournent.

## Utiliser l'URL Network

Si vous voyez une URL "Network" dans le terminal (ex: `http://192.168.x.x:5173`), vous pouvez l'utiliser pour accéder à l'application depuis d'autres appareils sur le même réseau.

## Vérifications

- ✅ Les dépendances sont installées (`node_modules` existe)
- ✅ Le snapshot est présent dans `frontend/public/snapshot-2025-11.json`
- ✅ Le serveur démarre sans erreur

## Problèmes courants

**"Cannot find module"** : 
```bash
cd frontend
npm install
```

**Le navigateur s'ouvre mais la page est blanche** :
- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs dans l'onglet Console

**Le snapshot ne charge pas** :
- Vérifiez que `frontend/public/snapshot-2025-11.json` existe
- Vérifiez la console du navigateur pour les erreurs de fetch

