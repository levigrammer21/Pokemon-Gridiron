# Pokémon Gridiron 151

A private, family-focused 11-on-11 football simulation built around the original 151 Pokémon.

## Publish on GitHub Pages

1. Create a GitHub repository.
2. Upload every file from this ZIP directly to the repository root. Do not place them in a subfolder.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and the `/ (root)` folder, then save.

No build command or package installation is required. `index.html` launches the complete game.

## Included game systems

- Original 151 Pokémon with canonical six-stat profiles, types, height, and weight
- Full 56-pick two-team draft with smart CPU drafting and auto-complete
- 28-player rosters with unique one-way starters and six reserves
- Offense, defense, and special-teams formation screens
- Position-specific football ratings derived from Pokémon attributes
- Complete 11-on-11 exhibition simulation with four eight-minute quarters
- Downs, distance, clock, first downs, punts, field goals, touchdowns, turnovers, and penalties
- Type advantages compressed into modest matchup modifiers
- Fatigue, substitutions, offensive emphasis, tempo, fourth-down aggression, defensive focus, and blitz frequency
- Animated broadcast field with 1×, 2×, 4×, manual, and auto-play controls
- Inspectable play explanations, live stats, matchup trends, quarter reports, and final box scores
- Local browser autosave and continue support

## Files

- `index.html` — application entry point
- `game.css` — complete responsive interface styling
- `pokemon-data.js` — original 151 data manifest
- `game.js` — drafting, ratings, formations, simulation, statistics, and UI logic
- `README.md` — publishing and feature guide

## Data and artwork

Pokémon data and artwork URLs are sourced from the community-run PokéAPI sprite repository. Artwork is loaded from `raw.githubusercontent.com`, so players need an internet connection when an image is first requested. Game logic and saves run entirely in the browser.

This is an unofficial, noncommercial private fan project. Pokémon and Pokémon character names are trademarks of their respective owners.
