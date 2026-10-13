## v2.0.1 — Build menu scrolling fix

- Horizontal swipes on building / decoration cards now browse the tool row. The menu no longer captures every touch as a placement drag or resets the row on native scroll cancellation.
- Added Previous / More arrow buttons for all tool categories, plus a visible scrollbar. Mouse dragging can browse horizontally too.
- Only deliberate upward drags from building / decor cards start placement. Taps still select a tool; dragging on the map keeps the normal placement behavior. Swiping suppresses accidental card clicks.
- Retain the row position when selecting a tool. Changing categories starts at the beginning.
- Tournament arena and spectator stands are now available directly in the Buildings category with houses and duel courts.
- Updated offline release; saves and installation remain unchanged.

## v2.0.0 — Regional seasons and spectator duels

- Automatic regional championships when a tournament arena exists. Default: seven game-days between completed seasons, $1,000 outside-funded prize pool, top four places. Configure 1–30 days, $100–$10,000, and top 1–16 places in the arena or Tournaments panel; disable automatic seasons if desired.
- Every trainer present when a season opens enters free, including Elite Four residents, regardless of wallet, badges, team size, or mindset. Current battles/starters finish first. Active custom tournaments and Elite Four challenge runs finish before a season opens. Blocked paths hold the event for repair.
- Supports 1–54 entrants with automatic byes, full active teams, healed match copies, no real HP loss, XP grants, or tonic use. Outside prize money is paid exactly once; cancelling cannot mint the virtual prize pool into the treasury. Tied elimination-round placings share their payout allocation.
- Season champions receive trophies, career/leaderboard recognition, saved history, a region record, and celebratory world chat. Elite Four residents return to their seats and original positions after the event.
- New Duel court ($950, 4×3, $4 daily upkeep). Trainer-versus-trainer encounters now happen at courts instead of wild routes. Trainers travel, queue, battle, gain ordinary duel XP and League rewards, and recover afterward. One fight per court; per-trainer rest intervals and existing pair reward limits prevent endless instant rematches.
- Nearby stands attract visible paying spectators during duels. Default tickets $2, adjustable $0–$15; each visitor pays on arrival. Crowds build toward capacity and disperse gradually. Each eight-seat stand belongs to its nearest arena/court within 14 tiles, avoiding double-booked seats.
- Court panels show matches, queues, attendance and ticket revenue with live battle links. Active courts cannot move or demolish until their fight ends. Seasons and queues resume from saves; no offline time advances.

## v1.9.0 — Homes, leaderboards, careers, and region statistics

- Build trainer houses ($600, 3×3). Vacant homes sell automatically to reachable trainers who can afford the configured purchase price plus $40 in reserve. Default price $120; proceeds go to your treasury. You can gift vacant houses to trainers for free.
- One permanent home per trainer. No selling or automatic moving. Only your eviction releases ownership; owned houses cannot be demolished first. Eviction preserves Ferals, inventory, wallet, achievements, and career totals.
- Daily upkeep is paid from the owner's wallet to outside maintenance. Property tax goes to your treasury. Tax arrears cap at $60 and never automatically evict a trainer. Vacant houses have no daily expense.
- Owners physically return home for free team recovery: 32 seconds, improved to 26/20 by beds. A paid training yard grants 10 XP per active Feral once each game-day during a visit. Paid decorations show their lead/favorite Feral outside; tournament trophies and champion honors decorate homes. Colors are configurable.
- Region menu: 25 sortable trainer leaderboards spanning League rank, badges, wins/rates/streaks, collections/shinies/captures, team levels, gold/wealth/income/property, quests by tier, tournaments, gym wins, taxes and home visits. Tied scores share ranks; tap a trainer for their profile.
- Career cards show home, achievements, strongest partner, streaks, tracked earnings, and frequent rivals. Region record book preserves first sightings/catches, homeowners, champions, tournament champions, richest wallets and winning streaks with trainer/day; current toughest-gym and wealth standings also appear.
- Gym statistics: challenges, unique challengers, leader wins/losses, defense rate/streaks, badges, rematches, actual fees, unfinished matches, and recent results.
- Species details: normal/shiny sightings and catches, attempted/failed orbs, actual current ownership, shiny owners, and configured routes. Starters/evolutions never inflate wild sightings or captures.
- New counters are explicitly tracked from the update day; old totals are not fabricated. Existing saves, quests, chat, tournaments, and install support remain compatible.

## v1.8.0 — Three-tier quests, lively chat, and compact UI

- Combined region menu, treasury, population, clock, account, and device-save status into one responsive header bar. The floating save badge is removed.
- Route flags and labels now draw before trainers, residents, and battle scenes, so moving people and battles remain visible above signs.
- Replaced deliveries and timed odd jobs with one easy, one medium, and one hard active quest per trainer. All three progress concurrently; completions pay once at the lab and refill the completed slots.
- Easy: encounter 5 wild Ferals or defeat 3 ($35). Medium: defeat 5 in each of two named accessible zones ($125); with one zone, defeat 12 ($110). Hard: encounter a shiny ($300) or finish 100 wild battles ($350). No quest expiry; shinies do not need to be caught. Circuit AI visits the zone still needing wins.
- Existing research/training progress migrates. Removed deliveries release their trainer; all remaining sponsored-job rewards refund to your treasury once. Existing trainer earnings, battle prizes, gym rematches, tournaments, and region saves remain.
- Added extended conversations with 4–7 exchanges, up to three speakers, moods, supportive discussions, teasing, frustration, celebration, and event-specific reactions. Conversation starts are more frequent; history holds 240 messages. Queued replies persist, preserve their order, and use separate randomness. Shiny sightings and wild losses now announce themselves in chat.

## v1.7.0 — Trainer jobs and income

- Starter lab quest board: field surveys ($28 for 3 encounters), training studies ($34 for 3 wild wins), supply deliveries ($20), and lab work ($22 for 45 game-seconds). One active quest; trainers physically visit destinations and return to the lab for payment.
- Collectors favor research; competitive trainers favor training; earn-money trainers alternate deliveries and odd jobs. Below $45, easy paid work takes priority. Quest progress, lifetime job earnings, and recent income appear in trainer profiles and world chat.
- Automatic quests use an outside research fund. Up to four optional sponsored delivery / odd jobs reserve $5–$100 each from your treasury. Trainers claim them automatically. Unclaimed jobs can be cancelled for a refund; payment occurs once from escrow.
- Rival wins now receive an outside League prize ($12–$24), without draining the loser. A pair can earn one prize per 120 game-seconds, including after reloading.
- Existing first-badge prizes remain $45–$115. Money and competitive trainers can rematch beaten gyms for $20–$34, with a six-game-minute retry interval. Rematches do not award duplicate badges or reputation.
- Existing wild rewards, research stipends, and tournament payouts remain available. Save migration preserves existing regions, chat, and installs; offline cache includes the new jobs module.

## v1.6.0 — NPC world chat and sound

- Trainers announce real catches, starters, badges, evolutions, gym challenges, rival results, tournaments, and League changes. Other trainers reply; occasional jokes and conversations reflect actual teams and ambitions.
- Tap World chat to read; tap − to minimize it completely to a small button with an unread count. Build mode and opening management panels minimize it automatically. Its position clears the build tools.
- Tap a speaker for their profile or Details / View event for the related trainer or battle. History holds the last 120 messages and persists in saves. Dialogue uses a separate random stream and stops with the simulation.
- Optional quiet synthesized effects for buttons, building placement, watched battle attacks, critical hits, healing, orb attempts, catches, shiny catches, badges, evolutions, arrivals, and League / tournament announcements. Sound starts off; enable or mute in the chat header or Account.
- Existing saves migrate automatically; no reinstall or reset required. Updated offline cache includes all three new modules.

# Version 1.5.3 — Native browser installation promotion

- Stopped cancelling Chrome's beforeinstallprompt event so its native install promotion can appear.
- Added independent, early PWA startup that does not depend on the game/Firebase module graph; setup remains idempotent when the game attaches notifications.
- Versioned the manifest link and fetch the manifest from the network when available, with an offline fallback, so Chrome checks current metadata.
- Audited the live /FeralRegion/ deployment: manifest, 192/512 PNG icons, game modules and service-worker assets are reachable.
- Browser decides when/where its install icon appears. Actual Android installation cannot be verified from the desktop cloud browser.

# Version 1.5.2 — Installation detection fix

- Removed the false “already installed” block based on the current window's display mode. A real browser install prompt remains usable in any display mode.
- Install status no longer claims a device installation is complete simply because a prompt was accepted or a window is standalone.
- Added persistent Android/iPad installation help and a copyable game address; prompt failures show clear recovery instructions.
- Changed-files patch applies over v1.5.1. No save reset or Firebase changes.

# Version 1.5.1 — Visual Feral pickers

- Searchable, element-filtered Feral-dex portrait grids for catching areas and all gym team slots.
- Tap-to-toggle route rosters with selected checkmarks; rarity controls only for selected species and live normalized encounter odds.
- Gym portrait selection preserves leader/badge edits and other slots; changed species clear that slot's custom move overrides.
- Existing saves and auto-populated routes remain compatible. Changed-files patch applies over v1.5.0.

# Version 1.5.0 — Tournament circuit

- Build a tournament arena and spectator stands; configure 4/8/16 brackets, 1–6 Ferals, badge/level/element/base-species eligibility, entry fees, prize share, treasury bonuses and ticket prices.
- Automatic mindset-aware signup, visible travel, seeded single-elimination brackets, live animated matches, trophy history and recurring events.
- Fee escrow, exact automatic payouts, full cancellation refunds, locked entrant teams and save/resume of live matches. No tournament XP or tonic consumption; healed battle copies keep entrant collections unchanged.
- Android install prompt, permanent Android/iPad instructions, standalone detection and complete versioned service-worker shell updates.
- This patch applies over v1.4.0. Existing regions migrate without resetting.

# 1.4.0 — Collectors & rare encounters

- 108 species: original 36 preserved plus 24 three-stage families (72 new Ferals). Roxy species renamed Gravahound; Titanblood Roxy renamed Titanblood Gravahound. Old saves migrate automatically.
- Each wild spawn independently rolls a 1% shiny chance. Shinies have alternate palettes/sparkles, unchanged stats/catch odds, and preserve their shiny flag through evolution and saving.
- Six active Ferals with permanent reserves supporting one normal and one shiny of all 108 species. No automatic release at 12. Separate variant ownership prevents duplicate catches; evolution holds when the evolved variant is already owned.
- Trainer collection checklists, reserve-to-active swaps and a manual-team lock. Manual swaps do not heal Ferals and are unavailable during battles/League duty.
- Select Auto, Catch them all, Become the best, or Earn money/train. Collectors prioritize areas missing normal species before gyms; competitors prioritize gym training; earners seek safer wild fights and more rival battles. Auto adapts to personality and switches to money below $35. All goals opportunistically attempt unowned shinies.
- Wild battle victories add exactly $1 to the region treasury, once; captures do not award the defeat bounty.
- Area editor: per-species encounter weights, Common (100), Rare (20), Epic (4) presets, custom 0–1000 weights, zero-to-disable, and normalized appearance percentages. Capture rarity remains species-based; shiny chance remains 1%.
- Large cloud saves gzip automatically when supported. Larger JSON imports support expanded collections. Previous device-save and authentication fixes retained.

# 1.3.1 — Device saving repair

- Region saves, backups and archives now use IndexedDB instead of localStorage when available.
- Current save and rolling backup commit in one transaction; failed writes retain both previous records.
- Existing local saves migrate without deleting them. Loading waits for storage before opening a region; read failures cannot silently create an empty replacement.
- Ordered writes capture the region at the time Save is called. Device autosave runs every 10 seconds, after edits and on backgrounding.
- Persistent save status and manual Save on this device button. Success appears only after commit. Sign-out stops if device saving fails; cloud load/import archive the region before replacement.
- Export JSON still works independently of device storage. Export an unsaved running region BEFORE refreshing to install this update, then import it afterward.

# 1.3.0 — A living region

- Routes: stronger path preference, faster path travel, optional selected-trainer route overlay, area roster signs, and linkable route signs.
- Trainers: Collector, Bold, Patient, Strategist and Wanderer habits affect destinations, supplies and gym preparation. Rename trainers and pin up to six favorites; three appear on the map watchlist.
- Activity: current intentions, filtered event feed, clickable trainers and live challenges, catch/badge celebrations.
- Economy: real shop stock with manual/automatic orders, $300 restocking reserve, service upgrades, visitor appeal, paying visitors and recent income/expense/profit per game-minute.
- Gyms: visible waiting challengers, one battle per gym, gym boards, staff, live ranked-challenge banner and retained champion reign/team/defense records.
- World: professor, healer, shopkeeper, gym leaders, café staff and League host; visiting spectators; functional bench/picnic rests; fences, hedges, lantern posts, picnic tables and champion statues. Existing bridge and landscaping tools remain available.
- Existing region layouts, accounts, trainers and the storage-quota fix are preserved. New fields migrate automatically; historical reigns before this update cannot be reconstructed.

# 1.2.1

- Fix login failure when localStorage is full: prefer IndexedDB, fall back to session storage or memory. Handle quota failures during sign-in without deleting any region saves.

# 1.2.0

- Login/create-account screen before gameplay; signed-out simulation and autosaves are blocked. Existing account saves restore locally; old guest saves remain recoverable. Cloud load/save stays explicit.
- All new terrain is short green grass, including expansion land. Existing maps are preserved.
- Build and category changes select no tool. One-finger dragging pans safely until a tool is chosen.
- Drag building cards onto the map, or select then drag on the map. Translucent previews show individual green/red footprint squares and the entrance. Release then confirm price. Cancel/pinch never commits; placement disarms the tool.

# 1.1.0 — Build your own beginning

## Starting a region

- New regions contain empty land and $5,500. No placed buildings, painted paths, trainers, or founding Elite Four.
- A construction guide walks through the lab, healing lodge, shop, route, custom catching area, admissions, gym, and first trainer journey.
- Admissions are initially closed. Open them when your lab, healing lodge, shop, and an open beginner catching area are reachable.
- Total population capacity: six, plus six for each gym, up to 54 residents. Elite Four members count toward the total. Land does not add population capacity. All arrivals start at the lab.
- New arrivals take 150–210 game-seconds. Admissions can be paused without stopping existing trainers.
- The first eligible residents claim vacant Elite Four seats. Existing rank replacement and swapping rules are retained.

## Visuals and animation

- Replaced shared-body recolors with 36 individual Feral drawings. Evolution stages now change proportions and silhouette.
- Trainer movement is interpolated between 30 Hz simulation steps.
- Battle views keep the same canvas during live updates, and update text/health when a turn changes.
- Portrait encoding is cached. Terrain editing repaints changed areas, and navigation uses cached routes and a priority heap.
- Canvas resolution is capped at 1.5× for a lighter mobile rendering load.

## Progression and clarity

- XP to the next level: 60 + 18 × current level + current level².
- Smaller XP awards; lower rewards for overpowering weak opponents; smaller XP shares for inactive teammates.
- Habitat searches take 10–20 game-seconds; battle turns take 1.8 game-seconds.
- Gym losses trigger a 180-second training break; wins trigger a 150-second break before the next gym.
- Trainer profiles explain their next gym and missing level, health, cooldown, availability, or route requirements.

## Save compatibility

Existing worlds retain all trainers, levels, badges, and buildings. XP progress is mapped proportionally onto the new curve. Existing founding Elite Four members are retained in existing saves.

Account → Start a new empty region archives the current local world. Restore previous region swaps it back. Starting over pauses cloud uploads until the user explicitly saves the new world.

## Create your own catching areas

- Build → Areas creates a named, numbered zone. Brush its shape, choose its roster, set levels and a badge requirement, then open it.
- Map boundaries and flags identify every area like a golf hole. Tap an area or marker to edit it.
- Unmarked terrain produces no encounters. Closed and badge-locked areas are excluded from trainer destinations.
- Species can populate automatically by the selected biome, or from an exact custom list.
- Legacy saves convert owned habitat tiles into marked, editable Imported areas.

## Collecting and economy

- Unfamiliar wild species are deliberately weakened before one orb attempt. Species in the team or reserve are not recaught.
- Catch chance ranges from 2.5% to 22%, rather than the previous much higher odds and repeated throws.
- Active teams share XP. After captures and healing, trainers select a team for strength and type variety. At twelve total Ferals, a new catch replaces a weak reserve.
- Lower starting cash, smaller grants, and reduced research, badge and daily trainer payouts slow the initial economic surge.
