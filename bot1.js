function botlevel1(){

    let prevcell=0;
    let availablecells=[];
    let cubeid=0;
    let cell=0;
    let nb=0;
    let stuck=0;
    let cubepresent = [];
    let cubeidstuck =0;

    //coup forcé
    if(forcedcube[3]!=-1){
        nb=forcedmove();
        return nb;
    }

    for(let i=0; i<6; i++){
        if(cubestatus[0][i]!=0){
            cubepresent.push(i+1);
        }
    }

    if (cubepresent.length>0){}

    let randomshift = Math.floor(Math.random() * cubepresent.length); //compris entre 0 et 5

    for(let i=0; i< cubepresent.length; i++){

        //choix du cube
        cubeid = cubepresent[(i + randomshift)%6];

        //test des cellules autour
        availablecells=testcells(cubeid,prevcell);

        if (availablecells.length!=0){
            selectedScene = document.getElementById("scene-" + cubeid);
            //coloriage
            cell=cubestatus[0][cubeid-1];
            let cellid="cell-" + cell;
            let currentcell= document.getElementById(cellid);
            selectcurrentcell(currentcell);
            stuck=0;
            break;
        }
        else{
            cubeidstuck= cubeid;
            stuck=1;
        }
    }

    if (stuck==1){
        //on sélectionne quand même un cube pour pouvoir valider
        selectedScene = document.getElementById("scene-" + cubeidstuck);
        cell=cubestatus[0][cubeidstuck-1];
        let cellid="cell-" + cell;
        let currentcell= document.getElementById(cellid);
        selectcurrentcell(currentcell);
        return -1;
    }

    //1er move aléatoire

    randommove(availablecells);
    prevcell=cell;

    //2eme move
    let cointoss = Math.floor(Math.random() * 2);
    if (cointoss == 0){return cointoss;}
    else{
        availablecells=testcells(cubeid,prevcell); //ne pas revenir en arrière

        if (availablecells.length!=0){
            setTimeout(() => {
                randommove(availablecells);
            }, tempo + 50);
        } else {
            cointoss = 0;
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

    //let selectedcell = document.getElementById("cell-" + forcedcube[1]);
    let targetcellid = "cell-" + forcedcube[1];

    moveCubeTo3(targetcellid, light);

    if (forcedcube[2]!=0){
        setTimeout(() => {
            //selectedcell = document.getElementById("cell-" + forcedcube[2]);
            targetcellid = "cell-" + forcedcube[2];
            moveCubeTo3(targetcellid, light);
        }, tempo + 50);
        return 1; //2 coups
    }

    return 0;
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

    //let selectedcell = document.getElementById("cell-" + availablecells[randomindice]);
    let targetcellid = "cell-" + availablecells[randomindice];
    moveCubeTo3(targetcellid, light);
}

