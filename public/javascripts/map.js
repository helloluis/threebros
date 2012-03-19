MIN_VIEWPORT = {
  width  : 480,
  height : 320
}

MAPS = [{
  name               : 'normal',
  speed              : 5,
  floor              : 75, // height from bottommost
  increment_on_frame : 24,
  item_odds          : 0.3,
  item_tracks        : [ 20, 40, 60, 100 ],
  max_items          : 1,
  items              : {
    'blue'           : {  name     : 'blue',
                          liked_by : 'slim',
                          speed    : 5,
                          sprite   : { asset : 'demo_powerup_blue.png',   width : 20, height : 20 },
                          appears  : [ 0, 1, 3 ]
    },
    'pink'           : {  name     : 'pink',
                          liked_by : 'fat',
                          speed    : 5,
                          sprite   : { asset : 'demo_powerup_pink.png',   width : 20, height : 20 },
                          appears  : [ 0, 1, 2 ]
    },
    'yellow'         : {  name     : 'yellow',
                          liked_by : 'tall',
                          speed    : 5,
                          sprite   : { asset : 'demo_powerup_yellow.png', width : 20, height : 20 },
                          appears  : [ 1, 2, 3 ]
    }
  },
  brothers           : {
    slim             : {  name      : 'slim', 
                          likes     : 'blue',
                          width     : 40,
                          height    : 60,
                          position  : [ 270, 0 ], // left, bottom
                          abilities : { can_jump : true, can_crouch : true, per_tick : 5, crouch_h : 35 },
                          sprite    : { asset : 'demo_brother_01.png', w : 40, h : 60 }, 
                          animation : { 
                          // type   : [[ frame_number, tick_count, change_per_tick, hitbox_x, hitbox_y, hitbox_w, hitbox_h ]]
                            idle    : [[ 0, 24,  0,  10,   5,  20, 50 ],
                                       [ 1, 24,  0,  10,   5,  20, 50 ]], 
                            crouch  : [[ 2, 12,  0,   8,  20,  28, 35 ]],
                            jump    : [[ 3, 8,  -7,  10,   5,  20, 50 ],
                                       [ 4, 4,  -2,  10,   5,  20, 50 ],
                                       [ 4, 4,   0,  10,   5,  20, 50 ],
                                       [ 4, 4,   2,  10,   5,  20, 50 ],
                                       [ 3, 8,   7,  10,   5,  20, 50 ]
                                      ]} 
                        },
    fat              : {  name      : 'fat',
                          likes     : 'pink',
                          width     : 40,
                          height    : 45,
                          position  : [ 340, 0 ], // left, bottom
                          abilities : { can_jump : true, can_crouch : false, jump_h : 90, crouch_h : 0 },
                          sprite    : { asset : 'demo_brother_02.png', w : 40, h : 45 }, 
                          animation : { 
                          // type   : [[ frame_number, tick_count, change_per_tick, hitbox_x, hitbox_y, hitbox_w, hitbox_h ]]
                            idle    : [[ 0, 19,  0,  5,  5,  30, 40 ],
                                       [ 1, 23,  0,  5,  5,  30, 40 ]], 
                            crouch  : [[ 2, 12,  0,  5,  5,  30, 40 ]], 
                            jump    : [[ 3, 8,  -4,  5,  5,  30, 40 ],
                                       [ 4, 4,  -2,  5,  5,  30, 40 ],
                                       [ 4, 4,   0,  5,  5,  30, 40 ],
                                       [ 4, 4,   2,  5,  5,  30, 40 ],
                                       [ 3, 8,   4,  5,  5,  30, 40 ]
                                      ]} 
                        },
    tall             : {  name      : 'tall',
                          likes     : 'yellow',
                          width     : 40,
                          height    : 80,
                          position  : [ 410, 0 ], // left, bottom
                          abilities : { can_jump : true, can_crouch : true, jump_h : 160, crouch_h : 60 },
                          sprite    : { asset : 'demo_brother_03.png', w : 40, h : 80 },  
                          animation : { 
                          // type   : [[ frame_number, tick_count, hitbox_x, hitbox_y, hitbox_w, hitbox_h ]]
                            idle    : [[ 0, 29,  0,  10,  5,  20, 50 ],
                                       [ 1, 31,  0,  10,  5,  20, 50 ]], 
                            crouch  : [[ 2, 12,  0,   8, 20,  28, 40 ]], 
                            jump    : [[ 3, 8,  -7,  10,  5,  20, 50 ],
                                       [ 4, 4,  -2,  10,  5,  20, 50 ],
                                       [ 4, 4,   0,  10,  5,  20, 50 ],
                                       [ 4, 4,   2,  10,  5,  20, 50 ],
                                       [ 3, 8,   7,  10,  5,  20, 50 ]
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