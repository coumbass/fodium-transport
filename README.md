# Fodium — Challenge frontend

Prototype mobile-first pour la nouvelle expérience billetterie et transport de Fodium.

## Choix techniques

- **TanStack Start + React 19** pour une navigation typée et des pages indexables.
- **Tailwind CSS v4** avec des tokens sémantiques pour une interface Frosted Glass cohérente.
- **Web Animations API** sur la fiche événement : le faisceau lumineux est piloté nativement par le navigateur. Ce choix évite une librairie lourde et permet une animation impérative fluide, contrôlable et indépendante du cycle de rendu React — plus adaptée qu'une simple transition CSS à cet effet continu.
- Données locales (`src/lib/events-data.ts`) : trois événements mockés, chacun avec sa fiche, ses points de départ navette et son billet. Aucun backend ni paiement réel.
- Recherche unifiée côté client (accueil et liste) : nom, catégorie, ville, lieu, date ou point de départ de navette, insensible aux accents.

## Priorités UX

Le pass combiné est le cœur du parcours : deux offres immédiatement comparables, départ de navette contextuel, total recalculé en direct et récapitulatif persistant. Le paiement remplace la suite formulaire → opérateur → redirection par une surface unique : choix visuel du moyen (Wave, Orange Money, carte avec identités colorées propres), un seul clic, état de traitement avec message propre à chaque opérateur, puis billet confirmé. Cela supprime les redirections vers les pages opérateurs (principale cause d'abandon sur les billetteries mobiles sénégalaises), réduit la charge mentale et montre exactement ce qui sera payé avant le clic — le montant est dans le bouton lui-même.

Après validation, le billet est généré localement avec son QR code, les détails de l’événement et de la navette. Il peut être téléchargé en image ou transmis avec le partage natif de l’appareil, sans envoyer de donnée à un serveur.

Les animations restent directionnelles et brèves. Le badge Transport pulse pour rendre le lancement perceptible, tandis que les halos et le faisceau donnent une sensation de mouvement sans gêner la lecture. `prefers-reduced-motion` est respecté.

## Avec plus de temps

- Ajouter un retour haptique au clic de paiement sur mobile et une micro-animation de transition vers le billet.
- Ajouter les filtres par date et par ville, et le portefeuille de billets hors ligne.
- Tester l'accessibilité avec des utilisateurs et mesurer la conversion du pass combiné.

## Développement

Prérequis : Node.js 20+ et bun.

```sh
git clone https://github.com/coumbass/fodium-transport.git
cd fodium-transport
bun install        # ou : npm install
bun run dev        # ou : npm run dev
```

