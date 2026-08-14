# Pokémon Gridiron v4.1.2

Pokémon Gridiron is a complete 11-on-11 football simulator, collection game, and promotion/relegation Franchise featuring National Pokédex #001–#898: every base species from Generations 1–8.

## Publish on GitHub Pages

1. Create or open your GitHub repository.
2. Upload every file from this ZIP directly to the repository root. Do not upload the enclosing folder.
3. Open **Settings → Pages** in GitHub.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and the `/ (root)` folder, then save.

`index.html` launches the complete game with no build command or package installation. Firebase Authentication and Cloud Firestore now provide optional accounts, cloud saves, account linking, and leaderboards; local saves still work if Firebase is unavailable or the player stays signed out.

## Franchise mode

- Begin with no preset roster. Open ten guaranteed-unique Poké Ball Boxes (30 total cards), then receive an automatically balanced active roster of 25 plus five reserves.
- Enter a permanent five-division pyramid with five clubs per division and 25 clubs total:
  - Poké Ball League
  - Great Ball League
  - Ultra Ball League
  - Premier Ball League
  - Master Ball League
- Play a five-week calendar: four games against every club in the current division plus one recovery bye. Every team plays at most once per week.
- The champion promotes one tier; the fifth-place club relegates one tier. The Master champion and Poké fifth-place club remain in their boundary divisions.
- CPU teams never scale to the user. Every CPU collection and roster persists between seasons.
- Each CPU front office opens one box based on its new tier every offseason. Lower-tier clubs have a greater chance to develop an evolution, so Poké Ball teams steadily improve while elite Master rosters become harder to upgrade.
- Inspect all 25 clubs, current memberships, roster OVRs, prior records, promotion/relegation movement, full active rosters, and last offseason upgrades from the **25-team pyramid** screen.
- A small Professor Gridiron chat guide explains the league pyramid, games, credits, boxes, development, CPU growth, leaders, records, and player profiles.

## Collection and economy

- Earn League Credits after every Franchise game from the result, winning margin, and offensive production.
- Every win guarantees at least 1,000 LC, enough to buy one Poké Ball Box.
- Box Shop prices:
  - Poké Ball Box: 1,000 LC
  - Great Ball Box: 2,600 LC
  - Ultra Ball Box: 6,000 LC
- Master Ball Boxes remain exclusive to first-place finishes.
- Five-team placement rewards:
  - 1st: Master Ball Box
  - 2nd: Ultra Ball Box
  - 3rd: Great Ball Box
  - 4th: two Poké Ball Boxes
  - 5th: Poké Ball Box
- Poké Ball Boxes are progression packs: 90% contain three Common cards; 10% contain two Common cards and one Rare card. Master Ball Boxes draw uniformly from all 898 Pokémon; every Pokémon is equally weighted.
- Duplicate pulls become +70 development impact.
- Manage a permanent collection, a 25-card active roster, and offense/defense/special-teams depth charts.
- Evolve eligible cards through game-and-win milestones or individual production. Cross-generation and branching evolution paths are included through Gen 8.

## Statistics, awards, and profiles

- Follow divisional season leaders for passing, rushing, receiving, touchdowns, tackles, sacks, and interceptions.
- Track MVP, Offensive Player of the Year, Defensive Player of the Year, and Trench Trophy races; winners are archived by season.
- Chase permanent single-game and season records. Simulated CPU games generate full player production.
- The persistent **Players** control opens a searchable National Pokédex directory from any screen. It can surface players from every roster in the 25-team Franchise world.
- Select player art, leaderboards, collection cards, depth charts, matchup views, stat tables, or Pyramid roster sprites to open full player profiles.

## Random Draft mode

- Run the original six-team, 150-pick snake draft using the full 898-Pokémon pool.
- Filter the draft by any generation from 1–8.
- Draft manually or instantly generate all six unique rosters.
- Choose an opponent, set the depth chart, and play a complete exhibition with no long-term commitment.

## Live gameplay

- 12 named offensive calls across Singleback, I-Form, Shotgun, and Trips formations.
- Context-aware coach suggestions for short yardage, third-and-long, midfield, and the red zone.
- Wider formation spacing, visible positions, pre-snap motion, staged routes, ball flight, pursuit, blocking, and contact.
- Manual 1× broadcast pacing plus 2× and 4× controls.
- Games simulate live one quarter at a time. Between quarters, coaching adjustments and substitutions can be made before the next quarter begins.
- Full downs, distance, clock, punts, field goals, touchdowns, turnovers, penalties, overtime, fatigue, substitutions, and type-matchup modifiers.

## Saving, accounts, and leaderboards

- Browser `localStorage` remains the immediate/offline save. Existing v3/v4 Franchise saves continue to migrate normally.
- When a player signs in, the same game state is mirrored to Cloud Firestore under `users/{uid}/saves/main`.
- Google, email/password, and phone authentication are supported. Once signed in, missing providers can be linked to the same Firebase user, so every linked method resolves to the same UID and the same save.
- If a signed-in cloud save conflicts with an unrelated device save, the game asks which one to keep before overwriting either copy.
- The global Franchise leaderboard is stored in `leaderboards/{uid}` and ranks by current league tier, championships, career wins, then roster OVR.
- The leaderboard contains only public game summary fields; full save data stays under the authenticated user's private save path.

### Firebase Console setup required

This ZIP already contains the provided `pokemongridiron` web configuration in `firebase-sync.js`. Before authentication can work on the published site:

1. In **Firebase Console → Authentication → Sign-in method**, enable **Google**, **Email/Password**, and **Phone**.
2. In **Authentication → Settings → Authorized domains**, add the GitHub Pages/custom domain that hosts the game.
3. For Phone Auth, configure an **SMS region policy** that allows the countries you want to support. Firebase's web phone flow uses reCAPTCHA and will not work from a raw `file://` URL.
4. Create a **Cloud Firestore** database for the project.
5. Publish the included `firestore.rules`. You can paste them into the Firestore Rules editor, or with the Firebase CLI run `firebase deploy --only firestore:rules` from this project root. `.firebaserc` already points at `pokemongridiron`.

The included Firestore rules make each full save readable/writable only by its matching authenticated UID. Leaderboard rows are publicly readable and only writable by their matching authenticated UID, with a restricted field set. This is appropriate for a casual game leaderboard, but because the game simulation runs in the browser it is not intended to be cheat-proof against a determined user modifying client code.

## Root files

- `index.html` — application entry point and accessible app shell
- `game.css` — responsive interface, field, animations, pyramid, tutorial, economy, stats, and profiles
- `pokemon-data.js` — bundled Gen 1–8 stats, types, measurements, evolution links, rarity metadata, and artwork paths
- `game.js` — ratings, draft, collection, persistent world, promotion/relegation, economy, seasons, simulation, account UI, and cloud-save hooks
- `pokemon-gridiron-logo.png` — game logo, browser icon, and app icon
- `firebase-sync.js` — Firebase Auth, linked providers, Firestore cloud saves, and leaderboard queries
- `firestore.rules` — private save rules plus restricted leaderboard writes
- `firebase.json` / `.firebaserc` — Firebase CLI rule-deployment configuration
- `README.md` — publishing, Firebase setup, and feature guide

## Data and artwork

All gameplay data is bundled. Artwork URLs use the community-run PokéAPI sprite repository on `raw.githubusercontent.com`, so an internet connection is needed when artwork first loads. Game logic remains in the browser. Saves are cached locally and, when signed in, mirrored to Firestore.

This is an unofficial, noncommercial private fan project. Pokémon and Pokémon character names are trademarks of their respective owners.


## v4.1.2

- Restored an optional **Sim to End** control. Quarter-by-quarter live simulation and quarterly adjustments remain the default path.
- Improved situational play calling using down, distance, field position, score, game clock, offensive emphasis, and tempo.
- Rebalanced rushing, passing, pressure, turnovers, explosive plays, and clock runoff for more football-like game flow.


## v4.1.2 progression/reset update
- Poké Ball Boxes are now low-power progression packs: 90% contain three Common cards; 10% contain two Common cards and one Rare card. The 10% roll is per box.
- The ten founding boxes and Poké Ball League CPU teams use the same basic-box odds, lowering first-season roster power.
- Franchise Home now includes a two-step Reset Franchise action. It clears franchise progress and the signed-in leaderboard entry while preserving the Firebase account and linked authentication methods.
