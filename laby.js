// Résolution de labyrinthe

// labyrinthe
// +---+---+---+
// | A | B   C |
// +   +   +---+
// | E   F   G |
// +   +   +   +
// | I   J | K |
// +---+---+---+

var MATRIX        // matrice d'adjacence
var COLUMN_NAMES  // nom des colonnes

// A  B  C  E  F  G  I  J  K
MATRIX = [
  [0, 0, 0, 1, 0, 0, 0, 0, 0], // A
  [0, 0, 1, 0, 1, 0, 0, 0, 0], // B
  [0, 1, 0, 0, 0, 0, 0, 0, 0], // C
  [1, 0, 0, 0, 1, 0, 1, 0, 0], // E
  [0, 1, 0, 1, 0, 1, 0, 1, 0], // F
  [0, 0, 0, 0, 1, 0, 0, 0, 1], // G
  [0, 0, 0, 1, 0, 0, 0, 1, 0], // I
  [0, 0, 0, 0, 1, 0, 1, 0, 0], // J
  [0, 0, 0, 0, 0, 1, 0, 0, 0]  // K
]

COLUMN_NAMES = ['A', 'B', 'C', 'E', 'F', 'G', 'I', 'J', 'K']

function subSet (index, length, getValue) {
  var result
  result = []
  for (var i = 0; i < length; i++) {
    if (i !== index) {
      result.push(getValue(i))
    }
  }
  return result
}

function subVector (v, index) {
  return subSet(index, v.length, function (i) {
    return v[i]
  })
}

function subMatrix (m, index) {
  return subSet(index, m.length, function (i) {
    return subSet(index, m.length, function (j) {
      return m[i][j]
    })
  })
}

// console.log('suVector', subVector(MATRIX[1], 2))

// target : cible nom de la cellule -> "K"
// origin : "A"
// matrix : matrice d'adjacence MATRIX
// columnNames : nom des colonnes
// path : ""
function getPath (target, origin, matrix, columnNames, path) {
  if (origin === target) { // j'ai trouvé
    return path
  } else {
    var iOrigin, newMatrix, newColnames
    iOrigin = columnNames.indexOf(origin)
    newColnames = subVector(columnNames, iOrigin)
    for (var i = 0; i < newColnames.length; i++) {
      var hasArc
      hasArc = matrix[iOrigin][columnNames.indexOf(newColnames[i])]
      if (hasArc) {
        newMatrix = subMatrix(matrix, iOrigin)
        path.push(newColnames[i])
        var res = getPath(target, newColnames[i], newMatrix, newColnames, path)
        if (res) {
          return res
        }
      }
    }
    return null
  }
  // something
  return path
}
function Graph (matrix, vertexNames) {
  this.matrix = matrix
  this.vertexNames = vertexNames
}
Graph.prototype.getPath = function (origin, target) {
  console.log(this.matrix)
  return getPath(target, origin, this.matrix, this.vertexNames, [origin])
}

var g
g = new Graph(MATRIX, COLUMN_NAMES)
//console.log(g.getPath('C', 'I'))

// console.log(getPath('K', 'A', MATRIX, COLUMN_NAMES, 'A'))
//console.log(getPath('I', 'C', MATRIX, COLUMN_NAMES, ['C']))

function getNullMatrix (columns, lines) {
  var matrix = []
  for (var i = 0; i < lines; i++) {
    matrix[i] = []
    for (var j = 0; j < columns; j++) {
      matrix[i].push(0)
    }
  }

  return matrix
}

console.log(getNullMatrix(3, 2))
function Labyrinthe (width, height) {
  this.width = width
  this.height = height
  this.matrix = getNullMatrix(width * height, width * height)
  this.cells = this.cellList()
}
Labyrinthe.prototype.cellList = function () {
  var lettres = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  var cells = []
  for (var i = 0; i < this.height; i++) {
    for (var j = 1; j <= this.width; j++) {
      var name = lettres[i] + j
      cells.push(name)
      //console.log(cells[1])
    }
  }
  return cells
}
Labyrinthe.prototype.cellIndex = function (cell) {
  return this.cells.indexOf(cell)
}
Labyrinthe.prototype.cellOpen = function (cell, direction) {
  var index = this.cellIndex(cell)
  if (direction === 'right') {
    this.matrix[index][index + 1] = 1
  }
  if (direction === 'bottom') {
    this.matrix[index][index + this.width] = 1
  }
}
var labyrinthe
labyrinthe = new Labyrinthe(3, 3)
labyrinthe.cellOpen('A1', 'bottom')
labyrinthe.cellOpen('B1', 'bottom')
labyrinthe.cellOpen('B1', 'right')
labyrinthe.cellOpen('A2', 'bottom')
labyrinthe.cellOpen('A2', 'right')
labyrinthe.cellOpen('A3', 'right')
console.log(labyrinthe)
