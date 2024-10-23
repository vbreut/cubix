// script.js


let selectedSquare = null;
const board = document.querySelectorAll('.grid');
const cube = document.querySelector('.cube');
const scene = document.querySelector('.scene');
const squares = document.querySelectorAll('.square');
let rotx=20;
let roty=20;
let x3d=17;
let y3d=17;


squares.forEach(square => {
    square.addEventListener('click', () => {
        selectedSquare = square;  // Sélectionner le carré cliqué
        //console.log(`Carré sélectionné : ${square.id}`);
    });
});


// Écouter les clics sur chaque case du plateau
board.forEach(cell => {
    cell.addEventListener('click', () => {
        if (selectedSquare){
            // Si un cube est déjà sélectionné, on le déplace ici
            moveCubeTo(cell);
        }
    });
});

cube.addEventListener('click', () => {
    rotx-=90;
    y3d+=95;
    scene.style.transform = `translate(${x3d}px, ${y3d}px)`;
    cube.style.transform = `rotateY(${roty}deg) rotateX(${rotx}deg) `;
});


// Fonction pour déplacer un cube dans une autre cellule
function moveCubeTo(targetCell) {

    let rect = targetCell.getBoundingClientRect();
    let x = rect.left-9+window.scrollX;
    let y = rect.top-70+window.scrollY;
    selectedSquare.style.transform = `translate(${x}px, ${y}px)`;
    //selectedSquare = null;
    //console.log(`Case : ${targetCell.id}`);
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
