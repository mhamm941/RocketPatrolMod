/*
    Matthew Hamm - Section E
    POINT BREAKDOWN
    - Create new scrolling sprite       (10)
    - Control rocket after fired        (10)
    - 4 random explosion SFX            (15)
    - Replace UI borders                (15)
    - Create new art *                  (25)
    - Create a new spaceship            (25) 
    
    *new art includes: rocket, spaceship, UI, 4 random explosions
*/
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
};

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
}

// reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT;