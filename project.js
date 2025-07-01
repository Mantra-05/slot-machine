let balance = 0;
const rows = 3;
const cols = 3;

const symbols_count = {
  A: 3,
  B: 4,
  C: 6,
  D: 8
};

const symbols_value = {
  A: 5,
  B: 4,
  C: 3,
  D: 2
};

function updateBalance() {
  document.getElementById("balance").innerText = `Balance: $${balance}`;
}

function makeDeposit() {
  const amount = parseFloat(document.getElementById("deposit").value);
  if (isNaN(amount) || amount <= 0) {
    alert("Invalid deposit amount");
    return false;
  }
  balance += amount;
  updateBalance();
  document.getElementById("deposit").value = "";
  return true;
}


function getSymbolsPool() {
  const symbols = [];
  for (const [symbol, count] of Object.entries(symbols_count)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  return symbols;
}

function spinReels() {
  const reels = [];
  for (let i = 0; i < cols; i++) {
    const symbols = getSymbolsPool();
    const column = [];
    for (let j = 0; j < rows; j++) {
      const rand = Math.floor(Math.random() * symbols.length);
      column.push(symbols[rand]);
      symbols.splice(rand, 1);
    }
    reels.push(column);
  }
  return reels;
}

function displayReels(reels) {
  const reelDiv = document.getElementById("reels");
  reelDiv.innerHTML = "";

  for (let row = 0; row < rows; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "reels-row";

    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.innerText = reels[col][row];
      rowDiv.appendChild(cell);
    }

    reelDiv.appendChild(rowDiv);
  }
}

function calculateWinnings(reels, bet, lines) {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbol = reels[0][row];
    let matched = true;
    for (let col = 1; col < cols; col++) {
      if (reels[col][row] !== symbol) {
        matched = false;
        break;
      }
    }
    if (matched) {
      winnings += bet * symbols_value[symbol];
    }
  }
  return winnings;
}

function spin() {
  if (balance <= 0) {
    alert("Your balance is $0. Please deposit to continue.");
    return;
  }

  const lines = parseInt(document.getElementById("lines").value);
  const bet = parseFloat(document.getElementById("bet").value);
  const msg = document.getElementById("message");

  if (isNaN(lines) || lines <= 0 || lines > 3) {
    alert("Enter a valid number of lines (1-3)");
    return;
  }

  if (isNaN(bet) || bet <= 0) {
    alert("Enter a valid bet amount");
    return;
  }

  if (bet * lines > balance) {
    alert("Insufficient balance for this bet");
    return;
  }

  const reels = spinReels();
  displayReels(reels);
  const winnings = calculateWinnings(reels, bet, lines);
  balance += winnings - (bet * lines);
  updateBalance();

  msg.innerText = `You won: $${winnings}`;
}

