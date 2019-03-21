function RemoveWasteElem(arrForSearching, arrWastedElem) {
  for (let row = 0; row < arrWastedElem.length; row++) {
    let index = arrForSearching.indexOf(arrWastedElem[row]);
    if (index > -1) {
      arrForSearching.splice(index, 1);
    }
  }
}

function FindExistElementsInRow_Col_Square(arrayForFinding, indexRow, indexCol) {

  function CheckElement(elem) {
    if (elem > 0) {
      if (resultArray.indexOf(elem) == -1) {
        resultArray.push(elem);
      }
    }
  }

  let resultArray = [];
  for (let i = 0; i < 9; i++) {
    CheckElement(arrayForFinding[indexRow][i]);
    CheckElement(arrayForFinding[i][indexCol]);
  }
  const indexRowSqr = Math.floor(indexRow / 3) * 3;
  const indexColSqr = Math.floor(indexCol / 3) * 3;
  for (let row = indexRowSqr; row < indexRowSqr + 3; row++) {
    for (let col = indexColSqr; col < indexColSqr + 3; col++) {
      CheckElement(arrayForFinding[row][col]);
    }
  }
  return resultArray;
}

function ReInitArray(arrayForInitialisation, indexRow, indexCol) {
  for (let col = 0; col < 9; col++) {
    let maskArray = arrayForInitialisation[indexRow][col];
    if (Array.isArray(maskArray)) {
      RemoveWasteElem(maskArray, FindExistElementsInRow_Col_Square(arrayForInitialisation, indexRow, col));
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
      RemoveWasteElem(maskArray, FindExistElementsInRow_Col_Square(arrayForInitialisation, row, indexCol));
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
        RemoveWasteElem(maskArray, FindExistElementsInRow_Col_Square(initSudoku, row, indexOfZero));
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
          return [row, col];
        }
      }
    }
    return true;
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

  let checking = IsAllElementsANumbers(arrayForSolving);
  if (checking === true) {
    return arrayForSolving;
  }
  let row = checking[0];
  let col = checking[1];
  let elem = arrayForSolving[row][col];
  let res = 0;
  for (let rowSubArr = 0; rowSubArr < elem.length; rowSubArr++) {
    let cloneArray = CloneArray(arrayForSolving);
    cloneArray[row][col] = elem[rowSubArr];
    if (ReInitArray(cloneArray, row, col) == 0) {
      continue;
    };
    res = localSolveSudoku(cloneArray);
    if (res !== 0) {
      if (IsAllElementsANumbers(res) === true) {
        return res;
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