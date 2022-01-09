const readlineSync = require('readline-sync');
const evstafiyMaxHealth = readlineSync.question('Выберите сложность игры - здоровье боевого мага Евстафия (от 6 до 10): ');
const winer = {};

if (evstafiyMaxHealth < 6 || evstafiyMaxHealth > 10){
    console.log('Евстафий с таким здоровьем сам выглядит монстром! Начальное здоровье должно быть от 6 до 10.');
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

var monsterMovement;
function chooseMonsterMovement () {
    monsterMovement = readlineSync.question('Выберите удар Лютого (введите число от 1 до 3): ');
    if (monsterMovement < 1 || monsterMovement > 3){
        console.log('Монстр не располагает такими возможностями. Выберите другой удар (от 1 до 3): ');
        chooseMonsterMovement (monsterMovement);
        monsterMovement -= 1;
        return monster.moves[monsterMovement];
    }
    monsterMovement -= 1;
    return monster.moves[monsterMovement]; 
}

var wizardMovement;
function chooseWizardMovement () {
    wizardMovement = readlineSync.question('Выберите удар Евстафия (введите число от 1 до 4): ');
    if (wizardMovement < 1 || wizardMovement > 4){
        console.log('Евстафию предстоит научиться таким ударам, а пока что выберите другой (от 1 до 4): ');
        chooseWizardMovement ();
        wizardMovement -= 1;
        return wizard.moves[wizardMovement];
    }
    wizardMovement -= 1;
    return wizard.moves[wizardMovement]; 
}

chooseMonsterMovement ();
console.log('Лютый нанёс ' + monster.moves[monsterMovement].name);

chooseWizardMovement ();
console.log('Евстафий нанёс ' + wizard.moves[wizardMovement].name);

monster.maxHealth -= ((wizard.moves[wizardMovement].physicalDmg - wizard.moves[wizardMovement].physicalDmg * (monster.moves[monsterMovement ].physicArmorPercents / 100)) + (wizard.moves[wizardMovement].magicDmg - wizard.moves[wizardMovement].magicDmg * (monster.moves[monsterMovement ].magicArmorPercents / 100)));
wizard.maxHealth -= ((monster.moves[monsterMovement].physicalDmg - monster.moves[monsterMovement].physicalDmg * (wizard.moves[wizardMovement ].physicArmorPercents / 100)) + (monster.moves[monsterMovement].magicDmg - monster.moves[monsterMovement].magicDmg * (wizard.moves[wizardMovement ].magicArmorPercents / 100)));
console.log('Текущее здоровье мага Евстафия - ' + wizard.maxHealth);
console.log('Текущее здоровье монстра Лютого - ' + monster.maxHealth);

if (Number(monster.maxHealth) > Number(wizard.maxHealth)){
    winer.name = monster.name;
}
else {
    winer.name = wizard.name;
}

console.log('На этот раз победил ' + winer.name);
