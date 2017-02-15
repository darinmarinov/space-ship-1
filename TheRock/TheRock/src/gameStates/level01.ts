module TheRock.Client {

    export class Level01 extends Phaser.State {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        player: Player;

        public sprite: any;
        public bullets: any;
        public bulletTime: number = 0;
        public fireButton: any;
        public score: number = 0;
        public scoreString: string = '';
        public scoreText: any;
        public lives: any;
        public live: any;
        public stateText: any;
        public i: number = 0;
        public bullet: any;
        public invaders: any;
        public numberOfBullets: number = 3;
        public invader: any;
        public timer: any;

        preload() {
            this.game.load.image('invader', 'assets/sprites/invader.png');
            this.game.load.image('bullets', 'assets/sprites/bullets.png');
            this.game.load.image('ship', 'assets/sprites/ship.png');
            this.game.load.image('kaboom', 'level01-sprites.png');
        }

        create() {
            this.physics.startSystem(Phaser.Physics.ARCADE);

            this.background = this.add.sprite(0, 0, 'level01-sprites', 'background');

            this.invaders = this.game.add.group();
            this.invaders.enableBody = true;
            this.invaders.immovable = true;
            this.game.physics.arcade.collide(this.invaders);

            this.player = new Player(this.game, this.world.centerX, 900);
            this.player.anchor.setTo(0, 5);
            this.player.body.collideWorldBounds = true;
            this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(this.numberOfBullets, 'bullets');
            this.bullets.setAll('anchor.x', 1);
            this.bullets.setAll('anchor.y', 30);
            this.bullets.setAll('checkWorldBounds', true);

            this.scoreString = 'Score : ';
            this.scoreText = this.game.add.text(10, 10, this.scoreString + this.score, { font: '34px Arial', fill: '#fff' });

            this.lives = this.game.add.group();
            this.game.add.text(10, 50, 'Lives : ', { font: '34px Arial', fill: '#fff' });


            for (this.i; this.i < 3; this.i++) {
                var ship = this.lives.create(130 + (30 * this.i), 75, 'ship');
                ship.anchor.setTo(0.5, 0.5);
                ship.angle = 90;
                ship.alpha = 0.4;
            }
            
            this.stateText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, ' ', { font: '84px Arial', fill: '#fff' });
            this.stateText.anchor.setTo(0.5, 0.5);
            this.stateText.visible = false;

            this.game.debug.text("Use Right and Left arrow keys to move the ship", 5, this.world.height - 20, "red");

            this.timer = this.game.time.create(false);
            this.timer.loop(5000, this.moreInvaders, this);
            this.timer.start();
            this.moreInvaders()

            this.game.physics.arcade.collide(this.bullets, this.invaders);

            this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
            this.game.physics.arcade.overlap(this.player, this.invaders, this.bullets, null, this);
        }

        collectStar(player, invader) { this.invader.kill(); }

        moreInvaders() {
            for (this.i = 0; this.i < 2; this.i++) {
                this.invader = this.invaders.create(this.i * Math.floor(Math.random() * 840), this.i * Math.floor(Math.random() * 200), 'invader');
                this.invader.body.gravity.y = 10;
                this.invader.body.bounce.y = 6.7 + Math.random() * 0.9;
                this.invader.body.immovable = true;
            }
        }

        update() {
            this.game.physics.arcade.overlap(this.bullets, this.invaders, this.collisionHandler, null, this);
            this.game.physics.arcade.collide(this.player, this.invaders);
            if (this.fireButton.isDown) {
                this.fireBullet();
            }
        }
        fireBullet() {

            if (this.game.time.now > this.bulletTime) {
                this.bullet = this.bullets.getFirstExists(false);
                if (this.bullet) {
                    this.bullet.reset(this.player.x, this.player.y + 1);
                    this.bullet.body.velocity.y = -400;
                    this.bulletTime = this.game.time.now + 200;
                }
            }

        }

        collisionHandler(bullet, veg) {
          this.bullet.kill();
          this.invader.kill();
          this.score += 20;
          this.scoreText.text = this.scoreString + this.score;
        }
    }

}