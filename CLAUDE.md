# Etudia — Document de Projet

## 🎯 Vision

**Etudia** est un SaaS destiné aux étudiants qui transforme leurs cours (PDF, puis tous formats) en outils de révision intelligents grâce à l'IA. L'objectif : aider chaque étudiant à comprendre, mémoriser et maîtriser ses cours plus efficacement.

---

## 💡 Concept

L'étudiant upload son fichier de cours → l'IA l'analyse → elle génère des outils de révision personnalisés (résumés, quiz, flashcards, etc.).

Ce qui différencie Etudia de la concurrence : un **design soigné**, une **UX fluide**, et des fonctionnalités de **rétention** (répétition espacée, coaching) que les concurrents n'ont pas.

---

## 🛠️ Stack Technique

| Composant     | Technologie       | Rôle                                      |
| ------------- | ----------------- | ----------------------------------------- |
| Frontend      | **Next.js**       | App web (SSR, routing, API routes)        |
| Backend/BDD   | **Supabase**      | Auth, PostgreSQL, Storage (PDFs), Realtime |
| IA (Gratuit)  | **Gemini Flash**  | Génération de contenu (résumés, quiz...)  |
| IA (Premium)  | **Gemini Pro**    | Réponses plus précises, moins d'hallucinations |

---

## ✨ Features — MVP (V1)

### 1. Résumé intelligent + Notions clés
- L'IA extrait l'essentiel du cours
- Met en avant les définitions, théorèmes et concepts importants
- Hiérarchise les informations par importance

### 2. Quiz adaptatif
- Génération de QCM depuis le contenu du cours
- Questions ouvertes (formule Pro)
- Score à la fin + identification des points faibles
- Exercices adaptés à la matière (dissertations, problèmes, cas pratiques)

### 3. Flashcards à répétition espacée ⭐ (Killer Feature)
- Génération automatique de flashcards depuis le cours
- Algorithme de répétition espacée (type SM-2 / Anki)
- Notifications pour rappeler de réviser au bon moment
- C'est ce qui fait **revenir** les utilisateurs chaque jour

### 4. Chat contextuel
- Chatbot lié au cours uploadé
- L'étudiant pose des questions sur son cours
- Niveau d'explication ajustable (vulgarisé → expert)
- Exemples concrets à la demande

### 5. Fiches de révision exportables
- Génération de fiches propres et structurées
- Export en PDF, prêtes à imprimer
- Valeur tangible et immédiate pour l'étudiant

---

## 🔮 Features — V2 (Post-lancement)

- **Cartes mentales** — Visualisation des liens entre les concepts du cours
- **Mode collaboratif** — Partager cours, quiz et résultats entre amis/promo
- **Détection de lacunes avancée** — Plan de révision personnalisé basé sur les résultats
- **Support multi-format** — Word, PowerPoint, images, audio (cours enregistrés)
- **Classement de groupe** — Gamification entre étudiants d'une même promo

---

## 💰 Modèle de Pricing

### Gratuit
- 3 cours / mois
- Résumés + quiz QCM basiques
- IA : Gemini Flash
- Export limité

### Pro — ~5-8€/mois
- Cours illimités
- IA : Gemini Pro (meilleure qualité)
- Flashcards avec répétition espacée
- Quiz avancés (QCM + questions ouvertes)
- Chat contextuel complet
- Fiches exportables en PDF
- Détection de lacunes + plan de révision

### Team — ~3€/mois/personne (min. 3)
- Tout le Pro inclus
- Partage de cours et quiz entre membres
- Classement de groupe
- Idéal pour les groupes de TD / promos

### Évolution future : B2B (Écoles / Universités)
- Licences établissement
- Dashboard enseignant
- C'est là que se trouvent les **vrais revenus** à terme

---

## ⚠️ Points de vigilance

- **Rétention** — Les outils étudiants sont souvent utilisés 2 fois puis oubliés. La répétition espacée et le suivi de progression résolvent ce problème.
- **Fiabilité de l'IA** — Gemini peut halluciner. Cadrer les prompts rigoureusement et ajouter un disclaimer sur les réponses générées.
- **Budget étudiant** — Freemium généreux pour convertir, prix bas pour le Pro. Les étudiants sont sensibles au prix.
- **Différenciation** — Le design et l'UX sont le vrai avantage compétitif. La concurrence existe mais est souvent "générique".

---

## 📋 Priorités de développement

1. **Auth + Upload PDF** (Supabase Auth + Storage)
2. **Analyse PDF + Résumé** (intégration Gemini)
3. **Génération de Quiz**
4. **Flashcards + Répétition espacée**
5. **Chat contextuel**
6. **Export PDF des fiches**
7. **Système de pricing + Stripe**
8. **Features V2**

---

*Document vivant — à mettre à jour au fil du projet.*

---

## 🖥️ Guide technique (Claude Code)

### Commandes

| Commande | Usage |
| --- | --- |
| `npm run dev` | Serveur de dev (localhost:3000) |
| `npm run build` | Build production |
| `npm start` | Lancer le build production |
| `npm run lint` | ESLint |

### Architecture actuelle

- **Next.js 16** avec App Router (`app/`), React 19, TypeScript 5 (strict)
- **Tailwind CSS v4** via PostCSS ; variables de thème dans `app/globals.css`
- **Path alias** : `@/*` → racine du projet (configuré dans `tsconfig.json`)
- **Fonts** : Geist Sans + Geist Mono chargées via `next/font/google` dans `app/layout.tsx`
- **ESLint** : config flat (ESLint 9) avec rules `core-web-vitals` + TypeScript Next.js
