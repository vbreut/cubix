// script.js

let selectedScene = null;
let isClickable = true;
let numberofmoves = 0;
let turn = "white";
const board = document.querySelectorAll('.grid');
const firstcell = document.querySelector('.grid');
const scenes = document.querySelectorAll('.scene');
const firstscene = document.querySelector('.scene');
const gameboard = document.getElementById('game-board')

let cellrect = firstcell.getBoundingClientRect();
let boardrect= gameboard.getBoundingClientRect();
let cellwidth = cellrect.width + 5;
let scenerect = firstscene.getBoundingClientRect();
let movx = scenerect.width/4 + 5;
let movy = scenerect.width/4 + 5;

//0 cell nb
//1 face up, par défaut red square
//2 face down, red disc
//3 face front, black square
//4 face back, black disc
//5 face left, white square
//6 face right, white disc

let cubestatus = [
    [1, 2, 3, 4, 5, 6, 31, 32, 33, 34, 35, 36],
    ["rs", "rs", "rs", "rs", "rs", "rs", "rs", "rs", "rs", "rs", "rs", "rs"],
    ["rd", "rd", "rd", "rd", "rd", "rd", "rd", "rd", "rd", "rd", "rd", "rd"],
    ["bs", "bs", "bs", "bs", "bs", "bs", "bs", "bs", "bs", "bs", "bs", "bs"],
    ["bd", "bd", "bd", "bd", "bd", "bd", "bd", "bd", "bd", "bd", "bd", "bd"],
    ["ws", "ws", "ws", "ws", "ws", "ws", "ws", "ws", "ws", "ws", "ws", "ws"],
    ["wd", "wd", "wd", "wd", "wd", "wd", "wd", "wd", "wd", "wd", "wd", "wd"],
]

scenes.forEach(scen => {
    scen.addEventListener('click', () => {

        let cube=scen.firstElementChild;
        let cubenumber=parseInt(cube.id.match(/\d+/)[0]);
        let cellnumber=cubestatus[0][cubenumber-1];
        let cellid="cell-" + cellnumber;
        let currentcell= document.getElementById(cellid);

        if ((selectedScene == null || numberofmoves == 0) && (cubenumber<7 && turn=="black" || cubenumber>6 && turn=="white") ){
            selectedScene=scen;
            board.forEach(cell => {cell.style.backgroundColor = "rgb(141, 165, 197)"})
            currentcell.style.backgroundColor = "rgb(123, 144, 171)"
            //reset des couleurs et coloration de la case
        }
    })
});


// Écouter les clics sur chaque case du plateau
board.forEach(cell => {
    cell.addEventListener('click', () => {
        let cellnumber=parseInt(cell.id.match(/\d+/)[0]);
        let occupied = cubestatus[0].includes(cellnumber)
     
        if (selectedScene != null && occupied == false && numberofmoves < 2 && cell.style.backgroundColor == "rgb(141, 165, 197)"){

            if (!isClickable) return; // Si le flag est faux, ignore le clic

            moveCubeTo3(cell);

            isClickable = false; // Désactive les clics supplémentaires
            
            // Réactive le listener
            setTimeout(() => {
                isClickable = true;
            }, 500);
           
        }
    });
});


function moveCubeTo3(targetCell) {

    let rotx=0;
    let roty=0;
    let rotz=0;

    let coordcell = targetCell.getBoundingClientRect();
    let x = coordcell.left+window.scrollX;
    let y = coordcell.top+window.scrollY;

    let coordscene= selectedScene.getBoundingClientRect();
    let xc = coordscene.left+window.scrollX;
    let yc = coordscene.top+window.scrollY;

    let x3d=0;
    let y3d=0;

    let deltax = x-xc+10;
    let deltay = y-yc+10;

    let cube=selectedScene.firstElementChild;
    let cubenumber=cube.id.match(/\d+/)[0] - 1;
    let faceup=cubestatus[1][cubenumber];
    let facedown=cubestatus[2][cubenumber];
    let facefront=cubestatus[3][cubenumber];
    let faceback=cubestatus[4][cubenumber];
    let faceleft=cubestatus[5][cubenumber];
    let faceright=cubestatus[6][cubenumber];


    if (Math.abs(deltax) + Math.abs(deltay) < cellwidth + 20 && Math.abs(deltax) + Math.abs(deltay) > 20) {

        //vers le bas
        if (Math.abs(deltax)<20 && Math.abs(deltay)>20 && deltay>0) {
            if(faceright=="wd"){rotx=-90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(faceright=="ws"){rotx=90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(faceright=="bd"){roty=-90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(faceright=="bs"){roty=90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(faceright=="rs"){rotz=-90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            if(faceright=="rd"){rotz=90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            cubestatus[1][cubenumber]= facefront;
            cubestatus[2][cubenumber]= faceback;
            cubestatus[3][cubenumber]= facedown;
            cubestatus[4][cubenumber]= faceup;
            cubestatus[0][cubenumber]= cubestatus[0][cubenumber] + 6;
        }

        //vers le haut
        if (Math.abs(deltax)<20 && Math.abs(deltay)>20 && deltay<0) {
            if(faceright=="wd"){rotx= 90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(faceright=="ws"){rotx= -90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(faceright=="bd"){roty=90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(faceright=="bs"){roty=-90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(faceright=="rs"){rotz=90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            if(faceright=="rd"){rotz= -90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            cubestatus[1][cubenumber]= faceback;
            cubestatus[2][cubenumber]= facefront;
            cubestatus[3][cubenumber]= faceup;
            cubestatus[4][cubenumber]= facedown;
            cubestatus[0][cubenumber]= cubestatus[0][cubenumber] - 6;
        }

        //vers la droite    
        if (Math.abs(deltax)>20 && Math.abs(deltay)<20 && deltax>0) {
            if(faceback=="bd"){roty=90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(faceback=="bs"){roty= -90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(faceback=="wd"){rotx=90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(faceback=="ws"){rotx= -90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(faceback=="rs"){rotz= 90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            if(faceback=="rd"){rotz= -90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            cubestatus[1][cubenumber]= faceleft;
            cubestatus[2][cubenumber]= faceright;
            cubestatus[5][cubenumber]= facedown;
            cubestatus[6][cubenumber]= faceup;
            cubestatus[0][cubenumber]= cubestatus[0][cubenumber] + 1;
        }

        //vers la gauche
        if (Math.abs(deltax)>20 && Math.abs(deltay)<20 && deltax<0) {
            if(faceback=="bd"){roty= -90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(faceback=="bs"){roty=90;cube.style.transform += `rotateY(${roty}deg)`;}
            if(faceback=="wd"){rotx= -90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(faceback=="ws"){rotx=90;cube.style.transform += `rotateX(${rotx}deg)`;}
            if(faceback=="rs"){rotz= -90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            if(faceback=="rd"){rotz=90;cube.style.transform += `rotateZ(${rotz}deg)`;}
            cubestatus[1][cubenumber]= faceright;
            cubestatus[2][cubenumber]= faceleft;
            cubestatus[5][cubenumber]= faceup;
            cubestatus[6][cubenumber]= facedown;
            cubestatus[0][cubenumber]= cubestatus[0][cubenumber] - 1;
        }

        x3d = x + movx - boardrect.left - 5 - 0.5;
        y3d = y + movy - boardrect.top - 5 - 0.5;

        selectedScene.style.transform = `translate(${x3d}px, ${y3d}px) rotateY(20deg) rotateX(20deg)`;
        numberofmoves += 1;
        targetCell.style.backgroundColor = "rgb(123, 144, 171)";
    }
}


const validButton = document.getElementById('valider');

validButton.addEventListener('click', () => {
    if (numberofmoves > 0){
        prise();
        numberofmoves = 0;
        selectedScene = null;
        if (turn=="white") {turn="black"} else {turn="white"};
    }

});
//document.body.appendChild(validButton);
