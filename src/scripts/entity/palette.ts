module Alak.Entity {
    export class Palette extends Phaser.Sprite {
        game:Game;

        constructor(game, x, y) {
            super(game, x, y, 'palette');
            this.inputEnabled = true;

        }
    }
}