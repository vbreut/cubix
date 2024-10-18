// script.js

let selectedCube = null;
const board = document.querySelectorAll('.grid');

// Créer un cube de base
function createCube() {
    const cube = document.createElement('div');
    cube.className = 'cube';
    cube.innerText = '🔴';  // Représente un cube simple avec une face
    return cube;
}

// Placer le cube dans la première cellule (par exemple)
board[0].appendChild(createCube());

// Écouter les clics sur chaque case du plateau
board.forEach(cell => {
    cell.addEventListener('click', () => {
        if (selectedCube) {
            // Si un cube est déjà sélectionné, on le déplace ici
            moveCubeTo(cell);
        } else if (cell.firstChild) {
            // Sélectionner un cube
            selectCube(cell.firstChild);
        }
    });
});

// Fonction pour déplacer un cube dans une autre cellule
function moveCubeTo(targetCell) {
    targetCell.appendChild(selectedCube);
    selectedCube = null;
}

// Fonction pour sélectionner un cube
function selectCube(cube) {
    selectedCube = cube;
}

// Rotation d'un cube de 90 degrés
function rotateCube(cube) {
    // Cette fonction simule une rotation, tu pourrais la lier à un bouton
    // Modifier la représentation graphique ou le texte du cube après rotation
    const currentFace = cube.innerText;
    // Exemple basique de changement de face
    cube.innerText = currentFace === '🔴' ? '⚪' : '🔴';
}

// Par exemple, ajouter un bouton de rotation
const rotateButton = document.createElement('button');
rotateButton.innerText = 'Rotate Cube';
rotateButton.addEventListener('click', () => {
    if (selectedCube) {
        rotateCube(selectedCube);
    }
});
document.body.appendChild(rotateButton);
