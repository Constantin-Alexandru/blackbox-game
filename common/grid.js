import { CELL_TYPES } from "./cell-types.js";
import { Cell } from "./cell.js";
import { Coords } from "./coords.js";

export class Grid {
  #size = new Coords({});
  #grid = null;
  #cells = new Array();

  constructor({ size, grid, cells = null }) {
    this.#size = size;
    this.#grid = grid;

    if (cells === null) {
      this.create_grid();
    } else this.#cells = cells;
  }

  set size(size) {
    this.#size = size;
  }

  get size() {
    return this.#size;
  }

  /**
   * @param {HTMLElement} grid
   */
  set grid(grid) {
    this.#grid = grid;
  }

  get grid() {
    return this.#grid;
  }

  create_grid() {
    let row = null;
    for (let i = 0; i < this.#size.x * this.#size.y; i++) {
      if (i % this.#size.x === 0) {
        row = document.createElement("tr");
        this.#grid.appendChild(row);
      }

      const x = i % this.#size.x;
      const y = Math.floor(i / this.#size.y);

      const cell = new Cell({
        grid: row,
        grid_size: this.#size,
        coords: new Coords({ x: x, y: y }),
        node: null,
        hidden:
          (x === 0 && (y === 0 || y === this.#size.y - 1)) ||
          (x === this.#size.x - 1 && (y === 0 || y === this.#size.y - 1)),
        disabled: true,
      });

      this.#cells.push(cell);
    }
  }

  set cells(cells) {
    this.#cells = cells;
  }

  get cells() {
    return this.#cells;
  }

  set_cell(coords, value) {
    const cell = this.#cells.filter((cell) => cell.coords.equals(coords))[0];

    cell.value = value;
  }

  get_cell(coords) {
    const cell = this.#cells.filter((cell) => cell.coords.equals(coords))[0];

    return cell;
  }

  isEdge(coords) {
    return (
      coords.x === 0 ||
      coords.y === 0 ||
      coords.x === this.#size.x - 1 ||
      coords.y === this.#size.y - 1
    );
  }

  enable() {
    this.#cells.forEach((cell) => {
      cell.disabled = false;
    });
  }

  disable() {
    this.#cells.forEach((cell) => {
      cell.disabled = true;
    });
  }

  draw() {
    this.#cells.forEach((cell) => cell.draw());
  }

  reset() {
    Cell.edge_id = 9311;

    this.#cells.forEach((cell) => cell.reset());
  }
}
