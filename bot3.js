"use strict";

function botlevel3(){

    let nb=0;
    //coup forcé
    if(forcedcube[3]!=-1){
        nb=forcedmove();
        return nb;
    }

    //victoire possible en 2 cases ?
    nb=pathtovictory(2);
    if(nb<2){//console.log("pathtovictory(2)");
        return nb;}

    nb=defense(2);
    if(nb<2){//console.log("defense(2)");
        return nb;}

    nb=pathtovictory(4);
    if(nb<2){//console.log("pathtovictory(4)");
        return nb;}

    nb=defense(4);
    if(nb<2){//console.log("defense(4)");
        return nb;}

    nb=taketake();
    if(nb<2){//console.log("taketake");
        return nb;}

    //prise possible pour l'adversaire ?
    nb=protect();
    if(nb<2){//console.log("protect");
        return nb;}

    //attaque agressive ?

    //coup en avant si possible
    nb=movecareful(); //on va potentiellement se créer des menaces en 3 ou 4... Même bouger le cube qui protégeait des menaces en 3 ou 4
    if(nb<2){//console.log("movecareful");
        return nb;}

    //sinon coup au hasard
    nb=botlevel1();
    //console.log("botlevel1");
    return nb;
}

function pathtovictory(deepmax){
    let i=0;
    let j=0;
    let obj=[];
    let cubetomove=[];
    let solutions=[
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
    ];
    let c=[0,0,0,0,0];
    let c2=[0,0,0,0,0];
    let found=[0];
    let deep=0;
    let taille=[];
    let leng=[];
    let sol=0;

    let cubeid=0;
    let currentcell=null;
    let selectedcell=null;
    let sauvstatus=cubestatus.map(subArray => [...subArray]);

    for(i=31; i<37; i++){
        obj.push([i,"rs"]); //cellule,face
    }

    for(cubeid=1; cubeid<7; cubeid++){
        cubetomove=[];
        if (cubestatus[0][cubeid-1]!=0){
            for(i=0; i<7; i++){
                cubetomove.push(cubestatus[i][cubeid-1]);
            }
            for(i=0;i<6;i++){
                deep=0;
                path(deep, deepmax, cubetomove, obj[i], solutions, found, cubeid);
            }
        }
    }

    if(found[0]>0){
        //recherche du plus court
        /*for(i=2;i<5;i++){
            for(j=0;j<found[0];j++){
                if(solutions[j][i]==0){
                    shorter=j;
                    i=5;
                    break;
                }
            }
        }*/

        for(i=0;i<5;i++){
            taille[i]=i;
        }

        for(i=0;i<found[0];i++){
            for(j=1;j<5;j++){
                if(solutions[i][j]==0){
                    leng[i]=j-1;
                    break;
                }
                if(j==4){
                    leng[i]=j;
                    break;
                }
            }
        }

        for(i=0;i<found[0];i++){
            for(j=i+1;j<found[0];j++){
                if(leng[taille[i]]>leng[taille[j]]){
                    let temp=taille[i];
                    taille[i]=taille[j];
                    taille[j]=temp;
                }
            }
        }

        for(i=0;i<found[0];i++){

            cubeid=cubestatus[0].indexOf(solutions[taille[i]][0]) + 1;

            if(solutions[taille[i]][4]==0 && solutions[taille[i]][3]==0 && solutions[taille[i]][2]==0){//1 case de déplacement
                moveCubeTosimu(solutions[taille[i]][0],solutions[taille[i]][1]);

                prisesimu(cubeid);
                c=capture(cubeid);

                cubestatus=sauvstatus.map(subArray => [...subArray]);

                if(c[0]==0){//si pas de capture à l'arivée et pas de menace on joue
                    selectedScene = document.getElementById("scene-" + cubeid);

                    currentcell= document.getElementById("cell-" + solutions[taille[i]][0]);
                    selectcurrentcell(currentcell);
                    selectedcell = document.getElementById("cell-" + solutions[taille[i]][1]);
                    moveCubeTo3(selectedcell, light);
                    return 0;
                }
            }

            if(solutions[taille[i]][4]==0 && solutions[taille[i]][3]==0 && solutions[taille[i]][2]!=0){//2 cases
                moveCubeTosimu(solutions[taille[i]][0],solutions[taille[i]][1]);
                moveCubeTosimu(solutions[taille[i]][1],solutions[taille[i]][2]);

                prisesimu(cubeid);
                c=capture(cubeid);

                cubestatus=sauvstatus.map(subArray => [...subArray]);

                if(c[0]==0){//si pas de capture à l'arivée on joue
                    selectedScene = document.getElementById("scene-" + cubeid);

                    currentcell= document.getElementById("cell-" + solutions[taille[i]][0]);
                    selectcurrentcell(currentcell);
                    selectedcell = document.getElementById("cell-" + solutions[taille[i]][1]);
                    moveCubeTo3(selectedcell, light);

                    setTimeout(() => {
                        selectedcell = document.getElementById("cell-" + solutions[taille[i]][2]);
                        moveCubeTo3(selectedcell, light);
                    }, tempo + 50);
                    return 1;
                }
            }

            if(solutions[taille[i]][4]==0 && solutions[taille[i]][3]!=0){//3 cases
                moveCubeTosimu(solutions[taille[i]][0],solutions[taille[i]][1]);
                moveCubeTosimu(solutions[taille[i]][1],solutions[taille[i]][2]);

                prisesimu(cubeid);
                c=capture(cubeid);

                moveCubeTosimu(solutions[taille[i]][2],solutions[taille[i]][3]);
                prisesimu(cubeid);
                c2=capture(cubeid);
                sol=menace(2);

                cubestatus=sauvstatus.map(subArray => [...subArray]);
                
                if(c[0]==0 && c2[0]==0 && sol==0){//si pas de capture à l'arrivée et à la deuxième case et pas de menace plus courte, on joue jusqu'à la deuxième case
                    selectedScene = document.getElementById("scene-" + cubeid);

                    currentcell= document.getElementById("cell-" + solutions[taille[i]][0]);
                    selectcurrentcell(currentcell);
                    selectedcell = document.getElementById("cell-" + solutions[taille[i]][1]);
                    moveCubeTo3(selectedcell, light);

                    setTimeout(() => {
                        selectedcell = document.getElementById("cell-" + solutions[taille[i]][2]);
                        moveCubeTo3(selectedcell, light);
                    }, tempo + 50);
                    return 1;
                }
            }

            if(solutions[taille[i]][4]!=0){//4 cases
                moveCubeTosimu(solutions[taille[i]][0],solutions[taille[i]][1]);
                moveCubeTosimu(solutions[taille[i]][1],solutions[taille[i]][2]);

                prisesimu(cubeid);
                c=capture(cubeid);

                moveCubeTosimu(solutions[taille[i]][2],solutions[taille[i]][3]);
                moveCubeTosimu(solutions[taille[i]][3],solutions[taille[i]][4]);
                prisesimu(cubeid);
                c2=capture(cubeid);

                sol=menace(2);

                cubestatus=sauvstatus.map(subArray => [...subArray]);
                
                if(c[0]==0 && c2[0]==0 && sol===0){//si pas de capture à l'arrivée et à la deuxième case, on joue jusqu'à la deuxième case
                    selectedScene = document.getElementById("scene-" + cubeid);

                    currentcell= document.getElementById("cell-" + solutions[taille[i]][0]);
                    selectcurrentcell(currentcell);
                    selectedcell = document.getElementById("cell-" + solutions[taille[i]][1]);
                    moveCubeTo3(selectedcell, light);

                    setTimeout(() => {
                        selectedcell = document.getElementById("cell-" + solutions[taille[i]][2]);
                        moveCubeTo3(selectedcell, light);
                    }, tempo + 50);
                    return 1;
                }
            }
        }
    }
    return 2;
}

function moveCubeTosimu(currentcell, targetCell) {

    currentcell=parseInt(currentcell);
    targetCell=parseInt(targetCell);

    let cubenumber=cubestatus[0].indexOf(currentcell);
    let faceup=cubestatus[1][cubenumber];
    let facedown=cubestatus[2][cubenumber];
    let facefront=cubestatus[3][cubenumber];
    let faceback=cubestatus[4][cubenumber];
    let faceleft=cubestatus[5][cubenumber];
    let faceright=cubestatus[6][cubenumber];

    //vers le bas
    if (targetCell - currentcell == 6){

        cubestatus[1][cubenumber]= facefront;
        cubestatus[2][cubenumber]= faceback;
        cubestatus[3][cubenumber]= facedown;
        cubestatus[4][cubenumber]= faceup;
        cubestatus[0][cubenumber]= targetCell;
    }
    //vers le haut
    if (targetCell - currentcell == -6){
        cubestatus[1][cubenumber]= faceback;
        cubestatus[2][cubenumber]= facefront;
        cubestatus[3][cubenumber]= faceup;
        cubestatus[4][cubenumber]= facedown;
        cubestatus[0][cubenumber]= targetCell;
    }

    //vers la droite    
    if (targetCell - currentcell == 1){
        cubestatus[1][cubenumber]= faceleft;
        cubestatus[2][cubenumber]= faceright;
        cubestatus[5][cubenumber]= facedown;
        cubestatus[6][cubenumber]= faceup;
        cubestatus[0][cubenumber]= targetCell;
    }

    //vers la gauche
    if (targetCell - currentcell == -1){
        cubestatus[1][cubenumber]= faceright;
        cubestatus[2][cubenumber]= faceleft;
        cubestatus[5][cubenumber]= faceup;
        cubestatus[6][cubenumber]= facedown;
        cubestatus[0][cubenumber]= targetCell;
    }
}

function prisesimu(cubenumber) {

    let cellnumber=cubestatus[0][cubenumber - 1];
    let cubeleft=cubestatus[0].indexOf(cellnumber - 1) + 1;
    let cuberight=cubestatus[0].indexOf(cellnumber + 1) + 1;
    let cubefront=cubestatus[0].indexOf(cellnumber - 6) + 1;
    let cubeback=cubestatus[0].indexOf(cellnumber + 6) + 1;
    let takencubes=[0,0,0];
    let i=0;
    let j=0;

    if (cellnumber%6==0){cuberight= -2;}
    if (cellnumber%6==1){cubeleft= -2;}
    if (cellnumber>30){cubeback= -2;}
    if (cellnumber<7){cubefront= -2;}


    if (cubeleft != -2 && ((cubenumber < 7 && cubeleft > 6) || (cubenumber > 6 && cubeleft < 7))){
        if (cubestatus[1][cubenumber - 1] == cubestatus[1][cubeleft - 1]){
            takencubes[j]=cubeleft;
            j ++;
        }
    }

    if (cuberight != -2 && ((cubenumber < 7 && cuberight > 6) || (cubenumber > 6 && cuberight < 7))){
        if (cubestatus[1][cubenumber - 1] == cubestatus[1][cuberight - 1]){
            takencubes[j]=cuberight;
            j ++;
        }
    }

    if (cubefront != -2 && ((cubenumber < 7 && cubefront > 6) || (cubenumber > 6 && cubefront< 7))){
        if (cubestatus[1][cubenumber - 1] == cubestatus[1][cubefront - 1]){
            takencubes[j]=cubefront;
            j ++;
        }
    }

    if (cubeback != -2 && ((cubenumber < 7 && cubeback > 6) || (cubenumber > 6 && cubeback < 7))){
        if (cubestatus[1][cubenumber - 1] == cubestatus[1][cubeback - 1]){
            takencubes[j]=cubeback;
            j ++;
        }
    }

    for (i = 0; i <3; i++)
    {
        if (takencubes[i] != 0){

            cubestatus[0][takencubes[i]-1]=0;
        }
    }
}

function menace(deepmax){

    let i=0;
    let j=0;
    let obj=[];
    let cubetomove=[];
    let solutions=[
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
    ];
    let c=[0,0,0,0,0];
    let c1=[0,0,0,0,0];
    let c2=[0,0,0,0,0];
    let found=[0];
    let deep=0;
    let taille=[];
    let leng=[];

    let cubeid=0;
    let sauvstatus=cubestatus.map(subArray => [...subArray]);


    for(i=1; i<7; i++){
        obj.push([i,"rs"]); //cellule,face
    }

    for(cubeid=7; cubeid<13; cubeid++){
        cubetomove=[];
        if (cubestatus[0][cubeid-1]>0){
            for(i=0; i<7; i++){
                cubetomove.push(cubestatus[i][cubeid-1]);
            }
            for(i=0;i<6;i++){
                deep=0;
                path(deep, deepmax, cubetomove, obj[i], solutions, found, cubeid);
            }
        }
    }

    if(found[0]>0){
        //recherche du plus court. On peut louper une menace d'égale longueur... tant pis.

        for(i=0;i<5;i++){
            taille[i]=i;
        }

        for(i=0;i<found[0];i++){
            for(j=1;j<5;j++){
                if(solutions[i][j]==0){
                    leng[i]=j-1;
                    break;
                }
                if(j==4){
                    leng[i]=j;
                    break;
                }
            }
        }

        for(i=0;i<found[0];i++){
            for(j=i+1;j<found[0];j++){
                if(leng[taille[i]]>leng[taille[j]]){
                    let temp=taille[i];
                    taille[i]=taille[j];
                    taille[j]=temp;
                }
            }
        }

        cubeid=cubestatus[0].indexOf(solutions[taille[0]][0]) + 1;

        if(solutions[taille[0]][4]==0 && solutions[taille[0]][3]==0 && solutions[taille[0]][2]==0){//1 case de déplacement
            moveCubeTosimu(solutions[taille[0]][0],solutions[taille[0]][1]);

            prisesimu(cubeid);
            c=capture(cubeid);

            cubestatus=sauvstatus.map(subArray => [...subArray]);

            if(c[0]!=0){//si capture à l'arrivée
                return 0;
            }

        }

        if(solutions[taille[0]][4]==0 && solutions[taille[0]][3]==0 && solutions[taille[0]][2]!=0){//2 cases
            moveCubeTosimu(solutions[taille[0]][0],solutions[taille[0]][1]);
            moveCubeTosimu(solutions[taille[0]][1],solutions[taille[0]][2]);

            prisesimu(cubeid);
            c=capture(cubeid);

            cubestatus=sauvstatus.map(subArray => [...subArray]);

            if(c[0]!=0){//si capture à l'arrivée
                return 0;
            }
        }

        if(solutions[taille[0]][4]==0 && solutions[taille[0]][3]!=0){//3 cases
            moveCubeTosimu(solutions[taille[0]][0],solutions[taille[0]][1]);
            //prisesimu(cubeid); on va dire qu'on ne prend pas au 1er coup...
            c1=capture(cubeid);

            moveCubeTosimu(solutions[taille[0]][1],solutions[taille[0]][2]);

            prisesimu(cubeid);
            c=capture(cubeid);

            moveCubeTosimu(solutions[taille[0]][2],solutions[taille[0]][3]);
            prisesimu(cubeid);
            c2=capture(cubeid);

            cubestatus=sauvstatus.map(subArray => [...subArray]);
            
            if(c[0]!=0 || c2[0]!=0 || c1[0]!=0){//si capture à l'arrivée ou à la deuxième case ou à la 1ère
                return 0;
            }
        }

        if(solutions[taille[0]][4]!=0){//4 cases
            moveCubeTosimu(solutions[taille[0]][0],solutions[taille[0]][1]);
            //prisesimu(cubeid);
            c1=capture(cubeid);

            moveCubeTosimu(solutions[taille[0]][1],solutions[taille[0]][2]);
            prisesimu(cubeid);
            c=capture(cubeid);

            moveCubeTosimu(solutions[taille[0]][2],solutions[taille[0]][3]);
            moveCubeTosimu(solutions[taille[0]][3],solutions[taille[0]][4]);
            prisesimu(cubeid);
            c2=capture(cubeid);

            cubestatus=sauvstatus.map(subArray => [...subArray]);
            
            if(c[0]!=0 || (c2[0]!=0 && c1[0]!=0)){//si capture à l'arrivée ou à la deuxième case et à la 1ère
                return 0;
            }
        }

        return solutions[taille[0]];
    }

    else {
        return 0;
    }
}

function defense(deepmax){

    let sol=menace(deepmax);
    let moves=[0,0,0];
    let cubeidtomove=0;
    let currentcell=null;
    let selectedcell = null;

    if(sol===0){return 2;}
    else{
        let cubeid=cubestatus[0].indexOf(sol[0]) + 1;

        let c=capture(cubeid);

        //si on peut prendre ce cube directement on joue ça, menace=0
        //si on menace déjà la case d'arrivée ce sera un coup forcé donc menace=0
        //si on menace déjà la première case ou la deuxième case menace=0
        //sinon menace=1 et on cherche tous les moves possibles jusqu'à ce que menace=0 (si on bloque le chemin on aura found=0)
        //si on a toujours une menace on peut peut-être bloquer en 3 ou 4 cases donc cherche à aller vers la case d'arrivée
        //sinon c'est mal barré

        if(c[0]!=0){//capture directe
            cubeidtomove=cubestatus[0].indexOf(c[0]) + 1;
            selectedScene = document.getElementById("scene-" + cubeidtomove);
            currentcell= document.getElementById("cell-" + c[0]);
            selectcurrentcell(currentcell);
            selectedcell = document.getElementById("cell-" + c[1]);
            moveCubeTo3(selectedcell, light);

            if(c[2]!=0){
                setTimeout(() => {
                    selectedcell = document.getElementById("cell-" + c[2]);
                    moveCubeTo3(selectedcell, light);
                }, tempo + 50);
                return 1;
            }
            return 0;
        }

        else{

            let randomindice = Math.floor(Math.random() * 6);//entre 0 et 5
            let indice=0;

            for(let i=1;i<7;i++){

                indice=(i+randomindice)%6+1;

                if(cubestatus[0][indice-1]>0){
                    moves=checkmoves(indice,deepmax);
                    if(moves[0]!=0){
                        cubeidtomove=cubestatus[0].indexOf(moves[0]) + 1;
                        selectedScene = document.getElementById("scene-" + cubeidtomove);
                        currentcell= document.getElementById("cell-" + moves[0]);
                        selectcurrentcell(currentcell);
                        selectedcell = document.getElementById("cell-" + moves[1]);
                        moveCubeTo3(selectedcell, light);
                        if(moves[2]!=0){
                            setTimeout(() => {
                                selectedcell = document.getElementById("cell-" + moves[2]);
                                moveCubeTo3(selectedcell, light);
                            }, tempo + 50);
                            return 1;
                        }
                        return 0;
                    }
                }
            }
        }

        if(deepmax>2){
        //si on arrive là on va essayer de se rapprocher de la case d'arrivée
        }
    }
    return 2;
}


function checkmoves(cubeid,deepmax){
    let sauvstatus=cubestatus.map(subArray => [...subArray]);
    let cellnumber=cubestatus[0][cubeid - 1];

    let moves=[0,0,0];
    let sol=0;
    let c=[0,0,0,0,0];

    //down down
    if(cellnumber<25 && cubestatus[0].includes(cellnumber + 12) == false && cubestatus[0].includes(cellnumber + 6) == false){
        moveCubeTosimu(cellnumber,cellnumber + 6);
        moveCubeTosimu(cellnumber + 6,cellnumber + 12);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);
        

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 6;
            moves[2]=cellnumber + 12;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }

    //down
    if(cellnumber<31 && cubestatus[0].includes(cellnumber + 6) == false){
        moveCubeTosimu(cellnumber,cellnumber + 6);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 6;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }

    
    //down left
    if(cellnumber<31 && cellnumber%6!=1 && cubestatus[0].includes(cellnumber + 6) == false && cubestatus[0].includes(cellnumber + 5) == false){
        moveCubeTosimu(cellnumber,cellnumber + 6);
        moveCubeTosimu(cellnumber + 6,cellnumber + 5);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 6;
            moves[2]=cellnumber + 5;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }
    //down right
    if(cellnumber<31 && cellnumber%6!=0 && cubestatus[0].includes(cellnumber + 6) == false && cubestatus[0].includes(cellnumber + 7) == false){
        moveCubeTosimu(cellnumber,cellnumber + 6);
        moveCubeTosimu(cellnumber + 6,cellnumber + 7);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 6;
            moves[2]=cellnumber + 7;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }
    //left down
    if(cellnumber<31 && cellnumber%6!=1 && cubestatus[0].includes(cellnumber - 1) == false && cubestatus[0].includes(cellnumber + 5) == false){
        moveCubeTosimu(cellnumber,cellnumber - 1);
        moveCubeTosimu(cellnumber - 1,cellnumber + 5);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber - 1;
            moves[2]=cellnumber + 5;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }
    //right down
    if(cellnumber<31 && cellnumber%6!=0 && cubestatus[0].includes(cellnumber + 1) == false && cubestatus[0].includes(cellnumber + 7) == false){
        moveCubeTosimu(cellnumber,cellnumber + 1);
        moveCubeTosimu(cellnumber + 1,cellnumber + 7);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 1;
            moves[2]=cellnumber + 7;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }

    //left
    if(cellnumber%6!=1 && cubestatus[0].includes(cellnumber - 1) == false){
        moveCubeTosimu(cellnumber,cellnumber - 1);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber - 1;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }

    //right
    if(cellnumber%6!=0 && cubestatus[0].includes(cellnumber + 1) == false){
        moveCubeTosimu(cellnumber,cellnumber + 1);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 1;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }

    //left left
    if(cellnumber%6!=2 && cellnumber%6!=1 && cubestatus[0].includes(cellnumber - 2) == false && cubestatus[0].includes(cellnumber - 1) == false){
        moveCubeTosimu(cellnumber,cellnumber - 1);
        moveCubeTosimu(cellnumber - 1,cellnumber - 2);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber - 1;
            moves[2]=cellnumber - 2;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }

    //right right
    if(cellnumber%6!=5 && cellnumber%6!=0 && cubestatus[0].includes(cellnumber + 2) == false && cubestatus[0].includes(cellnumber + 1) == false){
        moveCubeTosimu(cellnumber,cellnumber +1);
        moveCubeTosimu(cellnumber +1,cellnumber +2);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 1;
            moves[2]=cellnumber + 2;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }
    
    //up
    if(cellnumber>6 && cubestatus[0].includes(cellnumber - 6) == false){
        moveCubeTosimu(cellnumber,cellnumber - 6);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber - 6;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }
    
    //up left
    if(cellnumber>6 && cellnumber%6!=1 && cubestatus[0].includes(cellnumber - 7) == false && cubestatus[0].includes(cellnumber - 6) == false){
        moveCubeTosimu(cellnumber,cellnumber - 6);
        moveCubeTosimu(cellnumber - 6,cellnumber - 7);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber - 6;
            moves[2]=cellnumber - 7;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }

    //up right
    if(cellnumber>6 && cellnumber%6!=0 && cubestatus[0].includes(cellnumber - 5) == false && cubestatus[0].includes(cellnumber - 6) == false){
        moveCubeTosimu(cellnumber,cellnumber - 6);
        moveCubeTosimu(cellnumber - 6,cellnumber - 5);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber - 6;
            moves[2]=cellnumber - 5;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }

    //left up
    if(cellnumber>6 && cellnumber%6!=1 && cubestatus[0].includes(cellnumber - 7) == false && cubestatus[0].includes(cellnumber - 1) == false){
        moveCubeTosimu(cellnumber,cellnumber - 1);
        moveCubeTosimu(cellnumber - 1,cellnumber - 7);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber - 1;
            moves[2]=cellnumber - 7;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }

    //right up
    if(cellnumber>6 && cellnumber%6!=0 && cubestatus[0].includes(cellnumber - 5) == false && cubestatus[0].includes(cellnumber + 1) == false){
        moveCubeTosimu(cellnumber,cellnumber + 1);
        moveCubeTosimu(cellnumber + 1,cellnumber - 5);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 1;
            moves[2]=cellnumber - 5;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }

    //up up
    if(cellnumber>12 && cubestatus[0].includes(cellnumber - 12) == false && cubestatus[0].includes(cellnumber - 6) == false){
        moveCubeTosimu(cellnumber,cellnumber - 6);
        moveCubeTosimu(cellnumber - 6,cellnumber - 12);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber - 6;
            moves[2]=cellnumber - 12;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }
    return moves;
}

function taketake() {
    let c=[0,0,0,0];
    let cubeidtomove=0;
    let currentcell=null;
    let selectedcell=0;
    let sauvstatus=cubestatus.map(subArray => [...subArray]);

    for(let i=7;i<13;i++)
    {
        if(cubestatus[0][i - 1]>0){
            c=capture(i);
            if(c[0]!=0){
                cubeidtomove=cubestatus[0].indexOf(c[0]) + 1;

                moveCubeTosimu(c[0],c[1]);
                if(c[2]!=0){
                    moveCubeTosimu(c[1],c[2]);
                    prisesimu(cubeidtomove);
                }

                let sol=menace(2);

                cubestatus=sauvstatus.map(subArray => [...subArray]);

                if(sol===0){//pas de défaite causée par la capture
                    selectedScene = document.getElementById("scene-" + cubeidtomove);
                    currentcell= document.getElementById("cell-" + c[0]);
                    selectcurrentcell(currentcell);
                    selectedcell = document.getElementById("cell-" + c[1]);
                    moveCubeTo3(selectedcell, light);
    
                    if(c[2]!=0){
                        setTimeout(() => {
                            selectedcell = document.getElementById("cell-" + c[2]);
                            moveCubeTo3(selectedcell, light);
                        }, tempo + 50);
                        return 1;
                    }
                    return 0;
                }
            }
        }
    }
    return 2;
}

function movecareful(){
    let moves=[0,0,0];
    let cubeidtomove=0;
    let currentcell=null;
    let selectedcell = null;

    let randomindice = Math.floor(Math.random() * 6);//entre 0 et 5
    let indice=0;

    for(let i=1;i<7;i++){
        indice=(i+randomindice)%6+1;
        if(cubestatus[0][indice-1]>0){
            moves=checkmovesdown(indice); //potentiellement on va se créer une menace en 4... ça laisse une chance :)
            if(moves[0]!=0){
                cubeidtomove=cubestatus[0].indexOf(moves[0]) + 1;
                selectedScene = document.getElementById("scene-" + cubeidtomove);
                currentcell= document.getElementById("cell-" + moves[0]);
                selectcurrentcell(currentcell);
                selectedcell = document.getElementById("cell-" + moves[1]);
                moveCubeTo3(selectedcell, light);
                if(moves[2]!=0){
                    setTimeout(() => {
                        selectedcell = document.getElementById("cell-" + moves[2]);
                        moveCubeTo3(selectedcell, light);
                    }, tempo + 50);
                    return 1;
                }
                return 0;
            }
        }
    }

    //si on n'a pas pu avancer
    for(let i=1;i<7;i++){
        indice=(i+randomindice)%6+1;
        if(cubestatus[0][indice-1]>0){
            moves=checkmoves(indice,2);
            if(moves[0]!=0){
                cubeidtomove=cubestatus[0].indexOf(moves[0]) + 1;
                selectedScene = document.getElementById("scene-" + cubeidtomove);
                currentcell= document.getElementById("cell-" + moves[0]);
                selectcurrentcell(currentcell);
                selectedcell = document.getElementById("cell-" + moves[1]);
                moveCubeTo3(selectedcell, light);
                if(moves[2]!=0){
                    setTimeout(() => {
                        selectedcell = document.getElementById("cell-" + moves[2]);
                        moveCubeTo3(selectedcell, light);
                    }, tempo + 50);
                    return 1;
                }
                return 0;
            }
        }
    }
    return 2;
}

function protect(){
    let c=[0,0,0,0,0];
    let c2=[0,0,0,0,0];
    let moves=[0,0,0];
    let cubeidtomove=0;
    let cubeid=0;
    let currentcell=null;
    let selectedcell=0;
    let sauvstatus=cubestatus.map(subArray => [...subArray]);

    for(let i=1;i<7;i++)
    {
        if(cubestatus[0][i - 1]>0){
            c=capture(i);
            if(c[0]!=0){
                cubeid=cubestatus[0].indexOf(c[0]) + 1;
                moveCubeTosimu(c[0],c[1]);
                if(c[2]!=0){
                    moveCubeTosimu(c[1],c[2]);
                    prisesimu(cubeid);
                }

                c2=capture(cubeid);

                cubestatus=sauvstatus.map(subArray => [...subArray]);

                if(c2[0]==0){//on ne peut pas recapturer derrière
                    moves=checkmoves(i,2);
                    if(moves[0]!=0){
                        cubeidtomove=cubestatus[0].indexOf(moves[0]) + 1;
                        selectedScene = document.getElementById("scene-" + cubeidtomove);
                        currentcell= document.getElementById("cell-" + moves[0]);
                        selectcurrentcell(currentcell);
                        selectedcell = document.getElementById("cell-" + moves[1]);
                        moveCubeTo3(selectedcell, light);
                        if(moves[2]!=0){
                            setTimeout(() => {
                                selectedcell = document.getElementById("cell-" + moves[2]);
                                moveCubeTo3(selectedcell, light);
                            }, tempo + 50);
                            return 1;
                        }
                        return 0;
                    }
                }
            }
        }
    }
    return 2;
}

function checkmovesdown(cubeid){
    let sauvstatus=cubestatus.map(subArray => [...subArray]);
    let cellnumber=cubestatus[0][cubeid - 1];
    let deepmax=2;

    let moves=[0,0,0];
    let c=[0,0,0,0,0];
    let sol=0;

    //down down
    if(cellnumber<25 && cubestatus[0].includes(cellnumber + 12) == false && cubestatus[0].includes(cellnumber + 6) == false){
        moveCubeTosimu(cellnumber,cellnumber + 6);
        moveCubeTosimu(cellnumber + 6,cellnumber + 12);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 6;
            moves[2]=cellnumber + 12;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }

    //down
    if(cellnumber<31 && cubestatus[0].includes(cellnumber + 6) == false){
        moveCubeTosimu(cellnumber,cellnumber + 6);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 6;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }

    
    //down left
    if(cellnumber<31 && cellnumber%6!=1 && cubestatus[0].includes(cellnumber + 6) == false && cubestatus[0].includes(cellnumber + 5) == false){
        moveCubeTosimu(cellnumber,cellnumber + 6);
        moveCubeTosimu(cellnumber + 6,cellnumber + 5);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 6;
            moves[2]=cellnumber + 5;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }
    //down right
    if(cellnumber<31 && cellnumber%6!=0 && cubestatus[0].includes(cellnumber + 6) == false && cubestatus[0].includes(cellnumber + 7) == false){
        moveCubeTosimu(cellnumber,cellnumber + 6);
        moveCubeTosimu(cellnumber + 6,cellnumber + 7);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 6;
            moves[2]=cellnumber + 7;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }
    //left down
    if(cellnumber<31 && cellnumber%6!=1 && cubestatus[0].includes(cellnumber - 1) == false && cubestatus[0].includes(cellnumber + 5) == false){
        moveCubeTosimu(cellnumber,cellnumber - 1);
        moveCubeTosimu(cellnumber - 1,cellnumber + 5);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber - 1;
            moves[2]=cellnumber + 5;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }
    //right down
    if(cellnumber<31 && cellnumber%6!=0 && cubestatus[0].includes(cellnumber + 1) == false && cubestatus[0].includes(cellnumber + 7) == false){
        moveCubeTosimu(cellnumber,cellnumber + 1);
        moveCubeTosimu(cellnumber + 1,cellnumber + 7);
        prisesimu(cubeid);
        c=capture(cubeid);
        sol=menace(deepmax);

        cubestatus=sauvstatus.map(subArray => [...subArray]);

        if(sol===0 && c[0]==0){
            moves[0]=cellnumber;
            moves[1]=cellnumber + 1;
            moves[2]=cellnumber + 7;
            return moves; //on a trouvé un move qui élimine la menace
        }
    }
    return moves;
}
