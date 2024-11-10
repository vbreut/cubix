// script2.js

function prise() {

    let cube=selectedScene.firstElementChild;
    let cubenumber=parseInt(cube.id.match(/\d+/)[0]);
    let cellnumber=cubestatus[0][cubenumber-1];
    let cubeleft=cubestatus[0].indexOf(cellnumber-1);
    let cuberight=cubestatus[0].indexOf(cellnumber+1);
    let cubefront=cubestatus[0].indexOf(cellnumber-6);
    let cubeback=cubestatus[0].indexOf(cellnumber+6);
    let takenscene=null;
    let nbtakenw=0;
    let nbtakenb=0;
    let movtakenw=0;
    let movtakenb=0;
    let movtakenwy=0;
    let movtakenby=0;

    if (cellwidth>80){
        movtakenwy=-60;
        movtakenby=575;
    }
    else
    {
        movtakenwy=-cellwidth/2-5;
        movtakenby=6*cellwidth+5;
    }

    for (let i = 0; i <6; i++)
    {
        if (cubestatus[0][i]===0){nbtakenb++;}
    }

    for (let i = 6; i <12; i++)
    {
        if (cubestatus[0][i]===0){nbtakenw++;}
        console.log(cubestatus[0][i]);
    }

    movtakenb=nbtakenb*45;
    movtakenw=nbtakenw*45;

    if (cubeleft != -1 && ((cubenumber < 7 && cubeleft + 1 > 6) || (cubenumber > 6 && cubeleft + 1 < 7))){
        if (cubestatus[1][cubenumber-1] == cubestatus[1][cubeleft]){
            cubestatus[0][cubeleft]=0;
            cubeleft=cubeleft + 1;
            takenscene=document.getElementById("scene-" + cubeleft);
            

            if (cubeleft < 7) {
                takenscene.style.transform = `translate(${movtakenb}px, ${movtakenby}px) rotateY(20deg) rotateX(20deg) scale3d(0.5, 0.5, 0.5)`;
            }
            else {
                takenscene.style.transform = `translate(${movtakenw}px, ${movtakenwy}px) rotateY(20deg) rotateX(20deg) scale3d(0.5, 0.5, 0.5)`;
            }
        }
    }

    if (cuberight != -1 && ((cubenumber < 7 && cuberight + 1 > 6) || (cubenumber > 6 && cuberight + 1 < 7))){
        if (cubestatus[1][cubenumber-1] == cubestatus[1][cuberight]){
            cubestatus[0][cuberight]=0;
            cuberight=cuberight + 1;
            takenscene=document.getElementById("scene-" + cuberight);
            if (cuberight < 7) {
                takenscene.style.transform = `translate(${movtakenb}px, ${movtakenby}px) rotateY(20deg) rotateX(20deg) scale3d(0.5, 0.5, 0.5)`;
            }
            else {
                takenscene.style.transform = `translate(${movtakenw}px, ${movtakenwy}px) rotateY(20deg) rotateX(20deg) scale3d(0.5, 0.5, 0.5)`;
            }
        }
    }

    if (cubefront != -1 && ((cubenumber < 7 && cubefront + 1 > 6) || (cubenumber > 6 && cubefront + 1 < 7))){
        if (cubestatus[1][cubenumber-1] == cubestatus[1][cubefront]){
            cubestatus[0][cubefront]=0;
            cubefront=cubefront + 1;
            takenscene=document.getElementById("scene-" + cubefront);
            if (cubefront < 7) {
                takenscene.style.transform = `translate(${movtakenb}px, ${movtakenby}px) rotateY(20deg) rotateX(20deg) scale3d(0.5, 0.5, 0.5)`;
            }
            else {
                takenscene.style.transform = `translate(${movtakenw}px, ${movtakenwy}px) rotateY(20deg) rotateX(20deg) scale3d(0.5, 0.5, 0.5)`;
            }
        }
    }

    if (cubeback != -1 && ((cubenumber < 7 && cubeback + 1 > 6) || (cubenumber > 6 && cubeback + 1 < 7))){
        if (cubestatus[1][cubenumber-1] == cubestatus[1][cubeback]){
            cubestatus[0][cubeback]=0;
            cubeback=cubeback + 1;
            takenscene=document.getElementById("scene-" + cubeback);
            if (cubeback < 7) {
                takenscene.style.transform = `translate(${movtakenb}px, ${movtakenby}px) rotateY(20deg) rotateX(20deg) scale3d(0.5, 0.5, 0.5)`;
            }
            else {
                takenscene.style.transform = `translate(${movtakenw}px, ${movtakenwy}px) rotateY(20deg) rotateX(20deg) scale3d(0.5, 0.5, 0.5)`;
            }
        }
    }

}