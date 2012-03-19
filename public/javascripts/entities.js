var Brother = function(brother_hash, context) {

  this.name           = brother_hash.name;
  this.top            = brother_hash.top;
  this.left           = brother_hash.left;
  this.likes          = brother_hash.likes;
  this.width          = brother_hash.width;
  this.height         = brother_hash.height;
  this.sprite         = brother_hash.sprite;
  this.position       = brother_hash.position;
  
  this.animation      = brother_hash.animation;
  this.animate_idle   = brother_hash.animation.idle;
  this.animate_crouch = brother_hash.animation.crouch;
  this.animate_jump   = brother_hash.animation.jump;

  this.last_game_tick = 0;

  this.idle_current_f   = 0;
  this.crouch_current_f = 0;
  this.jump_current_f   = 0;

  this.can_jump       = brother_hash.abilities.can_jump;
  this.can_crouch     = brother_hash.abilities.can_crouch;
  this.jump_h         = brother_hash.abilities.jump_h;
  this.crouch_h       = brother_hash.abilities.crouch_h;

  this.context        = context;

  // states
  this.is_idle        = true;
  this.is_jumping     = false;
  this.is_crouching   = false;
  this.is_falling     = false;
  this.is_dead        = false;
  
  this.color          = "#ffcc00";
  
  this.pain           = 0;
  this.max_pain       = 2;
  this.food           = 0;

  this.debug          = Game.debug;
  this.hitbox         = [];

  this.initialize     = function() {
    
    this.image = new Image();
    this.image.src = Game.images_dir + this.sprite.asset;

  };

  this.initialize_hitbox = function() {

    // initialize hitbox

  };

  this.animate = function(){

    if (this.is_idle) {
      this.animate_idle();
      this.current_frame = this.animation.idle[this.idle_current_f][0];
    } else if (this.is_jumping) {
      this.animate_jump();
      this.current_frame = this.animation.jump[this.jump_current_f][0];
    } else if (this.is_crouching) {
      this.animate_crouch();
      this.current_frame = this.animation.crouch[this.crouch_current_f][0];
    } else if (this.is_falling) {
      this.animate_fall();
    } else if (this.is_dead) {
      this.animate_death();
    }

    var sx = 0 + (this.width*this.current_frame),
        sy = 0;
    
    this.context.drawImage( 
      this.image, 
      sx, sy, 
      this.width, this.height, 
      Game.normalize_x(this.position[0]), 
      Game.normalize_y(this.position[1], this.height), 
      this.width, this.height 
    ); 

  };

  this.animate_idle = function(){

    if (Game.ticks==this.last_game_tick+this.animation.idle[this.idle_current_f][1]) {
      if (this.idle_current_f < this.animation.idle.length-1) {
        this.idle_current_f += 1;
      } else {
        this.idle_current_f = 0; // idling loops
      }
      this.last_game_tick = Game.ticks;
    }

    this.tick_step = this.animation.idle[this.idle_current_f][1];

  };

  this.animate_crouch = function(){

    if (Game.ticks==this.last_game_tick+this.animation.crouch[this.crouch_current_f][1]) {
      if (this.crouch_current_f < this.animation.crouch.length-1) {
        this.crouch_current_f += 1;
      } else {
        this.idle();
      }
      this.last_game_tick = Game.ticks;
    }

    this.tick_step = this.animation.crouch[this.crouch_current_f][1];

  };

  this.animate_jump = function(){
    
    if (Game.ticks==this.last_game_tick+this.animation.jump[this.jump_current_f][1]) {
      if (this.jump_current_f < this.animation.jump.length-1) {
        this.jump_current_f += 1;
      } else {
        this.idle();
      }
      this.last_game_tick = Game.ticks;
    }

    this.position[1] = this.position[1]-this.animation.jump[this.jump_current_f][2];

    this.tick_step = this.animation.jump[this.jump_current_f][1];
    
  };

  this.animate_fall = function(){

  };

  this.animate_death = function(){

  };

  this.reset_current_f = function(){

    this.idle_current_f = 0;
    this.jump_current_f = 0;
    this.crouch_current_f = 0;
    this.last_game_tick = Game.ticks;

  };

  this.idle = function() {

    console.log(this.name + ' idle!', this.is_idle);

    if (this.is_idle == false) {
      this.reset_current_f();
      this.is_idle = true;
      this.is_jumping = false;
      this.is_crouching = false;
    }

  };

  this.jump = function() {
    
    console.log(this.name + ' jump!', this.is_jumping);

    if (this.is_jumping == false && this.is_crouching == false) {
      this.reset_current_f();
      this.is_idle = false;
      this.is_jumping = true;
      this.is_crouching = false;
    }
    
  };

  this.crouch = function(){

    if (this.can_crouch===true) {
      console.log(this.name + ' crouch!');

      if (this.is_crouching == false && this.is_jumping == false) {
        this.reset_current_f();
        this.is_idle = false;
        this.is_jumping = false;
        this.is_crouching = true;
      }
    }

  };

  this.collide = function(item){
    if (this.likes==item.name) {
      this.eat();
    } else {
      this.hurt();
    }
  };

  this.eat = function(){
    this.food+=1;
    this.pain-=1;
    this.show_pleasure();
  };

  this.hurt = function(){
    if (this.pain < this.max_pain) {
      this.pain+=1;
      this.show_pain();
    } else {
      this.die();
    }
  };

  this.show_pleasure = function(){

  };

  this.show_pain = function(){

  };

  this.die = function(){

  };

};

var Item = function(item_hash, context) {

  this.name       = item_hash.name;
  this.width      = item_hash.sprite.width;
  this.height     = item_hash.sprite.height;
  
  this.image      = item_hash.image;
  this.speed      = item_hash.speed;
  this.score      = item_hash.score;

  this.origin     = item_hash.origin;
  this.current    = item_hash.origin;
  this.dest       = [ Game.width, item_hash.origin[1] ];

  this.context    = context;

  this.initialize = function(){

    this.animate();

  };

  this.animate = function(){
    
    if (this.current[0] < this.dest[0]) {
      this.current[0] += this.speed;  
    } else {
      this.remove();
    }

    this.context.drawImage(
      this.image, 
      0, 0, 
      this.width, this.height, 
      this.current[0], 
      Game.normalize_y(this.current[1], this.height), 
      this.width, this.height 
    );

    this.detect_collision_with_brothers();

  };

  this.detect_collision_with_brothers = function(){
    
    if (this.current[0] > Game.brothers.slim.position[0]-100) {

      var self1  = [this.current[0], this.current[0] + this.width],
          self2  = [this.current[1], this.current[1] + this.height];

      if (!this.detect_collision_with_brother( Game.brothers.slim, self1, self2 )) {
        if (!this.detect_collision_with_brother( Game.brothers.fat, self1, self2 )) {
          this.detect_collision_with_brother( Game.brothers.tall, self1, self2 );
        }
      }

    }

  };

  this.detect_collision_with_brother = function( brother, self1, self2 ) {

    var cur_l       = Game.normalize_x(brother.position[0]),
        cur_t       = brother.position[1],
        p1          = [cur_l, cur_l + brother.width  ],
        p2          = [cur_t, cur_t + brother.height ],
        horiz_match = Game.compare_positions( self1, p1 ),
        vert_match  = Game.compare_positions( self2, p2 );
    
    // console.log('match', horiz_match, vert_match);
    console.log(self1, cur_l, cur_t, brother.name);
    if (horiz_match && vert_match) {
      return this.collide(); 
    } else {
      return false;  
    }
    
  };

  this.collide = function(){
    console.log('collide!');
    this.remove();  
  };

  this.remove = function(){
    Game.factory.remove(this);
  };

};

var ItemFactory   = function(tracks, items, context) {

  this.odds       = 1;
  this.tracks     = tracks;
  this.items      = items;
  this.context    = context;
  this.animating_items = [];
  this.paused     = false;

  this.initialize = function(){
    
    var self = this;

    _.each(this.items,function(v,k){
      self.items[k].image = new Image();
      self.items[k].image.src = Game.images_dir + v.sprite.asset;
    });

    Game.viewport.everyTime(3000, function(){
      if (!self.paused && self.animating_items.length < Game.map.max_items) {
        self.generate();
        self.paused = true;  
      }
    });

  };

  this.generate   = function(){

    var self      = this,
        num       = Math.floor(Math.random()*(this.tracks.length)),
        track     = self.tracks[num],

        // which items can appear on the given track?
        items     = _.filter(self.items, function(item){ return _.include(item.appears, num); }),

        // randomly pick from the matching items
        item_hash = items[Math.floor(Math.random()*items.length)],

        // add positions
        item_hash = _.extend(item_hash, { origin : [ -20, track ] }),

        // create the item object
        item_obj  = new Item( item_hash, context );

    this.animating_items.push( item_obj );

    item_obj.initialize();

  };

  this.animate    = function(){

    _.each(this.animating_items, function(item){
      item.animate();
    });

  };

  this.remove      = function(item){

    console.log('removing ', item);
    this.animating_items.splice( _.indexOf(this.animating_items, item), 1 );

  };

};

var Background = function(speed, assets) {

  this.speed   = speed;
  this.canvas  = document.getElementById('background');
  this.context = this.canvas.getContext('2d');

  this.initialize = function(){

  };

  this.animate = function(){

  };

};

var Landscape  = function(speed, assets) {

  this.speed   = speed;
  this.canvas  = document.getElementById('landscape');
  this.context = this.canvas.getContext('2d');

  this.initialize = function(){

  };

  this.animate = function(){

  };

};

var Skyscape   = function(speed, assets) {

  this.speed   = speed;
  this.canvas  = document.getElementById('skyscape');
  this.context = this.canvas.getContext('2d');

  this.initialize = function(){

  };

  this.animate = function(){

  };

};
















