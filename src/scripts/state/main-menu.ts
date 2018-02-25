module Alak.State {
    export class MainMenu extends Phaser.State {

        button:Phaser.Button;

        create() {
            this.add.image(0, 0, 'main-menu');

            this.button = new Phaser.Button(this.game, 100, 250, 'btn-play', function () {
                this.game.state.start('game');
            }, this, 1, 0, 2);

            this.add.existing(this.button);

        }
    }
}
