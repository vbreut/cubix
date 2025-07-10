const newdiffButton = document.getElementById("newdiff");
newdiffButton.addEventListener('click', creatediff);
localStorage.removeItem("gamediff");
const leaveButton = document.getElementById("leave");
const diffButton = document.getElementById("diffinprogress");
let firstmove=0;

function creatediff(){

    gameIddiff=`game_${Date.now()}`;
    //localStorage.setItem("gamediff", gameIddiff);

    database.ref('gamesdiff/' + gameIddiff).set({
        joueur1: "Libre",
        joueur2: pseudo
        //début: Date.now()
    });

    playingmode = 5;

    ecouterCoups(); //au cas où l'autre joueur est connecté et qu'il joue (peu probable mais bon)

    turn = "white";
    
    document.getElementById("adv").textContent = "Libre";
    showPage();

}


function displaydiff(){

    const diffRef = database.ref('gamesdiff');
    diffRef.on('value', (snapshot) =>{ //le on se déclenche une fois à l'init de toute façon
    //diffRef.once("value").then(snapshot=>{
        const defis = snapshot.val();
        const container = document.getElementById('def');
        container.innerHTML = '';
        let n = 0;

        for (let key in defis) {
            n=1;

            let game = defis[key];

            if (game.joueur1==pseudo || game.joueur2==pseudo){
                gameIddiff = key;
                monitordiff();
                document.getElementById('def').style.display = "none";
                document.getElementById("newdiff").style.display = "none";
            } else{
                const div = document.createElement('div');
                div.className = 'parties';
                div.textContent = game.joueur2 + " " + game.joueur1;
                if (game.joueur1=="Libre"){
                    div.style.backgroundColor = "rgb(129, 217, 154)"
                } else {
                    div.style.backgroundColor = "rgb(235, 126, 0)"
                }
                
                if (game.joueur1 == "Libre" && pseudo !== null && game.joueur2 !== pseudo){
                    div.style.cursor = 'pointer';
                    div.onclick = () => selectdiff(key);
                }
                container.appendChild(div);

            }
        }

        if (n==0){
            const divnodiff = document.createElement('div');
            container.appendChild(divnodiff);
            divnodiff.id = "nobodydiff"
            document.getElementById("nobodydiff").textContent = "Pas de défi en cours";
        }
    });

}

function selectdiff(key){

    gameIddiff = key;
    //localStorage.setItem("gamediff", key);
    
    const gamediffRef = database.ref('gamesdiff/' + key);
    refCoups = firebase.database().ref('gamesdiff/' + key + '/coups');

   gamediffRef.update({
        joueur1: pseudo
    });

    gamediffRef.once("value").then(snapshot=>{
        adversaire= snapshot.val().joueur2; //je crois qu'on s'en fout de cette variable
        document.getElementById("adv").textContent = `${adversaire}`;
    }); //ça va servir la première fois pour afficher l'adversaire
    
    playingmode = 5;

    //lancer partie avec les noirs
    turn = "black"; //black veut dire "joueur du haut"
    flip();

    showPage();

    ecouterCoups();// le .on se lance à l'init, pas besoin de .once
    /*
    //il n'y a eu qu'un seul coup de toute façon
    refCoups.limitToLast(1).once('value').then(snapshot=>{
        snapshot.forEach((childSnap)=>{
            let coup=childSnap.val();
            convert(coup);
            if (coup.move.length == 4) {
                delay = tempo + 50;
            }
            
            setTimeout(() => {
                valider();
            }, 700 + delay);

        });

    });*/

}


function monitordiff(){

    //gameIddiff = localStorage.getItem("gamediff");

    let refCoups = null;
    let gamediffRef =null;

    //getgameiddiff().then(gameIddiff => {
        if (gameIddiff!==null && gameIddiff!=="" && gameIddiff!==0) {
            refCoups = firebase.database().ref('gamesdiff/' + gameIddiff + '/coups');
            gamediffRef = database.ref('gamesdiff/' + gameIddiff);
    
            //refCoups.limitToLast(1).once('value').then(snapshot=>{
            refCoups.limitToLast(1).on('value',(snapshot)=>{
                snapshot.forEach((childSnap)=>{
                    if(childSnap.val().joueur!==pseudo){
                        document.getElementById("infodiff").textContent = "L'adversaire a joué";
                        document.getElementById("flag").style.display="block"
                    }
                    if(childSnap.val().joueur==pseudo){
                        document.getElementById("infodiff").textContent = "L'adversaire réfléchit";
                    }
                });
    
            });

            document.getElementById("diffinprogress").style.display = "block";
            document.getElementById("deftitle").style.display = "none";
        }

        else{
            document.getElementById("deftitle").style.display = "none";
            document.getElementById("infodiff").textContent = "Pas de partie en cours";
            document.getElementById("diffinprogress").style.display = "none";
        }

    //});

    //ajouter un nouveau bouton "quitter la partie"*/
}



/*function getgameiddiff(){
    const diffRef = database.ref('gamesdiff');

    return diffRef.once("value").then(snapshot=>{
        const defis = snapshot.val();

        for (let key in defis) {

            let game = defis[key];

            if ((game.joueur1==pseudo && game.joueur2!=="Inconnu"|| game.joueur2==pseudo && game.joueur1!=="Inconnu")){
                gameIddiff = key;
                return key;
            }
        }

        return null;
    });
}*/

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
                document.getElementById("adv").textContent = game.joueur2;
                flipped=1;
            }

            if (game.joueur2==pseudo){
                document.getElementById("adv").textContent = game.joueur1;
            }

            if(game.joueur2==pseudo|| game.joueur1==pseudo){
                
                playingmode = 5;

                showPage();
            
                refCoups.limitToLast(2).once('value').then(snapshot=>{
                    let children =[];
                    snapshot.forEach((childSnap)=>{
                        children.push({
                            val: childSnap.val()
                        });
                    });

                    /*if (children.length >=2){
                        if(children[0].val.joueur==pseudo){
                            cubestatus=children[0].val.matrice.map(subArray => [...subArray]); //on va toujours prendre mon cubestatus pas besoin de convertir
                            turn = "black";
                        } else{
                            cubestatus=children[1].val.matrice.map(subArray => [...subArray]);
                            turn= "white";
                        }
                        initconfig(flipped);
                    }*/

                    if(children.length!==0){

                        turn = "black"; //si j'ai joué en dernier c'est à l'adversaire, et sinon on écoute le dernier coup de l'adversaire
                        if (flipped==0){
                            tour.style.backgroundColor = "rgb(0, 0, 0)"
                        }

                        if(children[children.length - 1].val.joueur==pseudo){//j'ai joué en dernier
                            cubestatus=children[children.length - 1].val.matrice.map(subArray => [...subArray]);
    
                        } 
                            
                        if(children[children.length - 1].val.joueur!==pseudo && children.length >=2){
                            cubestatus=children[0].val.matrice.map(subArray => [...subArray]);
                        }
                    }
                    
                    initconfig(flipped);

                    setTimeout(() => {
                        ecouterCoups();//va juste voir le dernier coup adverse et les coups suivants en temps réel si besoin
                        //va ignorer ton dernier coup
                    }, 100);

                });
            }
        }
    });
}

function initconfig(flipped){

    let largeur2 = document.documentElement.clientWidth;
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
        cellnb=cubestatus[0][j];
        scenenb = j+1;
        sceneid = "scene-" + scenenb;
        document.getElementById(sceneid).style.transition="none";
        
        if (cellnb!==0){
            cellid="cell-" + cellnb;
            targetCell = document.getElementById(cellid);
            coordcell = targetCell.getBoundingClientRect();
            x = coordcell.left;
            y = coordcell.top;

            x3d = x + movx - boardrect.left - 5 - 0.5+ (largeur - largeur2)/2;
            y3d = y + movy - boardrect.top - 5 - 0.5;

            document.getElementById(sceneid).style.transform = `translate(${x3d}px, ${y3d}px) rotateY(18deg) rotateX(18deg)`;

        }
        else{
            if (j<6){
                movtakenby=6*cellwidth + 5;
                movtakenb=nbtakenb*cellwidth/2.5;
                document.getElementById(sceneid).style.transform = `translate(${movtakenb}px, ${movtakenby}px) rotateY(18deg) rotateX(18deg) scale3d(0.4, 0.4, 0.4)`;
            } else{
                movtakenwy=-cellwidth/2 - 5;
                movtakenw=nbtakenw*cellwidth/2.5;
                document.getElementById(sceneid).style.transform = `translate(${movtakenw}px, ${movtakenwy}px) rotateY(18deg) rotateX(18deg) scale3d(0.4, 0.4, 0.4)`;
            }
        }
    }

    changefaces(flipped);

    setTimeout(() => {//le temps de finir les transitions...
        for(j=0;j<12;j++){
            scenenb = j+1;
            sceneid = "scene-" + scenenb;
            document.getElementById(sceneid).style.transition=transf;
        }
    }, 50);
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

function changefaces(flipped) {
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

            el1.classList.replace('shape1', tab[cubestatus[1][j]]);
            el2.classList.replace('shape2', tab[cubestatus[2][j]]);
            el5.classList.replace('shape5', tab[cubestatus[3][j]]);
            el6.classList.replace('shape6', tab[cubestatus[4][j]]);
            el4.classList.replace('shape4', tab[cubestatus[5][j]]);
            el3.classList.replace('shape3', tab[cubestatus[6][j]]);

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

            el1.classList.replace('shape1', tab[cubestatus[1][j]]);
            el2.classList.replace('shape2', tab[cubestatus[2][j]]);
            el5.classList.replace('shape5', tab[cubestatus[4][j]]);
            el6.classList.replace('shape6', tab[cubestatus[3][j]]);
            el4.classList.replace('shape4', tab[cubestatus[6][j]]);
            el3.classList.replace('shape3', tab[cubestatus[5][j]]);

        }
    }
}
