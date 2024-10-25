// script.js

let selectedCube = null;
const board = document.querySelectorAll('.grid');
const firstcell = document.querySelector('.grid');
const cube = document.querySelector('.cube');
const scene = document.querySelector('.scene');

let cellrect = firstcell.getBoundingClientRect();
let cellwidth = cellrect.width + 3.4;

let coordcube= cube.getBoundingClientRect();
let x3d = coordcube.left+window.scrollX-cellrect.left+1;
let y3d = coordcube.top+window.scrollY-cellrect.top-1;

let rotx=0;
let roty=0;
let rotz=0;

let absx=1;
let absy=2;
let absz=3;
let sauv=0;


cube.addEventListener('click', () => {
    selectedCube=cube;
});


// Écouter les clics sur chaque case du plateau
board.forEach(cell => {
    cell.addEventListener('click', () => {
        if (selectedCube){
            // Si un cube est déjà sélectionné, on le déplace ici
            moveCubeTo2(cell);
        }
    });
});


// Fonction pour déplacer un cube dans une autre cellule
function moveCubeTo2(targetCell) {

    let coordcell = targetCell.getBoundingClientRect();
    let x = coordcell.left+window.scrollX;
    let y = coordcell.top+window.scrollY;

    coordcube= cube.getBoundingClientRect();
    xc = coordcube.left+window.scrollX;
    yc = coordcube.top+window.scrollY;

    let deltax = x-xc+15;
    let deltay = y-yc+15;


    if (Math.abs(deltax)<120 && Math.abs(deltay)<120) {

        //vers le bas
        if (Math.abs(deltax)<30 && Math.abs(deltay)>30 && deltay>0) {
            if(absx==1){rotx=-90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(absx==-1){rotx=90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(absx==2){roty=-90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(absx==-2){roty=90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(absx==3){rotz=-90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            if(absx==-3){rotz=90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            sauv = absy;
            absy = absz;
            absz = -sauv;
            y3d+=cellwidth;

        }

        //vers le haut
        if (Math.abs(deltax)<30 && Math.abs(deltay)>30 && deltay<0) {
            if(absx==1){rotx= 90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(absx==-1){rotx= -90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(absx==2){roty=90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(absx==-2){roty=-90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(absx==3){rotz=90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            if(absx==-3){rotz= -90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            sauv = absy;
            absy = -absz;
            absz = sauv;
            y3d-=cellwidth;

        }

        //vers la droite    
        if (Math.abs(deltax)>30 && Math.abs(deltay)<30 && deltax>0) {
            if(absy==2){roty=90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(absy==-2){roty= -90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(absy==1){rotx=90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(absy==-1){rotx= -90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(absy==3){rotz= 90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            if(absy==-3){rotz= -90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            sauv = absx;
            absx = absz;
            absz = -sauv;
            x3d+=cellwidth;
        }

        //vers la gauche
        if (Math.abs(deltax)>30 && Math.abs(deltay)<30 && deltax<0) {
            if(absy==2){roty= -90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(absy==-2){roty=90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(absy==1){rotx= -90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(absy==-1){rotx=90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(absy==3){rotz= -90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            if(absy==-3){rotz=90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            sauv = absx;
            absx = -absz;
            absz = sauv;
            x3d-=cellwidth;
        }

        scene.style.transform = `translate(${x3d}px, ${y3d}px) rotateY(20deg) rotateX(20deg)`;

    }

}

/*
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
document.body.appendChild(rotateButton);*/
