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
    });
    input.addEventListener("click", function () {
      const range = document.createRange();
      range.selectNodeContents(this);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      let i = parseInt(this.getAttribute("data-row"));
      let j = parseInt(this.getAttribute("data-col"));
      const cell = document.querySelector(`.cell-${i}-${j}`);
    });
  }
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

 
  
  function displaySolution(arr) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = document.querySelector(`.cell-${i}-${j}`);
        cell.classList.add('rotate-box');
        cell.textContent = arr[i][j] !== 0 ? arr[i][j] : "";
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


const generate=document.getElementById("solve-btn");
generate.addEventListener('click',()=>{
  solve(arr);
  displaySolution(arr);
});