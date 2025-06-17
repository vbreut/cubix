let gameId=0;
let pseudo=null;
let database = null;
let connectedRef = null;

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


//database.ref().remove();
  
// Pseudo du joueur
//localStorage.removeItem("pseudo");

window.addEventListener("load", loadPseudo)


function loadPseudo(){

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    
    pseudo = localStorage.getItem("pseudo");
    if (pseudo!==null) {

        checkIfPseudoExists(pseudo).then(exists => {
            if (exists) {
                document.getElementById("form").style.display = "block";
                document.getElementById("welcome").style.display = "none";
                document.getElementById("pseudoInput").value = pseudo;
                document.getElementById("infocom").textContent = "Ce pseudo est déjà pris !";
            } else {
                let joueurRef = database.ref('joueurs/' + pseudo);

                if (checkifconnected()){ //peut-être pas utile mais bon...
                    joueurRef.set({ enLigne: "connecté" });
                    joueurRef.onDisconnect().remove();
                } else{
                    waitforconnected(joueurRef);
                }
                
                // Écouter si on reçoit un défi
                const challengeRef = database.ref('challenges/' + pseudo);
                listenchallenges(challengeRef);

                document.getElementById("pseudoAffiche").textContent = pseudo;

                // Afficher la liste des joueurs
                const listeRef = database.ref('joueurs');
                display(listeRef);
            }
        });

    } else {
        document.getElementById("form").style.display = "block";
        document.getElementById("welcome").style.display = "none";
    }

    const input=document.getElementById("pseudoInput");

    input.addEventListener("keydown", function(event){
        if(event.key ==="Enter"){
            sauvegarderPseudo();
        }
    });

    setTimeout(() => {
        firebase.database().ref(".info/connected").on("value",(snapshot)=>{
            if(snapshot.val()===true){
                document.getElementById("onlinesubmenu2").style.display = "flex";
                document.getElementById("infocom").style.display = "block";
                modalvic.style.display = "none";
            }
            if(snapshot.val()===false && pseudo!==null && pseudo!==""){
                document.getElementById("spacer").style.display="block";
                document.getElementById("message").textContent="Connexion perdue";
                document.getElementById("modalvic").style.display="flex";
                document.getElementById("onlinesubmenu2").style.display = "none";
                document.getElementById("infocom").style.display = "none";
            }
        });

    }, 5000);


}

function checkifconnected(){
    firebase.database().ref(".info/connected").once("value").then((snapshot)=>{
        if(snapshot.val()===true){
            return true;
        } else{
            return false;
        }
    });
}

function waitforconnected(joueurRef){
    firebase.database().ref(".info/connected").on("value",(snapshot)=>{
        if(snapshot.val()===true){
            joueurRef.set({ enLigne: "connecté" });
            joueurRef.onDisconnect().remove();
        }
    });
}

sauvpseudo.addEventListener('click',sauvegarderPseudo);

function sauvegarderPseudo(){
    pseudo = document.getElementById("pseudoInput").value.trim();

    if(pseudo!==""){
        checkIfPseudoExists(pseudo).then(exists => {
            if (exists) {
                document.getElementById("infocom").textContent = "Ce pseudo est déjà pris !";
            } else {
                // Le pseudo est disponible, on l'enregistre

                localStorage.setItem("pseudo", pseudo);
                let joueurRef = database.ref('joueurs/' + pseudo);
                joueurRef.set({ enLigne: "connecté" });
                joueurRef.onDisconnect().remove(); // Supprimer quand il quitte

                document.getElementById("form").style.display = "none";
                document.getElementById("welcome").style.display = "block";
                document.getElementById("pseudoAffiche").textContent = pseudo;
                document.getElementById("infocom").textContent = "Choisir un joueur";

                // Écouter si on reçoit un défi
                const challengeRef = database.ref('challenges/' + pseudo);
                listenchallenges(challengeRef);
            }
        });
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

function display(listeRef){

    //listeRef.onDisconnect().remove(); 
    listeRef.on('value', (snapshot) => {
        const joueurs = snapshot.val();
        const container = document.getElementById('joueurs');
        container.innerHTML = '';
        let n = 0;

        for (let key in joueurs) {
            if (key !== pseudo) {
                n=1;
                let joueur = joueurs[key];
                const div = document.createElement('div');
                div.className = 'joueur';
                div.textContent = key + " " + joueur.enLigne;
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


// Fonction pour défier un joueur
function defierJoueur(adversaire) {
    let joueurRef = database.ref('joueurs/' + pseudo);
    const challengeRef = database.ref('challenges/' + adversaire);
    challengeRef.onDisconnect().remove(); 
    challengeRef.set({
        from: pseudo,
        //timestamp: Date.now()
    });

    joueurRef.set({ enLigne: "en défi"});

    surveillerreponse(pseudo);

    document.getElementById("infocom").textContent = `Défi envoyé à ${adversaire}`;
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
    });

    //si l'autre joueur se déconnecte on passe à "connecté" uniquement si on n'est pas en partie
    const listeRef = database.ref('joueurs');
    listeRef.once('child_removed', (snapshot) =>{
        const pseudodeleted = snapshot.key;
        const element = document.getElementById("game");

        if (pseudodeleted==adversaire && getComputedStyle(element).display==="none"){
            document.getElementById("infocom").textContent = "Choisir un joueur";
            document.getElementById("cancelchallenge").style.display = "none";
            document.getElementById("joueurs").style.display = "block";
            joueurRef.set({ enLigne: "connecté" });
            challengeRef.remove();
            adversaire=null;
        }
        if (pseudodeleted==adversaire && getComputedStyle(element).display!=="none"){
            document.getElementById("spacer").style.display="block";
            document.getElementById("message").textContent=`${adversaire} s'est déconnecté`;
            document.getElementById("modalvic").style.display="flex";
            challengeRef.remove();
            adversaire=null;
        }
    });
  
}


function listenchallenges(challengeRef){
    let joueurRef = database.ref('joueurs/' + pseudo);
    let adversaire=null;
    const accept = document.getElementById('accept');
    const deny= document.getElementById('deny');

    challengeRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {

            blockbot=1;

            adversaire = data.from;

            document.getElementById("infocom").textContent = `Vous êtes défié par ${adversaire}. Accepter ?`;
            document.getElementById("buttonchallenge").style.display = "block";
            joueurRef.set({ enLigne: "défié"});
            document.getElementById("joueurs").style.display = "none";
        }

    });


    accept.addEventListener('click', () => {
                
        blockbot=0;

        document.getElementById("buttonchallenge").style.display = "none";
        gameId=`game_${Date.now()}`;
        database.ref('games/' + gameId).set({
            joueur1: adversaire,
            joueur2: pseudo
            //début: Date.now()
        });

        database.ref('reponses/' + adversaire).set({
            from: pseudo,
            accepted: true,
            gameId: gameId
        });

        database.ref('games/'+ gameId).onDisconnect().remove();
        //database.ref('reponses/'+ adversaire).onDisconnect().remove();

        //document.getElementById("infocom").textContent = `Partie lancée avec ${data.from} (ID : ${gameId})`;

        //joueurRef.set({ enLigne: "en partie"});

        playingmode = 4;

        ecouterCoups(gameId,pseudo);
        //lancer partie avec les noirs
        flip();

        document.getElementById("adv").textContent = `${adversaire}`;
        showPage();

    });

    deny.addEventListener('click', () => {

        blockbot=0;
        database.ref('reponses/' + adversaire).set({
            from: pseudo,
            accepted: false,
        });
        //joueurRef.set({ enLigne: "connecté"});

        //document.getElementById("buttonchallenge").style.display = "none";
        //document.getElementById("infocom").textContent = "Défier un joueur";
        //document.getElementById("joueurs").style.display = "block";
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
        }
        /*if (pseudodeleted==pseudo && getComputedStyle(element).display!=="none"){
            blockbot=0;
            document.getElementById("spacer").style.display="block";
            document.getElementById("message").textContent=`${adversaire} s'est déconnecté`;
            document.getElementById("modalvic").style.display="flex";
            adversaire=null;
        }*/
    });

    // s'il se déconnecte et qu'on est en partie on affiche le message
    const listeRef = database.ref('joueurs');
    listeRef.on('child_removed', (snapshot) =>{
        const pseudodeleted = snapshot.key;
        const element = document.getElementById("game");
        if (pseudodeleted==adversaire && getComputedStyle(element).display!=="none"){
            blockbot=0;
            document.getElementById("spacer").style.display="block";
            document.getElementById("message").textContent=`${adversaire} s'est déconnecté`;
            document.getElementById("modalvic").style.display="flex";
            adversaire=null;
        }
    });
}

function surveillerreponse(pseudo){
    let joueurRef = database.ref('joueurs/' + pseudo);
    let adversaire=null;
    const repRef = firebase.database().ref('reponses/' + pseudo);

    blockbot=1;

    repRef.onDisconnect().remove(); 
    repRef.on('value', (snapshot) =>{
        const data = snapshot.val();

        if (data){
            blockbot=0;

            if (data.accepted){
                //let playerfound=0;
                //document.getElementById("infocom").textContent = `${data.from} a accepté le défi ! (ID : ${data.gameId})`;
                adversaire=data.from;
                //joueurRef.set({ enLigne: "en partie"});

              //lancer page jeu avec les blancs
                //let m1 ="test";
                //pushcoup(data.gameId,pseudo,m1);
                gameId=data.gameId;

                playingmode = 4;

                ecouterCoups(gameId,pseudo);

                turn = "white";
                
                document.getElementById("adv").textContent = `${adversaire}`;
                showPage();


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


function pushcoup(gameId,pseudo, m1) {
    const refCoups = firebase.database().ref('games/' + gameId + '/coups');

    refCoups.push({ joueur: pseudo, move: m1 });
}

function ecouterCoups(gameId,pseudo) {

    let delay=50;
    const refCoups = firebase.database().ref('games/' + gameId + '/coups');

    refCoups.on('child_added', (snapshot) => {
        const coup = snapshot.val();
        if (coup.joueur === pseudo) {
            // C’est mon propre coup → on ignore
            return;
        }
        
          // Sinon, on l’applique
          //console.log("Coup de l'adversaire :", coup);

          //console.log(Object.values(coup)[1][0]);
        convert(coup);
        if (Object.values(coup)[1].length == 4) {
            delay = tempo + 50;
        }
        
        setTimeout(() => {
            valider();
        }, 800 + delay);

    });
}


function clean(){

    //let len=moves.length;

    /*for(i=len-1; i>=0; i--){
        if (moves[i].includes("scene")){
            moves.splice(0,i);
            //console.log(moves);
            break;
        }
    }*/

    //console.log(moves);

    for(i=1; i<moves.length; i++){

        for(j=i+1; j<moves.length; j++){
            if(moves[i]==moves[j]){
                moves.splice(i,j-i);

                j=i;
            }

        }

    }
    //console.log(moves);

    pushcoup(gameId,pseudo,moves);

}

function convert(coup){

    let sceneid = Object.values(coup)[1][0];
    let currentcellid = Object.values(coup)[1][1];
    let targetcellid = Object.values(coup)[1][2];

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
    let selectedcell=null;

    selectedScene = document.getElementById(sceneid);
    currentcell= document.getElementById(currentcellid);
    selectcurrentcell(currentcell);
    selectedcell = document.getElementById(targetcellid);
    moveCubeTo3(selectedcell, light);

    if (Object.values(coup)[1].length == 4 ){

        let targetcellid_2 = Object.values(coup)[1][3];

        let targetcellnumber_2=targetcellid_2.match(/\d+/)[0];
        targetcellnumber_2 = 37 - targetcellnumber_2;
        targetcellid_2 = "cell-" + targetcellnumber_2;

        let cube=selectedScene.firstElementChild;

        cube.addEventListener('transitionend', () => { //question de perfo, le mouvement peut prendre plus de temps que prévu. A faire pour tous les bots aussi
            setTimeout(() => {
                selectedcell = document.getElementById(targetcellid_2);
                moveCubeTo3(selectedcell, light);
            }, 50);

        },{once: true});
    }
}

function flip()
{
    //lancer page jeu avec les noirs
    document.querySelectorAll(".face").forEach(el => {
        el.style.backgroundColor = "rgb(238, 223, 200)";
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

    turn = "black"; //black veut dire "joueur du haut"

}

    //pour revoir une partie juste après la fin, afficher les flèches.
    //il va falloir stocker la matrice à cause des cubes pris. Pas la peine de stocker sur firebase.
    //on va redessiner tout le plateau à chaque fois à partir de la matrice
    //pas d'animation car on n'a pas l'historique des double cases dans la matrice, ce serait trop lent de toute façon
