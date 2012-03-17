
MAPS = [{
  name               : 'normal',
  speed              : 5,
  floor              : 245,
  increment_on_frame : 24,
  item_odds          : 0.3,
  item_assets        : [],
  items              : {
    'blue'           : {  name     : 'blue',
                          liked_by : 'slim',
                          sprite   : { asset : 'demo_blue.png',   w : 20, height : 20 },
                          appears  : [ 1, 2, 3 ]
    },
    'pink'           : {  name     : 'pink',
                          liked_by : 'fat',
                          sprite   : { asset : 'demo_pink.png',   w : 20, height : 20 },
                          appears  : [ 2, 3 ]
    },
    'yellow'         : {  name     : 'tall',
                          liked_by : 'tall',
                          sprite   : { asset : 'demo_yellow.png', w : 20, height : 20 },
                          appears  : [ 0, 1, 2 ]
    }
  },
  brothers           : {
    slim             : {  name      : 'slim', 
                          likes     : 'blue',
                          width     : 20,
                          height    : 50,
                          position  : [ 275, 0 ], // left, bottom
                          abilities : { can_jump : true, can_crouch : true, jump_h : 120, crouch_h : 35 },
                          sprite    : { asset : 'demo_brother_01.png', w : 40, h : 60 }, 
                          animation : { 
                          // type   : [[ frame_number, tick_count, hitbox_x, hitbox_y, hitbox_w, hitbox_h ]]
                            idle    : [[ 0, 24, 10, 5,  20, 50 ],
                                       [ 1, 24, 10, 5,  20, 50 ]], 
                            crouch  : [[ 2, 1,  8,  20, 28, 35 ]], 
                            jump    : [[ 3, 12, 10, 5,  20, 50 ],
                                       [ 4, 24, 10, 5,  20, 50 ],
                                       [ 3, 12, 10, 5,  20, 50 ]
                                      ]} 
                        },
    fat              : {  name      : 'fat',
                          likes     : 'pink',
                          width     : 30,
                          height    : 40,
                          position  : [ 357, 0 ], // left, bottom
                          abilities : { can_jump : true, can_crouch : false, jump_h : 90, crouch_h : 0 },
                          sprite    : { asset : 'demo_brother_02.png', w : 40, h : 45 }, 
                          animation : { 
                          // type   : [[ frame_number, tick_count, hitbox_x, hitbox_y, hitbox_w, hitbox_h ]]
                            idle    : [[ 0, 24, 5,  5,  30, 40 ],
                                       [ 1, 24, 5,  5,  30, 40 ]], 
                            crouch  : [[ 2, 1,  5,  5,  30, 40 ]], 
                            jump    : [[ 3, 12, 5,  5,  30, 40 ],
                                       [ 4, 24, 5,  5,  30, 40 ],
                                       [ 3, 12, 5,  5,  30, 40 ]
                                      ]} 
                        },
    tall             : {  name      : 'tall',
                          likes     : 'yellow',
                          width     : 20,
                          height    : 70,
                          position  : [ 430, 0 ], // left, bottom
                          abilities : { can_jump : true, can_crouch : true, jump_h : 160, crouch_h : 100 },
                          sprite    : { asset : 'demo_brother_03.png', w : 40, h : 80 },  
                          animation : { 
                          // type   : [[ frame_number, tick_count, hitbox_x, hitbox_y, hitbox_w, hitbox_h ]]
                            idle    : [[ 0, 24, 10, 5,  20, 50 ],
                                       [ 1, 24, 10, 5,  20, 50 ]], 
                            crouch  : [[ 2, 1,  8,  20, 28, 40 ]], 
                            jump    : [[ 3, 12, 10, 5,  20, 50 ],
                                       [ 4, 24, 10, 5,  20, 50 ],
                                       [ 3, 12, 10, 5,  20, 50 ]
                                      ]} 
                        }
  },
  background  : {
    speed_mod : 0.5,
    assets    : [ 
      [ 'tree.png', 7 ], 
      [ 'house.png', 3 ]
    ]
  },
  landscape   : {
    speed_mod : 0.2,
    assets    : [ 
      [ 'demo_mountains_01.png', 1 ],
      [ 'demo_mountains_02.png', 1 ] 
    ]
  },
  skyscape    : {
    speed_mod : 0.1,
    assets    : [
      [ 'cloud.png', 1 ] 
    ]
  }
}];