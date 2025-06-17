"use strict";

let selectedScene = null;
let isClickable = true;
let numberofmoves = 0;
let turn = "white";
let forcedcube =[0,0,0,-1];
const board = document.querySelectorAll('.grid');
const firstcell = document.querySelector('.grid');
const scenes = document.querySelectorAll('.scene');
const firstscene = document.querySelector('.scene');
const gameboard = document.getElementById('game-board')
const validButton = document.getElementById('valider');
const confirmyesButton = document.getElementById("confirm-yes");
const confirmnoButton = document.getElementById("confirm-no");
const resButton = document.getElementById("res");
const tour = document.getElementById('tour');

let cellrect = firstcell.getBoundingClientRect();
let boardrect = null;// gameboard.getBoundingClientRect();
let cellwidth = cellrect.width + 5;
let scenerect = firstscene.getBoundingClientRect();
let movx = scenerect.width/4 + 5;
let movy = scenerect.width/4 + 5;
let dark="rgb(105, 149, 183)";
let light="rgb(140, 174, 200)";
let blockbot=0;
//let changepossible=1;
let playingmode=1;
//let choice=null;
let rotationinprogress=0;
let waitforsecondmove =0;
//let wait = 0;

const tempo = 350;
let largeur = document.documentElement.clientWidth;

//mettre à jour confettis

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

let moves = [];

okman.addEventListener('click',choice0);

function choice0() {
    playingmode=0;
    showPage();
}

okbot.addEventListener('click',showPage);

function showPage() {
    if (blockbot==0){
        if (pseudo !== "" && pseudo!==null){
            let joueurRef = database.ref('joueurs/' + pseudo);
            joueurRef.set({ enLigne: "en partie"});
            //joueurRef.onDisconnect().remove();
        }

        if(playingmode==1){
            document.getElementById("adv").textContent = "Bot 1";
        }
        if(playingmode==2){
            document.getElementById("adv").textContent = "Bot 2";
        }
        if(playingmode==3){
            document.getElementById("adv").textContent = "Bot 3";
        }
        document.getElementById("game").style.display="block";
        document.getElementById("home").style.display="none";

        boardrect= gameboard.getBoundingClientRect();
        scenerect = firstscene.getBoundingClientRect();
        cellrect = firstcell.getBoundingClientRect();
        largeur = document.documentElement.clientWidth;
        cellwidth = cellrect.width + 5;
        movx = scenerect.width/4 + 5;
        movy = scenerect.width/4 + 5;

    }
}

scenes.forEach(scen => {
    scen.addEventListener('click', () => {


        let cube=scen.firstElementChild;
        let cubenumber=parseInt(cube.id.match(/\d+/)[0]);
        let cellnumber=cubestatus[0][cubenumber-1];
        let cellid="cell-" + cellnumber;
        let currentcell= document.getElementById(cellid);

        if ((selectedScene == null || numberofmoves == 0) && (cubenumber<7 && turn=="black" && playingmode==0 || cubenumber>6 && turn=="white") && currentcell!=null && rotationinprogress==0){
            selectedScene=scen;
            selectcurrentcell(currentcell);
            moves = [];
            moves.push(scen.id);
            moves.push(cellid);
            //console.log(moves);
        }

    });
});

function selectcurrentcell(currentcell){
        board.forEach(cell => {cell.style.backgroundColor = light;})
        currentcell.style.backgroundColor = dark;
        //reset des couleurs et coloration de la case
}



// Écouter les clics sur chaque case du plateau
board.forEach(cell => {
    cell.addEventListener('click', () => {
        let cellnumber=parseInt(cell.id.match(/\d+/)[0]);
        let occupied = cubestatus[0].includes(cellnumber);
     
        if (selectedScene != null && occupied == false && (playingmode==0 || turn=="white")){
            let cube=selectedScene.firstElementChild;

            if (rotationinprogress){
                waitforsecondmove =1;
                cube.addEventListener('transitionend', () => {
                    if (cell.style.backgroundColor == dark) {
                        moveCubeTo3(cell, cell.style.backgroundColor);
                    }
        
                    if (cell.style.backgroundColor == light && numberofmoves < 2) {
                        moveCubeTo3(cell, cell.style.backgroundColor);
                    }
                    waitforsecondmove =0;
                },{once: true});
            }

            if (rotationinprogress==0){
                if (cell.style.backgroundColor == dark) {
                    moveCubeTo3(cell, cell.style.backgroundColor);
                }
    
                if (cell.style.backgroundColor == light && numberofmoves < 2) {
                    moveCubeTo3(cell, cell.style.backgroundColor);
                }
            }
        }
    });
});

function changefacesup() {

    let cube=selectedScene.firstElementChild;
    let cubenumber=parseInt(cube.id.match(/\d+/)[0]) - 1;
    let faceright=cubestatus[6][cubenumber];

    let el1=cube.querySelector('.shape1'); //rs
    let el6=cube.querySelector('.shape6'); //bd
    let el5=cube.querySelector('.shape5'); //bs
    let el2=cube.querySelector('.shape2'); //rd
    let el4=cube.querySelector('.shape4'); //ws
    let el3=cube.querySelector('.shape3'); //wd

    if(faceright=="wd"){
        el1.classList.replace('shape1','shape6');
        el6.classList.replace('shape6','shape2');
        el2.classList.replace('shape2','shape5');
        el5.classList.replace('shape5','shape1');
    }
    if(faceright=="ws"){
        el6.classList.replace('shape6','shape1');
        el1.classList.replace('shape1','shape5');
        el5.classList.replace('shape5','shape2');
        el2.classList.replace('shape2','shape6');
    }
    if(faceright=="bd"){
        el3.classList.replace('shape3','shape1');
        el1.classList.replace('shape1','shape4');
        el4.classList.replace('shape4','shape2');
        el2.classList.replace('shape2','shape3');
    }
    if(faceright=="bs"){
        el1.classList.replace('shape1','shape3');
        el3.classList.replace('shape3','shape2');
        el2.classList.replace('shape2','shape4');
        el4.classList.replace('shape4','shape1');
    }
    if(faceright=="rs"){
        el3.classList.replace('shape3','shape5');
        el5.classList.replace('shape5','shape4');
        el4.classList.replace('shape4','shape6');
        el6.classList.replace('shape6','shape3');
    }
    if(faceright=="rd"){
        el5.classList.replace('shape5','shape3');
        el3.classList.replace('shape3','shape6');
        el6.classList.replace('shape6','shape4');
        el4.classList.replace('shape4','shape5');
    }
}

function changefacesdown() {

    let cube=selectedScene.firstElementChild;
    let cubenumber=parseInt(cube.id.match(/\d+/)[0]) - 1;
    let faceright=cubestatus[6][cubenumber];

    let el1=cube.querySelector('.shape1'); //rs
    let el6=cube.querySelector('.shape6'); //bc
    let el5=cube.querySelector('.shape5'); //bs
    let el2=cube.querySelector('.shape2'); //rc
    let el4=cube.querySelector('.shape4'); //ws
    let el3=cube.querySelector('.shape3'); //wc

    if(faceright=="wd"){
        el6.classList.replace('shape6','shape1');
        el1.classList.replace('shape1','shape5');
        el5.classList.replace('shape5','shape2');
        el2.classList.replace('shape2','shape6');
    }
    if(faceright=="ws"){
        el1.classList.replace('shape1','shape6');
        el6.classList.replace('shape6','shape2');
        el2.classList.replace('shape2','shape5');
        el5.classList.replace('shape5','shape1');
    }
    if(faceright=="bd"){
        el1.classList.replace('shape1','shape3');
        el3.classList.replace('shape3','shape2');
        el2.classList.replace('shape2','shape4');
        el4.classList.replace('shape4','shape1');
    }
    if(faceright=="bs"){
        el3.classList.replace('shape3','shape1');
        el1.classList.replace('shape1','shape4');
        el4.classList.replace('shape4','shape2');
        el2.classList.replace('shape2','shape3');
    }
    if(faceright=="rs"){
        el5.classList.replace('shape5','shape3');
        el3.classList.replace('shape3','shape6');
        el6.classList.replace('shape6','shape4');
        el4.classList.replace('shape4','shape5');
    }
    if(faceright=="rd"){
        el3.classList.replace('shape3','shape5');
        el5.classList.replace('shape5','shape4');
        el4.classList.replace('shape4','shape6');
        el6.classList.replace('shape6','shape3');
    }
}

function changefacesright() {

    let cube=selectedScene.firstElementChild;
    let cubenumber=parseInt(cube.id.match(/\d+/)[0]) - 1;
    let faceback=cubestatus[4][cubenumber];

    let el1=cube.querySelector('.shape1'); //rs
    let el6=cube.querySelector('.shape6'); //bd
    let el5=cube.querySelector('.shape5'); //bs
    let el2=cube.querySelector('.shape2'); //rd
    let el4=cube.querySelector('.shape4'); //ws
    let el3=cube.querySelector('.shape3'); //wd

    if(faceback=="wd"){
        el1.classList.replace('shape1','shape6');
        el6.classList.replace('shape6','shape2');
        el2.classList.replace('shape2','shape5');
        el5.classList.replace('shape5','shape1');
    }
    if(faceback=="ws"){
        el6.classList.replace('shape6','shape1');
        el1.classList.replace('shape1','shape5');
        el5.classList.replace('shape5','shape2');
        el2.classList.replace('shape2','shape6');
    }
    if(faceback=="bd"){
        el3.classList.replace('shape3','shape1');
        el1.classList.replace('shape1','shape4');
        el4.classList.replace('shape4','shape2');
        el2.classList.replace('shape2','shape3');
    }
    if(faceback=="bs"){
        el1.classList.replace('shape1','shape3');
        el3.classList.replace('shape3','shape2');
        el2.classList.replace('shape2','shape4');
        el4.classList.replace('shape4','shape1');
    }
    if(faceback=="rs"){
        el3.classList.replace('shape3','shape5');
        el5.classList.replace('shape5','shape4');
        el4.classList.replace('shape4','shape6');
        el6.classList.replace('shape6','shape3');
    }
    if(faceback=="rd"){
        el5.classList.replace('shape5','shape3');
        el3.classList.replace('shape3','shape6');
        el6.classList.replace('shape6','shape4');
        el4.classList.replace('shape4','shape5');
    }
}

function changefacesleft() {

    let cube=selectedScene.firstElementChild;
    let cubenumber=parseInt(cube.id.match(/\d+/)[0]) - 1;
    let faceback=cubestatus[4][cubenumber];

    let el1=cube.querySelector('.shape1'); //rs
    let el6=cube.querySelector('.shape6'); //bd
    let el5=cube.querySelector('.shape5'); //bs
    let el2=cube.querySelector('.shape2'); //rd
    let el4=cube.querySelector('.shape4'); //ws
    let el3=cube.querySelector('.shape3'); //wd

    if(faceback=="wd"){
        el6.classList.replace('shape6','shape1');
        el1.classList.replace('shape1','shape5');
        el5.classList.replace('shape5','shape2');
        el2.classList.replace('shape2','shape6');
    }
    if(faceback=="ws"){
        el1.classList.replace('shape1','shape6');
        el6.classList.replace('shape6','shape2');
        el2.classList.replace('shape2','shape5');
        el5.classList.replace('shape5','shape1');
    }
    if(faceback=="bd"){
        el1.classList.replace('shape1','shape3');
        el3.classList.replace('shape3','shape2');
        el2.classList.replace('shape2','shape4');
        el4.classList.replace('shape4','shape1');
    }
    if(faceback=="bs"){
        el3.classList.replace('shape3','shape1');
        el1.classList.replace('shape1','shape4');
        el4.classList.replace('shape4','shape2');
        el2.classList.replace('shape2','shape3');
    }
    if(faceback=="rs"){
        el5.classList.replace('shape5','shape3');
        el3.classList.replace('shape3','shape6');
        el6.classList.replace('shape6','shape4');
        el4.classList.replace('shape4','shape5');
    }
    if(faceback=="rd"){
        el3.classList.replace('shape3','shape5');
        el5.classList.replace('shape5','shape4');
        el4.classList.replace('shape4','shape6');
        el6.classList.replace('shape6','shape3');
    }
}

function moveCubeTo3(targetCell, cellcolor) {

    if (rotationinprogress){
        return;
    }

    //let largeur2 = window.innerWidth;
    let largeur2 = document.documentElement.clientWidth;

    //let rotx=0;
    //let roty=0;
    //let rotz=0;

    let coordcell = targetCell.getBoundingClientRect();
    let x = coordcell.left;//+window.scrollX;
    let y = coordcell.top;//+window.scrollY;

    let coordscene= selectedScene.getBoundingClientRect();
    let xc = coordscene.left;//+window.scrollX;
    let yc = coordscene.top;//+window.scrollY;

    let x3d=0;
    let y3d=0;

    let deltax = x-xc+10;
    let deltay = y-yc+10;

    let cube=selectedScene.firstElementChild;
    let cubenumber=parseInt(cube.id.match(/\d+/)[0]) - 1;
    let faceup=cubestatus[1][cubenumber];
    let facedown=cubestatus[2][cubenumber];
    let facefront=cubestatus[3][cubenumber];
    let faceback=cubestatus[4][cubenumber];
    let faceleft=cubestatus[5][cubenumber];
    let faceright=cubestatus[6][cubenumber];

    let currentcellnumber=cubestatus[0][cubenumber];
    let cellid="cell-" + currentcellnumber;
    let currentcell= document.getElementById(cellid);
    let te = tempo/1000;
    let transf = 'transform ' + te + 's' + ' ease-out';


    if (Math.abs(deltax) + Math.abs(deltay) < 1.3*cellwidth && Math.abs(deltax) + Math.abs(deltay) > 0.3*cellwidth) {


        //vers le bas
        if (Math.abs(deltax)<0.3*cellwidth && Math.abs(deltay)>0.3*cellwidth && deltay>0) {

            cube.style.transform = `rotateX(-90deg)`;
            rotationinprogress=1;

            cube.addEventListener('transitionend', () => {
                cube.style.transition = 'none';

                cube.style.transform="none";
                cube.offsetHeight;

                changefacesdown();
                //console.log(moves);
                
                cube.style.transition = transf;

                rotationinprogress=0;
            },{once: true});
            
            cubestatus[1][cubenumber]= facefront;
            cubestatus[2][cubenumber]= faceback;
            cubestatus[3][cubenumber]= facedown;
            cubestatus[4][cubenumber]= faceup;
            cubestatus[0][cubenumber]= cubestatus[0][cubenumber] + 6;
        }

        //vers le haut
        if (Math.abs(deltax)<0.3*cellwidth && Math.abs(deltay)>0.3*cellwidth && deltay<0) {
  
            cube.style.transform = `rotateX(90deg)`;
            rotationinprogress=1;

            cube.addEventListener('transitionend', () => {
                cube.style.transition = 'none';

                cube.style.transform="none";
                cube.offsetHeight;

                changefacesup();
                //console.log(moves);

                cube.style.transition = transf;
                rotationinprogress=0;
            },{once: true});

            cubestatus[1][cubenumber]= faceback;
            cubestatus[2][cubenumber]= facefront;
            cubestatus[3][cubenumber]= faceup;
            cubestatus[4][cubenumber]= facedown;
            cubestatus[0][cubenumber]= cubestatus[0][cubenumber] - 6;
        }

        //vers la droite    
        if (Math.abs(deltax)>0.3*cellwidth && Math.abs(deltay)<0.3*cellwidth && deltax>0) {

            cube.style.transform = `rotateY(90deg)`;
            rotationinprogress=1;

            cube.addEventListener('transitionend', () => {
                cube.style.transition = 'none';

                cube.style.transform="none";
                cube.offsetHeight;

                changefacesright();
                //console.log(moves);
                
                cube.style.transition = transf;
                rotationinprogress=0;
            },{once: true});

            cubestatus[1][cubenumber]= faceleft;
            cubestatus[2][cubenumber]= faceright;
            cubestatus[5][cubenumber]= facedown;
            cubestatus[6][cubenumber]= faceup;
            cubestatus[0][cubenumber]= cubestatus[0][cubenumber] + 1;
        }

        //vers la gauche
        if (Math.abs(deltax)>0.3*cellwidth && Math.abs(deltay)<0.3*cellwidth && deltax<0) {

            cube.style.transform = `rotateY(-90deg)`;
            rotationinprogress=1;

            cube.addEventListener('transitionend', () => {
                cube.style.transition = 'none';

                cube.style.transform="none";
                cube.offsetHeight;

                changefacesleft();
                //console.log(moves);

                cube.style.transition = transf;
                rotationinprogress=0;
            },{once: true});

            cubestatus[1][cubenumber]= faceright;
            cubestatus[2][cubenumber]= faceleft;
            cubestatus[5][cubenumber]= faceup;
            cubestatus[6][cubenumber]= facedown;
            cubestatus[0][cubenumber]= cubestatus[0][cubenumber] - 1;
        }

        x3d = x + movx - boardrect.left - 5 - 0.5+ (largeur - largeur2)/2;
        y3d = y + movy - boardrect.top - 5 - 0.5;

        selectedScene.style.transform = `translate(${x3d}px, ${y3d}px) rotateY(18deg) rotateX(18deg)`;

        moves.push(targetCell.id);

        if (cellcolor==dark){
            currentcell.style.backgroundColor = light;
            numberofmoves -=1;
        }
        
        if (cellcolor==light){
            targetCell.style.backgroundColor = dark;
            numberofmoves +=1;
        }
    }
}

validButton.addEventListener('click', () => {

    if (waitforsecondmove){
        return;
    }

    if (numberofmoves > 0 && (playingmode==0||turn=="white") && playingmode !== 4){

        let doublemove=0;
        let delay=50;
        //changes();
        valider();
        
        if (turn=="end") {return;}
        if (playingmode!=0){
            setTimeout(() => {

                if (playingmode==1){
                    doublemove=botlevel1();
                }

                if (playingmode==2){
                    doublemove=botlevel2();
                }

                if (playingmode==3){
                    doublemove=botlevel3();
                }
                if (doublemove==1){
                    delay=tempo + 50;
                }

                if (doublemove==-1){
                    //tous les cubes sont bloqués. Les blancs continuent à jouer
                }
                setTimeout(() => {
                    valider();
                }, 800 + delay);
            }, tempo + 50);
        }
    }

    if (numberofmoves > 0 && playingmode==4){

        //changes();
        valider();

        clean();
        
        if (turn=="end") {return;}

    }

});

function valider(){

    prise();

    if (forcedcube[3]!= -1){
        return;
    }
    else{document.getElementById("info").textContent="";}

    victoire();

    numberofmoves = 0;

    let cube=selectedScene.firstElementChild;
    if (rotationinprogress){
        cube.addEventListener('transitionend', () => {
            selectedScene = null;
        },{once: true});
    } else {
        selectedScene = null;
    }

    if (turn=="end") {return;}

    let colortest = document.querySelector('.face'); //on regarde une face pour voir de quelle couleur on est (si les noirs sont en haut)
    let col= getComputedStyle(colortest).backgroundColor;
    if (turn=="white") {
        turn="black";

        if (col == "rgb(50, 50, 50)"){tour.style.backgroundColor = "rgb(0, 0, 0)";
        } else {tour.style.backgroundColor = "rgb(255, 255, 255)";}

    } else {
        turn="white";
        if (col == "rgb(50, 50, 50)"){tour.style.backgroundColor = "rgb(255, 255, 255)";
        } else {tour.style.backgroundColor = "rgb(0, 0, 0)";}
    }
}


// Récupérer les éléments HTML
const modal = document.getElementById("modal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");

const modalvic = document.getElementById("modalvic");
const closeModalvicButton = document.getElementById("closeModalvic");

// Ouvrir la modale
openModalButton.addEventListener("click", () => {

    modal.style.display = "block";
});

// Fermer la modale
closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
});

// Fermer la modale
closeModalvicButton.addEventListener("click", () => {
    modalvic.style.display = "none";
});

// Fermer la modale en cliquant en dehors de la fenêtre
window.addEventListener("click", (event) => {
    if (event.target === modal || event.target === modalvic) {
        modal.style.display = "none";
        modalvic.style.display = "none";
    }
});

function affichervic(message){
    document.getElementById("message").textContent=message;
    confirmyesButton.style.display="none";
    confirmnoButton.style.display="none";
    document.getElementById("closeModalvic").style.display="block";
    modalvic.style.display = "block";
    //document.querySelector(".modal-contentvic").style.justifyContent="space-between";
    document.getElementById("spacer").style.display="block";
}


const boutonsRadio = document.querySelectorAll('input[name="niveau"]');



// Ajouter un écouteur d'événement pour chaque bouton radio
boutonsRadio.forEach(bouton => {
    bouton.addEventListener("click", (event) => {

        playingmode=event.target.value;

    });
});

const toggle = document.getElementById('transparent-toggle');
const facews = document.getElementsByClassName('facew');
const faces = document.getElementsByClassName('face');

toggle.addEventListener('change', () => {
    for (const facew of facews) { // Parcourt chaque cube
        if (toggle.checked) {
            facew.classList.add('transparent'); // Ajoute la classe
        } else {
            facew.classList.remove('transparent'); // Supprime la classe
        }
    }

    for (const face of faces) { // Parcourt chaque cube
        if (toggle.checked) {
            face.classList.add('transparent'); // Ajoute la classe
        } else {
            face.classList.remove('transparent'); // Supprime la classe
        }
    }

});

resButton.addEventListener('click', () => {
    document.getElementById("message").textContent="Quitter la partie ?";
    document.getElementById("spacer").style.display="none";
    document.querySelector(".modal-contentvic").style.justifyContent="space-evenly";
    modalvic.style.display="flex";
    confirmyesButton.style.display="block";
    confirmnoButton.style.display="block";
    document.getElementById("closeModalvic").style.display="none";
});

confirmyesButton.addEventListener('click', () => {
    window.location.href = window.location.href;
});

confirmnoButton.addEventListener('click', () => {
    modalvic.style.display = "none";
    confirmyesButton.style.display="none";
    confirmnoButton.style.display="none";
});

function lancerConfettis() {

    setTimeout(() => {

        confetti({
        particleCount: 300,
        spread: 70,
        origin: { y: 0.6 }, // hauteur de départ (0 = haut, 1 = bas)
        colors: [
            '#26ccff', // bleu clair
            '#88ff5a', // vert clair
            '#fcff42', // jaune
            '#ffa62d', // orange
            '#ff36ff'  // magenta
        ]
        });

    }, 100);

}
