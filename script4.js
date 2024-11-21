// script4.js
function botlevel1(){

    let prevcell=0;

    //coup forcé
    if(forcedcube[3]!=-1){
        forcedmove();
        return;
    }

    //choix du cube
    let cubeid=choosecube();

    //test des cellules autour
    let availablecells=testcells(cubeid,prevcell);

    if (availablecells.length!=0){
        selectedScene = document.getElementById("scene-" + cubeid);
        //coloriage
        cell=cubestatus[0][cubeid-1];
        let cellid="cell-" + cell;
        let currentcell= document.getElementById(cellid);
        selectcurrentcell(currentcell);
    }
    else{
        //choisir un cube qui peut bouger et rechoisir une cellule
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
            }, 500);
        }
    }
}

function forcedmove(){

    let cubetomove=cubestatus[0].indexOf(forcedcube[0])+1;
    selectedScene = document.getElementById("scene-" + cubetomove);

    let cell=forcedcube[0];
    let cellid="cell-" + cell;
    let currentcell= document.getElementById(cellid);

    selectscene(currentcell);

    let selectedcell = document.getElementById("cell-" + forcedcube[1]);

    moveCubeTo3(selectedcell, light);

    if (forcedcube[2]!=0){
        setTimeout(() => {
            selectedcell = document.getElementById("cell-" + forcedcube[2]);
            moveCubeTo3(selectedcell, light);
        }, 500);
    }
}

function choosecube(){
    let cubepresent = [];

    //choix du cube
    for(let i=0; i<6; i++){
        if(cubestatus[0][i]!=0){
            cubepresent.push(i);
        }
    }
    
    let randomindice = Math.floor(Math.random() * cubepresent.length);
    let randomcubeid=cubepresent[randomindice] + 1;

    return randomcubeid;
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

