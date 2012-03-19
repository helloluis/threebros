var Brother = function(brother_hash, context) {

  this.name           = brother_hash.name;
  this.top            = brother_hash.top;
  this.left           = brother_hash.left;
  this.likes          = brother_hash.likes;
  this.width          = brother_hash.width;
  this.height         = brother_hash.height;
  this.sprite         = brother_hash.sprite;
  this.position       = brother_hash.position; // [ x, y ] 
  
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
  this.state          = 'idle';
  
  this.color          = "#ffcc00";
  
  this.pain           = 0;
  this.max_pain       = 2;
  this.food           = 0;

  this.debug          = Game.debug;
  this.hitbox         = [];

  this.initialize     = function() {
    
    this.image = new Image();
    this.image.src = Game.images_dir + this.sprite.asset;
    
    this.make_hitbox();

  };

  this.make_hitbox = function() {

    switch (this.state) {
      case "idle": 
        var cur_f = this.idle_current_f;
      break;
      case "jump":
        var cur_f = this.jump_current_f;
      break;
      case "crouch":
        var cur_f = this.crouch_current_f;
      break;
    }

    this.hitbox = { 
      x : Game.normalize_x(this.position[0] + this.animation[this.state][cur_f][3]),
      y : Game.normalize_y(this.position[1] + this.animation[this.state][cur_f][4], this.height),
      w : this.animation[this.state][cur_f][5],
      h : this.animation[this.state][cur_f][6]
    };
    //console.log(this.state, cur_f);
    //console.log(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h);

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
      this.make_hitbox();
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
      this.make_hitbox();
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
      this.make_hitbox();
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

    //console.log(this.name + ' idle!', this.is_idle);

    if (this.is_idle == false) {
      
      this.reset_current_f();
      this.is_idle = true;
      this.is_jumping = false;
      this.is_crouching = false;
      
      this.state = 'idle';
      this.make_hitbox();

    }

  };

  this.jump = function() {
    
    //console.log(this.name + ' jump!', this.is_jumping);

    if (this.is_jumping == false && this.is_crouching == false) {
      
      this.reset_current_f();
      this.is_idle = false;
      this.is_jumping = true;
      this.is_crouching = false;

      this.state = 'jump';
      this.make_hitbox();

    }
    
  };

  this.crouch = function(){

    if (this.can_crouch===true) {
      //console.log(this.name + ' crouch!');

      if (this.is_crouching == false && this.is_jumping == false) {
        
        this.reset_current_f();
        this.is_idle = false;
        this.is_jumping = false;
        this.is_crouching = true;
        
        this.state = 'crouch';
        this.make_hitbox();

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
  
  this.marked_for_deletion = false;

  this.context    = context;

  this.initialize = function(){

    this.animate();

  };

  this.animate = function(){
    
    if (this.current[0] < this.dest[0]) {
      this.current[0] += this.speed;  
    } else {
      this.marked_for_deletion = true;
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
    
    var self = this;

    if (this.current[0] > Game.width/2) {

      var norm_y = Game.normalize_y(this.current[1], this.height),
          self1  = [this.current[0], this.current[0] + this.width],
          self2  = [norm_y, norm_y + this.height];

      _.each( Game.brothers, function(brother, name){
        self.detect_collision_with_brother(brother, self1, self2);
      });
      
    }

  };

  this.detect_collision_with_brother = function( brother, self1, self2 ) {

    var p1          = [ brother.hitbox.x, brother.hitbox.x + brother.hitbox.w ],
        p2          = [ brother.hitbox.y, brother.hitbox.y + brother.hitbox.h ],
        horiz_match = Game.compare_positions( self1, p1 ),
        vert_match  = Game.compare_positions( self2, p2 );
    
    // console.log('match', horiz_match, vert_match);
    // console.log(self1, self2, brother.hitbox.x, brother.hitbox.y, brother.name);
    if (horiz_match && vert_match) {
      //console.log(self1, self2, brother.hitbox.x, brother.hitbox.y, brother.name);
      return this.collide(); 
    } else {
      return false;  
    }
    
  };

  this.collide = function(){
    this.marked_for_deletion = true;
    console.log(this.marked_for_deletion);
  };

};

var ItemFactory   = function(tracks, items, context) {

  this.odds       = 1;
  this.tracks     = tracks;
  this.items      = items;
  this.context    = context;
  this.animating_items = [];
  this.paused     = false;
  this.frequency  = 3000;

  this.initialize = function(){
    
    var self = this;

    _.each(this.items,function(v,k){
      self.items[k].image = new Image();
      self.items[k].image.src = Game.images_dir + v.sprite.asset;
    });

    Game.viewport.everyTime(this.frequency, function(){
      if (!self.paused && self.animating_items.length < Game.map.max_items) {
        self.generate();
        //self.paused = true;
      }
    });

    self.generate();

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

    this.cleanup();

  };

  this.cleanup = function(){
    var self = this;
    _.map(this.animating_items,function(item){
      if (item.marked_for_deletion) {
        self.remove(item);
      }
    });
  };

  this.remove      = function(item){
    this.animating_items.splice( _.indexOf(this.animating_items, item), 1 );
  };

};

var Backgrounder  = function(hash) {

  this.speed_mod  = hash.speed_mod;
  this.assets     = hash.assets;
  this.canvas     = document.getElementById(hash.canvas);
  this.context    = this.canvas.getContext('2d');
  this.floor      = hash.use_floor ? Game.height : false;
  
  this.animating_items = [];

  this.initialize = function(){

    var self = this;

    _.each(this.assets, function(asset, k){
      self.assets[k].image = new Image();
      self.assets[k].image.src = Game.images_dir + asset.sprite;
    });

    this.frequency  = (Game.width/this.speed())*10;

    $("#" + hash.canvas).everyTime(this.frequency, function(){
      self.generate();
    });

    self.generate((Game.width/2)+Math.round(Math.random()*(Game.width/4)));

  };

  this.generate  = function(force_current){
    
    var self             = this,
        num              = Math.floor(Math.random()*self.assets.length),
        selected         = _.clone(self.assets[num]);
        norm_y           = self.floor ? self.normalize_y(0, selected.height) : Math.round(Math.random()*Game.floor),
        selected.origin  = [ -selected.width, norm_y ];
        selected.current = [ (force_current ? force_current : -selected.width), norm_y ];
        selected.dest    = [ Game.width, norm_y ];

    console.log(selected.name, selected.current[0]);
    self.animating_items.push(selected);
    
  };

  this.speed = function(){
    return Game.speed*this.speed_mod;
  };

  this.animate = function(){
    var self = this;
    
    _.each(self.animating_items, function(item){
      
      if (item.current[0] < item.dest[0]) {
        item.current[0]+=self.speed();

        self.context.drawImage(
          item.image,  
          item.current[0], 
          item.current[1]
        );  

      } else {
        item.mark_for_deletion = true;
      }

    });

    self.cleanup();
  };

  this.normalize_y = function(h, y){
    h = h ? h : 0;
    return (this.floor-h)-y;
  };

  this.cleanup = function(){
    var self = this;
    _.map(this.animating_items,function(){
      if (this.marked_for_deletion) {
        self.remove(this);
      }
    });
  };

  this.remove = function(item) {
    console.log('removing landscape item', item.name, this.animating_items.length);
    this.animating_items.splice( _.indexOf(this.animating_items, item), 1);
  };

};

var Background    = function(background_hash) {

  this.speed_mod  = background_hash.speed_mod;
  this.speed      = Game.speed * this.speed_mod;
  this.assets     = background_hash.assets;
  this.canvas     = document.getElementById('background');
  this.context    = this.canvas.getContext('2d');

  this.initialize = function(){
    
    var self = this;

    _.each(this.assets, function(asset, k){
      self.assets[k].image = new Image();
      self.assets[k].image.src = Game.images_dir + asset.sprite;
    });

    console.log(self.assets);

  };

  this.animate = function(){

  };

};

var Landscape     = function(landscape_hash, context) {

  this.speed_mod  = landscape_hash.speed_mod;
  this.speed      = Game.speed * this.speed_mod;
  this.assets     = landscape_hash.assets;
  this.canvas     = document.getElementById('landscape');
  this.context    = this.canvas.getContext('2d');
  this.floor      = Game.height;
  
  this.frequency  = (Game.width/this.speed)*10;
  this.animating_items = [];

  this.initialize = function(){

    var self = this;

    _.each(this.assets, function(asset, k){
      self.assets[k].image = new Image();
      self.assets[k].image.src = Game.images_dir + asset.sprite;
    });

    console.log(self.frequency);

    $("#landscape").everyTime(this.frequency, function(){
      self.generate();
    });

    self.generate((Game.width/2)+Math.round(Math.random()*(Game.width/4)));

  };

  this.generate  = function(force_current){
    
    var self     = this,
        num      = Math.floor(Math.random()*self.assets.length),
        selected = _.clone(self.assets[num]);
        selected.origin  = [ -selected.width, self.normalize_y(0, selected.height) ];
        selected.current = [ (force_current ? force_current : -selected.width), self.normalize_y(0, selected.height) ];
        selected.dest    = [ Game.width, self.normalize_y(0, selected.height) ];

    console.log(selected.name, selected.current[0]);
    self.animating_items.push(selected);
    
  };

  this.speed = function(){
    return Game.speed*this.speed_mod;
  };

  this.animate = function(){
    var self = this;
    
    _.each(self.animating_items, function(item){
      
      if (item.current[0] < item.dest[0]) {
        item.current[0]+=self.speed();

        self.context.drawImage(
          item.image,  
          item.current[0], 
          item.current[1]
        );  

      } else {
        self.remove(item);
      }

    });

  };

  this.normalize_y = function(h, y){
    h = h ? h : 0;
    return (this.floor-h)-y;
  };

  this.remove = function(item) {
    console.log('removing landscape item', item.name, this.animating_items.length);
    this.animating_items.splice( _.indexOf(this.animating_items, item), 1);
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





