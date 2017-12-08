// Combatant Object Constructor
function Combatant(hp, cur_hp, atk, ctr)
{
  this.hitpoints = hp;
  this.cur_hitpoints = cur_hp;
  this.attack = atk;
  this.counter = ctr;
};

var barbarian = new Combatant ( 200, 200, 10, 25 );
var druid = new Combatant ( 100, 100, 12, 4 );
var fighter = new Combatant ( 150, 150, 8, 15 );
var survivor = new Combatant ( 250, 250, 6, 6 );
