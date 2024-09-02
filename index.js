import "./common/utils.js";
import { CELL_TYPES } from "./common/cell-types.js";
import { Cell } from "./common/cell.js";
import { Coords } from "./common/coords.js";
import { Grid } from "./common/grid.js";
import { Directions } from "./common/directions.js";

let best_score = parseInt(localStorage.getItem("best_score") ?? `${8 * 8}`);

function position_balls(size, count) {
  const width = size.x;
  const height = size.y;

  let balls = [];

  for (let ball = 0; ball < count; ball++) {
    let _ball = new Coords({});

    do {
      _ball = Coords.random(width - 2, height - 2);
      _ball.x++;
      _ball.y++;
    } while (
      balls.filter((ball) => ball.x === _ball.x && ball.y === _ball.y).length >
      0
    );

    balls.push(_ball);
  }

  balls = balls.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;

    return a.x - b.x;
  });

  return balls;
}

const ball_count = 4;

const grid_node = document.getElementById("grid");

const grid = new Grid({ size: { x: 10, y: 10 }, grid: grid_node });

grid.draw();

const start_button = document.getElementById("start_button");
const submit_button = document.getElementById("submit_button");

const game_message = document.getElementById("game_message");

let correct_balls = [];

start_button.addEventListener("click", () => {
  grid.reset();
  grid.enable();

  game_message.innerText = "";
  game_message.classList = "";

  correct_balls = position_balls(grid.size, ball_count);

  correct_balls.forEach((ball) => {
    grid.set_cell(ball, CELL_TYPES.ball_hidden);
  });

  submit_button.classList.remove("hidden");

  start_button.innerText = "Reset Game";
});

submit_button.addEventListener("click", () => {
  const balls = grid.cells
    .filter(
      (cell) =>
        cell.value === CELL_TYPES.ball_hidden_selected ||
        cell.value === CELL_TYPES.ball,
    )
    .map((cell) => cell.coords);

  if (balls.length !== 4) return;

  submit_button.classList.add("hidden");

  const correct_guesses = balls.intersection(correct_balls);
  const incorrect_guesses = balls.difference(correct_balls);
  const not_guessed = correct_balls.difference(correct_guesses);

  correct_guesses.forEach((guess) => {
    grid.set_cell(guess, CELL_TYPES.ball_correct);
  });

  incorrect_guesses.forEach((guess) => {
    grid.set_cell(guess, CELL_TYPES.ball_incorrect);
  });

  not_guessed.forEach((guess) => {
    grid.set_cell(guess, CELL_TYPES.ball_missed);
  });

  const score = Cell.edge_id - 9311;

  if (score < best_score) {
    best_score = score;
    localStorage.setItem("best_score", score);
  }

  if (correct_guesses.length === ball_count) {
    game_message.innerText = `You guessed correctly all ${ball_count} positions in ${score} guesses (best: ${best_score}). Congratulations!`;
    game_message.classList.add("correct");
    return;
  }

  game_message.innerText = `You only guessed correctly ${correct_guesses.length}/${ball_count} positions. Try again!`;
  game_message.classList.add("incorrect");
});

const solved_starts = [];

window.addEventListener("click", () => {
  const start_balls = grid.cells
    .filter((cell) => cell.value === CELL_TYPES.ball_start)
    .filter((cell) => !solved_starts.includes(cell))
    .map((cell) => cell.coords);

  start_balls.forEach((ball) => {
    const current_position = new Coords({ ...ball });

    solved_starts.push(ball);

    let dir =
      current_position.x === 0
        ? Directions.right
        : current_position.x === grid.size.x - 1
          ? Directions.left
          : current_position.y === 0
            ? Directions.bottom
            : Directions.top;

    let _break = false;

    do {
      let neighbours = [];
      let next_cell = undefined;
      switch (dir) {
        case Directions.top:
          neighbours = correct_balls.filter(
            (ball) =>
              ball.y === current_position.y - 1 &&
              (ball.x === current_position.x - 1 ||
                ball.x === current_position.x ||
                ball.x === current_position.x + 1),
          );

          next_cell = neighbours.filter(
            (cell) =>
              cell.x === current_position.x &&
              cell.y === current_position.y - 1,
          )[0];

          if (next_cell !== undefined) {
            grid.set_cell(ball, CELL_TYPES.ball_absorb);

            _break = true;
            break;
          }

          if (neighbours.length > 0) {
            const neighbour = neighbours[0];

            if (neighbour.x === current_position.x + 1)
              dir = Directions.left_neighbour(dir);
            else dir = Directions.right_neighbour(dir);

            break;
          }

          current_position.y -= 1;

          break;
        case Directions.bottom:
          neighbours = correct_balls.filter(
            (ball) =>
              ball.y === current_position.y + 1 &&
              (ball.x === current_position.x - 1 ||
                ball.x === current_position.x ||
                ball.x === current_position.x + 1),
          );

          next_cell = neighbours.filter(
            (cell) =>
              cell.x === current_position.x &&
              cell.y === current_position.y + 1,
          )[0];

          if (next_cell !== undefined) {
            grid.set_cell(ball, CELL_TYPES.ball_absorb);

            _break = true;
            break;
          }

          if (neighbours.length > 0) {
            const neighbour = neighbours[0];

            if (neighbour.x === current_position.x - 1)
              dir = Directions.left_neighbour(dir);
            else dir = Directions.right_neighbour(dir);

            break;
          }

          current_position.y += 1;

          break;
        case Directions.left:
          neighbours = correct_balls.filter(
            (ball) =>
              ball.x === current_position.x - 1 &&
              (ball.y === current_position.y - 1 ||
                ball.y === current_position.y ||
                ball.y === current_position.y + 1),
          );

          next_cell = neighbours.filter(
            (cell) =>
              cell.y === current_position.y &&
              cell.x === current_position.x - 1,
          )[0];

          if (next_cell !== undefined) {
            grid.set_cell(ball, CELL_TYPES.ball_absorb);

            _break = true;
            break;
          }

          if (neighbours.length > 0) {
            const neighbour = neighbours[0];

            if (neighbour.y === current_position.y - 1)
              dir = Directions.left_neighbour(dir);
            else dir = Directions.right_neighbour(dir);

            break;
          }

          current_position.x -= 1;

          break;
        case Directions.right:
          neighbours = correct_balls.filter(
            (ball) =>
              ball.x === current_position.x + 1 &&
              (ball.y === current_position.y - 1 ||
                ball.y === current_position.y ||
                ball.y === current_position.y + 1),
          );

          next_cell = neighbours.filter(
            (cell) =>
              cell.y === current_position.y &&
              cell.x === current_position.x + 1,
          )[0];

          if (next_cell !== undefined) {
            grid.set_cell(ball, CELL_TYPES.ball_absorb);

            _break = true;
            break;
          }

          if (neighbours.length > 0) {
            const neighbour = neighbours[0];

            if (neighbour.y === current_position.y + 1)
              dir = Directions.left_neighbour(dir);
            else dir = Directions.right_neighbour(dir);

            break;
          }

          current_position.x += 1;

          break;
      }
    } while (!grid.isEdge(current_position) && !_break);

    if (grid.get_cell(ball).value === CELL_TYPES.ball_absorb) return;

    if (current_position.equals(ball))
      grid.set_cell(current_position, CELL_TYPES.ball_reflect);
    else grid.set_cell(current_position, CELL_TYPES.ball_end);
  });
});
