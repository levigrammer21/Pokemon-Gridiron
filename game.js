(() => {
  "use strict";

  const POKEMON = (window.POKEMON_386 || window.POKEMON_151 || []).map((p) => ({ ...p }));
  const app = document.getElementById("app");
  const modalShell = document.getElementById("modalShell");
  const modalContent = document.getElementById("modalContent");
  const SAVE_KEY = "pokemon-gridiron-save-v4";
  const LEGACY_SAVE_KEY = "pokemon-gridiron-151-save-v2";
  const VERSION = 9;
  const DISPLAY_VERSION = "2.0.0";
  const TEAM_COUNT = 6;
  const ROSTER_SIZE = 25;
  const TOTAL_PICKS = TEAM_COUNT * ROSTER_SIZE;

  const TYPE_COLORS = {
    normal: "#a8a77a", fire: "#ee8130", water: "#6390f0", electric: "#f7d02c",
    grass: "#7ac74c", ice: "#96d9d6", fighting: "#c22e28", poison: "#a33ea1",
    ground: "#e2bf65", flying: "#a98ff3", psychic: "#f95587", bug: "#a6b91a",
    rock: "#b6a136", ghost: "#735797", dragon: "#6f35fc", dark: "#705746",
    steel: "#b7b7ce", fairy: "#d685ad"
  };

  const TYPE_CHART = {
    normal: { rock:.5, ghost:0, steel:.5 },
    fire: { fire:.5, water:.5, grass:2, ice:2, bug:2, rock:.5, dragon:.5, steel:2 },
    water: { fire:2, water:.5, grass:.5, ground:2, rock:2, dragon:.5 },
    electric: { water:2, electric:.5, grass:.5, ground:0, flying:2, dragon:.5 },
    grass: { fire:.5, water:2, grass:.5, poison:.5, ground:2, flying:.5, bug:.5, rock:2, dragon:.5, steel:.5 },
    ice: { fire:.5, water:.5, grass:2, ice:.5, ground:2, flying:2, dragon:2, steel:.5 },
    fighting: { normal:2, ice:2, poison:.5, flying:.5, psychic:.5, bug:.5, rock:2, ghost:0, dark:2, steel:2, fairy:.5 },
    poison: { grass:2, poison:.5, ground:.5, rock:.5, ghost:.5, steel:0, fairy:2 },
    ground: { fire:2, electric:2, grass:.5, poison:2, flying:0, bug:.5, rock:2, steel:2 },
    flying: { electric:.5, grass:2, fighting:2, bug:2, rock:.5, steel:.5 },
    psychic: { fighting:2, poison:2, psychic:.5, dark:0, steel:.5 },
    bug: { fire:.5, grass:2, fighting:.5, poison:.5, flying:.5, psychic:2, ghost:.5, dark:2, steel:.5, fairy:.5 },
    rock: { fire:2, ice:2, fighting:.5, ground:.5, flying:2, bug:2, steel:.5 },
    ghost: { normal:0, psychic:2, ghost:2, dark:.5 },
    dragon: { dragon:2, steel:.5, fairy:0 },
    dark: { fighting:.5, psychic:2, ghost:2, dark:.5, fairy:.5 },
    steel: { fire:.5, water:.5, electric:.5, ice:2, rock:2, steel:.5, fairy:2 },
    fairy: { fire:.5, fighting:2, poison:.5, dragon:2, dark:2, steel:.5 }
  };

  const OFFENSE = ["QB","RB","WR1","WR2","WR3","TE","LT","LG","C","RG","RT"];
  const DEFENSE = ["LE","DT1","DT2","RE","WLB","MLB","SLB","CB1","CB2","FS","SS"];
  const SPECIAL = ["K","P"];
  const ALL_SLOTS = [...OFFENSE, ...DEFENSE];
  const SLOT_BASE = { WR1:"WR",WR2:"WR",WR3:"WR",DT1:"DT",DT2:"DT",CB1:"CB",CB2:"CB" };
  const basePos = (slot) => SLOT_BASE[slot] || slot;

  const FORMATION_COORDS = {
    offense: {
      WR1:[7,57], WR2:[93,57], WR3:[76,52], TE:[87,35], LT:[24,42], LG:[37,42], C:[50,42], RG:[63,42], RT:[76,42], QB:[50,67], RB:[50,86]
    },
    defense: {
      LE:[23,65], DT1:[41,65], DT2:[59,65], RE:[77,65], WLB:[27,44], MLB:[50,46], SLB:[73,44], CB1:[7,42], CB2:[93,42], FS:[37,18], SS:[66,21]
    }
  };

  const DRAFT_BLUEPRINT = [
    "QB","DT","WR","T","CB","RB","MLB","WR","EDGE","C","S","TE","G","CB",
    "LB","T","DT","WR","S","EDGE","G","RB","TE","DB","DL"
  ];
  const TARGET_MAP = {
    QB:["QB"], DT:["DT"], WR:["WR"], T:["LT","RT"], CB:["CB"], RB:["RB"], MLB:["MLB"],
    EDGE:["LE","RE"], C:["C"], S:["FS","SS"], TE:["TE"], G:["LG","RG"], LB:["WLB","MLB","SLB"],
    DB:["CB","FS","SS"], DL:["LE","DT","RE"], K:["K"], P:["P"], FLEX:[...OFFENSE.map(basePos),...DEFENSE.map(basePos)]
  };
  const LEGENDARIES = new Set(POKEMON.filter((p)=>p.legendary).map((p)=>p.id));
  const FRANCHISE_STARTERS = [10,13,16,19,21,41,46,48,50,52,60,69,74,79,90,161,163,165,167,177,187,191,218,261,263];
  const BOXES = {
    pokeball:{ name:"Poké Ball Box", color:"#e75c5c", note:"Three unevolved, non-legendary Pokémon." },
    greatball:{ name:"Great Ball Box", color:"#5f9dff", note:"Three non-legendary Pokémon with one guaranteed uncommon-or-better pull." },
    ultraball:{ name:"Ultra Ball Box", color:"#f4c84e", note:"Three non-legendary Pokémon with two guaranteed rare-or-better pulls." },
    masterball:{ name:"Master Ball Box", color:"#b784ff", note:"Any Pokémon can appear. One slot has a boosted legendary chance." }
  };
  const COLORS = ["#52dcff","#ff775f","#ffc857","#a78bfa","#4ee3a1","#f472b6"];
  const AI_CLUBS = [
    { id:"indigo", name:"Indigo Inferno", color:"#ff775f" },
    { id:"pewter", name:"Pewter Ironclads", color:"#b8c2cc" },
    { id:"saffron", name:"Saffron Psywave", color:"#ffc857" },
    { id:"fuchsia", name:"Fuchsia Phantoms", color:"#e879f9" },
    { id:"cinnabar", name:"Cinnabar Blaze", color:"#ff9b54" }
  ];

  const PLAYBOOK = [
    {id:"inside-zone",name:"Inside Zone",type:"inside-run",formation:"Singleback",family:"run",description:"Patient downhill run behind the interior three."},
    {id:"power-left",name:"Power Left",type:"inside-run",formation:"I-Form",family:"run",description:"Pull a guard and attack the left-side edge."},
    {id:"wide-stretch",name:"Wide Stretch",type:"outside-run",formation:"Singleback",family:"run",description:"Press the sideline, then cut behind the tight end."},
    {id:"jet-sweep",name:"Jet Sweep",type:"outside-run",formation:"Trips",family:"run",description:"Use motion to race the defense to the corner."},
    {id:"quick-slants",name:"Quick Slants",type:"short-pass",formation:"Shotgun",family:"quick",description:"Three fast in-breaking routes against soft leverage."},
    {id:"mesh",name:"Mesh",type:"short-pass",formation:"Shotgun",family:"quick",description:"Crossing routes create traffic underneath."},
    {id:"screen",name:"RB Screen",type:"short-pass",formation:"Shotgun",family:"quick",description:"Invite the rush, then release the back into space."},
    {id:"dig-cross",name:"Dig Cross",type:"medium-pass",formation:"Trips",family:"dropback",description:"Layer a deep dig behind a crossing route."},
    {id:"play-action",name:"Play Action Cross",type:"medium-pass",formation:"I-Form",family:"dropback",description:"Sell the run before attacking the linebackers."},
    {id:"sideline-out",name:"Sideline Out",type:"medium-pass",formation:"Singleback",family:"dropback",description:"Precision timing route outside the numbers."},
    {id:"four-verts",name:"Four Verticals",type:"deep-pass",formation:"Shotgun",family:"deep",description:"Stress both safeties with four vertical releases."},
    {id:"post-wheel",name:"Post Wheel",type:"deep-pass",formation:"Trips",family:"deep",description:"Clear the boundary and send the back up the rail."}
  ];

  const clamp = (value, min=0, max=99) => Math.max(min, Math.min(max, value));
  const weighted = (...pairs) => Math.round(pairs.reduce((sum,[value,weight]) => sum + value*weight, 0));
  const n = (value) => clamp(Math.round(30 + value * .58), 25, 99);
  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
  const ordinal = (n) => `${n}${n%10===1&&n%100!==11?"st":n%10===2&&n%100!==12?"nd":n%10===3&&n%100!==13?"rd":"th"}`;
  const formatClock = (seconds) => `${Math.floor(Math.max(0,seconds)/60)}:${String(Math.max(0,seconds)%60).padStart(2,"0")}`;
  const teamInitials = (name) => name.split(/\s+/).map((word)=>word[0]).join("").slice(0,2).toUpperCase();
  const byId = Object.fromEntries(POKEMON.map((p) => [p.id,p]));

  function calculateRatings(p) {
    const s = Object.fromEntries(Object.entries(p.stats).map(([key,value]) => [key,n(value)]));
    const mass = clamp(Math.round(15 + Math.log10(p.weight + 1) * 25), 28, 99);
    const height = clamp(Math.round(28 + Math.log10(p.height + 1) * 30), 28, 90);
    const body = weighted([mass,.65],[height,.35]);
    const inverseMass = clamp(112 - mass, 30, 90);
    const strength = weighted([s.atk,.45],[s.def,.25],[mass,.2],[s.hp,.1]);
    const acceleration = weighted([s.spe,.62],[s.atk,.2],[inverseMass,.18]);
    const agility = weighted([s.spe,.5],[s.spa,.25],[inverseMass,.25]);
    const stamina = weighted([s.hp,.5],[s.def,.28],[s.spd,.22]);
    const toughness = weighted([s.hp,.44],[s.def,.31],[s.spd,.25]);
    const awareness = weighted([s.spd,.52],[s.spa,.3],[s.hp,.18]);
    const technique = weighted([s.spa,.48],[s.spd,.32],[s.spe,.2]);
    const hands = weighted([s.spa,.34],[s.spd,.34],[s.spe,.17],[height,.15]);
    const speed = s.spe;

    const skills = {
      strength, acceleration, agility, stamina, toughness, awareness, technique, hands, speed, mass,
      throwPower: weighted([s.spa,.54],[s.atk,.22],[strength,.16],[height,.08]),
      throwAccuracy: weighted([technique,.46],[awareness,.37],[s.spd,.17]),
      carrying: weighted([s.hp,.3],[toughness,.27],[awareness,.23],[s.def,.2]),
      vision: weighted([awareness,.58],[technique,.24],[agility,.18]),
      trucking: weighted([strength,.48],[s.atk,.3],[mass,.22]),
      elusiveness: weighted([agility,.48],[speed,.32],[technique,.2]),
      route: weighted([technique,.38],[agility,.34],[awareness,.18],[speed,.1]),
      release: weighted([technique,.4],[acceleration,.31],[strength,.16],[hands,.13]),
      runBlock: weighted([strength,.34],[s.atk,.25],[s.def,.2],[mass,.13],[awareness,.08]),
      passBlock: weighted([s.def,.32],[awareness,.22],[strength,.2],[mass,.15],[agility,.11]),
      tackle: weighted([s.atk,.31],[s.def,.25],[strength,.21],[awareness,.15],[toughness,.08]),
      pursuit: weighted([speed,.35],[awareness,.32],[stamina,.18],[agility,.15]),
      blockShed: weighted([strength,.3],[s.def,.24],[s.atk,.23],[technique,.13],[mass,.1]),
      powerRush: weighted([strength,.39],[s.atk,.28],[mass,.18],[acceleration,.15]),
      finesseRush: weighted([agility,.31],[technique,.27],[speed,.22],[s.atk,.2]),
      manCover: weighted([speed,.34],[agility,.29],[awareness,.22],[technique,.15]),
      zoneCover: weighted([awareness,.42],[s.spd,.23],[speed,.2],[technique,.15]),
      press: weighted([strength,.33],[technique,.27],[acceleration,.2],[awareness,.2]),
      kickPower: weighted([s.spa,.45],[s.atk,.3],[strength,.15],[stamina,.1]),
      kickAccuracy: weighted([technique,.52],[awareness,.34],[s.spd,.14])
    };
    Object.keys(skills).forEach((key) => skills[key] = clamp(skills[key],25,99));
    const positions = {
      QB: weighted([skills.throwAccuracy,.28],[skills.throwPower,.24],[skills.awareness,.2],[skills.technique,.12],[skills.speed,.09],[skills.toughness,.07]),
      RB: weighted([skills.carrying,.22],[skills.vision,.2],[skills.elusiveness,.18],[skills.speed,.15],[skills.trucking,.13],[skills.hands,.12]),
      WR: weighted([skills.hands,.24],[skills.route,.23],[skills.speed,.2],[skills.release,.15],[skills.agility,.12],[skills.toughness,.06]),
      TE: weighted([skills.hands,.18],[skills.route,.14],[skills.runBlock,.18],[skills.passBlock,.13],[skills.strength,.18],[skills.toughness,.11],[skills.speed,.08]),
      LT: weighted([skills.passBlock,.36],[skills.runBlock,.24],[skills.strength,.16],[skills.awareness,.12],[skills.stamina,.12]),
      LG: weighted([skills.runBlock,.31],[skills.passBlock,.27],[skills.strength,.19],[skills.mass,.12],[skills.stamina,.11]),
      C: weighted([skills.awareness,.23],[skills.passBlock,.27],[skills.runBlock,.26],[skills.strength,.13],[skills.stamina,.11]),
      RG: weighted([skills.runBlock,.31],[skills.passBlock,.27],[skills.strength,.19],[skills.mass,.12],[skills.stamina,.11]),
      RT: weighted([skills.runBlock,.28],[skills.passBlock,.28],[skills.strength,.19],[skills.awareness,.11],[skills.stamina,.14]),
      LE: weighted([skills.finesseRush,.25],[skills.powerRush,.21],[skills.blockShed,.2],[skills.tackle,.17],[skills.pursuit,.11],[skills.stamina,.06]),
      DT: weighted([skills.powerRush,.28],[skills.blockShed,.27],[skills.strength,.19],[skills.tackle,.15],[skills.mass,.11]),
      RE: weighted([skills.finesseRush,.25],[skills.powerRush,.21],[skills.blockShed,.2],[skills.tackle,.17],[skills.pursuit,.11],[skills.stamina,.06]),
      WLB: weighted([skills.pursuit,.23],[skills.tackle,.23],[skills.zoneCover,.17],[skills.speed,.14],[skills.blockShed,.12],[skills.awareness,.11]),
      MLB: weighted([skills.tackle,.27],[skills.awareness,.22],[skills.blockShed,.16],[skills.zoneCover,.14],[skills.strength,.12],[skills.stamina,.09]),
      SLB: weighted([skills.tackle,.23],[skills.blockShed,.2],[skills.zoneCover,.16],[skills.pursuit,.16],[skills.strength,.15],[skills.awareness,.1]),
      CB: weighted([skills.manCover,.3],[skills.speed,.23],[skills.zoneCover,.17],[skills.agility,.14],[skills.awareness,.1],[skills.tackle,.06]),
      FS: weighted([skills.zoneCover,.28],[skills.awareness,.23],[skills.speed,.18],[skills.manCover,.14],[skills.pursuit,.1],[skills.tackle,.07]),
      SS: weighted([skills.tackle,.2],[skills.zoneCover,.22],[skills.awareness,.19],[skills.pursuit,.16],[skills.manCover,.12],[skills.strength,.11]),
      K: weighted([skills.kickAccuracy,.55],[skills.kickPower,.45]),
      P: weighted([skills.kickPower,.53],[skills.kickAccuracy,.37],[skills.stamina,.1])
    };
    Object.keys(positions).forEach((key) => positions[key] = clamp(positions[key],25,99));
    return { normalized:s, body, skills, positions };
  }

  POKEMON.forEach((p) => {
    p.football = calculateRatings(p);
    const eligible = Object.entries(p.football.positions).filter(([pos]) => !["K","P"].includes(pos));
    const [position,rating] = eligible.sort((a,b)=>b[1]-a[1])[0];
    p.best = { position, rating };
  });

  function typeEffect(attacker, defender) {
    let best = .25;
    for (const attackType of attacker.types) {
      let multiplier = 1;
      for (const defendType of defender.types) multiplier *= TYPE_CHART[attackType]?.[defendType] ?? 1;
      best = Math.max(best,multiplier);
    }
    return best;
  }

  function typeEdge(attacker, defender) {
    const effect = typeEffect(attacker,defender);
    if (effect >= 4) return 6;
    if (effect >= 2) return 4;
    if (effect === 0) return -6;
    if (effect <= .25) return -5;
    if (effect < 1) return -3;
    return 0;
  }

  function createLeagueTeams(name="Cerulean Surge",color=COLORS[0]) {
    return [{ id:"human", name, color, roster:[] }, ...AI_CLUBS.map((team)=>({ ...team, roster:[] }))];
  }

  function defaultState() {
    return {
      version:VERSION, mode:null, screen:"home", teamName:"Cerulean Surge", teamColor:COLORS[0], cpuName:"Indigo Inferno", cpuColor:"#ff775f",
      leagueTeams:createLeagueTeams(), leagueLineups:[], opponentIndex:1,
      humanRoster:[], cpuRoster:[], draftPicks:[], draftIndex:0, search:"", typeFilter:"all", draftGen:"all", sort:"fit",
      humanLineup:null, cpuLineup:null, rosterTab:"offense", selectedSlot:null, returnToReport:false,
      game:null, sidebarTab:"plays", postgameTab:"summary", speed:1, autoplay:false, sound:false,
      franchise:null, collectionSearch:"", collectionGen:"all", collectionSort:"rating", lastScreen:"home"
    };
  }

  let state = defaultState();
  let savedState = loadSaved();
  let autoTimer = null;

  function loadSaved() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (saved?.version === VERSION) return saved;
      const legacy = JSON.parse(localStorage.getItem(LEGACY_SAVE_KEY));
      if (!legacy?.version) return null;
      return { ...defaultState(), ...legacy, version:VERSION, mode:"quick", franchise:null, autoplay:false };
    } catch { return null; }
  }

  function save() {
    state.lastScreen=state.screen;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); savedState = JSON.parse(JSON.stringify(state)); } catch {}
  }

  function toast(message) {
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    document.getElementById("toastRegion").appendChild(node);
    setTimeout(()=>node.remove(),2600);
  }

  function playTone(kind="select") {
    if (!state.sound) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = kind === "score" ? "triangle" : "sine";
      osc.frequency.value = kind === "score" ? 620 : kind === "hit" ? 150 : 310;
      gain.gain.setValueAtTime(.045,context.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001,context.currentTime + (kind === "score" ? .35 : .12));
      osc.connect(gain); gain.connect(context.destination); osc.start(); osc.stop(context.currentTime + (kind === "score" ? .36 : .13));
    } catch {}
  }

  function typePills(p) {
    return `<div class="type-row">${p.types.map((type)=>`<span class="type-pill" style="--type:${TYPE_COLORS[type]}">${esc(type)}</span>`).join("")}</div>`;
  }

  function miniStats(p) {
    const labels = [["HP","hp"],["ATK","atk"],["DEF","def"],["SPA","spa"],["SPD","spd"],["SPE","spe"]];
    return `<div class="mini-stats">${labels.map(([label,key])=>`<span>${label}<b>${p.stats[key]}</b></span>`).join("")}</div>`;
  }

  function teamShield(name,color) {
    return `<span class="team-shield" style="--team-color:${color}">${esc(teamInitials(name))}</span>`;
  }

  function render() {
    clearTimeout(autoTimer);
    document.documentElement.style.setProperty("--human",state.teamColor);
    document.documentElement.style.setProperty("--cpu",state.cpuColor);
    const renderers = { home:renderHome, draft:renderDraft, roster:renderRoster, game:renderGame, report:renderReport, postgame:renderPostgame, franchise:renderFranchise, collection:renderCollection, boxes:renderBoxes };
    (renderers[state.screen] || renderHome)();
    const soundButton=document.getElementById("soundToggle");
    if(soundButton){soundButton.textContent=state.sound?"♫":"♪";soundButton.setAttribute("aria-pressed",String(state.sound));}
    const newButton=document.getElementById("newGameButton");
    if(newButton)newButton.textContent=state.mode==="franchise"&&state.screen!=="home"?"Franchise Home":"New Draft";
    const version=document.querySelector(".version");if(version)version.textContent=`v${DISPLAY_VERSION}`;
    const headerCenter=document.getElementById("headerCenter");if(headerCenter)headerCenter.lastElementChild.textContent=state.mode==="franchise"?"FRANCHISE LEAGUE":"GRIDIRON ASSOCIATION";
    app.focus({preventScroll:true});
  }

  function renderHome() {
    const continueLabel = savedState?.game ? "Continue live game" : savedState?.screen&&savedState.screen!=="home" ? "Continue where you left off" : "";
    const franchiseExists=Boolean(savedState?.franchise || state.franchise);
    app.className = "screen home-screen";
    app.innerHTML = `
      <section class="hero-grid mode-home">
        <div class="hero-copy">
          <p class="eyebrow">Three regions · 386 collectible players · six-club league</p>
          <h1 class="display-title">Build a dynasty.<br><span>Call every play.</span></h1>
          <p class="lede">Collect Pokémon from Kanto, Johto, and Hoenn, develop them through real game production, and chase better reward boxes every season—or jump into the original random draft for a one-night roster.</p>
          <div class="hero-actions">
            <button class="primary-button gold" data-action="${franchiseExists?"resume-franchise":"focus-setup"}">${franchiseExists?"Resume franchise":"Start a franchise"}</button>
            <button class="secondary-button" data-action="focus-quick">Quick Draft</button>
            ${continueLabel ? `<button class="secondary-button" data-action="continue-save">${continueLabel}</button>` : ""}
          </div>
          <div class="feature-row">
            <span><i>386</i> Gen 1–3 Pokédex</span>
            <span><i>2</i> Complete game modes</span>
            <span><i>12</i> Offensive play calls</span>
          </div>
          <div class="mode-cards" id="quickModes">
            <article class="mode-card franchise-card"><span class="mode-kicker">LONG-TERM MODE</span><h2>Franchise</h2><p>Begin with a struggling 25-player club. Play a five-game season, climb the table, earn placement boxes, manage your collection, and evolve proven starters.</p><div class="mode-tags"><span>Local autosave</span><span>Season rewards</span><span>Evolution</span></div></article>
            <article class="mode-card"><span class="mode-kicker">QUICK MODE</span><h2>Random Draft</h2><p>Run the six-team, 150-pick snake draft with the full 386-player pool. Build a lineup, choose an opponent, and coach one complete exhibition.</p><div class="mode-card-actions"><button class="secondary-button" data-action="start-draft">Draft manually</button><button class="quiet-button" data-action="quick-exhibition">Instant random team</button></div></article>
          </div>
        </div>
        <div class="hero-board">
          <div class="hero-scorebug"><div><strong>CERULEAN</strong><span>Home · 17</span></div><div class="score-mid"><strong>2:14</strong><span>2nd · Q4</span></div><div><strong>INDIGO</strong><span>Away · 16</span></div></div>
          <img class="hero-pokemon one" src="${byId[9].art}" alt="Blastoise" />
          <img class="hero-pokemon two" src="${byId[257].art}" alt="Blaziken" />
          <img class="hero-pokemon three" src="${byId[248].art}" alt="Tyranitar" />
          <img class="hero-pokemon four" src="${byId[282].art}" alt="Gardevoir" />
          <div class="team-setup" id="teamSetup">
            <p class="eyebrow">Your club identity</p>
            <div class="setup-row">
              <input class="field-input" id="teamNameInput" maxlength="26" value="${esc(state.teamName)}" aria-label="Team name" />
              <button class="primary-button gold" data-action="start-franchise">${franchiseExists?"Open franchise":"Claim base team"}</button>
            </div>
            <div class="color-picks" aria-label="Team color">
              <span class="tiny">CLUB COLOR</span>
              ${COLORS.map((color)=>`<button class="color-pick ${state.teamColor===color?"active":""}" style="--pick:${color}" data-action="choose-color" data-color="${color}" aria-label="Choose ${color}"></button>`).join("")}
            </div>
          </div>
        </div>
      </section>`;
  }

  function startDraft(quick=false) {
    const input = document.getElementById("teamNameInput");
    if (input?.value.trim()) state.teamName = input.value.trim().slice(0,26);
    if(!state.franchise&&savedState?.franchise)state.franchise=JSON.parse(JSON.stringify(savedState.franchise));
    state.mode="quick";state.leagueTeams=createLeagueTeams(state.teamName,state.teamColor); state.leagueLineups=[]; state.opponentIndex=1;
    state.humanRoster=[]; state.cpuRoster=[]; state.draftPicks=[]; state.draftIndex=0; state.humanLineup=null; state.cpuLineup=null; state.game=null;
    state.screen="draft";
    if (quick) {
      autoCompleteDraft();
      return;
    }
    processCpuTurns();
    save(); render();
  }

  function emptyProgress() {
    return {games:0,wins:0,impact:0,yards:0,touchdowns:0,tackles:0,sacks:0,interceptions:0,careerImpact:0};
  }

  function freshStanding(team,index) {
    return {teamIndex:index,id:team.id,name:team.name,color:team.color,w:0,l:0,t:0,pf:0,pa:0};
  }

  function recordStanding(standing,pointsFor,pointsAgainst) {
    standing.pf+=pointsFor;standing.pa+=pointsAgainst;
    if(pointsFor>pointsAgainst)standing.w++;else if(pointsFor<pointsAgainst)standing.l++;else standing.t++;
  }

  function buildFranchiseLeague() {
    const f=state.franchise;
    state.leagueTeams=createLeagueTeams(state.teamName,state.teamColor);
    state.leagueTeams[0].roster=[...f.active];
    const season=f.season||1;
    for(let teamIndex=1;teamIndex<TEAM_COUNT;teamIndex++){
      const roster=state.leagueTeams[teamIndex].roster;
      const teamUsed=new Set(f.active);
      while(roster.length<ROSTER_SIZE){
        const target=DRAFT_BLUEPRINT[roster.length];
        const cap=Math.min(92,64+season*2);
        let pool=POKEMON.filter((p)=>!teamUsed.has(p.id)&&p.best.rating<=cap&&(!p.legendary||season>=4));
        if(pool.length<20)pool=POKEMON.filter((p)=>!teamUsed.has(p.id)&&p.best.rating<=cap+3&&!p.legendary);
        const ranked=pool.map((p)=>[p,candidateTargetScore(p,target)+p.best.rating*.12+Math.random()*7]).sort((a,b)=>b[1]-a[1]);
        const choice=ranked[Math.floor(Math.random()*Math.min(12,ranked.length))]?.[0];
        if(!choice)break;
        roster.push(choice.id);teamUsed.add(choice.id);
      }
    }
    state.leagueLineups=state.leagueTeams.map((team)=>autoAssign(team.roster));
    const savedIds=f.lineup?[...Object.values(f.lineup.offense||{}),...Object.values(f.lineup.defense||{}),...Object.values(f.lineup.special||{})]:[];
    const savedValid=savedIds.length===24&&savedIds.every((id)=>f.active.includes(id));
    state.humanRoster=[...f.active];state.humanLineup=savedValid?JSON.parse(JSON.stringify(f.lineup)):state.leagueLineups[0];state.leagueLineups[0]=state.humanLineup;f.lineup=JSON.parse(JSON.stringify(state.humanLineup));
  }

  function franchiseRounds() {
    let rotation=[0,...[1,2,3,4,5].sort(()=>Math.random()-.5)];const rounds=[];
    for(let round=0;round<5;round++){
      rounds.push([[rotation[0],rotation[5]],[rotation[1],rotation[4]],[rotation[2],rotation[3]]]);
      rotation=[rotation[0],rotation[5],rotation[1],rotation[2],rotation[3],rotation[4]];
    }
    return rounds;
  }

  function simulateCpuMatchup(a,b) {
    const gradeA=teamRosterGrade(state.leagueTeams[a]),gradeB=teamRosterGrade(state.leagueTeams[b]);
    const baseA=13+Math.floor(Math.random()*17),baseB=13+Math.floor(Math.random()*17);
    let scoreA=Math.max(3,baseA+Math.round((gradeA-gradeB)*.45));let scoreB=Math.max(3,baseB+Math.round((gradeB-gradeA)*.45));
    if(scoreA===scoreB)scoreA+=3;
    recordStanding(state.franchise.standings[a],scoreA,scoreB);recordStanding(state.franchise.standings[b],scoreB,scoreA);
    return {a,b,scoreA,scoreB,played:true};
  }

  function setupFranchiseSeason() {
    const f=state.franchise;
    buildFranchiseLeague();
    const rounds=franchiseRounds();
    f.schedule=rounds.map((matchups,week)=>{const [human]=matchups.filter((pair)=>pair.includes(0));const opponentIndex=human.find((index)=>index!==0);return {week:week+1,opponentIndex,played:false,humanScore:null,cpuScore:null,result:null};});
    f.cpuSchedule=rounds.map((matchups)=>matchups.filter((pair)=>!pair.includes(0)).map(([a,b])=>({a,b,played:false,scoreA:null,scoreB:null})));
    f.standings=state.leagueTeams.map(freshStanding);
    f.seasonComplete=false;f.lastReward=null;f.lastPlacement=null;
    state.opponentIndex=f.schedule[0].opponentIndex;syncOpponent();
  }

  function startFranchise() {
    const input=document.getElementById("teamNameInput");
    if(input?.value.trim())state.teamName=input.value.trim().slice(0,26);
    if(!state.franchise&&savedState?.franchise){resumeFranchise();return;}
    if(state.franchise){resumeFranchise();return;}
    const records=Object.fromEntries(FRANCHISE_STARTERS.map((id)=>[id,emptyProgress()]));
    state.franchise={
      season:1,owned:[...FRANCHISE_STARTERS],discovered:[...FRANCHISE_STARTERS],active:[...FRANCHISE_STARTERS],records,
      boxes:[{id:`welcome-${Date.now()}`,type:"pokeball",source:"Franchise welcome box"}],lastOpen:null,recentAdds:[],history:[],
      schedule:[],standings:[],seasonComplete:false,lastReward:null,lastPlacement:null
    };
    state.mode="franchise";state.game=null;state.postgameTab="summary";setupFranchiseSeason();state.screen="franchise";save();render();
    toast("Franchise created. Your base roster and welcome box are ready.");
  }

  function resumeFranchise() {
    if(!state.franchise&&savedState?.franchise)state=JSON.parse(JSON.stringify(savedState));
    if(!state.franchise){startFranchise();return;}
    state.mode="franchise";state.teamName=state.leagueTeams?.[0]?.name||state.teamName;state.humanRoster=[...state.franchise.active];
    if(!state.leagueTeams?.length||!state.leagueTeams[1]?.roster?.length)setupFranchiseSeason();
    state.screen="franchise";state.autoplay=false;save();render();
  }

  function sortedStandings() {
    const rows=[...(state.franchise?.standings||[])];
    return rows.sort((a,b)=>b.w-a.w||b.t-a.t||(b.pf-b.pa)-(a.pf-a.pa)||b.pf-a.pf);
  }

  function nextFranchiseGame() {
    return state.franchise?.schedule?.find((game)=>!game.played)||null;
  }

  function seasonRecord() {
    return state.franchise?.standings?.[0]||{w:0,l:0,t:0,pf:0,pa:0};
  }

  function evolutionRequirement(p) {
    const later=p.stage>=1;
    return later?{games:5,wins:3,impact:320}:{games:2,wins:1,impact:125};
  }

  function progressFor(id) {
    const f=state.franchise;if(!f)return emptyProgress();
    return f.records[id]||(f.records[id]=emptyProgress());
  }

  function canEvolve(id) {
    const p=byId[id];if(!p?.evos?.length||!state.franchise?.owned.includes(id))return false;
    const r=progressFor(id),need=evolutionRequirement(p);
    return r.impact>=need.impact||(r.games>=need.games&&r.wins>=need.wins);
  }

  function evolutionCopy(id) {
    const p=byId[id],r=progressFor(id),need=evolutionRequirement(p);
    if(!p?.evos?.length)return "Final form";
    if(canEvolve(id))return "Evolution ready";
    return `${Math.min(r.games,need.games)}/${need.games} games + ${Math.min(r.wins,need.wins)}/${need.wins} wins, or ${Math.min(r.impact,need.impact)}/${need.impact} impact`;
  }

  function renderFranchiseNav(active="home") {
    const count=state.franchise?.boxes?.length||0;
    return `<nav class="franchise-nav" aria-label="Franchise navigation"><button class="${active==="home"?"active":""}" data-action="franchise-home">League home</button><button class="${active==="collection"?"active":""}" data-action="show-collection">Collection</button><button class="${active==="roster"?"active":""}" data-action="franchise-roster">Depth chart</button><button class="${active==="boxes"?"active":""}" data-action="show-boxes">Boxes${count?` <b>${count}</b>`:""}</button></nav>`;
  }

  function renderFranchise() {
    const f=state.franchise;if(!f){state.screen="home";renderHome();return;}
    const next=nextFranchiseGame(),record=seasonRecord(),rows=sortedStandings(),placement=rows.findIndex((row)=>row.teamIndex===0)+1;
    const played=f.schedule.filter((game)=>game.played).length;
    const opponent=next?state.leagueTeams[next.opponentIndex]:null;
    const threats=opponent?[...opponent.roster].sort((a,b)=>byId[b].best.rating-byId[a].best.rating).slice(0,5):[];
    const ready=f.owned.filter(canEvolve).sort((a,b)=>byId[b].best.rating-byId[a].best.rating).slice(0,5);
    const collectionGrade=Math.round(f.active.reduce((sum,id)=>sum+byId[id].best.rating,0)/f.active.length);
    app.className="screen franchise-screen";
    app.innerHTML=`${renderFranchiseNav("home")}
      <section class="franchise-hero" style="--club:${state.teamColor}"><div><p class="eyebrow">Season ${f.season} · ${f.seasonComplete?`Final placement: ${ordinal(f.lastPlacement)}`:`Week ${Math.min(played+1,5)} of 5`}</p><h1>${esc(state.teamName)}</h1><p>${f.seasonComplete?`${f.lastReward?.label||"Season complete"} added to your box room.`:"Build the roster one game at a time. Every active player earns development from wins and production."}</p><div class="hero-actions">${f.seasonComplete?`<button class="primary-button gold" data-action="start-next-season">Begin season ${f.season+1}</button>`:`<button class="primary-button" data-action="prepare-franchise-game">Gameplan for Week ${played+1}</button>`}<button class="secondary-button" data-action="show-collection">Manage collection</button></div></div>
      <div class="franchise-record"><span>RECORD</span><strong>${record.w}–${record.l}${record.t?`–${record.t}`:""}</strong><small>${placement?ordinal(placement):"—"} in the league</small></div></section>
      <section class="franchise-metrics"><article><span>Active roster</span><strong>${collectionGrade}</strong><small>club OVR · ${f.active.length}/25 cards</small></article><article><span>Collection</span><strong>${f.discovered.length}</strong><small>of 386 discovered</small></article><article><span>Reward boxes</span><strong>${f.boxes.length}</strong><small>${f.boxes.length?"ready to open":"earned by season finish"}</small></article><article><span>Evolution ready</span><strong>${ready.length}</strong><small>players met development goals</small></article></section>
      <section class="franchise-grid">
        <article class="franchise-panel next-matchup"><div class="panel-head"><h2 class="panel-title">${next?"Next matchup":"Season complete"}</h2><span class="tiny">${next?`WEEK ${next.week}`:`${ordinal(f.lastPlacement||placement).toUpperCase()} PLACE`}</span></div>${next?`<div class="matchup-lockup">${teamShield(state.teamName,state.teamColor)}<span>VS</span>${teamShield(opponent.name,opponent.color)}<div><strong>${esc(opponent.name)}</strong><small>${teamRosterGrade(opponent)} OVR · ${f.standings[next.opponentIndex].w}–${f.standings[next.opponentIndex].l}</small></div></div><p class="panel-copy">Top threats</p><div class="threat-row">${threats.map((id)=>`<button data-action="profile" data-id="${id}"><img src="${byId[id].sprite}" alt="${esc(byId[id].name)}"><span>${esc(byId[id].name)}<b>${byId[id].best.rating}</b></span></button>`).join("")}</div>`:`<div class="reward-callout"><span class="box-orb ${f.lastReward?.type||"pokeball"}"></span><div><strong>${esc(f.lastReward?.label||"Season reward earned")}</strong><p>Open it now or carry it into next season.</p></div><button class="secondary-button" data-action="show-boxes">Open boxes</button></div>`}</article>
        <article class="franchise-panel standings-panel"><div class="panel-head"><h2 class="panel-title">League table</h2><span class="tiny">W · L · DIFF</span></div><div class="standings-list">${rows.map((row,index)=>`<div class="standing-row ${row.teamIndex===0?"user-team":""}"><b>${index+1}</b><i style="--team-color:${row.color}">${teamInitials(row.name)}</i><span>${esc(row.name)}</span><strong>${row.w}–${row.l}${row.t?`–${row.t}`:""}</strong><em>${row.pf-row.pa>=0?"+":""}${row.pf-row.pa}</em></div>`).join("")}</div></article>
        <article class="franchise-panel schedule-panel"><div class="panel-head"><h2 class="panel-title">Season schedule</h2><span class="tiny">ROUND ROBIN</span></div><div class="schedule-list">${f.schedule.map((game)=>{const team=state.leagueTeams[game.opponentIndex];return `<div class="schedule-row ${!game.played&&next===game?"next":""}"><span>W${game.week}</span>${teamShield(team.name,team.color)}<div><strong>${esc(team.name)}</strong><small>${game.played?`${game.humanScore}–${game.cpuScore}`:"Upcoming"}</small></div><b class="result ${game.result?.toLowerCase()||""}">${game.result||"—"}</b></div>`}).join("")}</div></article>
        <article class="franchise-panel development-panel"><div class="panel-head"><h2 class="panel-title">Development watch</h2><button class="text-button" data-action="show-collection">View all →</button></div>${ready.length?`<div class="ready-row">${ready.map((id)=>`<button data-action="evolve-player" data-id="${id}"><img src="${byId[id].sprite}" alt=""><span><strong>${esc(byId[id].name)}</strong><small>Evolution ready</small></span><b>EVOLVE</b></button>`).join("")}</div>`:`<div class="empty-state compact"><strong>No evolution is ready yet</strong><p>Active players progress through lineup games and wins, or by producing enough impact in any role.</p></div>`}</article>
      </section>`;
  }

  function prepareFranchiseGame() {
    const next=nextFranchiseGame();if(!next){toast("This season is complete.");return;}
    state.mode="franchise";state.game=null;state.humanRoster=[...state.franchise.active];
    state.humanLineup=state.franchise.lineup?JSON.parse(JSON.stringify(state.franchise.lineup)):autoAssign(state.humanRoster);state.leagueLineups[0]=state.humanLineup;state.opponentIndex=next.opponentIndex;syncOpponent();
    state.rosterTab="offense";state.selectedSlot=null;state.screen="roster";save();render();
  }

  function optimizeActiveRoster() {
    const f=state.franchise;if(!f)return;
    const optimized=autoAssign(f.owned);const core=[...new Set([...Object.values(optimized.offense),...Object.values(optimized.defense)])];
    const extras=f.owned.filter((id)=>!core.includes(id)).sort((a,b)=>byId[b].best.rating-byId[a].best.rating).slice(0,ROSTER_SIZE-core.length);
    f.active=[...core,...extras].slice(0,ROSTER_SIZE);state.humanRoster=[...f.active];state.humanLineup=autoAssign(state.humanRoster);f.lineup=JSON.parse(JSON.stringify(state.humanLineup));state.leagueTeams[0].roster=[...f.active];state.leagueLineups[0]=state.humanLineup;save();render();toast("Best balanced 25-player roster activated.");
  }

  function renderCollection() {
    const f=state.franchise;if(!f){state.screen="home";renderHome();return;}
    const term=state.collectionSearch.toLowerCase();
    let cards=f.owned.map((id)=>byId[id]).filter((p)=>(!term||p.name.toLowerCase().includes(term)||String(p.id).includes(term))&&(state.collectionGen==="all"||p.generation===Number(state.collectionGen)));
    cards.sort((a,b)=>state.collectionSort==="dex"?a.id-b.id:state.collectionSort==="name"?a.name.localeCompare(b.name):b.best.rating-a.best.rating);
    const active=new Set(f.active);
    app.className="screen franchise-screen collection-screen";
    app.innerHTML=`${renderFranchiseNav("collection")}<section class="collection-head"><div><p class="eyebrow">National collection · ${f.discovered.length}/386 discovered</p><h1 class="section-title">Club collection</h1><p class="lede">Your 25 active cards dress for every franchise game. Earn production with them to unlock evolution, or replace them as stronger pulls arrive.</p></div><div class="collection-actions"><button class="secondary-button" data-action="auto-best-roster">Auto-build best 25</button><button class="primary-button" data-action="franchise-roster">Edit depth chart</button></div></section>
      <section class="collection-summary"><span><b>${f.owned.length}</b> current cards</span><span><b>${f.active.length}</b> active roster</span><span><b>${f.owned.filter(canEvolve).length}</b> ready to evolve</span><span><b>${f.discovered.length}</b> Pokédex entries</span></section>
      <div class="collection-filters"><input id="collectionSearch" value="${esc(state.collectionSearch)}" placeholder="Search your collection" aria-label="Search collection"><select id="collectionGen"><option value="all">All generations</option>${[1,2,3].map((gen)=>`<option value="${gen}" ${String(state.collectionGen)===String(gen)?"selected":""}>Generation ${gen}</option>`).join("")}</select><select id="collectionSort"><option value="rating" ${state.collectionSort==="rating"?"selected":""}>Best rating</option><option value="dex" ${state.collectionSort==="dex"?"selected":""}>Pokédex order</option><option value="name" ${state.collectionSort==="name"?"selected":""}>Name</option></select></div>
      <section class="collection-grid">${cards.map((p)=>{const r=progressFor(p.id),ready=canEvolve(p.id);return `<article class="collection-card ${active.has(p.id)?"active-card":""} ${ready?"evolution-ready":""}"><div class="collection-card-top"><span>#${String(p.id).padStart(3,"0")} · GEN ${p.generation}</span><b>${active.has(p.id)?"ACTIVE":"RESERVE"}</b></div><button class="collection-art" data-action="profile" data-id="${p.id}"><img src="${p.art}" alt="${esc(p.name)}" loading="lazy"></button><div class="collection-card-body"><div class="collection-name"><div><h3>${esc(p.name)}</h3>${typePills(p)}</div><strong>${p.best.rating}<small>${p.best.position}</small></strong></div><div class="development-track"><span>${esc(evolutionCopy(p.id))}</span><i><i style="width:${p.evos?.length?Math.min(100,Math.max((r.impact/evolutionRequirement(p).impact)*100,(r.games/evolutionRequirement(p).games)*55+(r.wins/evolutionRequirement(p).wins)*45)):100}%"></i></i></div><div class="card-actions">${ready?`<button class="primary-button gold" data-action="evolve-player" data-id="${p.id}">Evolve</button>`:""}${active.has(p.id)?`<span class="active-label">In game roster</span>`:`<button class="secondary-button" data-action="activate-player" data-id="${p.id}">Add to active 25</button>`}</div></div></article>`}).join("")||`<div class="empty-state"><strong>No cards match those filters</strong><p>Try another generation or clear the search.</p></div>`}</section>`;
  }

  function showRosterSwap(newId) {
    const f=state.franchise,p=byId[newId];if(!f||!p)return;
    modalContent.innerHTML=`<div class="modal-head"><div><p class="eyebrow">Activate ${esc(p.name)}</p><h2 class="panel-title" id="modalTitle">Choose a card to bench</h2></div><button class="close-button" data-close-modal>×</button></div><div class="swap-roster">${f.active.map((id)=>{const current=byId[id];return `<button data-action="replace-active" data-old="${id}" data-new="${newId}"><img src="${current.sprite}" alt=""><span><strong>${esc(current.name)}</strong><small>${current.best.position} · ${current.best.rating} OVR</small></span><b>BENCH</b></button>`}).join("")}</div>`;openModal();
  }

  function replaceActive(oldId,newId) {
    const f=state.franchise;if(!f||!f.active.includes(oldId)||!f.owned.includes(newId))return;
    f.active=f.active.map((id)=>id===oldId?newId:id);state.humanRoster=[...f.active];state.humanLineup=autoAssign(state.humanRoster);f.lineup=JSON.parse(JSON.stringify(state.humanLineup));state.leagueTeams[0].roster=[...f.active];state.leagueLineups[0]=state.humanLineup;closeModal();save();render();toast(`${byId[newId].name} joined the active roster.`);
  }

  function showEvolutionChoices(id) {
    const p=byId[id];if(!canEvolve(id))return;
    if(p.evos.length===1){evolvePokemon(id,p.evos[0]);return;}
    modalContent.innerHTML=`<div class="modal-head"><div><p class="eyebrow">Branch evolution</p><h2 class="panel-title" id="modalTitle">Choose ${esc(p.name)}'s path</h2></div><button class="close-button" data-close-modal>×</button></div><div class="evolution-choices">${p.evos.map((targetId)=>{const target=byId[targetId];return `<button data-action="choose-evolution" data-from="${id}" data-to="${targetId}"><img src="${target.art}" alt="${esc(target.name)}"><span><strong>${esc(target.name)}</strong><small>${target.best.position} · ${target.best.rating} OVR</small></span></button>`}).join("")}</div>`;openModal();
  }

  function normalizeActive() {
    const f=state.franchise;f.active=[...new Set(f.active.filter((id)=>f.owned.includes(id)))];
    const bench=f.owned.filter((id)=>!f.active.includes(id)).sort((a,b)=>byId[b].best.rating-byId[a].best.rating);
    while(f.active.length<ROSTER_SIZE&&bench.length)f.active.push(bench.shift());
    f.active=f.active.slice(0,ROSTER_SIZE);
  }

  function evolvePokemon(fromId,toId) {
    const f=state.franchise,from=byId[fromId],to=byId[toId];if(!f||!from?.evos?.includes(toId)||!canEvolve(fromId))return;
    const record=progressFor(fromId);f.owned=f.owned.filter((id)=>id!==fromId);if(!f.owned.includes(toId))f.owned.push(toId);
    if(!f.discovered.includes(toId))f.discovered.push(toId);f.active=f.active.map((id)=>id===fromId?toId:id);
    const prior=f.records[toId]||emptyProgress();f.records[toId]={...prior,careerImpact:(prior.careerImpact||0)+(record.careerImpact||0)+record.impact};delete f.records[fromId];
    normalizeActive();state.humanRoster=[...f.active];state.humanLineup=autoAssign(state.humanRoster);f.lineup=JSON.parse(JSON.stringify(state.humanLineup));state.leagueTeams[0].roster=[...f.active];state.leagueLineups[0]=state.humanLineup;
    closeModal();save();render();playTone("score");toast(`${from.name} evolved into ${to.name}!`);
  }

  function rewardForPlacement(place) {
    return ({1:{type:"masterball",count:1,label:"Master Ball Box"},2:{type:"ultraball",count:1,label:"Ultra Ball Box"},3:{type:"greatball",count:2,label:"Two Great Ball Boxes"},4:{type:"greatball",count:1,label:"Great Ball Box"},5:{type:"pokeball",count:2,label:"Two Poké Ball Boxes"},6:{type:"pokeball",count:1,label:"Poké Ball Box"}})[place]||{type:"pokeball",count:1,label:"Poké Ball Box"};
  }

  function renderBoxes() {
    const f=state.franchise;if(!f){state.screen="home";renderHome();return;}
    app.className="screen franchise-screen boxes-screen";
    app.innerHTML=`${renderFranchiseNav("boxes")}<section class="collection-head"><div><p class="eyebrow">Season rewards · ${f.boxes.length} unopened</p><h1 class="section-title">Box room</h1><p class="lede">Placement decides the box. Pulls are permanent, and duplicates become development impact for the card you already own.</p></div><button class="secondary-button" data-action="franchise-home">Return to league</button></section>
      ${f.lastOpen?`<section class="box-results"><div class="panel-head"><h2 class="panel-title">Latest box · ${esc(BOXES[f.lastOpen.type].name)}</h2><button class="text-button" data-action="clear-box-results">Dismiss</button></div><div class="pull-grid">${f.lastOpen.results.map((result,index)=>{const p=byId[result.id];return `<article class="pull-card rarity-${p.rarity}" style="--delay:${index*120}ms"><span>${result.duplicate?"DUPLICATE TRAINING":"NEW CARD"}</span><img src="${p.art}" alt="${esc(p.name)}"><h3>${esc(p.name)}</h3><p>${p.best.position} · ${p.best.rating} OVR</p>${result.duplicate?`<small>+70 evolution impact</small>`:`<small>Generation ${p.generation} · ${p.rarity}</small>`}</article>`}).join("")}</div></section>`:""}
      <section class="box-shelf">${f.boxes.map((box,index)=>{const info=BOXES[box.type];return `<article class="box-card" style="--box:${info.color}"><div class="box-visual"><span class="box-orb ${box.type}"></span><i></i></div><p class="eyebrow">${esc(box.source)}</p><h2>${esc(info.name)}</h2><p>${esc(info.note)}</p><button class="primary-button" data-action="open-box" data-index="${index}">Open box</button></article>`}).join("")||`<div class="empty-state"><strong>No unopened boxes</strong><p>Finish the current five-game season to earn your next reward.</p><button class="primary-button" data-action="franchise-home">View season</button></div>`}</section>
      <section class="reward-ladder"><div class="panel-head"><h2 class="panel-title">Placement rewards</h2><span class="tiny">AWARDED AFTER WEEK 5</span></div><div class="reward-grid">${[1,2,3,4,5,6].map((place)=>{const reward=rewardForPlacement(place);return `<div><b>${place}</b><span class="box-orb small ${reward.type}"></span><strong>${ordinal(place)} place</strong><small>${esc(reward.label)}</small></div>`}).join("")}</div></section>`;
  }

  function boxPool(type,slot) {
    if(type==="pokeball")return POKEMON.filter((p)=>!p.prevo&&!p.legendary);
    if(type==="greatball"&&slot===0)return POKEMON.filter((p)=>!p.legendary&&["uncommon","rare","ultra"].includes(p.rarity));
    if(type==="greatball")return POKEMON.filter((p)=>!p.legendary);
    if(type==="ultraball"&&slot<2)return POKEMON.filter((p)=>!p.legendary&&["rare","ultra"].includes(p.rarity));
    if(type==="ultraball")return POKEMON.filter((p)=>!p.legendary&&p.rarity!=="common");
    if(type==="masterball"&&slot===0&&Math.random()<.3)return POKEMON.filter((p)=>p.legendary);
    if(type==="masterball"&&slot===0)return POKEMON.filter((p)=>["ultra","master"].includes(p.rarity));
    return POKEMON;
  }

  function openBox(index) {
    const f=state.franchise,box=f?.boxes?.[index];if(!box)return;
    const results=[],seen=new Set();
    for(let slot=0;slot<3;slot++){
      let pool=boxPool(box.type,slot).filter((p)=>!seen.has(p.id));const p=pool[Math.floor(Math.random()*pool.length)];seen.add(p.id);
      const duplicate=f.owned.includes(p.id);results.push({id:p.id,duplicate});
      if(duplicate)progressFor(p.id).impact+=70;else{f.owned.push(p.id);if(!f.discovered.includes(p.id))f.discovered.push(p.id);f.records[p.id]=emptyProgress();f.recentAdds.unshift(p.id);}
    }
    f.boxes.splice(index,1);f.lastOpen={type:box.type,source:box.source,results};normalizeActive();save();render();playTone("score");
  }

  function startNextSeason() {
    const f=state.franchise;if(!f?.seasonComplete)return;
    f.season++;state.game=null;setupFranchiseSeason();state.screen="franchise";save();render();toast(`Season ${f.season} schedule is live.`);
  }

  function teamAtPick(index) {
    const round = Math.floor(index/TEAM_COUNT);
    const slot = index%TEAM_COUNT;
    return round%2===0 ? slot : TEAM_COUNT-1-slot;
  }

  function draftedIds() { return new Set(state.leagueTeams.flatMap((team)=>team.roster)); }

  function targetForTeam(teamIndex) {
    const count = state.leagueTeams[teamIndex]?.roster.length || 0;
    return DRAFT_BLUEPRINT[Math.min(count,DRAFT_BLUEPRINT.length-1)];
  }

  function candidateTargetScore(p,target) {
    const positions = TARGET_MAP[target] || TARGET_MAP.FLEX;
    return Math.max(...positions.map((pos)=>p.football.positions[pos] || 25));
  }

  function smartPick(teamIndex) {
    const used = draftedIds();
    const target = targetForTeam(teamIndex);
    const available = POKEMON.filter((p)=>!used.has(p.id));
    const ranked = available.map((p)=>{
      let score = candidateTargetScore(p,target);
      if (LEGENDARIES.has(p.id)) score += 2;
      score += Math.random()*5;
      return [p,score];
    }).sort((a,b)=>b[1]-a[1]);
    return ranked[0]?.[0];
  }

  function commitPick(pokemon,teamIndex) {
    if (!pokemon || draftedIds().has(pokemon.id)) return;
    const roster = state.leagueTeams[teamIndex].roster;
    roster.push(pokemon.id);
    state.draftPicks.push({ index:state.draftIndex, teamIndex, pokemonId:pokemon.id });
    state.draftIndex++;
    playTone(teamIndex===0?"select":"hit");
  }

  function processCpuTurns() {
    while (state.draftIndex < TOTAL_PICKS && teamAtPick(state.draftIndex) !== 0) {
      const teamIndex=teamAtPick(state.draftIndex);
      commitPick(smartPick(teamIndex),teamIndex);
    }
    if (state.draftIndex >= TOTAL_PICKS) finalizeDraft();
  }

  function autoCompleteDraft() {
    while (state.draftIndex < TOTAL_PICKS) {
      const teamIndex = teamAtPick(state.draftIndex);
      commitPick(smartPick(teamIndex),teamIndex);
    }
    finalizeDraft();
  }

  function syncOpponent() {
    const opponent=state.leagueTeams[state.opponentIndex] || state.leagueTeams[1];
    state.opponentIndex=state.leagueTeams.indexOf(opponent);
    state.cpuName=opponent.name; state.cpuColor=opponent.color; state.cpuRoster=[...opponent.roster];
    state.cpuLineup=state.leagueLineups[state.opponentIndex] || autoAssign(opponent.roster);
  }

  function finalizeDraft() {
    state.leagueLineups=state.leagueTeams.map((team)=>autoAssign(team.roster));
    state.humanRoster=[...state.leagueTeams[0].roster];
    state.humanLineup=state.leagueLineups[0];
    syncOpponent();
    state.rosterTab="offense"; state.selectedSlot=null; state.screen="roster";
    const remaining=POKEMON.length-draftedIds().size;
    save(); render(); toast(`Six-team draft complete · ${remaining} Pokémon remain in the free-agent pool.`);
  }

  function renderDraft() {
    const currentTeamIndex = state.draftIndex < TOTAL_PICKS ? teamAtPick(state.draftIndex) : -1;
    const currentTeam = state.leagueTeams[currentTeamIndex];
    const used = draftedIds();
    const term = state.search.toLowerCase();
    let available = POKEMON.filter((p)=>!used.has(p.id) && (!term || p.name.toLowerCase().includes(term) || String(p.id).includes(term)) && (state.typeFilter==="all" || p.types.includes(state.typeFilter)) && (state.draftGen==="all"||p.generation===Number(state.draftGen)));
    const target = targetForTeam(0);
    available.sort((a,b)=> state.sort==="dex" ? a.id-b.id : state.sort==="name" ? a.name.localeCompare(b.name) : candidateTargetScore(b,target)-candidateTargetScore(a,target));
    const round=Math.min(ROSTER_SIZE-1,Math.floor(state.draftIndex/TEAM_COUNT));
    const queueStart=Math.max(0,round*TEAM_COUNT-TEAM_COUNT);
    const queueEnd=Math.min(TOTAL_PICKS,round*TEAM_COUNT+TEAM_COUNT*2);
    const futurePicks = Array.from({length:queueEnd-queueStart},(_,offset)=>{
      const i=queueStart+offset;
      const pick = state.draftPicks.find((item)=>item.index===i);
      const teamIndex = pick?.teamIndex ?? teamAtPick(i);
      const team = state.leagueTeams[teamIndex];
      const p = pick ? byId[pick.pokemonId] : null;
      return `<div class="pick-row ${i===state.draftIndex?"current":""} ${pick?"complete":""}"><span class="pick-no">${i+1}</span>${p?`<img src="${p.sprite}" alt="" />`:`<span class="team-shield mini-shield" style="--team-color:${team.color}">${esc(teamInitials(team.name))}</span>`}<div><strong>${p?esc(p.name):esc(team.name)}</strong><span>${p?`${esc(team.name)} · ${p.best.position} ${p.best.rating}`:`Round ${Math.floor(i/TEAM_COUNT)+1} · ${teamIndex===0?"Your pick":"CPU"}`}</span></div></div>`;
    }).join("");
    const leaguePanel=state.leagueTeams.map((team,index)=>{
      const latest=[...team.roster].slice(-3).reverse();
      const avg=team.roster.length?Math.round(team.roster.reduce((sum,id)=>sum+byId[id].best.rating,0)/team.roster.length):0;
      return `<button class="league-team ${index===currentTeamIndex?"active":""} ${index===0?"user-team":""}" data-action="show-league">
        <span class="league-color" style="--team-color:${team.color}">${esc(teamInitials(team.name))}</span>
        <span class="league-team-copy"><strong>${esc(team.name)}</strong><small>${team.roster.length}/${ROSTER_SIZE} · ${team.roster.length?`${avg} avg`:`targets ${esc(targetForTeam(index))}`}</small></span>
        <span class="league-picks">${latest.map((id)=>`<img src="${byId[id].sprite}" alt="${esc(byId[id].name)}"/>`).join("")}</span>
      </button>`;
    }).join("");
    app.className="screen draft-screen";
    app.innerHTML=`
      <section class="draft-head">
        <div><p class="eyebrow">Six-club National allocation draft · Gen 1–3</p><h1 class="section-title">Draft room</h1><p class="tiny">Round ${round+1} of ${ROSTER_SIZE} · Pick ${state.draftIndex+1} of ${TOTAL_PICKS} · ${currentTeamIndex===0?`${esc(state.teamName)} are on the clock`:esc(currentTeam?.name||"Draft complete")}</p></div>
        <div class="pick-clock"><strong>${ROSTER_SIZE-state.leagueTeams[0].roster.length}</strong><span>YOUR PICKS LEFT</span></div>
        <div class="draft-head-actions"><button class="secondary-button" data-action="auto-draft">Auto-complete</button><button class="quiet-button" data-action="draft-help">Ratings guide</button></div>
      </section>
      <section class="draft-layout">
        <aside class="draft-sidebar"><div class="panel-head"><h2 class="panel-title">Pick queue</h2><span class="tiny">6-TEAM SNAKE</span></div><div class="round-list">${futurePicks}</div></aside>
        <div class="draft-board">
          <div class="filter-bar">
            <input id="draftSearch" value="${esc(state.search)}" placeholder="Search name or Pokédex #" aria-label="Search Pokémon" />
            <select id="typeFilter" aria-label="Filter by type"><option value="all">All types</option>${Object.keys(TYPE_COLORS).map((type)=>`<option value="${type}" ${state.typeFilter===type?"selected":""}>${type[0].toUpperCase()+type.slice(1)}</option>`).join("")}</select>
            <select id="draftGen" aria-label="Filter by generation"><option value="all">All generations</option>${[1,2,3].map((gen)=>`<option value="${gen}" ${String(state.draftGen)===String(gen)?"selected":""}>Generation ${gen}</option>`).join("")}</select>
            <select id="sortDraft" aria-label="Sort draft pool"><option value="fit" ${state.sort==="fit"?"selected":""}>Best ${esc(target)} fit</option><option value="dex" ${state.sort==="dex"?"selected":""}>Pokédex order</option><option value="name" ${state.sort==="name"?"selected":""}>Name</option></select>
          </div>
          <div class="pokemon-grid">${available.map((p)=>`
            <button class="pokemon-card ${LEGENDARIES.has(p.id)?"legendary":""}" data-action="draft-pick" data-id="${p.id}" ${currentTeamIndex!==0?"disabled":""}>
              <span class="dex-no">#${String(p.id).padStart(3,"0")}</span><img src="${p.art}" alt="${esc(p.name)}" loading="lazy" />
              <h3>${esc(p.name)}</h3><div class="card-meta"><span class="fit-label">${esc(target)} FIT</span><b class="fit-score">${candidateTargetScore(p,target)}</b></div>${typePills(p)}${miniStats(p)}
            </button>`).join("")}</div>
        </div>
        <aside class="draft-roster"><div class="panel-head"><h2 class="panel-title">League war room</h2><span class="tiny">${used.size}/${TOTAL_PICKS}</span></div><div class="league-stack">${leaguePanel}</div><button class="league-open" data-action="show-league">Inspect all six rosters →</button></aside>
      </section>`;
  }

  function autoAssign(rosterIds) {
    const available = rosterIds.map((id)=>byId[id]);
    const unfilled = [...ALL_SLOTS];
    const assigned = {};
    while (unfilled.length && available.length) {
      let bestChoice = null;
      for (const slot of unfilled) {
        const pos = basePos(slot);
        const ranked = available.map((p)=>[p,p.football.positions[pos] || 25]).sort((a,b)=>b[1]-a[1]);
        const scarcity = (ranked[0]?.[1]||0) - (ranked[1]?.[1]||0) + ((ranked[0]?.[1]||50)-50)*.08;
        if (!bestChoice || scarcity > bestChoice.scarcity) bestChoice={ slot, pokemon:ranked[0][0], scarcity };
      }
      assigned[bestChoice.slot]=bestChoice.pokemon.id;
      available.splice(available.findIndex((p)=>p.id===bestChoice.pokemon.id),1);
      unfilled.splice(unfilled.indexOf(bestChoice.slot),1);
    }
    const kicker = rosterIds.map((id)=>byId[id]).sort((a,b)=>b.football.positions.K-a.football.positions.K)[0];
    const punter = rosterIds.map((id)=>byId[id]).filter((p)=>p.id!==kicker.id).sort((a,b)=>b.football.positions.P-a.football.positions.P)[0];
    return { offense:Object.fromEntries(OFFENSE.map((slot)=>[slot,assigned[slot]])), defense:Object.fromEntries(DEFENSE.map((slot)=>[slot,assigned[slot]])), special:{K:kicker.id,P:punter.id} };
  }

  function usedLineupIds(lineup) {
    return new Set([...Object.values(lineup.offense),...Object.values(lineup.defense)]);
  }

  function teamRosterGrade(team) {
    if (!team?.roster.length) return 0;
    if (team.roster.length < ALL_SLOTS.length) return Math.round(team.roster.reduce((sum,id)=>sum+byId[id].best.rating,0)/team.roster.length);
    const lineup=state.leagueLineups[state.leagueTeams.indexOf(team)] || autoAssign(team.roster);
    return Math.round(ALL_SLOTS.reduce((sum,slot)=>{
      const side=OFFENSE.includes(slot)?"offense":"defense";
      return sum+(byId[lineup[side][slot]]?.football.positions[basePos(slot)]||0);
    },0)/ALL_SLOTS.length);
  }

  function renderRoster() {
    const tab = state.rosterTab;
    const lineup = state.humanLineup;
    const positions = tab === "offense" ? OFFENSE : tab === "defense" ? DEFENSE : SPECIAL;
    const formationKey = tab === "special" ? "offense" : tab;
    const selected = state.selectedSlot;
    const selectedPos = selected ? basePos(selected) : null;
    const used = usedLineupIds(lineup);
    const bench = state.humanRoster.filter((id)=>!used.has(id));
    const sideLineup = tab === "special" ? lineup.special : lineup[tab];
    const coords = tab === "special" ? { K:[38,52],P:[62,52] } : FORMATION_COORDS[tab];
    const grade = Math.round(positions.reduce((sum,slot)=>sum+(byId[sideLineup[slot]]?.football.positions[basePos(slot)]||0),0)/positions.length);
    const next=state.mode==="franchise"?nextFranchiseGame():null;
    const buttonLabel = state.returnToReport ? "Return to quarter report" : state.game ? "Return to game" : state.mode==="franchise"?`Kick off Week ${next?.week||""}`:"Kick off exhibition";
    const opponent=state.leagueTeams[state.opponentIndex];
    const opponentTop=[...opponent.roster].sort((a,b)=>byId[b].best.rating-byId[a].best.rating).slice(0,4);
    app.className="screen roster-screen";
    app.innerHTML=`${state.mode==="franchise"&&!state.game?renderFranchiseNav("roster"):""}
      <section class="roster-top">
        <div class="team-lockup">${teamShield(state.teamName,state.teamColor)}<div><h1>${esc(state.teamName)}</h1><p>25-player ${state.mode==="franchise"?"franchise":"draft"} roster · ${grade} ${tab.toUpperCase()} grade</p></div></div>
        <div class="roster-actions">
          <div class="segmented" role="tablist">
            ${["offense","defense","special"].map((name)=>`<button class="seg-button ${tab===name?"active":""}" data-action="roster-tab" data-tab="${name}" role="tab">${name}</button>`).join("")}
          </div>
          ${state.mode==="franchise"?`<button class="secondary-button" data-action="show-collection">Collection</button>`:`<button class="secondary-button" data-action="show-league">League rosters</button>`}
          <button class="secondary-button" data-action="optimize-lineup">Auto optimize</button>
          <button class="primary-button" data-action="start-game">${buttonLabel}</button>
        </div>
      </section>
      <section class="opponent-strip">
        <div class="opponent-label"><span class="tiny">${state.mode==="franchise"?`WEEK ${next?.week||""} OPPONENT`:"EXHIBITION OPPONENT"}</span><select id="opponentSelect" aria-label="Choose opponent" ${state.game||state.mode==="franchise"?"disabled":""}>${state.leagueTeams.slice(1).map((team,index)=>`<option value="${index+1}" ${state.opponentIndex===index+1?"selected":""}>${esc(team.name)} · ${teamRosterGrade(team)} OVR</option>`).join("")}</select></div>
        <div class="opponent-scout">${teamShield(opponent.name,opponent.color)}<div><strong>${esc(opponent.name)}</strong><small>${teamRosterGrade(opponent)} roster grade · Top threats</small></div><span class="opponent-faces">${opponentTop.map((id)=>`<img src="${byId[id].sprite}" alt="${esc(byId[id].name)}" title="${esc(byId[id].name)}"/>`).join("")}</span></div>
        <p>${state.mode==="franchise"?"Season matchup locked. Set the depth chart before kickoff.":state.game?"Opponent locked for this game.":"Choose any of the five CPU-drafted clubs before kickoff."}</p>
      </section>
      <section class="roster-layout">
        <div class="formation-panel">
          <div class="formation-head"><div><h2 class="panel-title">${tab==="offense"?"11 Personnel":tab==="defense"?"Base 4–3":"Specialists"}</h2><span class="tiny">Click a starter, then choose a reserve to substitute</span></div><b class="fit-score">${grade}</b></div>
          <div class="formation-field ${formationKey}">
            ${positions.map((slot)=>{
              const p=byId[sideLineup[slot]]; const pos=basePos(slot); const [x,y]=coords[slot]; const ovr=p?.football.positions[pos]||0;
              return `<button class="formation-slot ${selected===slot?"selected":""}" style="left:${x}%;top:${y}%;--slot-color:${state.teamColor}" data-action="select-slot" data-slot="${slot}">
                <span class="slot-photo"><img src="${p?.sprite||""}" alt="${esc(p?.name||slot)}"/><b class="slot-ovr">${ovr}</b></span><span class="slot-pos">${slot}</span><span class="slot-name">${esc(p?.name||"Empty")}</span>
              </button>`;
            }).join("")}
            <div class="formation-tip">${selected?`Choose a reserve to replace ${selected}, or another starter to swap.`:"Select any player to inspect their complete ratings."}</div>
          </div>
        </div>
        <aside class="bench-panel">
          <div class="panel-head"><h2 class="panel-title">${tab==="special"?"Full roster":"Available reserves"}</h2><span class="tiny">${tab==="special"?state.humanRoster.length:bench.length} PLAYERS</span></div>
          <div class="bench-list">
            ${(tab==="special"?state.humanRoster:bench).map((id)=>{
              const p=byId[id]; const fit=selectedPos?p.football.positions[selectedPos]:p.best.rating; const label=selectedPos?`${selectedPos} fit`:`Best: ${p.best.position}`;
              return `<button class="bench-card" data-action="bench-player" data-id="${id}"><img src="${p.sprite}" alt=""/><span><strong>${esc(p.name)}</strong>${typePills(p)}<small>${p.football.skills.stamina} stamina · ${p.football.skills.toughness} toughness</small></span><span class="bench-fit"><b>${fit}</b><span>${label}</span></span></button>`;
            }).join("")}
          </div>
        </aside>
      </section>`;
  }

  function substitutePlayer(id) {
    if (!state.selectedSlot) { showProfile(id); return; }
    const tab = state.rosterTab;
    const lineupGroup = tab === "special" ? state.humanLineup.special : state.humanLineup[tab];
    const selectedId = lineupGroup[state.selectedSlot];
    if (tab === "special") {
      lineupGroup[state.selectedSlot]=id;
    } else {
      const otherGroup = tab === "offense" ? state.humanLineup.defense : state.humanLineup.offense;
      const otherSlot = Object.keys(otherGroup).find((slot)=>otherGroup[slot]===id);
      if (otherSlot) {
        toast(`${byId[id].name} is already starting at ${otherSlot}. Select an unassigned reserve.`);
        return;
      }
      lineupGroup[state.selectedSlot]=id;
    }
    state.leagueLineups[0]=state.humanLineup;if(state.mode==="franchise"&&state.franchise)state.franchise.lineup=JSON.parse(JSON.stringify(state.humanLineup));
    state.selectedSlot=null; save(); render();
    toast(`${byId[id].name} moved into the starting lineup.`);
    if (selectedId && selectedId!==id) playTone("select");
  }

  function swapSlots(slot) {
    if (!state.selectedSlot) { state.selectedSlot=slot; render(); return; }
    if (state.selectedSlot===slot) { state.selectedSlot=null; render(); return; }
    const group = state.rosterTab === "special" ? state.humanLineup.special : state.humanLineup[state.rosterTab];
    [group[state.selectedSlot],group[slot]]=[group[slot],group[state.selectedSlot]];
    state.leagueLineups[0]=state.humanLineup;if(state.mode==="franchise"&&state.franchise)state.franchise.lineup=JSON.parse(JSON.stringify(state.humanLineup));
    state.selectedSlot=null; save(); render(); playTone("select");
  }

  function showProfile(id) {
    const p=byId[id];
    if (!p) return;
    const raw=[["HP","hp"],["ATK","atk"],["DEF","def"],["SP. ATK","spa"],["SP. DEF","spd"],["SPEED","spe"]];
    const skills=["strength","speed","acceleration","agility","stamina","toughness","awareness","technique","hands","carrying","runBlock","passBlock","tackle","blockShed","manCover","zoneCover"];
    const pos=Object.entries(p.football.positions).sort((a,b)=>b[1]-a[1]);
    const fatigue=state.game?.fatigue?.[id];
    const franchiseOwned=state.franchise?.owned?.includes(id);const record=franchiseOwned?progressFor(id):null;
    modalContent.innerHTML=`
      <div class="modal-head"><h2 class="panel-title" id="modalTitle">Player profile</h2><button class="close-button" data-close-modal aria-label="Close">×</button></div>
      <div class="player-profile">
        <div class="profile-art"><img src="${p.art}" alt="${esc(p.name)}"/><p class="eyebrow">#${String(p.id).padStart(3,"0")} · GEN ${p.generation||1} · ${String(p.rarity||"common").toUpperCase()}</p><h2>${esc(p.name)}</h2>${typePills(p)}<p class="tiny">${(p.height/10).toFixed(1)} m · ${(p.weight/10).toFixed(1)} kg${fatigue!=null?` · ${Math.round(fatigue)}% condition`:""}</p></div>
        <div class="profile-body">
          ${franchiseOwned?`<div class="profile-development"><span>FRANCHISE DEVELOPMENT</span><strong>${esc(evolutionCopy(id))}</strong><small>${record.games} games · ${record.wins} wins · ${record.impact} impact · ${record.touchdowns} TD · ${record.tackles} tackles</small>${canEvolve(id)?`<button class="primary-button gold" data-action="evolve-player" data-id="${id}">Evolve now</button>`:""}</div>`:""}
          <p class="ratings-title">Pokémon base stats</p><div class="raw-stat-grid">${raw.map(([label,key])=>`<div class="raw-stat"><span>${label}</span><b>${p.stats[key]}</b></div>`).join("")}</div>
          <p class="ratings-title">Football attributes</p><div class="rating-bars">${skills.map((key)=>`<div class="rating-row"><span>${key.replace(/([A-Z])/g," $1")}</span><i class="rating-track"><i style="width:${p.football.skills[key]}%"></i></i><b>${p.football.skills[key]}</b></div>`).join("")}</div>
          <p class="ratings-title" style="margin-top:18px">Position fit</p><div class="position-fits">${pos.map(([key,value])=>`<div class="position-fit"><span>${key}</span><b>${value}</b></div>`).join("")}</div>
        </div>
      </div>`;
    openModal();
  }

  function showRatingsGuide() {
    modalContent.innerHTML=`<div class="modal-head"><h2 class="panel-title" id="modalTitle">How football ratings work</h2><button class="close-button" data-close-modal>×</button></div><div class="play-explain"><h3 class="explain-headline">Six stats. Every position.</h3><p class="explain-detail">Attack drives physical force. Special Attack drives technical execution. Defense creates leverage and anchoring. Special Defense becomes awareness and composure. Speed controls movement and pursuit. HP supplies stamina and durability. Height and weight add a capped body-profile influence, so size matters without deciding every matchup.</p><div class="matchup-box">${[["Attack","Strength · blocking · tackling"],["Sp. Attack","Throwing · routes · kicking"],["Defense","Anchoring · contact balance"],["Sp. Defense","Awareness · coverage · discipline"],["Speed","Acceleration · pursuit · separation"],["HP","Stamina · durability · carrying"]].map(([a,b])=>`<div class="matchup-row"><strong>${a}</strong><span>feeds</span><strong>${b}</strong></div>`).join("")}</div><p class="explain-detail">Position overall is a summary only. The play engine compares the underlying skills, condition, scheme, type interaction, and controlled variance on every event.</p></div>`;
    openModal();
  }

  function showLeagueOverview() {
    const teams=state.leagueTeams || [];
    modalContent.innerHTML=`<div class="modal-head"><div><p class="eyebrow">${TOTAL_PICKS} selections · ${POKEMON.length-TOTAL_PICKS} remain available</p><h2 class="panel-title" id="modalTitle">National league rosters</h2></div><button class="close-button" data-close-modal>×</button></div><div class="league-modal-grid">${teams.map((team,index)=>{
      const sorted=[...team.roster].sort((a,b)=>byId[b].best.rating-byId[a].best.rating);
      return `<section class="league-roster-card ${index===0?"user-team":""}" style="--club:${team.color}"><div class="league-roster-head">${teamShield(team.name,team.color)}<div><h3>${esc(team.name)}</h3><p>${team.roster.length}/${ROSTER_SIZE} PLAYERS · ${teamRosterGrade(team)} ROSTER OVR${index===state.opponentIndex?" · SELECTED OPPONENT":""}</p></div></div><div class="league-roster-grid">${sorted.map((id)=>{const p=byId[id];return `<button data-action="profile" data-id="${id}" title="${esc(p.name)} · ${p.best.position} ${p.best.rating}"><img src="${p.sprite}" alt="${esc(p.name)}"/><span>${p.best.position}</span></button>`;}).join("")}</div></section>`;
    }).join("")}</div>`;
    openModal();
  }

  function openModal() { modalShell.classList.remove("hidden"); setTimeout(()=>modalShell.querySelector("button")?.focus(),0); }
  function closeModal() { modalShell.classList.add("hidden"); modalContent.innerHTML=""; }

  function newPlayerStat() {
    return { passAtt:0,passComp:0,passYds:0,passTD:0,ints:0,rushAtt:0,rushYds:0,rushTD:0,targets:0,receptions:0,recYds:0,recTD:0,drops:0,blocksWon:0,blocksLost:0,pressuresAllowed:0,sacksAllowed:0,tackles:0,missedTackles:0,sacks:0,pressures:0,interceptions:0,passesDefended:0,blocksShed:0,typeWins:0,points:0 };
  }

  function newTeamStat() { return { plays:0,totalYards:0,passYards:0,rushYards:0,firstDowns:0,turnovers:0,thirdAtt:0,thirdConv:0,penalties:0,penaltyYards:0,time:0 }; }

  function startGame() {
    if (state.returnToReport) { state.returnToReport=false; state.screen="report"; save(); render(); return; }
    if (state.game) { state.screen="game"; save(); render(); return; }
    const stats={}; const fatigue={};
    [...state.humanRoster,...state.cpuRoster].forEach((id)=>{stats[id]=newPlayerStat();fatigue[id]=100;});
    state.game={
      seed:Math.floor(Math.random()*1e9), rngStep:0, quarter:1, clock:480, possession:"human", openingReceiver:"human", secondHalfReceiver:"cpu",
      down:1,distance:10,yard:25,scores:{human:0,cpu:0},stats,teamStats:{human:newTeamStat(),cpu:newTeamStat()},fatigue,
      playLog:[],drives:[],matchups:{},phase:"playing",animating:false,lastEvent:null,playNumber:0,selectedPlay:null,currentPlay:null,franchiseProcessed:false,
      strategy:{ human:{offense:"balanced",tempo:"normal",fourth:"balanced",defense:"balanced",blitz:"normal"}, cpu:{offense:"balanced",tempo:"normal",fourth:"balanced",defense:"balanced",blitz:"normal"} }
    };
    state.screen="game"; state.sidebarTab="plays"; save(); render();
  }

  function random() {
    const g=state.game;
    let t=(g.seed + (++g.rngStep)*0x6D2B79F5)>>>0;
    t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61);
    return ((t^(t>>>14))>>>0)/4294967296;
  }
  const choose=(items)=>items[Math.floor(random()*items.length)];
  const otherTeam=(team)=>team==="human"?"cpu":"human";
  const teamName=(team)=>team==="human"?state.teamName:state.cpuName;
  const lineupFor=(team)=>team==="human"?state.humanLineup:state.cpuLineup;
  const playerAt=(team,side,slot)=>byId[lineupFor(team)[side][slot]];
  const statFor=(p)=>state.game.stats[p.id];
  const condition=(p)=>state.game.fatigue[p.id] ?? 100;
  const fatiguePenalty=(p)=>Math.round(Math.max(0,78-condition(p))*.16);
  const rating=(p,key)=>p.football.skills[key]-fatiguePenalty(p);

  function recordMatchup(actor,target,label,actorScore,targetScore,typeBonus,result) {
    const key=`${actor.id}-${target.id}-${label}`;
    const ledger=state.game.matchups[key] ||= {actorId:actor.id,targetId:target.id,label,wins:0,losses:0,typeNet:0,last:""};
    if (result==="actor") ledger.wins++; else ledger.losses++;
    ledger.typeNet+=typeBonus; ledger.last=`${actorScore}–${targetScore}`;
    if (typeBonus>0 && result==="actor") statFor(actor).typeWins++;
    return { left:{id:actor.id,name:actor.name,score:actorScore}, right:{id:target.id,name:target.name,score:targetScore}, label, typeBonus, winner:result, note:typeBonus>0?`${actor.name} gained +${typeBonus} from type advantage`:typeBonus<0?`${actor.name} carried a ${typeBonus} type penalty`:"Types were neutral" };
  }

  function fatiguePlayers(ids,amount=1.5) {
    const active=new Set(ids.filter(Boolean));
    for (const id of [...state.humanRoster,...state.cpuRoster]) {
      if (active.has(id)) state.game.fatigue[id]=clamp(state.game.fatigue[id]-amount*(.85+random()*.35),35,100);
      else state.game.fatigue[id]=clamp(state.game.fatigue[id]+.08,35,100);
    }
  }

  function choosePlayType(team) {
    const g=state.game;
    const style=g.strategy[team].offense;
    let runChance={ground:.68,air:.25,aggressive:.31,balanced:.47}[style] ?? .47;
    if (g.down===3 && g.distance>=7) runChance-=.2;
    if (g.down===3 && g.distance<=2) runChance+=.17;
    if (g.quarter>=4 && g.clock<150 && g.scores[team]<g.scores[otherTeam(team)]) runChance-=.24;
    if (random()<runChance) return random()<.56?"inside-run":"outside-run";
    const roll=random();
    if (style==="aggressive") return roll<.24?"short-pass":roll<.6?"medium-pass":"deep-pass";
    return roll<.48?"short-pass":roll<.82?"medium-pass":"deep-pass";
  }

  function contextPlayOptions(team) {
    const g=state.game;if(!g)return PLAYBOOK.slice(0,4);
    let ids;
    if(g.down>=3&&g.distance>=7)ids=["mesh","screen","dig-cross","four-verts"];
    else if(g.distance<=3)ids=["inside-zone","power-left","quick-slants","play-action"];
    else if(g.yard>=70)ids=["wide-stretch","quick-slants","post-wheel","play-action"];
    else ids=["inside-zone","wide-stretch","quick-slants","dig-cross","play-action","mesh"];
    const style=g.strategy[team]?.offense;
    if(style==="ground")ids=["inside-zone","power-left","wide-stretch","play-action"];
    if(style==="air")ids=["quick-slants","mesh","dig-cross","sideline-out"];
    if(style==="aggressive")ids=["play-action","dig-cross","four-verts","post-wheel"];
    const shift=(g.playNumber+(team==="cpu"?2:0))%ids.length;
    const rotated=[...ids.slice(shift),...ids.slice(0,shift)].slice(0,4);
    return rotated.map((id)=>PLAYBOOK.find((play)=>play.id===id)).filter(Boolean);
  }

  function choosePlayCall(team) {
    const selected=team==="human"&&state.game.selectedPlay?PLAYBOOK.find((play)=>play.id===state.game.selectedPlay):null;
    if(selected)return selected;
    const type=choosePlayType(team);const matching=PLAYBOOK.filter((play)=>play.type===type);
    if(team==="human"&&!state.autoplay)return contextPlayOptions(team).find((play)=>play.type===type)||contextPlayOptions(team)[0];
    return choose(matching.length?matching:PLAYBOOK);
  }

  function fourthDownDecision(team) {
    const g=state.game;
    if (g.down!==4) return null;
    const aggression=g.strategy[team].fourth;
    const trailing=g.scores[team]<g.scores[otherTeam(team)];
    if (g.yard>=62 && 117-g.yard<=58 && !(trailing&&g.quarter>=4&&g.clock<100&&g.scores[otherTeam(team)]-g.scores[team]>3)) return "field-goal";
    const goDistance=aggression==="aggressive"?4:aggression==="conservative"?1:2;
    if (g.distance<=goDistance || (trailing&&g.quarter>=4&&g.clock<150)) return "go";
    return "punt";
  }

  function contest(actor,target,actorSkill,targetSkill,schemeBonus=0,typeDirection="actor") {
    const edge=typeDirection==="actor"?typeEdge(actor,target):typeEdge(target,actor);
    const appliedEdge=typeDirection==="actor"?edge:-edge;
    const actorScore=Math.round(actorSkill+schemeBonus+appliedEdge+(random()-.5)*12);
    const targetScore=Math.round(targetSkill+(random()-.5)*12);
    return { margin:actorScore-targetScore,actorScore,targetScore,typeBonus:appliedEdge,winner:actorScore>=targetScore?"actor":"target" };
  }

  function resolveRun(team,type,call=null) {
    const g=state.game; const defense=otherTeam(team);
    const inside=type==="inside-run";
    const blockerSlot=inside?choose(["LG","C","RG"]):choose(["LT","RT","TE"]);
    const defenderSlot=inside?choose(["DT1","DT2","MLB"]):choose(["LE","RE","WLB","SLB"]);
    const blocker=playerAt(team,"offense",blockerSlot); const defender=playerAt(defense,"defense",defenderSlot);
    const carrier=playerAt(team,"offense","RB");
    const boxFocus=g.strategy[defense].defense;
    const callBonus=call?.id==="power-left"?2:call?.id==="jet-sweep"?1:0;
    const scheme=(g.strategy[team].offense==="ground"?3:0)+(boxFocus==="pass"?3:boxFocus==="run"?-4:0)+callBonus;
    const block=contest(blocker,defender,rating(blocker,"runBlock"),rating(defender,"blockShed"),scheme,"actor");
    const blockMatch=recordMatchup(blocker,defender,"Run block",block.actorScore,block.targetScore,block.typeBonus,block.winner);
    if (block.margin>=0) statFor(blocker).blocksWon++; else {statFor(blocker).blocksLost++;statFor(defender).blocksShed++;}

    const tackleSlot=inside?choose(["MLB","WLB","SLB","SS"]):choose(["CB1","CB2","FS","SS"]);
    const tackler=playerAt(defense,"defense",tackleSlot);
    const tackle=contest(tackler,carrier,rating(tackler,"tackle"),weighted([rating(carrier,"carrying"),.46],[rating(carrier,"elusiveness"),.34],[rating(carrier,"trucking"),.2]),boxFocus==="run"?3:0,"actor");
    const tackleMatch=recordMatchup(tackler,carrier,"Open-field tackle",tackle.actorScore,tackle.targetScore,tackle.typeBonus,tackle.winner);
    let yards=Math.round(3.2+block.margin*.14+(rating(carrier,"vision")-70)*.05+(random()-.5)*5);
    let missed=false;
    if (tackle.margin<-3) { yards+=Math.round(4+random()*9+(rating(carrier,"speed")-rating(tackler,"pursuit"))*.09); missed=true; statFor(tackler).missedTackles++; }
    else statFor(tackler).tackles++;
    yards=clamp(yards,-5,38);
    const fumble=random()<Math.max(.004,(tackle.margin-16)*.0015+(100-rating(carrier,"carrying"))*.00035);
    const event={ type,category:"run",yards,startYard:g.yard,possession:team,participants:{carrier:carrier.id,blocker:blocker.id,defender:defender.id,tackler:tackler.id},matchups:[blockMatch,tackleMatch],turnover:fumble };
    statFor(carrier).rushAtt++; statFor(carrier).rushYds+=yards;
    g.teamStats[team].rushYards+=yards;
    if (fumble) { g.teamStats[team].turnovers++; event.headline=`${carrier.name} fumbles after ${yards} yards`; event.detail=`${tackler.name} jars the ball loose and ${teamName(defense)} recover.`; }
    else { event.headline=`${carrier.name} ${yards>=10?"breaks loose":yards<0?"is stopped in the backfield":`gains ${yards} yard${yards===1?"":"s"}`}`; event.detail=`${defender.name} ${block.margin<0?`beat ${blocker.name} at the point of attack`:`was sealed by ${blocker.name}`}. ${missed?`${tackler.name} missed in space.`:`${tackler.name} finished the play.`}`; }
    return event;
  }

  function resolvePass(team,type,call=null) {
    const g=state.game; const defense=otherTeam(team);
    const qb=playerAt(team,"offense","QB");
    const depth=type==="short-pass"?"short":type==="medium-pass"?"medium":"deep";
    const targetSlot=call?.id==="screen"?"RB":call?.id==="post-wheel"?choose(["RB","WR1"]):call?.id==="quick-slants"?choose(["WR1","WR2","WR3"]):depth==="short"?choose(["WR3","TE","RB","WR1"]):depth==="medium"?choose(["WR1","WR2","TE","WR3"]):choose(["WR1","WR2","WR3"]);
    const target=playerAt(team,"offense",targetSlot);
    const coverSlot=targetSlot==="WR1"?"CB1":targetSlot==="WR2"?"CB2":targetSlot==="WR3"?choose(["CB1","SS"]):targetSlot==="TE"?choose(["SLB","SS"]):choose(["WLB","MLB"]);
    const cover=playerAt(defense,"defense",coverSlot);
    const blockerSlot=choose(["LT","LG","C","RG","RT"]);
    const rushSlot=blockerSlot==="LT"?"RE":blockerSlot==="RT"?"LE":choose(["DT1","DT2"]);
    const blocker=playerAt(team,"offense",blockerSlot); const rusher=playerAt(defense,"defense",rushSlot);
    const blitz=g.strategy[defense].blitz; const protectScheme=(g.strategy[team].offense==="air"?2:0)+(blitz==="heavy"?-5:blitz==="light"?2:0);
    const protection=contest(blocker,rusher,rating(blocker,"passBlock"),weighted([rating(rusher,"finesseRush"),.52],[rating(rusher,"powerRush"),.48]),protectScheme,"actor");
    const protectionMatch=recordMatchup(blocker,rusher,"Pass protection",protection.actorScore,protection.targetScore,protection.typeBonus,protection.winner);
    if (protection.margin>=0) statFor(blocker).blocksWon++; else {statFor(blocker).blocksLost++;statFor(blocker).pressuresAllowed++;statFor(rusher).pressures++;}
    const pressure=protection.margin<-4 || (blitz==="heavy"&&random()<.2);
    statFor(qb).passAtt++;
    statFor(target).targets++;
    if (pressure && protection.margin<-13 && random()<.52) {
      const loss=-Math.round(3+random()*8); statFor(rusher).sacks++; statFor(blocker).sacksAllowed++;
      const event={type:"sack",category:"pass",yards:loss,startYard:g.yard,possession:team,participants:{qb:qb.id,target:target.id,blocker:blocker.id,rusher:rusher.id,cover:cover.id},matchups:[protectionMatch],headline:`${rusher.name} sacks ${qb.name}`,detail:`${rusher.name} defeated ${blocker.name} and arrived before the route developed. Loss of ${Math.abs(loss)}.`,turnover:false};
      return event;
    }

    const coverageStyle=g.strategy[defense].defense;
    const coverSkill=coverageStyle==="pass"?3:coverageStyle==="run"?-3:0;
    const route=contest(target,cover,weighted([rating(target,"route"),.6],[rating(target,"speed"),.4]),weighted([rating(cover,"manCover"),.6],[rating(cover,"zoneCover"),.4]),(g.strategy[team].offense==="air"?2:0)-coverSkill,"actor");
    const routeMatch=recordMatchup(target,cover,"Route vs coverage",route.actorScore,route.targetScore,route.typeBonus,route.winner);
    const depthPenalty={short:0,medium:6,deep:13}[depth];
    const accuracy=weighted([rating(qb,"throwAccuracy"),.64],[rating(qb,"awareness"),.36])-depthPenalty-(pressure?8:0)+(random()-.5)*11;
    const coverage=weighted([rating(cover,"manCover"),.48],[rating(cover,"zoneCover"),.34],[rating(cover,"awareness"),.18])-route.margin*.22;
    const interceptChance=clamp((coverage-accuracy-5)*.006+(depth==="deep"?.018:.006),.004,.16);
    if (random()<interceptChance) {
      statFor(qb).ints++; statFor(cover).interceptions++; g.teamStats[team].turnovers++;
      return {type:"interception",category:"pass",yards:Math.round({short:5,medium:14,deep:26}[depth]+random()*9),startYard:g.yard,possession:team,participants:{qb:qb.id,target:target.id,blocker:blocker.id,rusher:rusher.id,cover:cover.id},matchups:[protectionMatch,routeMatch],headline:`Intercepted by ${cover.name}`,detail:`${cover.name} read ${qb.name}, undercut ${target.name}, and returned the ball.`,turnover:true,interception:true};
    }
    const onTarget=accuracy-coverage+route.margin*.32+(random()-.5)*14;
    if (onTarget<-6) {
      if (route.margin<0) statFor(cover).passesDefended++;
      return {type:"incomplete",category:"pass",yards:0,startYard:g.yard,possession:team,participants:{qb:qb.id,target:target.id,blocker:blocker.id,rusher:rusher.id,cover:cover.id},matchups:[protectionMatch,routeMatch],headline:`Incomplete for ${target.name}`,detail:`${pressure?`${rusher.name}'s pressure affected the throw. `:""}${cover.name} held ${target.name} to a tight window.`,turnover:false,incomplete:true};
    }
    const catchScore=rating(target,"hands")+(random()-.5)*14;
    const contestScore=rating(cover,"manCover")-route.margin*.35+(random()-.5)*11;
    if (catchScore<contestScore-7) {
      statFor(target).drops++; statFor(cover).passesDefended++;
      return {type:"drop",category:"pass",yards:0,startYard:g.yard,possession:team,participants:{qb:qb.id,target:target.id,blocker:blocker.id,rusher:rusher.id,cover:cover.id},matchups:[protectionMatch,routeMatch],headline:`Broken up by ${cover.name}`,detail:`${target.name} got both hands to it, but ${cover.name} disrupted the catch through contact.`,turnover:false,incomplete:true};
    }
    let yards=Math.round({short:5,medium:11,deep:22}[depth]+Math.max(0,route.margin)*.12+(random()-.5)*6);
    const tackler=depth==="deep"?playerAt(defense,"defense",choose(["FS","SS"])):cover;
    const tackle=contest(tackler,target,rating(tackler,"tackle"),weighted([rating(target,"carrying"),.45],[rating(target,"elusiveness"),.55]),0,"actor");
    const tackleMatch=recordMatchup(tackler,target,"Tackle after catch",tackle.actorScore,tackle.targetScore,tackle.typeBonus,tackle.winner);
    if (tackle.margin<0) { yards+=Math.round(3+random()*10);statFor(tackler).missedTackles++; } else statFor(tackler).tackles++;
    statFor(qb).passComp++; statFor(qb).passYds+=yards; statFor(target).receptions++; statFor(target).recYds+=yards; g.teamStats[team].passYards+=yards;
    return {type,category:"pass",yards,startYard:g.yard,possession:team,participants:{qb:qb.id,target:target.id,blocker:blocker.id,rusher:rusher.id,cover:cover.id,tackler:tackler.id},matchups:[protectionMatch,routeMatch,tackleMatch],headline:`${qb.name} to ${target.name} for ${yards}`,detail:`${target.name} ${route.margin>=0?`created separation from ${cover.name}`:`won a contested window against ${cover.name}`}${tackle.margin<0?` and broke ${tackler.name}'s tackle.`:"."}`,turnover:false};
  }

  function resolveSpecial(team,decision) {
    const g=state.game; const other=otherTeam(team);
    if (decision==="punt") {
      const punter=playerAt(team,"special","P"); const power=punter.football.skills.kickPower;
      const distance=clamp(Math.round(32+(power-55)*.28+random()*13),28,55);
      const landing=clamp(g.yard+distance,5,99); const newYard=clamp(100-landing,5,80);
      return {type:"punt",category:"special",yards:distance,startYard:g.yard,possession:team,participants:{kicker:punter.id},matchups:[],headline:`${punter.name} punts ${distance} yards`,detail:`${teamName(other)} will begin at its own ${Math.round(newYard)}.`,specialChange:true,newPossessionYard:newYard,turnover:false};
    }
    const kicker=playerAt(team,"special","K"); const distance=117-g.yard;
    const chance=clamp(.93-(distance-25)*.015+(kicker.football.skills.kickAccuracy-70)*.007+(kicker.football.skills.kickPower-70)*.004,.12,.98);
    const good=random()<chance;
    return {type:"field-goal",category:"special",yards:0,startYard:g.yard,possession:team,participants:{kicker:kicker.id},matchups:[],headline:good?`${kicker.name} is good from ${distance}`:`${kicker.name} misses from ${distance}`,detail:good?`${teamName(team)} add three points.`:`The kick sails ${random()<.5?"wide left":"wide right"}.`,score:good?3:0,specialChange:true,newPossessionYard:good?25:clamp(100-g.yard,20,80),turnover:false};
  }

  function resolvePenalty(team) {
    const defensive=random()<.43; const penalized=defensive?otherTeam(team):team;
    const calls=defensive?[["Offside",5],["Defensive holding",5],["Illegal contact",5]]:[["False start",-5],["Holding",-10],["Illegal formation",-5]];
    const [call,yards]=choose(calls);
    return {type:"penalty",category:"penalty",yards,startYard:state.game.yard,possession:team,penalizedTeam:penalized,participants:{},matchups:[],headline:`Flag: ${call} on ${teamName(penalized)}`,detail:`${Math.abs(yards)}-yard penalty. The down will be replayed.`,turnover:false,repeatDown:true};
  }

  function handleScore(event,team) {
    const g=state.game; const carrier=event.participants.carrier?byId[event.participants.carrier]:null; const target=event.participants.target?byId[event.participants.target]:null; const qb=event.participants.qb?byId[event.participants.qb]:null;
    if (event.score===3) {
      g.scores[team]+=3; statFor(byId[event.participants.kicker]).points+=3; g.drives.push({team,result:"FG",points:3});
      return;
    }
    g.scores[team]+=7; event.score=7; event.touchdown=true;
    if (event.category==="run"&&carrier) {statFor(carrier).rushTD++;statFor(carrier).points+=6;}
    if (event.category==="pass"&&target&&qb) {statFor(target).recTD++;statFor(target).points+=6;statFor(qb).passTD++;}
    event.headline=`Touchdown, ${teamName(team)}! ${event.headline}`;
    event.detail+=` The drive finishes in the end zone.`;
    g.drives.push({team,result:"TD",points:7});
  }

  function changePossession(newYard=25) {
    const g=state.game; g.possession=otherTeam(g.possession);g.yard=clamp(Math.round(newYard),1,99);g.down=1;g.distance=Math.min(10,100-g.yard);
  }

  function applyEvent(event) {
    const g=state.game; const team=event.possession; const beforeDown=g.down; const beforeDistance=g.distance;
    g.playNumber++; if(event.category!=="penalty")g.teamStats[team].plays++;
    const tempo=g.strategy[team].tempo;
    let elapsed=event.category==="special"?7:event.incomplete?7:Math.round(21+random()*15);
    if (tempo==="fast") elapsed=Math.max(8,elapsed-9); if (tempo==="slow") elapsed+=7;
    g.teamStats[team].time+=elapsed; g.clock=Math.max(0,g.clock-elapsed);
    event.q=g.quarter;event.clockBefore=formatClock(g.clock+elapsed);event.downBefore=beforeDown;event.distanceBefore=beforeDistance;event.id=g.playNumber;

    if(event.category==="penalty"){
      g.teamStats[event.penalizedTeam].penalties++;g.teamStats[event.penalizedTeam].penaltyYards+=Math.abs(event.yards);
      g.yard=clamp(g.yard+event.yards,1,99);g.distance=Math.max(1,beforeDistance-event.yards);
      event.endYard=g.yard;event.scoreAfter={...g.scores};g.playLog.unshift(event);g.lastEvent=event;
      if(g.clock<=0)g.phase=g.quarter<4?"quarter":g.scores.human===g.scores.cpu&&g.quarter===4?"quarter":"final";
      return;
    }

    if (event.category!=="special") { g.teamStats[team].totalYards+=event.yards; g.yard+=event.yards; }
    if (event.score===3) { handleScore(event,team); changePossession(25); }
    else if (event.specialChange) { changePossession(event.newPossessionYard); if(!event.score) g.drives.push({team,result:event.type==="punt"?"PUNT":"MISS",points:0}); }
    else if (event.turnover) {
      const spot=clamp(100-g.yard+(event.interception?Math.round(event.yards*.35):0),5,95);g.drives.push({team,result:event.interception?"INT":"FUM",points:0});changePossession(spot);
    } else if (g.yard>=100) { handleScore(event,team); changePossession(25); }
    else {
      if (event.yards>=beforeDistance) {g.down=1;g.distance=Math.min(10,100-g.yard);g.teamStats[team].firstDowns++;if(beforeDown===3)g.teamStats[team].thirdConv++;}
      else {g.down++;g.distance=Math.max(1,beforeDistance-event.yards);}
      if (beforeDown===3) g.teamStats[team].thirdAtt++;
      if (g.down>4) { g.drives.push({team,result:"DOWNS",points:0});changePossession(100-g.yard);event.detail+=" Turnover on downs."; }
    }
    const participants=Object.values(event.participants||{}); fatiguePlayers(participants,event.category==="special"?.5:1.25+(Math.abs(event.yards)>15?.6:0));
    event.endYard=g.yard; event.scoreAfter={...g.scores};
    g.playLog.unshift(event);g.lastEvent=event;
    if (g.playLog.length>180)g.playLog.pop();

    const scoreInOT=g.quarter===5&&event.score;
    if (scoreInOT || g.clock<=0) {
      if (g.quarter<4) g.phase="quarter";
      else if (g.quarter===4&&g.scores.human===g.scores.cpu) g.phase="quarter";
      else g.phase="final";
    }
  }

  function runNextPlay() {
    if (!state.game || state.game.animating || state.game.phase!=="playing") return;
    const g=state.game; const team=g.possession; const decision=fourthDownDecision(team);
    const call=choosePlayCall(team);let event;
    if(random()<.027)event=resolvePenalty(team);
    else if (decision&&decision!=="go") event=resolveSpecial(team,decision);
    else event=call.type.includes("run")?resolveRun(team,call.type,call):resolvePass(team,call.type,call);
    event.playId=decision&&decision!=="go"?decision:call.id;event.playName=decision==="punt"?"Punt Team":decision==="field-goal"?"Field Goal Unit":call.name;event.formation=decision&&decision!=="go"?"Special Teams":call.formation;
    g.currentPlay=event.playId;g.selectedPlay=null;
    applyEvent(event); g.animating=true; save(); renderGame(event); animateEvent(event);
  }

  function fieldFormation(team,startYard,playId=null) {
    const offense=lineupFor(team).offense; const defense=lineupFor(otherTeam(team)).defense;
    const x=clamp(startYard,8,92);
    const play=PLAYBOOK.find((item)=>item.id===playId);const formation=play?.formation||"Singleback";
    const offY={QB:50,RB:56,WR1:7,WR2:93,WR3:18,TE:83,LT:29,LG:39.5,C:50,RG:60.5,RT:71};
    const defY={LE:28,DT1:41,DT2:57,RE:72,WLB:30,MLB:50,SLB:70,CB1:8,CB2:92,FS:39,SS:64};
    const offX={QB:-9,RB:-15,WR1:-2,WR2:-2,WR3:-3.5,TE:-3.5,LT:-3.2,LG:-3.2,C:-3.2,RG:-3.2,RT:-3.2};
    const defX={LE:4,DT1:4,DT2:4,RE:4,WLB:10,MLB:10,SLB:10,CB1:7,CB2:7,FS:20,SS:16};
    if(formation==="Shotgun"){offX.QB=-12;offX.RB=-11;offY.RB=63;offY.WR3=77;}
    if(formation==="Trips"){offY.WR1=7;offY.WR2=80;offY.WR3=94;offY.TE=70;offX.QB=-11;offX.RB=-16;}
    if(formation==="I-Form"){offX.QB=-8;offX.RB=-19;offY.RB=50;offY.WR3=16;offY.TE=84;}
    const nodes=[];
    for(const [slot,id] of Object.entries(offense))nodes.push({id,team,role:slot,left:clamp(x+offX[slot],3,97),top:offY[slot]});
    for(const [slot,id] of Object.entries(defense))nodes.push({id,team:otherTeam(team),role:slot,left:clamp(x+defX[slot],3,97),top:defY[slot]});
    return nodes;
  }

  function gameSidebarContent() {
    const g=state.game;
    if(state.sidebarTab==="plays") return `<div class="play-log">${g.playLog.map((event,index)=>`<button class="log-card ${index===0?"latest":""}" data-action="explain-play" data-event="${event.id}"><span class="log-meta"><span>Q${event.q} · ${event.clockBefore}</span><span>${event.downBefore}${event.downBefore===1?"st":event.downBefore===2?"nd":event.downBefore===3?"rd":"th"} & ${event.distanceBefore}</span></span><strong>${esc(event.headline)}</strong><p>${esc(event.detail)}</p></button>`).join("")||`<p class="muted" style="padding:20px;font-size:11px">Kickoff is moments away. Run the first play to begin.</p>`}</div>`;
    if(state.sidebarTab==="stats") return renderLiveStats();
    const ledger=Object.values(g.matchups).sort((a,b)=>(b.wins+b.losses)-(a.wins+a.losses)).slice(0,18);
    return `<div class="play-log">${ledger.map((m)=>{const a=byId[m.actorId],b=byId[m.targetId];return `<button class="log-card" data-action="profile" data-id="${a.id}"><span class="log-meta"><span>${esc(m.label)}</span><span>${m.wins}-${m.losses}</span></span><strong>${esc(a.name)} vs ${esc(b.name)}</strong><p>${m.typeNet>0?`${a.name} has accumulated +${m.typeNet} in type edges.`:m.typeNet<0?`${a.name} has fought through ${m.typeNet} in type penalties.`:"Neutral type matchup."}</p></button>`}).join("")||`<p class="muted" style="padding:20px;font-size:11px">Matchup trends appear after the opening snaps.</p>`}</div>`;
  }

  function renderLiveStats() {
    const g=state.game; const ids=[...state.humanRoster,...state.cpuRoster];
    const passers=ids.filter((id)=>g.stats[id].passAtt).sort((a,b)=>g.stats[b].passYds-g.stats[a].passYds);
    const skill=ids.filter((id)=>g.stats[id].rushAtt||g.stats[id].targets).sort((a,b)=>(g.stats[b].rushYds+g.stats[b].recYds)-(g.stats[a].rushYds+g.stats[a].recYds));
    return `<table class="stat-table"><thead><tr><th>Player</th><th>C/A</th><th>Yds</th><th>TD</th></tr></thead><tbody>${passers.map((id)=>{const p=byId[id],s=g.stats[id];return `<tr><td><span class="player-cell"><img src="${p.sprite}" alt=""/><span>${esc(p.name)}<small>${state.humanRoster.includes(id)?esc(state.teamName):esc(state.cpuName)}</small></span></span></td><td>${s.passComp}/${s.passAtt}</td><td>${s.passYds}</td><td>${s.passTD}</td></tr>`}).join("")}</tbody></table><table class="stat-table"><thead><tr><th>Skill player</th><th>Touch</th><th>Yds</th><th>TD</th></tr></thead><tbody>${skill.slice(0,12).map((id)=>{const p=byId[id],s=g.stats[id];return `<tr><td><span class="player-cell"><img src="${p.sprite}" alt=""/><span>${esc(p.name)}<small>${s.receptions} rec · ${s.rushAtt} car</small></span></span></td><td>${s.receptions+s.rushAtt}</td><td>${s.rushYds+s.recYds}</td><td>${s.rushTD+s.recTD}</td></tr>`}).join("")}</tbody></table>`;
  }

  function renderGame(animationEvent=null) {
    const g=state.game; const displayYard=animationEvent?.startYard ?? g.yard; const displayTeam=animationEvent?.possession ?? g.possession;
    const options=contextPlayOptions(g.possession);const selected=PLAYBOOK.find((play)=>play.id===g.selectedPlay)||options[0];
    const visualPlay=animationEvent?.playId||selected?.id||g.currentPlay;const nodes=fieldFormation(displayTeam,displayYard,visualPlay);
    const possessionName=teamName(g.possession); const qLabel=g.quarter===5?"OT":`Q${g.quarter}`;
    const drive=g.drives.slice(-8);
    app.className="game-screen";
    app.innerHTML=`
      <section class="scoreboard">
        <div class="score-team">${teamShield(state.teamName,state.teamColor)}<div><strong>${esc(state.teamName)}</strong><small>${g.possession==="human"?"● POSSESSION":"HOME"}</small></div><b class="big-score">${g.scores.human}</b></div>
        <div class="game-clock"><div><span>Quarter</span><strong>${qLabel}</strong></div><div class="clock-main"><span>Game clock</span><strong>${formatClock(g.clock)}</strong></div><div><span>Ball on</span><strong>${g.yard}</strong></div></div>
        <div class="score-team away"><b class="big-score">${g.scores.cpu}</b><div><strong>${esc(state.cpuName)}</strong><small>${g.possession==="cpu"?"POSSESSION ●":"AWAY"}</small></div>${teamShield(state.cpuName,state.cpuColor)}</div>
      </section>
      <section class="game-layout">
        <div class="broadcast">
          <div class="field-wrap"><div class="game-field" id="gameField" style="--anim-speed:${Math.max(.3,1.15/state.speed)}s">
            <div class="yard-number top"><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span><span>40</span><span>30</span><span>20</span><span>10</span></div>
            <div class="yard-number bottom"><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span><span>40</span><span>30</span><span>20</span><span>10</span></div>
            <i class="line-of-scrimmage" style="left:${clamp(displayYard,1,99)}%"></i><i class="first-down-line" style="left:${clamp(displayYard+(animationEvent?.distanceBefore??g.distance),1,99)}%"></i>
            ${nodes.map((node)=>{const p=byId[node.id];return `<div class="field-player ${node.team}" data-player="${node.id}" data-role="${node.role}" data-team="${node.team}" style="left:${node.left}%;top:${node.top}%"><span class="player-ring"></span><img src="${p.sprite}" alt="${esc(p.name)}"/><small>${node.role}</small></div>`}).join("")}
            <i class="football" id="football" style="left:${clamp(displayYard-4,2,98)}%;top:50%"></i>
            <div class="play-banner" id="playBanner"><strong></strong><span></span></div>
            <div class="field-status"><span>${animationEvent?"LIVE":g.possession==="human"?"OFFENSE IN HUDDLE":"DEFENSE ON FIELD"}</span><strong>${esc(animationEvent?.playName||selected?.name||"Awaiting call")}</strong><small>${esc(animationEvent?.formation||selected?.formation||"Base 4–3")}</small></div>
          </div></div>
          <div class="playcall-strip ${g.possession!=="human"?"cpu-call":""}">${g.animating?`<div class="cpu-huddle"><span class="live-dot"></span><strong>${esc(animationEvent?.playName||"Play in progress")}</strong><small>${esc(animationEvent?.formation||"")} · watch the routes develop</small></div>`:g.possession==="human"?`<div class="playcall-label"><span>OFFENSIVE HUDDLE</span><strong>Choose the call</strong></div><div class="playcall-options">${options.map((play,index)=>`<button class="${selected?.id===play.id?"active":""}" data-action="select-play" data-play="${play.id}"><span>${index===0?"COACH PICK":play.family.toUpperCase()}</span><strong>${esc(play.name)}</strong><small>${esc(play.formation)} · ${esc(play.description)}</small></button>`).join("")}</div>`:`<div class="cpu-huddle"><span class="live-dot"></span><strong>${esc(state.cpuName)} are in the huddle</strong><small>Your Base 4–3 defense is set from the quarter plan.</small></div>`}</div>
          <div class="broadcast-controls">
            <div class="down-chip"><b>${g.down}${g.down===1?"st":g.down===2?"nd":g.down===3?"rd":"th"} & ${g.distance}</b><span>${esc(possessionName)}<br>AT THE ${g.yard}</span></div>
            <div class="control-cluster"><div class="speed-select">${[1,2,4].map((speed)=>`<button class="${state.speed===speed?"active":""}" data-action="speed" data-speed="${speed}">${speed}×</button>`).join("")}</div><button class="secondary-button" data-action="toggle-auto">${state.autoplay?"Pause":"Auto play"}</button><button class="primary-button" data-action="next-play" ${g.animating||g.phase!=="playing"?"disabled":""}>${g.possession==="human"?`Snap ${esc(selected?.name||"play")}`:"Watch next snap"}</button></div>
          </div>
        </div>
        <aside class="game-sidebar"><div class="sidebar-tabs">${[["plays","Play log"],["stats","Live stats"],["matchups","Matchups"]].map(([id,label])=>`<button class="${state.sidebarTab===id?"active":""}" data-action="sidebar-tab" data-tab="${id}">${label}</button>`).join("")}</div><div class="sidebar-content">${gameSidebarContent()}</div><div class="drive-strip">${drive.map((d)=>`<span class="drive-dot ${d.points?"score":""}">${d.team==="human"?teamInitials(state.teamName):teamInitials(state.cpuName)}<br>${d.result}</span>`).join("")||`<span class="tiny">OPENING DRIVE</span>`}</div></aside>
      </section>`;
  }

  function animateEvent(event) {
    const duration=Math.max(650,2400/state.speed); const field=document.getElementById("gameField");
    const direction=Math.max(-8,Math.min(15,event.yards*.42));
    const banner=document.getElementById("playBanner");
    if(banner){banner.querySelector("strong").textContent=event.playName||"Ready";banner.querySelector("span").textContent=`${event.formation||"Formation"} · offense set`;banner.classList.add("show","presnap");}
    field?.classList.add("pre-snap");
    setTimeout(()=>requestAnimationFrame(()=>{
      field?.classList.remove("pre-snap");field?.classList.add("ball-live");banner?.classList.remove("show","presnap");
      field?.querySelectorAll(`.field-player[data-team="${event.possession}"]`).forEach((node)=>{
        const current=parseFloat(node.style.left); const role=node.dataset.role;
        const boost=[event.participants.carrier,event.participants.target].includes(Number(node.dataset.player))?direction:Math.max(-2,Math.min(5,direction*.34));
        node.style.left=`${clamp(current+boost,2,98)}%`;
        const routeShift=event.playId==="mesh"?(role==="WR1"?28:role==="WR2"?-28:role==="WR3"?10:0):event.playId==="quick-slants"?(role==="WR1"?12:role==="WR2"?-12:role==="WR3"?8:0):event.playId==="post-wheel"&&role==="RB"?24:event.playId==="dig-cross"?(role==="WR1"?18:role==="WR2"?-10:0):0;
        if(role?.startsWith("WR")||role==="TE"||role==="RB")node.style.top=`${clamp(parseFloat(node.style.top)+routeShift,4,96)}%`;
      });
      field?.querySelectorAll(`.field-player[data-team="${otherTeam(event.possession)}"]`).forEach((node)=>{
        const current=parseFloat(node.style.left);node.style.left=`${clamp(current+Math.max(-2,Math.min(6,direction*.3)),2,98)}%`;
        if([event.participants.cover,event.participants.tackler].includes(Number(node.dataset.player))){const target=field?.querySelector(`[data-player="${event.participants.target||event.participants.carrier}"]`);if(target)node.style.top=target.style.top;}
      });
      const ball=document.getElementById("football");
      if(ball){ball.style.left=`${clamp(event.startYard+Math.max(1,event.yards*.65),2,98)}%`;const targetNode=field?.querySelector(`[data-player="${event.participants.target||event.participants.carrier||event.participants.kicker}"]`);if(targetNode)ball.style.top=targetNode.style.top;}
      setTimeout(()=>{if(banner){banner.querySelector("strong").textContent=event.headline;banner.querySelector("span").textContent=event.detail;banner.classList.add("show");}},duration*.42);
    }),Math.max(180,duration*.24));
    if(event.score)playTone("score");else if(Math.abs(event.yards)>14||event.type==="sack")playTone("hit");
    setTimeout(()=>{
      if(!state.game)return; state.game.animating=false;
      if(state.game.phase==="quarter") {state.autoplay=false;state.screen="report";}
      else if(state.game.phase==="final") {state.autoplay=false;state.screen="postgame";}
      save();render();
      if(state.autoplay&&state.screen==="game") autoTimer=setTimeout(runNextPlay,Math.max(240,900/state.speed));
    },duration+Math.max(260,650/state.speed));
  }

  function explainPlay(eventId) {
    const event=state.game.playLog.find((item)=>item.id===eventId); if(!event)return;
    modalContent.innerHTML=`<div class="modal-head"><h2 class="panel-title" id="modalTitle">Play breakdown</h2><button class="close-button" data-close-modal>×</button></div><div class="play-explain"><p class="eyebrow">Q${event.q} · ${event.clockBefore} · ${event.downBefore}${event.downBefore===1?"st":event.downBefore===2?"nd":event.downBefore===3?"rd":"th"} & ${event.distanceBefore}</p><h3 class="explain-headline">${esc(event.headline)}</h3><p class="explain-detail">${esc(event.detail)}</p><div class="matchup-box">${event.matchups.length?event.matchups.map((m)=>`<div class="matchup-row"><span><strong>${esc(m.left.name)} · ${m.left.score}</strong><small>${m.typeBonus?`${m.typeBonus>0?"+":""}${m.typeBonus} type modifier`:"Neutral type interaction"}</small></span><span>${esc(m.label)}</span><span><strong>${esc(m.right.name)} · ${m.right.score}</strong><small>${m.winner==="actor"?m.left.name:m.right.name} won</small></span></div>`).join(""):`<div class="matchup-row"><strong>Special teams execution</strong><span>result</span><strong>${event.score?"Successful":"Field position"}</strong></div>`}</div><p class="explain-detail">Result: ${event.yards>0?`+${event.yards}`:event.yards} yards · Score after play ${event.scoreAfter.human}–${event.scoreAfter.cpu}</p></div>`;
    openModal();
  }

  function reportProblems() {
    const g=state.game; const recent=g.playLog.filter((e)=>e.q===g.quarter); const items=[];
    const humanLosses={};
    recent.flatMap((e)=>e.matchups).forEach((m)=>{
      const leftHuman=state.humanRoster.includes(m.left.id), rightHuman=state.humanRoster.includes(m.right.id);
      const humanWon=(leftHuman&&m.winner==="actor")||(rightHuman&&m.winner==="target");
      if(!humanWon&&(leftHuman||rightHuman)){
        const humanId=leftHuman?m.left.id:m.right.id,oppId=leftHuman?m.right.id:m.left.id,key=`${humanId}-${oppId}-${m.label}`;
        humanLosses[key] ||= {humanId,oppId,label:m.label,count:0,type:0};humanLosses[key].count++;humanLosses[key].type+=leftHuman?m.typeBonus:-m.typeBonus;
      }
    });
    Object.values(humanLosses).sort((a,b)=>b.count-a.count).slice(0,2).forEach((loss)=>{
      const a=byId[loss.humanId],b=byId[loss.oppId];items.push({good:false,title:`${a.name} is losing to ${b.name}`,text:`${loss.count} losses in ${loss.label.toLowerCase()} this quarter${loss.type<0?`, with ${loss.type} cumulative type disadvantage`:""}. Consider a substitution or scheme shift.`});
    });
    const tired=state.humanRoster.filter((id)=>g.fatigue[id]<68).sort((a,b)=>g.fatigue[a]-g.fatigue[b])[0];
    if(tired)items.push({good:false,title:`${byId[tired].name} is down to ${Math.round(g.fatigue[tired])}% condition`,text:"Fatigue is reducing every underlying football rating. A reserve can recover the matchup immediately."});
    const h=g.teamStats.human,c=g.teamStats.cpu;
    if(h.totalYards>c.totalYards+30)items.push({good:true,title:"Your structure is producing yards",text:`${state.teamName} lead total offense ${h.totalYards}–${c.totalYards}. The current approach is working.`});
    if(!items.length)items.push({good:true,title:"No critical matchup failures",text:"Results are balanced across the formation. Adjust only if you want to change tempo or risk level."});
    return items.slice(0,4);
  }

  function renderReport() {
    const g=state.game; const h=g.teamStats.human,c=g.teamStats.cpu; const problems=reportProblems();
    const title=g.quarter===4&&g.scores.human===g.scores.cpu?"End of regulation":g.quarter===5?"End of overtime":`${ordinal(g.quarter)} quarter report`;
    app.className="screen report-screen";
    app.innerHTML=`
      <section class="report-score"><div class="report-team">${teamShield(state.teamName,state.teamColor)}<div><strong>${esc(state.teamName)}</strong><span class="tiny">HOME</span></div></div><div class="score-center"><span>${title.toUpperCase()}</span><strong>${g.scores.human} — ${g.scores.cpu}</strong><small class="muted">${h.totalYards+c.totalYards} combined yards</small></div><div class="report-team"><div><strong>${esc(state.cpuName)}</strong><span class="tiny">AWAY</span></div>${teamShield(state.cpuName,state.cpuColor)}</div></section>
      <section class="report-grid">
        <div class="report-panel"><div class="panel-head"><h2 class="panel-title">Coordinator notes</h2><span class="tiny">DIAGNOSED FROM ${g.playLog.filter((e)=>e.q===g.quarter).length} PLAYS</span></div><div class="problem-list">${problems.map((p)=>`<div class="problem-card ${p.good?"good":""}"><strong>${esc(p.title)}</strong><p>${esc(p.text)}</p></div>`).join("")}</div></div>
        <div class="report-panel"><div class="panel-head"><h2 class="panel-title">Team comparison</h2><span class="tiny">${ordinal(g.quarter).toUpperCase()} QUARTER</span></div>${[[h.totalYards,"Total yards",c.totalYards],[h.passYards,"Passing",c.passYards],[h.rushYards,"Rushing",c.rushYards],[h.firstDowns,"First downs",c.firstDowns],[h.turnovers,"Turnovers",c.turnovers]].map(([a,label,b])=>`<div class="team-comparison"><span>${a}</span><b>${label}</b><span>${b}</span></div>`).join("")}</div>
        <div class="report-panel"><div class="panel-head"><h2 class="panel-title">Offensive plan</h2><span class="tiny">APPLIES NEXT QUARTER</span></div><div class="strategy-grid"><div class="strategy-field"><label>Play emphasis</label><select class="strategy-select" data-strategy="offense"><option value="balanced" ${g.strategy.human.offense==="balanced"?"selected":""}>Balanced</option><option value="ground" ${g.strategy.human.offense==="ground"?"selected":""}>Ground control</option><option value="air" ${g.strategy.human.offense==="air"?"selected":""}>Air attack</option><option value="aggressive" ${g.strategy.human.offense==="aggressive"?"selected":""}>Attack vertically</option></select></div><div class="strategy-field"><label>Tempo</label><select class="strategy-select" data-strategy="tempo"><option value="slow" ${g.strategy.human.tempo==="slow"?"selected":""}>Drain clock</option><option value="normal" ${g.strategy.human.tempo==="normal"?"selected":""}>Normal</option><option value="fast" ${g.strategy.human.tempo==="fast"?"selected":""}>Up-tempo</option></select></div><div class="strategy-field"><label>Fourth downs</label><select class="strategy-select" data-strategy="fourth"><option value="conservative" ${g.strategy.human.fourth==="conservative"?"selected":""}>Conservative</option><option value="balanced" ${g.strategy.human.fourth==="balanced"?"selected":""}>Situational</option><option value="aggressive" ${g.strategy.human.fourth==="aggressive"?"selected":""}>Aggressive</option></select></div></div></div>
        <div class="report-panel"><div class="panel-head"><h2 class="panel-title">Defensive plan</h2><span class="tiny">APPLIES NEXT QUARTER</span></div><div class="strategy-grid"><div class="strategy-field"><label>Defensive focus</label><select class="strategy-select" data-strategy="defense"><option value="balanced" ${g.strategy.human.defense==="balanced"?"selected":""}>Balanced</option><option value="run" ${g.strategy.human.defense==="run"?"selected":""}>Commit to run</option><option value="pass" ${g.strategy.human.defense==="pass"?"selected":""}>Protect the pass</option></select></div><div class="strategy-field"><label>Blitz frequency</label><select class="strategy-select" data-strategy="blitz"><option value="light" ${g.strategy.human.blitz==="light"?"selected":""}>Light</option><option value="normal" ${g.strategy.human.blitz==="normal"?"selected":""}>Normal</option><option value="heavy" ${g.strategy.human.blitz==="heavy"?"selected":""}>Heavy</option></select></div></div></div>
      </section><div class="report-actions"><button class="secondary-button" data-action="quarter-depth">Open depth chart & substitute</button><button class="primary-button" data-action="resume-quarter">${g.quarter===4?(g.scores.human===g.scores.cpu?"Start overtime":"Finish game"):g.quarter===5?"Finish game":`Begin ${ordinal(g.quarter+1)} quarter`}</button></div>`;
  }

  function resumeQuarter() {
    const g=state.game;
    if(g.quarter===5){g.phase="final";state.screen="postgame";save();render();return;}
    if(g.quarter===4&&g.scores.human!==g.scores.cpu){g.phase="final";state.screen="postgame";save();render();return;}
    g.quarter++;g.clock=g.quarter===5?300:480;g.phase="playing";g.down=1;g.distance=10;
    if(g.quarter===3){g.possession=g.secondHalfReceiver;g.yard=25;} else if(g.quarter===5){g.possession=random()<.5?"human":"cpu";g.yard=25;}
    for(const id of Object.keys(g.fatigue))g.fatigue[id]=clamp(g.fatigue[id]+8,35,100);
    state.screen="game";save();render();
  }

  function topLeaders() {
    const g=state.game,ids=[...state.humanRoster,...state.cpuRoster];
    const top=(fn)=>ids.map((id)=>[id,fn(g.stats[id])]).sort((a,b)=>b[1]-a[1])[0];
    return {passing:top((s)=>s.passYds),scrimmage:top((s)=>s.rushYds+s.recYds),defense:top((s)=>s.tackles*2+s.sacks*6+s.interceptions*8+s.passesDefended*2),trenches:top((s)=>s.blocksWon+s.blocksShed*2+s.pressures*2)};
  }

  function postgameTable(kind) {
    const g=state.game,ids=[...state.humanRoster,...state.cpuRoster];
    if(kind==="offense"){
      const players=ids.filter((id)=>{const s=g.stats[id];return s.passAtt||s.rushAtt||s.targets;}).sort((a,b)=>(g.stats[b].passYds+g.stats[b].rushYds+g.stats[b].recYds)-(g.stats[a].passYds+g.stats[a].rushYds+g.stats[a].recYds));
      return `<table class="stat-table"><thead><tr><th>Player</th><th>C/A</th><th>Pass</th><th>Rush</th><th>Rec</th><th>TD</th><th>TO</th></tr></thead><tbody>${players.map((id)=>{const p=byId[id],s=g.stats[id];return `<tr><td><button class="player-cell" style="border:0;background:none;color:inherit" data-action="profile" data-id="${id}"><img src="${p.sprite}" alt=""/><span>${esc(p.name)}<small>${state.humanRoster.includes(id)?esc(state.teamName):esc(state.cpuName)}</small></span></button></td><td>${s.passComp}/${s.passAtt}</td><td>${s.passYds}</td><td>${s.rushYds}</td><td>${s.receptions}-${s.recYds}</td><td>${s.passTD+s.rushTD+s.recTD}</td><td>${s.ints}</td></tr>`}).join("")}</tbody></table>`;
    }
    if(kind==="defense"){
      const players=ids.filter((id)=>{const s=g.stats[id];return s.tackles||s.missedTackles||s.sacks||s.pressures||s.interceptions;}).sort((a,b)=>(g.stats[b].tackles+g.stats[b].sacks*3+g.stats[b].interceptions*4)-(g.stats[a].tackles+g.stats[a].sacks*3+g.stats[a].interceptions*4));
      return `<table class="stat-table"><thead><tr><th>Defender</th><th>TKL</th><th>MISS</th><th>SACK</th><th>PRESS</th><th>INT</th><th>PD</th></tr></thead><tbody>${players.map((id)=>{const p=byId[id],s=g.stats[id];return `<tr><td><button class="player-cell" style="border:0;background:none;color:inherit" data-action="profile" data-id="${id}"><img src="${p.sprite}" alt=""/><span>${esc(p.name)}<small>${state.humanRoster.includes(id)?esc(state.teamName):esc(state.cpuName)}</small></span></button></td><td>${s.tackles}</td><td>${s.missedTackles}</td><td>${s.sacks}</td><td>${s.pressures}</td><td>${s.interceptions}</td><td>${s.passesDefended}</td></tr>`}).join("")}</tbody></table>`;
    }
    const ledger=Object.values(g.matchups).sort((a,b)=>(b.wins+b.losses)-(a.wins+a.losses));
    return `<table class="stat-table"><thead><tr><th>Matchup</th><th>Area</th><th>W</th><th>L</th><th>Type net</th></tr></thead><tbody>${ledger.map((m)=>`<tr><td>${esc(byId[m.actorId].name)} vs ${esc(byId[m.targetId].name)}</td><td>${esc(m.label)}</td><td>${m.wins}</td><td>${m.losses}</td><td>${m.typeNet>0?"+":""}${m.typeNet}</td></tr>`).join("")}</tbody></table>`;
  }

  function finalizeFranchiseGame() {
    const g=state.game,f=state.franchise;if(state.mode!=="franchise"||!f||g.franchiseProcessed)return;
    const scheduled=f.schedule.find((game)=>!game.played&&game.opponentIndex===state.opponentIndex)||f.schedule.find((game)=>!game.played);
    if(!scheduled)return;
    const humanScore=g.scores.human,cpuScore=g.scores.cpu;const won=humanScore>cpuScore;const tied=humanScore===cpuScore;
    scheduled.played=true;scheduled.humanScore=humanScore;scheduled.cpuScore=cpuScore;scheduled.result=tied?"T":won?"W":"L";
    recordStanding(f.standings[0],humanScore,cpuScore);recordStanding(f.standings[scheduled.opponentIndex],cpuScore,humanScore);
    const cpuGames=f.cpuSchedule?.[scheduled.week-1]||[];
    cpuGames.forEach((game)=>{if(!game.played){const result=simulateCpuMatchup(game.a,game.b);Object.assign(game,result);}});
    for(const id of state.humanRoster){
      const stat=g.stats[id]||newPlayerStat(),record=progressFor(id);
      const yards=stat.passYds+stat.rushYds+stat.recYds;
      const touchdowns=stat.passTD+stat.rushTD+stat.recTD;
      const impact=Math.max(4,Math.round(stat.passYds*.32+stat.rushYds+stat.recYds+touchdowns*55+stat.tackles*10+stat.sacks*30+stat.interceptions*45+stat.passesDefended*8+stat.blocksWon*5+stat.blocksShed*6+stat.pressures*4));
      record.games++;if(won)record.wins++;record.impact+=impact;record.yards+=yards;record.touchdowns+=touchdowns;record.tackles+=stat.tackles;record.sacks+=stat.sacks;record.interceptions+=stat.interceptions;
    }
    f.history.unshift({season:f.season,week:scheduled.week,opponent:state.cpuName,humanScore,cpuScore,result:scheduled.result});
    if(f.history.length>30)f.history.pop();
    if(f.schedule.every((game)=>game.played)){
      f.seasonComplete=true;const rows=sortedStandings();const place=rows.findIndex((row)=>row.teamIndex===0)+1;const reward=rewardForPlacement(place);
      f.lastPlacement=place;f.lastReward=reward;
      for(let index=0;index<reward.count;index++)f.boxes.push({id:`s${f.season}-${place}-${index}-${Date.now()}`,type:reward.type,source:`Season ${f.season} · ${ordinal(place)} place`});
    }
    g.franchiseProcessed=true;save();
  }

  function renderPostgame() {
    finalizeFranchiseGame();
    const g=state.game,h=g.teamStats.human,c=g.teamStats.cpu; const winner=g.scores.human===g.scores.cpu?"A hard-fought draw":g.scores.human>g.scores.cpu?`${state.teamName} win`: `${state.cpuName} win`;
    const leaders=topLeaders();
    const summary=`<div class="report-grid"><div class="report-panel"><div class="panel-head"><h2 class="panel-title">Final comparison</h2></div>${[[h.totalYards,"Total yards",c.totalYards],[h.passYards,"Passing",c.passYards],[h.rushYards,"Rushing",c.rushYards],[h.firstDowns,"First downs",c.firstDowns],[h.turnovers,"Turnovers",c.turnovers],[h.thirdConv+"/"+h.thirdAtt,"Third down",c.thirdConv+"/"+c.thirdAtt]].map(([a,label,b])=>`<div class="team-comparison"><span>${a}</span><b>${label}</b><span>${b}</span></div>`).join("")}</div><div class="report-panel"><div class="panel-head"><h2 class="panel-title">Game leaders</h2></div><div class="problem-list">${Object.entries(leaders).map(([label,[id,value]])=>`<button class="problem-card good" style="text-align:left;color:inherit" data-action="profile" data-id="${id}"><strong>${label.toUpperCase()} · ${byId[id].name}</strong><p>${value} impact points · ${state.humanRoster.includes(id)?esc(state.teamName):esc(state.cpuName)}</p></button>`).join("")}</div></div></div>`;
    let content=summary;if(state.postgameTab==="offense")content=postgameTable("offense");if(state.postgameTab==="defense")content=postgameTable("defense");if(state.postgameTab==="matchups")content=postgameTable("matchups");
    app.className="screen report-screen";
    app.innerHTML=`<section class="report-panel"><div class="postgame-hero"><div class="trophy">◆</div><p class="eyebrow">Final · ${state.mode==="franchise"?`Franchise season ${state.franchise.season}`:"National exhibition"}</p><h1>${esc(winner)}</h1><p>${esc(state.teamName)} ${g.scores.human} · ${esc(state.cpuName)} ${g.scores.cpu}</p><div class="hero-actions" style="justify-content:center">${state.mode==="franchise"?`<button class="primary-button" data-action="return-franchise">Return to franchise</button>${state.franchise.boxes.length?`<button class="secondary-button" data-action="show-boxes">Box room · ${state.franchise.boxes.length}</button>`:""}`:`<button class="primary-button" data-action="rematch">Draft again</button><button class="secondary-button" data-action="home">League headquarters</button>`}</div></div><div class="postgame-tabs">${[["summary","Summary"],["offense","Offense"],["defense","Defense"],["matchups","Matchups"]].map(([id,label])=>`<button class="${state.postgameTab===id?"active":""}" data-action="postgame-tab" data-tab="${id}">${label}</button>`).join("")}</div><div class="postgame-content">${content}</div></section>`;
  }

  function resetDraft() {
    const keepSound=state.sound; const keepName=state.teamName; const keepColor=state.teamColor;
    const keepFranchise=state.franchise||savedState?.franchise||null;
    state=defaultState();state.sound=keepSound;state.teamName=keepName;state.teamColor=keepColor;state.franchise=keepFranchise;
    state.mode=null;state.screen="home";save();render();
  }

  function openFranchiseRoster() {
    const next=nextFranchiseGame();if(next){state.opponentIndex=next.opponentIndex;syncOpponent();}
    state.mode="franchise";state.humanRoster=[...state.franchise.active];state.humanLineup=state.franchise.lineup?JSON.parse(JSON.stringify(state.franchise.lineup)):autoAssign(state.humanRoster);state.leagueTeams[0].roster=[...state.humanRoster];state.leagueLineups[0]=state.humanLineup;state.rosterTab="offense";state.selectedSlot=null;state.screen="roster";save();render();
  }

  document.addEventListener("click",(event)=>{
    const close=event.target.closest("[data-close-modal]");if(close){closeModal();return;}
    const button=event.target.closest("[data-action]");if(!button)return;
    const action=button.dataset.action;
    if(action==="focus-setup")document.getElementById("teamSetup")?.scrollIntoView({behavior:"smooth",block:"center"});
    if(action==="focus-quick")document.getElementById("quickModes")?.scrollIntoView({behavior:"smooth",block:"center"});
    if(action==="choose-color"){
      const input=document.getElementById("teamNameInput");if(input?.value.trim())state.teamName=input.value.trim().slice(0,26);
      state.teamColor=button.dataset.color;render();
    }
    if(action==="start-draft")startDraft(false);
    if(action==="quick-exhibition"){const input=document.getElementById("teamNameInput");if(input?.value.trim())state.teamName=input.value.trim().slice(0,26);startDraft(true);}
    if(action==="start-franchise")startFranchise();
    if(action==="resume-franchise")resumeFranchise();
    if(action==="continue-save"&&savedState){state=JSON.parse(JSON.stringify(savedState));state.autoplay=false;if(state.game)state.game.animating=false;render();}
    if(action==="draft-pick"){
      if(teamAtPick(state.draftIndex)!==0)return;const p=byId[Number(button.dataset.id)];commitPick(p,0);processCpuTurns();if(state.screen==="draft"){save();render();}
    }
    if(action==="auto-draft")autoCompleteDraft();
    if(action==="draft-help")showRatingsGuide();
    if(action==="show-league")showLeagueOverview();
    if(action==="profile")showProfile(Number(button.dataset.id));
    if(action==="roster-tab"){state.rosterTab=button.dataset.tab;state.selectedSlot=null;render();}
    if(action==="select-slot")swapSlots(button.dataset.slot);
    if(action==="bench-player")substitutePlayer(Number(button.dataset.id));
    if(action==="optimize-lineup"){state.humanLineup=autoAssign(state.humanRoster);state.leagueLineups[0]=state.humanLineup;if(state.mode==="franchise"&&state.franchise)state.franchise.lineup=JSON.parse(JSON.stringify(state.humanLineup));state.selectedSlot=null;save();render();toast("Depth chart optimized across all 22 starting positions.");}
    if(action==="start-game")startGame();
    if(action==="next-play")runNextPlay();
    if(action==="select-play"&&state.game&&!state.game.animating){state.game.selectedPlay=button.dataset.play;save();render();}
    if(action==="toggle-auto"){
      state.autoplay=!state.autoplay;render();if(state.autoplay)autoTimer=setTimeout(runNextPlay,240);
    }
    if(action==="speed"){state.speed=Number(button.dataset.speed);save();render();}
    if(action==="sidebar-tab"){state.sidebarTab=button.dataset.tab;render();}
    if(action==="explain-play")explainPlay(Number(button.dataset.event));
    if(action==="quarter-depth"){state.returnToReport=true;state.rosterTab="offense";state.selectedSlot=null;state.screen="roster";save();render();}
    if(action==="resume-quarter")resumeQuarter();
    if(action==="postgame-tab"){state.postgameTab=button.dataset.tab;render();}
    if(action==="franchise-home"){state.autoplay=false;state.game=null;state.mode="franchise";state.screen="franchise";save();render();}
    if(action==="return-franchise"){state.autoplay=false;state.game=null;state.mode="franchise";state.screen="franchise";save();render();}
    if(action==="show-collection"){state.autoplay=false;state.screen="collection";save();render();}
    if(action==="show-boxes"){state.autoplay=false;state.screen="boxes";save();render();}
    if(action==="franchise-roster")openFranchiseRoster();
    if(action==="prepare-franchise-game")prepareFranchiseGame();
    if(action==="auto-best-roster")optimizeActiveRoster();
    if(action==="activate-player")showRosterSwap(Number(button.dataset.id));
    if(action==="replace-active")replaceActive(Number(button.dataset.old),Number(button.dataset.new));
    if(action==="evolve-player")showEvolutionChoices(Number(button.dataset.id));
    if(action==="choose-evolution")evolvePokemon(Number(button.dataset.from),Number(button.dataset.to));
    if(action==="open-box")openBox(Number(button.dataset.index));
    if(action==="clear-box-results"){state.franchise.lastOpen=null;save();render();}
    if(action==="start-next-season")startNextSeason();
    if(action==="rematch"){resetDraft();setTimeout(()=>startDraft(false),0);}
    if(action==="home"){state.screen="home";render();}
  });

  document.addEventListener("change",(event)=>{
    const target=event.target;
    if(target.id==="typeFilter"){state.typeFilter=target.value;render();}
    if(target.id==="draftGen"){state.draftGen=target.value;render();}
    if(target.id==="sortDraft"){state.sort=target.value;render();}
    if(target.id==="collectionGen"){state.collectionGen=target.value;render();}
    if(target.id==="collectionSort"){state.collectionSort=target.value;render();}
    if(target.id==="opponentSelect"&&!state.game){state.opponentIndex=Number(target.value);syncOpponent();save();render();toast(`${state.cpuName} selected as your exhibition opponent.`);}
    if(target.matches("[data-strategy]")){state.game.strategy.human[target.dataset.strategy]=target.value;save();toast("Coaching adjustment saved for the next quarter.");}
  });

  document.addEventListener("input",(event)=>{
    const target=event.target;
    if(target.id==="draftSearch"){
      state.search=target.value;render();
      const input=document.getElementById("draftSearch");if(input){input.focus();input.setSelectionRange(input.value.length,input.value.length);}
    }
    if(target.id==="collectionSearch"){
      state.collectionSearch=target.value;render();
      const input=document.getElementById("collectionSearch");if(input){input.focus();input.setSelectionRange(input.value.length,input.value.length);}
    }
  });

  document.getElementById("brandHome").addEventListener("click",()=>{state.autoplay=false;state.screen="home";state.mode=null;save();render();});
  document.getElementById("soundToggle").addEventListener("click",()=>{state.sound=!state.sound;playTone("select");render();});
  document.getElementById("newGameButton").addEventListener("click",()=>{
    if(state.mode==="franchise"&&state.screen!=="home"){state.autoplay=false;state.game=null;state.screen="franchise";save();render();return;}
    if(!state.game||window.confirm("Leave this exhibition and return to the mode menu? Your franchise collection will be kept."))resetDraft();
  });
  document.addEventListener("keydown",(event)=>{if(event.key==="Escape"&&!modalShell.classList.contains("hidden"))closeModal();});

  render();
})();
