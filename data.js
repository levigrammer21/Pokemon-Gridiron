import {EXTRA_ROWS} from './roster.js';
export const VERSION='2.0.1';
export const TYPES={Nature:{color:'#82bc59',strong:['Water','Stone'],weak:['Fire','Ice']},Fire:{color:'#ef9160',strong:['Nature','Ice'],weak:['Water','Stone']},Water:{color:'#68bed5',strong:['Fire','Stone'],weak:['Nature','Storm']},Stone:{color:'#baa786',strong:['Fire','Storm'],weak:['Water','Nature']},Storm:{color:'#f4d870',strong:['Water','Air'],weak:['Stone']},Ice:{color:'#b4e4ef',strong:['Nature','Air'],weak:['Fire']},Shadow:{color:'#ad93d0',strong:['Arcane'],weak:['Radiant']},Radiant:{color:'#ffdd9a',strong:['Shadow'],weak:['Arcane']},Arcane:{color:'#d992cc',strong:['Radiant'],weak:['Shadow']},Air:{color:'#b9d5ad',strong:['Nature'],weak:['Storm','Ice']}};
// name, type, silhouette, color, accent, habitat, rarity, evolution, evolution level, temperament
const rows=[
 ['Cinderkit','Fire','cat','#e98543','#ffdc75','meadow',1,'Pyrelynx',18,'A curious ember-tailed cat.'],
 ['Pyrelynx','Fire','cat','#ba473e','#ffe58b','volcanic',3,'Sunmane',38,'Its whiskers spark before a pounce.'],
 ['Sunmane','Fire','lion','#cb643c','#fff0a6','volcanic',5,null,0,'A proud guardian with a blazing mane.'],
 ['Mossprig','Nature','rabbit','#8fb965','#f0df9a','meadow',1,'Bramblehare',18,'Hides seedlings in its fluffy coat.'],
 ['Bramblehare','Nature','rabbit','#5b9368','#eec276','forest',3,'Thornwarden',38,'Its long ears sense footsteps through roots.'],
 ['Thornwarden','Nature','stag','#456f58','#cfdb90','forest',5,null,0,'A patient keeper of ancient groves.'],
 ['Rillfin','Water','otter','#6daec5','#d4eff0','wetland',1,'Brooktail',18,'Surfs the wake of passing travelers.'],
 ['Brooktail','Water','otter','#43869e','#c9f3df','wetland',3,'Tidewarden',38,'Carves channels with its broad tail.'],
 ['Tidewarden','Water','otter','#326b8c','#96e4d4','wetland',5,null,0,'Its crest glows when rain approaches.'],
 ['Pebblit','Stone','turtle','#a59275','#d8ca9d','rocky',1,'Bastionhorn',24,'Carries its favorite pebble everywhere.'],
 ['Bastionhorn','Stone','rhino','#7f8f82','#e3c994','rocky',4,null,0,'A plated, horned defender. Built to protect, not pursue.'],
 ['Gravahound','Shadow','hound','#403e4b','#9be9ff','forest',5,'Titanblood Gravahound',40,'A loyal Gravahound with a dormant Titanblood lineage.'],
 ['Titanblood Gravahound','Shadow','bear','#343a49','#a2eeff','forest',7,null,0,'A massive guardian split by brilliant blue-white creases.'],
 ['Abysscoil','Water','serpent','#739bae','#d8faff','wetland',6,null,0,'A silver water serpent with a gentle, watchful gaze.'],
 ['Sparkip','Storm','mouse','#eac65c','#795b40','meadow',1,'Voltjack',22,'Stores static in its oversized ears.'],
 ['Voltjack','Storm','rabbit','#d8ac40','#fff4ad','rocky',3,null,0,'Leaves flickering footprints after a sprint.'],
 ['Duskmoth','Shadow','moth','#9381b3','#e0b8de','forest',2,'Moonveil',25,'Follows lanterns at the edge of the woods.'],
 ['Moonveil','Shadow','moth','#64618f','#dbc8ff','forest',4,null,0,'Its wings resemble a midnight sky.'],
 ['Frostip','Ice','fox','#bad9e0','#fbfaf0','snow',1,'Glacierfox',24,'Sleeps beneath a blanket of powdered snow.'],
 ['Glacierfox','Ice','fox','#82b4d1','#e8fffc','snow',4,null,0,'Its breath draws frost flowers on glass.'],
 ['Gustlet','Air','bird','#afc794','#fff0b9','meadow',1,'Skyrake',24,'Practices tiny whirlwinds around its nest.'],
 ['Skyrake','Air','bird','#708f93','#d6e4ab','rocky',3,null,0,'Rides high winds without a wingbeat.'],
 ['Glimmerbug','Radiant','beetle','#e2bd5e','#ffffb2','forest',2,'Dawnscarab',26,'Lights the trail for lost travelers.'],
 ['Dawnscarab','Radiant','beetle','#b99645','#fff4bb','rocky',4,null,0,'Its shell shines like a sunrise.'],
 ['Runeimp','Arcane','imp','#b090bd','#f9cced','rocky',2,'Glyphsage',27,'Draws strange symbols in soft earth.'],
 ['Glyphsage','Arcane','imp','#826aa5','#edc9ff','rocky',4,null,0,'A quiet creature that remembers every kindness.'],
 ['Coalback','Fire','turtle','#aa674e','#fbbb64','volcanic',2,'Furnashell',28,'A warm shell makes it a popular camp companion.'],
 ['Furnashell','Fire','turtle','#775346','#ffbf5e','volcanic',4,null,0,'A walking forge with a surprisingly gentle heart.'],
 ['Bogbud','Nature','frog','#7d9872','#ecc697','wetland',1,'Marshmaw',25,'Croaks louder just before a storm.'],
 ['Marshmaw','Nature','frog','#547d69','#dfb98b','wetland',3,null,0,'Waits patiently among the reeds.'],
 ['Snowcap','Ice','bear','#dddfe0','#9dd3e4','snow',3,null,0,'A shaggy cub that rolls down icy hills.'],
 ['Wishling','Arcane','imp','#e3c4d3','#fff0b7','meadow',6,null,0,'A small, mysterious Feral drawn to hopeful hearts.'],
 ['Cragwing','Stone','bird','#958d83','#d7b77b','rocky',3,null,0,'Nests on cliffs no trainer can reach.'],
 ['Stormjaw','Storm','lion','#94805b','#fff4a0','rocky',5,null,0,'Its low roar sounds like distant thunder.'],
 ['Lanternelk','Radiant','stag','#b89e7c','#fff2b1','forest',5,null,0,'Golden antlers guide a herd through the mist.'],
 ['Emberasp','Fire','serpent','#be7457','#ffe196','volcanic',3,null,0,'Coils around sun-warmed stones.']
];
rows.push(...EXTRA_ROWS);
export const SPECIES=Object.fromEntries(rows.map((r,i)=>[r[0],{name:r[0],type:r[1],shape:r[2],color:r[3],accent:r[4],habitat:r[5],rarity:r[6],evo:r[7],evoLevel:r[8],lore:r[9],index:i,family:r[10]??null,stage:r[11]??0,hp:36+(i%4)*5,attack:12+(i%5)*2,defense:10+(i%3)*3,speed:10+(i*7%15)}]));
Object.assign(SPECIES.Bastionhorn,{hp:60,defense:25,attack:14,speed:7});Object.assign(SPECIES['Titanblood Gravahound'],{hp:68,attack:27,defense:21,speed:15});Object.assign(SPECIES.Abysscoil,{hp:56,attack:22,defense:17,speed:19});
export const STARTERS=['Cinderkit','Mossprig','Rillfin'];
export const MOVES={
 Tackle:{type:'Normal',power:30},Guard:{type:'Normal',power:0,effect:'guard'},Recover:{type:'Normal',power:0,effect:'heal'},
 'Vine Lash':{type:'Nature',power:42},'Root Snare':{type:'Nature',power:32,effect:'slow'},'Bloom Burst':{type:'Nature',power:64},
 Ember:{type:'Fire',power:42,effect:'burn'},'Flame Arc':{type:'Fire',power:62},'Firestorm':{type:'Fire',power:78},
 'Water Jet':{type:'Water',power:42},'Tidal Coil':{type:'Water',power:62},'Undertow':{type:'Water',power:76},
 'Rock Rush':{type:'Stone',power:42},'Horn Wall':{type:'Stone',power:55,effect:'guard'},'Earthbreak':{type:'Stone',power:76},
 Spark:{type:'Storm',power:40,effect:'slow'},'Thunder Fang':{type:'Storm',power:62},'Chain Bolt':{type:'Storm',power:76},
 'Frost Bite':{type:'Ice',power:42,effect:'slow'},'Ice Lance':{type:'Ice',power:62},'Blizzard':{type:'Ice',power:76},
 'Dusk Claw':{type:'Shadow',power:42},'Gravity Crush':{type:'Shadow',power:62},'Titanfall':{type:'Shadow',power:78},
 'Light Ray':{type:'Radiant',power:42},'Dawn Strike':{type:'Radiant',power:62},'Solar Ring':{type:'Radiant',power:76},
 'Rune Pulse':{type:'Arcane',power:42},'Vector Shift':{type:'Arcane',power:58,effect:'guard'},'Wishburst':{type:'Arcane',power:76},
 Gust:{type:'Air',power:42},'Wing Blade':{type:'Air',power:62},'Skyfall':{type:'Air',power:76}
};
export const TERRAIN={lawn:{name:'Lawn',color:'#8fad70',cost:1},path:{name:'Path',color:'#d8c599',cost:2},meadow:{name:'Tall grass',color:'#6e985d',cost:3},forest:{name:'Forest',color:'#46795d',cost:4},water:{name:'Water',color:'#669eae',cost:4},wetland:{name:'Wetland',color:'#72a995',cost:4},rocky:{name:'Highlands',color:'#a5a590',cost:4},snow:{name:'Snowfield',color:'#d2dfd9',cost:4},volcanic:{name:'Ashlands',color:'#9a8472',cost:5},bridge:{name:'Bridge',color:'#b69a71',cost:10}};
export const HABITATS=['meadow','forest','wetland','rocky','snow','volcanic'];
export const BUILDINGS={lab:{name:'Starter lab',cost:900,color:'#7c9f93',width:3,height:3,fee:0,upkeep:7},heal:{name:'Healing lodge',cost:850,color:'#c97570',width:3,height:3,fee:8,upkeep:5},shop:{name:'Supply shop',cost:700,color:'#6b98ad',width:3,height:3,fee:16,upkeep:4},gym:{name:'Gym',cost:1200,color:'#b89b62',width:4,height:3,fee:20,upkeep:7},league:{name:'Elite Four hall',cost:4800,color:'#76658e',width:5,height:4,fee:50,upkeep:15},cafe:{name:'Trail café',cost:650,color:'#b88563',width:3,height:2,fee:12,upkeep:3},bench:{name:'Bench',cost:35,color:'#a58b62',width:1,height:1,fee:0,upkeep:0},flowers:{name:'Flowers',cost:25,color:'#de9aa4',width:1,height:1,fee:0,upkeep:0},sign:{name:'Route sign',cost:45,color:'#a08760',width:1,height:1,fee:0,upkeep:0},fountain:{name:'Fountain',cost:160,color:'#7eacbd',width:2,height:2,fee:0,upkeep:0}};
export const GYM_TYPES=['Nature','Water','Fire','Stone','Storm','Ice','Shadow','Arcane'];
export const GYM_LEVELS=[7,12,18,24,30,36,42,48];
export const BADGES=['Sprout','Ripple','Ember','Granite','Tempest','Glacier','Eclipse','Astral'];
export const NAMES=['Evan','Reid','Olivia','Mira','Noah','Lark','Tovin','Sella','Juno','Rowan','Piper','Theo','Sage','Finn','Arlo','Ivy','Ash','Mae','Jasper','Wren','Kai','Luna','Beau','Ada','Nico','Hazel','Leo','Skye','Milo','Cora','Dax','Rhea','Ezra','Nova','Orion','Isla','Kit','Ari','Remy','Tess','Zane','Bryn','Otis','Nell','Soren','Maya','Reece','Eli'];
export const TRAITS=['Collector','Bold','Patient','Strategist','Wanderer'];
export function defaultMoves(name,level){const s=SPECIES[name];return ['Tackle',...Object.keys(MOVES).filter(k=>MOVES[k].type===s.type).slice(0,level>=30?3:level>=14?2:1)].slice(-4);}
export function effectiveness(type,target){return TYPES[type]?.strong.includes(target)?1.5:TYPES[type]?.weak.includes(target)?.valueOf()?0.7:1;}
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

Object.assign(BUILDINGS,{fence:{name:'Wood fence',cost:18,color:'#9e805b',width:1,height:1,fee:0,upkeep:0},lamp:{name:'Lantern post',cost:65,color:'#efce7c',width:1,height:1,fee:0,upkeep:0},hedge:{name:'Hedge',cost:20,color:'#4e7853',width:1,height:1,fee:0,upkeep:0},statue:{name:'Champion statue',cost:350,color:'#afb5ae',width:2,height:2,fee:0,upkeep:1},picnic:{name:'Picnic table',cost:85,color:'#b99062',width:2,height:1,fee:0,upkeep:0}});
export const encounterWeight=(area,f)=>area.encounterWeights?.[f.name]??Math.max(1,Math.round(100/(f.rarity*f.rarity)));

Object.assign(BUILDINGS,{arena:{name:'Tournament arena',cost:1400,color:'#8c729f',width:5,height:4,fee:0,upkeep:8},stands:{name:'Spectator stands',cost:180,color:'#a78a60',width:3,height:2,fee:0,upkeep:1}});

Object.assign(BUILDINGS,{house:{name:'Trainer house',cost:600,color:'#799681',width:3,height:3,fee:0,upkeep:0}});

Object.assign(BUILDINGS,{duel:{name:'Duel court',cost:950,color:'#a47d69',width:4,height:3,fee:2,upkeep:4}});
