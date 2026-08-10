# Pokémon Gridiron v2.1.0

Pokémon Gridiron is a polished, private 11-on-11 football simulator and collection game featuring the complete first three generations: National Pokédex #001–#386.

## Publish on GitHub Pages

1. Create or open your GitHub repository.
2. Upload every file from this ZIP directly to the repository root. Do not upload the enclosing folder.
3. Open **Settings → Pages** in GitHub.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and the `/ (root)` folder, then save.

No build command, package installation, database, or server is required. `index.html` launches the complete game.

## Two complete modes

### Franchise

- Start with a deliberately weak 25-Pokémon base team.
- Play a five-week round-robin season against five CPU clubs.
- Follow a live table with wins, losses, ties, points for, points against, and point differential.
- Earn a placement reward after Week 5:
  - 1st: Master Ball Box
  - 2nd: Ultra Ball Box
  - 3rd: two Great Ball Boxes
  - 4th: Great Ball Box
  - 5th: two Poké Ball Boxes
  - 6th: Poké Ball Box
- Open three-card boxes in a dedicated reward room.
- Poké Ball Boxes contain only unevolved, non-legendary Pokémon.
- Master Ball Boxes can contain any Pokémon and have a boosted legendary slot.
- Duplicates become +70 development impact for the card already owned.
- Manage a growing club collection and a separate 25-card active roster.
- Auto-build a balanced active roster or manually replace any active card.
- Keep a persistent offense, defense, and special-teams depth chart.
- Evolve eligible cards through either game/win milestones or individual impact production.
- Choose branching evolutions, including Eevee, Tyrogue, Wurmple, Gloom, and Poliwhirl paths available within Generations 1–3.
- Carry unopened boxes, collected cards, development, and season history into future seasons.

### Random Draft

- Run the original six-team, 150-pick snake draft with the full 386-Pokémon pool.
- Draft manually or instantly generate all six rosters.
- Build a unique 25-player club, choose any CPU opponent, set the depth chart, and play a complete exhibition.

## Rebuilt live gameplay

- 12 named offensive calls across Singleback, I-Form, Shotgun, and Trips formations.
- Context-aware coach suggestions for short yardage, third-and-long, midfield, and the red zone.
- A real huddle phase before each snap with manual play selection.
- Slower 1× broadcast pacing plus 2× and 4× fast-forward controls.
- Wider, staggered offense and defense spacing with visible position labels.
- Formation-specific alignment and route movement for slants, mesh, screens, crosses, verticals, wheels, inside zone, power, stretch, and jet action.
- Pre-snap idle motion, snap phase, route development, ball travel, pursuit, and a delayed result reveal.
- Multi-stage releases, blocking engagement, pursuit, ball flight, and contact animations make each play develop smoothly instead of jumping straight to the result.
- A protected **Sim to End** option resolves every remaining snap instantly while preserving the current score, statistics, fatigue, Franchise progression, standings, and rewards.
- Complete downs, distance, game clock, punts, field goals, touchdowns, turnovers, penalties, overtime, fatigue, substitutions, and type matchup modifiers.
- Quarter reports with coordinator notes and adjustments for offense, tempo, fourth-down aggression, defensive focus, and blitz rate.
- Detailed live play log, player stats, matchup ledger, play explanations, and final box score.

## Saving

Franchise and Quick Draft progress autosave in the browser on the current device. Firebase is not required for this single-device release. Firebase would only be needed later for accounts, cross-device cloud saves, or online leaderboards.

The game uses a versioned save format and can migrate saves from the original v1.1 release.

## Files

- `index.html` — application entry point and accessible app shell
- `game.css` — complete responsive visual system and animation styling
- `pokemon-data.js` — bundled Gen 1–3 stats, types, measurements, evolution links, rarity metadata, and sprite paths
- `game.js` — ratings, draft logic, collection, boxes, evolution, Franchise seasons, depth charts, simulation, and interface
- `pokemon-gridiron-logo.png` — full-resolution game logo, browser icon, and app icon
- `README.md` — publishing and feature guide

## Data and artwork

The game bundles its Pokémon data for all gameplay logic. Artwork URLs use the community-run PokéAPI sprite repository on `raw.githubusercontent.com`, so an internet connection is needed when artwork is first loaded. Saves and simulation logic remain entirely in the browser.

This is an unofficial, noncommercial private fan project. Pokémon and Pokémon character names are trademarks of their respective owners.
