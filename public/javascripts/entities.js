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

  this.current_frame  = 0;

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

  this.initialize     = function() {
    
  };

  this.animate = function(){
    if (this.is_idle) {
      this.animate_idle();
    } else if (this.is_jumping) {
      this.animate_jump();
    } else if (this.is_crouching) {
      this.animate_crouch();
    } else if (this.is_falling) {
      this.animate_fall();
    } else if (this.is_dead) {
      this.animate_death();
    }

    var sx = 0 + (this.width*this.current_frame);

    this.context.drawImage(self.sprite.asset, sx, 0, this.width, this.height, self.position[0], Game.normalize(self.position[1]), this.width, this.height); 
  };

  this.animate_idle = function(){
    
    // var frames = 

    // if (_.include?(frames, this.current_frame)) {
    //   return this.current_frame;
    // } else {
    //   return frames[0];  
    // }
    

  };

  this.animate_crouch = function(){

  };

  this.animate_jump = function(){

  };

  this.animate_fall = function(){

  };

  this.animate_death = function(){

  };

  this.jump = function() {

  };

  this.crouch = function(){

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

var Item = function(){

  this.name   = 'fruit';
  this.width  = 20;
  this.height = 20;
  this.top    = 0;
  this.left   = 0;
  this.speed  = 0;
  this.score  = 0;
  this.origin = [];
  this.dest   = [];

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
















