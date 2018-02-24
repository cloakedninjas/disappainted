module Alak.Entity {
    export class PaintPot extends Phaser.Sprite {
        game:Game;
        colour: string;

        constructor(game, x, y, colour) {
            super(game, x, y, 'paintpot');
            this.colour = colour;
            this.inputEnabled = true;

            this.scale.x = 0.5;
            this.scale.y = 0.5;
        }
    }
}