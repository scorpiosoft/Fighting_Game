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
  // declare the 4 combatants
  barbarian:  new Combatant ( 200, 200, 10, 25 ),
  druid:      new Combatant ( 100, 100, 12, 4 ),
  fighter:    new Combatant ( 150, 150, 8, 15 ),
  survivor:   new Combatant ( 250, 250, 6, 6 ),
  // method for changing the background
  change_back: function ()
  {
    this.cur_back = "assets/images/" + this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
    this.d_body.css('background-image','url(' + this.cur_back + ')');
  },
  // method to start a new game
  start_game: function ()
  {
    this.started = true;
    this.change_back();
  },
  // method to end the current game
  end_game: function ()
  {
    this.started = false;
    this.d_message.text("Pick a character to start.");
  },
};

setInterval(FantasyBrawl.change_back(), 5000);
