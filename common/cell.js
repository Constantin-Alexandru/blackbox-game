import { CELL_TYPES } from "./cell-types.js";
import { Coords } from "./coords.js";

export class Cell {
  #grid = null;
  #grid_size = new Coords({});
  #value = CELL_TYPES.empty;
  #coords = new Coords({});
  #node = null;
  #disabled = false;
  #hidden = false;
  #_id = 0;

  static edge_id = 9311;

  constructor({
    grid,
    grid_size = new Coords({}),
    value = CELL_TYPES.empty,
    coords = new Coords({}),
    node = null,
    disabled = false,
    hidden = false,
  }) {
    this.#grid = grid;
    this.#grid_size = grid_size;
    this.#value = value;
    this.#coords = coords;
    this.#disabled = disabled;
    this.#hidden = hidden;

    if (node === null) {
      this.#node = document.createElement("td");

      this.#grid.appendChild(this.#node);
    } else {
      this.#node = node;
    }

    this.draw();
    if (hidden) return;

    this.#node.addEventListener("click", () => {
      if (hidden) return;

      if (this.#disabled) return;

      if (this.#value === CELL_TYPES.empty) {
        if (this.isEdge()) {
          this.#value = CELL_TYPES.ball_start;
          this.#_id = ++Cell.edge_id;
        } else this.#value = CELL_TYPES.ball;

        this.draw();
        return;
      }

      if (this.#value === CELL_TYPES.ball) {
        this.#value = CELL_TYPES.empty;

        this.draw();

        return;
      }

      if (this.#value === CELL_TYPES.ball_hidden) {
        this.#value = CELL_TYPES.ball_hidden_selected;

        this.draw();
        return;
      }
      if (this.#value === CELL_TYPES.ball_hidden_selected) {
        this.#value = CELL_TYPES.ball_hidden;
        this.draw();
        return;
      }
    });
  }

  /**
   * @param {number} value
   */
  set value(value) {
    this.#value = value;

    if (this.#value === CELL_TYPES.ball_end && this.#_id === 0)
      this.#_id = Cell.edge_id;

    this.draw();
  }

  get value() {
    return this.#value;
  }

  /**
   * @param {{ x: any; y: any; }} coords
   */
  set coords(coords) {
    this.#coords = new Coords(coords.x, coords.y);
  }

  get coords() {
    return this.#coords;
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this.#disabled = disabled;
  }

  get disabled() {
    return this.#disabled;
  }

  static get edge_id() {
    return Cell.edge_id;
  }

  isEdge() {
    return (
      this.#coords.x === 0 ||
      this.#coords.y === 0 ||
      this.#coords.x === this.#grid_size.x - 1 ||
      this.#coords.y === this.#grid_size.y - 1
    );
  }

  draw() {
    this.#node.classList = "";
    this.#node.innerText = "";
    if (this.#hidden) {
      this.#node.classList.add("corner");
      return;
    }

    if (this.isEdge()) {
      this.#node.classList.add("edge");
    }

    if (this.#disabled) return;
    if (
      this.#value === CELL_TYPES.empty ||
      this.#value === CELL_TYPES.ball_hidden
    )
      return;

    switch (this.#value) {
      case CELL_TYPES.ball:
      case CELL_TYPES.ball_hidden_selected:
        this.#node.innerText = "⬤";
        break;
      case CELL_TYPES.ball_start:
        this.#node.innerHTML = `&#${this.#_id};`;
        break;
      case CELL_TYPES.ball_end:
        this.#node.innerHTML = `&#${this.#_id};`;
        this.#node.classList.add("end");
        break;
      case CELL_TYPES.ball_absorb:
        this.#node.innerHTML = `&#${this.#_id};`;
        this.#node.classList.add("absorbed");
        break;
      case CELL_TYPES.ball_reflect:
        this.#node.innerHTML = `&#${this.#_id};`;
        this.#node.classList.add("reflected");
        break;
      case CELL_TYPES.ball_correct:
        this.#node.innerText = "⬤";
        this.#node.classList.add("correct");
        break;
      case CELL_TYPES.ball_incorrect:
        this.#node.innerText = "⬤";
        this.#node.classList.add("incorrect");
        break;
      case CELL_TYPES.ball_missed:
        this.#node.innerText = "⬤";
        this.#node.classList.add("missed");
        break;
    }
  }

  isBall() {
    return (
      this.#value === CELL_TYPES.ball_hidden ||
      this.#value === CELL_TYPES.ball_hidden_selected
    );
  }

  reset() {
    this.#value = CELL_TYPES.empty;
    this.#_id = 0;

    this.draw();
  }

  delete() {
    this.#node.removeEventListener("click");
    this.#grid.removeChild(this.#node);
  }
}
