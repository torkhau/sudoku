function RemoveWasteElem(arrForSearching, arrWastedElem) {
  for (let row = 0; row < arrWastedElem.length; row++) {
    let index = arrForSearching.indexOf(arrWastedElem[row]);
    if (index > -1) {
      arrForSearching.splice(index, 1);
    }
  }
}

function FindExistElementsInRow_Col(arrayForFinding, index, mode) {
  let resultArray = [];
  for (let i = 0; i < 9; i++) {
    let elem;
    switch (mode) {
      case "row": {
        elem = arrayForFinding[index][i];
        break;
      }
      case "col": {
        elem = arrayForFinding[i][index];
        break;
      }
    }
    if (elem > 0) {
      resultArray.push(elem);
    }
  }
  return resultArray;
}

function FindExistElementsInSquare(arrayForFinding, indexRow, indexCol) {
  let resultArray = [];
  let indexRowSqr = Math.floor(indexRow / 3);
  let indexColSqr = Math.floor(indexCol / 3);
  for (let row = indexRowSqr * 3; row < indexRowSqr * 3 + 3; row++) {
    for (let col = indexColSqr * 3; col < 3 * (indexColSqr + 1); col++) {
      const elem = arrayForFinding[row][col];
      if (elem > 0) {
        resultArray.push(elem);
      }
    }
  }
  return resultArray;
}

function AddUniqueElements(arrayForAdding, arrayElem) {
  for (let row = 0; row < arrayElem.length; row++) {
    if (arrayForAdding.indexOf(arrayElem[row]) == -1) {
      arrayForAdding.push(arrayElem[row]);
    }
  }
}

function ReInitArray(arrayForInitialisation, indexRow, indexCol) {
  for (let col = 0; col < 9; col++) {
    let maskArray = arrayForInitialisation[indexRow][col];
    if (Array.isArray(maskArray)) {
      let tempArray = FindExistElementsInRow_Col(arrayForInitialisation, indexRow, "row");
      AddUniqueElements(tempArray, FindExistElementsInRow_Col(arrayForInitialisation, col, "col"));
      AddUniqueElements(tempArray, FindExistElementsInSquare(arrayForInitialisation, indexRow, col));
      RemoveWasteElem(maskArray, tempArray);
      if (maskArray.length == 0) {
        return 0;
      }
      if (maskArray.length == 1) {
        arrayForInitialisation[indexRow][col] = maskArray[0];
        if (ReInitArray(arrayForInitialisation, indexRow, col) == 0) {
          return 0;
        };
        break;
      } else {
        arrayForInitialisation[indexRow][col] = maskArray;
      }
    }
  }
  for (let row = 0; row < 9; row++) {
    let maskArray = arrayForInitialisation[row][indexCol];
    if (Array.isArray(maskArray)) {
      let tempArray = FindExistElementsInRow_Col(arrayForInitialisation, row, "row");
      AddUniqueElements(tempArray, FindExistElementsInRow_Col(arrayForInitialisation, indexCol, "col"));
      AddUniqueElements(tempArray, FindExistElementsInSquare(arrayForInitialisation, row, indexCol));
      RemoveWasteElem(maskArray, tempArray);
      if (maskArray.length == 0) {
        return 0;
      }
      if (maskArray.length == 1) {
        arrayForInitialisation[row][indexCol] = maskArray[0];
        if (ReInitArray(arrayForInitialisation, row, indexCol) == 0) {
          return 0;
        };
        break;
      } else {
        arrayForInitialisation[row][indexCol] = maskArray;
      }
    }
  }
}

function InitArray(initSudoku) {
  let DoIteration = true;
  let row = 0;
  while (DoIteration) {
    DoIteration = false;
    let maskArray = [].concat(1, 2, 3, 4, 5, 6, 7, 8, 9);
    while (row < 9) {
      indexOfZero = initSudoku[row].indexOf(0);
      if (indexOfZero > -1) {
        DoIteration = true;
        let tempArray = FindExistElementsInRow_Col(initSudoku, row, "row");
        AddUniqueElements(tempArray, FindExistElementsInRow_Col(initSudoku, indexOfZero, "col"));
        AddUniqueElements(tempArray, FindExistElementsInSquare(initSudoku, row, indexOfZero));
        RemoveWasteElem(maskArray, tempArray);
        if (maskArray.length == 1) {
          initSudoku[row][indexOfZero] = maskArray[0];
          if (ReInitArray(initSudoku, row, indexOfZero) == 0) {
            return 0;
          };
        } else {
          initSudoku[row][indexOfZero] = maskArray;
        }
        break;
      }
      row++;
    }
  }
}


function localSolveSudoku(arrayForSolving) {

  function IsAllElementsANumbers(arr) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (Array.isArray(arr[row][col])) {
          return false
        }
      }
    }
    return true;
  }

  function FindeMinArrayElem(arrayForFinding) {
    let elem = 9;
    let res = [0, 0];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (Array.isArray(arrayForFinding[row][col])) {
          if (arrayForFinding[row][col].length < elem) {
            elem = arrayForFinding[row][col].length;
            res[0] = row;
            res[1] = col;
          }
        }
      }
    }
    return res;
  }

  function CloneArray(array) {
    let arr = [];
    for (let row = 0; row < array.length; row++) {
      const elem = array[row];
      if (Array.isArray(elem)) {
        arr.push(CloneArray(elem));
      } else {
        arr.push(elem);
      }
    }
    return arr;
  }
  
  if (IsAllElementsANumbers(arrayForSolving)) {
    return arrayForSolving;
  }
  let res = 0;
  let minArrayElem = FindeMinArrayElem(arrayForSolving);
  let row = minArrayElem[0];
  let col = minArrayElem[1];
  const elem = arrayForSolving[row][col];
  for (let rowSubArr = 0; rowSubArr < elem.length; rowSubArr++) {
    let cloneArray = CloneArray(arrayForSolving);
    cloneArray[row][col] = elem[rowSubArr];
    if (ReInitArray(cloneArray, row, col) == 0) {
      continue;
    };
    if (IsAllElementsANumbers(cloneArray)) {
      return cloneArray;
    } else {
      res = localSolveSudoku(cloneArray);
      if (res !== 0) {
        if (IsAllElementsANumbers(res)) {
          return res;
        }
      }
    }
  }
  return res;
}

module.exports = function solveSudoku(matrix) {
  if (InitArray(matrix) == 0) {
    return 0;
  } else {
    return localSolveSudoku(matrix);
  }
}