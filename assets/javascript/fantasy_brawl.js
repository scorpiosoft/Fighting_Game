// Combatant Object Constructor
function Combatant(name, hp, atk, ctr, img)
{
  this.name = name;
  this.hitpoints = hp;
  this.cur_hitpoints = hp;
  this.attack = atk;
  this.cur_attack = atk;
  this.counter = ctr;
  this.img = img;
  this.d_card = "";
  this.d_img = "";
  this.d_hitpoints = "";
  this.d_progress = "";
};

// The Fantasy Brawl Game Object
var FantasyBrawl =
{
  // Is the game started? true/false
  started:      false,
  // DOM elements to update, jQuery handles
  d_body:       $("body"),
  d_pool:       $("#pool"),
  d_combat_log: $("#combat_log"),
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
    barbarian:  new Combatant ( "Barbarian", 200, 10, 25, "assets/images/1ABC-barbarian.png" ),
    druid:      new Combatant ( "Druid", 100, 12, 6, "assets/images/1ABC-druid.png" ),
    fighter:    new Combatant ( "Fighter", 150, 8, 15, "assets/images/man-1923546_960_720.png" ),
    survivor:   new Combatant ( "Survivor", 250, 6, 6 , "assets/images/1ABC-survivor.png") ,
  },
  // method to start a new game
  start_game: function ()
  {
    this.started = true;
    this.change_backround();
    this.reset_combatants();
  },
  // method to end the current game
  end_game: function ()
  {
    this.started = false;
    this.d_message.text("Pick a character to start.");
  },
  // method for changing the background
  change_backround: function ()
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
  // method to create the combatant cards
  //
  // Model for a Combatant Card:
  // <div id="Barbarian_card" class="card m-1 hero_back float-left" style="width: 14%">
  //   <div class="card-block">
  //     <h5 class="card-title text-center">Barbarian</h5>
  //   </div>
  //   <img id="Barbarian_img" class="card-img" src="assets/images/1ABC-barbarian.png" alt="Barbarian">
  //   <div class="card-block">
  //     <p class="card-text text-center">200</p>
  //   </div>
  //   <progress id="Barbarian_prog" value="70" max="200"></progress>
  // </div>
  create_combatants: function ()
  {
    // obj is a convenience variable
    var obj = this.combatants;
    for (key in obj)
    {
      var cur_name = obj[key].name;
      var cur_hp = obj[key].hitpoints;
      var card_id = cur_name + '_card';
      var img_id = cur_name + '_img';
      var hp_id = cur_name + '_hp';
      var prog_id = cur_name + '_prog';
      var card = $('<div id="'+card_id+'" class="card m-1 combatant hero_back float-left" style="width: 14%">'
        +'<div class="card-block">'
          +'<h5 class="card-title text-center">'+cur_name+'</h5>'
        +'</div>'
        +'<img id="'+img_id+'" class="card-img" src="'+obj[key].img+'" alt="'+cur_name+'">'
        +'<div class="card-block">'
          +'<p id="'+hp_id+'" class="card-text text-center">'+cur_hp+'</p>'
        +'</div>'
        +'<progress id="'+prog_id+'" value="'+cur_hp+'" max="'+cur_hp+'"></progress>'
      +'</div>');
      this.d_pool.append(card);
      obj[key].d_card = $("#"+card_id);
      obj[key].d_img = $("#"+img_id);
      obj[key].d_hitpoints = $("#"+hp_id);
      obj[key].d_progress = $("#"+prog_id);
    }
  },
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

//
// Main Code
//

// create the combatant cards
FantasyBrawl.create_combatants();
// Click event for a Combatant Card
$(".combatant").on("click", function()
{
  console.log("Combatant selected:", this);
});

//
// Utility Functions
//

// utility function to flip an image horizontally
// takes a jQuery DOM handle as a parameter
function flip_x(img)
{
  img.css('-moz-transform','scaleX(-1)');
  img.css('-o-transform','scaleX(-1)');
  img.css('-webkit-transform','scaleX(-1)');
  img.css('transform','scaleX(-1)');
  img.css('filter','FlipH');
  img.css('-ms-filter','"FlipH"');
}

// utility function to reset an image horizontally
// takes a jQuery DOM handle as a parameter
function reset_x(img)
{
  img.css('-moz-transform','none');
  img.css('-o-transform','none');
  img.css('-webkit-transform','none');
  img.css('transform','none');
  img.css('filter','none');
  img.css('-ms-filter','none');
}

// utility function to delay a little
function short_delay()
{
  setTimeout(null, 100); // 100 ms == 1/10 second
}

// utility function to delay longer
function long_delay()
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
