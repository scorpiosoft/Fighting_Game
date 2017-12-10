// Combatant Object Constructor
function Combatant(name, hp, atk, ctr)
{
  this.name = name;
  this.hitpoints = hp;
  this.cur_hitpoints = hp;
  this.attack = atk;
  this.cur_attack = atk;
  this.counter = ctr;
};

// The Fantasy Brawl Game object
var FantasyBrawl =
{
  // Is the game started? true/false
  started:     false,
  // DOM elements to update, jQuery handles
  d_body: $("body"),
  // array of background images
  backgrounds:
  [
    "Fantasy-Landscape-Light-Mystical-Fairytale-2243769.jpg",
    "castle-2596885_960_720.jpg",
    "ireland-1971997_960_720.jpg",
    "unicorn-2674743_960_720.jpg",
  ],
  // current values in the game
  cur_back:    "",
  // declare the combatants
  combatants:
  {
    barbarian:  new Combatant ( "Barbarian", 200, 10, 25 ),
    druid:      new Combatant ( "Druid", 100, 12, 6 ),
    fighter:    new Combatant ( "Fighter", 150, 8, 15 ),
    survivor:   new Combatant ( "Survivor", 250, 6, 6 ),
  },
  // method to start a new game
  start_game: function ()
  {
    this.started = true;
    this.change_back();
    this.reset_combatants();
  },
  // method to end the current game
  end_game: function ()
  {
    this.started = false;
    this.d_message.text("Pick a character to start.");
  },
  // method for changing the background
  change_back: function ()
  {
    this.cur_back = "assets/images/" + this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
    this.d_body.css('background-image','url(' + this.cur_back + ')');
  },
  // method to reset the combatants
  reset_combatants: function ()
  {
    // obj is a convenience variable
    var obj = this.combatants;
    for (key in obj)
    {
      obj[key].cur_hitpoints = obj[key].hitpoints;
      obj[key].cur_attack = obj[key].attack;
    }
  },
  // 
};

// The Plan:
// * make a card for combatant display
// * * Name
// * * png
// * * hitpoints
// * * reverse progress bar of hitpoints
// * * background alpha channel for hero/enemy
// * animate the png when it attacks, forward, and back; jrpg style
// * the Attack button does the whole combat with current enemy
// * give a running combat log

// Model for a Character Card:
// <div class="card m-1 hero_back" style="width: 18%">
//   <div class="card-block">
//     <h4 class="card-title text-center">Barbarian</h4>
//   </div>
//   <img class="card-img" src="assets/images/1ABC-barbarian.png" alt="Barbarian">
//   <div class="card-block">
//     <p class="card-text text-center">200</p>
//   </div>
//   <progress value="70" max="200"></progress>
// </div>


setInterval(FantasyBrawl.change_back(), 5000);

// utility function to delay a little
function delay()
{
  setTimeout(null, 400); // 400 ms == 2/5 second
}

// utility function to simulate the game for the purposes of picking combatant statistics
function simulator(hero, e1, e2, e3)
{
  console.log(hero, e1);
  while (e1.cur_hitpoints > 0 && hero.cur_hitpoints > 0)
  {
    e1.cur_hitpoints -= hero.cur_attack;
    hero.cur_attack += hero.attack;
    hero.cur_hitpoints -= e1.counter;
    console.log(hero, e1);
  }
  console.log(hero, e2);
  while (e2.cur_hitpoints > 0 && hero.cur_hitpoints > 0)
  {
    e2.cur_hitpoints -= hero.cur_attack;
    hero.cur_attack += hero.attack;
    hero.cur_hitpoints -= e2.counter;
    console.log(hero, e2);
  }
  console.log(hero, e3);
  while (e3.cur_hitpoints > 0 && hero.cur_hitpoints > 0)
  {
    e3.cur_hitpoints -= hero.cur_attack;
    hero.cur_attack += hero.attack;
    hero.cur_hitpoints -= e3.counter;
    console.log(hero, e3);
  }
}
