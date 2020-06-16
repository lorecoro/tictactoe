let columns = 5;
let rows = 5;
let end = false;
let matrix = [];

const buildRow = (x, y) => {
    let row = '<tr>';
    let tdClass = 'cell';
    for (let i = 1; i <= x; i++) {
        if (i <= 3 || i > (columns - 3) || y <= 3 || y > (rows - 3)) {
            tdClass = 'offset';
        }
        else {
            tdClass = 'cell';
        };
        row += `<td data-x="${i}" data-y="${y}" class="${tdClass}"></td>`;
    }
    row += '</tr>';
    return row;
}

const buildTable = (x, y) => {
    let table = '<table id="table">';
    for (let i = y; i >= 1; i--) {
        table += buildRow(x, i);
    }
    table += '</table>';
    return table;
}

const resetBoard = () => {
    const board = document.getElementById("board");
    board.innerHTML = buildTable(columns, rows);
    const table = document.getElementById("table");
    table.addEventListener("mousedown", clickEvent);
    const messagenode = document.getElementById("message");
    messagenode.innerHTML = '';
    end = false;
}

const expandBoard = (xo) => {
    const board = document.getElementById("board");
    board.innerHTML = buildTable(columns, rows);
    const table = document.getElementById("table");
    table.addEventListener("mousedown", clickEvent);

    if (matrix.length === 0) {
        matrix[1] = [];
        matrix[1][1] = xo;
    }
        // Cycle thru all the td's and restore the values from the matrix.
        const cells = document.getElementsByTagName('td');
        let x, y, value;
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].hasAttribute('data-x') && cells[i].className === 'cell') {
                x = parseInt(cells[i].dataset.x) - 3;
                y = parseInt(cells[i].dataset.y) - 3;
                if (matrix.length > y) {
                    if (matrix[y].length > x) {
                        cells[i].innerText = matrix[y][x];
                    }
                }
            }
        }
}

const buildMatrix = () => {
    // Create a matrix where to store the values.
    // The matrix is an array of rows, and a row is an array of cells.
    for (let i = 1; i <= (rows - 6); i++) {
        matrix[i] = [];
        for (let j = 1; j <= (columns - 6); j++) {
            matrix[i][j] = '';
        }
    }

    // Cycle thru all the td's and store the values in the matrix.
    const cells = document.getElementsByTagName('td');
    // let filled = 0;
    let x, y, value;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].hasAttribute('data-x') && cells[i].className === 'cell') {
            x = parseInt(cells[i].dataset.x) - 3;
            y = parseInt(cells[i].dataset.y) - 3;
            value = cells[i].innerText;
            matrix[y][x] = value;
            // if (value !== '') filled++;
        }
    }

    // if (filled === rows*columns) {
    //     end = true;
    //     return false;
    // }
}

const shiftMatrix = (x, y, xo) => {
    const rowsToAddBelow = 4 - y;
    const rowsToAddAbove = y - (rows - 3);
    const columnsToAddLeft = 4 - x;
    const columnsToAddRight = x - (columns - 3);
    let newMarcX, newMarcY;
    
    if (rowsToAddBelow > 0) {
        // unshift, + and concat cannot be used because they skip keys
        let newMatrix = [];
        let i;
        for (i = 1; i <= rowsToAddBelow; i++) {
            newMatrix[i] = [];
            for (let j = 1; j <= (columns - 6); j++) {
                newMatrix[i][j] = '';
            }
        }
        for (let j = 1; j < matrix.length; j++) {
            newMatrix[j + i -1] = matrix[j];
        }
        matrix = newMatrix;
    }

    if (rowsToAddAbove > 0) {
        let newMatrix = [];
        for (let j = 1; j <= matrix.length; j++) {
            newMatrix[j] = matrix[j];
        }
        let i;
        for (i = 1; i <= rowsToAddAbove; i++) {
            newMatrix[i + matrix.length - 1] = [];
            for (let j = 1; j <= (columns - 6); j++) {
                newMatrix[i + matrix.length - 1][j] = '';
            }
        }
        matrix = newMatrix;
    }

    if (columnsToAddLeft > 0) {
        let newMatrix = [];
        for (let i = 1; i < matrix.length; i++) {
            newMatrix[i] = [];
            for (let c = 1; c <= columnsToAddLeft; c++) {
                newMatrix[i][c] = '';
            }
            for (let j = 1; j < matrix[i].length; j++) {
                newMatrix[i][j + columnsToAddLeft] = matrix[i][j];
            }
        }
        matrix = newMatrix;
    }

    if (columnsToAddRight > 0) {
        let newMatrix = [];
        for (let i = 1; i < matrix.length; i++) {
            newMatrix[i] = [];
            let j;
            for (j = 1; j < matrix[i].length; j++) {
                newMatrix[i][j] = matrix[i][j];
            }
            for (let c = 0; c < columnsToAddRight; c++) {
                newMatrix[i][c + j] = '';
            }
        }
        matrix = newMatrix;
    }

    newMarcY = (rowsToAddBelow > 0) ? 1 : (-1 * rowsToAddBelow) + 1;
    newMarcX = (columnsToAddLeft > 0) ? 1 : (-1 * columnsToAddLeft) + 1;
    matrix[newMarcY][newMarcX] = xo;
}

const checkWinner = (x, y, xo) => {
    if (x <= 0) x = 1;
    if (y <= 0) y = 1;
    let message = '';
    
    // Check the row.
    let count = 0;
    for (let i = 1; i <= (columns - 6); i++) {
        if (matrix.length > y) {
            if (matrix[y].length > i) {
                if (matrix[y][i] === xo) {
                    count++;
                    if (count === 5) return "The winner is " + xo;
                }
                else {
                    count = 0;
                }
            }
        }
    }

    // Check the column.
    count = 0;
    for (let i = 1; i <= (rows - 6); i++) {
        if (matrix.length > i) {
            if (matrix[i].length > x) {
                if (matrix[i][x] === xo) {
                    count++;
                    if (count === 5) return "The winner is " + xo;
                }
                else {
                    count = 0;
                }
            }
        }
    }

    // Check the diagonals.
    count = 0;
    // Diagonal /
    if (rows > 6 && columns > 6) {
        const starting_row = 0;
        const starting_column = x - y;
        const limit = (rows < columns ? rows : columns);
        for (let i = 1; i <= (limit - 6); i++) {
            if (matrix.length > (starting_row + i)) {
                if (matrix[starting_row + i].length > (starting_column + i)) {
                    if (matrix[starting_row + i][starting_column + i] === xo) {
                        count++;
                        if (count === 5) return "The winner is " + xo;
                    }
                    else {
                        count = 0;
                    }
                }
            }
        }
    }
    count = 0;
    // Diagonal \
    if (rows > 6 && columns > 6) {
        const starting_row = rows - 6;
        const starting_column = x + y - starting_row;
        const limit = (rows < columns ? rows : columns);
        for (let i = 0; i < (limit - 6); i++) {
            if (matrix.length > (starting_row - i) ) {
                if (matrix[starting_row - i].length > (starting_column + i)) {
                    if (matrix[starting_row - i][starting_column + i] === xo) {
                        count++;
                        if (count === 5) return "The winner is " + xo;
                    }
                    else {
                        count = 0;
                    }
                }
            }
        }
    }

    if (message !== '') return message;
    return '';
}

const clickEvent = (event) => {
    // Check if the game has ended already.
    if (end) return;
    // Check if the cell has a value already.
    if (event.target.innerText !== '') return;
    const currentPlayer = document.getElementById("current-player");
    let xo = currentPlayer.innerText;
    event.target.innerHTML = xo;

    let x = parseInt(event.target.dataset.x);
    let y = parseInt(event.target.dataset.y);

    buildMatrix();

    // If an external cell was clicked, update the board.
    if (event.target.className === 'offset') {
        // The first click will always change to board to 7x7, no matter where the click was made.
        if (rows === 5 && columns === 5) {
            rows = 7;
            columns = 7;
            x = 4;
            y = 4;
        }
        else {
            shiftMatrix(x, y, xo);
            if (x <= 3) {
                columns = columns + (3 - x + 1);
            }
            if (x > columns - 3) {
                columns = x + 3;
            }
            if (y <= 3) {
                rows = rows + (3 - y + 1);
            }
            if (y > rows - 3) {
                rows = y + 3;
            }
        }
        expandBoard(xo);
    }

    const message = checkWinner(x - 3, y - 3, xo);
    if (message !== '') {
        const messagenode = document.getElementById("message");
        messagenode.innerHTML = message;
        if (!end) {
            alert(`Player ${(xo === "x" ? 1 : 2)} won!`);
        }
        end = true;
    };
    xo = (xo === "x") ? "o" : "x";
    currentPlayer.innerText = xo;
}

const initializeCode = () => {
    console.log("Initializing");
    let button = document.getElementById("reset");
    button.addEventListener("click", event => {
        resetBoard();
        event.stopPropagation();
    });
}

initializeCode();
resetBoard();

