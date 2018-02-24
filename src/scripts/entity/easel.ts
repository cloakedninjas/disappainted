module Alak.Entity {
    export class Easel {
        game:Game;
        drawingArea: Phaser.BitmapData;

        constructor(game) {
            this.game = game;
            this.drawingArea = new Phaser.BitmapData(game, 'drawing-area', 400, 400);
        }


    }
}