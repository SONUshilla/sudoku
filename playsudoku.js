const grid = document.querySelector(".box");
let arr = [];
for (let i = 0; i < 9; i++) {
  let arr1 = [];
  for (let j = 0; j < 9; j++) {
    arr1.push(" ");
  }
  arr.push(arr1);
}
for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    const input = document.createElement("div");
    if ((i+1) % 3 == 0 && (i+1)<9) {
      input.style.borderBottom = "1.5px solid red";
    }
    if ((j + 1) % 3 == 0 && (j+1)<9) {
      input.style.borderRight = "1.5px solid red";
    }
    input.type = "number";
    input.name = "input";
    input.innerText = arr[i][j];
    input.classList.add("grid");
    input.classList.add(`cell-${i}-${j}`);
    input.setAttribute("data-row", i);
    input.setAttribute("data-col", j);
    input.contentEditable = true;
    grid.appendChild(input);
    input.addEventListener("input", function () {
      let i = parseInt(this.getAttribute("data-row"));
      let j = parseInt(this.getAttribute("data-col"));
      arr[i][j] = this.textContent.trim(); // safer and more reliable
      let value = this.textContent.trim();
      if (timerstart === false) {
        timerchange(); // Don't set timerstart yourself
      }
      // Only allow digits 1-9
      if (/^[1-9]$/.test(value)) {
        arr[i][j] = value;
        this.style.color = "blue";
      } else {
        // If invalid, clear it and reset style
        this.textContent = " ";
        arr[i][j] = " ";
        this.style.color = "black";
      }
      if(!isValidSudoku(arr))
      {
        this.style.color = "red";
      }
    });
    input.addEventListener("click", handleInputClick);
  }
}
function handleInputClick(e) {
    const range = document.createRange();
    range.selectNodeContents(this);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  
    let i = parseInt(this.getAttribute("data-row"));
    let j = parseInt(this.getAttribute("data-col"));
    const cell = document.querySelector(`.cell-${i}-${j}`);
  }
function isValidSudoku(arr) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (arr[i][j] == 0) {
        continue;
      }
      for (let k = 0; k < 9; k++) {
        if (arr[k][j] == arr[i][j] && k != i) return false;
        if (arr[i][k] == arr[i][j] && k != j) return false;
        let startRow = Math.floor(i / 3) * 3;
        let startCol = Math.floor(j / 3) * 3;
        let row = startRow + Math.floor(k / 3);
        let col = startCol + (k % 3);
        if (row !== i || col !== j) {
          if (arr[row][col] === arr[i][j]) return false;
        }
      }
    }
  }
  return true;
}
function shuffle(ele) {
  for (let i = ele.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // 0 ≤ j ≤ i
    [ele[i], ele[j]] = [ele[j], ele[i]]; // Swap
  }
}

let originalArr = []; // This will store the backup
  
function displaySolution(arr) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.querySelector(`.cell-${i}-${j}`);
      
      // Reset styles and classes
      cell.style.color = "black";
      cell.classList.remove("readonly", "rotate-box");

      // Reset contentEditable for all cells
      cell.setAttribute('contenteditable', arr[i][j] == 0);

      // Set new content
      cell.textContent = arr[i][j] !== 0 ? arr[i][j] : "";

      // Reapply readonly style for non-empty cells
      if (arr[i][j] != 0) {
        cell.classList.add("readonly");
        cell.setAttribute("contenteditable", false);
      }

      // Optional: re-add animation if needed
      cell.classList.add('rotate-box');
    }
  }
}

  
function solve(arr, i = 0, j = 0) {
  if (i == 9) 
    {
        
    return true;
    }
  let ui, uj;
  if (j == 8) {
    ui = i + 1;
    uj = 0;
  } else {
    ui = i;
    uj = j + 1;
  }
  if (arr[i][j] != 0) {
    return solve(arr, ui, uj); // Skip filled cells
  }

  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffle(nums);

  for (let num of nums) {
    arr[i][j] = num;
    if (isValidSudoku(arr) && solve(arr, ui, uj)) {
      return true;
    }
    arr[i][j] = 0; // Backtrack
  }
  return false;
}


let timerInterval;
let seconds = 0;
const timerEl = document.getElementById("timer");
const soundToggle = document.getElementById("sound-toggle");
let soundOn = false;

// Timer function
function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerEl.textContent = `${mins}:${secs}`;
  }, 1000);
}
startTimer();
// Toggle sound
soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? '🔊' : '🔇';
  if(soundOn){
    audio.loop = true;
    audio.play();
  }
  else  audio.pause();
});
const audio = new Audio('./lofi-chill-374877.mp3'); // adjust path as needed

// Call startTimer on page load

let t = false; // use let so you can reassign
let timerstart = true;
const pauseBtn = document.getElementById('pause-btn');

pauseBtn.addEventListener('click', () => {
  if (timerstart) {
    clearInterval(timerInterval);
    pauseBtn.textContent = '▶';
    pauseBtn.title = 'Start Timer';
  } else {
    startTimer();
    pauseBtn.textContent = '⏸';
    pauseBtn.title = 'Pause Timer';
  }
  timerstart = !timerstart;
});



    function removeCells(board, count = 60) {
        let removed = 0;
        while (removed < count) {
          let i = Math.floor(Math.random() * 9);
          let j = Math.floor(Math.random() * 9);
      
          if (board[i][j] !== 0) {
            board[i][j] = 0;
            removed++;
          }
        }
      }

      const restartBtn = document.getElementById("restart-btn");
      restartBtn.addEventListener('click',()=>{
        arr=originalArr;
        displaySolution(arr);
        clearInterval(timerInterval); // Prevent multiple timers
        seconds=0;
        startTimer();
      })
      const newBtn = document.getElementById("new-btn");
      const alertBox = document.getElementById("custom-alert");
      const confirmBtn = document.getElementById("confirm-btn");
      const cancelBtn = document.getElementById("cancel-btn");
      let open=false;
      newBtn.addEventListener('click',()=>{
        if(open)
        {
            alertBox.classList.add("hidden");
        }
        else{
            alertBox.classList.remove("hidden");
        }
        open=!open;
      })
      confirmBtn.addEventListener('click',()=>{
        starNewGame();
        alertBox.classList.add("hidden");
        open=false;
           clearInterval(timerInterval); // Prevent multiple timers
        seconds=0;
        startTimer();
      })
      cancelBtn.addEventListener('click',()=>{
        alertBox.classList.add("hidden");
        open=false;
      })
    function starNewGame() {
        // Replace with real navigation
        solve(arr);
        removeCells(arr);
        displaySolution(arr);
      }


  function startPlay() {
    // Replace with real navigation
    solve(arr);
    // backup original solution
    removeCells(arr);
    originalArr = JSON.parse(JSON.stringify(arr));
    displaySolution(arr);
  }
startPlay();

const boxes = document.querySelectorAll('.rotate-box');

boxes.forEach((box, index) => {
  const row = Math.floor(index / 9);     // Row number (0 to 8)
  const col = index % 9;                 // Column number (0 to 8)
  const delay = (row + col) * 0.05;      // Diagonal wave: sum of row + col
  box.style.animationDelay = `${delay}s`;
});
