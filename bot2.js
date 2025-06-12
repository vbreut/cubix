"use strict";

function botlevel2(){

    let nb=0;
    //coup forcé
    if(forcedcube[3]!=-1){
        nb=forcedmove();
        return nb;
    }

    //victoire possible en 2 cases ?
    nb=pathtovictory(2);
    if(nb<2){console.log("pathtovictory(2)");return nb;}

    /*nb=defense(2);
    if(nb<2){console.log("defense(2)");return nb;}*/

    nb=pathtovictory(4);
    if(nb<2){console.log("pathtovictory(4)");return nb;}

    /*nb=defense(4);
    if(nb<2){console.log("defense(4)");return nb;}*/

    let cointoss = Math.floor(Math.random() * 2);
    //console.log(cointoss);
    if (cointoss == 0){
        nb=taketake();
        if(nb<2){console.log("taketake");return nb;}

        //prise possible pour l'adversaire ?
        /*nb=protect();
        if(nb<2){console.log("protect");return nb;}*/

        //attaque agressive ?

        //coup en avant si possible
        nb=movecareful();
        if(nb<2){console.log("movecareful");return nb;}
    }

    //sinon coup au hasard
    nb=botlevel1();
    //console.log("botlevel1");
    return nb;
}
