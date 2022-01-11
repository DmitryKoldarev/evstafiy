const readlineSync = require('readline-sync');
const winner = {};
let monsterMovement;
let wizardMovement;

//Монстр описывается таким объектом:
let monster = {
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

let wizard = {
    maxHealth: undefined,
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

function setWizardHealth(wizard) {
    let maxHealth;
    while(wizard.maxHealth == undefined) {
        maxHealth = readlineSync.question('Выберите сложность игры - здоровье боевого мага Евстафия (от 5 до 10): ');
        switch (true) {
            case maxHealth > 10:
                console.log(wizard.name + ' с таким здоровьем сам выглядит монстром! Начальное здоровье должно быть от 5 до 10.');
                break;
            case maxHealth < 5:
              console.log('Хиловат, не тянет на боевого мага (здоровье должно быть от 5 до 10).');
              break;
            default:
                wizard.maxHealth = maxHealth;
        }
    }
}

//дополнение полей во всех объектах moves для контроля cooldown
function setInitialCooldowns(obj) {
    for (let i = 0; i < obj.moves.length; i += 1) {
        obj.moves[i].cooldownCounts = 0;
    }
} 

function decreaseCooldowns(obj) {
    for (let i = 0; i < obj.moves.length; i += 1) {
        if (obj.moves[i].cooldownCounts > 0) {
            obj.moves[i].cooldownCounts -= 1;
        }
    }     
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function declension (number, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}


function chooseMonsterMovement(max) {
    var choosedMovementIndex = null;
    var currentMovement;
    while (choosedMovementIndex == null) {

        currentMovement = Math.floor(Math.random() * max);
        if (monster.moves[currentMovement].cooldownCounts >0) {
            console.log(`Лютый попытался, но не сможет сделать действие "${monster.moves[currentMovement].name}" ещё ${monster.moves[currentMovement].cooldownCounts} ${declension(monster.moves[currentMovement].cooldownCounts, ['ход', 'хода', 'ходов'])}`);
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
        currentMovement = readlineSync.question('Выберите удар Евстафия (введите число от 1 до ' + (+wizard.moves.length) + '): ');

        if (currentMovement < 1 || currentMovement > 4){
            console.log('Евстафию когда-нибудь предстоит научиться таким ударам.');
            continue;
        }
            else {
                if (wizard.moves[currentMovement-1].cooldownCounts >0) {
                    console.log(`Евстафий не может сделать действие "${wizard.moves[currentMovement-1].name}" ещё ${wizard.moves[currentMovement-1].cooldownCounts} ${declension(wizard.moves[currentMovement-1].cooldownCounts, ['ход', 'хода', 'ходов'])}`);
                }
                else {
                    choosedMovementIndex = currentMovement - 1;
                }
                
            }
    }
    return wizard.moves[choosedMovementIndex]; 
}

setWizardHealth(wizard);

setInitialCooldowns(monster);
setInitialCooldowns(wizard);

while (+monster.maxHealth > 0 && +wizard.maxHealth > 0) {
    console.log('_____________' + '\n');    
    //уменьшение счётчика cooldown
    decreaseCooldowns(monster);
    decreaseCooldowns(wizard);
    monsterMovement = chooseMonsterMovement(monster.moves.length);

    monsterMovement.cooldownCounts = monsterMovement.cooldown;
    console.log(`Лютый нанёс "${monsterMovement.name}". Удар заблокирован на ${monsterMovement.cooldownCounts} ${declension(monsterMovement.cooldownCounts, ['ход', 'хода', 'ходов'])}`);

    wizardMovement = chooseWizardMovement();
   
    wizardMovement.cooldownCounts = wizardMovement.cooldown;
    console.log(`Евстафий нанёс "${wizardMovement.name}". Удар заблокирован на ${wizardMovement.cooldownCounts} ${declension(wizardMovement.cooldownCounts, ['ход', 'хода', 'ходов'])}`);

    monster.maxHealth -= ((wizardMovement.physicalDmg - wizardMovement.physicalDmg * (monsterMovement.physicArmorPercents / 100)) + (wizardMovement.magicDmg - wizardMovement.magicDmg * (monsterMovement.magicArmorPercents / 100)));
    wizard.maxHealth -= ((monsterMovement.physicalDmg - monsterMovement.physicalDmg * (wizardMovement.physicArmorPercents / 100)) + (monsterMovement.magicDmg - monsterMovement.magicDmg * (wizardMovement.magicArmorPercents / 100)));

    console.log('Текущее здоровье мага Евстафия: ' + round(wizard.maxHealth,1));
    console.log('Текущее здоровье монстра Лютого: ' + round(monster.maxHealth,1));
    
}

winner.name = Number(monster.maxHealth) > Number(wizard.maxHealth) ? monster.name : wizard.name;
console.log('_____________' + '\n');
console.log(`На этот раз победил ${winner.name}`);
