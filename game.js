/* =========================
   GAME STATE
========================= */

let playerNation = null;
let enemyNation  = null;

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

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function highlightAttack(attacker, defender) {
  // We re-render so we need a quick way to mark them.
  // For now we just force a short visual by temporarily storing flags.
  attacker._isAttacking = true;
  defender._isDefending = true;
  renderBoard();

  setTimeout(() => {
    attacker._isAttacking = false;
    defender._isDefending = false;
  }, 500);
}

function giveTorpedoStrike(owner) {
  // owner is either "player" or "enemy"
  const torpedo = cloneCard(
    NATIONS.france.cards.find(c => c.name === "Torpedo Strike")
  );

  if (owner === "player") {
    if (playerHand.length < 6) playerHand.push(torpedo);
  } else {
    if (enemyHand.length < 6) enemyHand.push(torpedo);
  }
}

async function useAbilityCard(card, owner) {
  const isPlayer = owner === "player";
  const hand = isPlayer ? playerHand : enemyHand;
  const energyKey = isPlayer ? "playerEnergy" : "enemyEnergy";

  if (!hand.includes(card)) return;
  if ((isPlayer ? playerEnergy : enemyEnergy) < card.deployCost) return;

  // Pay cost and discard
  if (isPlayer) {
    playerEnergy -= card.deployCost;
    playerHand = playerHand.filter(c => c !== card);
  } else {
    enemyEnergy -= card.deployCost;
    enemyHand = enemyHand.filter(c => c !== card);
  }

  // Big reveal
  await showAbilityCard(card);

  // Effects
if (card.name === "Chariot") {
  enemyFleetHP -= 10;
  enemySupport.forEach(ship => ship.currentDefense -= 2);
  cleanupDestroyed();
}

if (card.name === "Torpedo Strike") {
  const targets = isPlayer
    ? [...enemyFrontline, ...enemySupport]
    : [...playerFrontline, ...playerSupport];

  if (targets.length > 0) {
    targets.sort((a, b) => (b.deployCost || 0) - (a.deployCost || 0));
    targets[0].currentDefense = 0;
    cleanupDestroyed();
  }
}

if (card.name === "Battle For Koh Chang") {
  const targets = isPlayer
    ? [...enemySupport, ...enemyFrontline]
    : [...playerSupport, ...playerFrontline];

  targets.forEach(ship => {
    ship.currentDefense -= 5;
  });
  cleanupDestroyed();
}

selectedCard = null;
renderBoard();
}

function showAbilityCard(card, duration = 2800) {
  return new Promise(resolve => {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "ability-overlay";
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9000;
      opacity: 0;
      transition: opacity 0.4s ease;
    `;

    // The big card
    const bigCard = document.createElement("div");
    bigCard.className = `card ${card.nation.toLowerCase()} ${card.rarity}`;
    if (card.faction) bigCard.classList.add(card.faction.toLowerCase());

    bigCard.style.cssText = `
      width: 220px;
      height: 300px;
      font-size: 1.1em;
      transform: scale(0.7);
      transition: transform 0.45s ease, opacity 0.45s ease;
      opacity: 0;
      text-align: center;
      padding: 16px;
    `;

    bigCard.innerHTML = `
      <div class="cost" style="font-size:18px; width:36px; height:36px;">${card.deployCost}</div>
      <h3 style="margin-top:40px; font-size:22px;">${card.name}</h3>
      <p style="margin-top:20px; font-size:15px; line-height:1.4;">${card.ability}</p>
    `;

    overlay.appendChild(bigCard);
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      bigCard.style.opacity = "1";
      bigCard.style.transform = "scale(1)";
    });

    // Animate out after duration
    setTimeout(() => {
      overlay.style.opacity = "0";
      bigCard.style.transform = "scale(0.8)";
      bigCard.style.opacity = "0";

      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 450);
    }, duration);
  });
}

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

if (
hand.length >= 6
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

function startGame(playerNationId = "britain", enemyNationId = "france") {

  playerNation = NATIONS[playerNationId];
  enemyNation  = NATIONS[enemyNationId];

  // Player deck
  playerDeck = playerNation.cards.map(card => cloneCard(card));

  // Enemy deck
  enemyDeck = enemyNation.cards.map(card => cloneCard(card));

  shuffle(playerDeck);
  shuffle(enemyDeck);

  // Starting hand
  for (let i = 0; i < 1; i++) {
    drawCard(playerDeck, playerHand);
    drawCard(enemyDeck, enemyHand);
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
<div class="deck-back ${enemyNation.deckBackClass}">
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
<h2>${enemyNation.hqName}</h2>
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

if (
enemyFleetHP <= 0
) {

enemyFleetHP = 0;

renderBoard();

gameOver(
playerNation.displayName
);

return;
}

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
<h2>${playerNation.hqName}</h2>
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
${zone === "hand" ? card.deployCost : card.attackCost}
</div>

${card.submerged ? `<div class="submerged-badge">S</div>` : ""}

<h3>${card.name}</h3>

${
  card.type === "ability"
    ? `<p style="margin-top:20px; font-size:13px;">${card.ability}</p>`
    : `
      <p>ATK: ${card.damage}</p>
      <p>DEF: ${card.currentDefense}</p>
      <p>${card.ability}</p>
    `
}

${
  owner === "player" && zone === "hand" && card.type === "ability"
    ? `<button class="use-btn">USE</button>`
    : (owner === "player" && zone !== "frontline" && card.type !== "ability"
        ? `<button class="advance-btn">Advance</button>`
        : "")
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

const useBtn = el.querySelector(".use-btn");
if (useBtn) {
  useBtn.onclick = (e) => {
    e.stopPropagation();
    useAbilityCard(card, "player");
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

async function advanceCard(card) {

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

if (card.name === "Le Terrible") {
  const frontlineEmptyOrFriendly = playerFrontline.length === 0 || 
    playerFrontline.some(s => s.nation === "France" || s.faction === "freefrench");
  
  if (frontlineEmptyOrFriendly && playerFrontline.length < 4) {
    playerSupport = playerSupport.filter(c => c !== card);
    playerFrontline.push(card);
  }
}

if (card.name === "La Combattante") {
  const hasFreeFrenchFront = playerFrontline.some(s => s.faction === "freefrench");
  if (hasFreeFrenchFront) {
    card.attackCost = 0;
    card.damage = 2;
    card.currentDefense = 2;
    card.defense = 2;
  }
}

if (card.name === "Surcouf") {
  giveTorpedoStrike("player");
}

/*Prince of Wales*/
if (card.name === "HMS Prince of Wales") {
  // Show the big centered reveal
  await showAbilityCard(card, 3200);

  // Critical Hit! – halve the defense of the enemy battleship with highest defense
  const enemyShips = [...enemySupport, ...enemyFrontline];
  const battleships = enemyShips.filter(s => 
    s.defense >= 8 || s.name.includes("Richelieu") || s.name.includes("Jean Bart") || 
    s.name.includes("Dunkerque") || s.name.includes("Strasbourg") || s.name.includes("Hood") || 
    s.name.includes("Warspite") || s.name.includes("Vanguard")
  );

  if (battleships.length > 0) {
    battleships.sort((a, b) => b.currentDefense - a.currentDefense);
    const target = battleships[0];
    target.currentDefense = Math.ceil(target.currentDefense / 2);
  }
}

/*HMS Edinburgh*/
if (card.name === "HMS Edinburgh") {
  // A Royal Treasurer – restore all energy spent this turn
  // Simple version: set energy back to the current turn value
  playerEnergy = turn;
}

/* GLOIRE */

if (
card.name ===
"Gloire"
&&
playerFrontline.length > 0
) {

playerFrontline[0]
.currentDefense += 1;
}

/* LE MALIN */

if (
card.name ===
"Le Malin"
) {

playerEnergy += 1;
}

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

if (card.name === "Casabianca") {
  enemySupport.forEach(ship => {
    ship.currentDefense -= 2;
  });
  cleanupDestroyed();
}

if (
playerSupport.includes(card)
) {

   if (
playerEnergy <
card.attackCost
) {

return;
}

playerEnergy -=
card.attackCost;

if (
card.hasActed
&&
!card.fast
) {

return;
}

if (
playerFrontline.length >= 4
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

/* LE TRIOMPHANT */

if (
card.name ===
"Le Triomphant"
&&
!card.usedAbility
) {

card.usedAbility = true;

playerEnergy += 1;
}

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

if (attacker.name === "Lorraine" && enemyFrontline.includes(defender)) {
  if (enemySupport.length > 0) {
    const randomIndex = Math.floor(Math.random() * enemySupport.length);
    enemySupport[randomIndex].currentDefense -= 2;
  }
}

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
attacker.name !==
"Surcouf"
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

let damage = attacker.damage;

/* ALGERIE */
if (
  attacker.name === "Algérie" &&
  (enemySupport.includes(defender) || playerSupport.includes(defender))
) {
  damage += 2;
}

/* WARSPITE */
if (defender.name === "HMS Warspite") {
  damage = Math.ceil(damage / 2);
}

/* DUNKERQUE */
if (defender.name === "Dunkerque") {
  attacker.currentDefense -= 4;
}

/* GRAFTON INTERCEPT */
let actualDefender = defender;

const grafton = [...playerSupport, ...playerFrontline].find(ship => {
  return (
    ship.name === "HMS Grafton" &&
    ship !== defender &&
    ship.destroyer
  );
});

if (grafton && defender.destroyer) {
  actualDefender = grafton;
}

// ===== DAMAGE + SUBMERGED / DESTROYER LOGIC =====
let finalDamage = damage;
let returnDamage = defender.damage;

// Destroyer vs submerged submarine → double damage + break submerged
if (attacker.destroyer && defender.submerged) {
  finalDamage = damage * 2;
  defender.submerged = false;
}
// First hit on a submerged ship does 0 damage and removes submerged
else if (defender.submerged && !defender._submergedHitThisTurn) {
  finalDamage = 0;
  defender._submergedHitThisTurn = true;
  defender.submerged = false;
}

// Apply the (possibly modified) damage
actualDefender.currentDefense -= finalDamage;

/* GLOWWORM ABILITY */
if (attacker.name === "HMS Glowworm") {
  attacker.currentDefense = 0;
  defender.currentDefense -= 3;
}

/* LE VAUTOUR */
if (
  attacker.name === "Le Vautour" &&
  playerFrontline.includes(attacker)
) {
  playerFrontline = playerFrontline.filter(c => c !== attacker);
  playerSupport.push(attacker);
} else if (!attacker.carrier) {
  // Return damage rules
  if (attacker.submarine) {
    // Submarines only take return damage from destroyers
    if (defender.destroyer) {
      attacker.currentDefense -= returnDamage;
    }
  } else {
    // Normal ships take full return damage
    attacker.currentDefense -= returnDamage;
  }
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
/* BEARN */

if (
attacker.name ===
"Béarn"
) {

const candidates =
NATIONS.france.cards.filter(ship =>

ship.faction ===
"freefrench"

&&

ship.deployCost <= 3
);

if (
candidates.length > 0
) {

const randomShip =
cloneCard(

candidates[
Math.floor(
Math.random() *
candidates.length
)
]
);

enemyHand.push(
randomShip
);
}
}

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

/* GEORGES LEYGUES */

if (
attacker.name ===
"Georges Leygues"
&&
defender.currentDefense <= 0
) {

if (
playerFrontline.includes(
attacker
)
||
playerSupport.includes(
attacker
)
) {

playerEnergy += 2;

} else {

enemyEnergy += 2;
}
}

cleanupDestroyed();

/* STRASBOURG */

if (
attacker.name ===
"Strasbourg"
&&
defender.currentDefense <= 0
) {

attacker.hasAttacked =
false;

attacker.hasActed =
false;
}

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

/* SURCOUF */

if (
ship.name ===
"Surcouf"
&&
ship.currentDefense <= 0
) {

zone.forEach(target => {

if (
target !== ship
) {

target.currentDefense -= 3;
}
});
}

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

//* HMAS NEPAL */
if (ship.name === "HMAS Nepal") {
  const copy = cloneCard(
    NATIONS.britain.cards.find(c => c.name === "HMAS Nepal")
  );
  if (playerSupport.includes(ship) || playerFrontline.includes(ship)) {
    if (playerHand.length < 6) playerHand.push(copy);
  } else {
    if (enemyHand.length < 6) enemyHand.push(copy);
  }
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
/* MOGADOR */

if (
ship.name ===
"Mogador"
) {

if (
playerSupport.includes(ship)
||
playerFrontline.includes(ship)
) {

enemyHand.push(
cloneCard(ship)
);

} else {

playerHand.push(
cloneCard(ship)
);
}
}

/* HMS PORCUPINE */
if (ship.name === "HMS Porcupine") {
  const pork = cloneCard({
    name: "HMS Pork",
    rarity: "common",
    nation: "Britain",
    damage: 1,
    defense: 1,
    deployCost: 1,
    attackCost: 0,
    ability: "Fragment"
  });
  const pine = cloneCard({
    name: "HMS Pine",
    rarity: "common",
    nation: "Britain",
    damage: 1,
    defense: 1,
    deployCost: 1,
    attackCost: 0,
    ability: "Fragment"
  });

  if (playerSupport.includes(ship) || playerFrontline.includes(ship)) {
    if (playerHand.length < 6) playerHand.push(pork);
    if (playerHand.length < 6) playerHand.push(pine);
  } else {
    if (enemyHand.length < 6) enemyHand.push(pork);
    if (enemyHand.length < 6) enemyHand.push(pine);
  }
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

function resetShips(zones) {
  zones.forEach(zone => {
    zone.forEach(ship => {
      ship._submergedHitThisTurn = false;

      ship.hasAttacked = false;
      ship.summoningSick = false;
      ship.hasActed = false;
      ship.usedFastBonus = false;
      ship.turnsDeployed++;
      ship.extraAttackUsed = false;

      if (ship.name === "HMS Hood") {
        ship.damage = 9;
      }
    });
  });
}

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

async function enemyTurn() {

   // First play any ability cards
for (let i = enemyHand.length - 1; i >= 0; i--) {
  const card = enemyHand[i];
  if (card.type === "ability" && enemyEnergy >= card.deployCost) {
    await useAbilityCard(card, "enemy");
    await wait(800);
  }
}

// Then normal ships
for (let i = enemyHand.length - 1; i >= 0; i--) {
  const card = enemyHand[i];
  if (card.type === "ability") continue;   // already handled

  if (enemyEnergy >= card.deployCost) {
    enemyEnergy -= card.deployCost;
    enemySupport.push(card);
    card.hasActed = true;
    enemyHand.splice(i, 1);

    if (card.name === "Surcouf") {
      giveTorpedoStrike("enemy");
    }

    renderBoard();
    await wait(700);
  }
}

  // --- DEPLOY ---
  for (let i = enemyHand.length - 1; i >= 0; i--) {
    const card = enemyHand[i];

    if (enemyEnergy >= card.deployCost) {
      enemyEnergy -= card.deployCost;
      enemySupport.push(card);
      if (card.name === "Surcouf") {
  giveTorpedoStrike("enemy");
}
      card.hasActed = true;
      enemyHand.splice(i, 1);

      renderBoard();
      await wait(700);           // pause so you can see the deploy
    }
  }

  // --- ADVANCE one ship ---
  for (let i = 0; i < enemySupport.length; i++) {
    const card = enemySupport[i];

    if (card.carrier) continue;
    if (enemyEnergy < card.attackCost) break;
    if (enemyFrontline.length >= 4) break;
    if (playerFrontline.length > 0 && enemyFrontline.length === 0) break;

    enemyEnergy -= card.attackCost;
    enemySupport.splice(i, 1);
    enemyFrontline.push(card);

    if (!card.fast) card.hasActed = true;

    renderBoard();
    await wait(800);
    break;
  }

  // --- ATTACKS (frontline) ---
  for (const card of [...enemyFrontline]) {
    if (card.hasAttacked || card.summoningSick) continue;
    if (enemyEnergy < card.attackCost) continue;

    enemyEnergy -= card.attackCost;

    let target = null;

    if (playerFrontline.length > 0) {
      target = playerFrontline[0];
    } else if (playerSupport.length > 0) {
      target = playerSupport[0];
    } else {
      // attack HQ
      playerFleetHP -= card.damage;
      if (playerFleetHP <= 0) {
        playerFleetHP = 0;
        cleanupDestroyed();
        renderBoard();
        gameOver(enemyNation.displayName);
        return;
      }
      card.hasAttacked = true;
      renderBoard();
      await wait(600);
      continue;
    }

    // visual pop
    await highlightAttack(card, target);

    target.currentDefense -= card.damage;
    if (!card.carrier) {
      card.currentDefense -= target.damage;
    }

    card.hasAttacked = true;
    if (card.fast && !card.usedFastBonus) {
      card.usedFastBonus = true;
    } else {
      card.hasActed = true;
    }

    cleanupDestroyed();
    renderBoard();
    await wait(700);
  }

  // --- SUPPORT ATTACKS ---
  for (const card of [...enemySupport]) {
    if (card.carrier) continue;
    if (card.hasAttacked || card.summoningSick || card.hasActed) continue;
    if (enemyEnergy < card.attackCost) continue;
    if (playerFrontline.length === 0) continue;

    enemyEnergy -= card.attackCost;
    const target = playerFrontline[0];

    await highlightAttack(card, target);

    target.currentDefense -= card.damage;
    if (!card.carrier) {
      card.currentDefense -= target.damage;
    }

    card.hasAttacked = true;
    renderBoard();
    await wait(700);
  }

  // --- CARRIERS ---
  for (const card of [...enemySupport]) {
    if (!card.carrier) continue;
    if (enemyEnergy < card.attackCost) continue;

    enemyEnergy -= card.attackCost;

    if (playerFrontline.length > 0) {
      playerFrontline[0].currentDefense -= card.damage;
    } else if (playerSupport.length > 0) {
      playerSupport[0].currentDefense -= card.damage;
    }

    card.hasAttacked = true;
    renderBoard();
    await wait(600);
  }

  cleanupDestroyed();
  drawCard(enemyDeck, enemyHand);
  renderBoard();
}

/* =========================
   END TURN
========================= */

endTurnBtn.onclick = async () => {
  if (currentTurn !== "player") return;

  currentTurn = "enemy";
  endTurnBtn.disabled = true;

  enemyEnergy = turn;
  resetShips([enemySupport, enemyFrontline]);

  await enemyTurn();          // waits for the whole AI turn to finish

  // Next player turn
  turn++;
  playerEnergy = turn;
  resetShips([playerSupport, playerFrontline]);
  drawCard(playerDeck, playerHand);

  currentTurn = "player";
  endTurnBtn.disabled = false;
  renderBoard();
};

function gameOver(winner) {

const overlay =
document.createElement("div");

overlay.id =
"game-over-overlay";

overlay.innerHTML = `

<div id="game-over-box">

<h1>GAME OVER</h1>

<h2>${winner} Wins!</h2>

<button id="restart-btn">
Restart
</button>

</div>

`;

document.body.appendChild(
overlay
);

document.getElementById("restart-btn").onclick = () => {
  location.reload();

};

currentTurn = "gameover";

endTurnBtn.disabled = true;

}

/*Screen*/
// ===== START SCREEN LOGIC =====
document.getElementById("start-btn").onclick = () => {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("nation-select").style.display = "block";
};

document.getElementById("select-britain").onclick = () => {
  document.getElementById("nation-select").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  startGame("britain", "france");
};

// France is disabled for now
document.getElementById("select-france").onclick = (e) => {
  e.preventDefault();
};