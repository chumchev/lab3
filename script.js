var matrixInputs = [];

//создание инпутов для ввода матрицы
function createMatrixInputs(node) {
  matrixInputs = []
  
var size = document.getElementsByClassName("matrix-size")[0].value
  size = document.getElementsByClassName("matrix-size")[0].value 

  if(node.rows.length != 0) {
    for (var i = node.rows.length -1; i >= 0; i -= 1) {
      var row = node.deleteRow(i)
    }
  }


    for (var i = 0; i < size; i += 1) {
      var row = node.insertRow()
      var inputsRow = []
      matrixInputs.push(inputsRow)
      for (var j = 0; j < size; j += 1) {
        var cell = row.insertCell()
        var input = document.createElement('input')
        inputsRow.push(input)
        input.type = 'text'
        input.style.width = '1em'
        cell.appendChild(input)
      }
    }
    return matrixInputs
  }

  
  //получить значения матрицы
function getMatrixValues(matrixInputs) {
    var res = []
    for (var i = 0; i < matrixInputs.length; i += 1) {
        var inputsRow = matrixInputs[i]
        var valuesRow = []
        for (var j = 0; j < inputsRow.length; j += 1) {
            var input = inputsRow[j]
            var valueNum = parseFloat(input.value)
            if (isNaN(valueNum)) {
                valueNum = 0
            }
            valuesRow.push(valueNum)
        }
        res.push(valuesRow)
    }
    return res
}

function outConsole() {
    var matrix = getMatrixValues(matrixInputs)
    console.log('matrix', matrix)
}



//транспонирование
function TransMatrix(A)       //На входе двумерный массив
{
    var m = A.length, n = A[0].length, AT = [];
    for (var i = 0; i < n; i++)
     { AT[ i ] = [];
       for (var j = 0; j < m; j++) AT[ i ][j] = A[j][ i ];
     }
    return AT;
}

//сложение
function SumMatrix(A,B)       //На входе двумерные массивы одинаковой размерности
{   
    var m = A.length, n = A[0].length, C = [];
    for (var i = 0; i < m; i++)
     { C[ i ] = [];
       for (var j = 0; j < n; j++) C[ i ][j] = A[ i ][j]+B[ i ][j];
     }
    return C;
}


//умножение
function MultiplyMatrix(A,B)
{
    var rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA != rowsB) return false;
    for (var i = 0; i < rowsA; i++) C[ i ] = [];
    for (var k = 0; k < colsB; k++)
     { for (var i = 0; i < rowsA; i++)
        { var t = 0;
          for (var j = 0; j < rowsB; j++) t += A[ i ][j]*B[j][k];
          C[ i ][k] = t;
        }
     }
    return C;
}

//в степень
function MatrixPow(n,A)
{ 
    if (n == 1) return A;     // Функцию MultiplyMatrix см. выше
    else return MultiplyMatrix( A, MatrixPow(n-1,A) );
}

//получить матрицу достижимости
function reachabilityMatrix() {
    var adjency = getMatrixValues(matrixInputs);
    var size = document.getElementsByClassName("matrix-size")[0].value;
    // var adjency = [
    //     [0,1,0,0,1,1,0,0,0,0],
    //     [1,0,0,0,0,0,0,0,0,0],
    //     [0,1,0,1,1,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,1,0],
    //     [1,0,0,0,0,0,1,0,0,0],
    //     [0,0,0,0,1,0,0,1,0,1],
    //     [0,0,0,1,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,1,0,0,1],
    //     [0,0,0,0,0,0,1,0,0,0],
    //     [0,0,0,0,0,0,0,1,0,0]
    // ];
    // var adjency = [
    //   [0,1,1,0],
    //   [0,0,0,0],
    //   [0,1,0,1],
    //   [0,0,1,0]
    // ];
    // var size = 10;
    // var size = 4;
  
    var reachability = [];
    for(var i = 0; i < size; i++) { 
        reachability[i] = new Array;
        for (var j = 0; j < size; j++){
            if(i == j)
                reachability[i][j] = 1;
            else 
                reachability[i][j] = 0;
        }
    }
    for (var k = 0; k < size-1; k++) {
        var tmp = MatrixPow(k+1,adjency);
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                reachability[i][j] = reachability[i][j] || tmp[i][j];
            }
        }
    }

    // console.log('reachability',reachability);
    return reachability;
}

//получить матрицу контрдостижимости
function counterreachabilityMatrix() {
    var reachability = reachabilityMatrix();
    var counterreachability = TransMatrix(reachability);

    // console.log('counterreachability',counterreachability);
    return counterreachability;
}

//обнуление столбца
function deleteColumn(matrix, size, n) {
    for (var i = 0; i < size; i++) {
        matrix[i][n] = 0;
    }
    return matrix;
}

//пересечение массивов
function IntersecArrays(A,B)
{
    var m = A.length, n = B.length, c = 0, C = [];
    for (var i = 0; i < m; i++)
     { var j = 0, k = 0;
       while (B[j] !== A[ i ] && j < n) j++;
       while (C[k] !== A[ i ] && k < c) k++;
       if (j != n && k == c) C[c++] = A[ i ];
     }

   return C;
}

//сумма элементов двумерного масиива
function sumMatrix(matrix) {
    // var rowSumms = [];
    // for (var rowIndex = 0; rowIndex < matrix.length; rowIndex += 1) {
    //     var row = matrix[rowIndex];
    //     rowSumms[rowIndex] = row.reduce(function(sum, current) {
    //         return sum + current;
    //       }, 0);   
    // }
    // var matrixSum = rowSumms.reduce(function(sum, current) {
    //     return sum + current;
    //   }, 0);
    var length = matrix.reduce(function(totalLength, subarr) {
        return totalLength + subarr.length;
      }, 0);

    return length;
}

function decomposition() {
  var adjency = getMatrixValues(matrixInputs);
  var size = document.getElementsByClassName("matrix-size")[0].value;
    // var adjency = [
    //     [0,1,0,0,1,1,0,0,0,0],
    //     [1,0,0,0,0,0,0,0,0,0],
    //     [0,1,0,1,1,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,1,0],
    //     [1,0,0,0,0,0,1,0,0,0],
    //     [0,0,0,0,1,0,0,1,0,1],
    //     [0,0,0,1,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,1,0,0,1],
    //     [0,0,0,0,0,0,1,0,0,0],
    //     [0,0,0,0,0,0,0,1,0,0]
    // ];
    // var adjency = [
    //   [0,1,1,0],
    //   [0,0,0,0],
    //   [0,1,0,1],
    //   [0,0,1,0]
    // ];
    // var size = 10;
    // var size = 4;

    var reachability = reachabilityMatrix();
    var counterreachability = counterreachabilityMatrix();
    var size = reachability.length;

    var R = [];
    var arrR = [];
    var Q = [];
    var arrQ = [];
    var G = [];
    
    
    for (var count = 0, n = 0; count < size; count++) {
        R = [];
        Q = [];
        for (var i = 0; i < size; i++) {
            if (reachability[count][i] == 1)
                R.push(i);
            
            if (counterreachability[count][i] == 1)   
                Q.push(i);
        }
        if (IntersecArrays(R, Q).length != 0) {
            arrR[n] = R;
            arrQ[n] = Q;
            G[n] = IntersecArrays(R, Q);

            for (var i = 0; i < G[n].length; i++) {
                reachability = deleteColumn(reachability, size, G[n][i]);
                counterreachability = deleteColumn(counterreachability, size, G[n][i]);
            }
            n++;
        }
    }   
  
    console.log('R',arrR);
    console.log('Q',arrQ);
    console.log('G',G);

    var arr1 = [];
    var arr2 = [];
    for (var i = 0; i < G.length; i++) { 
      arr1[i] = new Array;
      for (var j = 0; j < size; j++){
        arr1[i][j] = 0;
      }
    }
    for (var i = 0; i < size; i++) { 
      arr2[i] = new Array;
      for (var j = 0; j < G.length; j++){
        arr2[i][j] = 0;
      }
    }



    for (var i = 0; i < G.length; i++) {
      for (var j = 0; j < G[i].length; j++) {
        for (var k = 0; k < size; k++) {
          arr1[i][k] = adjency[G[i][j]][k] || arr1[i][k];
          arr2[k][i] = adjency[k][G[i][j]] || arr2[k][i];
        }
      }
    }

    var newAdjency = [];
    newAdjency = MultiplyMatrix(arr1, arr2);

    for (var i = 0; i < newAdjency.length; i++) {
      for (var j = 0; j < newAdjency[i].length; j++) {
        if (i == j)
          newAdjency[i][j] = 0;
        if (newAdjency[i][j] > 0)
          newAdjency[i][j] = 1;
      }
    }


    // console.log('arr1', arr1);
    // console.log('arr2', arr2);
    console.log('newAdjency', newAdjency);

    const dataEntry = document.querySelector('.dataEntry');

    var name = document.getElementById("left_incedence");

    for(let i = 0; i < G.length; i++){
      var i1 = i+1;
      dataEntry.innerHTML += `R`+'('+i1+')'+'[ '+ arrR[i].map(item => item+1) +' ]' + '<br>';
      dataEntry.innerHTML += `Q`+'('+i1+')'+'[ '+ arrQ[i].map(item => item+1) +' ]' + '<br>';
      dataEntry.innerHTML += `G`+'('+i1+')'+'[ '+ G[i].map(item => item+1) +' ]' + '<br><br>';
    }

    return newAdjency;

}

function left_inc() {
  var matrix = decomposition();
  // var matrix = getMatrixValues(matrixInputs)

  //  var matrix = [
  //   [0,1,0,0,0,0,0],
  //   [0,0,0,0,0,1,0],
  //   [1,0,0,0,1,0,1],
  //   [0,0,0,0,0,1,0],
  //   [0,1,0,1,0,0,0],
  //   [0,0,0,0,0,0,0],
  //   [0,1,0,1,0,0,0]
  // ]
 
  // var size = document.getElementsByClassName("matrix-size")[0].value
  var size = matrix.length;

  const dataEntry = document.querySelector('.dataEntry');

  var name = document.getElementById("left_incedence");

  mas = matrix.slice(0);
  valueOfInput = size;

  const lInc = document.querySelector('.dataEntry')

  for(let i = 0; i < valueOfInput; i++) {
    for(let j = 0; j < valueOfInput; j++) {
        if (mas[i][j] != 1) {
            mas[i][j] = '*';
        }
    }
  }

  for(let i = 0; i < valueOfInput; i++) {
      for(let j = 0; j < valueOfInput; j++) {
          if (mas[i][j] == 1) {
              mas[i][j] = i + 1;
          }
      }
  }

  let tmp = [];
  let newMasForA = [];
  for(let i = 0; i < valueOfInput; i++) {
      for(let j = 0; j < valueOfInput; j++) {
          if (mas[j][i] != '*') {
              tmp.push(mas[j][i]);
          }
      }
      newMasForA.push(tmp);
      tmp = [];
  }

  for(let i = 0; i < newMasForA.length; i++){
    var i1 = i+1
    dataEntry.innerHTML += `G<sup>-</sup>`+'('+i1+')'+'[ '+ newMasForA[i]+' ]' + '<br>'
  }

  console.log(newMasForA)

}






function testf(node) {
    var size = document.getElementsByClassName("matrix-size")[0].value
    for (var i = 0; i < size; i++) {
        var row = node.insertRow()
        var inputsRow = []
        matrixInputs.push(inputsRow)
        for (var j = 0; j < size; j++) {
            var cell = row.insertCell()        
            var number = document.createTextNode(i-j)
            cell.appendChild(number)
        }
    }
}














/////////////
        //матрцу смежности в инцидентности
//     function adjacency_to_incidence(matrixInputs) {
//         var sm = getMatrixValues(matrixInputs) 
//         var incidence = [];
//         var N = sm.length
        

//           var connection = 0;
//           for(var i = 0; i < N; i++)
//             for(var j = 0; j < N; j++) 
//               if(sm[i][j]) 
//                 connection++

//           for(var i=0; i<N; i++) { 
//             incidence[i] = new Array
//             for (var j=0;j<connection;j++){
//               incidence[i][j]=0;
//             }
//           }

//           var k = 0
//           for(var i=0; i<N; i++) {
//             for(var j=0; j<N; j++) {
//               if (sm[i][j]) {
//                 incidence[i][k] = 1
//                 incidence[j][k] = -1;
//                 k++;  
//               }
//             }
//           }

//         return incidence;
//     }

//     //вывод матрицы инцидентности
//     function outIncidence(node) {
//         var size = document.getElementsByClassName("matrix-size")[0].value
//         var incidence =  adjacency_to_incidence(matrixInputs)
      
//         if (incidence[0][0] !=1) {
//           alert(Ошибка)
//           return 0
//         }
      
//         var name = document.getElementById("name_inc")
//         name.style.display = 'block'
      
//         for (var i = 0; i < size; i++) {
//           var row = node.insertRow()
//           var inputsRow = []
//           matrixInputs.push(inputsRow)
//           for (var j = 0; j < incidence[0].length; j++) {
//             var cell = row.insertCell()  
//             var number = document.createTextNode(incidence[i][j])
//             cell.appendChild(number)
//           }
//         }
      
//       }
//   //получить множество левых инциденций
// function left_inc() {
//    var matrix = [
//     [0,1,0,0,0,0,0],
//     [0,0,0,0,0,1,0],
//     [1,0,0,0,1,0,1],
//     [0,0,0,0,0,1,0],
//     [0,1,0,1,0,0,0],
//     [0,0,0,0,0,0,0],
//     [0,1,0,1,0,0,0]
//   ]

//   var size = 7

//   const dataEntry = document.querySelector('.dataEntry')


//     mas = matrix.slice(0)
//     valueOfInput = size

//     const lInc = document.querySelector('.dataEntry')

//   for(let i = 0; i < valueOfInput; i++) {
//     for(let j = 0; j < valueOfInput; j++) {
//         if (mas[i][j] != 1) {
//             mas[i][j] = '*';
//         }
//     }
// }

// for(let i = 0; i < valueOfInput; i++) {
//     for(let j = 0; j < valueOfInput; j++) {
//         if (mas[i][j] == 1) {
//             mas[i][j] = i + 1;
//         }
//     }
// }

// let tmp = [];
// let newMasForA = [];
// for(let i = 0; i < valueOfInput; i++) {
//     for(let j = 0; j < valueOfInput; j++) {
//         if (mas[j][i] != '*') {
//             tmp.push(mas[j][i]);
//         }
//     }
//     newMasForA.push(tmp);
//     tmp = [];
// }

// for(let i = 0; i < newMasForA.length; i++){
//   var i1 = i+1
//   dataEntry.innerHTML += `G<sup>-</sup>`+'('+i1+')'+'[ '+ newMasForA[i]+' ]' + '<br>'
// }

// console.log(newMasForA)

// }

