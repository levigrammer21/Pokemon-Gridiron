# Pokémon Gridiron v4.0.0

Pokémon Gridiron is a complete 11-on-11 football simulator, collection game, and promotion/relegation Franchise featuring National Pokédex #001–#898: every base species from Generations 1–8.

## Publish on GitHub Pages

1. Create or open your GitHub repository.
2. Upload every file from this ZIP directly to the repository root. Do not upload the enclosing folder.
3. Open **Settings → Pages** in GitHub.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and the `/ (root)` folder, then save.

No build command, package installation, database, Firebase project, or server is required. `index.html` launches the complete game.

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
- Poké Ball Boxes contain unevolved, non-legendary Pokémon. Master Ball Boxes can contain any Pokémon and include a boosted legendary slot.
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
- **Sim to End** resolves every remaining snap while preserving statistics, fatigue, development, credits, standings, awards, and records.
- Full downs, distance, clock, punts, field goals, touchdowns, turnovers, penalties, overtime, fatigue, substitutions, and type-matchup modifiers.

## Saving

Franchise and Quick Draft progress autosave in the browser on the current device. Existing v3 Franchise saves upgrade into the new Poké Ball League world without losing collections, depth charts, boxes, development, economy, awards, or records. The in-progress divisional schedule restarts once during migration because the league changes from six to five clubs.

Firebase is only needed for a future release with accounts, cross-device cloud saves, shared markets, or online leaderboards.

## Root files

- `index.html` — application entry point and accessible app shell
- `game.css` — responsive interface, field, animations, pyramid, tutorial, economy, stats, and profiles
- `pokemon-data.js` — bundled Gen 1–8 stats, types, measurements, evolution links, rarity metadata, and artwork paths
- `game.js` — ratings, draft, collection, persistent world, promotion/relegation, economy, seasons, simulation, and UI
- `pokemon-gridiron-logo.png` — game logo, browser icon, and app icon
- `README.md` — publishing and feature guide

## Data and artwork

All gameplay data is bundled. Artwork URLs use the community-run PokéAPI sprite repository on `raw.githubusercontent.com`, so an internet connection is needed when artwork first loads. Saves and all game logic remain in the browser.

This is an unofficial, noncommercial private fan project. Pokémon and Pokémon character names are trademarks of their respective owners.
