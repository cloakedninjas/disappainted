/// <reference path="../refs.d.ts" />

module Alak {
    export class Game extends Phaser.Game {

        constructor() {
            super(800, 600);

            this.state.add('preloader', State.Preloader, true);
            this.state.add('game', State.Game);
        }
    }
}

// export Game to window
var Game = Alak.Game;

