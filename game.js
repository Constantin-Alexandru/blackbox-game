let sizeInput = document.getElementById('size');
let createBtn = document.querySelector('.update');
let generateBtn = document.querySelector('.generate');
let gridWrapper = document.querySelector('.grid-wrapper');
let grid = document.querySelector('.grid');


let roadPaths = []
let atoms = []
let rayOrigins = []
let rayPoints = []
let cells = []
let rows = []

let size = 10

let north = 1;
let east = 2;
let south = 3;
let west = 4;

function eq(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function includes(arr1, arr2) {
  for(let i = 0; i < arr1.length; i++)
    if(eq(arr1[i], arr2))
      return true;
  return false;
}

function opposite(dir)
{
  return dir == 1 ? 3 : dir == 2 ? 4 : dir == 3 ? 1 : dir == 4 ? 2 : 0;
}

function traversePath(dir, position, steps) {
  let corners = [[position[0] - 1, position[1] - 1], [position[0] - 1, position[1] + 1], [position[0] + 1, position[1] - 1], [position[0] + 1, position[1] + 1]]

  let i = position[0];
  let j = position[1];

  if(steps == 0)
  {
    if(atoms.some(atom => includes(corners, atom)))
      return;
    
    if(i == 0)
      traversePath(south, [position[0] + 1, position[1]], 1)
    else if(j == 0)
      traversePath(east, [position[0], position[1] + 1], 1)
    else if(i == size - 1)
      traversePath(north, [position[0] - 1, position[1]], 1)
    else 
      traversePath(west, [position[0], position[1] - 1], 1)
  
    return;
  }

  if(i <= 0 || j <= 0 || i >= size - 1 || j >= size - 1)
  {
    rayPoints.push([position[0], position[1], opposite(dir), 0]);
    return;
  }

  if(dir === north)
  {
    if(includes(atoms, corners[0]) && includes(atoms, corners[1])){
      rayPoints.push([position[0], position[1], opposite(dir), south])
      traversePath(south, [position[0] + 1, position[1]], steps + 1)}
    else if(includes(atoms, corners[0])){
      rayPoints.push([position[0], position[1], opposite(dir), east])
      traversePath(east, [position[0], position[1] + 1], steps + 1)}
    else if(includes(atoms, corners[1])){
      rayPoints.push([position[0], position[1], opposite(dir), west])
      traversePath(west, [position[0], position[1] - 1], steps + 1)}
    else {
      rayPoints.push([position[0], position[1], opposite(dir), north])
      traversePath (north, [position[0] - 1, position[1]], steps + 1)}
  }
  else if(dir === south)
  {
    if(includes(atoms, corners[2]) && includes(atoms, corners[3])){
      rayPoints.push([position[0], position[1], opposite(dir), north])
      traversePath(north, [position[0] - 1, position[1]], steps + 1)}
    else if(includes(atoms, corners[2])){
      rayPoints.push([position[0], position[1], opposite(dir), east])
      traversePath(east, [position[0], position[1] + 1], steps + 1)}
    else if(includes(atoms, corners[3])){
      rayPoints.push([position[0], position[1], opposite(dir), west])
      traversePath(west, [position[0], position[1] - 1], steps + 1)}
    else {
      rayPoints.push([position[0], position[1], opposite(dir), south])
      traversePath(south, [position[0] + 1, position[1]], steps + 1)}
  }
  else if(dir === east)
  {
    if(includes(atoms, corners[1]) && includes(atoms, corners[3])){
      rayPoints.push([position[0], position[1], opposite(dir), west])
      traversePath(west, [position[0], position[1] - 1], steps + 1)}
    else if(includes(atoms, corners[1])){
      rayPoints.push([position[0], position[1], opposite(dir), south])
      traversePath(south, [position[0] + 1, position[1]], steps + 1)}
    else if(includes(atoms, corners[3])){
      rayPoints.push([position[0], position[1], opposite(dir), north])
      traversePath(north, [position[0] - 1, position[1]], steps + 1)}
    else {
      rayPoints.push([position[0], position[1], opposite(dir), east])
      traversePath(east, [position[0], position[1] + 1], steps + 1)}
  }
  else if(dir == west)
  {
    if(includes(atoms, corners[0]) && includes(atoms, corners[3])){
      rayPoints.push([position[0], position[1], opposite(dir), east])
      traversePath(east, [position[0], position[1] + 1], steps + 1)}
    else if(includes(atoms, corners[0])){
      rayPoints.push([position[0], position[1], opposite(dir), south])
      traversePath(south, [position[0], position[1] + 1], steps + 1)}
    else if(includes(atoms, corners[3])){
      rayPoints.push([position[0], position[1], opposite(dir), north])
      traversePath(north, [position[0], position[1] - 1], steps + 1)}
    else {
      rayPoints.push([position[0], position[1], opposite(dir), west])
      traversePath(west, [position[0], position[1] - 1], steps + 1)}
  }
}

function deletePaths() {
  rayPoints = []
  
  for(let i = 0; i < roadPaths.length; i++)
  {
    roadPaths[i].remove();
  }
  
  roadPaths = [];
}

function generatePaths() {
  rayOrigins.forEach(rayOrigin => {
    traversePath(0, rayOrigin, 0);
  });

  rayPoints.forEach(rayPoint => {
    let entryPath = document.createElement('div');
    let exitPath = document.createElement('div');
    
    let entryClass = rayPoint[2] == 1 ? 'north' : rayPoint[2] == 2 ? 'east' : rayPoint[2] == 3 ? 'south' : rayPoint[2] == 4 ? 'west' : '';
    let exitClass = rayPoint[3] == 1 ? 'north' : rayPoint[3] == 2 ? 'east' : rayPoint[3] == 3 ? 'south' : rayPoint[3] == 4 ? 'west' : '';
    
    if(entryClass.length > 0);
      entryPath.classList.add(entryClass);
    
    if(exitClass.length > 0)
      exitPath.classList.add(exitClass);
    
    roadPaths.push(entryPath, exitPath);

    let cell = cells[rayPoint[0]][rayPoint[1]]

    cell.appendChild(entryPath);
    cell.appendChild(exitPath);
  })

  console.log('Generated');
  console.log(rayPoints);
}

function deleteGrid()
{
  atoms = [];
  rayOrigins = [];
  rayPoints = [];
  cells = [];
  rows = [];

  grid.remove();
  grid = document.createElement('div');
  grid.classList.add('grid');
  gridWrapper.appendChild(grid);
}

function createGrid()
{

  for(let i = 0; i < size; i++)
  {
    let row = document.createElement('div');
    row.classList.add('row');

    let cellRow = [];

    for(let j = 0; j < size; j++)
    {
      let cell = document.createElement('div');
      cell.classList.add('cell');

      if(i == 0 || j == 0 || i == size - 1 || j == size - 1)
      {
        cell.classList.add('ext');
        cell.onclick = (e) => {
          
          if(cell.hasChildNodes())
          {
            cell.innerHTML = '';
            rayOrigins.splice(rayOrigins.indexOf([i,j]), 1);
            return;
          }

          let rayOrigin = document.createElement('div');
          rayOrigin.classList.add('ray-origin');
          rayOrigins.push([i, j])
          e.target.appendChild(rayOrigin);
        }
        if((i == 0 && j == 0) || (i == 0 && j == size - 1) || (i == size - 1 && j == 0) || (i == size - 1 && j == size - 1))
          cell.onclick = () => {}
      }
      else {
        cell.classList.add('int');
        cell.onclick = (e) => { 

          if(cell.hasChildNodes())
          {
            cell.innerHTML = '';
            atoms.splice(atoms.indexOf([i,j]), 1);
            return;
          }


          let atom = document.createElement('div');
          atom.classList.add('atom');
          e.target.appendChild(atom);
          atoms.push([i, j]);
         }
      }

      row.appendChild(cell);
      cellRow.push(cell);
    }

    grid.appendChild(row);
    rows.push(row);
    cells.push(cellRow);
  }
}

function setup()
{
  console.log("Setting up");
  sizeInput.value = `${size - 2}`;

  sizeInput.onchange = (e) => { size = parseInt(e.target.value) + 2; console.log(`Size: ${size}`);}

  createBtn.onclick = (e) => {deleteGrid(); createGrid();};
  generateBtn.onclick = () => {deletePaths(); generatePaths();};

  createGrid();
}

setup()