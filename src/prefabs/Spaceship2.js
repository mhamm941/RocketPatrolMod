// Spaceship prefab
class Spaceship2 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add obeject to existing, displayList, updateList
        
        this.points = pointValue;
    }

    update() {
        // move spaceship
        this.x -= game.settings.spaceshipSpeed + 1;
        // wraparound screen bounds
        if(this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }
    //reset to left edge
    reset() {
        this.x = game.config.width;
    }
}