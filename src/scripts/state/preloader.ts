module Alak.State {
    export class Preloader extends Phaser.State {
        loadingBar:Entity.PreloadBar;

        preload() {
            this.loadingBar = new Entity.PreloadBar(this.game);
            this.load.image('test', 'assets/images/test.png');
            this.load.image('placeholder', 'assets/images/placeholder.png');
            this.load.image('paintpot', 'assets/images/paintpot.png');
            this.load.image('dummy-subject', 'assets/images/dummy-subject.png');
            this.load.image('brush-cursor', 'assets/images/cursor.png');
            this.load.image('brush-cursor-down', 'assets/images/cursor-down.png');
        }

        create() {
            this.loadingBar.setFillPercent(100);
            let tween = this.game.add.tween(this.loadingBar).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('game', true);
        }

        loadUpdate() {
            this.loadingBar.setFillPercent(this.load.progress);
        }
    }
}
