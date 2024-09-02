export class Coords {
  x = 0;
  y = 0;

  constructor({ x = 0, y = null }) {
    this.x = x;

    if (y === null) this.y = x;
    else this.y = y;
  }

  equals(other_coords) {
    return this.x === other_coords.x && this.y === other_coords.y;
  }

  static random(max_x, max_y) {
    return new Coords({
      x: Math.floor(Math.random() * max_x),
      y: Math.floor(Math.random() * max_y),
    });
  }
}
