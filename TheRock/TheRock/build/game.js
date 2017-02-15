var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TheRock;
(function (TheRock) {
    var Client;
    (function (Client) {
        var GameEngine = (function (_super) {
            __extends(GameEngine, _super);
            function GameEngine() {
                _super.call(this, 1024, 800, Phaser.AUTO, 'content', null);
                this.state.add('Boot', Client.Boot, false);
                this.state.add('Preloader', Client.Preloader, false);
                this.state.add('MainMenu', Client.MainMenu, false);
                this.state.add('Level01', Client.Level01, false);
                this.state.start('Boot');
            }
            return GameEngine;
        }(Phaser.Game));
        Client.GameEngine = GameEngine;
    })(Client = TheRock.Client || (TheRock.Client = {}));
})(TheRock || (TheRock = {}));
window.onload = function () {
    new TheRock.Client.GameEngine();
};
var TheRock;
(function (TheRock) {
    var Client;
    (function (Client) {
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(game, x, y) {
                _super.call(this, game, x, y, 'level01-sprites', 1);
                this.anchor.setTo(0.5);
                game.add.existing(this);
                game.physics.enable(this);
                this.body.collideWorldBounds = true;
                this.body.setCircle(20);
            }
            Player.prototype.update = function () {
                this.body.velocity.x = 0;
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.body.velocity.x = -300;
                    if (this.scale.x === -1) {
                        this.scale.x = 1;
                    }
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    this.body.velocity.x = 300;
                    if (this.scale.x === 1) {
                        this.scale.x = -1;
                    }
                }
                else {
                    this.animations.frame = 0;
                }
            };
            return Player;
        }(Phaser.Sprite));
        Client.Player = Player;
    })(Client = TheRock.Client || (TheRock.Client = {}));
})(TheRock || (TheRock = {}));
var TheRock;
(function (TheRock) {
    var Client;
    (function (Client) {
        var Boot = (function (_super) {
            __extends(Boot, _super);
            function Boot() {
                _super.apply(this, arguments);
            }
            Boot.prototype.create = function () {
                this.stage.setBackgroundColor(0xFFFFFF);
                this.input.maxPointers = 1;
                this.stage.disableVisibilityChange = true;
                if (this.game.device.desktop) {
                    this.scale.pageAlignHorizontally = true;
                }
                else {
                    this.scale.minWidth = 480;
                    this.scale.minHeight = 260;
                    this.scale.maxWidth = 1024;
                    this.scale.maxHeight = 768;
                    this.scale.forceLandscape = true;
                    this.scale.pageAlignHorizontally = true;
                    this.scale.refresh();
                }
                this.game.state.start('Preloader', true, false);
            };
            return Boot;
        }(Phaser.State));
        Client.Boot = Boot;
    })(Client = TheRock.Client || (TheRock.Client = {}));
})(TheRock || (TheRock = {}));
var TheRock;
(function (TheRock) {
    var Client;
    (function (Client) {
        var Level01 = (function (_super) {
            __extends(Level01, _super);
            function Level01() {
                _super.apply(this, arguments);
                this.bulletTime = 0;
                this.score = 0;
                this.scoreString = '';
                this.i = 0;
                this.numberOfBullets = 3;
            }
            Level01.prototype.preload = function () {
                this.game.load.image('invader', 'assets/sprites/invader.png');
                this.game.load.image('bullets', 'assets/sprites/bullets.png');
                this.game.load.image('ship', 'assets/sprites/ship.png');
                this.game.load.image('kaboom', 'level01-sprites.png');
            };
            Level01.prototype.create = function () {
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.background = this.add.sprite(0, 0, 'level01-sprites', 'background');
                this.invaders = this.game.add.group();
                this.invaders.enableBody = true;
                this.invaders.immovable = true;
                this.game.physics.arcade.collide(this.invaders);
                this.player = new Client.Player(this.game, this.world.centerX, 900);
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
                this.moreInvaders();
                this.game.physics.arcade.collide(this.bullets, this.invaders);
                this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
                this.game.physics.arcade.overlap(this.player, this.invaders, this.bullets, null, this);
            };
            Level01.prototype.collectStar = function (player, invader) { this.invader.kill(); };
            Level01.prototype.moreInvaders = function () {
                for (this.i = 0; this.i < 2; this.i++) {
                    this.invader = this.invaders.create(this.i * Math.floor(Math.random() * 840), this.i * Math.floor(Math.random() * 200), 'invader');
                    this.invader.body.gravity.y = 10;
                    this.invader.body.bounce.y = 6.7 + Math.random() * 0.9;
                    this.invader.body.immovable = true;
                }
            };
            Level01.prototype.update = function () {
                this.game.physics.arcade.overlap(this.bullets, this.invaders, this.collisionHandler, null, this);
                this.game.physics.arcade.collide(this.player, this.invaders);
                if (this.fireButton.isDown) {
                    this.fireBullet();
                }
            };
            Level01.prototype.fireBullet = function () {
                if (this.game.time.now > this.bulletTime) {
                    this.bullet = this.bullets.getFirstExists(false);
                    if (this.bullet) {
                        this.bullet.reset(this.player.x, this.player.y + 1);
                        this.bullet.body.velocity.y = -400;
                        this.bulletTime = this.game.time.now + 200;
                    }
                }
            };
            Level01.prototype.collisionHandler = function (bullet, veg) {
                this.bullet.kill();
                this.invader.kill();
                this.score += 20;
                this.scoreText.text = this.scoreString + this.score;
            };
            return Level01;
        }(Phaser.State));
        Client.Level01 = Level01;
    })(Client = TheRock.Client || (TheRock.Client = {}));
})(TheRock || (TheRock = {}));
var TheRock;
(function (TheRock) {
    var Client;
    (function (Client) {
        var MainMenu = (function (_super) {
            __extends(MainMenu, _super);
            function MainMenu() {
                _super.apply(this, arguments);
            }
            MainMenu.prototype.create = function () {
                this.background = this.add.sprite(-100, 0, 'titlepage');
                this.background.alpha = 0;
                this.logo = this.add.sprite(this.world.centerX, -500, 'logo');
                this.logo.anchor.setTo(0.5);
                this.add.tween(this.background).to({ alpha: 1 }, 700, Phaser.Easing.Linear.None, true);
                this.add.tween(this.logo).to({ y: this.world.centerY, }, 2000, Phaser.Easing.Elastic.Out, true, 700);
                this.game.debug.text("Click the logo to start the game", 0, this.world.height, "red");
                this.input.onDown.addOnce(this.fadeOut, this);
            };
            MainMenu.prototype.fadeOut = function () {
                this.add.audio('click', 1, false).play();
                this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
                var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.startGame, this);
            };
            MainMenu.prototype.startGame = function () {
                this.game.state.start('Level01', true, false);
            };
            return MainMenu;
        }(Phaser.State));
        Client.MainMenu = MainMenu;
    })(Client = TheRock.Client || (TheRock.Client = {}));
})(TheRock || (TheRock = {}));
var TheRock;
(function (TheRock) {
    var Client;
    (function (Client) {
        var Preloader = (function (_super) {
            __extends(Preloader, _super);
            function Preloader() {
                _super.apply(this, arguments);
            }
            Preloader.prototype.preload = function () {
                this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading...", { font: "48px Arial", fill: "#000000", align: "center" });
                this.loaderText.anchor.setTo(0.5);
                this.load.image('titlepage', './assets/ui/titlePage.png');
                this.load.image('logo', './assets/ui/gameLogo.png');
                this.load.audio('click', './assets/sounds/click.mp3', true);
                this.load.audio('start', './assets/sounds/imperial.mp3');
                this.load.atlasJSONHash('level01-sprites', './assets/sprites/level01-sprites.png', './assets/sprites/level01-sprites.json');
            };
            Preloader.prototype.create = function () {
                this.music = this.add.audio('start');
                this.music.play();
                var tween = this.add.tween(this.loaderText).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.startMainMenu, this);
            };
            Preloader.prototype.startMainMenu = function () { this.game.state.start('MainMenu', true, false); };
            return Preloader;
        }(Phaser.State));
        Client.Preloader = Preloader;
    })(Client = TheRock.Client || (TheRock.Client = {}));
})(TheRock || (TheRock = {}));
//# sourceMappingURL=game.js.map