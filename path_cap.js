"use strict";

function path(deep, deepmax, cubetomove, obj, solutions, found, cubeid) {

    let i=0;

    if (deep==deepmax) {return;}

    let cubeback=cubestatus[0].indexOf(cubetomove[0] + 6);
    let cubefront=cubestatus[0].indexOf(cubetomove[0] - 6);
    let cubeleft=cubestatus[0].indexOf(cubetomove[0] - 1);
    let cuberight=cubestatus[0].indexOf(cubetomove[0] + 1);
    if (cubeback==cubeid - 1){cubeback= -1;}//si on bute sur notre propre cube on en tient pas compte (dans cubestatus il est toujours dans sa position initiale)
    if (cubefront==cubeid - 1){cubefront= -1;}
    if (cubeleft==cubeid - 1){cubeleft= -1;}
    if (cuberight==cubeid - 1){cuberight= -1;}
    if (cubetomove[0]%6==0){cuberight= -2;}
    if (cubetomove[0]%6==1){cubeleft= -2;}
    if (cubetomove[0]>30){cubeback= -2;}
    if (cubetomove[0]<7){cubefront= -2;}
    if (cubetomove[0]==0){return;}

    //bas
    if (cubeback == -1 && (deep == 0 || solutions[found[0]][deep-1] != cubetomove[0] + 6)){
        solutions[found[0]][deep]=cubetomove[0];
        movedown(cubetomove);

        if (cubetomove[0]==obj[0] && cubetomove[1]==obj[1]) {
            solutions[found[0]][deep + 1]=cubetomove[0];
            if(deep + 1<deepmax){
                for(i=deep+2; i<solutions.length; i++){
                    solutions[found[0]][i]=0;
                }
            }

            found[0]=found[0] + 1;

            for(i=0; i<deep; i++){
                solutions[found[0]][i]=solutions[found[0] - 1][i];
            }

            moveup(cubetomove);
            return;
        }
        path(deep+1, deepmax, cubetomove, obj, solutions, found, cubeid);
        moveup(cubetomove);
    }

    //haut
    if (cubefront == -1 && (deep == 0 || solutions[found[0]][deep-1] != cubetomove[0] - 6)){
        solutions[found[0]][deep]=cubetomove[0];
        moveup(cubetomove);


        if (cubetomove[0]==obj[0] && cubetomove[1]==obj[1]) {
            solutions[found[0]][deep + 1]=cubetomove[0];
            if(deep + 1<deepmax){
                for(i=deep+2; i<solutions.length; i++){
                    solutions[found[0]][i]=0;
                }
            }
            found[0]=found[0] + 1;

            for(i=0; i<deep; i++){
                solutions[found[0]][i]=solutions[found[0] - 1][i];
            }
            movedown(cubetomove);
            return;
        }
        path(deep+1, deepmax, cubetomove, obj, solutions, found, cubeid);
        movedown(cubetomove);
    }
    //gauche
    if (cubeleft == -1 && (deep == 0 || solutions[found[0]][deep-1] != cubetomove[0] - 1)){
        solutions[found[0]][deep]=cubetomove[0];
        moveleft(cubetomove);

        if (cubetomove[0]==obj[0] && cubetomove[1]==obj[1]) {
            solutions[found[0]][deep + 1]=cubetomove[0];
            if(deep + 1<deepmax){
                for(i=deep+2; i<solutions.length; i++){
                    solutions[found[0]][i]=0;
                }
            }
            found[0]=found[0] + 1;

            for(i=0; i<deep; i++){
                solutions[found[0]][i]=solutions[found[0] - 1][i];
            }
            moveright(cubetomove);
            return;
        }
        path(deep+1, deepmax, cubetomove, obj, solutions, found, cubeid);
        moveright(cubetomove);
    }

    //droite
    if (cuberight == -1 && (deep == 0 || solutions[found[0]][deep-1] != cubetomove[0] + 1)){
        solutions[found[0]][deep]=cubetomove[0];
        moveright(cubetomove);


        if (cubetomove[0]==obj[0] && cubetomove[1]==obj[1]) {
            solutions[found[0]][deep + 1]=cubetomove[0];
            if(deep + 1<deepmax){
                for(i=deep+2; i<solutions.length; i++){
                    solutions[found[0]][i]=0;
                }
            }
            found[0]=found[0] + 1;

            for(i=0; i<deep; i++){
                solutions[found[0]][i]=solutions[found[0] - 1][i];
            }
            moveleft(cubetomove);
            return;
        }
        path(deep+1, deepmax, cubetomove, obj, solutions, found, cubeid);
        moveleft(cubetomove);
    }
}

function movedown(cubetomove){
    cubetomove[0]=cubetomove[0] + 6;
    let faceup=cubetomove[1];
    cubetomove[1]=cubetomove[3];
    cubetomove[3]=cubetomove[2];
    cubetomove[2]=cubetomove[4];
    cubetomove[4]=faceup;
}

function moveup(cubetomove){
    cubetomove[0]=cubetomove[0] - 6;
    let faceup=cubetomove[1];
    cubetomove[1]=cubetomove[4];
    cubetomove[4]=cubetomove[2];
    cubetomove[2]=cubetomove[3];
    cubetomove[3]=faceup;
}

function moveleft(cubetomove){
    cubetomove[0]=cubetomove[0] - 1;
    let faceup=cubetomove[1];
    cubetomove[1]=cubetomove[6];
    cubetomove[6]=cubetomove[2];
    cubetomove[2]=cubetomove[5];
    cubetomove[5]=faceup;
}

function moveright(cubetomove){
    cubetomove[0]=cubetomove[0] + 1;
    let faceup=cubetomove[1];
    cubetomove[1]=cubetomove[5];
    cubetomove[5]=cubetomove[2];
    cubetomove[2]=cubetomove[6];
    cubetomove[6]=faceup;
    //let facedown=cubetomove[2];
    //let facefront=cubetomove[3];
    //let faceback=cubetomove[4];
    //let faceleft=cubetomove[5];
    //let faceright=cubetomove[6];
}

function capture(cubetotest){
    let cellnumber=cubestatus[0][cubetotest - 1];
    let cellleft=cellnumber - 1;
    let cellright=cellnumber + 1;
    if (cellnumber%6==0){cellright= 0;}
    if (cellnumber%6==1){cellleft= 0;}
    let faceup=cubestatus[1][cubetotest - 1];
    let deepmax=2;
    let cubeid=0;
    let i=0;
    let j=0;
    let start=0;
    let end=0;
    let deep=0;
    let cubetomove=[];
    let solutions=[
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
    ];
    let found=[0];
    let obj=[
        [cellnumber - 6,faceup],
        [cellnumber + 6,faceup],
        [cellleft,faceup],
        [cellright,faceup],
    ];
    let c=[0,0,0,0,0];

    if (cubetotest<7){start=7;end=13;}
    if (cubetotest>6){start=1;end=7;}

    /*if(cellnumber==0){
        console.log("warning");
    }*/

    for(cubeid=start; cubeid<end; cubeid++){
        cubetomove=[];
        if (cubestatus[0][cubeid-1]!=0){
            for(i=0; i<7; i++){
                cubetomove.push(cubestatus[i][cubeid-1]);
            }
            for(j=0;j<4;j++){
                if(obj[j][0]>0 && obj[j][0]<37){
                    solutions=[
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                        [0,0,0,0,0],
                    ];
                    found=[0];
                    deep=0;
                    path(deep, deepmax, cubetomove, obj[j], solutions, found, cubeid);
                    if(found[0]>0){
                        c=solutions[0];
                        return c; //on en trouve 1 ça suffit
                    }
                }
            }
        }
    }
    return c;
}
