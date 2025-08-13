# Info Management QCM

Une application de quiz interactif pour tester nos connaissances en informatiqué managériale (il nous faut bien ça).

## Comment contribuer - Ajouter des questions

Vous souhaitez enrichir la base de questions du QCM ? Voici comment procéder :

### 📝 Format des questions

Les questions sont stockées dans le fichier [src/lib/assets/questions.json](./src/lib/assets/questions.json). Chaque question doit respecter ce format :

```json
{
  "id": 123,
  "question": "Votre question ici ?",
  "type": "single|multiple",
  "options": [
    "Option 1",
    "Option 2", 
    "Option 3",
    "Option 4"
  ],
  "correct": [0, 2]
}
```

**Explications :**
- `id` : Numéro unique (utilisez le prochain ID disponible)
- `question` : Le texte de votre question
- `type` : 
  - `"single"` pour une seule bonne réponse
  - `"multiple"` pour plusieurs bonnes réponses
- `options` : Liste des choix possibles
- `correct` : Index des bonnes réponses (commence à 0)

### 🔄 Processus de contribution

1. **Fork** ce repository
2. **Clone** votre fork localement
3. **Créez une branche** pour vos modifications :
   ```bash
   git checkout -b ajout-questions
   ```
4. **Modifiez** le fichier [src/lib/assets/questions.json](./src/lib/assets/questions.json)
   - Ajoutez vos questions à la fin du tableau
   - Vérifiez que les IDs sont uniques et consécutifs
   - Respectez le format JSON (virgules, guillemets, etc.)
5. **Testez** localement :
   ```bash
   pnpm install
   pnpm dev
   ```
6. **Commitez** vos changements :
   ```bash
   git add src/lib/assets/questions.json
   git commit -m "Ajout de X questions"
   ```
7. **Push** vers votre fork :
   ```bash
   git push origin ajout-questions
   ```
8. **Créez une Pull Request** avec :
   - Un titre descriptif
   - Le nombre de questions ajoutées

### ✅ Critères de qualité

Avant de soumettre vos questions, assurez-vous qu'elles :
- Sont en français correct
- Ont des réponses claires et non ambiguës
- Respectent le format JSON requis
- N'introduisent pas de doublons

## Développement local

```bash
# Installation des dépendances
pnpm install

# Démarrage en mode développement
pnpm dev

# Build de production
pnpm build
```
