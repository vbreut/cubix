function botlevel1(){

    let prevcell=0;
    let memo=0;
    let availablecells=[];
    let cubeid=0;
    let cell=0;
    let nb=0;

    //coup forcé
    if(forcedcube[3]!=-1){
        nb=forcedmove();
        return nb;
    }

    for(let i=0; i<6; i++){

        //choix du cube
        cubeid=choosecube(memo);

        if (cubeid==0){
            return -1; //tous les cubes sont bloqués
        }
        //test des cellules autour
        availablecells=testcells(cubeid,prevcell);

        if (availablecells.length!=0){
            selectedScene = document.getElementById("scene-" + cubeid);
            //coloriage
            cell=cubestatus[0][cubeid-1];
            let cellid="cell-" + cell;
            let currentcell= document.getElementById(cellid);
            selectcurrentcell(currentcell);
            break;
        }
        else{
            memo=cubeid
            //choisir un cube qui peut bouger et rechoisir une cellule
        }
    }

    //1er move aléatoire

    randommove(availablecells);

    prevcell=cell;

    //2eme move
    let cointoss = Math.floor(Math.random() * 2);
    if (cointoss == 0){return;}
    else{
        availablecells=testcells(cubeid,prevcell); //ne pas revenir en arrière

        if (availablecells.length!=0){
            setTimeout(() => {
                randommove(availablecells);
            }, tempo + 50);
        }
    }
    return cointoss;
}

function forcedmove(){

    let cubetomove=cubestatus[0].indexOf(forcedcube[0])+1;
    selectedScene = document.getElementById("scene-" + cubetomove);

    let cell=forcedcube[0];
    let cellid="cell-" + cell;
    let currentcell= document.getElementById(cellid);

    selectcurrentcell(currentcell);

    let selectedcell = document.getElementById("cell-" + forcedcube[1]);

    moveCubeTo3(selectedcell, light);

    if (forcedcube[2]!=0){
        setTimeout(() => {
            selectedcell = document.getElementById("cell-" + forcedcube[2]);
            moveCubeTo3(selectedcell, light);
        }, tempo + 50);
        return 1; //2 coups
    }

    return 0;
}

function choosecube(memo){
    let cubepresent = [];
    let memo0=memo-1;

    //choix du cube
    for(let i=0; i<6; i++){
        if(cubestatus[0][i]!=0 && i!=memo0){
            cubepresent.push(i);
        }
    }
    
    if (cubepresent.length!=0){
        let randomindice = Math.floor(Math.random() * cubepresent.length);
        let randomcubeid=cubepresent[randomindice] + 1;
        return randomcubeid;
    }
    else{
        //on sélectionne quand même un cube pour pouvoir valider
        selectedScene = document.getElementById("scene-" + memo);
        cell=cubestatus[0][memo-1];
        let cellid="cell-" + cell;
        let currentcell= document.getElementById(cellid);
        selectcurrentcell(currentcell);
        return 0;
    }
}

function testcells(randomcubeid,prevcell){

    let cell=cubestatus[0][randomcubeid-1];
    let availablecells=[];
    
    let cellleft=cell - 1;
    let cellright=cell + 1;
    let cellup=cell - 6;
    let celldown=cell + 6;

    if (cell%6==0){
        cellright= - 2;}
    if (cell%6==1){
        cellleft= - 2;}
    if (cell>30){
        celldown= - 2;}
    if (cell<7){
        cellup= - 2;}

    if(cubestatus[0].includes(cellleft)==false && cellleft != -2 && cellleft != prevcell){
        availablecells.push(cellleft);
    }

    if(cubestatus[0].includes(cellright)==false && cellright != -2 && cellright != prevcell){
        availablecells.push(cellright);
    }

    if(cubestatus[0].includes(cellup)==false && cellup != -2 && cellup != prevcell){
        availablecells.push(cellup);
    }

    if(cubestatus[0].includes(celldown)==false && celldown != -2 && celldown != prevcell){
        availablecells.push(celldown);
    }

    return availablecells;
}

function randommove(availablecells){

    let randomindice = Math.floor(Math.random() * availablecells.length);

    let selectedcell = document.getElementById("cell-" + availablecells[randomindice]);
    
    moveCubeTo3(selectedcell, light);
}

