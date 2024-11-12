// script2.js

function prise() {

    let cube=selectedScene.firstElementChild;
    let cubenumber=parseInt(cube.id.match(/\d+/)[0]);
    let cellnumber=cubestatus[0][cubenumber-1];
    let cubeleft=cubestatus[0].indexOf(cellnumber-1)+1;
    let cuberight=cubestatus[0].indexOf(cellnumber+1)+1;
    let cubefront=cubestatus[0].indexOf(cellnumber-6)+1;
    let cubeback=cubestatus[0].indexOf(cellnumber+6)+1;
    let takenscene=null;
    let nbtakenw=0;
    let nbtakenb=0;
    let movtakenw=0;
    let movtakenb=0;
    let movtakenwy=0;
    let movtakenby=0;
    let takencubes=[0,0,0];
    let i=0;
    let j=0;
    let k=0;

    if (cellnumber%6==0){cuberight= -1;}
    if (cellnumber%6==1){cubeleft= -1;}

    if (cellwidth>80){
        movtakenwy=-60;
        movtakenby=575;
        movtakenb=nbtakenb*30;
        movtakenw=nbtakenw*30;
    }
    else
    {
        movtakenwy=-cellwidth/2-5;
        movtakenby=6*cellwidth+5;
        movtakenb=nbtakenb*cellwidth/3;
        movtakenw=nbtakenw*cellwidth/3;
    }

    if (cubeleft != -1 && ((cubenumber < 7 && cubeleft > 6) || (cubenumber > 6 && cubeleft < 7))){
        if (cubestatus[1][cubenumber-1] == cubestatus[1][cubeleft-1]){
            takencubes[j]=cubeleft;
            j ++;
        }
    }

    if (cuberight != -1 && ((cubenumber < 7 && cuberight > 6) || (cubenumber > 6 && cuberight < 7))){
        if (cubestatus[1][cubenumber-1] == cubestatus[1][cuberight-1]){
            takencubes[j]=cuberight;
            j ++;
        }
    }

    if (cubefront != -1 && ((cubenumber < 7 && cubefront > 6) || (cubenumber > 6 && cubefront< 7))){
        if (cubestatus[1][cubenumber-1] == cubestatus[1][cubefront-1]){
            takencubes[j]=cubefront;
            j ++;
        }
    }

    if (cubeback != -1 && ((cubenumber < 7 && cubeback > 6) || (cubenumber > 6 && cubeback < 7))){
        if (cubestatus[1][cubenumber-1] == cubestatus[1][cubeback-1]){
            takencubes[j]=cubeback;
            j ++;
        }
    }

    for (i = 0; i <3; i++)
    {
        if (takencubes[i] != 0){

            for (k = 0; k <12; k++)
            {
                if (cubestatus[0][k]===0 && k<6){nbtakenb++;}
                if (cubestatus[0][k]===0 && k>5){nbtakenw++;}
            }

            if (cellwidth>80){
                movtakenwy=-60;
                movtakenby=575;
                movtakenb=nbtakenb*30;
                movtakenw=nbtakenw*30;
            }
            else
            {
                movtakenwy=-cellwidth/2-5;
                movtakenby=6*cellwidth+5;
                movtakenb=nbtakenb*cellwidth/3;
                movtakenw=nbtakenw*cellwidth/3;
            }

            takenscene=document.getElementById("scene-" + takencubes[i]);

            if (takencubes[i] < 7) {
                takenscene.style.transform = `translate(${movtakenb}px, ${movtakenby}px) rotateY(18deg) rotateX(18deg) scale3d(0.3, 0.3, 0.3)`;
            }
            else {
                takenscene.style.transform = `translate(${movtakenw}px, ${movtakenwy}px) rotateY(18deg) rotateX(18deg) scale3d(0.3, 0.3, 0.3)`;
            }

            cubestatus[0][takencubes[i]-1]=0;
        }
    }
}

// Récupérer les éléments HTML
const modal = document.getElementById("modal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");

// Ouvrir la modale
openModalButton.addEventListener("click", () => {
    modal.style.display = "block";
});

// Fermer la modale
closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
});

// Fermer la modale en cliquant en dehors de la fenêtre
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});