/* =========================
   NATION REGISTRY
   =========================
   Add new nations here.
   Each nation is self-contained.
========================= */

window.NATIONS = {

  britain: {
    id: "britain",
    displayName: "Great Britain",
    shortName: "Britain",
    hqName: "Scapa Flow",
    deckBackClass: "british-back",

    cards: [
      {
        name: "HMS Glowworm",
        rarity: "common",
        nation: "Britain",
        damage: 1,
        defense: 1,
        deployCost: 1,
        attackCost: 1,
        ability: "Ramming Speed"
      },
      {
        name: "HMS Cossack",
        rarity: "common",
        nation: "Britain",
        damage: 2,
        defense: 2,
        deployCost: 2,
        attackCost: 1,
        ability: "Boarder"
      },
      {
        name: "HMS Dido",
        rarity: "common",
        nation: "Britain",
        damage: 1,
        defense: 5,
        deployCost: 3,
        attackCost: 2,
        ability: "Convoy Guardian",
        guard: true
      },
      {
        name: "HMS Sirius",
        rarity: "common",
        nation: "Britain",
        damage: 1,
        defense: 5,
        deployCost: 3,
        attackCost: 2,
        ability: "Prolonged Service",
        guard: true
      },
      {
        name: "HMS Javelin",
        rarity: "rare",
        nation: "Britain",
        damage: 3,
        defense: 3,
        deployCost: 5,
        attackCost: 2,
        ability: "Torpedo Survivor",
        fast: true
      },
      {
        name: "HMS Exeter",
        rarity: "epic",
        nation: "Britain",
        damage: 5,
        defense: 7,
        deployCost: 10,
        attackCost: 5,
        ability: "Last Stand"
      },
      {
        name: "HMS Grafton",
        rarity: "common",
        nation: "Britain",
        damage: 2,
        defense: 1,
        deployCost: 2,
        attackCost: 1,
        destroyer: true,
        ability: "The Sacrifice"
      },
      {
        name: "HMS Mohawk",
        rarity: "rare",
        nation: "Britain",
        damage: 2,
        defense: 2,
        deployCost: 3,
        attackCost: 2,
        destroyer: true,
        ability: "Spanish Blockade"
      },
      {
        name: "HMS Liverpool",
        rarity: "rare",
        nation: "Britain",
        damage: 4,
        defense: 4,
        deployCost: 5,
        attackCost: 3,
        ability: "Instigator"
      },
      {
        name: "HMS Abdiel",
        rarity: "epic",
        nation: "Britain",
        damage: 4,
        defense: 4,
        deployCost: 6,
        attackCost: 4,
        ability: "Minelayer"
      },
      {
        name: "HMS Hood",
        rarity: "epic",
        nation: "Britain",
        damage: 9,
        defense: 9,
        deployCost: 12,
        attackCost: 12,
        ability: "With Favorable Wind"
      },
      {
        name: "HMS Warspite",
        rarity: "legendary",
        nation: "Britain",
        damage: 9,
        defense: 12,
        deployCost: 15,
        attackCost: 10,
        ability: "Grand Old Lady"
      },
      {
        name: "HMS Illustrious",
        rarity: "legendary",
        nation: "Britain",
        damage: 7,
        defense: 8,
        deployCost: 13,
        attackCost: 10,
        ability: "Taranto Raid",
        carrier: true
      },
      {
        name: "HMS Vanguard",
        rarity: "legendary",
        nation: "Britain",
        damage: 10,
        defense: 11,
        deployCost: 16,
        attackCost: 9,
        ability: "The Sun Never Sets"
      },
      {
  name: "Chariot",
  rarity: "epic",
  nation: "Britain",
  type: "ability",          // important – marks it as a spell
  damage: 0,
  defense: 0,
  deployCost: 10,
  attackCost: 0,
  ability: "Deal 10 damage to the enemy port and 2 damage to all ships in the enemy support line."
},
{
  name: "HMAS Nepal",
  rarity: "rare",
  nation: "Australia",
  damage: 2,
  defense: 2,
  deployCost: 2,
  attackCost: 2,
  ability: "Damage Control"
},
{
  name: "HMS Porcupine",
  rarity: "epic",
  nation: "Britain",
  damage: 2,
  defense: 2,
  deployCost: 2,
  attackCost: 2,
  ability: "Oran Dockyard"
},
      {
        name: "HMS Arethusa",
        rarity: "rare",
        nation: "Britain",
        damage: 2,
        defense: 4,
        deployCost: 3,
        attackCost: 3,
        ability: "Maltan Maiden",
        description: "When Arethusa reaches the frontline, all allied ships gain +1 attack and +1 defense."
      },
      {
  name: "HMS Prince of Wales",
  rarity: "legendary",
  nation: "Britain",
  damage: 12,
  defense: 10,
  deployCost: 14,
  attackCost: 10,
  ability: "Critical Hit!"
},
{
  name: "HMS Edinburgh",
  rarity: "rare",
  nation: "Britain",
  damage: 2,
  defense: 1,
  deployCost: 3,
  attackCost: 2,
  ability: "A Royal Treasurer"
},
{
  name: "HMS Venturer",
  rarity: "rare",
  nation: "Britain",
  damage: 3,
  defense: 3,
  deployCost: 3,
  attackCost: 1,
  ability: "Direct Hit",
  submarine: true,
  submerged: true
},
{
  name: "HMS Upholder",
  rarity: "rare",
  nation: "Britain",
  damage: 3,
  defense: 3,
  deployCost: 3,
  attackCost: 1,
  ability: "Silent Hunter",
  submarine: true,
  submerged: true
}
    ],
  },

  france: {
    id: "france",
    displayName: "France",
    shortName: "France",
    hqName: "Toulon",
    deckBackClass: "french-back",

    cards: [
      {
        name: "Le Fantasque",
        rarity: "common",
        nation: "France",
        faction: "freefrench",
        damage: 6,
        defense: 5,
        deployCost: 6,
        attackCost: 5,
        ability: "Lightning Dash"
      },
      {
        name: "Gloire",
        rarity: "common",
        nation: "France",
        faction: "freefrench",
        damage: 5,
        defense: 6,
        deployCost: 5,
        attackCost: 4,
        ability: "Allied Support"
      },
      {
        name: "Béarn",
        rarity: "common",
        nation: "France",
        faction: "freefrench",
        damage: 1,
        defense: 4,
        deployCost: 4,
        attackCost: 2,
        carrier: true,
        ability: "Flying School"
      },
      {
        name: "Le Hardi",
        rarity: "common",
        nation: "France",
        faction: "vichy",
        damage: 2,
        defense: 2,
        deployCost: 2,
        attackCost: 1,
        destroyer: true,
        ability: "Escort"
      },
      {
        name: "Georges Leygues",
        rarity: "rare",
        nation: "France",
        faction: "freefrench",
        damage: 5,
        defense: 5,
        deployCost: 6,
        attackCost: 4,
        ability: "Atlantic Pursuit"
      },
      {
        name: "Surcouf",
        rarity: "legendary",
        nation: "France",
        faction: "freefrench",
        damage: 8,
        defense: 8,
        deployCost: 10,
        attackCost: 8,
        ability: "Submarine Cruiser",
        submarine: true,
        submerged: true
      },
      {
  name: "Torpedo Strike",
  rarity: "rare",
  nation: "France",
  type: "ability",
  damage: 0,
  defense: 0,
  deployCost: 5,
  attackCost: 0,
  ability: "Destroy one enemy unit. (AI prioritises the most expensive ship)"
},
      {
        name: "Dunkerque",
        rarity: "rare",
        nation: "France",
        faction: "vichy",
        damage: 10,
        defense: 8,
        deployCost: 11,
        attackCost: 9,
        ability: "Evacuation Fire"
      },
      {
        name: "Mogador",
        rarity: "epic",
        nation: "France",
        faction: "vichy",
        damage: 8,
        defense: 7,
        deployCost: 9,
        attackCost: 8,
        ability: "Second Wind"
      },
      {
        name: "Le Richelieu",
        rarity: "legendary",
        nation: "France",
        faction: "freefrench",
        damage: 12,
        defense: 10,
        deployCost: 13,
        attackCost: 10,
        ability: "Monicer of the Free"
      },
      {
        name: "Jean Bart",
        rarity: "legendary",
        nation: "France",
        faction: "vichy",
        damage: 12,
        defense: 9,
        deployCost: 13,
        attackCost: 10,
        ability: "Daring Escape"
      },
      {
        name: "Le Vautour",
        rarity: "rare",
        nation: "France",
        faction: "vichy",
        damage: 3,
        defense: 3,
        deployCost: 4,
        attackCost: 3,
        ability: "Raider Instinct"
      },
      {
        name: "Algérie",
        rarity: "rare",
        nation: "France",
        faction: "freefrench",
        damage: 5,
        defense: 3,
        deployCost: 6,
        attackCost: 4,
        ability: "Colonial Firepower"
      },
      {
        name: "Strasbourg",
        rarity: "epic",
        nation: "France",
        faction: "vichy",
        damage: 9,
        defense: 7,
        deployCost: 10,
        attackCost: 8,
        ability: "Breakout"
      },
      {
        name: "Le Triomphant",
        rarity: "common",
        nation: "France",
        faction: "freefrench",
        damage: 1,
        defense: 1,
        deployCost: 1,
        attackCost: 1,
        destroyer: true,
        ability: "Rally to the Cause"
      },
      {
  name: "Lorraine",
  rarity: "epic",
  nation: "France",
  faction: "freefrench",
  damage: 9,
  defense: 9,
  deployCost: 11,
  attackCost: 8,
  ability: "Dragoon Spirit",
  battleship: true
},
{
  name: "Casabianca",
  rarity: "rare",
  nation: "France",
  faction: "freefrench",
  damage: 5,
  defense: 2,
  deployCost: 5,
  attackCost: 3,
  ability: "Corsican Liberator",
  submarine: true,
  submerged: true
},
{
  name: "Le Terrible",
  rarity: "common",
  nation: "France",
  faction: "freefrench",
  damage: 2,
  defense: 1,
  deployCost: 2,
  attackCost: 1,
  ability: "Worlds Fastest",
  fast: true
},
{
  name: "La Combattante",
  rarity: "common",
  nation: "France",
  faction: "freefrench",
  damage: 1,
  defense: 1,
  deployCost: 1,
  attackCost: 1,
  ability: "For the Nation"
},
{
  name: "Battle For Koh Chang",
  rarity: "epic",
  nation: "France",
  type: "ability",
  damage: 0,
  defense: 0,
  deployCost: 10,
  attackCost: 0,
  ability: "Deal 5 damage to all enemy ships."
},
      {
        name: "Le Malin",
        rarity: "common",
        nation: "France",
        faction: "vichy",
        damage: 1,
        defense: 2,
        deployCost: 1,
        attackCost: 1,
        ability: "Scout Dash",
        fast: true
      }
    ]
  }
};