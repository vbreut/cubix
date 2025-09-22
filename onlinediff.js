localStorage.removeItem("gamediff");
const newdiffButton = document.getElementById("newdiff");
const pastButton = document.getElementById("back");
const futureButton = document.getElementById("forward");
const leaveButton = document.getElementById("leave");
const diffButton = document.getElementById("diffinprogress");
let premiercoup=0;

newdiffButton.addEventListener('click', creatediff);

function creatediff(){

    gameIddiff=`game_${Date.now()}`;
    //localStorage.setItem("gamediff", gameIddiff);

    database.ref('gamesdiff/' + gameIddiff).set({
        joueur1: "Libre",
        joueur2: pseudo,
        nbjoueur2: nbgames[0]
        //début: Date.now()
    });

    playingmode = 5;

    ecouterCoups(); //au cas où l'autre joueur est connecté et qu'il joue (peu probable mais bon)

    turn = "white";
    
    document.getElementById("adv").textContent = "Libre";
    afficherPseudoMasque(pseudo,"me",null, null, null);
    document.getElementById("me").style.color = "white";
    showPage();

}


function displaydiff(){

    const diffRef = database.ref('gamesdiff');
    let d=0;

    diffRef.on('value', (snapshot) =>{ //le on se déclenche une fois à l'init de toute façon
    //diffRef.once("value").then(snapshot=>{
        const defis = snapshot.val();
        const container = document.getElementById('def');
        container.innerHTML = '';
        let n = 0;

        for (let key in defis) {

            let game = defis[key];

            if (game.joueur1==pseudo || game.joueur2==pseudo){
                gameIddiff = key;

                if (d==0){//seulement à l'init, pour ne pas lancer monitordiff à chaque fois que gamediff est modifié
                    if(game.joueur2==pseudo){
                        document.getElementById("infodiff").textContent = "Jouez votre premier coup !";
                    }
                    monitordiff();
                }
                if (game.joueur1 == "Abandon" || game.joueur2 == "Abandon"){
                    document.getElementById("infodiff").textContent = "L'adversaire a quitté la partie";
                }

                if (game.joueur1 == pseudo){//pour voir le nouveau pseudo si le joueur rejoint la partie ou abandonne
                    afficherPseudoMasque(game.joueur2,"adv", null, null, null);
                }

                if (game.joueur1 == "Libre" && premiercoup==1){
                    document.getElementById("infodiff").textContent = "Attente d'un adversaire";
                }

                if (game.joueur1 == pseudo && premiercoup==0){
                    document.getElementById("infodiff").textContent = "L'adversaire réfléchit";
                }

                d=1;
                break;
            } else{
                if (game.joueur1 !== "Abandon" && game.joueur2 !== "Abandon"){

                    n=1;
                    const div = document.createElement('button');
                    div.className = 'parties';
                    div.id = key;
                    container.appendChild(div);

                    if (game.joueur1=="Libre"){
                        div.style.backgroundColor = "rgb(129, 217, 154)"
                        afficherPseudoMasque(game.joueur2, key," (🏅" + game.nbjoueur2 + ")  /  ", game.joueur1, null);

                    } else {
                        div.style.backgroundColor = "rgb(235, 126, 0)"
                        afficherPseudoMasque(game.joueur2, key," (🏅" + game.nbjoueur2 + ")  /  ", game.joueur1, " (🏅" + game.nbjoueur1 + ")");
                    }
                    
                    if (game.joueur1 == "Libre" && pseudo !== null && game.joueur2 !== pseudo){
                        div.style.cursor = 'pointer';
                        div.onclick = () => selectdiff(key);
                    }

                }
            }
        }

        if (n==0){
            const divnodiff = document.createElement('div');
            container.appendChild(divnodiff);
            divnodiff.id = "nobodydiff"
            document.getElementById("nobodydiff").textContent = "Pas de défi en cours";
        }

        if (d==0){
            document.getElementById("deftitle").style.display = "block";
            document.getElementById("newdiff").style.display = "block";
        } else{
            document.getElementById('def').style.display = "none";
            document.getElementById("newdiff").style.display = "none";
        }
    });

}

function selectdiff(key){

    gameIddiff = key;
    //localStorage.setItem("gamediff", key);
    
    const gamediffRef = database.ref('gamesdiff/' + key);
    refCoups = firebase.database().ref('gamesdiff/' + key + '/coups');

   gamediffRef.update({
        joueur1: pseudo,
        nbjoueur1: nbgames[0]
    });

    gamediffRef.once("value").then(snapshot=>{
        //adversaire= snapshot.val().joueur2; //je crois qu'on s'en fout de cette variable
        afficherPseudoMasque(snapshot.val().joueur2,"adv", null, null, null);
        document.getElementById("adv").style.color = "white";
        afficherPseudoMasque(pseudo,"me",null, null, null);
        //document.getElementById("adv").textContent = `${adversaire.slice(0,3)}`;
    }); //ça va servir la première fois pour afficher l'adversaire
    
    playingmode = 5;

    //lancer partie avec les noirs
    turn = "black"; //black veut dire "joueur du haut"
    flip();

    showPage();

    ecouterCoups();// le .on se lance à l'init, pas besoin de .once

}


function monitordiff(){

    //gameIddiff = localStorage.getItem("gamediff");

    let refCoups = null;
    let gamediffRef = null;

    if (gameIddiff!==null && gameIddiff!=="" && gameIddiff!==0) {
        refCoups = database.ref('gamesdiff/' + gameIddiff + '/coups');
        gamediffRef = database.ref('gamesdiff/' + gameIddiff);

        //refCoups.limitToLast(1).once('value').then(snapshot=>{
        refCoups.limitToLast(1).on('value',(snapshot)=>{
            snapshot.forEach((childSnap)=>{
                if(childSnap.val().joueur!==pseudo){
                    document.getElementById("infodiff").textContent = "L'adversaire a joué";
                    document.getElementById("flag").style.display="block"
                    premiercoup=1;
                }

                if(childSnap.val().joueur==pseudo){
                    premiercoup = 1;
                    document.getElementById("infodiff").textContent = "L'adversaire réfléchit";
                }

            });

        });

        document.getElementById("diffinprogress").style.display = "block";
        document.getElementById("deftitle").style.display = "none";

        gamediffRef.on('value',(snapshot)=>{
            if(snapshot.val()){//si la référence n'est pas supprimée

                if(((snapshot.val().joueur2 == pseudo  && snapshot.val().joueur1 == "Abandon") || (snapshot.val().joueur1 == pseudo  && snapshot.val().joueur2 == "Abandon")) && playingmode==5){
                    document.getElementById("spacer").style.display="block";
                    afficherPseudoMasque(null, "message","L'adversaire a quitté la partie", null, null);
                    document.getElementById("modalvic").style.display="flex";
                    document.getElementById("closeModalvic").style.display="block";
                    document.querySelector(".modal-contentvic").style.justifyContent="space-between";
                    confirmyesButton.style.display="none";
                    confirmnoButton.style.display="none";              
                }
            }
        });
    }

}


diffButton.addEventListener('click',loadgame);

function loadgame(){

    const diffRef = database.ref('gamesdiff');
    const refCoups = firebase.database().ref('gamesdiff/' + gameIddiff + '/coups');
    let flipped =0;


    diffRef.once("value").then(snapshot=>{
        const defis = snapshot.val();

        for (let key in defis) {

            let game = defis[key];

            if (game.joueur1==pseudo){
                flip();
                afficherPseudoMasque(game.joueur2, "adv", null, null, null);
                //document.getElementById("adv").textContent = game.joueur2.slice(0,3);
                document.getElementById("adv").style.color = "white";
                afficherPseudoMasque(pseudo,"me",null, null, null);
                flipped=1;
            }

            if (game.joueur2==pseudo){
                afficherPseudoMasque(game.joueur1, "adv", null, null, null);
                document.getElementById("me").style.color = "white";
                afficherPseudoMasque(pseudo,"me",null, null, null);
                //document.getElementById("adv").textContent = game.joueur1.slice(0,3);
            }

            if(game.joueur2==pseudo || game.joueur1==pseudo){
                
                playingmode = 5;

                showPage();

                refCoups.limitToLast(2).once('value').then(snapshot=>{
                    let children =[];
                    snapshot.forEach((childSnap)=>{
                        children.push(childSnap.val());
                    });


                    if(children.length!==0){

                        turn = "black"; //si j'ai joué en dernier c'est à l'adversaire, et sinon on écoute le dernier coup de l'adversaire
                        if (flipped==0){
                            tour.style.backgroundColor = "rgb(0, 0, 0)"
                        }

                        if(children[children.length - 1].joueur==pseudo){//j'ai joué en dernier
                            cubestatus=children[children.length - 1].matrice.map(subArray => [...subArray]);    
                        } 
                            
                        if(children[children.length - 1].joueur!==pseudo && children.length >=2){
                            cubestatus=children[0].matrice.map(subArray => [...subArray]);
                        }
                    }

                    let real=1;
                    initconfig(cubestatus,real);

                    setTimeout(() => {
                        ecouterCoups();//va juste voir le dernier coup adverse et les coups suivants en temps réel si besoin
                        //va ignorer ton dernier coup
                    }, 200);

                });

                history();
            }
        }
    });

}

function history()
{
    const refCoups = firebase.database().ref('gamesdiff/' + gameIddiff + '/coups');
    refCoups.on('value', (snapshot) =>{
        childrenhistory =[];

        snapshot.forEach((childSnap)=>{
            childrenhistory.push(childSnap.val());
            indice=[1];
            gameboardclone.style.visibility = "hidden";
            mask.style.visibility = "hidden";
            mask0.style.visibility = "hidden";
        });

    });

}

function pastclick(){

    if (indice[0] + 1 <= childrenhistory.length){

        gameboardclone.style.visibility = "visible";
        mask.style.visibility = "visible";
        mask0.style.visibility = "visible";

        indice[0]=indice[0]+1;

        let sauvstatus=[];
        let newcubestatus=[];
        if (childrenhistory[childrenhistory.length-indice[0]].joueur==pseudo){
            newcubestatus=childrenhistory[childrenhistory.length-indice[0]].matrice.map(subArray => [...subArray]);

        } else{
            newcubestatus=childrenhistory[childrenhistory.length-indice[0]].matrice.map(subArray => [...subArray]);
            sauvstatus=childrenhistory[childrenhistory.length-indice[0]].matrice.map(subArray => [...subArray]);

            for (i=0;i<12;i++){
                if (sauvstatus[0][11-i]!==0){
                    newcubestatus[0][i]= 37 - sauvstatus[0][11-i];
                }
                if (sauvstatus[0][11-i]==0){
                    newcubestatus[0][i]= sauvstatus[0][11-i];
                }

                newcubestatus[1][i]= sauvstatus[1][11-i];
                newcubestatus[2][i]= sauvstatus[2][11-i];
                newcubestatus[3][i]= sauvstatus[4][11-i];
                newcubestatus[4][i]= sauvstatus[3][11-i];
                newcubestatus[5][i]= sauvstatus[6][11-i];
                newcubestatus[6][i]= sauvstatus[5][11-i];
            }
        }

        let real=0;
        initconfig(newcubestatus,real);

    }

}

function futureclick(){

    if(indice[0]==2){
        gameboardclone.style.visibility = "hidden";
        mask.style.visibility = "hidden";
        mask0.style.visibility = "hidden";
        indice[0]=indice[0]-1;
    }

    if (indice[0] >2 ){

        indice[0]=indice[0]-1;

        let sauvstatus=[];
        let newcubestatus=[];
        if (childrenhistory[childrenhistory.length-indice[0]].joueur==pseudo){
            newcubestatus=childrenhistory[childrenhistory.length-indice[0]].matrice.map(subArray => [...subArray]);

        } else{
            newcubestatus=childrenhistory[childrenhistory.length-indice[0]].matrice.map(subArray => [...subArray]);
            sauvstatus=childrenhistory[childrenhistory.length-indice[0]].matrice.map(subArray => [...subArray]);

            for (i=0;i<12;i++){
                if (sauvstatus[0][11-i]!==0){
                    newcubestatus[0][i]= 37 - sauvstatus[0][11-i];
                }
                if (sauvstatus[0][11-i]==0){
                    newcubestatus[0][i]= sauvstatus[0][11-i];
                }

                newcubestatus[1][i]= sauvstatus[1][11-i];
                newcubestatus[2][i]= sauvstatus[2][11-i];
                newcubestatus[3][i]= sauvstatus[4][11-i];
                newcubestatus[4][i]= sauvstatus[3][11-i];
                newcubestatus[5][i]= sauvstatus[6][11-i];
                newcubestatus[6][i]= sauvstatus[5][11-i];
            }
        }
        let real=0;
        initconfig(newcubestatus,real);

    }

}

function initconfig(matrice,real){

    //let largeur2 = document.documentElement.clientWidth;
    //let i =0;
    let j=0;
    let x = 0;
    let y = 0;
    let x3d=0;
    let y3d=0;

    let cellnb=0;
    let cellid=null;
    let targetCell = null;
    let coordcell = null;
    let sceneid = null;
    let scenenb =0;

    let nbtakenw=0;
    let nbtakenb=0;
    let movtakenw=0;
    let movtakenb=0;
    let movtakenwy=0;
    let movtakenby=0;
    boardrect= gameboard.getBoundingClientRect();

    //let sauvstatus=cubestatus.map(subArray => [...subArray]);
    let te = tempo/1000;
    let transf = 'transform ' + te + 's' + ' ease-out';
/*/on va toujours prendre mon cubestatus pas besoin de convertir
    if (javcoup!==pseudo){//avant dernier coup
        for (i=0;i<12;i++){
            if (cubestatus[0][i]!==0){
                cubestatus[0][i]= 37 - sauvstatus[0][11-i];
            }
            if (cubestatus[0][i]==0){
                cubestatus[0][i]= sauvstatus[0][11-i];
            }

            cubestatus[1][i]= sauvstatus[1][11-i];
            cubestatus[2][i]= sauvstatus[2][11-i];
            cubestatus[3][i]= sauvstatus[4][11-i];
            cubestatus[4][i]= sauvstatus[3][11-i];
            cubestatus[5][i]= sauvstatus[6][11-i];
            cubestatus[6][i]= sauvstatus[5][11-i];
        }
    }*/

    for(j=0;j<12;j++){
        cellnb=matrice[0][j];
        scenenb = j+1;
        if (real==1){
            sceneid = "scene-" + scenenb;
            document.getElementById(sceneid).style.transition="none";
        } else {
            sceneid = "scene-" + scenenb + "-clone";
        }
        
        if (cellnb!==0){
            cellid="cell-" + cellnb;
            targetCell = document.getElementById(cellid);
            coordcell = targetCell.getBoundingClientRect();
            x = coordcell.left;
            y = coordcell.top;// + window.scrollY - scrollYinit;

            x3d = x + movx - boardrect.left - 5 - 0.5;//+ (largeur - largeur2)/2;
            y3d = y + movy - boardrect.top - 5 - 0.5;

            document.getElementById(sceneid).style.transform = `translate(${x3d}px, ${y3d}px) rotateY(18deg) rotateX(18deg)`;

        }
        else{
            if (j<6){
                movtakenby=6*cellwidth + 5;
                movtakenb=nbtakenb*cellwidth/2.5;
                document.getElementById(sceneid).style.transform = `translate(${movtakenb}px, ${movtakenby}px) rotateY(18deg) rotateX(18deg) scale3d(0.4, 0.4, 0.4)`;
                nbtakenb = nbtakenb + 1;
            } else{
                movtakenwy=-cellwidth/2 - 5;
                movtakenw=nbtakenw*cellwidth/2.5;
                document.getElementById(sceneid).style.transform = `translate(${movtakenw}px, ${movtakenwy}px) rotateY(18deg) rotateX(18deg) scale3d(0.4, 0.4, 0.4)`;
                nbtakenw = nbtakenw + 1;
            }
        }
    }

    changefaces(matrice,real);

    void document.body.offsetHeight;
    if (real==1){
        for(j=0;j<12;j++){
            scenenb = j+1;
            sceneid = "scene-" + scenenb;
            document.getElementById(sceneid).style.transition=transf;
        }
    }
}

leaveButton.addEventListener('click', () => {
    document.getElementById("message").style.display="flex";
    document.getElementById("botsubmenu2").style.display="none";
    document.getElementById("message").textContent="Retour à l'accueil ?";
    document.getElementById("spacer").style.display="none";
    document.querySelector(".modal-contentvic").style.justifyContent="space-evenly";
    modalvic.style.display="flex";
    confirmyesButton.style.display="block";
    confirmnoButton.style.display="block";
    document.getElementById("closeModalvic").style.display="none";

});

function changefacesold(flipped,matrice) {
    let el1=null; //rs
    let el2=null; //rd
    let el5=null; //bs
    let el6=null; //bd
    let el4=null; //ws
    let el3=null; //wd

    if (flipped==0){
        for(j=0;j<12;j++){
            scenenb = j+1;
            sceneid = "scene-" + scenenb;

            let cube=document.getElementById(sceneid).firstElementChild;

            let tab={rs: "shape1", rd:"shape2", bs:"shape5", bd:"shape6", ws:"shape4", wd:"shape3"};

            el1=cube.querySelector('.shape1'); //rs
            el2=cube.querySelector('.shape2'); //rd
            el5=cube.querySelector('.shape5'); //bs
            el6=cube.querySelector('.shape6'); //bd
            el4=cube.querySelector('.shape4'); //ws
            el3=cube.querySelector('.shape3'); //wd

            el1.classList.replace('shape1', tab[matrice[1][j]]);
            el2.classList.replace('shape2', tab[matrice[2][j]]);
            el5.classList.replace('shape5', tab[matrice[3][j]]);
            el6.classList.replace('shape6', tab[matrice[4][j]]);
            el4.classList.replace('shape4', tab[matrice[5][j]]);
            el3.classList.replace('shape3', tab[matrice[6][j]]);

        }
    } else{
        for(j=0;j<12;j++){
            scenenb = j+1;
            sceneid = "scene-" + scenenb;

            let cube=document.getElementById(sceneid).firstElementChild;

            let tab={rs: "shape1", rd:"shape2", bs:"shape5", bd:"shape6", ws:"shape4", wd:"shape3"};

            el1=cube.querySelector('.shape1'); //rs
            el2=cube.querySelector('.shape2'); //rd
            el5=cube.querySelector('.shape5'); //bs
            el6=cube.querySelector('.shape6'); //bd
            el4=cube.querySelector('.shape4'); //ws
            el3=cube.querySelector('.shape3'); //wd

            el1.classList.replace('shape1', tab[matrice[1][j]]);
            el2.classList.replace('shape2', tab[matrice[2][j]]);
            el5.classList.replace('shape5', tab[matrice[4][j]]);
            el6.classList.replace('shape6', tab[matrice[3][j]]);
            el4.classList.replace('shape4', tab[matrice[6][j]]);
            el3.classList.replace('shape3', tab[matrice[5][j]]);

        }
    }
}

function changefaces(matrice,real) {

    let tab={rs: ".shape1", rd:".shape2", bs:".shape5", bd:".shape6", ws:".shape4", wd:".shape3"};

    for(j=0;j<12;j++){
        scenenb = j+1;
        if(real==1){
            sceneid = "scene-" + scenenb;
        } else{
            sceneid = "scene-" + scenenb + "-clone";
        }


        let cube=document.getElementById(sceneid).firstElementChild;

        let cubenumber=parseInt(cube.id.match(/\d+/)[0]) - 1;

        if(cubenumber<6){
            let facetop=cube.querySelector(".face.top"); //rs
            let facebottom=cube.querySelector(".face.bottom"); //rd
            let faceright=cube.querySelector(".face.right"); //wd
            let faceleft=cube.querySelector(".face.left"); //ws
            let facefront=cube.querySelector(".face.front"); //bs
            let faceback=cube.querySelector(".face.back"); //bd
    
            let newshapetop = cube.querySelector(tab[matrice[1][cubenumber]]);
            let newshapebottom = cube.querySelector(tab[matrice[2][cubenumber]]);
            let newshapefront = cube.querySelector(tab[matrice[3][cubenumber]]);
            let newshapeback = cube.querySelector(tab[matrice[4][cubenumber]]);
            let newshapeleft = cube.querySelector(tab[matrice[5][cubenumber]]);
            let newshaperight = cube.querySelector(tab[matrice[6][cubenumber]]);
    
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
    
            let newshapetop = cube.querySelector(tab[matrice[1][cubenumber]]);
            let newshapebottom = cube.querySelector(tab[matrice[2][cubenumber]]);
            let newshapefront = cube.querySelector(tab[matrice[3][cubenumber]]);
            let newshapeback = cube.querySelector(tab[matrice[4][cubenumber]]);
            let newshapeleft = cube.querySelector(tab[matrice[5][cubenumber]]);
            let newshaperight = cube.querySelector(tab[matrice[6][cubenumber]]);
    
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
}
