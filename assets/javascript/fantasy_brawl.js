// array of background images
var backgrounds = [
  "Fantasy-Landscape-Light-Mystical-Fairytale-2243769.jpg",
  "castle-2596885_960_720.jpg",
  "ireland-1971997_960_720.jpg",
  "unicorn-2674743_960_720.jpg",
];

// Combatant Object Constructor
function Combatant(hp, cur_hp, atk, ctr)
{
  this.hitpoints = hp;
  this.cur_hitpoints = cur_hp;
  this.attack = atk;
  this.counter = ctr;
};

// The Fantasy Brawl Game object
var FantasyBrawl =
{
  // declare the 4 combatants
  barbarian: new Combatant ( 200, 200, 10, 25 ),
  druid: new Combatant ( 100, 100, 12, 4 ),
  fighter: new Combatant ( 150, 150, 8, 15 ),
  survivor: new Combatant ( 250, 250, 6, 6 ),
};

