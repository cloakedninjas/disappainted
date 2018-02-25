module Alak.State {
    export class Preloader extends Phaser.State {
        loadingBar:Entity.PreloadBar;

        preload() {
            this.loadingBar = new Entity.PreloadBar(this.game);

            this.load.image('main-menu', 'assets/images/main_menu.png');

            this.load.spritesheet('btn-play', 'assets/images/play.png', 240, 243);

            this.load.image('background', 'assets/images/background.png');
            this.load.image('palette', 'assets/images/palette.png');
            this.load.image('paintpot', 'assets/images/paintpot.png');
            this.load.image('paintpot-done', 'assets/images/paintpot-done.png');
            this.load.image('easel-wood', 'assets/images/easel-wood.png');
            this.load.image('easel-canvas', 'assets/images/easel-canvas.png');
            this.load.image('brush-cursor', 'assets/images/cursor.png');
            this.load.image('brush-cursor-down', 'assets/images/cursor-down.png');
            this.load.image('selected-paint', 'assets/images/selected_paint.png');
            this.load.image('subject-face', 'assets/images/subject/face.png');

            this.load.image('title-target-painting', 'assets/images/target_painting.png');
            this.load.image('title-your-painting', 'assets/images/your_painting.png');
            this.load.image('btn-continue', 'assets/images/continue.png');
            this.load.image('btn-play-again', 'assets/images/play_again.png');
            this.load.image('title-total', 'assets/images/total_score.png');

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

            // audio
            this.load.audio('btn-click', 'assets/sfx/btn-click.mp3');
            this.load.audio('play', 'assets/sfx/play.mp3');
            this.load.audio('brushdrop', 'assets/sfx/brushdrop.mp3');
            this.load.audio('brushdip', 'assets/sfx/brushdip.mp3');
            this.load.audio('paint-start', 'assets/sfx/painting_impact.mp3');
            //this.load.audio('paint-continuous', 'assets/sfx/painting_continuous.mp3');
        }

        create() {
            this.loadingBar.setFillPercent(100);
            let tween = this.game.add.tween(this.loadingBar).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('main-menu', true);
            //this.game.state.start('end', true);
        }

        loadUpdate() {
            this.loadingBar.setFillPercent(this.load.progress);
        }
    }
}
