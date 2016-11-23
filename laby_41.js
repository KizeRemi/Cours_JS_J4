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
        var res = getPath(target, newColnames[i], newMatrix, newColnames, path.concat([newColnames[i]]))
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

// console.log(getPath('K', 'A', MATRIX, COLUMN_NAMES, 'A'))
// console.log('getPath:', getPath('I', 'C', MATRIX, COLUMN_NAMES, ['C']))

function Graph (matrix, vertexNames) {
  this.matrix = matrix
  this.vertexNames = vertexNames
}

Graph.prototype.getPath = function (origin, target) {
  return getPath(target, origin, this.matrix, this.vertexNames, [origin])
}

var g = new Graph(MATRIX, COLUMN_NAMES)
console.log(g)

function getNullMatrix (width, height) {
  var matrix = []
  for (var i = 0; i < width; i++) {
    matrix[i] = []
    for (var j = 0; j < height; j++) {
      matrix[i].push(0)
    }
  }

  return matrix
}

// console.log('getNullMatrix:', getNullMatrix(3, 2))

function Labyrinthe (width, height) {
  this.width = width
  this.height = height
  this.matrix = getNullMatrix(width * height, width * height)
  this.cells = this.cellList()
}

Labyrinthe.prototype.cellList = function () {
  var lettres = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  var cells = []
  for (var i = 1; i < this.width + 1; i++) {
    for (var j = 1; j <= this.height; j++) {
      var name = lettres[j - 1] + i
      cells.push(name)
    }
  }
  return cells
}

var labyrinthe = new Labyrinthe(3, 3)
// console.log('Labyrinthe#cellList:', labyrinthe.cellList())
// console.log(labyrinthe.matrix)

Labyrinthe.prototype.cellIndex = function (cellName) {
  return this.cells.indexOf(cellName)
}

// console.log('Labyrinthe#cellIndex:', labyrinthe.cellIndex('A1'))

Labyrinthe.prototype.cellOpen = function (cellName, direction) {
  var index = this.cellIndex(cellName)
  // il faut bien spécifier la direction inverse. EX: Si A1 vers A2 alors A2 vers A1
  if (direction === 'right') {
    this.matrix[index][index + 1] = 1
    this.matrix[index + 1][index] = 1
  }
  if (direction === 'bottom') {
    this.matrix[index][index + this.width] = 1
    this.matrix[index + this.width][index] = 1
  }
}

labyrinthe.cellOpen('A1', 'bottom') // vers A2
labyrinthe.cellOpen('B1', 'bottom') // vers B2
labyrinthe.cellOpen('B1', 'right')  // vers C1
labyrinthe.cellOpen('A2', 'bottom') // vers A3
labyrinthe.cellOpen('A2', 'right')  // vers B2
labyrinthe.cellOpen('B2', 'bottom') // vers B3
labyrinthe.cellOpen('B2', 'right')  // vers C2
labyrinthe.cellOpen('C2', 'bottom') // vers C3
labyrinthe.cellOpen('A3', 'right')  // vers B3

Labyrinthe.prototype.getPath = function (origin, target) {
  return getPath(target, origin, this.matrix, this.cells, [origin])
}
// console.log('Labyrinthe#getPath:', labyrinthe.getPath('A1', 'C3'))

function LabyrintheHTMLView (labyrinthe) {
  this.labyrinthe = labyrinthe
}

LabyrintheHTMLView.prototype.draw = function () {
  var laby = this.labyrinthe
  var indent = '   '
  var labyHTML = '<table class="labyrinthe">\n'
  var cell = 0
  console.log(laby)
  for (var i = 0; i < laby.width; i++) {
    labyHTML += indent + '<tr>\n'
    for (var j = 0; j < laby.height; j++) {
      var className = ''
      if (laby.matrix[cell][cell + 1] === 1) {
        className += ' door-right'
      }
      if (cell !== 0 && laby.matrix[cell - 1][cell] === 1) {
        className += ' door-left'
      }
      if (laby.matrix[cell][cell + laby.width] === 1) {
        className += ' door-bottom'
      }
      if (cell >= laby.width && laby.matrix[cell - laby.width][cell] === 1) {
        className += ' door-top'
      }
      labyHTML += indent.repeat(2) + '<td data-cell="' + laby.cells[cell] + '" class="' + className + '">' + laby.cells[cell] + '</td>\n'
      cell++
    }
    labyHTML += indent + '</tr>\n'
  }
  labyHTML += '</table>\n'
  return labyHTML
}

var view = new LabyrintheHTMLView(labyrinthe)
var labyhtml = view.draw()
console.log(labyhtml)

// Il faut commenter ici si vous ne voulez pas la partie visuelle. Donc uniquement dans la console.
document.body.innerHTML += labyhtml
var resolveButton = document.getElementById('resolve')
resolveButton.addEventListener('click', resolve, false)
function resolve () {
  // Pour avoir la solution du labyrinthe, on ajoute la classe resolve a chaque case faisant partie du getPath()
  var path = labyrinthe.getPath('A1', 'C3')
  var elems = document.getElementsByTagName('td')
  for (var i = 0; i < elems.length; i++) {
    if (path.includes(elems[i].dataset.cell)) {
      elems[i].classList.add('resolve')
    }
  }
}

// Début de la fonction randomize mais trop de problème au niveau des index, ni de l'algo (nombre de porte ouvertes max, etc)
/*
Labyrinthe.prototype.randomize = function (v1, v2) {
  for (var i = 0; i < 30; i++) {
    var direction = 'right'
    var randomCell = 0

    while(randomCell === 0) {
      randomCell = Math.floor(Math.random() * 20)
    }
    console.log(randomCell)
    var randomDirection = Math.floor(Math.random() * 2)
    if (randomDirection === 0) {
      direction = 'right'
    } else {
      direction = 'bottom'
    }
    this.cellOpen(this.cells[randomCell], direction)
  }
}
var labyrinthe_random = new Labyrinthe(5, 5)
labyrinthe_random.randomize('A1', 'E5')

var view2 = new LabyrintheHTMLView(labyrinthe_random)
var labyhtml2 = view2.draw()
console.log(labyhtml2)

document.body.innerHTML += labyhtml2
*/
