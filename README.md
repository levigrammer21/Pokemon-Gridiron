# Pokémon Gridiron v3.0.0

Pokémon Gridiron is a complete 11-on-11 football simulator, franchise, and collection game featuring National Pokédex #001–#898: every base species from Generations 1–8.

## Publish on GitHub Pages

1. Create or open your GitHub repository.
2. Upload every file from this ZIP directly to the repository root. Do not upload the enclosing folder.
3. Open **Settings → Pages** in GitHub.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and the `/ (root)` folder, then save.

No build command, package installation, database, Firebase project, or server is required. `index.html` launches the complete game.

## Franchise mode

- Start with a deliberately low-rated but position-balanced 25-Pokémon base team.
- Play a five-week round-robin season against five CPU clubs.
- Earn League Credits after every game from the result, winning margin, and offensive production.
- Every win guarantees at least 1,000 LC, enough to buy a Poké Ball Box.
- Spend credits in the Box Shop:
  - Poké Ball Box: 1,000 LC
  - Great Ball Box: 2,600 LC
  - Ultra Ball Box: 6,000 LC
  - Master Ball Boxes remain exclusive to first-place season finishes.
- Earn an additional placement reward after Week 5:
  - 1st: Master Ball Box
  - 2nd: Ultra Ball Box
  - 3rd: two Great Ball Boxes
  - 4th: Great Ball Box
  - 5th: two Poké Ball Boxes
  - 6th: Poké Ball Box
- Poké Ball Boxes contain base, non-legendary Pokémon. Master Ball Boxes can contain any Pokémon and include a boosted legendary slot.
- Open three-card boxes; duplicate pulls become +70 development impact.
- Manage a permanent collection, a 25-card active roster, and offense/defense/special-teams depth charts.
- Evolve eligible cards through game-and-win milestones or individual production. Cross-generation and branching evolution paths are included through Gen 8.
- Follow full-league season leaders for passing, rushing, receiving, touchdowns, tackles, sacks, and interceptions.
- Track the MVP, Offensive Player of the Year, Defensive Player of the Year, and Trench Trophy races; final winners are archived by season.
- Chase permanent single-game and season record books. Simulated CPU matchups generate player production, so all six clubs appear in league history.

## Random Draft mode

- Run a six-team, 150-pick snake draft using the full 898-Pokémon pool.
- Filter the draft by any generation from 1–8.
- Draft manually or instantly generate all six unique rosters.
- Choose an opponent, set the depth chart, and play a complete exhibition with no long-term franchise commitment.

## Live gameplay

- 12 named offensive calls across Singleback, I-Form, Shotgun, and Trips formations.
- Context-aware coach suggestions for short yardage, third-and-long, midfield, and the red zone.
- Wider formation spacing, visible positions, pre-snap motion, staged routes, ball flight, pursuit, blocking, and contact.
- Manual 1× broadcast pacing plus 2× and 4× fast-forward controls.
- **Sim to End** resolves every remaining snap with balanced strategy-driven play calling while preserving statistics, fatigue, development, credits, standings, awards, and records.
- Full downs, distance, clock, punts, field goals, touchdowns, turnovers, penalties, overtime, fatigue, substitutions, and type-matchup modifiers.
- Quarter reports include coordinator notes and adjustments for offense, tempo, fourth downs, defensive focus, and blitz rate.

## Player profiles

The persistent **Players** control in the header opens a searchable National Pokédex directory from any screen. Search by name or Pokédex number, filter by generation, and open any profile. League leaderboards, collection cards, depth charts, matchup views, and stat tables also link directly to profiles. Profiles show base stats, football attributes, position fits, Franchise development, and current-season production.

## Saving

Franchise and Quick Draft progress autosave in the browser on the current device. v2.1 Franchise saves upgrade in place without losing collections, depth charts, boxes, development, or live games. New economy and history fields are added automatically.

Firebase is only needed if a future release adds accounts, cross-device cloud saves, shared markets, or online leaderboards.

## Files

- `index.html` — application entry point and accessible app shell
- `game.css` — responsive interface, field, animation, shop, leaderboard, records, and profile styling
- `pokemon-data.js` — bundled Gen 1–8 stats, types, measurements, evolution links, rarity metadata, and artwork paths
- `game.js` — ratings, draft, collection, evolution, economy, Franchise seasons, stats, awards, records, live simulation, and UI
- `pokemon-gridiron-logo.png` — game logo, browser icon, and app icon
- `README.md` — publishing and feature guide

## Data and artwork

All gameplay data is bundled. Artwork URLs use the community-run PokéAPI sprite repository on `raw.githubusercontent.com`, so an internet connection is needed when artwork first loads. Saves and all game logic remain in the browser.

This is an unofficial, noncommercial private fan project. Pokémon and Pokémon character names are trademarks of their respective owners.
