/* =========================
   GAME STATE
========================= */

let turn = 1;

let currentTurn = "player";

let playerEnergy = 1;
let enemyEnergy = 0;

let selectedCard = null;

/* PLAYER */

let playerDeck = [];
let playerHand = [];

let playerSupport = [];
let playerFrontline = [];

let playerFleetHP = 40;

/* ENEMY */

let enemyDeck = [];
let enemyHand = [];

let enemySupport = [];
let enemyFrontline = [];

let enemyFleetHP = 40;

/* =========================
   DOM
========================= */

const playerHandEl =
document.getElementById(
"player-hand"
);

const playerSupportEl =
document.getElementById(
"player-support"
);

const enemySupportEl =
document.getElementById(
"enemy-support"
);

const frontlineEl =
document.getElementById(
"frontline"
);

const enemyDeckEl =
document.getElementById(
"enemy-deck"
);

const turnDisplay =
document.getElementById(
"turn-display"
);

const playerEnergyEl =
document.getElementById(
"player-energy"
);

const enemyEnergyEl =
document.getElementById(
"enemy-energy"
);

const endTurnBtn =
document.getElementById(
"end-turn"
);

/* =========================
   HELPERS
========================= */

function shuffle(deck) {

for (
let i = deck.length - 1;
i > 0;
i--
) {

const j =
Math.floor(
Math.random() * (i + 1)
);

[
deck[i],
deck[j]
] = [
deck[j],
deck[i]
];
}
}

function cloneCard(card) {

const copy =
structuredClone(card);

copy.currentDefense =
copy.defense;

copy.hasAttacked =
false;

copy.hasActed = false;

copy.usedFastBonus = false;

copy.turnsDeployed = 0;

copy.extraAttackUsed = false;

copy.usedAbility = false;

copy.summoningSick =
false;

return copy;
}

function drawCard(
deck,
hand
) {

if (
deck.length === 0
) {

return;
}

hand.push(
deck.pop()
);
}

/* =========================
   START GAME
========================= */

function startGame() {

/* PLAYER DECK */

playerDeck = [

cloneCard(
britishCards[0]
),

cloneCard(
britishCards[1]
),

cloneCard(
britishCards[2]
),

cloneCard(
britishCards[3]
),

cloneCard(
britishCards[4]
),

cloneCard(
britishCards[5]
),

cloneCard(
britishCards[6]
),

cloneCard(
britishCards[7]
),

cloneCard(
britishCards[8]
),

cloneCard(
britishCards[9]
),

cloneCard(
britishCards[10]
),

cloneCard(
britishCards[11]
),

cloneCard(
britishCards[12]
),

cloneCard(
britishCards[13]
),

cloneCard(
britishCards[14]
)

];

/* ENEMY DECK */

enemyDeck = [

cloneCard(
frenchCards[0]
),

cloneCard(
frenchCards[1]
),

cloneCard(
frenchCards[2]
),

cloneCard(
frenchCards[3]
),

cloneCard(
frenchCards[4]
),

cloneCard(
frenchCards[5]
),

cloneCard(
frenchCards[6]
)

];

shuffle(playerDeck);
shuffle(enemyDeck);

/* STARTING HAND */

for (
let i = 0;
i < 1;
i++
) {

drawCard(
playerDeck,
playerHand
);

drawCard(
enemyDeck,
enemyHand
);
}

renderBoard();
}

/* =========================
   RENDER
========================= */

function renderBoard() {

/* CLEAR */

playerHandEl.innerHTML = "";

playerSupportEl.innerHTML = "";

enemySupportEl.innerHTML = "";

frontlineEl.innerHTML = "";

enemyDeckEl.innerHTML = "";

/* UI */

turnDisplay.innerText =
`Turn ${turn}`;

playerEnergyEl.innerText =
`Energy: ${playerEnergy}`;

enemyEnergyEl.innerText =
`Energy: ${enemyEnergy}`;

/* ENEMY DECK */

const deckCard =
document.createElement(
"div"
);

deckCard.classList.add(
"card"
);

deckCard.innerHTML = `
<div class="deck-back french-back">
</div>
`;

enemyDeckEl.appendChild(
deckCard
);

/* HQS */

const enemyHQ =
document.createElement(
"div"
);

enemyHQ.classList.add(
"fleet-card"
);

enemyHQ.innerHTML = `
<h2>Toulon</h2>
<p>HP: ${enemyFleetHP}</p>
`;

enemyHQ.onclick = () => {

if (
selectedCard
&&
playerFrontline.includes(
selectedCard
)
&&
enemyFrontline.length === 0

) {

enemyFleetHP -=
selectedCard.damage;

selectedCard.hasAttacked =
true;

selectedCard.hasActed =
true;

selectedCard = null;

renderBoard();
}
};

enemySupportEl.appendChild(
enemyHQ
);

const playerHQ =
document.createElement(
"div"
);

playerHQ.classList.add(
"fleet-card"
);

playerHQ.innerHTML = `
<h2>Scapa Flow</h2>
<p>HP: ${playerFleetHP}</p>
`;

playerSupportEl.appendChild(
playerHQ
);

/* ENEMY SUPPORT */

enemySupport.forEach(card => {

enemySupportEl.appendChild(
createCard(
card,
"enemy",
"support"
)
);
});

/* PLAYER FRONTLINE */

enemyFrontline.forEach(card => {

frontlineEl.appendChild(
createCard(
card,
"enemy",
"frontline"
)
);
});

playerFrontline.forEach(card => {

frontlineEl.appendChild(
createCard(
card,
"player",
"frontline"
)
);
});

/* PLAYER SUPPORT */

/* BRITISH ABILITES */
/* DIDO BUFF */

[
...playerSupport,
...playerFrontline,
...enemySupport,
...enemyFrontline
].forEach(ship => {

if (
ship.name ===
"HMS Dido"
) {

const allies =
ship.nation === "Britain"
? playerSupport.length +
playerFrontline.length
: enemySupport.length +
enemyFrontline.length;

const enemies =
ship.nation === "Britain"
? enemySupport.length +
enemyFrontline.length
: playerSupport.length +
playerFrontline.length;

ship.currentDefense =
ship.defense;

if (
enemies > allies
) {

ship.currentDefense += 2;
}
}
});

/* SIRIUS */

[
...playerSupport,
...playerFrontline,
...enemySupport,
...enemyFrontline
].forEach(ship => {

if (
ship.name ===
"HMS Sirius"
&&
ship.turnsDeployed >= 5
&&
!ship.usedAbility
) {

ship.usedAbility = true;

ship.damage += 2;

ship.currentDefense += 2;
}
});

playerSupport.forEach(card => {

playerSupportEl.appendChild(
createCard(
card,
"player",
"support"
)
);
});

/* PLAYER HAND */

playerHand.forEach(card => {

playerHandEl.appendChild(
createCard(
card,
"player",
"hand"
)
);
});
}

/* =========================
   CARD CREATION
========================= */

function createCard(
card,
owner,
zone
) {

const el =
document.createElement(
"div"
);

el.classList.add(
"card",
owner
);

if (
card.rarity
) {

el.classList.add(
card.nation.toLowerCase()
);
}

if (
card.nation
) {

el.classList.add(
card.nation.toLowerCase()
);
}

if (
card.faction
) {

el.classList.add(
card.faction.toLowerCase()
);
}

el.classList.add(
card.rarity
);

if (
selectedCard === card
) {

el.classList.add(
"selected"
);
}

let disabled = false;

/* HAND */

if (
zone === "hand"
&&
playerEnergy <
card.deployCost
&&
owner === "player"
) {

disabled = true;
}

/* FIELD */

if (
zone !== "hand"
&&
owner === "player"
&&
(
card.hasActed
||
playerEnergy <
card.attackCost
)
) {

disabled = true;
}

if (
disabled
) {

el.classList.add(
"disabled"
);
}

el.innerHTML = `

<div class="cost">

${
zone === "hand"
? card.deployCost
: card.attackCost
}

</div>

<h3>${card.name}</h3>

<p>ATK: ${card.damage}</p>

<p>DEF: ${card.currentDefense}</p>

<p>${card.ability}</p>

${
owner === "player"
&&
zone !== "frontline"

? `
<button class="advance-btn">
Advance
</button>
`

: ""
}
`;

/* SELECT */

el.onclick = () => {

handleCardClick(
card,
owner
);
};

/* ADVANCE */

const btn =
el.querySelector(
".advance-btn"
);

if (
btn
) {

btn.onclick = (
e
) => {

e.stopPropagation();

advanceCard(card);
};
}

return el;
}

/* =========================
   CLICK
========================= */

function handleCardClick(
card,
owner
) {

if (
currentTurn !== "player"
) {

return;
}

if (
owner === "player"
) {

if (
card.hasActed
&&
!card.fast
) {

return;
}

selectedCard = card;

renderBoard();

return;
}

if (
selectedCard
&&
owner === "enemy"
) {

attack(
selectedCard,
card
);
}
}

/* =========================
   ADVANCE
========================= */

function advanceCard(card) {

/* DEPLOY */

if (
playerHand.includes(card)
) {

if (
playerEnergy <
card.deployCost
) {

return;
}

playerEnergy -=
card.deployCost;

playerHand =
playerHand.filter(
c => c !== card
);

playerSupport.push(card);

/* MOHAWK */

if (
card.name ===
"HMS Mohawk"
&&
!card.usedAbility
) {

card.usedAbility =
true;

enemySupport.forEach(ship => {

ship.attackCost += 1;
});
}

/* LIVERPOOL */

if (
card.name ===
"HMS Liverpool"
&&
enemySupport.length > 0
) {

const bounced =
enemySupport.shift();

enemyHand.push(
bounced
);
}

/* FORCE H */

if (
card.name ===
"HMS Hood"
) {

const arethusa =
playerSupport.find(
s =>
s.name ===
"HMS Arethusa"
);

if (
arethusa
) {

card.damage += 2;
card.currentDefense += 3;

arethusa.damage += 2;
arethusa.currentDefense += 3;

card.attackCost =
Math.max(
1,
card.attackCost - 2
);

arethusa.attackCost =
Math.max(
1,
arethusa.attackCost - 2
);
}
}

/* VANGUARD ABILITY */

if (
card.name ===
"HMS Vanguard"
&&
!card.usedAbility
) {

card.usedAbility = true;

let bonus = 0;

[
...playerSupport,
...playerFrontline
].forEach(ship => {

if (
ship.name ===
"HMS Warspite"
||
ship.name ===
"HMS Hood"
) {

bonus += 2;
}
});

card.currentDefense +=
bonus;
}

/* ILLUSTRIOUS ABILTY */
if (
card.name ===
"HMS Illustrious"
) {

[
enemySupport,
enemyFrontline
].forEach(zone => {

zone.forEach(ship => {

ship.currentDefense -= 2;
});
});
}

card.hasActed =
true;

selectedCard = null;

renderBoard();

return;
}

/* TO FRONTLINE */

if (
playerSupport.includes(card)
) {

if (
card.hasActed
&&
!card.fast
) {

return;
}

if (
playerFrontline.length >= 5
) {

return;
}

if (
enemyFrontline.length > 0
&&
playerFrontline.length === 0
) {

return;
}

playerSupport =
playerSupport.filter(
c => c !== card
);

playerFrontline.push(card);

/* WARSPITE */

if (
card.name ===
"HMS Warspite"
&&
!card.usedAbility
) {

card.usedAbility =
true;

card.damage += 3;

card.currentDefense += 3;
}

/* ARETHUSA */

if (
card.name ===
"HMS Arethusa"
&&
!card.usedAbility
) {

card.usedAbility =
true;

[
...playerSupport,
...playerFrontline
].forEach(ship => {

ship.damage += 1;

ship.currentDefense += 1;
});
}

if (
!card.fast
) {

card.hasActed =
true;
}

selectedCard = null;

renderBoard();
}
}

/* =========================
   ATTACK
========================= */

function attack(
attacker,
defender
) {

if (
attacker.hasAttacked
||
attacker.summoningSick
) {

return;
}

if (
playerEnergy <
attacker.attackCost
) {

return;
}

/* SUPPORT */

if (
playerSupport.includes(
attacker
)
&&
!attacker.carrier
&&
!enemyFrontline.includes(
defender
)
) {

return;
}

/* FRONTLINE */

if (
playerFrontline.includes(
attacker
)
&&
enemyFrontline.length > 0
&&
!enemyFrontline.includes(
defender
)
) {

return;
}

playerEnergy -=
attacker.attackCost;

/* DAMAGE */

let damage =
attacker.damage;

/* WARSPITE */

if (
defender.name ===
"HMS Warspite"
) {

damage =
Math.ceil(
damage / 2
);
}

defender.currentDefense -=
damage;

/* GRAFTON INTERCEPT */

let actualDefender =
defender;

const grafton =
[
...playerSupport,
...playerFrontline
].find(ship => {

return (
ship.name ===
"HMS Grafton"
&&
ship !== defender
&&
ship.destroyer
);
});

if (
grafton
&&
defender.destroyer
) {

actualDefender =
grafton;
}

actualDefender.currentDefense -=
damage;

/* GlOWWORM ABILITY */

if (
attacker.name ===
"HMS Glowworm"
) {

attacker.currentDefense = 0;

defender.currentDefense -= 3;
}

/* CARRIER */

if (
!attacker.carrier
) {

attacker.currentDefense -=
defender.damage;
}

if (
attacker.name ===
"HMS Hood"
&&
!attacker.extraAttackUsed
) {

attacker.extraAttackUsed =
true;

attacker.damage = 4;

} else {

attacker.hasAttacked =
true;
}

if (
attacker.fast
&&
!attacker.usedFastBonus
) {

attacker.usedFastBonus =
true;

} else {

attacker.hasActed =
true;
}

cleanupDestroyed();

/* COSSAK ABILITY */
if (
attacker.name ===
"HMS Cossack"
&&
defender.currentDefense <= 0
) {

attacker.currentDefense += 1;
}

selectedCard = null;

renderBoard();
}

/* =========================
   CLEANUP
========================= */

function cleanupDestroyed() {

[
playerSupport,
playerFrontline,
enemySupport,
enemyFrontline
].forEach(zone => {

for (
let i = zone.length - 1;
i >= 0;
i--
) {

const ship =
zone[i];

/* JAVELIN */

if (
ship.name ===
"HMS Javelin"
&&
ship.currentDefense <= 0
&&
!ship.usedAbility
) {

ship.usedAbility =
true;

ship.currentDefense = 1;

continue;
}

/* DESTROY */

/* VANGUARD */

if (
ship.name ===
"HMS Vanguard"
&&
ship.currentDefense <= 3
&&
!ship.usedAbility2
) {

ship.usedAbility2 = true;

playerHand.push(
cloneCard({
name:
"HMCS Magnificent",

rarity:
"rare",

damage: 6,
defense: 2,

deployCost: 7,
attackCost: 5,

ability:
"Light Carrier",

carrier: true,

nation:
"Canada"
})
);

playerHand.push(
cloneCard({
name:
"HMAS Sydney",

rarity:
"rare",

damage: 6,
defense: 2,

deployCost: 7,
attackCost: 5,

ability:
"Light Carrier",

carrier: true,

nation:
"Australia"
})
);
}

if (
ship.currentDefense <= 0
) {

/* ABDIEL */

if (
ship.name ===
"HMS Abdiel"
&&
ship.currentDefense <= 0
&&
playerFrontline.includes(ship)
) {

enemySupport.forEach(enemy => {

enemy.currentDefense -= 1;
});
}

/* EXETER */

if (
ship.name ===
"HMS Exeter"
&&
!ship.usedAbility
) {

ship.usedAbility = true;

ship.currentDefense = 1;

ship.damage += 3;

continue;
}

zone.splice(i, 1);
}
}
});
}

/* =========================
   RESET
========================= */

function resetShips(
zones
) {

zones.forEach(zone => {

zone.forEach(ship => {

ship.hasAttacked =
false;

ship.summoningSick =
false;

ship.hasActed =
false;

ship.usedFastBonus =
false;

ship.turnsDeployed++;

ship.extraAttackUsed =
false;

if (
ship.name ===
"HMS Hood"
) {

ship.damage = 9;
}
});
});
}

/* =========================
   AI TURN
========================= */

function enemyTurn() {

/* DEPLOY */

for (
let i = enemyHand.length - 1;
i >= 0;
i--
) {

const card =
enemyHand[i];

if (
enemyEnergy >=
card.deployCost
) {

enemyEnergy -=
card.deployCost;

enemySupport.push(card);

card.hasActed =
true;

enemyHand.splice(i, 1);
}
}

/* MOVE */

/* MOVE ONE SHIP */

for (
let i = 0;
i < enemySupport.length;
i++
) {

const card =
enemySupport[i];

if (
card.carrier
) {

continue;
}

if (
enemyEnergy < 1
) {

break;
}

if (
enemyFrontline.length >= 5
) {

break;
}

if (
playerFrontline.length > 0
&&
enemyFrontline.length === 0
) {

break;
}

enemyEnergy -= 1;

enemySupport.splice(i, 1);

enemyFrontline.push(card);

if (
!card.fast
) {

card.hasActed =
true;
}

break;
}

/* ATTACK */

enemyFrontline.forEach(card => {

if (
card.hasAttacked
||
card.summoningSick
) {

return;
}

if (
enemyEnergy <
card.attackCost
) {

return;
}

enemyEnergy -=
card.attackCost;

if (
playerFrontline.length > 0
) {

const target =
playerFrontline[0];

target.currentDefense -=
card.damage;

if (
!card.carrier
) {

card.currentDefense -=
target.damage;
}

} else if (
playerSupport.length > 0
) {

const target =
playerSupport[0];

target.currentDefense -=
card.damage;

if (
!card.carrier
) {

card.currentDefense -=
target.damage;
}

} else {

playerFleetHP -=
card.damage;
}

card.hasAttacked =
true;

if (
card.fast
&&
!card.usedFastBonus
) {

card.usedFastBonus =
true;

} else {

card.hasActed =
true;
}
});

/* SUPPORT ATTACKS */

enemySupport.forEach(card => {

if (
card.carrier
) {

return;
}

if (
card.hasAttacked
||
card.summoningSick
||
card.hasActed
) {

return;
}

if (
enemyEnergy <
card.attackCost
) {

return;
}

/* SUPPORT CAN ONLY
ATTACK FRONTLINE */

if (
playerFrontline.length === 0
) {

return;
}

enemyEnergy -=
card.attackCost;

const target =
playerFrontline[0];

target.currentDefense -=
card.damage;

card.currentDefense -=
target.damage;

card.hasAttacked =
true;

if (
card.fast
&&
!card.usedFastBonus
) {

card.usedFastBonus =
true;

} else {

card.hasActed =
true;
}
});

/* CARRIERS */

enemySupport.forEach(card => {

if (
!card.carrier
) {

return;
}

if (
enemyEnergy <
card.attackCost
) {

return;
}

enemyEnergy -=
card.attackCost;

if (
playerFrontline.length > 0
) {

playerFrontline[0]
.currentDefense -=
card.damage;

} else if (
playerSupport.length > 0
) {

playerSupport[0]
.currentDefense -=
card.damage;
}

card.hasAttacked =
true;
});

cleanupDestroyed();

/* DRAW */

drawCard(
enemyDeck,
enemyHand
);
}

/* =========================
   END TURN
========================= */

endTurnBtn.onclick = () => {

if (
currentTurn !== "player"
) {

return;
}

currentTurn = "enemy";

/* ENEMY */

enemyEnergy = turn;

resetShips([
enemySupport,
enemyFrontline
]);

enemyTurn();

/* NEXT TURN */

turn++;

playerEnergy = turn;

resetShips([
playerSupport,
playerFrontline
]);

drawCard(
playerDeck,
playerHand
);

currentTurn = "player";

renderBoard();
};

/* =========================
   START
========================= */

startGame();