let gameId=0;
let gameIddiff=0;
let pseudo=null;
let database = null;
let connectedRef = null;
let adversaire =null;

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDjNiCy_pIdC8hPWzD-9uiq0mN0UX6qmxI",
    authDomain: "cubix-vb.firebaseapp.com",
    databaseURL: "https://cubix-vb-default-rtdb.firebaseio.com",
    projectId: "cubix-vb",
    storageBucket: "cubix-vb.firebasestorage.app",
    messagingSenderId: "528272643607",
    appId: "1:528272643607:web:f22567ac94de1b60a6ee52"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
database = firebase.database();

//database.ref().remove();
  
// Pseudo du joueur
//localStorage.removeItem("pseudo");

//window.addEventListener("load", loadPseudo)
loadPseudo();

function loadPseudo(){

    pseudo = localStorage.getItem("pseudo");

    if (pseudo!==null && pseudo!=="") {
        firebase.database().ref(".info/connected").on("value",listener);

        //firebase.database().ref(".info/connected").on("value",(snapshot)=>{
            
        //});

    } else {
        document.getElementById("form").style.display = "block";
        document.getElementById("welcome").style.display = "none";
        document.getElementById("infocom").style.display = "none";
        document.getElementById("newdiff").style.display = "none";
        document.getElementById("deftitle").style.display = "none";
    }

    document.getElementById("pseudoInput").addEventListener("keydown", function(event){
        if(event.key ==="Enter"){
            sauvegarderPseudo();
        }
    });

}

function listener(snapshot){
    //console.log(snapshot.val());
    if(snapshot.val()===true){

        checkIfPseudoExists(pseudo).then(exists => {
            document.getElementById("welcome").style.display = "block";
            if (exists) {
                document.getElementById("form").style.display = "block";
                document.getElementById("pseudoInput").value = pseudo;
                document.getElementById("pseudoAffiche").textContent = "Ce pseudo est déjà pris !";
            } else {
                launch();
            }
        });
        firebase.database().ref(".info/connected").off("value", listener)
    }
}

function launch(){
    let d=0;

    document.getElementById("form").style.display = "none";
    document.getElementById("pseudoAffiche").textContent = `Bienvenue ${pseudo} !`;
    document.getElementById("infocom").style.display = "block";

    let joueurRef = database.ref('joueurs/' + pseudo);
    /*checkifconnected().then(connected => {
        if(connected){
            joueurRef.onDisconnect().remove();
            joueurRef.set({ enLigne: "connecté" });
        } else{
        waitforconnected(joueurRef);
        }
    });*/

    joueurRef.onDisconnect().remove();
    joueurRef.set({ enLigne: "connecté" });
    
    // Écouter si on reçoit un défi
    listenchallenges();

    // Afficher la liste des joueurs
    display();
    displaydiff();

    deco();

    setTimeout(() => {
        firebase.database().ref(".info/connected").on("value",(snapshot)=>{
            if(snapshot.val()===true && d==1){
                d=0;
                const element = document.getElementById("game");
                joueurRef.onDisconnect().remove();
                if(getComputedStyle(element).display!=="none"){//si la déco/reco a lieu en partie
                    joueurRef.set({ enLigne: "en partie" });
                } else{
                    joueurRef.set({ enLigne: "connecté" });
                }
                document.getElementById("onlinesubmenu").style.display = "flex";
                document.getElementById("onlinediffsubmenu").style.display = "flex";
                document.getElementById("infocom").style.display = "block";
                if(document.getElementById("message").textContent=="Connexion perdue"){
                    modalvic.style.display = "none";
                }
                console.log("co");
            }
            if(snapshot.val()===false && pseudo!==null && pseudo!==""){
                d=1;
                document.getElementById("spacer").style.display="block";
                document.getElementById("message").style.display="block";
                document.getElementById("message").textContent="Connexion perdue";
                confirmyesButton.style.display="none";
                confirmnoButton.style.display="none";
                document.getElementById("modalvic").style.display="block";
                document.getElementById("onlinesubmenu").style.display = "none";
                document.getElementById("onlinediffsubmenu").style.display = "none";
            }
        });

    }, 5000);

}

function checkifconnected(){
    return firebase.database().ref(".info/connected").once("value").then(snapshot=>snapshot.val()===true);
}

function waitforconnected(joueurRef){
    firebase.database().ref(".info/connected").on("value",(snapshot)=>{
        if(snapshot.val()===true){
            joueurRef.onDisconnect().remove();
            joueurRef.set({ enLigne: "connecté" });
        }
    });
}

sauvpseudo.addEventListener('click',sauvegarderPseudo);

function sauvegarderPseudo(){
    pseudo = document.getElementById("pseudoInput").value.trim();

    if(pseudo!=="" && pseudo !=="Libre" && pseudo !=="Abandon"){
        if (pseudo.length<=5){
            document.getElementById("welcome").style.display = "block";
            document.getElementById("pseudoAffiche").textContent = "Pseudo de 6 lettres minimum !";
        }else {
            localStorage.setItem("pseudo", pseudo);
            loadPseudo();
        }
    }
}

function supprimerPseudo(){

        localStorage.removeItem("pseudo");
        document.getElementById("pseudoInput").value = "";

}


function checkIfPseudoExists(pseudo) {
        return firebase.database().ref("joueurs/" + pseudo).once("value")
        .then(snapshot => snapshot.exists());
}


function display(){

    const listeRef = database.ref('joueurs');

    listeRef.on('value', (snapshot) => {
        const joueurs = snapshot.val();
        const container = document.getElementById('joueurs');
        container.innerHTML = '';
        let n = 0;

        for (let key in joueurs) {
            if (key !== pseudo) {
                n=1;
                let joueur = joueurs[key];
                const div = document.createElement('button');
                div.className = 'joueur';
                div.id = key;
                //div.textContent = key.slice(0,3) + "••• " + joueur.enLigne;
                if (joueur.enLigne=="connecté"){
                    div.style.backgroundColor = "rgb(129, 217, 154)"
                } else {
                    div.style.backgroundColor = "rgb(235, 126, 0)"
                }
                

                if (joueur.enLigne == "connecté" && pseudo !== null){
                    div.style.cursor = 'pointer';
                    div.onclick = () => defierJoueur(key);
                }
                container.appendChild(div);
                afficherPseudoMasque(key,key, " " + joueur.enLigne, null);
            }
        }
        if (n==0){
            const divno = document.createElement('div');
            container.appendChild(divno);
            divno.id = "nobody"
            document.getElementById("nobody").textContent = "Personne d'autre n'est connecté";
        }
    });
}


function deco(){
    //si l'autre joueur se déconnecte on passe à "connecté" uniquement si on n'est pas en partie
    //fonction générique si on est défié, si on a envoyé un défi ou si on est en partie
    const listeRef = database.ref('joueurs');
    const joueurRef = database.ref('joueurs/' + pseudo);
    const element = document.getElementById("game");
    let challengeRef = database.ref('challenges/' + adversaire);

    listeRef.on('child_removed', (snapshot) =>{

        const pseudodeleted = snapshot.key;
        challengeRef = database.ref('challenges/' + adversaire);

        if (pseudodeleted==adversaire && getComputedStyle(element).display==="none"){
            blockbot=0;
            document.getElementById("infocom").textContent = "Choisir un joueur";
            document.getElementById("joueurs").style.display = "block";
            document.getElementById("cancelchallenge").style.display = "none";
            document.getElementById("buttonchallenge").style.display = "none";
            challengeRef.remove();
            joueurRef.set({ enLigne: "connecté" });
            adversaire=null;
        }
        if (pseudodeleted==adversaire && getComputedStyle(element).display!=="none" && turn !== "end" && playingmode == 4){
            document.getElementById("spacer").style.display="block";
            afficherPseudoMasque(adversaire, "message"," s'est déconnecté", null);
            //document.getElementById("message").textContent=`${adversaire.slice(0,3)}. s'est déconnecté`;
            document.getElementById("modalvic").style.display="flex";
            document.getElementById("closeModalvic").style.display="block";
            document.querySelector(".modal-contentvic").style.justifyContent="space-between";
            confirmyesButton.style.display="none";
            confirmnoButton.style.display="none";
            //adversaire=null;
        }
    });

    //s'il se reconnecte
    listeRef.on('child_added', (snapshot) =>{
        const pseudoadded = snapshot.key;
        const joueur = snapshot.val();

        if (pseudoadded==adversaire && getComputedStyle(element).display!=="none" && turn !== "end" && joueur.enLigne == "en partie"){
            document.getElementById("spacer").style.display="block";
            afficherPseudoMasque(adversaire,"message"," s'est reconnecté", null);
            //document.getElementById("message").textContent=`${adversaire.slice(0,3)}. s'est reconnecté`;
            document.getElementById("modalvic").style.display="flex";
            document.getElementById("closeModalvic").style.display="block";
            document.querySelector(".modal-contentvic").style.justifyContent="space-between";
            confirmyesButton.style.display="none";
            confirmnoButton.style.display="none";
        }
    });
}


// Fonction pour défier un joueur
function defierJoueur(adv) {
    adversaire=adv;
    let joueurRef = database.ref('joueurs/' + pseudo);
    let advref = database.ref('joueurs/' + adversaire);
    let stat=null
    
    advref.once("value").then(snapshot=>{
        stat= snapshot.val().enLigne;

        if(stat=="connecté"){

            const challengeRef = database.ref('challenges/' + adversaire);
            challengeRef.onDisconnect().remove(); 
            challengeRef.set({
                from: pseudo
                //timestamp: Date.now()
            });

            joueurRef.set({ enLigne: "en défi"});

            surveillerreponse();

            afficherPseudoMasque(null,"infocom","Défi envoyé à ", adversaire);
            //document.getElementById("infocom").textContent = `Défi envoyé à ${adversaire.slice(0,3)}.`;
            document.getElementById("cancelchallenge").style.display = "block";
            document.getElementById("joueurs").style.display = "none";

            cancel.addEventListener('click', () => {
                blockbot=0;
                challengeRef.remove();
                document.getElementById("infocom").textContent = "Choisir un joueur";
                document.getElementById("cancelchallenge").style.display = "none";
                document.getElementById("joueurs").style.display = "block";
                joueurRef.set({ enLigne: "connecté" });
                adversaire=null;
            },{once: true});
        }
    });
  
}


function listenchallenges(){
    let joueurRef = database.ref('joueurs/' + pseudo);
    const challengeRef = database.ref('challenges/' + pseudo);
    //let adversaire=null;
    const accept = document.getElementById('accept');
    const deny= document.getElementById('deny');

    challengeRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {

            blockbot=1;

            adversaire = data.from;

            afficherPseudoMasque(adversaire,"infocom"," vous lance un défi", null);
            //document.getElementById("infocom").textContent = `Vous êtes défié par ${adversaire.slice(0,3)}.`;
            document.getElementById("buttonchallenge").style.display = "block";
            joueurRef.set({ enLigne: "défié"});
            document.getElementById("joueurs").style.display = "none";
            document.getElementById("flagreal").style.display="block"
        }

    });


    accept.addEventListener('click', () => {
                
        blockbot=0;

        document.getElementById("buttonchallenge").style.display = "none";
        gameId=`game_${Date.now()}`;
        database.ref('games/'+ gameId).onDisconnect().remove();
        database.ref('games/' + gameId).set({
            joueur1: adversaire,
            joueur2: pseudo
            //début: Date.now()
        });

        database.ref('reponses/' + adversaire).onDisconnect().remove(); 
        database.ref('reponses/' + adversaire).set({
            from: pseudo,
            accepted: true,
            gameId: gameId
        });


        playingmode = 4;

        ecouterCoups();
        //lancer partie avec les noirs
        turn = "black"; //black veut dire "joueur du haut"
        flip();

        afficherPseudoMasque(adversaire,"adv",null, null);
        //document.getElementById("adv").textContent = `${adversaire.slice(0,3)}.`;
        document.getElementById("adv").style.color = "white";
        showPage();

    });

    deny.addEventListener('click', () => {

        blockbot=0;
        database.ref('reponses/' + adversaire).set({
            from: pseudo,
            accepted: false,
        });
        document.getElementById("buttonchallenge").style.display = "none";
        document.getElementById("infocom").textContent = "";
    });

    //si l'autre joueur annule le défi ou si on refuse le défi le challenge sera effacé par l'autre.
    let challengerootRef = database.ref('challenges/');
    challengerootRef.on('child_removed', (snapshot) =>{
        const pseudodeleted = snapshot.key;
        const element = document.getElementById("game");

        if (pseudodeleted==pseudo && getComputedStyle(element).display==="none"){
            blockbot=0;
            document.getElementById("infocom").textContent = "Choisir un joueur";
            document.getElementById("buttonchallenge").style.display = "none";
            document.getElementById("joueurs").style.display = "block";
            joueurRef.set({ enLigne: "connecté" });
            adversaire=null;
            document.getElementById("flagreal").style.display="none"
        }
    });
}

function surveillerreponse(){
    let joueurRef = database.ref('joueurs/' + pseudo);
    //let adversaire=null;
    const repRef = firebase.database().ref('reponses/' + pseudo);

    blockbot=1;

    repRef.on('value', (snapshot) =>{
        const data = snapshot.val();

        if (data){
            blockbot=0;

            if (data.accepted){

                gameId=data.gameId;

                playingmode = 4;

                ecouterCoups();

                turn = "white";
                afficherPseudoMasque(adversaire,"adv",null, null);
                //document.getElementById("adv").textContent = `${adversaire.slice(0,3)}.`;

                showPage();

                const challengeRef = database.ref('challenges/' + adversaire);
                challengeRef.remove();
                repRef.remove(); // c'est nous qui supprimons la réponse de l'adversaire

            } else {
                adversaire=data.from;
                document.getElementById("infocom").textContent = "Choisir un joueur";
                document.getElementById("cancelchallenge").style.display = "none";
                document.getElementById("joueurs").style.display = "block";
                joueurRef.set({ enLigne: "connecté"});
                const challengeRef = database.ref('challenges/' + adversaire);
                challengeRef.remove();
                repRef.remove();
            }
        }

    });

}


function ecouterCoups() {

    let refCoups = null;
    let delay=50;
    if(playingmode ==5){
        refCoups = firebase.database().ref('gamesdiff/' + gameIddiff + '/coups');
    }
    else{
        refCoups = firebase.database().ref('games/' + gameId + '/coups');
    }

    refCoups.limitToLast(1).on('child_added', (snapshot) => {
        const coup = snapshot.val();
        if (coup.joueur === pseudo) {
            // C’est mon propre coup → on ignore
            return;
        }
        
          // Sinon, on l’applique
          //console.log("Coup de l'adversaire :", coup);

          //console.log(Object.values(coup)[1][0]);
        convert(coup);
        
        /*if (coup.move.length == 4) {
            delay = tempo + 50;
        }
        
        setTimeout(() => {
            valider();
        }, 700 + delay);*/

        waitforvalid(coup.move.length);

    });
}

function waitforvalid(movelength){

    let cube=selectedScene.firstElementChild;

    cube.addEventListener('transitionend', () => {
        if(movelength==4){
            cube.addEventListener('transitionend', () => {
                setTimeout(() => {
                    valider()
                }, tempo);
            },{once: true});
        }else{
            setTimeout(() => {
                valider()
            }, tempo);
        }
    },{once: true});

}

function pushcoup(m1) {
    if(playingmode ==5){
        const refCoups = firebase.database().ref('gamesdiff/' + gameIddiff + '/coups');
        refCoups.push({ joueur: pseudo, move: m1 , matrice :cubestatus});
    } else{
        const refCoups = firebase.database().ref('games/' + gameId + '/coups');
        database.ref('games/'+ gameId).onDisconnect().remove();
        refCoups.push({ joueur: pseudo, move: m1 });
    }


}


function clean(){


    for(i=1; i<moves.length; i++){

        for(j=i+1; j<moves.length; j++){
            if(moves[i]==moves[j]){
                moves.splice(i,j-i);

                j=i;
            }
        }
    }
    //console.log(moves);

    pushcoup(moves);

}


function convert(coup){

    //let sceneid = Object.values(coup)[1][0];
    let sceneid = coup.move[0]
    let currentcellid = coup.move[1];
    let targetcellid = coup.move[2];

    let scenenumber=sceneid.match(/\d+/)[0];
    scenenumber = 13 - scenenumber;

    let currentcellnumber=currentcellid.match(/\d+/)[0];
    currentcellnumber = 37 - currentcellnumber;

    let targetcellnumber=targetcellid.match(/\d+/)[0];
    targetcellnumber = 37 - targetcellnumber;

    sceneid = "scene-" + scenenumber;
    currentcellid = "cell-" + currentcellnumber;
    targetcellid = "cell-" + targetcellnumber;

    let currentcell=null;
    //let selectedcell=null;

    selectedScene = document.getElementById(sceneid);
    currentcell= document.getElementById(currentcellid);
    selectcurrentcell(currentcell);
    //selectedcell = document.getElementById(targetcellid);
    //let time=performance.now();
    moveCubeTo3(targetcellid, light);

    if (coup.move.length == 4 ){

        let targetcellid_2 = coup.move[3];

        let targetcellnumber_2=targetcellid_2.match(/\d+/)[0];
        targetcellnumber_2 = 37 - targetcellnumber_2;
        targetcellid_2 = "cell-" + targetcellnumber_2;

        let cube=selectedScene.firstElementChild;

        cube.addEventListener('transitionend', () => { //question de perfo, le mouvement peut prendre plus de temps que prévu. A faire pour tous les bots aussi
            setTimeout(() => {
                //selectedcell = document.getElementById(targetcellid_2);
                //console.log(performance.now()-time);
                moveCubeTo3(targetcellid_2, light);

            }, 50);
        },{once: true});
    }

}


function flip()
{
    //lancer page jeu avec les noirs
    document.querySelectorAll(".face").forEach(el => {
        el.style.backgroundColor = "rgb(238, 223, 195)";
    });

    document.querySelectorAll(".facew").forEach(el => {
        el.style.backgroundColor = "rgb(50, 50, 50)";
    });

    document.querySelectorAll(".cube").forEach(el => {
        let el6=el.querySelector('.shape6'); //bd
        let el5=el.querySelector('.shape5'); //bs
        let el4=el.querySelector('.shape4'); //ws
        let el3=el.querySelector('.shape3'); //wd
        let cubenumber=parseInt(el.id.match(/\d+/)[0]) - 1;

        let facefront=cubestatus[3][cubenumber];
        let faceback=cubestatus[4][cubenumber];
        let faceleft=cubestatus[5][cubenumber];
        let faceright=cubestatus[6][cubenumber];

        el6.classList.replace('shape6','shape5');
        el5.classList.replace('shape5','shape6');
        el4.classList.replace('shape4','shape3');
        el3.classList.replace('shape3','shape4');

        cubestatus[3][cubenumber]= faceback;
        cubestatus[4][cubenumber]= facefront;
        cubestatus[5][cubenumber]= faceright;
        cubestatus[6][cubenumber]= faceleft;
    });

}

function afficherPseudoMasque(name, containerid, add, name2) {
    const container = document.getElementById(containerid);
    container.innerHTML = '';

    if(name!==null){
        if (name == "Libre" || name == "Abandon"){
            const span = document.createElement('span');
            span.textContent = name;
            container.appendChild(span);
            return;
        }
        for (let i = 0; i < 4; i++) {
        const span = document.createElement('span');
        span.className = `letter-${i}`;
        span.textContent = name[i];
        container.appendChild(span);
        }
        for (let i = 4; i < 7; i++) {
        const span = document.createElement('span');
        span.className = `letter-${i}`;
        span.textContent = "-";
        container.appendChild(span);
        }
    }

    if(add!==null){
        const span = document.createElement('span');
        span.textContent = add;
        container.appendChild(span);
    }

    if(name2!==null){
        if (name2 == "Libre" || name2 == "Abandon"){
            const span = document.createElement('span');
            span.textContent = name2;
            container.appendChild(span);
            return;
        }
        for (let i = 0; i < 4; i++) {
          const span = document.createElement('span');
          span.className = `letter-${i}`;
          span.textContent = name2[i];
          container.appendChild(span);
        }
    
        for (let i = 4; i < 7; i++) {
        const span = document.createElement('span');
        span.className = `letter-${i}`;
        span.textContent = "-";
        container.appendChild(span);
        }
    }

}
