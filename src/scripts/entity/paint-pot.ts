module Alak.Entity {
    export class PaintPot extends Phaser.Sprite {
        game:Game;

        constructor(game, x, y) {
            super(game, x, y, 'paintpot');
            this.inputEnabled = true;

            this.anchor.y = 1;

            this.events.onInputDown.add(function () {
                let gameState:State.Game = this.game.state.getCurrentState();
                this.loadTexture('paintpot-done');
                gameState.hideBrush();
                gameState.palette.inputEnabled = false;

                this.inputEnabled = false;

                this.game.canvas.classList.remove('hide-cursor');

                // play sound
                let sound = new Phaser.Sound(game, 'brushdrop');

                sound.onStop.add(function () {
                    gameState.endGame();
                });

                sound.play();
            }, this);
        }
    }
}