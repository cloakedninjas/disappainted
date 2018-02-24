module Alak.State {
    export class Preloader extends Phaser.State {
        loadingBar:Entity.PreloadBar;

        preload() {
            this.loadingBar = new Entity.PreloadBar(this.game);

            this.load.image('palette', 'assets/images/palette.png');
            this.load.image('easel-wood', 'assets/images/easel-wood.png');
            this.load.image('easel-canvas', 'assets/images/easel-canvas.png');
            this.load.image('brush-cursor', 'assets/images/cursor.png');
            this.load.image('brush-cursor-down', 'assets/images/cursor-down.png');
            this.load.image('selected-paint', 'assets/images/selected_paint.png');
            this.load.image('subject-face', 'assets/images/subject/face.png');

            for (let i = 1; i <= Entity.Subject.FACE_PERMS; i++) {
                Entity.Subject.FACE_PIECES.forEach(function (piece) {
                    let path = 'assets/images/subject/' + piece + '_' + i + '.png';
                    this.load.image('subject-' + piece + '-' + i, path);
                }, this);
            }

            for (let i = 1; i <= Entity.Subject.BODY_PERMS; i++) {
                Entity.Subject.BODY_PIECES.forEach(function (piece) {
                    let path = 'assets/images/subject/' + piece + '_' + i + '.png';
                    this.load.image('subject-' + piece + '-' + i, path);
                }, this);
            }
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
