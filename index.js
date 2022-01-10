const readlineSync = require('readline-sync');
const evstafiyMaxHealth = readlineSync.question('Выберите сложность игры - здоровье боевого мага Евстафия (от 5 до 10): ');
const winner = {};
let monsterMovement;
let wizardMovement;

if (evstafiyMaxHealth < 5 || evstafiyMaxHealth > 10) {
    console.log('Евстафий с таким здоровьем сам выглядит монстром! Начальное здоровье должно быть от 5 до 10.');
    return false;
}

//Монстр описывается таким объектом:
const monster = {
    maxHealth: 10,
    name: "Лютый",
    moves: [
        {
            "name": "Удар когтистой лапой",
            "physicalDmg": 3, // физический урон
            "magicDmg": 0,    // магический урон
            "physicArmorPercents": 20, // физическая броня
            "magicArmorPercents": 20,  // магическая броня
            "cooldown": 0     // ходов на восстановление
        },
        {
            "name": "Огненное дыхание",
            "physicalDmg": 0,
            "magicDmg": 4,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Удар хвостом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 50,
            "magicArmorPercents": 0,
            "cooldown": 2
        },
    ]
}


//Боевой маг Евстафий способен на следующее:

const wizard = {
    maxHealth: evstafiyMaxHealth,
    name: "Евстафий",
    moves: [
        {
            "name": "Удар боевым кадилом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 50,
            "cooldown": 0
        },
        {
            "name": "Вертушка левой пяткой",
            "physicalDmg": 4,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 4
        },
        {
            "name": "Каноничный фаербол",
            "physicalDmg": 0,
            "magicDmg": 5,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Магический блок",
            "physicalDmg": 0,
            "magicDmg": 0,
            "physicArmorPercents": 100,
            "magicArmorPercents": 100,
            "cooldown": 4
        },
    ]
}

//дополнение полей во всех объектах moves для контроля cooldown
for (let j = 0; j < monster.moves.length; j += 1) {
    monster.moves[j].cooldownCounts = 0;
}

for (j = 0; j < wizard.moves.length; j += 1) {
    wizard.moves[j].cooldownCounts = 0;
}  

function cooldownDown() {
    for (let j = 0; j < monster.moves.length; j += 1) {
        if (monster.moves[j].cooldownCounts > 0) {
            monster.moves[j].cooldownCounts -= 1;
        }
    }     
    for (let j = 0; j < wizard.moves.length; j += 1) {
        if (wizard.moves[j].cooldownCounts > 0) {
            wizard.moves[j].cooldownCounts -= 1;
        } 
    }
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}


function chooseMonsterMovement(max) {
    var choosedMovementIndex = null;
    var currentMovement;
    while (choosedMovementIndex == null) {

        currentMovement = Math.floor(Math.random() * max);
        if (monster.moves[currentMovement].cooldownCounts >0) {
            console.log ('Лютый не может сделать это действие ещё ' + monster.moves[currentMovement].cooldownCounts + ' шага (шагов)');
        }
        else {
            choosedMovementIndex = currentMovement;
        }
    }
    return monster.moves[choosedMovementIndex];
}


function chooseWizardMovement() {
    var choosedMovementIndex = null;
    var currentMovement;
    while (choosedMovementIndex == null) {
        currentMovement = readlineSync.question('Выберите удар Евстафия (введите число от 1 до 4): ');

        if (currentMovement < 1 || currentMovement > 4){
            console.log('Евстафию предстоит научиться таким ударам.');
            continue;
        }
            else {
                if (wizard.moves[currentMovement-1].cooldownCounts >0) {
                    console.log ('Евстафий не может сделать это действие ещё ' + wizard.moves[currentMovement-1].cooldownCounts + ' шага (шагов)');
                }
                else {
                    choosedMovementIndex = currentMovement - 1;
                }
                
            }
    }
    return wizard.moves[choosedMovementIndex]; 
}



while (+monster.maxHealth > 0 && +wizard.maxHealth > 0) {
    
    //уменьшение счётчика cooldown
    cooldownDown();
    monsterMovement = chooseMonsterMovement(monster.moves.length);

    monsterMovement.cooldownCounts = monsterMovement.cooldown;
    console.log('Лютый нанёс ' + monsterMovement.name + '. Удар заблокирован на ' + monsterMovement.cooldownCounts + ' хода (ходов).');

    wizardMovement = chooseWizardMovement();
   
    wizardMovement.cooldownCounts = wizardMovement.cooldown;
    console.log('Евстафий нанёс ' + wizardMovement.name + '. Удар заблокирован на ' + wizardMovement.cooldownCounts + ' хода (ходов).');

    monster.maxHealth -= ((wizardMovement.physicalDmg - wizardMovement.physicalDmg * (monsterMovement.physicArmorPercents / 100)) + (wizardMovement.magicDmg - wizardMovement.magicDmg * (monsterMovement.magicArmorPercents / 100)));
    wizard.maxHealth -= ((monsterMovement.physicalDmg - monsterMovement.physicalDmg * (wizardMovement.physicArmorPercents / 100)) + (monsterMovement.magicDmg - monsterMovement.magicDmg * (wizardMovement.magicArmorPercents / 100)));
    console.log('Текущее здоровье мага Евстафия: ' + round(wizard.maxHealth,1));
    console.log('Текущее здоровье монстра Лютого: ' + round(monster.maxHealth,1));
    
}

winner.name = Number(monster.maxHealth) > Number(wizard.maxHealth) ? monster.name : wizard.name;

console.log('На этот раз победил ' + winner.name);
