export const CELL_TYPES = {
  empty: 0,

  // EDGE BALLS
  ball_start: 1,
  ball_end: 2,
  ball_absorb: 3,
  ball_reflect: 4,

  // GRID BALLS
  ball: 5,
  ball_correct: 6,
  ball_incorrect: 7,
  ball_missed: 8,
  ball_hidden: 9,
  ball_hidden_selected: 10,

  // RAYS UNIDIRECTIONAL
  ray_horizontal: 11,
  ray_vertical: 12,
  ray_cross: 13,
  ray_top_left: 14,
  ray_top_right: 15,
  ray_bottom_left: 16,
  ray_bottom_right: 17,

  // RAYS BIDIRECTIAL
  ray_bidirectional_horizontal: 18,
  ray_bidirectional_vertical: 19,
  ray_bidirectional_cross: 20,
  ray_bidirectional_top_left: 21,
  ray_bidirectional_top_right: 22,
  ray_bidirectional_bottom_left: 23,
  ray_bidirectional_bottom_right: 24,

  // RAYS RETURN
  ray_return_top: 25,
  ray_return_bottom: 26,
  ray_return_left: 27,
  ray_return_right: 28,
};
