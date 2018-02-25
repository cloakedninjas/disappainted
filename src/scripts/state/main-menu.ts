module Alak.State {
    export class MainMenu extends Phaser.State {

        button: Phaser.Button;
        music: Phaser.Sound;
        clickAreas: any;
        links: any;

        create() {
            this.add.image(0, 0, 'main-menu');

            this.button = new Phaser.Button(this.game, 100, 250, 'btn-play', function () {
                this.game.state.start('game');
            }, this, 1, 0, 2);

            this.add.existing(this.button);

            this.music = new Phaser.Sound(this.game, 'music-menu', 1, true);
            this.music.play();

            this.game.input.onDown.add(this.handleClick, this);

            this.clickAreas = {
                dj: new PIXI.Rectangle(68, 521, 244, 23),
                al: new PIXI.Rectangle(317, 521, 181, 23),
                jk: new PIXI.Rectangle(505, 521, 235, 23),
                credits: new PIXI.Rectangle(281, 543, 235, 24)
            };

            this.links = {
                dj: 'https://twitter.com/cloakedninjas',
                al: 'https://twitter.com/treslapin',
                jk: 'https://twitter.com/thedorkulon',
                credits: 'credits.html'
            }
        }

        handleClick() {
            for (let person in this.clickAreas) {
                let clickArea:PIXI.Rectangle = this.clickAreas[person];

                if (clickArea.contains(this.game.input.activePointer.x, this.game.input.activePointer.y)) {
                    document.location.href = this.links[person];
                    break;
                }
            }
        }

        shutdown() {
            this.music.stop();
        }
    }
}
