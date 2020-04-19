class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprite
        this.load.image('rocket', './assets/rocket1.png');
        this.load.image('spaceship', './assets/spaceship1.png');
        this.load.image('starfield', './assets/starfield1.png');
        this.load.image('smallShip', './assets/spaceship2.png');
        //load spritesheet
        this.load.spritesheet('explosion1', './assets/explosion1.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('explosion2', './assets/explosion2.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('explosion3', './assets/explosion3.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('explosion4', './assets/explosion4.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('border', './assets/Border.png', {frameWidth: 640, frameHeight: 480, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);

        //add spaceship (x4)
        this.ship01 = new Spaceship(this, game.config.width +192, 120, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width +96, 200, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 280, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new Spaceship2(this, game.config.width +150, 160, 'smallShip', 0, 50).setOrigin(0, 0);
        
        // define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        

        // animate config
        this.anims.create({
            key: 'explode1',
            frames: this.anims.generateFrameNumbers('explosion1', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'explode2',
            frames: this.anims.generateFrameNumbers('explosion2', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'explode3',
            frames: this.anims.generateFrameNumbers('explosion3', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'explode4',
            frames: this.anims.generateFrameNumbers('explosion4', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.anims.create({
            key: 'ui',
            frames: this.anims.generateFrameNumbers('border', {start: 0, end: 9, first: 0}),
            frameRate: 10,
            repeat: -1
        });

        //add border and animate
        this.uiBorder = this.add.sprite(0, 0, 'border', 0).setOrigin(0, 0);
        this.uiBorder.anims.play('ui');

        // score
        this.p1Score = 0;
        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#00a7a7',
            color: '#014040',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(270, 29, this.p1Score, scoreConfig);

        // game over flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

    }

    update() {
        
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start('menuScene');
        }
        
        //scroll starfield
        this.starfield.tilePositionX -= 4;

        if (!this.gameOver) {
            this.p1Rocket.update();     // update rocket
            this.ship01.update();       // update spaceship
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if(rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        let ranExplode = Phaser.Math.Between(1, 4);
        var sprite, playSprite, sfx;
        //console.log(ranExplode);
        if(ranExplode == 1){
            sprite = 'explosion1';
            playSprite = 'explode1';
            sfx = 'sfx_ogEX';
        } else if(ranExplode == 2){
            sprite = 'explosion2';
            playSprite = 'explode2';
            sfx = 'sfx_bbblEX';
        } else if(ranExplode == 3){
            sprite = 'explosion3';
            playSprite = 'explode3';
            sfx = 'sfx_multiEX';
        } else if(ranExplode == 4){
            sprite = 'explosion4';
            playSprite = 'explode4';
            sfx = 'sfx_lzrcrakEX';
        }
        
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, sprite).setOrigin(0, 0);
        boom.anims.play(playSprite);             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play(sfx);
    }
}