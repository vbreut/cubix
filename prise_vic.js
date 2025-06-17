"use strict";

function prise() {

    let cube=selectedScene.firstElementChild;
    let cubenumber=parseInt(cube.id.match(/\d+/)[0]);
    let cellnumber=cubestatus[0][cubenumber - 1];
    let cubeleft=cubestatus[0].indexOf(cellnumber - 1) + 1;
    let cuberight=cubestatus[0].indexOf(cellnumber + 1) + 1;
    let cubefront=cubestatus[0].indexOf(cellnumber - 6) + 1;
    let cubeback=cubestatus[0].indexOf(cellnumber + 6) + 1;
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

    if (cellnumber%6==0){cuberight= -2;}
    if (cellnumber%6==1){cubeleft= -2;}
    if (cellnumber>30){cubeback= -2;}
    if (cellnumber<7){cubefront= -2;}

    /*if (cellwidth>80){
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
    }*/

    if (cubeleft > 0 && ((cubenumber < 7 && cubeleft > 6) || (cubenumber > 6 && cubeleft < 7))){
        if (cubestatus[1][cubenumber - 1] == cubestatus[1][cubeleft - 1]){
            takencubes[j]=cubeleft;
            j ++;
        }
    }

    if (cuberight > 0 && ((cubenumber < 7 && cuberight > 6) || (cubenumber > 6 && cuberight < 7))){
        if (cubestatus[1][cubenumber - 1] == cubestatus[1][cuberight - 1]){
            takencubes[j]=cuberight;
            j ++;
        }
    }

    if (cubefront > 0 && ((cubenumber < 7 && cubefront > 6) || (cubenumber > 6 && cubefront< 7))){
        if (cubestatus[1][cubenumber - 1] == cubestatus[1][cubefront - 1]){
            takencubes[j]=cubefront;
            j ++;
        }
    }

    if (cubeback > 0 && ((cubenumber < 7 && cubeback > 6) || (cubenumber > 6 && cubeback < 7))){
        if (cubestatus[1][cubenumber - 1] == cubestatus[1][cubeback - 1]){
            takencubes[j]=cubeback;
            j ++;
        }
    }

    //check si le cube forcé est bien pris
    if(forcedcube[3]!= -1){
        let forcedcubetaken=takencubes.indexOf(forcedcube[3] + 1);
        if (forcedcubetaken== -1){
            return;
        }
        else{
            forcedcube[0]=0;
            forcedcube[1]=0;
            forcedcube[2]=0;
            forcedcube[3]= -1;
        }
    }

    for (i = 0; i <3; i++)
    {
        if (takencubes[i] != 0){

            nbtakenb=0;
            nbtakenw=0;

            for (k = 0; k <12; k++)
            {
                if (cubestatus[0][k]===0 && k<6){nbtakenb++;}
                if (cubestatus[0][k]===0 && k>5){nbtakenw++;}
            }

            /*if (cellwidth>80){
                movtakenwy=-60;
                movtakenby=575;
                movtakenb=nbtakenb*35;
                movtakenw=nbtakenw*35;
            }
            else
            {*/
                movtakenwy=-cellwidth/2 - 5;
                movtakenby=6*cellwidth + 5;
                movtakenb=nbtakenb*cellwidth/2.5;
                movtakenw=nbtakenw*cellwidth/2.5;
            //}

            takenscene=document.getElementById("scene-" + takencubes[i]);

            if (takencubes[i] < 7) {
                takenscene.style.transform = `translate(${movtakenb}px, ${movtakenby}px) rotateY(18deg) rotateX(18deg) scale3d(0.4, 0.4, 0.4)`;
            }
            else {
                takenscene.style.transform = `translate(${movtakenw}px, ${movtakenwy}px) rotateY(18deg) rotateX(18deg) scale3d(0.4, 0.4, 0.4)`;
            }

            cubestatus[0][takencubes[i]-1]=0;
        }
    }

    //check s'il reste des cubes
    j=0;
    for (i = 0; i <6; i++){
        if(cubestatus[0][i]!=0){j++}
    }
    if(j==0){
        if(pseudo!==null){
            affichervic(`Victoire de ${pseudo} !`);
        }
        if (pseudo==null || playingmode==0){
            affichervic("Victoire des blancs"); 
        }
        lancerConfettis();
        turn="end";
    }

    j=0;
    for (i = 6; i <12; i++){
        if(cubestatus[0][i]!=0){j++}
    }
    if(j==0){
        if(pseudo!==null){
            let adv=document.getElementById("adv").textContent
            affichervic(`Victoire de ${adv} !`);
        }
        if (pseudo==null || playingmode==0){
            affichervic("Victoire des noirs"); 
        }
        turn="end";
    }

}

function victoire(){

    let cubenumber=0;
    let c=[0,0,0,0,0];

    for(cubenumber=0; cubenumber<12; cubenumber++){

        if (cubestatus[1][cubenumber]=="rs" && cubestatus[0][cubenumber]<7 && cubestatus[0][cubenumber]!=0 && cubenumber>5){
            c=capture(cubenumber+1);
            if (c[0]==0 && turn=="white"){
                if(pseudo!==null){
                    affichervic(`Victoire de ${pseudo} !`);
                }
                if (pseudo==null || playingmode==0){
                    affichervic("Victoire des blancs"); 
                }
                lancerConfettis();
                turn="end";
                return;
            }
            if (c[0]!=0 && turn=="white"){
                document.getElementById("info").textContent="Coup forcé"
                forcedcube[0]=c[0];
                forcedcube[1]=c[1];
                forcedcube[2]=c[2];
                forcedcube[3]=cubenumber;
                return;
            }
        }

        if (cubestatus[1][cubenumber]=="rs" && cubestatus[0][cubenumber]>30 && cubenumber<6){
            c=capture(cubenumber+1);
            if (c[0]==0 && turn=="black"){
                if(pseudo!==null){
                    let adv=document.getElementById("adv").textContent
                    affichervic(`Victoire de ${adv} !`);
                }
                if (pseudo==null || playingmode==0){
                    affichervic("Victoire des noirs"); 
                }
                turn="end";
                return;
            }
            if (c[0]!=0 && turn=="black"){
                document.getElementById("info").textContent="Coup forcé"
                forcedcube[0]=c[0];
                forcedcube[1]=c[1];
                forcedcube[2]=c[2];
                forcedcube[3]=cubenumber;
                return;
            }
        }
    }
}
