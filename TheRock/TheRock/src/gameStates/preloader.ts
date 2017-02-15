module TheRock.Client {

    export class Preloader extends Phaser.State {
        loaderText: Phaser.Text;

        preload() {

            this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading...",
                { font: "48px Arial", fill: "#000000", align: "center" });
            this.loaderText.anchor.setTo(0.5);

            this.load.image('titlepage', './assets/ui/titlePage.png');
            this.load.image('logo', './assets/ui/gameLogo.png');
            this.load.audio('click', './assets/sounds/click.mp3', true);
            this.load.audio('start', './assets/sounds/imperial.mp3');


            this.load.atlasJSONHash('level01-sprites', './assets/sprites/level01-sprites.png', './assets/sprites/level01-sprites.json');
        }

        public music:any;
        public click:any;
        logo: Phaser.Sprite;

        create() {

            this.music = this.add.audio('start');
            this.music.play();


          var tween = this.add.tween(this.loaderText).to({ alpha: 0 }, 2000,
          Phaser.Easing.Linear.None, true);
          tween.onComplete.add(this.startMainMenu, this);
        } 
         
        startMainMenu() { this.game.state.start('MainMenu', true, false);}
   }
}