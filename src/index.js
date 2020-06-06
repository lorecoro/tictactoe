const x = 5;
const y = 5;

const buildrow = (x, y) => {
  let row = "<tr>";
  for (let i = 1; i <= x; i++) {
    row += `<td data-x="${i}" data-y="${y}" class="cell"></td>`;
  }
  row += "</tr>";
  return row;
};

const buildtable = (x, y) => {
  let table = '<table id="table">';
  for (let i = y; i >= 1; i--) {
    table += buildrow(x, i);
  }
  table += "</table>";
  return table;
};

const clickEvent = event => {
  console.log(event.target.dataset.x, event.target.dataset.x);
  const currentPlayer = document.getElementById("current-player");
  let xo = currentPlayer.innerText;
  event.target.innerHTML = xo;
  xo = xo === "X" ? "O" : "X";
  currentPlayer.innerText = xo;
};

const board = document.getElementById("board");
board.innerHTML = buildtable(x, y);
const table = document.getElementById("table");
table.addEventListener("mousedown", clickEvent);
