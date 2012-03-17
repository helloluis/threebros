var Game = {
  
  debug                : false,  // set to TRUE to visualize barriers and intersections
  debug_cont           : false,
  debug_visually       : false,  // set to TRUE to actually write debug messages to an in-game DIV
  debug_log            : false,  // set to TRUE to write logs to the console
  show_fps             : false,

  loader               : false,
  
  enable_preloading    : true,

  is_iOS               : PLATFORM=='ios', 
  is_pokki             : PLATFORM=='pokki',
  is_web               : PLATFORM=='web',

  is_licensed          : true,

  score                : 0,
  high_score           : 0,
  increment_on_frame   : 1,

  fps                  : 24,    // if you change this, you have to change the ticks in all of the Brother animations

  ticks                : 0,     // global tick counter, don't really know what for yet

  seconds              : 0,     // global timer, in seconds, so only increments once every 1000 millisec

  width                : 0,
  height               : 0,
  speed                : 0,
  item_odds            : 0,

  started              : false,
  paused               : false,
  ended                : false,
  muted                : false,

  images_dir           : "",
  sounds_dir           : "",

  is_touch_device      : (navigator.platform.indexOf("iPad") != -1), // is this a desktop browser or an iPad?

  with_sound           : false,
  with_phonegap_sound  : false,
  with_soundjs         : false,

  maps                 : [],

  db_name              : 'threebros',
  high_score_key       : 'high_score',

  preload              : function() {
    
    // TODO


  },

  initialize           : function(auto_start, maps) {

    Game.maps = maps;

    Game.initialize_animation_frame();

    Game.initialize_menus();

    Game.initialize_containers();

    Game.initialize_behaviours();

    Game.initialize_high_score();

    Game.initialize_buttons();

    Game.initialize_sounds();

    Game.initialize_controls();

    Game.initialize_canvas();

    if (auto_start===true) {
      Game.start_countdown();
    }
  },

  initialize_animation_frame : function(){
    
    Game.log("initializing requestAnimFrame");

    window.requestAnimFrame = (function(callback){
      // return window.requestAnimationFrame ||
      // window.webkitRequestAnimationFrame ||
      // window.mozRequestAnimationFrame ||
      // window.oRequestAnimationFrame ||
      // window.msRequestAnimationFrame ||
      return function(callback){
        window.setTimeout(callback, 1000 / Game.fps); 
      };
    })();

  },

  initialize_menus     : function() {
    // TODO
  },

  initialize_controls   : function() {
    // TODO
  },

  initialize_containers : function() {

    Game.intro           = $("#intro");
    Game.leaderboards    = $("#leaderboards");
    Game.main            = $("#game");
    Game.credits         = $("#credits");
    Game.messages        = $("#messages");
    Game.score_cont      = $("#score");
    Game.high_score_cont = $(".high_score");
    Game.overlay         = $("#overlay").hide();

  },

  initialize_behaviours : function() {
    
    Game.log("initializing behaviours");

    Game.intro.show();
    Game.main.hide();
    Game.credits.hide();
    
    Game.score = 0;
    Game.score_cont.text('0');

    $(".restart").hide();
    $(".pause, .quit, .mute").addClass('disabled');

  },

  initialize_high_score : function(){

    Game.log("initializing high score", $.jStorage.storageAvailable(), Game.high_score);

    if ($.jStorage.storageAvailable()) {
      Game.high_score = $.jStorage.get([Game.db_name, Game.high_score_key].join("_"), 0);
      Game.high_score_cont.text( Game.high_score );
    }

  },

  initialize_sounds : function() {

    Game.log("initializing sounds", Game.with_sound, Game.with_phonegap_sound, Game.with_soundjs);

    if (Game.with_sound) {
      if (Game.with_phonegap_sound) {
        
        _.each(Game.raw_sounds, function(media, key){
          if (key==='theme') {
            Game.sounds[key] = new Media(Game.sounds_dir + media[0] + Game.sound_format);
          } else {
            Game.sounds[key] = Game.sounds_dir + media[0] + Game.sound_format;   
          }         
        });

      }
    }  

  },

  initialize_buttons : function(){
    
    Game.log("initializing buttons");

    $(".start_game").click(function(){
      Game.start();
    });

    $(".restart").click(function(){
      Game.restart();
    });
    
    $(".pause").click(function(){
      if (!$(this).hasClass('disabled') && Game.started && !Game.paused && !Game.ended) {
        Game.pause();  
      }
    });

    $(".resume").click(function(){
      if (!$(this).hasClass('disabled') && Game.started && Game.paused && !Game.ended) {
        Game.resume();  
      }
    });

    $(".mute").click(function(){
      if (Game.muted) {
        Game.unmute();
      } else {
        Game.mute();
      }
    });

     $(".quit").click(function(){
      if (!$(this).hasClass('disabled')) {
        Game.quit();  
      }
    });

    $(".bttn.credits").click(function(){
      if (!$(this).hasClass('disabled')) {
        Game.show_credits();
      }
    });

    $(".bttn.leaderboards").click(function(){
      if (!$(this).hasClass('disabled')) {
        Game.show_leaderboards();  
      }
    });

    $(".bttn.intro").click(function(){
      if (!$(this).hasClass('disabled')) {
        Game.show_intro();  
      }
    });

  },

  initialize_canvas    : function() {

    Game.canvas = document.getElementById('foreground');
    Game.context = Game.canvas.getContext('2d');

  },

  initialize_brothers  : function() {

    Game.brothers      = {};
    
    Game.brothers.slim = new Brother(Game.map.brothers.slim, Game.canvas);
    Game.brothers.fat  = new Brother(Game.map.brothers.fat,  Game.canvas);
    Game.brothers.tall = new Brother(Game.map.brothers.tall, Game.canvas);

    Game.brothers.slim.initialize();
    Game.brothers.fat.initialize();
    Game.brothers.tall.initialize();

  },

  initialize_scapes    : function() {

    Game.background = new Background( Game.map.background_speed, Game.map.background_assets );
    Game.landscape  = new Landscape(  Game.map.landscape_speed,  Game.map.landscape_assets  );
    Game.skyscape   = new Skyscape(   Game.map.skyscape_speed,   Game.map.skyscape_assets   );

    Game.background.initialize();
    Game.landscape.initialize();
    Game.skyscape.initialize();

  },

  animate              : function() {
    if (Game.started && !Game.paused && !Game.ended) {
      
      Game.ticks+=1;

      Game.brothers.slim.animate();
      Game.brothers.fat.animate();
      Game.brothers.tall.animate();

      //new frame
      requestAnimFrame(function(){
        Game.animate();  
      });

    }
  },

  start                : function() {
    
    // load map hash
    Game.map        = Game.maps[0];
    Game.speed      = Game.map.speed;
    Game.item_odds  = Game.map.item_odds;
    
    Game.started    = true;
    Game.paused     = false;
    Game.ended      = false;

    Game.initialize_brothers();
    Game.initialize_scapes();

    Game.animate();

  },

  start_countdown      : function() {

    Game.main.show();
    Game.intro.hide();
    Game.leaderboards.hide();
    // we countdown before we actually run start(),
    // but we load the game settings during this phase
    Game.start();

  },

  pause : function(){
    
    if (Game.started===true) {
      Game.paused = true;
      $("#overlay").show();
      Game.stop_sound_theme();
    }
    
  },

  resume : function() {
    if (Game.started===true && Game.paused===true) {
      Game.paused = false;
    
      $("#overlay").hide();
      
      Game.animate();

      Game.play_sound_theme();
    }
  },

  quit : function() {
    
    Game.stop_sound_theme();
    
    document.location.reload();

  },

  restart : function() {
    
    Game.stop_sound_theme();
    
    $(".restart, #messages").hide();
    
    Game.start(true);

  },

  reset : function(return_to_intro){
    
    Game.stop_sound_theme();

    Game.stop_streets();

    Game.clear_intersections();
    
    Game.frus_cont.stopTime('frustrating');

    $(".restart").show();

  },

  mute : function(){
    
    $(".bttn.mute").addClass('muted').text('Un-mute');
    
    Game.with_sound = false;
    Game.muted = true;
    
    Game.stop_all_sounds();

  },

  unmute : function(){
    
    $(".bttn.mute").removeClass('muted').text('Mute');
    
    Game.with_sound = true;
    Game.muted = false;

    if (Game.with_soundjs) {
      SoundJS.setMute(false);  
    } 
    
    if (Game.started) {
      Game.play_sound_theme();  
    }
  },

  play_sound_theme : function(){
    // Game.log('playing sound theme');
    Game.play_sound('theme', true);  
  },

  stop_sound_theme : function(){
    // Game.log('stopping sound theme');
    Game.stop_sound('theme');  
  },

  play_sound : function(sound, loop, volume, interrupt_all) {
    
    // console.log('playing sound', sound, loop);

    if (_.isUndefined(Game.sounds[sound])) { return false; }

    if (volume===undefined) { volume = 100; }
    
    if (Game.with_sound) {
      if (Game.with_phonegap_sound) {
        if (loop===true && sound=='theme') {
          Game.loop_sound_theme();
        } else {
          PhoneGap.exec("SoundPlug.play", Game.sounds[sound]);
        }

      } else if (Game.with_soundjs) {

        if (loop===true) {
          SoundJS.play( sound, SoundJS.INTERRUPT_NONE, 50, true );
        } else {
          if (interrupt_all===true) {
            SoundJS.play( sound, SoundJS.INTERUPT_ANY );
          } else {
            SoundJS.play( sound, SoundJS.INTERUPT_LATE );
          }
        }

      } else if (Game.with_soundmanager2) {

        if (loop===true) {
          soundManager.play(sound, {volume:volume, loops:10});
        } else {
          soundManager.play(sound, {volume:volume});
        }

      }
    }
  },

  loop_sound_theme : function() {
    
    // console.log('looping sound manually');

    if (Game.with_phonegap_sound && !Game.muted) {
      
      Game.sounds[sound].play();

      Game.theme_timer = setInterval(function(){ 
          Game.sounds['theme'].play(); 
        }, 72002);
      
    }

  },

  stop_sound : function(sound) {
    
    Game.log('stopping sound', sound);

    if (Game.with_phonegap_sound) {
      Game.sounds[sound].stop()

    } else if (Game.with_soundjs) {
      SoundJS.stop(sound);

    } else if (Game.with_soundmanager2) {
      soundManager.stop(sound);

    }
    
  },

  stop_all_sounds : function(dont_mute) {
    if (Game.with_phonegap_sound) {
      _.each(Game.sounds,function(media, key) {
        Game.stop_sound(key);
      });
    } else if (Game.with_soundjs) {
      SoundJS.stop();
      if (dont_mute!==true) {
        SoundJS.setMute(true);  
      }
    }
  },

  // we measure everything from the bottom, instead of the top
  // so we can stage jumps and crouches better. 
  normalize : function(h, y) {
    return Game.floor-y;
  },

  end : function() {

  },

  log : function(messages) {
    debug.log(messages);
  }

};