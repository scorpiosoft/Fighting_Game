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
  started:         false,
  have_enemy:      false,
  // DOM elements to update, jQuery handles
  d_body:          $("body"),
  d_pool:          $("#pool"),
  d_combat_header: $("#combat_header"),
  d_combat_zone:   $("#combat_zone"),
  d_combat_log:    $("#combat_log"),
  // array of background images
  backgrounds:
  [
    "Fantasy-Landscape-Light-Mystical-Fairytale-2243769.jpg",
    "castle-2596885_960_720.jpg",
    "ireland-1971997_960_720.jpg",
    "unicorn-2674743_960_720.jpg",
  ],
  // current values in the game
  cur_back:     "",
  cur_hero:     null,
  cur_enemy:    null,
  // declare the combatants
  combatants:
  { // combatant keynames are capitalized to make selection easier
    Barbarian:  new Combatant ( "Barbarian", 200, 10, 25, "assets/images/1ABC-barbarian.png" ),
    Druid:      new Combatant ( "Druid", 100, 12, 6, "assets/images/1ABC-druid.png" ),
    Fighter:    new Combatant ( "Fighter", 150, 8, 15, "assets/images/man-1923546_960_720.png" ),
    Survivor:   new Combatant ( "Survivor", 250, 6, 6 , "assets/images/1ABC-survivor.png") ,
  },
  // method to start a new game
  start_game: function ()
  {
    this.started = true;
    this.have_enemy = false;
    this.cur_hero = null;
    this.cur_enemy = null;
    this.change_backround();
    this.reset_combatants();
  },
  // method to end the current game
  end_game: function ()
  {
    var msg;
    this.started = false;
    msg = $('<p>Pick a character to play again.</p>');
    this.d_combat_log.prepend(msg);
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
      reset_x(obj[key].d_img);
      this.d_pool.append(obj[key].d_card);
    }
  },
  attack: function ()
  {
    var msg;
    var shift = vw(70);
    // double sanity protection (I know I checked in the on-click already)
    if (this.started && this.have_enemy)
    {
      console.log(this.cur_hero, this.cur_enemy);
      msg = $('<p class="log">'+this.cur_hero.name+' hits '+this.cur_enemy.name+' for '+this.cur_hero.cur_attack+'</p>');
      this.d_combat_log.prepend(msg);
      // make adjustments to the object
      this.cur_enemy.cur_hitpoints -= this.cur_hero.cur_attack;
      this.cur_hero.cur_attack += this.cur_hero.attack;
      // make adjustments to the display
      this.cur_enemy.d_hitpoints.text(this.cur_enemy.cur_hitpoints);
      this.cur_enemy.d_progress.val(this.cur_enemy.cur_hitpoints);


      // NOTE:  JS/jQ do not have great facilities for scheduling animations.
      //        I've tried to pick delay times for the animations that seem
      //        OK, but the fact that JS tries really hard to make everything
      //        asynchronous makes a smooth looking animated game really hard
      //        and I don't feel it's worth it to sink a lot of time into
      //        researching animation timings and forced delay to the rest of
      //        the JS code.

      // animate the hero
      this.cur_hero.d_card.animate({ left: "+="+shift }, "fast");
      this.cur_hero.d_card.delay(200).animate({ left: "-="+shift });

      // check if the enemy is KO'd and hide it or attack with it
      if (this.cur_enemy.cur_hitpoints > 0)
      {
        msg = $('<p class="log">'+this.cur_enemy.name+' hits '+this.cur_hero.name+' for '+this.cur_enemy.counter+'</p>');
        this.d_combat_log.prepend(msg);
        // make adjustments to the object
        this.cur_hero.cur_hitpoints -= this.cur_enemy.counter;
        // make adjustments to the display
        this.cur_hero.d_hitpoints.text(this.cur_hero.cur_hitpoints);
        this.cur_hero.d_progress.val(this.cur_hero.cur_hitpoints);
        // animate the enemy
        this.cur_enemy.d_card.delay(800).animate({ left: "-="+shift }, "fast");
        this.cur_enemy.d_card.delay(400).animate({ left: "+="+shift });
      } else {
        this.cur_enemy.d_card.hide();
        this.have_enemy = false;
      }
      console.log(this.cur_hero, this.cur_enemy);
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
      var card_id = cur_name;
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
  // method to create the [Duel] button
  //
  // <button type="button" onclick="alert('Hello world!')">Click Me!</button>
  create_button: function ()
  {
    var button = $('<button id="button" class="btn btn-outline-danger btn-lg rounded-circle mt-2 float-left" type="button">Attack</buton>');
    this.d_combat_header.append(button);
  },
};

//
// Main Code
//

// create the combatant cards
FantasyBrawl.create_combatants();
// create the [Duel] button
FantasyBrawl.create_button();

//
// Event Functions
//

// Click event for a Combatant Card
$(".combatant").on("click", function()
{
  console.log("Combatant selected:", this);
  // selecting a hero starts the game, if the game is not started, make the selection the hero
  if (FantasyBrawl.started === false)
  {
    console.log("setting " + this.id + " as the hero");
    FantasyBrawl.start_game();
    FantasyBrawl.cur_hero = FantasyBrawl.combatants[this.id];
    // move the hero to the Cpmbat Zone
    FantasyBrawl.d_combat_zone.append(this);
    // set the other combatants as enemies and move them right
    for ( key in FantasyBrawl.combatants )
    {
      if (FantasyBrawl.combatants[key].name !== this.id)
      {
        FantasyBrawl.combatants[key].d_card.removeClass("hero_back float-left");
        FantasyBrawl.combatants[key].d_card.addClass("enemy_back float-right");
      } else {
        flip_x(FantasyBrawl.combatants[key].d_img);
      }
    }
  } else
  if (FantasyBrawl.have_enemy === false)
  {
    console.log("setting " + this.id + " as the enemy");
    // FantasyBrawl.d_combat_zone.append(FantasyBrawl.combatants.survivor.d_card); // this code works
    FantasyBrawl.d_combat_zone.append(this);
    FantasyBrawl.have_enemy = true;
    FantasyBrawl.cur_enemy = FantasyBrawl.combatants[this.id];
  }
  // else throw the click away
});

// Click event for the [Duel] Button
$("#button").on("click", function()
{
  if (FantasyBrawl.started && FantasyBrawl.have_enemy)
    FantasyBrawl.attack();
  // else throw away the clicks
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

// utility function to returning the number of pixels that are the passed in percentage of the viewport height
function vh(v)
{
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (v * h) / 100;
}

// utility function to returning the number of pixels that are the passed in percentage of the viewport width
function vw(v)
{
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  return (v * w) / 100;
}

// NOTE: This forced sleep does not work right with the jQ animations
// // utility function to sleep
// function sleep(milliseconds)
// {
//   var start = new Date().getTime();
//   for (var i = 0; i < 1e7; i++)
//   {
//     if ((new Date().getTime() - start) > milliseconds){
//       break;
//     }
//   }
// }

// NOTE: setTimeout and setInterval are both asynchronous, so do not work as a sleep
// // utility function to delay a little
// function short_delay(callback)
// {
//   setTimeout(callback, 100); // 100 ms == 1/10 second
// }

// // utility function to delay longer
// function long_delay(callback)
// {
//   setTimeout(callback, 400); // 400 ms == 2/5 second
// }

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
