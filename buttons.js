"use strict";

let selectedScene = null;
let numberofmoves = 0;
let turn = "white";
let forcedcube =[0,0,0,-1];
const board = document.querySelectorAll('.grid');
const firstcell = document.querySelector('.grid');
const scenes = document.querySelectorAll('.scene');
const firstscene = document.querySelector('.scene');
const gameboard = document.getElementById('game-board');
const gameboardclone = document.getElementById('game-board-clone');
const mask0 = document.getElementById('mask0');
const mask = document.getElementById('mask');
const validButton = document.getElementById('valider');
const confirmyesButton = document.getElementById("confirm-yes");
const confirmnoButton = document.getElementById("confirm-no");
const resButton = document.getElementById("res");
const botbutton = document.getElementById("botbutton");
const diffbutton = document.getElementById("diffbutton");
const realbutton = document.getElementById("realbutton");
const manbutton = document.getElementById("manbutton");
const tour = document.getElementById('tour');

let cellrect = firstcell.getBoundingClientRect();
let boardrect = null;// gameboard.getBoundingClientRect();
let cellwidth = cellrect.width + 5;
let scenerect = firstscene.getBoundingClientRect();
let movx = scenerect.width/4 + 5;
let movy = scenerect.width/4 + 5;
let dark="rgb(105, 153, 183)";
let light="rgb(140, 178, 200)";
//let changepossible=1;
let playingmode=1;
//let choice=null;
let rotationinprogress=0;
let waitforsecondmove =0;
const tempo = 350;
//let largeur = document.documentElement.clientWidth;
let scrollXinit=0;
let scrollYinit=0;
let childrenhistory =[];
let indice=[1];
let nbgames = [0];

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

botbutton.addEventListener('click', menubot);

function menubot(){
    modalbot.style.display = "block";
}

diffbutton.addEventListener('click', menudiff);

function menudiff(){
    modaldiff.style.display = "block";
}

realbutton.addEventListener('click', menureal);

function menureal(){
    modalreal.style.display = "block";
}

manbutton.addEventListener('click',choice0);

function choice0() {
    playingmode=0;
    showPage();
}

okbot.addEventListener('click',showPage);

function showPage() {

    if (pseudo !== "" && pseudo!==null){
        let joueurRef = database.ref('joueurs/' + pseudo);
        joueurRef.set({ enLigne: "en partie"});
        joueurRef.onDisconnect().remove();
    }

    if(playingmode==1){
        document.getElementById("adv").textContent = "Bot 1";
        document.getElementById("me").style.color = "white";
        afficherPseudoMasque(pseudo,"me",null, null, null);
    }
    if(playingmode==2){
        document.getElementById("adv").textContent = "Bot 2";
        document.getElementById("me").style.color = "white";
        afficherPseudoMasque(pseudo,"me",null, null, null);
    }
    if(playingmode==3){
        document.getElementById("adv").textContent = "Bot 3";
        document.getElementById("me").style.color = "white";
        afficherPseudoMasque(pseudo,"me",null, null, null);
    }
    if(playingmode==0){
        document.getElementById("adv").style.display="none";
        document.getElementById("me").style.display="none";
    }

    if(playingmode==5){
        leaveButton.style.display="block";
    } else{
        leaveButton.style.display="none";
    }


    document.getElementById("game").style.display="block";
    document.getElementById("home").style.display="none";
    modalvic.style.display = "none";
    modalreal.style.display = "none";
    modaldiff.style.display = "none";
    modalbot.style.display = "none";

    //boardrect= gameboard.getBoundingClientRect();
    scenerect = firstscene.getBoundingClientRect();
    cellrect = firstcell.getBoundingClientRect();
    //largeur = document.documentElement.clientWidth;
    //scrollXinit=window.scrollX;
    //scrollYinit=window.scrollY;
    cellwidth = cellrect.width + 5;
    movx = scenerect.width/4 + 5;
    movy = scenerect.width/4 + 5;

    pastButton.addEventListener('click', ()=> pastclick());
    futureButton.addEventListener('click', ()=> futureclick());
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
     
        if (selectedScene != null && occupied == false && (playingmode==0 || turn=="white") && waitforsecondmove == 0){

            if (cell.style.backgroundColor == dark) {
                moveCubeTo3(cell.id, cell.style.backgroundColor);
            }

            if (cell.style.backgroundColor == light && numberofmoves < 2) {
                moveCubeTo3(cell.id, cell.style.backgroundColor);
            }
        }
    });
});


function changefacesmove(cube){
    //let cube=selectedScene.firstElementChild;
    let cubenumber=parseInt(cube.id.match(/\d+/)[0]) - 1;

    let tab = {rs : ".shape1", rd : ".shape2", wd : ".shape3", ws : ".shape4", bs : ".shape5", bd : ".shape6"};

    //0 cell nb
    //1 face up, par défaut red square
    //2 face down, red disc
    //3 face front, black square
    //4 face back, black disc
    //5 face left, white square
    //6 face right, white disc

    if(cubenumber<6){
        let facetop=cube.querySelector(".face.top"); //rs
        let facebottom=cube.querySelector(".face.bottom"); //rd
        let faceright=cube.querySelector(".face.right"); //wd
        let faceleft=cube.querySelector(".face.left"); //ws
        let facefront=cube.querySelector(".face.front"); //bs
        let faceback=cube.querySelector(".face.back"); //bd

        let newshapetop = cube.querySelector(tab[cubestatus[1][cubenumber]]);
        let newshapebottom = cube.querySelector(tab[cubestatus[2][cubenumber]]);
        let newshapefront = cube.querySelector(tab[cubestatus[3][cubenumber]]);
        let newshapeback = cube.querySelector(tab[cubestatus[4][cubenumber]]);
        let newshapeleft = cube.querySelector(tab[cubestatus[5][cubenumber]]);
        let newshaperight = cube.querySelector(tab[cubestatus[6][cubenumber]]);

        facetop.innerHTML="";
        facebottom.innerHTML="";
        faceright.innerHTML="";
        faceleft.innerHTML="";
        facefront.innerHTML="";
        faceback.innerHTML="";

        facetop.appendChild(newshapetop);
        facebottom.appendChild(newshapebottom);
        faceright.appendChild(newshaperight);
        faceleft.appendChild(newshapeleft);
        facefront.appendChild(newshapefront);
        faceback.appendChild(newshapeback);

    } else {
        let facewtop=cube.querySelector(".facew.top"); //rs
        let facewbottom=cube.querySelector(".facew.bottom"); //rd
        let facewright=cube.querySelector(".facew.right"); //wd
        let facewleft=cube.querySelector(".facew.left"); //ws
        let facewfront=cube.querySelector(".facew.front"); //bs
        let facewback=cube.querySelector(".facew.back"); //bd

        let newshapetop = cube.querySelector(tab[cubestatus[1][cubenumber]]);
        let newshapebottom = cube.querySelector(tab[cubestatus[2][cubenumber]]);
        let newshapefront = cube.querySelector(tab[cubestatus[3][cubenumber]]);
        let newshapeback = cube.querySelector(tab[cubestatus[4][cubenumber]]);
        let newshapeleft = cube.querySelector(tab[cubestatus[5][cubenumber]]);
        let newshaperight = cube.querySelector(tab[cubestatus[6][cubenumber]]);

        facewtop.innerHTML="";
        facewbottom.innerHTML="";
        facewright.innerHTML="";
        facewleft.innerHTML="";
        facewfront.innerHTML="";
        facewback.innerHTML="";

        facewtop.appendChild(newshapetop);
        facewbottom.appendChild(newshapebottom);
        facewright.appendChild(newshaperight);
        facewleft.appendChild(newshapeleft);
        facewfront.appendChild(newshapefront);
        facewback.appendChild(newshapeback);
    }
}

function moveCubeTo3(targetCellid, cellcolor) {//étage de protection pour le déplacement manuel

    let cube=selectedScene.firstElementChild;
    let i=0;

    if (rotationinprogress){
        waitforsecondmove =1;

        selectedScene.addEventListener('transitionend', () => {

            waitloop(i,targetCellid, cellcolor);
            /*setTimeout(() => {

                moveCubeTo4(targetCellid, cellcolor);

                waitforsecondmove =0;
            }, 50);*/    
        },{once: true});
    }

    else {
        moveCubeTo4(targetCellid, cellcolor);
    }
}

function waitloop(i,targetCellid, cellcolor){

    i=i+1;
    if(i==50){
        console.log("échec");
        return;
    }
    if(rotationinprogress)
        setTimeout(() => {
            waitloop(i,targetCellid, cellcolor);
        }, 50);
    else{

        moveCubeTo4(targetCellid, cellcolor);
        waitforsecondmove =0;
    }
}



function moveCubeTo4(targetCellid, cellcolor) {

    //let largeur2 = window.innerWidth;
    let largeur2 = document.documentElement.clientWidth;

    //let rotx=0;
    //let roty=0;
    //let rotz=0;
    let targetCell=document.getElementById(targetCellid);

    let coordcell = targetCell.getBoundingClientRect();
    let x = coordcell.left;// + window.scrollX - scrollXinit;
    let y = coordcell.top;// + window.scrollY - scrollYinit;

    let coordscene= selectedScene.getBoundingClientRect();
    let xc = coordscene.left;// + window.scrollX - scrollXinit;
    let yc = coordscene.top;// + window.scrollY - scrollYinit;
    boardrect= gameboard.getBoundingClientRect();

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
            
            rotationinprogress=1;
            cube.style.transform = `rotateX(-90deg)`;

            cube.addEventListener('transitionend', () => {
                //void cube.offsetHeight;
                cube.style.transition = 'none';

                cube.style.transform="none";
                void cube.offsetHeight;

                //changefacesdown();
                changefacesmove(cube);
                
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
            
            rotationinprogress=1;
            cube.style.transform = `rotateX(90deg)`;

            cube.addEventListener('transitionend', () => {
                //void cube.offsetHeight;
                cube.style.transition = 'none';

                cube.style.transform="none";
                void cube.offsetHeight;

                //changefacesup();
                changefacesmove(cube);
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

            rotationinprogress=1;
            cube.style.transform = `rotateY(90deg)`;

            cube.addEventListener('transitionend', () => {
                //void cube.offsetHeight;
                cube.style.transition = 'none';

                cube.style.transform="none";
                void cube.offsetHeight;

                //changefacesright();
                changefacesmove(cube);
                
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

            rotationinprogress=1;
            cube.style.transform = `rotateY(-90deg)`;

            cube.addEventListener('transitionend', () => {
                //void cube.offsetHeight;
                cube.style.transition = 'none';

                cube.style.transform="none";
                void cube.offsetHeight;

                //changefacesleft();
                changefacesmove(cube);

                cube.style.transition = transf;
                rotationinprogress=0;
            },{once: true});

            cubestatus[1][cubenumber]= faceright;
            cubestatus[2][cubenumber]= faceleft;
            cubestatus[5][cubenumber]= faceup;
            cubestatus[6][cubenumber]= facedown;
            cubestatus[0][cubenumber]= cubestatus[0][cubenumber] - 1;
        }

        x3d = x + movx - boardrect.left - 5 - 0.5;//+ (largeur - largeur2)/2;
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
        //problème de couleur parfois sur la première case ??
    }
}

validButton.addEventListener('click', () => {


    if (waitforsecondmove){ //utile pour les validations manuelles
        return;
    }

    if (numberofmoves > 0 && (playingmode==0||turn=="white") && playingmode !== 4 && playingmode !==5){

        let doublemove=0;
        let movelength=0;
        //let delay=50;

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
                    movelength = 4;
                }

                if (doublemove==-1){
                    //tous les cubes sont bloqués. Les blancs continuent à jouer
                }
                waitforvalid(movelength);
            }, tempo + 50);
        }
    }

    if (numberofmoves > 0 && (playingmode==4 || playingmode==5) && turn=="white"){

        valider();

        if (forcedcube[3]== -1 || forcedcube[3]>5){// si on a bien pris le cube forcé de l'adversaire ou si c'est l'autre qui est forcé
            clean();//envoie le coup, et valide mon coup chez l'adversaire
        }

        //if (turn=="end") {return;}

    }

});


function valider(){

    prise(); //la fonction va s'exécuter avant de passer à la suite

    if (forcedcube[3]!= -1){//mis à jour dans prise
        return;
    }
    else{document.getElementById("info").textContent="";}

    victoire();

    numberofmoves = 0;

    let cube=selectedScene.firstElementChild;
    if (rotationinprogress){ //utile pour la validation manuelle
        selectedScene.addEventListener('transitionend', () => {
            selectedScene = null;
        },{once: true});
    } else {
        selectedScene = null;
    }

    if(playingmode<=4){
        historyrealtime();
    }

    if (turn=="end") {
        return;
    }

    let colortest = document.querySelector('.face'); //on regarde une face pour voir de quelle couleur on est (si les noirs sont en haut)
    let col= getComputedStyle(colortest).backgroundColor;
    if (turn=="white") {
        turn="black";

        if (col == "rgb(50, 50, 50)" || col == "rgba(50, 50, 50, 0.6)"){
            tour.style.backgroundColor = "rgb(0, 0, 0)";
        } else {tour.style.backgroundColor = "rgb(255, 255, 255)";}

    } else {
        turn="white";
        if (col == "rgb(50, 50, 50)" || col == "rgba(50, 50, 50, 0.6)"){
            tour.style.backgroundColor = "rgb(255, 255, 255)";
        } else {tour.style.backgroundColor = "rgb(0, 0, 0)";}
    }
}

function historyrealtime(){

    let struct = null;
    struct= {joueur: pseudo, matrice : cubestatus.map(subArray => [...subArray])};
    childrenhistory.push(struct);
    indice=[1];
    gameboardclone.style.visibility = "hidden";
    mask.style.visibility = "hidden";
    mask0.style.visibility = "hidden";

}



// Récupérer les éléments HTML
const modal = document.getElementById("modal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");

const modalvic = document.getElementById("modalvic");
const modalreal = document.getElementById("modalreal");
const modaldiff = document.getElementById("modaldiff");
const modalbot = document.getElementById("modalbot");
const modalavatar = document.getElementById("modalavatar");
const closeModalvicButton = document.getElementById("closeModalvic");
const closeModalrealButton = document.getElementById("closeModalreal");
const closeModaldiffButton = document.getElementById("closeModaldiff");
const closeModalbotButton = document.getElementById("closeModalbot");
const closeModalavatarButton = document.getElementById("closeModalavatar")

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

closeModalbotButton.addEventListener("click", () => {
    modalbot.style.display = "none";
});

closeModalrealButton.addEventListener("click", () => {
    modalreal.style.display = "none";
});

closeModaldiffButton.addEventListener("click", () => {
    modaldiff.style.display = "none";
});

closeModalavatarButton.addEventListener("click", () => {
    modalavatar.style.display = "none";
});

// Fermer la modale en cliquant en dehors de la fenêtre
window.addEventListener("click", (event) => {
    if (event.target === modal || event.target === modalvic || event.target === modalreal || event.target === modaldiff || event.target === modalbot || event.target === modalavatar) {
        modal.style.display = "none";
        modalvic.style.display = "none";
        modalbot.style.display = "none";
        modaldiff.style.display = "none";
        modalreal.style.display = "none";
        modalavatar.style.display = "none";
    }
});

function affichervic(message){
    document.getElementById("message").textContent=message;
    confirmyesButton.style.display="none";
    confirmnoButton.style.display="none";
    document.getElementById("closeModalvic").style.display="block";
    modalvic.style.display = "block";
    document.querySelector(".modal-contentvic").style.justifyContent="space-between";
    document.getElementById("spacer").style.display="block";
}


const boutonsRadio = document.querySelectorAll('input[name="niveau"]');


// Ajouter un écouteur d'événement pour chaque bouton radio
boutonsRadio.forEach(bouton => {
    bouton.addEventListener("click", (event) => {

        playingmode=event.target.value;

    });
});

const toggle = document.getElementById('transparence');
toggle.addEventListener('click', transp);

function transp(){

    let colorblack = "rgb(50, 50, 50)";
    let colorblackt = "rgba(50, 50, 50, 0.6)";
    let colorwhite = "rgb(238, 223, 195)";
    let colorwhitet = "rgba(238, 223, 195, 0.7)";
    let colornormal ="rgb(69, 123, 157)";
    let coloractive ="rgb(92, 165, 210)";
    let facews = document.getElementsByClassName('facew');
    let faces = document.getElementsByClassName('face');
    let test = null
    let test2 = getComputedStyle(toggle).backgroundColor;

    if (test2 == colornormal){
        toggle.style.backgroundColor = coloractive;
    } else {
        toggle.style.backgroundColor = colornormal;
    }


    for (let facew of facews) {
        test = getComputedStyle(facew).backgroundColor;

        if(test == colorwhite){
            facew.style.backgroundColor = colorwhitet;
        }
        if(test == colorwhitet){
            facew.style.backgroundColor = colorwhite;
        }

        if(test == colorblack){
            facew.style.backgroundColor = colorblackt;
        }
        if(test == colorblackt){
            facew.style.backgroundColor = colorblack;
        }
    }

    for (let face of faces) {
        test = getComputedStyle(face).backgroundColor;

        if(test == colorwhite){
            face.style.backgroundColor = colorwhitet;
        }
        if(test == colorwhitet){
            face.style.backgroundColor = colorwhite;
        }

        if(test == colorblack){
            face.style.backgroundColor = colorblackt;
        }
        if(test == colorblackt){
            face.style.backgroundColor = colorblack;
        }
    }

};

resButton.addEventListener('click', () => {
    document.getElementById("message").style.display="block";
    document.getElementById("botsubmenu2").style.display="none";
    document.getElementById("message").textContent="Terminer la partie ?";
    document.getElementById("spacer").style.display="none";
    document.querySelector(".modal-contentvic").style.justifyContent="space-evenly";
    modalvic.style.display="flex";
    confirmyesButton.style.display="block";
    confirmnoButton.style.display="block";
    document.getElementById("closeModalvic").style.display="none";
});

confirmyesButton.addEventListener('click', () => {
    let joueurRef = database.ref('joueurs/' + pseudo);
    joueurRef.remove();

    if(document.getElementById("message").textContent=="Terminer la partie ?" && playingmode ==5){
        const gamediffRef = database.ref('gamesdiff/' + gameIddiff);
        gamediffRef.once("value").then(snapshot=>{

            if(snapshot.val().joueur1 == "Abandon" || snapshot.val().joueur2 == "Abandon"){
                gamediffRef.remove();

                nbgames[0]=nbgames[0]+1;
                database.ref('count/' + pseudo).set({ nb: nbgames[0] });

            }

            if (snapshot.val().joueur1==pseudo && snapshot.val().joueur2 !== "Abandon" && snapshot.val().joueur2 !== "Libre"){
                gamediffRef.update({
                    joueur1: "Abandon"
                });

                nbgames[0]=nbgames[0]+1;
                database.ref('count/' + pseudo).set({ nb: nbgames[0] });
            }
            if (snapshot.val().joueur2==pseudo && snapshot.val().joueur1 !== "Abandon" && snapshot.val().joueur1 !== "Libre"){
                gamediffRef.update({
                    joueur2: "Abandon"
                });

                nbgames[0]=nbgames[0]+1;
                database.ref('count/' + pseudo).set({ nb: nbgames[0] });
            }


            if(snapshot.val().joueur1 == "Libre" || snapshot.val().joueur2 == "Libre"){
                gamediffRef.remove();

            }

            gameIddiff=0;

        });
    }
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
