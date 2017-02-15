module TheRock.Client {

    export class Player extends Phaser.Sprite {

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y,'level01-sprites', 1);
            this.anchor.setTo(0.5);
           
            game.add.existing(this);
            game.physics.enable(this);
            this.body.collideWorldBounds = true;
            this.body.setCircle(20);
        }

        update() {
            this.body.velocity.x = 0;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x = -300;
                if (this.scale.x === -1) {
                    this.scale.x = 1;
                }
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x = 300;
                if (this.scale.x === 1) {
                    this.scale.x = -1;
                }
            } else {
                this.animations.frame = 0;
            }
        }

    }

}